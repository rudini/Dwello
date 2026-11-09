# Code-Review 1395, Runde 6 (P2-Umbau), `e1bdbd44..a031f8f8` (+ Merge 43e815c8)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | backend/src/services/statement-invoices.service.ts:103-109 | Die Übersicht nimmt die Zeiten der Verteilschlüssel nur noch aus den Rechnungen der Periode. Damit fällt bei **Entwürfen** (#1328, auf `main` mit `keysChangedAt()` über alle Schlüssel) die geänderte Formel des Schlüssels weg, den nur eine Lieferung einer anderen Periode für die Veränderung Tankbestand liefert (#1323). Das ist ein Rückschritt gegenüber `main`, und er wäre ohne zusätzliche Abfrage vermeidbar. |

## C-1 (Major): Übersicht verliert bei Entwürfen die Schlüsseländerung über die Tankbestand-Position

**Warum falsch:** Auf `main` (43e815c8^2, Z. 102 f.) rechnet `perPeriod().valuesChangedAt` für jeden Entwurf mit `once('keys', keysChangedAt)`, also mit allen Verteilschlüsseln. `lastValueChange` liest die Schlüssel aller `lineItems`, auch den der Position «Veränderung Tankbestand». Dieser Schlüssel stammt aus `keyFor()` (fuel-stock.service.ts:63-84): Er ist der Schlüssel der letzten Lieferung bis Periodenende, auch einer Lieferung aus einer früheren Periode (#1323). Seit a031f8f8 enthält die Map nur noch die `distributionKey` der Rechnungen aus `getInvoicesForStatement` für die Periode.

Ein solcher Schlüssel fehlt dort, also liefert `keysAt.get(…)` den Wert `undefined`, und dieser zählt als 0. Die Seite der Abrechnung (`direct`) meldet den Entwurf als nicht aktuell, die Übersicht (`notUpToDate` → `draftOutdated(changesOf(…))`) nicht mehr. Der Kommentar Z. 103 f. und die Übergabe beschreiben das nur für den Fall «verschickt». Es betrifft aber genauso die Entwürfe, deren Regel (#1328) laut Anforderung «unverändert» bleibt.

Der PO-Entscheid vom 2026-11-09 verlangt, die Zeiten in Listenabfragen zu falten, «die die Route schon macht». Die Liste lädt `change(s)` = `fuelStockChange()` → `keyFor()` bereits. Sie lädt dabei die Schlüsselzeile (Z. 82: `select({ id, name, nameDE, formula })`), nur ohne `updatedAt`. Mit `updatedAt` in diesem Select und den Schlüsseln aus `await change(s)` in der Map wäre die Lücke ohne weitere Abfrage geschlossen (Ratchet bleibt 21). Damit wäre auch die Ausnahme im Kommentar unnötig. Kein Test hält die Lücke fest, weder als gewollt noch als Fehler.

**Wie zeigen:** pg-Test in `statement-outdated-values.pg.test.ts`:
1. Gebäude mit Tankbestand-Ablesungen am Anfang und Ende der Periode 2025.
2. Die einzige Heizöl-Lieferung ist 2024 datiert und hat den eigenen Schlüssel K (`{units}`). Wohnungen mit unterschiedlichen Zimmerzahlen.
3. Entwurf 2025 erzeugen, dann K auf `{rooms}` ändern.
4. Ergebnis: `statementChanges(id).valuesChanged` ist `true`, aber `GET /api/v1/statements/outdated` listet den Entwurf auf a031f8f8 nicht. Auf `main` listet er ihn.

Für eine verschickte Abrechnung zeigt der gleiche Aufbau dasselbe (`values: true` fehlt in der Liste).

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - backend type-check
  - p2-Benchmark `/api/v1/statements/outdated` = 21 (Ratchet 21), alle Routen auf ihrem Ratchet
  - pg statement-outdated-values (19), statement-invoices, invoice-retention, api-contracts, apartment*, invoice*, whole-lists, held-invoices (358 + 19 grün)
  - lint, check, `fitness --structure` (0 Fehler)
  - Prettier auf den geänderten Zeilen
  - vitest der Leser von invoice.json (168) und `--changed origin/main` (1529)
- Rot des neuen Tests mit leerer Schlüssel-Map: nur gelesen. Die Wohnungsänderung liegt vor `sent()`, die Schlüsseländerung danach. Ohne Schlüsselzeiten bliebe `values` also falsch, die Behauptung ist plausibel.
- Merge 43e815c8: `--remerge-diff` laut Aufrufer leer. Selbst geprüft habe ich nur, dass `main` in den drei Services nichts vom Branch Abweichendes enthält.

Geprüft:
- Gleiche Semantik von `changedAt` und `apartmentsChangedAt(buildingId)` für Gebäude mit Wohnungen. Ein Gebäude ohne Wohnung (dann `null` statt Gebäudezeit) kann keine Abrechnung tragen, denn eine Wohnung mit Vertrag lässt sich nicht löschen (apartment.service.ts:347-357).
- Inner Join: `apartments.building_id` ist NOT NULL mit FK und cascade (schema.ts:63-65).
- Einziger Aufrufer von `apartmentsByBuilding`: statement-invoices.service.ts.
- `updatedAt` in `distributionKey` der Rechnungsantwort braucht keine Frontend-Änderung: `InvoiceWithDetails.distributionKey` ist `Pick<DistributionKey, 'id' | 'name'>` (src/lib/types.ts:284), `drift()` prüft einseitig. invoice.json ist nachgeführt. Ein geänderter oder gelöschter Rechnungsschlüssel macht `invoiceIds` nicht leer und schaltet die Wertprüfung ab.
