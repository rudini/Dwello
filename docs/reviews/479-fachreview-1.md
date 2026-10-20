# Fachreview #479, Runde 1: Gebäude mit Wohnungen aus dem Gebäuderegister

Gegenstand: `git diff 2e066edf~1 2e066edf -- tests/e2e/features/` (Worktree `review-gwr-fach`, Commit 2e066edf): neue `@wip`-Szenarien am Ende von `tests/e2e/features/building-new.feature` (Z. 31–132), Änderungen in `tests/e2e/features/privacy.feature` (Z. 46, 88, 95–100) sowie die vom Aufrufer vorgeschlagenen Texte. Den Abschnitt «Decided (product owner)» habe ich nur dort geprüft, wo er Gesetz, Glossar oder den Daten des Registers widerspricht.

## Befunde

| ID | Rolle | Schwere | Kurzbefund |
|---|---|---|---|
| M-1 | Mietrecht | Major | Der Hinweis zu nicht übernommenen Wohnungen (building-new.feature:76) nennt nur die Folge. Dass eine selbst genutzte oder leere Wohnung trotzdem dazugehört, sagt er nicht: Wer sie weglässt, verrechnet ihren Anteil den Mietern. |
| V-1 | Verwalter | Major | Das GWR führt nur Wohnungen. Geschäftsräume in Mischbauten oder einem Mehrfamilienhaus mit Laden fehlen, ohne Hinweis und ohne Szenario. Die Verteilschlüssel rechnen dann ohne sie. |
| V-2 | Verwalter | Major | Fehlt `wazim` (Zimmeranzahl), gibt es keine Regel. Dwello verlangt die Zimmeranzahl (`apartment-form.ts:14`). «Was fehlt» deckt nur Fläche, Stockwerk und Wohnungsnummer ab. |
| V-3 | Verwalter | Minor | `gklas` 1130 heisst im GWR «Wohngebäude für Gemeinschaften» (Heime, Internate), nicht Mischnutzung. Vorschlag: 1130 leer lassen, Mischnutzung aus `gkat` 1040 ableiten. Das ist ein entschiedener Wert, also braucht es eine Entscheidung des Product Owners (Issue mit `entscheiden`). |
| V-4 | Verwalter | Minor | Hilfetext «Das Register wird von der Gemeinde geführt» stimmt nicht: Das BFS führt das GWR, Gemeinde oder Kanton tragen die Angaben nach (VGWR Art. 1 Abs. 1, Art. 10 Abs. 1). Vorschlag: «Prüfen Sie die Angaben: Gemeinde oder Kanton tragen sie ins Register ein, sie können veraltet sein.» |
| V-5 | Verwalter | Minor | Das Wort «Lage» (Szenariotitel Z. 95, Vorschlag «<Stockwerk> <Lage>») kollidiert mit dem Glossar, wo Stockwerk als «Lage der Wohnung: UG, EG, 1. OG …» erklärt ist. Vorschlag: «Seite im Stockwerk» (Links/Mitte/Rechts), Titel «… aus Stockwerk und Seite vorschlagen». |
| V-6 | Verwalter | Minor | Der Begriff «Gebäuderegister» fehlt in `UBIQUITOUS_LANGUAGE.md`. Der Product Owner hat ihn in #479 entschieden, also gehört kein Marker in den Code; die Glossarzeile fehlt trotzdem. Formulierung siehe «Fehlende Begriffe». |
| V-7 | Verwalter | Minor | «Eingang» (Szenariotitel Z. 100) steht im Glossar nur für den Eingang einer Kündigung. Vorschlag «Hauseingang» plus eine Glossarzeile (siehe unten). |
| V-8 | Verwalter | Minor | `buildings_new_purpose` («… Danach legen Sie seine Wohnungen an.», `messages/de.json:346`) stimmt nach dem Import nicht mehr. Vorschlag: «Wählen Sie die Adresse im Gebäuderegister oder erfassen Sie das Gebäude von Hand. Die Wohnungen übernimmt Dwello aus dem Register oder Sie legen sie danach an.» |
| R-1 | Rechtstexte | Minor | Der Link `geo.admin.ch/de/allgemeine-nutzungsbedingungen-bgdi` führt zu den Nutzungsbedingungen, nicht zu einer Datenschutzerklärung. Passender ist nach Suchtreffer `https://www.swisstopo.admin.ch/de/rechtliches` (Abschnitt Datenschutz mit Logfiles, IP-Adresse, datenschutz@swisstopo.ch). Das ist **unsicher**, weil die Seite nicht abrufbar war. |
| R-2 | Rechtstexte | Nit | «… das das Bundesamt für Landestopografie swisstopo … bereitstellt» lässt offen, wer das Register führt. Vorschlag: «… das das Bundesamt für Statistik führt und swisstopo auf geo.admin.ch bereitstellt». |
| R-3 | Rechtstexte | Nit | «die gewählte Adresse»: Der Server schickt für die Wohnungsabfrage die Gebäudenummer EGID (Issue, Schritt 2). Genauer: «… und die Gebäudenummer (EGID) der gewählten Adresse». |
| V-9 | Verwalter | Nit | Zimmeranzahl: Der Hilfetext ist entschieden. Wird nur eine Wohnung auf halbe Zimmer korrigiert, verschiebt «Pro Zimmer» Anteile (Rechnung unten). Eine Ergänzung wie «… bitte prüfen, bei allen Wohnungen gleich» wäre hilfreich. |
| V-10 | Verwalter | Nit | `gklas` 1230 «Gross- und Einzelhandelsgebäude» bleibt leer. Für Vermieter wäre «Geschäftshaus» naheliegend (entschiedener Wert, also nur ein Hinweis). |
| V-11 | Verwalter | Nit | Kein Szenario für eine fehlende Wohnungsnummer ohne Stockwerk und ohne Seite (dann gibt es keinen Vorschlag und das Feld ist Pflicht). |

