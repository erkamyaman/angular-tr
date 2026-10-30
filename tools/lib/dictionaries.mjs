import path from 'node:path';
import {
  applyIndexHtmlPairs,
  checkPipelinePairs,
  defaultIndexHtmlPairs,
  defaultPipelinePairs,
  extractAllTemplateStrings,
  extractNavLabels,
} from './adev.mjs';
import {exists, readText, writeJson} from './fs.mjs';
import {loadDictionaries, loadLanguageRules, loadSite} from './languages.mjs';
import {INDEX_HTML, NAVIGATION_FILE, adevSrc, langDictDir, originDir} from './paths.mjs';

/**
 * Bring the four dictionaries of a language in line with the current origin.
 * New upstream strings are added with their English text as value so the site never breaks;
 * existing translations are kept; obsolete keys are dropped with `prune`.
 */
export async function refreshDictionaries(lang, {prune = false, init = false} = {}) {
  const originSrc = adevSrc(originDir);
  const dir = langDictDir(lang);
  const current = await loadDictionaries(lang);
  const result = {navigation: {}, ui: {}, indexHtml: {}, pipeline: {}};

  // navigation.json, kept in upstream source order
  const labels = extractNavLabels(await readText(path.join(originSrc, NAVIGATION_FILE)));
  const navigation = {};
  let added = 0;
  for (const label of labels) {
    if (current.navigation[label] === undefined) added++;
    navigation[label] = current.navigation[label] ?? label;
  }
  const obsolete = Object.keys(current.navigation).filter((k) => !labels.includes(k));
  if (!prune) for (const k of obsolete) navigation[k] = current.navigation[k];
  await writeJson(path.join(dir, 'navigation.json'), navigation);
  result.navigation = {
    total: labels.length,
    added,
    obsolete: obsolete.length,
    pruned: prune ? obsolete.length : 0,
    untranslated: labels.filter((l) => navigation[l] === l).length,
  };

  // ui.json, one object per template in upstream order
  const templates = await extractAllTemplateStrings(originDir);
  const ui = {};
  let uiAdded = 0;
  let uiTotal = 0;
  let uiObsolete = 0;
  for (const [file, strings] of Object.entries(templates)) {
    const existing = current.ui[file] ?? {};
    const entry = {};
    for (const s of strings) {
      uiTotal++;
      if (existing[s] === undefined) uiAdded++;
      entry[s] = existing[s] ?? s;
    }
    const stale = Object.keys(existing).filter((k) => !strings.includes(k));
    uiObsolete += stale.length;
    if (!prune) for (const k of stale) entry[k] = existing[k];
    ui[file] = entry;
  }
  for (const file of Object.keys(current.ui)) {
    if (templates[file]) continue;
    uiObsolete += Object.keys(current.ui[file]).length;
    if (!prune) ui[file] = current.ui[file];
  }
  await writeJson(path.join(dir, 'ui.json'), ui);
  result.ui = {
    total: uiTotal,
    added: uiAdded,
    obsolete: uiObsolete,
    pruned: prune ? uiObsolete : 0,
    untranslated: Object.values(ui).reduce((n, e) => n + Object.entries(e).filter(([k, v]) => k === v).length, 0),
  };

  // index-html.json: generated once (init or missing), then only verified
  const indexFile = path.join(dir, 'index-html.json');
  const indexHtml = await readText(path.join(originSrc, INDEX_HTML));
  let pairs = current.indexHtml;
  let generated = false;
  if (init || !(await exists(indexFile)) || pairs.length === 0) {
    const site = await loadSite(lang);
    const rules = await loadLanguageRules(lang).catch(() => ({}));
    const {pairs: defaults, dropped} = defaultIndexHtmlPairs(indexHtml, site, rules);
    pairs = defaults.map(({find, replace, note}) => ({find, replace, note}));
    await writeJson(indexFile, pairs);
    generated = true;
    result.indexHtml.dropped = dropped.map((d) => d.note);
  }
  const {missing} = applyIndexHtmlPairs(indexHtml, pairs);
  result.indexHtml = {...result.indexHtml, total: pairs.length, generated, notMatching: missing};

  // pipeline.json: the seeds that exist upstream, in upstream order; translations kept by (file, find);
  // a pair whose text upstream changed is kept and reported (its `find` must be fixed by hand).
  const pipelineFile = path.join(dir, 'pipeline.json');
  const {pairs: seeds} = await defaultPipelinePairs(originDir);
  const key = (p) => `${p.file}\n${p.find}`;
  const known = new Map(current.pipeline.map((p) => [key(p), p]));
  const pipelineGenerated = init || !(await exists(pipelineFile)) || current.pipeline.length === 0;
  let pipelineAdded = 0;
  const pipeline = [];
  for (const seed of seeds) {
    const existing = known.get(key(seed));
    if (!existing) pipelineAdded++;
    pipeline.push({file: seed.file, find: seed.find, replace: existing?.replace ?? seed.replace, note: existing?.note ?? seed.note});
    known.delete(key(seed));
  }
  for (const leftover of known.values()) pipeline.push(leftover); // custom pairs, and pairs whose text changed upstream
  await writeJson(pipelineFile, pipeline);
  const {missing: pipelineMissing} = await checkPipelinePairs(originDir, pipeline);
  result.pipeline = {
    total: pipeline.length,
    added: pipelineAdded,
    generated: pipelineGenerated,
    untranslated: pipeline.filter((p) => p.replace === p.find).length,
    notMatching: pipelineMissing,
  };

  return result;
}

export function formatRefreshResult(lang, r) {
  const lines = [
    `navigation.json: ${r.navigation.total} labels, ${r.navigation.added} added, ${r.navigation.untranslated} still English` +
      (r.navigation.obsolete ? `, ${r.navigation.obsolete} obsolete${r.navigation.pruned ? ' (pruned)' : ' (kept; --prune to drop)'}` : ''),
    `ui.json: ${r.ui.total} strings, ${r.ui.added} added, ${r.ui.untranslated} still English` +
      (r.ui.obsolete ? `, ${r.ui.obsolete} obsolete${r.ui.pruned ? ' (pruned)' : ' (kept; --prune to drop)'}` : ''),
    `index-html.json: ${r.indexHtml.total} pairs${r.indexHtml.generated ? ' (generated)' : ''}` +
      (r.indexHtml.notMatching?.length ? `, ${r.indexHtml.notMatching.length} NOT matching upstream` : ', all matching'),
    `pipeline.json: ${r.pipeline.total} pairs${r.pipeline.generated ? ' (generated)' : ''}, ${r.pipeline.added} added, ${r.pipeline.untranslated} still English` +
      (r.pipeline.notMatching?.length ? `, ${r.pipeline.notMatching.length} NOT matching upstream` : ', all matching'),
  ];
  if (r.indexHtml.dropped?.length) lines.push(`  default pairs skipped (not found in upstream index.html): ${r.indexHtml.dropped.join('; ')}`);
  return lines.map((l) => `${lang}: ${l}`).join('\n');
}
