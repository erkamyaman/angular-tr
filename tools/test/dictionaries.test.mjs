import assert from 'node:assert/strict';
import path from 'node:path';
import {after, before, describe, test} from 'node:test';
import {makeRepo, makeUpstream, read, removeDir, useRepo, write} from './helpers.mjs';

const repo = await makeRepo({example: false});
const upstream = await makeUpstream({git: false});
useRepo({root: repo.root, origin: upstream.dir});
const {formatRefreshResult, refreshDictionaries} = await import('../lib/dictionaries.mjs');

after(async () => {
  await removeDir(repo.root);
  await removeDir(upstream.dir);
});

const dictDir = path.join(repo.root, 'i18n', 'fr', 'dictionaries');
const json = async (name) => JSON.parse(await read(path.join(dictDir, name)));

before(async () => {
  await write(
    path.join(repo.root, 'i18n', 'fr', 'site.json'),
    JSON.stringify({lang: 'fr', name: 'Français', englishName: 'French', direction: 'ltr', domain: 'angular.fr', repo: {owner: 'o', name: 'r'}, firebase: {projectId: 'p', target: 't'}}),
  );
  await write(path.join(repo.root, 'i18n', 'fr', 'LANGUAGE.md'), '---\nlang: fr\nfonts: [https://fonts.example/fr.css]\n---\n');
});