## Details zu den Majors

### M-1: Hinweis zu nicht übernommenen Wohnungen

- **Evidenz:** building-new.feature:76: «Nicht übernommene Wohnungen erfasst Dwello nicht. Die Verteilschlüssel verteilen die Kosten dann nur auf die übrigen Wohnungen.»
- **Gesetz:** Art. 257b Abs. 1 OR (Fedlex, Fassung 1.10.2026, zitiert in `docs/nebenkostenabrechnung-anforderungen.md:29`): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen …». Art. 7 Abs. 1 VMWG (zitiert in `docs/nebenkostenabrechnung-anforderungen.md:61`): Die Heizkosten leerer Räume trägt der Vermieter.
- **Anforderungen:** `docs/nebenkostenabrechnung-anforderungen.md:144` sagt: «Geteilt wird immer durch alle Wohnungen des Gebäudes, auch die leeren».
- **Warum falsch:** Eine Zielperson mit wenig Erfahrung liest den Satz als neutrale Option und lässt zum Beispiel die eigene Wohnung oder eine leere Wohnung weg. Deren Anteil tragen dann die Mieter.
- **Nachgerechnet:** Wohnungen 75 / 72 / 98 m², Rechnung CHF 1000, Schlüssel «Pro Fläche».
  - Alle drei Wohnungen: 101 trägt 75/245 = CHF 306.12.
  - Ohne 102 (die Wohnung des Eigentümers): 101 trägt 75/173 = CHF 433.53, also CHF 127.41 zu viel.
  - Randfall: Die einzige vermietete Wohnung bleibt übrig. Dann trägt sie 100 % des Gebäudes.
- **Fix:** Der Text ergänzt den Entscheid nur, er widerspricht ihm nicht. Vorschlag: «Nicht übernommene Wohnungen erfasst Dwello nicht. Die Verteilschlüssel verteilen die Kosten dann nur auf die übrigen Wohnungen. Lassen Sie nur Wohnungen weg, die es nicht mehr gibt. Wohnungen, die Sie selbst nutzen oder die leer stehen, gehören dazu: ihren Anteil tragen Sie.»

