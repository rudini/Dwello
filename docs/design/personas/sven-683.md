# Sven: Begründung der Umlagefähigkeit bei Kategorien «Von Dwello» (#683)

Desktop 1440 × 900, nur Tastatur, beurteilt nach dem Accessibility-Tree (Name, Beschreibung, Rolle, Zustand des fokussierten Elements; dazu die Live-Regionen). Nichts gespeichert. Skripte und Screenshots: `/tmp/claude-scratch/sven-683/`.

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Kategorie bearbeiten (Feuerlöscher-Wartung, Lift) | Sobald ich mit den Pfeiltasten von Dwellos Voreinstellung abweiche, verschwindet die Begründung ganz: aus der Beschreibung der Gruppe und von der Seite. Angesagt wird nur die neue Wahl («Umlagefähig, ausgewählt, Die Kosten fliessen in die Nebenkostenabrechnung.»). Kein Hinweis, dass ich jetzt von Dwellos Einschätzung abweiche, und keine Ansage in der Live-Region. Genau in dem Moment, in dem ich die Begründung brauche, um die Abweichung abzuwägen, ist sie weg. |
| P-2 | Minor | Kategorie bearbeiten | Die Begründung hängt hinten an der allgemeinen Hilfe der Gruppe: Beim Betreten der Gruppe höre ich zuerst rund 800 Zeichen allgemeinen Text (Art. 257a–257b, Heizung, Lift, Wasser, Abwasser, Kehricht, Mietvertrag). Erst danach folgt der Text zu dieser Kategorie, und zwar ohne das Wort «Begründung», das Sehende als Überschrift sehen. Ich merke nicht, wo die allgemeine Hilfe aufhört und Dwellos Begründung für diese Kategorie beginnt. |
| P-3 | Minor | Kategorie bearbeiten | Was passiert, wenn ich umstelle, steht nur im Hinweis oben auf der Seite. Bei Feuerlöscher-Wartung: «Wählen Sie «Umlagefähig», schuldet der Mieter … trotzdem nicht …; schon erfasste bleiben nicht umlagefähig». Bei Lift: «Stellen Sie die Kategorie auf nicht umlagefähig, fliessen ihre schon erfassten Rechnungen nicht mehr in neue Nebenkostenabrechnungen …». Dieser Hinweis gehört weder zur Gruppe noch zu einer Wahl. Wer mit Tab durch das Formular geht, hört ihn beim Umstellen nie. |

## Beobachtungen

- Mit Tab von der Übersicht: 13 Tabs bis zum Link «Kategorien» in der Hauptnavigation. In der Liste der Kategorien braucht es 43 Tabs bis «Feuerlöscher-Wartung» und 28 bis «Lift». Die Liste hat keine Überschriften pro Eintrag, also springe ich mit Tab oder über die Listenpunkte.
- Nach dem Laden der Bearbeitungsseite liegt der Fokus auf dem Dokument (keine Rolle). Die Live-Region meldet aber den Titel «Feuerlöscher-Wartung bearbeiten - Dwello», ich weiss also, wo ich bin. Danach führt Tab wieder über «Zum Inhalt springen» und die ganze Navigation: 22 Tabs bis zur Wahl.
- Die Gruppe ist ein sauberer `radiogroup` mit dem Namen «Umlagefähige Nebenkosten». Jede Wahl hat einen Namen und eine eigene Beschreibung: «Umlagefähig» mit «Die Kosten fliessen in die Nebenkostenabrechnung.», «Nicht umlagefähig» mit «Die Kosten trägt der Vermieter.». Die Pfeiltasten wechseln die Wahl und den Fokus wie erwartet; Tab verlässt die Gruppe zur Reihenfolge.
- Im Accessibility-Tree stehen der Name der Wahl und ihre Beschreibung zusätzlich als Text («Umlagefähig Die Kosten fliessen …»). Im Lesemodus höre ich den Namen deshalb doppelt.
- «Begründung» ist auf der Seite ein Absatz, keine Überschrift. Mit der Überschriften-Navigation finde ich sie nicht.
- Das deaktivierte Häkchen «Heizkosten nach dem Heizprofil verteilen» bekommt keinen Fokus. Seine Erklärung höre ich nur im Lesemodus.
- Das Feld «Reihenfolge» meldet `valuemax 0` (bei Wert 108 bzw. 6). Das ist unwichtig, aber seltsam.
- Mit «Abbrechen» nach einer ungespeicherten Umstellung kam ich ohne Rückfrage zurück zur Liste. Danach liegt der Fokus wieder auf dem Dokument, angesagt wird «Kategorien - Dwello». Die Liste zeigt danach unverändert: Lift «Umlagefähig, 2 Rechnungen», Feuerlöscher-Wartung «Nicht umlagefähig, 0 Rechnungen», Filter «Umlagefähig (12)» und «Nicht umlagefähig (9)».

## Was angesagt wird

