#!/usr/bin/env bash
# U1 fitness function (docs/architecture/fitness-functions.md, #997): the update as the landlord runs it. Starts the last
# release's compose.yaml with its images and the demo data, confirms a Wiederherstellungscode, then the images under test
# with the same compose.yaml, which the landlord keeps (docker compose up -d, docs/installation.md), and fails when a service does not become healthy, no
# Sicherung was made before the migrations, a table lost rows or an amount of the statements changed.
# Usage: tools/fitness/compose-update-check.sh [--broken] <image tag under test> [release tag]
#   release tag: default the newest v* tag before HEAD (the last weekly release, #935), its images pulled from ghcr.io
#   --broken: the negative test; adds a failing migration to the backend image and expects the update to stop with the
#   migration's cause from the log and the Sicherung made before it
set -euo pipefail
repo=$(cd "$(dirname "$0")/../.." && pwd)
broken=
if [ "${1:-}" = --broken ]; then broken=1 && shift; fi
NEW=$1
TAG=${2:-$(git -C "$repo" describe --tags --abbrev=0 --match 'v*' HEAD^)}
BAD=9999_compose_update_check_broken.sql
if [ -n "$broken" ]; then
	printf 'FROM ghcr.io/rudini/dwello-backend:%s\nRUN echo "SELECT 1 / 0;" > migrations/%s\n' "$NEW" "$BAD" |
		docker build --quiet --tag "ghcr.io/rudini/dwello-backend:$NEW-broken" - >/dev/null
	docker tag "ghcr.io/rudini/dwello-frontend:$NEW" "ghcr.io/rudini/dwello-frontend:$NEW-broken"
	NEW=$NEW-broken
fi
start=$(date +%s)
dir=$(mktemp -d)
cd "$dir"
# the folder of the Sicherung belongs to the backend's user (1000), which the caller may not be
trap 'docker compose down --volumes >/dev/null 2>&1; docker run --rm -v "$dir:/d" alpine:3.20 rm -rf /d/backups; rm -rf "$dir"' EXIT

q() { docker compose exec -T postgres psql -U dwello -d dwello -At "$@"; }
# a command in the running backend, on the installation's database
in_backend() {
	docker compose exec -T backend sh -c "export DATABASE_URL=postgresql://dwello:\$(cat /run/dwello/db_password)@postgres:5432/dwello && $1"
}
# the web app with what it needs, as docs/installation.md starts it; the landlord's «docker compose pull» is part of it,
# since up pulls the images it does not have (those under test are built, not published)
up() {
	if DWELLO_VERSION=$1 docker compose up --detach --wait --wait-timeout 300 frontend >up.log 2>&1; then return 0; fi
	cat up.log
	cause=$(docker compose logs --no-log-prefix backend 2>&1 | grep -m1 'error:' || true)
	return 1
}
source "$repo/tools/fitness/data-totals.sh"

git -C "$repo" show "$TAG:compose.yaml" >compose.yaml
# the tag comes before the job «Images» of release.yml pushes its images
image=ghcr.io/rudini/dwello-backend:${TAG#v}
if ! docker image inspect "$image" "${image/backend/frontend}" >/dev/null 2>&1 && ! DWELLO_VERSION=${TAG#v} docker compose pull --quiet backend frontend; then
	echo "::error title=Fitness compose update::U1: the images of the release $TAG are not on ghcr.io; the job «Images» of release.yml has not pushed them (yet). Re-run once it has."
	exit 1
fi
if ! up "${TAG#v}"; then
	docker compose logs
	echo "::error title=Fitness compose update::U1: the release $TAG does not start from its compose.yaml. ${cause:-}"
	exit 1
fi
in_backend 'bun scripts/demo-data.ts' >/dev/null
fixture
# what «Sicherung einrichten» does (#718); the confirmation without BACKUP_DIR leaves the first Sicherung to the update
in_backend 'bun -e "const b = await import(\"./src/services/backup.service.ts\"); const { code } = await b.backupSetup(); delete process.env.BACKUP_DIR; await b.confirmBackupCode(code); process.exit(0)"'
totals "$dir" before
since=$(q -c 'SELECT now()')

migrated=$(q -c "SELECT count(*) FROM schema_migrations")
if up "$NEW"; then updated=1; else updated=; fi
if [ -n "$broken" ]; then
	if [ -n "$updated" ]; then
		echo "::error title=Fitness compose update::U1: the update with the failing migration $BAD became healthy; a failed migration must stop the backend."
		exit 1
	fi
	if [[ "${cause:-}" != *"$BAD"* ]]; then
		echo "::error title=Fitness compose update::U1: the backend log does not name the failing migration $BAD in its first error line (${cause:-none}); the landlord would not see the cause (#782)."
		exit 1
	fi
	if [ "$(q -c "SELECT count(*) FROM backup_runs WHERE started_at >= '$since' AND finished_at IS NOT NULL AND error IS NULL")" = 0 ]; then
		echo "::error title=Fitness compose update::U1/R1: no Sicherung before the failing migration (#718)."
		exit 1
	fi
	echo "Fitness: update $TAG -> $NEW with a failing migration stops with its cause («$cause») after a Sicherung ($(($(date +%s) - start)) s)"
	exit 0
fi
if [ -z "$updated" ]; then
	docker compose ps --all
	docker compose logs backend frontend
	echo "::error title=Fitness compose update::U1: after docker compose up -d from $TAG to the images of this change not every service becomes healthy. ${cause:-See the logs above.}"
	exit 1
fi
curl --fail --silent --show-error http://localhost:3000/health >/dev/null
applied=$(($(q -c "SELECT count(*) FROM schema_migrations") - migrated))
if [ "$applied" -gt 0 ] && [ "$(q -c "SELECT count(*) FROM backup_runs WHERE finished_at IS NOT NULL AND error IS NULL AND finished_at <= (SELECT min(applied_at) FROM schema_migrations WHERE applied_at >= '$since')")" = 0 ]; then
	echo "::error title=Fitness compose update::U1/R1: the update applied $applied migrations without a Sicherung before them (#718)."
	exit 1
fi
totals "$dir" after
compare_totals "$dir" "$TAG"
sicherung=$([ "$applied" -gt 0 ] && echo "$applied migrations after a Sicherung" || echo "no migration since $TAG, so no Sicherung before one")
echo "Fitness: docker compose up -d from $TAG to $NEW: every service healthy, $sicherung, no table lost rows, statement amounts unchanged ($(wc -l <sums-before.txt) sums, $(wc -l <before.txt) tables, $(($(date +%s) - start)) s)"
