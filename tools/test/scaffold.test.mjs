import assert from 'node:assert/strict';
import {after, describe, test} from 'node:test';
import YAML from 'yaml';
import {makeRepo, makeUpstream, removeDir, useRepo} from './helpers.mjs';

const repo = await makeRepo({example: false});
const upstream = await makeUpstream({git: false});
useRepo({root: repo.root, origin: upstream.dir});
const {SEED_TERMS, countTerms, languageMd, languageReadme, onboardingMd, replaceBetweenMarkers} = await import('../lib/scaffold.mjs');
const {loadLanguageRules} = await import('../lib/languages.mjs');

after(async () => {
  await removeDir(repo.root);
  await removeDir(upstream.dir);
});

describe('countTerms', () => {
  test('counts whole words (with plural) outside code, keeps terms seen 3+ times, most frequent first', async () => {
    const counted = await countTerms(upstream.dir);
    const map = new Map(counted);
    assert.ok(map.get('signal') >= 3, `signal: ${map.get('signal')}`);
    assert.ok(map.get('component') >= 3, `component: ${map.get('component')}`);
    assert.ok(!map.has('zoneless'), 'absent terms are not listed');
    assert.ok(counted.every(([, n]) => n >= 3));
    for (let i = 1; i < counted.length; i++) assert.ok(counted[i - 1][1] >= counted[i][1]);
    assert.ok(SEED_TERMS.includes('dependency injection'));
  });
  test('accepts a custom term list', async () => {
    const counted = await countTerms(upstream.dir, ['template', 'nonexistent-term']);
    assert.deepEqual(counted.map(([t]) => t), ['template']);
  });
});

describe('templates', () => {
  test('languageMd has machine-readable front matter the rules loader accepts', async () => {
    const md = languageMd({lang: 'de', name: 'Deutsch', direction: 'ltr', formality: 'formal'});
    const fm = YAML.parse(/^---\n([\s\S]*?)\n---/.exec(md)[1]);
    assert.equal(fm.lang, 'de');
    assert.equal(fm.name, 'Deutsch');
    assert.equal(fm.direction, 'ltr');
    assert.equal(fm.formality, 'formal');
    assert.equal(fm.lineParity, 'strict');
    assert.ok(md.includes('# Translation rules: Deutsch'));
    assert.ok(md.includes('**DE**'));
    assert.ok((md.match(/TODO/g) ?? []).length > 5);
    const {writeFile, mkdir} = await import('node:fs/promises');
    await mkdir(`${repo.root}/i18n/de`, {recursive: true});
    await writeFile(`${repo.root}/i18n/de/LANGUAGE.md`, md);
    const rules = await loadLanguageRules('de');
    assert.equal(rules.lineParity, 'strict');
    assert.deepEqual(rules.quotes, ['“', '”']);
    assert.equal(rules.spaceBeforePunctuation, null);
  });
  test('languageReadme and onboardingMd use the site values', () => {
    const site = {
      name: 'Deutsch',
      englishName: 'German',
      folder: 'de',
      domain: 'angular.example',
      upstreamSite: 'https://angular.dev',
      firebase: {projectId: 'proj', target: 'docs-de'},
      community: {chat: 'https://chat.example', maintainers: ['alice', 'bob']},
    };
    const readme = languageReadme(site);
    assert.ok(readme.includes('# Deutsch — `i18n/de`'));
    assert.ok(readme.includes('@alice, @bob'));
    assert.ok(readme.includes('https://chat.example'));
    assert.ok(readme.includes('pnpm status de'));
    const noMaint = languageReadme({...site, community: {maintainers: []}});
    assert.ok(noMaint.includes('_TODO_'));
    const onboarding = onboardingMd(site);
    assert.ok(onboarding.includes('`proj`'));
    assert.ok(onboarding.includes('firebase target:apply hosting docs-de'));
    assert.ok(onboarding.includes('https://angular.example'));
    assert.ok(onboarding.includes('`lang:de`'));
  });
});

describe('replaceBetweenMarkers', () => {
  test('replaces the body of an html-comment or hash marker block', () => {
    const html = 'a\n<!-- k:start -->\nold\n<!-- k:end -->\nz';
    assert.equal(replaceBetweenMarkers(html, 'k', 'new'), 'a\n<!-- k:start -->\nnew\n<!-- k:end -->\nz');
    const hash = '# k:start\nold\n# k:end\n';
    assert.equal(replaceBetweenMarkers(hash, 'k', 'l1\nl2', {comment: 'hash'}), '# k:start\nl1\nl2\n# k:end\n');
  });
  test('returns null when markers are missing or inverted', () => {
    assert.equal(replaceBetweenMarkers('nothing', 'k', 'x'), null);
    assert.equal(replaceBetweenMarkers('<!-- k:end -->\n<!-- k:start -->', 'k', 'x'), null);
  });
});
