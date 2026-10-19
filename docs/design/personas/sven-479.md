# Sven – #479 Adresssuche im Gebäuderegister bei «Neues Gebäude»

Persona: Sven, 45, blind, nur Tastatur und Screenreader. Desktop 1440 × 900, Zoom 100 %. Beurteilt nach dem Accessibility-Tree (Name, Rolle, Beschreibung, Zustände des fokussierten Elements über das Chromium-Accessibility-API, dazu `ariaSnapshot`). Nur angeschaut, nichts gespeichert. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/7dafbd2e-3753-5fd4-bcb4-6211ba03db69/scratchpad/sven-479/`.

Wichtig vorweg: Das Gebäuderegister war während des ganzen Laufs nicht erreichbar. `GET /api/addresses?q=…` antwortete immer mit `502 {"error":"unreachable"}` (fünf Versuche über rund eine Minute, auch mit «Bernstrasse 10 Bern» und dem Beispiel aus dem Hilfetext «Seebahnstrasse 155 Zürich»). Von derselben Maschine aus antwortet `https://api3.geo.admin.ch/rest/services/api/SearchServer` über den Proxy mit 200. Vermutlich erreicht das Backend im Persona-Stack geo.admin.ch nicht (Proxy oder Zertifikate). Darum konnte ich keinen Treffer wählen und die Wohnungsliste gar nicht sehen. Geprüft habe ich die Suche bis zur Fehlermeldung, die Eingabe von Hand und das Absenden mit leeren Pflichtfeldern.

## Befunde

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Neues Gebäude, Adresssuche | Meldet das Gebäuderegister einen Fehler («Das Gebäuderegister ist gerade nicht erreichbar. …»), sagt der Screenreader nichts. Der Text steht in keinem Live-Bereich und hängt nicht per `aria-describedby` an der Combobox. Ich tippe die Adresse, höre nichts, und auch mit Pfeil nach unten kommt nichts. |
| P-2 | Major | Neues Gebäude, Absenden mit Fehlern | Habe ich vorher «Zum Inhalt springen» benutzt (URL endet auf `#main-content`), geht der Fokus nach einem Absenden mit leerem Gebäudenamen zuerst kurz auf «Gebäudename» und dann auf `main`. Die Fehlermeldung wird nicht vorgelesen, und ich höre nur «Hauptbereich». In «Neuer Mieter» bleibt der Fokus im selben Ablauf auf dem ersten fehlerhaften Feld. |
| P-3 | Minor | Neues Gebäude, Adresssuche | «Suche löschen» leert das Feld, verschwindet dann aber, und der Fokus fällt auf `body`. Ich muss vom Seitenanfang neu suchen. Die Fehlermeldung zum Register bleibt nach dem Leeren stehen, obwohl gar keine Suche mehr läuft. |

## Beobachtungen

- Die Combobox ist an sich sauber ausgezeichnet: Rolle `combobox`, Name «Adresse suchen (optional)», `aria-autocomplete=list`, `aria-haspopup=listbox`, `aria-controls=address-search-results`, `aria-expanded=false`. Der Hilfetext ist als Beschreibung verbunden. Wie die Treffer angesagt werden (Anzahl, `aria-activedescendant`, Auswahl), konnte ich nicht hören, weil nie Treffer kamen.
- Gesucht wird schon ab zwei Zeichen («Be»). Solange gesucht wird, kündigt nichts das an: kein `aria-busy`, kein Status. Der einzige `role=status` der Seite ist der Toast-Bereich unten.
- Die Reihenfolge stimmt nicht ganz zum Einleitungstext. Der sagt «Suchen Sie die Adresse», ich lande per Tab aber zuerst auf «Gebäudename» (Pflichtfeld) und erst danach auf der Suche.
- Die Beschreibung des Kantons, «Wird mit der Adresssuche ausgefüllt.», ist irreführend, wenn die Suche gerade nicht geht. Dann muss ich ihn selbst wählen. Per Tastatur geht das gut: «b» wählt «Bern (BE)».
- Die Fehlermeldungen selbst sind gut: `aria-invalid=true`, und die Meldung hängt an der Beschreibung («Beispiel: Musterstrasse 12 Adresse ist erforderlich.»). Ohne den Sprunglink landet der Fokus auf dem ersten fehlerhaften Feld «Gebäudename».
- Begriffe passen nicht zusammen: Das Feld heisst «Strasse und Hausnummer», seine Fehlermeldung aber «Adresse ist erforderlich.». Und «Adresse» ist zugleich der Name der ganzen Gruppe.
- Bei fünf leeren Pflichtfeldern gibt es keine Zusammenfassung («5 Angaben fehlen»). Ich finde die übrigen Fehler nur, indem ich weiter tabbe.
- Der Browser fragt nur `localhost:3300` (`/api/addresses`), nie geo.admin.ch direkt. Das passt zur Datenschutzerklärung («über den Server von Dwello»).

