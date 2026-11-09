# Code-Review #1376, CI-Fix (Runde 1 dieses Slices), Delta 99b326bd..7baa9a62

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine Befunde |

Geprüft: Die Anforderung ist erfüllt. `backend/src/config/jwt.ts:6-11` wirft im Betrieb ohne `JWT_SECRET` und in jedem Modus bei weniger als 32 Zeichen, wie die BFF (`src/lib/server/jwt-config.ts:18-25`). Der Aufruf steht in `backend/src/index.ts:16`, also vor `testConnection`, `app.listen`, `announceSetupCode` und `startBackups`. Zu den Nebenwirkungen der Imports: Der `Pool` in `db/connection.ts:16` verbindet erst bei der ersten Abfrage, und das einzige `setInterval` (`backup.service.ts:280`) startet erst in `startBackups`. Bevor der Fehler auf oberster Ebene den Prozess beendet, gibt es also weder eine Verbindung noch einen Timer. Das gilt für die Verweigerung und für den Subprozess-Test (`jwt-secret.test.ts:33-41`: leerer Wert statt gelöscht, damit `.env` ihn nicht füllt; `PORT=0`; Timeout). Der Produktionsstart läuft über `bun run src/index.ts` (`docker-compose.prod.yml:93`, `backend/Dockerfile:53`) und damit durch die Prüfung. `init-secrets.sh` erzeugt 48 Zeichen. E2E und die Test-Mocks nehmen den Ersatzschlüssel oder mindestens 32 Zeichen, die Verschärfung «kurz in jedem Modus» bricht also keinen Lauf. Der Ersatzschlüssel in `middleware/auth.ts:21` ist im Betrieb erst erreichbar, nachdem `checkJwtSecret` bestanden hat, und dann gilt `JWT_SECRET` aus der Umgebung; der Rückfall ist dort nicht erreichbar und damit vertretbar. Ponytail-Review: nichts zu streichen (eine Funktion mit 4 Zeilen, ein Aufruf, `env`-Parameter nur für die Unit-Tests). Rot: Die drei Verweigerungstests prüfen Wurf und Meldung, der Subprozess-Test zusätzlich den Aufruf in `index.ts`; sie würden ohne die Änderung scheitern.

## Nicht bestätigt

- Testläufe (vom Aufrufer gemeldet): `bun test jwt-secret.test.ts` (5 pass), `auth.pg.test.ts` (197 pass), `fitness --base origin/main` und `--structure` (0 Fehler), lint, backend type-check, testcheck/deepcheck-Audits, Rotlauf gegen einen No-op-Stub.
- `No scenario: <reason>` im PR-Text: Eine Startverweigerung kann der E2E-Stack nicht erzeugen. Den PR-Text habe ich nicht gesehen; geprüft habe ich nur die Commit-Nachricht 7baa9a62, die keinen solchen Vermerk enthält.
- Ob Bun eine leere, aber gesetzte Variable aus der Prozessumgebung nicht mit dem Wert aus `backend/.env` überschreibt (die Annahme des Kommentars in `jwt-secret.test.ts:36`): nur durch den gemeldeten grünen Lauf belegt.
