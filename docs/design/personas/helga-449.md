# Persona-Review Helga: Abrechnung per Brief statt E-Mail (#449)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (Versanddialog auch bei 200 %), Maus.
Gespeichert nur im Gebäude «Seepark Residenz»: Abrechnungen 2025 von Thomas Weber (NK-22222222-2025-0001) und Nina Brunner (NK-22222222-2025-0003) als versendet per Brief markiert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/64765504-0fe7-53d5-8fe2-5e8bfa233439/scratchpad/helga-449/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Versanddialog «Abrechnung als versendet markieren» und Seite «Dokumente» / Übersicht | Die Reihenfolge widerspricht sich. Im Dialog steht «Stellen Sie dem Mieter das PDF zu und markieren Sie die Abrechnung danach als versendet». Unter «Dokumente» und auf der Übersicht steht «Markieren Sie einen Brief am Tag, an dem Sie ihn zur Post bringen, als versendet … Drucken Sie den Brief danach aus». Ich weiss nicht, ob ich zuerst drucke oder zuerst markiere. |
| P-2 | Minor | Abrechnung von Nina Brunner, Detailseite | Der Knopf heisst «Per E-Mail senden», obwohl Nina Brunner keine E-Mail-Adresse hat. Erst der Dialog sagt «Für Nina Brunner ist keine E-Mail-Adresse erfasst» und dass ein Brief nötig ist. |
| P-3 | Minor | Versanddialog Brief | «Stellen Sie dem Mieter das PDF zu» sagt nicht klar, dass ich das PDF ausdrucken und mit der Post schicken muss. Eine Anleitung zum Ausdrucken fehlt (welche Seiten, ob ein Einzahlungsschein dabei ist). |
| P-4 | Minor | Versanddialog Brief bei Thomas Weber | Der Dialog sagt nicht, ob Thomas Weber danach weiterhin E-Mail wünscht. Ich habe das erst auf der Mieterseite nachgesehen (dort steht weiterhin «Per E-Mail», also ist es richtig). |
| P-5 | Minor | Versanddialog E-Mail, Hinweis zur abgewiesenen E-Mail | «Kommt die E-Mail später als unzustellbar zurück …» sagt nicht, wo ich das merke: kommt die Meldung zu mir ins Postfach, oder zeigt Dwello sie an (wo)? |
| P-6 | Minor | Versanddialog Brief bei 200 % Zoom | Beim Öffnen ist der Dialog schon nach unten gescrollt (der Fokus liegt auf «Abbrechen»). Der Titel und der Satz «Für Nina Brunner ist keine E-Mail-Adresse erfasst» sind oben abgeschnitten, man sieht sie erst nach dem Hochscrollen. |
| P-7 | Nit | Versanddialog E-Mail, erster Absatz | Der Satz «Die Zahlungsfrist ist so viele Tage danach, wie in den Einstellungen festgelegt; eine spätere Zahlungsfrist, die Sie bei der Abrechnung eingetragen haben, bleibt.» ist für mich zu lang und zu verschachtelt. |
| P-8 | Nit | Versanddialog Brief | Wenn ich «Stattdessen per Brief zustellen» gewählt habe, gibt es keinen Knopf zurück zu E-Mail, nur «Abbrechen». Mit «Abbrechen» geht es zwar, aber das hätte ich nicht gewusst. |

## Beobachtungen

- Bei Nina Brunner zeigt die Mieterseite «E-Mail: Keine E-Mail-Adresse erfasst» und gleich darunter «Korrespondenzkanal: Per E-Mail». Das widerspricht sich, und es gibt keinen Hinweis dazu. Wahrscheinlich kommt P-2 daher.
- Der Kopf der Abrechnung von Nina Brunner zeigt «Abrechnungsperiode 01.01.2025 – 31.12.2025», obwohl sie erst seit 01.07.2025 mietet. In der Liste stehen dagegen richtig «01.07.2025 – 31.12.2025, 184 Mietstage», im PDF ebenso «Ihr Mietverhältnis in dieser Periode».
- «dem Mieter» auch bei einer Mieterin (Nina Brunner).
- Die Seite «Dokumente» beginnt mit «Mahnungen und andere Schreiben an Mieter …». Dass dort jetzt auch die Nebenkostenabrechnungen liegen, habe ich erst in der Liste gesehen.
- Auf der Übersicht und unter «Dokumente» standen Einträge zu Hans Müller (Zahlungserinnerung), die nicht von mir sind (andere Persona). Die habe ich nicht angefasst.
- Die PDF-Ansicht im Dialog zeigte vor dem Markieren schon «Abrechnungsdatum 20.10.2026» (heute). Das PDF unter «Dokumente» danach zeigt dasselbe Datum. Das passt zusammen.
- Nach dem Versand stand bei beiden Abrechnungen «Status: Versendet», als Meldung «Abrechnung als versendet markiert», und der nächste Knopf heisst «Als bezahlt markieren». Auf der Übersicht stand neu eine Frist «19.11.2026 Zahlungsfrist · Thomas Weber», obwohl er eine Rückerstattung bekommt. Wahrscheinlich ist es die Frist, bis zu der ich ihm das Geld überweise (so steht es im PDF), aber «Zahlungsfrist · Thomas Weber» klingt, als müsse er zahlen.

