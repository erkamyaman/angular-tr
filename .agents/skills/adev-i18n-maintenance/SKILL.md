---
name: adev-i18n-maintenance
description: Maintain a translated Angular documentation site built from angular-docs-rosetta - sync with upstream (pnpm update-origin), triage the work queue, refresh dictionaries, build and deploy, switch to a new release branch, refresh a patch that no longer applies. Use for any task that touches origin/, tools/, patches, workflows or the repository as a whole rather than one translated page.
license: MIT
compatibility: Node 26 (.nvmrc), pnpm, git. The Bazel build downloads its own Node toolchain and pnpm switches itself to upstream's version inside build/<lang> (pnpm bootstrap reports both).
metadata:
  author: OpenNG Foundation
  version: '0.1'
---

# adev-i18n-maintenance

You keep the repository healthy: the upstream pin moves, snapshots stay fresh, the queue is triaged, the site builds and deploys. Translating pages is the job of the `adev-translation` skill; hand over to it for prose.

## Ground rules

1. Never edit anything under `origin/`. Content goes in `i18n/<lang>/src`, tooling in `tools/`, code-level changes as patches in `tools/adev-patches/`, skills in `.agents/skills/`.
2. Never rewrite `main` history, never commit `build/`, never force-push.
3. One upstream pin per PR; sync PRs are merged with a merge commit (per-class commits survive).
4. When something fails that a maintainer must decide (dead patch, dead `index.html` pair, upstream pipeline change, mixed-language page), stop and report; do not force through.

## Weekly sync

Procedure in [references/sync.md](references/sync.md). In short:

```bash
pnpm update-origin latest                  # pin -> head of the newest release branch, snapshots refreshed
pnpm status <lang> --md > /tmp/status.md   # the queue (one per language)
git switch -c sync/$(git -C origin rev-parse --short HEAD)
git add origin i18n && git commit -m "sync: update origin to <branch> @ <short sha>"
```

Then triage ([references/triage.md](references/triage.md)): class **a** is applied by `pnpm status <lang> --apply-mechanical all`, **b** and **c** go to the translation skill, **d** and new pages are scheduled; `reference/errors/*` and `roadmap.md` are batched monthly. Open the PR with the status report as body; the "Removed or moved" and "Untranslated or deferred" sections of the template are mandatory.

## Dictionaries

```bash
pnpm dictionaries <lang>            # new upstream strings added with English values
pnpm dictionaries <lang> --prune    # also drop obsolete keys
pnpm check <lang>                   # fails on index.html pairs that no longer match upstream
```

A dead `index.html` pair means the page would ship with the wrong `lang` or metadata: fix the pair in `i18n/<lang>/dictionaries/index-html.json` (compare with `origin/adev/src/index.html`). A dead `pipeline.json` pair means alert labels or card texts would ship in English: fix its `find` against the upstream file it names under `origin/adev/shared-docs/pipeline/`, keep the `replace`.

## Release switch

angular.dev switches to the new release branch on release day; `pnpm update-origin 22.3.x` (or `latest`) does the same. Afterwards: `pnpm dictionaries <lang>`, review full-file overlays under `i18n/<lang>/src/app/**` and `assets/**` (their snapshots will be flagged by `status`), and build once locally before merging. Details in [references/release-switch.md](references/release-switch.md).

## Build and deploy

```bash
pnpm build <lang>                  # worktree + patches + overlay + dictionaries + environment/rosetta-config + bazel + post-process
pnpm build <lang> --prepare-only   # stop before Bazel (inspect, refresh a patch)
pnpm build <lang> --skip-patches   # emergency build without the switcher and banners
pnpm start <lang>                  # dev server with live overlay
```

The build runs on the same Node 26 as the tooling: Bazel downloads the Node toolchain upstream pins (`origin/MODULE.bazel`) and pnpm switches itself to upstream's `packageManager` version inside `build/<lang>`; `pnpm bootstrap` reports both. If upstream's `pnpm install` ever refuses the host Node, `nvm use $(cat origin/.nvmrc)` is the fallback. Deploy is the `deploy` workflow (push to `main`) or `firebase deploy --only hosting:<target> --project <id>` with the output in `build/<lang>/dist/bin/adev/dist/browser`. Rollback: Firebase Hosting release history. CI recipe and timings in [references/commands.md](references/commands.md).

## Patches

`tools/adev-patches/*.patch` fail loudly when upstream changes the patched file; CI runs `git apply --check` on every PR. Refresh procedure in [references/patches.md](references/patches.md). Keep patches to a handful: anything expressible as a dictionary entry or an overlay file must be one.

## Escalate to a human when

- a patch fails `git apply --check`;
- an `index.html` pair no longer matches;
- the build fails after upstream changed `adev/shared-docs/pipeline`, `adev/BUILD.bazel` or `adev/src/app/routing`;
- `update-origin` reports removed or renamed files with translations (moving pairs is a content decision);
- a page would ship half-translated outside the deferred list.

## References

- [references/sync.md](references/sync.md), [references/triage.md](references/triage.md), [references/release-switch.md](references/release-switch.md), [references/patches.md](references/patches.md), [references/commands.md](references/commands.md).
