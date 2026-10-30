/**
 * End-to-end: the `rosetta` CLI run as a child process against a temporary repository whose
 * origin/ is the fixture upstream (a git repository), the way a maintainer uses it. Tests run in
 * order and build on each other, like a real session: scaffold, translate, check, sync, build.
 */
import assert from 'node:assert/strict';
import path from 'node:path';
import {after, before, describe, test} from 'node:test';
import {cli, commitAll, makeRepo, read, removeDir, write} from './helpers.mjs';
import {exists} from '../lib/fs.mjs';

const repo = await makeRepo({example: true, origin: true, git: true});
const root = repo.root;
const upstreamSrc = path.join(repo.origin, 'adev', 'src');
const run = (args, opts = {}) => cli(args, {root, ...opts});
const json = async (rel) => JSON.parse(await read(path.join(root, rel)));

after(() => removeDir(root));

describe('entry point', () => {
  test('no arguments prints the usage with every command', async () => {
    const r = await run([]);
    assert.equal(r.code, 0);
    for (const c of ['bootstrap', 'update-origin', 'status', 'check', 'dictionaries', 'glossary', 'create-language', 'build', 'start', 'report', 'languages', 'firebase-config', 'search-index']) {
      assert.ok(r.stdout.includes(c), c);
    }
  });
  test('--version, --help on a subcommand, unknown command', async () => {
    assert.equal((await run(['--version'])).stdout.trim(), '0.1.0');
    const help = await run(['status', '--help']);
    assert.equal(help.code, 0);
    assert.ok(help.stdout.includes('--apply-mechanical=<rel|all>'));
    const bad = await run(['nope']);
    assert.equal(bad.code, 1);
    assert.match(bad.out, /Unknown command/);
  });
});

describe('languages', () => {
  test('lists configured languages in three shapes', async () => {
    assert.equal((await run(['languages'])).stdout.trim(), '');
    assert.equal((await run(['languages', '--include-example'])).stdout.trim(), '_example');
    assert.equal((await run(['languages', '--json'])).stdout.trim(), '[]');
    assert.equal((await run(['languages', '--matrix', '--include-example'])).stdout.trim(), '{"include":[{"lang":"_example"}]}');
  });
});

