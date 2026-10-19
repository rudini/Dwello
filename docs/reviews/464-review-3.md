# Code-Review #464, Runde 3 (Schlussrunde, Delta 06aac4c5..a224d0c2)

Gegenstand: 2e31903c (V-12, V-14, V-15) und a224d0c2 (C-10 bis C-13, Personas Helga 464-2 P-1 bis P-4, Weber 464-2 P-1). Gelesen im Worktree `review-464-code2` (detached, a224d0c2). Gelesen sind alle 26 geänderten Dateien ausserhalb von `docs/reviews`, `implementation_plan.md`, `docs/archive` und `docs/design/personas`. Dazu habe ich die umgebenden Stellen gelesen: `contract.service.ts` `updateContract`, `ActionDialog.svelte`, `dialog-submit.ts`, `backend-error.ts`, `backend-codes.test.ts` und `contract-form.ts`. Im Worktree habe ich nichts geändert. Für C-14 lief ein Versuch in einer Kopie im Scratchpad, die danach gelöscht wurde.

## Status der offenen Befunde aus Runde 2

| ID | Status | Beleg |
|---|---|---|
| C-4 (Minor) | unverändert offen | Das Delta berührt es nicht. |
| C-7 (Minor) | unverändert offen | Das Delta berührt es nicht. |
| C-10 (Major) | behoben | Das Szenario «Mietvertrag vor einem späteren Akonto beenden» steht in `contract-detail.feature:403-408`. Auf 06aac4c5 wäre es rot, weil der Dialog dort `contracts_end_failed` zeigt. Die Zustände `end-dialog-advance-refused` (contract-detail) und `advance-from-missing` (contract-edit) stehen in `screens.json` (mit `stateMeanings`), in `accessibility.feature` und in `sprachen-bildschirme.feature`. Die Aktivitäten stehen in `tasks/accessibility.ts:207-221`. Den Zustand ermöglicht Annas Akonto ab 2099 im Seed (`fixtures/screens.ts:52`). Ich habe geprüft, ob dieser Seed andere Zustände auf `{contract}` verändert: `end-dialog-refused` und `edit-refused` scheitern weiter an der 409-Prüfung `checkNewDates`, die vor `alignAdvances` läuft, und kein Zustand beendet Annas Vertrag mit Erfolg. |
| C-11 (Major) | behoben | `+page.server.ts:275-278` gibt nur `code` und `params` an `backendMessage` weiter, nie den Text des Backends. Der BFF-Test steht in `contract-actions.test.ts:275-288` (aus `contract-end-advance-refused.json`, rot ohne den Fix). Das Szenario sichert den Weg zusätzlich ab. |
| C-12 (Minor) | **offen** | Die Codes stehen jetzt als Literale im Objekt `CHANGES`/`DELETE_CHANGES` (`advance-payment.service.ts:116-117`). Der Wächter `backend-codes.test.ts:6-11` sucht aber nur nach `CodedError('X'`, `refusal('X'` und `code: 'X'`. Ein Literal hinter `draft:` oder `statement:` findet er nicht. Ein `grep` mit seinem Muster über `backend/src` findet keinen der vier Codes `ADVANCE_(DELETE_)CHANGES_(DRAFT\|STATEMENT)`. Eine fehlende Meldung fiele also weiter nicht auf. Beheben: die Schlüssel `code:` nennen oder die vier `CodedError('…'` ausschreiben. |
| C-13 (Minor) | behoben | Die Verträge `contract-advance-delete-refused.json` und `contract-end-advance-refused.json` werden in `api-contracts.pg.test.ts:367-396` gegen die echte API geprüft. Der BFF-Test zum abgelehnten Löschen nutzt jetzt den DELETE-Vertrag und den Text aus V-6. Die API-Spezifikation nennt die DELETE-Codes, `next`, das Mitrücken und die Codes für Beginn und Ende. |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-14 | Major | `src/routes/contracts/[id]/AdvancePeriods.svelte:89`, `src/__tests__/contract-detail-page.dom.test.ts:468-473` | Die Bestätigung nach dem Löschen (Helga P-4) erscheint nie. `onsuccess` liest `deleted.values.from` erst nach `update()`. Dann fehlt das gelöschte Akonto in den Daten, `deleted` ist `undefined`, und der Aufruf wirft einen TypeError. Der DOM-Test merkt das nicht, weil sein `update` nichts tut. |
| C-15 | Major | `src/routes/contracts/ContractForm.svelte:339-344`, `AdvancePeriods.svelte:89`, `advance-payment.service.ts:96`, `tests/e2e/features/*` | Drei Änderungen, die der Verwalter sieht, haben kein Szenario, und kein Commit nennt `No scenario: <reason>`: die Akonto-Liste im Bearbeitungsformular (P-1), die Bestätigung nach dem Löschen (P-4) und das Mitrücken des ersten Betrags, wenn «Gültig ab» der neue Vertragsbeginn ist (V-12). |
| C-16 | Minor | `backend/src/services/advance-payment.service.ts:138-142` | `next` ist der Erste nach dem `rental_end` der letzten Abrechnung. Endet diese Abrechnung am Vertragsende, liegt `next` nach dem Vertragsende. Der Text rät dann zu einem «Gültig ab», das `ADVANCE_FROM_AFTER_END` ablehnt. Beispiel: ein Vertrag vom 01.01. bis 31.12.2024 mit Entwurf 2024 und einem Akonto ab 01.07.2024. Die Meldung rät zu «ab 01.01.2025», und genau das wird abgelehnt. Kein Test deckt diesen Rand ab. |
| C-17 | Minor | Commit 2e31903c | Der Betreff «fix(contracts): first Akonto moves with a new start» hat 51 Zeichen. Erlaubt sind 50 (`CLAUDE.md`, Commits; `.claude/hooks/commit-msg-gate.mjs:73`). Vor dem Push umformulieren. |

