# Slice-Review #1469, Runde 2 (cedb7d3..da5d167)

Vorbericht: docs/reviews/1469-review-1.md.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-6 | Minor | docs/api-specification.md:145 | Die Antwort von `GET /completeness/:buildingId` zählt alle Felder auf (`… lateInvoices, heatingWithoutServicePeriod, oldHeatingRule, splitKeys, uncalculableKeys`) und beschreibt jedes. Das neue Feld `tankNotDelivery` (invoice-completeness.service.ts:414) fehlt dort, samt Form `[{ id, billingEntityName, description, invoiceDate, amount, categoryId }]` und Bedingung (Kategorie des Tankbestands, Tankbestand in der Periode, Leistungszeitraum über mehrere Tage). Der Vertrag tests/contracts/invoice-completeness.json ist nachgeführt, die Spezifikation nicht. |

Geschlossen: C-1, C-2, C-3, C-4, C-5.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, fitness (0 Fehler), Backend-Type-Check, `bunx vitest run --changed origin/main` (1555), die Backend-pg-Tests fuel-stock, invoice-completeness, api-contracts, statement-pdf, heating-distribution und cost-reconciliation(-rows), E2E chromium der 6 Szenarien des Deltas und der früheren sowie `-g "statement-generate |buildings |statements "` (128 bestanden, mit den axe- und Sprachzeilen von `tank-not-delivery`).
- Rote Läufe, vom Aufrufer gemeldet: das Szenario «Die Vorschau nennt eine Rechnung der Kategorie des Tanks, …» als `@wip` am fehlenden Hinweis, die drei C-3-Szenarien und die zwei M-2-Tests mit herausgenommenem Code, die C-4-Pins gegen die alten Texte. Beim Lesen schlagen alle ohne die Änderung fehl: invoice-completeness.pg.test.ts (89338e8) an `tankNotDelivery.map` auf `undefined`, statement-wizard.test.ts am fehlenden Modul `category-hints`, der DOM-Test am fehlenden `tank-not-delivery`.
- Das Gebäude «Tankhof» (fixtures/screens.ts:309-315) wird für jeden Bildschirmzustand mit Daten angelegt, nicht nur für `tank-not-delivery`. Gelaufen sind laut Aufrufer nur die Zeilen von statement-generate, buildings und statements. Ob die Zeilen von Übersicht, Mietern und Rechnungen mit dem zusätzlichen Gebäude, Mieter «Theo» (Vertrag ab 2025) und der Rechnung 2018–2028 weiter dasselbe zeigen und axe-sauber sind, ist nicht gesehen. Gelesen: previewOf in tasks/accessibility.ts:165-175, die Vorschauen 2024 sind nicht betroffen.
- `localCheck` (src/lib/server/statement-generation.ts:354-357) löst den Kategorienamen von `tankNotDelivery` auf. statement-generation.test.ts:337 prüft nur den Fall ohne Treffer (`categoryName: ''`). Den aufgelösten Namen zeigt nur das E2E-Szenario («In der Kategorie Heizung …»).
- Weiter offen aus Runde 1: Ob eine ältere Abrechnung «nicht aktuell» wird, wenn eine Tankrevision jetzt nach Tagen zählt (kein Test im Diff), und der Ladeweg `tank` in src/routes/invoices/[id]/+page.server.ts ohne Unit-Test.
- Issue #1470 (über die REST-API gelesen): offen, Label `bug`, Titel passend zu C-2. Der Pull-Request-Text ist noch nicht gelesen, weil es noch keinen gibt.

Geprüft: Bedingung `tank === 'other'` gleich wie die Lieferregel (`covered`, Kategorie des Tanks, `isDelivery`), Texte und Titel in allen vier messages/*.json wörtlich gleich wie in 1469-fachreview-2.md, Ton `info` ohne Bestätigung, ein Hinweis für mehrere Kategorien ohne Guillemets, Verschiebung von `heatingWholeText` nach category-hints.ts ohne Verhaltensänderung, Vertrag und api-contracts-Test, Glossarsatz der dritten Runde, C-3-Szenarien (Beträge 244.45 und 1'001.82 nachgerechnet, Negativprüfung «keine Rechnung vom 20.11.2024» mit positivem Anker), Screenplay-Schichten (Steps rufen nur Fragen), screens.json mit `stateMeanings`, accessibility.feature, sprachen-bildschirme.feature, Plan-Zeilen. Ponytail: nichts zu streichen, das ein Defekt wäre.