describe('create-language', () => {
  test('rejects bad tags and a missing upstream without a stack trace', async () => {
    const bad = await run(['create-language', 'french', '--yes']);
    assert.equal(bad.code, 1);
    assert.match(bad.stderr, /"french" is not a BCP-47 language tag/);
    assert.ok(!bad.out.includes('    at '), 'no stack trace');
    const noOrigin = await run(['create-language', 'fr', '--yes'], {origin: path.join(root, 'nowhere')});
    assert.equal(noOrigin.code, 1);
    assert.match(noOrigin.stderr, /origin not initialized/);
    const missing = await run(['create-language']);
    assert.equal(missing.code, 1);
  });
  test('scaffolds French from the example, wires CODEOWNERS, README, languages.json and Firebase', async () => {
    // A translated page in the example is carried over to a French site (with its snapshot), and so
    // are the example's translated dictionaries (index.html pairs are site-specific and regenerated).
    await write(path.join(root, 'i18n/_example/src/content/reference/errors/overview.en.md'), await read(path.join(upstreamSrc, 'content/reference/errors/overview.md')));
    await write(path.join(root, 'i18n/_example/src/content/reference/errors/overview.md'), '<!-- source: 0000000000000000000000000000000000000000 -->\n# Encyclopédie des erreurs\n\nLes erreurs Angular par code.\n');
    await write(path.join(root, 'i18n/_example/dictionaries/navigation.json'), JSON.stringify({Introduction: 'Présentation', 'Gone label': 'Disparu'}));
    await write(path.join(root, 'i18n/_example/dictionaries/pipeline.json'), JSON.stringify([{file: 'shared-docs/pipeline/shared/marked/extensions/docs-alert.mts', find: "NOTE = 'NOTE',", replace: "NOTE = 'Note\u202F',"}]));
    await write(path.join(root, 'i18n/_example/dictionaries/index-html.json'), JSON.stringify([
      {find: '<html lang="en"', replace: '<html lang="xx"'},
      {find: 'href="https://angular.dev"', replace: 'href="https://example.invalid"'},
      {find: 'content="The web development framework for building modern apps."', replace: 'content="Le framework web."'},
    ]));
    const r = await run(['create-language', 'fr', '--yes', '--domain', 'angular.fr', '--repo', 'org/docs-fr', '--maintainers', 'alice,@bob', '--chat', 'https://chat.example']);
    assert.equal(r.code, 0, r.out);
    assert.match(r.stdout, /LANGUAGE.md \(from the French example\)/);
    assert.match(r.stdout, /src\/: 2 file\(s\) from the French example/);
    assert.ok(await exists(path.join(root, 'i18n/fr/src/content/reference/errors/overview.md')));
    assert.ok(await exists(path.join(root, 'i18n/fr/src/content/reference/errors/overview.en.md')));
    assert.match(r.stdout, /dictionaries\/: 2 file\(s\) seeded from the French example/);
    assert.match(r.stdout, /fr: navigation.json: 10 labels, 9 added, 9 still English, 1 obsolete/);
    assert.equal((await json('i18n/fr/dictionaries/navigation.json'))['Introduction'], 'Présentation');
    assert.equal((await json('i18n/fr/dictionaries/pipeline.json')).find((p) => p.find === "NOTE = 'NOTE',").replace, "NOTE = 'Note\u202F',");
    const indexPairs = await json('i18n/fr/dictionaries/index-html.json');
    assert.equal(indexPairs[0].replace, '<html lang="fr"', 'index.html pairs come from site.json, not from the example');
    assert.equal(indexPairs.find((p) => p.find.startsWith('href=')).replace, 'href="https://angular.fr"', 'site-specific pairs are never copied');
    assert.equal(indexPairs.find((p) => p.find.startsWith('content="The web')).replace, 'content="Le framework web."', "the example's translated description is reused");
    assert.match(r.stdout, /index-html.json: 1 translated pair\(s\) reused from the French example/);
    // The rest of the session starts from an empty French site with English dictionaries.
    const {rm} = await import('node:fs/promises');
    await rm(path.join(root, 'i18n/fr/src/content'), {recursive: true});
    await rm(path.join(root, 'i18n/_example/src/content'), {recursive: true});
    await rm(path.join(root, 'i18n/_example/dictionaries'), {recursive: true});
    assert.equal((await run(['dictionaries', 'fr', '--init', '--prune'])).code, 0);
    await write(path.join(root, 'i18n/fr/dictionaries/navigation.json'), JSON.stringify(Object.fromEntries(Object.keys(await json('i18n/fr/dictionaries/navigation.json')).map((k) => [k, k]))));
    assert.match(r.stdout, /3\. Pages: pnpm status fr lists what is untranslated; pnpm status fr --init <path> starts one/);
    assert.match(r.stdout, /i18n\/fr is ready/);
    const site = await json('i18n/fr/site.json');
    assert.equal(site.name, 'Français');
    assert.equal(site.englishName, 'French');
    assert.equal(site.direction, 'ltr');
    assert.equal(site.domain, 'angular.fr');
    assert.deepEqual(site.repo, {owner: 'org', name: 'docs-fr', branch: 'main'});
    assert.deepEqual(site.firebase, {projectId: 'docs-fr', target: 'docs-fr'});
    assert.deepEqual(site.community, {chat: 'https://chat.example', maintainers: ['alice', 'bob']});
    assert.equal(site.strings.readInEnglish, 'Read this page in English');
    for (const f of ['LANGUAGE.md', 'glossary.json', 'prh.yml', '.textlintrc.json', 'README.md', 'ONBOARDING.md', 'src/.gitkeep', 'dictionaries/navigation.json', 'dictionaries/ui.json', 'dictionaries/index-html.json']) {
      assert.ok(await exists(path.join(root, 'i18n', 'fr', f)), f);
    }
    const glossary = await json('i18n/fr/glossary.json');
    assert.ok(glossary.some((g) => g.term === 'signal' && g.keep));
    assert.ok(glossary.some((g) => g.note?.startsWith('seen ')), 'counted terms are appended');
    assert.deepEqual(await json('languages.json'), ['fr']);
    const codeowners = await read(path.join(root, 'CODEOWNERS'));
    assert.match(codeowners, /\/i18n\/fr\/ {3}@alice @bob/);
    assert.match(codeowners, /\/tools\/ {3}@alice @bob/, "the template's maintainers team is replaced by the language's maintainers");
    assert.ok(!codeowners.includes('angular-docs-rosetta-maintainers'));
    const readme = await read(path.join(root, 'README.md'));
    assert.ok(readme.includes('| Français (`fr`) | https://angular.fr | @alice, @bob |'));
    assert.ok(!readme.includes('_none yet'));
    assert.ok(await exists(path.join(root, 'firebase.json')));
    assert.ok(await exists(path.join(root, 'i18n', '_example')), 'the example is kept unless asked');
    assert.equal((await run(['languages'])).stdout.trim(), 'fr');
  });
  test('refuses to scaffold twice', async () => {
    const r = await run(['create-language', 'fr', '--yes']);
    assert.equal(r.code, 1);
    assert.match(r.stderr, /i18n\/fr already exists/);
  });
  test('another language gets the generic template, RTL support and can remove the example', async () => {
    const r = await run(['create-language', 'ar', '--yes', '--remove-example', '--formality', 'neutral']);
    assert.equal(r.code, 0, r.out);
    assert.match(r.stdout, /LANGUAGE.md \(template with TODOs\)/);
    assert.match(r.stdout, /removed i18n\/_example/);
    const site = await json('i18n/ar/site.json');
    assert.equal(site.direction, 'rtl');
    assert.equal(site.englishName, 'Arabic');
    assert.deepEqual(site.repo, {owner: 'your-org', name: 'your-repo', branch: 'main'});
    const rules = await read(path.join(root, 'i18n/ar/LANGUAGE.md'));
    assert.ok(rules.includes('direction: rtl'));
    assert.ok(rules.includes('formality: neutral'));
    const pairs = await json('i18n/ar/dictionaries/index-html.json');
    assert.equal(pairs[0].replace, '<html lang="ar" dir="rtl"');
    assert.ok(!(await exists(path.join(root, 'i18n', '_example'))));
    assert.ok(!(await exists(path.join(root, '.github/workflows/template-canary.yml'))));
    assert.deepEqual(await json('languages.json'), ['ar', 'fr']);
    assert.match(await read(path.join(root, 'CODEOWNERS')), /\/i18n\/ar\/ {3}@your-org\/your-repo-ar/);
    const rc = await json('.firebaserc');
    assert.deepEqual(Object.keys(rc.targets).sort(), ['docs-fr', 'your-repo']);
    // Two languages: commands now need the language argument.
    const amb = await run(['status']);
    assert.equal(amb.code, 1);
    assert.match(amb.stderr, /Several languages configured \(ar, fr\); pass one as argument/);
    await commitAll(root, 'scaffold fr and ar');
  });
});

