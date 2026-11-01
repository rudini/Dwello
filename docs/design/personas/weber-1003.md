# Dr. Weber, Runde 1003: Teilzahlung, Bemerkung und neues PDF

Desktop 1440 × 900, Maus. Gebäude «Seepark Residenz». Abrechnung NK-22222222-2025-0004 (Marco Bernasconi, Wohnung B2).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | PDF, Seite 1, Kostenaufstellung | Die Tabelle endet mit «Importo dovuto 75.80», im Kasten oben und im Zahlteil steht aber CHF 35.80. In der Tabelle gibt es keine Zeile «Già pagato – 40.00 / ancora dovuto 35.80». Wer nur die Tabelle liest, hält 75.80 für den geschuldeten Betrag. |
| P-2 | Minor | Abrechnung, nach dem Speichern der Bemerkung | Ein Knopf «PDF erstellen» steht neben dem Hinweis «Das neue PDF … liegt unter «Dokumente» zum Versand bereit» und dem Verlauf-Eintrag «Neues PDF erstellt». Ich weiss nicht, ob es das PDF schon gibt. Nach dem Klick gab es keinen Download und keine Bestätigung, nur aus dem Knopf wurde «PDF herunterladen». |
| P-3 | Minor | Abrechnung und Dokumente, neues PDF | Der Mieter erhält Post per E-Mail, die erste Abrechnung ging per E-Mail. Für das neue PDF steht aber «Markieren Sie es am Tag, an dem Sie es zur Post bringen, als versendet», und unter «Dokumente» steht «per Brief». Einen Weg, das neue PDF per E-Mail zu senden, habe ich nicht gefunden. |
| P-4 | Minor | Abrechnung bearbeiten, Feld «Bemerkungen» | Die Hilfe sagt: «Die Bemerkung steht im PDF, das der Mieter erhält.» Dass dieses PDF italienisch ist, steht nicht dabei. «PDF auf Italienisch» sah ich erst nach dem Speichern. Meine deutsche Bemerkung steht jetzt mitten in einem italienischen Brief unter «Osservazioni». |

## Beobachtungen

- Die Dialoge zum Bezahlen sind gut. Gebe ich einen Teilbetrag ein, verschwindet der Satz «Danach können Sie keine Mahnung mehr senden.», und der Knopf heisst «Teilzahlung festhalten». Der Dialogtitel heisst weiterhin «Abrechnung als bezahlt markieren», das stört aber kaum.
- Nach der Teilzahlung zeigen Abrechnung und Liste «Bezahlt: CHF 40.00, offen: CHF 35.80». Der Status bleibt «Versendet», und der Knopf «Als bezahlt markieren» ist noch da. Das ist richtig, denn der Rest ist ja offen.
- Die Teilzahlung erscheint nicht im «Verlauf» der Abrechnung, mit Datum und Betrag. Auch im PDF steht «Già pagato CHF 40.00» ohne Datum.
- Gleich darüber steht weiterhin «Der Mieter bezahlt die Nachzahlung von CHF 75.80.». Zusammen mit der Zeile darunter ist das verständlich.
- Auf der Seite «Abrechnung bearbeiten» steht: «Geänderte Rechnungen … übernimmt «Neu berechnen» auf der Seite des Entwurfs.» Diese Abrechnung ist aber versendet, und bei ihr gibt es «Neu berechnen» nicht.
- Bei 1440 px ist die Kostentabelle der Abrechnung rechts abgeschnitten: Die Spalte «Betrag» ist nur halb zu sehen (Screenshot 07).
- Das neue PDF unter «Dokumente» und das PDF über «PDF herunterladen» haben denselben Text.
- Im versendeten ersten PDF stehen weiterhin «Importo dovuto CHF 75.80» und keine Bemerkung. So soll es sein.

## Aufgabe geschafft: ja

## Aufwand

Etwa 12 Minuten, 9 Schritte: Liste, Abrechnung, senden, Teilzahlung erfassen, Bemerkung speichern, PDF erstellen, PDF herunterladen, Dokumente ansehen, PDF lesen.

## Ablauf

