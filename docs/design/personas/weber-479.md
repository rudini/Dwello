# Dr. Weber – Adresssuche im Gebäuderegister (#479)

Persona: Dr. Weber, 52, Desktop 1440 × 900, Maus. Nur angeschaut, nichts gespeichert.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/7dafbd2e-3753-5fd4-bcb4-6211ba03db69/scratchpad/weber-479/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Neues Gebäude | Die Adresssuche im Persona-Stack findet nichts: jede Suche endet mit «Das Gebäuderegister ist gerade nicht erreichbar» (`/api/addresses` antwortet 502 `{"error":"unreachable"}`), dreimal mit verschiedenen Adressen. Vom selben Rechner antwortet `api3.geo.admin.ch` per curl mit 200. Die Vorschläge (Gebäudetyp, Baujahr, Wohnungen) konnte ich deshalb gar nicht beurteilen. Vermutlich liegt es an der Umgebung (der Server geht nicht über den Proxy). Bestätigt ist das nicht. |
| P-2 | Minor | Neues Gebäude / Datenschutz | Bei langsamem Tippen (400 ms pro Taste) schickt der Browser für jeden Buchstaben eine eigene Suche: 22 Anfragen von «Se» bis «Seebahnstrasse 155 Zürich». Die Datenschutzerklärung spricht von «dem eingegebenen Suchbegriff» (Einzahl). Als Leser verstehe ich darunter eine Abfrage, nicht jeden Zwischenstand meiner Eingabe. |
| P-3 | Minor | Neues Gebäude | Beim Kanton steht «Wird mit der Adresssuche ausgefüllt.». Ist das Register nicht erreichbar und erfasse ich von Hand, stimmt das nicht mehr. Dann muss ich den Kanton selbst wählen, und der Hinweis sagt mir das nicht. |
| P-4 | Nit | Datenschutz | Der Link «Datenschutzerklärung von swisstopo» führt auf `https://www.swisstopo.admin.ch/en/legal-framework`: eine englische Seite «legal framework», keine deutschsprachige Datenschutzerklärung. Die Links zu Google führen dagegen direkt auf die Datenschutzerklärung. |

## Beobachtungen

- Im Browser geht die Suche nur an `http://localhost:3300/api/addresses?q=…`. Eine Anfrage an geo.admin.ch macht der Browser nicht. Damit stimmt die Aussage «über den Server von Dwello … die IP-Adresse des Servers, nicht die des Browsers», soweit ich das sehen kann.
- Am Suchfeld selbst steht nicht, dass die Eingabe an swisstopo geht. Das steht nur in der Datenschutzerklärung. Ich würde es mir dort wünschen, wo ich tippe, etwa als Satz im Hilfetext.
- Die Fehlermeldung ist ein gelber Hinweis mit Warndreieck direkt unter dem Suchfeld (Screenshot `see-a-list.png`). Sie erscheint im Barrierefreiheitsbaum als gewöhnlicher Absatz, und die vorhandene Statusregion der Seite bleibt leer. Ein Screenreader würde die Meldung also wohl nicht ansagen (das prüft besser Sven).
- Bei 502 (Register nicht erreichbar) und bei 500 (von mir erzwungen) erscheint derselbe Text. Für den Nutzer ist das richtig so: in beiden Fällen kann er von Hand weiterarbeiten.
- Die Seite oben sagt klar, was ohne Treffer passiert: «Ohne Treffer erfassen Sie die Angaben von Hand und legen die Wohnungen danach an.» Das finde ich gut.
- Der Button in der Gebäudeliste heisst «Gebäude erfassen», die Seite dahinter «Neues Gebäude». Gefunden habe ich sie trotzdem sofort.

## Aufgabe geschafft: teilweise

- Teil 1 (Vorschläge beurteilen): **nein**, gescheitert am Schritt «Treffer erscheinen». Das Register war bei drei Versuchen nicht erreichbar (P-1).
- Teil 2 (Datenschutz): ja.
- Teil 3 (Fehlerfall 500): ja.

