/**
 * Translation status of a language against the current origin.
 *
 *   pnpm status <lang>                 summary + lists (terminal)
 *   pnpm status <lang> --md            Markdown report for the sync PR body
 *   pnpm status <lang> --json          machine-readable (same data as pnpm report, without dates)
 *   pnpm status <lang> --diff <rel>    English diff for an outdated file (what to retranslate)
 *   pnpm status <lang> --init <rel>    start a translation: snapshot + marked copy to translate
 *   pnpm status <lang> --mark <rel>    set the marker of a translated file to the current snapshot
 *   pnpm status <lang> --apply-mechanical <rel>|all
 *                                      apply a class-a change (code, links, whitespace) to the translation
 *   --quiet                            summary only
 * <rel> is relative to adev/src, e.g. content/guide/signals/overview.md
 */
import path from 'node:path';
import pc from 'picocolors';
import {command, langArg, resolveLang} from '../lib/cli.mjs';
import {applyMechanicalChange, formatDiff} from '../lib/diff.mjs';
import {exists, readText} from '../lib/fs.mjs';
import {fail, log} from '../lib/log.mjs';
import {adevSrc, langSrcDir, originDir} from '../lib/paths.mjs';
import {blobHash, copySnapshot, normalizeNewlines, readMarkerOf, snapshotOf, stripMarker, writeMarked} from '../lib/snapshots.mjs';
import {STATES, blobContent, computeStatus} from '../lib/status-core.mjs';

export default command({
  meta: {name: 'status', description: 'Translation status against the current origin; start, mark and update pages'},
  args: {
    lang: langArg,
    md: {type: 'boolean', description: 'Markdown report (sync PR body)'},
    json: {type: 'boolean', description: 'JSON output'},
    quiet: {type: 'boolean', description: 'Summary only'},
    diff: {type: 'string', valueHint: 'rel', description: 'English diff of an outdated file: <rel> relative to adev/src'},
    init: {type: 'string', valueHint: 'rel', description: 'Start translating <rel>: copy the snapshot and set the marker'},
    force: {type: 'boolean', description: 'With --init, overwrite an existing translation'},
    mark: {type: 'string', valueHint: 'rel', description: 'Set the marker of <rel> to its current snapshot'},
    'apply-mechanical': {type: 'string', valueHint: 'rel|all', description: 'Apply a class-a English change to <rel>, or to `all` class-a files'},
  },
  async run({args}) {
    const lang = await resolveLang(args);
    const ctx = {lang, src: langSrcDir(lang), args};
    if (args.init) await init(ctx, String(args.init));
    else if (args.mark) await mark(ctx, String(args.mark));
    else if (args.diff) await showDiff(ctx, String(args.diff));
    else if (args['apply-mechanical']) await applyMechanical(ctx, String(args['apply-mechanical']));
    else await report(ctx);
  },
});

async function statusOrFail(lang) {
  return computeStatus(lang).catch((e) => fail(e.message));
}

async function applyMechanical({lang, src}, target) {
  let rels = [target];
  if (target === 'all') {
    const status = await statusOrFail(lang);
    rels = status.files.filter((f) => f.state === STATES.outdated && f.class === 'a').map((f) => f.rel);
    if (!rels.length) {
      log.ok('no outdated file of class a');
      return;
    }
  }
  let done = 0;
  for (const rel of rels) {
    const translated = path.join(src, rel);
    const snapshot = snapshotOf(translated);
    if (!(await exists(translated)) || !(await exists(snapshot))) {
      log.error(`${rel}: need both the translation and its snapshot`);
      continue;
    }
    const current = await readText(translated);
    const marker = await readMarkerOf(translated, current);
    const newEnglish = await readText(snapshot);
    if (!marker) {
      log.error(`${rel}: no source marker`);
      continue;
    }
    if (marker === blobHash(newEnglish)) {
      log.dim(`${rel}: already up to date`);
      continue;
    }
    const old = await blobContent(marker);
    if (old === null) {
      log.error(`${rel}: the English it was translated from (${marker.slice(0, 10)}) is not in this repository's history`);
      continue;
    }
    try {
      const lines = applyMechanicalChange(stripMarker(old), stripMarker(newEnglish), stripMarker(current));
      await writeMarked(translated, lines.join('\n'), blobHash(newEnglish));
      log.ok(`${rel}: applied, marker updated`);
      done++;
    } catch (e) {
      log.warn(`${rel}: not applied (${e.message})`);
    }
  }
  if (done) log.info(`run: pnpm check ${lang}`);
}

async function report({lang, args}) {
  const status = await statusOrFail(lang);
  if (args.json) console.log(JSON.stringify(status, null, 2));
  else if (args.md) console.log(toMarkdown(status));
  else printTerminal(lang, status, {quiet: Boolean(args.quiet)});
}

