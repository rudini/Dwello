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
