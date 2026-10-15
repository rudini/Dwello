# Helga – Issue #128: Fehlermeldung bei einer Formel, die sich nicht rechnen lässt

Persona: Helga, 68, wenig Computererfahrung, grosse Schrift, unsicher bei Fachbegriffen.
Umgebung: Persona-App http://localhost:3300 (Demo-Daten), Desktop 1280 px breit bei 150 % Zoom (CSS-Breite 853 px), Maus; zuerst Deutsch, dann einmal Französisch über das Sprachmenü.
Aufgabe: Unter Einstellungen → Verteilschlüssel einen neuen Schlüssel «Helga Test» mit der Formel «{area} 2» erfassen, zuerst «Formel testen», dann speichern; beurteilen, ob ich verstehe, was falsch ist; die Formel zu «{area} * 2» korrigieren und speichern.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/f6568649-8148-50aa-9801-07b98b599e26/scratchpad/helga-issue-128/`.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Neuer Verteilschlüssel, Meldung nach «Verteilschlüssel speichern» | Der neue Satz steht viermal hintereinander in einem einzigen Absatz (drei Beispielwohnungen plus eine vierte Zeile), rund 100 Wörter ohne Umbruch; bei 150 % füllt der rote Kasten den ganzen Bildschirm. Die vierte Wiederholung stottert: «Die Formel kann für eine Wohnung nicht berechnet werden: Die Formel kann nicht berechnet werden. …». Ich dachte zuerst, es seien vier verschiedene Fehler. |
| P-2 | Minor | Neuer Verteilschlüssel, Ergebnis von «Formel testen» | Dieselbe Wiederholung im Testkasten: vier Zeilen mit identischem Hinweis, die letzte mit dem gleichen Stotterer und «für eine Wohnung» (welche?). Der Fehler nennt drei Wohnungen (50 / 80 / 120 m²), der erfolgreiche Test danach aber «vier Beispielwohnungen» mit anderen Grössen (50 / 75 / 100 / 120 m²). |
| P-3 | Minor | Beide Fehlermeldungen (de und fr) | Die Meldung sagt «Variablen {area}, …» (fr: «variables»), die Seite nennt dieselben Dinge «Bausteine» («Baustein einfügen», Überschrift «Bausteine»; fr: «éléments»). Für mich sind das zwei verschiedene Wörter für dieselbe Sache. |
| P-4 | Minor | Neuer Verteilschlüssel, Meldung nach dem Speichern | Die Meldung sagt nicht, wo der Fehler steckt (zwischen «{area}» und «2» fehlt ein Rechenzeichen), und nach dem Speichern steht sie oben unter dem Titel, weit weg vom Feld «Formel». Das Feld selbst ist nicht als fehlerhaft markiert (kein roter Rahmen, `aria-invalid` fehlt), und das Testergebnis von vorher ist verschwunden. |
| P-5 | Nit | Beide Fehlermeldungen | Die Aufzählung nennt nur {area}, {rooms}, {volume}, {units}. Die auf derselben Seite erklärten Summen ({area_total} usw.) fehlen; wer eine Summe verwendet, könnte meinen, sie sei nicht erlaubt. |

## Beobachtungen

- Nach dem erfolgreichen Speichern lande ich auf der Liste, «Helga Test» steht zuoberst mit «{area} * 2» und «0 Rechnungen». Eine Bestätigung «gespeichert» habe ich im Text der Seite nicht gesehen; ich habe es nur an der Liste gemerkt.
- Die Überschriften der beiden Fehlerkästen unterscheiden sich: beim Testen «Die Formel lässt sich nicht rechnen», beim Speichern «Verteilschlüssel wurde nicht gespeichert» mit «Die Formel ist ungültig: …» davor.
- Im ganzseitigen Screenshot liegt die feste Kopfleiste mitten über dem Formular (wohl nur ein Effekt des Bildschirmfotos über die ganze Seite).
- Das Feld «Formel» ist beim Öffnen schon mit «{area}» vorbefüllt; das hat mir geholfen.
- Die Summen-Bausteine ({area_total} usw.) haben keine Knöpfe zum Einfügen, nur die vier Grund-Bausteine.

## Aufgabe geschafft: ja

## Aufwand

- Etwa 5 Minuten als Helga, 9 Schritte: Menü → Einstellungen → Verteilschlüssel → «Verteilschlüssel erfassen» → Name → Formel ergänzen → «Formel testen» → «Verteilschlüssel speichern» (abgelehnt) → Formel korrigieren → «Formel testen» → speichern. Französisch zusätzlich etwa 2 Minuten.
- Korrektur gelang beim ersten Versuch.

## Ablauf

1. **Einstellungen finden.** Erwartet: im Menü. Gesehen: «Menü öffnen» zeigt «Einstellungen» und darunter direkt «Verteilschlüssel». Problemlos.
2. **Verteilschlüssel-Liste.** Erwartet: Knopf zum Erfassen. Gesehen: «Verteilschlüssel erfassen», vier vordefinierte Schlüssel und eine Erklärung «So funktioniert eine Formel» mit Bausteinen, Rechenzeichen und Beispielen.
3. **Neuer Verteilschlüssel.** Name «Helga Test» eingetippt, im Feld «Formel» (vorbefüllt «{area}») « 2» angehängt → «{area} 2».
4. **«Formel testen».** Erwartet: ein deutscher Hinweis, was falsch ist. Gesehen (Screenshot `06-test-fehler.png`): roter Kasten «Die Formel lässt sich nicht rechnen», darunter vier Zeilen: «Kleine Wohnung (50 m², 2 Zimmer): Die Formel kann nicht berechnet werden. Prüfen Sie die Rechenzeichen (+, -, *, /), die Klammern und die Variablen {area}, {rooms}, {volume} und {units}.», das Gleiche für «Mittlere Wohnung (80 m², 3.5 Zimmer)» und «Grosse Wohnung (120 m², 5 Zimmer)», und zuletzt «Die Formel kann für eine Wohnung nicht berechnet werden: Die Formel kann nicht berechnet werden. Prüfen Sie …». Kein Englisch, keine Fachmeldung. Den Satz verstehe ich: «Rechenzeichen prüfen» – ah, zwischen {area} und 2 steht ja keines. Aber viermal dasselbe zu lesen hat mich verunsichert (P-2).
5. **«Verteilschlüssel speichern» trotz Fehler.** Erwartet: Dwello lehnt ab und sagt kurz warum. Gesehen (Screenshot `07b-speichern-viewport.png`): Seite springt nach oben zu einem roten Kasten «Verteilschlüssel wurde nicht gespeichert», darunter ein einziger langer Absatz «Die Formel ist ungültig: Kleine Wohnung …» mit dem gleichen Satz viermal und dem Stotterer am Schluss. Der Kasten füllt bei mir den ganzen Bildschirm; das Feld «Formel» muss ich weiter unten suchen, es ist nicht markiert, und der Testkasten ist weg (P-1, P-4). Gespeichert wurde nichts – richtig.
6. **Korrigieren.** In das Feld geklickt, hinter «{area}» « *» eingefügt → «{area} * 2». Die Idee kam aus «Prüfen Sie die Rechenzeichen» und dem Beispiel «{area} + {rooms} * 10» auf der Seite.
7. **Nochmals «Formel testen».** Erwartet: Erfolg. Gesehen (`08-test-ok.png`): Tabelle «So würden die Kosten auf vier Beispielwohnungen verteilt»: 50 m² 14.49 %, 75 m² 21.74 %, 100 m² 28.99 %, 120 m² 34.78 %. Kein roter Kasten mehr. Andere Wohnungen als in der Fehlermeldung (P-2).
8. **Speichern.** Erwartet: Bestätigung. Gesehen (`09-gespeichert.png`): zurück auf der Liste, «Helga Test» mit «Formel: {area} * 2», «Eigener Verteilschlüssel», «0 Rechnungen», «Löschen». Geschafft.
9. **Französisch.** Über «Sprache: Deutsch» → «Français» umgestellt, «Nouvelle clé de répartition» geöffnet, Name «Helga Test FR», Formel «{area} 2». «Tester la formule» (`10-fr-test-fehler.png`): «La formule ne peut pas être calculée», vier Zeilen «Petit appartement (50 m², 2 pièces) : La formule ne peut pas être calculée. Vérifiez les opérateurs (+, -, *, /), les parenthèses et les variables {area}, {rooms}, {volume} et {units}.» usw., letzte Zeile «La formule ne peut pas être calculée pour un appartement : La formule ne peut pas être calculée. …». «Enregistrer la clé de répartition» (`11-fr-speichern-fehler.png`): «La clé de répartition n’a pas été enregistrée» / «La formule n’est pas valable : …» mit derselben vierfachen Wiederholung. Kein Deutsch, kein Englisch in der Meldung. Nicht gespeichert (richtig, keinen französischen Schlüssel angelegt).

## Verwirrung

- «Variablen» in der Meldung gegenüber «Bausteine» auf der Seite (fr: «variables» / «éléments») (P-3).
- Viermal derselbe Satz: sind das vier Fehler? Muss ich bei jeder Wohnung etwas ändern? (P-1, P-2)
- «für eine Wohnung» in der letzten Zeile: welche Wohnung? Die drei sind doch schon aufgezählt.
- «Kleine/Mittlere/Grosse Wohnung» im Fehler, aber «vier Beispielwohnungen» mit anderen Flächen beim Erfolg.
- «Rechenzeichen» selbst ist verständlich; «Die Formel ist ungültig» klingt strenger als «lässt sich nicht rechnen», meint aber dasselbe.

## Fehlerrisiken

- Wer den langen Absatz nach dem Speichern nicht zu Ende liest, findet den eigentlichen Hinweis («Prüfen Sie die Rechenzeichen …») erst nach dem Wohnungsnamen und hält die Wohnungsdaten (50 m², 2 Zimmer) für das Problem, z. B. «ist meine Wohnung zu klein?».
- Weil die Meldung nicht sagt, wo das Rechenzeichen fehlt, könnte jemand statt «*» ein «+» einsetzen («{area} + 2»): die Formel rechnet dann, verteilt aber ganz anders. Die Testtabelle danach hilft, das zu merken, wenn man sie liest.
- Nach dem abgelehnten Speichern ist das Testergebnis weg; man muss erneut «Formel testen» drücken, um die Wirkung der Korrektur zu sehen.

## Vorschläge

- **P-1** – Schritte: Einstellungen → Verteilschlüssel → «Verteilschlüssel erfassen», Name «Helga Test», Formel «{area} 2», «Verteilschlüssel speichern». Hilfreich: den Hinweis nur einmal zeigen, wenn er für alle Wohnungen gleich ist, z. B. «Die Formel kann nicht berechnet werden. Prüfen Sie die Rechenzeichen …», ohne Wohnungsliste und ohne die zusätzliche Sammelzeile; keinen Satz in sich selbst wiederholen.
- **P-2** – Schritte: wie P-1, aber «Formel testen». Hilfreich: im Testkasten dieselbe Zusammenfassung (einmal); wenn Wohnungen genannt werden, dieselben vier Beispielwohnungen wie in der Erfolgstabelle.
- **P-3** – Schritte: wie P-2, Meldung mit «Bausteine» oben im Formular vergleichen. Hilfreich: in der Meldung «die Bausteine {area}, {rooms}, {volume} und {units}» (fr «les éléments …»), so wie auf der Seite.
- **P-4** – Schritte: wie P-1, dann zum Feld «Formel» scrollen. Hilfreich: die Meldung zusätzlich direkt unter dem Feld «Formel» zeigen und das Feld rot markieren; ein konkreter Satz wie «Zwischen zwei Werten fehlt ein Rechenzeichen, z. B. {area} * 2» wäre für mich am klarsten.
- **P-5** – Schritte: wie P-2. Hilfreich: «… und die Bausteine wie {area} oder {area_total}» oder auf die Erklärung «So funktioniert eine Formel» verweisen statt einer unvollständigen Aufzählung.

## Nicht geprüft

- Andere Formelfehler (fehlende Klammer, unbekannter Baustein wie «{flaeche}», Division durch null): nicht Teil der Aufgabe.
- Italienisch und Englisch: Aufgabe nannte nur Französisch.
- Bearbeiten eines bestehenden eigenen Schlüssels mit falscher Formel: nicht verlangt; ich habe nur einen neuen erfasst.
- 200 % Zoom und Mobil: die Aufgabe gab 1280 px Desktop vor.
- Ob der französische Schlüssel nach korrigierter Formel speichert: absichtlich nicht gespeichert, um nur «Helga Test» anzulegen.
