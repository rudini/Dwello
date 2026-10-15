# Helga – Issue #128, Runde 2: Meldung bei einer Formel, die sich nicht rechnen lässt

Persona: Helga, 68, wenig Computererfahrung, grosse Schrift, unsicher bei Fachbegriffen.
Umgebung: Persona-App http://localhost:3300 (Demo-Daten), Desktop 1440 × 900 bei 150 % Zoom, zusätzlich einmal 200 %, Maus, Deutsch.
Aufgabe: Unter Einstellungen › Verteilschlüssel einen neuen Schlüssel «Fläche doppelt» mit der Formel «{area} 2» erfassen und speichern; nur die Meldung nach dem Speichern beurteilen (einmal? verständlich? sagt sie, was zu tun ist?); dann die Formel zu «{area} * 2» korrigieren und nochmals speichern.
Geprüft werden P-1 und P-5 aus Runde 1 (`helga-issue-128.md`). P-2, P-3 und P-4 sind offene Arbeit (O-24) und werden hier nicht wiederholt.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/helga-issue-128-2/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | – (behoben) | Neuer Verteilschlüssel, Meldung nach «Verteilschlüssel speichern» | Der Hinweis steht jetzt genau einmal da, drei Zeilen lang, ohne Wohnungsliste und ohne Stotterer. Bei 150 % und 200 % passt der rote Kasten gut auf den Bildschirm. |
| P-5 | – (behoben) | dito | Die Summen werden jetzt genannt: «… und ihre Summen wie {area_total}.» |
| P-6 | Minor | dito | Die Meldung zählt «%» zu den Rechenzeichen, aber nirgends auf der Seite steht, was «%» tut: Der Hilfetext am Feld «Formel» sagt «rechnen Sie mit + - * / und Klammern», der Abschnitt «Rechnen» erklärt nur «+ plus, - minus, * mal, / geteilt durch». Ich lese «%» als «Prozent» und würde z. B. «{area} * 50%» versuchen. |
| P-7 | Nit | dito | Die Meldung beginnt doppelt: «Die Formel ist ungültig: Die Formel kann nicht berechnet werden.» Zweimal «Die Formel …» hintereinander sagt zweimal dasselbe; der eigentliche Rat («Prüfen Sie …») kommt erst danach. |

## Beobachtungen

- Der Menüpunkt heisst «Einstellungen», nicht «Konfiguration» (so hiess er in meiner Aufgabe); ich habe ihn trotzdem gleich gefunden, «Verteilschlüssel» steht direkt im Menü.
- Nach dem korrigierten Speichern erscheint jetzt unten rechts eine grüne Meldung «Verteilschlüssel «Fläche doppelt» gespeichert» (in Runde 1 hatte ich keine Bestätigung bemerkt).
- Bei 200 % habe ich aus Versehen nochmals den Namen «Fläche doppelt» verwendet (den gab es inzwischen schon). Dann kam nur «Ein Verteilschlüssel mit dem Namen "Fläche doppelt" existiert bereits.» – mit geraden Anführungszeichen statt «…», ohne Hinweis, was ich tun soll (z. B. «Wählen Sie einen anderen Namen»), und ohne Wort zur ebenfalls falschen Formel. Erst nach dem Umbenennen hätte ich vom Formelfehler erfahren.
- Wie in Runde 1 (P-4, offene Arbeit O-24): Nach dem Speichern springt die Seite zum Kasten oben, das Feld «Formel» liegt ausserhalb des Bildschirms und ist nicht markiert; im Bildschirmfoto ist die Brotkrümelzeile halb unter der Kopfleiste versteckt.
- «Variablen» in der Meldung gegenüber «Bausteine» auf der Seite besteht weiter (P-3, offene Arbeit).

## Aufgabe geschafft: ja

## Aufwand

- Etwa 3 Minuten als Helga, 8 Schritte: Menü öffnen → «Verteilschlüssel» → «Verteilschlüssel erfassen» → Name → « 2» an die vorbefüllte Formel anhängen → «Verteilschlüssel speichern» (abgelehnt) → Formel zu «{area} * 2» ändern → speichern (gespeichert).
- Die Korrektur gelang beim ersten Versuch. Reine Laufzeit des Skripts rund 4 Sekunden.

## Ablauf

