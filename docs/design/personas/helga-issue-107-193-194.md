# Helga – Mahnung ohne E-Mail-Adresse (Issues #107, #193, #194)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (Stichprobe 200 %), Maus. Persona-App auf http://localhost:3300, gespeichert nur bei Hans Müller (Musterhaus Zentrum). Datum der Prüfung: 16.10.2026.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/9ad3b86b-0a1b-52ea-a360-fdf69c9d221f/scratchpad/helga-107/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Abrechnung, Dialog «Mahnung senden» | Der Dialog sagt «… schickt sie per E-Mail an .» – die Adresse fehlt, der Satz endet mit Leerzeichen und Punkt. Kein Hinweis, dass Hans Müller keine E-Mail-Adresse hat; ich glaube, die Mahnung geht per E-Mail weg. |
| P-2 | Minor | Abrechnung, Hinweis «E-Mail nicht zugestellt» | Der Hinweis sagt, wo der Brief liegt, aber nicht, was ich jetzt tun soll (Brief als versendet markieren, dann drucken und zur Post) und hat keinen Link zu «Dokumente». Die Reihenfolge steht nur im Einleitungstext von «Dokumente». |
| P-3 | Minor | Übersicht, «Fristen» | Nach der Mahnung zeigt die Übersicht weiter «30.09.2026 Zahlungsfrist · Hans Müller, seit 16 Tagen abgelaufen». Die neue Frist der Mahnung (26.10.2026) steht dort nicht. Widerspricht der Abrechnung. |
| P-4 | Minor | Dokumente, «Als versendet markieren» | Kein Bestätigungsschritt und keine Rückmeldung. In der Ansicht «Zu versenden» verschwindet der Brief sofort («Keine Briefe zu versenden»); den PDF-Link zum Drucken, den ich laut Text *danach* brauche, finde ich nur unter «Alle». |
| P-5 | Nit | Abrechnung, Dialog, Dokumente | «Mahnung» und «Zahlungserinnerung» werden gemischt: Knopf «Mahnung senden», Bestätigungsknopf «Zahlungserinnerung senden», Abschnitt «Mahnungen», Dokument «Zahlungserinnerung». Ist das dasselbe? |
| P-6 | Nit | Abrechnung «Mahnungen», Dokumente | Vor dem Markieren steht beim Brief «erstellt am 16.10.2026, per E-Mail» direkt neben «Zu versenden – Der Mieter hat keine E-Mail-Adresse». Er geht aber per Brief. |

## Beobachtungen

- Auf Hans Müllers Seite steht «E-Mail: Keine E-Mail-Adresse erfasst» und gleich darunter «Korrespondenzkanal: Per E-Mail», ohne Warnung oder Hinweis, dass das nicht zusammenpasst.
- Der Abschnitt «Verlauf» der Abrechnung führt die Mahnung nicht auf (nur Erstellt, PDF erstellt, Versendet 28.09.2026).
- Bei Hans Müller unter «Dokumente» steht «16.10.2026 · per Brief · Versendet», aber nicht die Zahlungsfrist der Mahnung.
- Der Status der Abrechnung bleibt «Überfällig». Die Liste der überfälligen Abrechnungen zeigt aber gut verständlich «Gemahnt am 16.10.2026 / Nächste Mahnung möglich ab 27.10.2026».
- Abrechnungsdatum 28.09.2026 und Zahlungsfrist 30.09.2026: Hans hatte nur zwei Tage Zeit. Das liegt wohl an den vorbereiteten Daten.
- Bei 200 % Zoom: Dokumente und Abrechnung ohne seitliches Scrollen, alles lesbar.

## Aufgabe geschafft: ja

## Aufwand

Etwa 10 Minuten, rund 9 Schritte: Übersicht → Überfällige ansehen → Abrechnung → Mahnung senden → Bestätigen → Dokumente → Als versendet markieren → «Alle» → PDF herunterladen. Danach Prüfung von Abrechnung, Mieterseite und Übersicht.

## Ablauf

