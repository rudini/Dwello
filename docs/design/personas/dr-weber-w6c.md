# Dr. Weber – Runde w6c: Mahnung aus der Abrechnung, Mahnbriefe (PDF), Hilfe «Zahlungen und Mahnungen»

Persona: Dr. Weber, 52, rechtlich vorsichtig, liest alles, rechnet nach. Desktop 1440 × 900, Maus.
App: http://localhost:3300 (Persona-Stack, Datenbank `dwello_persona`). Gespeichert nur im Gebäude «Musterhaus Zentrum».
Ausgangslage (per SQL vom Aufrufer): Abrechnung 2025 von Hans Müller (NK-11111111-2025-0001, CHF 215.80) und Abrechnung 2024 von Maria Rossi (NK-11111111-2024-0004, CHF 35.70, Korrespondenz Italienisch) sind versendet und überfällig.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/bb8b5e95-cb4b-5288-89e2-e60f5a92261e/scratchpad/dr-weber-w6c/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Hilfe «Zahlungen und Mahnungen», Dialog «Mahnung senden» | «Mahnung senden» sendet nichts: der Dialog sagt richtig, dass Dwello nur ein PDF zum Ausdrucken erstellt. Die Hilfe schreibt dagegen «Sie geht je nach Korrespondenzkanal des Mieters per E-Mail oder als Brief», als würde Dwello sie selbst zustellen. Bei den Abrechnungen sagt dieselbe Hilfe ausdrücklich «Dwello verschickt die Abrechnungen nicht selbst». Wer schickt also die E-Mail? Das bleibt unklar. |
| P-2 | Minor | Hilfe «Zahlungen und Mahnungen» | Der Hinweis zu Art. 257d OR stimmt im Kern (mindestens 30 Tage Frist, schriftlich, Kündigung androhen, «Lassen Sie sich beraten»). Es fehlen aber Punkte, über die ein Laie stolpert: Bei einer Familienwohnung muss die Fristansetzung beiden Ehegatten getrennt zugestellt werden (Art. 266n OR). Die Kündigung selbst braucht das amtliche Formular (Art. 266l OR) und hat eine Frist von 30 Tagen auf ein Monatsende. Die 30 Tage laufen erst ab Empfang, deshalb ist ein eingeschriebener Brief ratsam. |
| P-3 | Nit | Mahnbrief-PDF (de und it), Seite 1 | Im Brieftext steht die IBAN ohne Leerzeichen (`CH4431999123000889012`) und heisst «IBAN», obwohl es eine QR-IBAN ist, die nur mit der QR-Referenz funktioniert. Der Text sagt auch nicht, dass auf Seite 2 ein Zahlteil beiliegt. Die Abrechnung selbst schreibt «mit dem Zahlteil». |
| P-4 | Nit | Mahnbrief-PDF (de und it), Seite 1 | Der Brief nennt keine Kontaktmöglichkeit für Rückfragen oder Einwände (Telefon/E-Mail) und kein Abrechnungsdatum. Abrechnungsnummer und Periode genügen zwar, um die Abrechnung zu erkennen. Ein Mieter, der die Abrechnung bestreiten will, weiss aber nicht, wohin er sich wenden soll. |

## Beobachtungen

- Die Beträge stimmen: Müller CHF 215.80 und Rossi CHF 35.70 stehen gleich im Dialog, auf der Abrechnung, im Brieftext und im QR-Zahlteil.
- Die QR-Referenz der Mahnung ist dieselbe wie auf der ursprünglichen Abrechnung (Müller `00 04440 00731 56583 77387 83844`, Rossi `00 49870 01238 56739 98824 86918`). Ich habe die Prüfziffern nach Modulo 10 rekursiv nachgerechnet: 4 und 8, beide korrekt. Eine Zahlung über den alten oder den neuen Einzahlungsschein läuft also auf dieselbe Referenz. Das gefällt mir.
- QR-IBAN (IID 31999) mit QR-Referenz: Die Kombination passt. Im Zahlteil ist die IBAN korrekt in Vierergruppen geschrieben. «Zusätzliche Informationen» nennt die Abrechnungsnummer.
- Der italienische Brief ist durchgehend Italienisch: Betreff «Promemoria di pagamento – Conteggio spese accessorie», Anrede «Gentile Maria Rossi», Schluss «Cordiali saluti», Zahlteil «Ricevuta / Sezione pagamento / Punto di accettazione / Da staccare prima del versamento», Dateiname «Promemoria di pagamento NK-11111111-2024-0004.pdf». Nur der Ort lautet «Zürich, 17.10.2026» statt «Zurigo». Als Absenderort finde ich das vertretbar.
- Der Ton der Zahlungserinnerung passt zur ersten Stufe: «Möglicherweise haben Sie die Zahlung übersehen», «Haben Sie die Zahlung bereits geleistet, betrachten Sie dieses Schreiben als gegenstandslos». Die Frist beträgt 10 Tage (27.10.2026), auf der Abrechnung danach «Nächste Mahnung möglich ab 28.10.2026». Das ist stimmig.
- Die Begriffe wechseln: Button «Mahnung senden», Dialog-Button «Zahlungserinnerung senden», Meldung «Mahnung erstellt». Die Hilfe erklärt unter «Mahnung» die Stufen (Zahlungserinnerung, 2. und 3. Mahnung), damit kann ich es einordnen.
- «Als versendet markieren» unter «Dokumente» wirkt sofort, ohne Rückfrage, und es gibt keinen Weg zurück. Ein Fehlklick setzt Datum und Frist. Bei mir war es gewollt.
- Datenstand aus der SQL-Vorbereitung, nicht als Befund gezählt: Bei Rossi steht das Abrechnungsdatum 14.04.2025 und die Zahlungsfrist 01.09.2026, im alten Abrechnungs-PDF aber «entro il 14.05.2025». Bei Müller steht im Abrechnungs-PDF «bis 28.10.2026», auf dem Bildschirm aber Zahlungsfrist 01.10.2026. Im Verlauf steht «Erstellt 17.10.2026», also nach «Versendet».
- Die Mahnungen von Sarah Meier (Seepark) unter «Dokumente» stammen aus den Demodaten. Ich habe sie nicht angefasst.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 12 Schritte (2 Abrechnungen öffnen, 2 × Dialog und Bestätigung, Dokumente, 4 PDFs herunterladen und lesen, 2 × als versendet markieren, Hilfe).