describe('status and check on a fresh language', () => {
  test('status lists everything as untranslated; quiet, json and md shapes', async () => {
    const r = await run(['status', 'fr']);
    assert.equal(r.code, 0, r.out);
    assert.match(r.stdout, /translated 0\/5 \(0 %\)/);
    assert.match(r.stdout, /Untranslated \(5\)/);
    assert.match(r.stdout, /content\/guide\/signals\/overview.md/);
    const quiet = await run(['status', 'fr', '--quiet']);
    assert.ok(!quiet.stdout.includes('Untranslated ('));
    const js = JSON.parse((await run(['status', 'fr', '--json'])).stdout);
    assert.equal(js.lang, 'fr');
    assert.equal(js.totals.inScope, 5);
    assert.equal(js.origin.sha, repo.originSha);
    const md = (await run(['status', 'fr', '--md'])).stdout;
    assert.ok(md.startsWith('### Translation status: `fr` @ origin `' + repo.originSha.slice(0, 10) + '`'));
    assert.ok(md.includes('<details><summary>Untranslated (5)</summary>'));
    assert.ok(md.includes('Diff classes:'));
  });
  test('check passes on configuration alone and reports origin-dependent dictionary state', async () => {
    const r = await run(['check', 'fr']);
    assert.equal(r.code, 0, r.out);
    assert.match(r.stdout, /0 file\(s\) checked for fr: 0 errors, 0 warnings/);
  });
});