**Feuerlöscher-Wartung**, voreingestellt «Nicht umlagefähig»:
- Fokus auf der Wahl: «Nicht umlagefähig, Optionsfeld, ausgewählt», Beschreibung «Die Kosten trägt der Vermieter.».
- Gruppe «Umlagefähige Nebenkosten», Beschreibung: zuerst die allgemeine Hilfe, dann «Ob die Wartung von Feuerlöschern mit dem Gebrauch zusammenhängt (Art. 257a Absatz 1 Obligationenrecht, OR), ist umstritten (Mieterinnen- und Mieterverband, Merkblatt «Zulässige und unzulässige Nebenkosten»). Nach dem Merkblatt gehört Brandschutz, der auch bei leerem Gebäude nötig ist, nicht zu den Nebenkosten. Dwello folgt dem Merkblatt: Die Wartung ist also nicht umlagefähig.»
- Ich erfahre also, warum Dwello so einstuft: ja, mit Quelle und Schluss.
- Pfeil hoch: «Umlagefähig, ausgewählt, Die Kosten fliessen in die Nebenkostenabrechnung.» Die Gruppenbeschreibung enthält jetzt nur noch die allgemeine Hilfe, die Begründung fehlt. Die Live-Region bleibt stumm.
- Pfeil zurück auf «Nicht umlagefähig»: Die Begründung ist wieder da.

**Lift**, voreingestellt «Umlagefähig»:
- Fokus auf der Wahl: «Umlagefähig, ausgewählt», Beschreibung «Die Kosten fliessen in die Nebenkostenabrechnung.».
- Gruppenbeschreibung: zuerst die allgemeine Hilfe, dann «Strom, Notruftelefon und Wartung des Lifts hängen mit dem Gebrauch zusammen (Art. 257a Absatz 1 Obligationenrecht, OR); Reparaturen und Ersatzteile trägt der Vermieter. Deckt ein Vollservicevertrag auch Reparaturen, ist nur sein Anteil für die Wartung umlagefähig: Erfassen Sie unter «Lift» nur diesen Anteil. Strom, Notruftelefon und Wartung sind also umlagefähig.» Die Einstufung wird also begründet.
- Pfeil auf «Nicht umlagefähig»: «Nicht umlagefähig, ausgewählt, Die Kosten trägt der Vermieter.» Die Begründung ist wieder weg, und es kommt keine Ansage. Dass schon erfasste Lift-Rechnungen (2 Stück) dann nicht mehr in neue Abrechnungen fliessen, steht nur im Hinweis oben.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 6 Durchläufe. Je Kategorie: 13 Tabs plus Enter bis zur Liste, 43 Tabs (Feuerlöscher-Wartung) bzw. 28 (Lift) plus Enter, 22 Tabs bis zur Wahl, 2 Pfeiltasten, 5 Tabs plus Enter auf «Abbrechen».

## Ablauf

- Bearbeitungsseite geladen. Erwartet: Fokus auf der Überschrift oder am Anfang des Inhalts. Gesehen: Fokus auf dem Dokument, der Titel kommt über die Live-Region; Tab startet wieder bei «Zum Inhalt springen».
- Erste Wahl erreicht. Erwartet: eine Begründung, klar als solche erkennbar. Gesehen: Die Begründung steht am Ende einer sehr langen Gruppenbeschreibung, ohne das Wort «Begründung» (P-2).
- Mit Pfeiltaste umgestellt. Erwartet: Die Begründung bleibt, und ein Hinweis sagt, dass ich jetzt von Dwellos Einschätzung abweiche und was das für schon erfasste Rechnungen bedeutet. Gesehen: Die Begründung verschwindet, und es kommt keine Ansage (P-1, P-3).
- «Abbrechen» nach ungespeicherter Umstellung. Erwartet: vielleicht eine Rückfrage. Gesehen: Ich kam direkt zurück zur Liste, nichts gespeichert. Für mich in Ordnung.

## Vorschläge

- **P-1:** Reproduktion: Einstellungen → Kategorien → «Feuerlöscher-Wartung» → Tab bis zur Wahl «Nicht umlagefähig» → Pfeil hoch. Die Gruppenbeschreibung verliert die Begründung, und auf dem Screenshot `04-feuer-switched.png` fehlt der Absatz «Begründung». Bei «Lift» mit Pfeil runter gleich. Hilfreich wäre: Die Begründung bleibt stehen. Zusätzlich gehört ein Satz wie «Sie weichen von Dwellos Einschätzung ab: …» an die gewählte Option (aria-describedby) oder wird per Live-Region angesagt.
- **P-2:** Reproduktion: Tab auf die Wahl, Gruppenbeschreibung anhören. Hilfreich wäre: Die Begründung zuerst oder als eigene Beschreibung der Gruppe, eingeleitet mit «Begründung:» (in der Beschreibung oder als Überschrift). Die allgemeine Hilfe kann danach kommen oder gekürzt werden.
- **P-3:** Reproduktion: Bei «Lift» mit Tab bis zur Wahl gehen, auf «Nicht umlagefähig» umstellen. Der Satz über schon erfasste Rechnungen kommt nie. Hilfreich wäre: Diesen Folge-Satz per aria-describedby an die Wahl hängen, die von Dwellos Voreinstellung abweicht.

## Nicht geprüft

- Speichern: Der Auftrag war nur ansehen, darum weder die Rückfrage noch die Meldung nach dem Speichern geprüft.
- Einen echten Screenreader (NVDA, VoiceOver) habe ich nicht genutzt. Die Ansagen sind aus Name, Beschreibung und Zustand im Accessibility-Tree von Chromium abgeleitet; Reihenfolge und Wortlaut eines echten Screenreaders können abweichen.
- Andere Kategorien «Von Dwello» und eigene Kategorien habe ich nicht geprüft.
