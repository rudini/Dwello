# Code-Review #451, Runde 2

Gegenstand: Delta `git diff 89883897 5b5dd2f1` (Commit 5b5dd2f1 «fix(statements): apply reviews of #451»), Worktree `review-451-code2` (detached, 5b5dd2f1). Vorbericht: `docs/reviews/451-review-1.md`. Anforderung: #451 «Decided (product owner)» mit den Einträgen vom 2026-10-19 (M-1, V-3, V-8; V-14, V-15, Glossar), Fachreview `docs/reviews/451-fachreview-2.md`.

## Status der Befunde aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| C-1 | erledigt | `grep -n "@wip"` in `statement-detail.feature`, `statement-generate.feature` und `invoice-new.feature` findet nichts mehr. Ob die Szenarien auf 5b5dd2f1 grün sind, siehe «Nicht bestätigt». |
| C-2 | erledigt | Der widersprüchliche Satz ist aus `invoices_service_period_help` entfernt (4 Sprachen). `invoices_service_period_fuel` hat den entschiedenen Text (V-14) und steht nur bei einer Brennstoff-Kategorie (`isFuel`, `InvoiceDataFields.svelte:89`). Das vordefinierte «Heating» ist Brennstoff (`migrations/0024_category_fuel.sql`), der Wechsel der Kategorie im Szenario zeigt den Text also. Der DOM-Test prüft beides: ohne Brennstoff fehlt der Text, nach dem Wechsel steht er da. Auf 89883897 schlägt er fehl. |
| C-3 | erledigt | `LineInvoices.svelte` zeigt bei der Summe null `statements_part_share_zero` ohne «/ 0.00», `CostTable.svelte` als Zeitanteil «–». Der neue DOM-Test prüft Text und Spalte 4 (Zeitanteil). Ohne die Änderung schlägt er fehl. |
| C-4 | erledigt | In `heatingInvoices` gilt der Ausschluss nur noch bei `tank?.covered`. Der neue Fall im it.each hat die Bestände 700 (31.12.2022) und 0 (31.12.2023), für 2024 ist `covered` damit falsch. Erwartet wird «Fernwärme Q1». Mit der alten Bedingung schlägt der Test fehl. |
| C-5 | erledigt | `oldHeatingRule` meldet nur noch, wenn ein `inPeriod` andere Tage als die Periode hat. Diese Bedingung ist gleich wie `ownDays` in der Berechnung. Der neue Fall «über die ganze Periode» erwartet keinen Hinweis. Mit der alten Bedingung (`servicePeriodStart`) schlägt er fehl. |
| C-6 | erledigt | Die Überschreibung und `periodReadings`/`tankCategory` in `calculation.service.ts` sind weg. `getInvoicesForStatement` gibt einer Lieferung bei `covered` schon die ganze Periode ohne `whole`. Das Verhalten bleibt also gleich. Laut Aufrufer laufen `statement-pdf.pg` und `fuel-stock.pg` grün. |
| C-7 | erledigt, mit Folgefehler C-9 | Der Vertrag hat ein Element mit `categoryId`. `api-contracts.pg.test.ts` legt die beiden Heizrechnungen an, und `drift` meldet eine leere Liste («leer geliefert»). Der Frontend-Test nimmt das Element aus dem Vertrag. |
| C-8 | erledigt | `INVOICE_AMOUNT_NEGATIVE` steht in der Liste der Codes. Dazu beschreibt `/completeness` jetzt `heatingWithoutServicePeriod` und `oldHeatingRule`. |

Fachreview 2, soweit im Delta: V-14 (Texte wörtlich wie im Issue entschieden, alter Satz in 4 Sprachen entfernt), V-15 (`heatingWholeText` mit `Intl.ListFormat`, jede Kategorie in eigenen Anführungszeichen; Unit-Test Einzahl/Mehrzahl, neu), V-16 (fr/it/en `partNoPeriod` ohne die doppelte Periode; Render-Tests nachgeführt, sonst keine Fundstelle des alten Texts in `tests`, `backend/src`, `docs`). Das Glossar hat zwei Zeilen geändert, «Heizrechnung» und der Satz zum Lieferdatum bei «Verbrauch (Heizmaterial)». Das entspricht dem Eintrag «Glossary (entry ordered by the product owner)» in #451 (`gh api repos/rudini/Dwello/issues/451`). Die Regel im Satz stimmt mit `getInvoicesForStatement` überein.

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-9 | Major | `tests/contracts/invoice-completeness.json:27-36`; `src/__tests__/statement-wizard.dom.test.ts:960-967` | Seit der Vertrag ein Element in `heatingWithoutServicePeriod` hat (C-7), schlägt der Test «nennt Rechnungen ohne Leistungszeitraum kurz nach der Abrechnungsperiode, ohne Bestätigung» fehl. `withInvoices` übernimmt `heatingWithoutServicePeriod` aus dem Vertrag. Der Hinweis auf Heizrechnungen steht dadurch zusätzlich auf der Seite, und `byTestId('hinted-invoice')` findet zuerst dessen Rechnung. |
| C-10 | Minor | `src/lib/invoice.ts:17-18` | `isFuel` steht zwischen dem JSDoc von `servicePeriodOf` und `servicePeriodOf`. Der Kommentar «The Leistungszeitraum as the backend stores it …» gehört jetzt zu `isFuel`, `servicePeriodOf` hat keinen mehr. |
| C-11 | Minor | `src/routes/invoices/[id]/edit/+page.svelte:133`, `src/routes/invoices/UploadRowFields.svelte:74` | Die Seite «Rechnung bearbeiten» und das Hochladen setzen `fuel` auch, ohne Test. Nur «Rechnung erfassen» hat DOM-Test und Szenario. Ein falscher Ausdruck an den beiden Stellen bliebe unbemerkt (z.B. `values.categoryId` auf der Bearbeitungsseite). Über «Rechnung bearbeiten» kommen die Personas zum Hilfetext (`helga-invoice-hints.md`, P-1). |

## Blocker/Major

### C-9 (Major): Frontend-Test rot durch den geänderten Vertrag

**Warum falsch.** CLAUDE.md, «Before marking anything complete», verlangt die Tests, die eine geänderte Datei lesen, auch wenn sie die Datei nur als Daten einlesen. `statement-wizard.dom.test.ts` importiert `tests/contracts/invoice-completeness.json`. Der Test lief in den gemeldeten Prüfungen nicht mit (dort nur statement-generation, statement-wizard, invoice-pages.dom, statement-pages.dom). CI und `bun run test:coverage` werden damit rot.

**Nachweis.** Im Worktree `bunx vitest run src/__tests__/statement-wizard.dom.test.ts`:
```
× nennt Rechnungen ohne Leistungszeitraum kurz nach der Abrechnungsperiode, ohne Bestätigung
Expected: "Kaminfeger Keller: Kaminfeger 2025. Rechnungsdatum 20.01.2026, CHF 290.00"
Received: "Fernwärme AG: Fernwärme Q1 2025. Rechnungsdatum 31.03.2025, CHF 1’520.00"
```
Gefunden wird das neue Vertragselement. Auf 89883897 war die Liste leer.

**Korrektur.** Im Test `heatingWithoutServicePeriod: []` in die Prüfung von `withInvoices` setzen, wie in `statement-generation.test.ts:435`, oder den Hinweis über `byTestId('late-invoices')` suchen. Danach alle Leser des Vertrags laufen lassen (`grep -rln invoice-completeness src/__tests__`: statement-generation, statement-wizard.dom, statements-i18n).

## Geprüft und bestätigt

- **Sicherheit:** keine neuen Routen. `isFuel` liest nur das Feld der Kategorie, das `toCategory` schon an den Client gibt.
- **Texte:** `statements_heating_whole_text_many`, `statements_heating_category` und `statements_part_share_zero` stehen in allen vier `messages/*.json`. `statements-i18n.test.ts` ist grün (selbst ausgeführt).
- **Szenario `invoice-new.feature:53`:** Es wählt «Heizung» mit dem bestehenden Schritt (`invoice-form.steps.ts:56`) und prüft den neuen Text. Auf 89883897 schlägt es fehl, weil der Text dort anders lautet.
- **Ponytail:** Der Delta macht den Code kürzer (C-6, `heatingCategories` weg). `heatingWholeText` und `isFuel` werden beide genutzt und kopieren keinen bestehenden Helfer.
- **Nichts Fremdes:** Jede Datei im Delta gehört zu einem Befund aus Runde 1 oder aus Fachreview 2 oder ist ein Bericht.

## Nicht bestätigt

- **Läufe, vom Aufrufer gemeldet, nicht wiederholt:** `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx fallow audit` sowie die Backend-Tests statement-pdf-render, statement-pdf.pg, invoice-completeness.pg, heating-distribution.pg, fuel-stock.pg und api-contracts.pg. Selbst ausgeführt habe ich `bunx vitest run` für statement-wizard.dom, statements-i18n, statement-wizard, statement-pages.dom, invoice-pages.dom und statement-generation: 373 grün, 1 rot (C-9).
- **E2E auf 5b5dd2f1:** Die Läufe stehen laut Aufrufer noch in der Warteschlange, Ergebnis unbekannt (nicht gestartet, nach Vorgabe). Grün waren die 12 Szenarien nur als `@wip` auf 89883897. Auf 5b5dd2f1 haben sich `invoice-new.feature:53` und der Text der Vorschau geändert.
- **Kein Szenario für die Summe null (Punkt 1, Detailseite C-3) und für die Mehrzahl (V-15):** Neue Gutschriften lehnt das Backend ab. Der Zustand entsteht im E2E-Stack also nur mit Daten aus der Datenbank. Die Mehrzahl ist eine Textvariante eines Hinweises, für den es ein Szenario gibt. Beides hat Tests auf der untersten Ebene. Ob der Pull Request dafür `No scenario: <reason>` nennt, konnte ich nicht prüfen: Es gibt noch keinen Pull Request, und der Commit nennt nichts.
- **Detailseite bei Summe null:** Die Spalte «Wohnungsanteil» zeigt dort weiter den gespeicherten `apartmentShare` (0.00), und der Text nennt den Bruch des Verteilschlüssels nicht, anders als das PDF (`keyShare`). Das galt schon vor dem Delta und ist kein Befund. Nur gelesen (`CostTable.svelte:63-64`).
- **`withoutServicePeriod` (`invoice-completeness.service.ts:280`):** Hier wird jede Kategorie mit einem Tankbestand ausgeschlossen, auch wenn `covered` falsch ist. Das galt schon vor dem Delta, und der Befund C-4 betraf es nicht. Nicht weiter verfolgt.
