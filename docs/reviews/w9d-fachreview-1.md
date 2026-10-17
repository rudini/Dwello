# Fach-Review W9d, Runde 1 (Commit 1e48a49)

Gegenstand: `@wip`-Szenarien in `tests/e2e/features/statement-detail.feature` zu #351 (Sprache des PDF eines Entwurfs) und #249 («Gebäude» statt «Liegenschaft» im PDF), dazu die geplanten Texte in `backend/src/services/pdf.service.ts` und die Doku-Anpassungen.

Ergebnis: kein Blocker, kein Major. Beide Szenarien sind fachlich richtig und decken die «Done means» der Issues ab. Drei Minor betreffen den geplanten Wortlaut und die Doku.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | «Wohnungsanteil: Kosten des Gebäudes nach dem Verteilschlüssel» liest sich, als sei der Wohnungsanteil gleich den Kosten des Gebäudes |
| V-2 | Verwalter | Minor | «Kosten des Gebäudes» fehlt im Glossar; dort steht nur «Nebenkosten der Liegenschaft» (Begriffsvorschlag unten) |
| V-3 | Verwalter | Minor | `docs/nebenkostenabrechnung-anforderungen.md` beschreibt den Inhalt des PDF an weiteren Stellen mit «Liegenschaft» als die zwei geplanten |
| V-4 | Verwalter | Nit | Szenario #351: die Ausgangssprache des schon erstellten PDF ist nur implizit Deutsch |
| V-5 | Mietrecht | Nit | Kein Test, dass das versendete PDF nach einer späteren Sprachänderung so bleibt, wie es versendet wurde |
| V-6 | Verwalter | Nit | it: «Costi immobile» (ohne Artikel) neben «costi dell’immobile» in der Erläuterung (besteht schon) |

## V-1 (Minor): Erläuterung zum Wohnungsanteil

**Beleg:** Geplant ist «Wohnungsanteil: Kosten des Gebäudes nach dem Verteilschlüssel.» (heute `pdf.service.ts:94` «Wohnungsanteil: Kosten der Liegenschaft nach dem Verteilschlüssel.»). Gleiches Muster in fr `:171` («Part du logement : coûts de l’immeuble selon la clé de répartition»), it `:248`, en `:325` («Apartment share: the building’s costs by the distribution key»). Das Glossar, `UBIQUITOUS_LANGUAGE.md:124`: «**Wohnungsanteil** | Anteil einer Wohnung an den Gebäudekosten gemäss Verteilschlüssel.» Die Spalte zeigt einen Franken-Betrag (`formatCHF(item.apartmentShare)`, `pdf.service.ts:637`).

**Warum falsch:** Die Spalte davor heisst neu wörtlich «Kosten des Gebäudes». Steht derselbe Ausdruck als Erklärung des Wohnungsanteils da, liest ein Mieter: Wohnungsanteil = Kosten des Gebäudes. Das Wort «Anteil» fehlt. Im heutigen Text war das wegen «Kosten Liegenschaft» / «Kosten der Liegenschaft» weniger auffällig. Der Mieter muss die Abrechnung nachvollziehen können (Anforderungen, `docs/nebenkostenabrechnung-anforderungen.md:39`, «nachvollziehbar»).

**Korrektur:** de «Wohnungsanteil: der Anteil Ihrer Wohnung an den Kosten des Gebäudes nach dem Verteilschlüssel.» Für fr/it/en im selben Zug sinngemäss: «Part du logement : la part de votre logement aux coûts de l’immeuble selon la clé de répartition.» / «Quota appartamento: la quota del suo appartamento ai costi dell’immobile secondo la chiave di riparto.» / «Apartment share: your apartment’s share of the building costs by the distribution key.» Ändert #249 die fr/it/en-Texte nicht, genügt die deutsche Korrektur. Den Rest nimmt dann ein eigenes Issue auf.

## V-2 (Minor): Begriff «Kosten des Gebäudes» fehlt im Glossar

**Beleg:** `UBIQUITOUS_LANGUAGE.md:152` «**Nebenkosten der Liegenschaft** | Summe aller umlagefähigen Rechnungen des Gebäudes in der Abrechnungsperiode.» Die Definitionen sagen sonst «Gebäudekosten» (`:117`, `:124`). «Kosten des Gebäudes» steht nicht im Glossar. Die App nutzt den Ausdruck aber schon (`messages/de.json:1069`, `statements_building_costs`), und #249 hat ihn für das PDF entschieden. Der Ausdruck ist auch nicht dasselbe wie «Nebenkosten der Liegenschaft»: Er meint den Betrag **einer** Abrechnungsposition, nicht die Summe aller.

