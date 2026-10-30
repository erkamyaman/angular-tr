/**
 * Steps shared by `pnpm build` and `pnpm start`: worktree, patches, overlay, dictionaries,
 * status report, pnpm in the build directory, post-processing of the output.
 */
import {appendFile, chmod, copyFile as fsCopyFile, cp, lstat, readFile, readdir, realpath, stat, unlink} from 'node:fs/promises';
import path from 'node:path';
import {applyIndexHtmlPairs, applyNavLabels, applyPipelinePairs, applyTemplateStrings} from './adev.mjs';
import {git, run} from './exec.mjs';
import {copyFile, exists, globFiles, readText, writeJson, writeText} from './fs.mjs';
import {listLanguages, loadDictionaries, loadSite} from './languages.mjs';
import {log} from './log.mjs';
import {currentOriginSha} from './origin.mjs';
import {INDEX_HTML, NAVIGATION_FILE, adevDir, adevSrc, buildDir, langSrcDir, originDir, patchesDir, rootDir} from './paths.mjs';
import {environmentSource} from './search.mjs';
import {listOverlayFiles, stripMarker} from './snapshots.mjs';
import {STATES, computeStatus} from './status-core.mjs';

const TEXT_EXT = new Set(['.md', '.html', '.ts', '.mts', '.js', '.mjs', '.json', '.txt', '.scss', '.css']);

/** Create or reset build/<lang> as a detached git worktree of origin at the pinned commit. */
export async function prepareWorktree(lang) {
  if (process.env.ROSETTA_ORIGIN) {
    throw new Error('pnpm build / pnpm start need the origin/ submodule (unset ROSETTA_ORIGIN).');
  }
  const sha = await currentOriginSha();
  if (!sha) throw new Error('origin not initialized. Run: pnpm bootstrap');
  const dir = buildDir(lang);
  log.step(`build directory ${path.relative(rootDir, dir)} @ ${sha.slice(0, 10)}`);
  if (await exists(path.join(dir, '.git'))) {
    await run('git', ['checkout', '--detach', '--quiet', sha], {cwd: dir});
    await run('git', ['reset', '--hard', '--quiet'], {cwd: dir});
    await run('git', ['clean', '-fdq'], {cwd: dir});
  } else {
    await run('git', ['worktree', 'prune'], {cwd: originDir});
    await run('git', ['worktree', 'add', '--detach', dir, sha], {cwd: originDir});
  }
  // Bazel reads .bazelrc.user from its own workspace root; propagate ours and the personal one.
  const dest = path.join(dir, '.bazelrc.user');
  const ours = path.join(rootDir, '.bazelrc');
  if (await exists(ours)) await copyFile(ours, dest);
  const personal = path.join(rootDir, '.bazelrc.user');
  if (await exists(personal)) await appendFile(dest, '\n' + (await readText(personal)));
  return {dir, sha};
}

/**
 * Everything between the worktree and the Bazel build, in the only order that works: patches
 * first, on pristine upstream (exactly what CI's `git apply --check` verifies), then the overlay,
 * then the dictionaries (they rewrite text the patches' context lines contain, so they must come
 * after), then the generated files and the status report. An overlay file wins over a patch
 * that touches the same file, so languages do not overlay patched files.
 */
export async function prepareBuild(lang, dir, {lenient = false, skipPatches = false} = {}) {
  log.step('patches, overlay, dictionaries, generated files');
  await applyPatches(dir, {skip: skipPatches});
  await applyOverlay(lang, dir);
  await applyDictionaries(lang, dir, {lenient});
  await applyEnvironment(lang, dir);
  await writeRosettaConfig(lang, dir);
  await writeStatusReport(lang, dir);
}

/** Copy i18n/<lang>/src/** (minus snapshots) over build/<lang>/adev/src/**, stripping markers. */
export async function applyOverlay(lang, dir) {
  const files = await listOverlayFiles(lang);
  const src = langSrcDir(lang);
  const dest = adevSrc(dir);
  for (const rel of files) {
    const from = path.join(src, rel);
    const to = path.join(dest, rel);
    if (TEXT_EXT.has(path.extname(rel).toLowerCase())) {
      await writeText(to, stripMarker(await readText(from)));
    } else {
      await copyFile(from, to);
    }
  }
  log.info(`overlay: ${files.length} file(s) copied`);
  return files.length;
}