describe('translating a page', () => {
  const rel = 'content/guide/signals/overview.md';
  const translated = path.join(root, 'i18n/fr/src', rel);
  test('status --init copies the snapshot and the marked file; refuses to overwrite without --force', async () => {
    const r = await run(['status', 'fr', '--init', rel]);
    assert.equal(r.code, 0, r.out);
    assert.match(r.stdout, /snapshot: i18n\/fr\/src\/content\/guide\/signals\/overview.en.md/);
    const content = await read(translated);
    assert.match(content.split('\n')[0], /^<!-- source: [0-9a-f]{40} -->$/);
    assert.equal(await read(path.join(root, 'i18n/fr/src/content/guide/signals/overview.en.md')), await read(path.join(upstreamSrc, rel)));
    const again = await run(['status', 'fr', '--init', rel]);
    assert.equal(again.code, 1);
    assert.match(again.stderr, /exists; use --force/);
    assert.equal((await run(['status', 'fr', '--init', rel, '--force'])).code, 0);
    const nope = await run(['status', 'fr', '--init', 'content/nope.md']);
    assert.equal(nope.code, 1);
    assert.match(nope.stderr, /no such upstream file/);
  });
  test('the English copy passes check (warnings only) and counts as translated', async () => {
    const r = await run(['check', 'fr']);
    assert.equal(r.code, 0, r.out);
    assert.match(r.stdout, /1 file\(s\) checked for fr: 0 errors/);
    const strict = await run(['check', 'fr', '--strict']);
    assert.equal(strict.code, 1, 'French typography rules warn on the English copy, strict fails');
    assert.match((await run(['status', 'fr', '--quiet'])).stdout, /translated 1\/5 \(20 %\)\s+up to date 1/);
  });
  test('check catches anchors, structure, glossary and marker problems with file line numbers', async () => {
    const lines = (await read(translated)).split('\n');
    const h = lines.findIndex((l) => l.startsWith('## What are signals?'));
    lines[h] = '## Que sont les signaux ?';
    const p = lines.findIndex((l) => l.startsWith('A **signal** is a wrapper'));
    lines[p] = 'Un **signal** est un gabarit autour d\'une valeur avec "guillemets".';
    lines.push('Ligne en trop.');
    await write(translated, lines.join('\n'));
    const r = await run(['check', 'fr']);
    assert.equal(r.code, 1);
    // "signaux ?" -> "signaux-" (space to dash, "?" dropped): the id upstream would generate.
    assert.match(r.stdout, new RegExp(`error {3}line ${h + 1}: heading anchor "que-sont-les-signaux-" must be "what-are-signals": write \`## Que sont les signaux \\? \\{#what-are-signals\\}\``));
    assert.match(r.stdout, new RegExp(`error {3}line ${h + 1}: forbidden rendering: signaux => signal`));
    assert.match(r.stdout, new RegExp(`error {3}line ${p + 1}: forbidden rendering: gabarit => template`));
    assert.match(r.stdout, /line count \d+ differs from snapshot \d+/);
    assert.match(r.stdout, new RegExp(`warning line ${p + 1}: straight quotes; use « »`));
    assert.match(r.stdout, /checked for fr: 4 error\(s\)/);
    // Fix everything.
    lines.pop();
    lines[h] = '## Que sont les signaux {#what-are-signals}'.replace('signaux', 'signals');
    lines[p] = 'Un **signal** est une enveloppe autour d\'une valeur avec des « guillemets ».';
    await write(translated, lines.join('\n'));
    const ok = await run(['check', 'fr', `i18n/fr/src/${rel}`]);
    assert.equal(ok.code, 0, ok.out);
    assert.match(ok.stdout, /1 file\(s\) checked for fr: 0 errors/);
    const byRel = await run(['check', 'fr', rel]);
    assert.equal(byRel.code, 0, 'paths relative to adev/src work too');
    const unknown = await run(['check', 'fr', 'content/nope.md']);
    assert.equal(unknown.code, 1);
    assert.match(unknown.stdout, /file not found/);
  });
  test('a translation without a snapshot or without a marker is an error', async () => {
    const lone = path.join(root, 'i18n/fr/src/content/reference/errors/NG0100.md');
    await write(lone, '# Sans snapshot\n');
    let r = await run(['check', 'fr', lone]);
    assert.equal(r.code, 1);
    assert.match(r.stdout, /no snapshot NG0100.en.md next to it/);
    await write(lone.replace('.md', '.en.md'), await read(path.join(upstreamSrc, 'content/reference/errors/NG0100.md')));
    r = await run(['check', 'fr', lone]);
    assert.equal(r.code, 1);
    assert.match(r.stdout, /no source marker on the first line \(expected: source: [0-9a-f]{40}; pnpm status fr --mark content\/reference\/errors\/NG0100.md\)/);
    const mark = await run(['status', 'fr', '--mark', 'content/reference/errors/NG0100.md']);
    assert.equal(mark.code, 0, mark.out);
    assert.match(mark.stdout, /marker set to [0-9a-f]{10}/);
    assert.match((await read(lone)).split('\n')[0], /^<!-- source: /);
    const {rm} = await import('node:fs/promises');
    await rm(lone);
    await rm(lone.replace('.md', '.en.md'));
  });
  test('alert keywords, multi-line tags and passages left in English raise no typography warning; a translated keyword is an error', async () => {
    const rel2 = 'content/guide/components/anatomy-of-components.md';
    const file = path.join(root, 'i18n/fr/src', rel2);
    const {rm} = await import('node:fs/promises');
    assert.equal((await run(['status', 'fr', '--init', rel2])).code, 0);
    try {
      const untouched = await run(['check', 'fr', rel2, '--strict']);
      assert.equal(untouched.code, 1);
      assert.match(untouched.stdout, /identical to the English snapshot: nothing translated yet/);
      const lines = (await read(file)).split('\n');
      const tip = lines.findIndex((l) => l.startsWith('TIP: '));
      lines[tip] = "TIP: Ce guide suppose que vous avez lu les [bases](essentials)\u202F: lisez-les d'abord.";
      const header = lines.findIndex((l) => l.startsWith('<docs-code header="profile-photo.ts"'));
      lines[header] = '<docs-code header="profil-photo.ts"'; // attribute lines of the tag keep their straight quotes
      const helpful = lines.findIndex((l) => l.startsWith('HELPFUL: '));
      lines[helpful] = "HELPFUL: Le « selector » d'un composant est un sélecteur CSS\u202F: `profile-photo` correspond à `<profile-photo>`.";
      await write(file, lines.join('\n'));
      const ok = await run(['check', 'fr', rel2, '--strict']);
      assert.equal(ok.code, 0, ok.out);
      assert.match(ok.stdout, /1 file\(s\) checked for fr: 0 errors, 0 warnings \(strict\)/);
      await write(file, lines.join('\r\n')); // a CRLF checkout changes neither the marker nor the checks
      const crlf = await run(['check', 'fr', rel2, '--strict']);
      assert.equal(crlf.code, 0, crlf.out);
      lines[helpful] = lines[helpful].replace('HELPFUL: ', 'UTILE\u202F: ');
      await write(file, lines.join('\n'));
      const bad = await run(['check', 'fr', rel2]);
      assert.equal(bad.code, 1);
      assert.match(bad.stdout, /error {3}0 "HELPFUL:" alert\(s\) vs 1 in the snapshot: the keyword and its plain colon are syntax/);
    } finally {
      await rm(file, {force: true});
      await rm(file.replace(/\.md$/, '.en.md'), {force: true});
    }
  });
  test('check --changed only looks at files changed against the base', async () => {
    await commitAll(root, 'translate overview');
    const other = 'content/introduction/what-is-angular.md';
    assert.equal((await run(['status', 'fr', '--init', other])).code, 0);
    await commitAll(root, 'start what-is-angular');
    const r = await run(['check', 'fr', '--changed', '--base', 'HEAD~1']);
    assert.equal(r.code, 0, r.out);
    assert.match(r.stdout, /1 file\(s\) checked/);
    const none = await run(['check', 'fr', '--changed', '--base', 'HEAD']);
    assert.match(none.stdout, /0 file\(s\) checked/);
  });
  test('JSON overlays carry their marker in a sidecar', async () => {
    const rel = 'assets/others/versions.json';
    assert.equal((await run(['status', 'fr', '--init', rel])).code, 0);
    const file = path.join(root, 'i18n/fr/src', rel);
    assert.ok(await exists(`${file}.source`));
    assert.equal(await read(file), await read(path.join(upstreamSrc, rel)), 'JSON content is untouched');
    let r = await run(['check', 'fr', rel]);
    assert.equal(r.code, 0, r.out);
    const {rm} = await import('node:fs/promises');
    await rm(`${file}.source`);
    r = await run(['check', 'fr', rel]);
    assert.equal(r.code, 1);
    assert.match(r.stdout, /no source marker in versions.json.source next to it/);
    assert.equal((await run(['status', 'fr', '--mark', rel])).code, 0);
    assert.ok(await exists(`${file}.source`));
    const st = JSON.parse((await run(['status', 'fr', '--json'])).stdout);
    const entry = st.files.find((f) => f.rel === rel);
    assert.equal(entry.state, 'up-to-date');
    assert.equal(entry.overlay, true);
  });
});

