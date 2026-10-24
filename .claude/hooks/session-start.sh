#!/bin/bash
# Cloud sessions: dependencies, PostgreSQL with the role `dwello`, and a Chromium the project's Playwright accepts
# (CLAUDE.md, "Commands"); idempotent, so a resumed session runs it again safely
set -euo pipefail
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
cd "$CLAUDE_PROJECT_DIR"

# A branch behind main (or one whose pull request is merged) is noticed before the first change, not at the push
# (CLAUDE.md, "Branches"); the output reaches the session. Compared with what the fetch brought
# (FETCH_HEAD, since a single-branch clone keeps no origin/main); a failing check never stops the hook
if timeout 20 git fetch -q origin main 2>/dev/null; then
	behind=$(git rev-list --count HEAD..FETCH_HEAD 2>/dev/null || echo 0)
	# a shallow clone also counts every commit of main its short history cannot reach (801 for two pull requests)
	[ "$(git rev-parse --is-shallow-repository)" = true ] && [ "$behind" -gt 0 ] && behind="some"
	[ "$behind" = 0 ] || echo "session-start: branch $(git rev-parse --abbrev-ref HEAD) is $behind commits behind origin/main;" \
		"before the first change, start it anew from origin/main if its pull request is merged, else merge origin/main (CLAUDE.md, Branches)."
fi

bun install >/dev/null 2>&1
(cd backend && bun install >/dev/null 2>&1)

# PostgreSQL on 5432, user and password `dwello`, as backend tests and E2E expect
if ! pg_isready -q -h localhost; then
	service postgresql start >/dev/null
	for _ in $(seq 1 20); do pg_isready -q -h localhost && break; sleep 0.5; done
fi
if ! su postgres -c "psql -tAc \"SELECT 1 FROM pg_roles WHERE rolname='dwello'\"" | grep -q 1; then
	su postgres -c "psql -q -c \"CREATE ROLE dwello LOGIN SUPERUSER PASSWORD 'dwello'\" -c \"CREATE DATABASE dwello OWNER dwello\""
fi

# The image ships one Chromium build (/opt/pw-browsers); when the project's Playwright expects another revision,
# a shim directory maps that revision to the installed build
installed=/opt/pw-browsers
want=$(node -p "require('./node_modules/playwright-core/browsers.json').browsers.find(b => b.name === 'chromium').revision")
shim="$HOME/.cache/pw-shim"
if [ ! -d "$installed/chromium_headless_shell-$want" ] && bash .claude/hooks/pw-shim.sh "$installed" "$want" "$shim"; then
	echo "export PLAYWRIGHT_BROWSERS_PATH=$shim" >> "$CLAUDE_ENV_FILE"
fi
