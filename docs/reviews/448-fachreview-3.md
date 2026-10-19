# Fachreview #448, Runde 3 (Fixes der Majors aus Runde 2)

Gegenstand: `git diff c326846d cfd4be1c` (Worktree `review-448-fach3`, Commit 43460275). Vorheriger Bericht: `docs/reviews/448-fachreview-2.md`. Anforderung: #448, Abschnitt «2026-10-19 (by coordinator on the product owner's delegation …)»: V-14/M-5-Regel, V-6, V-15, V-19, V-20 entschieden. Keine neuen Rechtsfragen; Gesetzeszitate wie in Runde 1/2.

## Status der offenen IDs

| ID | Status | Beleg | Empfehlung eindeutig |
|---|---|---|---|
| V-14 (Major) | **erledigt** | `statement.service.ts:387-392` `countedBy` mit `counting.status <> 'draft'`; `offsetOf()` (Z. 752-765) leert im selben Vorgang `carried_from_id` des Entwurfs und zieht den Saldo der ersetzten Abrechnung ab. pg-Test «nimmt einem Entwurf, der den Saldo zählt, den Übertrag …». Testlücke: V-24. | ja |
| M-5 (Major) | **erledigt** | `offsetOf()` filtert mit `carriable` statt `status === 'settled'`; pg-Test «rechnet eine nach #94 erledigte Rückerstattung … als verrechnet an» (`priorPayments -3.00`, `balance 3.00`). Bestätigungstext dazu: V-25. | ja |
| V-6 (Minor) | **erledigt** | `pdf.service.ts` `carriedDue`/`carriedRefund` in vier Sprachen, wörtlich der Vorschlag aus Runde 1; Rückerstattung ohne «nichts bezahlen» (Render-Test `not.toContain('bezahlen')`). FR «décompte des charges», IT «conteggio delle spese accessorie», EN «utility cost statement» gleichbedeutend. | ja |
| V-15 (Minor) | **erledigt** | `UBIQUITOUS_LANGUAGE.md` neue Zeile «Bereits verrechnet mit NK-…» und geänderte «Berichtigte Abrechnung», wörtlich der Vorschlag; im Issue entschieden (V-15). | ja |
| V-17 (Minor) | **erledigt** | `statement-pdf.service.ts:170` `final && status !== 'settled'`, `src/lib/statement.ts` `unpaid()` mit `status === 'settled'` (damit auch `claimed()`); Tests `statement-pdf-data.test.ts`, `statement-pages.dom.test.ts`. Mahnung: `reminder.service.ts:58` nur `sent`/`overdue`, nicht betroffen. Rest für eine #94-Rückerstattung siehe V-23. | ja |
| V-18 (Minor) | **erledigt** | `PaymentPanel.svelte`: #94-Rückerstattung zeigt `statements_summary_carried`, `statements_summary_waived_refund` in allen vier Dateien entfernt; Nachzahlung behält «Sie verzichten darauf.». | ja |
| V-19 (Minor) | **erledigt** | `glossary_balance_text` DE wörtlich der Vorschlag; FR «moins ses acomptes, plus un montant à payer reporté ou moins un remboursement reporté du décompte précédent», IT und EN entsprechend. Nachgerechnet: Rundung `roundTo5Rappen` = Abrunden auf 0.05 (`pdf-format.ts:20`), nach dem Einrechnen des Übertrags (`calculateBalance(totalCosts + carryOver, …)`), wie der Text sagt. | ja |
| V-20 (Minor) | **erledigt** | EN `statements_status_settled` «Closed», `i18n-begriffe.md` ohne ❓ (im Issue entschieden). | ja |
| V-21 (Nit) | **erledigt** | EN «…, including a partial payment.» / «…, including a partial amount.» | ja |
| C-3 (Texte der Bestätigung) | **bestätigt, eine Lücke** | `statements_correct_open`, `_open_refund`, `_open_settled` in vier Sprachen geprüft, siehe unten; Lücke V-25. | ja |
| V-16/M-3, V-11, M-2, M-4, V-13, V-22 | offen (Minor/Nit) | unverändert, nicht erneut geprüft | – |

