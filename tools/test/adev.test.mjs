import assert from 'node:assert/strict';
import path from 'node:path';
import {after, describe, test} from 'node:test';
import {
  PIPELINE_PAIR_SEEDS,
  applyIndexHtmlPairs,
  applyNavLabels,
  applyPairs,
  applyPipelinePairs,
  applyTemplateStrings,
  checkPipelinePairs,
  defaultIndexHtmlPairs,
  defaultPipelinePairs,
  extractAllTemplateStrings,
  extractNavLabels,
  extractTemplateStrings,
  listContentFiles,
  templateStringSpans,
} from '../lib/adev.mjs';
import {ALERT_KEYWORDS} from '../lib/markdown.mjs';
import {makeUpstream, read, removeDir} from './helpers.mjs';

const upstream = await makeUpstream({git: false});
after(() => removeDir(upstream.dir));

describe('content scope', () => {
  test('listContentFiles applies the excludes', async () => {
    const files = await listContentFiles(upstream.dir);
    assert.deepEqual(files, [
      'content/guide/components/anatomy-of-components.md',
      'content/guide/signals/overview.md',
      'content/introduction/what-is-angular.md',
      'content/reference/errors/NG0100.md',
      'content/reference/errors/overview.md',
    ]);
  });
});

describe('navigation labels', () => {
  const ts = `export const NAV = [{label: 'Introduction', path: 'x'}, {label: 'What\\'s new?', children: [{label: 'Introduction'}]}, {label: 'Back\\\\slash'}];`;
  test('extracts unique labels in source order, unescaping quotes and backslashes', () => {
    assert.deepEqual(extractNavLabels(ts), ['Introduction', "What's new?", 'Back\\slash']);
  });
  test('applies a dictionary, escapes, counts, reports missing entries', () => {
    const {source, missing, applied} = applyNavLabels(ts, {Introduction: 'Présentation', 'Back\\slash': "L'autre"});
    assert.ok(source.includes("label: 'Présentation'"));
    assert.ok(source.includes("label: 'L\\'autre'"));
    assert.deepEqual(missing, ["What's new?"]);
    assert.equal(applied, 3);
    assert.deepEqual(extractNavLabels(source), ['Présentation', "What's new?", "L'autre"]);
  });
  test('an empty translation counts as missing and an identical one is not applied', () => {
    const {source, missing, applied} = applyNavLabels(ts, {Introduction: 'Introduction', "What's new?": ''});
    assert.equal(applied, 0);
    assert.deepEqual(missing, ["What's new?", 'Back\\slash']);
    assert.equal(source, ts);
  });
  test('the fixture navigation file yields its labels', async () => {
    const labels = extractNavLabels(await read(path.join(upstream.dir, 'adev/src/app/routing/navigation-entries/index.ts')));
    assert.deepEqual(labels, ['Introduction', 'What is Angular?', 'In-depth Guides', 'Signals', 'Overview', 'Components', 'Anatomy of components', 'Reference', 'Error Encyclopedia', "What's new?"]);
  });
});

