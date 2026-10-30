# Writing the language rules: `LANGUAGE.md` and `glossary.json`

Everything language-specific lives in two files under `i18n/<lang>/`. The skills, the checker and human reviewers all read them; the skill text itself never mentions a language.

## `LANGUAGE.md`

Two parts: a YAML front matter the tooling checks mechanically, and prose that agents and people read before translating.

### Front matter (machine-checked)

```yaml
---
lang: fr
name: Français
direction: ltr            # ltr | rtl (rtl needs app patches, see docs/architecture.md)
formality: formal         # formal | informal | neutral — the register the glossary examples use
lineParity: strict        # strict | warn | off — translated files keep the snapshot's line count
quotes: ["«", "»"]        # the quotation marks prose should use; straight " outside code is flagged
spaceBeforePunctuation:   # characters that take a (narrow no-break) space before them, empty for none
  chars: [":", ";", "?", "!"]
  space: " "
headingCase: sentence     # sentence | none — `sentence` flags headings that look Title Cased; `none` disables the check
numberFormat: "1 234,56" # example, informational
dateFormat: "27 octobre 2026"
fonts: []                 # extra font stylesheets to inject in index.html (CJK, Arabic…), see index-html dictionary
---
```

`pnpm check` reports these as warnings (errors with `--strict`; CI shows them as annotations without failing): a regular space before `:` when a narrow no-break space is required, straight quotes in prose, a heading in Title Case when sentence case is required. Line-count drift is an error with `lineParity: strict` and a warning with `warn`. The typography checks look at prose only: code, URLs, HTML tags and their attribute lines, the `NOTE:`/`TIP:` alert keywords (syntax, see [translating.md](translating.md)) and any line left identical to the English (a passage deferred in English) are skipped.

Reserve `keep: true` for terms that never translate (API names used as words: `signal`, `template`, `pipe`): the checker warns when such a term appears in the English and not in the translation. A word that is also ordinary English (`input`, `build`, `bundle`) gets `"translation"` equal to the term and a `note` saying when the English stays; otherwise every "user input" sentence raises a warning.

### Prose (read by agents and reviewers)

Write it as instructions, with examples. Sections that have proven useful:

1. **Register and tone**: who the reader is addressed as (*vous* / *tu*, polite forms), how direct the sentences are, what never to add (opinions, explanations the English does not have).
2. **Typography**: punctuation spacing, quotes, dashes, capitalization of headings and of product names, number and date formats in prose. Code, output samples and English quotations keep English typography.
3. **What stays in English and why**: the `keep` terms of the glossary with the reasoning, so new terms get the same treatment.
4. **Grammar traps**: gender and plural of borrowed terms (`un signal`, `une directive`), agreement with English acronyms, how to translate "you" in instructions, imperative vs infinitive in steps.
5. **False friends and forbidden renderings**: with the correct alternative.
6. **UI strings**: navigation labels and buttons are short; give length guidance and the preferred verb form.
7. **Voice sample**: one English paragraph from the docs and its reference translation.

Keep the whole file under two screens; the glossary carries the long tail.

## `glossary.json`

```json
[
  {"term": "signal", "keep": true, "note": "API name, stays in English; masculine in French: un signal, les signals"},
  {"term": "dependency injection", "translation": "injection de dépendances", "forbidden": ["injection de dépendance"]},
  {"term": "change detection", "translation": "détection de changements", "forbidden": ["détection des changements", "détection de changement"]},
  {"term": "template", "keep": true, "note": "never 'gabarit' or 'modèle'", "forbidden": ["gabarit"]}
]
```

Fields: `term` (English, lowercase), `translation` (preferred rendering), `keep` (true when the English term is used as is), `forbidden` (renderings the checker flags), `note` (why, gender, usage), `example` (optional English/translated pair).

`pnpm create-language` seeds the file with the most frequent technical terms of the current docs, translation left empty. Fill the top 50 before translating the first pages; add an entry every time a review rejects a rendering.

The checker uses the glossary two ways: `forbidden` renderings are errors; a `keep` term present in the English snapshot but absent from the translation is a warning (the paragraph may legitimately paraphrase it).

## Reference files

- `i18n/_example/LANGUAGE.md` in the template is a filled-in example with French rules; angular-ja's `prh.yml` and angular-docs-es's `CONTRIBUTING.md` terminology section are good references for Japanese and Spanish.
- `forbidden` renderings are enforced with [textlint](https://textlint.org) and [textlint-rule-prh](https://github.com/textlint-rule/textlint-rule-prh), the same pair angular-ja uses: `pnpm glossary <lang>` turns the glossary into `i18n/<lang>/prh.yml` plus a `.textlintrc.json`, `pnpm check` regenerates them when the glossary changed, and any editor with a textlint extension flags the terms as you type. Matching is case-insensitive and word-bounded (Unicode-aware); code blocks, inline code and URLs are never checked. Do not edit the generated files: change `glossary.json` and commit all three.