1. **Menü öffnen.** Erwartet: einen Weg zu den Verteilschlüsseln. Gesehen (`01-menu.png`): Menü mit «Einstellungen» und darunter «Kategorien», «Verteilschlüssel», «Heizprofile». Problemlos.
2. **Liste der Verteilschlüssel.** Erwartet: Knopf zum Erfassen. Gesehen (`02-liste.png`): «Verteilschlüssel erfassen» oben rechts, vier vordefinierte Schlüssel.
3. **Neuer Verteilschlüssel.** Gesehen (`03-neu.png`): Felder «Name», «Beschreibung (optional)», «Formel» (vorbefüllt mit «{area}»). Name «Fläche doppelt» eingetippt, hinter «{area}» « 2» angehängt → «{area} 2».
4. **«Verteilschlüssel speichern».** Erwartet: Dwello lehnt ab und sagt einmal, kurz und auf Deutsch, was falsch ist. Gesehen (`04-fehler-viewport.png`): Ich bleibe auf «Neuer Verteilschlüssel», oben ein roter Kasten «Verteilschlüssel wurde nicht gespeichert», darunter ein einziger Absatz: «Die Formel ist ungültig: Die Formel kann nicht berechnet werden. Prüfen Sie die Rechenzeichen (+, -, *, /, %), die Klammern und die Variablen {area}, {rooms}, {volume}, {units} und ihre Summen wie {area_total}.» Der Satz «Prüfen Sie» kommt auf der ganzen Seite genau einmal vor. Kein Englisch. Gespeichert wurde nichts. Verständlich ist es: «Rechenzeichen prüfen» – da fehlt bei mir ja eins zwischen {area} und 2. Was ich tun soll, sagt die Meldung allgemein («Prüfen Sie …»), aber nicht, wo genau. Gestolpert bin ich über «%» (P-6) und den doppelten Anfang (P-7).
5. **Gleiche Meldung bei 200 %** (`07-fehler-200.png`, Name «Fläche doppelt gross», wieder abgelehnt, nichts gespeichert): derselbe Text, einmal, gut lesbar, kein seitliches Scrollen.
6. **Formel korrigieren.** Feld «Formel» weiter unten gesucht, Inhalt zu «{area} * 2» geändert.
7. **Nochmals speichern.** Erwartet: Bestätigung und der neue Schlüssel in der Liste. Gesehen (`05-nach-korrektur-viewport.png`): zurück auf «Verteilschlüssel», zuoberst «Fläche doppelt», «Formel: {area} * 2», «Eigener Verteilschlüssel», «0 Rechnungen», «Löschen»; unten rechts grüne Meldung «Verteilschlüssel «Fläche doppelt» gespeichert». Geschafft.

## Verwirrung

- «%»: Prozent? Rest einer Division? Auf der Seite nicht erklärt (P-6).
- «Die Formel ist ungültig: Die Formel kann nicht berechnet werden.» – sind das zwei Probleme oder eines? (P-7)
- «Variablen» gegenüber «Bausteine» (bekannt, P-3).
- «ihre Summen wie {area_total}» ist jetzt verständlich, weil die Seite einen Abschnitt «Summen des Gebäudes» hat.

## Fehlerrisiken

- Wegen des «%» in der Meldung könnte jemand Prozentangaben in die Formel schreiben («{area} * 70%») und ein unerwartetes Ergebnis oder eine neue Ablehnung bekommen.
- Die Meldung zeigt weiterhin nicht, wo das Rechenzeichen fehlt; wer «+» statt «*» einsetzt, bekommt eine rechnende, aber falsche Verteilung (bekannt aus Runde 1).
- Ist der Name schon vergeben, wird der Formelfehler verschwiegen; man korrigiert in zwei Runden (Beobachtung).

## Vorschläge

- **P-6** – Schritte: Menü → «Verteilschlüssel» → «Verteilschlüssel erfassen», Name «Fläche doppelt», Formel «{area} 2», «Verteilschlüssel speichern»; Meldung mit dem Hilfetext am Feld «Formel» und dem Abschnitt «Rechnen» vergleichen. Hilfreich: «%» entweder aus der Meldung weglassen oder im Abschnitt «Rechnen» in einfachen Worten erklären, damit Meldung und Hilfe dieselben Rechenzeichen nennen.
- **P-7** – Schritte: wie P-6. Hilfreich: nur einen Anfang, z. B. «Die Formel kann nicht berechnet werden. Prüfen Sie …» ohne vorangestelltes «Die Formel ist ungültig:».

## Nicht geprüft

- «Formel testen»: nicht Teil dieser Runde (P-2 ist offene Arbeit).
- Französisch, Italienisch, Englisch: Aufgabe nannte nur die deutsche Meldung.
- Bearbeiten eines bestehenden Schlüssels mit falscher Formel: nicht verlangt.
- Andere Formelfehler (fehlende Klammer, unbekannter Baustein, Division durch null): nicht verlangt.