## Aufgabe geschafft: ja

Beide Abrechnungen sind per Brief versendet. Verlauf, «Dokumente» und Mieterseite habe ich geprüft. Was ich ausdrucke und wann ich markiere, weiss ich aber nicht sicher (P-1, P-3).

## Aufwand

Etwa 20 Minuten, 17 Durchläufe (Skripte). Für Thomas Weber 4 Klicks (Abrechnung öffnen, «Per E-Mail senden», «Stattdessen per Brief zustellen», «Als versendet markieren»), für Nina Brunner 3 Klicks. Dazu das Nachsehen auf «Dokumente» und auf den Mieterseiten.

## Ablauf

1. **Übersicht.** Erwartet: ein Weg zu den Abrechnungen. Gesehen: «Abrechnungen prüfen und versenden» mit «Entwürfe ansehen». Bei 150 % ist die Navigation hinter «Menü öffnen» versteckt, ich fand «Nebenkostenabrechnungen» im Menü.
2. **Liste der Abrechnungen.** Erwartet: Thomas Weber 2025. Gesehen: «Thomas Weber NK-22222222-2025-0001, Seepark Residenz, Wohnung A1, Rückerstattung CHF 34.60, Entwurf». Gut zu finden.
3. **Abrechnung Thomas Weber.** Erwartet: ein Knopf «Senden» mit der Wahl E-Mail oder Brief. Gesehen: nur «Per E-Mail senden». Ich war kurz unsicher, ob ich so überhaupt einen Brief schicken kann (Screenshot `03-weber-detail.png`).
4. **Dialog «Abrechnung per E-Mail senden».** Erwartet: die Wahl des Wegs. Gesehen: zwei Absätze Erklärung, «Empfänger: Thomas Weber», «Korrespondenzkanal: Per E-Mail, thomas.weber@example.ch», darunter der Knopf «Stattdessen per Brief zustellen». Den habe ich gefunden, gut (`04-weber-dialog.png`).
5. **Dialog «Abrechnung als versendet markieren».** Erwartet: dass ich erfahre, was ich tun muss. Gesehen: «Dwello verschickt die Abrechnung nicht selbst. Stellen Sie dem Mieter das PDF zu und markieren Sie die Abrechnung danach als versendet.» Dazu «Per Brief, Seeweg 15, 6003 Luzern», «PDF ansehen (öffnet in neuem Tab)» und «Als versendet markieren» (`05-weber-brief-dialog.png`). Das PDF hat sich als zweiseitige Abrechnung geöffnet, mit Thomas Webers Adresse im Fenster.
6. **«Als versendet markieren».** Erwartet: eine Bestätigung. Gesehen: die Meldung «Abrechnung als versendet markiert», «Status: Versendet», im Verlauf «Versendet per Brief 20.10.2026» (`06-weber-nach-versand.png`). Das ist klar.
7. **«Dokumente».** Erwartet: die Abrechnung als Brief. Gesehen: «Nebenkostenabrechnung · NK-22222222-2025-0001, An Thomas Weber, erstellt am 20.10.2026, per Brief, Versendet» mit «PDF herunterladen». Der Text oben sagt aber «markieren … danach ausdrucken», also das Umgekehrte von Schritt 5 (P-1, `07-dokumente.png`).
8. **Mieter Thomas Weber.** Erwartet: weiterhin E-Mail. Gesehen: «Korrespondenzkanal: Per E-Mail», unter «Dokumente» «20.10.2026 · per Brief · Versendet». Richtig, aber das musste ich selbst nachsehen (P-4, `08-mieter-weber.png`).
9. **Abrechnung Nina Brunner.** Erwartet: weil sie keine E-Mail hat, gleich einen Knopf für den Brief. Gesehen: wieder «Per E-Mail senden» (P-2, `09-brunner-detail.png`).
10. **Dialog bei Nina Brunner.** Gesehen: Titel «Abrechnung als versendet markieren», zuoberst «Für Nina Brunner ist keine E-Mail-Adresse erfasst.», dann derselbe Text wie in Schritt 5, «Per Brief, Seeweg 15, 6003 Luzern» (`10-brunner-dialog.png`). Damit verstehe ich: Sie bekommt einen Brief an diese Adresse. Bei 200 % sind Titel und dieser erste Satz beim Öffnen oben abgeschnitten (P-6, `12-brunner-dialog-200-viewport.png`).
11. **«Als versendet markieren» bei Nina Brunner.** Gesehen: «Status: Versendet», im Verlauf «Versendet per Brief 20.10.2026», auf der Mieterseite unter «Dokumente» «per Brief · Versendet» (`13-brunner-nach-versand.png`, `14-mieter-brunner.png`).

