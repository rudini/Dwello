# Fachreview #452, Runde 1 (vor der Umsetzung)

Gegenstand: @wip-Szenarien `git diff c09ec4fd 281cdd16 -- tests/e2e/features` im Worktree `review-452-fach` (Commit 281cdd16), geplante Texte und Verhaltensentscheide B-1 bis B-5 in `scratchpad/452-texts.md`, Migrationstexte Punkt 5/6. Massstab: Entscheide in #452 / #407-Kommentar 6249574603.

Gesetzestext (Fedlex-Filestore, OR Fassung 1.10.2026 `eli/cc/27/317_321_377/20261001`, VMWG `eli/cc/1990/835_835_835/20251001`, heute abgerufen bzw. aus dem Scratchpad `fedlex/`):
- Art. 256 Abs. 1 OR: «Der Vermieter ist verpflichtet, die Sache zum vereinbarten Zeitpunkt in einem zum vorausgesetzten Gebrauch tauglichen Zustand zu übergeben und in demselben zu erhalten.»
- Art. 256b OR: «Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.»
- Art. 257a Abs. 2 OR: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»
- Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.»
- Art. 5 Abs. 2 VMWG: «Darunter fallen insbesondere die Aufwendungen für: … d. die Reinigung der Heizungsanlage und des Kamins, das Auskratzen, Ausbrennen und Einölen der Heizkessel sowie die Abfall- und Schlackenbeseitigung; … g. die Wartung; …»

## Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major | Einzahl `categories_not_allocable_confirm_one` (de/fr/it/en) ändert nur den ersten Satz; «bleiben diese Rechnungen … Sie müssen sie einzeln …» bleibt Mehrzahl, und categories.feature pinnt das für 1 Rechnung |
| V-2 | Verwalter | Minor | `backend_statement_uncategorized_invoices` (neu): «Danach geht es weiter.» stimmt auf der Detailseite nicht; ein Text für zwei Aktionen. Fix: zwei Schlüssel wie bei `backend_statement_agreements_open` / `_recalculation_…` (`messages/de.json:437, 459`), Schluss «…, und erstellen Sie die berichtigte Abrechnung dann noch einmal.» bzw. «…, und berechnen Sie den Entwurf dann neu.» |
| V-3 | Verwalter | Minor | B-3: Die Periodenregel muss genau `getInvoicesForStatement` folgen (`backend/src/services/invoice.service.ts:549–562`: mit Leistungszeitraum nur die Überschneidung, ohne ihn das Rechnungsdatum). «invoice date, or a Leistungszeitraum» sperrt sonst auch eine Rechnung mit Rechnungsdatum in der Periode und Leistungszeitraum ausserhalb, die gar nicht abgerechnet wird. Fix: dieselbe Abfrage verwenden |
| V-4 | Verwalter | Minor | B-4: «letzte Rechnung» soll Rechnungen ohne Verteilschlüssel überspringen (sonst fällt der Vorschlag auf die Einstellung zurück, obwohl es ältere Rechnungen mit Schlüssel gibt). Vorbild: `fuel-stock.service.ts:46–66` (`keyFor`). In B-4 und `invoices_key_help` gemeint, aber nicht gesagt |
| V-5 | Verwalter | Minor | B-4/invoice-edit: Eine alte, schon abgerechnete Rechnung ohne Schlüssel bekommt beim Öffnen sofort «Pro Zimmer». Speichert der Vermieter nur ein Datum, verteilt eine spätere berichtigte Abrechnung anders als die versendete. Das ist gewollt (#379, Annas Fall), aber am Feld nicht sichtbar. Vorschlag (neu, entscheiden): Hinweis am Feld «Diese Rechnung hatte keinen Verteilschlüssel und wurde gleichmässig pro Wohnung verteilt. Dwello schlägt den Verteilschlüssel der letzten Rechnung dieser Kategorie vor; prüfen Sie ihn.» |
| V-6 | Verwalter | Minor | Done means «never «–»» gilt auch für die Position «Veränderung Tankbestand»: `fuel-stock.service.ts:64–65` gibt `null` zurück, wenn die letzte Rechnung keinen Schlüssel hat und keiner in den Einstellungen steht, und `pdf.service.ts:755` druckt dann «–». Fix: dort ebenfalls «Pro Einheit» drucken (gleiche Berechnung), mit einem Test |
| V-7 | Verwalter | Minor | Das PDF druckt künftig «Pro Einheit», die App zeigt für dieselbe Position «Gleichmässig pro Wohnung» (`src/lib/server/statement.ts:157–159`). Beides ist richtig (`UBIQUITOUS_LANGUAGE.md:131, 134`), aber Vermieter und Mieter sehen dann zwei Namen. Fix: in der App ebenfalls «Pro Einheit» oder ein bewusster Entscheid |
| V-8 | Verwalter | Minor | Bei vordefinierten Kategorien bleibt `categories_heating_help` («… Lassen Sie das Häkchen dort weg», `messages/de.json:1439`, `HeatingChoice.svelte:13`) neben dem gesperrten Häkchen stehen. Fix: bei `predefined` `categories_heating_fixed` statt der Hilfe zeigen |
| V-9 | Verwalter | Minor | `categories_predefined_not_allocable` («Die Wahl gilt nur für neue Rechnungen», `messages/de.json:1412`, fr/it/en ebenso) widerspricht der neuen Rückfrage (4) auf derselben Seite («Rechnungen, die Sie dieser Kategorie ab jetzt zuordnen»). Laut #407 behebt (4) gerade das (V-11 aus w5b-fachreview-3). Fix: zweiten Satz an (4) angleichen |
| V-10 | Verwalter | Minor | Fehlende Fälle in den Szenarien oder namentlich in den tieferen Tests: (a) Kategorie nur mit nicht umlagefähigen Rechnungen oder mit 0 Rechnungen → keine Rückfrage; (b) ≥ 2 Rechnungen → Mehrzahl; (c) nicht umlagefähige Rechnung ohne Kategorie sperrt die Vorschau nicht; (d) Vorschlag und Pflicht im Upload-Dialog (`src/lib/invoice-upload.ts:88–102, 266`), den Done means nennt; (e) eigene Kategorie: «Heizkosten» bleibt änderbar. Die Szenarien sollen ausdrücklich «umlagefähige Rechnung» sagen, wo die Regel nur für umlagefähige gilt (categories.feature, statement-agreed-costs.feature) |
| V-11 | Verwalter | Minor | `docs/nebenkostenabrechnung-anforderungen.md:144` («kann einen Verteilschlüssel haben») und `:153` («Offen: … Rechnungen ohne Kategorie (#382)») mit #452 nachführen |
| V-12 | Verwalter | Minor | fr `categories_heating_fixed`: «présélectionné cette case» heisst «angekreuzt»; bei Warmwasser, Lift usw. ist das Häkchen aber leer. Fix: «Dwello a préréglé cette case pour ses catégories …» (wie «préréglé» in `categories_predefined_hint`, `messages/fr.json:1410`) |
| V-13 | Verwalter | Minor | en `statements_uncategorized_text` und `backend_…`: «the utility costs the rental contract agrees» → «only utility costs agreed in the rental contract» |
| V-14 | Verwalter | Nit | categories.feature: «ob die Kategorie Heizkosten sind» → «ob die Kategorie zu den Heizkosten zählt» |
| V-15 | Verwalter | Nit | invoice-edit.feature: «Gärtner Meier … "Gartenpflege" in der Kategorie "Hauswart"»: Gartenpflege ist eine eigene vordefinierte Kategorie. Fix: z. B. «Hauswart Meier … "Umgebungsarbeiten"» |
| V-16 | Verwalter | Nit | en «Dwello preset this box / this category» → «Dwello has preset …»; fr (4) «que la loi attribue au bailleur» → «que la loi met à la charge du bailleur» (wie `messages/fr.json:1412`) |
| V-17 | Verwalter | Nit | `statements_uncategorized_error` (neu) sagt nur, was zu tun ist; es folgt aber dem Muster von `statements_agreement_error` (`messages/de.json:790`). Möglich wäre «Einige umlagefähige Rechnungen haben keine Kategorie. Ordnen Sie …» |
| M-1 | Mietrecht | Nit | statement-detail.feature prüft nur «Pro Einheit». Es könnte auch den Anteil «1 / 1 Wohnungen» und den unveränderten Betrag prüfen (siehe Nachrechnung) |

## Belege zu Blocker/Major

### V-1 Einzahl der Rückfrage (1)
- Beleg: `452-texts.md:22–26` («only the first sentence changes»), Zeile 23: «1 erfasste Rechnung … fliesst dann … Stellen Sie die Kategorie später zurück, bleiben diese Rechnungen nicht umlagefähig: Sie müssen sie einzeln wieder auf «Umlagefähig» stellen.» Szenario `categories.feature` (neu, «Vor dem Umstellen …»): mit genau einer Rechnung wird «… bleiben diese Rechnungen nicht umlagefähig: Sie müssen sie einzeln …» erwartet.
- Warum falsch: Bei genau einer Rechnung gibt es keine «diese Rechnungen», und «einzeln» ergibt keinen Sinn. Für unerfahrene Vermieter (Design-Regeln: «plain words») liest sich der Text, als wären weitere Rechnungen betroffen. #407 gibt für die Einzahl nur den Anfang vor («1 erfasste Rechnung dieser Kategorie fliesst dann …»). Die Auslassungspunkte verlangen die Einzahl für den ganzen Text; ein neuer Entscheid ist das nicht.
- Fix (de): «1 erfasste Rechnung dieser Kategorie fliesst dann nicht mehr in neue Nebenkostenabrechnungen. Schon erstellte Abrechnungen bleiben, wie sie sind. Stellen Sie die Kategorie später zurück, bleibt diese Rechnung nicht umlagefähig: Sie müssen sie wieder auf «Umlagefähig» stellen.»
  - fr: «1 facture saisie de cette catégorie n’entre alors plus dans les nouveaux décomptes des charges. Les décomptes déjà établis restent tels quels. Si vous rétablissez la catégorie plus tard, cette facture reste non imputable : vous devez la remettre sur « Imputable ».»
  - it: «1 fattura registrata di questa categoria non confluisce più nei nuovi conteggi spese accessorie. I conteggi già allestiti restano come sono. Se in seguito ripristina la categoria, questa fattura resta non addebitabile: deve rimetterla su «Addebitabile».»
  - en: «1 recorded invoice of this category then no longer goes into new utility cost statements. Statements already created stay as they are. If you set the category back later, this invoice stays not allocable: you have to set it back to «Allocable».»
  - Szenariozeile entsprechend: «Stellen Sie die Kategorie später zurück, bleibt diese Rechnung nicht umlagefähig: Sie müssen sie wieder auf «Umlagefähig» stellen.» Die Mehrzahl gehört in einen DOM-Test (V-10 b).
  - Hält der Auftraggeber das für eine Änderung am entschiedenen Text, gehört der Punkt unter «Blocked on me».

## Bestätigt (mit Quelle)

- **Punkt 1, Szenario und Text:** Szenario Kaminfeger = Heizkosten, gesperrt, Grund wörtlich (Teilsatz) wie entschieden. Kaminfeger zählt zu den Heizkosten nach Art. 5 Abs. 2 lit. d VMWG (oben). `is_heating_cost` ist in `0002_stammdaten.sql:15, 26` nur bei Heizung und Kaminfeger true, also stimmt «Heizung und Kaminfeger … alle anderen Kategorien nach Tagen» für Dwellos Kategorien. it/en-Fassung richtig (Begriffe «profilo di riscaldamento», «cambio d’inquilino», «categoria personalizzata» / «custom category», `i18n-begriffe.md:31, 59, 65`).
- **Punkt 2 (1)/(4), Texte de:** wörtlich wie entschieden; fr/it/en mit den Begriffen imputable/addebitabile/allocable, décompte des charges / conteggio spese accessorie / utility cost statement (`i18n-begriffe.md:53, 67`), in Übereinstimmung mit `invoices_not_allocable` (`messages/*.json:829`). Knöpfe im Infinitiv. (4) stützt sich auf Art. 256b OR.
- **B-1:** gezählt wird `categoryId = id` und `isValidUtilityCost = true`, wie entschieden. Beim Laden zählen statt beim Speichern genügt für eine Einzelperson. Nit: Ändert der Vermieter in einem anderen Tab Rechnungen, stimmt die Zahl nicht mehr; kein Befund.
- **B-2:** (4) nur für «Von Dwello», wie #407 Punkt 2 (4) sagt («Wechselt eine Kategorie «Von Dwello» …»).
- **B-3, Erstlauf nicht im Backend abgelehnt:** folgt dem bestehenden Muster der offenen Vereinbarungen (`refuseOpenAgreements` nur bei «Neu berechnen» `statement.service.ts:460` und bei der berichtigten Abrechnung `:705`). Sperre nach Art. 257a Abs. 2 OR richtig.
- **Punkt 4, Szenarien:** Vorschau gesperrt, Link je Rechnung, berichtigte Abrechnung abgelehnt (Status bleibt «Ersetzt»), wie Done means verlangt. Texte de wie entschieden, fr/it gut.
- **Punkt 7, Szenarien und Texte:** Vorschlag aus der letzten Rechnung, eigene Wahl bleibt, Pflichtfehler in Neu und Bearbeiten, PDF «Pro Einheit». `invoices_key_help` de wie entschieden, fr/it/en mit «clé de répartition / chiave di riparto / distribution key» (`i18n-begriffe.md:63`). Fehlertext in vier Sprachen gut. «Pro Einheit»/«Par unité»/«Per unità»/«Per Unit» stehen in `0002_stammdaten.sql:47`.
- **B-5:** neue Rechnung ohne Schlüssel und Leeren des Schlüssels abgelehnt, ein Teil-Update lässt eine alte Rechnung ohne Schlüssel bestehen. Passt zu «old invoices without a key print «Pro Einheit»».
- **Punkt 5, Migration:** alter Text `0002_stammdaten.sql:20` stimmt Zeichen für Zeichen mit `452-texts.md:76` überein. Keine spätere Migration ändert «Elevator» (grep über `backend/migrations`). Neuer Text wie entschieden. Lift-Wartung ist umlagefähig (Art. 257b Abs. 1 OR «Betriebskosten»), Reparaturen und Ersatzteile gehören zur Erhaltung durch den Vermieter (Art. 256 Abs. 1 OR); stimmt mit `UBIQUITOUS_LANGUAGE.md:98` (Vollservicevertrag) überein.
- **Punkt 6, Migration:** alter Text `0021_category_descriptions.sql:14` stimmt Zeichen für Zeichen mit `452-texts.md:77` überein, neuer Text wie entschieden. Wertabhängige Grundgebühren ergeben sich nicht «aus dem Gebrauch der Sache» (Art. 257b Abs. 1 OR) und bleiben nach Art. 256b OR beim Vermieter. Eval-Fall vorhanden (`backend/scripts/llm-eval.ts:57`). Bei der Umsetzung nachführen: `migrations.pg.test.ts:93, 99` und `invoice-categorization.pg.test.ts:236` nennen die alten Texte.
- **Begriffe in den Szenarien:** Verteilschlüssel, Pro Zimmer, Pro Einheit, berichtigte Abrechnung, umlagefähig, vordefinierte Kategorie, Heizkosten, Abrechnungsperiode stehen im Glossar (`UBIQUITOUS_LANGUAGE.md:78, 92, 94, 128–131`). «Rechnungen ohne Kategorie» ist der entschiedene UI-Titel und braucht keinen Glossarbegriff.

## Nachrechnung (Punkt 7, «Pro Einheit» statt ohne Schlüssel)

`{units}` je Wohnung 1, geteilt durch alle Wohnungen (`anforderungen.md:144`). Daraus folgt: gleichmässig pro Wohnung = «Pro Einheit».
- Szenario statement-detail: Lindenhof hat 1 Wohnung (3.01). Hauswart 400 × 1/1 = 400.00. Marc Huber ab 01.05.2024 (Mieterwechsel in der Periode, 245 von 366 Tagen, keine Heizkosten, also nach Tagen): 400 × 245/366 = 267.76. Unter beiden Namen gleich.
- 6 Wohnungen: 400 × 1/6 = 66.67 je Wohnung, gleich.
- Gutschrift −120 bei 6 Wohnungen: −20.00 je Wohnung, gleich. Betrag 0: 0.00.
- Rückfrage (1), Anzahl: 0 → keine Rückfrage, 1 → Einzahl (V-1), ≥ 2 → Mehrzahl.

## Fehlende Begriffe

- Vorschlag (optional, Glossar-Issue mit `fachlich`, `entscheiden`): «Heizkosten (Kategorie)» ergänzen um «Bei vordefinierten Kategorien von Dwello fest eingestellt (#452).» Kein neuer Begriff nötig.

## Nicht bestätigt

- «Ein Verteilschlüssel pro Kostenart und Liegenschaft» (Hilfetext Punkt 7): keine Fedlex-Norm, nur Praxis und Mieterverband-Checkliste (`anforderungen.md:102`, dort «unsicher-B»). **unsicher**. Der Text ist trotzdem entschieden und rät nur, er verbietet nichts.
- Ob «Kehrichtgrundgebühr» in den Demodaten (`backend/demo/demo-data.sql:112, 122, 131, 141`, umlagefähig) eine Gebühr pro Haushalt ist (dann richtig) oder vom Wert abhängt: Die Demodaten sagen es nicht, und das gehört nicht zum Gegenstand. Mit dem neuen Eval-Fall könnte das KI-Ergebnis für diese Bezeichnung kippen; beim `llm:eval` vorher/nachher darauf achten.
- Ob ein Pflichtschlüssel bei nicht umlagefähigen Rechnungen fachlich nötig ist: Er wird nie verteilt, ist aber entschieden («without a key form and backend refuse»), und dank Vorschlag ist das Feld fast immer gefüllt. Kein Befund.
- Ob es neben dem Formular, dem Upload-Dialog und `PUT /invoices` weitere Wege gibt, die Rechnungen ohne Schlüssel anlegen (KI-Stapel, Import): Gesehen habe ich nur `backend/src/routes/invoices.ts:57` und `src/lib/invoice-upload.ts`, sonst nichts geprüft.
- fr/it-Wortlaut bleibt unter dem Vorbehalt von #342 (imputable ❓, `i18n-begriffe.md:53`).
