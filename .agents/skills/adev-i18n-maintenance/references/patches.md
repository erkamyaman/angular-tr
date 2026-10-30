# Patches

Patches in `tools/adev-patches/*.patch` are applied with `git apply` inside `build/<lang>/` on the pristine upstream checkout, in file-name order, before the overlay and the dictionaries (the dictionaries rewrite the very text the patches' context lines contain, so they come after; an overlay file wins over a patch to the same file, so languages never overlay patched files):

| Patch | What it changes |
| --- | --- |
| `010-rosetta-ui.patch` | Footer language switcher with the community notice; per-page outdated/untranslated banner; the two components under `adev/src/app/rosetta/` |
| `020-optional-analytics.patch` | Google Analytics only when `environment.googleAnalyticsId` is non-empty (the build writes the site's own id, or none) |

The components read `adev/src/app/rosetta/rosetta-config.ts`, which `pnpm build` generates from `i18n/<lang>/site.json` (`writeRosettaConfig` in `tools/lib/build-steps.mjs`), and `assets/others/translation-status.json`, which the build writes from `pnpm status`. Texts come from `site.json` → `notice` and `strings`.

## When a patch stops applying

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

The reset is required: without it the diff carries the translated labels, UI strings, `environment.ts` and `rosetta-config.ts` the build generated. `git diff --cached` after `git add -A` is required: a plain `git diff` leaves out the new files a patch adds. Commit the refreshed patch in the sync PR with message `patches: refresh 020-optional-analytics for <short sha>`.

## Writing a new patch

Ask first whether a dictionary entry, an overlay file or a generated value would do; a patch is the last resort. Then:

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

A patch must be language-agnostic: read language-specific values (site URL, notice, strings, languages) from `rosetta-config.ts` or from strings the dictionaries can translate, never hard-code a language. Search credentials and the analytics id need no patch: `site.json` → `environment.ts` at build time.

## Checking in CI

The `check` job runs `git apply --check` for every patch against the pinned `origin`; a PR that moves the pin and breaks a patch fails until the patch is refreshed. `pnpm build <lang> --skip-patches` ships without switcher and banners when a fix cannot wait.
