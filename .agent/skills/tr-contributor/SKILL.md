---
name: tr-contributor
description: Guides a contributor through improving or translating the Turkish Angular docs in this repo (angular-tr). Use whenever the user wants to contribute, fix a translation, translate a page, or open a pull request here. Talk to the user in Turkish.
---

# Angular Türkçe Dokümantasyon: Contributor Guide

This repo is the community Turkish translation of the Angular docs, published at https://angular-docs.tr. The contributor only works on translation. You do not need to know or touch the rest of Angular's source.

**Talk to the contributor in Turkish.** They may be new to open source and to Git, so explain each step briefly and run commands for them when they ask. Never skip a step silently.

## Scope

Edit only Markdown pages under `adev/src/content/**/*.md`.

Do not edit:

- Anything outside `adev/src/content/` (framework code in `packages/`, build files, `package.json`, `pnpm-lock.yaml`, `MODULE.bazel`, `.github/`).
- Non-Markdown files in `adev/src/content/` (example code, `config.json`, images). If a page needs one of these changed, tell the contributor to ask the maintainer (Kam / @erkamyaman).
- Site publishing. The maintainer builds and deploys the site and syncs the repo with new Angular versions. A merged PR is all the contributor needs to do.

## First-time setup

1. Fork `erkamyaman/angular-tr` on GitHub, then clone the fork.
2. Default branch is `turkish-doc`. Always branch from it:
   ```bash
   git checkout turkish-doc && git pull
   git checkout -b docs/<short-topic>
   ```
3. Optional but recommended: run `pnpm install` once. The pre-commit hook then runs Prettier on staged files. If it is not installed, the hook only warns and the commit still works.

## Choosing what to do

- **Fix a translation:** open the page, read the Turkish next to the English meaning, improve wording, fix typos and grammar.
- **Find work:** run `bash .agent/skills/tr-contributor/scripts/list-untranslated.sh` from a clean `turkish-doc` checkout (takes about 15 seconds). It prints pages identical to the English original (untranslated) and translated pages that still have English headings (partial), most first. Fix those headings and the English prose near them. Pages with only 1 or 2 hits are often legitimate English terms, so judge each one.
- **Translate a page:** only for pages the script lists as untranslated. Tell the maintainer which page you picked so work is not duplicated, and open a draft PR early for big pages.
- One PR should cover one page or one small group of related pages. Small PRs get reviewed faster.

## Translation rules

Translate:

- Body text, headings, list items, table cells.
- Visible attributes of `docs-*` components (`title`, `header`, `alt`, link text).
- Comments inside code blocks, and user-facing strings in examples.

Leave unchanged:

- Code, API and symbol names, file paths, URLs, CLI commands.
- Alert keywords: `NOTE`, `TIP`, `IMPORTANT`, `HELPFUL`, `WARNING` and similar. Only the text after the colon is translated.
- Markdown structure and `<docs-*>` tags. Do not remove, reorder or rename them.
- Prefer the style of translated sibling pages over your own taste. Open one or two neighbors first.

Turkish suffixes on English terms take an apostrophe: `signal`'in, `readonly`'ye, `Reactive context`'ler.

### Terminology

Counts come from the current docs. When unsure, run `grep -ri "<term>" adev/src/content/guide` and follow the majority.

| English              | Turkish                |
| -------------------- | ---------------------- |
| component            | bileşen                |
| directive            | direktif               |
| template             | şablon                 |
| dependency injection | bağımlılık enjeksiyonu |
| service              | servis                 |
| route / routing      | rota / yönlendirme     |
| router               | yönlendirici           |
| signal               | sinyal                 |
| change detection     | değişiklik algılama    |
| lifecycle            | yaşam döngüsü          |
| hydration            | hidrasyon              |
| binding              | bağlama                |

Often kept in English (check neighbors): guard, resolver, pipe, input, output, effect, computed, writable, lazy, `Reactive context`.

### Headings and links (important)

Other pages link to headings by their anchor. A translated heading changes its anchor and silently breaks those links, which fails the site build.

Existing pages keep the English anchor with a custom ID:

```md
## Sinyaller nedir? {#what-are-signals}
```

Before you change any heading, search for links to it:

```bash
grep -rn "#<old-english-slug>" adev/src packages --include=*.md --include=*.ts
```

If anything links to it, keep or add `{#english-slug}` (lowercase, hyphens, taken from the English heading). Do not remove existing `{#...}` IDs.

## Quality checklist before committing

- [ ] No leftover English prose, including headings, `docs-card`/`docs-pill` titles, table headers and alt text.
- [ ] Turkish letters are present (ç, ğ, ı, İ, ö, ş, ü). Never write ASCII-ified Turkish ("bilesen").
- [ ] Code blocks, file paths and links are unchanged. Link URLs are not translated.
- [ ] Heading anchors checked as above.
- [ ] No mojibake (search the file for `Ã`, `Ä`, `Å`). It means the file was saved with the wrong encoding.
- [ ] Meaning matches the English source. When in doubt, compare with the same page on https://angular.dev.
- [ ] Formatting is clean: `pnpm prettier --check <file>` (or `--write` to fix).

## Commit and pull request

Only commit and push when the contributor asks. Then:

```bash
git add adev/src/content/<changed files>
git commit -m "docs: <short description of the change>"
git push -u origin docs/<short-topic>
```

Commit messages start with `docs:`. Turkish or English description is fine.

Open the PR against `erkamyaman/angular-tr`, base branch `turkish-doc`, from the contributor's fork. The PR description should say which page(s) changed and whether it is a fix or a new translation. The maintainer reviews and merges.

If the PR touches files outside `adev/src/content/**/*.md`, stop and explain why before pushing.
