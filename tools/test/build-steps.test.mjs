/**
 * Build steps that do not need Bazel: worktree, overlay, dictionaries, patches, generated config,
 * status report and post-processing of a (fake) build output. The repository has the fixture
 * upstream as origin/ (a real git repository), so ROSETTA_ORIGIN stays unset like in a real build.
 */
import assert from 'node:assert/strict';
import {chmod, lstat, mkdir, stat, symlink} from 'node:fs/promises';
import path from 'node:path';
import {after, before, describe, test} from 'node:test';
import {execa} from 'execa';
import {initPage, makeRepo, read, removeDir, useRepo, write} from './helpers.mjs';

const repo = await makeRepo({example: false, origin: true});
useRepo({root: repo.root});
const {ENVIRONMENT_FILE, OUTPUT_REL, applyDictionaries, applyEnvironment, applyOverlay, applyPatches, checkNodeVersion, postProcess, prepareBuild, prepareWorktree, writeRosettaConfig, writeStatusReport} =
  await import('../lib/build-steps.mjs');
const {refreshDictionaries} = await import('../lib/dictionaries.mjs');
const {exists} = await import('../lib/fs.mjs');

after(() => removeDir(repo.root));

const lang = 'fr';
const langDir = path.join(repo.root, 'i18n', lang);
let dir;

before(async () => {
  await write(
    path.join(langDir, 'site.json'),
    JSON.stringify({
      lang,
      name: 'Français',
      englishName: 'French',
      direction: 'ltr',
      domain: 'angular.fr',
      repo: {owner: 'org', name: 'docs-fr'},
      firebase: {projectId: 'p', target: 't'},
      notice: 'Traduction communautaire.',
      strings: {otherLanguages: 'Autres langues'},
    }),
  );
  await write(path.join(repo.root, 'i18n', 'de', 'site.json'), JSON.stringify({lang: 'de', name: 'Deutsch', englishName: 'German', direction: 'ltr', domain: 'angular.example', repo: {owner: 'org', name: 'docs-de'}, firebase: {projectId: 'p', target: 'd'}}));
  await write(path.join(repo.root, 'i18n', 'broken', 'site.json'), '{"lang": "broken"}');
  await refreshDictionaries(lang, {init: true});
  const dictDir = path.join(langDir, 'dictionaries');
  const nav = JSON.parse(await read(path.join(dictDir, 'navigation.json')));
  nav['Introduction'] = 'Présentation';
  nav['What is Angular?'] = "Qu'est-ce qu'Angular ?";
  await write(path.join(dictDir, 'navigation.json'), JSON.stringify(nav));
  const ui = JSON.parse(await read(path.join(dictDir, 'ui.json')));
  ui['src/app/features/home/home.component.html']['Get Started'] = 'Commencer';
  ui['src/app/features/home/home.component.html']['Get started with Angular'] = 'Commencer avec "Angular"';
  ui['shared-docs/components/table-of-contents/table-of-contents.component.html']['On this page'] = 'Sur cette page';
  await write(path.join(dictDir, 'ui.json'), JSON.stringify(ui));
  const pipeline = JSON.parse(await read(path.join(dictDir, 'pipeline.json')));
  pipeline.find((p) => p.find === "NOTE = 'NOTE',").replace = "NOTE = 'Note\u202F',";
  await write(path.join(dictDir, 'pipeline.json'), JSON.stringify(pipeline));
  await initPage(repo.root, lang, 'content/introduction/what-is-angular.md', repo.origin, {translate: (en) => en.replace('## Get started', '## Commencer {#get-started}')});
  await write(path.join(langDir, 'src', 'assets', 'others', 'versions.json'), '[{"version": "v22", "url": "https://angular.fr/"}]\n');
  await write(path.join(langDir, 'src', 'assets', 'others', 'versions.json.source'), 'abc\n');
  await write(path.join(langDir, 'src', 'assets', 'others', 'versions.en.json'), '[]\n');
  await write(path.join(langDir, 'src', 'assets', 'images', 'logo.png'), Buffer.from([0x89, 0x50, 0x4e, 0x47]));
});

