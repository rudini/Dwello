# Review #1376 JWT_SECRET im Backend, Runde 1 (origin/main..f83420fc)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/__tests__/jwt-secret.test.ts:30-33 | Der Subprozess `bun -e` läuft mit `cwd` = `backend/` und lädt dort `.env`, `.env.production` und `.env.local` automatisch (Bun-Autoload; `env-files.test.ts:1-3` erlaubt `backend/.env` ausdrücklich als Override für JWT_SECRET). Hat ein Entwickler dort ein JWT_SECRET, startet der Import ohne Fehler und der Test wird lokal rot, obwohl der Code stimmt. In CI fehlen diese Dateien, deshalb grün. Abhilfe: `JWT_SECRET: ''` mitgeben (Autoload überschreibt gesetzte Variablen nicht, `''` fällt in `jwt.ts:7-9` in die Weigerung) statt die Variable zu entfernen. |
| C-2 | Minor | src/lib/server/jwt-config.ts:15 | Der Kommentar verweist für den Entwicklungs-Fallback weiter auf `backend/src/middleware/auth.ts`; durch den Diff liegt er jetzt in `backend/src/config/jwt.ts`. Der Kommentar sagt damit etwas Falsches. |

Geprüft: `jwt.ts` entspricht der BFF-Regel (fehlend in production -> Weigerung, < 32 Zeichen -> Weigerung, auch in der Entwicklung, wie im BFF); `auth.ts:23` liest beim Import, `app.ts:29` importiert die Middleware, das Backend-Image setzt `NODE_ENV=production` (`backend/Dockerfile:24`, `docker-compose.prod.yml`), E2E und Persona-Stack geben Secrets ab 32 Zeichen bzw. den Fallback; Weigerungstests würden ohne die Änderung fehlschlagen (Funktion neu, Import-Test gegen alten Fallback); kein UI-Text, keine API-Antwort, kein Szenario nötig («No scenario» nachvollziehbar); ponytail-review: Lean already (Duplikat zur BFF-Funktion über die Paketgrenze nicht teilbar).

## Nicht bestätigt

- `bun test src/__tests__/jwt-secret.test.ts src/__tests__/auth.pg.test.ts` (201 pass), `bun run type-check`, `bun run lint`, `bun run fitness -- --base origin/main` und `--structure`, `testcheck:audit`, `deepcheck:audit`: vom Aufrufer gemeldet.
- Rote Läufe der beiden Weigerungstests und des Import-Tests: vom Aufrufer gemeldet; per Lesen plausibel.
- Ob Buns Autoload eine gesetzte, leere Variable unangetastet lässt (Annahme in C-1): nicht ausgeführt.
