/**
 * Templates and helpers used by create-language.
 */
import path from 'node:path';
import {globFiles, readText} from './fs.mjs';
import {CONTENT_EXCLUDES, CONTENT_GLOBS, adevSrc} from './paths.mjs';

/** Technical terms worth a glossary entry; counted in the current docs to seed glossary.json. */
export const SEED_TERMS = [
  'component', 'directive', 'pipe', 'service', 'module', 'template', 'signal', 'computed', 'effect', 'input', 'output',
  'model', 'view', 'binding', 'property binding', 'event binding', 'two-way binding', 'interpolation', 'control flow',
  'deferrable views', 'dependency injection', 'injector', 'provider', 'injection token', 'lifecycle hook',
  'change detection', 'zone', 'zoneless', 'hydration', 'server-side rendering', 'prerendering', 'routing', 'router',
  'route', 'guard', 'resolver', 'lazy loading', 'standalone', 'form', 'reactive forms', 'template-driven forms',
  'signal forms', 'form control', 'form group', 'validation', 'validator', 'interceptor', 'observable', 'subscription',
  'promise', 'async pipe', 'resource', 'linked signal', 'content projection', 'host element', 'host binding',
  'host listener', 'attribute', 'selector', 'decorator', 'metadata', 'bootstrap', 'application config', 'environment',
  'build', 'bundle', 'dev server', 'schematic', 'migration', 'workspace', 'library', 'package', 'unit test',
  'end-to-end', 'test harness', 'accessibility', 'animation', 'internationalization', 'localization', 'locale',
  'stylesheet', 'view encapsulation', 'shadow dom', 'performance', 'image optimization', 'service worker', 'devtools',
  'language service', 'deployment', 'caching', 'event listener', 'query', 'host', 'slot', 'placeholder',
];

/** Count whole-word occurrences of the seed terms across in-scope Markdown. */
export async function countTerms(originDir, terms = SEED_TERMS) {
  const src = adevSrc(originDir);
  const files = await globFiles([...CONTENT_GLOBS, ...CONTENT_EXCLUDES.map((e) => `!${e}`)], {cwd: src});
  const counts = new Map(terms.map((t) => [t, 0]));
  const regexes = terms.map((t) => [t, new RegExp(`(?<![\\p{L}\\p{N}-])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?(?![\\p{L}\\p{N}-])`, 'giu')]);
  for (const rel of files) {
    const text = (await readText(path.join(src, rel))).replace(/```[\s\S]*?```/g, '');
    for (const [t, re] of regexes) {
      const n = (text.match(re) ?? []).length;
      if (n) counts.set(t, counts.get(t) + n);
    }
  }
  return [...counts.entries()].filter(([, n]) => n >= 3).sort((a, b) => b[1] - a[1]);
}

export function languageMd({lang, name, direction, formality}) {
  return `---
lang: ${lang}
name: ${name}
direction: ${direction}
formality: ${formality}
lineParity: strict
quotes: ["“", "”"]
spaceBeforePunctuation: null
headingCase: sentence
numberFormat: "1,234.56"
dateFormat: "27 October 2026"
fonts: []
---

# Translation rules: ${name}

<!-- Written for people and AI agents. Keep it under two screens; the glossary carries the long tail.
     See docs/language-rules.md for what each section is for. Adjust the front matter above:
     quotes, spacing before punctuation, heading case, fonts (CJK/Arabic need a stylesheet). -->

## Register and tone

- Address the reader as: _TODO (formal / informal, and the pronoun)_.
- Direct sentences, active voice where the English uses it. Add nothing: no extra explanation, no opinion.
- Instructions use: _TODO (imperative form)_.

## Typography

- Quotes: _TODO_. Straight quotes stay in code, command output and English citations.
- Punctuation spacing: _TODO_.
- Headings in sentence case. Product and API names unchanged: Angular, Angular CLI, TypeScript, \`signal\`, \`inject\`.
- Numbers and dates in prose: _TODO_.

## What stays in English and why

- API names, file names, commands and flags: \`@Component\`, \`ng generate\`, \`--standalone\`.
- Terms flagged \`keep\` in \`glossary.json\`: _TODO list the main ones and the reason_.
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
> **${lang.toUpperCase()}** _TODO reference translation_
`;
}

