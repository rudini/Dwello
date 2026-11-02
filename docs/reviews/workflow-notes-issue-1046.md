# Workflow notes: #1046

| Rule | What happened | Proposed change |
|---|---|---|
| `tests/e2e/CLAUDE.md`, "Run" (missing) | The failure was Firefox only. The cloud image has only Chromium, and the session-start hook sets `PLAYWRIGHT_BROWSERS_PATH` to a Chromium shim. To reproduce, the session installed Firefox for the pinned Playwright into its scratchpad (`PLAYWRIGHT_BROWSERS_PATH=<scratchpad>/pw npx playwright install firefox`) and ran the scenario with that path. Without a written way, this took several tries. | Add one line under "Run": for a failure in one browser of `main` only, install that browser into the scratchpad as above and run `bunx playwright test --project=<browser> -g "<scenario>" --repeat-each=<n>` with that path. |
| `CLAUDE.md`, "Red CI" ("flaky is not a cause") | The scenario passed 132 times locally in Firefox. The cause showed only in a minimal page outside the app, 600 tries per variant (7 misses against 0). | None; the rule led to the cause. Note it as an example of how to show the cause of a rare failure: a minimal reproduction with counts per variant. |
