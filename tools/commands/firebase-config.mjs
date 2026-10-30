/**
 * Generate firebase.json and .firebaserc for every configured language (see lib/firebase.mjs).
 *
 *   pnpm firebase-config                   write both files
 *   pnpm firebase-config --check           fail if the files are out of date (CI)
 *   pnpm firebase-config --include-example include i18n/_example (template CI)
 */
import {command} from '../lib/cli.mjs';
import {syncFirebaseConfig} from '../lib/firebase.mjs';
import {fail, log} from '../lib/log.mjs';

export default command({
  meta: {name: 'firebase-config', description: 'Generate firebase.json and .firebaserc from i18n/*/site.json'},
  args: {
    check: {type: 'boolean', description: 'Fail when the files are out of date instead of writing them'},
    'include-example': {type: 'boolean', description: 'Include i18n/_example'},
  },
  async run({args}) {
    const {stale, written} = await syncFirebaseConfig({includeExample: Boolean(args['include-example']), check: Boolean(args.check)}).catch((e) => fail(e.message));
    if (args.check && stale.length) fail(`${stale.join(' and ')} out of date; run: pnpm firebase-config`);
    for (const name of written) log.ok(`wrote ${name}`);
    if (!stale.length) log.ok('firebase.json and .firebaserc are up to date');
  },
});
