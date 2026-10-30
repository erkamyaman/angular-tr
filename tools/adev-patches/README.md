# adev-patches

Code-level changes to the upstream app that cannot be expressed as a dictionary entry or a file overlay. Applied in file-name order with `git apply` inside `build/<lang>/` by `pnpm build` and `pnpm start`, on the pristine upstream checkout, before the overlay and the dictionaries (which rewrite the text the patches' context lines contain; an overlay file wins over a patch to the same file, so languages never overlay patched files); verified with `git apply --check` by CI on every PR. `pnpm build <lang> --skip-patches` builds without them.

## 010-rosetta-ui.patch

Generated against `angular/angular` at the pinned commit of this template (22.2.x). It touches four upstream lines and adds three files:

| Change | Where | Purpose |
| --- | --- | --- |
| `<adev-rosetta-switcher />` | `adev/src/app/core/layout/footer/footer.component.html` (+ import in `.ts`) | Footer row: community notice, "Read this page in English" linking to the same path on angular.dev, links to the other languages of the repository |
| `<adev-rosetta-banner [pageId]="docContent.id" />` | `adev/src/app/features/docs/docs.component.html` (+ import in `.ts`) | Per-page banner when the page is outdated or not translated yet, with links to the English page and to the "Translation error" issue form |
| `adev/src/app/rosetta/language-switcher.component.ts`, `translation-banner.component.ts`, `README.md` | new files | The two standalone components (Angular 22, signals, OnPush; compiled with strict templates) |

Both components import `./rosetta-config`, which **the build generates** from `i18n/<lang>/site.json` (`tools/lib/build-steps.mjs`, `writeRosettaConfig`): language, URLs, `notice`, `strings`, and the list of languages in the repository. The banner reads `/assets/others/translation-status.json`, also written by the build from `pnpm status`. Texts are translated in `site.json` → `strings`.

## 020-optional-analytics.patch

One `if` in `adev/src/app/core/services/analytics/analytics.service.ts`: the Google Analytics tag is installed only when `environment.googleAnalyticsId` is non-empty. The build writes that id from `i18n/<lang>/site.json` → `analytics` (`tools/lib/search.mjs`, `environmentSource`): the site's own GA4 measurement id, or an empty string, never upstream's. Without this patch a community build would either report page views to Google's Angular property or load `gtag.js` with an empty id. Search credentials go through the same `environment.ts` rewrite and need no patch (see [docs/search.md](../../docs/search.md)).

## Refreshing after an upstream change

```bash
pnpm build <lang> --prepare-only          # worktree, then patches on pristine upstream: stops at the dead one and names it
cd build/<lang>
git checkout -q -- adev && git clean -fdq adev   # back to pristine upstream: drops the overlay, the dictionaries, environment.ts, rosetta-config.ts and the patches that did apply
# the patches that come before the dead one, applied and committed as a baseline (skip when the dead one is 010):
git apply ../../tools/adev-patches/010-rosetta-ui.patch && git add -A adev && git commit -qm baseline
git apply --3way ../../tools/adev-patches/020-optional-analytics.patch   # the dead one
# resolve the conflict markers in the listed files (usually an import line or the imports array moved), then:
git add -A adev && git diff --cached > ../../tools/adev-patches/020-optional-analytics.patch
cd ../.. && pnpm build <lang> --prepare-only   # resets the worktree (the baseline commit is discarded) and applies everything again: must pass
```

## Writing a new patch

Ask first whether a dictionary entry or an overlay file would do; a patch is the last resort. Name it `NNN-short-name.patch` so patches apply in a stable order. A patch must stay language-agnostic: read language-specific values from `rosetta-config.ts` or from strings the dictionaries can translate, never hard-code a language.

```bash
pnpm build <lang> --prepare-only
cd build/<lang>
git checkout -q -- adev && git clean -fdq adev   # pristine upstream, see above
for p in ../../tools/adev-patches/*.patch; do git apply "$p"; done && git add -A adev && git commit -qm baseline
# edit or add files under adev/ …
git add -A adev && git diff --cached > ../../tools/adev-patches/0NN-short-name.patch
cd ../.. && pnpm build <lang> --prepare-only   # must pass with the new patch in the sequence
```

The baseline commit matters: without the reset, the diff would carry the translated navigation labels, the UI strings, `environment.ts` and `rosetta-config.ts` that the build generated; without the commit, it would repeat the earlier patches.
