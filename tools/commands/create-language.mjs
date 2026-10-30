/**
 * Scaffold a language: i18n/<lang>/ with site.json, LANGUAGE.md, a seeded glossary, textlint
 * rules, dictionaries generated from upstream, README and onboarding checklist; wire CODEOWNERS,
 * languages.json, the README table and the Firebase config.
 *
 *   pnpm create-language fr                      interactive (@clack/prompts)
 *   pnpm create-language fr --yes                defaults, no prompts (CI, scripts)
 *   Flags (all optional, each skips its prompt): --name --english-name --direction ltr|rtl
 *     --formality formal|informal|neutral --domain --repo owner/name --firebase-project
 *     --firebase-target --firebase-site --chat <url> --maintainers a,b --remove-example | --keep-example
 */
import path from 'node:path';
import * as p from '@clack/prompts';
import {command} from '../lib/cli.mjs';
import {formatRefreshResult, refreshDictionaries} from '../lib/dictionaries.mjs';
import {git} from '../lib/exec.mjs';
import {syncFirebaseConfig} from '../lib/firebase.mjs';
import {copyFile, exists, globFiles, readJson, readText, remove, writeJson, writeText} from '../lib/fs.mjs';
import {writeGlossaryRules} from '../lib/glossary.mjs';
import {DEFAULT_STRINGS, describeLanguage, isLanguageTag, languageExists, listLanguages, loadGlossary, loadSite} from '../lib/languages.mjs';
import {fail, log} from '../lib/log.mjs';
import {adevSrc, i18nDir, langDir, languagesFile, originDir, rootDir} from '../lib/paths.mjs';
import {countTerms, languageMd, languageReadme, onboardingMd, replaceBetweenMarkers} from '../lib/scaffold.mjs';

