# Triage rules

`pnpm status <lang>` classifies each outdated file by comparing the English it was translated from (recovered by its marker hash) with the current snapshot:

| Class | Meaning | Action | Who |
| --- | --- | --- | --- |
| a | only code blocks, link targets, URLs, markup or whitespace changed | `pnpm status <lang> --apply-mechanical <file>` (or `all`), then `pnpm check` | anyone, or the sync PR author |
| b | 5 or fewer prose lines changed | translate the hunks | translation skill, one reviewer |
| c | 6 to 30 prose lines changed | translate the hunks, read the whole page once | translation skill, one reviewer |
| d | more than 30 prose lines, or headings added/removed | retranslate the page, reuse good sentences; or defer with English in place | translator plus reviewer; schedule |
| unknown / no-marker | the old English is not in history, or the file has no marker | treat as c; add the marker | maintainer |

Priorities inside a sync:

1. Anything in `introduction/`, `guide/components`, `guide/templates`, `guide/signals`, `guide/di`, `guide/routing`, `guide/forms`, `guide/http`: readers land there.
2. `tutorials/`: step text is short; keep them complete.
3. `best-practices/`, `tools/`, `ecosystem/`, `ai/`.
4. `reference/errors/*`, `reference/extended-diagnostics/*`, `reference/migrations/*`, `roadmap.md`, `releases.md`, `versions.md`: batch monthly unless a change is user-facing (new error, new migration).

New upstream pages: list them in the PR; translate the ones in priority 1 and 2 in the same week if they are short.

Pages whose snapshot is "stale" in `status` mean `update-origin` was not run or the sync commit is incomplete; never translate against a stale snapshot.
