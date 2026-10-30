# Contributing

Thank you for helping translate the Angular documentation. Two kinds of contribution are welcome: translations under `i18n/<lang>/`, and improvements to the shared tooling, skills and docs.

## Translating (no build needed)

0. Once per clone: Node 26 (`nvm use` reads `.nvmrc`), pnpm (`npm install -g pnpm`), then `pnpm install && pnpm bootstrap`. The last command fetches the pinned upstream commit into `origin/` (shallow, one download); `status`, `check` and `--init` read the English from there. The Angular build is not needed for translating.
1. Pick a page from the queue: `pnpm status <lang>` lists outdated and untranslated pages; the open "Update origin" PR or issues labelled `type:translation` show what others already claimed. Comment on the issue or open one from the template before starting, so two people do not translate the same page.
2. Read `i18n/<lang>/LANGUAGE.md` and `i18n/<lang>/glossary.json`. They decide register, typography and terminology; review will enforce them.
3. New page: `pnpm status <lang> --init <path>` creates the pair under `i18n/<lang>/src/<path>`: `name.en.md` (the untouched English snapshot) and `name.md`, a copy with the marker `<!-- source: <hash> -->` on its first line, which you translate. (By hand: copy the English file from `origin/adev/src/<path>` twice and add the marker with the hash from `git hash-object name.en.md`.) Yes, even for a partial translation: without the snapshot the next sync overwrites your work.
4. Outdated page: `pnpm status <lang> --diff <path>` shows the English change. Rewrite only the affected passages, keep the rest byte-identical, then `pnpm status <lang> --mark <path>` updates the marker.
5. Rules that the checker enforces: same number of lines as the snapshot (the marker line excepted); same headings, each carrying the English anchor `{#like-this}`; same `docs-*` elements, code blocks and links; code, identifiers, paths and URLs untouched; glossary respected.
6. Run `pnpm check <lang> <files>` and fix what it reports, then open a PR using the template. One PR per page or per small group of related pages.

If you use an AI assistant, point it at `AGENTS.md`; the `adev-translation` skill follows the same rules. You remain responsible for the text you submit.

## Maintaining and improving the tooling

- `tools/` is plain Node (ESM, no build step): one [citty](https://github.com/unjs/citty) CLI (`tools/cli.mjs`) whose subcommands live in `tools/commands/`, shared code in `tools/lib/`. Prefer a maintained library over custom code (see [docs/architecture.md](docs/architecture.md#tooling)). Every subcommand has a `pnpm <name>` alias of the same name in `package.json`; a name that pnpm itself owns (`setup`, `deploy`, `init`, `docs`, `search`…) is unusable, because `pnpm <name>` runs pnpm's command instead of the script: `tools/test/scripts.test.mjs` rejects those.
- Diagrams in `docs/` and the README are Mermaid blocks (GitHub renders them); keep them small, keep the commands in them identical to the real flags, and preview a change in GitHub's Markdown preview or at mermaid.live before opening the PR.
- `pnpm test` runs the suite in `tools/test/` (about a minute): one unit file per `tools/lib/` module, `scripts.test.mjs` for the `package.json` aliases, `cli.test.mjs` which drives the real CLI end to end in a temporary repository (scaffold, translate, check, sync, mechanical apply, dictionaries, glossary, report, Firebase config, `build --prepare-only`), and `parity.test.mjs` which runs upstream's own `heading.mts` against our anchor port. Tests never touch this checkout, and never read its `i18n/` (repositories created from the template delete `i18n/_example`): they build throwaway repositories from `tools/test/fixtures/upstream` (a pocket `angular/angular`) and `tools/test/fixtures/example` (a frozen copy of the example's configuration) and point the tooling at them with `ROSETTA_ROOT` / `ROSETTA_ORIGIN`. A change to a command needs a case in `cli.test.mjs`; a change to upstream's file layout needs the fixture updated.
- Never change files under `origin/`. Code-level changes to the site live in `tools/adev-patches/*.patch` and must pass `git apply --check` against the pinned upstream in CI.
- Workflows pin actions by commit SHA. Keep permissions minimal.
- Changes to skills or docs follow the same review as code.

## Commits and pull requests

- Commit messages in English, conventional style: `translate(fr): guide/signals overview`, `sync: update origin to 22.2.x @ abc1234`, `tools: …`, `docs: …`, `skills: …`.
- Sync PRs keep one commit per diff class and directory, and are merged with a merge commit, never squashed.
- Fill the PR template: list what was translated, what was deferred in English, what moved or was removed.
- Reviewers read English and translation side by side (`.en.md` and `.md` diffs appear next to each other in the PR).

## Community

Each language has its own README under `i18n/<lang>/` with maintainers and a chat link. Cross-language questions go to GitHub Discussions.