1. **Übersicht.** Erwartet: ein Hinweis auf die unbezahlte Abrechnung. Gesehen: «Überfällige Abrechnungen prüfen … sonst können Sie eine Mahnung senden», Knopf «Überfällige ansehen», unter Fristen «30.09.2026 Zahlungsfrist · Hans Müller, seit 16 Tagen abgelaufen». Gut verständlich.
2. **Liste Überfällig.** Eine Abrechnung (Hans Müller, CHF 215.80, «Überfällig»). Ich habe sie geöffnet.
3. **Abrechnung.** Erwartet: ein Knopf zum Mahnen. Gesehen: oben «Mahnung senden» neben «Als bezahlt markieren». Gut.
4. **Dialog «Mahnung senden».** Erwartet: an wen und wie die Mahnung geht. Gesehen: «Dwello erstellt die Zahlungserinnerung als PDF und schickt sie per E-Mail an .» und «Hans Müller schuldet noch CHF 215.80.», Knöpfe «Abbrechen» und «Zahlungserinnerung senden» (Screenshot 04). Die Adresse fehlt. Ich habe trotzdem gesendet, weil nichts gewarnt hat (P-1).
5. **Nach dem Senden.** Gesehen: ein gelber Hinweis «E-Mail nicht zugestellt – Das Dokument «Zahlungserinnerung» liegt unter «Dokumente» zum Versand bereit. Der Mieter hat keine E-Mail-Adresse.» Neu im Kasten «Zahlung»: «Letzte Mahnung 16.10.2026», «Nächste Mahnung möglich ab 27.10.2026». Neuer Abschnitt «Mahnungen» mit Frist 26.10.2026, «Zu versenden» und PDF-Knopf (Screenshot 05). Ich weiss jetzt, dass es nicht geklappt hat, aber nicht, was ich tun soll. Einen Link zu «Dokumente» gibt es nicht, ich musste über das Menü gehen (P-2).
6. **Dokumente.** Der Einleitungstext erklärt die Reihenfolge: zuerst am Posttag «Als versendet markieren», Dwello setzt dann das heutige Datum und eine neue Frist, danach drucken und am selben Tag schicken. Das ist klar, aber ein langer Absatz. Der Brief «Zahlungserinnerung · NK-11111111-2025-0001» steht mit «Zu versenden» und «Als versendet markieren» da.
7. **Brief vorher angeschaut.** Im PDF steht «Zürich, 16.10.2026», offener Betrag CHF 215.80, «bis 26.10.2026», IBAN und Referenz. Das Datum ist heute, also richtig.
8. **Als versendet markieren.** Erwartet: eine Rückfrage oder Bestätigung. Gesehen: nichts, der Brief verschwand aus «Zu versenden», es stand nur noch «Keine Briefe zu versenden» da (P-4). Unter «Alle» steht nun «per Brief · Versendet» mit PDF-Link.
9. **Brief zum Drucken heruntergeladen.** Datum 16.10.2026, Frist 26.10.2026. Das ist korrekt für heute.
10. **Kontrolle Abrechnung.** «Mahnungen: erstellt am 16.10.2026, per Brief, Zahlungsfrist der Mahnung: 26.10.2026, Versendet». «Letzte Mahnung 16.10.2026», «Nächste Mahnung möglich ab 27.10.2026». Der Knopf «Mahnung senden» ist weg. Der gelbe Hinweis ist weg.
11. **Kontrolle Hans Müller.** Unter «Dokumente» steht «Zahlungserinnerung · 16.10.2026 · per Brief · Versendet». Die Frist steht dort nicht.
12. **Nachbar: nächste Mahnung?** Auf der Abrechnung und in der Liste steht «Nächste Mahnung möglich ab 27.10.2026», und es gibt keinen Mahnknopf. Antwort an den Nachbarn: erst ab dem 27.10.2026, also nach Ablauf der neuen Frist (26.10.2026).
13. **Übersicht danach.** Die Aufgabe «Überfällige Abrechnungen prüfen» ist verschwunden. Das ist richtig, ich muss jetzt nichts tun. Unter «Fristen» steht aber noch die alte Frist 30.09.2026 «seit 16 Tagen abgelaufen» (P-3).

