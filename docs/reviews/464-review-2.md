# Code-Review #464, Runde 2 (Delta b71bb4c5..06aac4c5)

Gegenstand: 8fd1c700 (Akonto-Zeilen in den Demodaten) und 06aac4c5 (Fixes zu C-1 bis C-9 aus `docs/reviews/464-review-1.md` und zu V-1 bis V-9 aus `docs/reviews/464-fachreview-2.md`). Gelesen im Worktree `review-464-code2` (detached, 06aac4c5). Alle 31 geänderten Dateien sind gelesen, die beiden Persona-Berichte und den Fachreview habe ich nur auf ihre Befunde hin gelesen. Geändert habe ich nichts ausser diesem Bericht.

## Status der Befunde aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| C-1 (Major) | behoben | Zustände `advance-delete-refused` (contract-detail) und `advance-refused` (contract-edit) stehen in `screens.json` (mit `stateMeanings`), in `accessibility.feature` und in `sprachen-bildschirme.feature`. Die Zustände in `tasks/accessibility.ts:205-209` erreichen echte Ablehnungen: Annas Akonto ab 2025-07-01 wird vor ihrem Entwurf 2025 angelegt (`fixtures/screens.ts:44,62`). Das Szenario steht in `contract-detail.feature:395-401`. Es ist auf b71bb4c5 rot, denn dort kam der Text «… ändert die Abrechnung …» statt «… zählt in der Abrechnung …». |
| C-2 (Major) | behoben | `validateContract` setzt `advancePaymentFrom`, wenn das Feld leer ist und das Akonto sich geändert hat (`contract-form.ts:143-146`). `valid()` übernimmt den Fehler, `RentStep` zeigt ihn am Feld. Ein falsch getippter Tag wird über `DateInput.onblur` zu `''` und fällt so ebenfalls darunter. Unit-Test `contract-form.test.ts` («verlangt ein «Gültig ab» …»), rot auf b71bb4c5. Ein DOM-Test (kein PUT, Fehler am Feld) fehlt. Die Verdrahtung gab es aber schon. Zum fehlenden Szenario und Bildschirmzustand siehe C-10. |
| C-3 | behoben | `endDeletingDraft` ist wieder genau wie auf fccaa297 (Vergleich mit `git show fccaa297`). `endOnFormDay` gilt nur noch für `end` und ändert dort kein Verhalten. |
| C-4 | teilweise | Der DOM-Test übergibt jetzt einen String (`statement-pages.dom.test.ts:686`). `tests/contracts/statement.json` hat aber weiter `replaces: null`, der Contract-Test prüft `replaces.totalAdvancePayments` also nie, und der DOM-Test baut `replaces` weiter von Hand. Bleibt Minor. |
| C-5 | behoben | `contract-advance.pg.test.ts:141-151` prüft das Löschen bei Entwurf und bei versendeter Abrechnung. |
| C-6 | behoben im Backend, siehe C-10 und C-11 | `alignAdvances` lehnt einen Beginn oder ein Ende über ein späteres Akonto hinaus ab. pg-Test `:127-138`. |
| C-7 | offen (Minor) | Wie gemeldet unverändert: `updateContract` schreibt `monthly_advance_payment` weiter (`contract.service.ts:414`). Seit V-2 nur noch, wenn sich der Betrag geändert hat. |
| C-8 | behoben | `calculateTotalAdvancePayments` ist entfernt. Der Test rechnet über `advanceLines`. Ausserhalb von `docs/reviews` gibt es keinen Aufruf mehr. |
| C-9 | behoben | `+page.server.ts:354` prüft `^\d{4}-\d{2}-\d{2}$` vor dem Fetch. Test `contract-actions.test.ts:592-597` (keine Anfrage bei `../../c2`), rot auf b71bb4c5. |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-10 | Major | `backend/src/services/advance-payment.service.ts:91-104`, `src/lib/contract-form.ts:143-146`, `tests/e2e/features/*` | Neue Ablehnungen, die der Verwalter sieht, haben weder Szenario noch Bildschirmzustand, und kein Commit sagt `No scenario: <reason>`. Betroffen sind (a) `CONTRACT_START_AFTER_ADVANCE` und `CONTRACT_END_BEFORE_ADVANCE` (Formular und «Beenden») und (b) der Feldfehler `contracts_error_advance_from_required`. |
| C-11 | Major | `src/routes/contracts/[id]/+page.server.ts:275` | Endet ein Mietvertrag über «Beenden» vor einem späteren Akonto, lehnt das Backend mit 400 `CONTRACT_END_BEFORE_ADVANCE` ab. Der Dialog zeigt aber nur «Mietvertrag konnte nicht beendet werden.». Was geschah und was zu tun ist, erfährt der Verwalter nicht. Die neue Meldung `backend_contract_end_before_advance` erscheint auf diesem Weg nie. |
| C-12 | Minor | `backend/src/services/advance-payment.service.ts:83,115,135-136`, `src/__tests__/backend-codes.test.ts:6-11` | Die Codes entstehen jetzt als Template-Literal (`` `${code}_DRAFT` ``). Der Wächter «hat für jeden Code eine Meldung» findet `ADVANCE_CHANGES_DRAFT/_STATEMENT` und `ADVANCE_DELETE_CHANGES_DRAFT/_STATEMENT` deshalb nicht mehr. Die Meldungen gibt es heute. Eine fehlende fiele aber nicht mehr auf. |
| C-13 | Minor | `docs/api-specification.md:99,101`, `src/__tests__/contract-actions.test.ts:598-609`, `tests/contracts/contract-advance-refused.json` | Die Spezifikation von `DELETE /:id/advance-payments/:validFrom` nennt weiter `ADVANCE_CHANGES_DRAFT/_STATEMENT «as on PUT»`. Bei `PUT` fehlen `CONTRACT_START_AFTER_ADVANCE` und `CONTRACT_END_BEFORE_ADVANCE` sowie das Mitrücken des ersten Betrags. Der BFF-Test zum abgelehnten Löschen spielt die PUT-Antwort nach und erwartet den alten Text «… oder wählen Sie ein späteres «Gültig ab»». Das Backend sendet diesen Text beim Löschen nicht mehr (V-6). Einen Vertrag für die DELETE-Ablehnung gibt es nicht. |

