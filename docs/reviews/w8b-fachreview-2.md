# Fachreview W8b, Runde 2: Tankbestand-Prüfungen (Feature-Review, nur Delta)

Gegenstand: `git diff 083188b 7e98aaa` im Worktree `/tmp/claude-0/-home-user-Dwello/57f5a1ca-407e-5441-98f4-66ca786359d9/scratchpad/review-w8b-fach2` (Commit 7e98aaa). Geprüft habe ich die Szenarien (`statement-generate.feature`, `building-edit.feature`), die Texte in `messages/{de,fr,it,en}.json`, `stockFinding`/`changeFinding` in `backend/src/services/invoice-completeness.service.ts`, `periodReadings` in `backend/src/services/fuel-stock.service.ts`, den Rahmentitel in `CategoryCheck.svelte` und dazu `PreviewChecks.svelte`, `TankQuestion.svelte`, `statement-wizard.ts` und `fuel-stock.pg.test.ts`.

## Stand der Major-Befunde aus Runde 1

| ID | Stand |
|----|-------|
| V-1 | **Für das Jahr der Stilllegung gelöst** (`covered`, Szenario «Im Jahr der Stilllegung braucht es noch den Endbestand», pg-Probe «verlangt den Endbestand …», Hilfesatz). **Neu ist aber ein Folgefehler:** Das Folgejahr wird nie frei, siehe V-11 (Major). |
| V-2 | **Gelöst.** `changeFinding` (Z. 146-151): Mit Tank in beiden Jahren gibt es einen Hinweis nur, wenn beide Summen > 0 sind. Nachgerechnet siehe «Bestätigt». |

Die Minor-Befunde aus Runde 1: V-3, V-5 und V-7 sind gelöst, V-10 ist bis auf Reste gelöst (V-15). V-4 ist gelöst, wenn es kein Vorjahr gibt; mit Vorjahr bleibt ein Rest (V-13). M-1 ist gelöst, weil der Kommentar im Szenario jetzt stimmt. V-6, V-8 und V-9 bleiben wie besprochen Minor (zu V-9 siehe V-12).

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-11 | Verwalter | Major | «Kein Tank» wirkt nach der Stilllegung nie: Der Endbestand des Stilllegungsjahres (vom Hilfetext verlangt) ist der Anfangsbestand des Folgejahres, also gilt das Folgejahr als «covered» und verlangt wieder einen Endbestand mit Bestätigung, Jahr für Jahr |
| V-12 | Verwalter | Minor | Gemischter Fall mit negativem Verbrauch: zwei Hinweise zur selben Ursache, einer davon «CHF -300.00, 130 % weniger … Prüfen Sie … den Zeitraum, für den die Rechnung gilt» |
| V-13 | Verwalter | Nit | Gibt es ein Vorjahr und nur den Hinweis auf negativen Verbrauch, steht er weiter unter «Kosten im Vergleich zum Vorjahr» mit dem Einleitungssatz zum Vorjahresvergleich |
| V-14 | Verwalter (fr/it/en) | Minor | «indiquez-le dans l’immeuble» / «lo indichi nell’immobile» heisst «im Gebäude drin»; gemeint ist die Seite des Gebäudes (so in `statements_finding_stock_tail`) |
| V-15 | Verwalter (i18n) | Minor | Neues Wort Tank (citerne / serbatoio / tank) und «stillgelegt» (désaffecté / dismesso / decommissioned) fehlen in `docs/design/i18n-begriffe.md`; «Indicare nessun serbatoio» ist kein Italienisch |

Keine Blocker.

## Befunde

### V-11 (Major): Das Folgejahr nach der Stilllegung verlangt wieder einen Endbestand

