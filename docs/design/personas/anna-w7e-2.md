# Anna, Runde w7e-2: Protokoll (wiedergefunden? Folge der Rücknahme verstanden?)

Persona: Anna, 29, Erstvermieterin, kommt nach Monaten zurück und weiss nichts mehr. Desktop 1440 × 900, die Protokollseite auch auf dem Handy (390 × 844). Ich habe nur geschaut und nichts gespeichert oder gelöscht. Eine Rechnung habe ich zum Bearbeiten geöffnet, aber nicht gespeichert.

Aufgabe: Von der Übersicht aus die Stelle finden, an der Dwello meine Anmeldungen und Änderungen auflistet. Den Eintrag zur wieder umlagefähigen Kategorie «Gartenpflege» lesen und sagen, ob ich verstehe, was er für ihre Rechnungen bedeutet.

Rückblick auf Runde 1: P-1 (Protokoll nicht auffindbar) und P-2 (Rücknahme nennt keine Folge).

| ID | Schwere | Bildschirm | Befund |
|---|---|---|---|
| P-1 | Major | Protokoll ↔ Rechnungen | Der Eintrag vom 27.09.2026, 04:35 sagt: «… ihre nicht umlagefähigen Rechnungen bleiben es». Der Eintrag davor sagt: «2 Rechnungen sind damit nicht mehr umlagefähig». Nach dem Protokoll müssten also 2 Gartenpflege-Rechnungen noch nicht umlagefähig sein. In «Rechnungen» mit dem Filter Kategorie «Gartenpflege» stehen aber alle 4 Rechnungen (Frühjahr und Herbst 2024 und 2025) auf «Umlagefähig». Auch in «Rechnung bearbeiten» ist bei «Gartenpflege Herbst 2025» das Häkchen «Umlagefähig» gesetzt. Ich weiss nicht, was stimmt: das Protokoll oder die Rechnungsliste. (Vermutlich passen die erfundenen Protokolleinträge der Demodaten nicht zu den Demo-Rechnungen. Für mich als Nutzerin ist es trotzdem ein Widerspruch.) |
| P-2 | Minor | Protokoll | Die Rücknahme nennt jetzt eine Folge, aber nur in einem schwer lesbaren Halbsatz. «ihre nicht umlagefähigen Rechnungen bleiben es» ist umständlich. «ihre» lese ich zuerst als «Ihre» (meine). Es fehlen die Zahl (welche 2?), die Namen oder ein Link zu den Rechnungen und ein Hinweis, was ich tun muss, damit sie wieder in die Abrechnung kommen. |
| P-3 | Minor | Übersicht → Einstellungen | Das Protokoll steht jetzt oben in «Einstellungen», als eigene Karte direkt unter «Stammdaten». Ohne Scrollen ist es sichtbar. Von der Übersicht, aus der Navigation und aus dem Benutzermenü führt aber noch immer nichts dorthin. Der Einleitungssatz von «Einstellungen» nennt das Protokoll nicht. Ich finde es nur, wenn ich auf die Idee komme, in «Einstellungen» zu suchen. |

## Beobachtungen

- Die Verschiebung nach oben hilft deutlich. In Runde 1 stand der Link unter «Einstellungen speichern», jetzt sehe ich ihn auf 1440 × 900 sofort (Karte «Protokoll» mit Kalendersymbol und dem Text «Anmeldungen und Änderungen, die Ihre Abrechnungen beeinflussen, mit Datum»).
- Die Karte steht in einem eigenen Kasten mit der Überschrift «Protokoll». Darin liegt nur eine Karte, die ebenfalls «Protokoll» heisst. Das Wort steht so doppelt da und wirkt etwas leer.
- Die Protokollseite hat jetzt eine Brotkrümelnavigation «Einstellungen › Protokoll» (Adresse `/config/audit-log`).
- Die Einträge sind unverändert: das Neueste oben, keine Markierung für die letzte Anmeldung, auf dem Handy ein grosser roter «Löschen»-Knopf pro Karte. Kein seitliches Scrollen auf 390 px (Seitenbreite 390).
- Die Hilfe erwähnt das Protokoll nicht. Das Wort «Protokoll» kommt dort nur als «Übergabeprotokoll» vor.
- «Rechnung bearbeiten» zeigt bei der Gartenpflege-Rechnung «Rechnung schon abgerechnet» mit einer klaren Anleitung (Entwürfe löschen, neu erstellen). Diese Erklärung hätte ich mir auch im Protokoll gewünscht.

