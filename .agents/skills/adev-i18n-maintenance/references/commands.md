# Commands and CI recipe

| Command | Notes |
| --- | --- |
| `pnpm bootstrap` | Shallow fetch of the pinned upstream commit into `origin/`; reports Node/pnpm requirements |
| `pnpm update-origin latest\|22.3.x\|<sha>` | Moves the pin, refreshes snapshots, reports removals and renames; `--dry-run` to preview |
| `pnpm status <lang> [--md\|--json\|--quiet]` | Queue and coverage; `--diff <rel>`, `--init <rel>`, `--mark <rel>`, `--apply-mechanical <rel>\|all` |
| `pnpm check <lang> [files] [--changed --base origin/main] [--strict]` | Validation; exit 1 on errors (and on warnings with `--strict`; CI runs without it and shows warnings as annotations) |
| `pnpm dictionaries <lang> [--prune] [--init]` | Refresh UI dictionaries from upstream |
| `pnpm glossary <lang> [--check\|--print]` | Regenerate `prh.yml` and `.textlintrc.json` (textlint rules) from `glossary.json`; `check` does it too and warns when they were stale |
| `pnpm build <lang> [--prepare-only] [--skip-install] [--lenient] [--skip-patches]` | Production build; output `build/<lang>/dist/bin/adev/dist/browser` |
| `pnpm start <lang>` | Dev server (ibazel) with live overlay |
| `pnpm report <lang> [--summary\|--out f.json]` | Coverage and freshness report |
| `pnpm firebase-config [--check]` | Regenerate `firebase.json` / `.firebaserc` from `i18n/*/site.json` and upstream's header rules |
| `pnpm search-index <lang> [--out f.js\|--verify\|--reindex]` | Algolia crawler configuration, credentials check, crawl trigger (`search.crawlerId` + `ALGOLIA_CRAWLER_USER_ID`/`ALGOLIA_CRAWLER_API_KEY`); see docs/search.md |
| `pnpm languages [--matrix]` | Configured languages (CI matrix) |
| `pnpm rosetta <command> --help` | All of the above are subcommands of `tools/cli.mjs`; `--help` prints the flags |

## Toolchain

- Node 26 (`.nvmrc`) for everything; pnpm 10.x (`packageManager`), installed with `npm install -g pnpm` (no corepack on Node 25+).
- Upstream build: Bazel downloads its own Node (`node_version` in `origin/MODULE.bazel`, 24.x at the time of writing); pnpm switches itself to `origin/package.json` `packageManager` (11.x) inside `build/<lang>`.
- Bazel comes with upstream's dev dependencies (`pnpm bazel`); the first build downloads toolchains.

## CI recipe (free GitHub runner, from angular-docs-es)

- `bazel-contrib/setup-bazel` with `bazelisk-cache`, `disk-cache`, `repository-cache`.
- `.bazelrc` flags for 7 GB / 2 CPU runners: `--local_resources=memory=4096 --local_resources=cpu=2 --jobs=1 --discard_analysis_cache --nokeep_state_after_build`, plus `--sandbox_default_allow_network` for the Algolia prerender.
- `NODE_OPTIONS=--max-old-space-size=4096`.
- Expect 15 to 40 minutes per language; cache hits bring it down.

## Local build tips

- `build/<lang>` is a git worktree of `origin`; `node_modules` inside it survives rebuilds. `pnpm build <lang> --skip-install` when dependencies did not change.
- Disk: a build directory with `node_modules` and Bazel outputs takes several GB per language.
- Reset everything: `git -C origin worktree remove --force build/<lang>` then build again.