## Aufwand

Etwa 15 Minuten, 8 Durchläufe: Gebäudeliste, «Neues Gebäude», drei Suchen, Datenschutz, Fehlerfall mit Erfassung von Hand.

## Ablauf

1. **Gebäude → «Gebäude erfassen».** Erwartet: ein Formular mit Adresssuche. Gesehen: «Neues Gebäude» mit Einleitung, Feld «Adresse suchen (optional)», Hilfetext mit GWR und Beispiel «Seebahnstrasse 155 Zürich», darunter die Felder für die Erfassung von Hand (`02-new.png`).
2. **«Bernstrasse 10, 3005 Bern» eingetippt.** Erwartet: Trefferliste mit dem Gebäude, danach Gebäudetyp, Baujahr und Wohnungen. Gesehen: nach kurzer Zeit «Das Gebäuderegister ist gerade nicht erreichbar. Erfassen Sie das Gebäude von Hand oder versuchen Sie es später.», keine Treffer. In der Netzwerkanfrage: 502 `{"error":"unreachable"}`.
3. **«Seebahnstrasse 155 Zürich».** Erwartet: Treffer. Gesehen: dasselbe wie in Schritt 2 (`see-a-list.png`).
4. **Dritter Versuch «Bernstrasse 10 Bern».** Gesehen: wieder 502 und dieselbe Meldung. Damit habe ich nach drei Versuchen aufgehört. Gegenprobe: curl auf `api3.geo.admin.ch` vom selben Rechner antwortet mit 200.
5. **Fusszeile → «Datenschutz», Abschnitt «Weitergabe an Dritte».** Erwartet: wer was bekommt. Gesehen: «Die Adresssuche … fragt über den Server von Dwello das eidgenössische Gebäude- und Wohnungsregister (GWR) des Bundesamts für Statistik ab, das … swisstopo auf geo.admin.ch bereitstellt (Schweiz). swisstopo erhält dabei den eingegebenen Suchbegriff und die Nummer des gewählten Gebäudes im Register sowie die IP-Adresse des Servers, nicht die des Browsers.» Mein Urteil: Empfänger (swisstopo), Registerhalter (BFS), Land (Schweiz) und Datenarten sind genannt. Der Weg über den Server stimmt mit dem überein, was der Browser tatsächlich anfragt. Unklar bleibt nur, dass jeder Zwischenstand der Eingabe einzeln übermittelt wird (P-2). Den Schlusssatz «Ausser den hier … genannten Diensten erhält niemand Daten» habe ich nicht widerlegt gefunden.
6. **Fehlerfall: `**/api/addresses**` im Browser auf 500 gesetzt, langsam «Seebahnstrasse 155 Zürich» getippt.** Erwartet: eine verständliche Meldung und ein Weg weiter. Gesehen: dieselbe gelbe Meldung wie oben (`20-fail500.png`). Sie sagt, was passiert ist und was ich tun kann. Dabei gingen 22 Anfragen hinaus, eine pro Buchstabe (P-2).
7. **Von Hand erfasst:** Strasse, PLZ und Ort lassen sich ohne Weiteres ausfüllen (`21-manual.png`). Der Kanton-Hinweis «Wird mit der Adresssuche ausgefüllt.» steht weiter da, obwohl die Suche nicht ging (P-3). Nicht gespeichert.

## Verwirrung

- «Gebäuderegister» (Einleitung) und «eidgenössisches Gebäude- und Wohnungsregister (GWR)» (Hilfetext) sind dasselbe. Verstanden habe ich es, aber zwei Namen für eine Sache lassen mich kurz zögern.
- «Nummer des gewählten Gebäudes im Register» meint wohl den EGID. Für mich ist das verständlich genug.
- «Gebäude erfassen» (Liste) und «Neues Gebäude» (Seite) sind zwei Namen für denselben Weg. Das hat mich nur leicht irritiert.

## Fehlerrisiken

