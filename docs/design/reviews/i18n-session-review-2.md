# i18n sign-out and expired session (commit db1f604), review 2

Scope: the root layout load reads `url.pathname`, so SvelteKit reloads the user on every navigation (fix of review 1, finding 1).

Checked without findings: SvelteKit tracks `url` reads in server loads and re-runs the load when the URL changes (also in the production build the E2E runs use); the cost is one session check per navigation, without a backend call; auth, XSRF and hooks unchanged; the expired-session scenario reproduces the stale header (red before, green after); docs match the persona reruns.

| # | Severity | Finding | Verified | Handling |
|---|----------|---------|----------|----------|
| 1 | minor | `goto('/login', { invalidateAll: true })` in `Header.svelte` is now redundant. | Yes: both sign-out scenarios pass without it. | Removed with its unit test (`logout.dom.test.ts`); `Header.svelte` is as before this work. |

No blocker or major open.
