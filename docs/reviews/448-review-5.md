# Code-Review #448, Runde 5: Merge origin/main (984a3232) in w4-issue-448, Merge-Commit 20fae84f

Geprüft im Worktree `review-448-code5`, detached auf 20fae84f. Delta: nur der Merge (Merge-Basis 07406740). Konflikt nur in `tests/e2e/fixtures/backend.ts`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Keine Blocker und keine Majors.

## Konfliktauflösung `tests/e2e/fixtures/backend.ts:322-326`

`git show --remerge-diff 20fae84f`: Die Auflösung verbindet beide Seiten. `status` gesetzt: `statementOf(tenant, year, status)` (main, PR #515). Ohne `status`: zuerst die gespeicherte id, sonst `statementOf` (#448). Geprüft habe ich alle Aufrufer (`grep -rn "statementNumber(" tests/e2e`):

- `statement-detail.steps.ts:501` (`'replaced'`): Hat das Szenario die Abrechnung über `seed.statement` angelegt, ist die gespeicherte id dieselbe ersetzte Abrechnung, die der Status-Zweig findet. Hat das Szenario sie über die UI angelegt, gibt es keine id, und der Status-Zweig verhindert, dass die berichtigte Abrechnung desselben Jahres gewählt wird (WebKit, PR #515). Passt.
- `statement-detail.steps.ts:556, 563, 607` (Übertrag, «Bereits bezahlt auf»): Gemeint ist die vorherige bzw. die ersetzte Abrechnung, also die gespeicherte id. Das ist das Verhalten von #448 vor dem Merge. Passt.
- `statement-generate.steps.ts:138`, `tenant-export.steps.ts:35/46`, `invoice-detail.steps.ts:177/188` (neu von main, #455): Pro Jahr gibt es nur eine Abrechnung. Mit gespeicherter id und ohne sie kommt dasselbe heraus.

## Automatisch gemergte Dateien

- `messages/*.json`: Ich habe in allen vier Sprachen einen eigenen Drei-Wege-Vergleich gemacht (Basis, beide Eltern, Merge). Kein Schlüssel wurde auf beiden Seiten verschieden geändert. Jeder Merge-Wert ist der Wert der Seite, die ihn geändert hat.
- `backend/src/services/pdf.service.ts`: `billedTexts` von main (#453) überschreibt `advancePayments`, `heatingMonths` und `partProfile`. Die Zeilen von #448 (`carryLine`, `offsetLine`, «how»-Zeile, `owed`/`unpaid`) nutzen `t.advancePayments` und eigene Schlüssel. Es gibt keinen Widerspruch: Bei «Abgerechnet bis» zeigt die Saldo-Zeile «Akontobeiträge ab …», wie main es will. `belowMinimum` hat im PDF keinen Aufrufer mehr und ist sonst noch in Gebrauch (statement.service, reminder.service, statement-pdf.service). Alte Wortlaute von `tenancyLine` in fr/it/en hat kein Test mehr (grep in `backend/src`, `src`, `tests`).
- `src/lib/types.ts`: `BilledStatement.status: StatementStatus` (main, #455) enthält jetzt auch `'settled'` (#448). `InvoiceFacts.svelte:77` nutzt `statusLabels` aus `$lib/statement`, und das kennt `settled` («Erledigt»). Der Status einer erledigten Abrechnung auf der Rechnungsseite ist damit übersetzt.
- `src/lib/contract-form.ts`: Die Änderungen sind getrennt (`export FRANCS` von #448, `billedUntil`/`billedUntilError` von main). Kein Widerspruch.
- `tests/a11y/screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`, `tasks/accessibility.ts`: Die neuen Zustände von main (`billed-until-refused`, `preview-skipped`) und die von #448 stehen getrennt nebeneinander. Jeder Zustand hat seine Zeile in beiden Features und eine Bedeutung in `stateMeanings`, soweit ich es geprüft habe.
- `tests/e2e/fixtures/screens.ts`: Main ändert «Abgerechnet bis» von Dora auf 31.12.2015 und setzt es bei Emil auf 31.12.2014 (Bergsicht). #448 legt Uferweg und Hafenblick mit Verträgen ab 2023 an. Die Vorschau 2014 von `preview-skipped` gilt nur für `tankBuilding` und wird davon nicht berührt. Die Abrechnungen von #448 betreffen weder Dora noch Emil.
- `statement-detail.feature`/`.steps.ts`: Das neue Szenario von main (#453, Eva Frei, PDF bei «Abgerechnet bis») prüft nur die Texte zu Mietverhältnis und Akonto. Die Schlussabrechnungs- und Übertragslogik von #448 ändert diese Texte nicht.
- Migrationen: Nur `0028_statement_carry_over.sql` (#448). Main bringt keine Migration mit.

## Nicht bestätigt

- lint, check, backend type-check, ganzes vitest (inkl. `i18n.test.ts`) und der ganze Backend-Lauf auf 20fae84f: vom Aufrufer gemeldet. Selbst ausführen konnte ich nichts, weil der Worktree keine node_modules hat. Das gilt auch für `statement-pdf-render.test.ts`, wo die Tests von #453 und #448 im selben PDF zusammentreffen.
- E2E der betroffenen Features (statement-detail, statement-minimum-balance, invoice-detail, accessibility, sprachen-bildschirme): Der Aufrufer meldet sie als folgend. Ob `preview-skipped`, `billed-until-refused` und das #453-PDF-Szenario zusammen mit dem Seed von #448 grün laufen, ist nur gelesen, nicht ausgeführt.
- Den Drei-Wege-Vergleich der Texte hat der Aufrufer gemeldet. Ich habe ihn selbst wiederholt (siehe oben), ohne Abweichung.
