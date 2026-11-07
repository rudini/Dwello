#!/bin/sh
# Updates the demo to the newest version tag on main and rebuilds it; does nothing while the last successful build is it.
# Cron runs it every 5 minutes (README.md, "Automatic updates").
set -eu
cd "$(dirname "$0")/../.."

# One at a time, and never during the nightly reset (reset-demo.sh takes the same lock)
exec 9>.git/demo.lock
flock -n 9 || exit 0

[ "$(git branch --show-current)" = main ] || { echo "$(date -Is) not on main, no update"; exit 1; }
# Tags pruned: a version set by hand replaces the tag of main on GitHub (tools/release/release.sh), so drop the old one here
git fetch -q --prune origin main '+refs/tags/*:refs/tags/*'
# Only a tagged commit, so the footer shows a clean version: the release workflow tags main weekly, Monday 06:00 Swiss
# time (#935); the newest tag on main, so a merge right after the release does not hold it back (#1184)
version=$(git describe --tags --abbrev=0 --match 'v*' origin/main 2>/dev/null) || { echo "$(date -Is) main not tagged yet, no update"; exit 0; }
# The commit and version of the last successful build: a failed build is tried again on the next run
[ "$(git rev-parse "$version^{commit}") $version" = "$(cat .git/demo-deployed 2>/dev/null)" ] && exit 0

echo "$(date -Is) updating to $version, $(git log -1 --format='%h %s' "$version")"
# reset, not merge: a clone pulled by hand past the tag goes back to it too; --keep refuses local changes it would lose
git reset -q --keep "$version"
APP_VERSION=$version docker compose -f docker-compose.prod.yml -f deploy/demo/docker-compose.yml --env-file deploy/demo/.env up -d --build
echo "$(git rev-parse "$version^{commit}") $version" > .git/demo-deployed
docker image prune -f > /dev/null
echo "$(date -Is) done"