describe('sync: upstream changes', () => {
  const rel = 'content/guide/signals/overview.md';
  const snapshot = path.join(root, 'i18n/fr/src/content/guide/signals/overview.en.md');
  const upstreamFile = path.join(upstreamSrc, rel);
  test('a class-a change shows as outdated with its diff and is applied mechanically', async () => {
    await commitAll(root, 'before sync');
    const english = await read(upstreamFile);
    const changed = english.replace('const count = signal(0);', 'const count = signal(0); // initial value').replace('(essentials/signals)', '(essentials/signals-overview)');
    await write(upstreamFile, changed);
    // Without the snapshot refresh the page is a stale snapshot…
    let st = JSON.parse((await run(['status', 'fr', '--json'])).stdout);
    let entry = st.files.find((f) => f.rel === rel);
    assert.equal(entry.state, 'stale-snapshot');
    const staleDiff = await run(['status', 'fr', '--diff', rel]);
    assert.match(staleDiff.stdout, /snapshot is stale/);
    assert.match(staleDiff.stdout, /^\+.*initial value/m);
    // …what update-origin does: refresh the snapshot.
    await write(snapshot, changed);
    const r = await run(['status', 'fr']);
    assert.match(r.stdout, /Outdated: retranslate the changed passages \(1\)/);
    assert.match(r.stdout, /content\/guide\/signals\/overview.md \[a \+2 -2\]/);
    const diff = await run(['status', 'fr', '--diff', rel]);
    assert.equal(diff.code, 0, diff.out);
    assert.match(diff.stdout, /English diff: snapshot [0-9a-f]{10} \(translated\) -> [0-9a-f]{10} \(current\)/);
    assert.match(diff.stdout, /^-const count = signal\(0\);$/m);
    assert.match(diff.stdout, /^\+const count = signal\(0\); \/\/ initial value$/m);
    const applied = await run(['status', 'fr', '--apply-mechanical', 'all']);
    assert.equal(applied.code, 0, applied.out);
    assert.match(applied.stdout, /overview.md: applied, marker updated/);
    const translated = await read(path.join(root, 'i18n/fr/src', rel));
    assert.ok(translated.includes('const count = signal(0); // initial value'));
    assert.ok(translated.includes('(essentials/signals-overview)'));
    assert.ok(translated.includes('Un **signal** est une enveloppe'), 'the French prose is untouched');
    st = JSON.parse((await run(['status', 'fr', '--json'])).stdout);
    entry = st.files.find((f) => f.rel === rel);
    assert.equal(entry.state, 'up-to-date');
    assert.equal((await run(['check', 'fr', rel])).code, 0);
    assert.match((await run(['status', 'fr', '--apply-mechanical', 'all'])).stdout, /no outdated file of class a/);
    assert.match((await run(['status', 'fr', '--diff', rel])).stdout, /is up to date with its snapshot/);
  });
  test('a prose change is class b and is not applied mechanically', async () => {
    await commitAll(root, 'mechanical sync');
    const english = await read(upstreamFile);
    const changed = english.replace('Signals can contain any value, from primitives to complex data structures.', 'Signals can hold any value, from primitives to complex data structures, and more.');
    await write(upstreamFile, changed);
    await write(snapshot, changed);
    const r = await run(['status', 'fr', '--md']);
    assert.match(r.stdout, /\| `content\/guide\/signals\/overview.md` \| b \| \+1 −1 \|/);
    const applied = await run(['status', 'fr', '--apply-mechanical', rel]);
    assert.equal(applied.code, 0);
    assert.match(applied.stdout, /not applied \(diff class is b, not a: prose changed, translate it\)/);
    const check = await run(['check', 'fr', rel]);
    assert.equal(check.code, 1);
    assert.match(check.stdout, /outdated: marker [0-9a-f]{10} but snapshot is [0-9a-f]{10} \(pnpm status fr --diff content\/guide\/signals\/overview.md\)/);
    const allowed = await run(['check', 'fr', rel, '--allow-outdated']);
    assert.equal(allowed.code, 0);
    assert.match(allowed.stdout, /warning outdated/);
    // Translate the passage, mark, done.
    const file = path.join(root, 'i18n/fr/src', rel);
    await write(file, (await read(file)).replace(/^Un \*\*signal\*\* est une enveloppe.*$/m, 'Un **signal** est une enveloppe autour d\'une valeur, des primitives aux structures complexes, et plus.'));
    assert.equal((await run(['status', 'fr', '--mark', rel])).code, 0);
    assert.equal((await run(['check', 'fr', rel])).code, 0);
  });
  test('a removed upstream page and a renamed one are reported', async () => {
    const {rm} = await import('node:fs/promises');
    const gone = path.join(upstreamSrc, 'content/introduction/what-is-angular.md');
    await rm(gone);
    const r = await run(['status', 'fr']);
    assert.match(r.stdout, /Removed upstream: move \(rename\) or delete the pair \(1\)/);
    assert.match(r.stdout, /content\/introduction\/what-is-angular.md/);
    const check = await run(['check', 'fr', 'content/introduction/what-is-angular.md']);
    assert.match(check.stdout, /upstream no longer has this file/);
    await write(gone, await read(path.join(root, 'i18n/fr/src/content/introduction/what-is-angular.en.md')));
  });
});