- Ist das Register auch im Betrieb nicht erreichbar (wie hier), sieht der Verwalter die versprochene Übernahme der Wohnungen nie. Er muss alle Wohnungen einzeln anlegen, ohne zu erfahren, ob das Problem bei ihm oder bei Dwello liegt.
- Kanton von Hand: Wer dem Hinweis «Wird mit der Adresssuche ausgefüllt» glaubt, lässt «Kanton wählen» stehen und wundert sich dann über die Meldung beim Speichern (Speichern nicht geprüft).
- Datenschutz: Ein vorsichtiger Verwalter, der nur «den Suchbegriff» erwartet, gibt vielleicht eine Adresse ein, die er gar nicht übermitteln wollte. Die Teile davon sind dann schon draussen, bevor er fertig getippt hat.

## Vorschläge

- **P-1:** Reproduktion: Persona-Stack starten, «Neues Gebäude» öffnen, «Seebahnstrasse 155 Zürich» eintippen, und es kommt 502 «unreachable». Prüfen, ob der Backend-Server im Stack `HTTPS_PROXY` und das CA-Bundle verwendet. Danach die Persona-Runde für Teil 1 wiederholen. Wenn es an der Umgebung liegt, im Persona-README vermerken, wie der Stack das echte Register erreicht.
- **P-2:** Reproduktion: Suchfeld, langsam tippen (etwa 400 ms pro Taste), die Netzwerkanfragen zeigen eine pro Buchstabe. Hilfreich wäre ein längeres Warten nach dem letzten Tastendruck und eine Mindestlänge (etwa Strasse und Hausnummer). Oder die Datenschutzerklärung sagt ehrlich: «die Eingabe, auch während Sie tippen».
- **P-3:** Reproduktion: Suche schlägt fehl (500 erzwingen), der Kanton-Hinweis bleibt «Wird mit der Adresssuche ausgefüllt.». Besser wäre ein Text wie «Wird mit der Adresssuche ausgefüllt; ohne Treffer wählen Sie ihn hier.»
- **P-4:** Reproduktion: Datenschutz → «Datenschutzerklärung von swisstopo», es öffnet sich die englische Seite «legal framework». Besser auf die deutsche Datenschutzerklärung von swisstopo bzw. geo.admin.ch verlinken.

## Nicht geprüft

- Die Vorschläge zu Gebäudetyp, Baujahr, Wohnungsnummern, Stockwerk, Fläche und Zimmeranzahl sowie die Hinweise nach der Auswahl eines Treffers: Das Register war vom Server aus nicht erreichbar (P-1), es gab also nie einen Treffer.
- Ob beim Auswählen eines Treffers tatsächlich nur die Gebäudenummer an swisstopo geht (zweiter Teil der Datenschutzaussage): Es gab nichts zum Auswählen.
- Was der Server von Dwello an geo.admin.ch weitergibt: Diese Anfrage sehe ich im Browser nicht. Die Aussage zur Server-IP kann ich nur von der Browserseite her bestätigen.
- Speichern: laut Auftrag nicht.

## Runde 2

