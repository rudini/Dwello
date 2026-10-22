# Anna, Slice 547: Entwurf zustellen, nachdem eine Rechnung dazugekommen ist

Persona: Anna, 29, Erstvermieterin, kommt nach Monaten zurück und weiss nichts mehr. Desktop 1440 × 900, einzelne Schritte auf Mobile 390 × 844, Maus/Touch.
App: http://localhost:3300 (Persona-Stack, Demodaten). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/5592d2fc-ce4f-5c3d-a5ec-2e772bc3c241/scratchpad/anna-547/`.

Gespeichert habe ich nur: eine Rechnung «Gartenbau Grün GmbH, Gartenpflege 2025», Seepark Residenz, Rechnungsdatum 15.12.2025, CHF 420.00, Kategorie Gartenpflege, Pro Fläche (m²); und ich habe den Entwurf NK-22222222-2025-0001 (Thomas Weber, Wohnung A1) neu berechnet. Nichts versendet, nichts als versendet markiert.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Abrechnungsliste (`/statements?status=draft`, auch der gefilterte Link «Seepark Residenz, 2025» aus der Übersicht) | Die Zeilen zeigen nicht, welcher Entwurf nicht aktuell ist. Ich komme von «4 Entwürfe sind nicht aktuell» und sehe vier Zeilen, die genau gleich aussehen wie die aktuellen. |
| P-2 | Minor | Abrechnung (Entwurf), Hinweis oben | Der Hinweis sagt «Wählen Sie «Neu berechnen»», aber der Knopf steht nicht beim Hinweis, sondern ganz unten unter «Weitere Aktionen». Oben steht nur der grosse Knopf «Per E-Mail senden». |
| P-3 | Minor | Dialog «Abrechnung per E-Mail senden» / «Abrechnung als versendet markieren» bei nicht aktuellem Entwurf | Die Warnung ist gut sichtbar, aber «Per E-Mail senden» bzw. «Als versendet markieren» bleibt der dunkle Hauptknopf und ist drückbar. Wer schnell klickt, stellt den alten Betrag zu. |
| P-4 | Nit | Abrechnung (Entwurf) vs. Versanddialog | Derselbe Zustand heisst zweimal anders: «Rechnungen seit der Abrechnung geändert» auf der Seite, «Dieser Entwurf ist nicht aktuell» im Dialog. Ich war kurz unsicher, ob das zwei Probleme sind. |
| P-5 | Nit | Abrechnung (Entwurf), Hinweis und Erfolgsmeldung | «Tankbestand» wird genannt, obwohl Seepark Residenz Fernwärme hat und ich nie einen Tank erfasst habe. Ich weiss nicht, ob ich da noch etwas tun muss. |

## Beobachtungen

- Schon direkt nach dem Speichern der Rechnung sagt die Rechnungsseite «Abrechnungen nicht aktuell» mit Link zu den Abrechnungen der Periode und erklärt «Neu berechnen» vs. «Abrechnung berichtigen». Sehr hilfreich; der Text ist allerdings lang (Verjährung nach Art. 128 OR im selben Absatz), das habe ich als Anna nur überflogen.
- Übersicht: Die Karte «4 Entwürfe sind nicht aktuell» mit Link «Seepark Residenz, 2025» erscheint sofort und steht vor «Abrechnungen prüfen und versenden». Genau die Reihenfolge, die ich brauche.
- Übersicht: «Abrechnungen prüfen und versenden» sagt «3 Nebenkostenabrechnungen sind noch im Entwurf» (nach dem Neuberechnen «4»), die Kachel und die Liste sagen «7 Entwurf». Offenbar zählt die Karte nur die aktuellen Entwürfe, das steht aber nicht da. Beide Karten haben einen Link «Entwürfe ansehen» mit demselben Ziel.
- Nach dem Neuberechnen wurde aus «Rückerstattung CHF 34.60» eine «Nachzahlung CHF 57.35». Die Erfolgsmeldung sagt nur «Der Entwurf ist neu berechnet …», nicht, dass sich der Saldo umgedreht hat. Ich hätte es fast nicht gemerkt; gerade der Wechsel von Rückerstattung zu Nachzahlung ist für den Mieter wichtig.
- Der Bestätigungsdialog «Entwurf neu berechnen» erklärt gut, was bleibt (Nummer, Frist, Bemerkung) und was sich ändert (Beträge, Saldo, PDF wird verworfen).
- Nach dem Neuberechnen aus dem Versanddialog ist der Versanddialog zu; ich muss «Per E-Mail senden» nochmals öffnen. Danach ist die Warnung weg. Der Knopf oben heisst jetzt «PDF erstellen» statt «PDF herunterladen» (passt zum «PDF wird verworfen»).
- Der Verlauf zeigt nur «Erstellt 22.10.2026, 09:50»; dass der Entwurf neu berechnet wurde, steht nirgends, und «PDF erstellt» ist verschwunden.
- Mobile 390 px: Hinweis, Versanddialog und Bestätigungsdialog passen ohne seitliches Scrollen (scrollWidth 390).
- Beim Erfassen der Rechnung blieb «Verteilschlüssel» nach der Wahl «Gartenpflege» leer (es gab in diesem Gebäude noch keine Gartenpflege-Rechnung); ich habe «Pro Fläche (m²)» selbst gewählt, ohne zu wissen, ob das richtig ist.

