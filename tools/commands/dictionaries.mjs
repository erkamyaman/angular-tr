/**
 * Refresh the UI dictionaries of a language from the current origin.
 *
 *   pnpm dictionaries <lang>            add new upstream strings (English value), keep translations
 *   pnpm dictionaries <lang> --prune    also drop keys upstream no longer has
 *   pnpm dictionaries <lang> --init     regenerate index-html.json (from site.json and LANGUAGE.md) and pipeline.json
 */
import {command, langArg, resolveLang} from '../lib/cli.mjs';
import {formatRefreshResult, refreshDictionaries} from '../lib/dictionaries.mjs';
import {exists} from '../lib/fs.mjs';
import {fail, log} from '../lib/log.mjs';
import {adevSrc, originDir} from '../lib/paths.mjs';

export default command({
  meta: {name: 'dictionaries', description: 'Refresh navigation.json, ui.json, index-html.json and pipeline.json from the current origin'},
  args: {
    lang: langArg,
    prune: {type: 'boolean', description: 'Drop keys upstream no longer has'},
    init: {type: 'boolean', description: 'Regenerate index-html.json (from site.json and LANGUAGE.md) and pipeline.json'},
  },
  async run({args}) {
    const lang = await resolveLang(args);
    if (!(await exists(adevSrc(originDir)))) fail(`origin not initialized (${originDir}). Run: pnpm bootstrap`);
    const result = await refreshDictionaries(lang, {prune: Boolean(args.prune), init: Boolean(args.init)});
    log.info(formatRefreshResult(lang, result));
    if (result.indexHtml.notMatching?.length) {
      fail(`Some index.html pairs no longer match upstream; edit i18n/${lang}/dictionaries/index-html.json`);
    }
    if (result.pipeline.notMatching?.length) {
      for (const m of result.pipeline.notMatching) log.warn(`  ${m.file}: ${JSON.stringify(m.find)}`);
      fail(`Some pipeline pairs no longer match upstream; fix their "find" in i18n/${lang}/dictionaries/pipeline.json`);
    }
  },
});