**Warum:** Laut CLAUDE.md stammen die Begriffe nur aus dem Glossar. Hier hat der Product Owner entschieden (#249), also braucht es keinen Marker. Das Glossar soll den Begriff aber führen, sonst bleiben «Liegenschaft» (Synonym, `:14`) und «Nebenkosten der Liegenschaft» die einzigen belegten Wörter.

**Begriffsvorschlag (Issue, Labels `fachlich`, `entscheiden`):**
- **Kosten des Gebäudes**: Betrag einer Abrechnungsposition für das ganze Gebäude in der Abrechnungsperiode, vor der Verteilung auf die Wohnungen. Eine Rechnung mit Leistungszeitraum zählt mit den Tagen in der Periode, Heizmaterial aus dem Tank mit dem Verbrauch. fr «coûts de l’immeuble», it «costi dell’immobile», en «building costs».
- Dazu die Frage an den Product Owner: «Nebenkosten der Liegenschaft» in «Nebenkosten des Gebäudes» umbenennen und «Liegenschaft» nur als Synonym im Verwaltungskontext lassen? Diese Frage gehört zum Punkt «Blocked on me» im Plan.

## V-3 (Minor): Weitere PDF-Beschreibungen in den Anforderungen

**Beleg:** Geplant sind nur «Objekt: Liegenschaft» (`docs/nebenkostenabrechnung-anforderungen.md:115`) und «Gesamtkosten Liegenschaft» (`:116`). Den Inhalt des PDF beschreiben auch:
- `:39`, Spalte Umsetzung: «Kategorie · Gesamtkosten Liegenschaft · Verteilschlüssel …»
- `:40`, Umsetzung: «Briefkopf mit … Liegenschaft (Adresse), Wohnung …»
- `:28`, Umsetzung: «Gesamtkosten je Kategorie der Liegenschaft ausweisen.»
- `:60`, Umsetzung: «Im PDF sichtbar über «eigene Einheiten / Einheiten total der Liegenschaft».»
- `:132`, Umsetzung: «Nur Liegenschaftstotal, Schlüssel und eigener Anteil.»

**Warum:** #249, «Done means»: «`docs/nebenkostenabrechnung-anforderungen.md` … follow.» Bleiben diese Stellen, beschreibt die Anforderung weiter ein PDF mit «Liegenschaft».

**Korrektur:** In den Umsetzungsspalten, die das PDF beschreiben (`:28`, `:39`, `:40`, `:60`, `:132`), «Gebäude» bzw. «Kosten des Gebäudes» schreiben. Wo «Liegenschaft» den Gesetzes- oder Praxiskontext meint (`:5`, `:61`, `:106`, `:166`), darf es bleiben.

## V-4 (Nit): Ausgangssprache im Szenario #351

**Beleg:** `statement-detail.feature`, Szenario «PDF eines Entwurfs folgt der geänderten Sprache des Mieters». «Und für die Abrechnung 2024 von "Eva Frei" gibt es ein PDF» steht vor «Und die Korrespondenz an "Eva Frei" ist auf "Französisch"». Die Steps rufen die echte API auf: `tests/e2e/fixtures/backend.ts:267` POST `generate-pdf`, `:207` PUT `tenants/…` mit `language`. Der Ablauf (zuerst PDF, dann Sprachwechsel, gleicher Tag) stimmt also.

**Warum:** Dass das erste PDF deutsch ist, folgt nur aus der Standardsprache. Für den Leser fehlt der Satz «vorher war es deutsch». Am Ablauf ändert das nichts.

**Korrektur (optional):** Im Kommentar über dem Szenario ergänzen: «das PDF entstand auf Deutsch».

## V-5 (Nit): Versendetes PDF bleibt bei späterem Sprachwechsel

**Beleg:** `backend/src/services/statement-pdf.service.ts:302` macht das PDF nur bei Entwurf neu oder wenn es fehlt. Der Test `statement-pdf.pg.test.ts:656` («behält nach der Zahlung das PDF, wie es versendet wurde») deckt die Zahlung ab, nicht einen Sprachwechsel nach dem Versand.

**Warum:** Der Mieter hat dieses PDF erhalten. Später (Belegeinsicht, Mahnung) muss der Verwalter genau dieses Dokument wieder zeigen können. Der Code tut das heute schon, nur fehlt ein Test für diesen Fall. #351 verlangt ihn nicht.

**Korrektur (optional):** Einen pg-Test ergänzen: versenden, dann Sprache ändern, dann bleibt der Titel deutsch.

## V-6 (Nit): it «Costi immobile»

**Beleg:** `pdf.service.ts:197` «Costi immobile» und `messages/it.json:1069`, aber `:248` «costi dell’immobile». `docs/design/i18n-begriffe.md:62` sagt «costi immobile».

**Warum:** Der Stil passt nicht zusammen (Kurzform in der Überschrift). Das bestand schon vor dieser Änderung, und App und PDF stimmen überein. Nichts zu tun für #249.

## Bestätigt

- **Szenario #249**: «steht im PDF "Kosten des Gebäudes"» entspricht der Entscheidung in #249 und der App (`messages/de.json:1069`). «steht im PDF nicht "Liegenschaft"» ist ein Teilstring-Vergleich (`tests/e2e/steps/statement-detail.steps.ts:253`). Nach der geplanten Änderung kommt «Liegenschaft» in keinem deutschen PDF-Text mehr vor (`grep` in `pdf.service.ts`: nur `:39`, `:42`, `:94`, `:99`). Die E2E-Fixtures haben keinen Firmennamen und keine Kategorie mit «Liegenschaft» im PDF («Liegenschaftssteuer» ist nicht umlagefähig und steht nicht im PDF). Die Prüfung ist also sicher.
- **Kopfblock «Gebäude»** (`pdf.service.ts:524`): Er zeigt Name, Adresse, Ort und Wohnung des Gebäudes, also das Objekt im Sinne von `docs/nebenkostenabrechnung-anforderungen.md:40`. «Gebäude» entspricht der Entität `buildings` (`UBIQUITOUS_LANGUAGE.md:13`). Aus Sicht des Verwalters ist das sogar genauer als «Liegenschaft», denn eine Liegenschaft kann im Grundbuchsinn mehrere Gebäude umfassen.
- **Erläuterungen sharesNote / sharesNoteFuel**: «Kosten des Gebäudes: die Rechnungen der Abrechnungsperiode; …» und «Kosten des Gebäudes bei Heizmaterial aus dem Tank: der Verbrauch (…)» geben dieselbe Regel wie heute wieder. Diese Regel steht in `docs/nebenkostenabrechnung-anforderungen.md:56` (Verbrauch = Anfangsbestand + Lieferungen − Endbestand) und `:116`. Einzige Ausnahme ist der Wohnungsanteil-Satz (V-1).
- **fr/it/en**: «Immeuble / Coûts de l’immeuble», «Immobile / Costi immobile», «Building / Building costs» stimmen mit `messages/{fr,it,en}.json:1069` und mit `docs/design/i18n-begriffe.md:9`, `:62` überein. Eine Änderung braucht es nicht. Die Zeile `:62` auf «Kosten des Gebäudes» umzustellen ist richtig.
- **Szenario #351**: Der Titel «Décompte des charges» entspricht `docs/design/i18n-begriffe.md` («Nebenkostenabrechnung | décompte des charges») und dem bestehenden Szenario mit Sprache vor dem Erstellen. Zur Regel für das versendete PDF: `changeStatementStatus` (`statement-pdf.service.ts:311–317`) erstellt das PDF beim Versand mit der Sprache zu diesem Zeitpunkt. Der neue pg-Test «versendet das PDF in der Sprache des Mieters beim Versand» prüft genau das. Fachlich ist das richtig: Massgebend ist die Sprache beim Versand.
- **Berechnungen**: Die Änderung betrifft keine Formel und keinen Betrag. Nachrechnen ist deshalb nicht nötig.

## Nicht bestätigt

- **Gesetzliche Vorgaben zu Begriff und Sprache der Abrechnung**: Ich habe keine Vorgabe gefunden, dass die Abrechnung «Liegenschaft» oder «Gebäude» sagen oder in einer bestimmten Sprache stehen muss. Gesucht habe ich mit `mmx search` (Art. 257b OR, Belegeinsicht); die Treffer waren nur Sekundärquellen. Fedlex (`fedlex.admin.ch/eli/cc/27/317_321_377/de`) liefert ohne JavaScript keinen Text. Den Wortlaut von Art. 257b OR und Art. 4 VMWG konnte ich deshalb nicht zitieren. `docs/nebenkostenabrechnung-anforderungen.md:166` sagt zur Sprache ebenfalls «keine Vorgabe gefunden». Die Aussage «kein Gesetz schreibt Begriff oder Sprache vor» ist deshalb **unsicher**. Eine Lücke im Sinn des Mietrechts entsteht durch die Änderung aber nicht, denn der Inhalt (Gesamtkosten, Schlüssel, Anteil) bleibt gleich.
- **Gesetzesverweise im Kommentar** des Szenarios «Das PDF erklärt die Verteilung und den Heizölverbrauch» (Art. 5 VMWG, Art. 257b OR, Art. 8 VMWG): Sie sind unverändert und nicht Gegenstand dieser Änderung. Ich habe sie nicht erneut an Fedlex geprüft.
- **Spaltenbreite**: Ob «Kosten des Gebäudes» in der 62-pt-Spalte (`pdf.service.ts:597`) sauber umbricht, sieht man erst im gerenderten PDF. Das gehört zum daten-pruefer bzw. zum Render-Test.