Gleiche Persona, Desktop 1440 × 900, Maus. Das echte Register (geo.admin.ch) war diesmal erreichbar. Ich habe nur geschaut und nichts gespeichert. Um die Fehlermeldungen zu sehen, musste ich «Gebäude und Wohnungen erstellen» drücken. Das habe ich nur getan, wenn ein Wert sicher abgelehnt wird: der Gebäudename war leer oder eine Fläche war «abc», was die erste Prüfung schon abgelehnt hatte. Jede dieser Anfragen kam mit Fehlern zurück. Beim ersten Versuch habe ich die Anfrage im Browser selbst abgebrochen.
Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/7dafbd2e-3753-5fd4-bcb4-6211ba03db69/scratchpad/weber-479/r2/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | – | Neues Gebäude | Behoben: Beide Suchen liefern Treffer aus dem Register. |
| P-5 | Minor | Neues Gebäude, Wohnungen | Bei Fläche «0», «0,0» oder «-5» steht «Geben Sie die Fläche als Zahl in m² ein, z. B. 72.5.». Ich habe aber eine Zahl in m² eingegeben. Die Meldung sagt nicht, was falsch ist (die Fläche muss grösser als 0 sein). |
| P-6 | Minor | Neues Gebäude, Wohnungen | Bei Zimmeranzahl «0» steht «Geben Sie die Zimmeranzahl in halben Zimmern ein, z. B. 3.5.». 0 ist ein Vielfaches von halben Zimmern, der wahre Grund (mindestens ein halbes Zimmer) fehlt. Bei «3.25», «3,25» und «abc» passt dieselbe Meldung dagegen. |
| P-7 | Minor | Neues Gebäude, Wohnungen | Unplausible Werte gehen ohne Rückfrage durch: Fläche «3.25» (m²), «99999», Zimmeranzahl «25» und «0,5» bekamen keine Meldung, während die abgelehnten Felder derselben Anfrage markiert waren. Die Flächen gehen später in die Verteilung der Nebenkosten ein. Ein Tippfehler (722 statt 72) bleibt so unbemerkt. |
| P-8 | Minor | Neues Gebäude, Wohnungen | Das Feld «Fläche» nennt keine Einheit und hat keinen Hilfetext. Dass m² gemeint sind (Wohnfläche? Nettofläche?), steht erst in der Fehlermeldung. |
| P-9 | Minor | Neues Gebäude, Adresssuche | «Bernstrasse 10, 3005 Bern» liefert als ersten Treffer «Bernastrasse 10», danach andere Strassen mit Nr. 10. Ein Hinweis, dass es keinen genauen Treffer gibt, fehlt. Wer den ersten Treffer anklickt, bekommt Gebäudename und Strasse «Bernastrasse 10» und die 14 Wohnungen eines anderen Hauses. |
| P-10 | Minor | Neues Gebäude, Wohnungen | Die Wohnungsnummern aus dem Register sind bei Bern «40100», «41200», «43300» usw. Das sind offenbar amtliche Nummern, nicht die Bezeichnungen, die ein Verwalter im Mietvertrag führt («EG links»). Nirgends steht, woher die Nummer kommt und dass man sie ändern darf. |
| P-11 | Nit | Neues Gebäude | Bernastrasse 10: Das Baujahr bleibt leer, ohne Hinweis, dass das Register keines kennt. Ich kann nicht unterscheiden, ob es fehlt oder nicht übernommen wurde. |
| P-12 | Nit | Neues Gebäude, Wohnungen | Die Reihenfolge der Wohnungen ist bei Bern nicht sortiert: «42200» steht vor «42100». |
| P-13 | Nit | Neues Gebäude, Wohnungen | Der Hinweis «Im Register ohne halbe Zimmer: bitte prüfen» steht bei jeder Wohnung, bei Bern 14-mal. Er ist im Telegrammstil geschrieben. Ein Satz oben in der Gruppe würde reichen und könnte ausgeschrieben sein («Das Register kennt keine halben Zimmer: aus 3½ wird 3.»). |

### Beobachtungen (Runde 2)

