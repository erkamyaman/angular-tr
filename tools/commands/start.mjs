/**
 * Dev server with live overlay: prepares build/<lang>, starts upstream's ibazel serve target and
 * re-copies files from i18n/<lang>/src as you edit them (dictionaries are re-applied on change).
 *
 *   pnpm start <lang>
 *   pnpm start <lang> --skip-install
 */
import path from 'node:path';
import chokidar from 'chokidar';
import {checkNodeVersion, pnpmIn, prepareBuild, prepareWorktree} from '../lib/build-steps.mjs';
import {command, langArg, resolveLang} from '../lib/cli.mjs';
import {copyFile, readText, writeText} from '../lib/fs.mjs';
import {fail, log} from '../lib/log.mjs';
import {adevSrc, langDictDir, langSrcDir} from '../lib/paths.mjs';
import {isSnapshot, stripMarker} from '../lib/snapshots.mjs';

export default command({
  meta: {name: 'start', description: 'Dev server (ibazel) with the overlay re-applied as you edit'},
  args: {
    lang: langArg,
    'skip-install': {type: 'boolean', description: 'Reuse node_modules in build/<lang>'},
    'skip-patches': {type: 'boolean', description: 'Serve without tools/adev-patches'},
  },
  async run({args}) {
    const lang = await resolveLang(args);
    let dir;
    try {
      ({dir} = await prepareWorktree(lang));
      await prepareBuild(lang, dir, {lenient: true, skipPatches: Boolean(args['skip-patches'])});
      await checkNodeVersion(dir);
      if (!args['skip-install']) await pnpmIn(dir, ['install', '--frozen-lockfile']);
    } catch (e) {
      fail(e.message);
    }

    const src = langSrcDir(lang);
    const dictDir = langDictDir(lang);
    const watcher = chokidar.watch([src, dictDir], {ignoreInitial: true});
    watcher.on('all', async (event, file) => {
      try {
        if (file.startsWith(dictDir)) {
          // Translated strings replaced the English keys in the worktree: start again from upstream.
          log.info('dictionaries changed: resetting the build directory and re-applying everything');
          await prepareWorktree(lang);
          await prepareBuild(lang, dir, {lenient: true, skipPatches: Boolean(args['skip-patches'])});
          return;
        }
        if (isSnapshot(file) || file.endsWith('.gitkeep')) return;
        const rel = path.relative(src, file);
        const dest = path.join(adevSrc(dir), rel);
        if (event === 'unlink') {
          log.info(`${rel} removed from overlay (restore upstream with: git -C build/${lang} checkout -- adev/src/${rel})`);
          return;
        }
        if (/\.(md|html|ts|mts|js|mjs|json|txt|scss|css)$/i.test(rel)) await writeText(dest, stripMarker(await readText(file)));
        else await copyFile(file, dest);
        log.dim(`synced ${rel}`);
      } catch (e) {
        log.error(e.message);
      }
    });

    log.step('ibazel serve (Ctrl+C to stop)');
    log.info(`edit files under i18n/${lang}/src; they are copied into build/${lang} as you save`);
    process.on('SIGINT', () => {
      watcher.close();
      process.exit(0);
    });
    await pnpmIn(dir, ['ibazel', 'run', '//adev:build.serve']).catch((e) => fail(e.message));
  },
});
