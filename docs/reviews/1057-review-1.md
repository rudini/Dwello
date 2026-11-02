# Code-Review #1057, Runde 1 (2dec65b18^..2dec65b18)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: SQL in `backend/scripts/e2e-sent-days-ago.ts:18`. Alle Umrechnungen sind explizit (`timestamp AT TIME ZONE 'UTC'` → timestamptz → Zürcher Wandzeit → minus Tage auf `timestamp` ohne Zone, also reine Kalenderarithmetik → `AT TIME ZONE 'Europe/Zurich'` → `AT TIME ZONE 'UTC'`), damit unabhängig von der TimeZone der Session. `AT TIME ZONE` bindet stärker als `-`, die Klammerung stimmt also. Fällt das Ergebnis in die Lücke im März oder die Überlappung im Oktober, verschiebt Postgres nur die Uhrzeit um eine Stunde; der Kalendertag bleibt, und der Schritt prüft den Tag. Spaltentyp: `schema.ts:610` `timestamp('sent_at')`, im Test jetzt `timestamp`. Der Testfall 31.10. 22:12 UTC (23:12 MEZ) über die Zeitumstellung ergibt 21.09. 23:12 Zürich und trifft den gemeldeten Fehler (+2 h über Mitternacht); der alte Ausdruck liefert auf `timestamp` einen anderen Wert, der Test ist also ohne die Änderung rot. Anzeige: Das Backend liest `sent_at` als UTC (`statement.service.ts:71`, `tenant-anonymise.service.ts:20` mit `at time zone 'UTC'`). `formatDateTime`/`formatDate` (`src/lib/utils/format.ts:44-64`) zeigen in Europe/Zurich, `inDays` (`tests/e2e/fixtures/dates.ts:2`) rechnet den Schweizer Kalendertag. Andere E2E-Seeds: Nur `e2e-backup-reset.ts:14` schreibt Zeitstempel (`now() - interval`), und zwar in `backup_codes.confirmed_at/created_at`; beide sind `withTimezone: true` (`schema.ts:687,689`), dort also korrekt. Kein anderes Skript und keine E2E-Fixture schreibt per SQL in eine `timestamp`-Spalte. Szenario unverändert, nichts Fremdes im Diff (der Plan ist eine Sitzungsnotiz).

## Nicht bestätigt

- pg-Test vor der Änderung rot («Expected 2026-09-21 23:12, Received 2026-09-22 01:12») und danach grün: vom Aufrufer gemeldet. Beim Lesen plausibel, selbst nicht ausgeführt.
- `bunx playwright test --project=chromium -g "erneut per Brief"`, 4 bestanden: vom Aufrufer gemeldet.
- Lint, type-check und Prettier: laut Aufrufer noch nicht gelaufen (Abschlussrunde).
- Dass Drizzle (node-postgres) `timestamp` ohne Zone als UTC liest (`value + '+0000'`): Im Worktree fehlt `node_modules`, im Drizzle-Quellcode habe ich es nicht nachgesehen. Das Backend-SQL oben und das Fehlerbild im Issue (Anzeige +2 h) sprechen dafür.
