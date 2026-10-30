---
name: adev-translation
description: Translate or update a page of the Angular documentation (angular.dev / adev) in a repository built from angular-docs-rosetta. Use when asked to translate a page, process the sync queue, update outdated translations from their English diff, translate navigation or UI dictionaries, or review a translation under i18n/<lang>/. Language rules come from i18n/<lang>/LANGUAGE.md and glossary.json, never from this skill.
license: MIT
compatibility: Node 26 (.nvmrc), pnpm, git. No Angular build needed.
metadata:
  author: OpenNG Foundation
  version: '0.1'
---

# adev-translation

You translate Markdown pages and UI strings of the Angular documentation into the language of `i18n/<lang>/`. The repository layout, markers and rules are described in `AGENTS.md`; the per-language rules in `i18n/<lang>/LANGUAGE.md` and `i18n/<lang>/glossary.json`. Read those two files first, every time.

## Before anything

1. Identify the language folder (`i18n/<lang>/`); if several exist, ask which one.
2. Read `i18n/<lang>/LANGUAGE.md` (register, typography, what stays in English) and `glossary.json`.
3. Run `pnpm status <lang>` to see the queue: outdated pages with their diff class, untranslated pages, dictionary gaps.

## Translating a new page

```bash
pnpm status <lang> --init content/<path>.md   # creates <path>.en.md (snapshot) and <path>.md with the marker
```

Then rewrite `i18n/<lang>/src/content/<path>.md` in place, following [references/markdown-rules.md](references/markdown-rules.md):

- same number of lines as the snapshot (the marker line excepted); break sentences where the English breaks them;
- every heading keeps the English anchor: `## Titre traduit {#english-anchor}`, and so does every `<docs-step title="… {#english-anchor}">`; the anchor is the one `pnpm check` tells you, computed from the English heading;
- code blocks, `docs-code` attributes, identifiers, paths, URLs, anchors untouched; translate titles, labels, alt text, callout and card text;
- alert keywords untouched: `NOTE: `, `TIP: `, `HELPFUL: `, `IMPORTANT: `, `CRITICAL: `, `QUESTION: `, `SUMMARY: `, `TLDR: `, `TODO: ` at the start of a paragraph are syntax (English keyword, plain colon, one space); translate the sentence after them, and `pnpm check` counts them against the snapshot;
- glossary applied; `keep` terms stay in English; the `forbidden` renderings of `glossary.json` are errors in `pnpm check` (textlint rules generated from the glossary).

Finish with `pnpm check <lang> i18n/<lang>/src/content/<path>.md` and fix every error. Warnings are typography hints: fix them too unless `LANGUAGE.md` says otherwise.

## Updating an outdated page

```bash
pnpm status <lang> --diff content/<path>.md   # the English delta since the translation
```

Rewrite **only** the passages the diff touches; unchanged translated prose stays byte-identical. Added English lines get a translated line at the same position; removed lines are removed. Then:

```bash
pnpm status <lang> --mark content/<path>.md   # marker -> current snapshot hash
pnpm check <lang> i18n/<lang>/src/content/<path>.md
```

Diff classes: **a** code, link targets, URLs or whitespace only: run `pnpm status <lang> --apply-mechanical <path>` (or `all`), nothing to translate; **b** up to 5 prose lines; **c** up to 30; **d** restructure (usually retranslate the whole page, keeping existing good sentences). For class d, if you cannot finish, keep the new English section in place untranslated and list it under "Untranslated or deferred" in your report.

## Dictionaries

`i18n/<lang>/dictionaries/navigation.json` and `ui.json` map English strings to translations; a value equal to its key is untranslated. Translate values only; never change keys. Keep labels short (menus overflow on mobile). `index-html.json` and `pipeline.json` hold find/replace pairs: never edit `find`; in `replace`, translate only the quoted English text (title and description pairs in `index-html.json`; alert labels such as `NOTE = 'NOTE',` → `NOTE = 'Note ',`, "Learn more", "Edit this page" in `pipeline.json`) and keep every quote, comma and `${` exactly. `pnpm check <lang>` validates all four.

## What you never do

- Edit anything under `origin/` or a `*.en.*` snapshot.
- Change code blocks, including comments (v1 rule), or `docs-code` attributes (`path`, `region`, `visibleLines`, `highlight`).
- Add explanations, opinions or links the English does not have; drop a sentence or a caveat.
- Translate the `{#anchor}`, a URL, a file path, an identifier, a CLI flag.
- Leave a file without its snapshot or with a stale marker.

## Self-review before reporting

Run through [references/checklist.md](references/checklist.md). Then report: pages translated, pages updated (with class), pages deferred and which sections, glossary gaps you noticed (propose entries), and the final `pnpm check` output.

## References

- [references/markdown-rules.md](references/markdown-rules.md): what to translate in each Markdown construct of adev.
- [references/examples.md](references/examples.md): a new page, a class-b update, a renamed section.
- [references/checklist.md](references/checklist.md): the pre-PR checklist.