describe('prepareWorktree', () => {
  test('creates a detached worktree of origin at its HEAD and copies .bazelrc as .bazelrc.user', async () => {
    const r = await prepareWorktree(lang);
    dir = r.dir;
    assert.equal(r.sha, repo.originSha);
    assert.equal(dir, path.join(repo.root, 'build', lang));
    assert.equal((await execa('git', ['rev-parse', 'HEAD'], {cwd: dir})).stdout.trim(), repo.originSha);
    assert.equal(await read(path.join(dir, '.bazelrc.user')), 'build --jobs=1\n');
    assert.ok(await read(path.join(dir, 'adev', 'src', 'index.html')));
  });
  test('resets an existing worktree (stray files removed, modifications reverted)', async () => {
    await write(path.join(dir, 'stray.txt'), 'x');
    await write(path.join(dir, 'adev', 'src', 'index.html'), 'modified');
    await write(path.join(repo.root, '.bazelrc.user'), 'build --personal\n');
    const r = await prepareWorktree(lang);
    assert.equal(r.dir, dir);
    const {exists} = await import('../lib/fs.mjs');
    assert.ok(!(await exists(path.join(dir, 'stray.txt'))));
    assert.ok((await read(path.join(dir, 'adev', 'src', 'index.html'))).includes('<html lang="en"'));
    assert.equal(await read(path.join(dir, '.bazelrc.user')), 'build --jobs=1\n\nbuild --personal\n');
  });
});

describe('applyOverlay', () => {
  test('copies translations without markers and sidecars; binary files verbatim', async () => {
    const n = await applyOverlay(lang, dir);
    assert.equal(n, 3, 'page + versions.json + logo.png');
    const page = await read(path.join(dir, 'adev/src/content/introduction/what-is-angular.md'));
    assert.ok(!page.includes('source:'));
    assert.ok(page.includes('## Commencer {#get-started}'));
    assert.equal(await read(path.join(dir, 'adev/src/assets/others/versions.json')), '[{"version": "v22", "url": "https://angular.fr/"}]\n');
    const {exists} = await import('../lib/fs.mjs');
    assert.ok(!(await exists(path.join(dir, 'adev/src/assets/others/versions.json.source'))));
    assert.ok(!(await exists(path.join(dir, 'adev/src/assets/others/versions.en.json'))));
    assert.ok(await exists(path.join(dir, 'adev/src/assets/images/logo.png')));
  });
});

describe('applyDictionaries', () => {
  test('translates navigation labels, UI strings, index.html and pipeline pairs in the build directory', async () => {
    await applyDictionaries(lang, dir);
    const toc = await read(path.join(dir, 'adev/shared-docs/components/table-of-contents/table-of-contents.component.html'));
    assert.ok(toc.includes('<h2 class="docs-title">Sur cette page</h2>'), 'shared-docs templates are covered');
    const alerts = await read(path.join(dir, 'adev/shared-docs/pipeline/shared/marked/extensions/docs-alert.mts'));
    assert.ok(alerts.includes("NOTE = 'Note\u202F',") && alerts.includes("TIP = 'TIP',"));
    const nav = await read(path.join(dir, 'adev/src/app/routing/navigation-entries/index.ts'));
    assert.ok(nav.includes("label: 'Présentation'"));
    assert.ok(nav.includes("label: 'Qu\\'est-ce qu\\'Angular ?'"));
    assert.ok(nav.includes("label: 'Signals'"), 'untranslated labels stay English');
    const home = await read(path.join(dir, 'adev/src/app/features/home/home.component.html'));
    assert.ok(home.includes('<span>Commencer</span>'));
    assert.ok(home.includes('aria-label="Commencer avec &quot;Angular&quot;"'));
    const index = await read(path.join(dir, 'adev/src/index.html'));
    assert.ok(index.includes('<html lang="fr"'));
    assert.ok(index.includes('href="https://angular.fr"'));
    assert.ok(index.includes('content="https://angular.fr/assets/images/ng-image.jpg"'));
  });
  test('a dead index.html pair fails the build unless lenient', async () => {
    const file = path.join(langDir, 'dictionaries', 'index-html.json');
    const pairs = JSON.parse(await read(file));
    await write(file, JSON.stringify([...pairs, {find: '<meta name="gone"', replace: 'x'}]));
    await prepareWorktree(lang);
    await assert.rejects(applyDictionaries(lang, dir), /1 pair\(s\) no longer match upstream[\s\S]*--lenient/);
    await prepareWorktree(lang);
    await applyDictionaries(lang, dir, {lenient: true});
    await write(file, JSON.stringify(pairs));
  });
});