describe('dictionaries and glossary', () => {
  test('dictionaries picks up new upstream strings, keeps translations, prunes on request', async () => {
    const navFile = path.join(upstreamSrc, 'app/routing/navigation-entries/index.ts');
    await write(navFile, (await read(navFile)).replace("{label: 'What\\'s new?', path: 'roadmap'}", "{label: 'What\\'s new?', path: 'roadmap'},\n  {label: 'Brand new entry', path: 'new'}"));
    const dictFile = path.join(root, 'i18n/fr/dictionaries/navigation.json');
    const nav = await json('i18n/fr/dictionaries/navigation.json');
    nav['Introduction'] = 'Présentation';
    nav['Obsolete'] = 'Obsolète';
    await write(dictFile, JSON.stringify(nav));
    let st = await run(['status', 'fr', '--quiet']);
    assert.match(st.stdout, /navigation 1\/11 translated, 1 missing/);
    let r = await run(['dictionaries', 'fr']);
    assert.equal(r.code, 0, r.out);
    assert.match(r.stdout, /navigation.json: 11 labels, 1 added, 10 still English, 1 obsolete \(kept; --prune to drop\)/);
    assert.equal((await json('i18n/fr/dictionaries/navigation.json'))['Brand new entry'], 'Brand new entry');
    assert.equal((await json('i18n/fr/dictionaries/navigation.json'))['Introduction'], 'Présentation');
    r = await run(['dictionaries', 'fr', '--prune']);
    assert.match(r.stdout, /1 obsolete \(pruned\)/);
    assert.equal((await json('i18n/fr/dictionaries/navigation.json'))['Obsolete'], undefined);
    st = await run(['status', 'fr', '--quiet']);
    assert.match(st.stdout, /navigation 1\/11 translated, 0 missing/);
  });
  test('a dead pipeline pair fails dictionaries, check and status until its find is fixed', async () => {
    const file = path.join(root, 'i18n/fr/dictionaries/pipeline.json');
    const pairs = await json('i18n/fr/dictionaries/pipeline.json');
    assert.ok(pairs.length >= 9, 'alert labels and more are seeded');
    const tip = pairs.find((p) => p.find === "TIP = 'TIP',");
    tip.find = "TIP = 'OLD',";
    tip.replace = "TIP = 'Astuce',";
    await write(file, JSON.stringify(pairs));
    const r = await run(['dictionaries', 'fr']);
    assert.equal(r.code, 1);
    assert.match(r.stdout, /pipeline.json: \d+ pairs, 1 added, \d+ still English, 1 NOT matching upstream/);
    assert.match(r.stderr, /fix their "find" in i18n\/fr\/dictionaries\/pipeline.json/);
    const check = await run(['check', 'fr']);
    assert.equal(check.code, 1);
    assert.match(check.stdout, /pair no longer matches upstream shared-docs\/pipeline\/shared\/marked\/extensions\/docs-alert.mts: "TIP = 'OLD',"/);
    assert.match((await run(['status', 'fr'])).stdout, /pipeline pairs that no longer match upstream \(1\)/);
    const fixed = (await json('i18n/fr/dictionaries/pipeline.json')).filter((p) => p.find !== "TIP = 'OLD',");
    await write(file, JSON.stringify(fixed));
    assert.equal((await run(['dictionaries', 'fr'])).code, 0);
    assert.equal((await run(['check', 'fr'])).code, 0);
  });
  test('a dead index.html pair fails dictionaries and check until fixed', async () => {
    const file = path.join(root, 'i18n/fr/dictionaries/index-html.json');
    const pairs = await json('i18n/fr/dictionaries/index-html.json');
    await write(file, JSON.stringify([...pairs, {find: '<meta name="gone"', replace: 'x'}]));
    const r = await run(['dictionaries', 'fr']);
    assert.equal(r.code, 1);
    assert.match(r.stdout, /1 NOT matching upstream/);
    assert.match(r.stderr, /edit i18n\/fr\/dictionaries\/index-html.json/);
    const check = await run(['check', 'fr']);
    assert.equal(check.code, 1);
    assert.match(check.stdout, /pair no longer matches upstream index.html/);
    const init = await run(['dictionaries', 'fr', '--init']);
    assert.equal(init.code, 0, init.out);
    assert.match(init.stdout, /index-html.json: 6 pairs \(generated\), all matching/);
    assert.equal((await run(['check', 'fr'])).code, 0);
  });
  test('glossary generates, checks and prints the textlint rules', async () => {
    assert.match((await run(['glossary', 'fr', '--check'])).stdout, /textlint rules current/);
    const file = path.join(root, 'i18n/fr/glossary.json');
    const glossary = await json('i18n/fr/glossary.json');
    glossary.push({term: 'hydration', translation: 'hydratation', forbidden: ['réhydratation']});
    await write(file, JSON.stringify(glossary));
    const stale = await run(['glossary', 'fr', '--check']);
    assert.equal(stale.code, 1);
    assert.match(stale.stderr, /i18n\/fr\/prh.yml out of date; run: pnpm glossary fr/);
    const print = await run(['glossary', 'fr', '--print']);
    assert.match(print.stdout, /expected: hydratation/);
    assert.match(print.stdout, /réhydratation/);
    const gen = await run(['glossary', 'fr']);
    assert.equal(gen.code, 0, gen.out);
    assert.match(gen.stdout, /wrote i18n\/fr\/prh.yml/);
    assert.match((await run(['glossary', 'fr'])).stdout, /already current/);
    // check regenerates stale rules itself and says so.
    await write(path.join(root, 'i18n/fr/prh.yml'), '# stale\n');
    const check = await run(['check', 'fr']);
    assert.equal(check.code, 0, check.out);
    assert.match(check.stdout, /warning regenerated i18n\/fr\/prh.yml; commit them/);
  });
});

