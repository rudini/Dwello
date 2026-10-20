# Code-Review #451, Runde 6 (Abschlussrunde vor dem Push)

Geprüft: `c9439466..136523af` im Worktree `review-451-code3` (detached, 136523af).
- 524b103f: Merge von `origin/main`, Konfliktauflösungen mit `git show 524b103f --cc` und je Datei gegen beide Eltern (`c9439466`, `a828b368`) und die Merge-Basis `11a6749b`.
- 136523af: nur Berichte und Archiv; gelesen, kein Befund.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-20 | Minor | `backend/src/services/pdf.service.ts:357` | it `sharesNoteFuel` hat beim Merge den Fix V-21 (Fachreview 451-3) dieses Branches verloren: «combustibile **in cisterna**» statt «combustibile **del serbatoio**». |

### C-20 (Minor)

Merge-Basis `11a6749b`: «Costi immobile per il combustibile in cisterna: …». Dieser Branch (`c9439466:348`) hat daraus «Costi immobile per il combustibile del serbatoio: … Conta per l’intero periodo …» gemacht (V-21, `docs/reviews/451-fachreview-3.md:22`, `i18n-begriffe.md:108`: Tank = «serbatoio»; `it.json` sagt überall «serbatoio», nirgends «cisterna»). `main` (`a828b368:330`) hat nur «Costi immobile» zu «Costi dell’immobile» geändert und «in cisterna» unverändert von der Basis übernommen. Die Auflösung hat den ganzen ersten Satz von `main` genommen, statt beide Änderungen zu vereinen. Richtig wäre: «Costi dell’immobile per il combustibile del serbatoio: il consumo (vedi spese di riscaldamento e acqua calda). Conta per l’intero periodo di conteggio, anche se una fornitura ha un periodo di prestazione.» Kein Test prüft diesen Text (`grep -rn "cisterna\|del serbatoio" backend/src/__tests__ src/__tests__ tests`: keine Treffer), deshalb ist der Verlust nicht aufgefallen. Für den Fix ist kein roter Test nötig, weil es eine Übersetzungs-Formulierung aus einem Review ist (Skill `slice-review`, «Triage»).

## Konfliktauflösungen geprüft (in Ordnung)

- `messages/{de,en,fr,it}.json`: Vereinigung nach Schlüssel; die Backend-Codes `billed_until_*` (main) und `invoice_amount_negative` (Branch) sind beide da. `invoices_service_period_help` hat den Text dieses Branches ohne den Satz «Nicht für Lieferungen …» (V-14), in allen vier Sprachen. `invoices_service_period_years` hat die angehängten Sätze von main, `invoices_service_period_fuel` ist da. fr `invoices_service_period_boiler` hat «répercutable» (main). fr/it `statements_existing_fee_*` haben «frais d’administration» / «spese amministrative» (main). `statements_part_*` in en/fr haben das Format von main, `statements_part_share_zero` und die Heiztexte `statements_heating_whole_*`, `statements_heating_category`, `statements_existing_old_heating_rule` dieses Branches sind erhalten. Die it-Formulierung `statements_late_text` und die fr-Formulierungen `statements_hinted_invoice`/`statements_akonto_raise_fixed_term` kommen von main.
- `pdf.service.ts`: Die `part*`-Texte dieses Branches (`partShareZero`, `partName*`, `monthSplit`, `sharesNoteAbove/Below`, `sharesNoteRoundedHeating`) und die Texte von main (`partProfileBilled`, `tenancyLine`/`tenancyBilledLine` fr/it/en, it `sharesNote` «Costi dell’immobile») sind beide erhalten. `partProfileBilled` verwendet `billedTexts()` (`:1262`) weiterhin, und die Platzhalter passen zu `partProfile` dieses Branches (`:903`). de/fr/en `sharesNoteFuel` = erster Satz von main + zweiter Satz dieses Branches; it siehe C-20.
- `InvoiceDataFields.svelte` (`fuel` `:28/89`, `deducted` `:30/135`), `InvoiceUploadRow.svelte` (`tank` `:19/101`, `keyFor` `:20/39`), `InvoiceUploadDialog.svelte` (`:277–278`): Beide Props sind deklariert und werden verwendet. Die Bearbeitungsseite `[id]/edit/+page.svelte:137–145` gibt `{fuel}` und `{deducted}` weiter.
- `invoice-pages.dom.test.ts`: Beide Tests sind da (Tag der Lieferung #451, abgezogene Akontorechnungen #455).
- `tests/e2e/fixtures/screens.ts:39`: Die Liste enthält `preview-skipped` und `heating-hints`. `tasks/accessibility.ts:510–513` hat beide Zustände. `screens.json` (`:52`, `:76`, `:491`, `:503`), `accessibility.feature:157/169` und `sprachen-bildschirme.feature:158/170` führen beide.
- `offene-punkte.md`: O-43 von main (E2E dashboard) ist erhalten, die Zeile dieses Branches heisst jetzt O-44. O-41 hat main ins Archiv verschoben. Der Archiveintrag in 136523af nennt «row O-44». `docs/reviews/451-review-4.md:14` nennt noch O-43, ist aber ein historischer Bericht.
- Begriffe aus #405 in den neuen fr/it/en-Texten dieses Branches (Diff `a828b368..524b103f` von `messages/` und `pdf.service.ts`): kein «imputable», kein «frais de gestion», kein «spese di gestione». en «management fee» entspricht `i18n-begriffe.md:81`.

## Nicht bestätigt

- vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (3305 passed, 2 Timeouts unter Last, einzeln grün). Der Worktree hat keine eigenen `node_modules` für das Frontend, deshalb habe ich sie nicht erneut ausgeführt.
- vom Aufrufer gemeldet: backend `bun test` von statement-pdf, statement-pdf-render, invoice-completeness, heating-distribution, prorating, statement-invoices, demo-data, api-contracts, invoice-amount (285 pass).
- Selbst ausgeführt (`TEST_DATABASE_URL=…/dwello_test_r451c`): `billed-until.pg.test.ts`, `fuel-stock.pg.test.ts`, `error-codes.pg.test.ts`, 72 pass, 0 fail. Das betrifft das Zusammenspiel von «Abgerechnet bis» (main, #453) mit der Heizverteilung dieses Branches; der Aufrufer hatte es nicht ausgeführt.
- E2E: nicht ausgeführt (Vorgabe). Die betroffenen Features laufen laut Aufrufer noch.
- Die übrigen automatisch gemergten Dateien von main (126 Dateien unter `backend/src`, `src`, `tests/e2e`) habe ich nur stichprobenartig gelesen (`statement-invoices.service.ts`, `src/lib/server/invoice.ts`, Bearbeitungsseite). Es sind Änderungen von main, die dort schon geprüft wurden. Ich habe nur dort nach Überschneidungen gesucht, wo sie auf Änderungen dieses Branches treffen.