export function languageReadme(site) {
  const m = site.community?.maintainers?.length ? site.community.maintainers.map((h) => `@${h}`).join(', ') : '_TODO_';
  return `# ${site.name} — \`i18n/${site.folder}\`

Community translation of [angular.dev](${site.upstreamSite}) into ${site.englishName}, published at https://${site.domain}.

## Maintainers

- ${m}

## Where we talk

- Chat: ${site.community?.chat || '_TODO_'}
- Issues: label \`lang:${site.folder}\`

## How we review

- New page: one translator, one reviewer who did not write the text.
- Outdated page (diff classes a, b, c): one reviewer.
- Terminology changes go through \`glossary.json\`, not only through line comments.

## How to help

1. \`pnpm status ${site.folder}\` lists untranslated and outdated pages.
2. Read \`LANGUAGE.md\` and \`glossary.json\`.
3. Follow [docs/translating.md](../../docs/translating.md); no build needed.

## Status

- Coverage and freshness: https://${site.domain}/assets/others/translation-status.json, or \`pnpm report ${site.folder}\`.
`;
}

export function onboardingMd(site) {
  return `# Onboarding checklist — ${site.folder}

Generated by \`pnpm create-language\`. Tick, then delete this file.

## GitHub

- [ ] Actions enabled for the repository.
- [ ] Branch protection on \`main\`: require a pull request and the \`Check ${site.folder}\` status (the CI job name).
- [ ] Secret \`FIREBASE_SERVICE_ACCOUNT\`: JSON key of a service account with the *Firebase Hosting Admin* role on project \`${site.firebase.projectId}\`.
- [ ] Secret \`SYNC_TOKEN\` (recommended): fine-grained PAT with contents, pull requests and workflows write, so the weekly sync PR runs CI and the template-sync PR can update workflows.
- [ ] Team or handles in \`CODEOWNERS\` exist and have write access.
- [ ] Labels created: \`lang:${site.folder}\`, \`type:translation\`, \`type:sync\`, \`type:tooling\`, \`type:template-sync\`, \`build\`, \`good first translation\`.
- [ ] Discussions enabled (optional, for cross-language coordination).

## Firebase

- [ ] Project \`${site.firebase.projectId}\` exists; Hosting enabled.
- [ ] Hosting site created and mapped to target \`${site.firebase.target}\` (\`firebase target:apply hosting ${site.firebase.target} <site-id>\`), or \`pnpm firebase-config\` re-run after editing \`site.json\`.
- [ ] Custom domain \`${site.domain}\` connected and verified.

## Content

- [ ] \`dictionaries/navigation.json\`, \`ui.json\`, \`index-html.json\`, \`pipeline.json\` translated (\`pnpm check ${site.folder}\` passes).
- [ ] \`site.json\`: \`notice\` and \`strings\` (language switcher and banner texts) translated.
- [ ] \`glossary.json\`: the top 50 terms have a translation or \`keep\`.
- [ ] \`LANGUAGE.md\` reviewed by a second person.
- [ ] First pages: introduction and essentials.

## Search and SEO (after the first deploy)

- [ ] Search index of your own (docs/search.md): DocSearch application submitted for https://${site.domain}, crawler configured from \`pnpm search-index ${site.folder}\`, credentials in \`site.json\` (\`search\`), \`pnpm search-index ${site.folder} --verify\` green.
- [ ] Optional: \`search.crawlerId\` in \`site.json\` and the \`ALGOLIA_CRAWLER_USER_ID\` / \`ALGOLIA_CRAWLER_API_KEY\` secrets, so each deploy re-crawls the site.
- [ ] Analytics: \`analytics\` in \`site.json\` names your own GA4 id, or stays \`none\` (nothing is sent).
- [ ] \`sitemap.xml\` reachable; \`hreflang\` alternates visible in the page source.

## Community

- [ ] \`README.md\` of the language filled in (maintainers, chat, review rules).
- [ ] Angular team informed of the community translation (optional, recommended).
`;
}

/** Replace the block between `<!-- key:start -->` and `<!-- key:end -->` (or `# key:start/end`). */
export function replaceBetweenMarkers(text, key, body, {comment = 'html'} = {}) {
  const [open, close] = comment === 'html' ? [`<!-- ${key}:start -->`, `<!-- ${key}:end -->`] : [`# ${key}:start`, `# ${key}:end`];
  const start = text.indexOf(open);
  const end = text.indexOf(close);
  if (start === -1 || end === -1 || end < start) return null;
  return text.slice(0, start + open.length) + '\n' + body + '\n' + text.slice(end);
}