- **Seebahnstrasse 155 Zürich:** genau ein Treffer, 8003 Zürich (ZH). Vorschlag: Mehrfamilienhaus, Baujahr 1932, acht Wohnungen 101/102 bis 401/402, je zwei pro Stockwerk 1.–4. OG, alle 72 (m²) und 3 Zimmer. Das ist für einen Zürcher Blockrand der 1930er-Jahre plausibel. Die Nummer passt zum Stockwerk (101 → 1. OG, 401 → 4. OG). Ob «3 Zimmer» in Wahrheit 3½ sind, sagt der Hinweis zu Recht: selbst prüfen.
- **Bernastrasse 10, 3005 Bern:** Mehrfamilienhaus ohne Baujahr, 14 Wohnungen: vier im EG, vier im 1. OG, drei im 2. OG, drei im 3. OG, je 22 oder 35 (m²) mit 1 oder 2 Zimmern. Kleinwohnungen dieser Grösse sind möglich. Die Stockwerke passen zur zweiten Ziffer der Nummer (40… EG, 41… 1. OG, 43… 3. OG).
- Nach der Wahl eines Treffers werden Gebäudename (= Strasse), Strasse, PLZ, Ort, Kanton, Gebäudetyp und Baujahr ausgefüllt. Der Button heisst jetzt «Gebäude und Wohnungen erstellen». Das finde ich klar.
- Die Hinweise nach der Wahl, wörtlich:
  - «Das Gebäuderegister enthält nur Wohnungen. Erfassen Sie Läden, Büros und andere vermietete Räume nach dem Speichern als eigene Wohnung.» Klar und richtig, und ich weiss, was ich tun muss.
  - «Prüfen Sie die Angaben: Gemeinde oder Kanton tragen sie ins Register ein, sie können veraltet sein.» Ehrlich, und so verstehe ich es auch.
  - «Lassen Sie nur Wohnungen weg, die es nicht mehr gibt. Wohnungen, die Sie selbst nutzen oder die leer stehen, gehören dazu: ihren Anteil tragen Sie.» Inhaltlich richtig: Der Vermieter trägt die Nebenkosten der leeren und der selbst genutzten Wohnung. Die Begründung steht dabei, das schätze ich.
- Wohnung abwählen («Wohnung übernehmen» ausschalten) graut die Felder aus. Ein Unsinnswert («abc») in einer abgewählten Wohnung wird dann nicht mehr geprüft. Das ist richtig so.
- Komma und Punkt gelten beide als Dezimaltrennzeichen: «3,25» wird wie «3.25» abgelehnt, «3,5» und «72,5» werden angenommen. Die Beispiele in den Meldungen zeigen nur den Punkt («72.5», «3.5»). Mich stört das nicht, weil beides geht.
- Geprüft wird erst beim Absenden, nicht schon beim Verlassen des Felds. Danach steht die Meldung rot direkt unter dem Feld, das Feld ist als ungültig markiert und rot umrandet. Der Fokus springt auf das erste falsche Feld, bei Bern bis hinunter zu Wohnung 43300 (Screenshot `val4-viewport.png`). Eine Sammelmeldung oben gibt es nicht. Dank dem Fokussprung vermisse ich sie kaum.
- Eine leere Wohnungsnummer wird mit «Wohnungsnummer ist erforderlich.» abgelehnt. Das ist gut.
- Stockwerk-Auswahl: UG, EG, 1.–6. OG. Bei einem Haus mit 7 und mehr Geschossen weiss ich nicht, was passiert (nicht prüfbar).
- Während meiner Runde hat eine andere Persona das Gebäude «Seebahnstrasse 155» angelegt (7 Wohnungen, 20:16). Meine Anfragen kamen alle mit Fehlern zurück. Danach zeigt die Suche unter dem Feld «Diese Adresse ist schon als Gebäude «Seebahnstrasse 155» erfasst.» mit dem Link «Seebahnstrasse 155» öffnen. Das ist ein sehr guter Hinweis. Der Button «Gebäude und Wohnungen erstellen» bleibt trotzdem aktiv. Ob ein Doppel tatsächlich gespeichert würde, habe ich nicht geprüft.
- Beim Tippen mit 60 ms pro Taste ging nur eine Suche hinaus. Langsames Tippen (P-2) habe ich nicht wiederholt.
- P-3 besteht weiter: Beim Kanton steht immer noch «Wird mit der Adresssuche ausgefüllt.».

### Aufgabe geschafft (Runde 2): ja

Beide Adressen gesucht, Vorschläge und Hinweise beurteilt, Fehlermeldungen für Fläche und Zimmeranzahl mit «0», «3.25», «abc» und weiteren Werten gesehen.

### Aufwand (Runde 2)

