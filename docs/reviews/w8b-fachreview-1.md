# Fachreview W8b, Runde 1: Tankbestand-Prüfungen (@wip-Szenarien)

Gegenstand: `git diff 2287599 083188b -- tests/e2e/features` im Worktree `/tmp/claude-0/-home-user-Dwello/57f5a1ca-407e-5441-98f4-66ca786359d9/scratchpad/review-w8b-fach` (Commit 083188b), dazu die geplanten Texte aus dem Auftrag. Entscheide: #136, #72, #73, #65 (Schwellen), #100 (Brennstoff, Kontext).

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter / Mietrecht | Major | «Kein Tank / Tank stillgelegt» ist für das Jahr der Stilllegung nicht geregelt: Ein fehlender Endbestand bei vorhandenem Anfangsbestand darf nicht verschwinden, sonst wird der Einkauf statt des Verbrauchs abgerechnet; der Hilfetext lädt zum zu frühen Setzen ein |
| V-2 | Verwalter (Formel) | Major | Vorjahresvergleich des Verbrauchs bei Vorjahresverbrauch ≤ 0: falsches Vorzeichen («767 % weniger», obwohl mehr), Division durch 0; mit #73 wird ein negativer Verbrauch ohne Bestätigung erstellbar, der Fall also häufiger |
| V-3 | Verwalter | Minor | Text der Tankfrage widerspricht sich: «Bei Fernwärme … ist nichts zu tun» und neu «halten Sie das beim Gebäude fest» |
| V-4 | Verwalter | Minor | Der Hinweis auf negativen Verbrauch ohne Bestätigung landet im Rahmen «Kosten im Vergleich zum Vorjahr» mit einem Einleitungssatz zum Vorjahr, auch wenn es kein Vorjahr gibt; «oder bestätigen Sie unten» darf dort nicht mehr erscheinen |
| V-5 | Verwalter / Mietrecht | Minor | Häufigste Ursache eines negativen Verbrauchs (Lieferung im Dezember, Rechnung im Januar) nennt der Hinweis nicht; der Hinweis auf späte Rechnungen (#131) schliesst Brennstoffrechnungen aus |
| V-6 | Verwalter | Minor | Am letzten Tag der Periode zeigt die Vorschau «Periode läuft noch» (`periodEnd >= heute`), der fehlende Endbestand (Stichtag = heute) verlangt aber weiter eine Bestätigung; das Szenario #136 schlägt am 31.12. fehl |
| V-7 | Verwalter | Minor | Szenario #136 prüft nur «keine Bestätigung», nicht, dass kein Hinweis zum Endbestand erscheint; die vom PO verworfene Option 2 würde es auch bestehen |
| V-8 | Verwalter | Minor | «Verbrauch» im Vorjahreshinweis ist die ganze Kategorie, auch Brennerservice u. Ä.; die erste Prüfung aus #73 ist dieselbe wie heute |
| V-9 | Verwalter | Minor | Gemischter Vergleich (nur ein Jahr mit beiden Beständen): der allgemeine Text rät, den «Zeitraum, für den die Rechnung gilt» zu prüfen, den es bei Brennstoff laut Hilfe nicht gibt |
| M-1 | Mietrecht | Minor | Laufende Periode: ohne Endbestand wird der Einkauf abgerechnet (Art. 5 Abs. 2 lit. a VMWG), die Warnung «Periode läuft noch» sagt das nicht, anders als der Kommentar des Szenarios behauptet |
| V-10 | Verwalter | Nit | Wortlaut von Checkbox, Hilfe, Fakt und Link: «Lager» fehlt, «Assistent» statt Glossarbegriff, «Tank: Kein Tank» doppelt, Link anders gebaut als «Tankbestand erfassen: {name}» |

Keine Blocker.

## Befunde

### V-1 (Major): Jahr der Stilllegung und Eigenschaft «Kein Tank»

**Beleg.**
- #72, «Decided»: «With that property set, the tank question in the statement wizard stops for the building. A building with earlier Tankbestand readings and without that property gets the missing-reading finding when no reading covers the period.» Was mit der Eigenschaft gilt, wenn ein Bestand der Periode vorhanden ist (Anfangsbestand ja, Endbestand nein), steht dort nicht.
- Szenario `statement-generate.feature`, «Ein stillgelegter Tank braucht keinen Tankbestand mehr»: deckt nur den Fall ab, dass der letzte Bestand (2022-12-31) vor der Periode 2024 liegt.
- Geplante Hilfe: «… oder wenn der Tank nicht mehr gebraucht wird. Der Assistent für die Abrechnungen fragt dann nicht mehr nach dem Tankbestand.»
- `backend/src/services/fuel-stock.service.ts:72-75` (`fuelStockChange`): ohne Endbestand keine Veränderung Tankbestand, die Periode rechnet dann die Lieferungen ab.
- Fedlex, VMWG Art. 5 Abs. 2 lit. a (Stand 1.10.2025): «Darunter fallen insbesondere die Aufwendungen für: a. die Brennstoffe und die Energie, die verbraucht wurden;»

**Warum falsch.** Ein Vermieter, der 2024 auf eine Wärmepumpe umstellt, setzt die Eigenschaft gleich nach der Stilllegung (das legt der Hilfetext nahe) und erstellt dann die Abrechnung 2024. Unterdrückt die Eigenschaft den Befund zum fehlenden Endbestand, gibt es keinen Hinweis, und es wird der Einkauf abgerechnet statt des Verbrauchs:
- Anfangsbestand 800, Lieferung 2000, Rest 1000 abgepumpt oder verkauft: abgerechnet 2000, Verbrauch 800 + 2000 − 1000 = 1800. Der Mieter zahlt 200 zu viel (Art. 5 Abs. 2 lit. a VMWG).
- Anfangsbestand 800, keine Lieferung, Tank leer verbraucht (Endbestand 0): abgerechnet 0, Verbrauch 800. Der Vermieter verliert 800.
In der Praxis gehört zum letzten Jahr mit Tank noch der Endbestand (0, wenn leer).

**Was es behebt.** Regel festhalten, und zwar im Szenario und in der Hilfe: Die Eigenschaft wirkt nur auf Perioden, für die es keinen Bestand vom Tag vor Periodenbeginn an gibt (die Tankfrage und der neue Befund «vergessener Tankbestand»). Ist ein Anfangs- oder Endbestand der Periode erfasst, bleiben der Befund zum fehlenden Bestand und die Veränderung Tankbestand wie bisher. Zusätzliches Szenario, z. B. «Im Jahr der Stilllegung braucht es noch den Endbestand» (Bestand 2023-12-31, Eigenschaft gesetzt, Heizkostenrechnung 2024: Meldung «Tankbestand am 31.12.2024 fehlt.»). Hilfetext ergänzen (Vorschlag siehe V-10). Bestätigt der PO etwas anderes, gilt die Lücke als Produktentscheid.

### V-2 (Major): Vorjahresvergleich bei Vorjahresverbrauch ≤ 0

**Beleg.** `backend/src/services/invoice-completeness.service.ts:139-145`: `if (base.previous.total === 0) return null;` … `Math.abs(change) > base.previous.total * DEVIATION_SHARE` … `changePercent: Math.round((change / base.previous.total) * 100)`. `src/lib/statement-wizard.ts:176-184`: das Vorzeichen von `changePercent` wählt «mehr» oder «weniger». Laut Auftrag nimmt der neue Hinweis dieselbe Schwelle (#73: «the same threshold as the year-on-year check of #65»).

**Nachgerechnet.**
- Szenario: 2024: 500 + 2000 − 500 = 2000, 2023: 500 + 1000 − 500 = 1000. Änderung +1000 ≥ 100 und > 250, also (2000 − 1000) / 1000 = +100 %, «100 % mehr». Richtig.
- Randfall Vorjahr negativ (2023 Endbestand zu hoch erfasst, mit #73 jetzt ohne Bestätigung erstellbar): Vorjahr −300, jetzt 2000. Änderung 2300, die Schwelle −75 ist immer überschritten, 2300 / −300 = −767 %, Text «Verbrauch CHF 2’000.00, 767 % weniger als im Vorjahr (CHF -300.00)». Falsch: der Verbrauch ist gestiegen.
- Randfall Vorjahr 0 (gleicher Bestand, keine Lieferung): `return null`, kein Hinweis, auch bei 3000 jetzt. Das kann man so wollen, steht aber nirgends.
- Randfall jetzt negativ (−300) gegen 1000: zwei Hinweise für dieselbe Ursache, «Endbestand … höher …» und «Verbrauch CHF -300.00, 130 % weniger …».

**Was es behebt.** Der Verbrauchsvergleich läuft nur, wenn beide Verbräuche grösser als 0 sind. Ist der laufende Verbrauch negativ, gibt es nur den Hinweis zum negativen Verbrauch. Ist der Vorjahresverbrauch ≤ 0, gibt es keinen Prozenthinweis. Dazu eine Unit- oder pg-Probe mit Vorjahr −300.

### V-3 (Minor): Tankfrage widerspricht sich

**Beleg.** `messages/de.json:1103` `statements_tank_text`: «… Bei Fernwärme, Erdgas aus der Leitung oder Wärmepumpe ist nichts zu tun.» Geplant ist der Zusatz «Hat das Gebäude keinen Tank oder ist er stillgelegt, halten Sie das beim Gebäude fest.»

**Warum falsch.** Die Fernwärme-Kundin liest erst «nichts zu tun», dann «halten Sie das fest». Mit #72 gibt es aber etwas zu tun, damit die Frage aufhört.

**Was es behebt.** Den letzten Satz ersetzen: «Dann erfassen Sie den Tankbestand am Anfang und am Ende der Periode, sonst rechnet Dwello den Einkauf ab statt den Verbrauch. Heizt das Gebäude mit Fernwärme, Erdgas aus der Leitung oder einer Wärmepumpe, oder ist der Tank stillgelegt, halten Sie das beim Gebäude fest. Dann fragt Dwello nicht mehr.»

### V-4 (Minor): Rahmen des Hinweises auf negativen Verbrauch

**Beleg.** `src/routes/statements/generate/CategoryCheck.svelte:32-55`: Titel `confirm ? statements_maybe_missing_title : statements_compared_title` («Kosten im Vergleich zum Vorjahr»), Einleitung `statements_compared_text` («Dwello vergleicht jede Kategorie mit dem gleichen Zeitraum im Vorjahr … Vielleicht kommt die Rechnung später, oder der Lieferant rechnet anders ab.»), bei `confirm` dazu `statements_check_stocks_text` («… oder bestätigen Sie unten, dass alles stimmt.»). Szenario «Hinweis auf einen Endbestand über Anfangsbestand und Einkauf»: kein Vorjahr erfasst.

**Warum falsch.** Ohne Bestätigung fällt der Stock-Hinweis in den Rahmen «Kosten im Vergleich zum Vorjahr», obwohl er mit dem Vorjahr nichts zu tun hat und es im Szenario gar kein Vorjahr gibt. Wird `confirm` weiter aus `kind === 'stock'` abgeleitet, bleibt «oder bestätigen Sie unten» stehen, ohne dass es eine Bestätigung gibt.

**Was es behebt.** Den negativen Verbrauch als eigene Art führen (nicht `stock`), mit eigenem Titel, z. B. «Tankbestände prüfen». Einen Schritt im Szenario ergänzen, der den Titel oder das Fehlen der Bestätigungsaufforderung prüft.

### V-5 (Minor): Ursache des negativen Verbrauchs nennen

**Beleg.** `invoice-completeness.service.ts:238-262` (`withoutServicePeriod`): Rechnungen der Kategorie des Tankbestands sind vom Hinweis auf Rechnungen nach der Periode ausgenommen (`notInArray(invoices.categoryId, … fuelStocks …)`). Text `statements_finding_stock_negative`: «… Prüfen Sie die Tankbestände.»

**Warum.** Der häufigste echte Grund für «Endbestand höher als Anfang plus Einkauf»: Das Öl kam im Dezember, die Rechnung ist im Januar datiert. Dann ist der Verbrauch dieser Periode zu tief und der der nächsten zu hoch. Bei einem Mieterwechsel zahlt der falsche Mieter (Periodengerechtigkeit, Art. 5 Abs. 2 lit. a VMWG). Weil der Hinweis jetzt nicht mehr blockiert, muss er den Weg zeigen.

**Was es behebt.** «Der Endbestand ist {amount} höher als Anfangsbestand und Einkauf zusammen, der Verbrauch wäre negativ. Prüfen Sie die Tankbestände und ob eine Lieferung fehlt oder ihre Rechnung erst nach dem Ende der Periode datiert ist.» Zum Rechnungsdatum von Lieferungen kein neues Verhalten, nur der Text.

### V-6 (Minor): Stichtag gleich heute

**Beleg.** `src/routes/statements/generate/PreviewChecks.svelte:26`: `notOver = period.periodEnd >= localToday()`. #136: «a missing closing reading whose Stichtag lies after today is no finding». `messages/de.json:330`: «Lesen Sie erst Anfang Januar ab, erfassen Sie den Wert trotzdem per 31.12.»

**Warum.** Am 31.12. zeigt die Vorschau «Periode läuft noch», der fehlende Endbestand vom selben Tag verlangt aber eine Bestätigung, also genau den Zustand, den #136 abschaffen will. Das Szenario «Laufende Periode verlangt keinen Endbestand» schlägt, am 31.12. ausgeführt, fehl (Rechnung «von heute», Stichtag = heute).

**Was es behebt.** Den PO fragen, ob «nach heute» als «ab heute» gemeint ist (dieselbe Grenze wie `notOver`). Sonst das Szenario datumsfest machen und die Grenze in der pg-Probe ausdrücklich prüfen (Periode endet heute: Befund bleibt).

### V-7 (Minor): Szenario #136 zu schwach

**Beleg.** Szenario «Laufende Periode verlangt keinen Endbestand», nur «Und verlangt die Vorschau keine Bestätigung». #136: «Option 1, not reported … (Option 2, reported without confirmation, is not chosen.)»

**Was es behebt.** Einen Schritt ergänzen, z. B. «Und meldet die Prüfung der Kategorien für "Heizung" keinen fehlenden Tankbestand» (oder: die Prüfung der Kategorien erscheint nicht).

### V-8 (Minor): «Verbrauch» umfasst die ganze Kategorie

**Beleg.** #73, Problem: «The category also holds other heating invoices such as burner service, which can hide a typing error». Entscheid: «opening Tankbestand plus all purchases of the category». `invoice-completeness.service.ts:221-222`: Heute ist der negative Befund schon `sum(costs)` aller Rechnungen der Kategorie plus Veränderung.

**Warum.** (1) Die erste Prüfung aus #73 ist rechnerisch die heutige; neu ist nur, dass die Bestätigung wegfällt. Den Tippfehler, den das Problem von #73 beschreibt, deckt sie weiterhin nicht auf. Das hat der PO so entschieden und ist hier nur festgehalten. (2) Der neue Text nennt die Summe «Verbrauch». Bucht der Vermieter den Brennerservice (300) in «Heizung», steht «Verbrauch CHF 2’300.00», obwohl verbraucht 2000 wurde. Die Gleichung im Glossar («Veränderung Tankbestand … Zusammen mit den Lieferungen … ergibt sie den Verbrauch») gilt nur für Lieferungen.

**Was es behebt.** Wortlaut, der stimmt, solange #100 (Brennstoff-Kategorie) nicht umgesetzt ist: «Heizkosten mit Verbrauch aus dem Tank {amount}, {percent} % mehr als im Vorjahr ({previous}). Prüfen Sie die Tankbestände.» Oder nach #100 nur die Brennstoff-Kategorie rechnen und dann «Verbrauch» lassen.

### V-9 (Minor): Gemischter Vergleich

**Beleg.** Auftrag: Der allgemeine Hinweis bleibt, wenn nicht beide Perioden beide Bestände haben. `messages/de.json:948`: «… Prüfen Sie den Betrag und den Zeitraum, für den die Rechnung gilt.» `messages/de.json:732`: Leistungszeitraum «Nicht für Lieferungen von Heizöl, Flüssiggas, Pellets oder Holz».

**Warum.** Hat 2024 beide Bestände und 2023 keine, vergleicht der Hinweis Verbrauch (2024) mit Einkauf (2023) und rät zu einem Leistungszeitraum, den es für Brennstoff nicht geben soll. Beispiel: Einkauf 2023 3000 (ohne Bestände), 2024 Anfang 1500 + Einkauf 0 − Ende 0 = 1500: «50 % weniger». Gemeint ist kein Rechnungsfehler.

**Was es behebt.** Für die Tankkategorie bei gemischtem Vergleich einen eigenen Schluss: «… Im Vorjahr fehlt ein Tankbestand: verglichen wird mit dem Einkauf, nicht mit dem Verbrauch.» Oder in diesem Fall keinen Vergleich.

### M-1 (Minor): Laufende Periode rechnet den Einkauf ab

**Beleg.** Kommentar im Szenario: «die Warnung zur laufenden Periode sagt, warum». `messages/de.json:1091` `statements_preview_running_text`: «… Das Akonto zählt für alle Monate, auch die noch nicht bezahlten, und Rechnungen bis zum Ende der Periode fehlen noch. Erstellen Sie die Abrechnungen erst nach dem Ende der Periode.» Zum Tank steht dort nichts. VMWG Art. 5 Abs. 2 lit. a: «die Brennstoffe und die Energie, die verbraucht wurden».

**Warum.** Ohne Befund und ohne Bestätigung kann der Vermieter Abrechnungen einer laufenden Periode erstellen, die den Einkauf statt des Verbrauchs abrechnen. Die Warnung rät davon ab, nennt aber diesen Grund nicht. Dass die Abrechnungen dann falsch sind, sagt sie nur über Akonto und Rechnungen.

**Was es behebt.** In `statements_preview_running_text` und `statements_period_running_text` ergänzen: «… und den Endbestand im Tank können Sie erst am letzten Tag der Periode erfassen.» Oder den Kommentar im Szenario ehrlich machen. Text gibt es in allen vier Sprachen.

### V-10 (Nit): Wortlaut der neuen Texte

- Checkbox «Kein Tank oder Tank stillgelegt»: Das Glossar nennt «Tank oder Lager» (Tankbestand, Heizmaterial). Vorschlag: «Kein Tank oder Lager für Heizmaterial, oder stillgelegt». Mindestens die Hilfe sollte Pellets und Holz mitnehmen.
- Hilfe: «Der Assistent für die Abrechnungen» ist kein Glossarbegriff (Glossar: Abrechnungslauf, Wizard «Abrechnungen erstellen»). Vorschlag mit V-1: «Für Gebäude mit Fernwärme, Erdgas aus der Leitung oder Wärmepumpe, oder wenn der Tank stillgelegt ist. Beim Erstellen der Abrechnungen fragt Dwello dann nicht mehr nach dem Tankbestand. Im Jahr der Stilllegung erfassen Sie noch den Endbestand, auch wenn er 0 ist.»
- Fakt «Tank: Kein Tank oder Tank stillgelegt»: «Tank» kommt doppelt vor. Vorschlag: «Tank: keiner oder stillgelegt».
- Link «Kein Tank: beim Gebäude festhalten ({name})»: Der bestehende Link heisst «Tankbestand erfassen: {name}» (`statements_add_stock_for`). Gleich gebaut wäre «Kein Tank festhalten: {name}» (Verb vorn, Name hinten).
- Ein bestehender Text, kein Befund dieses Diffs: «Einkauf» in `statements_finding_stock_negative` und `statements_tank_text`, das Glossar sagt «Lieferungen» (Veränderung Tankbestand).

## Fehlende Begriffe (Issue mit Labels `fachlich`, `entscheiden`)

1. **Gebäude ohne Tank** (Vorschlag; Code etwa `no_tank`): «Merkmal eines Gebäudes: Es hat keinen Tank und kein Lager für Heizmaterial, oder der Tank ist stillgelegt. Der Abrechnungslauf fragt dann nicht nach dem Tankbestand. Für eine Abrechnungsperiode mit erfasstem Anfangs- oder Endbestand gilt der Tankbestand weiter.» Heute steht er nicht im Glossar, und Checkbox, Fakt, Link und Tankfrage brauchen ihn.
2. **Verbrauch (Heizmaterial)**: «Anfangsbestand plus Lieferungen der Abrechnungsperiode minus Endbestand, in CHF; was als Heizkosten abgerechnet wird (Art. 5 Abs. 2 lit. a VMWG).» Heute steckt er nur in der Definition «Veränderung Tankbestand», und der neue Hinweis zeigt ihn als eigenen Betrag. Bis #100 umgesetzt ist, enthält die Kategoriesumme auch andere Heizkosten (V-8).

## Bestätigt

- VMWG Art. 5 Abs. 2 lit. a, Fedlex (fedlex.data.admin.ch, SR 221.213.11, Stand 1.10.2025): «2 Darunter fallen insbesondere die Aufwendungen für: a. die Brennstoffe und die Energie, die verbraucht wurden;». Das deckt Verbrauch statt Einkauf, also die Prüfung auf fehlende Bestände.
- VMWG Art. 8 Abs. 2, Fedlex: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.» Eine Pflicht zur Plausibilitätsprüfung folgt daraus nicht. Ein Hinweis ohne Bestätigung (#73) ist damit vereinbar.
- Rechnung im Szenario «Endbestand über Anfangsbestand und Einkauf»: 100 + 500 − 900 = −300, Text «CHF 300.00 höher» = 900 − (100 + 500). Richtig. Kein Vorjahr (2023 ohne Rechnungen), daher kein Vorjahreshinweis.
- Rechnung im Szenario «Verbrauch … Vorjahr»: 2000 gegen 1000, +100 %. Schwelle «> 25 % und ≥ CHF 100» (#65) erfüllt. Weitere Proben: 1300 gegen 1000 (+300 > 250): Hinweis 30 %; 1200 gegen 1000 (200 < 250): keiner; 380 gegen 300 (80 < 100): keiner. Vorjahr gilt als erfasst: erste Rechnung 15.02.2023 ≤ 01.01.2023 + 92 Tage (`RECORDED_FROM_START_DAYS`).
- Szenario «Ein vergessener Tankbestand fällt auf»: Anfangsbestand am Tag vor dem 01.01.2024 = 31.12.2023, Endbestand 31.12.2024. Das passt zu «Stichtag» im Glossar und zu `docs/nebenkostenabrechnung-anforderungen.md` Nr. 10. Dass die Bestätigung nötig bleibt, passt zu `statements_finding_stock_tail`.
- Szenarien «stillgelegter Tank» und «Ohne Tank fragt die Vorschau nicht nach dem Heizmaterial» entsprechen #72 (Frage entfällt, kein Befund ohne Bestand in der Periode).
- Die Begriffe in den Szenarien (Tankbestand, Heizmaterial, Anfangsbestand, Endbestand, Stichtag, Abrechnungsperiode, Liegenschaftsverwalter) stehen im Glossar und sind richtig verwendet.
- Der Wegfall der Bestätigung beim negativen Verbrauch ist so entschieden (#73: «never blocking»). Dem Mieter schadet ein negativer Verbrauch in der laufenden Periode nicht unmittelbar (er erhält eine Gutschrift); zum Risiko in der Folgeperiode siehe V-5.

## Nicht bestätigt

- Dass zur Stilllegung in der Praxis ein letzter Endbestand (auch 0) gehört (V-1): Das ist Treuhänderpraxis. Eine Quelle habe ich nicht gesucht oder gefunden. Fedlex sagt nur «verbraucht wurden».
- Ob ein negativer Verbrauch in einer Abrechnung zulässig ist: Dazu gibt es keine Fedlex-Stelle. **unsicher**.
- Bewertung nach FIFO (`buildings_fuel_intro`, #61): Das ist nicht Gegenstand dieses Diffs. In `docs/nebenkostenabrechnung-anforderungen.md` Z. 56 steht sie als unsicher-B. Ich habe sie nicht geprüft.
- Wie die Bildschirme die neue Eigenschaft und den neuen Hinweis anordnen: Es gibt noch keinen Code dafür. Geprüft habe ich nur Szenarien, Schritte (`tests/e2e/steps/*.steps.ts` im Diff) und die heutigen Komponenten `CategoryCheck.svelte`, `PreviewChecks.svelte` und `statement-wizard.ts`.
- `mmx search` habe ich nicht gebraucht: Den VMWG-Text habe ich direkt als Fedlex-PDF geholt (URL aus `docs/nebenkostenabrechnung-anforderungen.md` Z. 174).
