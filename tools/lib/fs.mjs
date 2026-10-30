import {access, cp, mkdir, readFile, rm, stat, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {glob} from 'tinyglobby';

export async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

export async function isDirectory(p) {
  try {
    return (await stat(p)).isDirectory();
  } catch {
    return false;
  }
}

export async function readText(p) {
  return readFile(p, 'utf8');
}

export async function writeText(p, content) {
  await mkdir(path.dirname(p), {recursive: true});
  await writeFile(p, content, 'utf8');
}

export async function readBytes(p) {
  return readFile(p);
}

export async function writeBytes(p, buf) {
  await mkdir(path.dirname(p), {recursive: true});
  await writeFile(p, buf);
}

export async function readJson(p) {
  return JSON.parse(await readFile(p, 'utf8'));
}

export async function writeJson(p, value) {
  await writeText(p, JSON.stringify(value, null, 2) + '\n');
}

/** Copy a file, creating parent directories. */
export async function copyFile(src, dest) {
  await mkdir(path.dirname(dest), {recursive: true});
  await cp(src, dest, {force: true});
}

export async function remove(p) {
  await rm(p, {recursive: true, force: true});
}

/** Glob with POSIX-style relative results, sorted for stable output. */
export async function globFiles(patterns, {cwd, dot = false} = {}) {
  const files = await glob(patterns, {cwd, dot, onlyFiles: true});
  return files.sort();
}