export default command({
  meta: {name: 'create-language', description: 'Scaffold i18n/<lang> and wire it into the repository'},
  args: {
    lang: {type: 'positional', description: 'BCP-47 tag: fr, pt-BR, zh-Hans…', required: true},
    yes: {type: 'boolean', alias: 'y', description: 'Accept every default; no prompts'},
    name: {type: 'string', description: 'Language name in the language itself'},
    'english-name': {type: 'string', description: 'Language name in English'},
    direction: {type: 'enum', options: ['ltr', 'rtl'], description: 'Text direction'},
    formality: {type: 'enum', options: ['formal', 'informal', 'neutral'], description: 'Register used to address the reader'},
    domain: {type: 'string', valueHint: 'host', description: 'Site host, e.g. angular.fr'},
    repo: {type: 'string', valueHint: 'owner/name', description: 'GitHub repository'},
    'firebase-project': {type: 'string', valueHint: 'id', description: 'Firebase project id'},
    'firebase-target': {type: 'string', valueHint: 'target', description: 'Firebase hosting target'},
    'firebase-site': {type: 'string', valueHint: 'site-id', description: 'Firebase hosting site id (when it differs from the project id)'},
    chat: {type: 'string', valueHint: 'url', description: 'Community chat URL'},
    maintainers: {type: 'string', valueHint: 'a,b', description: 'GitHub handles, comma-separated'},
    'remove-example': {type: 'boolean', description: 'Remove i18n/_example and the canary workflow'},
    'keep-example': {type: 'boolean', description: 'Keep the template example'},
  },
  async run({args}) {
    const lang = String(args.lang);
    if (!isLanguageTag(lang)) fail(`"${lang}" is not a BCP-47 language tag (examples: fr, pt-BR, zh-Hans)`);
    if (await languageExists(lang)) fail(`i18n/${lang} already exists`);
    if (!(await exists(adevSrc(originDir)))) fail(`origin not initialized (${originDir}). Run: pnpm bootstrap`);

    const interactive = !args.yes && process.stdin.isTTY && !p.isCI();
    const prompts = new Prompts(interactive);
    if (interactive) p.intro(`create-language ${lang}`);

    const known = describeLanguage(lang);
    const remoteUrl = await git(['remote', 'get-url', 'origin'], {cwd: rootDir, allowFailure: true});
    const remote = /github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/.exec(remoteUrl ?? '');
    const repoDefault = remote ? `${remote[1]}/${remote[2]}` : 'your-org/your-repo';

    const name = await prompts.text('Name in the language', args.name, known.name);
    const englishName = await prompts.text('English name', args['english-name'], known.englishName);
    const direction = await prompts.select('Text direction', args.direction, known.direction, [
      {value: 'ltr', label: 'ltr', hint: 'left to right'},
      {value: 'rtl', label: 'rtl', hint: 'right to left (Arabic, Hebrew, Persian…)'},
    ]);
    const formality = await prompts.select('Register used to address the reader', args.formality, 'formal', [
      {value: 'formal', label: 'formal', hint: 'vous, usted, Sie…'},
      {value: 'informal', label: 'informal', hint: 'tu, du…'},
      {value: 'neutral', label: 'neutral', hint: 'no second person, or the language has no distinction'},
    ]);
    const domain = await prompts.text('Site domain (host only)', args.domain, `angular-${lang.toLowerCase()}.example.invalid`, {
      validate: (v) => (/^[a-z0-9.-]+$/i.test(v) ? undefined : 'host name only, no scheme or path'),
    });
    const repo = await prompts.text('GitHub repository (owner/name)', args.repo, repoDefault, {
      validate: (v) => (/^[^/\s]+\/[^/\s]+$/.test(v) ? undefined : 'expected owner/name'),
    });
    const [owner, repoName] = repo.split('/');
    const firebaseProject = await prompts.text('Firebase project id', args['firebase-project'], repoName);
    const firebaseTarget = await prompts.text('Firebase hosting target', args['firebase-target'], `docs-${lang.toLowerCase()}`);
    const firebaseSite = args['firebase-site'] ? String(args['firebase-site']) : undefined;
    const chat = await prompts.text('Community chat URL (optional)', args.chat, '');
    const maintainersRaw = await prompts.text('Maintainers, GitHub handles comma-separated (optional)', args.maintainers, '');
    const maintainers = maintainersRaw
      .split(',')
      .map((s) => s.trim().replace(/^@/, ''))
      .filter(Boolean);
    if (!owner || !repoName) fail('repository must be owner/name');

    const dir = langDir(lang);
    const site = {
      $schema: '../../tools/site.schema.json',
      lang,
      name,
      englishName,
      direction,
      domain,
      upstreamSite: 'https://angular.dev',
      repo: {owner, name: repoName, branch: 'main'},
      firebase: {projectId: firebaseProject, target: firebaseTarget, ...(firebaseSite ? {site: firebaseSite} : {})},
      search: {provider: 'none'},
      analytics: {provider: 'none'},
      community: {chat, maintainers},
      notice: 'Community translation of angular.dev, not affiliated with Google.',
      strings: {...DEFAULT_STRINGS},
    };

    log.step('scaffold files');
    await writeJson(path.join(dir, 'site.json'), site);
    log.info('site.json');

    // Language rules and glossary: the French example is reused for fr; others start from the template.
    const example = path.join(i18nDir, '_example');
    const reuseExample = lang.toLowerCase().startsWith('fr') && (await exists(path.join(example, 'LANGUAGE.md')));
    if (reuseExample) {
      await writeText(path.join(dir, 'LANGUAGE.md'), await readText(path.join(example, 'LANGUAGE.md')));
      log.info('LANGUAGE.md (from the French example)');
      // The example's translated pages (with their snapshots) are a head start for a French site.
      const pages = await globFiles(['**/*', '!**/.gitkeep'], {cwd: path.join(example, 'src')});
      for (const rel of pages) await copyFile(path.join(example, 'src', rel), path.join(dir, 'src', rel));
      if (pages.length) log.info(`src/: ${pages.length} file(s) from the French example (translated pages and their snapshots)`);
    } else {
      await writeText(path.join(dir, 'LANGUAGE.md'), languageMd({lang, name, direction, formality}));
      log.info('LANGUAGE.md (template with TODOs)');
    }

    log.info('counting technical terms in the current docs for the glossary seed…');
    const counted = await countTerms(originDir);
    const seeded = reuseExample ? await loadGlossary('_example').catch(() => []) : [];
    const have = new Set(seeded.map((g) => g.term.toLowerCase()));
    const glossary = [
      ...seeded.map(({term, translation, keep, forbidden, note}) => ({
        term,
        ...(translation ? {translation} : {}),
        ...(keep ? {keep} : {}),
        ...(forbidden.length ? {forbidden} : {}),
        ...(note ? {note} : {}),
      })),
      ...counted.filter(([t]) => !have.has(t)).map(([term, count]) => ({term, translation: '', note: `seen ${count}× in the docs; translate or set keep: true`})),
    ];
    await writeJson(path.join(dir, 'glossary.json'), glossary);
    log.info(`glossary.json (${glossary.length} entries, ${glossary.filter((g) => !g.translation && !g.keep).length} to fill in)`);
    const rules = await writeGlossaryRules(lang);
    log.info(`prh.yml and .textlintrc.json (${rules.rules} rule(s) from the glossary's forbidden renderings)`);

    const loaded = await loadSite(lang);
    await writeText(path.join(dir, 'README.md'), languageReadme(loaded));
    await writeText(path.join(dir, 'ONBOARDING.md'), onboardingMd(loaded));
    await writeText(path.join(dir, 'src', '.gitkeep'), '');
    log.info('README.md, ONBOARDING.md, src/');

    log.step('dictionaries from upstream');
    if (reuseExample) {
      // The example's translated labels, UI strings and pipeline strings are a head start; the
      // index.html pairs are site-specific and regenerated below from site.json.
      let reused = 0;
      for (const name of ['navigation.json', 'ui.json', 'pipeline.json']) {
        const from = path.join(example, 'dictionaries', name);
        if (!(await exists(from))) continue;
        await copyFile(from, path.join(dir, 'dictionaries', name));
        reused++;
      }
      if (reused) log.info(`dictionaries/: ${reused} file(s) seeded from the French example (translations kept, new upstream strings added below)`);
    }
    const refreshed = await refreshDictionaries(lang, {init: true});
    log.info(formatRefreshResult(lang, refreshed));
    if (reuseExample) await reuseExampleIndexHtmlPairs(example, dir);

    log.step('wire the language in');
    const langs = (await exists(languagesFile)) ? await readJson(languagesFile) : [];
    if (!langs.includes(lang)) langs.push(lang);
    await writeJson(languagesFile, langs.sort());
    log.info(`languages.json: ${langs.join(', ')}`);

    const owners = maintainers.length ? maintainers.map((h) => `@${h}`).join(' ') : `@${owner}/${repoName}-${lang.toLowerCase()}`;
    const codeowners = path.join(rootDir, 'CODEOWNERS');
    await updateMarked(codeowners, 'languages', (body) => `${body}${body ? '\n' : ''}/i18n/${lang}/   ${owners}`, 'hash');
    if (await exists(codeowners)) {
      // The template's own maintainers team does not exist in this repository; GitHub flags
      // unknown owners. The first language's maintainers own the tooling until someone edits it.
      const text = await readText(codeowners);
      const next = text.replace(/@openng-org\/angular-docs-rosetta-maintainers\b/g, owners);
      if (next !== text) await writeText(codeowners, next);
    }
    await updateMarked(
      path.join(rootDir, 'README.md'),
      'languages',
      (body) => {
        const rows = body
          .split('\n')
          .filter((l) => l.startsWith('|') && !/^\|\s*Language\s*\|/.test(l) && !/^\|\s*---/.test(l) && !l.includes('_none yet'));
        rows.push(`| ${name} (\`${lang}\`) | https://${domain} | ${maintainers.map((h) => `@${h}`).join(', ')} |`);
        return ['| Language | Site | Maintainers |', '| --- | --- | --- |', ...rows].join('\n');
      },
      'html',
    );
    log.info('CODEOWNERS and README table updated');

    try {
      await syncFirebaseConfig();
      log.info('firebase.json and .firebaserc regenerated');
    } catch (e) {
      log.warn(`firebase-config failed (run it later): ${e.message}`);
    }

    // Template-only material.
    const all = await listLanguages({includeExample: true});
    if (all.includes('_example') && lang !== '_example') {
      let removeExample = Boolean(args['remove-example']);
      if (!removeExample && !args['keep-example']) {
        removeExample = await prompts.confirm('Remove the template example (i18n/_example and the canary workflow)?', false);
      }
      if (removeExample) {
        await remove(example);
        await remove(path.join(rootDir, '.github', 'workflows', 'template-canary.yml'));
        log.info('removed i18n/_example and .github/workflows/template-canary.yml');
      }
    }

    const next = [
      `1. Review i18n/${lang}/LANGUAGE.md and fill the glossary.`,
      `2. Translate the dictionaries and site.json "strings" (values are English until you change them), then: pnpm check ${lang}`,
      `3. Pages: pnpm status ${lang} lists what is untranslated; pnpm status ${lang} --init <path> starts one (docs/translating.md)`,
      `4. Settings to flip before deploying: i18n/${lang}/ONBOARDING.md`,
      `5. git add -A && git commit -m "i18n(${lang}): scaffold language"`,
    ];
    if (interactive) {
      p.note(next.join('\n'), 'Next');
      p.outro(`i18n/${lang} is ready`);
    } else {
      log.step('done');
      log.ok(`i18n/${lang} is ready. Next:`);
      for (const line of next) log.info(`  ${line}`);
    }
  },
});

