# Persona-Lauf: Helga – Issue #176 (Umlagefähigkeit beim Erfassen einer Kategorie, KI-Prüfung)

Persona: Helga, 68, Desktop 1440 × 900 bei 150 % Zoom (Stichprobe 200 %), Maus.
App: Persona-Stack auf http://localhost:3300 (Demodaten). Skripte und Screenshots: `/tmp/claude-0/-home-user-Dwello/fbb18b34-b688-5fdb-9b9f-9f01da7bd45c/scratchpad/helga-176/`.

Gespeichert habe ich: «Treppenhausreinigung Helga» (Umlagefähig), «Dachsanierung Helga» (Nicht umlagefähig), «Bewachung Helga» (Nicht umlagefähig, selbst entschieden).

## Befunde

| ID | Schweregrad | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Neue Kategorie | Ändere ich den Namen, nachdem die KI geprüft hat, bleiben Vorschlag, Begründung und die gesetzte Wahl stehen. Ich habe «Treppenhausreinigung» prüfen lassen und dann den Namen auf «Dachsanierung» geändert: Dort stand weiter «Vorschlag der KI: Umlagefähig» mit der Begründung zur Treppenhausreinigung, und «Umlagefähig» war gewählt. So hätte ich eine Dachsanierung den Mietern verrechnet. |
| P-2 | Minor | Neue Kategorie | Die KI setzt ihre Wahl gleich selbst («Umlagefähig» war danach angewählt). Im Kasten steht nur «Vorschlag der KI: …». Dass die Wahl schon gesetzt ist und ich sie bestätigen oder ändern muss, steht nirgends. Ich hätte gedacht, ich muss noch selbst klicken. Wer schnell ist, speichert, ohne den Vorschlag gelesen zu haben. |
| P-3 | Minor | Neue Kategorie | Der Hinweis ohne Vorschlag («Die KI ist nicht erreichbar oder ist sich nicht sicher.») sagt nicht, welcher der beiden Fälle vorliegt. Bei «nicht erreichbar» würde ich es nochmals versuchen, bei «nicht sicher» nicht. Bei der Entscheidung hilft er mir auch nicht: Er verweist nicht auf den Hilfetext darüber, und dort kommt Bewachung nicht vor. |
| P-4 | Minor | Neue Kategorie | Der Hilfetext bei der Wahl ist ein langer Block mit sechs Zeilen und Gesetzesartikeln (Art. 257a–257b OR, Abs. 2, Grundgebühren nach Wert der Liegenschaft, Regenwasser). Bei 150 % habe ich ihn zweimal lesen müssen. Für meinen Fall (Bewachung) hilft er mir trotzdem nicht. Kurze Beispiele «Umlagefähig: …» / «Nicht umlagefähig: …» würde ich schneller verstehen. Das Wort «Liegenschaft» steht dort, sonst sagt Dwello überall «Gebäude». |
| P-5 | Nit | Neue Kategorie | Klicke ich «Von der KI prüfen lassen» ohne Namen, kommt nur «Name ist erforderlich» beim Namen. Dass die KI den Namen braucht, um zu prüfen, steht nicht da. Ich habe es mir aber gedacht. |
| P-6 | Nit | Neue Kategorie | Die Meldung, wenn nichts gewählt ist («Wählen Sie, ob die Kosten umlagefähig sind.»), ist klar und steht rot direkt unter der Wahl, der Fokus springt dorthin. Gut. Ein Satz wie «Unsicher? Lassen Sie die KI prüfen.» würde mir den Knopf darunter zeigen. Nachdem die KI ohne Vorschlag geantwortet hat, verschwindet die rote Meldung, obwohl ich noch nichts gewählt habe. Der gelbe Hinweis sagt dasselbe, also ist das nicht schlimm. |

## Beobachtungen

