#!/usr/bin/env bash
# Tags $GITHUB_SHA with the next version and creates its GitHub Release (.github/workflows/release.yml, #173), weekly
# on Monday at 06:00 Swiss time and on a manual run (#935). VERSION set (a manual run): that version, in place of the
# one main's newest commit got on its own.
set -euo pipefail

# SCHEDULE: the cron of a scheduled run; GitHub schedules in UTC only, so one cron is 06:00 in winter (UTC+1), the
# other in summer (UTC+2), and only that one releases
if [ -n "${SCHEDULE:-}" ]; then
  offset=$(TZ=Europe/Zurich date +%z)
  [ "$SCHEDULE" = "0 $((6 - ${offset:2:1})) * * 1" ] || { echo "Not 06:00 in Zurich now, no release"; exit 0; }
fi

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
  # A week without changes on main gets no tag and no images (#935)
  if tag=$(git describe --tags --exact-match --match 'v*' HEAD 2>/dev/null); then
    echo "No changes since $tag, no release"
    exit 0
  fi
  last=$(git describe --tags --abbrev=0 --match 'v*')
  next=$(git log --format=%B%x00 "$last"..HEAD | node "$(dirname "$0")/next-version.mjs" "$last")
fi
gh release create "v$next" --target "$GITHUB_SHA" --title "v$next" --generate-notes
# the version the images of this release are tagged with (#578)
echo "version=$next" >> "${GITHUB_OUTPUT:-/dev/null}"
