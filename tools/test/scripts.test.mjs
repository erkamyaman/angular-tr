import assert from 'node:assert/strict';
import path from 'node:path';
import {describe, test} from 'node:test';
import {packageRoot} from '../lib/paths.mjs';
import {read} from './helpers.mjs';

// `pnpm <name>` runs pnpm's own command when <name> is one, and only falls back to the
// package.json script otherwise, so a script named like a pnpm command is silently unreachable
// (`pnpm setup` configures pnpm; `pnpm search` is forwarded to `npm search`). The lists mirror
// pnpm 10's command table (`commandNames` of every command, with aliases) and its npm
// pass-through switch; `start`, `test` and `stop` run the script and are fine.
const PNPM_COMMANDS = new Set([
  'add', 'approve-builds', 'audit', 'bin', 'cache', 'cat-file', 'cat-index', 'ci', 'clean-install', 'completion', 'config', 'c',
  'create', 'dedupe', 'deploy', 'dislink', 'dlx', 'doctor', 'env', 'exec', 'fetch', 'find-hash', 'get', 'i', 'ic', 'ignored-builds',
  'import', 'init', 'install', 'install-clean', 'install-test', 'it', 'la', 'licenses', 'link', 'list', 'll', 'ln', 'ls', 'm', 'multi',
  'outdated', 'pack', 'patch', 'patch-commit', 'patch-remove', 'prune', 'publish', 'rb', 'rebuild', 'recursive', 'remove', 'restart',
  'rm', 'root', 'run', 'run-script', 'self-update', 'server', 'set', 'setup', 'store', 'un', 'uni', 'uninstall', 'unlink', 'up', 'update',
  'upgrade', 'why', 'help',
]);
const NPM_PASS_THROUGH = new Set([
  'access', 'adduser', 'bugs', 'deprecate', 'dist-tag', 'docs', 'edit', 'find', 'home', 'info', 'issues', 'login', 'logout', 'owner',
  'ping', 'prefix', 'profile', 'pkg', 'repo', 's', 'se', 'search', 'set-script', 'show', 'star', 'stars', 'team', 'token', 'unpublish',
  'unstar', 'v', 'version', 'view', 'whoami', 'xmas',
]);

const pkg = JSON.parse(await read(path.join(packageRoot, 'package.json')));
const cli = await read(path.join(packageRoot, 'tools', 'cli.mjs'));
const subcommands = [...cli.matchAll(/^\s+'?([a-z-]+)'?: \(\) => import\('\.\/commands\/([a-z-]+)\.mjs'\)/gm)];

describe('package.json scripts', () => {
  test('no script name is shadowed by a pnpm command or an npm pass-through', () => {
    for (const name of Object.keys(pkg.scripts)) {
      assert.ok(!PNPM_COMMANDS.has(name), `"${name}" is a pnpm command: \`pnpm ${name}\` would never run the script`);
      assert.ok(!NPM_PASS_THROUGH.has(name), `"${name}" is forwarded to npm by pnpm: \`pnpm ${name}\` would never run the script`);
    }
  });
  test('every rosetta subcommand has a `pnpm <name>` alias with the same name, and vice versa', () => {
    assert.ok(subcommands.length >= 10, 'subcommand table parsed');
    for (const [, name, file] of subcommands) {
      assert.equal(file, name, `commands/${file}.mjs registered as "${name}"`);
      assert.equal(pkg.scripts[name], `node tools/cli.mjs ${name}`, `script alias for ${name}`);
    }
    const aliases = Object.entries(pkg.scripts).filter(([, cmd]) => /^node tools\/cli\.mjs \S+$/.test(cmd)).map(([name]) => name);
    assert.deepEqual(aliases.sort(), subcommands.map(([, name]) => name).sort());
  });
});

describe('test independence', () => {
  test("no test reads the repository's own i18n/ (instances delete i18n/_example)", async () => {
    const {readdir} = await import('node:fs/promises');
    const dir = path.join(packageRoot, 'tools', 'test');
    for (const f of (await readdir(dir)).filter((n) => n.endsWith('.mjs'))) {
      const src = await read(path.join(dir, f));
      assert.ok(!/packageRoot,\s*'i18n'/.test(src), `${f} reads packageRoot/i18n: use tools/test/fixtures instead`);
    }
  });
});
