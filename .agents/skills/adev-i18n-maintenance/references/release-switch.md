# Switching to a new release branch (minor or major)

angular.dev serves the latest release branch; `next.angular.dev` serves `main`. This repository tracks the former only.

1. On release day (or when `pnpm update-origin latest` reports a new branch name), run `pnpm update-origin latest`. Expect many refreshed snapshots on a major, a moderate number on a minor.
2. `pnpm dictionaries <lang>` for each language: new navigation labels and UI strings arrive with every release. Translate them in the same PR; they are short.
3. Review the full-file overlays, which `status` lists as stale or outdated: typically `assets/others/versions.json` (the version picker: keep "stable" pointing at your site and the other versions at angular.dev), `app/core/constants/links.ts`, and any template overlay. Re-apply your changes on the new snapshot and mark.
4. `pnpm build <lang>` locally once. A major release often changes `adev/shared-docs/pipeline` or the app routing; a build failure here is an escalation, not something to patch around.
5. Patches: CI's `git apply --check` tells you which ones died; refresh them (see patches.md).
6. Merge, deploy, then check the live site: `lang` attribute, title, navigation labels, a tutorial step (WebContainers headers), search. A site with its own index re-crawls on deploy when `search.crawlerId` and the Crawler secrets are set; otherwise start a crawl from the Algolia dashboard (docs/search.md).

Previous versions are not maintained: once the pin moves, the old branch's docs are gone from the site by design.
