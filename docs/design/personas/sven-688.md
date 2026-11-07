# Sven – #688: Prüfung der vereinbarten Nebenkosten im Assistenten «Abrechnungen erstellen»

Persona: Sven, 45, blind, Screenreader und Tastatur, Desktop 1440 × 900. Beurteilt über den Accessibility-Baum (Playwright `ariaSnapshot`) und die Live-Regionen (role=alert/status), die sich ändern. Gespeichert habe ich nichts (kein Gebäude zugeteilt); der Assistent speichert bis Schritt 4 nichts.

Fehler erzeugt: `page.route('**/api/statements/agreements**')` antwortet 500, bei Wiederholungen mit 2,5 s Verzögerung, damit der Wartezustand hörbar ist. Durchläufe: 1 Fehler + 1 Wiederholung ok, 2 Fehler + Erfolg (mit und ohne vorher «Weiter» gedrückt), 3 Fehler + Erfolg.

| ID | Schwere | Bildschirm | Befund |
| --- | --- | --- | --- |
| S-1 | Minor | Schritt 3, Meldung «Vereinbarte Nebenkosten nicht geprüft» | Beim Drücken von «Erneut versuchen» ändert sich der Inhalt der Meldung (role=alert): der Button heisst jetzt «Bitte warten …» und darin steht zusätzlich ein Status «Bitte warten …». Eine Alert-Region wird bei einer Änderung als Ganzes neu vorgelesen, ich höre also genau in dem Moment, in dem die Wiederholung startet, nochmals «Vereinbarte Nebenkosten nicht geprüft. Dwello konnte nicht prüfen … Wählen Sie «Erneut versuchen». Bitte warten … Bitte warten …». Das klingt, als wäre es sofort wieder schiefgegangen. |
| S-2 | Minor | Schritt 3, nach einer fehlgeschlagenen Wiederholung, wenn vorher «Weiter» gedrückt wurde | Zwei Alerts gleichzeitig mit widersprüchlichem Rat: oben «Dwello hat es erneut versucht … Versuchen Sie es in einigen Minuten noch einmal.», darunter «Dwello konnte die Mietverträge nicht prüfen. Wählen Sie «Erneut versuchen». Gelingt die Prüfung, geht es weiter.» Beide werden nach dem Fehlschlag neu angesagt. Soll ich warten oder gleich nochmals drücken? |
| S-3 | Minor | Schritt 3, nach erfolgreicher Wiederholung (ohne vorher «Weiter») | Der Fokus landet auf «Die Mietverträge sind geprüft.» Diese Zeile steht aber hinter dem Button «Weiter», ganz am Ende des Inhalts. Mit Tab komme ich zu «Datenschutz» im Seitenfuss, nicht zu «Weiter»; ich muss wissen, dass ich mit Umschalt+Tab zurück muss. |

## Beobachtungen

- Den Assistenten erreiche ich von der Übersicht mit 20 Tabs zu «Abrechnungen erstellen». Nach dem Seitenwechsel liegt der Fokus auf dem Body, nicht auf der Überschrift; erst ab Schritt 2 setzt Dwello den Fokus auf die Schrittüberschrift. Gut so in den Schritten.
- Beim Wechsel in Schritt 3 liegt der Fokus auf «Schritt 3 von 5: Heizprofil und Verwaltungspauschale». Gleichzeitig kommen die Statusmeldungen «Bitte warten …» und «Dwello prüft, ob die Mietverträge die Nebenkosten dieser Periode vereinbaren …», danach wird die Fehlermeldung als Alert eingefügt und damit angesagt. Das ist gut: ich höre den Fehler, ohne suchen zu müssen.
- Die Fehlermeldung steht im Baum ganz am Ende, nach «Weiter» und nach dem Hinweis «Ohne vereinbarte Verwaltungspauschale». In der Tab-Reihenfolge: Heizprofil, Verwaltungspauschale, Zurück, Weiter, «Kevin Fischer, Wohnung OG1», «Erneut versuchen». Über dem Button «Zurück» steht «Lesen Sie die Hinweise unten, bevor Sie weitergehen.» – das hilft, die Meldung unten zu suchen.
- «Weiter» bei fehlgeschlagener Prüfung: der Fokus bleibt auf «Weiter», ein zweiter Alert sagt «Dwello konnte die Mietverträge nicht prüfen. Wählen Sie «Erneut versuchen». Gelingt die Prüfung, geht es weiter.» Während der Wiederholung kommt dann «Dwello geht weiter, sobald die Mietverträge geprüft sind.» und nach Erfolg springt Dwello selbst zu Schritt 4, Fokus auf «Schritt 4 von 5: Vorschau». Das funktioniert, ich höre aber kurz davor noch «Die Mietverträge sind geprüft.» und «Vorschau wird berechnet …».
- Während der Wiederholung: Fokus bleibt auf dem Button, der jetzt «Bitte warten …» heisst, `aria-busy=true`, `aria-disabled=true` (Screenreader: «Bitte warten …, nicht verfügbar»). Dass es der Wiederholen-Button ist, höre ich am Namen nicht mehr; aus dem Zusammenhang ist es aber klar. Der Fokus geht nicht verloren – wie versprochen.
- Nach einer fehlgeschlagenen Wiederholung: Fokus auf «Erneut versuchen», neuer Text «Dwello hat es erneut versucht und konnte die Mietverträge wieder nicht prüfen. Ohne diese Prüfung geht es nicht weiter. Versuchen Sie es in einigen Minuten noch einmal.» – klar. Nach einem zweiten Fehlschlag kommt wortgleich derselbe Text; ob der zweite Versuch überhaupt gelaufen ist, höre ich nur am «Bitte warten …» dazwischen.
- Nach Erfolg ohne vorheriges «Weiter»: Alert verschwindet, Status «Die Mietverträge sind geprüft.» erhält den Fokus. Da es zugleich eine Live-Region ist, kann es sein, dass ich den Satz zweimal höre (Fokus und Live-Ansage).
- Während jeder Prüfung gibt es mehrere Statusregionen mit «Bitte warten …» (in der Meldung und bei den Navigationsbuttons) plus «Dwello prüft …»: viel Ansage für einen kurzen Moment.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten über 6 Durchläufe; pro Durchlauf rund 30 Tasten (20 Tabs bis zum Assistenten, je 1–4 Tabs pro Schritt, 1–3 Mal «Erneut versuchen», Umschalt+Tab zurück zu «Weiter»).

