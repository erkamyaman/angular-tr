import {createHash} from 'node:crypto';
import path from 'node:path';
import {exists, globFiles, readBytes, readText, writeBytes, writeText} from './fs.mjs';
import {langSrcDir, toPosix} from './paths.mjs';

/** `page.en.md` -> true */
export function isSnapshot(file) {
  return /\.en\.[^./\\]+$/.test(file);
}

/** `page.md` -> `page.en.md` */
export function snapshotOf(translated) {
  const ext = path.extname(translated);
  return translated.slice(0, -ext.length) + '.en' + ext;
}

/** `page.en.md` -> `page.md` */
export function translatedOf(snapshot) {
  return snapshot.replace(/\.en(\.[^./\\]+)$/, '$1');
}

/** True when a buffer looks like text (no NUL byte in its first 8 KiB), git's own heuristic. */
export function looksLikeText(buf) {
  return !buf.subarray(0, 8192).includes(0);
}

/**
 * CRLF -> LF. Snapshots are hashed as git stores them: `.gitattributes` normalizes text to LF at
 * commit time, so a CRLF checkout (Windows, an editor setting) must not change a hash or make a
 * page look outdated. Buffers that do not look like text are returned as is.
 */
export function normalizeNewlines(content) {
  if (Buffer.isBuffer(content)) {
    if (!looksLikeText(content) || !content.includes(0x0d)) return content;
    return Buffer.from(content.toString('utf8').replace(/\r\n/g, '\n'), 'utf8');
  }
  return content.replace(/\r\n/g, '\n');
}

/** Git blob hash of a string or buffer, identical to `git hash-object <file>` (after LF normalization). */
export function blobHash(content) {
  const normalized = normalizeNewlines(content);
  const buf = Buffer.isBuffer(normalized) ? normalized : Buffer.from(normalized, 'utf8');
  return createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex');
}

/** Copy an upstream file as a snapshot, with LF line endings when it is text. */
export async function copySnapshot(src, dest) {
  await writeBytes(dest, normalizeNewlines(await readBytes(src)));
}

const MARKER_STYLES = {
  '.md': {open: '<!-- source: ', close: ' -->'},
  '.html': {open: '<!-- source: ', close: ' -->'},
  '.ts': {open: '// source: ', close: ''},
  '.mts': {open: '// source: ', close: ''},
  '.js': {open: '// source: ', close: ''},
  '.mjs': {open: '// source: ', close: ''},
  '.json': null, // JSON cannot carry a comment; the marker lives in <name>.source next to it
};

/** Sidecar file holding the marker of a file that cannot carry one (JSON): `versions.json.source`. */
export function sidecarOf(file) {
  return `${file}.source`;
}

export function markerStyle(file) {
  const ext = path.extname(file).toLowerCase();
  return ext in MARKER_STYLES ? MARKER_STYLES[ext] : {open: '# source: ', close: ''};
}

const MARKER_RE = /^(?:<!--|\/\/|#)\s*source:\s*([0-9a-f]{40})\s*(?:-->)?\s*$/;

/** Read the source marker from the first lines of a translated file. Returns the hash or null. */
export function readMarker(content) {
  const lines = content.split(/\r?\n/, 3);
  for (const line of lines) {
    const m = MARKER_RE.exec(line.trim());
    if (m) return m[1];
  }
  return null;
}

/** True when the first line of `content` is a marker line. */
export function hasMarkerLine(content) {
  const first = content.split(/\r?\n/, 1)[0] ?? '';
  return MARKER_RE.test(first.trim());
}

/** Return `content` with the marker set to `hash` (replacing an existing one or prepending). */
export function setMarker(file, content, hash) {
  const style = markerStyle(file);
  if (!style) return content;
  const line = `${style.open}${hash}${style.close}`;
  const lines = content.split('\n');
  if (lines.length && MARKER_RE.test(lines[0].trim())) {
    lines[0] = line;
    return lines.join('\n');
  }
  return `${line}\n${content}`;
}

/**
 * Marker of a translated file wherever it lives: in the content for text formats, in the
 * `<file>.source` sidecar for JSON. `content` saves a read when the caller already has it.
 */
export async function readMarkerOf(file, content) {
  if (markerStyle(file)) return readMarker(content ?? (await readText(file)));
  const side = sidecarOf(file);
  if (!(await exists(side))) return null;
  const m = /([0-9a-f]{40})/.exec(await readText(side));
  return m ? m[1] : null;
}

/** Write a translated file with its marker set (in the content, or in the sidecar for JSON). */
export async function writeMarked(file, content, hash) {
  if (markerStyle(file)) {
    await writeText(file, setMarker(file, content, hash));
  } else {
    await writeText(file, content);
    await writeText(sidecarOf(file), `${hash}\n`);
  }
}

/** Strip the marker line so line counts and diffs compare like with like. */
export function stripMarker(content) {
  const lines = content.split('\n');
  if (lines.length && MARKER_RE.test(lines[0].trim())) lines.shift();
  return lines.join('\n');
}

/**
 * All snapshot files of a language: [{rel, snapshot, translated}] where `rel` is the path
 * relative to adev/src (and to i18n/<lang>/src), e.g. `content/guide/signals/overview.md`.
 */
export async function listSnapshots(lang) {
  const base = langSrcDir(lang);
  const files = await globFiles(['**/*.en.*'], {cwd: base});
  return files.map((snap) => {
    const rel = translatedOf(snap);
    return {
      rel: toPosix(rel),
      snapshot: path.join(base, snap),
      translated: path.join(base, rel),
    };
  });
}

/** All files of a language overlay that go into the build (no snapshots, sidecars or .gitkeep), relative to adev/src. */
export async function listOverlayFiles(lang) {
  const base = langSrcDir(lang);
  const files = await globFiles(['**/*', '!**/*.en.*', '!**/*.source', '!**/.gitkeep'], {cwd: base, dot: false});
  return files.map(toPosix);
}
