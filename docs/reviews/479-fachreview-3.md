# Fachreview #479, Runde 3: Umsetzung (Gebäude mit Wohnungen aus dem Gebäuderegister)

Gegenstand: `git diff 37b6a098 26c7f2ce` im Worktree `review-gwr-fach3` (Commit 26c7f2ce). Geprüft habe ich nur, was sich seit Runde 2 an Begriffen, Regeln und Rechtstexten geändert hat: die UI-Texte (`buildings_register_*`, `buildings_new_purpose`, `buildings_address_search_*`, `privacy_third_3`) in vier Sprachen, den Link zur Datenschutzerklärung von swisstopo, die Regeln in `src/lib/server/building-register.ts`, die Freitextfelder der Vorschau (V-12) und den Weg der Werte bis in die Datenbank. Vorberichte: `docs/reviews/479-fachreview-1.md`, `479-fachreview-2.md`. Regeln, die schon bestätigt sind, liste ich nicht noch einmal auf.

## Status der offenen IDs aus Runde 2

| ID | Status | Begründung |
|---|---|---|
| V-6 | offen, Issue vorhanden | Die Glossarzeile fehlt weiterhin in `UBIQUITOUS_LANGUAGE.md`. Issue #488 «Glossary: «Gebäuderegister»» (`fachlich`, `entscheiden`) ist offen. Für diesen Pull Request blockiert das nichts. |
| V-8 | erledigt | `buildings_new_purpose` (de.json:361) nennt beide Wege: «Suchen Sie die Adresse: Dwello übernimmt … Ohne Treffer erfassen Sie die Angaben von Hand und legen die Wohnungen danach an.» |
| V-12 | **teilweise erledigt**, weiter unter V-16 | In der Vorschau ist die Zimmeranzahl ein Freitext (`RegisterApartments.svelte`, `TextInput` mit `inputmode="decimal"`), und das Stockwerk nimmt den Wert aus dem Register zusätzlich in die Auswahl auf (`floorChoices`). Ein Wert wie 7 Zimmer kommt also in die Datenbank. Danach kann ihn aber «Wohnung bearbeiten» nicht halten (V-16). Der Freitext bringt zudem ein neues Problem: ungeprüfte Zahlen (V-15). |
| V-13 | erledigt | building-new.feature:103 prüft den Hinweis jetzt auch beim Gebäude ohne Wohnungen. |
| V-14 | erledigt (Szenario) | Der Szenariotitel Z. 92 lautet «… aus Stockwerk und Position im Stockwerk vorschlagen». Der Unit-Test trägt das Wort «Lage» noch, siehe V-17. |
| R-1 | erledigt, Quelle weiter **unsicher** | `src/routes/privacy/+page.svelte:105` verlinkt https://www.swisstopo.admin.ch/en/legal-framework. Die Seite gibt es: `mmx search` liefert genau diese URL mit «When you access our websites, the following data is stored in log files: IP address …» und «The handling of personal data at swisstopo is regulated by the Federal Act on Data Protection (DSG, SR 235.1)». Ob sie die Dienste von api3.geo.admin.ch abdeckt, ist weiter unsicher (siehe «Nicht bestätigt»). Dass die Seite englisch ist, siehe R-4. |

## Befunde

