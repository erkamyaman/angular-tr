# Getting started: from "Use this template" to a deployed site

Short version of [guide.md](guide.md) Part 1 and Part 2. Budget: about 30 minutes of your time plus one Bazel build (10 to 20 minutes on a laptop, similar in CI with a warm cache).

## 1. Create the repository

1. On GitHub, open the template and click **Use this template > Create a new repository**. Public, default branch only. Name it after the site, for example `angular-docs-fr`.
2. Clone it. The `origin` submodule pointer comes with the tree; its content is fetched in step 3.

```bash
git clone https://github.com/<org>/<repo>.git
cd <repo>
nvm use                # Node 26, from .nvmrc (fnm and Volta read it too)
pnpm install           # npm install -g pnpm first if missing: Node 25+ no longer ships corepack
```

## 2. Toolchain

Everything runs on Node 26 (`.nvmrc`, `engines` in `package.json`, the workflows, the devcontainer). The Angular build needs nothing else: Bazel downloads the Node toolchain upstream pins (`node_version` in `origin/MODULE.bazel`), and inside `build/<lang>` pnpm switches itself to the version in upstream's `packageManager` field. `pnpm bootstrap` prints all of it. (`origin/.nvmrc` is what upstream's own developers use; if upstream's `pnpm install` ever refuses the host Node, `nvm use $(cat origin/.nvmrc)` is the fallback.)

```bash
pnpm bootstrap
```

This fetches `origin` shallowly at the pinned SHA, checks it out, and reports your toolchain against upstream's requirements.

## 3. Scaffold the language

```bash
pnpm create-language fr
```

Answer the prompts (or pass flags, see `pnpm create-language --help`): language name, direction, formality, site domain, GitHub repo, Firebase project and target, community chat, maintainers. (Search and analytics are configured later in `site.json`, see [search.md](search.md).) The command:

- creates `i18n/fr/` with `site.json`, `LANGUAGE.md`, `glossary.json` (seeded with the most frequent technical terms, to fill in), `dictionaries/` generated from upstream with every English string as key, `README.md`, `ONBOARDING.md` and `src/`. For French, `LANGUAGE.md`, the glossary, the translated dictionaries and the example's translated pages (with their snapshots) come from `i18n/_example`, so `src/` already holds pages and the dictionaries are already French; for other languages `src/` starts empty and the dictionaries English;
- adds the language to `CODEOWNERS` (its maintainers also replace the template's own team on the tooling lines), the README table and `languages.json`;
- regenerates `firebase.json` and `.firebaserc` with a hosting target for the language;
- offers to delete `i18n/_example/` and the template-only workflows.

Commit the result.

## 4. Translate the chrome first

Navigation labels, the app's and the docs components' visible strings (search dialog, table of contents, cookie banner…), `index.html` metadata and the labels the docs pipeline bakes into pages (`NOTE:`, `TIP:`, "Learn more", "Edit this page") are dictionaries, not Markdown. Translate `i18n/fr/dictionaries/navigation.json`, `ui.json`, `index-html.json` and `pipeline.json` (values are English until you change them), then `pnpm check fr`. From the first deploy the site is navigable in your language even while pages are still English.

## 5. First pages

Follow [translating.md](translating.md). Suggested order: introduction and essentials, then guide (components, templates, signals, DI, routing, forms, HTTP, SSR), tutorials, best practices, tools, ecosystem, reference pages.

## 6. Build and deploy

Local production build:

```bash
pnpm build fr
```

CI and deploy need these repository settings:

- Actions enabled; the `deploy` workflow needs a `FIREBASE_SERVICE_ACCOUNT` secret (JSON of a service account with the Firebase Hosting Admin role on the project named in `site.json`).
- Branch protection on `main` with the `Check fr` status required (the CI job name; errors fail it, typography warnings only annotate the PR).
- A `SYNC_TOKEN` secret (fine-grained PAT: contents, pull requests, workflows write) so the weekly sync PR runs CI and the template-sync PR can update workflows; without it the sync PR has no checks and template updates that touch workflows cannot be pushed.
- Optional, after the first deploy: a search index of your own (Algolia DocSearch or your own application); see [search.md](search.md). Until then the search box uses upstream's English index.

`i18n/fr/ONBOARDING.md` is the checklist version of this list. Push to `main`: the `deploy` workflow builds every language and deploys each to its Firebase target.

## 7. Keep it alive

Read [maintenance.md](maintenance.md): the weekly `update-origin`, the status report, the release-branch switch, and what to do when a patch stops applying.
