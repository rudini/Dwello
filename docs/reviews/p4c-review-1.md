# Code-Review #788 Teil 4c, Runde 1 (eb3eb1d3..8d33d512)

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Minor | backend/src/services/statement.service.ts:91 | Der Kommentar sagt «else null while the Zahlungsfrist runs», `reminderDue` ist aber für jede nicht überfällige Abrechnung `null` (Entwurf, bezahlt, erledigt; so pinnt es auch der Test «nennt keine bezahlte Abrechnung»). `docs/api-specification.md` sagt es richtig («`null` unless overdue»). |
| C-2 | Minor | src/__tests__/buildings-i18n.test.ts:143 | Die Diff entfernt `reminderAfterDays` aus `OverviewInput`, lässt es aber in dieser Test-Eingabe stehen. Dort ist es jetzt toter Code, und der Typ-Check meldet es nicht, weil das Objekt nicht als `OverviewInput` annotiert ist. |

Keine Blocker, keine Majors.

Geprüft:
- `reminderWaits` entspricht dem entfernten `waiting` im BFF Fall für Fall:
  - `reminderToSend`: gleich.
  - `nextReminderFrom > today`: gleich.
  - `!refund` ist dasselbe wie `Number(balance) >= 0`.
  - `daysFrom(today, deadline) >= -N` ist für UTC-Daten dasselbe wie `deadline >= daysAfter(today, -N)`.
  - Der alte Filter `paymentDeadline < today` entspricht `effectiveStatus === 'overdue'`.
  - Die Mahnfrist hat in beiden Fassungen die Vorgabe 14: `getTypedConfig` gegenüber `?? 14`.
  - Ab der 3. Mahnung ist `nextReminderFrom` null, dann gilt die Mahnfrist, wie zuvor.
  - Lädt die Liste nicht, wird nichts abgezogen, wie zuvor.
- `olderThanFiveYears` ist dieselbe Rechnung wie `FIVE_YEARS_AGO`. Der Aufruf mit `swissToday()` ist durch das Szenario zur Verjährung in `dashboard.feature` abgedeckt.
- Jeder gelöschte BFF-Fall hat einen Backend-Test:
  - Mahnfrist 14/15 Tage, mit Einstellung 7 Tage.
  - Rückerstattung.
  - #107 an der Grenze: `nextReminderFrom` gleich heute oder morgen.
  - #449.
  - Fünf Jahre, mit Grenztag und 29. Februar.
- Die neuen Tests sind beim Lesen ohne die Änderung rot (`undefined` ist nicht `null`/`false`, der Export fehlt).
- API-Verträge: `statements.json` (Entwurf, `null` stimmt) und `statements-outdated.json` sind ergänzt, `docs/api-specification.md` auch.
- Die Diff enthält keine Texte, keine UI-Zustände, kein E2E und nichts Fremdes.
- ponytail-review: Lean already. Ship. net: -0 lines possible.

## Nicht bestätigt

- Alle vom Aufrufer gemeldeten Prüfungen, nicht neu ausgeführt («vom Aufrufer gemeldet»):
  - lint, check, backend type-check
  - `bunx vitest run` (3632)
  - Backend-Tests (174)
  - E2E `dashboard`/`statement-reminder` (63)
  - fitness `bff-decision` (8)
  - Prettier
  - die gemeldeten Rot-Läufe
- Der JSON-Typ von `reminderDue`: Der Vertragstest prüft ihn nicht, weil `null` dort nicht verglichen wird (`api-contracts.pg.test.ts:37`). Dass ein Boolean kommt, zeigt nur `statement-reminder-due.pg.test.ts`.
