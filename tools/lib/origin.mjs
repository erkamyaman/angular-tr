import {git, run} from './exec.mjs';
import {originDir, rootDir} from './paths.mjs';

export const UPSTREAM_URL = 'https://github.com/angular/angular.git';

/** SHA recorded in this repo's `origin` gitlink (HEAD), or null when there is none yet. */
export async function pinnedSha() {
  const out = await git(['ls-tree', 'HEAD', 'origin'], {cwd: rootDir, allowFailure: true});
  const m = /^160000 commit ([0-9a-f]{40})\t/.exec(out);
  return m ? m[1] : null;
}

/** SHA currently checked out in origin/, or null. */
export async function currentOriginSha() {
  const {code, stdout} = await run('git', ['rev-parse', 'HEAD'], {cwd: originDir, capture: true, allowFailure: true});
  return code === 0 ? stdout.trim() : null;
}

/** Release branches on upstream (`NN.N.x`), newest first, with their head SHAs. */
export async function listReleaseBranches() {
  const out = await git(['ls-remote', '--heads', UPSTREAM_URL, 'refs/heads/*.*.x']);
  const branches = out
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [sha, ref] = line.split('\t');
      const name = ref.replace('refs/heads/', '');
      const [major, minor] = name.split('.').map(Number);
      return {name, sha, major, minor};
    })
    .filter((b) => Number.isFinite(b.major) && Number.isFinite(b.minor))
    .sort((a, b) => b.major - a.major || b.minor - a.minor);
  return branches;
}

/**
 * Resolve `latest`, a release branch name (`22.2.x`) or a SHA to {sha, label}.
 * A SHA shorter than 40 characters is resolved against upstream after fetching it.
 */
export async function resolveTarget(target) {
  if (!target || target === 'latest') {
    const [latest] = await listReleaseBranches();
    if (!latest) throw new Error('could not list release branches on upstream');
    return {sha: latest.sha, label: latest.name};
  }
  if (/^\d+\.\d+\.x$/.test(target)) {
    const branches = await listReleaseBranches();
    const b = branches.find((x) => x.name === target);
    if (!b) throw new Error(`release branch ${target} not found on upstream`);
    return {sha: b.sha, label: b.name};
  }
  if (/^[0-9a-f]{7,40}$/i.test(target)) {
    const sha = target.toLowerCase();
    return {sha, label: sha.slice(0, 10)};
  }
  throw new Error(`unrecognized target "${target}": use latest, a release branch like 22.2.x, or a commit SHA`);
}

/** Fetch a commit into origin/ (shallow first, full as fallback) and check it out detached. */
export async function checkoutOrigin(sha) {
  const shallow = await run('git', ['fetch', '--depth', '1', 'origin', sha], {cwd: originDir, allowFailure: true});
  if (shallow.code !== 0) {
    await run('git', ['fetch', 'origin', sha], {cwd: originDir});
  }
  await run('git', ['checkout', '--detach', sha], {cwd: originDir});
  return git(['rev-parse', 'HEAD'], {cwd: originDir});
}
