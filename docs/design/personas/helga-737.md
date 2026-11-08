# Helga, Slice 737: eigener Verteilschlüssel für den Garten

Desktop 1440 × 900, Zoom 150 %, Maus. Weg: Menü → Einstellungen → Verteilschlüssel → «Verteilschlüssel erfassen» (`/config/distribution-keys/new`).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Neuer Verteilschlüssel, «Formel testen» | `{area} / ({units} - 1)`: «Die Formel kann für eine Wohnung nicht berechnet werden: Die Formel ergibt keine gültige Zahl.» Zweimal «Die Formel» in einem Satz, es steht nicht, warum (hier wird durch null geteilt, weil `{units}` immer 1 ist) und nicht, was ich tun soll. «für eine Wohnung»: welche denn? Ich weiss nicht, wie ich das beheben soll. |
| P-2 | Minor | Neuer Verteilschlüssel, «Formel testen» | `{area} - 100`: «Die Formel ergibt einen negativen Wert.» Was falsch ist, verstehe ich ungefähr, aber nicht, für welche Wohnung (die 50-m²-Beispielwohnung?) und was ich stattdessen tun soll. Es fehlt ein «Was tun»-Teil, z. B. dass jede Wohnung mindestens 0 ergeben muss. |
| P-3 | Minor | Neuer Verteilschlüssel, Speichern | `{area} 2`: «Die Formel kann nicht berechnet werden. Prüfen Sie die Rechenzeichen (+, -, *, /), die Klammern und die Bausteine {area}, {rooms}, {volume}, {units} und ihre Summen wie {area_total}.» Zwei lange Sätze, das Wort «Rechenzeichen» steht nirgends auf der Seite (dort heisst es «Rechnen»), und es steht nicht, *was* fehlt: zwischen `{area}` und `2` fehlt ein Rechenzeichen. Ich habe gar keine Klammern, trotzdem soll ich sie prüfen. |
| P-4 | Minor | Neuer Verteilschlüssel, Speichern | `{area} , 5`: «Diese Zeichen sind in der Formel nicht erlaubt: «,».» Ich verstehe, dass das Komma falsch ist, aber nicht, was ich stattdessen schreiben soll. Dass Dezimalzahlen mit Punkt geschrieben werden (0.5), steht nur unten im Kasten «Rechnen», nicht in der Meldung. |
| P-5 | Minor | Neuer Verteilschlüssel, Speichern | Ist der Name schon vergeben und die Formel falsch (`{personen}`, `{area} 2` oder `{area} , 5` mit dem Namen «Garten Test»), erscheint nur «Ein Verteilschlüssel mit dem Namen «Garten Test» existiert bereits.» beim Namen; die Formel wird nicht markiert. Erst nach dem nächsten Speichern erfahre ich vom zweiten Fehler. |

## Beobachtungen

- Beim Speichern steht jeder Formelfehler genau einmal, rot mit Symbol direkt unter dem Formel-Feld, das Feld ist rot umrandet (Screenshot `s4.png`). Keine zweite Meldung oben oder als Hinweisfenster. Das ist gut.
- `{personen}` beim Speichern: «Unbekannter Baustein {personen}. Erlaubt sind {area}, {rooms}, {volume}, {units} und ihre Summen wie {area_total}.» Klar, das Wort «Baustein» passt zur Seite («Baustein einfügen», «Bausteine»). Die Summen (`{area_total}`) sind unten unter «Summen des Gebäudes» erklärt, bei den Knöpfen «Baustein einfügen» gibt es sie aber nicht; ich musste erst suchen, was mit «ihre Summen» gemeint ist.
- Beim Testen erscheinen die Fehler nicht am Feld, sondern in einem roten Kasten «Der Test hat einen Fehler gefunden» unter dem Knopf «Formel testen»; die Wörter sind dieselben wie beim Speichern. Das Feld selbst wird beim Testen nicht markiert. Für mich war das in Ordnung, der Kasten ist gleich unter dem Knopf.
- Der Test mit `{area}` zeigt «So würden die Kosten auf vier Beispielwohnungen verteilt» mit Anteilen (50 m² 14.49 % … 120 m² 34.78 %). Verständlich. Dass es Beispielwohnungen sind und nicht meine Wohnungen, steht da, aber dann verstehe ich bei P-1 umso weniger, welche «eine Wohnung» gemeint ist.
- Das Formel-Feld ist beim Öffnen schon mit `{area}` gefüllt. Das hilft.
- Die Löschen-Bestätigung («Verteilschlüssel «Garten Test» löschen? Der Verteilschlüssel verschwindet aus der Auswahl beim Erfassen von Rechnungen.») ist klar.
- Einstellungen sind nur über das Menü (☰) zu finden, auf der Übersicht gibt es keinen Link dorthin.