## Aufgabe geschafft: nein

Gescheitert am Schritt «Treffer wählen»: In fünf Versuchen kam kein Treffer, weil das Register vom Server aus nicht erreichbar war (502). Die Wohnungen durchgehen, eine weglassen und die Ansagen zu «Fehlt im Gebäuderegister» konnte ich darum nicht prüfen. Das Absenden mit leerem Pflichtfeld habe ich mit Eingaben von Hand geprüft.

## Aufwand

Rund 25 Minuten, 12 Skriptläufe. Vom Seitenanfang bis zur Suche: Sprunglink und 3 Tabs. Ohne Sprunglink sind es 21 Tabs, weil die ganze Navigation davor liegt.

## Ablauf

1. **Gebäude → «Gebäude erfassen».** Erwartet: Fokus auf der Überschrift oder dem ersten Feld. Gesehen: Fokus auf `body`, die Live-Region sagt «Neues Gebäude - Dwello». Das ist in Ordnung, ich weiss, wo ich bin.
2. **Sprunglink, dann Tab.** Erwartet: das erste Feld. Gesehen: zuerst der Brotkrümel-Link «Gebäude», dann «Gebäudename» (Pflicht, mit Beschreibung), dann die Combobox «Adresse suchen (optional)» mit langer Beschreibung zum GWR.
3. **«Bernstrasse 10, 3005 Bern» getippt.** Erwartet: Ansage wie «5 Treffer, Pfeil nach unten zum Wählen». Gesehen: nichts angesagt, `aria-expanded` bleibt `false`. Sichtbar erscheint unter dem Feld «Das Gebäuderegister ist gerade nicht erreichbar. Erfassen Sie das Gebäude von Hand oder versuchen Sie es später.» (Screenshot `06-fehler.png`). Der Text ist weder Live-Bereich noch Beschreibung der Combobox (P-1).
4. **Pfeil nach unten und oben.** Erwartet: einen Treffer anwählen. Gesehen: kein `aria-activedescendant`, keine Reaktion. Escape: keine Reaktion, der Wert bleibt.
5. **Tab auf «Suche löschen», Enter.** Erwartet: das Feld wird leer, der Fokus bleibt in der Combobox. Gesehen: Das Feld ist leer, der Fokus liegt aber auf `body`, und die Registermeldung steht noch da (P-3).
6. **Von Hand ausgefüllt:** Strasse, PLZ, Ort, Kanton mit «b», Gebäudename leer gelassen. Alle Felder sind sauber beschriftet, und die Hilfetexte werden als Beschreibung vorgelesen.
7. **Tab bis «Gebäude erfassen», Enter** (nach Sprunglink). Erwartet: Fokus auf «Gebäudename», Ansage «ungültig, Gebäudename ist erforderlich». Gesehen: Fokus auf `main`, die URL bleibt `/buildings/new#main-content`, keine Fehlermeldung angesagt (P-2). Visuell ist alles richtig: Rahmen rot, Meldung mit Symbol unter dem Feld (Screenshot `07-leer.png`). Erst ein weiterer Tab (über den Brotkrümel) bringt mich zum Feld, das dann «ungültig, … Gebäudename ist erforderlich.» sagt.
8. **Dasselbe ohne Sprunglink.** Gesehen: Fokus auf «Gebäudename», ungültig, Meldung in der Beschreibung. So soll es sein.
9. **Alles leer abgeschickt.** Fokus auf «Gebäudename». Fehlerhaft sind name, address, postalCode, city und canton, jede Meldung ist als Beschreibung verbunden, eine Zusammenfassung fehlt.
10. **Gegenprobe in «Neuer Mieter»** mit Sprunglink und leerem Absenden: Der Fokus bleibt auf «Vorname». P-2 betrifft also nur «Neues Gebäude».

