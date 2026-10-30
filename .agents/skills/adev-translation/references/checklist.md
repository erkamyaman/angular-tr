# Pre-PR checklist

- [ ] `LANGUAGE.md` and `glossary.json` read for this language.
- [ ] Every translated file has its `*.en.*` snapshot next to it.
- [ ] Marker on line 1 equals the snapshot hash (`pnpm status <lang> --mark <path>` after an update).
- [ ] Line count equals the snapshot's (marker excepted).
- [ ] Headings: same count, same levels, English anchors `{#…}` on every translated heading.
- [ ] `docs-*` elements, code blocks and link targets identical to the snapshot.
- [ ] No sentence added or dropped; no explanation or opinion of your own.
- [ ] Glossary applied; `keep` terms in English; no forbidden rendering.
- [ ] Typography from the front matter (quotes, spacing, heading case).
- [ ] Code, comments, paths, URLs, identifiers untouched.
- [ ] `pnpm check <lang> <files>` green (warnings reviewed).
- [ ] Report written: translated, updated (with class), deferred sections, glossary proposals.
