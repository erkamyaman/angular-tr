import {execa} from 'execa';

/**
 * Run a command. Resolves with {code, stdout, stderr}. Rejects when the command fails unless
 * `allowFailure` is set. Output is streamed to the terminal unless `capture` is set, in which
 * case stdout is returned byte for byte (execa's default of stripping the final newline is off:
 * `git cat-file -p` output must round-trip, see status-core.blobContent).
 */
export async function run(cmd, args = [], {cwd, env, capture = false, allowFailure = false, input} = {}) {
  const result = await execa(cmd, args, {
    cwd,
    env,
    extendEnv: true,
    input,
    stdout: capture ? 'pipe' : 'inherit',
    stderr: capture ? 'pipe' : 'inherit',
    stripFinalNewline: false,
    reject: false,
  });
  const out = {code: result.exitCode ?? (result.failed ? 1 : 0), stdout: result.stdout ?? '', stderr: result.stderr ?? ''};
  if (out.code !== 0 && !allowFailure) {
    const err = new Error(`${cmd} ${args.join(' ')} exited with code ${out.code}${out.stderr ? `\n${out.stderr.trimEnd()}` : ''}`);
    Object.assign(err, out);
    throw err;
  }
  return out;
}

/** Run git with captured, trimmed output. */
export async function git(args, {cwd, allowFailure = false} = {}) {
  const {stdout} = await run('git', args, {cwd, capture: true, allowFailure});
  return stdout.trim();
}

/** True when `dir` is inside a git work tree. */
export async function isGitRepo(dir) {
  const {code} = await run('git', ['rev-parse', '--is-inside-work-tree'], {cwd: dir, capture: true, allowFailure: true});
  return code === 0;
}