## Verwirrung

- «Adresse suchen (optional)», danach kommen trotzdem Pflichtfelder für die Adresse. Erst die Beschreibung erklärt, dass die Suche nur ausfüllt. Verständlich, aber lang.
- «GWR» und «Gebäude- und Wohnungsregister» sind erklärt, gut.
- «Adresse ist erforderlich.» beim Feld «Strasse und Hausnummer»: Ich war unsicher, ob die Suche gemeint ist.
- Kanton «Wird mit der Adresssuche ausgefüllt.», obwohl die Suche nicht geht.

## Fehlerrisiken

- Ich glaube, die Suche läuft noch oder findet nichts, und warte, weil die Registermeldung stumm bleibt (P-1).
- Nach dem Absenden glaube ich, das Gebäude sei gespeichert, weil nur «Hauptbereich» kommt und keine Fehlermeldung (P-2).
- Nach «Suche löschen» verliere ich die Position und lande am Seitenanfang (P-3).

## Vorschläge

- **P-1:** Seite öffnen, wenn `/api/addresses` mit 502 antwortet (hier ist das von selbst so). In der Combobox eine Adresse tippen. Es wird nichts angesagt. Hilfreich wäre die Registermeldung als `role="status"` (oder `alert`) und zusätzlich in `aria-describedby` der Combobox. Dasselbe gilt für «keine Treffer» und für die Anzahl Treffer.
- **P-2:** `/buildings/new` öffnen, «Zum Inhalt springen» wählen, dann ohne Gebäudename «Gebäude erfassen» drücken. Der Fokus landet auf `main`. Der Fokus sollte auf dem ersten fehlerhaften Feld bleiben wie in «Neuer Mieter». Offenbar setzt etwas nach dem Fehlerfokus den Fokus auf das Hash-Ziel zurück.
- **P-3:** In der Combobox etwas tippen, Tab auf «Suche löschen», Enter. Der Fokus ist auf `body`. Der Fokus sollte zurück in die Combobox, und eine Registermeldung sollte mit dem Leeren verschwinden.

## Nicht geprüft

- Treffer der Adresssuche: wie sie angesagt werden, ob die Pfeiltasten und Enter wählen, was nach der Wahl angesagt wird. Grund: Das Register antwortete immer mit 502 (siehe oben). Treffer nachzubauen wäre über das erlaubte «Anfrage fehlschlagen lassen» hinausgegangen.
- Die ganze Wohnungsliste: Gruppen pro Wohnung, «Wohnung übernehmen», eine Wohnung weglassen, Wohnungsnummer, Stockwerk, Fläche, Zimmeranzahl, die Markierung «Fehlt im Gebäuderegister», die Hinweise und die Fehler in einem Wohnungsfeld beim Absenden. Grund wie oben.
- Ob «Gebäudename» bei einem Treffer vorausgefüllt wird.
- Bitte erneut laufen lassen, sobald das Backend im Persona-Stack geo.admin.ch erreicht.

