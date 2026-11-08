# Helga – Wohnung B1 in «Seepark Residenz» aufheben (Runde 1311)

Desktop 1440 × 900, Zoom 150 %, Maus. Persona-App auf http://localhost:3300, Demo-Daten. Gespeichert nur in «Seepark Residenz» (Wohnung B1).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Minor | Gebäude «Seepark Residenz», Gebäudeliste, Wohnungsliste, Übersicht | Die Zahl der Wohnungen widerspricht sich: Gebäudeseite «3, davon 3 vermietet, 0 leer und 1 aufgehoben», darunter aber vier Wohnungen aufgelistet (B1 mit dabei); Karte «3 Wohnungen · 3 vermietet · 0 leer · 1 aufgehoben» (3 + 0 + 1 = 4); Wohnungsliste mit Filter Seepark Residenz: «4 Wohnungen»; Übersicht «11 Wohnungen», der Link öffnet aber eine Liste mit 13. Ich weiss nicht mehr, ob B1 nun mitzählt oder nicht. |
| P-2 | Minor | Wohnung bearbeiten, Hilfe bei «Aufgehoben ab» | Die Hilfe ist ein Block von neun Zeilen. Wer bis wann zahlt, verstehe ich (bis 31.03. ich, ab 01.04. die übrigen Wohnungen), aber «eine berichtigte Abrechnung rechnet mit diesem Tag» und «Wird eine andere Wohnung dadurch grösser, kann Dwello ihre neue Fläche noch nicht ab diesem Tag berücksichtigen» verstehe ich nicht; was soll ich dann tun? Das Datumsformat steht ganz am Ende. |
| P-3 | Minor | Seite Wohnung B1 nach dem Speichern | Die Erklärung beim Mietstatus ist allgemein («ab dem Tag unter «Aufgehoben ab»») statt «seit 01.04.2026». Sie sagt nicht mehr, wer die Nebenkosten trägt, und auch nicht, dass ich nichts weiter tun muss. Darunter steht unter «Aktueller Mieter» weiterhin «Diese Wohnung ist derzeit nicht vermietet.»: Das klingt, als könnte man sie vermieten. |
| P-4 | Minor | Seite Wohnung B1 direkt nach dem Speichern | Die Meldung «Wohnung B1 gespeichert» liegt bei 150 % über der Erklärung des Mietstatus («… kann sie nicht vermietet werden») und über dem Stockwerk. Genau den neuen Text konnte ich nicht lesen, bis ich die Meldung geschlossen hatte. |

## Beobachtungen

- Vor dem Speichern zeigt das Formular «Mietstatus: Leer» als Auswahl direkt über «Aufgehoben ab». Ich war unsicher, ob ich dort auch etwas umstellen muss. Nach dem Speichern steht dort richtig «Der Mietstatus ergibt sich aus dem Feld «Aufgehoben ab» und lässt sich hier nicht ändern.» und grau «Aufgehoben seit 01.04.2026». Das ist klar.
- Unter dem Datumsfeld steht «Mittwoch, 1. April 2026». Das beruhigt mich, ich habe mich nicht vertippt.
- Auf der Seite von B1 ist der Knopf «Mietvertrag erfassen» verschwunden. Gut, so komme ich nicht in Versuchung. «Löschen» ist weiterhin da; ob ich B1 jetzt löschen soll, sagt mir niemand (ich habe es nicht getan).
- In der Legende «Was bedeutet der Mietstatus?» (Gebäude, Wohnungsliste) gibt es jetzt «Aufgehoben». Der Satz darunter «Leer und Gesperrt setzen Sie beim Bearbeiten der Wohnung.» nennt Aufgehoben aber nicht, obwohl man das auch dort setzt.
- Auf der Übersicht kommt B1 gar nicht mehr vor: «Seepark Residenz 3/3 vermietet», «2 Leer» in allen Gebäuden. Es gibt keine Kachel und keine Erklärung «Aufgehoben». Nichts verleitet mich zum Vermieten, aber ich sehe dort auch nicht, wo B1 geblieben ist (siehe P-1).
- Filter in der Wohnungsliste: «Seepark Residenz + Leer» ergibt «Keine Wohnungen gefunden», «+ Aufgehoben» ergibt nur B1, «+ Vermietet» ergibt A1, A2, B2. Das ist richtig und verständlich.
- Im Haus Alpenblick erscheint Wohnung 2.01 als «Aufgehoben seit 01.07.2025». Das hat eine andere Persona während meines Laufs gemacht (bei meinem Start stand dort noch «leer»), es ist nicht mein Befund.
- Die Schaltfläche «Route planen (öffnet in neuem Tab)» auf den Gebäudekarten bricht bei 150 % in zwei Spalten um und liest sich holprig.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, rund 20 Schritte (Gebäude öffnen, B1 öffnen, Bearbeiten, Hilfe lesen, Datum eintippen, speichern, danach sechs Stellen anschauen).

