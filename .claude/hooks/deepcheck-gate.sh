#!/usr/bin/env bash
set -euo pipefail

# Blocks Claude Code git commit and git push when deepcheck's changed-scope gate fails
# (tools/deepcheck, `npm run deepcheck:audit`), the same way fallow-gate.sh gates on fallow audit.
# Exit 2 blocks the Bash call and shows stderr to Claude. Tool errors (deepcheck exit 2) and a
# missing jq or node fail open with a single stderr notice so skips stay visible.

if ! command -v jq >/dev/null 2>&1; then
  echo "deepcheck-gate: jq not on PATH, skipping deepcheck." >&2
  exit 0
fi

INPUT="$(cat)"
CMD="$(jq -r '.tool_input.command // empty' <<<"$INPUT")"

if ! printf '%s\n' "$CMD" | grep -Eq '(^|[[:space:];|&()])git[[:space:]]+(commit|push)([[:space:]]|$)'; then
  exit 0
fi

if ! command -v node >/dev/null 2>&1; then
  echo "deepcheck-gate: node not on PATH, skipping deepcheck." >&2
  exit 0
fi

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
CLI="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/tools/deepcheck/src/cli.ts"

TMP_OUT="$(mktemp)"
TMP_ERR="$(mktemp)"
cleanup() {
  rm -f "$TMP_OUT" "$TMP_ERR"
}
trap cleanup EXIT

if (cd "$ROOT" && node "$CLI" check --agent) >"$TMP_OUT" 2>"$TMP_ERR"; then
  STATUS=0
else
  STATUS=$?
fi

if [ "$STATUS" -eq 1 ]; then
  {
    echo "deepcheck-gate: blocked: changed modules fail the deep-module gate. Fix the design before committing"
    echo "deepcheck-gate: (details: npm run deepcheck:audit; deliberate exception: // deepcheck-ignore-file -- reason)."
    cat "$TMP_OUT"
  } >&2
  exit 2
fi

if [ "$STATUS" -ne 0 ]; then
  echo "deepcheck-gate: deepcheck error ($(sed -n '1p' "$TMP_ERR" | sed 's/^deepcheck: //')), skipping." >&2
  exit 0
fi

exit 0