describe('report and firebase-config', () => {
  test('report gives a summary, JSON on stdout or in a file, with git dates', async () => {
    await commitAll(root, 'more work');
    const summary = await run(['report', 'fr', '--summary']);
    assert.equal(summary.code, 0, summary.out);
    assert.match(summary.stdout, /^fr: 2\/5 translated \(40 %\), 0 outdated \(median 0 d, max 0 d, 0 over 30 d\), 3 untranslated/);
    const out = path.join(root, 'report.json');
    const r = await run(['report', 'fr', '--out', out]);
    assert.equal(r.code, 0, r.out);
    const report = await json('report.json');
    assert.equal(report.lang, 'fr');
    assert.equal(report.origin, repo.originSha);
    assert.deepEqual(Object.keys(report.freshness), ['outdatedPages', 'medianOutdatedDays', 'maxOutdatedDays', 'over30Days']);
    const page = report.files.find((f) => f.rel === 'content/guide/signals/overview.md');
    assert.equal(page.state, 'up-to-date');
    assert.match(page.translatedAt, /^\d{4}-\d{2}-\d{2}T/);
    assert.match(page.snapshotAt, /^\d{4}-\d{2}-\d{2}T/);
    const stdout = JSON.parse((await run(['report', 'fr'])).stdout);
    assert.equal(stdout.totals.inScope, 5);
  });
  test('firebase-config --check detects drift and the command repairs it', async () => {
    assert.match((await run(['firebase-config', '--check'])).stdout, /up to date/);
    await write(path.join(root, 'firebase.json'), '{}');
    const stale = await run(['firebase-config', '--check']);
    assert.equal(stale.code, 1);
    assert.match(stale.stderr, /firebase.json out of date; run: pnpm firebase-config/);
    const fix = await run(['firebase-config']);
    assert.equal(fix.code, 0, fix.out);
    assert.match(fix.stdout, /wrote firebase.json/);
    const fb = await json('firebase.json');
    assert.deepEqual(fb.hosting.map((h) => h.target).sort(), ['docs-ar', 'docs-fr']);
  });
});

describe('search-index', () => {
  test('prints a crawler configuration for the site and warns while provider is none', async () => {
    const r = await run(['search-index', 'fr']);
    assert.equal(r.code, 0, r.out);
    assert.ok(r.stdout.includes('new Crawler({'));
    assert.ok(r.stdout.includes("sitemaps: ['https://angular.fr/sitemap.xml']"));
    assert.ok(r.stdout.includes("indexName: 'angular_fr'"));
    assert.match(r.stdout, /search.provider is "none"/);
    const out = path.join(root, 'crawler.config.js');
    assert.equal((await run(['search-index', 'fr', '--out', out])).code, 0);
    assert.ok((await read(out)).includes("defaultValue: 'Tutorials'"));
    const verify = await run(['search-index', 'fr', '--verify']);
    assert.equal(verify.code, 1);
    assert.match(verify.stderr, /nothing to verify/);
    const reindex = await run(['search-index', 'fr', '--reindex']);
    assert.equal(reindex.code, 0);
    assert.match(reindex.stdout, /no search configured; nothing to reindex/);
  });
  test('with credentials: reindex needs a crawler id and the Crawler secrets', async () => {
    const file = path.join(root, 'i18n/fr/site.json');
    const site = await json('i18n/fr/site.json');
    await write(file, JSON.stringify({...site, search: {provider: 'docsearch', appId: 'APP123', apiKey: 'search-only', indexName: 'angular_fr'}}));
    let r = await run(['search-index', 'fr', '--reindex']);
    assert.equal(r.code, 0);
    assert.match(r.stdout, /no search.crawlerId; skipping/);
    await write(file, JSON.stringify({...site, search: {provider: 'docsearch', appId: 'APP123', apiKey: 'search-only', indexName: 'angular_fr', crawlerId: 'abc'}}));
    r = await run(['search-index', 'fr', '--reindex']);
    assert.equal(r.code, 1);
    assert.match(r.stderr, /ALGOLIA_CRAWLER_USER_ID and ALGOLIA_CRAWLER_API_KEY/);
    assert.ok((await run(['search-index', 'fr'])).stdout.includes("appId: 'APP123'"));
    const check = await run(['check', 'fr']);
    assert.equal(check.code, 0, check.out);
    await write(file, JSON.stringify({...site, search: {provider: 'docsearch', appId: 'APP123'}}));
    const bad = await run(['check', 'fr']);
    assert.equal(bad.code, 1);
    assert.match(bad.stdout, /required property/);
    await write(file, JSON.stringify(site));
  });
});

