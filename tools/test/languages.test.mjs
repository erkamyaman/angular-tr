import assert from 'node:assert/strict';
import {rm} from 'node:fs/promises';
import path from 'node:path';
import {after, describe, test} from 'node:test';
import {makeRepo, removeDir, useRepo, write} from './helpers.mjs';

const repo = await makeRepo({example: true});
useRepo({root: repo.root});
const {DEFAULT_STRINGS, describeLanguage, isLanguageTag, languageExists, listLanguages, loadDictionaries, loadGlossary, loadLanguageRules, loadSite, resolveLanguage} =
  await import('../lib/languages.mjs');

after(() => removeDir(repo.root));

const langDir = (lang) => path.join(repo.root, 'i18n', lang);
const validSite = (over = {}) => ({
  lang: 'de',
  name: 'Deutsch',
  englishName: 'German',
  direction: 'ltr',
  domain: 'angular.example',
  repo: {owner: 'o', name: 'r'},
  firebase: {projectId: 'p', target: 't'},
  ...over,
});

describe('language tags and names', () => {
  test('isLanguageTag accepts BCP-47 tags with an ISO 639 primary subtag', () => {
    for (const ok of ['fr', 'pt-BR', 'zh-Hans', 'zh-Hant-TW', 'sr-Latn', 'es-419', 'ast']) assert.ok(isLanguageTag(ok), ok);
    for (const bad of ['french', 'fr_FR', '', 'f', 'FR-', 'x-private', null, 12]) assert.ok(!isLanguageTag(bad), String(bad));
  });
  test('describeLanguage uses ICU names and text direction', () => {
    assert.deepEqual(describeLanguage('fr'), {name: 'Français', englishName: 'French', direction: 'ltr'});
    assert.equal(describeLanguage('ar').direction, 'rtl');
    assert.equal(describeLanguage('he').direction, 'rtl');
    assert.equal(describeLanguage('pt-BR').englishName, 'Brazilian Portuguese');
    assert.equal(describeLanguage('zh-Hans').name, '简体中文');
    assert.equal(describeLanguage('ja').name, '日本語');
  });
});

describe('language folders', () => {
  test('listLanguages hides _example unless asked; only folders with site.json count', async () => {
    await write(path.join(langDir('fr'), 'site.json'), JSON.stringify(validSite({lang: 'fr'})));
    await write(path.join(langDir('broken'), 'LANGUAGE.md'), '');
    assert.deepEqual(await listLanguages(), ['fr']);
    assert.deepEqual(await listLanguages({includeExample: true}), ['_example', 'fr']);
    assert.ok(await languageExists('fr'));
    assert.ok(await languageExists('broken'));
    assert.ok(!(await languageExists('nope')));
  });
  test('resolveLanguage: explicit wins, a single configured language is implied, otherwise an error', async () => {
    assert.equal(await resolveLanguage('xx'), 'xx');
    assert.equal(await resolveLanguage(undefined), 'fr');
    await write(path.join(langDir('de'), 'site.json'), JSON.stringify(validSite()));
    await assert.rejects(resolveLanguage(undefined), /Several languages configured \(_example, de, fr\)/);
    await rm(langDir('de'), {recursive: true});
    await rm(langDir('fr'), {recursive: true});
    assert.equal(await resolveLanguage(undefined), '_example');
    await rm(langDir('broken'), {recursive: true});
  });
});

describe('loadSite', () => {
  test('validates against the schema and applies defaults', async () => {
    await write(path.join(langDir('de'), 'site.json'), JSON.stringify(validSite()));
    const site = await loadSite('de');
    assert.equal(site.repo.branch, 'main');
    assert.equal(site.upstreamSite, 'https://angular.dev');
    assert.deepEqual(site.search, {provider: 'none'});
    assert.deepEqual(site.community, {maintainers: []});
    assert.equal(site.folder, 'de');
    assert.equal(site.siteUrl, 'https://angular.example');
    assert.equal(site.repoUrl, 'https://github.com/o/r');
    assert.deepEqual(site.strings, DEFAULT_STRINGS);
    assert.match(site.notice, /Community translation/);
  });
  test('custom strings override the defaults one by one', async () => {
    await write(path.join(langDir('de'), 'site.json'), JSON.stringify(validSite({strings: {otherLanguages: 'Andere Sprachen'}})));
    const site = await loadSite('de');
    assert.equal(site.strings.otherLanguages, 'Andere Sprachen');
    assert.equal(site.strings.readInEnglish, DEFAULT_STRINGS.readInEnglish);
  });
  test('rejects missing fields, unknown fields, bad enums and bad tags with readable messages', async () => {
    await write(path.join(langDir('de'), 'site.json'), JSON.stringify(validSite({direction: 'up', extra: 1})));
    await assert.rejects(loadSite('de'), (e) => /direction/.test(e.message) && /additional/.test(e.message));
    await write(path.join(langDir('de'), 'site.json'), JSON.stringify({lang: 'de'}));
    await assert.rejects(loadSite('de'), /required property/);
    await write(path.join(langDir('de'), 'site.json'), JSON.stringify(validSite({lang: 'german'})));
    await assert.rejects(loadSite('de'), /lang must match pattern/);
    await write(path.join(langDir('de'), 'site.json'), JSON.stringify(validSite({lang: 'ab-'})));
    await assert.rejects(loadSite('de'), /pattern|BCP-47/);
    await rm(langDir('de'), {recursive: true});
    await assert.rejects(loadSite('de'), /No site.json for language "de"/);
  });
});

