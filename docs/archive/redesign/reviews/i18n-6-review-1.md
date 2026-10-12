# i18n step 6 – review 1

Scope: commit ab5db0c (statements: list, detail, edit, wizard; `statement.ts`, `statement-wizard.ts`, `server/statement*.ts`). Independent read-only reviewer. Result: 0 blockers, 0 majors, 5 minors. Verified: 210 new keys in all files with matching placeholders, German identical incl. split texts, getters, nothing sent back changed, line items and categories in the UI language, help-page buttons and step names exact, terms as in the term table and the PDF, amounts and numeric dates Swiss; 181 statement tests and 362 guard/i18n tests green.

| # | Severity | Finding | Done |
|---|---|---|---|
| 1 | Minor | «Unbekannt» for tenant or category reused `contracts_unknown_building` | Own key `common_unknown` |
| 2 | Minor | «paie le montant à payer» clumsy with the term table | Already in `offene-punkte.md` for the native read |
| 3 | Minor | fr «prêt à être envoyé dans les documents» awkward | «Il est prêt à l’envoi sous « Documents ».» |
| 4 | Minor | Year-on-year findings sorted by German name (backend) | Kept: cosmetic, backend unchanged by decision |
| 5 | Minor | Raw English JSON on a failed PDF link; file name `abrechnung-{id}.pdf` | Kept: not a screen; noted in `offene-punkte.md` |

Step 6 closed after review 2.