describe('template strings', () => {
  const html = `<a aria-label="Open docs" href="/">Docs</a>\n<p>\n  Where performance\n  matters\n</p><span>{{ value }}</span><button title="Copy">Copy</button>`;
  test('extracts text nodes and text-like attributes, whitespace normalized, deduplicated', () => {
    assert.deepEqual(extractTemplateStrings(html).sort(), ['Copy', 'Docs', 'Open docs', 'Where performance matters']);
  });
  test('spans point at the exact region of the source', () => {
    for (const s of templateStringSpans(html)) {
      const raw = html.slice(s.start, s.end);
      assert.equal(raw.replace(/\s+/g, ' ').trim(), s.text);
      assert.ok(['text', 'attr'].includes(s.kind));
    }
  });
  test('skips comments, code, pre, icons, interpolations, identifiers, file names and entities', () => {
    const t = `<!-- A comment -->\n<code>ng new</code><pre>  ng serve\n</pre>\n<docs-icon>open_in_new</docs-icon>\n<i class="material-symbols-outlined">more_horiz</i>\n<span class="material-icons">home</span>\n<p>{{ title }}</p><p>searchTerm</p><p>app.component.ts</p><p>&#64;defer</p><p>Real copy here</p><p>x</p>\n<svg viewBox="0 0 10 10"><defs><style>.cls-1 { fill: #003dff; }</style></defs><title>Algolia logo</title></svg>`;
    assert.deepEqual(extractTemplateStrings(t), ['Real copy here'], 'svg children (the parser names them :svg:style) are not copy');
  });
  test('walks control-flow blocks and @let declarations without hanging', () => {
    const t = `@let doc = this.doc();\n@if (doc) {\n  <p>Inside if</p>\n} @else {\n  <p>Inside else</p>\n}\n@for (c of cards; track c) {\n  <b>{{ c }}</b><em>Inside for</em>\n}\n@switch (mode) { @case ('a') { <p>Case a</p> } @default { <p>Default</p> } }`;
    assert.deepEqual(extractTemplateStrings(t), ['Inside if', 'Inside else', 'Inside for', 'Case a', 'Default']);
  });
  test('applies translations by span and escapes quotes in attributes', () => {
    const dict = {Docs: 'Documentation', 'Open docs': 'Ouvrir la "doc"', 'Where performance matters': 'Quand la performance compte', Copy: 'Copier'};
    const {html: out, missing, applied} = applyTemplateStrings(html, dict);
    assert.ok(out.includes('>Documentation<'));
    assert.ok(out.includes('aria-label="Ouvrir la &quot;doc&quot;"'));
    assert.ok(out.includes('<p>\n  Quand la performance compte\n</p>'), 'surrounding whitespace is preserved');
    assert.ok(out.includes('title="Copier">Copier<'));
    assert.deepEqual(missing, []);
    assert.equal(applied, 5);
  });
  test('missing and identical entries leave the template untouched', () => {
    const {html: out, missing, applied} = applyTemplateStrings(html, {Docs: 'Docs'});
    assert.equal(out, html);
    assert.equal(applied, 0);
    assert.deepEqual(missing.sort(), ['Copy', 'Open docs', 'Where performance matters']);
  });
  test('extractAllTemplateStrings covers app and shared-docs templates but not spec templates', async () => {
    const all = await extractAllTemplateStrings(upstream.dir);
    assert.deepEqual(Object.keys(all), [
      'shared-docs/components/cookie-popup/cookie-popup.component.html',
      'shared-docs/components/table-of-contents/table-of-contents.component.html',
      'src/app/core/layout/footer/footer.component.html',
      'src/app/features/home/home.component.html',
    ]);
    assert.deepEqual(all['shared-docs/components/table-of-contents/table-of-contents.component.html'], ['On this page', 'Back to the top']);
    assert.ok(all['shared-docs/components/cookie-popup/cookie-popup.component.html'].includes('Ok, Got it'));
    assert.deepEqual(all['src/app/features/home/home.component.html'], [
      'The web development framework for building modern apps.',
      'Angular UwU logo',
      'Get started with Angular',
      'Get Started',
      'Copy',
      'Search docs',
      'Search',
    ]);
    assert.ok(all['src/app/core/layout/footer/footer.component.html'].includes('Join the discussions at Angular Community Discord server.'));
    assert.ok(!all['src/app/core/layout/footer/footer.component.html'].some((s) => s.includes('Legal line')), 'comments are not strings');
    assert.ok(!all['src/app/core/layout/footer/footer.component.html'].includes('open_in_new'), 'icon ligatures are not strings');
  });
});

describe('index.html pairs', () => {
  const site = {lang: 'fr', direction: 'ltr', siteUrl: 'https://angular.fr'};
  test('default pairs match the fixture index.html and use the site values', async () => {
    const indexHtml = await read(path.join(upstream.dir, 'adev/src/index.html'));
    const {pairs, dropped} = defaultIndexHtmlPairs(indexHtml, site);
    assert.deepEqual(dropped, []);
    assert.equal(pairs.length, 6);
    assert.deepEqual(pairs[0], {find: '<html lang="en"', replace: '<html lang="fr"', note: 'document language'});
    assert.ok(pairs.some((p) => p.find === 'href="https://angular.dev"' && p.replace === 'href="https://angular.fr"'));
  });
  test('rtl languages get dir="rtl"; fonts add a stylesheet; unknown finds are dropped', async () => {
    const indexHtml = await read(path.join(upstream.dir, 'adev/src/index.html'));
    const {pairs} = defaultIndexHtmlPairs(indexHtml, {...site, lang: 'ar', direction: 'rtl'}, {fonts: ['https://fonts.example/x.css']});
    assert.equal(pairs[0].replace, '<html lang="ar" dir="rtl"');
    const font = pairs.find((p) => p.note === 'extra font stylesheet');
    assert.ok(font.replace.includes('href="https://fonts.example/x.css"'));
    const {pairs: p2, dropped} = defaultIndexHtmlPairs('<html lang="en"><head></head></html>', site);
    assert.equal(p2.length, 1);
    assert.equal(dropped.length, 5);
  });
  test('applyIndexHtmlPairs replaces every occurrence and reports dead pairs', () => {
    const html = '<html lang="en"><title>Angular</title><a href="https://angular.dev">x</a><a href="https://angular.dev">y</a>';
    const {html: out, missing} = applyIndexHtmlPairs(html, [
      {find: '<html lang="en"', replace: '<html lang="fr"'},
      {find: 'href="https://angular.dev"', replace: 'href="https://angular.fr"'},
      {find: 'nope', replace: 'x'},
      {find: '', replace: 'ignored'},
    ]);
    assert.ok(out.startsWith('<html lang="fr">'));
    assert.equal((out.match(/angular\.fr/g) ?? []).length, 2);
    assert.deepEqual(missing, ['nope']);
  });
});