- In der schmalen Ansicht (150 %) steht «Einstellungen» nicht im Menü links (☰), sondern nur im Benutzermenü unter «Vera Verwalter». Dort habe ich zuerst gesucht und nichts gefunden.
- Mein erster Klick auf ☰, gleich nachdem die Seite geladen war, öffnete das Menü nicht. Erst ein zweiter Versuch nach dem vollständigen Laden ging.
- In der Kategorienliste steht «Gartenpflege Sven» (Nicht umlagefähig) zuoberst, eine Kategorie von jemand anderem. Ich habe sie nicht angefasst.
- Die Begründungen der KI tönen sicher und nennen Gesetzesartikel. Ob sie stimmen, kann ich nicht beurteilen. Dass sie von der KI kommen, steht aber klar da.
- Auf den Ganzseiten-Screenshots erscheint die Kopfzeile mitten im Bild. Das kommt vom Screenshot-Werkzeug, im Browser sah es normal aus.

## Aufgabe geschafft: ja

## Aufwand

Etwa 15 Minuten, 8 Durchläufe. Das Erfassen selbst dauert pro Kategorie 4 Schritte (Name, KI prüfen, Vorschlag lesen bzw. wählen, speichern). Die KI antwortete jedes Mal in unter einer Sekunde. Am meisten Zeit kostete das Suchen der Einstellungen.

## Ablauf

1. **Übersicht → Einstellungen.** Erwartet: Eintrag im Menü links. Gesehen: im Menü ☰ nur Verwalten/Nebenkosten. «Einstellungen» fand ich unter «Vera Verwalter».
2. **Einstellungen → Kategorien → «Kategorie erfassen».** Erwartet: ein Formular. Gesehen: «Neue Kategorie» mit Name, Beschreibung, dem Abschnitt «Umlagefähige Nebenkosten» (langer Hilfetext, zwei grosse Kästchen «Umlagefähig – Die Kosten fliessen in die Nebenkostenabrechnung.» / «Nicht umlagefähig – Die Kosten trägt der Vermieter.», keines vorgewählt) und darunter dem Knopf «Von der KI prüfen lassen» (Screenshot 06). Die beiden Kästchen sind gross und gut lesbar, gefällt mir.
3. **KI prüfen ohne Namen.** Erwartet: ein Hinweis. Gesehen: Das Namensfeld wird rot, «Name ist erforderlich» (07). Verständlich.
4. **«Treppenhausreinigung Helga» → KI prüfen.** Erwartet: Vorschlag, ich wähle dann. Gesehen: blauer Kasten «Vorschlag der KI: Umlagefähig – Laufende Betriebskosten aus dem Gebrauch der Mietsache (Art. 257b Abs. 1 OR).», und «Umlagefähig» war schon angewählt (09). Das war überraschend (P-2), aber richtig.
5. **Gegenprobe:** «Nicht umlagefähig» angeklickt. Der Kasten bleibt mit dem Vorschlag der KI stehen, meine Wahl gilt. Danach wieder «Umlagefähig» gewählt und gespeichert. Gesehen: zurück in der Liste, Meldung «Kategorie «Treppenhausreinigung Helga» gespeichert», in der Liste «Umlagefähig».
6. **«Dachsanierung Helga» → KI prüfen.** Gesehen: «Vorschlag der KI: Nicht umlagefähig – Erhalt und Erneuerung des Gebäudes hängen nicht mit dem Gebrauch zusammen (Art. 257a Abs. 1 OR).», «Nicht umlagefähig» angewählt. Das leuchtet mir ein. Gespeichert, in der Liste «Nicht umlagefähig».
7. **«Bewachung Helga» ohne Wahl speichern.** Erwartet: Dwello hält mich auf. Gesehen: Die Seite bleibt, unter den Kästchen steht rot «Wählen Sie, ob die Kosten umlagefähig sind.», der Fokus springt auf die Wahl (13). Gut.
8. **KI prüfen für Bewachung.** Gesehen: gelber Kasten «Kein Vorschlag der KI – Die KI ist nicht erreichbar oder ist sich nicht sicher. Wählen Sie selbst, ob die Kosten umlagefähig sind.» (14). Die rote Meldung ist weg, nichts ist gewählt. Ich habe den Hilfetext gelesen: Bewachung kommt nicht vor. Zur Sicherheit habe ich «Nicht umlagefähig» gewählt, dann trage ich die Kosten selbst. Gespeichert, in der Liste «Nicht umlagefähig».
9. **Namen nach der Prüfung ändern (nicht gespeichert).** «Treppenhausreinigung» prüfen lassen, dann den Namen auf «Dachsanierung» geändert. Erwartet: Der Vorschlag verschwindet oder wird als veraltet markiert. Gesehen: Vorschlag «Umlagefähig» und die Begründung zum Treppenhaus bleiben stehen, «Umlagefähig» bleibt gewählt (15) → P-1.
10. **200 % Zoom.** Vorschlagskasten und Knopf gut lesbar, Knopf 48 px hoch, kein seitliches Scrollen (16).

