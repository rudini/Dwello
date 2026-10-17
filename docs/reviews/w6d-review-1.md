# Code-Review W6d (#94): Mindest-Saldo CHF 5, Runde 1

Gegenstand: `git diff 69508c2 00ea019` (041baa4 @wip-Szenario, 00ea019 Umsetzung), Worktree `review-w6d-code`. Alle 25 geänderten Dateien gelesen.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `src/routes/statements/[id]/PaymentPanel.svelte:30,40-48` | Ausblenden von Zahlungsfrist/«Rückerstattung bis» und «Bezahlt am» unter CHF 5 (V-4, auch Saldo 0) ist in keiner Schicht getestet |
| C-2 | Major | `tests/e2e/features/statement-minimum-balance.feature:46` | Sichtbare Änderung «keine Mahnung nach dem Zurücksetzen» (V-2, `claimed()` in `+page.svelte:135`) hat kein Szenario, nur pg- und DOM-Test |
| C-3 | Minor | `src/routes/statements/[id]/+page.svelte:222`, `src/routes/statements/+page.svelte:185` | Nach dem Zurücksetzen sagt «Als bezahlt markieren» bei 0 < Saldo < 5 «Danach können Sie keine Mahnung mehr senden.», obwohl ohnehin keine möglich ist; `claimed()` statt `balance > 0` |
| C-4 | Minor | `backend/src/services/statement.service.ts:494` | Nach dem Zurücksetzen speichert «Als bezahlt markieren» ohne Betrag `paidAmount = balance` (z. B. 3.00) statt 0.00; `paidThisMonth` (`dashboard.ts:129-132`) zählt dann erlassene Franken als Einnahme (Fachreview V-2, gehört zu #291) |
| C-5 | Minor | `src/routes/statements/[id]/SendDialog.svelte` (nicht geändert) | Versand-Dialog nennt die Folge nicht (mit dem Versand bezahlt, Betrag erlassen); CLAUDE.md «Irreversible actions confirm with their real consequence» (Fachreview V-7, offen gelassen, ohne Issue) |
| C-6 | Minor | `tests/a11y/screens.json:453` | Neuer Zustand des Zahlungsfelds (erlassen, ohne Frist-Zeile) nicht als eigener Bildschirm in `screens.json`/`accessibility.feature`/`sprachen-bildschirme.feature`; nur Text und eine Zeile weniger als `statement-paid-detail`, daher Minor |
| C-7 | Nit | `backend/src/services/pdf.service.ts:940`, `src/lib/statement.ts:40` | shrink: `balance > 0 && !belowMinimum(balance)` ist `balance >= 5` |
| C-8 | Nit | `backend/src/__tests__/statement-pdf-render.test.ts:91` | lokale `const due` überschattet die Vorlage `due`; Saldo 4.15 liegt nicht auf dem 5-Rappen-Raster, das der gespeicherte Saldo hat |
| C-9 | Nit | `backend/src/__tests__/statement-lock.pg.test.ts:111,141` | fehlende Leerzeile vor, doppelte Leerzeile nach dem neuen `describe`; `today` von Hand statt `swissToday()` aus `../services/today` |

## C-1 (Major): Ausgeblendete Zeilen im Zahlungsfeld ungetestet

- **Warum falsch:** `PaymentPanel.svelte` blendet unter CHF 5 (Saldo 0 eingeschlossen, also auch eine bisher anders angezeigte Abrechnung) die Zeile Zahlungsfrist/«Rückerstattung bis» (`{#if !waived}`) und «Bezahlt am» (`waived ? null : statement.paidDate`) aus. Kein Test prüft das: Der neue DOM-Test (`statement-pages.dom.test.ts:480-489`) liest nur `statement-payment-summary`; die E2E-Schritte prüfen nur Zusammenfassung und Status. Der einzige Test auf `statement-payment-deadline` (`statement-pages.dom.test.ts:768`) prüft das Gegenteil bei −83.45. CLAUDE.md Workflow 2: jedes Verhalten über einen Test, der vorher rot war.
- **Wie zeigen:** `{#if !waived}` und `waived ? null :` entfernen: alle Tests bleiben grün. Fix: im DOM-Test z. B. `detail({ status: 'paid', balance: 4.95, paidDate: '2025-02-05' })` mit `byTestId('statement-payment-deadline')` null und `text()` ohne «Bezahlt am»; dazu ein Gegenbeispiel bei 5.

## C-2 (Major): Kein Szenario für «nicht mahnbar nach dem Zurücksetzen»

- **Warum falsch:** Direkt nach dem Versand ist die Abrechnung «Bezahlt»; einen Mahnknopf gab es dort schon vorher nicht. Neu sichtbar ist nur der Weg Zurücksetzen → überfällig → kein Mahnknopf (`owes={claimed(...)}`) und die Ablehnung `REMINDER_BELOW_MINIMUM`. CLAUDE.md Workflow 1 und die Pflichtprüfung des Reviews: eine Verhaltensänderung, die der Benutzer sieht, hat ein Szenario ohne `@wip`. Der Kommentar in Z. 46 verweist nur auf `reminders.pg.test.ts`; ein `No scenario: <reason>` gibt es nicht, und der E2E-Stack kann den Zustand herstellen (`seed.resetPayment`, `tests/e2e/fixtures/backend.ts:277`; Schritt «die Zahlungsfrist der Abrechnung … ist abgelaufen», `documents.feature:16`; Schritt zum Mahnknopf, laut Fachreview `documents.steps.ts:108`).
- **Wie zeigen:** `claimed()` in `+page.svelte:135` wieder auf `balance > 0` setzen: kein E2E-Szenario wird rot. Fix: Szenario «Nach dem Zurücksetzen der Zahlung wird ein Saldo unter CHF 5 nicht gemahnt» (1203, versendet, Zahlung zurückgesetzt, Frist abgelaufen → Status «Überfällig», keine Mahnung angeboten).

## Bestätigt

- CHF 5 fest, Vergleich mit dem gespeicherten `balance`: `belowMinimum` in `pdf-format.ts:121` und `src/lib/statement.ts:38`; Grenzbeispiele 5.00/−5.00 offen, 4.95/−4.95/0.05 erledigt (`statement-lock.pg.test.ts`), gerundete Grenzfälle 1205.02/1195.02 im Szenariogrundriss (V-6).
- PDF: Text erlassen/nicht ausbezahlt, kein Zahlteil, keine IBAN-Bitte, auch nach dem Versand ohne «Bezahlt am»/«Überwiesen am» (`pdf.service.ts:553-563,940`; Render-Tests und E2E-Szenarien 1–2 mit PDF nach dem Versand, V-1). Alle vier Sprachen im PDF.
- Erledigt beim Versand mit `paidAmount '0.00'` (`statement.service.ts:486-487`), Saldo 0 unverändert erfasst.
- Mahnung abgelehnt mit Code `REMINDER_BELOW_MINIMUM` (`reminder.service.ts:63-64`), Meldung `backend_reminder_below_minimum` in allen vier `messages/*.json`; pg-Test rot ohne die Zeile (Hilfsfunktion setzt `overdue` per Frist 2020).
- Neue UI-Texte (`statements_summary_waived_*`) in allen vier Dateien; Detailtext Rückerstattung im Szenario (V-9); V-3-Schritt entfernt.
- Screenplay: Schritt ruft nur die Frage `paymentSummary` (Text-Wert), Target mit `data-testid` `statement-payment-summary`; Feature ohne UI-Wörter.
- Rot ohne Änderung (gelesen): DOM-Tests (Zusammenfassung; Mahnknopf, da `detail({ status: 'overdue' })` sonst den Knopf zeigt, Z. 1064), Render-Tests, pg-Tests, alle E2E-Szenarien (Status/Text/PDF wären anders).
- Docs (PRD, data-model, Anforderungen) nennen die Regel; O-34 ist ein in dieser Arbeit gefundener nicht-fachlicher Punkt, kein fremder Umbau.

## Ponytail

- `pdf.service.ts:940`: shrink: `data.balance > 0 && !belowMinimum(data.balance)` → `data.balance >= 5` (C-7).
- `src/lib/statement.ts:40`: shrink: `claimed` → `balance >= 5` (C-7).
- net: -0 Zeilen (nur kürzere Ausdrücke). Sonst schlank.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (2791), `cd backend && bun run test` (806, Coverage), E2E des neuen Features (10 Szenarien, chromium): vom Aufrufer gemeldet, nicht neu ausgeführt. Der breitere E2E-Lauf `@statements` (chromium + api) lief laut Aufrufer noch: Ergebnis unbekannt.
- Der Refactor nach 00ea019 (`settledText`, `claimed()`) liegt im geprüften Commit bereits vor; ob der Aufrufer noch einen späteren Commit hat, nicht geprüft.
- `backend-codes.test.ts` erfasst `ReminderError(...)` mit seinem Muster nicht (vorbestehend); die Meldung existiert trotzdem, von Hand geprüft.
- Zusammenspiel mit #341 (Rundung zugunsten des Mieters): nicht gemergt, nicht geprüft; die Grenzbeispiele liegen laut Fachreview in beiden Rundungen gleich.
- Übersicht (`src/lib/overview.ts:118-124`): eine zurückgesetzte, überfällige Kleinsaldo-Abrechnung zählt weiter als Aufgabe «Überfällig» (Ziel: als bezahlt markieren); nicht als Befund gewertet, da #291 das Zurücksetzen selbst behandelt.
