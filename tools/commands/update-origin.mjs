/**
 * Move the upstream pin and refresh every English snapshot.
 *
 *   pnpm update-origin latest        head of the newest release branch (what angular.dev serves)
 *   pnpm update-origin 22.3.x        head of a given release branch
 *   pnpm update-origin <sha>         an exact upstream commit
 *   --dry-run                        resolve and report, change nothing
 *
 * Translations are never touched: only `*.en.*` files are overwritten. The parent repo's
 * gitlink is staged (`git add origin`); commit it together with the snapshot changes.
 */
import path from 'node:path';
import {readFile} from 'node:fs/promises';
import {command} from '../lib/cli.mjs';
import {git, run} from '../lib/exec.mjs';
import {exists} from '../lib/fs.mjs';
import {listLanguages} from '../lib/languages.mjs';
import {fail, log} from '../lib/log.mjs';
import {checkoutOrigin, currentOriginSha, pinnedSha, resolveTarget} from '../lib/origin.mjs';
import {adevSrc, originDir, rootDir} from '../lib/paths.mjs';
import {blobHash, copySnapshot, listSnapshots} from '../lib/snapshots.mjs';

export default command({
  meta: {name: 'update-origin', description: 'Move the upstream pin and refresh the English snapshots'},
  args: {
    target: {type: 'positional', description: '`latest`, a release branch such as 22.3.x, or an upstream commit SHA', required: false},
    'dry-run': {type: 'boolean', description: 'Resolve the target and report; change nothing'},
  },
  async run({args}) {
    if (process.env.ROSETTA_ORIGIN) fail('update-origin works on the origin/ submodule; unset ROSETTA_ORIGIN first.');

    log.step('resolve target');
    const target = await resolveTarget(args.target ?? 'latest');
    const previous = (await currentOriginSha()) ?? (await pinnedSha());
    log.info(`target: ${target.label} -> ${target.sha}`);
    log.info(`current: ${previous ?? 'none'}`);
    if (args['dry-run']) {
      log.ok('dry run, nothing changed');
      return;
    }

    log.step('fetch and checkout');
    if (!(await exists(path.join(originDir, '.git')))) {
      await run('git', ['submodule', 'init'], {cwd: rootDir});
      const r = await run('git', ['submodule', 'update', '--init', '--depth', '1', '--', 'origin'], {cwd: rootDir, allowFailure: true});
      if (r.code !== 0) log.warn('initial shallow submodule update failed; continuing with a direct fetch');
    }
    const sha = await checkoutOrigin(target.sha);
    await run('git', ['add', 'origin'], {cwd: rootDir});
    log.ok(`origin now at ${sha.slice(0, 10)} (gitlink staged)`);

    log.step('refresh snapshots');
    for (const lang of await listLanguages({includeExample: true})) {
      const snapshots = await listSnapshots(lang);
      let refreshed = 0;
      const removed = [];
      for (const s of snapshots) {
        const upstream = path.join(adevSrc(originDir), s.rel);
        if (!(await exists(upstream))) {
          removed.push(s.rel);
          continue;
        }
        const [a, b] = await Promise.all([readFile(upstream), readFile(s.snapshot)]);
        if (blobHash(a) !== blobHash(b)) {
          await copySnapshot(upstream, s.snapshot);
          refreshed++;
        }
      }
      log.info(`${lang}: ${refreshed} snapshot(s) refreshed of ${snapshots.length}${removed.length ? `, ${removed.length} removed upstream` : ''}`);
      for (const r of removed) log.warn(`  removed upstream: ${r} (move or delete the pair, see renames below)`);
    }

    if (previous && previous !== sha) {
      log.step(`renames and deletions between ${previous.slice(0, 10)} and ${sha.slice(0, 10)}`);
      const havePrevious = (await run('git', ['cat-file', '-e', `${previous}^{commit}`], {cwd: originDir, capture: true, allowFailure: true})).code === 0;
      const out = havePrevious
        ? await git(['diff', '--name-status', '--find-renames', '--diff-filter=RD', previous, sha, '--', 'adev/src/content', 'adev/src/app'], {cwd: originDir, allowFailure: true})
        : '';
      if (!havePrevious) log.dim(`previous commit ${previous.slice(0, 10)} is not available locally (shallow clone): compare on GitHub if a translated page went missing`);
      else if (!out) log.dim('none');
      else {
        for (const line of out.split('\n')) {
          const [status, from, to] = line.split('\t');
          if (status.startsWith('R')) log.info(`renamed: ${from} -> ${to}`);
          else if (status === 'D') log.info(`deleted: ${from}`);
        }
      }
    }

    log.step('next');
    log.info('1. pnpm status <lang> --md   -> the work queue, paste it into the sync PR');
    log.info(`2. git switch -c sync/${sha.slice(0, 10)} && git add origin i18n && git commit -m "sync: update origin to ${target.label} @ ${sha.slice(0, 10)}"`);
    log.info('3. translate outdated files (adev-translation skill), pnpm check <lang>, open the PR');
  },
});