describe('applyEnvironment', () => {
  test('provider none: upstream search stays, analytics id is emptied', async () => {
    await applyEnvironment(lang, dir);
    const env = await read(path.join(dir, ENVIRONMENT_FILE));
    assert.ok(env.includes("appId: 'L1XWT2UJ7F'"));
    assert.ok(env.includes("googleAnalyticsId: ''"));
  });
  test('own index and GA4 id from site.json', async () => {
    const file = path.join(langDir, 'site.json');
    const site = JSON.parse(await read(file));
    await write(file, JSON.stringify({...site, search: {provider: 'docsearch', appId: 'APP123', apiKey: 'search-only', indexName: 'angular_fr'}, analytics: {provider: 'ga4', id: 'G-TEST1'}}));
    await prepareWorktree(lang);
    await applyEnvironment(lang, dir);
    const env = await read(path.join(dir, ENVIRONMENT_FILE));
    assert.ok(env.includes("appId: 'APP123'") && env.includes("apiKey: 'search-only'") && env.includes("const indexName = 'angular_fr';"));
    assert.ok(env.includes("googleAnalyticsId: 'G-TEST1'"));
    await write(file, JSON.stringify(site));
  });
  test('a half-configured search block is rejected by the schema before anything is written', async () => {
    const file = path.join(langDir, 'site.json');
    const site = JSON.parse(await read(file));
    await write(file, JSON.stringify({...site, search: {provider: 'algolia', appId: 'APP'}}));
    await assert.rejects(applyEnvironment(lang, dir), /required property 'indexName'|required property 'apiKey'/);
    await write(file, JSON.stringify(site));
  });
});

describe('writeRosettaConfig and writeStatusReport', () => {
  test('rosetta-config.ts carries the site, the switcher languages and the strings', async () => {
    await writeRosettaConfig(lang, dir);
    const ts = await read(path.join(dir, 'adev/src/app/rosetta/rosetta-config.ts'));
    assert.ok(ts.startsWith('// Generated by angular-docs-rosetta'));
    const json = JSON.parse(ts.slice(ts.indexOf('= ') + 2, ts.lastIndexOf(' as const')));
    assert.equal(json.lang, 'fr');
    assert.equal(json.siteUrl, 'https://angular.fr');
    assert.equal(json.repoUrl, 'https://github.com/org/docs-fr');
    assert.equal(json.issueUrl, 'https://github.com/org/docs-fr/issues/new?template=translation-error.yml');
    assert.equal(json.notice, 'Traduction communautaire.');
    assert.equal(json.strings.otherLanguages, 'Autres langues');
    assert.equal(json.strings.readInEnglish, 'Read this page in English');
    assert.deepEqual(
      json.languages.map((l) => l.lang),
      ['de', 'fr'],
      'the broken sibling is skipped, both valid languages are listed',
    );
  });
  test('translation-status.json lists every in-scope page by route id', async () => {
    await applyOverlay(lang, dir);
    const compact = await writeStatusReport(lang, dir);
    const written = JSON.parse(await read(path.join(dir, 'adev/src/assets/others/translation-status.json')));
    assert.deepEqual(written, compact);
    assert.equal(compact.lang, 'fr');
    assert.equal(compact.origin, repo.originSha);
    assert.equal(compact.pages['introduction/what-is-angular'], 'up-to-date');
    assert.equal(compact.pages['guide/signals/overview'], 'untranslated');
    assert.equal(Object.keys(compact.pages).length, 5);
    assert.ok(!('assets/others/versions' in compact.pages), 'overlays are not pages');
    assert.equal(compact.totals.translated, 1);
  });
});

