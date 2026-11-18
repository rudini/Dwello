# Code-Review backup-first, Runde 2 (#1457, `git diff 74c4e24 009b7bf`, ohne `docs/reviews/`)

Geschlossen: C-1, C-2

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-3 | Minor | backend/src/__tests__/update.pg.test.ts:207-211 | Der Test «sichert und beauftragt nur einmal, wenn zwei Anfragen zugleich kommen» setzt eine feste Reihenfolge voraus: `[{ started: true }, UPDATE_RUNNING]`. Gewinnen kann aber die Anfrage, die zuerst `startUpdate` erreicht. Davor laufen bei beiden asynchron `signToken()` (`helpers/auth.ts:22`) und die JWT-Prüfung im Backend. Endet die Krypto-Arbeit der zweiten Anfrage früher, gewinnt sie, und der Test wird rot, obwohl der Code richtig arbeitet. Das kann flackern. Vorschlag: ohne Reihenfolge vergleichen (`expect.arrayContaining` oder vorher sortieren). Die Prüfung `asked` → `['/update']` zeigt den Fehler auch ohne feste Reihenfolge. |

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `cd backend && bun run type-check`, `bun test src/__tests__/update.pg.test.ts src/__tests__/api-contracts.pg.test.ts` (139 bestanden), `bunx vitest run src/__tests__/api-proxy.test.ts`, die Commit-Hooks und die Rotläufe beider neuer pg-Tests. Nichts davon habe ich selbst ausgeführt. E2E lief auf diesem Delta noch nicht.
- Mangels `node_modules` habe ich vier Annahmen nicht im Quelltext geprüft:
  - `server.timeout(request, 0)` schaltet bei Bun das Zeitlimit für diese Anfrage ab.
  - Elysia gibt im Kontext das ursprüngliche `Request`-Objekt weiter.
  - Bei `app.handle` gilt `server` = `null`, auch nach `listening.stop()` im Test.
  - undici wartet standardmässig 300 s auf die Header (`headersTimeout`).

  Der Rotlauf des Aufrufers (mit `idleTimeout: 1` bricht die Verbindung ab) und die 139 bestandenen Tests sprechen für die ersten drei. Die Tests nach dem Test mit `app.listen` laufen über `app.handle`.
- Die Dauer von `createBackup` auf einer echten Installation habe ich nicht gemessen. Darauf beruht das Urteil zur Obergrenze von 5 Minuten (siehe «Geprüft»).

Geprüft:
- C-1 ist geschlossen. Der Aufruf `server?.timeout(request, 0)` steht vor dem ersten `await` in der Route (`backend/src/routes/update.ts:14`). Der Test lässt den echten Server mit `idleTimeout: 1` laufen und ohne die Änderung rot.
- C-2 ist geschlossen. `starting` wird vor dem ersten `await` gesetzt und im `finally` zurückgesetzt. Ohne die Änderung erhielte der Stand-in zweimal `/update`, der Test wäre also rot.
- Die Obergrenze von 5 Minuten im BFF ist kein Major:
  - Der BFF läuft produktiv auf Node (`adapter-node`, `Dockerfile:78` `node build`), ohne Reverse-Proxy. Die alte Stunde galt also nie.
  - Die Grenze ist nach der Skill `ponytail` mit Grenze und Ausbaupfad markiert (`src/lib/server/api-proxy.ts:52-55`).
  - Bei einem Verwalter mit weniger als 50 Wohnungen bleibt eine Sicherung voraussichtlich deutlich darunter.
  - Erst jenseits davon träte das Fehlerbild von C-1 auf.
- Kommentar zu V-9 (`tests/e2e/steps/aktualisierung.steps.ts:127-128`) wie von der Fachreview vorgeschlagen; die Prüfung des Schritts bleibt unverändert.
- Der Kommentar zu V-3 in `update.service.ts` stimmt jetzt zusammen mit `starting`.
