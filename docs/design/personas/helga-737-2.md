# Helga, Slice 737, zweite Runde: Meldungen bei «Formel testen»

Desktop 1440 × 900, Zoom 150 %, Maus. Weg: Einstellungen → Verteilschlüssel → «Verteilschlüssel erfassen» (`/config/distribution-keys/new`). Nur angeschaut und getestet, nichts gespeichert. Geprüft werden nur P-1 und P-2 aus `helga-737.md`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Neuer Verteilschlüssel, «Formel testen» | `{area} / ({units} - 1)`: «Für eine Wohnung ergibt die Formel keine Zahl, meist weil sie dort durch null teilt. Prüfen Sie, was nach «/» steht.» Jetzt weiss ich, was los ist (durch null geteilt) und wo ich schauen muss (nach dem «/»). Der alte Major ist damit gelöst. Was bleibt: «für eine Wohnung» stimmt hier nicht ganz, weil `{units}` für jede Wohnung 1 ist, also teilt die Formel bei allen Wohnungen durch null. Und warum `({units} - 1)` null ist, sagt erst die Meldung bei Schritt 3 («{units} ist für jede Wohnung 1»), nicht diese hier. Ich musste unten bei den Bausteinen nachlesen. |

## Beobachtungen

- **P-2 gelöst:** `{area} - 100` ergibt «Für eine Wohnung ergibt die Formel einen negativen Wert, meist weil sie dort zu viel abzieht. Prüfen Sie, was nach «-» steht.» Jetzt steht drin, was ich tun soll (prüfen, was ich abziehe). Welche Beispielwohnung es betrifft, steht weiterhin nicht da, aber das brauche ich nicht mehr, um die Formel zu ändern. Dass eine Wohnung 0 oder mehr ergeben muss, steht nicht wörtlich da. «Zu viel abzieht» hat mir aber gereicht.
- `{units} - 1` ergibt «Die Formel ergibt für alle Wohnungen null, so lassen sich keine Anteile berechnen. Prüfen Sie, ob sie mit 0 malnimmt oder {units} - 1 enthält ({units} ist für jede Wohnung 1).» Diese Meldung finde ich am besten: Sie sagt, was passiert, warum das ein Problem ist und warum `{units} - 1` null wird. Ich verstehe sie und weiss, was ich ändern soll. «malnimmt» ist etwas umgangssprachlich, stört mich aber nicht.
- Alle drei Meldungen haben jetzt die gleiche Form: zuerst was falsch ist, dann «Prüfen Sie …». Das doppelte «Die Formel …: Die Formel …» aus der ersten Runde ist weg.
- Die Meldung steht wie vorher in einem roten Kasten «Der Test hat einen Fehler gefunden», direkt unter dem Knopf «Formel testen», mit Symbol (Screenshot `f1.png`). Das Formel-Feld selbst wird beim Testen nicht rot markiert (wie in Runde 1).
- Auf dem ganzseitigen Screenshot liegt die Kopfleiste mit «Dwello» mitten über dem Formular (zwischen «Beschreibung» und «Formel»). Ich glaube, das kommt von der festen Kopfleiste beim Bild der ganzen Seite, nicht von der Seite selbst. Beim Arbeiten hat es mich nicht gestört.

## Aufgabe geschafft: ja

Alle drei Formeln getestet, zu allen drei Meldungen weiss ich, was falsch ist und wo ich ändern muss. P-1 ist von Major auf Minor gesunken, P-2 ist gelöst.

## Aufwand

Etwa 5 Minuten, 7 Schritte (Formular öffnen, dreimal Formel eintragen und «Formel testen»).

## Ablauf

- Schritt 1, `{area} / ({units} - 1)` testen. Erwartet: Hinweis auf Teilen durch null und was ich ändern soll, am besten mit dem Grund, warum hier null steht. Gesehen: Teilen durch null und «Prüfen Sie, was nach «/» steht.», aber «für eine Wohnung», obwohl es alle betrifft, und ohne Hinweis, dass `{units}` immer 1 ist (P-1).

## Vorschläge

- **P-1:** Neuer Verteilschlüssel, Formel `{area} / ({units} - 1)`, «Formel testen». Hilfreich wäre derselbe Zusatz wie bei Schritt 3, etwa «… Prüfen Sie, was nach «/» steht ({units} ist für jede Wohnung 1, {units} - 1 also 0).». Und «für eine Wohnung» durch «für mindestens eine Wohnung» ersetzen oder, wenn es alle betrifft, «für alle Wohnungen» sagen wie bei Schritt 3.

## Nicht geprüft

- 200 % Zoom: nicht verlangt, nur 150 % benutzt.
- Speichern mit diesen Formeln: Die Aufgabe hiess nur anschauen und nichts speichern.
- Die Funde P-3 bis P-5 aus der ersten Runde: Diese drei Schritte betreffen sie nicht.