describe('pipeline pairs', () => {
  test('seeds cover every alert keyword and start English; only the ones present upstream are kept', async () => {
    for (const k of ALERT_KEYWORDS) assert.ok(PIPELINE_PAIR_SEEDS.some((p) => p.find.startsWith(`${k} = '`)), k);
    assert.ok(PIPELINE_PAIR_SEEDS.every((p) => p.replace === p.find && p.file && p.note));
    const {pairs, dropped} = await defaultPipelinePairs(upstream.dir);
    const alertFile = 'shared-docs/pipeline/shared/marked/extensions/docs-alert.mts';
    assert.equal(pairs.filter((p) => p.file === alertFile).length, ALERT_KEYWORDS.length);
    assert.ok(pairs.some((p) => p.find === "TLDR = 'TL;DR',"));
    assert.ok(pairs.some((p) => p.find === ": 'Learn more'}"), 'docs-card');
    assert.ok(pairs.some((p) => p.find === 'title="Edit this page" aria-label="Edit this page"'), 'heading.mts');
    assert.ok(dropped.every((p) => p.file.includes('docs-video') || p.file.includes('docs-code')), 'files absent from the fixture are dropped, not failed');
    assert.deepEqual((await checkPipelinePairs(upstream.dir, pairs)).missing, []);
  });
  test('applyPairs and applyPipelinePairs replace every occurrence and report dead pairs per file', async () => {
    assert.deepEqual(applyPairs('a b a', [{find: 'a', replace: 'x'}, {find: 'z', replace: 'y'}]), {text: 'x b x', missing: ['z']});
    const dir = path.join(upstream.dir, '..', 'pipeline-apply');
    const {cp} = await import('node:fs/promises');
    await cp(upstream.dir, dir, {recursive: true});
    const alertFile = 'shared-docs/pipeline/shared/marked/extensions/docs-alert.mts';
    const pairs = [
      {file: alertFile, find: "NOTE = 'NOTE',", replace: "NOTE = 'Note\u202F',"},
      {file: alertFile, find: "TIP = 'GONE',", replace: "TIP = 'Astuce',"},
      {file: 'shared-docs/pipeline/shared/marked/transformations/heading.mts', find: 'aria-label="Link to ${', replace: 'aria-label="Lien vers ${'},
      {file: 'shared-docs/pipeline/nope.mts', find: 'x', replace: 'y'},
    ];
    const r = await applyPipelinePairs(dir, pairs);
    assert.equal(r.applied, 2);
    assert.deepEqual(r.missing, [
      {file: alertFile, find: "TIP = 'GONE',"},
      {file: 'shared-docs/pipeline/nope.mts', find: 'x'},
    ]);
    const alerts = await read(path.join(dir, 'adev', alertFile));
    assert.ok(alerts.includes("NOTE = 'Note\u202F',"));
    assert.ok(alerts.includes("TIP = 'TIP',"), 'a dead pair leaves the file as it was');
    assert.ok((await read(path.join(dir, 'adev/shared-docs/pipeline/shared/marked/transformations/heading.mts'))).includes('aria-label="Lien vers ${normalizedLabel}"'));
    assert.deepEqual((await checkPipelinePairs(upstream.dir, pairs)).missing.map((m) => m.find), ["TIP = 'GONE',", 'x']);
    await removeDir(dir);
  });
});
