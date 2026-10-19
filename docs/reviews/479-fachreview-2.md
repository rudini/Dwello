# Fachreview #479, Runde 2: Gebäude mit Wohnungen aus dem Gebäuderegister

Gegenstand: `git diff 2e066edf 37b6a098 -- tests/e2e/features/` im Worktree `review-gwr-fach2` (Commit 37b6a098), der aktualisierte Abschnitt «Decided (product owner)» in rudini/Dwello#479 (gelesen am 19.10.2026) und die Entscheide des Aufrufers zu den Minors und Nits. Vorbericht: `docs/reviews/479-fachreview-1.md`. Bestätigte Regeln aus Runde 1 wiederhole ich nicht.

## Status der offenen IDs aus Runde 1

| ID | Rolle | Schwere (R1) | Status | Begründung |
|---|---|---|---|---|
| M-1 | Mietrecht | Major | **erledigt** | building-new.feature:82 prüft jetzt wörtlich den Text aus dem Entscheid: «Lassen Sie nur Wohnungen weg, die es nicht mehr gibt. Wohnungen, die Sie selbst nutzen oder die leer stehen, gehören dazu: ihren Anteil tragen Sie.» Der frühere Satz zur Folge ist weggefallen. Das ist vertretbar, weil «ihren Anteil tragen Sie» die Folge nennt und Art. 257b Abs. 1 OR bzw. `docs/nebenkostenabrechnung-anforderungen.md:144` («auch die leeren») abdeckt. |
| V-1 | Verwalter | Major | **erledigt** | Der Entscheid lautet: «whenever the preview shows register data, the hint …». Das Szenario building-new.feature:59–63 prüft den Text wörtlich. Dass der Nebensatz «damit sie ihren Anteil an den Nebenkosten tragen» fehlt, hat der Product Owner so entschieden; der Text bleibt auch ohne ihn klar. Eine Lücke im Szenario bleibt, siehe V-13. |
| V-2 | Verwalter | Major | **erledigt** | Laut Entscheid ist die Zimmeranzahl ein Pflichtfeld wie Fläche und Stockwerk, ohne Vorgabewert. Z. 90 prüft «Zimmeranzahl ist erforderlich.» (gleich wie `messages/de.json:558`), Z. 91 die Ergänzung «2.5», Z. 99 «Fläche, Stockwerk, Zimmeranzahl». Die Anzeige «2.5 Zimmer» passt zu `roomOptions` und `roomsLabel` (`src/lib/apartment.ts:28`, `:148–151`) und zum bestehenden Format «3.5 Zimmer» (`messages/de.json:477`). Nachgerechnet siehe unten. |
| V-3 | Verwalter | Minor | erledigt | Entscheid: «`gkat` 1040 → Mischnutzung; 1130 … → field left empty». Die Codes sind über Suchtreffer bestätigt: housing-stat.ch-Merkmalskatalog 4.3 «Gebäude mit teilweiser Wohnnutzung (GKAT 1040) … enthalten Wohnungen, bestehen aber mehrheitlich aus …» und das Datenportal Basel-Stadt `gkat_decoded:"Gebäude mit teilweiser Wohnnutzung"`. |
| V-4 | Verwalter | Minor | erledigt | Der übernommene Text entspricht meinem Vorschlag (VGWR Art. 10 Abs. 1). |
| V-5 | Verwalter | Minor | Ablehnung hält | «Lage» steht in keinem UI-Text, der Vorschlag lautet «2. OG Links» aus `wbez`. Nur der Szenariotitel Z. 102 «… aus Stockwerk und Lage vorschlagen» trägt das Wort noch, siehe V-14 (Nit). |
| V-6 | Verwalter | Minor | **teilweise offen** | Ohne Marker ist das richtig (CLAUDE.md, «Design-Regeln»: ein im Issue entschiedener Begriff bekommt keinen Marker). Die Glossarzeile fehlt aber weiterhin in `UBIQUITOUS_LANGUAGE.md`, und unter den offenen `fachlich`-Issues gibt es keines dazu (gesucht am 19.10.2026). Der Aufrufer eröffnet das Issue mit der Formulierung unter «Fehlende Begriffe». |
| V-7 | Verwalter | Minor | erledigt | Der Titel Z. 107 lautet jetzt «unter zwei Hausnummern eines Gebäudes». Damit braucht es den Begriff «Hauseingang» nicht mehr, der Glossarvorschlag entfällt. |
| V-8 | Verwalter | Minor | erledigt (Absicht) | Die Absicht ist richtig. Den genauen Text sehe ich erst im Diff der Umsetzung. |
| V-9 | Verwalter | Nit | bleibt so | Wurde nicht übernommen, ist aber kein Fehler. |
| V-10 | Verwalter | Nit | erledigt | 1230 → Geschäftshaus steht im Entscheid. Suchtreffer: Basel-Stadt `gklas_decoded:"Gross-und Einzelhandelsgebäude"`. |
| V-11 | Verwalter | Nit | bleibt so | Die Erklärung hält: Das Feld ist Pflicht und zeigt die Standardfehlermeldung `apartments_error_number` (`apartment-form.ts:11`). |
| R-1 | Rechtstexte | Minor | erledigt (Quelle **unsicher**) | privacy.feature:99 verlinkt jetzt https://www.swisstopo.admin.ch/de/rechtliches. Der Suchtreffer zur englischen Fassung (swisstopo.admin.ch/en/legal-framework) sagt: «When you access our websites, the following data is stored in log files: IP address …». Ob die Seite auch die Geodienste unter api3.geo.admin.ch abdeckt, bleibt **unsicher** (siehe «Nicht bestätigt»). Eine bessere Seite gibt es nach den Suchtreffern nicht. |
| R-2 | Rechtstexte | Nit | erledigt | Der Text nennt jetzt das Register «des Bundesamts für Statistik» und swisstopo als Bereitsteller. |
| R-3 | Rechtstexte | Nit | erledigt | «die Nummer des gewählten Gebäudes im Register» ist genau und sagt dem Laien mehr als «EGID». Art. 19 Abs. 2 DSG (Zitat in Runde 1) ist mit Empfänger, Zweck und Daten erfüllt; «Schweiz» stimmt, Art. 19 Abs. 4 DSG entfällt. |

