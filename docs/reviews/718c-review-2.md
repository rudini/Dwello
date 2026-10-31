# Code-Review 718c, Runde 2 (Abschlussrunde, 0e2933501..68c970759 ohne docs/reviews und docs/design/personas)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-5 | Minor | docs/api-specification.md:51 | `POST /api/v1/backup/confirm` nennt weiterhin nur «another code **422** `BACKUP_CODE_MISMATCH`». Die neue Ablehnung **422** `BACKUP_CODE_EXPIRED` fehlt: Ein Ersatzcode, der nach 30 Minuten noch unbestätigt ist, wird jetzt damit abgelehnt (`backup.service.ts:343-345`, `routes/backup.ts:15`). Damit beschreibt die Spezifikation das Verhalten für diesen Fall falsch. |

Geschlossen: C-1, C-2 (Sperre), C-4 (Runde 1). C-2 (BFF-Weitergabe von 403/423) und C-3 bleiben laut Triage der Runde 1 als Minor in deren Bericht.

## Nicht bestätigt
- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, die Backend-Tests `backup.pg.test.ts`, `backup-new-code.pg.test.ts`, `backup-api.pg.test.ts` und `api-contracts.pg.test.ts`, die vitest-Tests i18n/typography/backend-codes/design-guard/tokens/backup-new-code-page/settings, E2E chromium `sicherung.feature` (21) sowie die a11y- und Sprachzeilen von `config` und `config-backup` (21). Ebenfalls vom Aufrufer gemeldet: Rot gesehen vor dem Fix für die Szenariozeile `backup_new_keep_sheet`, die Prüfung von `BACKUP_CODE_EXPIRED`, die beiden Fokuszeilen und den Serialisierungstest (2 von 3 Läufen). Die volle vitest- und Backend-Suite ist seit 1924f765a noch nicht gelaufen.
- Für die Ablehnung `BACKUP_CODE_EXPIRED` gibt es kein Szenario. Das ist zulässig, weil die Serveruhr im E2E-Stack nicht verstellbar ist (`tests/e2e/CLAUDE.md`, «No scenario»; die E2E-Schicht hat keinen Zugriff auf `backup_codes`). Gefordert ist dann aber `No scenario: <Grund>` im Pull Request (Fachreview 718c-2 V-1 (c)). `implementation_plan.md` hat keine Session und der Pull Request existiert noch nicht, deshalb konnte ich das nicht prüfen. Die Anzeige läuft über den generischen 422-Pfad von `confirmBackup` (`src/lib/server/backup.ts:38-41`, `backendMessage`). Einen DOM-Test eigens für diesen Code gibt es nicht.
- Der Umbruch der Karte in `ConfigLinks.svelte` (`min-w-0 break-words`) hat keinen automatischen Test. Belegt ist er nur durch den Personenlauf `helga-718c-2.md:29`.
- Ob der Serialisierungstest ohne `createBackup`-Kette zuverlässig rot wird, lässt sich durch Lesen nicht entscheiden. Er hängt vom Timing ab, der Aufrufer meldet 2 von 3 Läufen.

Geprüft: alle 13 geänderten Dateien. Zum Ablaufpfad: Beim ersten Code (es gibt noch keinen bestätigten) liefert `pendingCode` die Zeile ohne Altersgrenze, `BACKUP_CODE_EXPIRED` kann dort also nicht fälschlich kommen. Nach der Bestätigung sind keine unbestätigten Zeilen mehr da, also bleibt es bei `MISMATCH`. Weiter geprüft: neuer Code im `refused`-Mapping und `backend_backup_code_expired` in allen vier Sprachen, Wortlaut gemäss der Tabelle der Fachreview 718c-2 (auch V-2 «rental contracts»). Der Fokus nach dem Redirect folgt demselben Warten wie `focusFirstError`. Die Szenarien sind neu (auf `main` nicht vorhanden), die Steps nutzen nur Fragen (`FocusedElement`). Der Sperre-Test wäre ohne die 423-Abbildung beim richtigen Passwort rot (200).

## Triage

- C-5: fixed (BACKUP_CODE_EXPIRED in api-specification.md).
- No scenario for BACKUP_CODE_EXPIRED: the 30 minutes need the server clock (tests/e2e/CLAUDE.md, «No scenario»); backup-new-code.pg.test.ts covers it. Named in the pull request.