- **Senden:** Ich erwartete eine Abrechnung im Status «Versendet», weil keine aus Seepark versendet war (alle 4 waren Entwurf). So war es auch: Dialog «Abrechnung per E-Mail senden», danach «Status: Versendet», im Verlauf «Versendet per E-Mail an marco.bernasconi@example.ch».
- **Teilzahlung:** Ich erwartete eine eigene Aktion «Teilzahlung erfassen». Es gibt nur «Als bezahlt markieren». Erst im Dialog sah ich das Feld «Bezahlter Betrag» mit dem Hinweis auf Teilzahlungen (vorbelegt mit 75.80). Ich gab 40.00 ein, und der Knopf hiess dann «Teilzahlung festhalten». Gut.
- **Bemerkung gespeichert:** Ich erwartete die Abrechnung mit meiner Bemerkung. Ich sah drei Dinge zugleich: einen Hinweis, dass die Bemerkung nur im neuen PDF steht, einen zweiten Hinweis, dass das neue PDF unter «Dokumente» zum Versand bereitliegt (zur Post bringen), und den Knopf «PDF erstellen». Siehe P-2 und P-3.
- **PDF erstellen:** Ich erwartete, dass das PDF aufgeht. Es öffnete sich nichts, und ich musste danach «PDF herunterladen» klicken.
- **PDF lesen:** Ich erwartete einen deutschen Brief. Er war italienisch, weil der Mieter Italienisch hat (P-4). Was ich als Mieter verstehe:
  - Der Kasten oben ist klar: «Importo ancora dovuto CHF 35.80 / La preghiamo di pagare l’importo ancora dovuto entro il 01.12.2026 tramite la sezione pagamento. / Importo del conteggio CHF 75.80 – Già pagato CHF 40.00».
  - Empfangsschein und Zahlteil zeigen beide CHF 35.80, mit der Referenz 00 27578 86841 73845 89063 22269 und «Conteggio spese accessorie NK-22222222-2025-0004».
  - Die Bemerkung «Rest bis Ende Monat vereinbart» steht auf Seite 2 unter «Osservazioni».
  - Die Tabelle schliesst aber mit «Importo dovuto 75.80» (P-1).
- **Nachrechnen der Tabelle:** Sie stimmt.
  - 228.00 + 908.44 + 1’221.64 + 611.56 + 148.23 = 3’117.87.
  - 2.5 % davon sind 77.95, zusammen 3’195.82.
  - Abzüglich Akonto 12 × 260.00 = 3’120.00 bleiben 75.82, gerundet 75.80. Das ist der Saldo der Abrechnung.
  - 75.80 − 40.00 = 35.80. Das ist der Betrag im Zahlteil.

## Vorschläge

- **P-1:** Abrechnung versenden, Teilzahlung 40.00 erfassen, neues PDF erstellen, Seite 1 lesen. Hilfreich wären unter «Importo dovuto 75.80» zwei Zeilen «Già pagato – 40.00» und «Importo ancora dovuto 35.80», damit die Tabelle beim Betrag des Zahlteils endet.
- **P-2:** Bemerkung speichern (Weiterleitung auf `?pdf-change=notes`) und die Kopfzeile der Abrechnung lesen. Zeigen Sie entweder den Knopf «PDF erstellen» oder den Hinweis «liegt unter Dokumente bereit», nicht beides. Nach dem Erstellen sollte stehen, was geschehen ist, und das PDF sollte sich öffnen.
- **P-3:** Gleicher Ablauf bei einem Mieter mit Korrespondenzkanal E-Mail. Der Hinweis und der Eintrag unter «Dokumente» sollten dem Kanal folgen, und es sollte möglich sein, das neue PDF per E-Mail zu senden. Oder es sollte erklärt werden, warum es nur per Brief geht.
- **P-4:** «Frist und Bemerkungen bearbeiten» bei einem italienischsprachigen Mieter. Die Hilfe am Feld sollte sagen: «Das PDF ist auf Italienisch. Schreiben Sie die Bemerkung in dieser Sprache.»

## Nicht geprüft

- Den Inhalt des QR-Codes (Betrag, Referenz) konnte ich nicht maschinell lesen, weil kein QR-Decoder installiert ist (`zbarimg` fehlt). Ich habe nur den gedruckten Text des Zahlteils verglichen.
- Das neue PDF habe ich nicht als versendet markiert, weil das nicht zur Aufgabe gehörte.

## Gespeicherte Daten (zum Nachrechnen)

- Abrechnung **NK-22222222-2025-0004**, Marco Bernasconi, Seepark Residenz, Wohnung B2, Periode 01.01.2025 – 31.12.2025.
- Versendet per E-Mail am 01.11.2026; Zahlungsfrist 01.12.2026.
- Saldo: Nachzahlung CHF 75.80 (vor Rundung 75.82; Nebenkosten 3’195.82; Akonto 3’120.00).
- Teilzahlung erfasst: **CHF 40.00, bezahlt am 01.11.2026**. Offen: **CHF 35.80**.
- Bemerkung: «Rest bis Ende Monat vereinbart».
- Neues PDF (italienisch) unter «Dokumente», Status «Zu versenden», nicht als versendet markiert.
