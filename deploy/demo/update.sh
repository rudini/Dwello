#!/bin/sh
# Updates the demo to the newest main and rebuilds it; does nothing while main is unchanged.
# Cron runs it every 5 minutes (README.md, "Automatic updates").
set -eu
cd "$(dirname "$0")/../.."

# One at a time, and never during the nightly reset (reset-demo.sh takes the same lock)
exec 9>/tmp/dwello-demo.lock
flock -n 9 || exit 0

[ "$(git branch --show-current)" = main ] || { echo "$(date -Is) not on main, no update"; exit 1; }
git fetch -q origin main
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] && exit 0

echo "$(date -Is) updating to $(git log -1 --format='%h %s' origin/main)"
git merge -q --ff-only origin/main
docker compose -f docker-compose.prod.yml -f deploy/demo/docker-compose.yml --env-file deploy/demo/.env up -d --build
docker image prune -f > /dev/null
echo "$(date -Is) done"
