#!/usr/bin/env bash
# U1 fitness function (docs/architecture/fitness-functions.md): an update keeps the landlord's data. Loads the demo
# data with the previous release's backend, migrates with this checkout's backend and fails when a migration fails,
# a table lost rows or an amount of the statements changed (#782: row counts do not see changed amounts); then R1 (#718):
# a Sicherung of that data restores with this checkout (tools/fitness/restore-check.ts).
# Usage: tools/fitness/upgrade-check.sh [tag]   (default: the newest v* tag before HEAD; needs the tags and psql)
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
# The demo data leaves these tables empty, where the check could not see a loss (#782): one row each, written with the
# previous release's columns, so a release that renames one of them needs this fixture changed
psql -d "$DB" -qv ON_ERROR_STOP=1 <<'SQL'
INSERT INTO audit_log (action, details) VALUES ('upgrade-check', '{}');
INSERT INTO invoice_documents (invoice_id, file_name, mime_type, content)
	SELECT id, 'upgrade-check.pdf', 'application/pdf', '' FROM invoices ORDER BY id LIMIT 1;
INSERT INTO ki_settings (mode) VALUES ('none') ON CONFLICT (id) DO NOTHING;
INSERT INTO local_accounts (email, password_hash) VALUES ('upgrade-check@example.invalid', 'not-a-hash');
SQL

# rows per table of the schema public, as "table count" lines
counts() {
	psql -d "$DB" -Atc "SELECT table_name || ' ' || (xpath('/row/c/text()', query_to_xml(format('SELECT count(*) AS c FROM public.%I', table_name), false, true, '')))[1]::text
		FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY 1"
}
# sum per amount column of the statement tables, as "table.column sum" lines
sums() {
	psql -d "$DB" -Atc "SELECT string_agg(format('SELECT %L || '' '' || coalesce(sum(%I), 0) FROM %I', table_name || '.' || column_name, column_name, table_name), ' UNION ALL ' ORDER BY table_name, column_name)
		FROM information_schema.columns WHERE table_schema = 'public' AND data_type = 'numeric' AND table_name LIKE 'utility_statement%'" | psql -d "$DB" -At
}
counts >"$OLD/before.txt"
empty=$(awk '$2 == 0 { print $1 }' "$OLD/before.txt" | paste -sd ' ' -)
[ -z "$empty" ] || echo "::warning title=Fitness upgrade::U1: the tables $empty are empty before the upgrade, so the check cannot see a loss there. Fill them in the demo data or in the fixture of tools/fitness/upgrade-check.sh (#782)."
sums >"$OLD/sums-before.txt"
# R1 (#718): the Sicherung of the previous release's data, before the migration; a release without one is backed up after it
if [ -f "$OLD/backend/src/services/backup.service.ts" ]; then bun tools/fitness/restore-check.ts backup "$OLD/backend"; fi
if ! bun backend/scripts/migrate.ts; then
	echo "::error title=Fitness upgrade::U1/AP3 «Kein Update ohne Rückweg»: the migrations of this checkout fail on the data of $TAG. Fix: make the migration work on existing rows (defaults, backfill before NOT NULL), never only on an empty database."
	exit 1
fi
counts >"$OLD/after.txt"
sums >"$OLD/sums-after.txt"

lost=$(awk 'NR == FNR { after[$1] = $2; next } !($1 in after) || after[$1] < $2 { print $1 " " $2 " -> " ($1 in after ? after[$1] : "dropped") }' "$OLD/after.txt" "$OLD/before.txt")
if [ -n "$lost" ]; then
	echo "::error title=Fitness upgrade::U1/AP3 «Kein Update ohne Rückweg»: upgrading from $TAG loses data (table rows before -> after): $(echo "$lost" | paste -sd ';' -). Fix: carry the rows over in the migration; an intended removal is the product owner's decision."
	exit 1
fi
changed=$(awk 'NR == FNR { after[$1] = $2; next } !($1 in after) || after[$1] + 0 != $2 + 0 { print $1 " " $2 " -> " ($1 in after ? after[$1] : "dropped") }' "$OLD/sums-after.txt" "$OLD/sums-before.txt")
if [ -n "$changed" ]; then
	echo "::error title=Fitness upgrade::U1/AP3 «Kein Update ohne Rückweg»: upgrading from $TAG changes amounts of the statements (sum before -> after): $(echo "$changed" | paste -sd ';' -). Fix: leave the amounts of existing statements as they are; an intended change is the product owner's decision."
	exit 1
fi
[ -f "$OLD/backend/src/services/backup.service.ts" ] || bun tools/fitness/restore-check.ts backup "$PWD/backend"
bun tools/fitness/restore-check.ts restore
echo "Fitness: upgrade $TAG -> HEAD with demo data: migrations pass, no table lost rows, statement amounts unchanged ($(wc -l <"$OLD/sums-before.txt") sums, $(wc -l <"$OLD/before.txt") tables, $(($(date +%s) - start)) s)"
