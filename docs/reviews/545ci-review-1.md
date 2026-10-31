# Code-Review 545-ci, Runde 1 (c73231f..023c9cb)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | src/lib/server/statement.ts:149 | Die neue Mapper-Zeile `reminderToPost: data.reminderToPost === true` hat keinen Unit-Test. Die Geschwisterfelder (`unpaid` … `deadlinePassed`) prüft `src/__tests__/statement-mapping.test.ts:37-51` («übernimmt, was der Saldo verlangt»), `reminderToPost` fehlt dort. Abgedeckt ist die Zeile nur über E2E. |
| C-2 | Minor | docs/api-specification.md:278 | Die Beschreibung zählt alle Felder auf, die `paymentOf` für `GET /` und `GET /:id` liefert. Das neue Feld `reminderToPost` fehlt. Der Abschnitt ist damit unvollständig. |

Keine Blocker, keine Major.

Geprüft: Das Verhalten bleibt gleich. Beide Seiten bekommen ihre Daten über `paymentOf` mit `effectiveStatus` (`statement.service.ts:216`, `:323`). Dieser Status ist derselbe, den die Antwort als `status` liefert. Darum ist `reminderToPost` gleich der früheren Bedingung im Frontend (`status === 'overdue' && reminderToSend`). `StatementRow` und `PaymentPanel` werden nur aus diesen beiden Ladern gespeist. Der neue Backend-Test schlägt ohne die Änderung fehl (`reminderToPost` wäre undefined) und deckt «überfällig», «bezahlt» und «nichts zu versenden» ab. Beide Contracts tragen das Feld. Der Eintrag in `display` (`ratchet.json:290-294`) passt zur Regel in `docs/architecture/fitness-functions.md` §2 und folgt dem Vorbild von `StatusActions.svelte`. Es gibt keine neuen Texte, Bildschirme oder testids. Für eine Änderung ohne neues Verhalten braucht es kein neues Szenario. Der Diff enthält nichts, was nicht zur Aufgabe gehört. `reminderToSend` im BFF-Mapper (`statement.ts:121`) liest im Frontend schon auf der Merge-Base niemand. Das stammt nicht aus diesem Diff.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run fitness` (Exit 0), Backend type-check, `bun test statement-payment.test.ts api-contracts.pg.test.ts reminders.pg.test.ts` (150 pass), `vitest statement-mapping, statement-pages.dom, statement-list-load` (225 pass), `bun run lint`, `bun run check`, E2E Chromium statement-reminder (16 pass).
- Den roten Lauf des neuen Backend-Tests habe ich nur durch Lesen beurteilt.