**Beleg.**
- `backend/src/services/fuel-stock.service.ts:34`: `const covered = readings.some((stock) => stock.readingDate >= dayBefore(periodStart));`
- `backend/src/services/invoice-completeness.service.ts:228`: `if (building?.noTank && !readings?.covered) return null;`
- `messages/de.json:148` `buildings_no_tank_help`: «… Im Jahr der Stilllegung erfassen Sie noch den Endbestand, auch wenn er 0 ist.»
- `backend/src/__tests__/fuel-stock.pg.test.ts:4`: «A reading "am 31.12.2024" closes 2024 and opens 2025.»
- Die pg-Probe «verlangt keinen Stand, wenn das Gebäude ohne Tank …» (Z. 159-170) erfasst 2024-12-31 und prüft 2026; das Szenario «Ein stillgelegter Tank braucht keinen Tankbestand mehr» erfasst 2022-12-31 und prüft 2024. Beide überspringen das Folgejahr und damit den Fehler.

**Nachgerechnet.** Ein Vermieter stellt 2024 auf eine Wärmepumpe um. Er hält «Kein Tank» fest und erfasst, wie die Hilfe sagt, den Endbestand per 31.12.2024 = 0.
- Periode 2024: Anfang 2023-12-31 (800), Ende 2024-12-31 (0). Abgerechnet wird der Verbrauch: 800 + Lieferungen − 0. Richtig.
- Periode 2025: `dayBefore('2025-01-01')` = 2024-12-31, die Ablesung 2024-12-31 ist ≥ diesem Tag, also `covered = true`. Der Endbestand 2025-12-31 fehlt und liegt vor heute (16.10.2026). Ergebnis: Befund `stock` «Tankbestand am 31.12.2025 fehlt.», dazu `statements_finding_stock_tail` mit «Bestätigen Sie nur, wenn der Tank am Anfang und am Ende gleich voll war», und die Vorschau verlangt eine Bestätigung.
- Erfasst er 2025-12-31 = 0, wiederholt sich das 2026, und so jedes Jahr.
- Ohne die Ablesung 2024-12-31 (gegen die Hilfe) wäre 2025 frei. Wer den Rat befolgt, wird also bestraft.

Der Betrag ist nicht falsch: Ohne Endbestand werden die Lieferungen abgerechnet, und nach der Stilllegung gibt es keine. Aber die Eigenschaft hält ihr Versprechen («fragt Dwello dann nicht mehr nach dem Tankbestand») genau im Hauptfall nicht. Der Vermieter muss jedes Jahr etwas bestätigen, das zu seinem Gebäude nicht passt. Das ist der Zustand, den #72 beheben sollte.

**Was es behebt.** Mit «Kein Tank» braucht es Bestände nur, wenn es in der Periode noch etwas zu verbrauchen gibt: eine Ablesung nach dem Tag vor Periodenbeginn oder ein Anfangsbestand ≠ 0. Etwa so:

```ts
const covered = readings.some((s) => s.readingDate > dayBefore(periodStart)) || (!!opening && parseFloat(opening.amount) !== 0);
```

Proben: (a) 2023-12-31 = 800, Eigenschaft gesetzt, Periode 2024: Befund «31.12.2024 fehlt» (bleibt so). (b) Dazu 2024-12-31 = 0, Periode 2025: kein Befund, keine Tankfrage. (c) Stilllegung mitten im Jahr mit Ablesung 2024-06-30 = 0, Periode 2024: Endbestand 31.12.2024 verlangt; Periode 2025: frei. Zu (b) gehört eine pg-Probe und am besten ein zweiter Teil im Szenario «Im Jahr der Stilllegung …» (oder ein eigenes Szenario «Nach dem Jahr der Stilllegung braucht es keinen Tankbestand mehr»). Den Kommentar in `0011_building_no_tank.sql` und in `stockFinding` entsprechend anpassen.

### V-12 (Minor): Gemischter Vergleich bei negativem Verbrauch

**Beleg.** `invoice-completeness.service.ts:142`: `tank` nur, wenn beide Jahre `isFuelStock` haben; sonst `kind: 'deviation'` mit `statements_finding_more/less`. Dazu `stockFinding` Z. 246: `kind: 'consumption'` bei negativer Summe.

