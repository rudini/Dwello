# Code-Review A-6 (#115), Runde 2 (Abschluss vor dem Push)

Gegenstand im Worktree `/tmp/claude-0/-home-user-Dwello/482368cc-084d-52e5-a629-fdbcf9b75b8f/scratchpad/review-a6-code2` (detached, 4012b9f):
- `git diff ba02ed9 591d614 -- . ':!docs/design/personas' ':!docs/reviews'` (6f40ed1, 86d7331, Plan-Commits): alle 19 Dateien gelesen;
- Merge-Commit 4012b9f: die Konfliktlösung in `backend/src/services/contract.service.ts`, die umbenannte Migration und die Dateien, die beide Seiten geändert haben (`backend/src/routes/contracts.ts`, `src/routes/contracts/[id]/+page.server.ts`, `tests/contracts/contract.json`, `src/lib/contract-status.ts`, `tests/e2e/fixtures/screens.ts`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | `tests/e2e/features/contract-detail.feature:260-267` | Die sichtbaren Änderungen P-1/P-2 (Folgesatz im Kasten, Dialog mit der Folge des Auszugs) zeigt kein Szenario; nur `contract-detail-page.dom.test.ts` («bestätigt den Auszug in einem Dialog mit seiner Folge», Folgesatz im Kasten) prüft die Texte. Das Szenario «Mieter ist nach dem befristeten Mietvertrag ausgezogen» läuft über den Dialog (`confirmMovedOut` klickt «Auszug bestätigen») und wird ohne den Dialog rot, sagt aber nicht, dass der Verwalter die Folge vor dem Bestätigen erfährt. Minor, weil das Verhalten auf der tiefsten Ebene getestet ist und der E2E-Weg den Dialog verlangt. |
| C-2 | Minor | `src/routes/contracts/[id]/+page.server.ts:323-326`, `FixedTermCheck.svelte:96-105` | Der Fehlerzustand des neuen Dialogs (`movedOutError`, Alert im Dialog) hat kein Szenario und keinen A11y-Zustand, nur Unit- und DOM-Tests. Er ist mit `FailRequests.to('/contracts/<id>', { '/movedOut': '' })` erreichbar. Fortsetzung von C-1 aus Runde 1; die Meldung steht jetzt an einer neuen Stelle (im Dialog statt im Kasten). |
| C-3 | Nit | `tests/e2e/tasks/contract-detail.ts:79-80` | `confirmMovedOut` klickt zweimal hintereinander, ohne auf den offenen Dialog zu warten (in `tasks/accessibility.ts:89` wartet `openDialog` mit `Wait.until(on.dialogConfirm)`) und ohne auf den gespeicherten Zustand zu warten. Das funktioniert dank Auto-Wait und der nachfragenden Question `fixedTermCheckShown`. Gleiches Muster wie C-6 aus Runde 1. |
| C-4 | Nit | `src/routes/contracts/[id]/FixedTermCheck.svelte:15` | Laut Plan sind die neuen Texte jetzt Teil von #308, aber der Marker nennt nur «wording of the question and the objection». Die Schlüssel `contracts_fixed_term_consequences` und `contracts_moved_out_consequence` sind nicht genannt. |

Keine Blocker oder Majors.

ponytail-review des Deltas: nichts gefunden. `toWizard` (C-3 aus Runde 1) entfernt die doppelte Weiterleitung, `movedOut` ist aus `RentalContract` und dem Mapper entfernt (C-4 aus Runde 1). Der Dialog verwendet `ActionDialog` aus dem Bestand, ohne neue Hilfsfunktion; `submit`/`busy` werden noch von den beiden übrigen Formularen gebraucht.

## Geprüft und bestätigt

- **Merge 4012b9f, `updateContract`:** `.set({ ...(endDate geändert && { movedOut: false }), ...feeRate(data, …), … })`. Der Reset steht vor dem Spread, darum gewinnt ein mitgesendetes `movedOut: true` (api-specification «unless it is sent too»). `feeRate` gibt `data` unverändert oder mit `managementFeePercent: null` zurück, `movedOut` geht also nicht verloren. Ein PUT nur mit `{ movedOut: true }` oder `{ endDate: null }` setzt bei einem Vertrag ohne vereinbarte Verwaltungspauschale `managementFeePercent` auf null, was dort ohnehin gilt. Abgedeckt durch `contract-moved-out.pg.test.ts` (vom Aufrufer gemeldet, grün).
- **Umbenennung der Migration:** `backend/migrations/0013_contract_moved_out.sql` (R100), keine Datei mehr mit 0010 dafür. Weder `docs/` noch `backend/src` noch der Plan verweisen auf 0010 (Plan: «Migration 0013»). `migrate.ts` erkennt Migrationen am Dateinamen. Eine lokale Branch-Datenbank mit dem alten Namen bekommt die klare Meldung zum Neuaufsetzen (`unknown`), `main` hatte den alten Namen nie.
- **Überschneidungen mit main:** `contract.json` enthält `movedOut` und die Felder der Verwaltungspauschale. Der Mapper der Detailseite bildet nur noch die Felder von main ab, nicht mehr `movedOut`. Das Update-Schema des Backends enthält `movedOut` und `managementFee`. Der A11y-Seed für Talblick/Emil bleibt nach dem Merge erhalten.
- **C-2 aus Runde 1:** Der neue pg-Test prüft dasselbe Vertragsende (Bestätigung bleibt) und `endDate` zusammen mit `movedOut: true` (bleibt). Er wird rot, wenn der Vergleich `!== current.endDate` fehlt oder der Reset nach dem Spread steht.
- **P-1 Dialog:** `FixedTermCheck.svelte` öffnet `ActionDialog` (Titel, Folge, «Auszug bestätigen», `confirmTestid`). Ein Fehler kommt als `movedOutError` aus der Action und wird nur im Dialog gezeigt, nicht im Kasten (DOM-Test, rot ohne den Dialog). Nach einem Erfolg schliesst sich der Dialog, ein Toast erscheint und die neu geladene Seite blendet Kasten und Dialog aus. Die Schaltfläche «Mieter ist ausgezogen» ist `type="button"`, Variante `secondary`, also keine zweite Primäraktion. Nur Tokens (`text-ink`).
- **P-2, M-3, V-15:** Alle fünf geänderten oder neuen Schlüssel stehen in allen vier `messages/*.json`. Unit-, DOM- und Toast-Tests sind auf den neuen Wortlaut nachgeführt und werden ohne die Änderung rot.
- **A11y:** Der Zustand `moved-out-dialog` steht in `screens.json` (mit `stateMeanings`), `accessibility.feature`, `sprachen-bildschirme.feature` und `tasks/accessibility.ts` (`openDialog(movedOutButton)`).
- **Screenplay:** Die Steps rufen weiter nur Tasks auf, das neue Target liegt in `targets/contract-detail.ts`. Die Features sind bis auf den Kommentar «Folgevertrag» → «Nachmieter» (V-12) unverändert.
- **Nichts Fremdes:** Das Delta enthält nur Korrekturen aus Runde 1, Persona-, Fachreview- und Dokumentations-Nits sowie Plan-Einträge.
- `bunx vitest run src/__tests__/contract-actions.test.ts src/__tests__/contract-detail-page.dom.test.ts` im Worktree selbst ausgeführt: 89 Tests grün.

## Nicht bestätigt

- vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bunx vitest run` (157 Dateien / 2731 Tests), Backend-Typecheck, Backend `bun test src/__tests__/contract* api-contracts.pg.test.ts` (69), vor dem Merge E2E Dashboard + Vertragsdetail (72) und die vollständigen Suiten Barrierefreiheit + Sprachen (332). E2E nach dem Merge läuft laut Aufrufer noch. Ob die Schritte von main mit dem zusätzlichen A11y-Seed (Talblick, Entwurf 2025) und die neuen Zustände von main (`invoice-hints`, `paidStatement`) zusammen 0 Verstösse ergeben, ist offen.
- **Fachlicher Wortlaut der neuen Texte aus 86d7331** (`contracts_fixed_term_consequences`, `contracts_moved_out_consequence`): Fachreview Runde 2 hat ba02ed9 geprüft, nicht diese Texte. Laut Plan liegen sie in #308. Eine Frage dazu: Der Dialog nennt «Seither gilt die Wohnung als leer, und die Nebenkosten dieser Zeit tragen Sie» als Folge des Bestätigens. In Dwello gilt das aber schon vorher (`moved_out` ändert keine Abrechnung); nur «Dwello fragt danach nicht mehr» ist eine Folge des Klicks. Ob das irreführt, muss fachlich oder vom Product Owner entschieden werden. Issue #308 habe ich nicht gelesen.
- Ob `open-work.test.ts` und `check-issues.mjs` mit dem Marker #308 grün sind: nicht ausgeführt.
