# Marco – Rechnung aus der Vorschau öffnen und unverändert speichern (Alpenblick 2025)

Persona: Marco, 38, Smartphone 390 × 844, Touch. App: Persona-Stack http://localhost:3300 (Demodaten).

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Rechnung bearbeiten (aus der Vorschau geöffnet, `/invoices/<id>/edit?returnTo=…`) | «Änderungen speichern» ist grau und lässt sich nicht antippen, solange ich nichts ändere. Kein Text sagt, warum. Unverändert speichern geht nicht, also komme ich auch nicht auf dem Weg «Speichern» zurück in den Assistenten. |

## Beobachtungen

- Die Vorschau zeigt den Hinweis «Rechnungen kurz nach der Abrechnungsperiode» gut verständlich: «Kaminfeger Huber: Kaminfeger Dezember 2025. Rechnungsdatum 10.01.2026, CHF 290.00» ist ein Link, und der Text sagt mir, dass ich den Leistungszeitraum erfassen soll, wenn sie zu 2025 gehört. Das habe ich auf Anhieb verstanden.
- Diese Kaminfeger-Rechnung hat im Formular die Kategorie «Schneeräumung» (Verteilschlüssel «Pro Fläche (m²)»). Für eine Rechnung «Kaminfeger Dezember 2025» wirkt das falsch; gleichzeitig meldet die Vorschau bei Kaminfeger «Keine Rechnung in dieser Kategorie erfasst». Ich habe nichts geändert (Auftrag), aber als Marco hätte ich gestutzt. Vermutlich so in den Demodaten.
- «Abbrechen» im Formular bringt mich zurück in den Assistenten, aber auf **Schritt 3** (Heizprofil und Verwaltungspauschale), nicht auf die Vorschau, mit dem Hinweis «Angaben wiederhergestellt … Mit «Weiter» berechnet Dwello die Vorschau neu, mit den Rechnungen, wie sie jetzt sind.» Das ist erklärt; ich brauche einen Tipp mehr. Ein Hinweis, dass eine Rechnung erfasst wurde, kommt dabei nicht (richtig, ich habe ja keine erfasst).
- Im Formular sitzt «Änderungen speichern» unten über «Abbrechen». Im grauen Zustand ist der Unterschied zwischen «grau = nicht möglich» und «blassblau = normale Farbe» auf dem Handy bei Sonne schwer zu sehen.
- Die Hilfetexte im Formular sind lang (Rechnungsdatum, Leistungszeitraum, Verteilschlüssel); auf dem Handy ist die Seite fast drei Bildschirmhöhen lang (Bildschirmfoto: 2986 px hoch).
- Tippe ich auf Schritt 1 «Weiter», bevor die Seite fertig geladen ist, springt der Assistent direkt auf «Schritt 4 von 5: Vorschau» mit «Anzahl Abrechnungen 0» und «In dieser Abrechnungsperiode gibt es keine Mietverträge ohne Abrechnung in den gewählten Gebäuden.» – ohne dass ich ein Gebäude gewählt hätte. Wartet man kurz, kommt korrekt Schritt 2 (Gebäude). Auf einem langsamen Handy kann das verwirren. Nicht Teil der Änderung.
- Der Dashboard-Link «Abrechnungen erstellen» führt direkt zum Assistenten; Periode 2025 ist vorgeschlagen, Alpenblick ist das einzige wählbare Gebäude mit Hinweis bei den anderen («Keine neue Abrechnung: Alle Mietverträge haben schon eine.»). Gut.

## Aufgabe geschafft: nein

Gescheitert am Schritt «unverändert speichern» (P-1). Bis zur Vorschau und zum Öffnen der Rechnung ging alles. Wohin mich «Änderungen speichern» führt und ob Dwello danach meint, ich hätte eine Rechnung erfasst, konnte ich deshalb nicht sehen.

## Aufwand

Rund 15 Minuten, etwa 12 Taps bis zur geöffneten Rechnung (Übersicht → Abrechnungen erstellen → Weiter → Alpenblick → Weiter → Weiter → Rechnungslink), dann drei Versuche zu speichern, danach «Abbrechen».

## Ablauf

1. Schritt 1, «Weiter» sofort nach dem Laden angetippt. Erwartet: Schritt 2 Gebäude. Gesehen: Schritt 4 Vorschau mit 0 Abrechnungen. Beim zweiten Mal mit kurzem Warten: Schritt 2.
2. Rechnung «Kaminfeger Huber» aus der Vorschau geöffnet. Erwartet: Formular mit den Werten der Rechnung. Gesehen: so, aber Kategorie «Schneeräumung» bei einer Kaminfeger-Rechnung.
3. «Änderungen speichern» angetippt (Versuch 1). Erwartet: Speichern und zurück in den Assistenten. Gesehen: Knopf grau, nichts passiert, kein Hinweis, auch nach 30 Sekunden nicht.
4. Versuch 2: ins Feld «Beschreibung» getippt und wieder heraus. Erwartet: Knopf wird aktiv. Gesehen: bleibt grau.
5. Versuch 3: ein «x» an die Beschreibung angehängt (Knopf wird aktiv), dann wieder gelöscht. Erwartet: Knopf bleibt aktiv, ich kann den Originalwert speichern. Gesehen: Knopf wieder grau. Damit ist «unverändert speichern» unmöglich.
6. «Abbrechen». Erwartet: zurück zur Vorschau. Gesehen: Assistent auf Schritt 3 mit Meldung «Angaben wiederhergestellt»; die Vorschau kommt erst nach erneutem «Weiter».

## Vorschläge

- **P-1:** Übersicht → «Abrechnungen erstellen» → Weiter → «Alpenblick» → Weiter → Weiter → in der Vorschau unter «Rechnungen kurz nach der Abrechnungsperiode» auf «Kaminfeger Huber …» tippen → «Änderungen speichern» antippen, ohne etwas zu ändern: Knopf ist deaktiviert. Hilfreich wäre: den Knopf aktiv lassen und beim Speichern ohne Änderung einfach zurück zum Assistenten gehen (eventuell mit «Keine Änderungen – Rechnung unverändert»), oder – wenn der graue Knopf gewollt ist – sichtbar daneben sagen «Sie haben nichts geändert. Mit «Abbrechen» kommen Sie zurück zur Vorschau.» Gerade aus dem Assistenten heraus wird «Speichern» der naheliegende Weg zurück sein, wenn man die Rechnung nur kontrolliert hat.

## Nicht geprüft

- Wohin «Änderungen speichern» aus der Vorschau führt und welche Meldung danach kommt (insbesondere ob Dwello behauptet, eine Rechnung sei erfasst worden): nicht erreichbar, weil der Knopf ohne Änderung deaktiviert ist. Versucht: direkter Tap, Fokus in ein Feld und wieder heraus, Zeichen tippen und wieder löschen. Einen Wert wirklich ändern hätte der Auftrag verboten.
- Zurück zur Vorschau nach dem Speichern: aus demselben Grund nicht; nur über «Abbrechen» (landet auf Schritt 3, mit «Weiter» wieder zur Vorschau).
- Abrechnungen nicht erstellt (Auftrag). Nichts gespeichert.

Skripte und Bildschirmfotos: `/tmp/claude-0/-home-user-Dwello/572ae737-1651-512e-ac2c-478fec66fac3/scratchpad/marco-1314/` (06-invoice-edit.png: Formular mit grauem Knopf; 08-after-cancel.png: Schritt 3 nach «Abbrechen»).
