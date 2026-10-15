#!/usr/bin/env bash
set -euo pipefail

# Blocks Claude Code git commit and git push when deepcheck's changed-scope gate fails
# (tools/deepcheck, `bun run deepcheck:audit`), the same way fallow-gate.sh gates on fallow audit.
# Exit 2 blocks the Bash call and shows stderr to Claude. Tool errors (deepcheck exit 2) and a
# missing jq or node fail open with a single stderr notice so skips stay visible.

if ! command -v jq >/dev/null 2>&1; then
  echo "deepcheck-gate: jq not on PATH, skipping deepcheck." >&2
  exit 0
fi

INPUT="$(cat)"
if ! CMD="$(jq -r '.tool_input.command // empty' <<<"$INPUT" 2>/dev/null)"; then
  echo "deepcheck-gate: hook input is not JSON, skipping deepcheck." >&2
  exit 0
fi

if ! printf '%s\n' "$CMD" | grep -Eq '(^|[[:space:];|&()])git[[:space:]]+(commit|push)([[:space:]]|$)'; then
  exit 0
fi

if ! command -v node >/dev/null 2>&1; then
  echo "deepcheck-gate: node not on PATH, skipping deepcheck." >&2
  exit 0
fi

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
CLI="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/tools/deepcheck/src/cli.ts"

# A commit is judged against HEAD (working tree included); a push against the upstream (else origin/HEAD,
# else origin/main), so commits not pushed yet are covered even when the tree is clean (like fallow audit).
ARGS=(check --agent)
if printf '%s\n' "$CMD" | grep -Eq '(^|[[:space:];|&()])git[[:space:]]+push([[:space:]]|$)'; then
  BASE="$(cd "$ROOT" && { git merge-base HEAD '@{u}' 2>/dev/null || git merge-base HEAD origin/HEAD 2>/dev/null ||
    git merge-base HEAD origin/main 2>/dev/null || true; })"
  if [ -n "$BASE" ]; then
    ARGS+=(--changed-since "$BASE")
  else
    echo "deepcheck-gate: no upstream, origin/HEAD or origin/main; push judged against HEAD only." >&2
  fi
fi

TMP_OUT="$(mktemp)"
TMP_ERR="$(mktemp)"
cleanup() {
  rm -f "$TMP_OUT" "$TMP_ERR"
}
trap cleanup EXIT

if (cd "$ROOT" && node "$CLI" "${ARGS[@]}") >"$TMP_OUT" 2>"$TMP_ERR"; then
  STATUS=0
else
  STATUS=$?
fi

# Only a gate verdict blocks; a crash (e.g. dependencies not installed) also exits 1 but has no verdict.
if [ "$STATUS" -eq 1 ] && grep -q 'fail the deep-module gate' "$TMP_OUT"; then
  {
    echo "deepcheck-gate: blocked: changed modules fail the deep-module gate. Fix the design before committing or pushing"
    echo "deepcheck-gate: (details: bun run deepcheck:audit; deliberate exception: // deepcheck-ignore-file -- reason)."
    echo "deepcheck-gate: nothing in this command ran, edits and git add before the commit included."
    cat "$TMP_OUT"
  } >&2
  exit 2
fi

if [ "$STATUS" -ne 0 ]; then
  REASON="$(grep -m1 -E '^(deepcheck: |[A-Za-z]*Error)' "$TMP_ERR" || sed -n '1p' "$TMP_ERR")"
  echo "deepcheck-gate: deepcheck error (${REASON#deepcheck: }), skipping." >&2
  exit 0
fi

exit 0