function byState(status, state) {
  return status.files.filter((f) => f.state === state);
}

function printTerminal(lang, status, {quiet}) {
  const t = status.totals;
  console.log(pc.bold(`Language ${status.lang} against origin ${status.origin.sha?.slice(0, 10) ?? '?'}`));
  console.log(
    `  translated ${t.translated}/${t.inScope} (${t.coverage} %)  ` +
      `${pc.green(`up to date ${t[STATES.upToDate]}`)}  ${pc.yellow(`outdated ${t[STATES.outdated]}`)}  ` +
      `${pc.yellow(`stale snapshot ${t[STATES.staleSnapshot]}`)}  untranslated ${t[STATES.untranslated]}  ` +
      `${pc.red(`removed ${t[STATES.removed]}`)}  ${pc.red(`missing snapshot ${t[STATES.missingSnapshot]}`)}  orphan snapshot ${t[STATES.orphanSnapshot]}`,
  );
  const d = status.dictionaries;
  console.log(
    `  dictionaries: navigation ${d.navigation.translated}/${d.navigation.total} translated, ${d.navigation.missing.length} missing` +
      ` | ui ${d.ui.translated}/${d.ui.total} translated, ${Object.values(d.ui.missing).flat().length} missing` +
      ` | index.html ${d.indexHtml.total} pairs, ${d.indexHtml.missing.length} not matching` +
      ` | pipeline ${d.pipeline.translated}/${d.pipeline.total} translated, ${d.pipeline.missing.length} not matching`,
  );
  if (quiet) return;

  const section = (title, items, fmt) => {
    if (!items.length) return;
    console.log(pc.bold(`\n${title} (${items.length})`));
    for (const f of items) console.log(`  ${fmt(f)}`);
  };
  const cls = (f) => (f.class ? ` [${f.class}${f.added !== undefined ? ` +${f.added} -${f.removed}` : ''}]` : '');
  section('Stale snapshots: run pnpm update-origin', byState(status, STATES.staleSnapshot), (f) => `${f.rel}${cls(f)}`);
  section('Outdated: retranslate the changed passages', byState(status, STATES.outdated), (f) => `${f.rel}${cls(f)}`);
  section('Missing snapshot: add <name>.en.<ext> or the next sync overwrites the translation', byState(status, STATES.missingSnapshot), (f) => f.rel);
  section('Removed upstream: move (rename) or delete the pair', byState(status, STATES.removed), (f) => f.rel);
  section('Orphan snapshot: no translation next to it', byState(status, STATES.orphanSnapshot), (f) => f.rel);
  section('Untranslated', byState(status, STATES.untranslated), (f) => f.rel);
  if (d.navigation.missing.length) {
    console.log(pc.bold(`\nNavigation labels without dictionary entry (${d.navigation.missing.length}): run pnpm dictionaries ${lang}`));
    for (const l of d.navigation.missing.slice(0, 20)) console.log(`  ${l}`);
    if (d.navigation.missing.length > 20) console.log(`  … ${d.navigation.missing.length - 20} more`);
  }
  if (d.indexHtml.missing.length) {
    console.log(pc.bold(pc.red(`\nindex.html pairs that no longer match upstream (${d.indexHtml.missing.length}):`)));
    for (const m of d.indexHtml.missing) console.log(`  ${m}`);
  }
  if (d.pipeline.missing.length) {
    console.log(pc.bold(pc.red(`\npipeline pairs that no longer match upstream (${d.pipeline.missing.length}): fix "find" in dictionaries/pipeline.json`)));
    for (const m of d.pipeline.missing) console.log(`  ${m.file}: ${JSON.stringify(m.find)}`);
  }
}

