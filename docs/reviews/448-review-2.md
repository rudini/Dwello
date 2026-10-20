# Slice-Review #448 (+ #484), Runde 2

Worktree: `review-448-code2`, Commit 43460275. Delta: `git diff c326846d 43460275`. Darin sind cfd4be1c (Fixes), de294ba1 (Migration 0027) und der Merge 43460275 von a50d72e3, die Auflösung geprüft mit `git show --remerge-diff 43460275`. Vorheriger Bericht: `docs/reviews/448-review-1.md`.

Gelesen habe ich alle Dateien, die cfd4be1c und de294ba1 ändern, und jede aufgelöste Konfliktstelle des Merges. Die Änderungen von main selbst (#464, #477) sind nicht Teil dieses Slices. Bei ihnen habe ich nur das Zusammenspiel mit #448 geprüft.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | backend/src/services/statement.service.ts:384-390, 749-765 | **erledigt.** `countedBy` zählt keinen Entwurf mehr. `offsetOf` läuft in der Transaktion: Zählt ein Entwurf den Saldo, verliert er ihn (`carriedFromId = null`, `balance − Saldo`), und die berichtigte rechnet nichts an. Die Rechnung `balance − Saldo` ist exakt, weil `roundTo5Rappen` abrundet (`Math.floor`) und der Saldo auf 5 Rappen liegt. Belegt durch den pg-Test «nimmt einem Entwurf, der den Saldo zählt, den Übertrag …», inklusive Neuberechnung. Auf c326846d wäre er rot: `priorPayments` 3.00 statt 0.00. |
| C-2 | Major | tests/a11y/screens.json:538-559, tests/e2e/fixtures/screens.ts:93-108, 205-207, accessibility.feature, sprachen-bildschirme.feature | **erledigt.** Neu sind: `statement-carried-detail` («Erledigt» mit 3.00, `default` und `correct-dialog`), `statement-carry-detail` (Entwurf mit Übertrag) und `statement-offset-detail` (berichtigte Abrechnung mit «Bereits verrechnet mit», die nächste ist versendet). Die Seeds stimmen: Akonto 0, ohne Verwaltungspauschale, eine Wohnung. `stateMeanings.correct-dialog` ist angepasst. Den axe- und Sprachlauf meldet der Aufrufer als laufend. |
| C-3 | Minor | Correction.svelte:19-28, messages/*.json | erledigt (DOM-Tests für versendet, Rückerstattung und erledigt). |
| C-4 | Minor | statement.service.ts:621-625 | erledigt (pg «behält das gespeicherte PDF, wenn die leere Bemerkung leer bleibt»; auf c326846d rot). |
| C-5 | Minor | statement.service.ts:401-420 | offen, bewusst (Aufrufer). |
| C-6 | Minor | statement-pages.dom.test.ts:249-268, 1447-1460 | erledigt (Liste und Detail senden nach «Trotzdem speichern»). |
| C-7 | Minor | PaidDateFields.svelte:34-40 | erledigt (`aria-live="polite"` um den Alert, DOM-Test). |
| C-8 | Minor | contract-form.ts:97, statement-actions.ts:80, Correction.svelte:45 | erledigt (`FRANCS` exportiert und verwendet). |
| C-9 | Minor | tests/contracts/statement.json:23-24, docs/api-specification.md:244, 249 | **teilweise.** Die API-Spezifikation ist nachgeführt. Der Vertrag hat jetzt `offsetWith: []`, aber `carriedFrom` ist weiter `null` und `offsetWith` leer. Die Form eines Übertrags und eines Eintrags «Bereits verrechnet» prüft weiter nur die handgeschriebene Eingabe in statement-mapping.test.ts. |
| C-10 | Minor | backend/migrations/0027_statement_carry_over.sql | erledigt gegenüber main. Siehe aber C-16. |
| C-11 | Minor | – | erledigt (cfd4be1c nennt beide Tests als Tests für beibehaltenes Verhalten). Ich habe gegengeprüft: Auf c09ec4fd gibt es das Feld nicht, die Tests sind dort grün. Es ist kein Bugfix. |
| C-12 | Minor | messages/*.json `glossary_balance_text` | erledigt in allen vier Sprachen. Die Merge-Auflösung behält die #448-Fassung, und die enthält schon «Akontobeiträge» ohne «geleistete» (#477). |
| C-13 | Minor | src/routes/statements/[id]/Correction.svelte:27-29 | Neu durch M-5: Berichtigt man eine nach #94 erledigte Rückerstattung (Status «Bezahlt», `paidDate`, `paidAmount` 0) und zählt eine versendete nächste Abrechnung sie schon, rechnet die berichtigte sie als «Bereits verrechnet» an. Der Dialog zeigt aber `statements_correct_settled` und schweigt dazu. Das ist dieselbe Lücke wie C-3 bei «Erledigt». Dafür gibt es keinen DOM-Test. |
| C-14 | Minor | tests/e2e/features/statement-minimum-balance.feature:8-10, statement-pages.dom.test.ts:532 | Der Kommentar sagt: «Abrechnungen, die nach #94 versendet wurden, behalten ihren Text». Das stimmt nicht mehr. Seit V-18 zeigt die Detailseite einer #94-Rückerstattung `statements_summary_carried` statt «Sie zahlen ihn nicht aus.». Nur die Nachzahlung und das PDF behalten ihren Text. |
| C-15 | Minor | backend/src/services/statement.service.ts:766 | `type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]` kopiert `type Tx` aus `backend/src/services/advance-payment.service.ts:8` (kam mit main). reuse: dort exportieren und importieren. |
| C-16 | Minor | backend/migrations/0027_statement_carry_over.sql | Kollision der Migrationsnummer: Der lokale Branch `w10-issue-461` (98b8b9ac) legt `0027_master_data_names.sql` an. Auf `origin/main` (a9db22dc) liegt noch keine 0027, die letzte ist `0026_contract_advance_payments.sql`. Wer als Zweiter nach main merged, braucht 0028. Sonst gibt es wieder zwei Dateien mit derselben Nummer (wie bei `0006`); die Reihenfolge folgt dann nur dem Dateinamen. |

Es gibt keinen offenen Blocker und keinen offenen Major.

## Merge-Auflösung (43460275)

Ich habe jede Konfliktstelle mit `--remerge-diff` gelesen. Alle sind korrekt aufgelöst, beide Seiten bleiben erhalten:
- `correctionsOf` liest `totalAdvancePayments` (#464) und `countedBy` (#448). `replaces` trägt das Akonto; `priorPaidOn` und `offsetWith` bleiben getrennt.
- `pdf.service.ts`:
  - `totalRows` zählt die Akontozeilen (#464) und die Zeilen für Übertrag und Verrechnung (#448).
  - `notes` beginnt mit der Bemerkung (#448), gefolgt vom Hinweis zum Akonto (#464).
- `tests/e2e/fixtures/backend.ts`:
  - `replaceStatement` behält `paidAmount` (#448).
  - `replaceStatement` ruft das neue `correctStatement` von main auf.
- `tests/e2e/fixtures/screens.ts`:
  - Bei Carla 2024 gilt die Reihenfolge von main: ersetzen, Akonto, berichtigen.
  - Carla 2021 «Erledigt» bleibt.
- Feature, Targets und Questions von `statement-detail` enthalten beide Blöcke.
- Die zwei PDF-Tests prüfen jetzt «Akontobeiträge – 600.00 …» (#477). Ich habe sie grün nachgelaufen.
- Die zwei PDF-Steps: Ein Bindestrich der Abrechnungsnummer darf von einem Leerraum gefolgt sein. Sie rufen weiter nur `verwalter.sees(…)` auf, die Screenplay-Ebenen bleiben eingehalten.

## Bestätigt durch Code und Test

- **V-14 / C-1** (Entwurf zählt nicht als verrechnet): siehe oben.
- **M-5** (#94-Rückerstattung): `offsetOf` prüft `carriable`, das die #94-Rückerstattung enthält. Belegt durch den pg-Test «rechnet eine nach #94 erledigte Rückerstattung …» (`priorPayments` −3.00). Auf c326846d rot, dort wurde nur `settled` geprüft.
- **V-17** («Erledigt» bleibt erledigt, auch mit späterem Vertragsende in der Periode): `minimumOf` im PDF, `unpaid` und `claimed` in `src/lib/statement.ts`. Belegt durch statement-pdf-data und die DOM-Tabelle.
- **V-18** (#94-Rückerstattung auf der Detailseite «wird verrechnet»): belegt durch DOM. `statements_summary_waived_refund` ist ohne Aufrufer und aus allen vier Sprachdateien entfernt.
- **V-6** (PDF-Text bei Übertrag): `carriedDue` und `carriedRefund` in vier Sprachen. Belegt durch pdf-render und statement-minimum-balance.feature.
- **V-8** (gerundeter Übertrag): Der pg-Test ist im Commit als Test für beibehaltenes Verhalten genannt; c326846d zeigt dieses Verhalten schon.
- **V-15** (Glossarzeilen «Bereits verrechnet mit NK-…» und «Berichtigte Abrechnung»): eingetragen.
- **«Erledigt» auf Englisch «Closed»**: in i18n-begriffe.md und buildings-i18n.test nachgeführt. In fr und it ist das ❓ entfernt.
- **Nachgelaufen auf 43460275**:
  - `bunx vitest run` mit statement-pages.dom, statement-status, statement-actions, statement-mapping und buildings-i18n: 220 grün.
  - `bun test` mit statement-carry-over.pg, statement-pdf-data und statement-pdf-render gegen `dwello_test_r448`: 148 grün, 27 Migrationen.
  - `api-contracts.pg.test.ts`: 45 grün.

Ponytail: Ausser C-15 finde ich nichts zum Streichen. `changesPdf` ersetzt drei Vergleiche durch einen.

## Nicht bestätigt

- **Vom Aufrufer gemeldet**:
  - `bun run lint`, `bun run check` und `cd backend && bun run type-check`
  - die ganze `bunx vitest run` (3197 grün, 7 Timeouts unter Last)
  - die ganze `cd backend && bun test`
  - `bunx fallow audit`
- **E2E und axe/Sprache der neuen Bildschirme** laufen laut Aufrufer noch. Ob die Seeds in `screens.ts` wirklich 3.00 «Erledigt» erzeugen und ob axe 0 Verstösse meldet, habe ich nur durch Lesen geprüft, nicht durch einen Lauf.
- **Stand von `origin/main`**: Ich habe ohne Fetch gelesen (lokale Ref a9db22dc). Sie liegt zwei Commits nach dem gemergten a50d72e3 und ändert nur CI und Doku, keine Migration. Ob `w10-issue-461` schon gepusht oder gemerged ist, konnte ich nicht feststellen; ein Remote-Branch dazu ist lokal nicht bekannt.
- **Übertrag nach dem Ersetzen**: Ein Entwurf, der den Übertrag verloren hat, übernimmt den der berichtigten Abrechnung erst bei einer Neuberechnung, nachdem diese erledigt ist. Wird er vorher versendet, fehlt der Übertrag. Das gehört zu den Lücken M-3, V-16 und C-5 der Fachreviews, darum ist es hier kein neuer Befund.
