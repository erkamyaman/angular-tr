import assert from 'node:assert/strict';
import path from 'node:path';
import {after, describe, test} from 'node:test';
import YAML from 'yaml';
import {makeRepo, read, removeDir, useRepo, write} from './helpers.mjs';

const repo = await makeRepo({example: true});
useRepo({root: repo.root});
const {lintGlossary, prhFromGlossary, textlintrcFor, writeGlossaryRules} = await import('../lib/glossary.mjs');

after(() => removeDir(repo.root));

describe('prhFromGlossary', () => {
  test('one rule per entry with forbidden renderings; expected is the translation or the kept term', () => {
    const yaml = prhFromGlossary([
      {term: 'template', keep: true, forbidden: ['gabarit'], note: 'keep the English word'},
      {term: 'dependency injection', translation: 'injection de dépendances', forbidden: ['injection de dépendance']},
      {term: 'component', translation: 'composant', forbidden: []},
      {term: 'pipe', keep: true},
    ]);
    assert.ok(yaml.startsWith('# Generated from glossary.json'));
    const prh = YAML.parse(yaml);
    assert.equal(prh.version, 1);
    assert.equal(prh.rules.length, 2);
    assert.deepEqual(prh.rules[0], {expected: 'template', patterns: ['/(?<![\\p{L}\\p{N}])gabarit(?![\\p{L}\\p{N}])/i'], prh: 'keep the English word'});
    assert.equal(prh.rules[1].expected, 'injection de dépendances');
    assert.equal(prh.rules[1].prh, undefined);
  });
  test('patterns are escaped and compile with the flags prh adds (g, m, u)', () => {
    const prh = YAML.parse(prhFromGlossary([{term: 'a', translation: 'b', forbidden: ['c++ (x)', 'a/b.c']}]));
    for (const p of prh.rules[0].patterns) {
      const m = /^\/(.*)\/([a-z]*)$/.exec(p);
      assert.ok(m, p);
      const re = new RegExp(m[1], m[2] + 'gmu');
      assert.ok(re.test('use c++ (x) here') || re.test('path a/b.c here'));
    }
    const re = new RegExp(/^\/(.*)\/i$/.exec(prh.rules[0].patterns[0])[1], 'giu');
    assert.deepEqual('C++ (x) and c++ (x)y'.match(re), ['C++ (x)']);
  });
  test('textlintrc enables prh over paragraphs, headings, links, emphasis and quotes', () => {
    const rc = JSON.parse(textlintrcFor());
    assert.deepEqual(rc.rules.prh.rulePaths, ['./prh.yml']);
    assert.ok(rc.rules.prh.checkLink && rc.rules.prh.checkEmphasis && rc.rules.prh.checkBlockQuote);
  });
});

describe('writeGlossaryRules', () => {
  const dir = path.join(repo.root, 'i18n', '_example');
  test('writes both files, then is idempotent, and dryRun only reports', async () => {
    const first = await writeGlossaryRules('_example');
    assert.deepEqual(first.written.sort(), ['i18n/_example/.textlintrc.json', 'i18n/_example/prh.yml']);
    assert.ok(first.rules >= 1);
    const second = await writeGlossaryRules('_example');
    assert.deepEqual(second.written, []);
    await write(path.join(dir, 'prh.yml'), '# stale\n');
    const dry = await writeGlossaryRules('_example', {dryRun: true});
    assert.deepEqual(dry.written, ['i18n/_example/prh.yml']);
    assert.equal(await read(path.join(dir, 'prh.yml')), '# stale\n');
    const third = await writeGlossaryRules('_example');
    assert.deepEqual(third.written, ['i18n/_example/prh.yml']);
  });
  test('a glossary without forbidden renderings produces an empty rule list', async () => {
    await write(path.join(repo.root, 'i18n', 'zz', 'glossary.json'), JSON.stringify([{term: 'signal', keep: true}]));
    const r = await writeGlossaryRules('zz');
    assert.equal(r.rules, 0);
    assert.deepEqual(YAML.parse(await read(path.join(repo.root, 'i18n', 'zz', 'prh.yml'))).rules, []);
  });
});

describe('lintGlossary (textlint + prh)', () => {
  test('flags forbidden renderings in prose, headings, links and emphasis, never in code', async () => {
    await writeGlossaryRules('_example');
    const text = [
      '# Les signaux',
      '',
      'Un Gabarit et des **gabarit**. [gabarit](guide/x) en lien. Les gabarits (plural) are not a rule.',
      '',
      '```ts',
      'const gabarit = 1; // signaux',
      '```',
      '',
      'Du `gabarit` en code inline. Gabaritage non. injection de dépendance ici.',
      '',
    ].join('\n');
    const messages = await lintGlossary('_example', text, path.join(repo.root, 'i18n/_example/src/content/guide/x.md'));
    const found = messages.map((m) => [m.line, m.message]);
    assert.deepEqual(found, [
      [1, 'signaux => signal'],
      [3, 'Gabarit => template'],
      [3, 'gabarit => template'],
      [3, 'gabarit => template'],
      [9, 'injection de dépendance => injection de dépendances'],
    ]);
    assert.ok(messages.every((m) => m.ruleId === 'prh' && typeof m.column === 'number'));
  });
  test('clean text has no messages; the linter is reused', async () => {
    const t0 = Date.now();
    const messages = await lintGlossary('_example', '# Les signals\n\nUn template.\n', path.join(repo.root, 'i18n/_example/src/content/guide/y.md'));
    assert.deepEqual(messages, []);
    assert.ok(Date.now() - t0 < 2000);
  });
  test('an empty rule list lints without errors', async () => {
    assert.deepEqual(await lintGlossary('zz', 'Un gabarit.\n', path.join(repo.root, 'i18n/zz/src/a.md')), []);
  });
});
