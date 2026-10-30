# Weekly sync, step by step

1. **Clean tree.** `git status` must be clean on `main`, up to date with the remote.
2. **Move the pin.** `pnpm update-origin latest` (or a branch, or a SHA). The script fetches the commit shallowly into `origin/`, checks it out, stages the gitlink, overwrites every `*.en.*` snapshot whose upstream file changed, and prints removed/renamed upstream files.
3. **Handle removals and renames.** For `renamed: a -> b`, move both files of the pair (`git mv a.md b.md; git mv a.en.md b.en.md`) and run `pnpm status --diff` on it afterwards (the content usually changed too). For `deleted:`, delete the pair. Never leave an orphan snapshot.
4. **Queue.** `pnpm status <lang> --md > /tmp/status-<lang>.md` for each language. Check that `index.html pairs not matching` is 0 and that no file is in `missing snapshot`.
5. **Branch and commit.** `git switch -c sync/<short sha>`; `git add origin i18n`; `git commit -m "sync: update origin to <branch> @ <short sha>"`.
6. **Mechanical class.** `pnpm status <lang> --apply-mechanical all` applies every class-a change (code, link targets, whitespace) and updates the markers; `pnpm check <lang>`; commit as `sync(<lang>): class a`. A file it refuses (line parity broken, token not found) is done by hand.
7. **Prose classes.** Hand b and c files to the `adev-translation` skill (or translators), one commit per class and directory: `translate(<lang>): guide/signals (class b)`.
8. **Deferred.** Class d and new pages that will not make it into this PR are listed in the PR body under "Untranslated or deferred"; open issues for them with the `type:translation` label.
9. **Check.** `pnpm check <lang> --changed --base origin/main` must be green per language.
10. **PR.** Title `sync: update origin to <branch> @ <short sha>`, body = the status reports. Merge with a merge commit.

Scheduled variant: `.github/workflows/sync-upstream.yml` performs steps 2, 4 and 5 and opens the PR; maintainers continue from step 3.
