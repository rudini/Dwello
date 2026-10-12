# i18n sign-out and help links (commit d2ead63), review 1

Scope: sign-out reloads the layout data (`Header.svelte`), pages without the app header link to «Hilfe» (`+layout.svelte`); found by the persona runs `helga-i18n-2.md`, `marco-i18n-2.md`, `anna-i18n-2.md`, `sven-i18n-3.md`.

| # | Severity | Finding | Verified | Handling |
|---|----------|---------|----------|----------|
| 1 | major | An expired session (401 in `src/lib/api.ts:140`, failed token refresh in `src/routes/+layout.svelte:40`) still leads to `/login` without new layout data, so privacy and terms opened from there show the old user's header again. | Yes: the new scenario «Nach abgelaufener Anmeldung zeigt der Datenschutz niemanden als angemeldet» failed (user menu present). | Fixed at the root: the root layout load reads `url.pathname`, so SvelteKit reloads the user on every navigation, whichever way the session ended. The callers stay unchanged (an existing test pins `goto('/login')`). Both sign-out scenarios pass. |
| 2 | minor | The open-points entry left out six persona minors. | Yes. | Added to `offene-punkte.md`. |

Persona reruns after the fix (`helga-i18n-3.md`, `marco-i18n-3.md`, `anna-i18n-3.md`): no blocker or major; no page shows the signed-out user, help is one tap from the sign-in page.

Fixes checked in review 2 (`i18n-session-review-2.md`).
