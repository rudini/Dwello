#!/usr/bin/env bash
# History of the structure report: one snapshot per day of `main` (its last first-parent commit before each of the
# last STRUCTURE_DAYS days, none older than that window) and one of HEAD, each measured with today's tools, layers.json and .fallowrc.json, so
# every point uses the same definitions. A commit's snapshot never changes: it is cached in $ARCH_OUT/history/<commit>.json.
# Usage: bun run structure:report (calls this; needs the full Git history, `git fetch --unshallow` in a shallow clone)
set -euo pipefail
cd "$(dirname "$0")/../.."
ROOT_DIR=$PWD
OUT=${ARCH_OUT:?set ARCH_OUT}
REF=${STRUCTURE_REF:-origin/main}
DAYS=${STRUCTURE_DAYS:-60}
SINCE=$(date -d "$DAYS days ago" +%s)
mkdir -p "$OUT/history"

commits=$(
	for d in $(seq "$DAYS" -1 1); do git rev-list --first-parent -1 --before="$d days ago" --since="@$SINCE" "$REF"; done
	git rev-parse HEAD
)
commits=$(printf '%s\n' $commits | awk 'NF && !seen[$0]++')
for f in "$OUT"/history/*.json; do # the report reads every file: drop snapshots that left the window
	if [ -e "$f" ] && ! grep -qx "$(basename "$f" .json)" <<<"$commits"; then rm "$f"; fi
done
for c in $commits; do
	[ -s "$OUT/history/$c.json" ] && continue
	wt=$(mktemp -d)
	snap=$(mktemp -d)
	trap 'git worktree remove --force "$wt" 2>/dev/null; rm -rf "$snap"' EXIT
	git worktree add --detach -q "$wt" "$c"
	ln -s "$ROOT_DIR/node_modules" "$wt/node_modules"
	if [ -d "$wt/backend" ] && [ -d backend/node_modules ]; then ln -s "$ROOT_DIR/backend/node_modules" "$wt/backend/node_modules"; fi
	(cd "$wt" && bunx svelte-kit sync >/dev/null 2>&1) || true # defines $lib for fallow; an old tree may not sync
	ARCH_ROOT=$wt ARCH_OUT=$snap bun tools/arch-baseline/01-map.ts >/dev/null
	ARCH_ROOT=$wt ARCH_OUT=$snap bun tools/arch-baseline/02-imports.ts >/dev/null
	# exits 1 when it has findings; --no-cache: a churn cache can outlive the history it was built from (#1032)
	(cd "$wt" && bunx fallow health --no-cache -c "$ROOT_DIR/.fallowrc.json" --format json >"$snap/fallow-health.json" 2>/dev/null) || true
	ARCH_ROOT=$wt ARCH_OUT=$snap bun tools/arch-baseline/structure.ts --snapshot "$c" "$(git log -1 --format=%cs "$c")" >"$OUT/history/$c.json"
	git worktree remove --force "$wt"
	rm -rf "$snap"
	trap - EXIT
	echo "snapshot $(git log -1 --format='%cs %h' "$c")" >&2
done
