import path from 'node:path';
import {readFile} from 'node:fs/promises';
import {run} from './exec.mjs';
import {exists, readText} from './fs.mjs';
import {classifyDiff} from './diff.mjs';
import {
  applyIndexHtmlPairs,
  checkPipelinePairs,
  extractAllTemplateStrings,
  extractNavLabels,
  listContentFiles,
} from './adev.mjs';
import {loadDictionaries} from './languages.mjs';
import {INDEX_HTML, NAVIGATION_FILE, adevSrc, langSrcDir, originDir, rootDir} from './paths.mjs';
import {blobHash, listSnapshots, readMarkerOf, stripMarker} from './snapshots.mjs';

export const STATES = {
  upToDate: 'up-to-date',
  outdated: 'outdated',
  staleSnapshot: 'stale-snapshot',
  untranslated: 'untranslated',
  removed: 'removed',
  orphanSnapshot: 'orphan-snapshot',
  missingSnapshot: 'missing-snapshot',
};

/** Content of a blob by hash from this repository's object store, or null. */
export async function blobContent(hash, cwd = rootDir) {
  const {code, stdout} = await run('git', ['cat-file', '-p', hash], {cwd, capture: true, allowFailure: true});
  return code === 0 ? stdout : null;
}

export async function originSha(dir = originDir) {
  const {code, stdout} = await run('git', ['rev-parse', 'HEAD'], {cwd: dir, capture: true, allowFailure: true});
  return code === 0 ? stdout.trim() : null;
}

/**
 * Compute the translation status of one language against the current origin checkout.
 * Pure read; safe to run anywhere.
 */
export async function computeStatus(lang, {withClasses = true} = {}) {
  if (!(await exists(adevSrc(originDir)))) {
    throw new Error(`origin not initialized (${originDir}). Run: pnpm bootstrap`);
  }
  const src = langSrcDir(lang);
  const originSrc = adevSrc(originDir);
  const contentFiles = await listContentFiles(originDir);
  const contentSet = new Set(contentFiles);
  const snapshots = await listSnapshots(lang);
  const snapshotByRel = new Map(snapshots.map((s) => [s.rel, s]));

  const files = [];

  // 1. Every in-scope upstream file: translated (fresh / outdated / stale) or untranslated.
  for (const rel of contentFiles) {
    const snap = snapshotByRel.get(rel);
    const translatedPath = path.join(src, rel);
    const hasTranslation = await exists(translatedPath);
    if (!snap) {
      files.push({rel, state: hasTranslation ? STATES.missingSnapshot : STATES.untranslated});
      continue;
    }
    files.push(await describePair(rel, snap, originSrc, {withClasses}));
  }

  // 2. Snapshots that no longer map to an upstream file (removed or renamed upstream), plus
  //    non-content overlays (app templates, assets) which are checked the same way.
  for (const snap of snapshots) {
    if (contentSet.has(snap.rel)) continue;
    const upstreamExists = await exists(path.join(originSrc, snap.rel));
    if (!upstreamExists) {
      const hasTranslation = await exists(snap.translated);
      files.push({rel: snap.rel, state: hasTranslation ? STATES.removed : STATES.orphanSnapshot, overlay: true});
      continue;
    }
    files.push({...(await describePair(snap.rel, snap, originSrc, {withClasses})), overlay: true});
  }

  files.sort((a, b) => a.rel.localeCompare(b.rel));
  const dictionaries = await dictionaryStatus(lang);
  return {
    lang,
    origin: {sha: await originSha(), dir: originDir},
    generatedAt: new Date().toISOString(),
    files,
    totals: totals(files),
    dictionaries,
  };
}

