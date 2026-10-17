# Code-Review #78 (Runde 1): QR-Rechnung gegen SIX IG v2.4

Gegenstand: Worktree `review-78-code`, `git diff origin/main 7a8195c3` (d5c354f3 Szenario, 7a8195c3 Umsetzung). Alle 7 geänderten Dateien gelesen, dazu `qrBlocks`, `winAnsi` und `paymentPart` in `pdf.service.ts`, `generateQRDataString` und `debtorLines` in `qr-bill.service.ts`, `helpers/pdf-text.ts` und `docs/reviews/78-fachreview-1.md`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | backend/src/services/pdf.service.ts:942-951, backend/src/__tests__/statement-pdf-render.test.ts:161-171, tests/e2e/features/statement-detail.feature:238-244 | Das leere Feld mit Eckmarken (52×20 mm, 65×25 mm, 0.75 pt) prüft kein Test; Unit-Test und Szenario prüfen nur die Überschrift |
| C-2 | Minor | backend/src/services/pdf.service.ts:990-991 | Auf dem Empfangsschein ist kaum Reserve: Feld unten bei rund 61 mm, «Währung» bei 68 mm. Brechen Firmenname und Strasse je auf eine zweite Zeile um (52 mm bei 8 pt, etwa 30 Zeichen), überdeckt das Feld «Währung/Betrag». Nachgerechnet, nicht gerendert |
| C-3 | Minor | backend/src/services/pdf.service.ts:981-983, backend/src/services/qr-bill.service.ts:246-276 | Der Druck nimmt die bereinigten `qrData`, die Kürzung auf 70/35 Zeichen geschieht aber erst in `generateQRDataString`. Bei langem Namen oder Ort weichen Druck und Code weiter voneinander ab (Fachreview V-9 bleibt offen, obwohl es mit V-3 erledigt sein sollte) |
| C-4 | Minor | tests/e2e/features/statement-detail.feature:238-241 | Fachreview V-4 ist nicht umgesetzt: das Szenario sagt nicht, dass «Eva Frei» keine Korrespondenzadresse hat; die Voraussetzung steckt nur in der Fixture |
| C-5 | Nit | backend/src/services/qr-bill.service.ts:233 | `…` (U+2026) wird zu «.» statt zu `...`, wie es Fachreview V-5.2 vorschlägt |
| C-6 | Nit | backend/src/services/qr-bill.service.ts:361 | `creditorPostalCode` läuft als einziges Textfeld nicht durch `permitted` (`debtorPostalCode` schon) |
| C-7 | Nit | backend/src/services/qr-bill.service.ts:235-237 | Ein Zeilenumbruch in der Adresse wird zu «.» und steht jetzt auch so im gedruckten Zahlteil («"Seehof".5.€»). Ein Leerzeichen wäre für den Mieter lesbarer und ist ebenfalls zulässig |
| C-8 | Nit | backend/src/__tests__/statement-pdf-render.test.ts:161-171 | Fachreview V-6: das Feld im Zahlteil der Mahnung (`addPaymentPart`) ist ungetestet und im Plan nicht erwähnt |
| C-9 | Nit | backend/src/services/pdf.service.ts (paymentPart) | Ș ș Ț ț und ein Teil von Latin Extended-A (z. B. «Ł», «ő») stehen im Code, gedruckt macht `winAnsi` daraus «S», «L», «o». Die Fachreview (V-3) nimmt diese Grenze der Schrift hin, sie besteht schon. Nur zur Kenntnis |

## Blocker/Major

### C-1 (Major): Das Feld mit Eckmarken ist ungetestet

- Die Anforderung (Fachreview b, Szenario-Titel «… hat ein Feld für Name und Adresse») verlangt unter der Überschrift ein leeres Feld mit Eckmarken: 52×20 mm auf dem Empfangsschein, 65×25 mm im Zahlteil, 0.75 pt. Laut Auftrag muss jede nötige Änderung von einem fehlschlagenden Unit-Test getrieben sein.
- `lässt ohne Postleitzahl und Ort ein Feld für Name und Adresse frei` prüft nur, dass «Zahlbar durch (Name/Adresse)» zweimal im Text steht. Das Szenario prüft nur `Dann steht im PDF "Zahlbar durch (Name/Adresse)"`. Bestätigt sind die Eckmarken nur durch den Blick des Aufrufers auf ein gerendertes PDF.
- So zeigt man den Fehler: Löscht man in `blankField` die ganze Kette `doc.lineWidth(0.75)…stroke()`, oder setzt man `[52 * MM, 20 * MM]` auf `[0, 0]`, bleiben alle Unit-Tests und das Szenario grün.
- Die unterste Schicht kann das zeigen. `readPdf` entpackt die Content-Streams schon (`helpers/pdf-text.ts:11-17`). Ein Unit-Test kann darin die Pfade der Eckmarken suchen: die Operatoren `m`/`l`/`S` mit `0.75 w`, Breite 147.4/184.3 pt und Höhe 56.7/70.9 pt zwischen den Ecken. Oder er nimmt die Hilfe aus `blankField` heraus und prüft die Masse dort. Dazu gehört ein Gegentest: mit Zahlungspflichtigem gibt es kein Feld.

