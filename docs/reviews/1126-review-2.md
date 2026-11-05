# Code-Review 1126-2 (Kostenabstimmung, Frontend, `git diff c4ae72c 2ad4081`)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `src/routes/statements/generate/PreviewReconciliations.svelte:9` | Ein Gebäude ohne umlagefähige Rechnungen, aber mit nicht umlagefähigen, zeigt in der Vorschau nichts. Der PO-Entscheid «Empty» verlangt, dass die Zeile «Nicht umlagefähige Rechnungen (tragen Sie ganz)» erscheint, wenn sie nicht CHF 0.00 ist. Kein Test und kein Szenario decken diesen Fall ab. |
| C-2 | Major | `src/__tests__/statement-generate-actions.test.ts:101-106`, `:133-151`, `:179-183`, `:291` | Die Deklarationen `covered`, `billed`, `statement` und `befristet` sind umformatiert, ausserdem fehlt die Leerzeile am Dateiende. Diese Zeilen haben mit der Anforderung nichts zu tun: Geändert werden musste nur der `fetch`-Stub. Das verstösst gegen «Nothing in the diff is unrelated» und gegen Gotchas, «Formatting» («format only your own lines»). |
| C-3 | Minor | `src/routes/reports/CostReconciliation.svelte:39`, `:56`; `src/lib/server/cost-reconciliation.ts:34-41` | Die Zeilen sind nach `row.label` geschlüsselt, und das Label ist nicht eindeutig. Wenn `namesById(fetch, 'categories')` fehlschlägt, liefert es stillschweigend eine leere Map. Dann heissen alle Positionen «Ohne Kategorie»: doppelte Schlüssel in `{#each}` (`each_key_duplicate`), und jeder Name ist falsch. Dasselbe passiert, wenn eine Kategorie «Total» heisst und so mit der Totalzeile zusammenfällt. Ist der Verteilschlüssel gelöscht (`severalKeys`), entsteht das Label «Hauswart ()». |
| C-4 | Minor | `src/__tests__/format-currency.test.ts:11` | Der Test «schreibt Tausender mit typografischem Apostroph» hält Verhalten fest, das der Basis-Commit schon zeigt, und kann deshalb nicht rot werden. Die Commit-Nachricht von 2ad4081 nennt ihn nicht als Pinning-Test (CLAUDE.md, Workflow 2). |

## C-1: Nicht umlagefähige Rechnungen ohne umlagefähige fehlen in der Vorschau

`PreviewReconciliations` filtert `rows.filter((row) => row.reconciliation?.positions.length)`. Ohne umlagefähige Rechnungen und ohne Abrechnungszeilen ist `positions` leer. Dann fällt die ganze `CostReconciliation` weg, auch der Block `extras`, der die Zeile der nicht umlagefähigen Rechnungen trägt. Issue #1126, «Decided (product owner)», «Empty», sagt: «a building without allocable invoices in the period shows no table, only the existing hint «Keine Rechnungen»; **the row of non-allocable invoices still shows when not zero**.» Der neue DOM-Test «zeigt ohne Positionen keine Kostenabstimmung» prüft nur `nonAllocable: 0`. Das Szenario «Ohne umlagefähige Rechnungen zeigt die Vorschau keine Kostenabstimmung» hat keine nicht umlagefähige Rechnung.

So lässt sich zeigen, dass es fehlschlägt: In `statement-wizard.dom.test.ts` die Vorschau mit `reconciliation = { positions: [], total: 0/0/0, managementFee: 0, nonAllocable: 500, … }` öffnen und den Text «Nicht umlagefähige Rechnungen (tragen Sie ganz)» mit «CHF 500.00» erwarten. Heute ist `preview-reconciliation-<id>` dann `null`. E2E: im Szenario für «Birkenhof» eine nicht umlagefähige Rechnung «Reparaturen» anlegen und «nennt die Kostenabstimmung der Vorschau für "Birkenhof" "Nicht umlagefähige Rechnungen (tragen Sie ganz)" mit "CHF …"» prüfen. Der Schritt scheitert, weil das Ziel fehlt. Zur Korrektur zeigt das Gebäude die Tabelle nur bei Positionen, die Zeilen `extras` aber auch ohne Positionen, und bekommt dafür ein neues Szenario oder eine neue Examples-Zeile.