## C-14 (Major): Der Toast nach dem Löschen eines Akontos erscheint nie

**Beleg.**
- `dialog-submit.ts:18-22` ruft erst `await update()` auf, dann `answered(result)`. `ActionDialog.svelte:64-68` ruft darin `onsuccess`.
- Bei Erfolg lädt `update()` die Seite neu (`invalidateAll`). Danach fehlt das gelöschte Akonto in `advancePayments`, und `advancePeriods` findet `deleting` nicht mehr. `deleted` (`AdvancePeriods.svelte:50`) ist also `undefined`.
- `onsuccess={() => addToast('success', m.contracts_advance_deleted_toast({ from: deleted.values.from }))}` wirft dann «TypeError: Cannot read properties of undefined (reading 'values')». Es erscheint kein Toast.
- Nachgestellt habe ich das in einer Kopie im Scratchpad. Dort war `ContractPage` mit `$state`-Props gemountet, und `update` ersetzte `data` durch den Vertrag ohne das Akonto ab 01.07.2025, so wie SvelteKit es tut. Ergebnis: `THROWN TypeError: Cannot read properties of undefined (reading 'values') TOASTS []`. Mit dem `update: async () => {}` des bestehenden Tests erscheint der Toast.
- Das E2E-Szenario «Ein späteres Akonto löschen» (`contract-detail.feature:387-392`) prüft nur das Monatlich total. Die E2E-Tests fangen kein `pageerror` ab (`grep pageerror tests/e2e` findet nichts). Der Fehler bleibt also überall unbemerkt.

**Warum falsch.** P-4 gilt als erledigt, doch der Verwalter sieht nach dem Löschen weiterhin keine Bestätigung. Dazu kommt ein unbehandelter Fehler im Browser. Der Test zeigt den Fehler nicht, weil er den Teil weglässt, der ihn auslöst: das Neuladen der Daten.

**Zeigen.** Im DOM-Test soll `update` die Props wie SvelteKit durch den Vertrag ohne das gelöschte Akonto ersetzen (mit `$state`-Props, z. B. über ein kleines `*.svelte.ts`-Hilfsmodul). Dann wird der Test rot. Oder ein Szenario prüft den Toast «Akonto ab 01.07.2025 gelöscht», siehe C-15. Beheben: den Text vor dem Absenden festhalten, etwa `const from = deleted.values.from` im Submit-Pfad oder `deleting` über `formatDate(deleting)`, und erst dann `addToast` aufrufen.

## C-15 (Major): Sichtbare Änderungen ohne Szenario

