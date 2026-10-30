/**
 * Initialize the `origin` submodule at the pinned SHA (shallow) and check the toolchain.
 *
 *   pnpm bootstrap            fetch the pinned commit if origin/ is empty, check Node and pnpm
 *   pnpm bootstrap --full     full history instead of a shallow fetch (slow; rarely needed)
 */
import path from 'node:path';
import {command} from '../lib/cli.mjs';
import {run} from '../lib/exec.mjs';
import {exists, readJson, readText} from '../lib/fs.mjs';
import {fail, log} from '../lib/log.mjs';
import {checkoutOrigin, currentOriginSha, pinnedSha} from '../lib/origin.mjs';
import {originDir, packageRoot, rootDir} from '../lib/paths.mjs';

export default command({
  meta: {name: 'bootstrap', description: 'Fetch the pinned upstream commit into origin/ and check the toolchain'},
  args: {
    full: {type: 'boolean', description: 'Clone the full upstream history instead of a shallow fetch'},
  },
  async run({args}) {
    if (process.env.ROSETTA_ORIGIN) {
      log.info(`ROSETTA_ORIGIN is set: using ${originDir} as upstream checkout, skipping submodule setup.`);
    } else {
      await setupSubmodule({full: Boolean(args.full)});
    }
    await checkToolchain();
  },
});

async function setupSubmodule({full}) {
  log.step('origin submodule');
  const pinned = await pinnedSha();
  if (!pinned) {
    fail(
      'No `origin` gitlink in this repository. Pin upstream first:\n' +
        '  git update-index --add --cacheinfo 160000,<upstream sha>,origin && git commit -m "pin origin"\n' +
        'or run: pnpm update-origin latest',
    );
  }
  log.info(`pinned upstream commit: ${pinned}`);

  await run('git', ['submodule', 'init'], {cwd: rootDir});
  if (!(await exists(path.join(originDir, '.git')))) {
    log.info(full ? 'cloning upstream (full history)…' : 'cloning upstream (shallow)…');
    const updateArgs = ['submodule', 'update', '--init', ...(full ? [] : ['--depth', '1']), '--', 'origin'];
    const r = await run('git', updateArgs, {cwd: rootDir, allowFailure: true});
    if (r.code !== 0) {
      log.warn('submodule update failed; fetching the pinned commit directly');
      await run('git', ['submodule', 'update', '--init', '--no-fetch', '--', 'origin'], {cwd: rootDir, allowFailure: true});
    }
  }
  const current = await currentOriginSha();
  if (current !== pinned) {
    log.info(`origin is at ${current ? current.slice(0, 10) : 'nothing'}, moving to ${pinned.slice(0, 10)}…`);
    await checkoutOrigin(pinned);
  }
  log.ok(`origin ready at ${pinned.slice(0, 10)}`);
}

async function checkToolchain() {
  log.step('toolchain');
  const haveNode = process.versions.node;
  const ours = path.join(rootDir, '.nvmrc');
  const wantNode = (await exists(ours)) ? (await readText(ours)).trim() : null;
  const engines = (await exists(path.join(packageRoot, 'package.json'))) ? (await readJson(path.join(packageRoot, 'package.json'))).engines?.node : null;
  log.info(`Node: ${haveNode} installed; this repository ${wantNode ? `uses Node ${wantNode} (.nvmrc)` : `requires Node ${engines ?? '?'} (package.json engines)`}`);
  if (wantNode && wantNode.split('.')[0] !== haveNode.split('.')[0]) {
    log.warn(`  Node major differs: run \`nvm use\` (or fnm/volta) at the repository root.`);
  }

  const theirPkg = path.join(originDir, 'package.json');
  const theirPnpm = (await exists(theirPkg)) ? (await readJson(theirPkg)).packageManager : null;
  const pnpm = await run('pnpm', ['--version'], {capture: true, allowFailure: true, cwd: rootDir});
  if (pnpm.code !== 0) {
    log.warn('  pnpm not found: `npm install -g pnpm` (Node 25+ no longer ships corepack).');
  } else {
    log.info(`pnpm: ${pnpm.stdout.trim()} here; inside build/<lang> pnpm switches itself to ${theirPnpm ?? "upstream's packageManager"} (upstream's pin).`);
  }
  const moduleBazel = path.join(originDir, 'MODULE.bazel');
  const bazelNode = (await exists(moduleBazel)) ? /node_version\s*=\s*"([^"]+)"/.exec(await readText(moduleBazel))?.[1] : null;
  if (bazelNode) log.info(`Bazel: builds with its own Node ${bazelNode} (origin/MODULE.bazel); the host Node only runs pnpm and bazelisk.`);
  log.ok('bootstrap done. Next: pnpm create-language <lang>  or  pnpm status <lang>');
}