describe('refreshDictionaries', () => {
  test('first run creates the three dictionaries with English values and generated index pairs', async () => {
    const r = await refreshDictionaries('fr', {init: true});
    assert.equal(r.navigation.total, 10);
    assert.equal(r.navigation.added, 10);
    assert.equal(r.navigation.untranslated, 10);
    assert.equal(r.ui.added, r.ui.total);
    assert.ok(r.indexHtml.generated);
    assert.equal(r.indexHtml.total, 7, 'six default pairs plus the font stylesheet');
    assert.deepEqual(r.indexHtml.notMatching, []);
    const nav = await json('navigation.json');
    assert.equal(nav['What is Angular?'], 'What is Angular?');
    assert.deepEqual(Object.keys(nav).slice(0, 3), ['Introduction', 'What is Angular?', 'In-depth Guides']);
    const ui = await json('ui.json');
    assert.deepEqual(Object.keys(ui), [
      'shared-docs/components/cookie-popup/cookie-popup.component.html',
      'shared-docs/components/table-of-contents/table-of-contents.component.html',
      'src/app/core/layout/footer/footer.component.html',
      'src/app/features/home/home.component.html',
    ]);
    assert.equal(ui['src/app/features/home/home.component.html']['Get Started'], 'Get Started');
    assert.equal(ui['shared-docs/components/table-of-contents/table-of-contents.component.html']['On this page'], 'On this page');
    const pipeline = await json('pipeline.json');
    assert.ok(r.pipeline.generated);
    assert.equal(r.pipeline.total, pipeline.length);
    assert.equal(r.pipeline.untranslated, pipeline.length);
    assert.deepEqual(r.pipeline.notMatching, []);
    assert.deepEqual(pipeline[0], {
      file: 'shared-docs/pipeline/shared/marked/extensions/docs-alert.mts',
      find: "NOTE = 'NOTE',",
      replace: "NOTE = 'NOTE',",
      note: 'label of `NOTE:` alerts (translate the quoted text only; the keyword in Markdown stays NOTE)',
    });
    assert.match(formatRefreshResult('fr', r), new RegExp(`pipeline.json: ${pipeline.length} pairs \\(generated\\), ${pipeline.length} added, ${pipeline.length} still English, all matching`));
    const pairs = await json('index-html.json');
    assert.deepEqual(pairs[0], {find: '<html lang="en"', replace: '<html lang="fr"', note: 'document language'});
    assert.ok(pairs.some((p) => p.replace.includes('fonts.example/fr.css')));
    assert.match(formatRefreshResult('fr', r), /fr: navigation.json: 10 labels, 10 added, 10 still English/);
    assert.match(formatRefreshResult('fr', r), /index-html.json: 7 pairs \(generated\), all matching/);
  });
  test('translations are kept, new upstream strings are added, obsolete keys kept unless pruned', async () => {
    const nav = await json('navigation.json');
    nav['Introduction'] = 'Présentation';
    nav['Gone label'] = 'Disparu';
    await write(path.join(dictDir, 'navigation.json'), JSON.stringify(nav));
    const ui = await json('ui.json');
    ui['src/app/features/home/home.component.html']['Get Started'] = 'Commencer';
    ui['src/app/features/home/home.component.html']['Old string'] = 'Vieux';
    ui['src/app/gone.component.html'] = {Bye: 'Au revoir'};
    await write(path.join(dictDir, 'ui.json'), JSON.stringify(ui));

    const r1 = await refreshDictionaries('fr');
    assert.equal(r1.navigation.added, 0);
    assert.equal(r1.navigation.obsolete, 1);
    assert.equal(r1.navigation.pruned, 0);
    assert.equal(r1.navigation.untranslated, 9);
    assert.equal(r1.ui.obsolete, 2);
    assert.equal((await json('navigation.json'))['Gone label'], 'Disparu');
    assert.equal((await json('navigation.json'))['Introduction'], 'Présentation');
    assert.equal((await json('ui.json'))['src/app/features/home/home.component.html']['Get Started'], 'Commencer');
    assert.ok((await json('ui.json'))['src/app/gone.component.html']);
    assert.match(formatRefreshResult('fr', r1), /1 obsolete \(kept; --prune to drop\)/);
    assert.ok(!r1.indexHtml.generated, 'existing index pairs are only verified');

    const r2 = await refreshDictionaries('fr', {prune: true});
    assert.equal(r2.navigation.pruned, 1);
    assert.equal(r2.ui.pruned, 2);
    assert.equal((await json('navigation.json'))['Gone label'], undefined);
    assert.equal((await json('ui.json'))['src/app/gone.component.html'], undefined);
    assert.equal((await json('ui.json'))['src/app/features/home/home.component.html']['Old string'], undefined);
    assert.equal((await json('ui.json'))['src/app/features/home/home.component.html']['Get Started'], 'Commencer');
  });
  test('pipeline translations are kept, new seeds added, a pair whose text changed upstream is reported', async () => {
    const pipeline = await json('pipeline.json');
    const note = pipeline.find((p) => p.find === "NOTE = 'NOTE',");
    note.replace = "NOTE = 'Note\u202F',";
    const custom = {file: 'shared-docs/pipeline/shared/marked/extensions/docs-alert.mts', find: "level: 'inline',", replace: "level: 'inline',", note: 'custom'};
    const stale = {file: 'shared-docs/pipeline/shared/marked/extensions/docs-alert.mts', find: "TIP = 'OLD TIP',", replace: "TIP = 'Astuce',"};
    await write(path.join(dictDir, 'pipeline.json'), JSON.stringify([note, custom, stale]));
    const r = await refreshDictionaries('fr');
    const after = await json('pipeline.json');
    assert.ok(!r.pipeline.generated);
    assert.equal(after[0].replace, "NOTE = 'Note\u202F',", 'translation kept');
    assert.equal(r.pipeline.added, (await json('pipeline.json')).length - 3, 'seeds that were missing are added in upstream order');
    assert.ok(after.some((p) => p.find === "TIP = 'TIP',"), 'the current TIP seed is added');
    assert.ok(after.some((p) => p.note === 'custom'), 'custom pairs are kept');
    assert.ok(after.some((p) => p.find === "TIP = 'OLD TIP',"), 'a pair whose text changed is kept for a human to fix');
    assert.deepEqual(r.pipeline.notMatching, [{file: 'shared-docs/pipeline/shared/marked/extensions/docs-alert.mts', find: "TIP = 'OLD TIP',"}]);
    assert.match(formatRefreshResult('fr', r), /1 NOT matching upstream/);
    await write(path.join(dictDir, 'pipeline.json'), JSON.stringify(after.filter((p) => p !== after.find((q) => q.find === "TIP = 'OLD TIP',"))));
    assert.deepEqual((await refreshDictionaries('fr')).pipeline.notMatching, []);
  });
  test('dead index.html pairs are reported, not silently dropped', async () => {
    const pairs = await json('index-html.json');
    pairs.push({find: '<meta name="gone"', replace: 'x'});
    await write(path.join(dictDir, 'index-html.json'), JSON.stringify(pairs));
    const r = await refreshDictionaries('fr');
    assert.deepEqual(r.indexHtml.notMatching, ['<meta name="gone"']);
    assert.match(formatRefreshResult('fr', r), /1 NOT matching upstream/);
    const regenerated = await refreshDictionaries('fr', {init: true});
    assert.deepEqual(regenerated.indexHtml.notMatching, []);
  });
});
