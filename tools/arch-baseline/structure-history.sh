#!/usr/bin/env bash
# History of the structure report: one snapshot per day with commits on `main` (its last first-parent commit that day,
# the whole history) and one of HEAD, each measured with today's tools, layers.json and .fallowrc.json, so every point
# uses the same definitions. Snapshots are cached in $ARCH_OUT/history/<commit>.json; a change to those inputs
# (their hash in history/.tools, this script included) drops the cache, so no point keeps an older definition.
# Usage: bun run structure:report (calls this; needs the full Git history, `git fetch --unshallow` in a shallow clone)
set -euo pipefail
cd "$(dirname "$0")/../.."
ROOT_DIR=$PWD
OUT=${ARCH_OUT:?set ARCH_OUT}
REF=${STRUCTURE_REF:-origin/main}
TOOLS=$(cat tools/arch-baseline/*.ts tools/arch-baseline/structure-history.sh tools/arch-baseline/layers.json .fallowrc.json bun.lock | sha256sum | cut -c1-16)
if [ "$(cat "$OUT/history/.tools" 2>/dev/null)" != "$TOOLS" ]; then rm -rf "$OUT/history"; fi
mkdir -p "$OUT/history"
echo "$TOOLS" >"$OUT/history/.tools"

commits=$(
	TZ=UTC git log --first-parent --date=format-local:%F --format='%cd %H' "$REF" | awk '!seen[$1]++ { print $2 }'
	git rev-parse HEAD
)
commits=$(printf '%s\n' $commits | awk 'NF && !seen[$0]++')
for f in "$OUT"/history/*.json; do # the report reads every file: drop snapshots of commits no longer sampled (a later commit that day, an earlier HEAD)
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
	ARCH_ROOT=$wt ARCH_OUT=$snap bun tools/arch-baseline/structure.ts --snapshot "$c" "$(TZ=UTC git log -1 --date=format-local:%FT%TZ --format=%cd "$c")" >"$OUT/history/$c.json"
	git worktree remove --force "$wt"
	rm -rf "$snap"
	trap - EXIT
	echo "snapshot $(git log -1 --format='%cs %h' "$c")" >&2
done