## Verwirrung

- «Zustellen»: Heisst das in den Briefkasten werfen, mit der Post schicken oder eingeschrieben schicken? Wenn ich drucken soll, möchte ich «Drucken Sie das PDF aus und schicken Sie es per Post» lesen.
- Zuerst drucken oder zuerst markieren? Der Dialog und die Seite «Dokumente» sagen das Gegenteil (P-1).
- «Korrespondenzkanal» kenne ich nicht als Wort, aber mit «Per E-Mail» oder «Per Brief» dahinter verstehe ich es.
- «Kommt die E-Mail später als unzustellbar zurück»: Woher weiss ich das? (P-5)
- «Mahnen Sie dann erst, wenn der Mieter die Abrechnung per Brief erhalten hat»: Wie weiss ich, wann er den Brief erhalten hat? Soll ich ein paar Tage dazurechnen?
- «Zahlungsfrist · Thomas Weber» auf der Übersicht, obwohl er Geld zurückbekommt.

## Fehlerrisiken

- Wer der Übersicht oder «Dokumente» folgt, markiert zuerst und druckt dann. Wer dem Dialog folgt, druckt zuerst. Druckt man am Vortag und markiert erst am nächsten Tag, stimmt das Datum auf dem Brief nicht mit dem Versanddatum in Dwello überein.
- Bei Nina Brunner kann man nach dem Knopf «Per E-Mail senden» glauben, die Abrechnung sei per E-Mail weg, wenn man den Dialog nur überfliegt. Der Knopf im Dialog heisst aber richtig «Als versendet markieren».
- Bei 200 % kann man den Hinweis «keine E-Mail-Adresse erfasst» übersehen (P-6).
- Man markiert als versendet und vergisst, den Brief wirklich zu schicken: Danach erinnert Dwello an nichts mehr.

## Vorschläge

- **P-1:** Übersicht oder «Dokumente» öffnen und den Einleitungstext lesen («Markieren … danach ausdrucken»). Dann eine Abrechnung öffnen, «Per E-Mail senden», «Stattdessen per Brief zustellen» («Stellen Sie … zu und markieren Sie … danach»). Hilfreich: überall dieselbe Reihenfolge in kurzen Schritten, z. B. «1. PDF ansehen und ausdrucken. 2. Heute zur Post bringen. 3. Hier als versendet markieren.»
- **P-2:** Abrechnung von Nina Brunner öffnen: der Knopf heisst «Per E-Mail senden». Hilfreich: ohne E-Mail-Adresse den Knopf «Per Brief zustellen» nennen.
- **P-3:** Wie bei P-1, Brief-Dialog öffnen. Hilfreich: «Drucken Sie das PDF aus und schicken Sie es per Post an die Adresse unten.»
- **P-4:** Thomas Weber, Brief-Dialog. Hilfreich: ein Satz «Thomas Weber wünscht weiterhin E-Mail; nur diese Abrechnung geht per Brief.»
- **P-5:** Dialog «Abrechnung per E-Mail senden», zweiter Absatz. Hilfreich: sagen, wo Dwello eine abgewiesene E-Mail anzeigt (z. B. «Dwello zeigt das bei der Abrechnung und auf der Übersicht an»).
- **P-6:** Zoom 200 %, Abrechnung Nina Brunner, «Per E-Mail senden». Der Dialog öffnet um 143 px nach unten gescrollt. Hilfreich: beim Öffnen oben beginnen (Fokus auf den Titel oder den ersten Absatz).
- **P-7:** Dialog «Abrechnung per E-Mail senden», erster Absatz. Hilfreich: zwei kurze Sätze, z. B. «Die Zahlungsfrist beginnt am Versandtag. Haben Sie eine spätere Frist eingetragen, gilt diese.»
- **P-8:** «Stattdessen per Brief zustellen» wählen. Hilfreich: ein Knopf «Doch per E-Mail senden».

## Nicht geprüft

- Eine wirklich abgewiesene E-Mail (die Aufgabe nannte kein SQL dafür). Ich habe nur den Hinweistext beurteilt.
- Den echten Versand per E-Mail: Ich habe bewusst nur Briefe verschickt.
- Den Ausdruck auf Papier: Ich habe nur den PDF-Text gelesen und nicht beurteilt, ob ein QR-Einzahlungsschein dabei ist, weil beide Abrechnungen Rückerstattungen sind.
- Andere Sprachen und den Dunkelmodus.