/**
 * The generated index.html pairs carry the new site's URLs; the example's translated title and
 * description (pairs whose `replace` is neither English nor site-specific) are worth keeping.
 */
async function reuseExampleIndexHtmlPairs(example, dir) {
  const exampleFile = path.join(example, 'dictionaries', 'index-html.json');
  const file = path.join(dir, 'dictionaries', 'index-html.json');
  if (!(await exists(exampleFile)) || !(await exists(file))) return;
  const exampleSite = await loadSite('_example').catch(() => null);
  const translated = new Map(
    (await readJson(exampleFile))
      .filter((p) => p.find && p.replace && p.replace !== p.find && !(exampleSite && p.replace.includes(exampleSite.domain)))
      .map((p) => [p.find, p.replace]),
  );
  if (!translated.size) return;
  let reused = 0;
  const pairs = (await readJson(file)).map((p) => {
    if (!translated.has(p.find) || p.replace !== p.find) return p;
    reused++;
    return {...p, replace: translated.get(p.find)};
  });
  if (reused) {
    await writeJson(file, pairs);
    log.info(`index-html.json: ${reused} translated pair(s) reused from the French example`);
  }
}

/** Prompts that fall back to flags and defaults; Ctrl+C aborts cleanly. */
class Prompts {
  constructor(interactive) {
    this.interactive = interactive;
  }

