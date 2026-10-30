import assert from 'node:assert/strict';
import path from 'node:path';
import {describe, test} from 'node:test';
import {CRAWL_EXCLUSIONS, CRAWL_SECTIONS, crawlerConfig, environmentSource, queryRequest, reindexRequest, triggerReindex, verifySearch} from '../lib/search.mjs';
import {fixturesDir, read} from './helpers.mjs';

const upstreamEnv = await read(path.join(fixturesDir, 'upstream', 'adev', 'src', 'app', 'environment.ts'));
const site = (search, analytics = {provider: 'none'}) => ({lang: 'fr', folder: 'fr', siteUrl: 'https://angular.fr', search, analytics});

describe('environmentSource', () => {
  test('provider none keeps upstream search credentials but drops the analytics id', () => {
    const out = environmentSource(upstreamEnv, site({provider: 'none'}));
    assert.ok(out.includes("appId: 'L1XWT2UJ7F'"), 'upstream app id kept');
    assert.ok(out.includes('const indexName = isPreRelease'), 'index name logic kept');
    assert.ok(out.includes("googleAnalyticsId: ''"));
    assert.ok(!out.includes('G-XB6NEVW32B'));
  });
  test('own index: credentials replaced, index name constant replaced, object literal untouched', () => {
    const out = environmentSource(upstreamEnv, site({provider: 'docsearch', appId: 'APP123', apiKey: 'search-only', indexName: 'angular_fr'}), );
    assert.ok(out.includes("appId: 'APP123'"));
    assert.ok(out.includes("apiKey: 'search-only'"));
    assert.ok(out.includes("const indexName = 'angular_fr'; // rosetta: fr"));
    assert.ok(out.includes('indexName: indexName,'), 'the literal still references the constant');
    assert.ok(!out.includes('L1XWT2UJ7F'));
    assert.ok(!out.includes('dfca7ed184db27927a512e5c6668b968'));
  });
  test('ga4 writes the site id; quotes in values are escaped', () => {
    const out = environmentSource(upstreamEnv, site({provider: 'none'}, {provider: 'ga4', id: 'G-ABC123'}));
    assert.ok(out.includes("googleAnalyticsId: 'G-ABC123'"));
    const weird = environmentSource(upstreamEnv, site({provider: 'algolia', appId: "it's", apiKey: 'k', indexName: 'i'}));
    assert.ok(weird.includes("appId: 'it\\'s'"));
  });
  test('stops when upstream changed the shape of the file', () => {
    assert.throws(() => environmentSource(upstreamEnv.replace('googleAnalyticsId', 'gaId'), site({provider: 'none'})), /expected exactly one googleAnalyticsId \(found 0\)/);
    assert.throws(() => environmentSource(upstreamEnv + "\nconst x = {appId: 'twice'};\n", site({provider: 'algolia', appId: 'a', apiKey: 'b', indexName: 'c'})), /expected exactly one appId \(found 2\)/);
  });
});

describe('crawlerConfig', () => {
  const config = crawlerConfig(site({provider: 'docsearch', appId: 'APP123', apiKey: 'search-only', indexName: 'angular_fr'}));
  test('is a Crawler configuration for the site with sitemap, exclusions and one action per section', () => {
    assert.ok(config.includes('new Crawler({'));
    assert.ok(config.includes("appId: 'APP123'"));
    assert.ok(!config.includes("apiKey: 'search-only'"), 'the search-only key never appears as the crawler key');
    assert.ok(config.includes("apiKey: 'YOUR_CRAWLER_API_KEY'"));
    assert.ok(config.includes("startUrls: ['https://angular.fr/']"));
    assert.ok(config.includes("sitemaps: ['https://angular.fr/sitemap.xml']"));
    for (const p of CRAWL_EXCLUSIONS) assert.ok(config.includes(`'https://angular.fr${p}'`), p);
    assert.equal((config.match(/recordExtractor:/g) ?? []).length, CRAWL_SECTIONS.length);
    assert.ok(config.includes("defaultValue: 'Tutorials'") && config.includes("defaultValue: 'Reference'") && config.includes("defaultValue: 'Docs'"));
    assert.ok(config.includes("pathsToMatch: ['https://angular.fr/tutorials/**']"));
    assert.ok(config.includes("aggregateContent: true"));
    assert.ok(config.includes("recordVersion: 'v3'"));
    assert.ok(config.includes("'angular_fr': {") || config.includes("angular_fr: {"), 'initial index settings keyed by index name');
    assert.equal((config.match(/indexName: 'angular_fr'/g) ?? []).length, CRAWL_SECTIONS.length);
  });
  test('defaults the index name from the language when none is configured', () => {
    const c = crawlerConfig(site({provider: 'none'}));
    assert.ok(c.includes("indexName: 'angular_fr'"));
    assert.ok(c.includes("appId: 'YOUR_APP_ID'"));
    const br = crawlerConfig({...site({provider: 'none'}), lang: 'pt-BR'});
    assert.ok(br.includes("indexName: 'angular_pt_br'"));
  });
  test('is valid JavaScript', () => {
    // Parse it as a script with a Crawler stub; the editor evaluates the same way.
    assert.doesNotThrow(() => new Function('Crawler', config.replace(/^\/\/.*$/gm, '')));
    const captured = [];
    new Function('Crawler', config)(class {
      constructor(c) {
        captured.push(c);
      }
    });
    const c = captured[0];
    assert.equal(c.actions.length, 3);
    assert.equal(typeof c.actions[0].recordExtractor, 'function');
    assert.ok(c.initialIndexSettings.angular_fr.searchableAttributes.includes('content'));
    const calls = [];
    c.actions[1].recordExtractor({helpers: {docsearch: (o) => (calls.push(o), [])}});
    assert.equal(calls[0].recordProps.lvl0.defaultValue, 'Reference');
    assert.equal(calls[0].recordProps.pageRank, '-1000');
    assert.equal(calls[0].recordProps.lvl1, 'main h1');
  });
});

