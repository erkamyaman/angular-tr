# Markdown rules for adev pages

adev compiles Markdown with its own pipeline (`adev/shared-docs/pipeline`). These rules keep the translated page structurally identical so the build and the checker accept it.

## Line structure

Keep the snapshot's line count (the `<!-- source: … -->` marker on line 1 excepted). One English line = one translated line, even when the sentence order changes inside a paragraph. Blank lines stay blank. This keeps every later diff aligned.

## Headings

| English | Translation |
| --- | --- |
| `## What are signals?` | `## Que sont les signals ? {#what-are-signals}` |
| `### Using `inject()` {#inject}` | `### Utiliser `inject()` {#inject}` (custom id kept) |

The anchor is upstream's generated id: lowercase, spaces and slashes to dashes, only letters, digits and dashes kept. `pnpm check` prints the exact anchor to use when it is missing or wrong. The H1 (`# Title`) is the page title: translate it, no anchor needed. `docs-step` titles are rendered through the same heading renderer, so they take the same `{#english-id}` suffix inside the `title` attribute and it is hidden on the page.

## Custom elements

| Element | Translate | Keep |
| --- | --- | --- |
| `<docs-callout title="…">`, `helpful`, `important`, `critical` | `title`, body | attribute names |
| `<docs-card title="…" href="…" link="…">` | `title`, body, `link` text | `href` |
| `<docs-card-container>`, `<docs-pill-row>` | nothing | everything |
| `<docs-pill href="…" title="…">` | `title` | `href` |
| `<docs-step title="…">` | `title` (keep the English anchor: `title="Créer un composant {#create-a-component}"`), body | `headerLevel` and other attributes |
| `<docs-workflow>` | nothing | everything |
| `<docs-tab-group>`, `<docs-tab label="…">` | `label`, body | everything else |
| `<docs-code path="…" region="…" visibleLines="…" highlight="…" header="…" language="…">` | `header` only | `path`, `region`, `visibleLines`, `highlight`, `language`, `preview`, `linenums` |
| `<docs-code-multifile>` | `header` of inner `docs-code` | paths |
| `<docs-decorative-header title="…" imgSrc="…">` | `title`, body | `imgSrc` |
| `<docs-video src="…" title="…">` | `title` | `src` |

Count and order of these elements must match the snapshot.

## Code

Fenced code blocks (```), inline code (`` `like this` ``) and `docs-code` snippets are copied verbatim, comments included (v1 rule; a language may decide otherwise in `LANGUAGE.md`). Output samples, terminal transcripts and file names too.

## Links

`[text](guide/components#anchor)`: translate `text`, keep the target. Same for images: translate `alt`, keep `src`. Links to pages that are not translated yet still work because the site keeps upstream paths.

## Mermaid

Node labels and edge labels inside ```mermaid blocks may be translated (they are prose); identifiers and syntax stay.

## Tables

Translate cells; keep the number of columns and rows and the header separator line.

## Notes, tips, prefixes

Alert prefixes written as text (`NOTE:`, `TIP:`, `HELPFUL:`, `IMPORTANT:`, `CRITICAL:`, `QUESTION:`, `SUMMARY:`, `TLDR:`, `TODO:`) are recognized by the pipeline: keep the English keyword, the plain colon and the space, translate the sentence after it. The label readers see is translated once for the whole site in `dictionaries/pipeline.json`, never in the page.

## Typography

Apply the front matter of `LANGUAGE.md`: quotes, spacing before punctuation, heading case, number and date formats. English typography stays inside code and in English quotations.
