/**
 * Markdown helpers built on `marked`, the parser adev itself uses, so structure checks see the
 * same headings, code blocks and HTML blocks as the build. Line-based helpers remain for
 * typography checks and diff classes, where lines are the unit.
 */
import {marked} from 'marked';

const CUSTOM_ID_RE = /{#\s*([\w-]+)\s*}/;

/**
 * Port of adev/shared-docs/pipeline/shared/heading.mts#getIdFromHeading:
 * custom `{#id}` wins, otherwise lowercase, spaces and slashes to dashes, keep letters, digits, dashes.
 * tools/test/parity.test.mjs compares it with upstream's implementation when origin/ is present.
 */
export function getIdFromHeading(heading) {
  const custom = CUSTOM_ID_RE.exec(heading)?.[1];
  if (custom) return custom;
  return heading
    .toLowerCase()
    .replace(/\s|\//g, '-')
    .replace(/[^\p{L}\d\-]/gu, '');
}

/** Heading text without a trailing `{#id}`. */
export function headingLabel(heading) {
  return heading.replace(/\s*{#\s*[\w-]+\s*}\s*$/, '').trim();
}

/** Tokens of a document (marked lexer). */
export function lex(content) {
  return marked.lexer(content);
}

/** Walk every token depth-first. */
export function walk(tokens, fn) {
  marked.walkTokens(tokens, fn);
}

/** 1-based line of the n-th occurrence of `raw` after `cursor`; advances the cursor. */
function locate(content, raw, state) {
  let idx = content.indexOf(raw, state.cursor);
  if (idx === -1) idx = state.cursor;
  state.cursor = idx + raw.length;
  return content.slice(0, idx).split('\n').length;
}

/** Headings below H1 in document order: [{level, text, label, id, hasCustomId, line}]. */
export function extractHeadings(content) {
  const headings = [];
  const state = {cursor: 0};
  walk(lex(content), (t) => {
    if (t.type !== 'heading' || t.depth < 2) return;
    const text = t.text.trim();
    headings.push({
      level: t.depth,
      text,
      label: headingLabel(text),
      id: getIdFromHeading(text),
      hasCustomId: CUSTOM_ID_RE.test(text),
      line: locate(content, t.raw, state),
    });
  });
  return headings;
}

/**
 * `<docs-step title="…">` titles outside code: adev renders them through the same heading
 * renderer as `##` headings, so they get an anchor from the title and accept `{#custom-id}`.
 */
export function extractStepTitles(content) {
  const steps = [];
  const state = {cursor: 0};
  walk(lex(content), (t) => {
    if (t.type !== 'html') return;
    const base = locate(content, t.raw, state) - 1;
    for (const m of t.raw.matchAll(/<docs-step\b[^>]*?\btitle="([^"]*)"/g)) {
      const text = m[1];
      const line = base + t.raw.slice(0, m.index).split('\n').length;
      steps.push({text, label: headingLabel(text), id: getIdFromHeading(text), hasCustomId: CUSTOM_ID_RE.test(text), line});
    }
  });
  return steps;
}

/** Count of `<docs-*>` opening tags by tag name (block and inline HTML, never inside code). */
export function countDocsElements(content) {
  const counts = {};
  walk(lex(content), (t) => {
    if (t.type !== 'html') return;
    for (const m of t.raw.matchAll(/<(docs-[a-z-]+)(?=[\s>/])/g)) counts[m[1]] = (counts[m[1]] ?? 0) + 1;
  });
  return counts;
}

/** Number of code blocks (fenced or indented). */
export function countCodeFences(content) {
  let n = 0;
  walk(lex(content), (t) => {
    if (t.type === 'code') n++;
  });
  return n;
}

/** Link and image targets (Markdown links and href/src attributes in HTML), as a sorted multiset. */
export function extractLinkTargets(content) {
  const targets = [];
  walk(lex(content), (t) => {
    if (t.type === 'link' || t.type === 'image') targets.push(t.href);
    if (t.type === 'html') for (const m of t.raw.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) targets.push(m[1]);
  });
  return targets.sort();
}

/**
 * Walk lines and report whether each is inside a fenced code block (line-level view used by the
 * diff classifier and the typography checks).
 */
export function annotateLines(content) {
  const out = [];
  let fence = null;
  content.split('\n').forEach((line, index) => {
    const m = /^(\s{0,3})(`{3,}|~{3,})/.exec(line);
    if (m) {
      if (!fence) {
        fence = m[2][0].repeat(m[2].length);
        out.push({line, index, inCode: true, fenceStart: true});
        return;
      }
      if (line.trim().startsWith(fence)) {
        fence = null;
        out.push({line, index, inCode: true, fenceEnd: true});
        return;
      }
    }
    out.push({line, index, inCode: fence !== null});
  });
  return out;
}

/**
 * Alert keywords of adev's pipeline (shared-docs/pipeline/shared/marked/extensions/docs-alert.mts):
 * a paragraph starting with `NOTE: ` renders as an alert. The keyword and its plain colon are
 * syntax and stay in English in every language; the label the reader sees is rendered by the
 * pipeline (translated through dictionaries/pipeline.json).
 */
export const ALERT_KEYWORDS = ['NOTE', 'TIP', 'TODO', 'QUESTION', 'SUMMARY', 'TLDR', 'CRITICAL', 'IMPORTANT', 'HELPFUL'];
const ALERT_RE = new RegExp(`^(\\s*)(${ALERT_KEYWORDS.join('|')}): `);

/** Alert paragraphs outside code, counted by keyword: {NOTE: 2, TIP: 1}. */
export function countAlerts(content) {
  const counts = {};
  for (const {line, inCode} of annotateLines(content)) {
    if (inCode) continue;
    const m = ALERT_RE.exec(line);
    if (m) counts[m[2]] = (counts[m[2]] ?? 0) + 1;
  }
  return counts;
}

/**
 * Prose segments for typography checks: lines outside code blocks, without inline code, URLs,
 * HTML tags (including the attribute lines of a tag that spans several lines), link targets,
 * headings' `{#id}` and alert keywords. Returns [{line, text}] with 1-based line numbers.
 */
export function proseLines(content) {
  const out = [];
  let openTag = false;
  for (const {line: raw, index, inCode} of annotateLines(content)) {
    if (inCode) continue;
    let line = raw.replace(/\r$/, '');
    if (openTag) {
      // Inside `<docs-code header="…"\n  path="…">`: attributes until the closing `>`.
      const close = line.indexOf('>');
      if (close === -1) continue;
      line = line.slice(close + 1);
      openTag = false;
    }
    let text = line
      .replace(ALERT_RE, '$1')
      .replace(/`[^`]*`/g, ' ')
      .replace(/https?:\/\/\S+/g, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/{#\s*[\w-]+\s*}/g, ' ')
      .replace(/\]\([^)]*\)/g, ']');
    const open = text.search(/<[a-zA-Z!/][^>]*$/);
    if (open !== -1) {
      text = text.slice(0, open);
      openTag = true;
    }
    if (text.trim()) out.push({line: index + 1, text});
  }
  return out;
}

/** Lines considered prose (not code, not blank, not pure markup) — used for diff classes. */
export function isProseLine(line) {
  const t = line.trim();
  if (!t) return false;
  if (/^<\/?docs-[a-z-]+/.test(t) && !/>[^<]*\p{L}/u.test(t)) return false;
  if (/^(\||<!--|---|\*\*\*|!\[)/.test(t)) return false;
  return /\p{L}{2,}/u.test(t);
}