describe('bootstrap, update-origin and build', () => {
  test('bootstrap with ROSETTA_ORIGIN skips the submodule and reports the toolchain', async () => {
    const r = await run(['bootstrap'], {origin: repo.origin});
    assert.equal(r.code, 0, r.out);
    assert.match(r.stdout, /ROSETTA_ORIGIN is set/);
    assert.match(r.stdout, /this repository requires Node >=26 \(package.json engines\)/);
    assert.match(r.stdout, /pnpm: \d+\.\d+\.\d+ here; inside build\/<lang> pnpm switches itself to pnpm@11.28.7/);
    assert.match(r.stdout, /Bazel: builds with its own Node 24.21.0 \(origin\/MODULE.bazel\)/);
    assert.ok(!r.stdout.includes('corepack'));
  });
  test('update-origin refuses ROSETTA_ORIGIN and resolves a SHA target in dry-run mode', async () => {
    const refused = await run(['update-origin', '--dry-run'], {origin: repo.origin});
    assert.equal(refused.code, 1);
    assert.match(refused.stderr, /unset ROSETTA_ORIGIN first/);
    const dry = await run(['update-origin', repo.originSha, '--dry-run']);
    assert.equal(dry.code, 0, dry.out);
    assert.match(dry.stdout, new RegExp(`target: ${repo.originSha.slice(0, 10)} -> ${repo.originSha}`));
    assert.match(dry.stdout, new RegExp(`current: ${repo.originSha}`));
    assert.match(dry.stdout, /dry run, nothing changed/);
    const bad = await run(['update-origin', 'main', '--dry-run']);
    assert.equal(bad.code, 1);
    assert.match(bad.out, /unrecognized target "main"/);
  });
  test('build --prepare-only assembles build/<lang> without Bazel', async () => {
    const refused = await run(['build', 'fr', '--prepare-only'], {origin: repo.origin});
    assert.equal(refused.code, 1);
    assert.match(refused.stderr, /need the origin\/ submodule/);
    const r = await run(['build', 'fr', '--prepare-only', '--skip-patches']);
    assert.equal(r.code, 0, r.out);
    assert.match(r.stdout, /overlay: 3 file\(s\) copied/);
    assert.match(r.stdout, /navigation: 1 label\(s\) translated/);
    assert.match(r.stdout, /index.html: 6 pair\(s\) applied/);
    assert.match(r.stdout, /patches skipped/);
    assert.match(r.stdout, /status report: 2\/5 translated/);
    assert.match(r.stdout, /prepared build\/fr; nothing built/);
    const dir = path.join(root, 'build', 'fr');
    assert.ok((await read(path.join(dir, 'adev/src/index.html'))).includes('<html lang="fr"'));
    assert.ok((await read(path.join(dir, 'adev/src/app/routing/navigation-entries/index.ts'))).includes("label: 'Présentation'"));
    const page = await read(path.join(dir, 'adev/src/content/guide/signals/overview.md'));
    assert.ok(!page.includes('source:'));
    assert.ok(page.includes('{#what-are-signals}'));
    const status = JSON.parse(await read(path.join(dir, 'adev/src/assets/others/translation-status.json')));
    assert.equal(status.pages['guide/signals/overview'], 'up-to-date');
    assert.ok((await read(path.join(dir, 'adev/src/app/rosetta/rosetta-config.ts'))).includes('"siteUrl": "https://angular.fr"'));
    assert.ok(!(await exists(path.join(dir, 'adev/src/assets/others/versions.json.source'))));
    assert.match(r.stdout, /environment.ts: upstream's English index \(search.provider: none\), no analytics/);
    const env = await read(path.join(dir, 'adev/src/app/environment.ts'));
    assert.ok(env.includes("appId: 'L1XWT2UJ7F'") && env.includes("googleAnalyticsId: ''"));
  });
  test('build --prepare-only writes the site\'s own search credentials and GA4 id', async () => {
    const file = path.join(root, 'i18n/fr/site.json');
    const site = await json('i18n/fr/site.json');
    await write(file, JSON.stringify({...site, search: {provider: 'algolia', appId: 'APP123', apiKey: 'search-only', indexName: 'angular_fr'}, analytics: {provider: 'ga4', id: 'G-FR1'}}));
    const r = await run(['build', 'fr', '--prepare-only', '--skip-patches']);
    assert.equal(r.code, 0, r.out);
    assert.match(r.stdout, /environment.ts: algolia index angular_fr, GA4 G-FR1/);
    const env = await read(path.join(root, 'build/fr/adev/src/app/environment.ts'));
    assert.ok(env.includes("appId: 'APP123'") && env.includes("const indexName = 'angular_fr';") && env.includes("googleAnalyticsId: 'G-FR1'"));
    await write(file, JSON.stringify(site));
  });
});