---

# Runde 2

Neue Datenbank, gleicher Aufbau wie in Runde 1: Desktop 1440 × 900, nur Tastatur, beurteilt nach dem Accessibility-Tree (fokussiertes Element mit Name, Rolle, Wert, `aria-invalid`, `aria-expanded`, `aria-activedescendant`, Gruppe und Beschreibung, dazu die Live-Bereiche der Seite und `ariaSnapshot`). Nur angeschaut: Abgeschickt habe ich nur Formulare mit Fehlern, gespeichert wurde nichts. Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/7dafbd2e-3753-5fd4-bcb4-6211ba03db69/scratchpad/sven-479/r2/`.

Diesmal antwortete das Gebäuderegister (`GET /api/addresses?q=…` mit 200), der Browser fragte wieder nur `localhost:3300`.

## Befunde (Runde 2)

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | erledigt | Neues Gebäude, Adresssuche | Die Hinweise stehen jetzt in einem `aria-live="polite"`-Bereich und werden angesagt: nach der Wahl «Das Gebäuderegister enthält nur Wohnungen. …», bei einem Treffer ohne Wohnungen «Im Gebäuderegister sind keine Wohnungen erfasst. …», ohne Treffer «Keine Adresse gefunden. Prüfen Sie …». Die Meldung «nicht erreichbar» konnte ich nicht auslösen (siehe Nicht geprüft). |
| P-2 | Major | Neues Gebäude, Absenden mit Fehlern in Wohnungen | Unverändert aus Runde 1, jetzt aber mit mehr Folgen: Nach «Zum Inhalt springen» (URL `#main-content`) landet der Fokus nach dem Absenden auf `main`, nicht auf dem ersten fehlerhaften Feld. Der Fehler steckt diesmal in «Wohnung 40300 › Fläche», rund 30 Tabs weiter unten, und ich höre nur «Hauptbereich». Nichts sagt, dass und wo etwas falsch ist. Ohne Sprunglink ist alles richtig. |
| P-3 | erledigt | Neues Gebäude, Adresssuche | «Suche löschen» leert das Feld, der Fokus bleibt in der Combobox. |
| P-4 | Minor | Neues Gebäude, Adresssuche | Wenn die Trefferliste aufgeht, wird nichts angesagt (keine Anzahl wie «8 Adressen gefunden»). Nur `aria-expanded` wechselt auf `true`. Ich weiss nicht, ob und wie viele Treffer da sind, bis ich Pfeil nach unten drücke. |
| P-5 | Minor | Neues Gebäude, Wohnungen aus dem Gebäuderegister | Die zwei Hinweise der Gruppe «Wohnungen aus dem Gebäuderegister» («Prüfen Sie die Angaben: …» und «Lassen Sie nur Wohnungen weg, die es nicht mehr gibt. … ihren Anteil tragen Sie.») hängen weder an der Gruppe noch am Kontrollkästchen. Wer mit Tab durchgeht, hört nur «Wohnung 40100, Gruppe, Wohnung übernehmen, Kontrollkästchen, aktiviert». Gerade der zweite Hinweis hat Folgen für die Kosten. Auch dass 14 Wohnungen übernommen wurden, sagt niemand an. |
| P-6 | Minor | Neues Gebäude, Wohnungen aus dem Gebäuderegister | Das Feld heisst nur «Fläche», ohne Einheit, sichtbar wie vorgelesen. Dass m² gemeint sind, erfahre ich erst aus der Fehlermeldung («Geben Sie die Fläche als Zahl in m² ein, z. B. 72.5.»). |
| P-7 | Minor | Neues Gebäude, Wohnungen aus dem Gebäuderegister | Bei Schrattenweg 5, Langnau i. E., hört sich das so an: «Wohnungsnummer, EG, Fehlt im Gebäuderegister». Das Feld hat einen Wert, die Beschreibung sagt aber, er fehle. Ich weiss nicht, ob Dwello «EG» eingesetzt hat und ob ich etwas tun muss. Der Hinweis sagt nicht, was zu tun ist. |

