import assert from 'node:assert/strict';
import path from 'node:path';
import {after, before, describe, test} from 'node:test';
import {execa} from 'execa';
import {makeRepo, removeDir, useRepo, write} from './helpers.mjs';

const repo = await makeRepo({example: false});
useRepo({root: repo.root});
const {blobHash, copySnapshot, hasMarkerLine, isSnapshot, listOverlayFiles, looksLikeText, normalizeNewlines, listSnapshots, markerStyle, readMarker, readMarkerOf, setMarker, sidecarOf, snapshotOf, stripMarker, translatedOf, writeMarked} =
  await import('../lib/snapshots.mjs');
const {readText} = await import('../lib/fs.mjs');

after(() => removeDir(repo.root));

describe('names', () => {
  test('snapshot detection and mapping both ways', () => {
    assert.ok(isSnapshot('a/b/page.en.md'));
    assert.ok(isSnapshot('x.en.html'));
    assert.ok(!isSnapshot('a/b/page.md'));
    assert.ok(!isSnapshot('a/en/page.md'));
    assert.equal(snapshotOf('a/b/page.md'), 'a/b/page.en.md');
    assert.equal(snapshotOf('app/x.component.html'), 'app/x.component.en.html');
    assert.equal(translatedOf('a/b/page.en.md'), 'a/b/page.md');
    assert.equal(translatedOf('a/b/page.md'), 'a/b/page.md');
  });
});

describe('blobHash', () => {
  test('matches git hash-object for strings and buffers', async () => {
    // echo -n "hello" | git hash-object --stdin
    assert.equal(blobHash('hello'), 'b6fc4c620b67d95f953a5c1c1230aaab5db5a1b0');
    assert.equal(blobHash(Buffer.from('hello')), blobHash('hello'));
    const content = 'Réactivité\n';
    const {stdout} = await execa('git', ['hash-object', '--stdin'], {input: content});
    assert.equal(blobHash(content), stdout.trim());
  });
  test('CRLF text hashes like its LF form (what git commits under text=auto), binaries are untouched', async () => {
    assert.equal(blobHash('a\r\nb\r\n'), blobHash('a\nb\n'));
    assert.equal(blobHash(Buffer.from('a\r\nb\r\n')), blobHash('a\nb\n'));
    assert.equal(normalizeNewlines('x\r\ny'), 'x\ny');
    const binary = Buffer.from([0x89, 0x50, 0x0d, 0x0a, 0x00, 0x0d, 0x0a]);
    assert.ok(!looksLikeText(binary));
    assert.equal(normalizeNewlines(binary), binary, 'a buffer with a NUL byte is returned as is');
    assert.notEqual(blobHash(binary), blobHash(Buffer.from([0x89, 0x50, 0x0a, 0x00, 0x0a])));
    const src = path.join(repo.root, 'crlf.en.md');
    const dest = path.join(repo.root, 'tmp', 'crlf.en.md');
    await write(src, 'Line one\r\nLine two\r\n');
    await copySnapshot(src, dest);
    assert.equal(await readText(dest), 'Line one\nLine two\n');
  });
});

describe('markers', () => {
  test('styles per extension', () => {
    assert.deepEqual(markerStyle('x.md'), {open: '<!-- source: ', close: ' -->'});
    assert.deepEqual(markerStyle('x.ts'), {open: '// source: ', close: ''});
    assert.equal(markerStyle('x.json'), null);
    assert.deepEqual(markerStyle('x.yml'), {open: '# source: ', close: ''});
  });
  test('set, read, strip and replace', () => {
    const h = blobHash('english');
    const marked = setMarker('content/guide/x.md', '# Titre\n', h);
    assert.equal(marked.split('\n')[0], `<!-- source: ${h} -->`);
    assert.equal(readMarker(marked), h);
    assert.ok(hasMarkerLine(marked));
    assert.ok(!hasMarkerLine('# Titre\n'));
    assert.equal(stripMarker(marked), '# Titre\n');
    assert.equal(stripMarker('# no marker\n'), '# no marker\n');
    const h2 = blobHash('english v2');
    assert.equal(setMarker('x.md', marked, h2).split('\n')[0], `<!-- source: ${h2} -->`);
    assert.equal(setMarker('x.md', marked, h2).split('\n').length, marked.split('\n').length);
  });
  test('ts markers and marker found within the first three lines', () => {
    const h = blobHash('english');
    const ts = setMarker('app/x.ts', 'export const a = 1;\n', h);
    assert.equal(ts.split('\n')[0], `// source: ${h}`);
    assert.equal(readMarker(ts), h);
    assert.equal(readMarker(`/* banner */\n# source: ${h}\nbody`), h);
    assert.equal(readMarker(`a\nb\nc\n# source: ${h}`), null);
    assert.equal(readMarker('<!-- source: nothash -->'), null);
  });
  test('json cannot carry a marker', () => {
    assert.equal(setMarker('x.json', '{}', blobHash('x')), '{}');
    assert.equal(sidecarOf('a/versions.json'), 'a/versions.json.source');
  });
  test('writeMarked and readMarkerOf: in the content for text, in a sidecar for JSON', async () => {
    const h = blobHash('english');
    const md = path.join(repo.root, 'scratch', 'page.md');
    await writeMarked(md, '# Titre\n', h);
    assert.equal(await readText(md), `<!-- source: ${h} -->\n# Titre\n`);
    assert.equal(await readMarkerOf(md), h);
    assert.equal(await readMarkerOf(md, await readText(md)), h);
    const json = path.join(repo.root, 'scratch', 'versions.json');
    await writeMarked(json, '[]\n', h);
    assert.equal(await readText(json), '[]\n');
    assert.equal((await readText(sidecarOf(json))).trim(), h);
    assert.equal(await readMarkerOf(json), h);
    const other = path.join(repo.root, 'scratch', 'other.json');
    await write(other, '{}');
    assert.equal(await readMarkerOf(other), null);
  });
});

describe('listing a language overlay', () => {
  before(async () => {
    const src = path.join(repo.root, 'i18n', 'xx', 'src');
    await write(path.join(src, 'content', 'guide', 'a.md'), 'a');
    await write(path.join(src, 'content', 'guide', 'a.en.md'), 'a');
    await write(path.join(src, 'content', 'guide', 'orphan.en.md'), 'o');
    await write(path.join(src, 'app', 'x.component.html'), 'x');
    await write(path.join(src, 'app', 'x.component.en.html'), 'x');
    await write(path.join(src, 'assets', 'others', 'versions.json'), '[]');
    await write(path.join(src, 'assets', 'others', 'versions.json.source'), 'abc');
    await write(path.join(src, '.gitkeep'), '');
  });
  test('listSnapshots maps every *.en.* file to its translation', async () => {
    const snaps = await listSnapshots('xx');
    assert.deepEqual(
      snaps.map((s) => s.rel),
      ['app/x.component.html', 'content/guide/a.md', 'content/guide/orphan.md'],
    );
    assert.ok(snaps[1].snapshot.endsWith(path.join('content', 'guide', 'a.en.md')));
    assert.ok(snaps[1].translated.endsWith(path.join('content', 'guide', 'a.md')));
  });
  test('listOverlayFiles excludes snapshots, sidecars and .gitkeep', async () => {
    assert.deepEqual(await listOverlayFiles('xx'), ['app/x.component.html', 'assets/others/versions.json', 'content/guide/a.md']);
  });
  test('an unknown language has nothing', async () => {
    assert.deepEqual(await listSnapshots('nope'), []);
    assert.deepEqual(await listOverlayFiles('nope'), []);
  });
});