## C-2: Fremde Formatierung im Diff

In `statement-generate-actions.test.ts` sind neben dem neuen `run-reconciliation`-Zweig mehrere Objektliterale von einer Zeile auf mehrere umbrochen, die der Diff sonst nicht anfasst: `covered`, `billed`, `statement` und `befristet`. Ausserdem ist die letzte Leerzeile entfernt. Laut Aufrufer-Vorgabe gilt Formatierung von unberührtem Code als Major. Die Korrektur ist trivial: diese Zeilen auf den Stand von `c4ae72c` zurücksetzen und nur die `fetch`-Zweige behalten.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt:
  - `bun run lint`, `bun run check`, `bun run fitness`, `bunx fallow audit`
  - `bunx vitest run --changed origin/main` (2500 pass vor dem letzten Refactoring, danach 5 Dateien mit 155 pass)
  - `cd backend && bun run type-check`
  - Backend-Tests `cost-reconciliation.pg.test.ts`, `api-contracts.pg.test.ts`, `statement-invoices.pg.test.ts`, `statement-run.pg.test.ts` (181 pass)
  - E2E chromium `statement-cost-reconciliation.feature` und `reports.feature` (16 pass), `statement-generate.feature` und `statement-management-fee.feature` (121 pass)
  - Axe- und Sprachzeilen `reports`, `report-reconciliation`, `statement-generate` (60 pass)
  - die Rot-Läufe der neuen Tests
- Nicht gelaufen, weder beim Aufrufer noch bei mir: die ganze Backend-Suite, Firefox und WebKit, Prettier auf den neu hinzugefügten Dateien.
- Firefox und WebKit kann ich auch nicht durch Lesen bestätigen: `reconciliationCells` nutzt `getByRole('columnheader')`. Die Tabelle ist unter `md` mit `hidden` ausgeblendet. In einem Projekt mit schmalem Viewport fielen die Spaltenköpfe weg, die Zellen per `data-testid` nicht. In `playwright.config.ts` habe ich nur die Projektnamen gesehen (chromium, firefox, webkit), keine Viewports.
- «Berichte» für eine Periode mit Abrechnungen, aber ohne umlagefähige Rechnungen und ohne Abrechnungszeilen: Das Screens-Seed hat so einen Fall (Seeblick 2023, `tests/e2e/fixtures/screens.ts:136`). Die Detailseite zeigt dann eine Tabelle mit nur der Totalzeile CHF 0.00. Ob «Empty» auch für «Berichte» gilt, wo es keinen Hinweis «Keine Rechnungen» gibt, sagt das Issue nicht eindeutig. Ich führe es nicht als Befund. Gelesen: `CostReconciliation.svelte`, `[buildingId]/+page.server.ts`.
- Ob Svelte 5 `each_key_duplicate` (C-3) auch im Produktions-Build wirft oder nur im Dev-Modus prüft, habe ich nicht nachgesehen. Falsche Namen bleiben in beiden Fällen.

Geprüft:
- Routen hinter `authMiddleware`, 404 `BUILDING_NOT_FOUND` mit Meldung `backend_building_not_found`
- Mapper und Vertragsnutzung, alle neuen Texte in allen vier `messages/*.json`, entfernte Schlüssel ohne Restverwendung
- Tokens und `src/lib/ui/Table`, Zeilenlink über die ganze Zeile mit `min-h-12`, Überschriftenebenen
- Screens-Zeilen in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`
- Spec-Änderungen nur in Szenarien, die auf `main` `@wip` sind, sowie in der Zeile von `statement-generate.feature` und dem entfernten Szenario «Berichte sind angekündigt» (#1126)
- Schritte rufen nur Tasks und Questions auf, Rot-Fähigkeit der übrigen neuen Tests, `formatCurrency` für negative Beträge