## Verwirrung

- «per E-Mail an .»: an wen denn?
- «Mahnung» oder «Zahlungserinnerung»: Ist das dasselbe, oder kommt die Mahnung erst später?
- Zwei Fristen auf der Abrechnung: «Zahlungsfrist 30.09.2026» und «Zahlungsfrist der Mahnung 26.10.2026». Welche gilt jetzt? Ich nehme an, die der Mahnung, aber es steht nirgends.
- «Korrespondenzkanal»: Das Wort kenne ich nicht. Gemeint ist wohl, wie der Mieter Briefe bekommen möchte.
- «Als versendet markieren» *bevor* ich den Brief gedruckt habe, kommt mir verkehrt vor. Der Text erklärt den Grund (heutiges Datum), aber ich hätte es ohne den Absatz falsch gemacht.

## Fehlerrisiken

- Wegen P-1 glaube ich, die Mahnung sei per E-Mail weg, und übersehe den gelben Hinweis.
- Wenn ich den Brief zuerst drucke und erst Tage später «Als versendet markieren» drücke, stimmen Datum und Frist auf dem gedruckten Blatt nicht mit Dwello überein. Nur der Einleitungstext von «Dokumente» schützt davor.
- Weil es keine Rückfrage gibt, kann ich «Als versendet markieren» aus Versehen anklicken, obwohl ich den Brief gar nicht schicke.
- Die Übersicht zeigt eine abgelaufene Frist. Vielleicht mahne ich dann zu früh noch einmal oder rufe den Mieter an, obwohl seine neue Frist noch läuft.

## Vorschläge

- **P-1:** Hans Müller (keine E-Mail-Adresse, Kanal E-Mail) → überfällige Abrechnung → «Mahnung senden». Was helfen würde: Ist keine Adresse da, gleich im Dialog sagen «Hans Müller hat keine E-Mail-Adresse. Dwello legt die Zahlungserinnerung unter «Dokumente» bereit, Sie schicken sie per Post.» Den Knopf entsprechend benennen. Nie einen leeren Platzhalter zeigen.
- **P-2:** Mahnung wie bei P-1 senden → gelber Hinweis. Was helfen würde: Die nächsten Schritte im Hinweis selbst, kurz und nummeriert («1. Am Posttag als versendet markieren. 2. Drucken. 3. Zur Post bringen.»), dazu ein Link «Zu den Dokumenten». Optional: «E-Mail-Adresse bei Hans Müller erfassen».
- **P-3:** Mahnung senden und als versendet markieren → Übersicht → «Fristen». Was helfen würde: die Frist der Mahnung anzeigen («26.10.2026 Frist der Zahlungserinnerung · Hans Müller») statt der alten, abgelaufenen.
- **P-4:** Dokumente → «Zu versenden» → «Als versendet markieren». Was helfen würde: eine kurze Rückfrage («Bringen Sie den Brief heute zur Post? Dwello setzt das Datum 16.10.2026 und die Frist 26.10.2026.») und danach eine Bestätigung mit dem Knopf «PDF herunterladen» zum Drucken, auch in der Ansicht «Zu versenden».
- **P-5:** Ein Wort durchgehend verwenden, oder einmal erklären: «Die erste Mahnung heisst Zahlungserinnerung.»
- **P-6:** Solange der Brief «Zu versenden» ist und keine Adresse besteht, «per Brief» oder «E-Mail nicht möglich» zeigen statt «per E-Mail».

## Nicht geprüft

- Ob «Als versendet markieren» an einem späteren Tag wirklich das Datum und die Frist im Brief neu setzt: Erstellen und Markieren fielen auf denselben Tag (16.10.2026), eine andere Uhrzeit des Servers kann ich nicht einstellen.
- Den Versand einer zweiten Mahnung ab dem 27.10.2026: Dieses Datum liegt in der Zukunft.
- Den Weg «E-Mail-Adresse erfassen und dann erneut per E-Mail senden»: nicht verlangt, und ich wollte Hans Müllers Stammdaten nicht ändern.
- Andere Sprachen und das Handy: nicht Teil von Helgas Profil.