### V-1: Geschäftsräume fehlen im Gebäuderegister

- **Evidenz:**
  - VGWR Art. 8 Abs. 3 (Fedlex, Stand 15.7.2026): «Im GWR werden zu jeder Wohnung und zu jedem wohnungsähnlichen Objekt folgende Informationen geführt …». Geschäftsräume sind keine Wohnungen.
  - Live-Datensatz EGID 147881 (Seebahnstrasse 155, Zürich, über api3.geo.admin.ch am 19.10.2026): `gklas` 1122, `gkat` 1030 «Andere Wohngebäude (Wohngebäude mit Nebennutzung)», 8 Wohnungen, keine Liste der Nebennutzung.
  - Glossar Z. 17: Wohnung ist eine «Einzelne Mieteinheit innerhalb eines Gebäudes». Ein Laden ist in Dwello also eine Wohnung im Verteilschlüssel.
  - Glossar Z. 13: Ein Gebäude ist ein «Wohn- oder Mischgebäude».
- **Warum falsch:** Bei «Mischnutzung» oder `gkat` 1030/1040 übernimmt der Import nur die Wohnungen. Die Kosten des Gebäudes gehen dann ohne die Geschäftsräume auf die Wohnungsmieter (Art. 257b Abs. 1 OR, wie bei M-1). Bei «Geschäftshaus» oder «Gewerbegebäude» zeigt die Erfassung «keine Wohnungen erfasst», nennt aber den Grund nicht.
- **Fix:** Einen Hinweis über der Wohnungstabelle immer zeigen, oder mindestens bei `gkat` ≠ 1020 bzw. Gebäudetyp ≠ Einfamilienhaus/Mehrfamilienhaus. Vorschlag: «Das Gebäuderegister enthält nur Wohnungen. Erfassen Sie Läden, Büros und andere vermietete Räume nach dem Speichern als eigene Wohnung, damit sie ihren Anteil an den Nebenkosten tragen.» Dazu ein Szenario. Weil der Text über den Entscheid hinausgeht, im Issue bestätigen lassen.

### V-2: Fehlende Zimmeranzahl im Register

- **Evidenz:**
  - Der Entscheid in #479 («Missing Fläche, Wohnungsnummer or Stockwerk: highlighted … required before saving») und building-new.feature:79–91 decken nur diese drei Felder ab.
  - Das Issue beobachtet bereits `null` bei `whgnr`, `warea`, `wstwk`. `wazim` ist laut Datensatz ebenfalls eine eigene Liste und kann leer sein (siehe «Nicht bestätigt»).
  - `src/lib/server/apartment-form.ts:14` und `messages/de.json:558` («Zimmeranzahl ist erforderlich.»): Die Zimmeranzahl ist Pflicht.
  - Glossar Z. 130: «Pro Zimmer» verteilt nach der Zimmeranzahl.
- **Warum falsch:** Ohne Regel speichert die Umsetzung entweder 0, was «Pro Zimmer» verfälscht (Anteil 0, die übrigen Wohnungen tragen mehr), oder sie scheitert ohne Hinweis darauf, was fehlt.
- **Fix:** Die Zimmeranzahl wie Fläche und Stockwerk behandeln: als fehlend markiert («Fehlt im Gebäuderegister»), Pflicht vor dem Speichern, ohne Vorgabewert. Im Szenario Z. 89 kann die Liste dann «Fläche, Stockwerk» bleiben. Das ist eine direkte Folge der bestehenden Pflichtfeld-Regel und widerspricht dem Entscheid nicht. Trotzdem im Issue nachtragen.

## Nachgerechnet

