#!/bin/sh
# Updates the demo to the newest main and rebuilds it; does nothing while the last successful build is main.
# Cron runs it every 5 minutes (README.md, "Automatic updates").
set -eu
cd "$(dirname "$0")/../.."

# One at a time, and never during the nightly reset (reset-demo.sh takes the same lock)
exec 9>.git/demo.lock
flock -n 9 || exit 0

[ "$(git branch --show-current)" = main ] || { echo "$(date -Is) not on main, no update"; exit 1; }
git fetch -q --tags origin main
# Only a tagged main, so the footer shows a clean version: the release workflow tags it seconds after the merge
git describe --tags --exact-match --match 'v*' origin/main > /dev/null 2>&1 || { echo "$(date -Is) main not tagged yet, no update"; exit 0; }
# The commit of the last successful build: a failed build is tried again on the next run
[ "$(git rev-parse origin/main)" = "$(cat .git/demo-deployed 2>/dev/null)" ] && exit 0

echo "$(date -Is) updating to $(git log -1 --format='%h %s' origin/main)"
git merge -q --ff-only origin/main
APP_VERSION=$(git describe --tags --match 'v*') docker compose -f docker-compose.prod.yml -f deploy/demo/docker-compose.yml --env-file deploy/demo/.env up -d --build
git rev-parse HEAD > .git/demo-deployed
docker image prune -f > /dev/null
echo "$(date -Is) done"
