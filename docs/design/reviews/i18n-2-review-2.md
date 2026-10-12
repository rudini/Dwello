# i18n step 2 – review 2

Scope: fixes of round 1 (commit 74f449a). Fresh read-only reviewer. Result: 0 blockers, 0 majors; all round-1 findings fixed or kept with reason.

| # | Severity | Finding | Done |
|---|---|---|---|
| 1 | Minor | `buildings/[id]/+page.server.ts:50` not Prettier-formatted | Formatted |
| 2 | Minor | Singular «loué/locato» without a test | Test in `buildings-i18n.test.ts` (written after the fix; it passes with it, the plural line guards the old behaviour) |
| 3 | Minor | The `localName` cast is still an assertion | Kept: the categories come from untyped JSON; the cast names the expected shape |
| 4 | Nit | Key appended at file end; `_one` naming; «0/3 loués» | Kept (cosmetic; the x/y form reads as plural) |

Step 2 closed: no open blocker or major.