- **Zimmeranzahl (V-9):** GWR 3 und 4 statt marktüblich 3½ und 4½, Rechnung CHF 1000, Schlüssel «Pro Zimmer».
  - Werte aus dem GWR: 3/7 = 42.86 %.
  - Beide Wohnungen korrigiert: 3.5/8 = 43.75 %. Das ist praktisch neutral.
  - Nur 101 korrigiert: 3.5/7.5 = 46.67 %, also CHF 38.10 mehr für 101.
  - Randfall: Alle Wohnungen haben 0 Zimmer. Dann ist die Summe 0 und es gibt keine Verteilung; dagegen schützt V-2.
- **Gleiche Wohnungsnummern (Z. 100–102):** «500-101, 502-101» hält die Regel «pro Gebäude eindeutig» ein (Glossar Z. 18). Auch der Zähler bei doppelten Vorschlägen aus Stockwerk und Seite hält sie ein. Bestätigt.

## Bestätigt

- **Status:** Die Wohnungsstatus 3003 (im Bau) und 3004 (bestehend) werden übernommen. Eine Wohnung im Bau ohne Mietvertrag ist Leerstand, ihren Anteil trägt der Vermieter (Glossar Z. 185). Der Live-Datensatz zeigt `wstat` 3004.
- **Fläche:** WAREA laut GWR-Merkmalskatalog 4.3 (Suchtreffer): «Summe der Flächen sämtlicher Zimmer, Küchen, Kochnischen, Badezimmer, Toiletten, Abstellräume, Gänge, Veranden usw.», ohne Balkone und Terrassen. Das passt zu «Nettowohnfläche» (Glossar Z. 20). Ganze m² sind zulässig.
- **Zimmeranzahl:** WAZIM zählt «alle bewohnbaren Räume … Nicht gezählt werden Küche, Badezimmer …» (Suchtreffer housing-stat.ch und i14y.admin.ch), also keine halben Zimmer. Der entschiedene Hilfetext stimmt.
- **Stockwerk:** Live-Datensatz: Wohnung 101/102 hat `wstwk` 3101 (1. OG), 201 hat 3102.
- **Gebäudetyp:** `gklas` 1110 (Gebäude mit einer Wohnung) → Einfamilienhaus, 1121/1122 (zwei bzw. drei oder mehr Wohnungen) → Mehrfamilienhaus, 1220 (Bürogebäude) → Geschäftshaus, 1251 (Industriegebäude) → Gewerbegebäude. Alles plausibel; Quellen sind Suchtreffer housing-stat.ch und BAFU.
- **Öffentliche Daten:** VGWR Art. 16 (Fedlex, Stand 15.7.2026): «Das BFS veröffentlicht die Daten des GWR der Stufe A … nach Anhang 1 im Internet und über die standardisierten Schnittstellen.» Laut Anhang 1 sind Stufe A: «Wohnungsnummer des Kantons oder der Gemeinde A», «Lokalisierung der Wohnung im Gebäude A*», «Wohnungsstatus … A*», «Wohnungsdimensionen (Fläche) A*», «Wohnungsstruktur (Anzahl Zimmer …) A*». Damit ist der zweite Punkt von «Stop and ask» in #479 (Daten nicht in allen Kantonen öffentlich) aus dem Recht verneint. Die Legende des geo.admin-Layers sagt dazu: «Daten der Stufe A sind öffentlich und können ohne Einschränkung verwendet werden.»
- **Datenschutzerklärung, DSG Art. 19:** Art. 19 Abs. 2 DSG (Fedlex, Fassung 1.9.2023): «… er teilt ihr mindestens mit: a. die Identität und die Kontaktdaten des Verantwortlichen; b. den Bearbeitungszweck; c. gegebenenfalls die Empfängerinnen und Empfänger …». Der vorgeschlagene Text nennt Empfänger (swisstopo), Zweck (Adresssuche beim Erfassen) und die Daten (Suchbegriff, Adresse, IP-Adresse des Servers). Abs. 4 («Werden die Personendaten ins Ausland bekanntgegeben …») entfällt, weil swisstopo in der Schweiz ist; richtig «Schweiz». Dass OpenPLZ (Deutschland, IP-Adresse des Browsers) entfällt, ist folgerichtig, ebenso die Änderungen Z. 46 und Z. 88. Die Fassung «IP-Adresse des Servers, nicht die des Browsers» stimmt mit der beschriebenen Architektur überein (BFF ruft auf).
- **Übrige Texte:** Die Texte der Szenarien Z. 104–132 (keine Wohnungen, kein Treffer, nicht erreichbar, schon erfasst) entsprechen wörtlich dem Entscheid. Der Primärbutton «Gebäude und Wohnungen erstellen» entspricht dem Entscheid und nennt ein Verb. «Fehlt im Gebäuderegister» ist kurz und klar.