Etwa 20 Minuten, 8 Durchläufe: zwei Suchen ohne Auswahl, zwei mit Auswahl, drei Absende-Versuche mit falschen Werten, Kontrolle der Gebäudeliste.

### Ablauf (Runde 2)

1. **«Bernstrasse 10, 3005 Bern» eingetippt.** Erwartet: das Haus oder die Meldung «kein Treffer». Gesehen: acht Treffer in 3005 Bern, zuoberst «Bernastrasse 10», danach Bernastrasse 10a, Brückenstrasse 10, Justingerweg 10 und weitere (`bern-a-list.png`). Eine «Bernstrasse» ist nicht dabei, und kein Hinweis sagt das (P-9).
2. **«Bernastrasse 10» gewählt.** Erwartet: Gebäudedaten und Wohnungen. Gesehen: Name, Adresse, Kanton BE und Mehrfamilienhaus sind ausgefüllt, das Baujahr ist leer (P-11). Dazu der blaue Hinweis zu Läden/Büros und 14 Wohnungsblöcke mit «Wohnung übernehmen» angehakt, Nummer, Stockwerk, Fläche ohne Einheit (P-8) und Zimmeranzahl mit Hinweis (P-13) (`bern-b-chosen.png`). Nummern wie «40100» (P-10), Reihenfolge leicht durcheinander (P-12).
3. **«Seebahnstrasse 155 Zürich» eingetippt und gewählt.** Erwartet: ein Treffer. Gesehen: genau einer, 8003 Zürich. Mehrfamilienhaus, Baujahr 1932 und 8 Wohnungen wie oben beschrieben (`see-b-chosen.png`). Plausibel.
4. **Falsche Werte eingetragen, erster Versuch (Seebahnstrasse):** Fläche «0», «3.25», «abc», «72,5» und Zimmeranzahl «0», «3.25», «abc», «3,5». Beim Verlassen der Felder erwartet: eine Meldung. Gesehen: nichts. Beim Absenden sah ich, dass die Anfrage an den Server geht. Ich habe sie im Browser abgebrochen, um nichts zu speichern.
5. **Zweiter Versuch, mit leerem Gebäudenamen** (damit sicher nichts gespeichert wird). Gesehen: «Gebäudename ist erforderlich.», Fokus auf dem Namen. Fläche «0» und «abc» bekamen «Geben Sie die Fläche als Zahl in m² ein, z. B. 72.5.» (P-5 für die 0). Zimmeranzahl «0», «3.25» und «abc» bekamen «Geben Sie die Zimmeranzahl in halben Zimmern ein, z. B. 3.5.» (P-6 für die 0). Fläche «3.25» blieb ohne Meldung (P-7), ebenso «3,5» und «72,5» (`val2.png`).
6. **Dritter Versuch, wieder ohne Namen:** Zimmer «3,25» abgelehnt, Fläche «0,0» und «-5» abgelehnt, ohne Meldung blieben Zimmer «0,5» und «25» und Fläche «99999» (P-7). Leere Wohnungsnummer: «Wohnungsnummer ist erforderlich.». Abgewählte Wohnung mit «abc»: ohne Meldung, richtig (`val3.png`).
7. **Bern, nur Fläche «abc» in der letzten Wohnung 43300.** Erwartet: Ich werde zum Fehler geführt. Gesehen: Die Seite scrollt hinunter, der Fokus steht im Feld, die Meldung steht darunter (`val4-viewport.png`).
8. **Gebäudeliste kontrolliert:** Von mir ist nichts gespeichert. Das Gebäude «Seebahnstrasse 155» stammt laut Erfassungszeit von einer anderen Persona.

### Verwirrung (Runde 2)

- «Fläche»: m²? Wohnfläche oder Nettowohnfläche? Woher stammt sie im Register?
- «Im Register ohne halbe Zimmer: bitte prüfen»: Ich verstehe es erst beim zweiten Lesen. Gemeint ist wohl: 3½ steht im Register als 3.
- «Wohnungsnummer» «40100»: Ist das die amtliche Nummer (EWID/Wohnungsnummer GWR) oder meine eigene?
- Die Fehlermeldung bei «0» erklärt das Format, nicht die Grenze (P-5, P-6).

