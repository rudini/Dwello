# Code-Review #981, Slice 1, Runde 1

Gegenstand: `git diff origin/main 21009ac` (Basis 8630ee5; 5bbf759, 21009ac), Worktree /tmp/claude/review-981-code.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | keine Befunde |

## Frage des fach-reviewers: `changes!.invoiceIds` bei `changesOf` = null

Das kann nicht eintreten. `changesOf` (backend/src/services/statement-invoices.service.ts:121-122) liefert nur dann `null`, wenn `statement?.building` fehlt. `listStatements` holt das Gebäude zwar über `leftJoin` (statement.service.ts:185-186), aber `utility_statements.apartment_id` und `apartments.building_id` sind beide `notNull()` und haben einen Fremdschlüssel (backend/src/db/schema.ts:461-463 mit `restrict`, :61-63 mit `cascade`). Darum hat jede gelistete Abrechnung ein Gebäude. Derselbe Zweig hat schon vor der Änderung auf `s.building!.id` (:189) vertraut, und `draftsToSend` (:165) nutzt dieselbe Kombination `carryChanged || draftOutdated(...)`. Für einen Entwurf, der nur wegen `carryChanged` erscheint, liefert der Code `invoices: 0, fuelStock: false`. `outdatedDraftsTask` (src/lib/overview.ts:155-176) liest diese Felder bei Entwürfen nicht, und `laterText` nutzt sie nur für Abrechnungen, die nicht im Entwurf sind (:209, :216). Die Übersicht zeigt deshalb nichts Falsches.

## Nicht bestätigt

- Diese Prüfungen hat der Aufrufer gemeldet, ich habe sie nicht selbst ausgeführt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bun run fitness`, `bunx vitest run --changed origin/main` (520), `bun test src/__tests__/statement-carry-over.pg.test.ts` (56, neuer Test vor dem Fix rot), E2E chromium `dashboard.feature` + `statement-minimum-balance.feature` (76, neues Szenario als @wip rot an der fehlenden Aufgabe), die Zeilen der Übersicht in `accessibility.feature`/`sprachen-bildschirme.feature` (26).
- `Spec change approved: #981` für die geänderte Zeile dashboard.feature:132: Die Zeile steht noch nicht im Text des Pull Requests, CI prüft sie erst dort. Den Entscheid «Decided (product owner)» in #981 habe ich nicht nachgelesen.
- Die Gegenrichtung von `carryChanged` (ein Entwurf verrechnet einen Übertrag, den er jetzt nicht mehr verrechnen würde) deckt carry-over.ts:90 mit `is distinct from` ab. Für die Übersicht zeigt das aber kein Test. Der fach-reviewer hat das schon offen gelassen (981-fachreview-1.md, «Nicht bestätigt»). Es ist keine Anforderungszeile von #981.

Geprüft: Fix und Regel A (eine Zeile, gleiche Form wie `draftsToSend`); keine Doppelzählung mit «Abrechnungen prüfen und versenden»; Wortlaut V-1 in allen vier `messages/*.json` gleich wie in 981-fachreview-1.md; alter Text sonst nirgends mehr; overview.test.ts nachgezogen; pg-Test und neues Szenario rot ohne den Fix (ohne `carryChanged` ist `draftOutdated` beim unveränderten Entwurf 2025 false); neuer Step ruft nur eine Question auf und kollidiert nicht mit dem Step «… des letzten Jahres»; Antwortform unverändert, darum kein Contract nötig; kein neuer Bildschirm-Zustand; Verweise auf 529-1 V-5 stimmen; Ponytail: nichts überflüssig.