**Beleg.**
- P-1: Das Bearbeitungsformular listet jetzt die eingetragenen Akonto-Beträge, ohne Löschen (`ContractForm.svelte:339-344`, `readonly`). Das prüft nur der DOM-Test `contract-edit.dom.test.ts:141-162`. `contract-edit.feature` hat dazu nichts: Im Delta ändert sich dort nur der erwartete Text in Zeile 213.
- P-4: Der Toast nach dem Löschen. Das prüft nur der DOM-Test, und der verdeckt C-14.
- V-12: Ist «Gültig ab» der neue Vertragsbeginn, wird der erste Betrag korrigiert. Vorher entstand ein zweites Akonto oder die Ablehnung `CONTRACT_START_AFTER_ADVANCE`. Das prüft nur `contract-advance.pg.test.ts:253-262`. Diese Änderung ist eine Fachregel und am Vertrag sichtbar: ein Akonto statt zwei Zeilen oder eine Ablehnung.
- Keine der beiden Commit-Messages nennt `No scenario`.

**Warum falsch.** Laut `CLAUDE.md`, Workflow 1, und dem Pflichtpunkt dieses Reviews braucht jede Verhaltensänderung, die der Verwalter sieht, ein Szenario ohne `@wip`. Bei P-4 zeigt C-14, dass die Lücke einen echten Fehler verdeckt: Ein Szenario mit «sieht die Bestätigung …» wäre rot geworden.

**Zeigen.** Das Szenario «Ein späteres Akonto löschen» um die Bestätigung ergänzen. Für P-1 in `contract-edit.feature` ein «Dann» anlegen, das die Beträge im Formular nennt. Für V-12 ein Szenario «Vertragsbeginn und erstes Akonto zusammen ändern» an einem künftigen Vertrag: Danach nennt der Mietvertrag nur ein Akonto ab dem neuen Beginn.

## Weitere geprüfte Punkte (ohne Befund)

- V-12 im Backend: `setAdvance` läuft nach dem Update der Daten (`contract.service.ts:424`), `startDate` ist also der neue Beginn. Beide Richtungen des `it.each` sind ohne den Fix rot. Vorwärts entstehen zwei Zeilen, rückwärts kommt 400 `CONTRACT_START_AFTER_ADVANCE`.
- P-2: Der pg-Test erwartet `next: '01.01.2025'` (rot ohne den Fix). Die vier Sprachen nennen `{next}`, die Begriffe passen zu `i18n-begriffe.md` («décompte des charges», «conteggio spese accessorie»). Das Szenario `contract-edit.feature:213` prüft den neuen Text.
- P-3: Den Default für `example` setzt `DateInput` je Instanz wie bisher. Das neue Beispiel für «Gültig ab» prüft `contract-edit.dom.test.ts:162-164` (rot ohne den Fix).
- `contracts_advance_deleted_toast` steht in allen vier `messages/*.json`. Die Texte zu V-14 und V-15 in fr und it sind geändert.
- ponytail: `readonly` und `example` sind die kleinsten Mittel für P-1 und P-3. Ungenutzten Code oder eine Kopie eines bestehenden Helfers gibt es nicht.

## Nicht bestätigt

- Diese Prüfungen meldet der Aufrufer, ich habe sie nicht erneut ausgeführt: `bun run lint`, `bun run check`, `bunx vitest run` (3169), Backend type-check und `bun run test` (1019), `bunx fallow audit`, die E2E-Akonto-Szenarien und die Axe- und Sprachzeilen (66 von 67, dazu der Ausreisser unter Last).
- Ich habe nicht geprüft, ob die neuen Axe-Zustände in hell und dunkel und in allen Viewports 0 Verstösse haben. Nur der Lauf des Aufrufers belegt das.
- Für C-14 habe ich nur den DOM-Fall nachgestellt, mit einer Kopie im Scratchpad und echten `$state`-Props. Im Browser habe ich es nicht laufen lassen. Dass SvelteKit `update()` vor `answered` beendet, steht in `dialog-submit.ts:20-22`.
- Ob der Commit-Hook 2e31903c mit 51 Zeichen durchgelassen hat oder anders committet wurde, weiss ich nicht. Gelesen habe ich nur den Betreff (C-17).
