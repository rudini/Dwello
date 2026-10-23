#!/usr/bin/env bash
# U1 fitness function (docs/architecture/fitness-functions.md): an update keeps the landlord's data. Loads the demo
# data with the previous release's backend, migrates with this checkout's backend and fails when a migration fails or
# a table lost rows.
# Usage: tools/fitness/upgrade-check.sh [tag]   (default: the newest v* tag before HEAD; needs the tags and psql)
# PostgreSQL: PGHOST/PGUSER/PGPASSWORD (default localhost, dwello, dwello); the database dwello_upgrade is recreated.
set -euo pipefail
cd "$(dirname "$0")/../.."
export PGHOST=${PGHOST:-localhost} PGUSER=${PGUSER:-dwello} PGPASSWORD=${PGPASSWORD:-dwello}
TAG=${1:-$(git describe --tags --abbrev=0 --match 'v*' HEAD^)}
DB=dwello_upgrade
export DATABASE_URL="postgresql://$PGUSER:$PGPASSWORD@$PGHOST:5432/$DB"
OLD=$(mktemp -d)
trap 'git worktree remove --force "$OLD"' EXIT
start=$(date +%s)

git worktree add --detach --force "$OLD" "$TAG" >/dev/null
(cd "$OLD/backend" && bun install --frozen-lockfile >/dev/null)
psql -d postgres -qc "DROP DATABASE IF EXISTS $DB WITH (FORCE)" -c "CREATE DATABASE $DB"
bun "$OLD/backend/scripts/demo-data.ts" >/dev/null

# rows per table of the schema public, as "table count" lines
counts() {
	psql -d "$DB" -Atc "SELECT table_name || ' ' || (xpath('/row/c/text()', query_to_xml(format('SELECT count(*) AS c FROM public.%I', table_name), false, true, '')))[1]::text
		FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY 1"
}
counts >"$OLD/before.txt"
if ! bun backend/scripts/migrate.ts; then
	echo "::error title=Fitness upgrade::U1/AP3 «Kein Update ohne Rückweg»: the migrations of this checkout fail on the data of $TAG. Fix: make the migration work on existing rows (defaults, backfill before NOT NULL), never only on an empty database."
	exit 1
fi
counts >"$OLD/after.txt"

lost=$(awk 'NR == FNR { after[$1] = $2; next } !($1 in after) || after[$1] < $2 { print $1 " " $2 " -> " ($1 in after ? after[$1] : "dropped") }' "$OLD/after.txt" "$OLD/before.txt")
if [ -n "$lost" ]; then
	echo "::error title=Fitness upgrade::U1/AP3 «Kein Update ohne Rückweg»: upgrading from $TAG loses data (table rows before -> after): $(echo "$lost" | paste -sd ';' -). Fix: carry the rows over in the migration; an intended removal is the product owner's decision."
	exit 1
fi
echo "Fitness: upgrade $TAG -> HEAD with demo data: migrations pass, no table lost rows ($(wc -l <"$OLD/before.txt") tables, $(($(date +%s) - start)) s)"
