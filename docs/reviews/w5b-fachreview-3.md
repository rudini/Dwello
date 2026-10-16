# Fachreview Runde 3 (letzte Runde): #166 (Vordefinierte Kategorien), Commit ef3cc3d

Gegenstand: `git diff fe97b72 ef3cc3d` im Worktree `review-w5b-fach3`. Geprüft wurden die Hinweistexte `categories_predefined_hint`, `categories_predefined_allocable`, `categories_predefined_not_allocable` und `categories_predefined_ki` in `messages/{de,fr,it,en}.json:1201–1204`, die Auswahl des Satzes nach der gespeicherten Umlagefähigkeit (`src/routes/config/categories/[id]/edit/+page.svelte:30–34`) und der geänderte Schritt `tests/e2e/features/categories.feature:123`. Dazu die Antwort auf P-1 (Helga, Dr. Weber) und auf M-2 / Weber P-6. Offen aus Runde 2 waren V-8, V-9, M-2 und V-10.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-8 | Verwalter | behoben | Der Satz richtet sich nach der gespeicherten Umlagefähigkeit. Bei «Liegenschaftssteuer» steht jetzt der passende Satz |
| V-9 | Verwalter | behoben | Der Hinweis sagt jetzt, was zu tun ist (Rechnungen einzeln zurückstellen) und dass schon erstellte Abrechnungen bleiben, wie sie sind |
| M-2 | Mietrecht | behoben | «nach dem Mietrecht voreingestellt» statt «nach dem Gesetz gewählt» |
| V-10 | Verwalter | behoben | en: Wortstellung korrigiert. fr: Der Satz ohne «simplement» ist ganz weggefallen |
| P-1 (Personas) | Mietrecht | behoben | Der Satz für nicht umlagefähige Kategorien ist eindeutig, rechtlich richtig und stimmt mit dem Code überein |
| V-11 | Verwalter | Nit | «Die Wahl gilt nur für neue Rechnungen» ist zu eng: Sie gilt auch für eine schon erfasste Rechnung, die der Vermieter danach dieser Kategorie zuordnet |
| V-12 | Verwalter | Nit | «diese Rechnungen einzeln wieder auf «Umlagefähig» stellen»: Dwello merkt sich nicht, welche Rechnungen die Umstellung betroffen hat (gehört zu #309, Option 2) |
| M-3 | Mietrecht | Nit | Der umgekehrte Weg (nicht umlagefähig → umlagefähig, z. B. «Liegenschaftssteuer») speichert ohne Rückfrage. #309 deckt nur den Weg zu nicht umlagefähig ab |

Kein Blocker, kein Major.

## Geprüfte Befunde aus Runde 2

### V-8 (behoben)

- Beleg: `+page.svelte:30–34` wählt `categories_predefined_allocable`, wenn `data.category.isAllowedUtilityCost` gilt, sonst `categories_predefined_not_allocable`. Massgebend ist der gespeicherte Wert, nicht die Auswahl im Formular. Das ist richtig, denn der Satz beschreibt, was eine Änderung am gespeicherten Zustand bewirkt.
- Das Szenario `categories.feature:121–124` öffnet «Liegenschaftssteuer» (nicht umlagefähig) und prüft jetzt den Satz für nicht umlagefähige Kategorien (`categories.steps.ts`, Schritt zu Z. 123). Den Satz für umlagefähige Kategorien prüft `category-predefined.dom.test.ts`. Dort steht auch, dass jeweils der andere Satz fehlt.

### V-9 (behoben)

- de:1202: «… fliessen ihre schon erfassten Rechnungen nicht mehr in neue Nebenkostenabrechnungen; schon erstellte bleiben, wie sie sind. Stellen Sie sie später zurück, müssen Sie diese Rechnungen einzeln wieder auf «Umlagefähig» stellen.»
- Gegen den Code geprüft:
  - `category.service.ts:188–191` (`updateCategory`): Bei `isAllowedUtilityCost === false` werden alle Rechnungen der Kategorie mit `isValidUtilityCost = true` auf `false` gesetzt. Für das Zurückstellen gibt es kein Gegenstück. Damit ist «einzeln wieder … stellen» richtig.
  - `invoice.service.ts:526–537` (`getInvoicesForStatement`) nimmt nur Rechnungen mit `isValidUtilityCost = true`. `calculation.service.ts:299` liest sie bei jeder Berechnung. Neue Abrechnungen lassen die Rechnungen also weg.
  - `statement.service.ts:315–369` (`generateStatement` → `createStatement`) speichert die Abrechnungspositionen beim Erstellen als Momentaufnahme. `updateStatement` (`:403–436`) rechnet nichts neu. Damit stimmt «schon erstellte bleiben, wie sie sind», auch für Entwürfe.
  - Das Feld an der Rechnung heisst «Umlagefähig» (`InvoiceCategoryFields.svelte:97–104`, `glossary_allocable_term`). In fr/it/en heisst es «Imputable», «Addebitabile» und «Allocable», genau wie in den Übersetzungen des Hinweises. Gesperrt ist das Feld nur bei einer nicht umlagefähigen Kategorie (`nonAllocable`). Nach dem Zurückstellen lässt es sich also wieder setzen.
- «Zurück wohin?» (Helga P-2, Weber P-4): Der Satz erscheint nur noch bei umlagefähigen Kategorien. «zurück» heisst dort eindeutig: wieder umlagefähig.

### M-2 / Weber P-6 (behoben)

- de:1201 «… hat ihre Umlagefähigkeit nach dem Mietrecht voreingestellt». «Mietrecht» umfasst Gesetz und Praxis und behauptet nicht mehr, das Gesetz ordne jede Kategorie zu. «voreingestellt» macht klar, dass es um eine Vorgabe geht, die der Vermieter ändern kann. Das passt zum Glossar «Vordefinierte Kategorie» und «Grund der Umlagefähigkeit» (`UBIQUITOUS_LANGUAGE.md:84, 87`). fr «préréglé … selon le droit du bail», it «preimpostato … secondo il diritto di locazione» und en «preset … according to tenancy law» sagen dasselbe.

### V-10 (behoben)

- en:1202 «its already recorded invoices». Der fr-Satz mit «parce que» ist weggefallen, damit erledigt sich auch Weber P-9.

### P-1 Helga / Dr. Weber (behoben)

- de:1203: «Wählen Sie «Umlagefähig», schuldet der Mieter Kosten, die das Gesetz dem Vermieter zuweist, trotzdem nicht. Die Wahl gilt nur für neue Rechnungen; schon erfasste bleiben nicht umlagefähig.»
- Rechtlich (Fedlex, OR Fassung 2026-10-01, `eli/cc/27/317_321_377/20261001/de`, heute aus dem Filestore gelesen):
  - Art. 256b OR: «Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.»
  - Art. 256 Abs. 1 OR: «Der Vermieter ist verpflichtet, die Sache zum vereinbarten Zeitpunkt in einem zum vorausgesetzten Gebrauch tauglichen Zustand zu übergeben und in demselben zu erhalten.» Abs. 2: «Abweichende Vereinbarungen zum Nachteil des Mieters sind nichtig, wenn sie enthalten sind in: […] b. Mietverträgen über Wohn- oder Geschäftsräume.»
  - Art. 257a Abs. 1 OR: «Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.»
  - Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.»
  - Was das Gesetz dem Vermieter zuweist (Lasten, Abgaben, die nicht aus dem Gebrauch entstehen, Unterhalt), fällt nicht unter die Nebenkosten-Definition. Der Mieter schuldet es nicht, auch wenn Dwello es umlegt. Der Satz trifft zu. Er unterscheidet jetzt zwischen der rechtlichen Folge (der Mieter schuldet es nicht) und der technischen (neue Rechnungen fliessen ein). Das war Webers Frage.
- Technisch: Neue Rechnungen einer umlagefähigen Kategorie sind umlagefähig, weil das Formular das Feld nach der Kategorie setzt (`InvoiceCategoryFields.svelte:49–51`, `invoices/new/+page.svelte:55, 65`) und die Datenbank `true` vorgibt (`schema.ts:250`). Bei Rechnungen, die die KI sicher einordnet, kommt der Wert aus der Kategorie (`invoice.service.ts:215–218`, `llm.service.ts:162, 194`). Schon erfasste Rechnungen bleiben `false`, denn `updateCategory` setzt beim Wechsel auf umlagefähig nichts zurück und `applyCategory` (`invoice.service.ts:227–232`) setzt nur auf `false`. Damit stimmt «schon erfasste bleiben nicht umlagefähig». Zur Einschränkung siehe V-11.
- Die Wortlaute stimmen überein: Die Auswahl im Kategorieformular heisst «Umlagefähig» (`CategoryForm.svelte:52`, `glossary_allocable_term`), genau wie im Hinweis.
- Der Relativsatz «Kosten, die das Gesetz dem Vermieter zuweist» schränkt die Aussage ein. Bei «Schädlingsbekämpfung» und «Feuerlöscher-Wartung» (Praxis, siehe Runde 2, M-2) behauptet er also nicht, das Gesetz weise genau diese Kosten zu. Bei «Verwaltung» bleibt er richtig, und die Pauschale nach Art. 4 Abs. 3 VMWG nennt ohnehin der Grund `categories_reason_administration` (de:1223).

### Übersetzungen (fr/it/en) geprüft

- Inhaltlich decken sich alle drei mit de:1201–1203. Bezüge stimmen: fr «ceux déjà établis» meint die décomptes, it «quelli già allestiti» die conteggi, en sagt «statements already created».
- Begriffe nach `docs/design/i18n-begriffe.md`: imputable / addebitabile / allocable, décompte des charges / conteggio spese accessorie / utility cost statement, droit du bail / diritto di locazione / tenancy law. Die Anrede ist vous bzw. Lei.
- fr: geschütztes Leerzeichen (U+00A0) in « Imputable » und vor «;» (maschinell gezählt).
- `categories_predefined_ki`: de sagt jetzt «den Namen» (Weber P-8), fr/it/en sagen weiter «nom allemand», «nome tedesco» und «German name». Das ist richtig so. Das Feld heisst auf Deutsch nur «Name», in den anderen Sprachen «Nom (allemand)», «Nome (tedesco)» und «Name (German)» (`categories_name_german`, `:1195`). Die KI liest `nameDE` und die Beschreibung (Runde 2, V-3).
- en mit «Guillemets» (Weber P-10): Das ist schon die Konvention in allen en-Texten der App. Nicht Gegenstand dieser Änderung.

## Neue Befunde

### V-11 (Nit): «gilt nur für neue Rechnungen» ist zu eng

- Beleg: de:1203 «Die Wahl gilt nur für neue Rechnungen». `InvoiceCategoryFields.svelte:49–51` (`chooseCategory`): Ordnet der Vermieter eine schon erfasste Rechnung (z. B. bisher ohne Kategorie) dieser Kategorie zu, setzt das Formular «Umlagefähig» ebenfalls nach der Kategorie.
- Warum ungenau: Die Wahl gilt für jede Rechnung, die ab jetzt dieser Kategorie zugeordnet wird, nicht nur für neu erfasste. Der Kern stimmt trotzdem, denn die schon zugeordneten Rechnungen bleiben nicht umlagefähig. Das gilt in fr/it/en genauso.
- Behebung (optional): «Die Wahl gilt nur für Rechnungen, die Sie ab jetzt dieser Kategorie zuordnen; schon zugeordnete bleiben nicht umlagefähig.»

### V-12 (Nit): Welche Rechnungen der Vermieter zurückstellen muss

- Beleg: de:1202 «… müssen Sie diese Rechnungen einzeln wieder auf «Umlagefähig» stellen». `category.service.ts:190` setzt nur die bisher umlagefähigen Rechnungen auf `false`, ohne sich zu merken, welche das waren. In der Rechnungsliste lassen sich Kategorie und «Nicht umlagefähig» filtern (`src/routes/invoices/+page.server.ts:16–17`). Dort stehen aber auch Rechnungen, die der Vermieter schon vorher bewusst ausgeschlossen hat (z. B. wegen gemischter Belege).
- Warum ein Hinweis: Der Satz stimmt, aber der Vermieter kann «diese Rechnungen» nicht sicher von früher ausgeschlossenen unterscheiden. Das Verhalten gab es schon vor dieser Änderung. #309, Option 2 («needs remembering which ones»), nennt genau diesen Punkt.
- Behebung: keine Textänderung in #166. Bei der Entscheidung zu #309 mitbedenken. Kein neues Issue.

### M-3 (Nit): Keine Rückfrage beim Wechsel auf umlagefähig

- Beleg: `CategoryForm.svelte` speichert «Umlagefähig» bei «Liegenschaftssteuer» ohne Rückfrage. Der Grund der Umlagefähigkeit («Steuern auf die Liegenschaft trägt der Vermieter (Art. 256b OR)») entfällt dabei, wie das Glossar es vorsieht (`UBIQUITOUS_LANGUAGE.md:87`). #309 betrifft nach Titel und Text nur den Wechsel zu «nicht umlagefähig».
- Warum ein Hinweis: Der neue Satz klärt die Rechtslage richtig, er steht aber nur im Hinweiskasten. Folgt der Vermieter ihm nicht, fliessen Kosten nach Art. 256b OR in neue Abrechnungen, und der Mieter kann sie zurückfordern. Der Schritt lässt sich rückgängig machen und ist von #166 so gewollt (der Vermieter darf die Vorgabe ändern). Darum nur Nit.
- Behebung: In #309 als weitere Option ergänzen, dass auch der Wechsel einer vordefinierten Kategorie von «Nicht umlagefähig» zu «Umlagefähig» eine Rückfrage auslöst. Dafür der Satz aus de:1203. Die Entscheidung liegt beim Product Owner.

## Fehlende Begriffe

Keine. «Umlagefähig», «Umlagefähigkeit», «Von Dwello» und «Nebenkostenabrechnung» stehen im Glossar. «voreingestellt» und «Mietrecht» sind gewöhnliche Wörter, kein neuer Fachbegriff.

## Nicht bestätigt

- **unsicher:** ob «Schädlingsbekämpfung» und «Feuerlöscher-Wartung» in der Praxis einheitlich nicht umlagefähig sind (wie in Runde 2). Keine Fedlex-Norm nennt sie. Gelesen habe ich Art. 256, 256b, 257a und 257b OR. Das betrifft die Stammdaten. Den neuen Satz betrifft es dank des einschränkenden Relativsatzes nicht.
- **unsicher:** dass der Mieter Kosten nach Art. 256b OR auch dann nicht schuldet, wenn der Mietvertrag sie ausdrücklich als Nebenkosten nennt. Art. 256 Abs. 2 OR (zwingend für Wohnräume) ist auf Fedlex belegt, aber nur für den Unterhalt. Dass Art. 257a/257b OR die Nebenkosten bei Wohnräumen abschliessend festlegen, folgt aus der Lehre, nicht aus dem Wortlaut. Nach dem Wortlaut von Art. 257b Abs. 1 trägt der Satz trotzdem.
- Tests und E2E habe ich nicht ausgeführt. Gelesen habe ich nur die Testdiffs (`category-predefined.dom.test.ts`, `categories.steps.ts`).
- PDF-Erzeugung eines Entwurfs: Dass sie nur die gespeicherten Abrechnungspositionen liest, habe ich nicht erneut verfolgt (siehe Runde 2, `statement-pdf.service.ts:126`).