  guard(value) {
    if (p.isCancel(value)) {
      p.cancel('Aborted; nothing was written.');
      process.exit(130);
    }
    return value;
  }

  async text(message, flag, def, {validate} = {}) {
    if (flag !== undefined) return String(flag);
    if (!this.interactive) return def;
    const value = this.guard(await p.text({message, placeholder: def || undefined, defaultValue: def, validate: (v) => (v ? validate?.(v) : undefined)}));
    return String(value ?? def).trim();
  }

  async select(message, flag, def, options) {
    if (flag !== undefined) return String(flag);
    if (!this.interactive) return def;
    return this.guard(await p.select({message, options, initialValue: def}));
  }

  async confirm(message, def) {
    if (!this.interactive) return def;
    return this.guard(await p.confirm({message, initialValue: def}));
  }
}

async function updateMarked(file, key, fn, comment) {
  if (!(await exists(file))) return;
  const text = await readText(file);
  const [open, close] = comment === 'html' ? [`<!-- ${key}:start -->`, `<!-- ${key}:end -->`] : [`# ${key}:start`, `# ${key}:end`];
  const s = text.indexOf(open);
  const e = text.indexOf(close);
  if (s === -1 || e === -1) return;
  const body = text.slice(s + open.length, e).replace(/^\n|\n$/g, '');
  const next = replaceBetweenMarkers(text, key, fn(body), {comment});
  if (next) await writeText(file, next);
}
