/**
 * List configured languages.
 *   pnpm languages                 one per line
 *   pnpm languages --json          ["fr","es"]
 *   pnpm languages --matrix        {"include":[{"lang":"fr"},…]}  (GitHub Actions matrix)
 *   --include-example              include i18n/_example (the template's CI uses it)
 */
import {command} from '../lib/cli.mjs';
import {listLanguages} from '../lib/languages.mjs';

export default command({
  meta: {name: 'languages', description: 'List the configured languages'},
  args: {
    json: {type: 'boolean', description: 'Print a JSON array'},
    matrix: {type: 'boolean', description: 'Print a GitHub Actions matrix: {"include":[{"lang":"fr"}]}'},
    'include-example': {type: 'boolean', description: 'Include i18n/_example (used by the template CI)'},
  },
  async run({args}) {
    const langs = await listLanguages({includeExample: Boolean(args['include-example'])});
    if (args.matrix) console.log(JSON.stringify({include: langs.map((lang) => ({lang}))}));
    else if (args.json) console.log(JSON.stringify(langs));
    else console.log(langs.join('\n'));
  },
});
