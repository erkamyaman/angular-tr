# Français (exemple) — `i18n/_example`

Reference language of the template. It carries a complete French `LANGUAGE.md`, a seeded glossary and generated dictionaries so the template's own CI can build a localized site. It is removed from repositories created from the template (`pnpm create-language` offers to delete it).

Use it as a model for your own `i18n/<lang>/README.md`:

## Maintainers

- `@handle` (lead), `@handle`

## Where we talk

- Chat: _link_
- Issues: label `lang:fr`

## How we review

- New page: one translator, one reviewer who did not write the text.
- Outdated page (classes a, b, c): one reviewer.
- Terminology changes go through the glossary (`glossary.json`), not through line comments only.

## Status

- Coverage and freshness: `/assets/others/translation-status.json` on the site, or `pnpm report fr`.