## Ablauf

1. **Übersicht.** Erwartet: ein Hinweis auf überfällige Abrechnungen. Gesehen: «Überfällige Abrechnungen prüfen» mit klarer Handlungsanweisung, dazu unter «Fristen» Müller (seit 16 Tagen abgelaufen) und Rossi (seit 46 Tagen). Gut.
2. **Abrechnung Müller.** Erwartet: ein Mahn-Button neben «Als bezahlt markieren». Gesehen: «Mahnung senden», Status «Überfällig», Saldo CHF 215.80.
3. **Dialog «Mahnung senden».** Erwartet: Betrag, Empfänger, was genau passiert. Gesehen: «Dwello erstellt die Zahlungserinnerung als PDF und legt sie unter «Dokumente» bereit … Markieren Sie den Brief dort am Tag, an dem Sie ihn zur Post bringen, als versendet. Drucken Sie ihn danach aus …» und «Hans Müller schuldet noch CHF 215.80». Die Reihenfolge «erst markieren, dann drucken» hat mich zuerst irritiert. Die Seite «Dokumente» begründet sie (Datum und neue Frist werden erst dann gesetzt).
4. **Bestätigen «Zahlungserinnerung senden».** Gesehen: Meldung «Mahnung erstellt – Das Dokument «Zahlungserinnerung» liegt unter «Dokumente» als Brief zum Ausdrucken bereit». Neu sind der Abschnitt «Mahnungen» (Zahlungsfrist der Mahnung 27.10.2026, «Zu versenden», PDF-Link) sowie «Letzte Mahnung 17.10.2026» und «Nächste Mahnung möglich ab 28.10.2026». Der Button «Mahnung senden» ist bis dahin verschwunden. Wie erwartet.
5. **Dasselbe für Rossi.** Gleicher Dialog, CHF 35.70, gleiches Ergebnis.
6. **«Dokumente».** Erwartet: beide Briefe als «Zu versenden». Gesehen: genau das, jeweils mit «Als versendet markieren» und «PDF herunterladen».
7. **PDF Müller** («Zahlungserinnerung NK-11111111-2025-0001.pdf», 2 Seiten A4). Seite 1: Absender, Empfängeradresse im Fenster rechts, «Zürich, 17.10.2026», Betreff mit Abrechnungsnummer, Periode, offener Betrag, Frist 27.10.2026, IBAN, Referenz. Seite 2: Swiss-QR-Zahlteil mit Empfangsschein. Alles passt zur Abrechnung (siehe P-3, P-4).
8. **PDF Rossi** («Promemoria di pagamento …», 2 Seiten). Inhalt wie bei Müller, ganz auf Italienisch, Zahlteil ebenfalls auf Italienisch.
9. **Abgleich mit den Abrechnungs-PDFs.** Die QR-Referenzen sind identisch, die Prüfziffern korrekt.
10. **«Als versendet markieren»** für beide. Erwartet: eine Rückfrage. Gesehen: keine Rückfrage, sondern die Meldung «… ist als versendet markiert. Der Brief trägt jetzt das heutige Datum und eine neue Zahlungsfrist. Drucken Sie ihn jetzt aus …». Die PDFs danach sind am selben Tag textgleich, wie zu erwarten.
11. **Abrechnung Müller erneut.** Die Mahnung steht auf «Versendet», der Status bleibt «Überfällig». Richtig.
12. **Hilfe «Zahlungen und Mahnungen».** Erwartet: was eine Mahnung rechtlich ist und was nach der 3. Mahnung geht. Gesehen: «Eine Mahnung von Dwello ist eine Zahlungsaufforderung. Sie ist keine Zahlungsfrist mit Kündigungsandrohung nach Art. 257d OR. Weitere Schritte, z. B. eine Betreibung oder eine Kündigung wegen Zahlungsrückstand nach Art. 257d OR, liegen ausserhalb von Dwello. Für diese Kündigung setzen Sie dem Mieter zuerst in einem eigenen Brief eine Zahlungsfrist von mindestens 30 Tagen und drohen ihm die Kündigung an. Lassen Sie sich beraten.» Unter «Begriffe»: Mahnung = Zahlungserinnerung, danach höchstens eine 2. und eine 3. Mahnung. Das ist klar und im Kern korrekt. Die 30 Tage bei Wohnräumen entsprechen Art. 257d Abs. 1 OR. Zu den Lücken siehe P-2, zum Widerspruch beim Versand P-1.

