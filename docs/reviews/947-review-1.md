# Code-Review Slice 947/956, Runde 1 (f78a89e7b..64585f2a9)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/e2e/tasks/sicherung.ts:42-43 | Der neue Task `confirmFirstGroupOfShownCode` ist zwischen das JSDoc von `confirmShownBackupCode` («Types the shown code again … waits for the overview») und dessen Funktion eingefügt. Jetzt stehen zwei JSDoc-Blöcke über `confirmFirstGroupOfShownCode`; der obere beschreibt etwas Falsches (der Task wartet auf keine Übersicht), und `confirmShownBackupCode` hat sein Doc verloren. Den alten Kommentar zurück über `confirmShownBackupCode` setzen. |

Keine Blocker, keine Major.

Geprüft: Backend `confirmBackupCode` (Reihenfolge Verfall → leer → unvollständig → Mismatch, `of` = Länge des angezeigten Codes, ohne offenen Code bleibt es beim Mismatch), Ablehnungs-Map 422, `CodedError` mit params bis `backendMessage` in der gemeinsamen BFF-Funktion `confirmBackup` (beide Seiten), Meldungen in allen vier `messages/*.json` (fr mit NBSP vor «:»), api-specification.md; /config/backup mit `?confirmed`: Bestätigung und Link-Button `/config` statt Formular, Fokus-Selektor trifft die Bestätigung weiter, Token und `src/lib/ui`-Komponenten, 48 px über `Button`; a11y-Zeile `new-code-confirmed` in screens.json, accessibility.feature:248 und sprachen-bildschirme.feature:249 vorhanden, neue Meldungen nutzen den bestehenden Zustand `backup-error`/`new-code-error` ohne eigene Bedienelemente; vier neue Szenarien ohne `@wip`, beim Lesen auf dem Basis-Commit rot (vorher Mismatch-Text bzw. Formular mit «Neuen Code erstellen», kein Link `backup-new-back-link`); die negative Prüfung `newCodeOffered` hat ihren positiven Anker (`confirmNewShownCode` wartet auf die Bestätigung); Steps rufen nur Tasks und Questions auf; pg-Tests auf dem Basis-Commit rot (`BACKUP_CODE_MISMATCH`); kein Contract nötig, weil kein Frontend-Test die neuen Antworten liest; nichts ohne Bezug zur Anforderung; ponytail-review ohne Befund.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, Backend `bun run type-check`, `bunx vitest run --changed origin/main` (493), backend-codes- und backup-new-code-page-Vitest, Backend `bun test src/__tests__/backup*` (49), `bun run fitness`, E2E `sicherung.feature` in Chromium (25), accessibility.feature und sprachen-bildschirme.feature für backup/config-backup in Chromium (24).
- Die rot gesehenen Läufe (Szenarien als `@wip`, pg-Tests) habe ich nur beim Lesen gegen den Basis-Commit beurteilt, nicht selbst gesehen.
- Ob die a11y-Läufe den Zustand `new-code-confirmed` jetzt mit dem neuen Button zeigen: nur über `screens.json:816` (`?confirmed`) und den Seitencode nachvollzogen.
