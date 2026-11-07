# Code-Review #1099, Runde 2 (Delta 04a7c3d..8aa99e4)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|

Keine offenen und keine neuen Befunde.

Geschlossen: C-1, C-2

## Nicht bestätigt

- Diese Checks auf 8aa99e4 sind vom Aufrufer gemeldet, nicht von mir gelaufen: `bun run test:coverage` (Frontend, 4354 Tests, Untergrenzen gehalten).
- Ebenfalls vom Aufrufer gemeldet: E2E `statement-generate.feature` in Chromium, 104 bestanden. Das lief auf 04a7c3d. Das Delta ändert in `tests/e2e/targets/statement-generate.ts` nur die Lage eines Kommentars, darum gilt der Lauf auch für 8aa99e4.

Geprüft: Das Delta umfasst zwei Dateien. In `docs/api-specification.md:140` stehen «`invoicesWithoutServicePeriod`» und «the first two lists» nicht mehr. `lateInvoices` hat jetzt seine eigene Form und die Ausnahme für den Tankbestand. Das stimmt mit `invoice-completeness.service.ts:383-396` überein. `git grep` findet `invoicesWithoutServicePeriod` nur noch im Test `not.toHaveProperty`, in den Reviews und im Plan. Der Kommentar in `tests/e2e/targets/statement-generate.ts:92` steht jetzt über `lateInvoices`. Gegenüber origin/main ist das nur der Kommentar über dem richtigen Target, ohne den entfernten Teil «under a year».
