# U1 (docs/architecture/fitness-functions.md): what an update must keep, shared by upgrade-check.sh and
# compose-update-check.sh. Sourced; the caller defines q, which runs psql -At with its arguments on the database.

# The demo data leaves these tables empty, where the check could not see a loss (#782): one row each, written with the
# previous release's columns, so a release that renames one of them needs this fixture changed
fixture() {
	q -q -v ON_ERROR_STOP=1 <<'SQL'
INSERT INTO audit_log (action, details) VALUES ('upgrade-check', '{}');
INSERT INTO invoice_documents (invoice_id, file_name, mime_type, content)
	SELECT id, 'upgrade-check.pdf', 'application/pdf', '' FROM invoices ORDER BY id LIMIT 1;
INSERT INTO ki_settings (mode) VALUES ('none') ON CONFLICT (id) DO NOTHING;
INSERT INTO local_accounts (email, password_hash) VALUES ('upgrade-check@example.invalid', 'not-a-hash');
SQL
}

# rows per table of the schema public, as "table count" lines
counts() {
	q -c "SELECT table_name || ' ' || (xpath('/row/c/text()', query_to_xml(format('SELECT count(*) AS c FROM public.%I', table_name), false, true, '')))[1]::text
		FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY 1"
}

# sum per amount column of the statement tables, as "table.column sum" lines
sums() {
	q -c "SELECT string_agg(format('SELECT %L || '' '' || coalesce(sum(%I), 0) FROM %I', table_name || '.' || column_name, column_name, table_name), ' UNION ALL ' ORDER BY table_name, column_name)
		FROM information_schema.columns WHERE table_schema = 'public' AND data_type = 'numeric' AND table_name LIKE 'utility_statement%'" | q
}

# counts and sums into <dir>/<phase>.txt and <dir>/sums-<phase>.txt; before the update it warns about empty tables
totals() {
	counts >"$1/$2.txt"
	sums >"$1/sums-$2.txt"
	[ "$2" = before ] || return 0
	local empty
	empty=$(awk '$2 == 0 { print $1 }' "$1/before.txt" | paste -sd ' ' -)
	[ -z "$empty" ] || echo "::warning title=Fitness upgrade::U1: the tables $empty are empty before the upgrade, so the check cannot see a loss there. Fill them in the demo data or in the fixture of tools/fitness/data-totals.sh (#782)."
}

# fails when a table of <dir> lost rows or a sum changed between before and after; <tag> names the release in the error
compare_totals() {
	local dir=$1 tag=$2 lost changed
	lost=$(awk 'NR == FNR { after[$1] = $2; next } !($1 in after) || after[$1] < $2 { print $1 " " $2 " -> " ($1 in after ? after[$1] : "dropped") }' "$dir/after.txt" "$dir/before.txt")
	if [ -n "$lost" ]; then
		echo "::error title=Fitness upgrade::U1/AP3 «Kein Update ohne Rückweg»: upgrading from $tag loses data (table rows before -> after): $(echo "$lost" | paste -sd ';' -). Fix: carry the rows over in the migration; an intended removal is the product owner's decision."
		return 1
	fi
	changed=$(awk 'NR == FNR { after[$1] = $2; next } !($1 in after) || after[$1] + 0 != $2 + 0 { print $1 " " $2 " -> " ($1 in after ? after[$1] : "dropped") }' "$dir/sums-after.txt" "$dir/sums-before.txt")
	if [ -n "$changed" ]; then
		echo "::error title=Fitness upgrade::U1/AP3 «Kein Update ohne Rückweg»: upgrading from $tag changes amounts of the statements (sum before -> after): $(echo "$changed" | paste -sd ';' -). Fix: leave the amounts of existing statements as they are; an intended change is the product owner's decision."
		return 1
	fi
}
