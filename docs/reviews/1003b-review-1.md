# Code-Review 1003b, Runde 1 (Abschlussrunde vor dem Push, Re-Review von 1003-1)

Bereich: `git diff 61cc7c4 ee47424` ohne `docs/reviews`, `docs/design/personas`. Eigene Commits des Slices: 395ed01 (Tests), ea142a2 (Archiv). Die übrigen Dateien im Diff kommen aus dem konfliktfreien Merge von `origin/main` (ee47424) und gehören nicht zu diesem Slice.

Geschlossen: C-1, C-2

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-3 | Minor | backend/src/__tests__/statement-pdf-render.test.ts:1069 | Der positive Check `/Betrag CHF 100\.00/` trifft schon «Offener Betrag CHF 100.00» im Kasten (vgl. Z. 1018). Er bleibt also grün, auch wenn die Zahlungsangaben ohne QR-Code ganz fehlen. Nur der negative Check (Z. 1070) zeigt den alten Saldo als Fehler, aber nichts belegt, dass die Zahlungsangaben überhaupt erscheinen. Kein anderer Test im Backend prüft «Zahlungsinformationen» (grep in `backend/src/__tests__`). Abhilfe: auf `Zahlungsinformationen Konto … Betrag CHF 100.00` prüfen oder auf `Betrag CHF 100.00` mit Ausschluss von «Offener». |

## C-1 (Major aus 1003-1): geschlossen

`legt den offenen Betrag in den QR-Code` (Z. 1052–1060) prüft mit einem Spy das `balance`, das `qrCodeFor` (`pdf.service.ts:1449–1451`) an `generateQRBillForStatement` übergibt: `'100'`, also `roundToRappen(184.15 − 84.15)`. Wird `data.balance.toString()` wieder eingesetzt, kommt `'184.15'` heraus und der Test wird rot. Zusätzlich hat der daten-pruefer die Nutzlast im echten PDF entschlüsselt (35.80).

C-2: Der Test der Teilrückerstattung prüft jetzt «Offene Rückerstattung CHF 83.85» (−93.85 − (−10)). Mit dem alten Saldo stünde dort 93.85, der Test wäre also rot. Zu den Zahlungsangaben ohne QR-Code siehe die Einschränkung C-3.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, die ganze Backend-Suite (1959 pass vor 395ed01), `statement-pdf-render.test.ts` (155 pass), E2E chromium für die Teilzahlungs-Szenarien (8 passed), die Rotläufe beider neuer Tests mit dem alten Saldo im Code.
- Ob `spyOn` auf dem ESM-Namespace `qr-bill.service` den benannten Import in `pdf.service.ts` wirklich abfängt (Live-Binding in Bun), habe ich nur durch Lesen geprüft, nicht ausgeführt. Der gemeldete Rotlauf von «legt den offenen Betrag in den QR-Code» setzt es voraus.
- Den Merge ee47424 (fremde PRs #1012, #1013, #1014, #1018) habe ich nicht inhaltlich geprüft: Er ist konfliktfrei und braucht nach `CLAUDE.md`, Workflow 7, keine eigene Runde.

Geprüft: 395ed01 (Testcode gegen `pdf.service.ts` `qrCodeFor`, `paymentInfo`, `openOf`), ea142a2 (Archiv-Eintrag stimmt mit den Berichten überein), Commit-Nachricht nennt die Rotläufe.
