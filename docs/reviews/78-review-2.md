# Code-Review #78 (Runde 2): Korrekturen zu C-1 bis C-7

Gegenstand: Worktree `review-78-code2` (detached auf 31a6c3d9), Delta `git diff 7a8195c3 31a6c3d9`. Alle 10 geänderten Dateien gelesen, dazu `qrBlocks`, `blankField` und `paymentPart` in `pdf.service.ts`, `debtorLines` und `generateQRDataString` in `qr-bill.service.ts`, `seed.address` in `tests/e2e/fixtures/backend.ts` und den Eintrag «Korrespondenzadresse» in `UBIQUITOUS_LANGUAGE.md`.

Ergebnis: C-1 (Major) ist behoben. C-2 bis C-7 sind erledigt. Es gibt keinen neuen Blocker und keinen neuen Major.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | erledigt | backend/src/__tests__/statement-pdf-render.test.ts:36-43, 181-182 | `blankFields` liest die Pfade mit 0.75 pt und prüft `[[52, 20], [65, 25]]`. Mit Zahlungspflichtigem gibt es kein Feld (`[]`). Fehlt das Feld, oder stimmen seine Masse nicht, wird der Test rot. |
| C-2 | erledigt | backend/src/services/pdf.service.ts:945, 991 | Das Feld endet bei `top + 66 mm`, also über «Währung» (68 mm). Der Test (`< 20`) wäre ohne `limit` rot. |
| C-3/C-6 | erledigt | backend/src/services/qr-bill.service.ts:242, 362-380 | Gekürzt wird jetzt schon in `qrData`, und `creditorPostalCode` läuft durch `permitted`. Der Test wäre ohne die Änderung rot: der Name hätte 85 statt 70 Zeichen. |
| C-4 | erledigt | tests/e2e/features/statement-detail.feature:240, tests/e2e/steps/tenant-form.steps.ts:82-84 | Der Schritt nennt die Voraussetzung mit dem Begriff aus `UBIQUITOUS_LANGUAGE.md`. Er ruft nur die Fixture `seed` auf, wie die Nachbarschritte. |
| C-5/C-7 | erledigt | backend/src/services/qr-bill.service.ts:233-235, backend/src/__tests__/qr-bill.service.test.ts:99, 108 | `…` wird zu `...`, `\n` und `\t` werden zu einem Leerzeichen. Die erwartete Zeile `'"Seehof" 5 €...'` wäre vorher rot gewesen (`.5.€.`). |
| C-8 | Nit (offen, wie gemeldet) | backend/src/services/pdf.service.ts (addPaymentPart) | Das Feld im Zahlteil der Mahnung bleibt ungetestet. |
| C-9 | Nit (offen, gab es schon) | backend/src/services/pdf.service.ts (winAnsi) | Die Schrift kann nicht alle Zeichen drucken, die im QR-Code stehen. |
| C-10 | Nit | backend/src/services/pdf.service.ts:945 | `Math.min(top + height, limit)` hat keine Untergrenze. Ist der Text darüber so lang, dass `top` über 66 mm liegt, ist `bottom < top`: Die Eckmarken kehren sich um, und die Überschrift liegt auf «Währung». Das tritt nur bei extremen Längen auf, nachgerechnet: Name und Strasse mit je 70 breiten Zeichen, also je 4 Zeilen. Mit realistischen Angaben bleiben rund 8 mm Feld (siehe unten). |
| C-11 | Nit | backend/src/services/qr-bill.service.ts:250-257, 275-280, 308 | Ponytail: `qrData` wird nur in `generateQRBillForStatement` gebaut und dort jetzt gekürzt. Die gleichen `slice(0, 70/16/35/140)` in `debtorLines` und `generateQRDataString` sind damit doppelt. |
| C-12 | Nit | backend/src/__tests__/qr-bill.service.test.ts:112-120 | Der Test zur Kürzung prüft nur `debtorName`, `debtorCity` und `creditorName`. Fällt eine der anderen Kürzungen weg, bleibt alles grün: `creditorStreet`, `creditorCity`, `creditorPostalCode`, `debtorStreet`, `debtorPostalCode` oder `unstructuredMessage`. Ebenso ungetestet ist `'\r': ''`. |
| C-13 | Nit | tests/e2e/steps/tenant-form.steps.ts:83 | `seed.address` setzt nebenbei `correspondenceChannel: 'letter'` (fixtures/backend.ts:253). Der Schritt sagt nur «keine Korrespondenzadresse», erzeugt aber Brief ohne Adresse. Das Ergebnis des Szenarios ändert sich dadurch nicht. |
| C-14 | Nit | backend/src/__tests__/statement-pdf-render.test.ts:38 | `blankFields` erkennt das Feld nur an `0.75 w`. Zeichnet das PDF später eine andere Linie mit 0.75 pt, fängt der Regex auch diese ein, und die Tests schlagen aus diesem Grund fehl. Heute zeigt der Gegentest (`[]`), dass es keine solche Linie gibt. |

