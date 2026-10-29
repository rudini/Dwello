# Review 718a, Runde 3 (Schlussrunde, Delta 6b8d19986..8722603b8)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/__tests__/compose-prod.test.ts:12, 28-33 | `backendService` reicht von `\n  backend:` bis `\n  postgres:` und enthält damit auch den Dienst `restore`. Fehlt die Zeile `image:` beim Backend, findet `image(backendService)` das `image:` von `restore`, und beide `expect` bleiben grün. Genau dieser Fall soll abgesichert sein: `up -d --build` würde dann ein Image ohne Tag bauen, und `restore` liefe mit einem alten oder fehlenden `dwello-backend:local`. Abhilfe: den Backend-Ausschnitt bei `\n  restore:` enden lassen. |
| C-2 | Minor | backend/scripts/restore.ts:17-21 | Die neue Ablehnung ohne SECRETS_DIR (Punkt 2) hat keinen Test. Kein Test startet das Skript, und der Aufrufer meldet Tests mit Rot nur für die Punkte 1, 3 und 4. |
| C-3 | Minor | backend/src/services/backup.service.ts:145, 178 | `secretsDir: string \| undefined` und `if (secretsDir)` sind nach Punkt 2 toter Code. Alle Aufrufer übergeben einen Ordner: `scripts/restore.ts` (bricht jetzt vorher ab), `tools/fitness/restore-check.ts:106` und alle Tests. Der Fall ohne Ordner kommt nicht mehr vor. |

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `cd backend && bun run type-check` und `bun test src/__tests__/backup.pg.test.ts src/__tests__/compose-prod.test.ts` (34 + 15) sind auf 8722603b8 grün. Ebenfalls vom Aufrufer gemeldet: die neuen Tests für die Punkte 1, 3 und 4 waren vor dem Fix rot. Beim Lesen sehe ich dasselbe: Mit dem alten Code entstehen `../ausserhalb` und `db_password`. Die alte `.part`-Datei blieb liegen, weil das Aufräumen erst nach einem erfolgreichen `pg_dump` lief. Beide Images hatten zuvor kein `image:`, also scheitert `toBeDefined`.
- Ob der vorgetäuschte `pg_dump` über den geänderten `process.env.PATH` greift, also ob Bun bei `spawn` die PATH-Auflösung zur Laufzeit macht: nur gelesen, nicht ausgeführt.
- Docker: Nicht gebaut. Ebenfalls nicht geprüft, ob `docker compose --profile restore run --rm restore` auf einer frischen Installation vor dem ersten `up` ein klare Meldung liefert, weil `restore` jetzt keinen eigenen `build` mehr hat (vorher gebaut werden muss `backend`). docs/installation.md beschreibt die Wiederherstellung mit dem Dienst `restore` noch nicht; die neue Meldung in `restore.ts:19` verweist trotzdem dorthin. Ich nehme an, das ist Teil 2 von #718, und habe es nicht als Befund geführt.

Geprüft: Whitelist der zwei Schlüssel samt Typprüfung, Aufräumen der `.part`-Dateien vor `pg_dump` (gleichzeitige Läufe gibt es nicht: Start, Zeitplan und Migration laufen nacheinander), gemeinsames Image in docker-compose.prod.yml, CI-Docker-Schritt (`docker build --tag dwello-backend backend`, unabhängig von Compose). Prettier prüft das Backend nicht (`.prettierignore`). Das Delta enthält nichts, was nicht zur Anforderung gehört.

## Triage

- C-1, C-3: trivial; fixed in part 2 of #718, whose closing round reviews them.
- C-2: stays as a Minor (the script is a thin prompt around `restoreBackup`, which `backup.pg.test.ts` covers).
