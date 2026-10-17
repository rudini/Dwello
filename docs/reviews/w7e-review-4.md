# Code-Review Runde 2 (abschliessender Slice): #357 Protokoll, Delta 4bafd4a..03445e0

Worktree: `review-audit-code4` bei 03445e0. Gelesen: alle drei Dateien des Deltas (`docs/reviews/w7e-review-3.md`, `src/__tests__/audit-log-actions.test.ts` ganz, `src/routes/config/audit-log/+page.server.ts` ganz), dazu `src/lib/server/audit-log.ts:52-57` und `messages/de.json:124,1603`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-24 | geschlossen | `src/routes/config/audit-log/+page.server.ts:10` | Die Prüfung ist wieder `if (!response.ok) throw error(...)` und Zeile 10 ist byte-gleich mit 4295ea6. `git diff 4295ea6 03445e0 -- <datei>` zeigt nur noch `encodeURIComponent`. Prettier-sauber. |
| C-25 | Nit, weiter offen | `src/__tests__/audit-log-actions.test.ts:18-24` | Anders als gemeldet ist C-25 nicht erledigt: Der 404-Test übergibt weiterhin den handkopierten Body `{ error: 'Audit log entry not found' }`. Das Delta ändert diese Zeilen nicht. Fix wie gehabt: `runAction(actions.delete, '', 404, { id: 'a1' })`. |

Keine neuen Blocker, Majors, Minors oder Nits.

## Bestätigt

- Der neue Test «meldet, dass das Protokoll nicht geladen werden konnte» (`audit-log-actions.test.ts:48-57`) wäre auf 4bafd4a rot gewesen. Dort hat die Prüfung den 404 durchgelassen, `({}).data` ist `undefined`, und `toAuditEntries(undefined)` wirft beim `entries.map` einen TypeError. Der passt nicht zu `{ status: 404, body: { message } }`. Ohne jede Prüfung wäre der Test aus demselben Grund rot.
- Die erwartete Meldung «Protokoll konnte nicht geladen werden» entspricht `record_not_loaded` (`de.json:124`) mit `audit_title` (`de.json:1603`). Es gibt keinen neuen Text, also nichts an `messages/*.json` zu ändern.
- Neu ausgeführt: `bunx vitest run src/__tests__/audit-log-actions.test.ts` mit 5/5 grün.
- Prettier-Diff für beide geänderten Code-Dateien: leer.
- Mitcommittet ist `docs/reviews/w7e-review-3.md`, mein Bericht aus Runde 1. Das ist in diesem Repo üblich (`docs/reviews/` enthält die Berichte der Reviews) und hat nichts mit dem Verhalten zu tun.
- Kein neuer Bildschirm, kein neuer Zustand, keine geänderte API-Antwort und kein E2E-Code im Delta. Ein Szenario ist nicht nötig, weil das Verhalten wieder dem von 4295ea6 entspricht.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check` sowie die vollen Suiten von Vitest, Backend und E2E auf 03445e0: vom Aufrufer nicht gemeldet und hier nicht ausgeführt (Backend und E2E laut Auftrag nicht).
- Die Angabe, der Load-Test sei vor dem Fix rot gewesen: vom Aufrufer gemeldet. Hier nur beim Lesen bestätigt (siehe oben), nicht auf 4bafd4a ausgeführt.
- Weiter offen aus Runde 1 und nicht Teil dieses Deltas: Sven P-1 (Minor, Fokus nach dem Löschen, `docs/design/personas/sven-w7e-2.md:11`).