## Aufgabe geschafft: teilweise

Das Protokoll habe ich gefunden, über Benutzermenü und «Einstellungen». Den Eintrag zur Gartenpflege verstehe ich sprachlich nach zweimaligem Lesen: Die Kategorie gilt wieder als umlagefähig, die vorher umgestellten Rechnungen aber nicht. Die Rechnungsliste zeigt jedoch alle Gartenpflege-Rechnungen als umlagefähig (P-1). Was das für meine Abrechnung heisst, kann ich deshalb nicht sicher sagen.

## Aufwand

Etwa 6 Minuten und 7 Bildschirme: Übersicht, Benutzermenü, Einstellungen, Protokoll, Kategorien, Rechnungen (gefiltert), Rechnung bearbeiten, dazu Hilfe und Protokoll auf dem Handy. Bis zum Protokoll brauchte ich 3 Schritte (Übersicht → Einstellungen → Protokoll), ohne Scrollen.

## Ablauf

1. **Übersicht** (`01-start.png`). Erwartet: «Zuletzt angemeldet …» oder «Letzte Änderungen». Gesehen: «Als Nächstes zu tun», Fristen, «Häufige Arbeiten», «Gebäude auf einen Blick». Kein Hinweis auf einen Verlauf. Auch die Navigation hat keinen Eintrag «Protokoll».
2. **Benutzermenü** (`02-usermenu.png`). Erwartet: «Aktivität» oder «Mein Konto». Gesehen: «Einstellungen» und «Abmelden». Ich versuche «Einstellungen», weil sonst nichts in Frage kommt.
3. **Einstellungen** (`03-config.png`). Erwartet: dass ich wieder lange suchen muss wie beim letzten Mal. Gesehen: Gleich unter «Stammdaten» steht der Kasten «Protokoll» mit dem Link «Protokoll» und dem Satz «Anmeldungen und Änderungen, die Ihre Abrechnungen beeinflussen, mit Datum». Ohne Scrollen gefunden. Das ist besser.
4. **Protokoll** (`05-protokoll.png`). Erwartet: ein klarer Satz zur Folge der Rücknahme. Gesehen, das Neueste oben:
   - 27.09.2026, 04:35: «Kategorie «Gartenpflege»: von nicht umlagefähig auf umlagefähig geändert; ihre nicht umlagefähigen Rechnungen bleiben es»
   - 27.09.2026, 04:31: «… von umlagefähig auf nicht umlagefähig geändert; 2 Rechnungen sind damit nicht mehr umlagefähig»
   - 27.09.2026, 04:26: Anmeldung mit Google; davor 08.09. Verwaltungspauschale 3 % → 3.5 %, 07.09. Anmeldung.

   Beim ersten Lesen bin ich an «ihre … bleiben es» hängengeblieben. Beim zweiten Lesen verstand ich: Die 2 Rechnungen sind weiterhin nicht umlagefähig, obwohl die Kategorie wieder umlagefähig ist. Das überrascht mich, denn ich dachte, das Zurückstellen mache alles rückgängig.
5. **Kategorien** (`06-kategorien.png`). Gesehen: «Gartenpflege» unter «Umlagefähig». Das passt zum Protokoll.
6. **Rechnungen, Filter Kategorie «Gartenpflege»** (`08-rechnungen-gartenpflege.png`). Erwartet: 2 Rechnungen mit «Nicht umlagefähig». Gesehen: 4 Rechnungen, alle «Umlagefähig». Das widerspricht dem Protokoll (P-1).
7. **Rechnung bearbeiten, «Gartenpflege Herbst 2025»** (`09-rechnung-bearbeiten.png`, nicht gespeichert). Gesehen: Das Häkchen «Umlagefähig» ist gesetzt, dazu der Hinweis «Rechnung schon abgerechnet». Ich lerne hier immerhin, dass ich die Umlagefähigkeit pro Rechnung ändern könnte. Das Protokoll hat mir das nicht gesagt.
8. **Hilfe**. Erwartet: eine Erklärung zum Protokoll. Gesehen: nichts dazu.
9. **Handy, Protokoll** (`10-protokoll-mobil.png`). Erwartet: dieselben Einträge, lesbar. Gesehen: lesbar, ohne seitliches Scrollen. Der lange Gartenpflege-Satz bricht in 4 Zeilen um, darunter steht ein grosser roter «Löschen»-Knopf.