## Aufgabe geschafft: ja

«Garten Test» mit `{area}` ist gespeichert und steht in der Liste als «Eigener Verteilschlüssel, 0 Rechnungen».

## Aufwand

Etwa 15 Minuten, rund 25 Schritte (3 zum Formular, 6 Formeln, zusätzlich 3 Formeln nur getestet, um die Wörter beim Testen und beim Speichern zu vergleichen, und einmal löschen und neu speichern, siehe Ablauf).

## Ablauf

- Schritt 1, `{area} / ({units} - 1)` testen. Erwartet: ein Hinweis, dass hier durch null geteilt wird, und was ich ändern soll. Gesehen: «Die Formel kann für eine Wohnung nicht berechnet werden: Die Formel ergibt keine gültige Zahl.» Keine Ursache, kein nächster Schritt (P-1).
- Schritt 2, `{area} - 100` testen. Erwartet: was ich ändern soll. Gesehen: nur «Die Formel ergibt einen negativen Wert.» (P-2).
- Schritt 4, `{area} 2` speichern. Erwartet: «Zwischen {area} und 2 fehlt ein Rechenzeichen». Gesehen: allgemeine Prüfliste mit dem neuen Wort «Rechenzeichen» (P-3).
- Schritt 5, `{area} , 5` speichern. Erwartet: «Schreiben Sie Dezimalzahlen mit Punkt». Gesehen: nur, dass «,» nicht erlaubt ist (P-4).
- Mein erster Durchgang lief in der falschen Reihenfolge (Schritt 6 vor den Wiederholungen von 3–5). Danach war «Garten Test» schon vergeben, und bei 3–5 kam nur die Namensmeldung, kein Formelfehler (P-5). Ich habe meinen eigenen «Garten Test» über «Löschen» entfernt, 3–5 wiederholt und dann Schritt 6 neu gespeichert.

## Vorschläge

- **P-1:** Neuer Verteilschlüssel, Formel `{area} / ({units} - 1)`, «Formel testen». Hilfreich wäre ein Satz mit Ursache und Abhilfe, z. B. «Die Formel teilt durch null. Prüfen Sie, was nach dem Zeichen / steht.», ohne das doppelte «Die Formel …: Die Formel …», und wenn eine Wohnung genannt wird, dann welche Beispielwohnung.
- **P-2:** Formel `{area} - 100`, «Formel testen». Die Meldung sollte sagen, für welche Beispielwohnung der Wert negativ wird und dass jede Wohnung 0 oder mehr ergeben muss.
- **P-3:** Formel `{area} 2`, speichern. Wenn möglich sagen, wo der Fehler ist («Zwischen {area} und 2 fehlt ein Rechenzeichen wie + oder *.»), sonst das Wort aus der Seite verwenden («Rechnen» oder die Hilfe «rechnen Sie mit + - * /» ändern in «Rechenzeichen + - * /») und die Bausteinliste kürzen.
- **P-4:** Formel `{area} , 5`, speichern. Ergänzen: «Schreiben Sie Dezimalzahlen mit Punkt, z. B. 0.5.»
- **P-5:** Einen Verteilschlüssel «Garten Test» speichern, dann ein zweites Mal mit demselben Namen und der Formel `{personen}` speichern. Nur der Namensfehler erscheint. Beide Fehler gleichzeitig zeigen, jeden an seinem Feld.

## Nicht geprüft

- Was passiert, wenn ich `{area} / ({units} - 1)` oder `{area} - 100` ohne zu testen direkt speichere. Das gehörte nicht zur Aufgabe, und ich wollte keinen weiteren Verteilschlüssel anlegen.
- Wie sich «Garten Test» bei einer Rechnung oder Abrechnung auswirkt. Ich durfte keine Gebäude oder Rechnungen ändern.
- 200 % Zoom. Ich habe nur mit 150 % gearbeitet.
