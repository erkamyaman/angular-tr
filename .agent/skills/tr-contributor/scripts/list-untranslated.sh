#!/usr/bin/env bash
# Lists pages under adev/src/content that still need translation work.
#   1. Untranslated: the .md file is identical to the English original.
#   2. Partial: translated pages that still contain English headings.
# Usage: scripts/list-untranslated.sh   (run from anywhere inside the repo)
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

git remote get-url upstream >/dev/null 2>&1 || git remote add upstream https://github.com/angular/angular.git

base=""
for sha in $(git log --format=%s -n 200 | grep -oE '\(([0-9a-f]{10,40})\)' | tr -d '()'); do
  git cat-file -e "$sha^{commit}" 2>/dev/null || git fetch --quiet upstream "$sha" 2>/dev/null || true
  if git cat-file -e "$sha^{commit}" 2>/dev/null; then base="$sha"; break; fi
done
if [ -z "$base" ]; then
  git fetch --quiet upstream main
  base=upstream/main
fi
echo "English reference: $base"

headings() { grep -E '^#{1,6} ' | sed -E 's/ *\{#[^}]*\}$//' | sort -u; }

untranslated=()
partial=()
while IFS= read -r f; do
  orig=$(git rev-parse -q --verify "$base:$f" 2>/dev/null || true)
  [ -z "$orig" ] && continue
  if [ "$orig" = "$(git rev-parse "HEAD:$f" 2>/dev/null || git hash-object "$f")" ]; then
    untranslated+=("$f")
    continue
  fi
  n=$(comm -12 <(git show "$base:$f" | headings) <(headings < "$f") | wc -l | tr -d ' ')
  [ "$n" -gt 0 ] && partial+=("$n $f")
done < <(git ls-files 'adev/src/content/*.md' 'adev/src/content/**/*.md')

echo
echo "== Untranslated pages (${#untranslated[@]}) =="
printf '%s\n' "${untranslated[@]:-}"
echo
echo "== Translated pages with English headings left (count, file) =="
printf '%s\n' "${partial[@]:-}" | sort -rn | head -40
