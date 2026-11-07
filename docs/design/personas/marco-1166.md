# Marco – Konto auf jemand anderen (Kontoinhaber), Handy 390 × 844

Aufgabe: Herausfinden, wo man das Konto für die Einzahlungsscheine auf jemand anderen als die Verwaltung (z. B. die Eigentümerin) laufen lassen kann, und was man dafür eintragen muss. Angaben eintippen, nicht speichern.

| ID | Schwere | Screen | Befund |
|---|---|---|---|
| P-1 | Minor | Einstellungen, Konto | Wenn ich das Häkchen «Kontoinhaber ist der Absender» wieder setze (z. B. aus Versehen mit dem Daumen), sind die Felder weg, und nach dem erneuten Entfernen des Häkchens ist alles, was ich eingetippt habe, leer. Keine Warnung. |
| P-2 | Minor | Einstellungen, Konto | Zwei Hinweise widersprechen sich scheinbar: Bei der IBAN steht «Mit einer IBAN braucht es Firmenname, PLZ und Ort», beim Häkchen «Mit einer IBAN braucht es dann Name, PLZ und Ort des Kontoinhabers». Ich weiss nicht, ob ich mit der Eigentümerin als Kontoinhaberin den Firmennamen oben trotzdem brauche oder ob das jetzt ihr Name ist. |
| P-3 | Minor | Einstellungen, Konto, Gruppe «Kontoinhaber» | Die vier neuen Felder haben weder Beispiel noch «Freiwillig», anders als die Absender-Felder oben. Laut Hinweis braucht es Name, PLZ und Ort; ob «Strasse und Hausnummer» Pflicht ist, sehe ich am Feld nicht. |
| P-4 | Minor | Einstellungen | Schwer zu finden auf dem Handy: Die Einstellung liegt bei rund 3250 px auf einer 6400 px langen Seite, unter Kategorien, KI, Zugangsschlüssel, Protokoll, Export und Absender. Der Einleitungssatz oben nennt «Absender», aber nicht Konto/QR-Rechnung. Nach dem Entfernen des Häkchens erscheinen die neuen Felder unterhalb des Bildschirmrands; ich sehe zuerst nicht, dass etwas passiert ist. |

## Beobachtungen

- Das Wort, das ich gesucht habe («Konto», «Einzahlungsschein»), steht so nicht in den Menüs. Ich habe auf «Einstellungen» getippt, weil sonst nichts passte. Auf der Seite heisst es «QR-Rechnung», nicht «Einzahlungsschein». Mit etwas Nachdenken ist das okay.
- «Kontoinhaber ist der Absender»: Mein Kollege sprach von «Verwaltung», die App von «Absender». Der Hilfetext erklärt es gut («Entfernen Sie das Häkchen, wenn das Konto jemand anderem gehört …»), und «Konto / Zahlbar an» sagt mir, wo der Name auf dem Zettel landet.
- Das Häkchen lässt sich auch über den Text daneben antippen (Fläche 48 px hoch), das ist gut für den Daumen.
- Die Felder der Gruppe heissen wie die Absender-Felder («Strasse und Hausnummer», «PLZ», «Ort»). Im Bild trennt die Überschrift «Kontoinhaber» sie sauber, verwechselt habe ich nichts.
- Die Felder haben kein `autocomplete`; der Browser schlägt mir keine Adresse vor (für die Adresse einer anderen Person aber auch nicht schlimm).
- Wenn ich die Seite mit ungespeicherten Eingaben verlasse (Tipp auf «Dwello»), kommt keine Nachfrage, die Eingaben sind weg. Für meine Aufgabe gewollt, aber im echten Leben hätte ich mich geärgert.
- Der Knopf «Einstellungen speichern» steht ganz unten auf der Seite, nicht fest am Bildschirmrand.
- Im geöffneten Hauptmenü ist der Inhalt dahinter für einen Screenreader weiter sichtbar (nicht meine Sache, nur bemerkt).
- Kein seitliches Scrollen bei 390 px.
- Bei jedem Neuladen war das Häkchen gesetzt; ob jemand anderes in der Zwischenzeit gespeichert hat, habe ich nicht gesehen.

