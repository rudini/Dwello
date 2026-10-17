# Fachreview 1: #75 (Titel «Tankbestand») und #62 (Umbenennung Monatlich total)

Geprüfter Stand: Worktree `review-w3d-fach`, Commit 5f427ee («docs(tests): add @wip Tankbestand title scenario»).
Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, `messages/{de,fr,it,en}.json`, Issues #75 und #62 samt Kommentaren, Fedlex (VMWG, SR 221.213.11).

Ergebnis: Kein Blocker, kein Major. Der Titel «Tankbestand» und die geplanten fr/it/en-Texte passen zum Glossar, zur Tabelle in i18n-begriffe.md und zu den Texten in Assistent und Rechnung. Der Name `monthlyTotal` passt zum Glossar.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Minor | fr: Unter dem neuen Titel «Stock de combustible» braucht der Einleitungstext «stock» auch für den Lagerort («la citerne ou le stock») |
| V-2 | Verwalter | Nit | en: Der Einleitungstext sagt «tank or storage», `buildings_no_tank_help` sagt «tank or fuel store» |
| V-3 | Verwalter | Nit | Szenario: Titel liest sich holprig; im Kommentar heisst der Abschnitt «Feld» |
| V-4 | Verwalter | Nit | Der DOM-Test prüft noch den alten Titel; fr/it/en prüft kein Test |
| V-5 | Verwalter | Minor | #62: Das Feld `rent` (Mieterseite) enthält dieselbe Summe, der Plan benennt es aber nicht um |
| V-6 | Verwalter | Minor | #62: Der E2E-Schritt «kostet die Wohnung monatlich … brutto», das Target «Monatliche Kosten brutto» und `grossMonthlyRent` behalten «brutto» |
| V-7 | Verwalter | Nit | #62: Der Doc-Kommentar sagt «Gross monthly rent … additional costs», der Testname sagt «Akontozahlung» statt «Akonto» |

## Befunde

### V-1 (Minor): fr «stock» meint zwei verschiedene Dinge

- Belege: geplanter Titel fr «Stock de combustible» (i18n-begriffe.md:77, entspricht `statements_fuel_stock`, `statements_add_stock`, `statements_finding_stock_missing_one`). `messages/fr.json:343` (`buildings_fuel_intro`): «la valeur dans la citerne ou le stock en francs … quantité dans la citerne ou le stock … Si la citerne ou le stock contient plus …». Dagegen `messages/fr.json:305` (`buildings_no_tank_help`): «la citerne ou le dépôt de combustible».
- Warum falsch: Im Titel bedeutet «stock» den Bestand (Wert in CHF), im Einleitungstext direkt darunter den Lagerort («le stock contient plus que la dernière livraison»). Der Fehler gab es schon vorher, mit dem neuen Titel steht er nun aber sichtbar im selben Abschnitt. Ein Leser versteht «la valeur dans … le stock» als «den Wert im Bestand».
- Lösung: Im fr-Einleitungstext «le stock» als Lagerort durch «le dépôt» ersetzen, wie in `buildings_no_tank_help`: «dans la citerne ou le dépôt», «Si la citerne ou le dépôt contient plus …». «citerne» bleibt unverändert, damit wird #315 nicht entschieden.

### V-2 (Nit): en «storage» und «fuel store»

- Belege: `messages/en.json:343` «in the tank or storage» (dreimal); `messages/en.json:305` «the tank or fuel store».
- Lösung: einheitlich «tank or store» oder «tank or fuel store». Das betrifft nicht #315, weil «tank» bleibt.

### V-3 (Nit): Szenariotitel und Kommentar

