# Fach-Review #129 (Karte entfernen), Runde 1

Gegenstand: Commit 97bf68f (Worktree `review-map-fach`), Szenarien `building-detail.feature` «Die Gebäudeseite zeigt die Adresse als Text ohne Karte» und `privacy.feature` «Dienste Dritter, die der Browser aufruft»; geplante Streichung von `privacy_third_2` in `messages/{de,fr,it,en}.json` und `src/routes/privacy/+page.svelte`.

Ergebnis: kein Blocker, kein Major. Die geplante Streichung ist rechtlich richtig und lässt den Abschnitt «Weitergabe an Dritte» korrekt zurück. Offen sind Folgeänderungen ausserhalb des Datenschutztexts (Doku, Entscheid in #82, Zeile U-23).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| R-1 | Rechtstexte | Minor | Entscheid in #82 («Third parties … CARTO …») nennt CARTO weiterhin als künftig anzugebenden Dritten |
| R-2 | Rechtstexte | Minor | `docs/tech-stack.md`, `README.md`, `docs/PRD-Dwello.md` beschreiben die Karte (Leaflet, CARTO/OSM) weiter; der Plan nennt nur den Schlüssel |
| R-3 | Rechtstexte | Minor | Zeile U-23 in `docs/design/offene-punkte.md` beschreibt CARTO-Karte, fehlende Attribution und `?key=undefined` |
| R-4 | Rechtstexte | Nit | Bestehende Unit-Tests verlangen CARTO bzw. die Leaflet-Regel und müssen mitgehen |
| V-1 | Verwalter | Nit | Szenariotitel sagt «Gebäudeseite», die Schritte «Detailseite»; «Koordinaten» steht nicht im Glossar |

## Bestätigt

**Streichung von `privacy_third_2` (DSG Art. 19).** Fedlex, SR 235.1 (Stand 1.9.2023), Art. 19 Abs. 2:
> «Er teilt der betroffenen Person bei der Beschaffung diejenigen Informationen mit, die erforderlich sind, damit sie ihre Rechte nach diesem Gesetz geltend machen kann und eine transparente Datenbearbeitung gewährleistet ist; er teilt ihr mindestens mit: […] c. gegebenenfalls die Empfängerinnen und Empfänger oder die Kategorien von Empfängerinnen und Empfängern, denen Personendaten bekanntgegeben werden.»

Nach dem Entfernen von `BuildingMiniMap.svelte` ruft der Browser `basemaps.cartocdn.com` nicht mehr auf. Das war die einzige CARTO-Stelle im Frontend (`src/routes/buildings/BuildingMiniMap.svelte:42`). Einen Empfänger zu nennen, der nichts erhält, wäre irreführend (Art. 6 Abs. 2 DSG: «Die Bearbeitung muss nach Treu und Glauben erfolgen …»). Die Streichung ist daher geboten und nicht nur zulässig.

**Schlusssatz `privacy_third_5` bleibt richtig.** Ich habe alle externen URLs im Frontend (`src/**/*.{svelte,ts,css,html}`, ohne Tests) durchsucht. Nach dem Entfernen bleiben nur:
- die OAuth-Endpunkte von Google und Microsoft (`src/lib/server/oauth.ts:44–58`), abgedeckt durch «Anmeldung»;
- OpenPLZ (`src/lib/services/openplz.ts:8`), abgedeckt durch `privacy_third_3`;
- der Google-Maps-Link (`src/routes/buildings/BuildingCard.svelte:14`), abgedeckt durch `privacy_third_4`;
- der Mailversand, abgedeckt durch `privacy_third_1`;
- die KI, abgedeckt durch `llm-recipient`.

Ein Profilbild wird nicht vom Google-Server geladen (keine Treffer für `picture`/`avatar` in `*.svelte`). Der Satz «Ausser den hier und unter «Anmeldung» genannten Diensten erhält niemand Daten von Dwello.» stimmt deshalb nach der Streichung weiterhin.

**Cookies (Art. 45c FMG).** Die Karte setzte keine eigenen Cookies, und der Abschnitt «Cookies» nennt keine. Er ändert sich nicht und bleibt richtig.

**Nutzungsbedingungen.** `terms_*` in `messages/de.json:157–167` nennen weder Karte noch CARTO. Es ist keine Änderung nötig.

**Weitere Datenschutztexte.** `privacy_stored_*`, `privacy_login_1`, `privacy_draft_notice`, `privacy_demo_1` und die Cookie-Texte erwähnen die Karte nicht. `privacy_third_3` im Italienischen enthält weiterhin «immobile», also bleibt der Begriffstest `src/__tests__/privacy-i18n.dom.test.ts:28–36` grün (sein Titel nennt noch «Karte», siehe R-4).

**Szenario Gebäudeseite.** Die Adresse «Testweg 1, 8400 Winterthur (ZH)» entspricht der Grundlage (`tests/e2e/fixtures/backend.ts:110–118`) und der Anzeige (`src/routes/buildings/[id]/BuildingFacts.svelte:25–27`). Die Vorbedingung «Koordinaten erfasst» ist richtig gewählt: Ohne Koordinaten zeigt die Seite heute schon keine Karte (`BuildingFacts.svelte:50`), und das Szenario wäre sonst ohne Aussage. Das Szenario setzt den Entscheid in #129 um (Option 2, «the building page shows the address as text»). Die Spalten `latitude`/`longitude` bleiben, was #129 offenlässt («keep or drop the columns»).

**Szenario Datenschutz.** Es entspricht #129 («CARTO is then no longer a third party on the privacy page»). OpenPLZ und Google Maps bleiben genannt, Google Fonts weiterhin nicht. Der Schritt prüft nur Deutsch. Dass die Streichung alle vier Sprachen erfasst, gehört in den Unit-Test (siehe R-4).

## Befunde

### R-1 (Minor): Entscheid in #82 nennt CARTO weiter
- **Beleg:** Issue #82, «Decided (product owner)», Punkt «Third parties: per configured provider (Google sign-in, Resend, CARTO, OpenPLZ, as already for the KI provider): country, disclosure abroad (DSG), link to the provider's privacy policy».
- **Warum falsch:** Wer #82 später umsetzt, würde für CARTO Land, Auslandbekanntgabe und Datenschutzlink ergänzen, obwohl es nach #129 keinen CARTO-Empfänger mehr gibt. #129 verweist ausdrücklich auf #82.
- **Lösung:** Einen Kommentar in #82 schreiben, etwa: «CARTO entfällt mit #129 (Karte entfernt); die Liste der Dritten ist Google-Anmeldung, Resend/SMTP, OpenPLZ, Google Maps (Link), KI-Anbieter.» Den Entscheidtext selbst ändert nur der Product Owner. Ein Kommentar, der auf #129 verweist, genügt nach CLAUDE.md, «Coding guidelines» (Detail, das die Aufgabe nicht ändert).

### R-2 (Minor): Doku beschreibt die Karte weiter
- **Beleg:**
  - `docs/tech-stack.md:33` («Building mini map (Leaflet)»), `:152–155` (Abschnitt «Map Library: Leaflet», «Tiles: CARTO …»), `:349` (`PUBLIC_CARTO_API_KEY`), `:537` («Maps | Leaflet + CARTO/OSM tiles»);
  - `README.md:35` («Maps: OpenStreetMap + Leaflet»);
  - `docs/PRD-Dwello.md:78, 180–188, 862, 887–888, 1512–1518, 1584, 1589` (Kartenansicht, «Map thumbnail»).
- **Warum falsch:** Der Plan (`implementation_plan.md:10`) nennt für `docs/tech-stack.md` und README nur den Schlüssel `PUBLIC_CARTO_API_KEY`. Im README steht dieser Schlüssel gar nicht, nur die Zeile «Maps». Nach dem Entfernen beschreibt die Doku einen Dritten und eine Abhängigkeit, die es nicht mehr gibt. Ein Betreiber könnte so einen CARTO-Schlüssel beschaffen, oder ein Entwickler die Karte für vorhanden halten.
- **Lösung:**
  - In `docs/tech-stack.md` den Abschnitt «Map Library», die Zeile im Diagramm, die Umgebungsvariable und die Tabellenzeile streichen.
  - `README.md:35` streichen.
  - Im PRD die Kartenanforderungen als entfallen markieren, mit Verweis auf #129. Mindestens Zeile 862 («Map thumbnail») muss weg, denn sie beschreibt genau die entfernte Funktion. Die übrigen PRD-Stellen (Portfolio-Karte) waren nie umgesetzt; ein Hinweis «nicht umgesetzt, siehe #129» genügt.

### R-3 (Minor): Zeile U-23 in `offene-punkte.md`
- **Beleg:** `docs/design/offene-punkte.md:29`, U-23: «the map and the field «Adresse suchen» do not say that CARTO or OpenPLZ receive data, and the map shows no attribution (P-7); […] without `PUBLIC_CARTO_API_KEY` the map requests tiles with `?key=undefined` (P-12)»; Ort `src/routes/buildings/BuildingMiniMap.svelte`.
- **Warum falsch:** Nach dem Entfernen sind P-12 und die Karten- und Attributionsteile von P-7 erledigt, und der genannte Ort existiert nicht mehr. OpenPLZ (P-7, Rest), P-8, P-11 und der Google-`Referer` bleiben offen.
- **Lösung:** U-23 auf die offenen Teile kürzen, den Ort `BuildingMiniMap.svelte` streichen und die erledigten Teile nach `docs/archive/offene-punkte-verlauf.md` verschieben, mit Verweis auf #129.

### R-4 (Nit): Tests, die den alten Stand festschreiben
- **Beleg:**
  - `src/__tests__/privacy-page.dom.test.ts:157–159` («nennt die Kartenkacheln von CARTO …», `expect(text).toContain('CARTO')`);
  - `src/__tests__/tokens.test.ts:92` (verlangt die Regel `.leaflet-container` in `globals.css`, die der Plan entfernt);
  - Titel in `src/__tests__/privacy-i18n.dom.test.ts:28` («… für Gebäude und Karte»).
- **Warum:** Die Tests würden nach der Streichung rot oder beschreiben etwas, das es nicht mehr gibt. Die Streichung in fr/it/en prüft nur ein Unit-Test.
- **Lösung:** Im DOM-Test auf `not.toContain('CARTO')` drehen, für alle vier Sprachen (das ist auch der Rot-Test für die Textänderung), die Leaflet-Assertion in `tokens.test.ts` entfernen und den i18n-Testtitel anpassen.

### V-1 (Nit): Wortwahl im Szenario
- **Beleg:** `building-detail.feature:17` «Gebäudeseite», `:19` «Detailseite von "Birkenhof"»; `:18` «Koordinaten erfasst». `UBIQUITOUS_LANGUAGE.md:13` (Gebäude: «Adresse, PLZ, Ort, Kanton, Baujahr und Gebäudetyp») nennt keine Koordinaten.
- **Warum:** Es ist kein Fachbegriff im engen Sinn: Koordinaten sind ein technisches Feld, das kein Formular setzt (#129, «Problem»). Für die Vorbedingung ist das Wort verständlich. Ein Glossareintrag ist nicht nötig, weil das Feld in der Oberfläche nicht mehr vorkommt.
- **Lösung (optional):** Den Titel «Die Detailseite eines Gebäudes zeigt die Adresse als Text ohne Karte» wählen, damit er zu den Schritten passt. «Koordinaten» kann bleiben. Es ist kein Issue nötig.

## Fehlende Begriffe
Keine. «Adresse» und «Gebäude» stehen im Glossar. «Karte» und «Koordinaten» bezeichnen Oberflächen- und Technikobjekte, die mit dieser Änderung wegfallen.

## Nicht bestätigt
- **Länder der verbleibenden Dritten (DSG Art. 19 Abs. 4:** «Werden die Personendaten ins Ausland bekanntgegeben, so teilt er der betroffenen Person auch den Staat […] mit.»). Für OpenPLZ, Google (Maps-Link und Anmeldung) und Resend nennt die Datenschutzerklärung kein Land. Die Lücke besteht schon auf dem Basiscommit, diese Änderung vergrössert sie nicht, und #82 (Entscheid «Third parties … country, disclosure abroad») deckt sie ab. Den Standort der OpenPLZ-Server habe ich nicht geprüft. Gesucht: `messages/de.json:142–147`, Issue #82.
- **Keine weiteren Kartenaufrufe des Browsers.** Ich habe nur statisch nach URLs in `src/` gesucht und keinen Netzwerkmitschnitt der laufenden App gemacht. Den Build und eine allfällige Content-Security-Policy habe ich nicht geprüft; in `src/`, `svelte.config.js`, `deploy/` und `docker-compose*.yml` gibt es keine CSP-Einträge für `cartocdn`.
- **Demo-Daten mit Koordinaten** (`backend/demo/demo-data.sql`). Die gespeicherten Koordinaten haben nach dem Entfernen keinen Zweck mehr in der Oberfläche. Gebäudekoordinaten des eigenen Mietobjekts sind höchstens mittelbar Personendaten des Vermieters. #129 lässt das Behalten der Spalten ausdrücklich offen. Ich sehe keinen Verstoss gegen Art. 6 Abs. 3/4 DSG, habe das aber nicht vertieft (**unsicher**).
- **Fedlex-Quelle:** DSG SR 235.1, Fassung 20230901, abgerufen über den Fedlex-Filestore (`eli/cc/2022/491/20230901/de/html`). Eine neuere Fassung habe ich nicht abgeglichen.