## Aufgabe geschafft: ja

Gefunden unter Menü > Einstellungen > Abschnitt «Konto»: Häkchen «Kontoinhaber ist der Absender» entfernen, dann Name, Strasse und Hausnummer, PLZ und Ort der Eigentümerin eintragen. Nicht gespeichert (keine POST-Anfrage im Netzwerk).

## Aufwand

Etwa 4 Minuten, rund 8 Schritte (Menü öffnen, Einstellungen, lange scrollen bis «Konto», Hinweise lesen, Häkchen entfernen, weiterscrollen, vier Felder ausfüllen, Häkchen zur Probe wieder setzen).

## Ablauf

- Einstellungen geöffnet. Erwartet: «Konto» oder «Einzahlungsschein» weit oben. Gesehen: zuerst Stammdaten, KI, Zugangsschlüssel, Protokoll, Export, Absender; «Konto» erst nach viel Scrollen.
- Häkchen entfernt. Erwartet: sofort sichtbare neue Felder. Gesehen: auf dem Bildschirm änderte sich nur das Häkchen; die Felder kamen unterhalb des Rands, erst beim Weiterscrollen sichtbar (Screenshot 06-unchecked.png).
- Hinweise gelesen. Erwartet: klare Angabe, was Pflicht ist. Gesehen: IBAN-Hinweis verlangt «Firmenname, PLZ und Ort», Häkchen-Hinweis «Name, PLZ und Ort des Kontoinhabers» (P-2).
- Häkchen zur Probe wieder gesetzt und wieder entfernt. Erwartet: meine Eingaben (Erika Muster, Seestrasse 12, 8802 Kilchberg) sind noch da. Gesehen: alle vier Felder leer (P-1).

## Vorschläge

- P-1: /config auf dem Handy, Häkchen «Kontoinhaber ist der Absender» entfernen, Name «Erika Muster» eintippen, Häkchen setzen, Häkchen wieder entfernen: Feld leer. Hilfe: Eingaben behalten, solange nicht gespeichert ist (nur beim Speichern mit Häkchen ignorieren).
- P-2: /config, Abschnitt «Konto», beide Hinweise lesen. Hilfe: IBAN-Hinweis so fassen, dass er beide Fälle abdeckt, z. B. «Mit einer IBAN braucht es Name, PLZ und Ort des Kontoinhabers», oder klar sagen, dass der Absender (Firmenname, PLZ, Ort) immer nötig ist.
- P-3: /config, Häkchen entfernen, Gruppe «Kontoinhaber» ansehen. Hilfe: Beispiele wie beim Absender («Beispiel: Erika Muster», «Beispiel: 8001») und bei der Strasse «Freiwillig», falls sie es ist.
- P-4: Auf dem Handy Menü > Einstellungen öffnen und «Konto» suchen. Hilfe: im Einleitungssatz «Konto für die QR-Rechnung» erwähnen oder einen Sprunglink; nach dem Entfernen des Häkchens die neuen Felder in den sichtbaren Bereich bringen oder den Hinweis kürzen, damit sie näher am Häkchen stehen.

## Nicht geprüft

- Was beim Speichern passiert (Pflichtfelder, Fehlermeldungen, Ablehnung): laut Auftrag nicht gespeichert.
- Wie die QR-Rechnung mit anderem Kontoinhaber aussieht: dafür hätte ich speichern und eine Abrechnung erzeugen müssen.
- Dunkler Modus und andere Sprachen: nicht Teil der Aufgabe.

Screenshots und Skripte: /tmp/claude-0/-home-user-Dwello/5d7f70d4-0be2-5903-a4e8-3a73471da3fb/scratchpad/marco-1166/