function toMarkdown(status) {
  const t = status.totals;
  const d = status.dictionaries;
  const lines = [];
  lines.push(`### Translation status: \`${status.lang}\` @ origin \`${status.origin.sha?.slice(0, 10) ?? '?'}\``);
  lines.push('');
  lines.push(`Coverage **${t.translated}/${t.inScope}** (${t.coverage} %) · up to date ${t[STATES.upToDate]} · outdated ${t[STATES.outdated]} · stale snapshots ${t[STATES.staleSnapshot]} · untranslated ${t[STATES.untranslated]} · removed ${t[STATES.removed]}`);
  lines.push('');
  lines.push(`Dictionaries: navigation ${d.navigation.translated}/${d.navigation.total}, ${d.navigation.missing.length} new · UI ${d.ui.translated}/${d.ui.total}, ${Object.values(d.ui.missing).flat().length} new · pipeline ${d.pipeline.translated}/${d.pipeline.total} · pairs not matching upstream: index.html ${d.indexHtml.missing.length}, pipeline ${d.pipeline.missing.length}`);
  const table = (title, items, withClass) => {
    if (!items.length) return;
    lines.push('', `#### ${title} (${items.length})`, '');
    lines.push(withClass ? '| File | Class | Lines |' : '| File |');
    lines.push(withClass ? '| --- | --- | --- |' : '| --- |');
    for (const f of items) {
      lines.push(withClass ? `| \`${f.rel}\` | ${f.class ?? ''} | ${f.added !== undefined ? `+${f.added} −${f.removed}` : ''} |` : `| \`${f.rel}\` |`);
    }
  };
  table('Stale snapshots (run `pnpm update-origin` first)', byState(status, STATES.staleSnapshot), true);
  table('Outdated: retranslate the changed passages', byState(status, STATES.outdated), true);
  table('Removed upstream: move or delete the pair', byState(status, STATES.removed), false);
  table('Missing snapshot', byState(status, STATES.missingSnapshot), false);
  const untranslated = byState(status, STATES.untranslated);
  if (untranslated.length) {
    lines.push('', `<details><summary>Untranslated (${untranslated.length})</summary>`, '');
    for (const f of untranslated) lines.push(`- \`${f.rel}\``);
    lines.push('', '</details>');
  }
  if (d.navigation.missing.length || Object.keys(d.ui.missing).length) {
    lines.push('', '#### New UI strings (run `pnpm dictionaries`)', '');
    for (const l of d.navigation.missing) lines.push(`- navigation: ${l}`);
    for (const [file, strings] of Object.entries(d.ui.missing)) for (const s of strings) lines.push(`- ${file}: ${s}`);
  }
  lines.push('', 'Diff classes: **a** code/URL/whitespace only · **b** ≤ 5 prose lines · **c** ≤ 30 · **d** restructure.');
  return lines.join('\n');
}

async function init({src, args}, rel) {
  const upstream = path.join(adevSrc(originDir), rel);
  if (!(await exists(upstream))) fail(`no such upstream file: ${rel}`);
  const translated = path.join(src, rel);
  const snapshot = snapshotOf(translated);
  if ((await exists(translated)) && !args.force) fail(`${path.relative(process.cwd(), translated)} exists; use --force to overwrite`);
  const content = normalizeNewlines(await readText(upstream));
  await copySnapshot(upstream, snapshot);
  await writeMarked(translated, content, blobHash(content));
  log.ok(`snapshot: ${path.relative(process.cwd(), snapshot)}`);
  log.ok(`translate: ${path.relative(process.cwd(), translated)} (marker set; keep the line structure)`);
}

async function mark({lang, src}, rel) {
  const translated = path.join(src, rel);
  const snapshot = snapshotOf(translated);
  if (!(await exists(translated)) || !(await exists(snapshot))) fail(`need both ${rel} and its .en snapshot under i18n/${lang}/src`);
  const hash = blobHash(await readText(snapshot));
  await writeMarked(translated, stripMarker(await readText(translated)), hash);
  log.ok(`marker set to ${hash.slice(0, 10)} on ${rel}. Run: pnpm check ${lang} ${path.relative(process.cwd(), translated)}`);
}

async function showDiff({src}, rel) {
  const translated = path.join(src, rel);
  const snapshot = snapshotOf(translated);
  const upstream = path.join(adevSrc(originDir), rel);
  if (!(await exists(snapshot))) fail(`no snapshot for ${rel}; nothing translated yet (use --init)`);
  const snapshotText = await readText(snapshot);
  const upstreamText = (await exists(upstream)) ? await readText(upstream) : null;
  if (upstreamText !== null && blobHash(upstreamText) !== blobHash(snapshotText)) {
    log.warn('snapshot is stale: showing snapshot -> current upstream (run pnpm update-origin to refresh it)');
    console.log(formatDiff(snapshotText, upstreamText, {oldLabel: 'snapshot', newLabel: 'upstream'}));
    return;
  }
  const marker = (await exists(translated)) ? await readMarkerOf(translated) : null;
  if (!marker) fail(`${rel} has no source marker; cannot tell which English it was translated from`);
  if (marker === blobHash(snapshotText)) {
    log.ok(`${rel} is up to date with its snapshot`);
    return;
  }
  const old = await blobContent(marker);
  if (old === null) fail(`the English snapshot ${marker.slice(0, 10)} is not in this repository's history (translation never committed?)`);
  console.log(pc.dim(`English diff: snapshot ${marker.slice(0, 10)} (translated) -> ${blobHash(snapshotText).slice(0, 10)} (current)`));
  console.log(formatDiff(stripMarker(old), stripMarker(snapshotText)));
}