## Beobachtungen (Runde 2)

- Die Combobox funktioniert gut mit der Tastatur: Pfeil nach unten setzt `aria-activedescendant` auf den ersten Treffer, die Listbox heisst «Gefundene Adressen», und die Optionen haben verständliche Namen («Bernastrasse 10 3005 Bern (BE)»). Mit Enter wird gewählt, der Fokus bleibt im Feld, `aria-expanded` geht wieder auf `false`.
- «Bernstrasse 10, 3005 Bern» gibt es nicht. Der erste Treffer ist «Bernastrasse 10». Für mich ist das in Ordnung, weil die Optionen vorgelesen werden.
- Nach der Wahl sind Gebäudename, Strasse, PLZ, Ort, Kanton (Bern) und Gebäudetyp (Mehrfamilienhaus) ausgefüllt, darunter 14 Gruppen «Wohnung 40100» bis «Wohnung 43300». Jede Gruppe hat einen Namen, und die fünf Felder sind beschriftet. Die Gruppennamen sind die Registernummern. Das ist eindeutig, sagt mir aber wenig über die Lage.
- «Wohnung übernehmen» mit Leertaste abwählen: Die Felder der Wohnung werden `disabled`, Tab springt direkt zur nächsten Wohnung. Das ist ruhig und verständlich. Nach dem Absenden mit Fehlern bleibt die Wohnung abgewählt.
- «Im Register ohne halbe Zimmer: bitte prüfen» hängt als Beschreibung an «Zimmeranzahl» und wird vorgelesen. Gut.
- Fehler beim Absenden (ohne Sprunglink): Der Fokus geht auf «Wohnung 40300 › Fläche», `aria-invalid=true`, Beschreibung «Geben Sie die Fläche als Zahl in m² ein, z. B. 72.5.». Die leere Wohnungsnummer in «Wohnung 40400» ist ebenfalls ungültig, mit der Beschreibung «Wohnungsnummer ist erforderlich.». Beide Meldungen sagen, was zu tun ist. Eine Zusammenfassung («2 Angaben sind falsch») gibt es weiterhin nicht. Die zweite finde ich nur durch Weitertabben.
- Bis zum Knopf «Gebäude und Wohnungen erstellen» sind es nach der Wahl rund 70 Tabs (14 Wohnungen × 5). Der Knopf sagt nicht, wie viele Wohnungen erstellt werden.
- «Suche löschen» nach einer Wahl lässt die übernommenen Felder, die 14 Wohnungen und den Hinweis «Das Gebäuderegister enthält nur Wohnungen …» stehen. Gesagt wird dabei nichts. Ich hatte erwartet, dass «löschen» auch die übernommenen Wohnungen entfernt, oder dass mir jemand sagt, dass sie bleiben. Suche ich danach eine Adresse ohne Treffer, steht «Keine Adresse gefunden» neben den Wohnungen der alten Adresse.
- Escape in der Combobox leert das Feld nicht. Das ist unauffällig.
- Die Kanton-Beschreibung «Wird mit der Adresssuche ausgefüllt.» stimmt diesmal, weil die Suche geht.

## Aufgabe geschafft: ja

Suche, Wahl, Durchgehen der Wohnungen, eine Wohnung weglassen und Absenden mit «abc» als Fläche und einer leeren Wohnungsnummer: alles mit der Tastatur geschafft. Die Ansage der Hinweise habe ich geprüft. Einschränkung: Mit dem Sprunglink davor findet der Fokus den Fehler nicht (P-2).

## Aufwand (Runde 2)

Rund 20 Minuten, 9 Skriptläufe. Bis zur Suche: Sprunglink und 3 Tabs (ohne Sprunglink 20 Tabs). Treffer wählen: Pfeil nach unten und Enter. Bis zum Absenden rund 70 weitere Tabs.

