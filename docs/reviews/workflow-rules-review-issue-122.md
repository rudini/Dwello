# Workflow rules review: issue #122 (favicon)

Rules that guided the task, with what happened and a proposed change. Review only: nothing here is applied.

## R-1 One session per task does not fit a run of several bug issues

- **Rule:** `CLAUDE.md` Workflow 8 ("a new session for a new task", `open-work.test.ts` allows one session) and Workflow 9 (one pull request per task, merge before the next).
- **What happened:** the request was to work off all open bugs one after another, each merged before the next. The plan session had to be named for the first issue and will be archived with its pull request; every following bug starts a new session on a branch started anew from `origin/main`.
- **Proposal:** Workflow 8 says that a request covering several issues is one session per issue (one pull request each), and that the closing report of each names the next.

## R-2 Persona runs for a change no screen shows

- **Rule:** `CLAUDE.md` Workflow 5 ("UI changed … subagent `persona`, once per affected persona"); `docs/design/personas/README.md`, "Which personas".
- **What happened:** the favicon appears only in the browser's own tab bar, which headless Chromium does not draw. Both personas (Marco, Anna) rebuilt a tab bar from the SVG by script to judge it; their findings are useful (O-17) but come from a simulation, and neither could check a real tab or home screen.
- **Proposal:** "Which personas" names browser chrome (tab icon, title, manifest) as a kind of change and says the persona renders the asset at its real sizes on light and dark backgrounds instead of browsing.

## R-3 Review worktrees cannot read `node_modules`

- **Rule:** `CLAUDE.md` Workflow 4 (link `node_modules` into the review worktree).
- **What happened:** reading `node_modules/lucide` (to copy the House paths) was denied for the session and for the code reviewer, whose link points into the main tree; the reviewer reported the path check as "not confirmed". The paths were taken with `node -e "import('lucide')…"`, and a unit test now compares them.
- **Proposal:** Workflow 4 notes that dependency sources are read through `node -e` / the test runner, not as files.