## Blocker/Major

Keine.

## Weitere Prüfungen (bestätigt durch Lesen)

- `blankFields`: pdfkit schreibt `0.75 w`, danach `RG` für die Farbe und dann vier Teilpfade aus `m`/`l` vor einem `S`. Der Regex holt alle Punkte vor dem `S`. Die Ausdehnung in mm ist nach dem Runden unabhängig von der gespiegelten CTM. Nimmt man die Strichkette in `blankField` heraus, wird `[[52,20],[65,25]]` rot. Mit `[0, 0]` ebenso.
- Rechnung zu C-2 und C-10: 8-pt-Zeilen rund 3.4 mm, 6-pt-Überschrift rund 2.8 mm, Abstand nach einem Block rund 1.7 mm. Mit maximal gekürzten, normal breiten Angaben (Name 70, Strasse 70, PLZ und Ort 52 Zeichen, also 2 + 2 + 2 Zeilen) und mit QR-Referenz beginnt das Feld bei rund 51 mm. Es ist dann rund 15 mm hoch. Erst bei 3 bis 4 Zeilen pro Angabe kippt es (C-10).
- Rechter Zahlteil ohne `limit`: Im schlimmsten Fall bei gekürzten Längen (Gläubiger 7 Zeilen, Mitteilung 140 Zeichen in 3 Zeilen) endet das Feld bei rund 98 mm von 105 mm. Es ragt also nicht über die Seite hinaus.
- `permitted`: Das Flag `s` lässt `.` auch auf `\n` passen. `'\r'` wird zu `''`, und `PERMITTED.test('')` ist wahr (`*`), darum wird aus `\r\n` genau ein Leerzeichen. `…` bleibt unter NFC U+2026, der Eintrag in `PLAIN` greift also. Gekürzt wird nach der Ersetzung, darum zählt `...` als drei Zeichen innerhalb der Grenze. Erlaubte Zeichen liegen alle in der BMP, `slice` teilt also kein Surrogatpaar.
- Szenario: weiterhin ohne `@wip`, gleiche Strenge, nur eine Voraussetzung mehr. Kein neuer Bildschirm, kein neuer UI-Text, keine API-Antwort geändert. `helpers/pdf-text.ts` gibt zusätzlich `streams` zurück und ändert sonst nichts.
- `implementation_plan.md`, `docs/reviews/78-review-1.md` und `docs/design/personas/dr-weber-78.md` sind Ablaufdokumente. Die Persona meldet keinen Befund zum Zahlteil, ihre Beobachtungen betreffen andere Bildschirme. Es gibt keine Änderung ohne Bezug zur Anforderung.

## Nicht bestätigt

- Selbst wiederholt: `cd backend && bun test src/__tests__/qr-bill.service.test.ts src/__tests__/statement-pdf-render.test.ts`, 72 bestanden, 0 fehlgeschlagen. Dabei hat das Preload `dwello_test` neu aufgesetzt, obwohl kein pg-Test lief.
- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, die Backend-Unit-Tests reminder-pdf, reminder-letter, statement-pdf-data, pdf-translations und pdf-text, E2E chromium `statement-detail.feature` (65 bestanden) und die Commit-Hooks.
- Vom Aufrufer gemeldet: Die Tests zu C-2, C-3 und C-5/C-7 waren zuerst rot, und das PDF wurde gerendert und angesehen. Durch Lesen halte ich alle drei ohne die Änderung für rot.
- Ob das Backend `PUT tenants/:id` mit leerer PLZ, leerem Ort und dem Kanal Brief annimmt, habe ich nicht selbst geprüft. Das belegt nur der gemeldete grüne E2E-Lauf.
- Ob der QR-Code gültig scannt: nicht geprüft. Das bleibt beim daten-pruefer, wie in Runde 1.
