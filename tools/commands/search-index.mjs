/**
 * Site search (Algolia): the crawler configuration, a credentials check, and a reindex trigger.
 *
 *   pnpm search-index <lang>                 print the Algolia Crawler configuration for the site
 *   pnpm search-index <lang> --out file.js   write it to a file
 *   pnpm search-index <lang> --verify        query the configured index with the search-only key
 *   pnpm search-index <lang> --reindex       start a crawl (needs search.crawlerId in site.json and
 *                                      ALGOLIA_CRAWLER_USER_ID / ALGOLIA_CRAWLER_API_KEY)
 * See docs/search.md.
 */
import {command, langArg, resolveLang} from '../lib/cli.mjs';
import {writeText} from '../lib/fs.mjs';
import {loadSite} from '../lib/languages.mjs';
import {fail, log} from '../lib/log.mjs';
import {crawlerConfig, triggerReindex, verifySearch} from '../lib/search.mjs';

export default command({
  meta: {name: 'search-index', description: 'Algolia crawler configuration, credentials check and reindex trigger'},
  args: {
    lang: langArg,
    out: {type: 'string', valueHint: 'file', description: 'Write the crawler configuration to this file'},
    verify: {type: 'boolean', description: 'Run a test query against the configured index'},
    query: {type: 'string', valueHint: 'text', description: 'Query used by --verify', default: 'component'},
    reindex: {type: 'boolean', description: 'Start a crawl through the Crawler API'},
  },
  async run({args}) {
    const lang = await resolveLang(args);
    const site = await loadSite(lang).catch((e) => fail(e.message));
    const configured = site.search.provider !== 'none';

    if (args.verify) {
      if (!configured) fail(`i18n/${lang}/site.json: search.provider is "none" (upstream's English index is used); nothing to verify`);
      const r = await verifySearch(site.search, String(args.query)).catch((e) => fail(e.message));
      log.info(`${site.search.indexName}: ${r.nbHits} hit(s) for "${args.query}"`);
      for (const h of r.hits) log.dim(`  ${h.lvl0 ?? '?'} › ${h.lvl1 ?? '?'}  ${h.url}`);
      for (const p of r.problems) log.warn(p);
      if (r.problems.length) process.exit(1);
      log.ok('search credentials and index look right');
      return;
    }

    if (args.reindex) {
      if (!configured) {
        log.info(`i18n/${lang}/site.json: no search configured; nothing to reindex`);
        return;
      }
      if (!site.search.crawlerId) {
        log.info(`i18n/${lang}/site.json: no search.crawlerId; skipping the crawl trigger (crawl from the Algolia dashboard, or set the id)`);
        return;
      }
      const taskId = await triggerReindex({
        crawlerId: site.search.crawlerId,
        userId: process.env.ALGOLIA_CRAWLER_USER_ID,
        apiKey: process.env.ALGOLIA_CRAWLER_API_KEY,
      }).catch((e) => fail(e.message));
      log.ok(`crawl started for ${site.search.indexName}${taskId ? ` (task ${taskId})` : ''}`);
      return;
    }

    const config = crawlerConfig(site);
    if (args.out) {
      await writeText(String(args.out), config);
      log.ok(`wrote ${args.out}`);
    } else {
      process.stdout.write(config);
    }
    if (!configured) log.warn(`i18n/${lang}/site.json: search.provider is "none"; fill appId, apiKey and indexName once the Algolia application exists (docs/search.md)`);
  },
});
