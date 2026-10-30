/**
 * Knowledge about the adev app that the dictionaries depend on: where the English strings are
 * and how to put translations back. Templates are parsed with angular-html-parser (the parser
 * Prettier uses for Angular templates) and edited by source span, so nothing else in the file
 * is reformatted. Everything here reads/writes strings; no Bazel involved.
 */
import path from 'node:path';
import {parse} from 'angular-html-parser';
import {exists, globFiles, readText, writeText} from './fs.mjs';
import {ALERT_KEYWORDS} from './markdown.mjs';
import {CONTENT_EXCLUDES, CONTENT_GLOBS, INDEX_HTML, NAVIGATION_FILE, UI_TEMPLATE_GLOBS, adevDir, adevSrc} from './paths.mjs';

// ---------------------------------------------------------------------------------------------
// Content scope

/** Markdown files in scope for translation, relative to adev/src, for a checkout. */
export async function listContentFiles(checkoutDir) {
  const patterns = [...CONTENT_GLOBS, ...CONTENT_EXCLUDES.map((e) => `!${e}`)];
  return globFiles(patterns, {cwd: adevSrc(checkoutDir)});
}

// ---------------------------------------------------------------------------------------------
// Navigation labels (adev/src/app/routing/navigation-entries/index.ts)
// The file is prettier-formatted TypeScript; `label: '…'` has been stable for years, so a regex
// is enough (angular-ja and angular-docs-es rely on the same shape).

const LABEL_RE = /(\blabel:\s*)'((?:[^'\\]|\\.)*)'/g;

