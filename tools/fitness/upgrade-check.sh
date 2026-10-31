#!/usr/bin/env bash
# U1 fitness function (docs/architecture/fitness-functions.md): an update keeps the landlord's data. Loads the demo
# data with the previous release's backend, migrates with this checkout's backend and fails when a migration fails,
# a table lost rows or an amount of the statements changed (#782: row counts do not see changed amounts); then R1 (#718):
# a Sicherung of that data restores with this checkout (tools/fitness/restore-check.ts).
# Usage: tools/fitness/upgrade-check.sh [tag]   (default: the newest v* tag before HEAD, the last weekly release, #935;
# needs the tags and psql)
# PostgreSQL: PGHOST/PGUSER/PGPASSWORD (default localhost, dwello, dwello); the database dwello_upgrade is recreated.
set -euo pipefail
cd "$(dirname "$0")/../.."
export PGHOST=${PGHOST:-localhost} PGUSER=${PGUSER:-dwello} PGPASSWORD=${PGPASSWORD:-dwello}
TAG=${1:-$(git describe --tags --abbrev=0 --match 'v*' HEAD^)}
DB=dwello_upgrade
export DATABASE_URL="postgresql://$PGUSER:$PGPASSWORD@$PGHOST:5432/$DB"
OLD=$(mktemp -d)
export RESTORE_CHECK_DIR=$(mktemp -d)
trap 'git worktree remove --force "$OLD"; rm -rf "$RESTORE_CHECK_DIR"' EXIT
start=$(date +%s)

git worktree add --detach --force "$OLD" "$TAG" >/dev/null
(cd "$OLD/backend" && bun install --frozen-lockfile >/dev/null)
psql -d postgres -qc "DROP DATABASE IF EXISTS $DB WITH (FORCE)" -c "CREATE DATABASE $DB"
bun "$OLD/backend/scripts/demo-data.ts" >/dev/null
q() { psql -d "$DB" -At "$@"; }
source tools/fitness/data-totals.sh
fixture
totals "$OLD" before
# R1 (#718): the Sicherung of the previous release's data, before the migration; a release without one is backed up after it
if [ -f "$OLD/backend/src/services/backup.service.ts" ]; then bun tools/fitness/restore-check.ts backup "$OLD/backend"; fi
if ! bun backend/scripts/migrate.ts; then
	echo "::error title=Fitness upgrade::U1/AP3 «Kein Update ohne Rückweg»: the migrations of this checkout fail on the data of $TAG. Fix: make the migration work on existing rows (defaults, backfill before NOT NULL), never only on an empty database."
	exit 1
fi
totals "$OLD" after
compare_totals "$OLD" "$TAG"
[ -f "$OLD/backend/src/services/backup.service.ts" ] || bun tools/fitness/restore-check.ts backup "$PWD/backend"
bun tools/fitness/restore-check.ts restore
echo "Fitness: upgrade $TAG -> HEAD with demo data: migrations pass, no table lost rows, statement amounts unchanged ($(wc -l <"$OLD/sums-before.txt") sums, $(wc -l <"$OLD/before.txt") tables, $(($(date +%s) - start)) s)"
