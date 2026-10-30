import assert from 'node:assert/strict';
import {describe, test} from 'node:test';
import {MECHANICAL_TOKEN_RE, applyMechanicalChange, classifyDiff, diffLines, formatDiff, mechanicalPairs, proseSkeleton} from '../lib/diff.mjs';

describe('diffLines', () => {
  test('produces same/add/del ops with indexes into both sides', () => {
    const ops = diffLines('a\nb\nc', 'a\nc\nd');
    assert.deepEqual(ops, [
      {type: 'same', line: 'a', aIndex: 0, bIndex: 0},
      {type: 'del', line: 'b', aIndex: 1},
      {type: 'same', line: 'c', aIndex: 2, bIndex: 1},
      {type: 'add', line: 'd', bIndex: 2},
    ]);
  });
  test('a trailing newline is a final empty line, like split("\\n") everywhere else', () => {
    assert.equal(diffLines('a\n', 'a\n').length, 2);
    assert.equal(diffLines('a', 'a\n').filter((o) => o.type === 'add').length, 1);
  });
  test('identical texts yield only same ops', () => {
    assert.ok(diffLines('x\ny', 'x\ny').every((o) => o.type === 'same'));
  });
});

describe('formatDiff', () => {
  test('returns unified hunks without file headers', () => {
    const out = formatDiff('a\nb\nc\n', 'a\nB\nc\n');
    assert.ok(out.startsWith('@@'), out.split('\n')[0]);
    assert.match(out, /^-b$/m);
    assert.match(out, /^\+B$/m);
  });
  test('context is configurable', () => {
    const base = Array.from({length: 10}, (_, i) => `l${i}`).join('\n');
    const out = formatDiff(base, base.replace('l5', 'L5'), {context: 0});
    assert.equal(out.split('\n').filter((l) => l.startsWith(' ')).length, 0);
  });
});

describe('mechanical tokens', () => {
  test('the token regex matches link targets, code spans and URLs', () => {
    assert.deepEqual('See [x](guide/a) and `code` at https://a.dev/b.'.match(MECHANICAL_TOKEN_RE), ['](guide/a)', '`code`', 'https://a.dev/b.']);
  });
  test('proseSkeleton blanks tokens and normalizes whitespace', () => {
    assert.equal(proseSkeleton('See  [x](guide/a)  now'), 'See [x\u0000 now');
    assert.equal(proseSkeleton('See [x](guide/old)'), proseSkeleton('See [x](guide/new)'));
  });
  test('mechanicalPairs pairs del/add lines whose prose is identical', () => {
    const ops = diffLines('See [x](a).\nOther text.\n', 'See [x](b).\nNew sentence.\n');
    const pairs = mechanicalPairs(ops);
    assert.equal(pairs.size, 1);
    const [[d, a]] = [...pairs];
    assert.equal(ops[d].line, 'See [x](a).');
    assert.equal(ops[a].line, 'See [x](b).');
  });
});

describe('classifyDiff', () => {
  const base = '# T\n\nAlpha beta gamma.\n\n```ts\nconst a = 1;\n```\n\nDelta.\n';
  test('a: only code, link targets, whitespace or markup changed', () => {
    assert.equal(classifyDiff(base, base.replace('const a = 1', 'const a = 2')).class, 'a');
    assert.equal(classifyDiff(base, base.replace('Delta.', 'Delta.\n\n<docs-code path="x" />')).class, 'a');
    const r = classifyDiff('See [g](old).\n', 'See [g](new).\n');
    assert.equal(r.class, 'a');
    assert.equal(r.proseChanged, 0);
    assert.equal(r.added, 1);
    assert.equal(r.removed, 1);
  });
  test('b: up to 5 prose lines; c: up to 30; d: more or restructured', () => {
    assert.equal(classifyDiff(base, base.replace('Alpha beta gamma.', 'Alpha beta gamma delta.')).class, 'b');
    const many = base + Array.from({length: 12}, (_, i) => `Line ${i} with some words.`).join('\n');
    assert.equal(classifyDiff(base, many).class, 'c');
    const lots = base + Array.from({length: 40}, (_, i) => `Line ${i} with some words.`).join('\n');
    assert.equal(classifyDiff(base, lots).class, 'd');
    assert.equal(classifyDiff(base, base + '\n## New section\n').class, 'd');
    assert.equal(classifyDiff(base, base.replace('# T', '## T')).class, 'd');
  });
  test('identical texts are class a with nothing changed', () => {
    const r = classifyDiff(base, base);
    assert.deepEqual([r.class, r.added, r.removed, r.proseChanged], ['a', 0, 0, 0]);
  });
});

describe('applyMechanicalChange', () => {
  const oldEn = '# T\n\nSee the [guide](guide/old) for details.\n\n```ts\nconst a = 1;\n```\n\nDone.\n';
  const newEn = '# T\n\nSee the [guide](guide/new) for details.\n\n```ts\nconst a = 2;\nconst b = 3;\n```\n\nDone.\n';
  const fr = '# T\n\nVoir le [guide](guide/old) pour les détails.\n\n```ts\nconst a = 1;\n```\n\nTerminé.\n';
  test('swaps link targets in paired prose lines and takes new code lines verbatim', () => {
    const out = applyMechanicalChange(oldEn, newEn, fr).join('\n');
    assert.equal(out, '# T\n\nVoir le [guide](guide/new) pour les détails.\n\n```ts\nconst a = 2;\nconst b = 3;\n```\n\nTerminé.\n');
  });
  test('keeps a trailing newline and line parity', () => {
    const out = applyMechanicalChange(oldEn, newEn, fr);
    assert.equal(out.length, newEn.split('\n').length);
    assert.equal(out.at(-1), '');
  });
  test('refuses prose changes and broken line parity', () => {
    assert.throws(() => applyMechanicalChange(oldEn, newEn.replace('Done.', 'All done.'), fr), /class is b/);
    assert.throws(() => applyMechanicalChange(oldEn, newEn, fr + 'extra\n'), /line parity/);
  });
  test('refuses when a token cannot be located exactly once in the translation', () => {
    const en1 = 'Read [a](x) and [b](x).\n';
    const en2 = 'Read [a](y) and [b](x).\n';
    const tr = 'Lire [a](x) et [b](x).\n';
    assert.throws(() => applyMechanicalChange(en1, en2, tr), /exactly once/);
  });
});