/** Apply the four dictionaries to the build directory. Throws when an index.html or pipeline pair is dead. */
export async function applyDictionaries(lang, dir, {lenient = false} = {}) {
  const dict = await loadDictionaries(lang);
  const src = adevSrc(dir);
  const base = adevDir(dir);

  const navPath = path.join(src, NAVIGATION_FILE);
  if (await exists(navPath)) {
    const {source, missing, applied} = applyNavLabels(await readText(navPath), dict.navigation);
    await writeText(navPath, source);
    log.info(`navigation: ${applied} label(s) translated${missing.length ? `, ${missing.length} without entry (left in English)` : ''}`);
  }

  let uiApplied = 0;
  let uiMissing = 0;
  for (const [rel, entries] of Object.entries(dict.ui)) {
    const file = path.join(base, rel);
    if (!(await exists(file))) continue;
    const {html, missing, applied} = applyTemplateStrings(await readText(file), entries);
    await writeText(file, html);
    uiApplied += applied;
    uiMissing += missing.length;
  }
  log.info(`ui strings: ${uiApplied} replaced${uiMissing ? `, ${uiMissing} without entry (left in English)` : ''}`);

  const indexPath = path.join(src, INDEX_HTML);
  const {html, missing} = applyIndexHtmlPairs(await readText(indexPath), dict.indexHtml);
  await writeText(indexPath, html);
  if (missing.length) {
    const msg = `index.html: ${missing.length} pair(s) no longer match upstream:\n  ${missing.join('\n  ')}`;
    if (!lenient) throw new Error(msg + '\nFix i18n/' + lang + '/dictionaries/index-html.json (or pass --lenient).');
    log.warn(msg);
  } else {
    log.info(`index.html: ${dict.indexHtml.length} pair(s) applied`);
  }

  const pipeline = await applyPipelinePairs(dir, dict.pipeline);
  if (pipeline.missing.length) {
    const msg = `pipeline strings: ${pipeline.missing.length} pair(s) no longer match upstream:\n  ${pipeline.missing.map((m) => `${m.file}: ${JSON.stringify(m.find)}`).join('\n  ')}`;
    if (!lenient) throw new Error(msg + '\nFix i18n/' + lang + '/dictionaries/pipeline.json (or pass --lenient).');
    log.warn(msg);
  } else {
    log.info(`pipeline strings: ${pipeline.applied} pair(s) applied`);
  }
}

/** adev/src/app/environment.ts, relative to a checkout. */
export const ENVIRONMENT_FILE = path.join('adev', 'src', 'app', 'environment.ts');

/**
 * Rewrite adev's environment.ts from site.json: the site's own Algolia index when search is
 * configured (upstream's English index otherwise), the site's GA4 id or none. Upstream's
 * analytics id never ships in a community build.
 */
export async function applyEnvironment(lang, dir) {
  const site = await loadSite(lang);
  const file = path.join(dir, ENVIRONMENT_FILE);
  if (!(await exists(file))) throw new Error(`${ENVIRONMENT_FILE} not found in ${dir}; upstream moved it, update tools/lib/search.mjs`);
  await writeText(file, environmentSource(await readText(file), site));
  const search = site.search.provider === 'none' ? "upstream's English index (search.provider: none)" : `${site.search.provider} index ${site.search.indexName}`;
  const analytics = site.analytics.provider === 'ga4' ? `GA4 ${site.analytics.id}` : 'no analytics';
  log.info(`environment.ts: ${search}, ${analytics}`);
}

/** git-apply every patch in tools/adev-patches (checked first, so a dead patch fails early). */
export async function applyPatches(dir, {skip = false} = {}) {
  if (skip) {
    log.warn('patches skipped (--skip-patches): no language switcher, no banners in this build');
    return 0;
  }
  if (!(await exists(patchesDir))) return 0;
  const patches = await globFiles(['*.patch'], {cwd: patchesDir});
  for (const p of patches) {
    const file = path.join(patchesDir, p);
    const check = await run('git', ['apply', '--check', file], {cwd: dir, capture: true, allowFailure: true});
    if (check.code !== 0) {
      throw new Error(`patch ${p} no longer applies to upstream:\n${check.stderr}\nSee docs/maintenance.md#patches`);
    }
    await run('git', ['apply', file], {cwd: dir});
  }
  log.info(`patches: ${patches.length} applied`);
  return patches.length;
}

