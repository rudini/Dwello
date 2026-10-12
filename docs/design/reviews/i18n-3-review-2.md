# i18n step 3 – review 2

Scope: fixes of round 1 (commit ef8efb9). Fresh read-only reviewer. Result: 0 blockers, 0 majors; plural categories checked per language (fr «1.5 pièce», en «1.5 rooms», German unchanged), all callers moved, the room select submits the same values; 185 related unit tests green.

| # | Severity | Finding | Done |
|---|---|---|---|
| 1 | Nit | A contract without apartment would show «Contrat de bail – » | Kept: every contract has an apartment |
| 2 | Nit | Test switches language without reset | Already reset: `afterEach` in `tenants-i18n.test.ts` restores the base language |

Step 3 closed: no open blocker or major.