| ID | Rolle | Schwere | Kurzbefund |
|---|---|---|---|
| V-15 | Verwalter | **Major** | Fläche und Zimmeranzahl der Vorschau werden nicht als Zahl geprüft. «72,5» oder «3,5» (mit Komma) scheitern mit dem allgemeinen Text «Fehler beim Erstellen», «0» wird gespeichert und gibt der Wohnung keinen Kostenanteil, «3.25» wird stillschweigend auf 3.3 gerundet. |
| V-16 | Verwalter | Minor | Werte ausserhalb der Auswahl im Wohnungsformular (Zimmer über 6.5, Stockwerk unter UG oder über 6. OG) speichert der Import. «Wohnung bearbeiten» hat für sie keine Option (`src/lib/apartment.ts:21`, `:28`): Die Auswahl bleibt leer, und speichern lässt sich die Wohnung nur mit einem falschen Wert. Ausserdem heisst jedes Untergeschoss «UG» (`apartment.ts:13`): In der Vorschau stehen −1 und −2 beide als «UG», und für −2 lautet der Vorschlag «UG Links». Fix: den gespeicherten Wert wie bei `floorChoices` als Option ins `ApartmentForm` aufnehmen und Untergeschosse als «2. UG» usw. bezeichnen (Texte in vier Sprachen). |
| V-17 | Verwalter | Nit | Der Testname in `src/__tests__/building-register.test.ts:160` und der Kommentar in `building-register.ts:82` sagen «Lage» bzw. «side». Fix: «Position im Stockwerk», wie im Szenario Z. 92. |
| V-18 | Verwalter | Minor | `docs/design/i18n-begriffe.md` hat keine Zeile für Gebäuderegister und GWR. Die Übersetzungen stimmen (siehe «Bestätigt»), sind aber nirgends festgehalten. Fix: zwei Zeilen «Gebäuderegister \| registre des bâtiments \| registro degli edifici \| building register» und «eidgenössisches Gebäude- und Wohnungsregister (GWR) \| Registre fédéral des bâtiments et des logements (RegBL) \| Registro federale degli edifici e delle abitazioni (REA) \| Federal Register of Buildings and Dwellings (RBD)». |
| V-19 | Verwalter | Nit | en: «Take this apartment» (`buildings_register_include`) klingt unnatürlich, besser «Include this apartment». «Missing in the building register» besser «Missing from the building register». |
| R-4 | Rechtstexte | Nit | Die Datenschutzerklärung verlinkt in allen Sprachen die englische Seite von swisstopo. Das Gesetz verlangt keinen Link (Art. 19 Abs. 2 DSG verlangt die Empfänger, nicht deren Erklärung), und die Seite lässt sich auf eine andere Sprache umschalten. Annehmbar. Wenn gewünscht: eine URL pro Sprache, mit einer Ausnahme im Test gegen deutsche Wörter im Code. |

Kein Blocker. Ein Major (V-15).

### V-15 (Major): Fläche und Zimmeranzahl ohne Prüfung als Zahl

- **Beleg:**
  - `src/lib/server/building-form.ts:42–66` (`parseRegisterApartments`) prüft nur, ob ein Feld leer ist, und reicht `area` und `rooms` als beliebigen Text weiter.
  - `backend/src/routes/buildings.ts` (`newApartmentSchema`) verlangt nur `t.String({ minLength: 1 })`.
  - Die Spalten sind `decimal(8,2)` und `decimal(3,1)` (`backend/src/db/schema.ts:65–66`). PostgreSQL lehnt «72,5» ab (invalid input syntax for type numeric). Die Route fängt das als 400 mit `error.message` ohne Code ab (`buildings.ts:117–120`). Das BFF zeigt dann den Ersatztext `buildings_create_failed` «Fehler beim Erstellen» (`src/routes/buildings/new/+page.server.ts`, de.json:355).
  - «3.25» rundet `decimal(3,1)` ohne Meldung auf 3.3.
  - Das normale Wohnungsformular verhindert all das: Die Fläche hat `type="number" min="1"` (`ApartmentForm.svelte:128–131`), die Zimmeranzahl ist eine Auswahl ab 1.
- **Warum falsch:**
  1. Der Hilfetext, den der Product Owner entschieden hat, «Im Register ohne halbe Zimmer: bitte prüfen», fordert den Vermieter auf, aus 3 eine 3,5 zu machen. In der Deutschschweiz und der Romandie tippt man dafür ein Komma. Das Speichern schlägt dann fehl, und die Meldung sagt weder, was passiert ist, noch welches Feld betroffen ist (CLAUDE.md, «Copy»: «errors say what happened and what to do»). Das trifft den Hauptweg, nicht einen Randfall.
  2. Fläche oder Zimmeranzahl 0 (aus dem Register übernommen oder eingetippt) gehen ohne Warnung durch. Die Verteilschlüssel «Pro Fläche (m²)» und «Pro Zimmer» (UBIQUITOUS_LANGUAGE.md:129–130) geben dieser Wohnung dann keinen Anteil, und die übrigen Mieter tragen ihn. Das widerspricht Art. 257b Abs. 1 OR, wonach nur die tatsächlichen Aufwendungen umgelegt werden (Zitat in Runde 1). Nachgerechnet siehe unten.
