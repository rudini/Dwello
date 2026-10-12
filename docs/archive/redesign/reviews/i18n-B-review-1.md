# i18n step B (backend error codes) – review 1

Scope: commit e94f4e3. Independent read-only reviewer. Result: 0 blockers, 1 major, 4 minors. Verified by the reviewer: status codes and `error` texts unchanged, `instanceof` still works, PDF services and migrations untouched, every German message equal to the backend's German text (except the major), formal fr/it/en.

| # | Severity | Finding | Done |
|---|---|---|---|
| 1 | Major | `FORMULA_INVALID` carried only the first formula error: with several errors the German text differed from the backend's and later errors were lost | Verified (`{persons} ++ {area}`). The refusal now carries `causes` (every error with its code and params, in the text's order); `backendMessage` renders and joins them. Tests first: `error-codes.pg.test.ts` (two causes), `backend-error.test.ts` (German identical to the backend's joined text). `docs/api-specification.md` updated |
| 2 | Minor | `HEATING_PROFILE_SHARE_NEGATIVE` puts the English month key into the text | Moved to step 7 (month labels of the heating profiles); listed in `offene-punkte.md` |
| 3 | Minor | `generate-pdf` and other statement routes answered «Statement not found» without a code | Coded in `routes/statements.ts` (test failed first); the two PDF downloads answer from the PDF service, which stays unchanged, so they stay uncoded |
| 4 | Minor | Two English messages read awkwardly | Reworded as suggested |
| 5 | Minor | Any param that looks like a code was expanded, also user data | Only `cause`, `reason`, `sample` are expanded; test with a category named `KI_UNAVAILABLE` |

Out of this step and listed for the area steps: German texts in `ReminderFeedback.svelte`, `TenantDocumentsCard.svelte`, the PDF toast prefix, `server/distribution-key.ts` sample labels, `api.ts` fallback texts, `statement-generation.ts` fallback, the overlap regex in the contract forms.
