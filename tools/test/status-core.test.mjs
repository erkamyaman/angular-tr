import assert from 'node:assert/strict';
import {rm} from 'node:fs/promises';
import path from 'node:path';
import {after, before, describe, test} from 'node:test';
import {commitAll, gitInit, initPage, makeRepo, makeUpstream, read, removeDir, tempDir, useRepo, write} from './helpers.mjs';

const repo = await makeRepo({example: false});
const upstream = await makeUpstream({git: true});
useRepo({root: repo.root, origin: upstream.dir});
const {STATES, blobContent, computeStatus, dictionaryStatus, originSha, totals} = await import('../lib/status-core.mjs');
const {blobHash, setMarker, writeMarked} = await import('../lib/snapshots.mjs');
const {refreshDictionaries} = await import('../lib/dictionaries.mjs');

after(async () => {
  await removeDir(repo.root);
  await removeDir(upstream.dir);
});

const lang = 'fr';
const src = path.join(repo.root, 'i18n', lang, 'src');
const byRel = (status) => Object.fromEntries(status.files.map((f) => [f.rel, f]));

before(async () => {
  await write(
    path.join(repo.root, 'i18n', lang, 'site.json'),
    JSON.stringify({lang, name: 'Français', englishName: 'French', direction: 'ltr', domain: 'angular.fr', repo: {owner: 'o', name: 'r'}, firebase: {projectId: 'p', target: 't'}}),
  );
  await gitInit(repo.root);
});

describe('computeStatus', () => {
  test('describes the language against the upstream checkout', async () => {
    const status = await computeStatus(lang);
    assert.equal(status.lang, lang);
    assert.equal(status.origin.sha, upstream.sha);
    assert.equal(status.origin.dir, upstream.dir);
    assert.ok(status.generatedAt);
  });
  test('every in-scope upstream page is untranslated at first', async () => {
    const status = await computeStatus(lang);
    assert.equal(status.files.length, 5);
    assert.ok(status.files.every((f) => f.state === STATES.untranslated));
    assert.equal(status.totals.inScope, 5);
    assert.equal(status.totals.translated, 0);
    assert.equal(status.totals.coverage, 0);
    assert.ok(!status.files.some((f) => f.rel.startsWith('content/examples') || f.rel.includes('license')));
  });
  test('all the states: up to date, outdated with class, stale snapshot, missing snapshot, removed, orphan, overlay', async () => {
    // up to date
    await initPage(repo.root, lang, 'content/introduction/what-is-angular.md', upstream.dir, {translate: (en) => en.replace('## Get started', '## Commencer {#get-started}')});
    // outdated: translated from an older English that is in this repo's history
    const rel = 'content/guide/signals/overview.md';
    const {translated, snapshot, english} = await initPage(repo.root, lang, rel, upstream.dir);
    await commitAll(repo.root, 'translate overview');
    const newEnglish = english.replace('const count = signal(0);', 'const count = signal(1);');
    await write(snapshot, newEnglish); // what update-origin does after upstream changed code only
    await write(path.join(upstream.dir, 'adev/src', rel), newEnglish);
    // stale snapshot: upstream moved again but the snapshot was not refreshed
    const rel2 = 'content/guide/components/anatomy-of-components.md';
    await initPage(repo.root, lang, rel2, upstream.dir);
    await write(path.join(upstream.dir, 'adev/src', rel2), (await read(path.join(upstream.dir, 'adev/src', rel2))) + '\nNew paragraph upstream.\n');
    // missing snapshot
    await write(path.join(src, 'content/reference/errors/NG0100.md'), '# Traduit sans snapshot\n');
    // removed upstream (pair exists, upstream file gone) and orphan snapshot (snapshot alone)
    await write(path.join(src, 'content/old/page.md'), '# Vieux\n');
    await write(path.join(src, 'content/old/page.en.md'), '# Old\n');
    await write(path.join(src, 'content/old/orphan.en.md'), '# Orphan\n');
    // overlay of a non-content file, up to date
    const versions = await read(path.join(upstream.dir, 'adev/src/assets/others/versions.json'));
    await write(path.join(src, 'assets/others/versions.en.json'), versions);
    await writeMarked(path.join(src, 'assets/others/versions.json'), versions.replace('https://angular.dev/', 'https://angular.fr/'), blobHash(versions));
    assert.equal((await read(path.join(src, 'assets/others/versions.json.source'))).trim(), blobHash(versions), 'JSON markers live in a sidecar');

    const status = await computeStatus(lang);
    const f = byRel(status);
    assert.equal(f['content/introduction/what-is-angular.md'].state, STATES.upToDate);
    assert.equal(f[rel].state, STATES.outdated);
    assert.equal(f[rel].class, 'a');
    assert.equal(f[rel].added, 1);
    assert.equal(f[rel].removed, 1);
    assert.equal(f[rel].markerHash, blobHash(english));
    assert.equal(f[rel].snapshotHash, blobHash(newEnglish));
    assert.equal(f[rel2].state, STATES.staleSnapshot);
    assert.equal(f[rel2].class, 'b');
    assert.equal(f[rel2].translationMatchesSnapshot, true);
    assert.equal(f['content/reference/errors/NG0100.md'].state, STATES.missingSnapshot);
    assert.equal(f['content/reference/errors/overview.md'].state, STATES.untranslated);
    assert.equal(f['content/old/page.md'].state, STATES.removed);
    assert.equal(f['content/old/page.md'].overlay, true);
    assert.equal(f['content/old/orphan.md'].state, STATES.orphanSnapshot);
    assert.equal(f['assets/others/versions.json'].state, STATES.upToDate);
    assert.equal(f['assets/others/versions.json'].overlay, true);

    const t = status.totals;
    assert.equal(t.inScope, 5);
    assert.equal(t.translated, 3, 'up to date + outdated + stale snapshot, content only');
    assert.equal(t.coverage, 60);
    assert.equal(t[STATES.removed], 1);
    assert.equal(t[STATES.orphanSnapshot], 1);
    assert.deepEqual(
      status.files.map((x) => x.rel),
      [...status.files.map((x) => x.rel)].sort((a, b) => a.localeCompare(b)),
      'sorted by path',
    );
    assert.ok(!('class' in (await computeStatus(lang, {withClasses: false})).files.find((x) => x.rel === rel)));
    assert.equal(f[rel].translated, undefined);
    assert.equal(translated.endsWith('overview.md'), true);
  });
  test('an outdated translation whose old English is unknown gets class "unknown"; no marker gets "no-marker"', async () => {
    const rel = 'content/reference/errors/overview.md';
    const english = await read(path.join(upstream.dir, 'adev/src', rel));
    await write(path.join(src, rel.replace('.md', '.en.md')), english);
    await write(path.join(src, rel), setMarker(rel, '# Encyclopédie\n', blobHash('never committed english')));
    let f = byRel(await computeStatus(lang))[rel];
    assert.equal(f.state, STATES.outdated);
    assert.equal(f.class, 'unknown');
    await write(path.join(src, rel), '# Encyclopédie sans marqueur\n');
    f = byRel(await computeStatus(lang))[rel];
    assert.equal(f.state, STATES.outdated);
    assert.equal(f.class, 'no-marker');
    await rm(path.join(src, rel));
    await rm(path.join(src, rel.replace('.md', '.en.md')));
  });
});