## Ablauf

- Hilfe bei «Aufgehoben ab» gelesen. Erwartet: zwei, drei kurze Sätze, wer zahlt. Gesehen: ein langer Block. Die Antwort steht drin (bis zum Tag davor ich, ab dem Tag die übrigen Wohnungen), aber zusammen mit zwei Sätzen, die ich nicht verstehe (P-2).
- Nach dem Speichern auf der Seite von B1. Erwartet: «Aufgehoben seit 01.04.2026» und eine Erklärung, die ich lesen kann. Gesehen: das Abzeichen stimmt, aber die Meldung verdeckt die Erklärung (P-4); die Erklärung selbst ist allgemein, und «Diese Wohnung ist derzeit nicht vermietet» steht weiterhin da (P-3).
- Gebäudeseite und Gebäudekarte. Erwartet: 4 Wohnungen, davon 1 aufgehoben, oder 3 Wohnungen ohne B1. Gesehen: «3 Wohnungen», aber vier aufgelistet und dazu «1 aufgehoben» (P-1).
- Übersicht. Erwartet: dieselbe Wohnungszahl wie in der Liste. Gesehen: der Link «11 Wohnungen» führt zu einer Liste mit «1–12 von 13» (P-1).

## Vorschläge

- **P-1:** B1 aufheben, dann die Gebäudeseite «Seepark Residenz», /buildings und /dashboard ansehen und auf «11 Wohnungen» klicken. Hilfreich wäre eine einzige Zählweise, zum Beispiel «4 Wohnungen: 3 vermietet, 0 leer, 1 aufgehoben», oder ausdrücklich «3 Wohnungen (dazu 1 aufgehobene)». Der Link auf der Übersicht sollte eine Liste mit genau so vielen Wohnungen öffnen, wie er nennt.
- **P-2:** Wohnung B1 bearbeiten, die Hilfe bei «Aufgehoben ab» lesen. Hilfreich wäre ein kurzer Kern wie «Bis zum Tag davor tragen Sie die Nebenkosten der leeren Wohnung. Ab diesem Tag zahlen die Mieter der übrigen Wohnungen ihren Anteil.» Dazu das Format gleich nach dem ersten Satz. Die Sätze zu berichtigten Abrechnungen und zur grösseren Nachbarwohnung entweder in einfachen Worten mit dem, was ich tun soll, oder weiter unten auf der Hilfeseite.
- **P-3:** Nach dem Speichern die Seite von B1 ansehen. Hilfreich wäre eine Erklärung mit dem Datum, zum Beispiel «Die Wohnung gibt es seit 01.04.2026 nicht mehr. Sie kann nicht vermietet werden; Sie müssen nichts weiter tun.» Den Abschnitt «Aktueller Mieter» bei einer aufgehobenen Wohnung weglassen oder in «Die Wohnung ist aufgehoben.» ändern.
- **P-4:** Bei 150 % «Aufgehoben ab» setzen und speichern. Hilfreich wäre, wenn die Meldung keinen Inhalt verdeckt (zum Beispiel oben über dem Inhalt statt darüber gelegt) oder nicht über dem ersten Abschnitt liegt.

## Nicht geprüft

- Zoom 200 %: nicht gemacht, alles bei 150 %.
- Ob die Nebenkostenabrechnung 2026 für Seepark Residenz B1 wirklich nur bis 31.03. mitrechnet: Die Aufgabe verlangte keine Abrechnung, und ich wollte keine Entwürfe erzeugen.
- Ein falsches Datum (z. B. vor einem Mietvertrag) oder das Leeren des Feldes, um B1 wieder herzustellen: nicht Teil der Aufgabe, nicht versucht.

Screenshots und Skripte: /tmp/claude-0/-home-user-Dwello/9491f89b-e3dd-58ae-af29-e047f9ed5a53/scratchpad/helga-1311/
