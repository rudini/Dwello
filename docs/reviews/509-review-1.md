# Code-Review #509, Runde 1 (9f03c10..381c7c7)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/__tests__/statement-pdf.pg.test.ts:430 | Der Testname «nennt bei einer Heizposition nach Tagen im Leistungszeitraum den Anteil nach Heizprofil des Laufs» sagt seit der Änderung das Gegenteil dessen, was der Test prüft (`not.toContain('für eine Rechnung ohne Leistungszeitraum')`, Kommentar :428-429 ist angepasst, der Name nicht). |

Keine Blocker, keine Majors.

Geprüft: `heatingNoteKey`/`noRunShare` gegen `calculation.service.ts:207-224` (eine Gruppe nur aus Rechnungen ohne Leistungszeitraum oder mit den Daten der Periode hat keine `invoiceParts` und trägt den Anteil des Laufs: dann bleibt `heatingNoteParts` samt Monatszeile, wie M-1 verlangt; gemischte Gruppen tragen `noPeriod`-Zeilen: ebenfalls `heatingNoteParts`); Refactor `periodSums` verhaltensgleich zum alten Zweig (`months!` durch die Prüfung davor gedeckt); neuer Schlüssel `heatingNoteOwn` in de/fr/it/en, fr/it klein nach dem Doppelpunkt, fr mit geschützten Leerzeichen; Render-Test rot auf der Basis (Basis druckt «52.00 % für eine Rechnung ohne Leistungszeitraum»), M-1-Test hält Basisverhalten fest und der Commit 381c7c7 nennt das; Testdaten nachgerechnet (Mai 2 / 5 = 40 %, 61/91 Tage, (0 + 400)/2000 = 0.20); Szenario rot auf der Basis an «steht im PDF nicht "ohne Leistungszeitraum"» (Basis: 82.00 % …), Schritte bestehen (`tests/e2e/steps/statement-detail.steps.ts:291`), kein `@wip`; kein neuer Bildschirm, keine UI-Texte in `messages/*.json` nötig (PDF-Texte im Backend); keine fachfremden Änderungen ausser dem von fallow verlangten Refactor.

## Nicht bestätigt

- Lint, `bun run check`, `bun run type-check`, `statement-pdf-render.test.ts` (138), `statement-pdf.pg.test.ts` (56), E2E `statement-detail.feature` chromium + api (99): vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Roter Lauf des M-1-Tests gegen eine naive Umsetzung: vom Aufrufer gemeldet; per Lesen nur bestätigt, dass `noRunShare` ohne die Prüfung `item.invoiceParts &&` ihn rot machen würde.
- Ob die Detailseite der Abrechnung (UI) denselben Anteil des Laufs nennt: nicht geprüft, das Issue betrifft nur das PDF (in `messages/` und `src/` kein Treffer für «für eine Rechnung ohne Leistungszeitraum»).
