# Code-Review #1437 (ENCRYPTION_KEY-Mindestlänge), Runde 1, Abschlussrunde

Bereich: `git diff origin/main 825794fc` (ein Commit), Worktree `review-1437-code`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `checkEncryptionKey` (backend/src/services/ki-settings.service.ts:40) wirft bei gesetztem Schlüssel unter 32 Zeichen, gleiche Schwelle und Form wie `checkJwtSecret` (backend/src/config/jwt.ts); ein leerer oder fehlender Schlüssel bleibt erlaubt (dann gilt weiter `KI_ENCRYPTION_KEY_MISSING`). Der Aufruf in backend/src/index.ts:17 läuft vor `app.listen`, also bricht der Start ab. Tests in backend/src/__tests__/encryption-key.test.ts: Grenze 31/32, ohne Schlüssel, Spawn von `src/index.ts`. Ohne die Prüfung würde der Spawn-Test rot, weil stderr die Meldung nicht enthält und der Prozess erst beim Timeout endet. Das Muster folgt jwt-secret.test.ts. Schlüssel der Stacks: docker/init-secrets.sh macht 48 Zeichen (`head -c 48`), playwright.config.ts:230 hat 44, persona-stack.sh jetzt 43; die übrigen E2E-Backends setzen keinen Schlüssel. Die kurzen Schlüssel in ki-settings.pg.test.ts:75/335 und api-contracts.pg.test.ts:1336 setzen nur `process.env` im Testprozess und laufen nie durch `index.ts`; nur encryption-key.test.ts und jwt-secret.test.ts starten `src/index.ts`, und jwt-secret überschreibt ENCRYPTION_KEY nicht. Das hält also. .env.example:73–74 nennt das Minimum und die Startverweigerung, beides korrekt. `No scenario` passt zu tests/e2e/CLAUDE.md („No scenario“), weil der E2E-Stack einen Startabbruch nicht erzeugen kann. Keine UI-Texte, keine API-Antwort, keine Gate-Datei betroffen (docs/design/tools/ ist nicht `tools/`). Der Diff ist minimal und enthält nichts Fremdes.

## Nicht bestätigt

- Rot-Lauf von encryption-key.test.ts gegen ein No-op-`checkEncryptionKey`, danach grün: vom Aufrufer gemeldet. Durch Lesen bestätigt, dass die drei Verweigerungs- bzw. Spawn-Prüfungen ohne die Änderung fehlschlagen. Die beiden „lässt zu“-Tests sind auch ohne Prüfung grün; sie bewachen nur die Grenze.
- Backend `bun test` (ki-settings.pg, jwt-secret, encryption-key: 45 pass), backend type-check, lint, check, fitness, testcheck:audit, deepcheck:audit, Prettier, `vitest --changed origin/main`: vom Aufrufer gemeldet.
- Ob der Persona-Stack und das Backend in `bun run dev`/`dev:demo` mit dem neuen bzw. ohne Schlüssel tatsächlich starten: nicht ausgeführt. In backend/package.json, playwright.config.ts und .github steht kein weiterer ENCRYPTION_KEY, und im Worktree gibt es kein backend/.env. Ein Entwickler mit einem kurzen Schlüssel in seiner eigenen backend/.env würde jetzt beim Start abgewiesen. Das ist gewollt, aber nicht prüfbar.
