# Fachreview Runde 1: #100 «Brennstoff» (Commit 44914f7b, vor der Umsetzung)

Gegenstand: die zwei `@wip`-Szenarien (`tests/e2e/features/building-detail.feature:62-68`, `tests/e2e/features/categories.feature:126-132`), die geplante Umsetzung (Spalte `categories.is_fuel`, gesetzt nur für «Heizung») und die vorgeschlagenen Texte. Worktree: `/tmp/claude-0/-home-user-Dwello/6a612fe5-db6f-5ef4-85c5-983800bc9434/scratchpad/review-w16-fach`.

Kurzfazit: Beide Szenarien setzen den Entscheid aus #100 (Option 2) richtig um, und die Beispiele passen fachlich. «Heizungsservice» und «Kaminfeger» sind Heizkosten, aber kein Brennstoff; «Stückholz» ist Heizmaterial mit Lager. In der geplanten Umsetzung fehlen zwei Übergänge mit bestehenden Tankbeständen (V-1, V-2). Beide können dazu führen, dass die Abrechnung den Einkauf statt des Verbrauchs abrechnet.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter / Mietrecht | Major | Die Migration setzt `is_fuel` nur für «Heizung». Eine eigene Kategorie, die heute schon einen Tankbestand hat, verliert das Erfassen weiterer Tankbestände: Der Endbestand fehlt, abgerechnet wird der Einkauf. |
| V-2 | Verwalter / Mietrecht | Major | Ungeregelt: Was gilt, wenn der Liegenschaftsverwalter «Brennstoff» bei einer Kategorie mit Tankbeständen wegnimmt? Gleiche Folge wie V-1. |
| V-3 | Verwalter | Minor | Im Hilfetext fehlt Flüssiggas. Er sagt nicht, dass Erdgas aus der Leitung, Fernwärme und Strom keinen Tankbestand haben, obwohl sie rechtlich «Brennstoffe und Energie» sind. |
| V-4 | Verwalter | Minor | Der neue Hinweis auf der Gebäudeseite sagt nicht, was zu tun ist. |
| V-5 | Verwalter | Minor | Regel «Brennstoff nur mit Heizkosten und umlagefähig» nicht festgelegt: Speichern bei weggenommenem «Heizkosten nach dem Heizprofil verteilen», Anzeige bei «Nicht umlagefähig». |
| V-6 | Verwalter | Minor | Dass «Brennstoff» bei neuen eigenen Kategorien standardmässig aus ist (Entscheid #100), prüft kein Szenario. Das Szenario in building-detail.feature legt die Kategorie über die API an. |
| V-7 | Verwalter | Nit | Die Tank-Frage im Abrechnungslauf (`tankQuestion`) kommt weiterhin bei jeder Rechnung mit Heizkosten, auch nur für den Kaminfeger. Mit dem neuen Merkmal liesse sie sich auf Brennstoff eingrenzen. |
| V-8 | Verwalter | Nit | In der PRD fehlen im Kategorienformular die Felder für Heizkosten und Brennstoff. Im Glossar steht als Umsetzung noch «geplant (#100)». |

Mietrecht (M): kein eigener Befund. Die Rechtsgrundlage aus #100 ist bestätigt (siehe unten). V-1 und V-2 haben eine mietrechtliche Folge und sind deshalb beiden Rollen zugeordnet. Rechtstexte (R): nicht betroffen.

## Bestätigt

- **Rechtsgrundlage Brennstoff ≠ Kaminfeger/Service.** Fedlex, VMWG Art. 5 Abs. 2 (Suchauszug von fedlex.admin.ch/eli/cc/1990/835_835_835/de): «Aufwendungen für: a. die Brennstoffe und die Energie, die verbraucht wurden;» und «d. die Reinigung der Heizungsanlage und des Kamins, das Auskratzen, Ausbrennen und Einölen der Heizkessel sowie die Abfall- und Schlackenbeseitigung;». Kaminfeger (lit. d) und Service bzw. Revision (lit. e) sind also anrechenbare Heizkosten, aber kein Brennstoff nach lit. a. Damit stimmen der Satz im Hilfetext «Service, Wartung oder Kaminfeger sind kein Brennstoff», der Kommentar in `building-detail.feature:62-63` und das Gegenbeispiel «Heizungsservice».
- **Art. 8 Abs. 2 VMWG** (Fedlex, Suchauszug): «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von …». Das Wortende stammt nicht von Fedlex, siehe «Nicht bestätigt». Daraus folgt der Tankbestand mit Anfangs- und Endbestand für Heizmaterial im Tank oder Lager.
- **Glossar.** «Brennstoff (Kategorie)» (`UBIQUITOUS_LANGUAGE.md:83`) ist ein «Merkmal einer umlagefähigen Heizkosten-Kategorie». Die geplante Regel «umlagefähig + Heizkosten + Brennstoff» deckt sich damit. Auch «Tankbestand» (Z. 135, «Öl, Flüssiggas, Pellets, Holz») und «Heizmaterial» (Z. 137) werden in Szenarien und Texten richtig verwendet. Dass die Szenarien «Kategorie für Brennstoff» schreiben, passt zum Glossar.
- **Vordefinierte Kategorien.** In `backend/migrations/0002_stammdaten.sql:15,26` sind nur «Heating» und «Chimney Sweep» Heizkosten. Keine andere Migration fügt Kategorien hinzu. Dass `is_fuel` nur für «Heating» gesetzt wird, ist deshalb für die vordefinierten Kategorien richtig.
- **Szenario «Der Tankbestand bietet nur Kategorien für Brennstoff an»:** Es prüft beide Namensprüfungen, die wegfallen: die eigene Heizkosten-Kategorie und «Kaminfeger». Zudem prüft es, dass die vordefinierte «Heizung» angeboten bleibt.
- **Szenario «Eigene Kategorie für Brennstoff erfassen»:** Stückholz ist Heizmaterial mit Lager. Das passt zu `buildings_fuel_intro` (`messages/de.json:362`: «Öl, Flüssiggas, Pellets oder Holz», Einheit «Ster»).
- **Formel unverändert** (`fuel-stock.service.ts:100`; `docs/nebenkostenabrechnung-anforderungen.md:56`). Verbrauch = Anfangsbestand + Lieferungen − Endbestand, nachgerechnet:
  - 2'000 + 3'000 − 1'500 = 3'500
  - Randfall neuer Tank: 0 + 3'000 − 2'500 = 500
  - Randfall Endbestand grösser als Anfangsbestand, ohne Lieferung: 1'000 + 0 − 1'500 = −500. Die Veränderung ist dann negativ und senkt die Heizkosten, wie im Glossar Z. 138 beschrieben.
  - #100 ändert an dieser Rechnung nichts. Es entscheidet nur, welche Kategorie einen Tankbestand haben darf.

## Befunde

### V-1 (Major): Bestehende Tankbestände eigener Kategorien

- **Beleg:** Bisher nimmt `isHeatingCategory` jede umlagefähige Heizkosten-Kategorie ausser dem Kaminfeger an (`backend/src/services/fuel-stock.service.ts:106-111`, `backend/src/routes/buildings.ts:142`). Ein Liegenschaftsverwalter kann also heute schon Tankbestände in einer eigenen Kategorie wie «Heizöl» oder «Holz» haben. Laut Plan (`implementation_plan.md`, Migration `0024_category_fuel.sql`) wird `is_fuel` nur für «Heating» gesetzt.
- **Warum falsch:** Nach der Migration lehnt die API neue Bestände in dieser Kategorie ab (400), und die Gebäudeseite bietet sie nicht mehr an. Bisherige Bestände gehören aber zu ihr, und `otherTankCategory` (Z. 115-118) erlaubt keine zweite Kategorie pro Gebäude. Der Endbestand der nächsten Periode lässt sich also weder in der alten noch in einer anderen Kategorie erfassen. `stockFinding` meldet ihn als fehlend, und die Abrechnung nimmt den Einkauf statt des Verbrauchs. Das widerspricht Art. 5 Abs. 2 lit. a VMWG («die verbraucht wurden»).
- **Korrektur:** Die Migration setzt `is_fuel = true` zusätzlich für jede Kategorie, die schon Zeilen in `fuel_stocks` hat (`UPDATE categories SET is_fuel = true WHERE name = 'Heating' OR id IN (SELECT category_id FROM fuel_stocks)`). Dazu kommt ein `*.pg.test.ts`, der vor dem Ausführen der Migration eine eigene Kategorie mit Bestand anlegt.

### V-2 (Major): «Brennstoff» wegnehmen bei vorhandenen Tankbeständen

- **Beleg:** Löschen ist gesperrt, solange Bestände da sind (`backend/src/services/category.service.ts:225`, `categoryHasFuelStocks`). Für das Wegnehmen des neuen Merkmals ist nichts geplant. `fuelStockChange` (`fuel-stock.service.ts:82`) prüft nur «umlagefähig». Das ist bewusst so (OR 257a) und hier nicht betroffen.
- **Warum falsch:** Die Folgen sind die gleichen wie bei V-1. Die alten Bestände werden weiter abgerechnet, neue lassen sich aber nicht mehr erfassen. Fehlt der Endbestand, wird der Einkauf abgerechnet. Ein unerfahrener Liegenschaftsverwalter sieht diesen Zusammenhang nicht. Dasselbe gilt schon heute für das Wegnehmen von «Heizkosten nach dem Heizprofil verteilen». Diese Lücke besteht also schon, das neue Merkmal kommt dazu.
- **Korrektur:** Mit Bestand das Wegnehmen ablehnen, wie das Löschen: ein Code `backend_category_has_fuel_stocks_fuel` (Name frei) mit einem Text wie «Für diese Kategorie sind Tankbestände erfasst. Löschen Sie zuerst die Tankbestände auf der Seite des Gebäudes, dann können Sie das Häkchen «Brennstoff» entfernen.» Alternative: bei Bestand das Häkchen fest anzeigen und den Grund als Hilfetext dazuschreiben. Dazu ein Szenario für diesen Fehlerzustand oder ein `*.pg.test.ts`.

### V-3 (Minor): Hilfetext zu «Brennstoff»

- **Beleg:** Vorgeschlagen ist: «Nur wenn die Rechnungen dieser Kategorie Lieferungen von Heizmaterial sind, zum Beispiel Heizöl, Pellets oder Holz. …». Die übrigen Texte nennen vier Heizmaterialien: Glossar «Tankbestand» (Z. 135) «Öl, Flüssiggas, Pellets, Holz», `buildings_fuel_intro` und `invoices_service_period_help` (`messages/de.json:362, 825`). Rechtlich sind auch Erdgas und Energie «Brennstoffe und die Energie» (Art. 5 Abs. 2 lit. a VMWG). Ein Laie mit der eigenen Kategorie «Erdgas» oder «Fernwärme» wird beim Label «Brennstoff» das Häkchen setzen.
- **Warum falsch:** Der Text lässt Flüssiggas aus. Er grenzt nicht ab, dass Brennstoff hier nur Heizmaterial mit Tank oder Lager meint, wie es das Glossar festlegt. Zudem fängt er mit einem Nebensatz ohne Hauptsatz an. Die Folge eines falschen Häkchens ist leicht, aber verwirrend: Die Gebäudeseite bietet dann einen Tankbestand für Gas an.
- **Korrektur (Vorschlag):** «Setzen Sie das Häkchen, wenn die Rechnungen dieser Kategorie Lieferungen von Heizmaterial für einen Tank oder ein Lager sind, zum Beispiel Heizöl, Flüssiggas, Pellets oder Holz. Für diese Kategorie erfassen Sie auf der Seite des Gebäudes den Tankbestand, damit Dwello den Verbrauch abrechnet und nicht den Einkauf. Erdgas aus der Leitung, Fernwärme und Strom haben keinen Tankbestand. Service, Wartung und Kaminfeger sind kein Brennstoff.» Alle Begriffe stehen im Glossar. Das Label «Brennstoff» hat der Product Owner entschieden und bleibt.

### V-4 (Minor): Hinweis auf der Gebäudeseite ohne nächsten Schritt

- **Beleg:** Vorgeschlagen ist «Es gibt keine umlagefähige Kategorie für Brennstoff.» (ersetzt `buildings_no_category_text`, `messages/de.json:369`). Daneben steht der Link «Kategorien ansehen» (Z. 370). Nach CLAUDE.md, «Design-Regeln», sagt ein Text, was passiert ist und was zu tun ist.
- **Korrektur (Vorschlag):** «Keine umlagefähige Kategorie ist als Brennstoff markiert. Setzen Sie unter «Kategorien» bei der Kategorie für Ihr Heizmaterial das Häkchen «Brennstoff».»

### V-5 (Minor): Abhängigkeit von «Heizkosten» und «umlagefähig»

- **Beleg:** Laut Plan erscheint das Häkchen nur, wenn «Heizkosten nach dem Heizprofil verteilen» gesetzt ist. Nach dem Glossar (Z. 83) ist Brennstoff ein Merkmal einer umlagefähigen Heizkosten-Kategorie.
- **Warum:** Offen ist, was gespeichert wird, wenn erst «Brennstoff» und dann «Heizkosten» weggenommen wird. Offen ist auch, was das Formular bei «Nicht umlagefähig» zeigt. Bleibt `is_fuel = true` gespeichert, ist der Datenstand widersprüchlich. Bei einem späteren Zurücksetzen auf Heizkosten taucht der Tankbestand dann unerwartet wieder auf.
- **Korrektur:** Das Backend speichert `is_fuel` nur zusammen mit `is_heating_cost` (sonst `false`), mit einem `*.pg.test.ts`. Ob das Häkchen bei «Nicht umlagefähig» sichtbar bleibt, legt die Umsetzung fest. Bleibt es sichtbar, sagt der Hilfetext, dass nur umlagefähige Kategorien einen Tankbestand haben.

### V-6 (Minor): Standardwert bei neuen eigenen Kategorien

- **Beleg:** #100, «Decided»: «off by default for new own categories». `categories.feature:126-132` setzt das Häkchen selbst, `building-detail.feature:65` legt «Heizungsservice» über `seed.heatingCategory` an (`tests/e2e/fixtures/backend.ts:421`). Damit ist der API-Standard geprüft, nicht der Standard im Formular.
- **Korrektur:** Einen DOM-Test für `CategoryForm` ergänzen: Wird «Heizkosten nach dem Heizprofil verteilen» gesetzt, erscheint «Brennstoff» ohne Häkchen. Alternativ das Szenario in categories.feature um diese Zeile ergänzen.

### V-7 (Nit): Tank-Frage nur bei Brennstoff

- **Beleg:** `backend/src/services/invoice-completeness.service.ts:206-219` (`tankQuestion`) fragt bei jeder Rechnung mit Heizkosten nach dem Tank, auch wenn das Gebäude nur eine Kaminfeger-Rechnung hat.
- **Korrektur:** Mit `is_fuel` liesse sich die Frage auf Rechnungen in einer Kategorie mit Brennstoff eingrenzen. Das gehört nicht zum Umfang von #100. Ein Vorschlag als eigenes Issue mit dem Label `fachlich`.

### V-8 (Nit): PRD und Glossar nachführen

- **Beleg:** In `docs/PRD-Dwello.md:1096-1105` («Add Category Form») fehlen die Häkchen für Heizkosten und Brennstoff. In `UBIQUITOUS_LANGUAGE.md:83` steht als Umsetzung «geplant (#100)».
- **Korrektur:** Die PRD ergänzen. Das Glossar darf nicht von einem Agenten bearbeitet werden. Der Aufrufer meldet dem Product Owner, dass dort `is_fuel` Feld eingetragen werden kann (in #100 oder #75).

## Fehlende Begriffe

Keine. «Brennstoff (Kategorie)», «Tankbestand», «Heizmaterial», «Heizkosten (Kategorie)» und «Stichtag» stehen im Glossar. Die Begriffe in den Textvorschlägen von V-3 und V-4 stammen alle aus dem Glossar.

## Nicht bestätigt

- **Art. 8 Abs. 2 VMWG, Wortende** «Heizmaterialien Auskunft zu verlangen»: Der Fedlex-Suchauszug bricht nach «Anfangs- und Endbestand von …» ab. Das Ende steht wortgleich in svit.ch (VMWG-PDF) und mietrecht.ch (VMWG_A4.pdf), nicht direkt auf Fedlex. Fedlex selbst liess sich per WebFetch nicht laden (Seite braucht JavaScript).
- **VMWG Art. 5 Abs. 2 lit. e** (Revision der Heizanlage, Grundlage für «Heizungsservice ist kein Brennstoff»): nur aus Sekundärquellen (St. Galler Mietvertrag-AGB, rothpartner.li). Die Schlussfolgerung hängt aber schon an lit. a und d, die auf Fedlex bestätigt sind.
- **Ob Mietverträge in der Praxis eine Brennstoff-Kategorie mit Erdgas oder Fernwärme mischen** (vordefinierte «Heizung» umfasst laut `categories_heating_help` auch Fernwärme): nicht geprüft. Für Gebäude ohne Tank gilt weiterhin das Häkchen «kein Tank» beim Gebäude (`buildings_no_tank_help`). #100 ändert daran nichts.
- **Demodaten:** nicht geprüft, ob die Demo eigene Heizkosten-Kategorien mit Tankbeständen enthält, die V-1 sichtbar machen würden (gesucht nur in `backend/migrations`).
