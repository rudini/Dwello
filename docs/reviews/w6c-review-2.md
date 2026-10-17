# Code-Review W6c, Runde 2 (Schlussrunde vor dem Push)

Gegenstand: `git diff 7ac04a3 38e8b36`, Worktree `review-w6c-code2`. Die Code-Dateien des Diffs habe ich alle gelesen: `reminders.pg.test.ts`, `pdf.service.ts`, `reminder-pdf.ts`, `reminder.service.ts`, `PRD-Dwello.md`, `implementation_plan.md`, `messages/en.json`, `help.feature`, `targets/documents.ts`. Die Berichte von Runde 1 (`w6c-review-1.md`), `w6c-fachreview-2.md` (V-6, V-9, M-4) und `w6c-datenpruefung-1.md` (D-1) habe ich nur als Quelle für die Anforderung gelesen. Ausserdem gelesen: `paymentPart`/`addresses` in `pdf.service.ts`, `reminder-letter.ts` und `.prettierrc`. Die Persona-Berichte aus a85fef6 und 7680050 habe ich nicht geprüft, weil sie kein Code sind.

Keine Blocker, keine Majors.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-13 | Minor | backend/src/__tests__/reminders.pg.test.ts:470-479 | Der neue Test mit einer Seite pro Mahnung prüft nur `language: 'de'`. Die Anforderung verlangt «jede Mahnstufe und Sprache», und fr/it haben die längeren Absätze (z. B. it, Stufe 3). Zwischen Briefende und Schwelle liegen nach dem Worst-Case-Lauf des Aufrufers nur 14 pt, also etwa eine Zeile. Fr, it und en sind damit nur durch den einmaligen Lauf des Aufrufers belegt, nicht dauerhaft. Billig zu schliessen: in der Schleife auch über `['de', 'fr', 'it', 'en']` laufen. |
| C-14 | Nit | backend/src/__tests__/reminders.pg.test.ts:464-465 | Zwei Kommentare sagen hintereinander dasselbe: `// letter, receipt, payment part` am Betrag und darunter `// in the letter, on the receipt and on the payment part` für die Referenz. Einer reicht, wenn er über beiden Zeilen steht. |

ponytail-review: Das Delta ist schlank. Die Konstante `language` setzt C-11 um (-1 Wiederholung). Die zwei umbrochenen Signaturen (`paymentPart` und den Parameter `payment` von `renderReminderPdf`) hat Prettier umbrochen (`printWidth: 100`). Beide Zeilen stammen aus W6c selbst, also ist das kein fremder Diff. Lean already. Ship.

## Bestätigt

- **D-1 / C-1 / V-6 (eine Seite):**
  - `reminder-pdf.ts` beginnt das Datum bei 215 pt statt 250, den Betreff bei 245 pt statt 290 und verkleinert die Abstände (`moveDown()` statt `1.5`, `moveDown(1.5)` statt `2`).
  - `addPaymentPart` bricht erst ab `doc.y > 841.89 − 297.64 − 16 ≈ 528 pt` um. Der Text «Vor der Einzahlung abzutrennen» steht bei `top − 12` (7 pt), es bleiben also 4 pt Luft. Die Schwelle verträgt sich mit `paymentPart`.
  - Das JSDoc «at the foot of the letter's page … a new page when the letter reaches into it» stimmt jetzt für den Regelfall.
  - Der Seitenumbruch bleibt als Rückfall erhalten.
  - Das Datum (x = 70) und die Empfängeradresse (x = 330, Breite 200) liegen in getrennten Spalten. Auch eine Adresse mit 5 Zeilen (bis ca. 205 pt) berührt das Datum nicht.
  - Test «druckt jede Mahnstufe mit dem Zahlteil auf eine Seite»: Er nutzt die QR-IBAN aus `beforeAll`, also den längeren Brief mit Referenz. Die Regex `/Type /Page\b` trifft `/Type /Pages` nicht. Ohne die Änderung wäre der Test rot: Nach Runde 1 und V-6 endete schon die kürzeste Zahlungserinnerung über 520 pt, also 2 Seiten.
