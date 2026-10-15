# Workflow rules review: issue #125 (coded refusals for statement PDF, IBAN and calculation)

Rules that guided the task, with what happened and a proposed change. Review only: nothing here is applied.

## R-1 A "Done means" can decide a screen state the design rules forbid

- **Rule:** `CLAUDE.md` "Design-Regeln" (errors say what happened and what to do; screens readable at 390 px) and "Open work" (an issue's decisions are its text).
- **What happened:** #125 decided «a sentence in the UI language (as the view does)», which was built as `text/plain`. Both personas rated it a Major (no way back, tiny on a phone, no title); the product owner then chose a small HTML page. The rule set had no check that would have caught it before the persona round: the existing `?ansehen` refusal page was never in `tests/a11y/screens.json` either.
- **Proposal:** the "new screens or states" line in "Design-Regeln" names pages answered by `+server.ts` routes (a refusal opened in a tab) as screens too, so they get an a11y and language entry from the start.

## R-2 The design guard and pages outside the app

- **Rule:** `src/__tests__/design-guard.test.ts` (no colour in `style` attributes; tokens only).
- **What happened:** the refusal page is served without the app's CSS, so no token class exists there; the guard refused `color: CanvasText` in a `style` attribute but lets the same rule pass in a `<style>` element. The page moved its styles into `<style>`, which keeps to the rule's purpose (no colour value) but shows the guard's regex, not its intent, decides.
- **Proposal:** `docs/design/token-referenz.md` names how a page outside the app is styled (system colours only, in a `<style>` element), and the guard allows exactly that.

## R-3 E2E navigation waits for the app's hydration marker

- **Rule:** `tests/e2e/screenplay/interactions.ts` (`Navigate.to` waits for `body[data-hydrated]`).
- **What happened:** the axe and language rows of the new page timed out until the page itself set `data-hydrated`, an attribute the app sets in `+layout.svelte` once it reacts to input. A page without scripts now carries it to satisfy the harness.
- **Proposal:** `tests/e2e/CLAUDE.md` says that a page without scripts (a `+server.ts` answer) sets `data-hydrated` itself, or `Navigate.to` skips the wait for non-app pages.

## R-4 A combined Bash command lost an edit to a gate

- **Rule:** `CLAUDE.md` Gotchas ("never chain edits and a `git commit` in one Bash command").
- **What happened:** a plan edit chained before `git commit` was dropped when the commit-subject gate blocked a 54-character subject; it had to be redone. The rule was known and still broken.
- **Proposal:** none for the rules; the gate's message could repeat that the whole command was dropped, including edits before the commit.