**Nachgerechnet.** 2024 mit beiden Beständen: 100 + 500 − 900 = −300. 2023 ohne Bestände mit Einkauf 1000. `changeFinding(tank = false)`: Änderung −1300, |−1300| ≥ 100 und > 250, −1300 / 1000 = −130 %. Es erscheinen zwei Hinweise: «Der Endbestand ist CHF 300.00 höher …» und «CHF -300.00, 130 % weniger als im Vorjahr (CHF 1’000.00). Prüfen Sie den Betrag und den Zeitraum, für den die Rechnung gilt.» Ein negativer Betrag mit «130 % weniger» und der Rat zum Leistungszeitraum (den es für Brennstoff nicht gibt, V-9) verwirren. V-2 hat das für den Fall mit Tank in beiden Jahren gelöst, nicht für den gemischten.

**Was es behebt.** Den Vergleich auch ohne `tank` auslassen, wenn die laufende Summe ≤ 0 ist und die Kategorie Tankbestände hat (`current.some(isFuelStock)`). Dann bleibt nur der Hinweis auf negativen Verbrauch.

### V-13 (Nit): Rahmen bei negativem Verbrauch mit Vorjahr

**Beleg.** `CategoryCheck.svelte:27-33` und Z. 43: Mit `comparedWith` (also `hasComparison`) heisst der Titel «Kosten im Vergleich zum Vorjahr», und davor steht «Dwello vergleicht jede Kategorie mit dem gleichen Zeitraum im Vorjahr …», auch wenn der einzige Befund der negative Verbrauch ist. Mit dem Vorjahr hat der nichts zu tun.

**Was es behebt.** Den Titel «Tankbestände prüfen» und keinen Vergleichssatz, wenn alle Befunde `consumption` ohne `changePercent` oder `stock` sind. Weil der Hinweis nicht blockiert, ist das nur ein Nit.

### V-14 (Minor): «dans l’immeuble» / «nell’immobile»

**Beleg.** `messages/fr.json` `statements_tank_text`: «… ou si la citerne est désaffectée, indiquez-le dans l’immeuble.» `messages/it.json`: «… lo indichi nell’immobile.» `messages/en.json`: «record this on the building.» Zum Vergleich `statements_finding_stock_tail`: «saisissez le stock sur la page de l’immeuble» / «nella pagina dell’immobile» / «on the building’s page».

**Warum.** Auf Französisch und Italienisch heisst das «im Gebäude drin» (vor Ort). Gemeint ist die Seite des Gebäudes in Dwello. Das Deutsche «beim Gebäude festhalten» geht, ist aber auch unscharf.

**Was es behebt.** fr «indiquez-le sur la page de l’immeuble», it «lo indichi nella pagina dell’immobile», en «record this on the building’s page», de wahlweise «halten Sie das auf der Seite des Gebäudes fest».

### V-15 (Minor): Neue Wörter fehlen im i18n-Glossar, ein italienischer Linktext ist ungrammatisch

**Beleg.** `docs/design/i18n-begriffe.md` Z. 75-77 kennt «Tankbestand / Heizmaterial», «Veränderung Tankbestand» und «Anfangsbestand / Endbestand». Einen Eintrag für «Tank» (citerne / serbatoio / tank) und «stillgelegt» (désaffecté / dismesso / decommissioned) gibt es nicht. Der Diff ändert die Datei nicht. CLAUDE.md: «terms and style per language: `docs/design/i18n-begriffe.md`».