## Ablauf

- Erneut versuchen gedrückt. Erwartet: kurze Ansage «Bitte warten», die Fehlermeldung bleibt still stehen. Gesehen: Alert-Inhalt ändert sich (Button-Name und Status darin), die ganze Fehlermeldung wird neu angesagt, dazu zweimal «Bitte warten …» (S-1).
- «Weiter» vor der Wiederholung gedrückt, dann Wiederholung fehlgeschlagen. Erwartet: ein klarer Rat. Gesehen: zwei Alerts, einer sagt «in einigen Minuten», der andere «Wählen Sie «Erneut versuchen»» (S-2).
- Wiederholung erfolgreich, dann Tab. Erwartet: «Weiter». Gesehen: «Datenschutz» im Seitenfuss; «Weiter» liegt vor der fokussierten Statuszeile (S-3).
- Assistent geöffnet. Erwartet: Fokus auf der Überschrift «Abrechnungen erstellen». Gesehen: Fokus auf dem Body (keine Änderung von #688).

## Vorschläge

- S-1: Übersicht → «Abrechnungen erstellen» → Weiter → Alpenblick → Weiter, `agreements` mit 500 beantworten, Tab zu «Erneut versuchen», Enter. Hilfreich: den Wartezustand ausserhalb des Alerts ansagen (eigene Statuszeile neben der Meldung) oder den Alert-Inhalt beim Start der Wiederholung nicht verändern; der Button-Text «Bitte warten …» und der zusätzliche Status sagen dasselbe doppelt.
- S-2: wie S-1, aber zuerst «Weiter» drücken, dann «Erneut versuchen» mit erneutem 500. Hilfreich: nach einem fehlgeschlagenen Wiederholen den Hinweis bei «Weiter» an den neuen Text angleichen oder ausblenden, sodass nur ein Rat bleibt.
- S-3: wie S-1, Wiederholung gelingt, dann Tab. Hilfreich: die Statuszeile vor «Weiter» setzen (z. B. an die Stelle der Fehlermeldung über den Navigationsbuttons), sodass der nächste Tab auf «Weiter» führt.

## Nicht geprüft

- Echte Sprachausgabe von NVDA/VoiceOver: geprüft habe ich nur den Accessibility-Baum und welche Live-Regionen sich ändern; dass ein geänderter Alert ganz neu gelesen wird (S-1), ist das übliche Verhalten von role=alert, nicht gehört.
- Schritt 5 «Erstellen» und das Speichern: kein Gebäude zugeteilt, daher nicht gespeichert.
- Andere Sprachen als Deutsch.

Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/ced2483f-edfc-5afc-974d-77650a29fe78/scratchpad/sven-688/` (s7.mjs Hauptskript; g-w-2.png zeigt die beiden widersprüchlichen Meldungen untereinander, den Rahmen um «Erneut versuchen» als sichtbaren Fokus).