## Aufgabe geschafft: ja

Ich habe gemerkt, dass der Entwurf nicht mehr stimmt (Übersicht, Abrechnungsseite, Versanddialog) und wusste, was zu tun ist (Neu berechnen). Zugestellt habe ich ihn nicht, wie verlangt.

## Aufwand

Etwa 10 Minuten, rund 14 Schritte (Übersicht, Entwurfsliste, Entwurf ansehen, Rechnung erfassen und speichern, Übersicht erneut, gefilterte Liste, Entwurf, Versanddialog, Briefweg, Mobile, Neu berechnen, Bestätigen, Versanddialog erneut, Übersicht).

## Ablauf

1. Übersicht. Erwartet: irgendein Hinweis, was offen ist. Gesehen: «7 Nebenkostenabrechnungen sind noch im Entwurf … Entwürfe ansehen».
2. Entwurfsliste. Gesehen: 7 Entwürfe. Ich nehme Thomas Weber, Seepark Residenz, 2025, «Rückerstattung CHF 34.60».
3. Entwurf angesehen (Vorher-Zustand): Positionen TV, Heizung, Kaltwasser, Hauswart, Allgemeinstrom; Saldo Rückerstattung CHF 34.60; kein Hinweis.
4. Neue Rechnung (`/invoices/new`). Erwartet: Formular verständlich. Gesehen: viel Hilfetext beim Leistungszeitraum (Boiler-Beispiel), den ich übersprungen habe. Kategorie Gartenpflege, Verteilschlüssel selbst gewählt, gespeichert.
5. Rechnungsseite nach dem Speichern. Erwartet: «Gespeichert». Gesehen zusätzlich: «Abrechnungen nicht aktuell» mit Link und Erklärung. Positiv überrascht.
6. Übersicht. Gesehen: neue Karte «4 Entwürfe sind nicht aktuell … Berechnen Sie diese Entwürfe neu, bevor Sie sie zustellen», Link «Seepark Residenz, 2025».
7. Gefilterte Liste über diesen Link. Erwartet: die vier betroffenen Entwürfe markiert. Gesehen: vier Zeilen ohne jede Markierung (P-1).
8. Entwurf Thomas Weber. Gesehen: gelber Hinweis «Rechnungen seit der Abrechnung geändert … Wählen Sie «Neu berechnen»» direkt unter dem Status. Erwartet: Knopf beim Hinweis. Gesehen: Knopf erst ganz unten (P-2).
9. «Per E-Mail senden» (nur Dialog geöffnet). Gesehen: oben im Dialog «Dieser Entwurf ist nicht aktuell» mit eigenem Knopf «Neu berechnen». Unten trotzdem aktiver Hauptknopf «Per E-Mail senden» (P-3). Abgebrochen.
10. «Stattdessen per Brief zustellen» (nur Dialog). Gesehen: «Abrechnung als versendet markieren», dieselbe Warnung, Knopf «Als versendet markieren» aktiv. Abgebrochen.
11. Mobile: Entwurf und Versanddialog, «Neu berechnen» im Dialog. Gesehen: Bestätigung «Entwurf neu berechnen» mit klarer Erklärung. Bestätigt.
12. Ergebnis: Meldung «Der Entwurf ist neu berechnet …»; Hinweis weg; neue Position Gartenpflege CHF 89.25; Saldo jetzt «Nachzahlung CHF 57.35». Kein Hinweis auf den Wechsel (Beobachtung).
13. Versanddialog erneut geöffnet: keine Warnung mehr. Abgebrochen, nicht gesendet.
14. Übersicht: jetzt «3 Entwürfe sind nicht aktuell», die anderen drei Seepark-Entwürfe bleiben zu tun.