function unescapeTs(s) {
  return s.replace(/\\(['\\])/g, '$1');
}
function escapeTs(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/** Unique navigation labels in source order. */
export function extractNavLabels(tsSource) {
  const seen = new Set();
  const labels = [];
  for (const m of tsSource.matchAll(LABEL_RE)) {
    const label = unescapeTs(m[2]);
    if (!seen.has(label)) {
      seen.add(label);
      labels.push(label);
    }
  }
  return labels;
}

/**
 * Replace labels using `dict` (English -> translation). Returns {source, missing, applied}
 * where `missing` lists labels without a dictionary entry (left in English).
 */
export function applyNavLabels(tsSource, dict) {
  const missing = new Set();
  let applied = 0;
  const source = tsSource.replace(LABEL_RE, (whole, prefix, raw) => {
    const label = unescapeTs(raw);
    const translated = dict[label];
    if (translated === undefined || translated === '') {
      missing.add(label);
      return whole;
    }
    if (translated !== label) applied++;
    return `${prefix}'${escapeTs(translated)}'`;
  });
  return {source, missing: [...missing], applied};
}

// ---------------------------------------------------------------------------------------------
// UI strings in templates (text nodes and a few attributes)

const TEXT_ATTRS = new Set(['aria-label', 'aria-description', 'title', 'placeholder', 'alt']);
/** Elements whose text is never UI copy. */
const SKIP_ELEMENTS = new Set(['code', 'pre', 'script', 'style', 'docs-icon', 'svg']);
// Both Angular syntax flags are required: without tokenizeAngularLetDeclaration the parser
// does not terminate on templates that start with `@let`.
const PARSE_OPTIONS = {
  canSelfClose: true,
  allowHtmComponentClosingTags: true,
  tokenizeAngularBlocks: true,
  tokenizeAngularLetDeclaration: true,
};

function normalizeText(t) {
  return t.replace(/\s+/g, ' ').trim();
}

function looksLikeString(t) {
  // Skip things that are clearly not UI copy: single symbols, code-ish tokens, file names,
  // Material icon ligatures (`more_horiz`), identifiers (`searchTerm`), entities (`&#64;defer`).
  if (t.length < 2) return false;
  if (!/\p{L}/u.test(t)) return false;
  if (t.includes('{{') || t.includes('}}')) return false;
  if (/^[\w./:-]+\.(ts|html|css|scss|json|js|mjs)$/i.test(t)) return false;
  if (/^[a-z][A-Za-z0-9_.:/-]*$/.test(t)) return false;
  if (/^&#?\w+;\S*$/.test(t)) return false;
  return true;
}

// Node kinds of angular-html-parser: text, element, block (@if/@for/…), comment, letDeclaration,
// docType, cdata, expansion. Only text and attributes carry UI copy; comments never do.
function isElement(node) {
  return node.kind === 'element';
}
function isText(node) {
  return node.kind === 'text';
}
/** Element name without the parser's namespace prefix (`:svg:style` -> `style`). */
function elementName(el) {
  return el.name.replace(/^:[a-z]+:/, '');
}
function isIconElement(el) {
  const name = elementName(el);
  if (name === 'docs-icon') return true;
  if (name !== 'i' && name !== 'span') return false;
  return el.attrs.some((a) => a.name === 'class' && /material-symbols|material-icons/.test(a.value));
}

/**
 * Visible strings of a template with their source spans:
 * [{text, start, end, kind: 'text' | 'attr'}], where [start, end) is the exact region to replace.
 */
export function templateStringSpans(html) {
  const {rootNodes} = parse(html, PARSE_OPTIONS);
  const found = [];
  const visit = (nodes, skipping) => {
    for (const node of nodes) {
      if (isText(node)) {
        if (skipping) continue;
        const raw = node.value;
        const start = node.sourceSpan.start.offset;
        const end = node.sourceSpan.end.offset;
        const rawSlice = html.slice(start, end);
        const lead = rawSlice.match(/^\s*/)[0].length;
        const trail = rawSlice.match(/\s*$/)[0].length;
        const text = normalizeText(rawSlice);
        if (raw.trim() && looksLikeString(text) && end - trail > start + lead) {
          found.push({text, start: start + lead, end: end - trail, kind: 'text'});
        }
        continue;
      }
      if (isElement(node)) {
        const skipChildren = skipping || SKIP_ELEMENTS.has(elementName(node)) || isIconElement(node);
        for (const attr of node.attrs) {
          if (!TEXT_ATTRS.has(attr.name) || !attr.valueSpan) continue;
          const s = attr.valueSpan.start.offset;
          const e = attr.valueSpan.end.offset;
          const rawValue = html.slice(s, e);
          const quoted = /^["']/.test(rawValue) && rawValue.length >= 2;
          const inner = quoted ? rawValue.slice(1, -1) : rawValue;
          const text = normalizeText(inner);
          if (looksLikeString(text)) found.push({text, start: quoted ? s + 1 : s, end: quoted ? e - 1 : e, kind: 'attr'});
        }
        visit(node.children, skipChildren);
        continue;
      }
      if (node.kind === 'block' && Array.isArray(node.children)) visit(node.children, skipping); // @if / @for / @switch
    }
  };
  visit(rootNodes, false);
  return found.sort((a, b) => a.start - b.start);
}

/** Visible strings of a template, deduplicated, in source order. */
export function extractTemplateStrings(html) {
  const seen = new Set();
  const out = [];
  for (const s of templateStringSpans(html)) {
    if (!seen.has(s.text)) {
      seen.add(s.text);
      out.push(s.text);
    }
  }
  return out;
}

/**
 * Apply a template dictionary (English -> translation) by source span. Attribute values get
 * their double quotes escaped. Returns {html, missing, applied}.
 */
export function applyTemplateStrings(html, dict) {
  const spans = templateStringSpans(html);
  const missing = new Set();
  const edits = [];
  for (const s of spans) {
    const translated = dict[s.text];
    if (translated === undefined || translated === '') {
      missing.add(s.text);
      continue;
    }
    if (translated === s.text) continue;
    edits.push({...s, replacement: s.kind === 'attr' ? translated.replace(/"/g, '&quot;') : translated});
  }
  let out = html;
  for (const e of edits.sort((a, b) => b.start - a.start)) {
    out = out.slice(0, e.start) + e.replacement + out.slice(e.end);
  }
  return {html: out, missing: [...missing], applied: edits.length};
}

/** Templates and their strings for a checkout: {path relative to adev/: [strings]} (only templates with strings). */
export async function extractAllTemplateStrings(checkoutDir) {
  const base = adevDir(checkoutDir);
  const files = await globFiles(UI_TEMPLATE_GLOBS, {cwd: base});
  const out = {};
  for (const rel of files) {
    const strings = extractTemplateStrings(await readText(path.join(base, rel)));
    if (strings.length) out[rel] = strings;
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// index.html find/replace pairs

/**
 * Default pairs for a site. Each `find` must exist in the current index.html; pairs whose
 * `find` is absent are dropped (and reported) so the dictionary never ships a dead pair.
 */
export function defaultIndexHtmlPairs(indexHtml, site, rules = {}) {
  const dirAttr = site.direction === 'rtl' ? ' dir="rtl"' : '';
  const candidates = [
    {find: '<html lang="en"', replace: `<html lang="${site.lang}"${dirAttr}`, note: 'document language'},
    {find: '<title>Angular</title>', replace: '<title>Angular</title>', note: 'translate the title if you wish'},
    {
      find: 'content="The web development framework for building modern apps."',
      replace: 'content="The web development framework for building modern apps."',
      note: 'description, og:description, twitter:description: translate',
    },
    {find: 'href="https://angular.dev"', replace: `href="${site.siteUrl}"`, note: 'canonical'},
    {find: 'content="https://angular.dev/"', replace: `content="${site.siteUrl}/"`, note: 'og:url, twitter:url'},
    {
      find: 'content="https://angular.dev/assets/images/ng-image.jpg"',
      replace: `content="${site.siteUrl}/assets/images/ng-image.jpg"`,
      note: 'social image',
    },
  ];
  for (const href of rules.fonts ?? []) {
    candidates.push({
      find: '<!-- Fonts -->',
      replace: `<!-- Fonts -->\n    <link href="${href}" rel="stylesheet" />`,
      note: 'extra font stylesheet',
    });
  }
  const pairs = [];
  const dropped = [];
  for (const c of candidates) {
    if (indexHtml.includes(c.find)) pairs.push(c);
    else dropped.push(c);
  }
  return {pairs, dropped};
}

/** Apply find/replace pairs (every occurrence). Returns {text, missing} where missing = the `find` texts absent from `text`. */
export function applyPairs(text, pairs) {
  const missing = [];
  let out = text;
  for (const p of pairs) {
    if (!p?.find) continue;
    if (!out.includes(p.find)) {
      missing.push(p.find);
      continue;
    }
    out = out.split(p.find).join(p.replace ?? '');
  }
  return {text: out, missing};
}

/** index.html pairs. Returns {html, missing}. */
export function applyIndexHtmlPairs(indexHtml, pairs) {
  const {text, missing} = applyPairs(indexHtml, pairs);
  return {html: text, missing};
}

// ---------------------------------------------------------------------------------------------
// Strings the docs pipeline bakes into every page (adev/shared-docs/pipeline/**/*.mts)
//
// Alert labels ("NOTE:", "TIP:"…), the "Learn more" of cards, the edit-page tooltip, the
// prefer/avoid headers of code comparisons: TypeScript literals rendered at build time, outside
// any template. dictionaries/pipeline.json holds find/replace pairs per file, like index.html;
// `find` is the upstream text with just enough context to be unique, and must match exactly.

const PIPELINE_DIR = 'shared-docs/pipeline/shared/marked';
const ALERT_LABELS = {NOTE: 'NOTE', TIP: 'TIP', TODO: 'TODO', QUESTION: 'QUESTION', SUMMARY: 'SUMMARY', TLDR: 'TL;DR', CRITICAL: 'CRITICAL', IMPORTANT: 'IMPORTANT', HELPFUL: 'HELPFUL'};

/** Default pairs, in upstream order; `replace` starts equal to `find` (English) for a translator to edit. */
export const PIPELINE_PAIR_SEEDS = [
  ...ALERT_KEYWORDS.map((k) => ({
    file: `${PIPELINE_DIR}/extensions/docs-alert.mts`,
    find: `${k} = '${ALERT_LABELS[k]}',`,
    note: `label of \`${k}:\` alerts (translate the quoted text only; the keyword in Markdown stays ${k})`,
  })),
  {file: `${PIPELINE_DIR}/extensions/docs-card/docs-card.mts`, find: ": 'Learn more'}", note: 'link text of a docs-card that has no link text of its own'},
  {file: `${PIPELINE_DIR}/extensions/docs-video.mts`, find: "'Play video'", note: 'accessible label of the video play button'},
  {file: `${PIPELINE_DIR}/extensions/docs-video.mts`, find: '`Play video: ${', note: 'same, followed by the video title; keep the `${`'},
  {file: `${PIPELINE_DIR}/extensions/docs-code/format/index.mts`, find: "? 'Prefer' : 'Avoid'", note: 'headers of prefer/avoid code comparisons'},
  {file: `${PIPELINE_DIR}/transformations/heading.mts`, find: 'title="Edit this page" aria-label="Edit this page"', note: 'tooltip and accessible label of the edit icon next to page titles'},
  {file: `${PIPELINE_DIR}/transformations/heading.mts`, find: 'aria-label="Link to ${', note: 'accessible label of heading anchors, followed by the heading; keep the `${`'},
].map((p) => ({...p, replace: p.find}));

/** Seeds whose file and text exist in a checkout: {pairs, dropped}. */
export async function defaultPipelinePairs(checkoutDir) {
  const sources = new Map();
  const pairs = [];
  const dropped = [];
  for (const seed of PIPELINE_PAIR_SEEDS) {
    if (!sources.has(seed.file)) {
      const file = path.join(adevDir(checkoutDir), seed.file);
      sources.set(seed.file, (await exists(file)) ? await readText(file) : null);
    }
    const source = sources.get(seed.file);
    if (source !== null && source.includes(seed.find)) pairs.push({...seed});
    else dropped.push({...seed});
  }
  return {pairs, dropped};
}

function groupByFile(pairs) {
  const byFile = new Map();
  for (const p of pairs) {
    if (!p?.file || !p?.find) continue;
    (byFile.get(p.file) ?? byFile.set(p.file, []).get(p.file)).push(p);
  }
  return byFile;
}

/** Pairs whose `find` is absent from their upstream file (or whose file is gone): [{file, find}]. */
export async function checkPipelinePairs(checkoutDir, pairs) {
  const missing = [];
  for (const [rel, list] of groupByFile(pairs)) {
    const file = path.join(adevDir(checkoutDir), rel);
    const source = (await exists(file)) ? await readText(file) : '';
    for (const find of applyPairs(source, list).missing) missing.push({file: rel, find});
  }
  return {missing};
}

/** Apply the pairs to the files of a checkout (the build directory). Returns {applied, missing}. */
export async function applyPipelinePairs(checkoutDir, pairs) {
  const missing = [];
  let applied = 0;
  for (const [rel, list] of groupByFile(pairs)) {
    const file = path.join(adevDir(checkoutDir), rel);
    if (!(await exists(file))) {
      for (const p of list) missing.push({file: rel, find: p.find});
      continue;
    }
    const {text, missing: absent} = applyPairs(await readText(file), list);
    for (const find of absent) missing.push({file: rel, find});
    applied += list.length - absent.length;
    await writeText(file, text);
  }
  return {applied, missing};
}

export const files = {INDEX_HTML, NAVIGATION_FILE};
