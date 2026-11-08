# Code-Review Runde 5, #1311/#1312 (PR #1341), CI-Fix 874492a..29e873b

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `backend/src/routes/dashboard.ts` `portfolio()`: dieselben sieben Zählungen wie vorher (total ohne Filter, `existing` = `apartmentStatus <> 'discontinued'`, je Mietstatus `= status`), jetzt als `count(*) filter (where …)` in einer Abfrage auf `apartments`; Status als Bind-Parameter gegen den `case`-Ausdruck (Text) ist gleichwertig zum früheren Literal; `occupancyRate` weiterhin über die bestehenden Wohnungen; `Number(…)` fängt das bigint-als-String von `count(*)` ab; Antwortform unverändert. `countApartments` bleibt in Gebrauch (Belegung je Liegenschaft, Zeilen 71–72), kein toter Code; das Muster entspricht `building.service.ts:72`. Kein Verhaltenswechsel, daher kein neuer Test und kein Rot nötig; nichts Fremdes im Diff.

## Nicht bestätigt

- vom Aufrufer gemeldet: Backend-Type-Check; pg-Tests apartment-status, dashboard, dashboard-tasks, api-contracts (152 bestanden); lint; `bun run fitness:p2` Exit 0 (Abfragezahl /api/v1/dashboard wieder innerhalb Ratchet 68). Nicht selbst ausgeführt.