- **Fix:** In `parseRegisterApartments` ein Komma als Dezimalpunkt annehmen. Die Fläche muss eine Zahl über 0 sein. Die Zimmeranzahl muss eine Zahl ab 1 in halben Schritten sein (ohne Obergrenze, siehe V-12). Bei einem Verstoss erscheint ein Fehler am Feld, z. B. «Geben Sie die Fläche als Zahl in m² ein, z. B. 72.5.» und «Geben Sie die Zimmeranzahl als Zahl ein, z. B. 3.5.» (neue Texte in vier Sprachen). Dazu ein Unit-Test für «72,5», «0» und «abc» und optional ein Zahlenmuster in `newApartmentSchema`.

## Nachgerechnet

- **V-15, Fläche 0, Schlüssel «Pro Fläche (m²)», Rechnung CHF 1000, drei Wohnungen mit je 72 m² (Werte aus dem echten GWR-Datensatz Seebahnstrasse 155, siehe unten):**
  - Richtig: 72/216 = CHF 333.33 je Wohnung.
  - Ist bei einer Wohnung die Fläche 0 gespeichert: 72/144 = CHF 500.00 für die beiden anderen, also je CHF 166.67 zu viel, und die Wohnung mit 0 trägt CHF 0.
  - Randfall, alle Flächen 0: Summe 0, Teilung durch 0. Nach V-15 kann das nicht mehr gespeichert werden.
- **V-15, Zimmer 0, Schlüssel «Pro Zimmer»:** wie in Runde 2. Die Wohnung mit 2.5 Zimmern trägt CHF 0 statt CHF 263.16, die Wohnung mit 3 Zimmern CHF 428.57 statt CHF 315.79.
- **V-15, Rundung «3.25»:** gespeichert wird 3.3. Bei 3 + 4 + 3.25 Zimmern ergibt sich ein Anteil von 3.3/10.3 = 32.04 % statt 3.25/10.25 = 31.71 %. Das ist klein, geschieht aber ohne Meldung.

## Bestätigt (gegen Entscheid, Szenario oder echte Daten)

- **Echte Registerdaten:** `api3.geo.admin.ch` am 19.10.2026 abgefragt, Seebahnstrasse 155 Zürich, EGID 147881:
  - Suche: `featureId` lautet «147881_0», `label` «Seebahnstrasse 155 <b>8003 Zürich</b>», `detail` endet auf «ch zh». Das passt zu `toAddressHits`.
  - Gebäude: `gkat` 1030, `gklas` 1122, ergibt «Mehrfamilienhaus»; `gbauj` 1932.
  - Wohnungen: `wstat` 3004 ×8, `wstwk` 3101–3104 (ergibt 1. bis 4. OG), `whgnr` 101–402, `wbez` Links/Rechts, `wazim` 3, `warea` 72.
- **Gebäudetyp** (`building-register.ts:60–67`, `:137`): Zuerst gilt `gkat` 1040, dann ergibt 1110/1121/1122/1220/1230/1251 den jeweiligen Typ. 1130 und alle anderen Werte lassen das Feld leer. Das entspricht dem Entscheid wörtlich.
- **Stockwerk** (`:70–76`): 3100 → 0, 3101–3199 → 1–99, 3401–3419 → −1…−19, alles andere → leer (also Pflicht). Das entspricht dem Issue und den echten Daten.
- **Status** (`:78`): Übernommen werden nur 3003 und 3004. Das entspricht dem Entscheid.
- **Doppelte Nummern** (`:113–119`): Nur eine Nummer, die mehrfach vorkommt, bekommt die Hausnummer vorangestellt («10-101»), die übrigen bleiben. Das entspricht dem Entscheid. Bleiben trotzdem Doppel übrig, lehnt das Backend sie ab und legt nichts an (409 `APARTMENT_NUMBER_TAKEN`, im pg-Test belegt).
- **Vorschlag für eine fehlende Nummer** (`:83–89`): aus Stockwerk und `wbez`, bei Wiederholung mit Zähler, ohne Stockwerk kein Vorschlag (dann Pflicht). Das entspricht dem Entscheid.
- **Fehlende Werte** (`:128–131`, `RegisterApartments.svelte`): Nummer, Stockwerk, Fläche und Zimmeranzahl werden markiert und sind Pflicht, ohne Vorgabewert. Das entspricht dem Entscheid.
- **Ein Schritt:** `createBuilding` legt Gebäude und Wohnungen in einer Transaktion an. Die Wohnungen beginnen mit dem Status «leer».
- **Deutsche Texte:** `buildings_register_no_hit`, `_unreachable`, `_only_apartments`, `_no_apartments`, `_apartments_leave_out`, `_rooms_help`, `_create` und `_existing` stimmen Wort für Wort mit dem Entscheid überein. `_apartments_check` entspricht dem Vorschlag aus V-4. Der Hilfetext nennt das «eidgenössische Gebäude- und Wohnungsregister (GWR)», wie entschieden.
- **fr/it/en sagen dasselbe:**
  - Amtliche Namen: RegBL «Registre fédéral des bâtiments et des logements», REA «Registro federale degli edifici e delle abitazioni», RBD «Federal Register of Buildings and Dwellings», alle mit dem Bundesamt für Statistik bzw. swisstopo richtig übersetzt.
  - Kurzform: «registre des bâtiments», «registro degli edifici», «building register».
  - Begriffe nach `i18n-begriffe.md`: immeuble/immobile/building, appartement/appartamento/apartment, erfassen = saisir/registrare/add, Zimmeranzahl = pièces/locali.
  - Den Sinn von M-1 («ihren Anteil tragen Sie») geben alle drei Sprachen wieder: «vous en supportez la part», «la loro quota è a Suo carico», «you bear their share».
  - fr setzt die Guillemets mit geschütztem Leerzeichen.
