# Code-Review #464, Runde 4 (Schlussrunde 2, Delta 20630756..36b7eaef)

Gegenstand ist der Commit 36b7eaef «fix(contracts): toast after deleting an Akonto». Ich habe im Worktree `review-464-code2` gelesen (detached, 36b7eaef). Gelesen sind alle 8 geänderten Dateien des Deltas ausserhalb von `docs/reviews`, `implementation_plan.md`, `docs/archive` und `docs/design/personas`. Dazu habe ich diese Stellen gelesen:
- `AdvancePeriods.svelte` ganz,
- `ActionDialog.svelte` (`onsuccess`),
- `dialog-submit.ts`,
- `helpers/reactive-props.svelte.ts`,
- `backend-codes.test.ts`,
- die wiederverwendeten Schritte in `contract-detail.steps.ts:312-342` und `statement-detail.steps.ts:434` (`replacedDone` = `Text.of(successToast)`),
- `contract-edit.feature:188-228` und `tasks/contract-form.ts`.

Im Worktree habe ich nichts geändert.

## Status der offenen Befunde aus Runde 3

| ID | Status | Beleg |
|---|---|---|
| C-12 (Minor) | behoben | `refusalOf` (`advance-payment.service.ts:117-125`) schreibt die vier Codes als `new CodedError('…'` aus. Das Muster von `backend-codes.test.ts:6-11` findet sie jetzt. `backend_advance_(delete_)changes_(draft\|statement)` steht in allen vier `messages/*.json`. Der geänderte Backend-Text beim Löschen («counts in a draft statement») steht auch im Vertrag `contract-advance-delete-refused.json`. Kein Test prüft den Backend-Text sonst (grep in `backend/src/__tests__`, `src/__tests__`). |
| C-14 (Major) | behoben | Der Toast liest jetzt `formatDate(deleting)` statt `deleted.values.from`. `deleting` bleibt nach `update()` erhalten. Die Closure wirkt auch dann noch, wenn `{#if deleted?.before}` den Dialog nach dem Neuladen abbaut. Bei einem späteren Akonto ist der Wert derselbe wie zuvor (`formatDate(validFrom)` für `index > 0`). Der DOM-Test mountet mit `reactiveProps`, und `update` entfernt das Akonto mit `flushSync()`. Mit dem alten Code wäre er rot, weil `deleted` dann `undefined` ist (TypeError, so in Runde 3 nachgestellt). |
| C-15 (Major) | behoben | P-4: `contract-detail.feature:393` «Und bestätigt Dwello "Akonto ab 01.07.2025 gelöscht"» liest den Erfolgs-Toast. Ohne den Fix aus C-14 wäre der Schritt rot. P-1: Das Szenario «Das Formular nennt die eingetragenen Akonto-Beträge» liest `advancePeriodOf` auf der Bearbeitungsseite (dieselbe Komponente, dieselbe `data-testid`). Rot war dafür der DOM-Test, wie der Aufrufer meldet. Der Fix lag schon in e6955d63. V-12: Das Szenario «Vertragsbeginn und erstes Akonto zusammen korrigieren» verschiebt den Beginn vom 01.04.2024 auf den 15.03.2024, mit 180 Franken ab dem 15.03.2024. Auf dem Stand vor d486f1e2 kam hier 400 `CONTRACT_START_AFTER_ADVANCE`, und die Seite bliebe im Formular ohne Monatlich total. Bliebe das alte Akonto als zweite Zeile ab 01.04.2024 bestehen, wäre das Monatlich total CHF 1’100.00 statt 1’130.00. Beides wäre also rot. Der Task `saveStartWithAdvance` ist eine Aktivität aus Interactions. Der Schritt ruft nur den Task. |
| C-16 (Minor) | unverändert offen | Der Aufrufer hat ihn bewusst als Minor gelassen. Das Delta ändert die Berechnung von `next` nicht (`advance-payment.service.ts:147-150`). |
| C-17 (Minor) | behoben | `git log`: «fix(contracts): first Akonto moves with the start» hat 49 Zeichen, «fix(contracts): toast after deleting an Akonto» hat 46. |
| C-4, C-7 (Minor, Runde 2) | unverändert offen | Das Delta berührt sie nicht. |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| (keine) | | | |

Zusätzlich geprüft, ohne Befund:
- Das Delta berührt nichts, was nicht zur Anforderung gehört.
- Es gibt keine neuen UI-Texte und keine neuen Bildschirme oder Zustände.
- Die E2E-Schichten bleiben eingehalten.
- ponytail: `refusalOf` ersetzt die beiden Objekte `CHANGES` und `DELETE_CHANGES`, es bleibt nichts Ungenutztes zurück.

## Nicht bestätigt

- Diese Prüfungen meldet der Aufrufer, ich habe sie nicht erneut ausgeführt:
  - `bun run lint`, `bun run check`, `bunx vitest run` (3169) und Backend `bun run test` (1019),
  - fallow,
  - die drei neuen oder geänderten Szenarien (grün; rot mit herausgenommenem Fix beim Toast-Schritt und bei V-12),
  - der rote DOM-Lauf für C-14 und für P-1.
- Den Lauf von `bunx vitest run` für `contract-detail-page.dom.test.ts` und `backend-codes.test.ts` konnte ich im Worktree nicht wiederholen. `node_modules` liegt im Arbeitsbaum des Aufrufers, und den Zugriff darauf blockiert eine Regel.
