#!/bin/sh
# Resets the demo to the demo data: recreates the database from the migrations, then loads the demo data.
# Every visitor shares the same data; the nightly cron job (README.md) undoes their changes.
set -eu
cd "$(dirname "$0")/../.."
compose() { docker compose -f docker-compose.prod.yml -f deploy/demo/docker-compose.yml --env-file deploy/demo/.env "$@"; }

# Waits while update.sh rebuilds the app (same lock)
exec 9>.git/demo.lock
flock 9

# The backend's pool does not survive its database being dropped: stop it for the reset
compose stop backend
trap 'compose start backend' EXIT
trap 'exit 1' INT TERM
compose run --rm --no-deps backend sh -c 'export DATABASE_URL=postgresql://dwello:$(cat /run/dwello/db_password)@postgres:5432/dwello && bun scripts/e2e-db.ts && bun scripts/demo-data.ts'