## Ablauf (Runde 2)

1. **`/buildings/new`, Sprunglink, 3 Tabs.** Erwartet: die Combobox. Gesehen: «Adresse suchen (optional)», Combobox, Gruppe «Adresse», mit der langen Beschreibung zum GWR. Wie in Runde 1.
2. **«Bernstrasse 10, 3005 Bern» getippt.** Erwartet: Ansage der Treffer. Gesehen: `aria-expanded=true`, Listbox «Gefundene Adressen» mit 8 Optionen, aber kein Text im Live-Bereich (P-4).
3. **Pfeil nach unten, Enter.** Erwartet: Wahl und Ansage, was übernommen wurde. Gesehen: Nach rund 0,5 s sagt der Live-Bereich «Das Gebäuderegister enthält nur Wohnungen. Erfassen Sie Läden, Büros und andere vermietete Räume nach dem Speichern als eigene Wohnung.» Der Fokus bleibt im Feld mit dem Wert «Bernastrasse 10, 3005 Bern». Gut. Dass 14 Wohnungen da sind, wird nicht gesagt (P-5).
4. **Durch Adresse und Weitere Angaben tabben.** Alles ausgefüllt und richtig beschriftet.
5. **In die Wohnungen tabben.** Erwartet: die Hinweise zum Weglassen. Gesehen: direkt «Wohnung 40100» › «Wohnung übernehmen» (aktiviert) › «Wohnungsnummer 40100» › «Stockwerk EG» › «Fläche 35» › «Zimmeranzahl 2» mit dem Hinweis zu halben Zimmern. Die zwei Gruppenhinweise kommen nicht (P-5), die Einheit der Fläche fehlt (P-6).
6. **«Wohnung 40200», Leertaste.** Erwartet: abgewählt, Felder inaktiv. Gesehen: genau das, Tab springt zu «Wohnung 40300» (Screenshot `03-weggelassen.png`: Kästchen leer, die vier Felder grau).
7. **«Wohnung 40300 › Fläche» auf «abc», «Wohnung 40400 › Wohnungsnummer» geleert, Tab bis zum Knopf, Enter** (mit Sprunglink). Erwartet: Fokus auf «Fläche» mit Fehlermeldung. Gesehen: `POST /buildings/new` antwortet 200, die Seite bleibt, der Fokus liegt auf `main`, und die URL behält `#main-content` (P-2). Visuell sind beide Felder rot markiert und haben ihre Meldung (Screenshot `04-fehler.png`). Der nächste Tab führt zum Brotkrümel «Gebäude», also an den Seitenanfang.
8. **Dasselbe ohne Sprunglink.** Gesehen: Fokus auf «Fläche» in Wohnung 40300, ungültig, «Geben Sie die Fläche als Zahl in m² ein, z. B. 72.5.». So soll es sein.
9. **«Suche löschen».** Gesehen: Feld leer, Fokus in der Combobox (P-3 erledigt). Die übernommenen Angaben und Wohnungen bleiben (siehe Beobachtungen).
10. **Suche ohne Treffer («Xyzqwstrasse 999 Nirgendwo»).** Gesehen: Live-Bereich «Keine Adresse gefunden. Prüfen Sie Strasse, Hausnummer und Ort oder erfassen Sie das Gebäude von Hand. …» (P-1 erledigt).
11. **Andere Treffer, um «Fehlt im Gebäuderegister» zu finden.** Unter den Berner Treffern gab es keinen. Bei Schrattenweg 5, 3550 Langnau im Emmental, fand ich «Wohnung EG» mit «Wohnungsnummer EG» und der Beschreibung «Fehlt im Gebäuderegister» (Screenshot `05-fehlt.png`), siehe P-7. Das Feld ist per `aria-required=true` als Pflichtfeld markiert.

## Verwirrung (Runde 2)

