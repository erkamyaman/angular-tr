/**
 * Pin handling without network: the gitlink in the parent repository, the checked-out upstream
 * SHA and target parsing. `latest` and release branches need upstream and are covered by the
 * sync workflow, not here.
 */
import assert from 'node:assert/strict';
import {after, describe, test} from 'node:test';
import {execa} from 'execa';
import {commitAll, gitInit, makeRepo, removeDir, useRepo} from './helpers.mjs';

const repo = await makeRepo({example: false, origin: true});
useRepo({root: repo.root});
const {UPSTREAM_URL, currentOriginSha, pinnedSha, resolveTarget} = await import('../lib/origin.mjs');

after(() => removeDir(repo.root));

describe('pinnedSha and currentOriginSha', () => {
  test('a nested upstream checkout committed with git add -A becomes the gitlink', async () => {
    await gitInit(repo.root);
    await commitAll(repo.root, 'pin origin');
    assert.equal(await pinnedSha(), repo.originSha);
    assert.equal(await currentOriginSha(), repo.originSha);
  });
  test('the pin can point elsewhere than the checkout (what update-origin stages)', async () => {
    const other = 'a'.repeat(40);
    await execa('git', ['update-index', '--cacheinfo', `160000,${other},origin`], {cwd: repo.root});
    await execa('git', ['commit', '-q', '-m', 'move pin'], {cwd: repo.root});
    assert.equal(await pinnedSha(), other);
    assert.equal(await currentOriginSha(), repo.originSha);
  });
  test('without a gitlink there is no pin', async () => {
    await execa('git', ['rm', '-q', '--cached', 'origin'], {cwd: repo.root});
    await execa('git', ['commit', '-q', '-m', 'unpin'], {cwd: repo.root});
    assert.equal(await pinnedSha(), null);
  });
});

describe('resolveTarget', () => {
  test('a full or short SHA resolves without network', async () => {
    assert.deepEqual(await resolveTarget('ABCDEF1234567890abcdef1234567890abcdef12'), {sha: 'abcdef1234567890abcdef1234567890abcdef12', label: 'abcdef1234'});
    assert.deepEqual(await resolveTarget('abcdef1'), {sha: 'abcdef1', label: 'abcdef1'});
  });
  test('anything else is rejected with guidance', async () => {
    await assert.rejects(resolveTarget('main'), /unrecognized target "main"/);
    await assert.rejects(resolveTarget('v22'), /latest, a release branch like 22.2.x, or a commit SHA/);
  });
  test('the upstream URL is angular/angular', () => {
    assert.equal(UPSTREAM_URL, 'https://github.com/angular/angular.git');
  });
});
