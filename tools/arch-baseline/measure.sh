#!/usr/bin/env bash
# Raw data of the structure report for one commit, in a worktree of it: 01-map, 02-imports and fallow health (also
# with coverage gaps), with this checkout's tools and .fallowrc.json, so every commit is measured with the same definitions.
# Usage: tools/arch-baseline/measure.sh <commit> <out>   (structure-history.sh, tools/fitness/fitness.ts --structure)
set -euo pipefail
cd "$(dirname "$0")/../.."
ROOT_DIR=$PWD
out=$2
wt=$(mktemp -d)
trap 'git worktree remove --force "$wt" 2>/dev/null || true' EXIT
git worktree add --detach -q "$wt" "$1"
ln -s "$ROOT_DIR/node_modules" "$wt/node_modules"
if [ -d "$wt/backend" ] && [ -d backend/node_modules ]; then ln -s "$ROOT_DIR/backend/node_modules" "$wt/backend/node_modules"; fi
(cd "$wt" && bunx svelte-kit sync >/dev/null 2>&1) || true # defines $lib for fallow; an old tree may not sync
ARCH_ROOT=$wt ARCH_OUT=$out bun tools/arch-baseline/01-map.ts >/dev/null
ARCH_ROOT=$wt ARCH_OUT=$out bun tools/arch-baseline/02-imports.ts >/dev/null
# exits 1 when it has findings; --no-cache: a churn cache can outlive the history it was built from (#1032)
(cd "$wt" && bunx fallow health --no-cache -c "$ROOT_DIR/.fallowrc.json" --format json >"$out/fallow-health.json" 2>/dev/null) || true
(cd "$wt" && bunx fallow health --no-cache --coverage-gaps -c "$ROOT_DIR/.fallowrc.json" --format json >"$out/fallow-gaps.json" 2>/dev/null) || true
