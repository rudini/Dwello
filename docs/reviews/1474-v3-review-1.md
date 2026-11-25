# Code-Review #1474 Fachreview V-3, Runde 1

Bereich: `ca6fc32..3d86e9f`, begutachtet wird 3d86e9f. caa5465 (Eval-Fälle, Extraktionstests) gehört nicht zu diesem Slice und ist nur gelesen.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `tests/e2e/features/statement-generate.feature` (fehlt; Nachbar Z. 304–314) | Die Änderung ist für den Verwalter sichtbar (Verteilschlüssel der Veränderung Tankbestand, Hinweis «verschiedene Verteilschlüssel», PDF), hat aber kein Szenario ohne `@wip`. Der E2E-Stack kann den Zustand mit vorhandenen Steps erzeugen, also ist `No scenario` nicht zulässig. |

## C-1: Kein Szenario für einen sichtbaren Fehler-Fix

**Warum falsch:** Laut `CLAUDE.md` (Workflow 1 und die Pflichtprüfung «A behavior change (a bug fix a user can see included) has a scenario … without `@wip`») braucht jede Verhaltensänderung ein Szenario. `No scenario: <reason>` gilt nur für einen Zustand, den der E2E-Stack nicht erzeugen kann (`tests/e2e/CLAUDE.md`, "No scenario"). Dieser Zustand lässt sich erzeugen. Das Szenario «Die Veränderung Tankbestand folgt dem Verteilschlüssel der letzten Lieferung, nicht dem einer Tankrevision» (`statement-generate.feature:307–314`) baut ihn schon fast auf, mit denselben Steps: Rechnung mit Verteilschlüssel, «gilt danach für die Zeit vom … bis …» und dem Hinweis mit dem Namen des Schlüssels. Für den Fix vom Tankschlüssel bei #1469 gibt es auch ein solches Szenario. Der pg-Test reicht als unterste Schicht für den roten Lauf (`CLAUDE.md`, Workflow 2: «A scenario added for a fix whose lower-layer test was seen red needs no red run of its own»). Er ersetzt das Szenario aber nicht.

**So zeigt sich der Fehler, Vorschlag:** Anfangsbestand 600 am 2023-12-31 und Endbestand 100 am 2024-12-31. Eine Rechnung «Heizung» über 1000 vom 2024-03-15 nach «Pro Einheit». Danach eine Rechnung «Heizung» über 500 vom 2025-01-20 nach «Pro Fläche (m²)», die «danach für die Zeit vom 2024-12-20 bis 2024-12-20» gilt. Die Vorschau 2024 meldet dann «… Die Veränderung Tankbestand wird nach «Pro Fläche (m²)» verteilt.». Auf ca6fc32 nennt sie «Pro Einheit»: `lte(invoices.invoiceDate, '2024-12-31')` schliesst die Rechnung vom 20.01.2025 aus. Ein neues Szenario ist frei (`tests/e2e/CLAUDE.md`, "Rules").

## Nicht bestätigt

- Backend `bun test src/__tests__/fuel-stock.pg.test.ts` 52 pass, roter Lauf des neuen Tests (`'Per Area (m²)'` statt `'Per Unit'`): vom Aufrufer gemeldet. Nach dem Lesen ist er auf der Basis plausibel rot: Die Seed-Lieferung vom 2024-05-10 hat «Per Area», die neue hat Rechnungsdatum 2026-01-20 > 2025-12-31.
- `statement-key-failure.pg.test.ts` und `statement-outdated-values.pg.test.ts` 40 pass, `bun run type-check`, `bun run lint`: vom Aufrufer gemeldet.
- `lte(coalesce(date, date), '<string>')` mit Drizzle-Parameter: der Typ des Vergleichs ist nur gelesen, nicht ausgeführt. Der gemeldete grüne pg-Lauf deckt ihn ab.
- Halber Leistungszeitraum (nur `servicePeriodEnd` gesetzt, `backend/src/routes/invoices.ts:66–67` erlaubt beides einzeln): Der SQL-Filter in `keyFor` (`fuel-stock.service.ts:87`) zählt eine solche Rechnung als Lieferung, `isDelivery` (Z. 70) nicht. Das war schon vor der Änderung so. Ob die Oberfläche einen halben Zeitraum speichern kann, habe ich nicht geprüft. Die Änderung nimmt dafür jetzt `servicePeriodEnd` statt des Rechnungsdatums. Der Fachreview schlug `coalesce(servicePeriodStart, …)` vor. Für echte Lieferungen (Beginn = Ende oder beide null) sind beide Varianten gleich.
- caa5465: `llm-extraction.test.ts` («verlangt ein einzelnes Liefer- oder Leistungsdatum …») ist laut Commit-Text absichtlich rot bis zum Entscheid zu V-1. Er gehört nicht zu diesem Slice. Vor einem Push muss er grün sein.

Geprüft: `keyFor` filtert und ordnet nach dem Liefertag, wie `getInvoicesForStatement` die Lieferung zuordnet (`invoice.service.ts:588`, Ende des Leistungszeitraums), und wie `UBIQUITOUS_LANGUAGE.md` («Verbrauch (Heizmaterial)») es beschreibt. Die Reihenfolge am selben Tag (#770) ist unverändert. Kein UI-Text, kein API-Vertrag und keine Sicherheitsfläche ist betroffen. Ponytail-Review: Der Diff ist minimal, nichts bleibt ungenutzt. Plan-Einträge und Commit-Betreff passen zu den Regeln.
