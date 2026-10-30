/**
 * Parity with upstream: our heading-id port must produce the anchors adev produces, or the
 * anchor check would let broken links through. Upstream's TypeScript is loaded with jiti from
 * the pinned checkout when origin/ is initialized (the real thing, at the real pin), otherwise
 * from the copy kept in the fixture upstream.
 */
import assert from 'node:assert/strict';
import path from 'node:path';
import {test} from 'node:test';
import {exists, globFiles, readText} from '../lib/fs.mjs';
import {extractHeadings, extractStepTitles, getIdFromHeading} from '../lib/markdown.mjs';
import {adevSrc, originDir} from '../lib/paths.mjs';
import {fixturesDir} from './helpers.mjs';

const REL = path.join('adev', 'shared-docs', 'pipeline', 'shared', 'heading.mts');
const pinned = path.join(originDir, REL);
const checkout = (await exists(pinned)) ? originDir : path.join(fixturesDir, 'upstream');
const headingMts = path.join(checkout, REL);

test(`getIdFromHeading matches upstream heading.mts (${checkout === originDir ? 'pinned origin' : 'fixture copy'})`, async () => {
  const {createJiti} = await import('jiti');
  const upstream = await createJiti(import.meta.url, {interopDefault: true}).import(headingMts);
  assert.equal(typeof upstream.getIdFromHeading, 'function');

  const samples = [
    'What are signals?',
    'Input/Output',
    'Composants {#components}',
    'Réactivité avec les signals',
    '  Spaces   everywhere ',
    'C++ & C# — "quotes" and (parens)',
    'Étape 1 : créer un composant',
    'Ünïcödé — ñ, ß, ø',
    '日本語の見出し',
    'Custom {# spaced-id }',
    '@Component() decorator',
    'v20.1.0',
    'Que sont les signaux ?',
  ];
  // Every heading and docs-step title of the docs at hand, so real content is covered too.
  const src = adevSrc(checkout);
  const files = await globFiles(['content/**/*.md', '!content/examples/**'], {cwd: src});
  for (const rel of files.slice(0, 400)) {
    const text = await readText(path.join(src, rel));
    for (const h of extractHeadings(text)) samples.push(h.text);
    for (const s of extractStepTitles(text)) samples.push(s.text);
  }
  assert.ok(samples.length > 13, 'content headings were collected');
  for (const heading of samples) {
    assert.equal(getIdFromHeading(heading), upstream.getIdFromHeading(heading), `heading: ${JSON.stringify(heading)}`);
  }
});

test('extractHeadingIds (upstream) and our extractors agree on the fixture docs', async () => {
  const {createJiti} = await import('jiti');
  const upstream = await createJiti(import.meta.url, {interopDefault: true}).import(headingMts);
  if (typeof upstream.extractHeadingIds !== 'function') return; // older upstream
  const src = adevSrc(path.join(fixturesDir, 'upstream'));
  for (const rel of await globFiles(['content/**/*.md', '!content/examples/**'], {cwd: src})) {
    const text = await readText(path.join(src, rel));
    const ours = [...extractHeadings(text).map((h) => h.id), ...extractStepTitles(text).map((s) => s.id)].sort();
    const theirs = [...upstream.extractHeadingIds(text)].sort();
    assert.deepEqual(ours, theirs, rel);
  }
});
