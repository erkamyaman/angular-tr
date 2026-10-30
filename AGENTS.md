# Guide for AI agents working in this repository

This repository translates the Angular documentation site (angular.dev, the `adev/` app of `angular/angular`) into one or more languages. Upstream lives in the `origin/` submodule and is **read-only**: never edit a file under `origin/`.

## Where things go

- `i18n/<lang>/src/**` mirrors `origin/adev/src/**`. A translated file `x.md` always has a sibling snapshot `x.en.md` (the English it was translated from) and starts with `<!-- source: <hash> -->` where `<hash>` is the git blob hash of that snapshot (`git hash-object x.en.md`). Same rule for app templates (`x.html` + `x.en.html`, marker `<!-- source: … -->`) and TypeScript overlays (`x.ts` + `x.en.ts`, marker `// source: …`).
- `i18n/<lang>/LANGUAGE.md` holds the language rules (front matter is machine-checked), `glossary.json` the terminology (its `forbidden` renderings fail `pnpm check`), `dictionaries/*.json` the UI strings. Read them before translating anything.
- JSON overlays cannot carry a comment: their marker lives in `<file>.source` next to them (`pnpm status --init` and `--mark` handle it).
- `tools/` holds the scripts; `tools/adev-patches/` the code patches applied at build time; `.agents/skills/` the skills.

## Skills

- `.agents/skills/adev-translation/SKILL.md`: translate a new page, update an outdated page from its English diff, review a translation.
- `.agents/skills/adev-i18n-maintenance/SKILL.md`: sync with upstream (`pnpm update-origin`), triage the queue, build, deploy, switch release branch, refresh a patch.

## Commands you will use

```bash
pnpm bootstrap                     # once per clone: shallow fetch of the pinned upstream into origin/ (status, check and --init read it)
pnpm status <lang> [--md|--json]   # what is outdated / untranslated / removed, with diff classes
pnpm status <lang> --init <rel>    # start a page: snapshot + marked copy (rel is relative to adev/src)
pnpm status <lang> --diff <rel>    # the English diff an outdated page needs
pnpm status <lang> --mark <rel>    # marker -> current snapshot, once the hunks are translated
pnpm check <lang> [paths…]         # must pass before you open a PR (structure, anchors, glossary via textlint, typography)
pnpm update-origin latest          # maintainers only: move the upstream pin
pnpm build <lang>                  # full production build (Node 26 like everything else; Bazel and pnpm pick upstream's own versions)
```

## Rules that are not negotiable

1. Never edit `origin/`, never rewrite `main` history, never commit `build/`.
2. A translated file must keep the line count, headings, `docs-*` elements, code blocks, links and alert keywords (`NOTE: `, `TIP: `…, English with a plain colon) of its snapshot; every translated heading carries `{#english-anchor}`.
3. Only change the passages the English diff touches; unchanged translated prose stays byte-identical.
4. Update the `source` marker to the new snapshot hash in the same change.
5. Run `pnpm check` and report what you translated, what you left in English (deferred) and any glossary gap.
6. Stop and ask a human when a patch fails to apply, a dictionary pair no longer matches, upstream changed `adev/shared-docs/pipeline` or `adev/BUILD.bazel`, or a page would ship with mixed languages outside the deferred list.
