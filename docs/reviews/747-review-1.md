# Code-Review Slice 747 (#747, #753, #719), Runde 1

Bereich: `git diff 8b7b5da^ 8b7b5da` (ein Commit, `fix(docker): publish only the web app's port`).

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | README.md:291 | Sagt weiterhin «so a backend published on the host (see `docker-compose.prod.yml`) stays reachable with it until then». Seit dem Commit veröffentlicht die Compose-Datei das Backend nicht mehr, und mit dem Schliessen des Ports ist #747 behoben. Der Satz ist jetzt falsch und widerspricht `docs/installation.md` Abschnitt 8. |
| C-2 | Minor | docs/architecture/risks-and-tradeoffs.md:66 | RI-U1-4 «`ollama/ollama:latest` ist nicht gepinnt» stimmt nicht mehr, denn der Commit pinnt das Image auf 0.40.11 (#719). Das Risiko bleibt als offen stehen. |
| C-3 | Minor | deploy/demo/docker-compose.yml:22,26,34 | `ports: !reset []` bei `backend`, `postgres` und `ollama` setzt nichts mehr zurück, weil diese Dienste in `docker-compose.prod.yml` keine Ports mehr haben. Diese Konfiguration ist durch die Änderung tot. Nur der Eintrag bei `frontend` wirkt noch. |

Keine Blocker, keine Major.

Geprüft:
- Nur das Frontend veröffentlicht einen Port (3000). Backend, PostgreSQL und Ollama hängen ohne Port weiter an `dwello-network`.
- `BACKEND_URL=http://backend:3001`, `LLM_LOCAL_URL=http://ollama:11434/v1` und `postgres:5432` in `DATABASE_URL` bleiben netzintern. Die Healthchecks laufen im Container (localhost).
- Bei `deploy/demo/reset-demo.sh` (`compose run` im Netz) und `update.sh` hängt nichts an den geschlossenen Ports. Caddy auf dem Host erreicht `localhost:3000` (Abschnitt 7) weiterhin über den veröffentlichten Port 3000.
- Das Backend prüft `ALLOWED_EMAILS` nicht selbst, und der Commit ändert das Backend nicht.
- Die Regex des neuen Tests liefert `secrets`, `frontend`, `backend`, `postgres`, `ollama`, dazu `dwello-network` und die drei Volumes, alle ohne `ports`. Der auskommentierte nginx-Block und die Top-Level-Schlüssel werden nicht erfasst.
- Beide neuen Tests wären auf dem Basis-Commit rot: Dort haben drei weitere Dienste `ports:`, und `:latest` passt nicht auf `\d+\.\d+\.\d+`. Nachgelaufen: 13 pass.
- `src/hooks.server.ts` prüft `isAllowed` bei jeder Anfrage, `/api/` eingeschlossen. Sitzungen sind reine JWTs (der `refresh_token` in `oauth.ts` ist der von Google), also beendet ein neues `JWT_SECRET` alle Sitzungen.
- `openssl rand -hex 32` liefert 64 Zeichen, das Minimum ist 32.
- `init-secrets.sh`: Ein Wert in `.env` gewinnt. `--force-recreate` lässt `secrets` neu laufen und startet Frontend und Backend neu. `db_password` hat Modus 444 und ist für den Benutzer `bun` lesbar.
- `$new` ist Hex, hat also keine Quoting- und keine URL-Probleme in `DATABASE_URL`.
- Docker Hub führt `ollama/ollama:0.40.11` als neuesten stabilen Tag, mit amd64- und arm64-Image (die Demo-VM ist ARM). Das ist neuer als die Mindestversion 0.12.7 aus dem README.

## Nicht bestätigt

- Dass `qwen3-vl:8b-instruct` unter Ollama 0.40.11 tatsächlich lädt und Rechnungen liest. Ich habe nur das Tag auf Docker Hub geprüft. Die GitHub-Release-Notes von ollama/ollama waren für diese Sitzung gesperrt (HTTP 403).
- `psql -U dwello` im Postgres-Container ohne Passwort. Das beruht auf `local trust` in der Standard-`pg_hba.conf` des offiziellen Images. Ich habe es nur aus dem Wissen über das Image beurteilt und nicht ausgeführt.
- Welcher Wert gilt, wenn `.env` einen Schlüssel doppelt enthält (Anhängen statt Ersetzen). Die Anleitung verlangt «or replace an existing … line». Nicht ausgeführt.
- Vom Aufrufer gemeldet:
  - `docker compose -f docker-compose.prod.yml config --quiet`, auch mit dem Demo-Overlay (nur 80/443)
  - der Lauf von `docker/init-secrets.sh` im Temp-Verzeichnis
  - type-check, lint
  - Prettier auf `docs/installation.md`
- Nachgelaufen: `cd backend && bun test src/__tests__/compose-prod.test.ts` (13 pass).