## Fehlende Begriffe (Issue mit `fachlich`, `entscheiden`)

- **Gebäuderegister:** «Eidgenössisches Gebäude- und Wohnungsregister (GWR) des Bundesamts für Statistik; Gemeinde oder Kanton tragen die Angaben nach. Dwello übernimmt beim Erfassen eines Gebäudes daraus Adresse, Kanton, Baujahr, Gebäudetyp und die Wohnungen. Enthält keine Geschäftsräume.» Code: — (nicht gespeichert).
- **Hauseingang:** «Eingang eines Gebäudes mit eigener Hausnummer. Ein Gebäude kann mehrere Hauseingänge haben; Dwello führt sie als ein Gebäude.»
- **Seite im Stockwerk** (statt «Lage», V-5): «Position der Wohnung im Stockwerk, z.B. Links, Mitte, Rechts (GWR: Lage auf dem Stockwerk). Nur Vorschlag für eine fehlende Wohnungsnummer.»

## Nicht bestätigt

- **GWR-Merkmalskatalog:** Die Codelisten zu WSTWK (3100 Parterre, 3401–3419 Untergeschosse), WSTAT 3003/3004, GKLAS 1130/1230 und GKAT 1040 sowie die Definitionen von WAREA, WAZIM und WBEZ konnte ich nicht im Original lesen. gwr.admin.ch, housing-stat.ch, i14y.admin.ch und bfs.admin.ch waren aus dem Container nicht erreichbar (DNS bzw. Proxy 403). Bestätigt sind sie nur über die Snippets von `mmx search` und die Live-Daten von api3.geo.admin.ch (3101/3102, 3004, 1122/1030). Dass `wazim` `null` sein kann (V-2), ist nicht an einem Live-Datensatz belegt, nur aus der Datenstruktur abgeleitet.
- **Datenschutzseite von geo.admin.ch/swisstopo (R-1):** www.geo.admin.ch und www.swisstopo.admin.ch waren nicht abrufbar. Die Aussage stützt sich nur auf `mmx search`-Snippets («Beim Zugriff auf unsere Websites werden folgende Daten in Logfiles gespeichert: IP-Adresse …», swisstopo.admin.ch/de/rechtliches). Ob die Seite auch die Geodienste unter api3.geo.admin.ch abdeckt: **unsicher**.
- **Nutzungsbedingungen der BGDI (fair use, Quellenangabe):** Der erste Punkt von «Stop and ask» in #479 ist nicht geprüft, weil die Seiten nicht abrufbar waren. Ein Suchtreffer nennt neue Fair-use-Limiten ab 1.1.2025 (`geo.admin.ch/de/neue-fair-use-limiten`), ohne Zahlen. Ob eine Quellenangabe («Quelle: BFS, GWR») in der Oberfläche nötig ist, ist offen.
- **Art. 257b OR und Art. 7 VMWG:** Die Fedlex-Seiten liessen sich diesmal nicht laden (Verbindungsabbruch). Die Zitate stammen aus `docs/nebenkostenabrechnung-anforderungen.md:29` und `:61`, die sie als «Fedlex geprüft» führen.
- **Ziele der Suche:** DSG Art. 19 und VGWR Art. 1, 8, 10 und 16 samt Anhang 1 habe ich direkt im Fedlex-Filestore gelesen (DSG Fassung 20230901, VGWR Fassung 20260715).
