import assert from 'node:assert/strict';
import {describe, test} from 'node:test';
import {makeUpstream, removeDir} from './helpers.mjs';
import {git, isGitRepo, run} from '../lib/exec.mjs';
import {CliError, fail, log} from '../lib/log.mjs';

describe('run', () => {
  test('captures stdout byte for byte, including the final newline', async () => {
    const r = await run(process.execPath, ['-e', 'process.stdout.write("a\\nb\\n")'], {capture: true});
    assert.equal(r.code, 0);
    assert.equal(r.stdout, 'a\nb\n');
    assert.equal(r.stderr, '');
  });
  test('throws on failure with the command and stderr in the message, unless allowFailure', async () => {
    await assert.rejects(
      run(process.execPath, ['-e', 'console.error("boom"); process.exit(3)'], {capture: true}),
      (e) => e.code === 3 && /exited with code 3/.test(e.message) && /boom/.test(e.message) && e.stderr.includes('boom'),
    );
    const r = await run(process.execPath, ['-e', 'process.exit(2)'], {capture: true, allowFailure: true});
    assert.equal(r.code, 2);
  });
  test('passes input, cwd and extra environment', async () => {
    const r = await run(process.execPath, ['-e', 'process.stdin.on("data", (d) => process.stdout.write(process.cwd() + "|" + process.env.ROSETTA_TEST_VAR + "|" + d))'], {
      capture: true,
      input: 'in',
      cwd: '/',
      env: {ROSETTA_TEST_VAR: 'yes'},
    });
    assert.equal(r.stdout, '/|yes|in');
  });
  test('a missing executable rejects with a readable error', async () => {
    await assert.rejects(run('rosetta-definitely-missing-binary', [], {capture: true}), /rosetta-definitely-missing-binary/);
  });
});

describe('git helpers', () => {
  test('git() trims output; isGitRepo detects work trees', async () => {
    const upstream = await makeUpstream({git: true});
    try {
      assert.equal(await git(['rev-parse', 'HEAD'], {cwd: upstream.dir}), upstream.sha);
      assert.ok(await isGitRepo(upstream.dir));
      assert.equal(await git(['rev-parse', 'nope'], {cwd: upstream.dir, allowFailure: true}), 'nope');
      await assert.rejects(git(['rev-parse', '--verify', 'nope'], {cwd: upstream.dir}), /exited with code/);
    } finally {
      await removeDir(upstream.dir);
    }
    assert.ok(!(await isGitRepo('/')));
  });
});

describe('log and CliError', () => {
  test('fail throws a CliError carrying the exit code', () => {
    assert.throws(() => fail('nope'), (e) => e instanceof CliError && e.message === 'nope' && e.exitCode === 1 && e.name === 'CliError');
    assert.throws(() => fail('later', 3), (e) => e.exitCode === 3);
  });
  test('log writes to the console without throwing', () => {
    const calls = [];
    const orig = {log: console.log, error: console.error};
    console.log = (m) => calls.push(['log', m]);
    console.error = (m) => calls.push(['error', m]);
    try {
      log.step('s');
      log.info('i');
      log.ok('o');
      log.warn('w');
      log.dim('d');
      log.error('e');
    } finally {
      Object.assign(console, orig);
    }
    assert.equal(calls.length, 6);
    assert.equal(calls.filter((c) => c[0] === 'error').length, 1);
    assert.ok(calls.some((c) => String(c[1]).includes('== s')));
  });
});
