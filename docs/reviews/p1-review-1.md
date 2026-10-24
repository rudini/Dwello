# Review #788 Teil 1, Runde 1 (4c5ed5ba..ccfab9ed)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | src/routes/contracts/[id]/+page.server.ts:361-364 | Mietvertrag nicht gefunden (404) zeigt jetzt den englischen Backend-Text «Contract not found» statt «Mietvertrag konnte nicht gelöscht werden.»; ohne Test |
| C-2 | Major | ccfab9ed (Commit-Text «No scenario») | Für den neu sichtbaren Text gibt es kein Szenario. Der Weg über eine veraltete Seite lässt sich in E2E herstellen, also gilt der Grund für «No scenario» nicht |
| C-3 | Minor | src/__tests__/contract-actions.test.ts:503, 534, 545-548 | Die Tests geben noch ein GET mit `startDate` zurück, das die Aktion nicht mehr liest. Toter Testaufbau, der eine Abhängigkeit vom Vertragsbeginn vortäuscht |

## C-1 (Major): 404 zeigt den eigenen Text des Backends

**Vorher:** Das GET hat einen gelöschten oder unbekannten Mietvertrag abgefangen: `fail(404, m.contracts_delete_failed())`, also ein übersetzter Text.

**Jetzt:** Das Fehlerobjekt kommt direkt vom DELETE.
- `deleteContract` liefert `{ success: false, error: 'Contract not found' }`, ohne `code` (backend/src/services/contract.service.ts:520).
- Die Route antwortet mit 404 und diesem Objekt als Body (backend/src/routes/contracts.ts:285-288).
- `backendMessage` gibt bei fehlendem Code `body.error` zurück (src/lib/backend-error.ts:50-51).

Folge: Der Dialog zeigt in allen vier Sprachen «Contract not found». Das verletzt die Konvention «never the backend's own text». Auslöser: Der Mietvertrag wurde in einem zweiten Fenster gelöscht, die Seite ist veraltet, oder das Formular wird ohne JavaScript gesendet.

So lässt sich der Fehler zeigen: In `describe('Mietvertrag löschen')` den Aufruf `runAction(actions.delete, 'c1', 404, {}, { error: 'Contract not found' })` ergänzen und `deleteError: 'Mietvertrag konnte nicht gelöscht werden.'` erwarten. Auf ccfab9ed ist der Test rot, auf 4c5ed5ba grün.

Mögliche Abhilfe: Das Backend gibt beim Löschen einen Code mit. `backend_contract_not_found` gibt es in allen vier `messages/*.json` schon. Dann muss die Route den Status für diesen Code bei 404 lassen, statt «Code vorhanden → 409» zu setzen. Alternativ setzt der BFF bei 404 den eigenen Ersatztext.

## C-2 (Major): Szenario fehlt

Die Änderung ist für den Liegenschaftsverwalter sichtbar: Ein Formular, das an der Prüfung des Dialogs vorbeikommt, zeigt jetzt `backend_contract_started` statt `contracts_delete_mistake_unconfirmed`, mit Status 409 statt 400. Nach `CLAUDE.md`, Workflow 1, braucht eine solche Änderung ein Szenario ohne `@wip`.

`No scenario` ist nur für Zustände zulässig, die der E2E-Stack nicht herstellen kann (`tests/e2e/CLAUDE.md` «No scenario»). Dieser Zustand lässt sich herstellen:
1. Die Seite eines künftigen Mietvertrags laden. Der Dialog sieht `status === 'future'` und zeigt keine Bestätigung.
2. Den Vertragsbeginn danach über die API in die Vergangenheit legen.
3. Löschen.

Das Muster «… ist inzwischen …» gibt es schon in statement-detail.feature:166-172 und settings.feature:134-139. Der Text ist genau für diesen Fall geschrieben («hat inzwischen begonnen. Laden Sie die Seite neu …»).

Keiner der Punkte in der Liste von «No scenario» passt: Die Aktion sendet die Anfrage ans Backend, und der Text erscheint im Dialog.

So lässt sich der Mangel zeigen: `grep -rn "inzwischen begonnen" tests/e2e` findet nichts.

## Nicht bestätigt

- bunx vitest run (3644), bun run lint, bun run check, backend contract-delete.pg.test.ts und api-contracts.pg.test.ts (83), bun run fitness -- --base origin/main, E2E contract-detail.feature (55): vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Dass der neue Fall in api-contracts.pg.test.ts:381-390 mit `drift` grün ist, ist vom Aufrufer gemeldet. Gelesen ist: Body der Fixture = `refusal('CONTRACT_STARTED', …)` aus contract.service.ts:530, 409 aus der Route.
- «Spec change approved» und der PO-Kommentar vom 24.10.2026 in #788: nicht eingesehen, die Angaben stammen aus dem Auftrag.

Geprüft: Der geänderte BFF-Test ist auf der Basis rot (409 auf GET → `contracts_delete_failed`). Wege mit unverändertem Ergebnis: künftig, begonnen bestätigt (`?confirmMistake=true`), mit Abrechnung, Netzwerkfehler (wirft wie vorher). Mit Abrechnung und unbestätigt meldet das Backend jetzt zuerst `CONTRACT_HAS_STATEMENTS`, was zutrifft. Der Rest der Aktion las nichts aus dem entfernten GET. Andere Aufrufer von `?/delete`: nur DeleteContract.svelte, dessen Prüfung unverändert ist. `contracts_delete_mistake_unconfirmed` wird weiter benutzt (DeleteContract.svelte:63). `localToday` wird weiter importiert und benutzt. Die Umstellung in ratchet.json kommt aus `tighten`/`--update` (tools/fitness/fitness.ts:163, 293). Die Zählung in fitness-functions.md stimmt.