- «Fehlt im Gebäuderegister» an einem Feld, das einen Wert hat (P-7).
- «Fläche» ohne Einheit (P-6).
- «Wohnung 40100»: Ich höre eine fünfstellige Nummer statt einer Lage wie «EG links». Das ist die Registernummer. Dank Stockwerk lässt sich die Wohnung aber zuordnen.
- «Suche löschen» löscht nur den Suchtext, nicht die übernommenen Angaben.

## Fehlerrisiken (Runde 2)

- Nach dem Sprunglink abgeschickt, Fokus auf «Hauptbereich»: Ich halte das Gebäude für erstellt, obwohl es zwei Fehler gibt (P-2).
- Ich wähle eine leer stehende oder selbst genutzte Wohnung ab, weil ich den Hinweis «Lassen Sie nur Wohnungen weg, die es nicht mehr gibt» beim Tabben nie höre (P-5).
- Ich trage die Fläche in einer anderen Einheit oder mit «m²» ein (P-6).
- Ich übernehme die Wohnungsnummer «EG» ungeprüft, weil unklar ist, ob sie stimmt (P-7).

## Vorschläge (Runde 2)

- **P-2:** `/buildings/new`, «Zum Inhalt springen», Adresse «Bernstrasse 10, 3005 Bern» wählen, in «Wohnung 40300» als Fläche «abc» eintragen, abschicken. Der Fokus liegt auf `main`. Der Fokus sollte wie ohne Sprunglink auf dem ersten fehlerhaften Feld landen. Eine Fehlerzusammenfassung mit Links zu den Feldern würde zusätzlich helfen.
- **P-4:** In der Combobox eine Adresse tippen. Es kommt keine Ansage. Die Anzahl der Treffer gehört in den bestehenden Live-Bereich («8 Adressen gefunden. Mit Pfeil nach unten wählen.»).
- **P-5:** Eine Adresse mit Wohnungen wählen und in die Wohnungen tabben. Die Gruppenhinweise kommen nicht. Hilfreich wäre `aria-describedby` der Gruppe «Wohnungen aus dem Gebäuderegister» (oder des ersten Kontrollkästchens) auf die beiden Hinweise und ein Satz im Live-Bereich nach der Wahl, z. B. «14 Wohnungen aus dem Gebäuderegister übernommen».
- **P-6:** Feld «Fläche» in einer Wohnung fokussieren. Es fehlt die Einheit. «Fläche in m²» als Beschriftung oder eine Beschreibung «in m², z. B. 72.5» würde helfen.
- **P-7:** «Hauptstrasse 5 Langnau» suchen, ersten Treffer (Schrattenweg 5) wählen, zu «Wohnung EG › Wohnungsnummer» tabben. Gehört wird «EG, Fehlt im Gebäuderegister». Der Hinweis sollte sagen, woher der Wert kommt und was zu tun ist, z. B. «Fehlt im Gebäuderegister. Dwello hat das Stockwerk eingesetzt, bitte prüfen.».

## Nicht geprüft (Runde 2)

- Die Ansage «Das Gebäuderegister ist gerade nicht erreichbar» im neuen Live-Bereich und ihr Verschwinden nach «Suche löschen». Das Register antwortete, und der Auftrag nannte keine Anfrage, die ich fehlschlagen lassen sollte. Dass Hinweise im selben Bereich angesagt werden, zeigen die Meldungen «Keine Adresse gefunden» und «keine Wohnungen erfasst».
- «Fehlt im Gebäuderegister» bei Fläche, Stockwerk oder Zimmeranzahl: Ich fand den Hinweis nur bei einer Wohnungsnummer.
- Wie eine echte Sprachausgabe (NVDA, VoiceOver) die Live-Bereiche und Gruppen wirklich vorliest. Beurteilt habe ich nur den Accessibility-Tree.
- Erfolgreiches Speichern: Der Auftrag war, nur anzuschauen.