describe('applyPatches', () => {
  test('applies every patch of tools/adev-patches after checking it; a dead patch throws', async () => {
    await prepareWorktree(lang);
    // Generate a real patch against the pinned upstream from inside the worktree.
    const target = path.join(dir, 'adev', 'src', 'index.html');
    const original = await read(target);
    await write(target, original.replace('<adev-root></adev-root>', '<adev-root></adev-root>\n    <!-- rosetta -->'));
    const {stdout: patch} = await execa('git', ['diff'], {cwd: dir, stripFinalNewline: false});
    await execa('git', ['checkout', '--', '.'], {cwd: dir});
    const patchesDir = path.join(repo.root, 'tools', 'adev-patches');
    await write(path.join(patchesDir, '010-test.patch'), patch);
    assert.equal(await applyPatches(dir), 1);
    assert.ok((await read(target)).includes('<!-- rosetta -->'));
    // Applying again fails the check: the patch no longer applies.
    await assert.rejects(applyPatches(dir), /010-test.patch no longer applies/);
    assert.equal(await applyPatches(dir, {skip: true}), 0);
    await write(path.join(patchesDir, '010-test.patch'), patch.replace('<adev-root></adev-root>', '<nope>'));
    await prepareWorktree(lang);
    await assert.rejects(applyPatches(dir), /no longer applies[\s\S]*docs\/maintenance.md#patches/);
    await removeDir(patchesDir);
    assert.equal(await applyPatches(dir), 0, 'no patches directory: nothing to do');
  });
});

describe('prepareBuild', () => {
  test('applies patches on pristine upstream before the dictionaries rewrite the text the patches touch', async () => {
    await prepareWorktree(lang);
    // A patch whose context lines hold a string the UI dictionary translates ("Get Started" -> "Commencer").
    const target = path.join(dir, 'adev', 'src', 'app', 'features', 'home', 'home.component.html');
    const original = await read(target);
    await write(target, original.replace('<span>Get Started</span>', '<span>Get Started</span>\n      <!-- rosetta -->'));
    const {stdout: patch} = await execa('git', ['diff'], {cwd: dir, stripFinalNewline: false});
    await execa('git', ['checkout', '--', '.'], {cwd: dir});
    const patchesDir = path.join(repo.root, 'tools', 'adev-patches');
    await write(path.join(patchesDir, '010-test.patch'), patch);
    await prepareWorktree(lang);
    await prepareBuild(lang, dir);
    const home = await read(target);
    assert.ok(home.includes('<span>Commencer</span>\n      <!-- rosetta -->'), 'both the patch and the translation are in the result');
    assert.ok((await read(path.join(dir, 'adev/src/index.html'))).includes('<html lang="fr"'));
    assert.ok(await exists(path.join(dir, 'adev/src/app/rosetta/rosetta-config.ts')));
    assert.ok(await exists(path.join(dir, 'adev/src/assets/others/translation-status.json')));
    await removeDir(patchesDir);
  });
});

describe('checkNodeVersion', () => {
  test('never throws, with or without .nvmrc', async () => {
    await checkNodeVersion(dir);
    await checkNodeVersion(path.join(repo.root, 'i18n'));
  });
});

describe('postProcess', () => {
  test('rewrites edit links, injects canonical and hreflang, writes sitemap and robots', async () => {
    const out = path.join(dir, OUTPUT_REL);
    const edit = 'https://github.com/angular/angular/edit/main/adev/src/content/guide/signals/overview.md';
    const blob = 'https://github.com/angular/angular/blob/main/adev/src/content/introduction/what-is-angular.md';
    await write(path.join(out, 'index.html'), `<html><head><link rel="canonical" href="https://angular.dev" /><title>A</title></head><body><a href="${blob}">edit</a></body></html>`);
    await write(path.join(out, 'guide/signals/overview/index.html'), `<html><head><title>S</title></head><body>page</body></html>`);
    await write(path.join(out, '404/index.html'), '<html><head></head><body>404</body></html>');
    await write(path.join(out, 'main-ABCDEFGH.js'), `const edit = "${edit}";`);
    await write(path.join(out, 'robots.txt'), 'User-agent: *\nAllow: /\n');

    const r = await postProcess(lang, dir);
    assert.equal(r.out, out);
    assert.equal(r.pages, 2, '404 is not a page');
    const home = await read(path.join(out, 'index.html'));
    assert.ok(home.includes('<link rel="canonical" href="https://angular.fr/" />'));
    assert.ok(!home.includes('href="https://angular.dev" />'), 'the upstream canonical is replaced');
    assert.ok(home.includes('<link rel="alternate" hreflang="fr" href="https://angular.fr/" />'));
    assert.ok(home.includes('<link rel="alternate" hreflang="en" href="https://angular.dev/" />'));
    assert.ok(home.includes('<link rel="alternate" hreflang="x-default" href="https://angular.dev/" />'));
    assert.ok(home.includes('https://github.com/org/docs-fr/edit/main/i18n/fr/src/content/introduction/what-is-angular.md'));
    const page = await read(path.join(out, 'guide/signals/overview/index.html'));
    assert.ok(page.includes('<link rel="canonical" href="https://angular.fr/guide/signals/overview" />'));
    assert.ok(page.includes('hreflang="en" href="https://angular.dev/guide/signals/overview"'));
    const js = await read(path.join(out, 'main-ABCDEFGH.js'));
    assert.ok(js.includes('https://github.com/org/docs-fr/edit/main/i18n/fr/src/content/guide/signals/overview.md'));
    const sitemap = await read(path.join(out, 'sitemap.xml'));
    assert.ok(sitemap.includes('<loc>https://angular.fr/</loc>'));
    assert.ok(sitemap.includes('<loc>https://angular.fr/guide/signals/overview/</loc>'));
    assert.ok(!sitemap.includes('404'));
    const robots = await read(path.join(out, 'robots.txt'));
    assert.ok(robots.endsWith('Sitemap: https://angular.fr/sitemap.xml\n'));
    await postProcess(lang, dir);
    assert.equal((await read(path.join(out, 'robots.txt'))).match(/Sitemap:/g).length, 1, 'idempotent');
  });
  test('edits Bazel output even when files and directories are read-only', async () => {
    const out = path.join(dir, OUTPUT_REL);
    const page = path.join(out, 'ai/agent-skills/index.html');
    await write(page, '<html><head><title>A</title></head><body>page</body></html>');
    await write(path.join(out, 'robots.txt'), 'User-agent: *\nAllow: /\n');
    await chmod(page, 0o444);
    await chmod(path.join(out, 'robots.txt'), 0o444);
    await chmod(path.join(out, 'ai/agent-skills'), 0o555);
    await chmod(out, 0o555);
    await postProcess(lang, dir);
    assert.ok((await read(page)).includes('<link rel="canonical" href="https://angular.fr/ai/agent-skills" />'));
    assert.ok((await read(path.join(out, 'robots.txt'))).includes('Sitemap: https://angular.fr/sitemap.xml'));
    // Root ignores permission bits, so also assert the modes themselves (CI runs as a normal user).
    assert.equal((await stat(page)).mode & 0o200, 0o200, 'file made writable');
    assert.equal((await stat(path.join(out, 'ai/agent-skills'))).mode & 0o700, 0o700, 'directory made writable');
  });
  test('replaces symlinks into other Bazel outputs with writable copies, leaving the targets untouched', async () => {
    const out = path.join(dir, OUTPUT_REL);
    const elsewhere = path.join(dir, 'bazel-out-elsewhere');
    const target = path.join(elsewhere, 'content/ai/agent-skills.md.html');
    const blob = 'https://github.com/angular/angular/blob/main/adev/src/content/ai/agent-skills.md';
    await write(target, `<p><a href="${blob}">edit</a></p>`);
    await write(path.join(elsewhere, 'single.js'), `const e = "${blob}";`);
    await write(path.join(out, 'index.html'), '<html><head></head><body>home</body></html>');
    await mkdir(path.join(out, 'assets'), {recursive: true});
    await symlink(path.join(elsewhere, 'content'), path.join(out, 'assets/content'));
    await symlink(path.join(elsewhere, 'single.js'), path.join(out, 'single.js'));
    await symlink(path.join(elsewhere, 'missing'), path.join(out, 'dangling'));
    await chmod(target, 0o444);
    await chmod(path.join(elsewhere, 'content/ai'), 0o555);
    await postProcess(lang, dir);
    const copied = path.join(out, 'assets/content/ai/agent-skills.md.html');
    assert.ok(!(await lstat(path.join(out, 'assets/content'))).isSymbolicLink(), 'directory symlink replaced by a copy');
    assert.ok(!(await lstat(path.join(out, 'single.js'))).isSymbolicLink(), 'file symlink replaced by a copy');
    assert.ok((await lstat(path.join(out, 'dangling'))).isSymbolicLink(), 'dangling symlink left alone');
    assert.equal((await stat(copied)).mode & 0o200, 0o200, 'copied file writable');
    assert.ok((await read(copied)).includes('https://github.com/org/docs-fr/edit/main/i18n/fr/src/content/ai/agent-skills.md'));
    assert.ok((await read(target)).includes(blob), 'the Bazel output behind the symlink is not edited');
    assert.equal((await stat(target)).mode & 0o777, 0o444, 'and keeps its mode');
    await chmod(path.join(elsewhere, 'content/ai'), 0o755); // let the suite's cleanup remove it as a normal user
  });
  test('fails when there is no build output', async () => {
    await removeDir(path.join(dir, 'dist'));
    await assert.rejects(postProcess(lang, dir), /build output not found/);
  });
});