## Verwirrung

- «Umlagefähig» kannte ich nur vage. Die Unterzeilen «Die Kosten fliessen in die Nebenkostenabrechnung.» / «Die Kosten trägt der Vermieter.» haben mir mehr geholfen als der lange Hilfetext.
- «Mietsache» (in der Begründung der KI) und «Liegenschaft» (im Hilfetext): Sind das dasselbe wie mein Gebäude bzw. meine Wohnung?
- «nicht erreichbar oder nicht sicher»: Was davon ist es jetzt, soll ich es nochmals versuchen?
- Hat die KI für mich schon entschieden, oder muss ich noch klicken?

## Fehlerrisiken

- Veralteter Vorschlag nach einer Namensänderung (P-1): Eine nicht umlagefähige Kategorie wird als umlagefähig gespeichert, und die Mieter zahlen Kosten, die sie nicht schulden.
- Die vorgewählte Wahl der KI (P-2) lädt dazu ein, ohne Lesen zu speichern.
- Bei «Kein Vorschlag» rät man (P-3/P-4). Ich habe vorsichtig «Nicht umlagefähig» gewählt. Jemand anderes wählt vielleicht das Gegenteil.

## Vorschläge

- **P-1:** Neue Kategorie → Name «Treppenhausreinigung» → «Von der KI prüfen lassen» → Name auf «Dachsanierung» ändern → Vorschlag und Wahl bleiben. Hilfreich: Ändert sich der Name nach der Prüfung, den Vorschlagskasten ausblenden oder als veraltet markieren («Der Name hat sich geändert. Lassen Sie die KI nochmals prüfen.») und die von der KI gesetzte Wahl zurücknehmen, solange ich sie nicht selbst angeklickt habe.
- **P-2:** Treppenhausreinigung prüfen lassen → «Umlagefähig» ist angewählt, ohne Hinweis. Hilfreich: im Kasten ein Satz wie «Dwello hat «Umlagefähig» für Sie gewählt. Prüfen Sie die Wahl oder ändern Sie sie.»
- **P-3:** «Bewachung Helga» → KI prüfen → gelber Kasten. Hilfreich: die beiden Fälle trennen («Die KI ist nicht erreichbar. Versuchen Sie es später nochmals.» bzw. «Die KI ist sich nicht sicher.») und auf den Hilfetext oder die Unterzeilen verweisen («Fragen Sie sich: Hängt es mit dem Gebrauch zusammen, oder erhält es das Gebäude?»).
- **P-4:** Neue Kategorie öffnen, Hilfetext unter «Umlagefähige Nebenkosten» lesen. Hilfreich: zuerst ein kurzer Satz, dann zwei kurze Beispiellisten, Gesetzesartikel und Sonderfälle (Wasser, Regenwasser) weiter unten oder kürzer. «Gebäude» statt «Liegenschaft».
- **P-5:** Ohne Namen «Von der KI prüfen lassen» klicken. Hilfreich: «Geben Sie zuerst einen Namen ein. Die KI prüft anhand des Namens.»
- **P-6:** Mit Namen, ohne Wahl «Kategorie speichern». Hilfreich: der Meldung «Unsicher? Lassen Sie die KI prüfen.» anfügen.

## Nicht geprüft

- Wie es beim Warten aussieht, wenn die KI länger braucht: Sie antwortete jedes Mal in unter einer Sekunde, ich habe keine Ladeanzeige gesehen.
- Ob die Beschreibung den Vorschlag der KI beeinflusst: Ich habe keine Beschreibung eingegeben.
- Das Bearbeiten einer bestehenden Kategorie (ob dort die Wahl und der KI-Knopf gleich aussehen): Das war nicht Teil der Aufgabe.
- Ein echter Ausfall der KI (Fehler 500): Der Auftrag nannte keine Anfrage, die fehlschlagen soll. Gesehen habe ich nur den Fall «nicht sicher».
- Andere Sprachen und Mobilansicht.