**Wortwahl geprüft.**
- «citerne» ist in der Romandie das übliche Wort für den Öltank, «serbatoio» im Tessin ebenso. «dépôt de combustible» und «deposito di combustibile» für das Lager sind passend.
- «désaffectée» ist verständlich. Für technische Anlagen ist in der Schweiz «mise hors service» geläufiger (Nit, kein Muss).
- Die Genusformen der Fakten stimmen: «Aucune ou désaffectée» zu *citerne* (f.), «Nessuno o dismesso» zu *serbatoio* (m.).
- `statements_no_tank_for` it: «Indicare nessun serbatoio: {name}» ist kein korrektes Italienisch (sinngemäss «keinen Tank angeben»). Vorschlag: «Indicare che non c’è un serbatoio: {name}». fr «Indiquer qu’il n’y a pas de citerne : {name}» ist korrekt (Infinitiv, geschütztes Leerzeichen vor dem Doppelpunkt nach Stil prüfen). en «Record no tank: {name}» ist knapp, aber verständlich.
- Die Verbrauchstexte (fr «Consommation … de plus/de moins», it «Consumo … in più/in meno», en «Consumption … more/less») passen zu den bestehenden `statements_finding_more/less`.
- Die Hilfetexte in fr, it und en geben den deutschen Inhalt vollständig wieder, auch den Satz zum Stilllegungsjahr.

**Was es behebt.** In `i18n-begriffe.md` zwei Zeilen ergänzen: «Tank (Lager) | citerne (dépôt de combustible) | serbatoio (deposito di combustibile) | tank (fuel store)» und «stillgelegt | désaffecté(e) | dismesso | decommissioned». Den italienischen Linktext korrigieren.

## Fehlende Begriffe (bleiben aus Runde 1; Issue mit Labels `fachlich`, `entscheiden`)

1. **Gebäude ohne Tank**: Mit V-11 sollte die Definition so lauten: «Merkmal eines Gebäudes: Es hat keinen Tank und kein Lager für Heizmaterial, oder der Tank ist stillgelegt. Der Abrechnungslauf fragt dann nicht nach dem Tankbestand. Braucht eine Abrechnungsperiode noch einen Verbrauch (Anfangsbestand über 0 oder ein Tankbestand innerhalb der Periode), verlangt sie weiter Anfangs- und Endbestand.»
2. **Verbrauch (Heizmaterial)**: unverändert wie in Runde 1.

## Bestätigt

- **V-1, Stilllegungsjahr:** Anfang 2023-12-31 = 800, Eigenschaft gesetzt, Periode 2024: `covered` ist wahr, die Meldung lautet «Tankbestand am 31.12.2024 fehlt.» (Szenario und pg-Probe). Das entspricht VMWG Art. 5 Abs. 2 lit. a (Fedlex, SR 221.213.11, Wortlaut aus Runde 1): «Darunter fallen insbesondere die Aufwendungen für: a. die Brennstoffe und die Energie, die verbraucht wurden;». Ein Gebäude ohne Ablesungen und mit Eigenschaft bekommt keine Tankfrage (`readings` ist null, `!readings?.covered` ist wahr, also `null`). Richtig.
- **V-2, Formel `changeFinding`:**
  - 2000 gegen 1000: +1000 ≥ 100 und > 250, +100 %, «Verbrauch CHF 2’000.00, 100 % mehr als im Vorjahr (CHF 1’000.00)». Richtig.
  - 700 gegen 1000: −300, |−300| > 250, −30 %, «30 % weniger». Richtig.
  - 1200 gegen 1000: 200 ≤ 250, kein Hinweis. Richtig.
  - Randfall Vorjahr −300: `previous ≤ 0`, kein Prozenthinweis. Richtig.
  - Randfall laufend −300 gegen 1000 (beide mit Tank): `current ≤ 0`, nur der Hinweis aus `stockFinding`. Richtig.
  - Randfall Vorjahr 0: kein Hinweis (wie bisher, Z. 139). Richtig.
  - Die beiden `consumption`-Befunde (`stockFinding` bei Summe < 0, `changeFinding` bei Summe > 0) schliessen sich aus. Doppelte Schlüssel in `CategoryCheck` (`${kind}-${categoryId}`) sind damit ausgeschlossen.
  - «beide Jahre mit beiden Beständen» stimmt: `isFuelStock` entsteht nur aus `fuelStockChange`, und das braucht Anfangs- und Endbestand (`fuel-stock.service.ts`, `if (!readings?.opening || !readings.closing) return [];`).