## Neue Befunde

| ID | Rolle | Schwere | Kurzbefund |
|---|---|---|---|
| V-12 | Verwalter | Minor | Die Zimmeranzahl ist eine Auswahl von 1 bis 6.5 (`src/lib/apartment.ts:28`). Das GWR kennt keine Obergrenze: WAZIM zählt alle bewohnbaren Räume, und ein Einfamilienhaus (`gklas` 1110) hat oft 7 oder mehr. Für einen solchen Registerwert gibt es kein Szenario und keine Regel: er würde verworfen oder auf einen falschen Wert gesetzt. Fix: Wert über 6.5 als Option übernehmen (oder die Optionen erweitern) und eine Unit-Regel im Mapping. Die Auswahl gab es schon vorher; der Import macht den Fall aber ohne Zutun des Vermieters erreichbar. |
| V-13 | Verwalter | Nit | Den Hinweis «Das Gebäuderegister enthält nur Wohnungen …» prüft nur das Szenario mit Wohnungen (Lindenweg). Am wichtigsten ist er bei «Im Gebäuderegister sind keine Wohnungen erfasst» (Geschäftshaus, Gewerbegebäude), und dort zeigt die Vorschau laut Entscheid ebenfalls Registerdaten. Fix: im Szenario Z. 111–115 (Ahornweg 1) einen Schritt mit demselben Hinweis ergänzen. |
| V-14 | Verwalter | Nit | Der Szenariotitel Z. 102 «… aus Stockwerk und Lage vorschlagen» benutzt «Lage», das im Glossar das Stockwerk erklärt (Z. «Stockwerk»). Fix: «… aus Stockwerk und Position im Stockwerk vorschlagen» (wie «position» im Entscheid). Betrifft keinen UI-Text. |

Kein neuer Blocker oder Major.

## Nachgerechnet

- **Zimmeranzahl fehlt (V-2), Schlüssel «Pro Zimmer», Rechnung CHF 1000.** Wohnungen 3, 4 und Birkenweg-Wohnung «2» (ergänzt 2.5):
  - Mit der Pflichtregel: Summe 9.5, Wohnung 2 trägt 2.5/9.5 = 26.32 % = CHF 263.16, die Wohnung mit 3 Zimmern trägt 3/9.5 = CHF 315.79.
  - Wäre 0 gespeichert worden (das hat die alte Lücke erlaubt): Wohnung 2 trägt CHF 0, die Wohnung mit 3 Zimmern 3/7 = CHF 428.57, also CHF 112.78 zu viel.
  - Randfall: Ist die Zimmeranzahl bei allen Wohnungen leer, kann jetzt nicht mehr gespeichert werden, und eine Teilung durch 0 kommt nicht vor. Die Regel deckt das ab.
- **Nicht übernommene Wohnung (M-1).** Die Rechnung aus Runde 1 gilt weiter (75/245 statt 75/173). Der neue Text verhindert genau diesen Fall, weil er die selbst genutzte Wohnung ausdrücklich nennt.

## Fehlende Begriffe (Issue mit `fachlich`, `entscheiden`)

- **Gebäuderegister** (V-6, weiterhin offen): «Eidgenössisches Gebäude- und Wohnungsregister (GWR) des Bundesamts für Statistik; Gemeinde oder Kanton tragen die Angaben nach. Dwello übernimmt beim Erfassen eines Gebäudes daraus Adresse, Kanton, Baujahr, Gebäudetyp und die Wohnungen. Enthält keine Geschäftsräume.» Code: — (nicht gespeichert).
- «Hauseingang» und «Seite im Stockwerk» aus Runde 1 entfallen (V-7 erledigt, V-5 abgelehnt).

## Nicht bestätigt

- **Datenschutzseite von swisstopo (R-1):** www.swisstopo.admin.ch war wieder nicht erreichbar (curl: Proxy 403; WebFetch: DNS ENOTFOUND). Belegt ist sie nur über den Snippet von `mmx search` zu swisstopo.admin.ch/en/legal-framework. Ob sie die API-Dienste von geo.admin.ch abdeckt: **unsicher**.
- **Obergrenze von WAZIM (V-12):** Den Wertebereich im Merkmalskatalog konnte ich nicht im Original lesen (housing-stat.ch und bfs.admin.ch waren nicht erreichbar). Der Snippet sagt nur: «Anzahl Zimmer umfasst alle bewohnbaren Räume der Wohnung wie Wohnzimmer, Schlafzimmer usw.». Dass Werte über 6 vorkommen, folgt aus der Definition und ist üblich, ist aber nicht an einem Live-Datensatz belegt.
- **GKAT/GKLAS-Codelisten:** Nur über Snippets bestätigt (housing-stat.ch-Katalog 4.3, data.bs.ch), nicht im Originaldokument.
- **Nutzungsbedingungen der BGDI («Stop and ask» Punkt 1):** Wie in Runde 1 nicht geprüft, weil die Seiten nicht erreichbar waren.
- **V-8:** Den genauen Text von `buildings_new_purpose` gibt es noch nicht. Er ist im Umsetzungsdiff zu prüfen.