- Belege: `tests/e2e/features/building-detail.feature:57` «das Feld der Gebäudeseite heisst gleich»; :59 «Die Gebäudeseite nennt den Bestand im Tank oder Lager Tankbestand».
- Warum: Es handelt sich um einen Abschnitt (Panel), nicht um ein Feld, und der Schritt sagt selbst «Abschnitt». Der Titel reiht zwei Substantive ohne Verbindung aneinander.
- Lösung: Kommentar «… der Abschnitt der Gebäudeseite heisst gleich (#75)». Titel z.B. «Der Abschnitt zum Heizmaterial heisst Tankbestand». Der Schritt :61 «Dann heisst der Abschnitt zum Heizmaterial auf der Gebäudeseite "Tankbestand"» ist fachlich korrekt: «Heizmaterial» steht im Glossar (UBIQUITOUS_LANGUAGE.md:137).

### V-4 (Nit): Tests zum Titel

- Belege: `src/__tests__/buildings-pages.dom.test.ts:267` erwartet «Brennstoff im Tank oder Lager». Das Szenario prüft nur Deutsch. `sprachen-bildschirme.feature` prüft für fr/it/en nur, dass kein Deutsch erscheint.
- Warum: Der DOM-Test wird mit dem neuen Text rot und muss in derselben Änderung angepasst werden. Ob fr/it/en die Werte aus i18n-begriffe.md tragen, prüft kein Test. Das ist vertretbar, weil die Texte vor der Übernahme hier geprüft wurden.
- Lösung: DOM-Test auf «Tankbestand» umstellen. Persona-Prüfung der Sprachen gemäss Workflow 5.

### V-5 (Minor): `rent` auf der Mieterseite ist ebenfalls das Monatlich total

- Belege: `src/routes/tenants/[id]/+page.server.ts:29` `rent: grossRent(contract),`; `src/routes/tenants/[id]/TenantRentalCard.svelte:26-28` mit dem Label `m.common_monthly_total()` und dem Wert `rental.rent`. #62 nennt diese Datei unter «Where».
- Warum: Nach der Umbenennung hiesse die Summe an drei Stellen `monthlyTotal` und an einer `rent`. «rent» liest sich wie Nettomiete bzw. Mietzins (UBIQUITOUS_LANGUAGE.md:48: «Nettomiete … Auch: Mietzins»). Genau diese Verwechslung will #62 beseitigen.
- Lösung: `rent` ebenfalls in `monthlyTotal` umbenennen (Typ, Mapper, Svelte-Komponente und Tests).

### V-6 (Minor): «brutto» in den Akzeptanztests

- Belege: `tests/e2e/features/apartment-detail.feature:19` «Und kostet die Wohnung monatlich "CHF 950.00" brutto»; `tests/e2e/steps/apartment-detail.steps.ts:50`; `tests/e2e/targets/apartment-detail.ts:9` `target('Monatliche Kosten brutto', …)`; `tests/e2e/questions/apartment-detail.ts:19` `grossMonthlyRent`.
- Warum: Gherkin-Szenarien dürfen nur Glossarbegriffe verwenden (CLAUDE.md, Conventions). «brutto» steht nicht im Glossar. Seit dem Entscheid zu #62 (Option B) fehlt im Glossar jeder Bezug zu «Bruttomiete». Die UI zeigt «Monatlich total».
- Lösung (Formulierungsvorschlag): Schritt «Und beträgt das Monatlich total der Wohnung "CHF 950.00"», Target «Monatlich total», Question `monthlyTotal`. Das ändert kein Verhalten. Wenn es nicht in diese Änderung gehört, bitte ein Issue eröffnen (Label `fachlich`), alternativ #62 ergänzen.

### V-7 (Nit): Kommentar und Testname

- Belege: `src/lib/server/contract-history.ts:9` «Gross monthly rent of a contract: base rent, additional costs and advance payment»; `src/__tests__/apartment.test.ts:178` «zählt Nettomiete, Zusatzmiete und Akontozahlung zusammen».
- Warum: «additional costs» kann man im Englischen als Nebenkosten lesen, gemeint ist aber die Zusatzmiete (`additionalRent`). Im Glossar heisst der Begriff «Akonto», nicht «Akontozahlung».
- Lösung: Kommentar «Monatlich total: base rent + additional rent + advance payment (Nettomiete + Zusatzmiete + Akonto)». Testname «zählt Nettomiete, Zusatzmiete und Akonto zusammen». Code-Hinweis am Rand: Wenn Funktion und Feld beide `monthlyTotal` heissen, entsteht in `apartment.ts:68` `monthlyTotal: monthlyTotal(current)`. Ein Funktionsname wie `monthlyTotalOf` vermeidet das Überschatten.

## Bestätigt

- **Titel «Tankbestand» (#75):** Laut Glossar UBIQUITOUS_LANGUAGE.md:135 ist der Tankbestand der «Wert des Heizmaterials im Tank oder Lager (Öl, Flüssiggas, Pellets, Holz) an einem Stichtag, in CHF». Das deckt genau ab, was der Abschnitt erfasst (Stichtag, Wert in Franken), und schliesst Holz und Pellets ein. Damit ist «Vorrat» entbehrlich, wie entschieden. Das «Gas» im Issue meint Flüssiggas, wie Glossar und Einleitungstext sagen («Öl, Flüssiggas, Pellets oder Holz»), nicht leitungsgebundenes Erdgas. Ein singulärer Titel über einer Liste mehrerer Stichtage ist als Abschnittsname üblich. Der Link «Tankbestände prüfen» (`statements_check_stocks`, de.json:1189) führt jetzt zu einem Abschnitt mit passendem Namen; das löst die Persona-Befunde helga-w8b P-4 und anna-w8b P-4 zur Benennung.
- **Einheitlichkeit de:** «Tankbestand» erscheint in `invoices_service_period_help` (767), `statements_finding_stock_missing_*` (977/978), `statements_part_stock`/`statements_fuel_stock` (1077/1081), `statements_tank_text` (1158), `statements_add_stock(_for)` (1159/1188) und `buildings_no_tank_help` (305). Der Einleitungstext `buildings_fuel_intro` sagt «Wert im Tank oder Lager in Franken», Anfangsbestand und Endbestand, wie Glossar :135–138.
- **Einheitlichkeit fr/it/en:** Die gleichen Schlüssel sagen «stock de combustible», «scorta di combustibile» und «fuel stock» (fr/it/en.json 305, 345, 767, 977, 1077, 1081, 1158, 1159, 1188). Die geplanten Titel «Stock de combustible», «Scorta di combustibile» und «Fuel stock» entsprechen i18n-begriffe.md:77. Ausnahme in fr: V-1. In keinem Titel steht «citerne» oder «serbatoio», #315 bleibt also unberührt.
- **Rechtsgrundlage (Mietrecht):** VMWG Art. 5 Abs. 2 (Fedlex, SR 221.213.11): «Darunter fallen insbesondere die Aufwendungen für: a. die Brennstoffe und die Energie, die verbraucht wurden;». VMWG Art. 8 Abs. 2 (Fedlex): «… die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.» Der Titel ändert daran nichts, und der Einleitungstext rechnet weiterhin den Verbrauch ab. Der Abschnitt ist nur für den Vermieter sichtbar, für den Mieter ist nichts irreführend. Keine M-Befunde.
- **Formel im Einleitungstext** (Anfangsbestand + Einkauf − Endbestand), nachgerechnet:
  - 600 + 0 − 100 = 500 (wie statement-detail.feature:284–285, 420–421);
  - Stilllegung mit Endbestand 0: 600 + 0 − 0 = 600;
  - Endbestand 900 bei 600 + 200: ergibt −100, die App meldet das als Befund (`statements_finding_stock_negative`, de.json:980).
- **#62, Name `monthlyTotal`:** Das Glossar (UBIQUITOUS_LANGUAGE.md:51) definiert «Monatlich total» als «Nettomiete + Zusatzmiete + Akonto». `grossRent()` (`contract-history.ts:10-11`) rechnet genau `baseRent + additionalRent + monthlyAdvancePayment`. `rentBrutto` (`contract-history.ts:21`, `types.ts:100`) und `totalBrutto` (`apartment.ts:68`, `types.ts:113`) übernehmen diesen Wert. Die UI zeigt dazu `common_monthly_total` «Monatlich total». Die Umbenennung zu `monthlyTotal` und der Describe-Block «Monatlich total» passen also zum Glossar. Der Vergleich mit «Bruttomiete» ist aus dem Glossar bereits entfernt (in UBIQUITOUS_LANGUAGE.md kommt «Bruttomiete» nicht mehr vor). Nachgerechnet:
  - 1200 + 50 + 180 = 1430 (apartment.test.ts:180);
  - 800 + 0 + 150 = 950 (apartment-detail.feature:14/19);
  - ohne laufenden Mietvertrag 0 (apartment.ts:68);
  - fehlende Zusatzmiete (`null`) zählt als 0 (`amount()` mit `?? 0`).

## Fehlende Begriffe

Keine neuen. «Tankbestand», «Heizmaterial», «Stichtag», «Anfangsbestand/Endbestand» und «Monatlich total» stehen im Glossar. «Tank» als eigenständiger Begriff ist in #315 offen und wird hier nicht verwendet.

## Nicht bestätigt

- **Wortlaut von OBLF und OLAL Art. 8 Abs. 2 (fr/it) auf Fedlex:** Gefunden habe ich nur Sekundärquellen: juriup.ch «renseignements sur l'état des stocks de combustibles au début et à la fin de la période de chauffage» und nessell.ch «stato delle scorte di combustibile all'inizio e alla fine del periodo». Beide stützen «stock de combustible» und «scorta di combustibile», gelten aber als **unsicher**, bis der Fedlex-Wortlaut vorliegt (gesucht mit `mmx search`).
- **en «Fuel stock»:** Englisch ist keine Amtssprache, es gibt keine Rechtsquelle. Geprüft habe ich nur die Übereinstimmung mit i18n-begriffe.md und en.json.
- **Gebräuchlichkeit von «Tankbestand» für Holz und Pellets in der Praxis der Treuhänder:** Nicht mit einer Quelle belegt. Es gilt der Entscheid des Product Owners in #75 und das Glossar.
- Tests habe ich nicht ausgeführt. Die Prüfung beruht nur auf dem Lesen des Codes.
