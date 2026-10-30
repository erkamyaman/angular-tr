import {createTwoFilesPatch, diffArrays} from 'diff';
import {annotateLines, isProseLine} from './markdown.mjs';

/**
 * Line diff as a flat op list: [{type: 'same'|'add'|'del', line, aIndex?, bIndex?}].
 * jsdiff does the diffing over `split('\n')` arrays, so a trailing newline counts as a final
 * empty line exactly like everywhere else in the tooling (line parity, markers).
 */
export function diffLines(aText, bText) {
  const ops = [];
  let a = 0;
  let b = 0;
  for (const part of diffArrays(aText.split('\n'), bText.split('\n'))) {
    for (const line of part.value) {
      if (part.added) ops.push({type: 'add', line, bIndex: b++});
      else if (part.removed) ops.push({type: 'del', line, aIndex: a++});
      else ops.push({type: 'same', line, aIndex: a++, bIndex: b++});
    }
  }
  return ops;
}

/** Unified diff (hunks only) for terminals and PR bodies; the caller prints its own header. */
export function formatDiff(oldText, newText, {context = 2, oldLabel = 'translated from', newLabel = 'current'} = {}) {
  const patch = createTwoFilesPatch(oldLabel, newLabel, oldText, newText, '', '', {context});
  // jsdiff emits "====", "--- old" and "+++ new" before the first hunk.
  return patch.split('\n').slice(3).join('\n').trimEnd();
}

/** Tokens that can change in a prose line without changing its prose: link targets, code spans, URLs. */
export const MECHANICAL_TOKEN_RE = /\]\([^)]*\)|`[^`]*`|https?:\/\/\S+/g;

/** A prose line with its mechanical tokens blanked, for "did the words change?" comparisons. */
export function proseSkeleton(line) {
  return line.replace(MECHANICAL_TOKEN_RE, '\u0000').replace(/\s+/g, ' ').trim();
}

/**
 * Pair each removed line with the added line at the same position of the same change block when
 * only mechanical tokens differ. Returns a Map from the op index of the `del` to that of its `add`.
 */
export function mechanicalPairs(ops) {
  const pairs = new Map();
  let i = 0;
  while (i < ops.length) {
    if (ops[i].type === 'same') {
      i++;
      continue;
    }
    const dels = [];
    const adds = [];
    while (i < ops.length && ops[i].type !== 'same') {
      (ops[i].type === 'del' ? dels : adds).push(i);
      i++;
    }
    for (let p = 0; p < Math.min(dels.length, adds.length); p++) {
      const d = dels[p];
      const a = adds[p];
      if (isProseLine(ops[d].line) && proseSkeleton(ops[d].line) === proseSkeleton(ops[a].line)) pairs.set(d, a);
    }
  }
  return pairs;
}

/**
 * Diff class, after angular-ja's update-origin skill:
 *   a: only code blocks, URLs, link targets, whitespace or markup changed
 *   b: 5 or fewer prose lines changed
 *   c: 30 or fewer prose lines changed
 *   d: more than that, or headings added/removed (restructure)
 */
export function classifyDiff(oldText, newText) {
  const ops = diffLines(oldText, newText);
  const oldCode = new Set(annotateLines(oldText).filter((l) => l.inCode).map((l) => l.index));
  const newCode = new Set(annotateLines(newText).filter((l) => l.inCode).map((l) => l.index));
  const pairs = mechanicalPairs(ops);
  const paired = new Set([...pairs.keys(), ...pairs.values()]);
  let added = 0;
  let removed = 0;
  let prose = 0;
  let headings = 0;
  ops.forEach((op, idx) => {
    if (op.type === 'same') return;
    if (op.type === 'add') added++;
    else removed++;
    const inCode = op.type === 'add' ? newCode.has(op.bIndex) : oldCode.has(op.aIndex);
    if (inCode || paired.has(idx)) return;
    if (/^#{1,6}\s/.test(op.line)) headings++;
    if (isProseLine(op.line)) prose++;
  });
  let cls = 'a';
  if (prose > 0) cls = prose <= 5 ? 'b' : prose <= 30 ? 'c' : 'd';
  const oldHeadingCount = oldText.split('\n').filter((l) => /^#{2,6}\s/.test(l)).length;
  const newHeadingCount = newText.split('\n').filter((l) => /^#{2,6}\s/.test(l)).length;
  if (oldHeadingCount !== newHeadingCount) cls = 'd';
  return {class: cls, added, removed, proseChanged: prose, headingsChanged: headings, ops, pairs};
}

/**
 * Apply a class-a English change to a translation whose lines mirror the old English line for line.
 * Non-prose changes (code, markup, blank lines) take the new English line; paired prose lines get
 * their mechanical tokens (link targets, code spans, URLs) swapped in place. Returns the new
 * translated lines, or throws with the reason when the change cannot be applied safely.
 */
export function applyMechanicalChange(oldText, newText, translatedText) {
  const result = classifyDiff(oldText, newText);
  if (result.class !== 'a') throw new Error(`diff class is ${result.class}, not a: prose changed, translate it`);
  const translatedLines = translatedText.split('\n');
  const oldLines = oldText.split('\n');
  if (translatedLines.length !== oldLines.length) {
    throw new Error(`translation has ${translatedLines.length} lines, the English it was made from ${oldLines.length}: fix line parity first`);
  }
  const out = [];
  const {ops, pairs} = result;
  const addToDel = new Map([...pairs].map(([d, a]) => [a, d]));
  ops.forEach((op, idx) => {
    if (op.type === 'same') {
      out.push(translatedLines[op.aIndex]);
    } else if (op.type === 'add') {
      const d = addToDel.get(idx);
      out.push(d === undefined ? op.line : swapTokens(translatedLines[ops[d].aIndex], ops[d].line, op.line));
    }
  });
  return out;
}

function swapTokens(translatedLine, oldEnglish, newEnglish) {
  const oldTokens = oldEnglish.match(MECHANICAL_TOKEN_RE) ?? [];
  const newTokens = newEnglish.match(MECHANICAL_TOKEN_RE) ?? [];
  if (oldTokens.length !== newTokens.length) throw new Error(`token count differs on line: ${oldEnglish}`);
  let line = translatedLine;
  oldTokens.forEach((tok, i) => {
    if (tok === newTokens[i]) return;
    const first = line.indexOf(tok);
    if (first === -1 || line.indexOf(tok, first + 1) !== -1) {
      throw new Error(`cannot locate "${tok}" exactly once in the translated line: ${translatedLine}`);
    }
    line = line.slice(0, first) + newTokens[i] + line.slice(first + tok.length);
  });
  return line;
}
