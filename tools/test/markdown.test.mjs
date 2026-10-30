import assert from 'node:assert/strict';
import {describe, test} from 'node:test';
import {
  ALERT_KEYWORDS,
  annotateLines,
  countAlerts,
  countCodeFences,
  countDocsElements,
  extractHeadings,
  extractLinkTargets,
  extractStepTitles,
  getIdFromHeading,
  headingLabel,
  isProseLine,
  lex,
  proseLines,
} from '../lib/markdown.mjs';

describe('getIdFromHeading (port of adev heading.mts)', () => {
  test('lowercases, dashes for spaces and slashes, keeps letters, digits and dashes', () => {
    assert.equal(getIdFromHeading('What are signals?'), 'what-are-signals');
    assert.equal(getIdFromHeading('Input/Output'), 'input-output');
    assert.equal(getIdFromHeading('C++ & C# — "quotes" (parens)'), 'c--c--quotes-parens');
    assert.equal(getIdFromHeading('v20.1.0'), 'v2010');
  });
  test('keeps non-ASCII letters', () => {
    assert.equal(getIdFromHeading('Réactivité avec les signals'), 'réactivité-avec-les-signals');
    assert.equal(getIdFromHeading('日本語の見出し'), '日本語の見出し');
  });
  test('a custom {#id} wins, with or without inner spaces', () => {
    assert.equal(getIdFromHeading('Composants {#components}'), 'components');
    assert.equal(getIdFromHeading('Composants {# components }'), 'components');
    assert.equal(getIdFromHeading('Étape {#step-1_a}'), 'step-1_a');
  });
  test('headingLabel strips the custom id', () => {
    assert.equal(headingLabel('Composants {#components}'), 'Composants');
    assert.equal(headingLabel('Plain'), 'Plain');
  });
});

describe('extractHeadings', () => {
  test('returns headings below H1 with level, id, custom-id flag and 1-based line', () => {
    const md = '# Title\n\n## One\n\ntext\n\n### Two {#custom}\n\n#### Deep level\n';
    const h = extractHeadings(md);
    assert.deepEqual(
      h.map((x) => [x.level, x.id, x.hasCustomId, x.line, x.label]),
      [
        [2, 'one', false, 3, 'One'],
        [3, 'custom', true, 7, 'Two'],
        [4, 'deep-level', false, 9, 'Deep level'],
      ],
    );
  });
  test('ignores headings inside fenced and indented code', () => {
    const md = '## Real\n\n```md\n## not a heading\n```\n\n    ## indented code\n\n~~~\n### tilde fence\n~~~\n\n## Also real\n';
    assert.deepEqual(extractHeadings(md).map((h) => h.id), ['real', 'also-real']);
  });
  test('locates repeated headings on their own lines', () => {
    const md = '## Same\n\na\n\n## Same\n';
    assert.deepEqual(extractHeadings(md).map((h) => h.line), [1, 5]);
  });
});

describe('extractStepTitles', () => {
  test('docs-step titles get anchors like headings and accept custom ids', () => {
    const en = '<docs-workflow>\n<docs-step title="Create a component">\nx\n</docs-step>\n<docs-step title="Run it">\ny\n</docs-step>\n</docs-workflow>\n';
    const fr = '<docs-workflow>\n<docs-step title="Créer un composant {#create-a-component}">\nx\n</docs-step>\n<docs-step title="Lancer {#run-it}">\ny\n</docs-step>\n</docs-workflow>\n';
    assert.deepEqual(extractStepTitles(en).map((s) => [s.id, s.line]), [['create-a-component', 2], ['run-it', 5]]);
    const [step] = extractStepTitles(fr);
    assert.equal(step.id, 'create-a-component');
    assert.equal(step.label, 'Créer un composant');
    assert.ok(step.hasCustomId);
  });
  test('titles inside code blocks are not steps', () => {
    const md = '```html\n<docs-step title="In code">\n```\n\n<docs-step title="Real">\n</docs-step>\n';
    assert.deepEqual(extractStepTitles(md).map((s) => s.text), ['Real']);
  });
});