async function describePair(rel, snap, originSrc, {withClasses}) {
  const snapshotText = await readText(snap.snapshot);
  const snapshotHash = blobHash(snapshotText);
  const upstreamBuf = await readFile(path.join(originSrc, rel));
  const upstreamHash = blobHash(upstreamBuf);
  const hasTranslation = await exists(snap.translated);
  if (!hasTranslation) {
    return {rel, state: STATES.orphanSnapshot, snapshotHash};
  }
  const translatedText = await readText(snap.translated);
  const markerHash = await readMarkerOf(snap.translated, translatedText);
  const entry = {rel, snapshotHash, markerHash, upstreamHash};
  if (snapshotHash !== upstreamHash) {
    entry.state = STATES.staleSnapshot;
    entry.translationMatchesSnapshot = markerHash === snapshotHash;
    if (withClasses) Object.assign(entry, await classify(snapshotText, upstreamBuf.toString('utf8')));
    return entry;
  }
  if (markerHash === snapshotHash) {
    entry.state = STATES.upToDate;
    return entry;
  }
  entry.state = STATES.outdated;
  if (withClasses) {
    const old = markerHash ? await blobContent(markerHash) : null;
    if (old === null) {
      entry.class = markerHash ? 'unknown' : 'no-marker';
    } else {
      Object.assign(entry, await classify(old, snapshotText));
    }
  }
  return entry;
}

async function classify(oldText, newText) {
  const c = classifyDiff(stripMarker(oldText), stripMarker(newText));
  return {class: c.class, added: c.added, removed: c.removed, proseChanged: c.proseChanged};
}

export function totals(files) {
  const t = {inScope: 0, translated: 0};
  for (const s of Object.values(STATES)) t[s] = 0;
  for (const f of files) {
    t[f.state]++;
    if (!f.overlay) {
      if (f.state !== STATES.removed && f.state !== STATES.orphanSnapshot) t.inScope++;
      if ([STATES.upToDate, STATES.outdated, STATES.staleSnapshot].includes(f.state)) t.translated++;
    }
  }
  t.coverage = t.inScope ? Math.round((t.translated / t.inScope) * 1000) / 10 : 0;
  return t;
}

/** Dictionary coverage against the current origin. */
export async function dictionaryStatus(lang) {
  const originSrc = adevSrc(originDir);
  const dict = await loadDictionaries(lang);

  const navSource = await readText(path.join(originSrc, NAVIGATION_FILE));
  const navLabels = extractNavLabels(navSource);
  const navMissing = navLabels.filter((l) => dict.navigation[l] === undefined);
  const navUntranslated = navLabels.filter((l) => dict.navigation[l] !== undefined && dict.navigation[l] === l);
  const navObsolete = Object.keys(dict.navigation).filter((k) => !navLabels.includes(k));

  const templates = await extractAllTemplateStrings(originDir);
  const uiMissing = {};
  const uiObsolete = {};
  let uiTotal = 0;
  let uiTranslated = 0;
  for (const [file, strings] of Object.entries(templates)) {
    const d = dict.ui[file] ?? {};
    for (const s of strings) {
      uiTotal++;
      if (d[s] === undefined) (uiMissing[file] ??= []).push(s);
      else if (d[s] !== s) uiTranslated++;
    }
    const obsolete = Object.keys(d).filter((k) => !strings.includes(k));
    if (obsolete.length) uiObsolete[file] = obsolete;
  }
  for (const file of Object.keys(dict.ui)) {
    if (!templates[file]) uiObsolete[file] = Object.keys(dict.ui[file]);
  }

  const indexHtml = await readText(path.join(originSrc, INDEX_HTML));
  const {missing: indexMissing} = applyIndexHtmlPairs(indexHtml, dict.indexHtml);
  const {missing: pipelineMissing} = await checkPipelinePairs(originDir, dict.pipeline);

  return {
    navigation: {
      total: navLabels.length,
      translated: navLabels.length - navMissing.length - navUntranslated.length,
      missing: navMissing,
      untranslated: navUntranslated,
      obsolete: navObsolete,
    },
    ui: {total: uiTotal, translated: uiTranslated, missing: uiMissing, obsolete: uiObsolete},
    indexHtml: {total: dict.indexHtml.length, missing: indexMissing},
    pipeline: {
      total: dict.pipeline.length,
      translated: dict.pipeline.filter((p) => p.replace !== p.find).length,
      missing: pipelineMissing,
    },
  };
}
