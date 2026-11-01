#!/usr/bin/env bash
set -euo pipefail

# Blocks Claude Code git commit and git push when testcheck's changed-scope gate fails (tools/testcheck,
# `bun run testcheck:audit`), the same way deepcheck-gate.sh gates on deepcheck. Exit 2 blocks the Bash call and
# shows stderr to Claude. Tool errors (testcheck exit 2) and a missing jq or node fail open with a single notice.

if ! command -v jq >/dev/null 2>&1; then
  echo "testcheck-gate: jq not on PATH, skipping testcheck." >&2
  exit 0
fi

INPUT="$(cat)"
if ! CMD="$(jq -r '.tool_input.command // empty' <<<"$INPUT" 2>/dev/null)"; then
  echo "testcheck-gate: hook input is not JSON, skipping testcheck." >&2
  exit 0
fi

case "$CMD" in *commit* | *push*) ;; *) exit 0 ;; esac

if ! command -v node >/dev/null 2>&1; then
  echo "testcheck-gate: node not on PATH, skipping testcheck." >&2
  exit 0
fi

# the git calls the command makes, by the matcher the commit gates share (git-calls.mjs, #710)
VERBS="$(node "$(dirname "${BASH_SOURCE[0]}")/git-calls.mjs" <<<"$INPUT" 2>/dev/null || true)"
if ! grep -qxE 'commit|push' <<<"$VERBS"; then
  exit 0
fi

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
CLI="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/tools/testcheck/src/cli.ts"

# A commit is judged against HEAD (working tree included); a push against the upstream (else origin/HEAD, else origin/main)
ARGS=(check --agent)
if grep -qx push <<<"$VERBS"; then
  BASE="$(cd "$ROOT" && { git merge-base HEAD '@{u}' 2>/dev/null || git merge-base HEAD origin/HEAD 2>/dev/null ||
    git merge-base HEAD origin/main 2>/dev/null || true; })"
  if [ -n "$BASE" ]; then
    ARGS+=(--changed-since "$BASE")
  else
    echo "testcheck-gate: no upstream, origin/HEAD or origin/main; push judged against HEAD only." >&2
  fi
fi

TMP_OUT="$(mktemp)"
TMP_ERR="$(mktemp)"
trap 'rm -f "$TMP_OUT" "$TMP_ERR"' EXIT

if (cd "$ROOT" && node "$CLI" "${ARGS[@]}") >"$TMP_OUT" 2>"$TMP_ERR"; then
  STATUS=0
else
  STATUS=$?
fi

# Only a gate verdict blocks; a crash also exits 1 but has no verdict
if [ "$STATUS" -eq 1 ] && grep -Eq '^testcheck: [0-9]+ findings? fails? the test gate' "$TMP_OUT"; then
  {
    echo "testcheck-gate: blocked: changed tests fail the test gate (details: bun run testcheck:audit)."
    echo "testcheck-gate: nothing in this command ran, edits and git add before the git call included."
    cat "$TMP_OUT"
  } >&2
  exit 2
fi

if [ "$STATUS" -ne 0 ]; then
  REASON="$(grep -m1 -E '^(testcheck: |[A-Za-z]*Error)' "$TMP_ERR" || sed -n '1p' "$TMP_ERR")"
  echo "testcheck-gate: testcheck error (${REASON#testcheck: }), skipping." >&2
  exit 0
fi

exit 0
