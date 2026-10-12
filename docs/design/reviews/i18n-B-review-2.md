# i18n step B (backend error codes) – review 2

Scope: fixes of round 1 (commit 9daeff4). Fresh read-only reviewer. Result: 0 blockers, 0 majors. The major is fixed: for 11 invalid formulas the rendered German text equals the backend's text exactly; fr/it/en translate every cause, nested codes included; minors 3–5 confirmed.

| # | Severity | Finding | Done |
|---|---|---|---|
| 1 | Minor | A cause with an unknown code showed the raw code inside a translated sentence | Falls back to the backend's own text; test in `backend-error.test.ts` (failed first) |
| 2 | Minor | The general error format in `api-specification.md` did not name `causes` | Added |

Also noted: some routes still answer English texts without a code (tenant/contract «not found», fuel stock refusals); the pages show their own translated texts for these by status, so the raw text does not reach the UI.

Step B closed: no open blocker or major.
