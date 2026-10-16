# Helga – w6c: Nach der 3. Mahnung

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (Dialog zusätzlich bei 200 %), Maus. Nur angeschaut, nichts gespeichert.
Vorbereitung durch den Aufrufer (SQL): Die Nebenkostenabrechnung 2024 von Sarah Meier (Seepark Residenz) ist überfällig und hat schon drei Mahnungen.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/bb8b5e95-cb4b-5288-89e2-e60f5a92261e/scratchpad/helga-w6c/`

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Dialog «Keine weitere Mahnung möglich» | Zwei Knöpfe «Abbrechen» und «Verstanden», die beide nur den Dialog schliessen. «Abbrechen» lässt mich glauben, dass ich etwas angestossen habe, das ich jetzt abbrechen muss. |
| P-2 | Minor | Dialog und Hilfe «Zahlungen und Mahnungen» | Der zweite Absatz ist für mich schwer: «Art. 257d OR», «Betreibung», «Zahlungsfrist mit Kündigungsandrohung» werden nicht erklärt, und «Lassen Sie sich beraten» sagt nicht, von wem (Hauseigentümerverband, Anwalt, Schlichtungsbehörde?). Das Wort «Kündigung» kommt dreimal vor, bei CHF 121.05 erschreckt mich das. |
| P-3 | Minor | Abrechnungsseite Sarah Meier | «Mahnung senden» ist weiter als normaler Knopf da, obwohl nichts mehr geht. Erst nach dem Klick erfahre ich, dass Schluss ist. Ein Hinweis auf der Seite selbst fehlt. |

## Beobachtungen

- Die Übersicht sagt bei den überfälligen Abrechnungen pauschal «sonst können Sie eine Mahnung senden». Für Sarah Meier stimmt das nicht mehr; die Übersicht unterscheidet nicht.
- In der Liste steht bei Sarah «Gemahnt am 20.08.2026», auf der Abrechnung «Letzte Mahnung 20.08.2026», aber alle drei Mahnungen tragen «erstellt am 17.10.2026» (also morgen bzw. heute nacht), mit Zahlungsfristen im Juli und August. Das kommt wohl von der SQL-Vorbereitung; ich werte es nicht.
- Im «Verlauf» der Abrechnung stehen nur Erstellt, PDF erstellt, Versendet, keine Mahnungen.
- Der Dialog bleibt bei 200 % lesbar, nichts läuft seitlich aus der Seite (Breite 720 = Fensterbreite). Beim Öffnen steht der Fokus auf «Abbrechen».
- «Verstanden» und «Abbrechen» schicken nichts an den Server (geprüft: keine Anfrage ausser GET).
- Der Link «Sarah Meier» in der Liste der Überfälligen öffnet die Abrechnung, nicht die Mieterin. Das hat gepasst, ich wollte ja die Abrechnung.

## Aufgabe geschafft: ja

Ich weiss jetzt: Dwello macht keine 4. Mahnung, ich soll mit Frau Meier selbst reden. Wenn das nichts bringt, muss ich ausserhalb von Dwello weiter (Betreibung oder Kündigung mit eigenem Brief und 30 Tagen Frist) und mich beraten lassen. Was ich genau als Nächstes tun *soll*, bleibt etwas offen (siehe P-2).

## Aufwand

Etwa 6 Minuten, 6 Schritte: Übersicht → «Überfällige ansehen» → Sarah Meier → «Mahnung senden» → Dialog lesen und schliessen → Hilfe → Abschnitt «Zahlungen und Mahnungen».

## Ablauf

1. **Übersicht.** Erwartet: Hinweis auf offene Zahlungen. Gesehen: «Überfällige Abrechnungen prüfen», 3 Abrechnungen über der Frist, bei «Fristen» «Zahlungsfrist · Sarah Meier, seit 138 Tagen abgelaufen». Gut sichtbar.
2. **«Überfällige ansehen».** Erwartet: Liste mit Sarah. Gesehen: drei Abrechnungen, Sarah Meier mit CHF 121.05, rotes «Überfällig» mit Symbol und «Gemahnt am 20.08.2026». Kein Hinweis, dass bei ihr schon alle Mahnungen weg sind.
3. **Abrechnung NK-22222222-2024-0002.** Erwartet: Mahnungen sichtbar. Gesehen: Knöpfe «PDF herunterladen», «Mahnung senden», «Als bezahlt markieren»; unten Abschnitt «Mahnungen» mit Zahlungserinnerung, 2. Mahnung, 3. Mahnung, alle «Versendet». Dass «3. Mahnung» die letzte ist, steht hier nirgends.
4. **«Mahnung senden».** Erwartet: ein Formular für eine weitere Mahnung oder eine Warnung. Gesehen: Dialog «Keine weitere Mahnung möglich»: «Es wurden bereits 3 Mahnungen versendet. Dwello erstellt keine weitere. Klären Sie das weitere Vorgehen direkt mit dem Mieter.» Dann ein langer Absatz zu Art. 257d OR, Betreibung, Kündigung, 30 Tagen Frist, «Lassen Sie sich beraten». Der erste Absatz ist klar und freundlich. Beim zweiten habe ich zweimal lesen müssen.
5. **«Verstanden» und noch einmal «Abbrechen».** Erwartet: «Verstanden» schliesst den Dialog. Gesehen: beide schliessen ihn, nichts ändert sich. Bei «Abbrechen» war ich unsicher, ob ich damit etwas rückgängig mache.
6. **Hilfe, «Zahlungen und Mahnungen».** Erwartet: was nach der letzten Mahnung kommt. Gesehen: Ablauf (bezahlt markieren, Mahnung senden, Briefe unter «Dokumente» als versendet markieren und dann drucken) und derselbe Absatz wie im Dialog. Unter «Begriffe kurz erklärt»: «Mahnung … zuerst eine Zahlungserinnerung, danach höchstens eine 2. und eine 3. Mahnung.» Damit verstehe ich, warum Schluss ist. Erklärungen zu «Betreibung» oder «Art. 257d OR» gibt es dort nicht.

## Verwirrung

- «Sie ist keine Zahlungsfrist mit Kündigungsandrohung nach Art. 257d OR»: Ich verstehe den Satz erst beim zweiten Lesen. Bisher hiess es überall, die Mahnung habe eine «Zahlungsfrist der Mahnung». Jetzt soll sie keine Zahlungsfrist sein? Gemeint ist wohl: keine Frist, nach der man kündigen darf.
- «Betreibung»: Ich weiss ungefähr, was das ist, aber nicht, wie man das macht oder wo.
- «Lassen Sie sich beraten»: Von wem? Das macht mir Angst, weil es nach Anwalt und Kosten klingt.
- «Abbrechen» neben «Verstanden» (P-1).
- Der Satz «Für diese Kündigung setzen Sie dem Mieter zuerst …» liest sich fast wie eine Anleitung zum Kündigen. Ich will Frau Meier nicht kündigen, ich will meine 121 Franken.

## Fehlerrisiken

- Ich könnte meinen, ich müsse jetzt kündigen, weil das der einzige konkrete Schritt im Text ist.
- Ich könnte einen eigenen Brief mit weniger als 30 Tagen Frist schreiben, wenn ich den Absatz überfliege; die 30 Tage stehen mitten im Text.
- Weil «Mahnung senden» weiter angeboten wird, könnte ich glauben, Dwello habe beim ersten Mal einen Fehler gemacht, und es noch einmal versuchen.

## Vorschläge

- **P-1:** Abrechnung Sarah Meier öffnen → «Mahnung senden» → Dialog hat «Abbrechen» und «Verstanden». Hilfreich: nur ein Knopf «Schliessen» oder «Verstanden», weil es nichts abzubrechen gibt.
- **P-2:** Gleicher Weg, zweiter Absatz; ebenso Hilfe → «Zahlungen und Mahnungen». Hilfreich: kürzere Sätze und eine Reihenfolge, was ich tun kann: 1. Mieter anrufen oder schreiben, 2. Ratenzahlung vereinbaren, 3. erst dann Betreibung oder Kündigung, mit Beratung durch z. B. Hauseigentümerverband oder Anwalt. «Betreibung» und «Kündigung wegen Zahlungsrückstand» unter «Begriffe kurz erklärt» aufnehmen. Den Satz «keine Zahlungsfrist mit Kündigungsandrohung» umformulieren, etwa: «Nach einer Mahnung von Dwello dürfen Sie nicht kündigen.»
- **P-3:** Abrechnung Sarah Meier öffnen. Hilfreich: im Abschnitt «Mahnungen» oder bei «Zahlung» ein sichtbarer Satz wie «Alle 3 Mahnungen sind versendet. Dwello erstellt keine weitere.», und der Knopf «Mahnung senden» weglassen oder mit diesem Hinweis versehen.

## Nicht geprüft

- Eine Mahnung tatsächlich auslösen oder «Als bezahlt markieren»: Ich sollte nichts speichern.
- PDFs der Mahnungen: nicht geöffnet, nicht Teil der Aufgabe.
- Mobile Ansicht und Tastaturbedienung: nicht Helgas Gerät.
