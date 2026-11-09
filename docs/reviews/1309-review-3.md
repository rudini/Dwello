# Code-Review #1309 / #1310 / #1315 / #1323 / #1331 / #1333 / #1336, Runde 3 (Schlussrunde, 7ee611a..58270f7)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/services/held-invoices.ts:36-39 (Stand Runde 1) | offen aus Runde 1 (Veränderung Tankbestand von 0.00 hält an) |
| C-2 | Minor | backend/src/services/fuel-stock.service.ts:80, held-invoices.ts | offen aus Runde 1 (Standard-Verteilschlüssel ohne Lieferung hält nicht an) |
| C-6 | Major | backend/src/services/statement-pdf.service.ts (PDF des Entwurfs), #1333 | #1333 «Decided (product owner)» hält inzwischen auch V-3 fest: Solange sich ein Verteilschlüssel des Entwurfs nicht berechnen lässt, lehnt Dwello auch das PDF des Entwurfs ab (`STATEMENT_KEY_NOT_CALCULABLE`, Ablehnungsseite von #1094). Das fehlt im Diff |
| C-7 | Major | backend/src/services/held-invoices.ts:33-42, tests/e2e/features/statement-generate.feature | #1336 ist ein Bugfix, den der Verwalter sieht (der Abrechnungslauf hält an oder eben nicht). Der Diff hat dafür kein Szenario, und kein Commit nennt `No scenario: <reason>` |
| C-8 | Minor | backend/src/__tests__/statement-key-failure.pg.test.ts:114-140 | Beide neuen #1336-Tests setzen «Aufgehoben ab» auf den Periodenbeginn (`2025-01-01`), so dass `cuts` immer leer bleibt. Die Teilung an einem Tag innerhalb der Periode (`held-invoices.ts:35-36`, also Fall 2 des Issues «once one is gone») hat keinen Test: Wer `cuts` entfernt, bricht keinen Test |
| C-9 | Minor | backend/src/services/held-invoices.ts:36-40 | Die Prüfung rechnet jeden Teil der Periode, die Berechnung (`prorating.service.ts`, `partShare`) dagegen nur die Teile, in denen eine Rechnung des Verteilschlüssels Tage abrechnet. Scheitert die Formel nur im zweiten Teil und liegt der Leistungszeitraum jeder Rechnung des Verteilschlüssels ganz im ersten, hält der Lauf an, obwohl die Berechnung gelingen würde |
| C-10 | Minor | backend/src/services/statement-invoices.service.ts:34 | Beim Verschieben von `agreedIn` nach `held-invoices.ts` ist sein Kommentar stehen geblieben. Er steht jetzt ohne Code über dem Kommentar von `known` |
| C-11 | Minor | docs/api-specification.md:312-313 | Die Zeilen `POST /:id/send` und `PUT /:id/status` nennen die neue Ablehnung 400 `STATEMENT_KEY_NOT_CALCULABLE` (#1333) nicht. Sie steht nur in der Zeile von `GET /invoices/completeness`, anders als bei `/:id/replace` (Zeile 315) |

Geschlossen: C-4, C-5.

## C-6 (Major): Das PDF des Entwurfs wird nicht abgelehnt

- `gh api repos/rudini/Dwello/issues/1333`, «Decided (product owner)», zweiter Punkt (2026-11-08): «while a key of the draft cannot be calculated, the draft's PDF is refused too (`STATEMENT_KEY_NOT_CALCULABLE`, refusal page of #1094), until the key is fixed (option A, not the recommended B)». Der Aufrufer bezeichnet V-3 noch als offene Frage an den Product Owner. Die Antwort ist wohl erst nach 58270f7 ins Issue gekommen.
- `grep refuseUncalculableKeys backend/src` findet die Prüfung nur bei generate, status, send und correction/replace, nicht im PDF-Weg (`statement-pdf.service.ts`, `GET /statements/:id/pdf`). Schliesst der Pull Request #1333, fehlt ein entschiedener Teil davon. Der Vermieter kann das PDF mit der nicht vereinbarten Verteilung weiterhin herunterladen und selbst zustellen (Fachreview 1333-1 V-3).
- Nachweis: Den Entwurf aus `statement-key-failure.pg.test.ts:188-208` über `GET /api/v1/statements/${draft}/pdf` abrufen. Die Antwort ist 200 mit dem PDF statt `STATEMENT_KEY_NOT_CALCULABLE`. Nötig sind ausserdem ein Szenario (Ablehnungsseite) und eine Zeile für den neuen Zustand in `screens.json`/`accessibility.feature`/`sprachen-bildschirme.feature`, falls die Ablehnungsseite mit diesem Text ein neuer Zustand ist.

## C-7 (Major): #1336 ohne Szenario

- CLAUDE.md, Workflow 1, verlangt für jeden Bugfix, den der Benutzer sieht, ein Szenario. Das Issue verlangt es ausdrücklich unter «Done means»: «a scenario in `tests/e2e/features/statement-generate.feature`, or `No scenario: <reason>`». 2d5810f bringt nur die pg-Tests. Weder die Commit-Nachricht noch die Archiv-Session nennt einen Grund.
- Der E2E-Stack kann den Zustand erzeugen; das Issue beschreibt selbst, wie: eine Wohnung mit 3.5 Zimmern «aufgehoben ab» 01.01.2025, ein eigener Verteilschlüssel auf einer Rechnung von 2025, der Lauf für 2025. Ein Grund für «No scenario» ist darum nicht ersichtlich.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`, volles vitest (4672), Backend `bun run test` (2173, Coverage), E2E chromium `statement-detail.feature` und `statement-generate.feature` (255), accessibility/sprachen `-g "uncalculable|late|uncategorized|heating-without"` (16), alle auf 58270f7. Ebenfalls vom Aufrufer gemeldet: das @wip-Szenario von #1333 rot an der Ablehnung, die pg-Tests von #1336 und der V-2-Test rot.
- Rot gesehen habe ich nichts. Beim Lesen schlägt jeder neue Test ohne die Änderung fehl:
  - Send/Status-Test: ohne Prüfung 200 bzw. ungültiger Übergang ohne Code.
  - V-2-Test: ohne `agreedIn` lehnt der Lift-Verteilschlüssel ab.
  - #1336-Tests: über alle Wohnungen scheitert «Nur 2.01», und «Ohne 2 Zimmer» gelingt.
  - `backend-error`-Test: ohne `then` in `codeParams` erscheint der Code roh.
  - DOM-Test C-4: ohne `note` fehlt die Bemerkung.
  - Szenario: ohne Ablehnung fehlt die Fehlermeldung.
- Den Sendeweg per E-Mail habe ich nur gelesen: `sendStatement` prüft vor dem Mail, `changeStatementStatus` danach ein zweites Mal. Ob zwischen Mail und Statuswechsel eine Ablehnung möglich ist (nur bei einer gleichzeitigen Formeländerung), habe ich nicht verfolgt.
- Ob `GET /statements/:id/pdf` des Entwurfs ausserhalb von `refuseUncalculableKeys` etwas prüft, habe ich nur mit grep gesucht, ohne den PDF-Dienst ganz zu lesen (C-6).
- Ausserhalb des Diffs: Das Szenario «Ein Entwurf mit einem Verteilschlüssel, der sich nicht berechnen lässt, wird nicht versendet» geht über `/send` (der Dialog nutzt nur diesen Weg, `statement-actions.ts:61-75`). `PUT /status` ist nur im pg-Test belegt.

Geprüft: Texte von `backend_statement_key_then_*`, `statements_send_outdated_key` und `statements_later_key_draft` in allen vier Sprachen wörtlich gleich der Tabelle in docs/reviews/1333-fachreview-1.md; `then` bei allen Aufrufern (generate, replace und correction mit dem Vorgabewert RETRY, send und status mit RECALCULATE); `agreedIn` verschoben, nicht kopiert, und die Ablehnung beim Versenden passt zum Hinweis (`statement-invoices.service.ts:105`); `countingOn`/Schnitttage stimmen mit `partsOf`/`partShare` überein, bis auf C-9; C-4 (`fuelStock` je Rechnung, Mapper- und Komponententyp, `note` wie in der Vorschau); C-5 (Contract, Prüfung in `api-contracts.pg.test.ts`, DOM-Test liest ihn); neue Zeile `send-dialog` in screens.json und in beiden Features, `stateMeanings` vorhanden; Szenario ohne UI-Wörter, Schritte bestehend; ponytail-review: nichts Unbenutztes ausser C-10.
