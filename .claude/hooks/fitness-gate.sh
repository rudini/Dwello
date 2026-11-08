#!/usr/bin/env bash
set -euo pipefail

# Blocks a Claude Code git commit that changes src/, backend/src/ or tools/fitness/ when the architecture fitness
# check (tools/fitness, `bun run fitness -- --base origin/main`, as CI runs it) reports an error, so a slice meets
# the ratchet when it is committed, not after its review (workflow-rules-review-2026-11-07.md, 1). A push is left
# to CI. A missing jq, node or bun, or a run without its summary line, passes with a notice.

if ! command -v jq >/dev/null 2>&1; then
  echo "fitness-gate: jq not on PATH, skipping fitness." >&2
  exit 0
fi

INPUT="$(cat)"
CMD="$(jq -r '.tool_input.command // empty' <<<"$INPUT" 2>/dev/null || true)"
case "$CMD" in *commit*) ;; *) exit 0 ;; esac

# the git calls the command makes, by the matcher the commit gates share (git-calls.mjs, #710)
if ! VERBS="$(node "$(dirname "${BASH_SOURCE[0]}")/git-calls.mjs" <<<"$INPUT" 2>/dev/null)"; then
  echo "fitness-gate: git-calls.mjs failed, skipping fitness." >&2
  exit 0
fi
grep -qx commit <<<"$VERBS" || exit 0

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$ROOT"
git status --porcelain | cut -c4- | grep -qE '^(src|backend/src|tools/fitness)/' || exit 0

if ! command -v bun >/dev/null 2>&1; then
  echo "fitness-gate: bun not on PATH, skipping fitness." >&2
  exit 0
fi

ARGS=()
git rev-parse -q --verify origin/main >/dev/null && ARGS=(--base origin/main)
OUT="$(bun tools/fitness/fitness.ts "${ARGS[@]}" 2>&1 || true)"

if grep -qE '^Fitness: [1-9][0-9]* errors' <<<"$OUT"; then
  {
    echo "fitness-gate: blocked: the architecture fitness check reports errors (docs/architecture/fitness-functions.md)."
    echo "fitness-gate: nothing in this command ran, edits and git add before the git call included."
    grep -E '^error ' <<<"$OUT"
  } >&2
  exit 2
fi
if ! grep -qE '^Fitness: 0 errors' <<<"$OUT"; then
  echo "fitness-gate: fitness did not finish ($(tail -n 1 <<<"$OUT")), skipping." >&2
fi
exit 0
