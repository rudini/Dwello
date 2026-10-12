# i18n step 4 – review 1

Scope: commit 77de033 (rental contracts: list, detail, edit, wizard; `contract-form.ts`, `contract-wizard.ts`; French guillemets with non-breaking spaces). Independent read-only reviewer. Result: 0 blockers, 0 majors, 5 minors. Verified: all 97 new German texts identical to before, 662 keys in each file, guillemet change only touches spaces, help-page labels and step names match the wizard exactly, texts read per request, dates in the UI language, amounts Swiss; 553 related unit tests green.

| # | Severity | Finding | Done |
|---|---|---|---|
| 1 | Minor | `backend-error.test.ts` edited | Accepted: the test was added in this work (step B); the French expectation follows the guillemet house style |
| 2 | Minor | Re-wrapped line in `statement-wizard.ts` | Reverted |
| 3 | Minor | fr/it «{name} est enregistré» without gender agreement | «Le locataire {name} est enregistré …», «L’inquilino {name} è salvato …», as for the tenant toasts in step 3 |
| 4 | Minor | en «Let apartments» easy to misread | «Rented apartments» |
| 5 | Minor | `contracts_step_of` repeats `ui_step_of` with a colon | Kept: the German text with the colon must stay as it was |

Step 4 closed after review 2.