- **V-3:** Die Tankfrage widerspricht sich nicht mehr; der Text entspricht dem Vorschlag aus Runde 1, in allen vier Sprachen.
- **V-4:** Ohne Vorjahr heisst der Rahmen «Tankbestände prüfen» und hat keinen Vergleichssatz. «oder bestätigen Sie unten» erscheint nur bei `confirm`, und der negative Verbrauch löst keine Bestätigung aus (eigene Art `consumption`). Rest: V-13.
- **V-5:** Der Text nennt eine fehlende Lieferung und eine nach der Periode datierte Rechnung, in allen vier Sprachen.
- **V-6:** `missing.filter((day) => day <= today)` setzt «nach heute» wörtlich um. Das Szenario «Laufende Periode verlangt keinen Endbestand» ist datumsfest: Ablesung vor 200 Tagen = Tag vor Periodenbeginn (vor 199 Tagen), Periodenende in 30 Tagen. Der Widerspruch am letzten Tag der Periode (Warnung «läuft noch» plus Bestätigung) bleibt als entschiedenes Minor.
- **V-7:** Ein Schritt «nennt die Prüfung der Kategorien keinen fehlenden Tankbestand» ist ergänzt.
- **M-1:** Der Kommentar im Szenario behauptet nicht mehr, die Warnung erkläre den Tank. Er sagt nur, dass sie rät, nach dem Periodenende abzurechnen. Das stimmt mit `statements_preview_running_text` überein.
- **V-10:** Fakt «Tank: Keiner oder stillgelegt», Link «Kein Tank festhalten: {name}» (gleich gebaut wie «Tankbestand erfassen: {name}»), die Hilfe nennt das Lager für Heizmaterial und nicht mehr «Assistent». Die Checkbox nennt das Lager weiter nicht; das genügt, weil die Hilfe es tut.
- **Szenario «Hinweis auf einen Endbestand …»:** 100 + 500 − 900 = −300, ganzer Text wörtlich wie `de.json`, keine Bestätigung. Richtig.
- **Szenario «Von der Frage nach dem Heizmaterial zum Gebäude ohne Tank»:** Der Link führt zu `/buildings/{id}/edit`, dem Ort der Checkbox. Richtig.
- **Begriffe** in den neuen Szenarien und Texten (Tankbestand, Heizmaterial, Anfangsbestand, Endbestand, Abrechnungsperiode, Stichtag) entsprechen `UBIQUITOUS_LANGUAGE.md`. Ohne Glossareintrag bleiben «Kein Tank / stillgelegt» und «Verbrauch»; sie sind als Issue vorgesehen.

## Nicht bestätigt

- V-11 habe ich nicht ausgeführt, sondern aus dem Code abgeleitet (`fuel-stock.service.ts:28-35`, `invoice-completeness.service.ts:223-247`, `PreviewChecks.svelte:44-53`). Dateien oder Proben zu ändern ist mir nicht erlaubt. Die Ableitung ist eindeutig; eine pg-Probe (2023-12-31 = 700, 2024-12-31 = 0, Eigenschaft gesetzt, Periode 2025) würde sie zeigen.
- Ob «désaffecté» oder «mis hors service» in der Romandie für Öltanks üblicher ist: Das ist Sprachgefühl, ohne Quelle. **unsicher**.
- Neue Rechtsaussagen gibt es in diesem Delta nicht. Für VMWG Art. 5 Abs. 2 lit. a gilt der Fedlex-Wortlaut aus Runde 1; `mmx search` habe ich nicht gebraucht.
- Das Layout (Checkbox mit Hilfe, zwei Links in der Tankfrage) habe ich nicht im Browser gesehen, nur im Quelltext. Das ist Sache der Personas.
