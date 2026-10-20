# Slice-Review #448 (+ #484), Runde 1

Worktree: `review-448-code`, Commit c326846d; Bereich `git diff c09ec4fd c326846d` (42231a00 @wip-Szenarien, c326846d Umsetzung). Alle 81 geänderten Dateien gelesen (Tests und Features über ihren Diff).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | backend/src/services/statement.service.ts:744-750 (offsetOf), 391-420 (carriedOver), 536-545 (recalculateStatement) | «Bereits verrechnet» wird beim Ersetzen festgeschrieben, sobald *irgendeine* Abrechnung einer anderen Periode den Saldo zählt, auch ein **Entwurf**. Wird dieser Entwurf danach neu berechnet oder gelöscht und neu erstellt, fällt der Übertrag weg (die ersetzte Abrechnung ist nicht mehr `carriable`). Die berichtigte Abrechnung hat den Betrag aber schon abgezogen. Der Betrag fehlt dann in jeder Abrechnung. |
| C-2 | Major | tests/a11y/screens.json:531-537, tests/e2e/fixtures/screens.ts:82-84 | `statement-settled-detail` hat nur `default`, und zwar mit Saldo 0.00. Die neuen Zustände laufen durch keine axe- und keine Sprachprüfung: «Erledigt» mit übertragenem Saldo (`statements_summary_carried`), die Zeile «Übertrag aus Abrechnung …» (`statements_carry_over`), «Bereits verrechnet mit …» (`statements_offset_with`) und `correct-dialog` auf einer erledigten Abrechnung (neuer Ort: `MoreActions` bietet «Abrechnung berichtigen» dort an). |
| C-3 | Minor | src/routes/statements/[id]/Correction.svelte:20-23, messages/*.json `statements_correct_open` | Die Bestätigung nennt eine falsche Folge. Bei «Versendet» oder «Überfällig» sagt sie «Hat der Mieter schon bezahlt, markieren Sie sie zuerst als bezahlt.», obwohl direkt darunter das Feld «Bereits bezahlt» steht (#448, 5). Bei «Erledigt» sagt sie «lässt sich nicht mehr als bezahlt markieren …» und verschweigt, dass ein schon übertragener Saldo als «Bereits verrechnet» angerechnet wird. |
| C-4 | Minor | backend/src/services/statement.service.ts:609 | `data.notes !== existing.notes` vergleicht `''` mit `null`. Bei einer Abrechnung ohne Bemerkung (`notes` ist nach dem Erstellen `null`) sendet die Bearbeitungsseite `notes: ''` (`edit/+page.server.ts:29`). Jedes Speichern ohne Änderung verwirft so das gespeicherte PDF einer versendeten Abrechnung. Der pg-Test prüft nur eine echte Änderung. |
| C-5 | Minor | backend/src/services/statement.service.ts:391-420 | `carriedOver` nimmt pro Abrechnung nur einen (`limit 1`) offenen Saldo, nämlich den jüngsten. Gibt es mehrere nach #94 einbehaltene Rückerstattungen (oder eine hinter einer schon versendeten Folgeabrechnung), taucht die ältere erst Jahre später auf. Nimmt die Schlussabrechnung nur eine, geht der Rest verloren. Dafür gibt es keinen Test. |
| C-6 | Minor | src/routes/statements/+page.svelte:246-269 | Die Bestätigung «Trotzdem speichern» in der Liste (`statement-list-mark-paid-early-confirm`) hat keinen Test, weder DOM noch E2E. Der DOM-Test der Detailseite (statement-pages.dom.test.ts:1390) klickt nach der Frage nicht auf Bestätigen und prüft deshalb das Senden nicht. |
| C-7 | Minor | src/routes/statements/PaidDateFields.svelte:380-382 | Die Frage «… Trotzdem speichern?» steht in einem `Alert tone="caution"` ohne `role` und ohne Live-Region (`Alert.svelte:25` setzt `role` nur bei `critical`). Der Fokus bleibt auf dem Knopf, dessen Name wechselt. Ein Screenreader liest die Frage nicht vor. |
| C-8 | Minor | src/routes/statements/[id]/Correction.svelte:573, src/lib/server/statement-actions.ts:79 | Die Prüfung `/^\d+(\.\d{1,2})?$/` ist zweimal kopiert. Dieselbe Prüfung gibt es schon als `FRANCS` in `src/lib/contract-form.ts:97` (reuse: exportieren und verwenden). |
| C-9 | Minor | tests/contracts/statement.json:23-24, docs/api-specification.md:244, 249 | Der Vertrag enthält `carriedFrom: null` und `final`, aber kein `offsetWith`. Die Formen von `carriedFrom` und `offsetWith` prüft deshalb nur die handgeschriebene Eingabe in statement-mapping.test.ts. Die API-Spezifikation nennt bei `GET /:id` weder `final` noch `carriedFrom` noch `offsetWith`. Bei `/:id/replace` steht weiter «a sent, overdue or paid statement … nothing else changes», obwohl jetzt auch `settled` ersetzt wird und `paidAmount` sich ändert. |
| C-10 | Minor | backend/migrations/0026_statement_carry_over.sql | Die Nummer 0026 ist auf `origin/main` schon vergeben (`0026_contract_advance_payments.sql`), dazu legt Branch `w10-issue-461` `0026_master_data_names.sql` an. `migrate.ts` arbeitet zwar nach Dateinamen, und es gibt schon zwei `0006`. Vor dem Merge von `main` sollte die Datei trotzdem die nächste freie Nummer bekommen, damit die Reihenfolge eindeutig bleibt. |
| C-11 | Minor | src/__tests__/statement-pages.dom.test.ts:186 (Fall `paid`), tests/e2e/features/statement-detail.feature «Eine bezahlte Abrechnung berichtigen, ohne nach dem bereits Bezahlten zu fragen» | Beide Tests sind schon auf c09ec4fd grün (es gibt dort kein Feld, die Verjährung steht schon im Text), also nicht rot gesehen. Weder 42231a00 noch c326846d nennt sie als Test für beibehaltenes Verhalten. |
| C-12 | Minor | messages/{de,fr,it,en}.json `glossary_balance_text` | Die Hilfe definiert den Saldo weiter als «Kostenanteil … minus Akontobeiträge». Die neue Glossarzeile «Saldo» (#484) rechnet die übertragene Nachzahlung oder Rückerstattung ein. Bei einer Abrechnung mit Übertrag stimmt die Hilfe nicht mit dem angezeigten Saldo überein (#484 «Done means»: «help texts follow»). |

## C-1 Übertrag geht verloren, wenn der zählende Entwurf neu berechnet wird

Warum falsch: Laut der Regel aus V-2, die der PO bestätigt hat, gilt «Bereits verrechnet mit NK-…» erst, «sobald die nächste Abrechnung ihn enthält». `offsetOf` liest `countedBy` beim Ersetzen und schreibt `paidAmount = balance` fest. `countedBy` zählt auch einen Entwurf der Folgeperiode. Ein Entwurf ist aber nicht fest:
- `recalculateStatement` schreibt `values.carriedFromId` neu. `carriedOver` findet die ersetzte Abrechnung nicht mehr (`status = 'replaced'` ist nicht `carriable`) und die berichtigte erst, wenn sie selbst erledigt ist.
- Ein gelöschter und neu erstellter Entwurf verhält sich genauso.

Danach zieht die berichtigte Abrechnung den Betrag als «Bereits verrechnet» ab, der Entwurf rechnet ihn aber nicht mehr ein. Die Detailseite der berichtigten zeigt den Betrag zudem als «Bereits bezahlt auf …» an, weil `countedBy` jetzt leer ist und `priorPaidOn` ihn wieder aufnimmt.

So zeigt man es, als pg-Test nach dem Muster von «rechnet einen schon übertragenen Saldo … als verrechnet an»:
1. `first = sentWith(rental, 2024, '3.00')`
2. `next = generate(rental, 2025)` (Entwurf)
3. `corrected = replaceAndCorrect(first.id)`; jetzt `priorPayments = '3.00'`, `balance = '-3.00'`
4. `POST /api/v1/statements/${next}/recalculation`
5. Erwartet: `read(next).carriedFrom.id === first.id` oder die berichtigte ohne Abzug. Tatsächlich ist `carriedFrom` `null` und `balance` `'0.00'`. Der Mieter erhält 3.00 zurück, die er nie bezahlt hat.

Möglicher Fix: `countedBy` nur aus nicht mehr änderbaren Abrechnungen (nicht `draft`) zählen. Oder `carriedOver` lässt eine ersetzte Abrechnung mit «Bereits verrechnet» weiter als Übertrag zu. Der Fall braucht einen pg-Test.

## C-2 Neue Zustände fehlen in screens.json

Warum falsch: Nach CLAUDE.md, «Design-Regeln/Process», kommt jeder neue Zustand an jedem Ort, an dem er erscheint, in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`. Die Fixture `settledStatement` (Carla 2021) hat Saldo 0.00. `PaymentPanel` zeigt dort den alten Text `statements_summary_settled`. Der Kernzustand von #448 wird nie mit axe geprüft und nie auf Deutsch in fr/it/en geprüft: «Erledigt» mit einem Saldo unter CHF 5, der übertragen wird, und die Folgeabrechnung mit der Zeile «Übertrag aus Abrechnung …». Dasselbe gilt für die berichtigte Abrechnung mit «Bereits verrechnet mit …» und für `correct-dialog` auf der erledigten Abrechnung.

So zeigt man es: `grep -n "statements_summary_carried\|statement-carry-over\|statement-offset" tests/a11y tests/e2e/fixtures/screens.ts` findet nichts. Die Zeile `statement-settled-detail` in `screens.json` hat nur `"default"`.

Fix:
- `settledStatement` mit einem Saldo unter CHF 5 anlegen (oder einen zweiten Datensatz).
- Eine Detailseite mit Übertrag ergänzen.
- `correct-dialog` für `statement-settled-detail` ergänzen.
- Alles mit `stateMeanings` in beiden Features eintragen.

## Bestätigt durch Code und Test

- **Übertrag unter CHF 5**: `carriedOver`, `calculateStatement`, `recalculateStatement`; vor dem Runden eingerechnet. Belegt durch pg «Übertrag» und die Szenarien «verrechnet eine übertragene Rückerstattung» und «rechnet eine übertragene Nachzahlung dazu».
- **PDF**: Zeile «Übertrag aus Abrechnung {Nr}: CHF {Betrag}»; Text «Der Betrag von CHF {Betrag} wird mit der nächsten Abrechnung verrechnet.»; kein Zahlteil. Belegt durch pdf-render und das Feature.
- **Statements nach #94** behalten ihren Text (`minimumOf` gibt `waived` zurück; DOM und statement-pdf-data). Rückerstattungen werden übertragen, Nachzahlungen nicht (pg).
- **Schlussabrechnung**: kein Mindestbetrag, Mahnung möglich, Übertrag eingerechnet, Grenzfälle des Vertragsendes. Belegt durch pg und Feature.
- **«Erledigt»** in Liste, Filter (`StatusFilter`, statements.feature), Übersicht (`BuildingFigures`, dashboard.feature) und Detail. Nicht gemahnt, kein «Zahlung zurücksetzen» (pg, DOM, Feature). Texte in allen vier Sprachen.
- **Zahlungsdatum**: vor dem Abrechnungsdatum nach Bestätigung gespeichert (Detail: DOM und E2E); vor dem Periodenende mit `PAID_DATE_BEFORE_PERIOD_END` abgelehnt, mit Vertrag. Die Codes `backend_paid_date_before_period_end`, `backend_statement_paid_amount_*` stehen in allen vier Sprachen.
- **«Bereits bezahlt»** nur bei versendet oder überfällig, negativ bei einer Rückerstattung, angerechnet und im PDF «Bereits bezahlt auf NK-…». Belegt durch pg, DOM, BFF und Feature.
- **Bemerkung**: eine Änderung verwirft das PDF, das PDF druckt sie, die Hilfe bei einer berichtigten Abrechnung passt. Belegt durch pg und Feature (siehe aber C-4).
- **Glossarzeilen #484** wie vom PO entschieden eingetragen (mit «Akontobeiträge»).
- Getestet auf c326846d nachgelaufen: `bunx vitest run` mit statement-status, statement-actions, statement-mapping, statement-pages.dom (201 grün) und `bun test src/__tests__/statement-carry-over.pg.test.ts` gegen `dwello_test_r448` (35 grün).

## Nicht bestätigt

- **Vom Aufrufer gemeldet**: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, die ganze `bunx vitest run`, die ganze `cd backend && bun test` (migrations.pg.test.ts mit Timeout), `bunx fallow audit`, die E2E-Läufe (statement-minimum-balance, statement-detail, statements, dashboard, statement-edit, statement-reminder) und der Nachlauf der zwei angepassten Szenarien.
- **`glossary_status_text`** (Done means #448) ist der Mietstatus der Wohnung und hat mit dem Status der Abrechnung nichts zu tun. Eine Glossar-Hilfe zum Abrechnungsstatus gibt es in `messages/de.json` nicht. Gesucht habe ich nach `glossary_*` mit «Bezahlt», «Mindest» und «CHF 5».
- **Hilfe bei «Bezahlt am»** (#484 Done means): `statements_paid_help` ist unverändert. Ob die Hilfe die Bestätigung oder das Periodenende nennen soll, ist nicht entschieden; der Text widerspricht der neuen Regel aber nicht.
- **`StatementList.svelte`** ist neu und hat einen einzigen Aufrufer; es kapselt die bisherige `<ul>`-Schleife. Ob die Auslagerung nur für ein Gate (deepcheck oder fallow) nötig war, konnte ich nicht feststellen. In ESLint und deepcheck fand ich keine Längengrenze für Svelte-Dateien.
- **Fachliche Prüfung**: Den Vorschlag V-2 (Runde 2 von `fach-reviewer`) und die Prüfung durch `daten-pruefer` habe ich nicht bewertet. `docs/reviews/448-fachreview-1.md` liegt vor.
- **Merge mit `origin/main`**: Seit c09ec4fd ändert main `UBIQUITOUS_LANGUAGE.md` (Akontobeiträge #477), `pdf.service.ts`, `statement.service.ts` und `messages/de.json`. Konflikte dort habe ich nicht geprüft. Gelesen habe ich nur die lokale Ref, ohne Fetch.
- **Vertragsseiten**: `src/lib/contract-status.ts:168` und `DeleteContract.svelte` zeigen eine erledigte Abrechnung als «versendet» an. «Done means» verlangt «Erledigt» dort nicht, darum ist das kein Befund.
