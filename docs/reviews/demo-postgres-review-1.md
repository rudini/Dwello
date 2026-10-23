# Review demo-1: demo.dwello.ch startet seit #577 nicht (894e710)

Umfang: Der Bereich `9b5db11..894e710` enthält ausser 894e710 nur Commits, die schon auf `origin/main` liegen (Elternteil `cbc8015` = Merge von PR #641, `git branch -r --contains cbc8015` → `origin/main`). Geprüft wurde deshalb der Slice-Commit 894e710 (4 Dateien).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `deploy/demo/docker-compose.yml` (Postgres ohne `POSTGRES_PASSWORD`; die Pflichtprüfung `:?` liegt in `secrets` und überschreibt den Listeneintrag `POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-}` aus `docker-compose.prod.yml` per Schlüssel; `init-secrets.sh` schreibt einen gesetzten Wert immer nach `db_password`, damit behält die bestehende Demo-Datenbank ihr Passwort); `reset-demo.sh` (das `$(cat …)` steht in einfachen Anführungszeichen und wird erst im Container ausgewertet; das Volume `dwello_secrets:/run/dwello:ro` kommt auch mit `compose run --no-deps` aus der Service-Definition; `e2e-db.ts` und `demo-data.ts` lesen nur `DATABASE_URL`, `ENCRYPTION_KEY` wird in `ki-settings.service.ts` erst beim Aufruf gelesen, nicht beim Import); beide neuen Tests schlagen auf dem Basis-Commit fehl (Postgres-Abschnitt enthielt `POSTGRES_PASSWORD`, Reset-Skript ohne `DATABASE_URL`); `service()` schneidet bei 2-Leerzeichen-Einrückung mit Wortzeichen, Kommentare und tiefere Zeilen trennen nicht; Commit-Nachricht mit `No scenario: <reason>`, passend zu `tests/e2e/CLAUDE.md` (E2E-Stack fährt die Demo-Compose-Dateien nicht); `implementation_plan.md`-Eintrag; keine UI-Texte, keine Sprachdateien, kein E2E-Code betroffen; `deploy/demo/.env.example` und `docs/installation.md` bleiben zutreffend.

## Nicht bestätigt

- Start der Demo und nächtlicher Reset in echten Containern: kein Docker-Daemon; laut Aufrufer vom Product Owner auf der Demo-VM bestätigt (nur für den Start und die beiden Änderungen, nicht für einen Reset-Lauf) – nicht selbst geprüft.
- `docker compose … config` (nur `POSTGRES_PASSWORD_FILE` bei Postgres, leeres Passwort bricht in `secrets` ab): vom Aufrufer gemeldet.
- `cd backend && bun test src/__tests__/compose-prod.test.ts` (11 pass, beide neuen Tests rot gesehen), `cd backend && bun run type-check`, `bun run lint`, `bunx vitest run src/__tests__/open-work.test.ts`: vom Aufrufer gemeldet, nicht erneut ausgeführt.
