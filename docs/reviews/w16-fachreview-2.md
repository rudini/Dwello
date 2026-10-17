# Fachreview Runde 2: #100 «Brennstoff» (Delta 44914f7b..8421d7af)

Worktree: `/tmp/claude-0/-home-user-Dwello/6a612fe5-db6f-5ef4-85c5-983800bc9434/scratchpad/review-w16-fach2` (detached, 8421d7af). Geprüft wurden die Migration, die Regeln in `category.service.ts` und `fuel-stock.service.ts`, das Formular (`HeatingChoice.svelte`, `src/lib/server/category.ts`), die Gebäudeseite, die vier Texte in `messages/{de,fr,it,en}.json` sowie PRD und data-model.

Kurzfazit: V-1, V-2, V-3, V-4, V-6 und V-8 sind erledigt. Ein Rest von V-5 ist noch offen und jetzt ein Nit. Es gibt keinen Blocker und keinen Major. Neu sind vier Minor und ein Nit. Drei davon betreffen Texte: zwei Übersetzungen weichen von der Begriffsliste ab, und zwei Hinweise nennen nicht das Häkchen «Heizkosten», an dem «Brennstoff» hängt. Ein Befund betrifft einen Altbestand, bei dem die Sperre aus V-2 jedes Speichern verhindert.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-9 | Verwalter | Minor | Hat eine Kategorie Tankbestände, aber kein Häkchen «Heizkosten» (Altbestand aus der Zeit vor #100), setzt die Migration «Brennstoff». Danach lehnt das Backend jedes Speichern dieser Kategorie ab, auch eine reine Namensänderung. Die Meldung nennt den Ausweg nicht. |
| V-10 | Verwalter | Minor | `backend_category_fuel_has_stock` erscheint auch dann, wenn der Liegenschaftsverwalter nur «Heizkosten nach dem Heizprofil verteilen» wegnimmt. Die Meldung spricht aber nur von «Brennstoff», und dieses Häkchen ist in dem Moment gar nicht sichtbar. |
| V-11 | Verwalter | Minor | `buildings_no_category_text` schickt zum Häkchen «Brennstoff». Bei einer eigenen Kategorie ohne Heizkosten erscheint dieses Häkchen aber erst, wenn «Heizkosten nach dem Heizprofil verteilen» gesetzt ist. |
| V-12 | Verwalter | Minor | Begriffsliste verletzt: In `categories_fuel_help` steht für «Wartung» in fr «entretien» und in en «maintenance». Beide Wörter sind in `i18n-begriffe.md:48` ausdrücklich ausgeschlossen. |
| V-13 | Verwalter | Nit | In fr, it und en ist die Kategorie selbst «ein Brennstoff» («reste donc un combustible», «resta quindi un combustibile», «stays fuel»). Auch das Deutsche «bleibt deshalb Brennstoff» weicht vom Hinweis «als Brennstoff markiert» ab. In en stehen Anführungszeichen “…”, in der Datei sonst überwiegend «…». |
| V-5 (Rest) | Verwalter | Nit (vorher Minor) | Das Häkchen «Brennstoff» ist auch bei «Nicht umlagefähig» sichtbar. Der Hilfetext sagt aber nicht, dass nur eine umlagefähige Kategorie einen Tankbestand hat. |

Mietrecht (M): kein neuer Befund. Rechtstexte (R): nicht betroffen.

## Bestätigt (Runde-1-Befunde)

- **V-1 erledigt.** `backend/migrations/0024_category_fuel.sql:8-9` setzt `is_fuel` für die vordefinierte «Heating» (jetzt zusätzlich auf `type = 'predefined'` eingeschränkt, was richtig ist) und für jede Kategorie mit Zeilen in `fuel_stocks`. Geprüft wird das mit `backend/src/__tests__/migrations.pg.test.ts` («Holz» mit Bestand wird Brennstoff, «Service» ohne Bestand nicht). Sonderfall: siehe V-9.
- **V-2 erledigt.** `category.service.ts` (`updateCategory`) lehnt mit `CATEGORY_FUEL_HAS_STOCK` ab, wenn eine Kategorie mit Tankbeständen ihr Merkmal verlöre. Das gilt direkt und auch über das Wegnehmen von Heizkosten. Die Meldung erreicht das Formular als Formularfehler (`src/__tests__/categories.test.ts`, Contract `tests/contracts/category-fuel-refused.json`). Der deutsche Text folgt dem Vorschlag aus Runde 1. Zum Wortlaut siehe V-10 und V-13.
- **V-3 erledigt.** `categories_fuel_help` (de) entspricht wörtlich dem Vorschlag aus Runde 1. Fachlich ist der Text richtig: Kaminfeger (Art. 5 Abs. 2 lit. d VMWG) und Service sind Heizkosten, aber kein Brennstoff nach lit. a (Fedlex-Zitat in Runde 1). it ist inhaltlich gleich und hält die Begriffe ein. fr und en: siehe V-12.
- **V-4 erledigt** im Sinn von «sagt, was zu tun ist». Die Lücke beim Häkchen «Heizkosten» ist in V-11 beschrieben.
- **V-5 im Kern erledigt.** Das Backend speichert `is_fuel` nur zusammen mit `is_heating_cost`: bei `createCategory` als `!!(isHeatingCost && isFuel)` und bei `updateCategory` mit den gespeicherten Werten als Rückfall. Das Formular macht es genauso (`src/lib/server/category.ts`, `parseCategory`, mit Unit-Test). Ein widersprüchlicher Datenstand entsteht dadurch nicht mehr neu. Er kann nur noch aus der Migration kommen (V-9).
- **V-6 erledigt.** `src/__tests__/categories-page.dom.test.ts` prüft, dass «Brennstoff» bei einer neuen Kategorie erst nach «Heizkosten» erscheint und dann ohne Häkchen. Der API-Standard ist in `category-admin.pg.test.ts` geprüft.
- **V-8 erledigt.** `docs/PRD-Dwello.md:1100-1101` und `docs/data-model.md:168-170` beschreiben die Regel richtig: Brennstoff nur bei Heizkosten, neu ohne Häkchen, Tankbestand nur bei umlagefähiger Kategorie, Merkmal bleibt bei Bestand. Das Glossar (`UBIQUITOUS_LANGUAGE.md:83`, «geplant (#100)») darf nicht von einem Agenten bearbeitet werden. Der Hinweis an den Product Owner bleibt beim Aufrufer.
- **V-7:** bewusst gelassen (Nit), nicht erneut aufgeführt.
- **Gebäudeseite und API stimmen überein.** `src/routes/buildings/[id]/+page.server.ts` filtert `isFuel && isAllowedUtilityCost`, `isFuelCategory` prüft `fuel && allowed`. Die Namensprüfung auf «Chimney Sweep» ist an beiden Stellen weg. Das ist richtig, weil «Chimney Sweep» kein `is_fuel` bekommt (`category-admin.pg.test.ts`).
- **Formel unverändert.** Das Delta berührt `fuelStockChange` nicht. Verbrauch = Anfangsbestand + Lieferungen − Endbestand, nachgerechnet: 2'000 + 3'000 − 1'500 = 3'500. Randfall ohne Lieferung und mit höherem Endbestand: 1'000 + 0 − 1'500 = −500 (die Heizkosten sinken, Glossar Z. 138). Randfall neuer Tank: 0 + 3'000 − 2'500 = 500.
- **Begriffe:** «Brennstoff», «Tankbestand», «Heizmaterial», «umlagefähig» und «Gebäude» stehen im Glossar bzw. in `i18n-begriffe.md` (Z. 9, 47, 85). fr «imputable», «stock de combustible», «immeuble»; it «addebitabile», «scorta di combustibile», «immobile»; en «allocable», «fuel stock», «building»: alles nach der Liste. Die fr-Guillemets in `buildings_no_category_text` haben das geschützte Leerzeichen (geprüft mit `od`).

## Befunde

### V-9 (Minor): Altbestand mit Tankbestand ohne Heizkosten ist gesperrt

- **Beleg:** Die Migration setzt `is_fuel = true` für jede Kategorie mit `fuel_stocks`, unabhängig von `is_heating_cost` (`0024_category_fuel.sql:8-9`). Vor #100 liess sich «Heizkosten» bei einer Kategorie mit Beständen wegnehmen; das war schon in Runde 1 unter V-2 als bestehende Lücke vermerkt. In `updateCategory` gilt dann `data.isFuel = (data.isHeatingCost ?? false) && …`, das ergibt `false`. Weil `stored.fuel` gesetzt ist und Bestände vorhanden sind, folgt `CATEGORY_FUEL_HAS_STOCK`. Das gilt für jeden PUT, auch für einen PUT nur mit neuem Namen. Im Formular ist «Heizkosten» nicht angehakt und «Brennstoff» deshalb ausgeblendet (`HeatingChoice.svelte`).
- **Warum falsch:** Der Liegenschaftsverwalter kann die Kategorie gar nicht mehr speichern. Die Meldung verlangt, die Tankbestände zu löschen, obwohl ein Häkchen bei «Heizkosten» genügen würde. Fachlich gehört Heizmaterial ohnehin zu den Heizkosten (Art. 5 Abs. 2 lit. a VMWG).
- **Korrektur:** Die Migration setzt für Kategorien mit `fuel_stocks` auch `is_heating_cost = true`. Damit gilt das Glossar Z. 83 («Merkmal einer … Heizkosten-Kategorie») ohne Ausnahme. Das verändert die Verteilung beim Mieterwechsel für diese seltenen Kategorien von Tagen auf das Heizprofil, was für Heizmaterial richtig ist. Dazu eine Zeile im `migrations.pg.test.ts` (Kategorie mit Bestand und `is_heating_cost = false`). Alternative: Die Migration setzt `is_fuel` nur, wenn `is_heating_cost` gesetzt ist, und V-10 deckt den Rest ab.

### V-10 (Minor): Meldung beim Wegnehmen von «Heizkosten»

- **Beleg:** `messages/de.json` `backend_category_fuel_has_stock`: «Die Kategorie hat Tankbestände und bleibt deshalb Brennstoff. Soll sie kein Brennstoff sein, löschen Sie zuerst ihre Tankbestände auf der Seite des Gebäudes.» Die Ablehnung kommt auch, wenn nur «Heizkosten nach dem Heizprofil verteilen» weggenommen wurde (`updateCategory`, Kommentar «directly or by clearing is_heating_cost»). In diesem Fall ist das Häkchen «Brennstoff» ausgeblendet.
- **Warum falsch:** Nach CLAUDE.md, «Design-Regeln», sagt eine Meldung, was passiert ist. Wer «Heizkosten» weggenommen hat, liest nur von «Brennstoff» und versteht nicht, welches Häkchen gemeint ist.
- **Korrektur (Vorschlag, de):** «Die Kategorie hat Tankbestände. Deshalb bleiben die Häkchen «Heizkosten nach dem Heizprofil verteilen» und «Brennstoff» gesetzt. Wenn Sie sie entfernen möchten, löschen Sie zuerst die Tankbestände auf der Seite des Gebäudes.» fr, it und en entsprechend, mit den Labels `categories_heating` und `categories_fuel` der jeweiligen Sprache.

### V-11 (Minor): Hinweis auf der Gebäudeseite nennt «Heizkosten» nicht

- **Beleg:** `buildings_no_category_text` (de): «… Setzen Sie bei der Kategorie für Ihr Heizmaterial das Häkchen «Brennstoff».» `HeatingChoice.svelte` zeigt «Brennstoff» nur, wenn `heating` gesetzt ist.
- **Warum falsch:** Ein Liegenschaftsverwalter mit einer eigenen Kategorie «Pellets», bei der «Heizkosten» fehlt, findet das Häkchen nicht. Die Zielgruppe ist unerfahren (CLAUDE.md, «Target users»).
- **Korrektur (Vorschlag, de):** «Keine umlagefähige Kategorie ist als Brennstoff markiert. Setzen Sie bei der Kategorie für Ihr Heizmaterial die Häkchen «Heizkosten nach dem Heizprofil verteilen» und «Brennstoff».» fr, it und en entsprechend.

### V-12 (Minor): «Wartung» in fr und en entgegen der Begriffsliste

- **Beleg:** `docs/design/i18n-begriffe.md:48`: «Wartung (umlagefähig, Art. 5 Abs. 2 lit. g VMWG; nicht «Unterhalt» nach Art. 256 OR) | maintenance (nicht «entretien») | manutenzione | servicing (nicht «maintenance»)». `messages/fr.json` `categories_fuel_help`: «Le service, l’entretien et le ramoneur ne sont pas du combustible.» `messages/en.json`: «Servicing, maintenance and the chimney sweep are not fuel.»
- **Warum falsch:** Ein ausgeschlossener Begriff wird verwendet. «Entretien» und «maintenance» stehen für den Unterhalt nach Art. 256 OR, den der Vermieter trägt. Dieses Wort in einem Text über umlagefähige Heizkosten führt in die Irre.
- **Korrektur:** fr: «Le service, la maintenance et le ramoneur ne sont pas du combustible.» en: «Servicing and the chimney sweep are not fuel.» (Service und Wartung heissen im Englischen beide «servicing».)

### V-13 (Nit): «bleibt Brennstoff» und Anführungszeichen in en

- **Beleg:** `backend_category_fuel_has_stock`: de «bleibt deshalb Brennstoff», fr «reste donc un combustible», it «resta quindi un combustibile», en «stays fuel». `buildings_no_category_text` (en): «Tick “Fuel” …». Gezählt in `messages/en.json`: 103 Mal «, 20 Mal “.
- **Korrektur:** Mit V-10 erledigt sich der Wortlaut. Sonst «bleibt als Brennstoff markiert» / «reste marquée comme combustible» / «resta contrassegnata come combustibile» / «stays marked as fuel». In en «Fuel» statt “Fuel”, wie bei «From Dwello».

### V-5 (Rest, Nit): Hinweis bei «Nicht umlagefähig»

- **Beleg:** Das Häkchen «Brennstoff» ist bei Heizkosten immer sichtbar, auch bei «Nicht umlagefähig». `categories_fuel_help` sagt nicht, dass dann kein Tankbestand angeboten wird. Die Korrektur aus Runde 1 hatte das für diesen Fall verlangt.
- **Warum nur Nit:** Der Hinweis auf der Gebäudeseite sagt «Keine umlagefähige Kategorie …». Der Liegenschaftsverwalter erfährt dort also, warum der Tankbestand fehlt.
- **Korrektur (optional):** Einen Satz an `categories_fuel_help` anhängen: «Nur eine umlagefähige Kategorie hat einen Tankbestand.»

## Fehlende Begriffe

Keine. Alle Begriffe in den Texten und Vorschlägen stehen im Glossar oder in `i18n-begriffe.md`.

## Nicht bestätigt

- **Ob Altbestände wie in V-9 in echten Daten vorkommen:** nicht geprüft. Es gibt keinen Zugriff auf Produktivdaten. Die Demodaten habe ich nicht durchsucht.
- **Wie fr, it und en wirken:** nur gegen `i18n-begriffe.md` geprüft, nicht von einer Person mit der jeweiligen Muttersprache. «imputable» ist dort mit ❓ markiert (#342).
- **E2E- und DOM-Tests:** nicht ausgeführt. Ich habe nur den Code gelesen. Nach den Regeln dieses Laufs gibt es nur einzelne Lesebefehle.
- **Neue Rechtsaussagen:** keine im Delta. Die Fedlex-Belege aus Runde 1 (VMWG Art. 5 Abs. 2 lit. a und d, Art. 8 Abs. 2) gelten weiter, mit den dort genannten Einschränkungen.
