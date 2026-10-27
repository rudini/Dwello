# Code-Review #745, Runde 1 (9cf49618..b2b8cbc4)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: Der Diff (nur `backend/src/__tests__/statement-pdf.pg.test.ts:261-274`) erfüllt «Done means» von #745 wörtlich (Leistungszeitraum 01.12.2024 – 28.02.2025, Abrechnung 2025, Zeile mit ganzer Rechnung und Teil). Die erwarteten Werte stimmen nachgerechnet (90 Tage gesamt, 59 in 2025, 900 × 59/90 = 590.00, Mietstage ab 01.02.2025 = 28 von 59). Das Verhalten besteht auf dem Basis-Commit (`inPeriod`, `invoice.service.ts:575-577`, `beyond` prüft auch `start !== servicePeriodStart`), der Commit nennt das Festhalten bestehenden Verhaltens, also kein Rot-Lauf nötig. Der Test würde fehlschlagen, wenn `whole` nur bei einem Ende nach der Periode gesetzt würde. Er folgt dem Muster der Nachbartests (eigenes Mietverhältnis, Aufräumen vor dem Assert). Titel und Kommentar sagen, was er prüft. Kein Szenario nötig (reiner Test, kein Verhalten geändert). Nichts ohne Bezug zur Anforderung.

## Nicht bestätigt

- `cd backend && bun run type-check`, `bunx eslint src/__tests__/statement-pdf.pg.test.ts`, `bun test src/__tests__/statement-pdf.pg.test.ts` (62 pass), Prettier-Diff der geänderten Zeilen: vom Aufrufer gemeldet, nicht erneut ausgeführt (pg-Test schreibt in die Testdatenbank).
- Die Aussage des Kommentars, dass eine einzelne Rechnung nur den Bruch «28/59 Tage» druckt und erst eine zweite Rechnung über andere Tage die Zeilen je Rechnung erzeugt: vom Aufrufer gemeldet; gestützt durch die Nachbartests (`statement-pdf.pg.test.ts:212-214` gegen `:222-240`), den Druckcode nicht gelesen.