## Verwirrung

- «ihre nicht umlagefähigen Rechnungen bleiben es»: «es» bezieht sich auf «nicht umlagefähig». Das muss ich mir zusammensuchen. «ihre» klingt wie «Ihre», also meine Rechnungen allgemein.
- Welche Rechnungen sind gemeint? Der vorherige Eintrag sagt «2 Rechnungen», die Rechnungsliste hat aber 4 Gartenpflege-Rechnungen, alle umlagefähig.
- Warum macht das Zurückstellen der Kategorie die Rechnungen nicht wieder umlagefähig? Ein Halbsatz «damit Sie nicht unbemerkt Kosten abrechnen …» oder ähnlich würde das erklären.
- Ich suche den Verlauf immer noch nicht unter «Einstellungen», er steht dort nur.

## Fehlerrisiken

- Ich glaube dem Protokoll, suche die «2 nicht umlagefähigen» Rechnungen und finde sie nicht. Dann ändere ich womöglich die Kategorie noch einmal hin und her (P-1).
- Ich glaube der Rechnungsliste und übersehe so, dass tatsächlich Rechnungen fehlen könnten. Bei echten Daten ginge Geld verloren, das ich hätte abrechnen dürfen (P-2: keine Namen und kein Link).
- Ich lese «bleiben es» als «bleiben umlagefähig» und denke, alles ist wieder in Ordnung.

## Vorschläge

- **P-1.** Reproduktion: Protokoll öffnen → die zwei Gartenpflege-Einträge vom 27.09.2026 lesen → «Rechnungen» → Kategorie «Gartenpflege» → «Suchen»: Alle 4 Rechnungen stehen auf «Umlagefähig». Was helfen würde: Die Protokolleinträge der Demodaten an die Demo-Rechnungen anpassen (2 Gartenpflege-Rechnungen tatsächlich nicht umlagefähig) oder die Einträge so formulieren, dass sie zum Datenstand passen.
- **P-2.** Reproduktion: Protokoll → Eintrag 27.09.2026, 04:35. Was helfen würde: ein ganzer Satz mit Zahl, zum Beispiel «2 Rechnungen bleiben nicht umlagefähig. Prüfen Sie sie unter «Rechnungen», wenn sie in die Abrechnung sollen.» Besser noch mit den Rechnungen als Link oder einem Link auf die gefilterte Rechnungsliste.
- **P-3.** Reproduktion: Übersicht → Navigation und Benutzermenü durchsuchen, ein Protokoll ist nicht zu sehen. Was helfen würde: «Protokoll» in der Navigation unter «Einstellungen und Hilfe» oder im Benutzermenü, oder eine Zeile «Zuletzt angemeldet am … – Protokoll ansehen» auf der Übersicht. Mindestens das Protokoll im Einleitungssatz von «Einstellungen» und in der Hilfe nennen.

## Nicht geprüft

- Ob «Löschen» nachfragt: Auftrag «nichts löschen».
- Ob eine Änderung, die ich selbst mache, sofort im Protokoll erscheint: Ich habe nichts gespeichert.
- Ob die Gartenpflege-Rechnungen tatsächlich in den Entwürfen stecken: nicht erneut geprüft, weil das nicht zur Aufgabe gehörte.
- Der Weg zum Protokoll über das Handy-Menü, Dunkelmodus, Zoom und andere Sprachen.

Screenshots und Skripte: `/tmp/claude-0/-home-user-Dwello/3eb48ef7-ceb3-5923-ae2d-df5dd75846f5/scratchpad/anna-w7e-2/`
