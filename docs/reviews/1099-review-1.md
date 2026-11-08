# Code-Review #1099, Runde 1 (origin/main..04a7c3d)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | docs/api-specification.md:140 | Die Zeile `/completeness/:buildingId` beschreibt am Ende weiter «`invoicesWithoutServicePeriod` dated in a period shorter than a year, else empty (#134)» und «the first two lists». Entfernt wurde das Feld nur aus der Aufzählung der Antwort. |
| C-2 | Minor | tests/e2e/targets/statement-generate.ts:89 | Der geänderte Kommentar beschreibt Rechnungen kurz nach der Periode (`lateInvoices`, Z. 93), steht aber über `uncategorizedInvoices`. Damit nennt er den falschen Target. |

## C-1 (Major)

Warum falsch: Laut «Done means» des Issues müssen die API-Verträge und `docs/api-specification.md` stimmen. Die Antwort hat das Feld `invoicesWithoutServicePeriod` nicht mehr: siehe `invoice-completeness.service.ts:390-398`, den Contract `tests/contracts/invoice-completeness.json` und den Test `invoice-completeness.pg.test.ts:133` (`not.toHaveProperty`). Die Spezifikation sagt im selben Absatz aber noch, die Antwort liefere dieses Feld. Auch «the first two lists `[{ id, billingEntityName, description, invoiceDate, amount }]`» stimmt nicht mehr. Davon bleibt nur noch `lateInvoices`; `heatingWithoutServicePeriod` hat eine andere Form (`categoryId`).

Wie zeigen: Im Worktree findet `git grep -n invoicesWithoutServicePeriod docs/api-specification.md` den Treffer in Zeile 140, im letzten Satz.

Korrektur: Den Schluss umschreiben, etwa «`lateInvoices` `[{ id, billingEntityName, description, invoiceDate, amount }]`: allocable invoices without Leistungszeitraum dated up to 90 days after the period end, except …».

## Nicht bestätigt

- Diese Checks auf 04a7c3d sind vom Aufrufer gemeldet, nicht von mir gelaufen: `bun run lint`, `bun run check`, `bun run fitness`, Backend type-check, `bunx vitest run --changed origin/main` (852 Tests), die 9 vitest-Dateien mit readFileSync, die Backend-Tests invoice-completeness.pg, api-contracts.pg, statement-correction.pg, prorating.pg, statement-run und pdf*, dazu die Commit-Hooks.
- E2E (`statement-generate.feature`) ist laut Aufrufer noch nicht gelaufen. Ich habe nur gelesen: kein Feature, kein Step, kein `tests/a11y/screens.json` und keine Fixture nutzt `invoices-without-service-period` oder `statements_whole_*` (`git grep`). Die Bedeutung von `invoice-hints` (screens.json:77) sagt schon, dass es den Hinweis nicht gibt.
- Die Coverage-Untergrenzen hat niemand gemessen, weder der Aufrufer noch ich.
- Die erwarteten Werte in `statement-correction.pg.test.ts:378-388` (97.59 / 41.5, `noHeatingMonths`) habe ich nur gegen die Rechnung der Fachreview 1099-1 V-1 geprüft. Die Werte des Heizprofils Mittelland im Seed habe ich nicht nachgelesen. Rot ohne den Guard in `prorating.service.ts:180` ist plausibel (0/0 = NaN statt `byDays: true`). Der Commit nennt die Tests als Festhalten von bestehendem Verhalten, und dieses Verhalten zeigt schon die Basis (Fachreview V-1). Die Neuberechnung (`recalculateStatement`) hält kein neuer Test fest; die Fachreview V-2 verlangt einen Test nur für die Berichtigung.

Geprüft: alle 19 Dateien des Diffs. Backend, Contract, Wizard-Typ, PreviewChecks und die vier `messages/*.json` sind vollständig entfernt (kein Rest laut `git grep`). Die Kommentare in prorating/pdf/data-model stimmen mit Fachreview V-3. Keine verwaisten Helfer: `withoutServicePeriod`, `addDays` und `yearAfter` werden weiter genutzt. Ponytail ohne Befund. `No scenario` ist im Plan begründet.
