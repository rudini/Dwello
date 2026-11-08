# Code-Review 707close, Runde 1 (ea0f7a0..3ec954f)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `backend/demo/demo-data.sql:232-236` (alle 84 Demo-Rechnungen haben IDs `c000000_-…`, auch die per `UPDATE … WHERE id IN` geänderten von Zeile 229 davor; Trigger `invoices_updated_at` aus `migrations/0001_schema.sql:351` wird nur für dieses UPDATE ausgeschaltet; spätestes Rechnungsdatum 2026-02-19 + 7 Tage liegt vor dem frühesten Versand 2025-04-14 der Läufe, die es verrechnen, bzw. vor 2026-09-28 und vor heute; erneutes Laden setzt dieselben Werte), `backend/src/__tests__/demo-data.pg.test.ts:129-140` (Join über `i.id::text` auch für den Brennstoffvorrat; ohne das UPDATE wären `created_at`/`updated_at` der Ladetag und damit nach den auf 2025-04-14/2026-09-28 datierten versandten Abrechnungen, der Test also rot; ohne das Ausschalten des Triggers wäre `updated_at` jetzt, also ebenfalls rot); `recordedAfter` vergleicht `createdAt` und meldet damit für keine verrechnete Demo-Rechnung eine spätere Erfassung; «No scenario» ist begründet (CLI-Skript); keine UI-Texte, Kontrakte oder E2E-Dateien im Diff.

## Nicht bestätigt

- `cd backend && bun test src/__tests__/demo-data.pg.test.ts` 18 pass, rot mit dem SQL von HEAD~1: vom Aufrufer gemeldet.
- lint, check, fitness, backend type-check, Prettier (auf ea0f7a0): vom Aufrufer gemeldet; auf 3ec954f nicht erneut gemeldet, betroffen sind nur die zwei Dateien oben.
