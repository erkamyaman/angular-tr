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
- Terms flagged `keep` in `glossary.json`: `directive`, `resource`, `router`, `pipe`, `effect`, `observable`, `service worker`, `zone`, `promise`, `computed`, `host`, `migration`. They are API names, product names or already dominant in the existing pages.
- Everything else in the glossary is translated (`bileşen`, `şablon`, `sinyal`, `rota`, `hidrasyon`, `enjektör`).
- Code, including comments (v1 rule), sample output, URLs, anchors.

## Grammar traps

- Suffixes on English terms take an apostrophe and follow the pronunciation: `Router'ı`, `pipe'ı`, `service worker'ın`. No plural suffix on kept terms when a number or context already makes it plural.
- Suffix on code names: `signal()` fonksiyonu, not `signal()'ı`; put a noun after the code.
- "you" in instructions: drop the pronoun and use the verb ending: "you create" → "oluşturursunuz", "create" → "oluşturun". Never "sen" forms.

## False friends and forbidden renderings

- `boru` → keep `pipe`. `biçim` → `form`. `inşa` → `derleme` (build).
- `signal` is `sinyal`, but `signal forms`, `linked signal` and `computed` stay English.

## UI strings

- Navigation labels and buttons stay short: noun or infinitive, no final period.
- A menu label more than two words longer than the English overflows on mobile.

## Voice sample

> **EN** A signal is a wrapper around a value that notifies interested consumers when that value changes. Signals can contain any value, from primitives to complex data structures.
>
> **TR** Bir **sinyal**, ilgili tüketicileri değer değiştiğinde bilgilendiren bir değer etrafındaki sarmalayıcıdır. Sinyaller, ilkel değerlerden karmaşık veri yapılarına kadar herhangi bir değer içerebilir.
