# Code-Review #226, Runde 1 (fee5c0e9..cf49fa58)

Worktree: `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/review-226-code` (detached bei cf49fa58). Gelesen: alle 14 Dateien des Diffs, dazu `calculation.service.ts` (Gruppierung, `rentalShare`, Schleife), `invoice.service.ts` (`inPeriod`), `pdf.service.ts` (`room`, `row`, `costTable`, `timeShare`, `sharesNote`, Übersetzungen), `statement-pdf-render.test.ts` (Fixtures), `api-contracts.pg.test.ts` (`drift`), `tests/contracts/statement*.json`, `backend/src/db/migrate`.

Kein Blocker, kein Major.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/services/pdf.service.ts:250 | `room(doc, top, parts.length * 11 + 20, header)` rechnet für die Positionszeile pauschal 20 pt. Eine Zeile mit vier Zeilen Kategorie (gemessen: 8.5 pt = 9.83 pt pro Zeile, 7.5 pt = 8.67 pt pro Zeile) braucht mehr. Dann bricht pdfkit die Formelzeile selbst auf eine neue Seite um, ohne Tabellenkopf und getrennt von ihrer Position. Nachgestellt im Speicher (Skript `/tmp/claude-0/-home-user-dwello/9ffe5c1d-22e5-5514-b4e2-9df0e6ff60e1/scratchpad/c226/overflow2.ts`, Kategorie `"A\nB\nC\nD"`): bei 21 und 62 vorangehenden Zeilen steht die Formel auf der Folgeseite. Mit einer Kategorie von 72 Zeichen (2–3 Zeilen) gab es bei 0–69 vorangehenden Zeilen keinen Fall. Mit Formeln, die umbrechen, wächst der Spielraum. Selten, aber genau der Fall, den V-7 ausschliessen soll. Abhilfe: die Höhe aus `heightOfString` von Zellen und Zeilen berechnen statt pauschal. |
| C-2 | Minor | backend/src/services/pdf.service.ts:250 | Das `room(…, 20)` gilt jetzt auch für jede Position ohne Rechnungszeilen. Bisher reservierte `row` die Zeilenhöhe + 6 (einzeilig 15.8 pt). Ein Seitenwechsel kommt damit in PDFs ohne #226-Fall bis zu 4 pt früher, eine Layoutänderung ausserhalb der Anforderung. `parts.length ? room(…) : top` würde sie vermeiden. |
| C-3 | Minor | backend/src/services/pdf.service.ts:651-657 | Das PDF druckt jetzt unter der Position Brüche über einen Leistungszeitraum («47/92 Tage»). Die Fussnote erklärt solche Brüche aber nur, wenn `shareDays` gesetzt ist (`sharesNoteDays`, «bei einer Rechnung mit Leistungszeitraum Ihre Mietstage darin von dessen Tagen in der Periode»). Bei einer Position mit `invoiceParts` fehlt die Erklärung. Der Test statement-pdf.pg.test.ts:215 (`not.toContain('Ihre Mietstage darin')`) schreibt das Fehlen sogar fest. Nachrechnen lässt sich der Zeitanteil trotzdem: Daten, Beträge und Formel stehen im PDF. Ob die Erklärung dazugehört, entscheidet die Fachprüfung, darum Minor. |
| C-4 | Minor | implementation_plan.md:355-357 | Für den neuen Verhaltenstest «druckt keine Rechnungen unter einer Position, deren Rechnungen zusammen null ergeben» fehlt die Zeile `Test red:`. Das Szenario wurde nach seinem Rot geändert (900/900 → 600/1'200, neue Formelzeile). Die Zeile `Scenario red:` nennt noch die alte Prüfung, und für die Formelzeile ist kein Rot vermerkt. |
| C-5 | Nit | implementation_plan.md:349 | Im Absatz «Plan:» steht noch das alte Beispiel «900.00, 0/91 Tage» (vor V-2). |
| C-6 | Nit | backend/src/services/calculation.service.ts:184-185 vs. 135-138 | `rentedIn` wiederholt die Rechnung «von/bis geschnitten» aus `rentalShare`. `rentalShare` könnte `rentedIn` verwenden. |
| C-7 | Nit | backend/src/services/pdf.service.ts:262 | `item.periodShare == null` in `partLines` greift nie: `invoiceParts` gibt es nur bei Abrechnungen, die `period_share` speichern. Die Prüfung dient nur dem Typ. |

## Bestätigt

- **Berechnung:** `daysOf` speichert `invoiceParts` nur bei Rechnungen über verschiedene Tage. Nicht bei einem Mietvertrag über die ganze Periode (`rentalDays === totalPeriodDays`, der bestehende Test «92/92 Tage» würde ohne diese Bedingung rot) und nicht bei der Summe null (Test «zusammen null ergeben»: ohne die Bedingung stünde «47/92 Tage» im PDF). Positionen nach dem Heizprofil bleiben bei `noDays`. Beträge und Tage kommen aus `inPeriod`: auf die Periode geschnitten und auf Rappen gerundet, also ergeben die Zeilen zusammen die Kosten Liegenschaft.
- **Kein Rückfall auf «Mietstage / Tage der Periode» (C-5 von #208):** `timeShare` gibt bei `invoiceParts` die Prozente aus. Der Test mit 1'810/1'840 deckt das ab (`not.toMatch(/Hauswart .* 139\/365 Tage/)` mit Anker vorher).
- **Formelzeile und Daten:** `partLines`. Für de deckt das pg-Test und Szenario ab, für fr/it/en der Render-Test. Die Formel kommt ohne Wörter aus, `t.days` gibt es in allen vier Sprachen. Neue UI-Texte gibt es nicht, `messages/*.json` und a11y bleiben unberührt (PDF, kein Bildschirm).
- **Alte Abrechnungen:** `invoice_parts` ist NULL, und `timeShare` verhält sich wie bisher. Die Migration `0005` passt zu `migrate` (Dateien, `schema_migrations`). `data-model.md` und Regel 5 sind nachgeführt.
- **API-Verträge:** Die Antwort wird nur um ein Feld länger. `drift` prüft die Felder des Vertrags als Teilmenge, und das Frontend liest `periodShare` und `invoiceParts` nicht. Am Vertrag muss nichts geändert werden.
- **`pdf-text.ts`:** Die Tabelle ist richtig, verglichen mit Buns `TextDecoder('windows-1252')` (alle 32 Zeichen). Node v22.22.0 dekodiert 0x96 tatsächlich als U+0096.
- **Szenario:** Es steht ohne `@wip` in `statement-detail.feature`. Es beschreibt den Wunsch des Liegenschaftsverwalters, die Zahlen stimmen (47 = 15.08.–30.09.; (1'200 × 47/92) / 1'800 = 34.06 %), und es ruft nur bestehende Schritte auf.
- **Diff:** Nichts ausserhalb der Anforderung, ausser der Layoutverschiebung aus C-2.

## Nicht bestätigt

- Lint, check, test:coverage (2487), Backend-Tests (642, 93.8 %), type-check, deepcheck:audit, fallow audit und E2E chromium+api (731, Szenario grün): vom Aufrufer gemeldet, nicht neu ausgeführt. Die Backend-Tests laufen mit `bun test` und dem DB-Preload, die zu starten ist mir nicht erlaubt.
- Ob das rote Szenario an der richtigen Stelle scheiterte: vom Aufrufer gemeldet (Plan). Die Formelzeile im geänderten Szenario wurde nie rot gesehen (C-4).
- Fachlich (Fussnote C-3, V-4 «Ihr Anteil = Wohnungsanteil × gerundeter Zeitanteil» bis auf einen Rappen): nicht geprüft, das gehört zu `fach-reviewer` und `daten-pruefer`.
