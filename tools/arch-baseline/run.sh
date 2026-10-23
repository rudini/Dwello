#!/usr/bin/env bash
# Architecture baseline (phase 0): re-runs every measurement of docs/architecture/baseline.md.
# Usage: tools/arch-baseline/run.sh   (from anywhere; needs bun, node, git with full history)
# Window and base: ARCH_SINCE=2026-04-23 ARCH_BASE=origin/main (see lib.ts).
# Coupling thresholds: ARCH_MIN_SHARED=5 ARCH_MIN_DEGREE=0.3 ARCH_MAX_TX=50.
set -euo pipefail
cd "$(dirname "$0")/../.."
OUT=tools/arch-baseline/out
mkdir -p "$OUT"

if [ "$(git rev-parse --is-shallow-repository)" = "true" ]; then
	echo "shallow clone: fetching full history" >&2
	git fetch --unshallow origin
fi

bunx svelte-kit sync >/dev/null # .svelte-kit/tsconfig.json defines $lib for fallow and deepcheck
bunx fallow health --format json >"$OUT/fallow-health.json" 2>/dev/null || true # exits 1 when it has findings
bunx fallow dupes --format json >"$OUT/fallow-dupes.json" 2>/dev/null || true
bunx fallow dead-code --format json >"$OUT/fallow-deadcode.json" 2>/dev/null || true
node tools/deepcheck/src/cli.ts scan --format json --top 200 --output "$OUT/deepcheck-scan.json" >/dev/null

for s in 01-map 02-imports 03-history 04-metrics 05-knowledge 06-examples 07-tables; do
	echo "== $s"
	bun "tools/arch-baseline/$s.ts"
done