describe('blobContent and originSha', () => {
  test('blobContent returns the exact committed content (trailing newline included) or null', async () => {
    const english = await read(path.join(src, 'content/introduction/what-is-angular.en.md'));
    assert.ok(english.endsWith('\n'));
    assert.equal(await blobContent(blobHash(english)), english);
    assert.equal(await blobContent(blobHash('not in history')), null);
  });
  test('originSha reads the upstream HEAD and is null outside a repository', async () => {
    assert.equal(await originSha(), upstream.sha);
    const plain = await tempDir();
    try {
      assert.equal(await originSha(plain), null);
    } finally {
      await removeDir(plain);
    }
  });
});

describe('totals', () => {
  test('counts states and coverage over content files only', () => {
    const t = totals([
      {rel: 'a', state: STATES.upToDate},
      {rel: 'b', state: STATES.outdated},
      {rel: 'c', state: STATES.untranslated},
      {rel: 'd', state: STATES.removed},
      {rel: 'e', state: STATES.upToDate, overlay: true},
      {rel: 'f', state: STATES.orphanSnapshot},
    ]);
    assert.equal(t.inScope, 3);
    assert.equal(t.translated, 2);
    assert.equal(t.coverage, 66.7);
    assert.equal(t[STATES.upToDate], 2);
    assert.equal(t[STATES.orphanSnapshot], 1);
    assert.equal(totals([]).coverage, 0);
  });
});

describe('dictionaryStatus', () => {
  test('reports missing, untranslated and obsolete navigation labels, UI strings and dead pairs', async () => {
    await refreshDictionaries(lang, {init: true});
    const dictDir = path.join(repo.root, 'i18n', lang, 'dictionaries');
    const nav = JSON.parse(await read(path.join(dictDir, 'navigation.json')));
    nav['Introduction'] = 'Présentation';
    delete nav['Signals'];
    nav['Gone'] = 'Parti';
    await write(path.join(dictDir, 'navigation.json'), JSON.stringify(nav));
    const ui = JSON.parse(await read(path.join(dictDir, 'ui.json')));
    ui['src/app/features/home/home.component.html']['Get Started'] = 'Commencer';
    delete ui['src/app/features/home/home.component.html']['Copy'];
    ui['src/app/gone.html'] = {Bye: 'Au revoir'};
    await write(path.join(dictDir, 'ui.json'), JSON.stringify(ui));
    const pairs = JSON.parse(await read(path.join(dictDir, 'index-html.json')));
    pairs.push({find: 'dead', replace: 'x'});
    await write(path.join(dictDir, 'index-html.json'), JSON.stringify(pairs));
    const pipeline = JSON.parse(await read(path.join(dictDir, 'pipeline.json')));
    pipeline[0].replace = "NOTE = 'Note',";
    pipeline.push({file: pipeline[0].file, find: 'gone text', replace: 'gone text'});
    await write(path.join(dictDir, 'pipeline.json'), JSON.stringify(pipeline));

    const d = await dictionaryStatus(lang);
    assert.equal(d.pipeline.total, pipeline.length);
    assert.equal(d.pipeline.translated, 1);
    assert.deepEqual(d.pipeline.missing, [{file: pipeline[0].file, find: 'gone text'}]);
    assert.equal(d.navigation.total, 10);
    assert.deepEqual(d.navigation.missing, ['Signals']);
    assert.equal(d.navigation.translated, 1);
    assert.equal(d.navigation.untranslated.length, 8);
    assert.deepEqual(d.navigation.obsolete, ['Gone']);
    assert.deepEqual(d.ui.missing, {'src/app/features/home/home.component.html': ['Copy']});
    assert.equal(d.ui.translated, 1);
    assert.deepEqual(d.ui.obsolete, {'src/app/gone.html': ['Bye']});
    assert.deepEqual(d.indexHtml.missing, ['dead']);
    assert.equal(d.indexHtml.total, pairs.length);
  });
});
