/**
 * Production build of one language, with upstream's own Bazel targets.
 *
 *   pnpm build <lang>                  worktree + patches + overlay + dictionaries + generated files + bazel + post-process
 *   pnpm build <lang> --prepare-only   stop after preparing build/<lang> (inspect, refresh a patch)
 *   pnpm build <lang> --skip-install   reuse node_modules in build/<lang>
 *   pnpm build <lang> --lenient        do not fail on dead index.html or pipeline pairs
 *   pnpm build <lang> --skip-patches   build without tools/adev-patches (no switcher, no banners)
 *
 * Output: build/<lang>/dist/bin/adev/dist/browser
 */
import path from 'node:path';
import {OUTPUT_REL, checkNodeVersion, pnpmIn, postProcess, prepareBuild, prepareWorktree} from '../lib/build-steps.mjs';
import {command, langArg, resolveLang} from '../lib/cli.mjs';
import {fail, log} from '../lib/log.mjs';
import {rootDir} from '../lib/paths.mjs';

export default command({
  meta: {name: 'build', description: 'Production build of a language with upstream Bazel targets'},
  args: {
    lang: langArg,
    'prepare-only': {type: 'boolean', description: 'Stop after preparing build/<lang>'},
    'skip-install': {type: 'boolean', description: 'Reuse node_modules in build/<lang>'},
    lenient: {type: 'boolean', description: 'Do not fail on index.html or pipeline pairs that no longer match upstream'},
    'skip-patches': {type: 'boolean', description: 'Build without tools/adev-patches (no switcher, no banners)'},
  },
  async run({args}) {
    const lang = await resolveLang(args);
    try {
      const {dir} = await prepareWorktree(lang);
      await prepareBuild(lang, dir, {lenient: Boolean(args.lenient), skipPatches: Boolean(args['skip-patches'])});
      if (args['prepare-only']) {
        log.ok(`prepared ${path.relative(rootDir, dir)}; nothing built`);
        return;
      }

      log.step('bazel build');
      await checkNodeVersion(dir);
      if (!args['skip-install']) await pnpmIn(dir, ['install', '--frozen-lockfile']);
      await pnpmIn(dir, ['bazel', 'build', '//adev:build.production', '--config=release']);

      const {out, pages} = await postProcess(lang, dir);
      log.ok(`built ${lang}: ${pages} pages in ${path.relative(rootDir, out)} (${OUTPUT_REL})`);
    } catch (e) {
      fail(e.message);
    }
  },
});