## Weitere Prüfungen (bestätigt durch Lesen)

- Zeichensatz (IG 4.1.1): `PERMITTED` erlaubt U+0020–007E, U+00A0–017F, U+0218–021B und U+20AC. Ablauf: zuerst NFC, dann Ersatz pro Codepunkt (`/./gsu`, also auch für `\n` und Surrogatpaare). Dann Umschrift über NFD ohne `\p{M}`, sonst «.». Die Kürzung geschieht erst danach in `generateQRDataString`. Alle erlaubten Zeichen liegen in der BMP, darum teilt `slice` kein Surrogatpaar. Ein einzelnes kombinierendes Zeichen fällt weg (`bare` ist leer, das passt auf `*`). Der Test `schreibt nur die zulässigen Zeichen in den QR-Code` wäre ohne die Änderung rot, weil die Rohwerte im Code stünden.
- IBAN in Grossbuchstaben und Ende mit `EPD` ohne Zeilenumbruch: `qr-bill.service.ts:268,301-302`. Den Test `schreibt die IBAN in Grossbuchstaben und endet mit EPD` gibt es. Ohne die Änderung ist er rot: Kleinbuchstaben, und der Code endet auf `EPD\n`. Die Anpassung 32 → 31 Zeilen folgt daraus.
- Druck wie im Code: `creditor` kommt jetzt aus `qrData` (`pdf.service.ts:981`). Der Test `druckt Zahlungsempfänger und Zahlungspflichtigen wie im QR-Code` wäre ohne die Änderung rot, gedruckt stünde «Müller’s» bzw. «D’Angelo». Grenzen: C-3, C-9.
- Bedingung für das Feld: `debtor.length === 0`. Das ist dieselbe Bedingung wie in `debtorLines`: Name, PLZ und Ort. So verlangt es die Fachreview b. Die Übersetzungen der Überschrift in fr/it/en entsprechen der Begriffstabelle der IG, wie die Fachreview sie zitiert. Die Texte stehen in `pdf.service.ts` (PDF-Texte), nicht in `messages/*.json`. Das entspricht der bestehenden Konvention für PDF-Texte.
- Zahlteil rechts: Das Feld endet bei rund 75 mm von 105 mm, es gibt keine Überschneidung.
- Der entfernte Test (`nennt «Zahlbar durch» nur mit …`) ist durch `not.toContain('Zahlbar durch Nina')` ersetzt, die Strenge bleibt gleich.
- Szenario: ohne `@wip`. Ohne die Änderung schlägt es an der fehlenden Überschrift fehl. Kein neuer Bildschirm, darum keine Einträge in `screens.json`, `accessibility.feature` oder `sprachen-bildschirme.feature` nötig. Keine UI-Texte in `messages/*.json`. Keine API-Antwort geändert, darum kein Contract nötig. Kein E2E-Code geändert.
- Ponytail: Der Diff ist kurz, nichts bleibt ungenutzt. `text()` und `permitted()` sind beide genutzt, `qrBlocks` gibt `top` zurück und wird zweimal genutzt. Kein fremder Umbau. `implementation_plan.md` und `docs/reviews/78-fachreview-1.md` gehören zum Ablauf.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst wiederholt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`. Ebenso die Backend-Unit-Tests (qr-bill.service, statement-pdf-render, reminder-pdf, reminder-letter, statement-pdf-data, pdf-translations, pdf-text), die pg-Tests (statement-pdf, reminders, statement-mail, statement.routes, demo-data, error-codes), E2E `statement-detail.feature` und `statement-reminder.feature` sowie die Commit-Hooks. Backend-Tests laufen mit `bun test`, nicht mit `bunx vitest run`, und im Worktree konnte ich `backend/node_modules` nicht lesen (Zugriff verweigert).
- Vom Aufrufer gemeldet: die visuelle Prüfung der Eckmarken in einem gerenderten PDF ohne Zahlungspflichtigen.
- C-2: Die Abstände habe ich mit den pdfkit-Zeilenhöhen (Schriftgrösse × ~1.16) nachgerechnet, nicht gerendert.
- Ob der QR-Code gültig scannt (UTF-8-Bytes der Bibliothek `qrcode`, z. B. bei «€» oder «Ț»): nicht prüfbar, `node_modules` war nicht lesbar. Bleibt beim daten-pruefer.
- Wie pdfkit ein Zeichen ausserhalb von WinAnsi kodiert, habe ich nicht nachgelesen (Zugriff auf `node_modules/pdfkit` verweigert). Ich stütze mich auf `winAnsi` in `pdf.service.ts:498-511`.
- Die Masse aus der IG (52×20, 65×25, 0.75 pt, Eckmarken 3 mm): nur über die Fachreview belegt, die SIX-PDFs habe ich nicht gelesen.
