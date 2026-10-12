# i18n follow-up (commit 3bea241), review 2

Scope: the fixes for review 1 (margins of signed-out help, privacy and terms; API spec; Prettier; more protected paths).

| # | Severity | Finding | Verified | Handling |
|---|----------|---------|----------|----------|
| 1 | minor | `public-pages-layout.dom.test.ts` covered only `/terms`; nothing showed that `/login` keeps its bare `<main>`. | Yes. | Fixed: the test runs over `/help`, `/privacy`, `/terms` and checks `/login` has no margins. |
| 2 | minor | `<main id="main-content">` is written twice in `+layout.svelte`, once per branch. | Yes; the branches exclude each other, one `main` is rendered. | Kept: two plain branches read more easily than conditional classes and a conditional wrapper. |
| 3 | minor | Review 1 pointed to this file before it existed. | Yes. | Fixed by this file. |

Found while running E2E (not by the reviewer): the step «der Besucher den Link zu den Nutzungsbedingungen öffnet» waited for `body[data-hydrated]`, which the login page already has, so the next step could read the URL before the client navigation; one run failed with `/login`. The URL check now retries (`toHaveURL`); `sprachen.feature` passed three times in a row.

No blocker or major open.
