#!/usr/bin/env bash
# Tags $GITHUB_SHA with the next version and creates its GitHub Release (.github/workflows/release.yml, issue #173).
# VERSION set (a manual run): that version, in place of the one the commit got on its own.
set -euo pipefail

if [ -n "${VERSION:-}" ]; then
  [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "::error::Version must read like 1.0.0, got $VERSION"; exit 1; }
  ! git rev-parse -q --verify "refs/tags/v$VERSION" > /dev/null || { echo "::error::v$VERSION exists already"; exit 1; }
  # Replaces the version this merge got on its own: with two tags on one commit git describe may name the old one
  for tag in $(git tag --points-at HEAD --list 'v*'); do
    gh release delete "$tag" --yes || true
    git push origin ":refs/tags/$tag"
  done
  next=$VERSION
else
  # A merge already tagged (a re-run) keeps its version
  git describe --tags --exact-match --match 'v*' HEAD 2>/dev/null && exit 0
  last=$(git describe --tags --abbrev=0 --match 'v*')
  next=$(git log --format=%B%x00 "$last"..HEAD | node "$(dirname "$0")/next-version.mjs" "$last")
fi
gh release create "v$next" --target "$GITHUB_SHA" --title "v$next" --generate-notes
