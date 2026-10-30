# i18n/

One folder per language, named by its language code (`fr`, `es`, `pt-BR`). `_example/` is the template's reference language (French: rules, glossary, translated dictionaries and a translated page, reused by `pnpm create-language fr`) and is removed by `pnpm create-language` in your own repository. The tooling and the `site.json` schema live under `tools/`, so template sync never touches this directory.

```
i18n/<lang>/
  site.json          domain, repository, Firebase, search, analytics, community   (schema: tools/site.schema.json)
  LANGUAGE.md        language rules: YAML front matter checked by `pnpm check`, prose for people and agents
  glossary.json      terminology: keep-in-English flags, preferred and forbidden renderings
  prh.yml            generated from glossary.json (pnpm glossary <lang>): textlint rules for the forbidden renderings
  .textlintrc.json   generated: textlint configuration picked up by `pnpm check` and editor extensions
  dictionaries/
    navigation.json  "English label": "translated label"           (navigation-entries/index.ts)
    ui.json          "src/app/…/x.component.html": {"English": "…"} (texts and aria/title/alt attributes of the app
                     and of shared-docs/components/**: search dialog, table of contents, cookie banner…)
    index-html.json  [{"find": "…", "replace": "…"}]                (lang, title, metadata, canonical, fonts)
    pipeline.json    [{"file": "shared-docs/pipeline/…", "find": "…", "replace": "…"}]
                                                                    (alert labels NOTE:/TIP:…, "Learn more", edit-page tooltip)
  src/               overlay of origin/adev/src: translated files next to their *.en.* snapshots
  README.md          maintainers, chat, review rules, status link
  ONBOARDING.md      checklist of settings to flip before the first deploy (delete when done)
```

Never put anything else at the root of `i18n/`: the tooling treats every directory here as a language.