## Verwirrung

- «Tankbestand» (P-5): Was ist das und betrifft es mich?
- «Rechnungen seit der Abrechnung geändert» vs. «Dieser Entwurf ist nicht aktuell» (P-4).
- «3/4 Nebenkostenabrechnungen sind noch im Entwurf» neben «7 Entwurf».
- «Neu berechnen» vs. «Abrechnung berichtigen» auf der Rechnungsseite: verstanden erst beim zweiten Lesen (Entwurf vs. versendet).
- Welchen Verteilschlüssel nehme ich für eine neue Kategorie? Kein Vorschlag.

## Fehlerrisiken

- Im Versanddialog kann ich trotz Warnung den alten Entwurf senden oder als versendet markieren (P-3). Der Mieter bekäme eine Rückerstattung von CHF 34.60 statt einer Nachzahlung von CHF 57.35.
- In der Liste sehe ich nicht, welche Entwürfe veraltet sind (P-1); wer über die Liste und das PDF-Symbol geht, öffnet die Abrechnungsseite vielleicht gar nicht.
- Der umgedrehte Saldo nach dem Neuberechnen fällt leicht nicht auf.
- Die anderen drei Entwürfe derselben Periode muss ich einzeln neu berechnen; ein vergessener geht mit altem Betrag raus, falls ich die Warnung im Dialog wegklicke.

## Vorschläge

- **P-1:** Übersicht, Karte «… Entwürfe sind nicht aktuell», Link «Seepark Residenz, 2025» öffnen: vier gleich aussehende Zeilen. Hilfreich: in der Zeile ein Status-Text neben «Entwurf», z. B. «Nicht aktuell», nicht nur farbig.
- **P-2:** Entwurf mit nachträglich erfasster Rechnung öffnen, Hinweis oben lesen, Knopf suchen. Hilfreich: «Neu berechnen» direkt im Hinweis, wie im Versanddialog.
- **P-3:** Entwurf mit nachträglich erfasster Rechnung, «Per E-Mail senden» bzw. «Stattdessen per Brief zustellen». Hilfreich: Hauptknopf sperren, bis neu berechnet ist, oder ihn zum zweitrangigen Knopf machen und «Neu berechnen» zum Hauptknopf; mindestens ein zusätzliches «Trotzdem senden».
- **P-4:** Beide Titel vergleichen. Hilfreich: ein Titel für beides, z. B. «Dieser Entwurf ist nicht aktuell».
- **P-5:** Hinweis auf einem Entwurf eines Gebäudes ohne Öltank lesen. Hilfreich: «Tankbestand» nur nennen, wenn das Gebäude einen Tank hat, oder kurz erklären.

## Nicht geprüft

- Was tatsächlich passiert, wenn man im Dialog trotz Warnung «Per E-Mail senden» oder «Als versendet markieren» drückt: Senden und Markieren waren mir verboten.
- Das PDF des veralteten Entwurfs (Download über die Liste): nicht geöffnet, ob es einen Hinweis trägt, weiss ich nicht.
- Die drei anderen nicht aktuellen Seepark-Entwürfe habe ich nicht neu berechnet (andere Personas könnten sie nutzen).
- Versendete Abrechnungen und «Abrechnung berichtigen»: nicht Teil der Aufgabe.