### Fehlerrisiken (Runde 2)

- Wer nach einer Strasse sucht, die es so nicht gibt, übernimmt mit einem Klick ein fremdes Haus samt Wohnungen (P-9).
- Flächen mit Tippfehler (3.25 statt 32.5, 722 statt 72) werden ohne Rückfrage angenommen und verfälschen später die Verteilung nach Fläche (P-7).
- Die Zimmeranzahl aus dem Register ist oft um ein halbes Zimmer zu tief. Wer den Hinweis überliest, übernimmt sie falsch in Mietverträge.
- Ein bereits erfasstes Gebäude wird zwar gemeldet, aber der Button bleibt aktiv. Ein Doppel scheint möglich (nicht geprüft).

### Vorschläge (Runde 2)

- **P-5:** Reproduktion: Seebahnstrasse 155 wählen, Fläche «0», absenden. Besser: «Die Fläche muss grösser als 0 sein. Geben Sie sie in m² ein, z. B. 72.5.»
- **P-6:** Reproduktion: Zimmeranzahl «0», absenden. Besser: «Geben Sie mindestens ein halbes Zimmer ein, in halben Schritten, z. B. 3.5.»
- **P-7:** Reproduktion: Fläche «3.25» bzw. «99999», Zimmer «25». Es kommt keine Meldung. Hilfreich wäre eine Warnung bei auffälligen Werten (etwa unter 10 m², über 500 m², mehr als 15 Zimmer), die man bestätigen kann, ohne den Wert zu verbieten.
- **P-8:** Reproduktion: Treffer wählen, das Feld «Fläche» ansehen. Besser: Bezeichnung «Fläche (m²)» und ein kurzer Hilfetext, welche Fläche gemeint ist.
- **P-9:** Reproduktion: «Bernstrasse 10, 3005 Bern» suchen, der erste Treffer heisst «Bernastrasse 10». Hilfreich: ein Satz über der Liste, wenn keine Adresse genau passt («Keine genaue Übereinstimmung. Prüfen Sie Strasse und Hausnummer.»).
- **P-10:** Reproduktion: Bernastrasse 10 wählen, die Nummern lauten 40100 usw. Hilfetext beim Feld: «Nummer aus dem Register. Ändern Sie sie in die Bezeichnung, die Sie verwenden, z. B. EG links.»
- **P-11:** Reproduktion: Bernastrasse 10 wählen, das Baujahr bleibt leer. Hinweis «Im Register ist kein Baujahr eingetragen.»
- **P-12:** Reproduktion: Bernastrasse 10, 2. OG. Sortieren nach Stockwerk und Nummer.
- **P-13:** Reproduktion: einen beliebigen Treffer wählen. Den Hinweis einmal oben in der Gruppe ausgeschrieben zeigen, nicht 14-mal.

### Nicht geprüft (Runde 2)

- Speichern (laut Auftrag nicht). Ob «3,5» als 3,5 gespeichert wird, ob ein Doppel des bestehenden Gebäudes gespeichert würde und was nach dem Speichern auf der Gebäudeseite steht, weiss ich deshalb nicht. Dass das Komma als Dezimalzeichen gilt, schliesse ich nur daraus, dass «3,25» abgelehnt und «3,5» angenommen wird.
- Hinweise zu fehlenden Angaben einer einzelnen Wohnung (z. B. ohne Fläche im Register): Beide Häuser hatten vollständige Angaben.
- Häuser mit mehr als 6 Obergeschossen oder ohne Wohnungen im Register (Einfamilienhaus, reines Geschäftshaus): nicht gesucht.
- P-2 (eine Suche pro Buchstabe bei langsamem Tippen) und P-4 (swisstopo-Link) nicht wiederholt, weil nicht Teil dieser Runde.
