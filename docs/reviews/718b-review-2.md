# Code-Review 718b, Runde 2 (Delta fb99ac90d..925f407b4)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-12 | Minor | docs/architecture/fitness-functions.md:81; docs/architecture/utility-tree.md:124 | Beide Stellen sagen noch, für den Hinweis O1 gebe es kein Szenario, weil es «an der Uhr des Servers» hänge. Seit diesem Delta gibt es das Szenario «Ohne Sicherung seit mehr als einem Tag warnt die Übersicht» und den Zustand `backup-stale`. Beide Texte stimmen damit nicht mehr. |
| C-13 | Minor | backend/src/__tests__/backup.pg.test.ts:202-203 | Der Test liest die PID-Datei gleich nach der Ablehnung von `createBackup`. `encryptStream` scheitert mit dem leeren Schlüssel aber sofort nach dem `spawn`, also wohl bevor `sh` die Datei geschrieben hat. Fehlt die Datei, gilt `pid = 0`, `alive()` gibt `false` zurück und der Test ist grün, auch ohne `stopDump()`. Dass er rot war, hängt also davon ab, wie schnell die Shell startet. Abhilfe: zuerst auf die PID-Datei warten (die Shell schreibt sie, bevor sie zu `yes` wird), dann prüfen. |
| C-14 | Minor | backend/src/services/backup.service.ts:117-119, :145-152 | Scheitert das Verschlüsseln, wartet der `catch` nie auf `exited`. Findet `spawn` dann kein `pg_dump` (ENOENT), wird `exited` später abgelehnt, und niemand fängt das ab. Mit `stale` aus diesem Delta (der Schlüssel kann nicht verschlüsseln) tritt das bei jedem Lauf ohne `pg_dump` sicher ein. Ob Bun den Prozess dann beendet, siehe «Nicht bestätigt». |

Geschlossen: C-1, C-2, C-3, C-4, C-11 sowie 718a-review-3 C-1 und C-3.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt:
  - `bun run lint`, `bun run check` und `cd backend && bun run type-check`
  - `bun test` von compose-prod, backup.pg und backup-api.pg (43 Tests)
  - E2E chromium: einrichtung.feature und sicherung.feature (28)
  - die a11y- und Sprachzeilen `dashboard … backup-*` (4)
  - das Rot vor dem Fix: des neuen Szenarios O1, des Tests zu `pg_dump` (zu dessen Rot siehe C-13) und des Tests zu `db:migrate` (30.3 s)
- C-14, Folge in CI: Der E2E-Job läuft im Image `mcr.microsoft.com/playwright:…-noble`. Ein `apt install` für `postgresql-client` fehlt dort (.github/workflows/ci.yml:221-284), also gibt es dort vermutlich kein `pg_dump`.
  - Die frische Installation (playwright.config.ts:217-230, `BACKUP_DIR`) sichert nach jeder Bestätigung und bei jedem Takt des Zeitplans.
  - Nicht ausgeführt habe ich zweierlei: ob Bun bei einem fehlenden Programm `error` asynchron meldet und ob es bei einer nicht abgefangenen Ablehnung den Prozess beendet. Der Backend-Code hat keinen Handler `process.on('unhandledRejection')` (grep in backend/src).
  - Bricht das Backend der frischen Installation ab, scheitern in CI die folgenden Szenarien und Looks dieser Installation.
  - Auch bei gültigem Schlüssel hängt es nur vom Timing ab, ob `exited` abgefangen wird, bevor die Ablehnung kommt. Das gab es schon vor diesem Delta (Runde 1, «Nicht bestätigt»).
- `allowExitOnIdle`: Dass der Server weiterläuft, habe ich nur gelesen (Port von Elysia und `setInterval` in `startBackups` halten die Event-Loop offen), nicht ausgeführt.
- Datum im Szenario O1: `swissDate(inDays(-2))` auf dem Rechner der Tests gegen `formatDate(now() - 2 days)` der Seite. Ob beide kurz nach Mitternacht denselben Tag ergeben, habe ich nicht geprüft.

Geprüft:
- Rebase: Beide Hunks von C-3 sind weg (`git diff 1a1fadcaa fb99ac90d -- backend/src/services/backup.service.ts`).
- C-1: Beide Bestätigungen warten auf `backup-confirmed`. `BackupNotice` zeigt die Bestätigung bei `ok`.
- C-2: Szenario, `stateMeanings`, beide a11y-Features und `inTurn` mit dem Zurücksetzen danach. `cleanUp` und der Fixture-Start setzen die Sicherung zurück. Wegen des Schlüssels, der nicht verschlüsseln kann, beendet der Zeitplan den Zustand nicht.
- Kill von `pg_dump`: `exec yes` behält die PID.
- C-4: `allowExitOnIdle` mit Test über `scripts/migrate.ts`.
- 718a C-1: Der Ausschnitt endet bei `restore:`, und Compose ordnet backend, restore, postgres.
- 718a C-3: `secretsDir: string`, und alle drei Aufrufer übergeben einen Ordner.
- C-11: Der Vermerk steht im Commit.
- Screenplay-Schichten der neuen Steps, Tasks und Questions.
- Die Texte stehen schon in `messages/*.json`, das Delta braucht keine neuen.

## Triage

- C-12: fixed (fitness-functions.md, utility-tree.md).
- C-13: fixed; the test waits up to 2 s for the pid and went red (60 s timeout) with the kill taken out.
- C-14: fixed (`stopDump` also settles the exit); test «lässt ohne pg_dump keine unbehandelte Ablehnung zurück …», seen red.
