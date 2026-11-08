# Code-Review #707, Runde 1 (`git diff 75b78a9 ea0f7a0`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: alle fünf geänderten Dateien. Ich habe jede Zeile der Anforderung mit Code und Test abgeglichen:
- paid_amount: bestehender Test `demo-data.pg.test.ts:81`.
- Leistungszeitraum über den Jahreswechsel: SR-2024-016 in `demo-data.sql:227-230`, Test `:137`. 184/365 und 181/365 von 730.00 ergeben 368.00 und 362.00.
- Wohnungsnummern 0.01/1.01/2.01: `demo-data.sql:37-39`, Test `:130`.
- created_at/pdf_generated_at am Abrechnungsdatum, nur bei nicht-Entwürfen und nach `generateStatementPdf`: `demo-data.ts:56-58`, Test `:119`. Es gibt 9 versendete Abrechnungen 2024 und eine 2025, also 10.

Die Rückdatierung bricht keine Logik, die die Zeitstempel liest:
- `recordedAfter`: greift nur ohne gespeicherte Rechnungen (`known`).
- `editedSince`.
- `paidPdf`: pdfGeneratedAt < paymentRecordedAt, wie vorher.
- Sortierung der Liste.

Weitere Punkte:
- Der bestehende Test `:230` (Fernwärme-Leistungszeitraum) filtert nach Beschreibung. Die neue Rechnung stört ihn nicht.
- In Code und Dokumenten ausserhalb der Persona- und Review-Berichte sind keine Verweise auf EG/OG1/OG2 übrig. Diese Berichte sind Verlauf.
- Die Wahl «No scenario» passt zu `tests/e2e/CLAUDE.md` (CLI-Skript).
- Es gibt keine UI-Texte, keine Verträge und keinen E2E-Code.
- Die Commit-Betreffe passen zur Konvention.
- Ich habe ponytail-review angewendet: nichts zu streichen.
- Rot nach Lesen: Alle drei neuen Tests schlagen auf dem Basis-Commit fehl:
  - Die Erstellung am Ladetag liegt nach statement_date.
  - Die Nummern EG/OG1/OG2 passen auf die Regex.
  - Seepark hatte keine Gartenpflege, also `[]`.

## Nicht bestätigt

- `cd backend && bun test src/__tests__/demo-data.pg.test.ts`, 17 pass 0 fail: vom Aufrufer gemeldet.
- Dass die drei neuen Tests vor ihrer Änderung rot waren: vom Aufrufer gemeldet. Nach Lesen stimmig, siehe oben.
- `bun run type-check` (backend), sauber auf 691d717: vom Aufrufer gemeldet.
- Commit-Hooks auf beiden Commits bestanden: vom Aufrufer gemeldet.
- Ob `zeigt eine Nachzahlung und eine Rückzahlung` (`demo-data.pg.test.ts:88`) mit den zusätzlichen 368.00 in Seepark 2024 noch gilt: Ich habe die Salden nicht nachgerechnet. Das zeigt nur der gemeldete Testlauf (17 pass). So steht es auch in `docs/reviews/707-fachreview-1.md`, «Nicht bestätigt».
- Lint, check und fitness wurden nicht ausgeführt (laut Aufrufer kein Frontend-File geändert; die Diff-Statistik bestätigt das).