/**
 * Write the status report into the app's static assets so the site can show banners.
 * Every in-scope page is listed (untranslated ones too), keyed like DocContent ids without
 * extension: `guide/signals/overview`.
 */
export async function writeStatusReport(lang, dir) {
  const status = await computeStatus(lang, {withClasses: false});
  const compact = {
    lang,
    origin: status.origin.sha,
    generatedAt: status.generatedAt,
    totals: status.totals,
    pages: Object.fromEntries(
      status.files
        .filter((f) => !f.overlay && f.state !== STATES.removed && f.state !== STATES.orphanSnapshot)
        .map((f) => [f.rel.replace(/^content\//, '').replace(/\.md$/, ''), f.state]),
    ),
  };
  const out = path.join(adevSrc(dir), 'assets', 'others', 'translation-status.json');
  await writeJson(out, compact);
  log.info(`status report: ${status.totals.translated}/${status.totals.inScope} translated, ${status.totals[STATES.outdated]} outdated`);
  return compact;
}

/**
 * Generate adev/src/app/rosetta/rosetta-config.ts from site.json, for the components added by
 * tools/adev-patches/010-rosetta-ui.patch (language switcher, banners). Harmless when no patch
 * imports it.
 */
export async function writeRosettaConfig(lang, dir) {
  const site = await loadSite(lang);
  const others = [];
  for (const other of await listLanguages()) {
    try {
      const s = await loadSite(other);
      others.push({lang: s.lang, name: s.name, url: s.siteUrl});
    } catch {
      // a half-configured sibling language must not break this build
    }
  }
  if (!others.some((o) => o.lang === site.lang)) others.unshift({lang: site.lang, name: site.name, url: site.siteUrl});
  const config = {
    lang: site.lang,
    name: site.name,
    direction: site.direction,
    siteUrl: site.siteUrl,
    upstreamSite: site.upstreamSite,
    repoUrl: site.repoUrl,
    issueUrl: `${site.repoUrl}/issues/new?template=translation-error.yml`,
    statusUrl: 'assets/others/translation-status.json',
    notice: site.notice,
    languages: others,
    strings: site.strings,
  };
  const file = path.join(adevSrc(dir), 'app', 'rosetta', 'rosetta-config.ts');
  await writeText(
    file,
    `// Generated by angular-docs-rosetta (tools/lib/build-steps.mjs) from i18n/${lang}/site.json. Do not edit.\n` +
      `export const ROSETTA = ${JSON.stringify(config, null, 2)} as const;\n`,
  );
  log.info(`rosetta-config.ts written for ${site.lang} (${others.length} language(s) in the switcher)`);
}

/**
 * Run pnpm inside the build directory. pnpm switches itself to the version upstream pins in its
 * `packageManager` field (manage-package-manager-versions, on by default since pnpm 10), so the
 * pnpm installed for this repository is enough; no corepack involved (Node 25+ no longer ships it).
 */
export async function pnpmIn(dir, args) {
  return run('pnpm', args, {cwd: dir});
}

/**
 * Say which Node runs what. Bazel downloads its own Node toolchain (`node_version` in upstream's
 * MODULE.bazel), so the build actions never depend on the host Node; the host Node only runs pnpm
 * and bazelisk. Upstream's .nvmrc is what upstream's own developers use; it is reported, not required.
 */
export async function checkNodeVersion(dir) {
  const host = process.versions.node;
  const nvmrc = path.join(dir, '.nvmrc');
  const theirs = (await exists(nvmrc)) ? (await readText(nvmrc)).trim() : null;
  const moduleBazel = path.join(dir, 'MODULE.bazel');
  const bazelNode = (await exists(moduleBazel)) ? /node_version\s*=\s*"([^"]+)"/.exec(await readText(moduleBazel))?.[1] : null;
  log.info(
    `Node ${host} runs pnpm and bazelisk; Bazel builds with its own Node${bazelNode ? ` ${bazelNode}` : ''} (MODULE.bazel)` +
      (theirs && theirs.split('.')[0] !== host.split('.')[0] ? `; upstream's developers use ${theirs} (origin/.nvmrc), the fallback if upstream's pnpm install ever refuses this host` : ''),
  );
}

export const OUTPUT_REL = path.join('dist', 'bin', 'adev', 'dist', 'browser');

/**
 * Bazel writes its outputs read-only (files 0444, directories 0555), and parts of the output tree
 * (assets/content, for example) are symlinks into other read-only Bazel outputs. Post-processing
 * edits the tree in place, so: replace every symlink with a real copy of its target (Bazel's own
 * outputs stay untouched), then give the owner write access to every file and directory.
 * Dangling symlinks are left as they are.
 */
export async function makeWritable(dir) {
  let count = 0;
  const walk = async (p) => {
    let st = await lstat(p);
    if (st.isSymbolicLink()) {
      let target;
      try {
        target = await realpath(p);
      } catch {
        return;
      }
      const tst = await stat(target);
      await unlink(p);
      if (tst.isDirectory()) await cp(target, p, {recursive: true, dereference: true});
      else await fsCopyFile(target, p);
      count++;
      st = await lstat(p);
    }
    const mode = st.mode & 0o7777;
    const want = st.isDirectory() ? mode | 0o700 : mode | 0o200;
    if (want !== mode) {
      await chmod(p, want);
      count++;
    }
    if (st.isDirectory()) for (const name of await readdir(p)) await walk(path.join(p, name));
  };
  await walk(dir);
  return count;
}

/** Rewrite edit links, add canonical + hreflang per page, write sitemap.xml and robots.txt. */
export async function postProcess(lang, dir) {
  const site = await loadSite(lang);
  const out = path.join(dir, OUTPUT_REL);
  if (!(await exists(out))) throw new Error(`build output not found at ${out}`);
  log.step('post-process output');
  const unlocked = await makeWritable(out);
  if (unlocked) log.info(`made ${unlocked} read-only Bazel output entr${unlocked === 1 ? 'y' : 'ies'} writable`);

  const editFrom = ['https://github.com/angular/angular/edit/main/adev/src/content/', 'https://github.com/angular/angular/blob/main/adev/src/content/'];
  const editTo = `${site.repoUrl}/edit/${site.repo.branch}/i18n/${lang}/src/content/`;
  let rewritten = 0;
  for (const rel of await globFiles(['**/*.html', '**/*.js'], {cwd: out})) {
    const file = path.join(out, rel);
    const text = await readFile(file, 'utf8');
    let next = text;
    for (const f of editFrom) next = next.split(f).join(editTo);
    if (rel.endsWith('index.html')) next = injectSeo(next, rel, site, lang);
    if (next !== text) {
      await writeText(file, next);
      rewritten++;
    }
  }
  log.info(`edit links and SEO tags: ${rewritten} file(s) rewritten`);

  const pages = (await globFiles(['**/index.html'], {cwd: out}))
    .map((p) => p.replace(/index\.html$/, ''))
    .filter((r) => !/^404\/?$/.test(r));
  const sitemap = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    .concat(pages.map((r) => `  <url><loc>${site.siteUrl}/${r}</loc></url>`))
    .concat(['</urlset>', ''])
    .join('\n');
  await writeText(path.join(out, 'sitemap.xml'), sitemap);
  const robotsFile = path.join(out, 'robots.txt');
  const robots = (await exists(robotsFile)) ? await readText(robotsFile) : 'User-agent: *\nAllow: /\n';
  if (!/^Sitemap:/m.test(robots)) await writeText(robotsFile, robots.trimEnd() + `\nSitemap: ${site.siteUrl}/sitemap.xml\n`);
  log.info(`sitemap: ${pages.length} URL(s)`);
  return {out, pages: pages.length};
}

function injectSeo(html, rel, site, lang) {
  const route = rel.replace(/index\.html$/, '').replace(/\/$/, '');
  const here = route ? `${site.siteUrl}/${route}` : `${site.siteUrl}/`;
  const upstream = route ? `${site.upstreamSite}/${route}` : `${site.upstreamSite}/`;
  const tags =
    `<link rel="canonical" href="${here}" />` +
    `<link rel="alternate" hreflang="${site.lang}" href="${here}" />` +
    `<link rel="alternate" hreflang="en" href="${upstream}" />` +
    `<link rel="alternate" hreflang="x-default" href="${upstream}" />`;
  const withoutCanonical = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, '');
  if (withoutCanonical.includes('</head>')) return withoutCanonical.replace('</head>', `${tags}</head>`);
  return html;
}

export async function gitShort(dir) {
  return (await git(['rev-parse', '--short', 'HEAD'], {cwd: dir, allowFailure: true})) || '?';
}
