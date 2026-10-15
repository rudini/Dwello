# Persona-Lauf: Helga, Issue #126, Runde 2 (Meldung bei nicht zugestellter Mahnung)

Persona: Helga, 68, wenig Computererfahrung, braucht grosse Schrift, unsicher bei Fachbegriffen.
Ansicht: Desktop 1280 px Fensterbreite bei 150 % Zoom (853 × 600 CSS-Pixel), Maus, Deutsch.
App: Persona-Stack (http://localhost:3300, frische Datenbank `dwello_persona`), vom Aufrufer gestartet.
Skripte, Bildschirmfotos und das heruntergeladene PDF: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/helga-issue-126-2/`.

Bewertet wird nur die neue Meldung «Die E-Mail wurde nicht zugestellt. Drucken Sie die Mahnung aus, schicken Sie sie per Post und markieren Sie sie danach als versendet. Prüfen Sie für die nächste Mahnung die E-Mail-Adresse des Mieters.» und ob ich die Schritte, die sie verlangt, dort erledigen kann, wo ich sie lese.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Mieter Hans Müller (Karte «Dokumente»), Abrechnung (Abschnitt «Mahnungen») | Die Meldung sagt «markieren Sie sie danach als versendet», aber hier gibt es keinen Knopf «Als versendet markieren» und keinen Link zu «Dokumente». Ausdrucken (PDF herunterladen) geht, markieren nicht. Ich muss selbst wissen, dass das nur unter Menü → Dokumente geht. |
| P-2 | Minor | Dokumente, Mieter, Abrechnung (nach «Als versendet markieren») | Nachdem ich getan habe, was die Meldung sagt, steht überall «per E-Mail · Versendet». Ich habe die Mahnung aber per Post geschickt. Wer später nachschaut, glaubt, die E-Mail sei angekommen; der Hinweis auf den Fehler ist ganz weg. |
| P-3 | Nit | Dokumente | «Prüfen Sie … die E-Mail-Adresse des Mieters»: In «Dokumente» steht weder die Adresse noch ein Link zu Hans Müller. Auf Mieterseite und Abrechnung sehe ich die Adresse dagegen direkt (hans.mueller@example.ch). |

## Beobachtungen

- Der neue Text ist viel klarer als in Runde 1: Er sagt in der richtigen Reihenfolge, was ich tun soll (ausdrucken, per Post schicken, als versendet markieren), und «für die nächste Mahnung» macht klar, dass ich jetzt nichts erneut per E-Mail senden muss. Den früheren Widerspruch («erneut senden» ohne Knopf) gibt es nicht mehr.
- In «Dokumente» kann ich alles direkt auf der Zeile erledigen: «PDF herunterladen» und «Als versendet markieren» stehen rechts neben der Meldung (Bild `08-dokumente.png`). Der Einleitungstext der Seite sagt dasselbe wie die Meldung.
- «Als versendet markieren» wirkt sofort, ohne Rückfrage und ohne Erfolgsmeldung; nur das Etikett wechselt von gelb «Zu versenden» auf grün «Versendet» und der Knopf verschwindet (Bild `11-mark-click.png`). Ich war kurz unsicher, ob es geklappt hat.
- Das PDF der Zahlungserinnerung lässt sich herunterladen und ist als Brief druckbar (Absender, Anschrift Hans Müller, offener Betrag CHF 215.80, neue Frist 25.10.2026, IBAN und Referenz).
- Übersicht: «Briefe verschicken: 1 Brief ist zum Versand bereit. Drucken Sie sie aus …» weist mit «Briefe ansehen» auf «Dokumente», sagt aber nichts davon, dass eine E-Mail nicht ankam; «sie» (Mehrzahl) bei einem Brief. Schon in Runde 1 gesehen.
- Nach dem Senden der Mahnung heisst es «liegt als Brief zum Ausdrucken in den Dokumenten bereit», «Dokumenten» ist aber kein Link.
- In einer Zeile stehen «Zahlungserinnerung» (Titel) und «Mahnung» (Meldung) für dasselbe Schreiben; Dialog «Mahnung senden», Knopf «Zahlungserinnerung senden». Schon in Runde 1 gesehen.
- Mieterseite: «Korrespondenzkanal: Per Brief», die Mahnung daneben «per E-Mail». Das kommt von der Simulation (Kanal per SQL auf E-Mail gesetzt), nicht von der App.
- Mieterseite: Datei-Auswahl auf Englisch «Choose File» / «No file chosen». Schon in Runde 1 gesehen.
- Nach dem Ändern der Zahlungsfrist zeigte die Abrechnung «PDF erstellen» statt «PDF herunterladen», ohne Erklärung. Schon in Runde 1 gesehen.

## Aufgabe geschafft: ja

Ich habe die Meldung an allen drei Orten gefunden und verstanden. Ausdrucken kann ich überall, als versendet markieren nur in «Dokumente» (P-1). Dort habe ich die Mahnung als versendet markiert; danach ist die Meldung weg.

## Aufwand

Etwa 12 Minuten, 14 Schritte: Übersicht, Frist-Link zur Abrechnung, «Frist und Bemerkungen bearbeiten», Frist ändern und speichern, «Mahnung senden», «Zahlungserinnerung senden», Zustellfehler per SQL, Übersicht, Menü → Dokumente, Mieterseite, Abrechnung, PDF herunterladen, «Als versendet markieren», alle drei Orte noch einmal.

## Ablauf

1. **Übersicht** (Bild `01-dashboard.png`). Erwartet: Abrechnung von Hans Müller. Gesehen: unter «Fristen» «28.10.2026 Zahlungsfrist · Hans Müller in 13 Tagen», «0 Überfällig». Wie in Runde 1.
2. **Abrechnung NK-11111111-2025-0001** über den Frist-Link (Bild `02-statement.png`). Gesehen: Status «Versendet», kein «Mahnung senden».
3. **Frist ändern** (Bild `03-edit.png`, `04-after-save.png`). «Frist und Bemerkungen bearbeiten», Zahlungsfrist 30.09.2026, «Änderungen speichern». Gesehen: «Status: Überfällig», Knöpfe «PDF erstellen», «Mahnung senden», «Als bezahlt markieren».
4. **Mahnung senden** (Bild `05-dialog.png`, `06-after-send.png`). Dialog «Mahnung senden»: Dwello erstellt die Zahlungserinnerung als PDF unter «Dokumente», «Hans Müller schuldet noch CHF 215.80». Nach «Zahlungserinnerung senden»: «Mahnung erstellt. Zahlungserinnerung liegt als Brief zum Ausdrucken in den Dokumenten bereit.» Abschnitt «Mahnungen» mit meinem Dokument (id `df65941a-ceac-4aaa-9fab-f110f189c012`).
5. **Zustellfehler simulieren.** Per SQL nur auf diesem Dokument: Status `to_send`, `sent_at` leer, Kanal `email`, Fehlertext des Mailservers.
6. **Übersicht** (Bild `07-dashboard.png`). Erwartet: Hinweis auf die nicht angekommene E-Mail. Gesehen: «Überfällige Abrechnungen prüfen» und «Briefe verschicken: 1 Brief ist zum Versand bereit …», kein Wort zur E-Mail (Beobachtung).
7. **Menü → Dokumente** (Bild `08-dokumente.png`). Erwartet: die Meldung und die Knöpfe, um das zu tun, was sie sagt. Gesehen: «Zahlungserinnerung · NK-11111111-2025-0001», «An Hans Müller, erstellt am 15.10.2026, per E-Mail», gelbes Etikett «Zu versenden» mit Warnsymbol, darunter in brauner Schrift die neue Meldung. Rechts «Als versendet markieren» und «PDF herunterladen». Kein englischer Text. Hier passt alles zusammen; nur die E-Mail-Adresse zum Prüfen fehlt (P-3).
8. **Mieterseite Hans Müller** (Bild `09-mieter.png`). Erwartet: dieselben Möglichkeiten. Gesehen: Karte «Dokumente», «15.10.2026 · per E-Mail · Zu versenden», dieselbe Meldung, darunter nur «PDF herunterladen». Kein «Als versendet markieren», kein Link zu «Dokumente» (P-1). Oben unter «Kontaktdaten» steht die E-Mail-Adresse, «Bearbeiten» ist da: Prüfen geht hier gut.
9. **Abrechnung** (Bild `10-statement.png`). Abschnitt «Mahnungen»: dieselbe Meldung, nur «PDF herunterladen» (P-1). Unter «Mieter und Wohnung» steht hans.mueller@example.ch mit Link zum Mieter. Oben steht «Mahnung senden»: Ich hätte beinahe eine zweite Mahnung erstellt, um die erste «loszuwerden»; die Meldung sagt das aber nicht, also habe ich es gelassen.
10. **PDF herunterladen** in «Dokumente». Datei «Zahlungserinnerung NK-11111111-2025-0001.pdf», ein ordentlicher Brief an Hans Müller. Ausdrucken wäre möglich.
11. **«Als versendet markieren»** in «Dokumente» (Bild `11-mark-click.png`). Erwartet: eine kurze Bestätigung. Gesehen: sofort grünes «Versendet», Meldung und Knopf weg, keine Rückmeldung (Beobachtung).
12. **Alle drei Orte nachher** (Bilder `12-dok-nachher.png`, `13-mieter-nachher.png`, `14-abr-nachher.png`, `15-dash-nachher.png`). Überall «per E-Mail» und «Versendet», keine Spur mehr vom Zustellfehler (P-2). Die Übersicht zeigt «Briefe verschicken» nicht mehr.

## Verwirrung

- «markieren Sie sie danach als versendet» auf der Mieterseite und der Abrechnung: Wo? Dort gibt es den Knopf nicht. Ich habe mich erinnert, dass er in «Dokumente» ist; beim ersten Mal hätte ich gesucht.
- «Mahnung» in der Meldung, «Zahlungserinnerung» im Titel derselben Zeile: Ich nehme an, das ist dasselbe.
- «per E-Mail · Versendet» nach dem Markieren: Ich habe per Post verschickt. Jetzt steht da etwas anderes, als ich getan habe.
- «Drucken Sie die Mahnung aus, schicken Sie sie per Post»: verstanden. «für die nächste Mahnung»: verstanden, gut.

## Fehlerrisiken

- Ich lese die Meldung auf der Mieterseite oder der Abrechnung, drucke und schicke den Brief, finde aber den Knopf zum Markieren nicht. Dann bleibt die Mahnung «Zu versenden» und die Übersicht fordert mich weiter auf, einen Brief zu verschicken; vielleicht schicke ich ihn ein zweites Mal (P-1).
- Ich klicke auf der Abrechnung «Mahnung senden», weil das der einzige Knopf mit «Mahnung» ist, und erstelle eine zweite Mahnung (P-1).
- Monate später sehe ich «per E-Mail · Versendet» und weiss nicht mehr, dass die E-Mail nie ankam und der Mieter nur den Brief hat. Bei einem Streit um die Mahnung wäre das falsch dokumentiert (P-2).
- Ich vergesse, die E-Mail-Adresse zu prüfen, weil ich in «Dokumente» nicht sehe, welche Adresse benutzt wurde (P-3).

## Vorschläge

- **P-1** Reproduktion: Abrechnung 2025 von Hans Müller überfällig machen (Frist 30.09.2026), «Mahnung senden» → «Zahlungserinnerung senden», beim Dokument einen Zustellfehler mit Kanal E-Mail speichern, Mieterseite Hans Müller oder die Abrechnung öffnen. Die Meldung verlangt «als versendet markieren», dort gibt es nur «PDF herunterladen». Hilfreich: «Als versendet markieren» auch in der Karte «Dokumente» der Mieterseite und im Abschnitt «Mahnungen» der Abrechnung anbieten, oder dort einen Link «Zu den Dokumenten» bzw. in der Meldung sagen, wo: «… und markieren Sie sie unter «Dokumente» als versendet.»
- **P-2** Reproduktion: wie P-1, dann in «Dokumente» «Als versendet markieren» klicken. Danach steht überall «per E-Mail · Versendet». Hilfreich: nach dem Markieren den Weg festhalten, den ich tatsächlich genommen habe («per Brief versendet»), oder den Hinweis «E-Mail nicht zugestellt, per Post versendet» stehen lassen.
- **P-3** Reproduktion: wie P-1, Seite «Dokumente». Hilfreich: Adresse in der Meldung nennen («Die E-Mail an hans.mueller@example.ch wurde nicht zugestellt.») oder «An Hans Müller» als Link zur Mieterseite.

## Nicht geprüft

- Ein echter Zustellfehler durch einen Mailserver: simuliert per SQL, wie vom Aufrufer vorgegeben (Status, Versanddatum, Kanal E-Mail, Fehlertext). Deshalb steht auf der Mieterseite «Korrespondenzkanal: Per Brief» neben einer Mahnung «per E-Mail».
- Ob es anders aussieht, wenn die E-Mail-Mahnung von Dwello selbst erstellt wird (Mieter mit Korrespondenzkanal E-Mail): Hans Müller hat «Per Brief», und ich habe seine Daten nicht geändert.
- Andere Sprachen, 200 % Zoom und Mobilansicht: nicht verlangt.
- Den Zustand vor dem Markieren konnte ich nach dem Klick nicht noch einmal ansehen; alle Bilder davor sind in den Bildern `08` bis `10` festgehalten.
