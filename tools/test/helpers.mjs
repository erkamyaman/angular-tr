/**
 * Shared helpers of the test suite: temporary repositories, a fixture upstream, and a runner for
 * the CLI. Tests point the tooling at those directories through ROSETTA_ROOT / ROSETTA_ORIGIN
 * (see tools/lib/paths.mjs), so nothing here imports the tooling itself: a test file sets the
 * environment first, then imports the modules under test.
 */
import {cp, mkdir, mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execa} from 'execa';

export const testDir = path.dirname(fileURLToPath(import.meta.url));
export const packageRoot = path.resolve(testDir, '..', '..');
export const fixturesDir = path.join(testDir, 'fixtures');
export const cliPath = path.join(packageRoot, 'tools', 'cli.mjs');

export async function tempDir(prefix = 'rosetta-') {
  return mkdtemp(path.join(os.tmpdir(), prefix));
}

export async function removeDir(dir) {
  if (dir) await rm(dir, {recursive: true, force: true});
}

export async function gitInit(dir) {
  await execa('git', ['init', '-q', '-b', 'main'], {cwd: dir});
  await execa('git', ['config', 'user.email', 'tests@example.invalid'], {cwd: dir});
  await execa('git', ['config', 'user.name', 'Rosetta tests'], {cwd: dir});
  await execa('git', ['config', 'commit.gpgsign', 'false'], {cwd: dir});
}

export async function commitAll(dir, message = 'commit') {
  await execa('git', ['add', '-A'], {cwd: dir});
  await execa('git', ['commit', '-q', '--allow-empty', '-m', message], {cwd: dir});
  return (await execa('git', ['rev-parse', 'HEAD'], {cwd: dir})).stdout.trim();
}

/** Copy the fixture upstream into `dir` (a temp dir by default); with git, commit it once. */
export async function makeUpstream({dir, git = true} = {}) {
  dir ??= await tempDir('rosetta-upstream-');
  await cp(path.join(fixturesDir, 'upstream'), dir, {recursive: true});
  let sha = null;
  if (git) {
    await gitInit(dir);
    sha = await commitAll(dir, 'upstream fixture');
  }
  return {dir, sha};
}

/**
 * A repository for the tooling to work on: site schema, marker files, languages.json, a copy of
 * the template's example language (configuration only, no pages), optionally origin/ (the fixture
 * upstream as a git repository) and a git history of its own.
 */
export async function makeRepo({example = true, git = false, origin = false} = {}) {
  const root = await tempDir('rosetta-root-');
  await mkdir(path.join(root, 'i18n'), {recursive: true});
  await writeFile(path.join(root, 'languages.json'), '[]\n');
  await writeFile(path.join(root, 'CODEOWNERS'), '# owners\n/tools/   @openng-org/angular-docs-rosetta-maintainers\n/.github/   @openng-org/angular-docs-rosetta-maintainers\n# languages:start\n# languages:end\n');
  await writeFile(
    path.join(root, 'README.md'),
    '# Repo\n\n<!-- languages:start -->\n| Language | Site | Maintainers |\n| --- | --- | --- |\n| _none yet: run `pnpm create-language <lang>`_ | | |\n<!-- languages:end -->\n',
  );
  await writeFile(path.join(root, '.bazelrc'), 'build --jobs=1\n');
  await mkdir(path.join(root, '.github', 'workflows'), {recursive: true});
  await writeFile(path.join(root, '.github', 'workflows', 'template-canary.yml'), 'name: canary\n');
  if (example) {
    // A frozen copy of the template's example language: the suite must pass in repositories where
    // `create-language --remove-example` deleted i18n/_example.
    const from = path.join(fixturesDir, 'example');
    const to = path.join(root, 'i18n', '_example');
    await mkdir(path.join(to, 'src'), {recursive: true});
    for (const f of ['site.json', 'LANGUAGE.md', 'glossary.json', 'README.md']) await cp(path.join(from, f), path.join(to, f));
    await writeFile(path.join(to, 'src', '.gitkeep'), '');
  }
  let upstream = null;
  if (origin) upstream = await makeUpstream({dir: path.join(root, 'origin')});
  if (git) {
    await gitInit(root);
    await commitAll(root, 'initial');
  }
  return {root, origin: upstream?.dir ?? null, originSha: upstream?.sha ?? null};
}

/** Point the tooling at a repository (and an upstream checkout) for the current process. */
export function useRepo({root, origin}) {
  process.env.ROSETTA_ROOT = root;
  if (origin) process.env.ROSETTA_ORIGIN = origin;
  else delete process.env.ROSETTA_ORIGIN;
  process.env.NO_COLOR = '1';
}

const ANSI_RE = /\x1b\[[0-9;?]*[A-Za-z]/g;
export const stripAnsi = (s) => s.replace(ANSI_RE, '');

/** Run `node tools/cli.mjs <args>` against a repository. Resolves with {code, stdout, stderr, out}. */
export async function cli(args, {root, origin = null, cwd = root, input} = {}) {
  const env = {...process.env, ROSETTA_ROOT: root, NO_COLOR: '1', FORCE_COLOR: '0'};
  if (origin) env.ROSETTA_ORIGIN = origin;
  else delete env.ROSETTA_ORIGIN;
  const r = await execa(process.execPath, [cliPath, ...args], {cwd, env, extendEnv: false, input, reject: false, stripFinalNewline: false});
  const stdout = stripAnsi(r.stdout ?? '');
  const stderr = stripAnsi(r.stderr ?? '');
  return {code: r.exitCode ?? 1, stdout, stderr, out: stdout + stderr};
}

export async function read(file) {
  return readFile(file, 'utf8');
}

export async function write(file, content) {
  await mkdir(path.dirname(file), {recursive: true});
  await writeFile(file, content);
}

/** A translated page with its snapshot and marker, as `status --init` would create it. */
export async function initPage(root, lang, rel, upstreamDir, {translate} = {}) {
  const {blobHash, setMarker} = await import('../lib/snapshots.mjs');
  const english = await read(path.join(upstreamDir, 'adev', 'src', rel));
  const translated = path.join(root, 'i18n', lang, 'src', rel);
  const snapshot = translated.replace(/(\.[^./]+)$/, '.en$1');
  await write(snapshot, english);
  const body = translate ? translate(english) : english;
  await write(translated, setMarker(translated, body, blobHash(english)));
  return {translated, snapshot, english};
}