- **Datenschutzerklärung `privacy_third_3`** in vier Sprachen:
  - Der Text stimmt mit dem Code überein. Der Browser ruft nur das BFF auf (`AddressSearch.svelte`: `apiCall('/addresses')`, `BuildingForm.svelte`: `apiCall('/addresses/<egid>')`). Erst der Server fragt api3.geo.admin.ch, und zwar mit `searchText` bzw. mit der EGID als «Nummer des gewählten Gebäudes im Register».
  - Einen weiteren Aufruf des Browsers an einen fremden Server gibt es in diesem Diff nicht. OpenPLZ ist ganz entfernt (`src/lib/services/openplz.ts` ist gelöscht).
  - Art. 19 Abs. 2 DSG (Zitat in Runde 1) ist erfüllt.

## Fehlende Begriffe

- Gebäuderegister: bereits Issue #488 (`fachlich`, `entscheiden`), Formulierung wie in Runde 2. Nichts Neues.
- Neue Texte für V-15 und V-16 (Fehler bei Zahlen, «2. UG») sind Formulierungen, keine neuen Fachbegriffe. Dafür braucht es kein Issue.

## Nicht bestätigt

- **Ob die Seite von swisstopo die API-Dienste abdeckt (R-1):** www.swisstopo.admin.ch war nicht erreichbar (Proxy: connect_rejected). Belegt ist die Seite nur über die Treffer von `mmx search`. Ob sie für api3.geo.admin.ch gilt: **unsicher**.
- **Auslieferung über AWS CloudFront:** Die Antwort von api3.geo.admin.ch trägt `via: … cloudfront.net (CloudFront)` und `x-amz-cf-pop`. swisstopo betreibt den Dienst also über Amazon Web Services. Empfänger im Sinn von Art. 19 DSG ist nach meiner Einschätzung swisstopo (Schweiz), und AWS arbeitet als Auftragsbearbeiter von swisstopo. Darum halte ich «(Schweiz)» für richtig und Art. 19 Abs. 4 DSG für nicht anwendbar. Das ist **unsicher**: Eine Fedlex-Stelle oder Praxis des EDÖB zu einem Bundesamt als Empfänger mit ausländischem CDN habe ich nicht gesucht. Kein Befund.
- **Untergeschoss «2. UG» und Zimmer über 6.5 im echten Register (V-16):** Abgerufen habe ich nur einen echten Datensatz (Seebahnstrasse 155, ohne solche Werte). Dass es solche Werte gibt, folgt aus den Wertebereichen von WSTWK (3401–3419) bzw. WAZIM. Die Wertebereiche stammen aus dem Issue, den Merkmalskatalog habe ich nicht im Original gelesen.
- **GWR-Codelisten (WSTAT 3003/3004, GKAT/GKLAS):** Bestätigt sind sie über den Entscheid, Suchtreffer (Runde 2) und den einen echten Datensatz, nicht über den Merkmalskatalog im Original.
- **Nutzungsbedingungen der BGDI («Stop and ask» Punkt 1):** nicht geprüft. Gefunden habe ich nur den Treffer «Terms of use for free geodata and geoservices (OGD)» (swisstopo.admin.ch/en/terms-of-use-free-geodata-and-geoservices: «may be used, distributed and made accessible»). Die Seite selbst war nicht erreichbar.