## C-10 (Major): Neue Ablehnungen ohne Szenario und ohne Bildschirmzustand

**Beleg.**
- `alignAdvances` (`advance-payment.service.ts:91-104`) lehnt bei jedem `PUT` einen Vertragsbeginn an oder nach einem späteren Akonto ab, ebenso ein Vertragsende davor. Getestet ist das nur im pg-Test `contract-advance.pg.test.ts:127-138`.
- `validateContract` hat einen neuen Feldfehler mit neuem Text (`contracts_error_advance_from_required`). Den Fall prüft nur der Unit-Test.
- `grep` in `tests/e2e/features` findet kein Szenario zu diesen Fällen. Das einzige neue Szenario betrifft das Löschen.
- `screens.json`: `advance-refused` zeigt `ADVANCE_CHANGES_DRAFT`. `submit-cleared` leert nur die Pflichtfelder, darunter «Gültig ab». «Akonto pro Monat» ist aber `optional` (`RentStep.svelte:73`) und bleibt unverändert. Damit gilt `advanceChanged` nicht, und der neue Fehler erscheint in keinem Zustand.
- Beide Commit-Messages enthalten kein `No scenario`.

**Warum falsch.** Laut `CLAUDE.md`, Workflow 1, braucht jede Verhaltensänderung, die der Verwalter sieht, ein Szenario. Die drei Texte (de/fr/it/en) prüft kein Axe- oder Sprachtest (Design-Regeln, Process). Die Lücke ist real: Ein Szenario «Mietvertrag vor einem späteren Akonto beenden» wäre an C-11 rot geworden.

**Zeigen.** Ein Szenario nach dem Muster von `contract-detail.feature:387` reicht: Anna mit 150 und ab «2025-07-01» 200, dann «Beenden» per 30.06.2025. Erwartet ist die Meldung «Ab 01.07.2025 gilt ein anderes Akonto. …». Für (b) dient ein Zustand in `contract-edit` mit geändertem Akonto und leerem «Gültig ab».

## C-11 (Major): «Beenden» vor einem späteren Akonto meldet nur «konnte nicht beendet werden»