describe('Crawler and search requests', () => {
  test('reindexRequest builds the basic-auth call and refuses incomplete credentials', () => {
    const {url, init} = reindexRequest({crawlerId: 'abc-123', userId: 'u', apiKey: 'k'});
    assert.equal(url, 'https://crawler.algolia.com/api/1/crawlers/abc-123/reindex');
    assert.equal(init.method, 'POST');
    assert.equal(init.headers.Authorization, `Basic ${Buffer.from('u:k').toString('base64')}`);
    assert.throws(() => reindexRequest({userId: 'u', apiKey: 'k'}), /no crawler id/);
    assert.throws(() => reindexRequest({crawlerId: 'x'}), /ALGOLIA_CRAWLER_USER_ID/);
  });
  test('triggerReindex returns the task id or explains the failure', async () => {
    const ok = async () => ({ok: true, status: 200, json: async () => ({taskId: 't-1'})});
    assert.equal(await triggerReindex({crawlerId: 'c', userId: 'u', apiKey: 'k'}, ok), 't-1');
    const denied = async () => ({ok: false, status: 403, json: async () => ({error: {message: 'no rights'}})});
    await assert.rejects(triggerReindex({crawlerId: 'c', userId: 'u', apiKey: 'k'}, denied), /HTTP 403 no rights/);
  });
  test('queryRequest targets the index with the search-only key', () => {
    const {url, init} = queryRequest({appId: 'APP', apiKey: 'K', indexName: 'angular fr'}, 'signal');
    assert.equal(url, 'https://APP-dsn.algolia.net/1/indexes/angular%20fr/query');
    assert.equal(init.headers['X-Algolia-API-Key'], 'K');
    assert.equal(JSON.parse(init.body).query, 'signal');
  });
  test('verifySearch tells apart credentials, empty index and wrong records', async () => {
    const creds = {appId: 'APP', apiKey: 'K', indexName: 'i'};
    const good = async () => ({ok: true, status: 200, json: async () => ({nbHits: 2, hits: [{url: 'https://angular.fr/guide/x#y', type: 'lvl2', hierarchy: {lvl0: 'Docs', lvl1: 'X'}}]})});
    const r = await verifySearch(creds, 'x', good);
    assert.equal(r.nbHits, 2);
    assert.deepEqual(r.hits, [{url: 'https://angular.fr/guide/x#y', lvl0: 'Docs', lvl1: 'X', type: 'lvl2'}]);
    assert.deepEqual(r.problems, []);
    const empty = async () => ({ok: true, status: 200, json: async () => ({nbHits: 0, hits: []})});
    assert.match((await verifySearch(creds, 'x', empty)).problems[0], /index is empty/);
    const wrong = async () => ({ok: true, status: 200, json: async () => ({nbHits: 1, hits: [{objectID: '1', title: 'not docsearch'}]})});
    assert.match((await verifySearch(creds, 'x', wrong)).problems[0], /not DocSearch records/);
    const bad = async () => ({ok: false, status: 403, json: async () => ({message: 'Invalid Application-ID or API key'})});
    await assert.rejects(verifySearch(creds, 'x', bad), /HTTP 403 Invalid Application-ID/);
  });
});
