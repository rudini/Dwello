# Code-Review #650, Runde 2 (Delta 894bd44a..c834a06a)

Geschlossen: C-1

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-2 | Minor | src/__tests__/env-example.test.ts:19-20 | Das Muster zählt immer noch manche Stellen als Lesen, die nur setzen oder etwas anderes meinen: `ENV X=wert` im Dockerfile ist ein fester Wert und keine Übernahme aus `.env`. Das ist dieselbe Art Fehler wie `- PUBLIC_APP_NAME=Dwello` in Compose, und der Kommentar auf Zeile 19 nennt es trotzdem «a read». Auch `${X}` in einem TS-Template-Literal mit einer gleichnamigen Konstante passt auf das Muster (`backend/scripts/mail-catcher.ts:38` `${SMTP_PORT}`). Heute besteht keine Variable nur dank einer solchen Stelle: `NODE_ENV` wird gelesen (`src/hooks.server.ts:29`, `backend/src/index.ts:33`) und `SMTP_PORT` ebenfalls (`backend/src/mail/smtp.ts:11`). Eine künftige Variable, die nur ein `ENV X=…` im Dockerfile hat, käme aber durch. |

## Nicht bestätigt

- `cd backend && bun test src/__tests__/compose-prod.test.ts`, eslint und Prettier auf der Testdatei: vom Aufrufer gemeldet. `bunx vitest run src/__tests__/env-example.test.ts` habe ich am Commit c834a06a selbst wiederholt: grün.
- Dass der Test vor dem Entfernen genau bei `PUBLIC_APP_NAME` und `IBAN` rot war, meldet der Aufrufer. Beim Lesen ist das plausibel: Ein `git grep -E` mit dem neuen Muster findet für die beiden Namen nichts. Für jede der 20 noch gesetzten Variablen findet es eine echte Lesestelle (`env.X`, `process.env.X`, `Bun.env.X`) oder eine Übernahme `${X…}` in `docker-compose.prod.yml`.
- Ob CI beim Lauf von vitest ein Git-Checkout hat (der Test ruft `git grep` auf): Die Workflows habe ich nicht gelesen. Das ist unverändert seit Runde 1.

Geprüft: Beide Variablen sind aus `.env.example` entfernt, `IBAN` mit ihrem Abschnittskommentar. Kein README oder Dokument sagt, man solle `IBAN` oder `PUBLIC_APP_NAME` in `.env` setzen (`git grep` über `*.md`: nur die IBAN aus den Einstellungen bzw. der Datenbank). Das Delta enthält nichts, was nicht zur Anforderung gehört.