**Beleg.**
- `endOn` (`+page.server.ts:254-276`) sendet `PUT` mit `endDate`. `updateContract` ruft danach `alignAdvances` auf (`contract.service.ts:425`), und das wirft 400 `CONTRACT_END_BEFORE_ADVANCE`.
- `save()` liest den Body nur bei 409 (`:243-244`). `endOn` gibt bei jedem anderen Fehler `fail(status, { endError: m.contracts_end_failed() })` zurück (`:275`). `backendMessage` wird hier nicht aufgerufen.
- Im Formular «Bearbeiten» stimmt es: Dort zeigt `saveError` die Meldung mit `backendMessage` an.

**Warum falsch.** `CLAUDE.md`, Conventions: Eine Ablehnung des Backends, die die UI zeigt, kommt mit ihrem Code als `backend_<code>`. Design-Regeln: Fehler sagen, was passiert ist und was zu tun ist. Der Verwalter erfährt nicht, dass er zuerst das spätere Akonto löschen muss. Er sieht den Fehler bei jedem Versuch wieder. Das ist derselbe Befund wie P-4 von Helga («sagt nicht, was passiert ist»). C-6 war der Anlass für die neue Regel. Den Weg, über den C-6 eintritt, löst das aber nicht.

**Zeigen.** BFF-Unit-Test in `contract-actions.test.ts`: `runAction(actions.end, 'c1', 400, { endDate: '2025-06-30' }, { code: 'CONTRACT_END_BEFORE_ADVANCE', params: { date: '01.07.2025' } })`. Heute liefert er `endError: 'Mietvertrag konnte nicht beendet werden.'`. Erwartet wäre «Ab 01.07.2025 gilt ein anderes Akonto. Löschen Sie zuerst dieses Akonto, oder wählen Sie ein späteres Vertragsende.». Dazu gehören das Szenario aus C-10 und ein Contract für die Antwort.

## Nicht bestätigt

- **Selbst wiederholt:** `bunx vitest run` für `contract-form`, `backend-codes`, `contract-actions`, `contract-edit.dom`, `contract-detail-page.dom` und `statement-pages.dom`: 324 Tests, alle grün.
- **Vom Aufrufer gemeldet, nicht wiederholt:** `bun run lint`, `bun run check`, `bunx vitest run` komplett (3167), `cd backend && bun run type-check` und `bun run test` (1015), `bunx fallow audit`, E2E: Akonto-Szenarien und die Axe- und Sprachzeilen von contract-detail, contract-edit und statement-correction-detail (34), Szenarien zum Beenden (13, vor dem Zurücknehmen von C-3; nach dem Zurücknehmen nicht gemeldet).
- **Andere Bildschirmzustände mit Annas Daten:** Ihr späteres Akonto liegt jetzt am 2025-07-01 statt am 2099-01-01. Das ändert die Akontobeträge ihres Entwurfs 2025 in allen Zuständen dieses Seeds (`fixtures/screens.ts`). Ob ein Zustand ausserhalb der drei gemeldeten Seiten davon abhing, habe ich nur durch Lesen geprüft (`tasks/accessibility.ts`, Zustände mit «Anna»). Ich habe keinen gefunden, aber auch nichts laufen lassen.
- **V-1 mit mehreren Abrechnungen:** Der pg-Test prüft eine versendete Abrechnung mit gesetztem `total_advance_payments`. Den Fall mit drei Abrechnungen, den die Fachreview vorschlägt, habe ich nur nachgelesen. Weil die Prüfung je Abrechnung mit `continue` läuft, sollte er durchgehen.
- **Toleranz 1 Rappen** (`< 0.015`) bei Abrechnungen von vor #464: Ich habe sie gelesen, aber keinen Test mit einem angebrochenen Monat und gespeichertem Total gefunden. Gesucht habe ich in `contract-advance.pg.test.ts` und `advance-payments.test.ts`.
- **Mitrücken des ersten Betrags bei vorhandenen Abrechnungen:** Ob ein verschobener Vertragsbeginn mit Abrechnungen vorher schon abgelehnt wird (Regel zu den Mietstagen, 409), habe ich nur aus `docs/api-specification.md:99` übernommen. Den Code dazu habe ich nicht nachgeprüft.
- **Persona-Befunde ausserhalb dieses Reviews:** Helga P-3 und P-4 sowie Weber P-3 bis P-6 (u. a. «Geleistete» gegenüber «vereinbarten» Akontobeiträgen, Warnung bei gleichen Beträgen) gehören zur Persona- und Fachrunde. Ich habe sie nicht beurteilt.
