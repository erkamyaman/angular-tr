# Worked examples

## 1. New page (excerpt), French

Snapshot `overview.en.md`:

```md
## What are signals?

A **signal** is a wrapper around a value that notifies interested consumers when that value changes. Signals can contain any value, from primitives to complex data structures.
```

Translation `overview.md` (line 1 is the marker written by `pnpm status fr --init`):

```md
<!-- source: 7b9170c93d6e0b3f4a1d2c5e8f9a0b1c2d3e4f5a -->
## Que sont les signals ? {#what-are-signals}

Un **signal** est une enveloppe autour d'une valeur qui notifie les consommateurs intéressés quand cette valeur change. Les signals peuvent contenir n'importe quelle valeur, des primitives aux structures de données complexes.
```

Same number of lines, anchor kept, `signal` kept (glossary `keep`), narrow no-break space before `?`.

## 2. Class-b update

`pnpm status fr --diff content/guide/signals/overview.md`:

```
@@
 ## What are signals?

+Signals are now even better documented in this new paragraph.
+
 A **signal** is a wrapper around a value …
```

Edit: insert the two lines at the same position in `overview.md`, translated:

```md
## Que sont les signals ? {#what-are-signals}

Les signals sont désormais encore mieux documentés dans ce nouveau paragraphe.

Un **signal** est une enveloppe …
```

Then `pnpm status fr --mark content/guide/signals/overview.md` and `pnpm check fr i18n/fr/src/content/guide/signals/overview.md`. Nothing else in the file changes.

## 3. Renamed section (class d, headings changed)

English went from `## Reading signals in OnPush components` to `## Reading signals in `OnPush` components` (formatting only) and a new `## Signals and effects` section was added. The anchor of the first heading did not change (backticks are dropped by the id rule), so the translated heading keeps `{#reading-signals-in-onpush-components}`; the new section is translated in place. `pnpm check` confirms the heading count and anchors.

## 4. Deferring part of a page

The English added a 40-line section you cannot finish now. Keep it in place, in English, with its heading translated and anchored (`## Nouvelle section {#new-section}`), update the marker, and report:

```
Untranslated or deferred:
- content/guide/forms/signals/validation.md: section "Custom async validators" (lines 120–160) left in English
```

The status page shows the page as translated but the section reads in English until a later PR; open an issue so it is not forgotten.