## Verwirrung

- «Mahnung senden» und «Zahlungserinnerung senden»: Es wird nichts gesendet, nur ein PDF erstellt. Erst der Dialogtext klärt das.
- «Zahlungsfrist der Mahnung» und, in der Hilfe, «keine Zahlungsfrist mit Kündigungsandrohung»: Dasselbe Wort «Zahlungsfrist» steht für die einfache Mahnfrist und für die Frist nach Art. 257d. Mit der Hilfe verständlich, ohne sie leicht zu verwechseln.
- Die Hilfe sagt «per E-Mail oder als Brief». Ob Dwello E-Mails selbst verschickt, bleibt offen (P-1).

## Fehlerrisiken

- Ein Vermieter glaubt, die Mahnung nach dem Klick auf «Mahnung senden» sei beim Mieter. Der Dialog und die Meldung «… als Brief zum Ausdrucken bereit» mildern das.
- Er druckt den Brief vor dem Markieren und bringt ihn Tage später zur Post. Dann sind Datum und Frist veraltet. Die Hilfe warnt davor.
- Nach der 3. Mahnung hält er eine Dwello-Mahnung für eine Fristansetzung nach 257d. Die Hilfe schliesst das ausdrücklich aus, gut. Wer aber der Hilfe allein folgt, kann bei einer Familienwohnung oder ohne amtliches Formular eine nichtige Kündigung aussprechen (P-2).
- Ein Mieter tippt die IBAN aus dem Brieftext ab und gibt keine Referenz an. Die Bank weist eine QR-IBAN ohne QR-Referenz zurück (P-3, gering, weil die Referenz direkt darunter steht).

## Vorschläge

- **P-1.** Reproduktion: Abrechnung Müller → «Mahnung senden» → Dialogtext lesen, dann Hilfe → «Zahlungen und Mahnungen», dritter Punkt. Hilfreich wäre ein Hilfetext, der zum Dialog passt, etwa: «Dwello erstellt die Zahlungserinnerung oder Mahnung als PDF. Briefe finden Sie unter «Dokumente» …». Den E-Mail-Fall sollte die Hilfe so beschreiben, wie er tatsächlich abläuft (wer verschickt die E-Mail?).
- **P-2.** Reproduktion: Hilfe → «Zahlungen und Mahnungen», letzter Punkt. Hilfreich wäre ein Satz wie: «Schicken Sie diesen Brief eingeschrieben; bei einer Familienwohnung beiden Ehegatten je separat. Die Kündigung selbst braucht das amtliche Formular.» «Lassen Sie sich beraten» bleibt stehen. Das gehört zur fachlichen Prüfung.
- **P-3.** Reproduktion: «Dokumente» → «PDF herunterladen» einer Zahlungserinnerung, Seite 1. Hilfreich wäre die IBAN in Vierergruppen wie im Zahlteil, der Satz «Bitte verwenden Sie den beiliegenden Zahlteil oder überweisen Sie …» und die Bezeichnung «QR-IBAN» (oder nur «Konto»).
- **P-4.** Reproduktion: wie P-3. Hilfreich wären eine Kontaktzeile des Vermieters für Rückfragen und das Abrechnungsdatum («Nebenkostenabrechnung vom 28.09.2026»).

## Nicht geprüft

- Den QR-Code selbst (Inhalt des Swiss-QR-Datensatzes) habe ich nicht dekodiert, weil auf dem Rechner kein QR-Leser verfügbar war. Geprüft habe ich nur den lesbaren Zahlteil und die Prüfziffer der Referenz.
- 2. und 3. Mahnung bei Müller und Rossi: Die nächste Mahnung ist erst ab 28.10.2026 möglich.
- Mahnung an einen Mieter mit Korrespondenzkanal E-Mail: Beide Mieter erhalten Briefe, deshalb blieb P-1 im E-Mail-Fall ungeklärt.
- Ob sich Datum und Frist im PDF ändern, wenn man an einem späteren Tag als versendet markiert: Erstellen und Markieren fielen auf denselben Tag.
