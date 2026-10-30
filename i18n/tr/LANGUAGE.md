---
lang: tr
name: Türkçe
direction: ltr
formality: formal
lineParity: warn
quotes: ["“", "”"]
spaceBeforePunctuation: null
headingCase: sentence
numberFormat: "1.234,56"
dateFormat: "27 Ekim 2026"
fonts: []
---

# Translation rules: Türkçe

<!-- Written for people and AI agents. Keep it under two screens; the glossary carries the long tail.
     See docs/language-rules.md for what each section is for. Adjust the front matter above:
     quotes, spacing before punctuation, heading case, fonts (CJK/Arabic need a stylesheet). -->

## Register and tone

- Address the reader as: formal, "siz" (örnek: "göz atın", "kullanabilirsiniz").
- Direct sentences, active voice where the English uses it. Add nothing: no extra explanation, no opinion.
- Instructions use: the polite imperative ("-ın/-in/-un/-ün": "oluşturun", "ekleyin").

## Typography

- Quotes: “ ” in prose. Straight quotes stay in code, command output and English citations.
- Punctuation spacing: no space before `:`, `;`, `?` or `!`.
- Headings in sentence case. Product and API names unchanged: Angular, Angular CLI, TypeScript, `signal`, `inject`.
- Numbers and dates in prose: `1.234,56` and `27 Ekim 2026`.

## What stays in English and why

- API names, file names, commands and flags: `@Component`, `ng generate`, `--standalone`.
- Terms flagged `keep` in `glossary.json`: _TODO list the main ones and the reason_.
- Code, including comments (v1 rule), sample output, URLs, anchors.

## Grammar traps

- Gender and plural of borrowed terms: _TODO_.
- "you" in instructions: _TODO_.

## False friends and forbidden renderings

- _TODO: wrong rendering_ → _correct rendering_.

## UI strings

- Navigation labels and buttons stay short: noun or infinitive, no final period.
- A menu label more than two words longer than the English overflows on mobile.

## Voice sample

> **EN** Signals are Angular's primitive for reactive state. A signal holds a value and notifies interested consumers when that value changes.
>
> **TR** _TODO reference translation_