describe('structure counters', () => {
  test('docs elements are counted by tag, outside code only', () => {
    const md = '<docs-callout title="x">\n</docs-callout>\n<docs-code path="a" />\n<docs-code-multifile>\n\n```html\n<docs-code path="b" />\n```\n';
    assert.deepEqual(countDocsElements(md), {'docs-callout': 1, 'docs-code': 1, 'docs-code-multifile': 1});
  });
  test('code fences and indented code are counted', () => {
    const md = 'a\n\n```ts\nx\n```\n\n~~~\ny\n~~~\n\n    indented\n';
    assert.equal(countCodeFences(md), 3);
    assert.equal(countCodeFences('no code'), 0);
  });
  test('link targets come from Markdown links, images and HTML attributes, sorted', () => {
    const md = '[ok](guide/a) and ![img](a.png)\n\n<a href="https://x.dev">x</a> <docs-pill href="essentials" title="t"/>\n\n```md\n[not](nope)\n```\n';
    assert.deepEqual(extractLinkTargets(md), ['a.png', 'essentials', 'guide/a', 'https://x.dev']);
  });
  test('lex exposes marked tokens', () => {
    assert.equal(lex('# T\n\ntext\n')[0].type, 'heading');
  });
});

describe('line helpers', () => {
  test('annotateLines flags fenced code and the fence lines themselves', () => {
    const lines = annotateLines('a\n```ts\nb\n```\nc');
    assert.deepEqual(
      lines.map((l) => [l.line, l.inCode, Boolean(l.fenceStart), Boolean(l.fenceEnd)]),
      [
        ['a', false, false, false],
        ['```ts', true, true, false],
        ['b', true, false, false],
        ['```', true, false, true],
        ['c', false, false, false],
      ],
    );
  });
  test('a longer closing fence closes a shorter opening one; a shorter one does not', () => {
    const lines = annotateLines('````\n```\nstill code\n````\nout');
    assert.deepEqual(lines.map((l) => l.inCode), [true, true, true, true, false]);
  });
  test('proseLines drops code, inline code, URLs, tags and custom ids', () => {
    const md = 'Text with `code` and https://x.dev/ok and <b>tag</b> here {#id}\n```\ncode line\n```\n[link](target) end\n\n';
    const prose = proseLines(md);
    assert.deepEqual(prose.map((p) => p.line), [1, 5]);
    assert.ok(!prose[0].text.includes('code'));
    assert.ok(!prose[0].text.includes('https://'));
    assert.ok(!prose[0].text.includes('<b>'));
    assert.ok(!prose[0].text.includes('{#id}'));
    assert.equal(prose[1].text, '[link] end');
  });
  test('proseLines strips alert keywords, skips the attribute lines of multi-line tags and tolerates CRLF', () => {
    const md = [
      'TIP: Consultez les « bases » avant ce guide.',
      'NOTE :ceci est une note traduite.',
      '<docs-code header="mon-fichier.ts"',
      '  path="adev/src/content/examples/x.ts"',
      '  visibleLines="[1, 10]"/>',
      'Texte après la balise : avec "guillemets".',
      '<!-- un commentaire',
      'sur deux lignes -->',
      'Fin\r',
    ].join('\n');
    const prose = proseLines(md);
    assert.deepEqual(prose.map((p) => p.line), [1, 2, 6, 9]);
    assert.equal(prose[0].text, 'Consultez les « bases » avant ce guide.');
    assert.equal(prose[1].text, 'NOTE :ceci est une note traduite.', 'only the exact `KEYWORD: ` syntax is an alert');
    assert.equal(prose[2].text, 'Texte après la balise : avec "guillemets".');
    assert.equal(prose[3].text, 'Fin', 'no carriage return in the text');
  });
  test('countAlerts counts `KEYWORD: ` paragraphs outside code, per keyword', () => {
    assert.deepEqual(ALERT_KEYWORDS, ['NOTE', 'TIP', 'TODO', 'QUESTION', 'SUMMARY', 'TLDR', 'CRITICAL', 'IMPORTANT', 'HELPFUL']);
    const md = 'TIP: one\n\nNOTE: two\n\n```\nTIP: in code\n```\n\nTIP: three\nTIPS: not one\nNOTE :not one\n';
    assert.deepEqual(countAlerts(md), {TIP: 2, NOTE: 1});
  });
  test('isProseLine recognizes prose and not markup', () => {
    assert.ok(isProseLine('A sentence with words.'));
    assert.ok(isProseLine('<docs-callout title="Note"> with text after'));
    assert.ok(!isProseLine(''));
    assert.ok(!isProseLine('<docs-step title="x">'));
    assert.ok(!isProseLine('</docs-step>'));
    assert.ok(!isProseLine('| a | b |'));
    assert.ok(!isProseLine('---'));
    assert.ok(!isProseLine('<!-- comment -->'));
    assert.ok(!isProseLine('![alt](img.png)'));
  });
});