describe('loadLanguageRules', () => {
  test('missing file and missing front matter are flagged, defaults applied', async () => {
    const r1 = await loadLanguageRules('nope');
    assert.ok(r1._missing);
    assert.equal(r1.lineParity, 'strict');
    await write(path.join(langDir('yy'), 'LANGUAGE.md'), '# Rules without front matter\n');
    const r2 = await loadLanguageRules('yy');
    assert.ok(r2._noFrontMatter);
    assert.equal(r2.headingCase, 'none');
  });
  test('parses the front matter and validates its shape', async () => {
    await write(path.join(langDir('yy'), 'LANGUAGE.md'), '---\nlang: yy\nlineParity: warn\nquotes: ["«", "»"]\nspaceBeforePunctuation: {chars: [":", "?"], space: " "}\nheadingCase: sentence\nfonts: [https://f.example/x.css]\n---\n# Rules\n');
    const r = await loadLanguageRules('yy');
    assert.equal(r.lineParity, 'warn');
    assert.deepEqual(r.quotes, ['«', '»']);
    assert.deepEqual(r.spaceBeforePunctuation, {chars: [':', '?'], space: ' '});
    assert.equal(r.headingCase, 'sentence');
    assert.deepEqual(r.fonts, ['https://f.example/x.css']);
    await write(path.join(langDir('yy'), 'LANGUAGE.md'), '---\nlineParity: maybe\n---\n');
    await assert.rejects(loadLanguageRules('yy'), /lineParity must be/);
    await write(path.join(langDir('yy'), 'LANGUAGE.md'), '---\nquotes: "«»"\n---\n');
    await assert.rejects(loadLanguageRules('yy'), /quotes must be an array/);
    await write(path.join(langDir('yy'), 'LANGUAGE.md'), '---\nspaceBeforePunctuation: {chars: ":"}\n---\n');
    await assert.rejects(loadLanguageRules('yy'), /spaceBeforePunctuation needs/);
  });
  test('the template example has valid French rules', async () => {
    const r = await loadLanguageRules('_example');
    assert.equal(r.lang, 'fr');
    assert.equal(r.formality, 'formal');
    assert.ok(Array.isArray(r.quotes));
  });
});

describe('loadGlossary and loadDictionaries', () => {
  test('glossary entries are normalized; errors are explicit', async () => {
    await write(path.join(langDir('yy'), 'glossary.json'), JSON.stringify([{term: ' signal ', keep: 1, forbidden: ['signaux', 2]}, {term: 'component', translation: ' composant '}]));
    const g = await loadGlossary('yy');
    assert.deepEqual(g[0], {term: 'signal', translation: '', keep: true, forbidden: ['signaux', '2'], note: ''});
    assert.deepEqual(g[1], {term: 'component', translation: 'composant', keep: false, forbidden: [], note: ''});
    assert.deepEqual(await loadGlossary('nope'), []);
    await write(path.join(langDir('yy'), 'glossary.json'), JSON.stringify({term: 'x'}));
    await assert.rejects(loadGlossary('yy'), /expected an array/);
    await write(path.join(langDir('yy'), 'glossary.json'), JSON.stringify([{translation: 'x'}]));
    await assert.rejects(loadGlossary('yy'), /entry 0 has no "term"/);
    const ex = await loadGlossary('_example');
    assert.ok(ex.length > 10);
    assert.ok(ex.every((e) => e.term && (e.translation || e.keep)));
  });
  test('dictionaries default to empty; pair lists must be arrays of complete pairs', async () => {
    assert.deepEqual(await loadDictionaries('nope'), {navigation: {}, ui: {}, indexHtml: [], pipeline: []});
    await write(path.join(langDir('yy'), 'dictionaries', 'navigation.json'), '{"A": "a"}');
    await write(path.join(langDir('yy'), 'dictionaries', 'index-html.json'), '{"find": "x"}');
    await assert.rejects(loadDictionaries('yy'), /index-html.json must be an array/);
    await write(path.join(langDir('yy'), 'dictionaries', 'index-html.json'), '[{"find": "x", "replace": "y"}]');
    await write(path.join(langDir('yy'), 'dictionaries', 'pipeline.json'), '[{"file": "a.mts", "find": "x"}]');
    await assert.rejects(loadDictionaries('yy'), /pipeline.json: every entry needs string "file", "find" and "replace"/);
    await write(path.join(langDir('yy'), 'dictionaries', 'pipeline.json'), '[{"file": "a.mts", "find": "x", "replace": "y"}]');
    const d = await loadDictionaries('yy');
    assert.deepEqual(d.navigation, {A: 'a'});
    assert.deepEqual(d.indexHtml, [{find: 'x', replace: 'y'}]);
    assert.deepEqual(d.pipeline, [{file: 'a.mts', find: 'x', replace: 'y'}]);
  });
});