## Nachrechnung V-14 (Beispiele aus Runde 2)

A 2024 erledigt, B 2025 Entwurf mit eigenem Saldo 50.00, zählt A. A wird berichtigt, richtiger Saldo der Periode 2024 = 20.00.

| Fall | B vorher | `offsetOf` | A' | B nach Ersetzen | B neu berechnet | Summe | Soll |
|---|---|---|---|---|---|---|---|
| Nachzahlung A +3.00 | 53.00 | `countedBy` null (Entwurf) → kein `paidAmount`; B: 53.00 − 3.00 | 20.00 − 0 = 20.00 | 50.00, ohne Übertrag | 50.00 (A ersetzt, A' Entwurf, nicht `carriable`) | 70.00 | 70.00 |
| Rückerstattung A −3.00 | 47.00 | B: 47.00 − (−3.00) | 20.00 | 50.00 | 50.00 | 70.00 | 70.00 |
| Randfall A' unverändert 3.00 | 53.00 | B: 50.00 | 3.00, versendet → «Erledigt», `carriable` | 50.00 | nach dem Versand von A' neu berechnet: 53.00 (Übertrag aus A') | 53.00 | 53.00 |
| Kontrolle: B versendet vor dem Ersetzen | 53.00 «Erledigt»/versendet | `countedBy` = B → `paidAmount` 3.00, Entwurf-Update trifft nichts | 20.00 − 3.00 = 17.00 | 53.00 | – | 70.00 | 70.00 |

Rundung beim Abzug: `balance` von B ist abgerundet auf 0.05 (floor), der Übertrag ist ein gespeicherter Saldo, also ein Vielfaches von 0.05. Damit gilt floor(x + c) − c = floor(x): das Abziehen ergibt denselben Saldo wie eine Neuberechnung ohne Übertrag. Beispiel: eigener Saldo roh 2.02, Übertrag −3.00: floor(−0.98) = −1.00; −1.00 + 3.00 = 2.00 = floor(2.02). Umgekehrt roh −1.02, Übertrag +3.00: floor(1.98) = 1.95; 1.95 − 3.00 = −1.05 = floor(−1.02). Bestätigt.

Das PDF eines Entwurfs wird bei jedem Abruf neu erstellt (`statement-pdf.service.ts:345`), ein veralteter Entwurf-PDF mit dem alten Übertrag entsteht also nicht.

Doppelzählung: `carriedOver()` schliesst eine Abrechnung aus, die irgendeine andere Periode zählt, auch ein Entwurf (`not exists … counting.carried_from_id`, ohne Statusfilter). Zwei Entwürfe können denselben Saldo nicht beide zählen. Bestätigt.

## Nachrechnung M-5 (Beispiel aus Runde 2)

A 2024 nach #94 «Bezahlt», `paidAmount` 0.00, Saldo −3.00; B 2025 versendet mit «Übertrag aus Abrechnung A: – 3.00».

- A' mit richtigem Saldo +7.00: `carriable` trifft A (paid, 0, −5 < −3 < 0), `countedBy` = B → `paidAmount` −3.00; `paidSoFar` −3.00; A' = 7.00 − (−3.00) = 10.00. Richtig (B hat 3.00 schon gutgeschrieben). Runde 2: 7.00.
- A' unverändert −3.00: −3.00 + 3.00 = 0.00, «Erledigt»; keine doppelte Rückerstattung. Richtig.
- B noch Entwurf (Randfall): `countedBy` null; B: 47.00 − (−3.00) = 50.00; A' = −3.00, versendet → «Erledigt», übertragbar; die nächste (neu berechnete) Abrechnung nimmt −3.00. Richtig.
- Eine wirklich ausbezahlte kleine Rückerstattung (`paidAmount` = Saldo ≠ 0) ist nicht `carriable` → `offsetOf` gibt nichts zurück, `paidAmount` bleibt der erfasste Betrag. Richtig.
- Anzeige: `correctionsOf()` nimmt A in `offsetWith` («Bereits verrechnet mit B»), nicht in «Bereits zurückerstattet auf», weil `countedBy` gesetzt ist. Bestätigt.

## Texte der Bestätigung beim Berichtigen (C-3)

| Text | Urteil |
|---|---|
| `statements_correct_open` «… Was der Mieter schon überwiesen hat, tragen Sie bei «Bereits bezahlt» ein.» | bestätigt; der Feldname stimmt mit `statements_correct_paid_amount` überein (DE/FR «Déjà payé»/IT «Già pagato»/EN «Already paid»). |
| `statements_correct_open_refund` «… Was Sie schon überwiesen haben, tragen Sie bei «Bereits zurückerstattet» ein.» | bestätigt; Feldname stimmt in vier Sprachen (`statements_correct_refunded_amount`). |
| `statements_correct_open_settled` «… Die bisherige bleibt unverändert erhalten. Enthält eine versendete nächste Abrechnung ihren Saldo schon als Übertrag, rechnet die berichtigte ihn als «Bereits verrechnet» an.» | inhaltlich richtig und mit der V-14-Regel übereinstimmend («versendete»); FR/IT/EN gleichbedeutend, «Déjà compensé»/«Già compensato»/«Already offset» passen zur Zeile `statements_offset_with`. Lücke: V-25. |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-23 | Verwalter | Minor | Der Entwurf B, der den Übertrag verloren hat, nimmt den Saldo der berichtigten A' nur, wenn er nach dem Versand von A' neu berechnet wird; sonst geht er an die übernächste Abrechnung, und ist B die Schlussabrechnung, geht er verloren (gleiche Familie wie M-3/V-16). Dasselbe gilt für eine #94-Rückerstattung, deren Periode durch ein späteres Vertragsende zur Schlussabrechnung wird: Die Detailseite sagt «… mit der nächsten Abrechnung verrechnet», eine nächste gibt es nicht. Fix (nicht eindeutig, PO): beim Versand eines Entwurfs prüfen, ob `carriedOver()` jetzt einen anderen Übertrag fände, und dann «Berechnen Sie die Abrechnung neu» zeigen; oder mit M-3 lösen. |
| V-24 | Verwalter | Minor | Der pg-Test zu V-14 berechnet den Entwurf vor der Prüfung neu; er bliebe grün ohne das Entwurf-Update in `offsetOf()` (die Neuberechnung findet A ohnehin nicht mehr). Fix (eindeutig): zusätzlich direkt nach dem Ersetzen `read(draft)` prüfen (`balance` ohne Übertrag, `carriedFrom: null`), am besten mit eigenem Saldo ≠ 0 und Rückerstattung (47.00 → 50.00). |
| V-25 | Verwalter | Minor | Beim Berichtigen einer nach #94 erledigten Rückerstattung (Status «Bezahlt», 0.00) zeigt `Correction.svelte` `statements_correct_settled` («Die bisherige bleibt unverändert erhalten.»), obwohl seit M-5 der Saldo als «Bereits verrechnet» angerechnet wird. Fix (eindeutig): `unpaidConsequence` auch für `status === 'paid' && paidAmount === 0 && -5 < balance < 0` mit `statements_correct_open_settled`, dazu ein DOM-Test. Optional (Nit): in `_open_settled` ergänzen «Ein Entwurf, der ihn als Übertrag enthält, verliert ihn.», weil das Ersetzen den Entwurf ändert. |

## Vorgeschlagene Begriffe

Keine neuen; V-15 ist umgesetzt.

## Nicht bestätigt

- Tests nicht ausgeführt: `bun test` im Worktree wurde blockiert (`node_modules` verweist auf den Arbeitsbaum des Aufrufers, Zugriff verweigert). Alle Beträge oben von Hand nachgerechnet aus `statement.service.ts` (`calculateStatement`, `carriedOver`, `carriable`, `countedBy`, `offsetOf`, `recalculateStatement`, `paidSoFar`), `calculation.service.ts:292` und `pdf-format.ts:20`.
- Ob die Detailseite des Entwurfs B nach dem Ersetzen von A ohne Neuladen die neue Summe zeigt: nicht geprüft (UI-Frage, kein Fachpunkt).
- Ob der Mieter bei einem Übertrag die sofortige Auszahlung verlangen kann (M-2, Art. 75 OR): unverändert aus Runde 1, keine Rechtsprechung gesucht.
