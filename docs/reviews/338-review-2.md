# Review #338 «Neu berechnen» – Runde 2

Worktree: `review-338-code2` (detached 4f6d52d9). Delta: `git diff 7f8798f3 4f6d52d9` ohne `docs/reviews`, `implementation_plan.md` und `docs/design/personas`, ein Commit `fix(statements): keep payments, confirm recalc`. Alle 23 Dateien des Deltas gelesen. Dazu gelesen: `FormDialog.svelte`, `dialog-submit.ts`, `statement.service.ts` (`calculatedRows`, `calculateStatement` Z. 340-410), `calculation.service.ts:314`, `src/lib/server/statement-generation.ts:61-145`, `backend-codes.test.ts`, `tests/e2e/CLAUDE.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-14 | Major | backend/src/__tests__/statement-recalculation.pg.test.ts:80-97 | Der C-1-Test prüft nicht, dass der Saldo die bezahlten Beträge anrechnet. `balance` aus `kept` zu entfernen lässt ihn grün |
| C-15 | Minor | tests/e2e/steps/statement-detail.steps.ts:413-415; tests/e2e/questions/statement-detail.ts:92 | Neuer Schritt «bestätigt die Abrechnung {string}» und neue Question `recalculatedDone` = `Text.of(successToast)` doppeln den bestehenden Schritt «bestätigt Dwello {string}» (Z. 437) und `replacedDone`. ponytail `reuse:` |
| C-16 | Minor | messages/*.json `backend_statement_not_recalculable`, `backend_statement_recalculation_agreements_open` | Wortlaut der beiden Ablehnungen in keinem DOM-, BFF- oder E2E-Test. `backend-codes.test.ts` prüft nur, dass der Schlüssel existiert (der Nachweis zu C-2/C-3 aus Runde 1 verlangte einen Text) |
| C-17 | Minor | src/routes/statements/[id]/MoreActions.svelte:54 | Mit dem Zustand `recalculated` fällt der einzige Sprachcheck von `statements_recalculated` (fr/it/en) weg. Die Meldung erscheint jetzt als Toast, und der wird nirgends geprüft. Das ist bei den übrigen FormDialog-Toasts schon so |
| C-18 | Nit | backend/src/services/statement.service.ts:459-470 | ponytail `shrink:` Das Destrukturieren von `contractId/periodStart/periodEnd` und die lokale Variable `priorPayments` formen unveränderte Zeilen um. `Number(draft.priorPayments)` direkt im Aufruf reicht |

## Status der offenen IDs aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| C-1 | behoben (Code), Test unvollständig, siehe C-14 | `kept` übernimmt `replacesId` und `priorPayments` aus dem Entwurf und rechnet den Saldo mit `totalAdvancePayments + priorPayments`, wie `calculateStatement` Z. 353-354. Der pg-Test prüft `replaces.id` und `priorPayments`. Ohne die Änderung wäre er rot (`replaces` null) |
| C-2 | behoben | Eigener Code `STATEMENT_NOT_RECALCULABLE`, in vier Sprachen. Text «Nur ein Entwurf lässt sich neu berechnen … «Abrechnung berichtigen»» passt zu versendet und bezahlt. pg-Test prüft den Code. Wortlaut ungetestet: C-16 |
| C-3 | behoben | Eigener Code `STATEMENT_RECALCULATION_AGREEMENTS_OPEN`, pg-Test mit unbeantworteter Kategorie (rot ohne Änderung, weil vorher `STATEMENT_AGREEMENTS_OPEN`). Durch Lesen geprüft: Nach dem Löschen hat der Mietvertrag keine Abrechnung in der Periode mehr. Eine ersetzte Abrechnung zählt dabei nicht (`replacedHere`). Darum fragt der Assistent wieder nach (`contractAgreements` → `contractsInPeriod`), und `openReplaced` verknüpft die neue Abrechnung wieder mit der ersetzten. Der Text führt also an den richtigen Ort |
| C-4 | behoben | Test setzt nach `sent` auch `paid` und erwartet die Ablehnung erneut |
| C-5 | behoben | `recalculateDraft` klickt «Neu berechnen» und bestätigt. Der nächste Schritt fragt den Toast-Text ab und wartet damit auf das Ergebnis. Muster wie `resetPayment` |
| C-6 | behoben | Die Bestätigung erscheint jetzt als Toast über `FormDialog` (`success`), der Fokus geht danach auf das `h1` (gleicher Weg wie bei Correction, ResetPayment und markiert bezahlt). Das Inline-Alert und `form.recalculated` sind entfernt |
| C-7 | behoben | `it.json` enthält kein «Ricalcola»» mehr; Button, Titel und alle Verweistexte im Infinitiv |
| C-8 | offen (Minor, vom Aufrufer bewusst gelassen) | unverändert |
| C-9 | teilweise | Getestet sind jetzt Nummer, Abrechnungsdatum, Zahlungsfrist und Verwaltungspauschale. Ungetestet bleiben Heizprofil, Bemerkung und das verworfene PDF, die der Dialog dem Verwalter zusagt. Minor bleibt |
| C-10 | behoben | api-specification Z. 250 mit beiden Codes, PRD Z. 541 |
| C-11 | behoben | Target unter eigenem Kommentar «#338» |
| C-12 | behoben | Rückfalltext 'Statement recalculation failed' |
| C-13 | behoben | Typ enthält nur noch genutzte Felder (`balance`, `priorPayments`, `replaces` im C-1-Test) |
| Helga P-1 | behoben (durch Lesen) | Erfolg als Toast, Fokus auf den Seitentitel. Das E2E-Szenario prüft den Toast-Text |
| Helga P-2 | behoben | Dialog «Entwurf neu berechnen» nennt Nummer, was bleibt, was sich ändert und dass das PDF verworfen wird. Der DOM-Test prüft den Wortlaut. Der Zustand `recalculate-dialog` steht in `screens.json` (mit `stateMeanings`), `accessibility.feature` und `sprachen-bildschirme.feature` |

## Blocker/Major

### C-14 (Major): Die Anrechnung der bezahlten Beträge im Saldo ist nicht getestet

C-1 war ein Blocker, weil der Mieter nochmals bezahlen müsste, was er schon bezahlt hat. Der neue Test prüft dazu nur `replaces.id`, `priorPayments` und `after.balance > before.balance`. Der Saldo selbst ist nicht geprüft. Die letzte Erwartung hält auch dann, wenn der Saldo die bezahlten Beträge nicht mehr anrechnet: Er steigt dann um den Anteil an der neuen Rechnung **und** um `priorPayments`, ist also ebenfalls grösser.

Nachweis: In `recalculateStatement` die Zeile `balance: String(calculateBalance(…))` aus `kept` entfernen. Dann gilt `values.balance`, und den hat `calculateStatement` mit `priorPayments = 0` gerechnet, weil `openReplaced` den eigenen Entwurf nicht findet. `replacesId` und `priorPayments` bleiben richtig, der Saldo ist falsch, und der Test bleibt grün. Gerade die Zeile, die den Geldfehler behebt, ist damit ungedeckt.

Behebung: den Saldo genau erwarten, z. B. `expect(Number(after.balance)).toBe(roundTo5Rappen(Number(after.totalCosts) - Number(after.totalAdvancePayments) - Number(after.priorPayments)))`. Alternativ: die Differenz zu `before.balance` entspricht der Differenz der `totalCosts`, mit 5-Rappen-Rundung. Rot zeigen durch Entfernen von `balance` aus `kept`.

## Bestätigt

- Gleiche Nummer, Abrechnungsdatum, Zahlungsfrist und Verwaltungspauschale nach dem Neu berechnen: pg-Test Z. 62-64.
- `refuseOpenAgreements` nimmt den Code als Parameter, Standard `STATEMENT_AGREEMENTS_OPEN`. Die Berichtigung (`correction`) behält ihren Code und Text.
- Ein Entwurf ohne `replacesId` behält `priorPayments` '0' und `replacesId` null, wie vorher.
- BFF: Die Aktion `recalculate` gibt bei Erfolg nichts mehr zurück. Eine Ablehnung zeigt weiter `form-error` oben (`+page.svelte:178`), über `fail(… actionError)` und `update()` in `dialogSubmit`.
- UI: `Button` und `FormDialog`/`Dialog` aus dem Bestand, keine neuen Klassen, keine Tokens berührt. Der Dialog hat ein `h1`-Fokusziel und einen Bestätigungsknopf mit Testid `statement-recalculate-confirm` (kebab-case mit Kontext).
- Texte: Die vier neuen Schlüssel stehen in allen vier Sprachen, mit gleicher Bedeutung. fr mit « … » und geschütztem Leerzeichen vor «:». Begriffe Entwurf/brouillon/bozza, Abrechnung berichtigen/Rectifier/Rettificare/Correct statement und Verwaltungspauschale/frais d’administration/spese amministrative wie im Bestand.
- E2E: Die Schritte rufen nur Tasks und Questions auf. `recalculatedDone` liefert Text. Das Szenario «Entwurf neu berechnen» läuft ohne `@wip` und prüft jetzt zuerst die Bestätigung, dann die Position. Der a11y-Zustand `recalculate-dialog` nutzt `openDialog`, das auf den Bestätigungsknopf wartet.
- Rot: Der DOM-Test (Dialogtext) scheitert ohne die Änderung (kein Dialog). Die pg-Tests C-1 und C-3 scheitern ohne die Änderung (`replaces` null bzw. falscher Code). Die zusätzliche Ablehnung bei bezahlt (C-4) bestätigt Verhalten, das schon besteht (`status !== 'draft'`). Sie braucht keinen Rot-Lauf, die Commit-Nachricht sagt das aber nicht (für C-4 so verlangt, Nit, nicht eigens geführt).
- Nichts im Delta ohne Bezug zur Anforderung, ausser C-18.

## Nicht bestätigt

- lint, check, Backend-Type-Check, `bunx vitest run` gesamt (3111) samt Rot-Lauf des DOM-Tests, `bun test src/__tests__/statement` (234) samt Rot-Läufen der drei pg-Tests, `backend-codes.test.ts`, E2E chromium (12 Szenarien inkl. axe/Sprachen `recalculate-dialog`): vom Aufrufer gemeldet. `bunx vitest run` für statement-pages und backend-codes wollte ich wiederholen, aber das Lesen von `node_modules` ist im Worktree gesperrt (verweist auf `/home/user/Dwello/node_modules`, durch eine Deny-Regel blockiert). Backend-Tests habe ich nicht gestartet, weil sie in die Datenbank schreiben.
- C-14 habe ich durch Lesen bestätigt (Mutation gedanklich), nicht durch einen Lauf.
- Fokus auf das `h1` nach dem Erfolg: `PageHeader` habe ich nicht auf `tabindex="-1"` geprüft. Der Weg ist derselbe wie bei den drei anderen FormDialogs mit `success`.
- Helga P-3 bis P-6 (Minor/Nit) liegen ausserhalb dieses Deltas. Nicht geprüft, ob sie in ihrem Bericht offen bleiben.