- **C-2 / V-9:** Der Test zählt `'120.00'` 3× (Brief «CHF 120.00», Empfangsschein, Zahlteil). Ohne Zahlteil gäbe es nur 1 Vorkommen, der Test wäre also rot. Das QR-Code-Dekodieren aus V-9 bleibt offen, siehe «Nicht bestätigt».
- **C-7:** Der Szenario-Titel in `help.feature:27` lautet jetzt «… von der Zahlungsfrist mit Kündigungsandrohung ab». Das ist ein reiner Titel, die Steps und ihre Strenge sind unverändert.
- **C-8:** Die PRD «Reminder Content» nennt jetzt den Zahlteil, die Referenz der Abrechnung und «none once the statement is paid». Das stimmt mit `reminder.service.ts:96` überein.
- **C-10:** `openDocumentLink` setzt den Text mit `.trim()` zusammen. Ohne Mieter entsteht so ein Leerzeichen, wie bei `documentRow`. Es ist nur die Beschreibung, der Locator ist unverändert.
- **C-11:** `const language = tenant.language as Language` wird zweimal verwendet.
- **C-12:** Die doppelte Leerzeile in `implementation_plan.md` ist entfernt. Die Checkliste ist nachgeführt, der Punkt «fixes» ist noch offen, wie es sich während der Arbeit gehört.
- **M-4:** In en.json steht jetzt «It does not set a payment deadline with a warning of termination». Der Hinweis nennt die Zahlungsfrist damit nur noch mit einem Ausdruck. Die anderen drei Sprachen sind unverändert, keine weitere Fundstelle von «time limit for payment».
- **Szenario:** Die Änderung am Layout korrigiert das noch nicht gemergte Feature #108. Dessen Szenario «Zahlungserinnerung mit Zahlteil …» besteht schon. Die Seitenzahl kann die E2E-Ebene nicht besser zeigen als der pg-Test (lowest layer).
- **Kein Bedarf an a11y- und Vertragsanpassungen:** Es gibt keinen neuen Bildschirm, keine neue Antwort, keinen neuen UI-Text ausser M-4 und keine `data-testid`.
- **Nichts Fremdes im Diff.**

## Nicht bestätigt

- **Layout am echten PDF:** Kein PDF gerendert. Dass der Brief höchstens bei 514 pt endet (alle Sprachen und Stufen, langer Name, Adresse über zwei Zeilen, 5-stelliger Betrag), ist vom Aufrufer gemeldet. Gelesen habe ich nur die Koordinaten in `reminder-pdf.ts`. Der daten-pruefer prüft das in seiner neuen Runde nach.
- **Briefumschlag mit Fenster:**
  - Der Betreff beginnt jetzt bei 245 pt (86 mm). Ein langer Betreff, z. B. it «Promemoria di pagamento – Conteggio spese accessorie …» in 14 pt fett, reicht nach rechts über x = 330 hinaus.
  - Ob er dann im unteren Rand des Fensters sichtbar wird, hängt von der Fensterhöhe ab. Laut Kommentar in `pdf.service.ts:508` liegt das Fenster 45 mm vom oberen Rand, seine Höhe ist nirgends dokumentiert.
  - Die Abrechnung setzt ihren Titel schon heute bei ca. 212 pt über die ganze Breite (`addresses` mit `top + 60 + 24`). Die Mahnung bleibt damit innerhalb des bestehenden Musters, deshalb kein Befund.
- **Inhalt des QR-Codes der Mahnung** (Betrag, QRR/NON, Mitteilung): Kein Test dekodiert ihn (V-9, zweiter Teil). Gelesen nur über `generateQRBillForStatement`.
- **Neu ausgeführt habe ich nichts.** Ein pg-Test schreibt in die Datenbank, und das Frontend-Delta betrifft keinen vitest-Test, sondern nur eine E2E-Beschreibung und `en.json`.
- **Vom Aufrufer gemeldet, nicht neu ausgeführt:**
  - `bun run lint`
  - `bun run check`
  - `cd backend && bun run type-check`
  - `bunx vitest run` (2711)
  - backend `reminders.pg.test.ts`, `statement-pdf*`, `pdf*`, `reminder*` (143 pass)
  - E2E chromium «Mahnungen|Hilfe|Dokumente» (33 passed)
  - Worst-Case-Render über alle Sprachen und Stufen
