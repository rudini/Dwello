# Fachreview Runde 2: #166 (Vordefinierte Kategorien) und #219 (KI aus), Commit 2cc0749

Gegenstand: `git diff c9a800f 2cc0749` im Worktree `review-w5b-fach2`: Umsetzung (Backend-Sperren, Badges, Hinweis in der Liste, Hinweisbox auf der Bearbeitungsseite, KI-Knopf nur bei eingeschalteter KI), die neuen Texte in `messages/{de,fr,it,en}.json` (`categories_kind_*`, `categories_predefined_*`, `backend_category_predefined`) sowie die Szenarien `categories.feature:110–124`. Offene Befunde aus Runde 1: V-1, M-1, V-3, V-4, V-6, V-7. V-5 gilt durch `category-predefined.pg.test.ts` als beantwortet, V-2 liegt in #302.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | behoben | Die Hinweisbox nennt jetzt die echte Folge: Rechnungen fallen aus der Abrechnung, und Zurückstellen holt sie nicht zurück |
| M-1 | Mietrecht | behoben | Die Hinweisbox sagt, dass die Umlagefähigkeit nach Gesetz voreingestellt ist und dass Kosten des Vermieters durch eine andere Wahl nicht umlagefähig werden |
| V-3 | Verwalter | behoben | Der KI-Satz nennt nur den deutschen Namen und die Beschreibung, betrifft nur neue Rechnungen und erscheint nur bei eingeschalteter KI |
| V-4 | Verwalter | behoben | Der Löschgrund «weil Dwello sie mitliefert» stimmt, unterscheidet die Arten und hängt nicht an der KI |
| V-6 | Verwalter | behoben | Beide Löschhinweise stehen in einem Absatz |
| V-7 | Verwalter | behoben | Im Schritt steht jetzt «die eigene Kategorie "Treppenhausreinigung"» |
| V-5 | Verwalter | behoben (geprüft) | Das Backend lehnt das Löschen mit `CATEGORY_PREDEFINED` ab und behält den Schlüssel bei PUT |
| V-8 | Verwalter | Minor | Der Satz zur Umlagefähigkeit passt nicht zu vordefinierten Kategorien, die schon nicht umlagefähig sind (z. B. «Liegenschaftssteuer», die Kategorie im Szenario selbst) |
| V-9 | Verwalter | Minor | «bleiben diese Rechnungen nicht umlagefähig» sagt nicht, was der Vermieter tun kann. Dass schon erstellte Abrechnungen unverändert bleiben, steht auch nirgends |
| M-2 | Mietrecht | Nit | «nach dem Gesetz gewählt» geht bei «Schädlingsbekämpfung» und «Feuerlöscher-Wartung» über den Gesetzestext hinaus, dort entscheidet die Praxis |
| V-10 | Verwalter | Nit | en: Wortstellung «its invoices already recorded»; fr: «simplement» fehlt vor «parce que» (it und de haben «solo»/«nur») |

## Geprüfte Befunde aus Runde 1

### V-1 (behoben)

- Beleg: `messages/de.json:1200` «Stellen Sie die Kategorie auf nicht umlagefähig, fliessen auch ihre schon erfassten Rechnungen nicht mehr in die Nebenkostenabrechnung. Stellen Sie sie zurück, bleiben diese Rechnungen nicht umlagefähig.» Das deckt sich mit dem Code. `backend/src/services/category.service.ts:189–192` setzt bei `isAllowedUtilityCost === false` alle Rechnungen der Kategorie auf `isValidUtilityCost = false`, ein Gegenstück fürs Zurückstellen gibt es nicht. `invoice.service.ts:526–537` (`getInvoicesForStatement`) nimmt nur Rechnungen mit `isValidUtilityCost = true`. «auch» trifft ebenfalls zu: Neue Rechnungen einer nicht umlagefähigen Kategorie werden in `applyCategory` (`invoice.service.ts:226–231`) auf nicht umlagefähig gesetzt.
- Szenario `categories.feature:123` und Schritt `categories.steps.ts` prüfen den neuen Satz wörtlich.
- Zwei Lücken bleiben, siehe V-8 und V-9.

### M-1 (behoben)

- Beleg: `messages/de.json:1199` «Dwello hat die Umlagefähigkeit nach dem Gesetz gewählt: Kosten, die das Gesetz dem Vermieter zuweist, werden nicht umlagefähig, nur weil Sie die Wahl ändern.»
- Fedlex, OR Fassung 2026-10-01 (`eli/cc/27/317_321_377/20261001/de`):
  - Art. 256b OR: «Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.»
  - Art. 257a Abs. 1 OR: «Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.»
  - Art. 257a Abs. 2 OR: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»
  - Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.»
- Die Aussage trifft rechtlich zu: Was Art. 256b OR dem Vermieter zuweist, wird nicht dadurch zu Nebenkosten, dass Dwello es umlegt. Zur Wortwahl «nach dem Gesetz» siehe M-2.

### V-3 (behoben)

- Beleg: `messages/de.json:1201`. Erscheint nur bei `data.kiEnabled` (`src/routes/config/categories/[id]/edit/+page.svelte:31`). Der Prompt (`backend/src/config/llm.ts:85–92`) enthält `name` (der Schlüssel, bei vordefinierten jetzt fest: `category.service.ts:177–179`), `nameDE` und `description`, nicht `nameFR/IT/EN`. Der Satz passt damit genau zu dem, was die KI liest. Die Datenschutzerklärung nennt ebenfalls «Name und Beschreibung» (`privacy-page.dom.test.ts:47, 83`).
- Der Name heisst im deutschen Formular nur «Name» (`categories_name_german`), die anderen Sprachen stehen unter «Übersetzungen». «den deutschen Namen» ist darum eindeutig.

### V-4 (behoben)

- Beleg: `messages/de.json:1197` «Kategorien «Von Dwello» lassen sich nicht löschen, weil Dwello sie mitliefert.» Der Grund gilt nur für vordefinierte Kategorien und auch bei ausgeschalteter KI. Er ist etwas zirkulär, aber nicht falsch. Ein Verwalter versteht ihn als «gehört zum Lieferumfang». Kein neuer Befund.
- Die Backend-Meldung `backend_category_predefined` «Kategorien «Von Dwello» lassen sich nicht löschen.» trägt denselben Begriff.

### V-5 (geprüft)

- `category.service.ts:202–205` lehnt das Löschen einer vordefinierten Kategorie mit `CATEGORY_PREDEFINED` ab, bevor die Prüfung «in Gebrauch» kommt. `:177–179` verwirft `name` im PUT bei vordefinierten Kategorien. `backend/src/__tests__/category-predefined.pg.test.ts` prüft beides (409 mit Code; Schlüssel bleibt, `nameDE` und `isAllowedUtilityCost` ändern sich). `docs/api-specification.md` führt den Code.

### V-6, V-7 (behoben)

- `src/routes/config/categories/+page.svelte:68–71`: ein Absatz, der zweite Satz mit eigener id `category-predefined-note`, auf die der Knopf mit `describedby` verweist (`CategoryRow.svelte:56`).
- `categories.feature:113` «Und ist die eigene Kategorie "Treppenhausreinigung" als "Eigene" gekennzeichnet».

## Neue Befunde

### V-8 (Minor): Der Satz zur Umlagefähigkeit passt nicht zu nicht umlagefähigen Kategorien

- Beleg: `[id]/edit/+page.svelte:30` zeigt `categories_predefined_allocable` bei jeder vordefinierten Kategorie. Neun von 21 vordefinierten Kategorien sind schon nicht umlagefähig (Glossar «Nicht umlagefähig»). Das Szenario `categories.feature:121–124` öffnet ausgerechnet «Liegenschaftssteuer» (`0002_stammdaten.sql:32`, `false`). Dort liest der Vermieter «Stellen Sie die Kategorie auf nicht umlagefähig …», obwohl sie es schon ist.
- Warum falsch: Für diese Kategorien geht es um den umgekehrten Weg, und der ist verschwiegen. Stellt der Vermieter «Liegenschaftssteuer» auf umlagefähig, bleiben die schon erfassten Rechnungen nicht umlagefähig (sie wurden bei der Erfassung durch `applyCategory`, `invoice.service.ts:231`, gesperrt). Nur neue Rechnungen fliessen ein. Der erste Absatz (M-1) warnt rechtlich, der zweite beschreibt eine Lage, die es auf dieser Seite nicht gibt.
- Behebung: den Satz nach der gespeicherten Umlagefähigkeit wählen. Bei umlagefähigen Kategorien bleibt der heutige Satz. Bei nicht umlagefähigen ein Textvorschlag: «Stellen Sie die Kategorie auf umlagefähig, gilt das nur für neue Rechnungen; ihre schon erfassten Rechnungen bleiben nicht umlagefähig.» Das Szenario prüft dann einen der beiden Sätze, passend zu «Liegenschaftssteuer», oder es nimmt eine umlagefähige Kategorie (z. B. «Kehricht»).

### V-9 (Minor): Was der Vermieter nach dem Zurückstellen tun kann, und was mit erstellten Abrechnungen geschieht

- Beleg: «Stellen Sie sie zurück, bleiben diese Rechnungen nicht umlagefähig.» (`de.json:1200`). Die Rechnung hat ein eigenes Feld «Umlagefähig» (`src/routes/invoices/InvoiceCategoryFields.svelte:99`, `glossary_allocable_term`). Ist die Kategorie wieder umlagefähig, lässt es sich setzen (`applyCategory` sperrt nur bei nicht umlagefähiger Kategorie). Abrechnungen speichern ihre Abrechnungspositionen beim Erstellen (`statement.service.ts:380`) und lesen sie danach aus der Tabelle (`:169, :271`). Schon erstellte Abrechnungen, auch Entwürfe, ändern sich durch die Umstellung also nicht.
- Warum falsch: Nach den Design-Regeln sagt ein Hinweis, was zu tun ist. So klingt der Satz endgültig, und der Vermieter erfährt nicht, dass er die Rechnungen einzeln zurückholen kann. «nicht mehr in die Nebenkostenabrechnung» kann man ausserdem so lesen, dass auch ein schon erstellter Entwurf die Kosten verliert. Tatsächlich muss er den Entwurf neu erstellen.
- Behebung (Textvorschlag für den zweiten Satz): «Stellen Sie sie zurück, bleiben diese Rechnungen nicht umlagefähig, bis Sie sie bei der Rechnung wieder auf «Umlagefähig» stellen.» Optional zum ersten Satz: «… nicht mehr in neue Nebenkostenabrechnungen; schon erstellte bleiben, wie sie sind.» Die fr/it/en-Fassungen gleich anpassen.

### M-2 (Nit): «nach dem Gesetz» bei zwei Kategorien zu stark

- Beleg: `de.json:1199`. Die Begründungen `categories_reason_pest_control` und `categories_reason_fire_extinguisher` stützen sich auf kein Gesetz («auch nötig, wenn es leer steht»). Art. 257b Abs. 1 OR nennt nur das Kriterium «mit dem Gebrauch zusammenhängen». Die Zuordnung dieser beiden Kategorien ist Praxis, keine Gesetzesregel.
- Behebung: «nach dem Mietrecht gewählt» oder «nach Gesetz und Praxis gewählt». Der zweite Teilsatz («Kosten, die das Gesetz dem Vermieter zuweist …») bleibt richtig.

### V-10 (Nit): Übersetzungen

- en `categories_predefined_allocable`: «its invoices already recorded no longer go into the utility cost statement either» → «its already recorded invoices no longer go into the utility cost statement either».
- fr `categories_predefined_hint`: «ne deviennent pas imputables parce que vous modifiez le choix» → «ne deviennent pas imputables simplement parce que vous modifiez le choix». So entspricht es de «nur weil» und it «solo perché». Ohne «simplement» klingt der Satz, als schliesse die Änderung die Umlagefähigkeit aus.
- Sonst bestätigt gegen `docs/design/i18n-begriffe.md`: imputable/addebitabile/allocable (Z. 44; das Nomen wie in `invoices_allocability`), décompte des charges/conteggio spese accessorie/utility cost statement (Z. 54), IA/IA/AI (Z. 47). «Personnalisée/Personalizzata/Custom» folgt dem Muster bei Verteilschlüssel und Heizprofil (Z. 50; `keys_custom`, `profiles_custom`). Die französischen Guillemets haben ein geschütztes Leerzeichen, vor «;» und «:» ebenso. Die Anrede ist vous bzw. Lei, und «ß» kommt nicht vor.

## #219 (KI aus)

- `src/lib/server/category.ts:33–38` liest `enabled` von `GET /api/v1/invoices/llm-recipient` (öffentlich, `backend/src/app.ts:69`, mit `llmConfig.enabled`). Ist der Wert unbekannt, gilt die KI als eingeschaltet. Die Seite «Neue Kategorie» zeigt den Knopf «Von der KI prüfen lassen» nur bei `ki` (`CategoryForm.svelte:125`), die Bearbeitungsseite den KI-Satz nur bei `kiEnabled`. Fachlich richtig: Ohne KI bleibt die Pflichtwahl ohne Vorgabe (Glossar «Umlagefähigkeit»), und kein Text setzt dann die KI voraus. Ist der Wert unbekannt, erscheint der Knopf, und eine Ablehnung (`backend_ki_proposal_unavailable`) erklärt, warum nichts kommt. Das ist vertretbar.

## Fehlende Begriffe

Keine. «Von Dwello» / «Eigene» sind Glossarbegriffe (`UBIQUITOUS_LANGUAGE.md:84–85`). Kein neues Issue nötig. V-8 und V-9 sind Textkorrekturen innerhalb von #166.

## Nicht bestätigt

- **unsicher:** ob «Schädlingsbekämpfung» und «Feuerlöscher-Wartung» in der Praxis einheitlich nicht umlagefähig sind. Manche Mietverträge führen die Wartung der Feuerlöscher als Nebenkosten. Keine Fedlex-Norm nennt sie, ich habe nur Art. 257a/257b OR gelesen. Das betrifft die Stammdaten, nicht diese Änderung. Gilt als Hintergrund zu M-2.
- Ob das Statement-PDF eines Entwurfs ausschliesslich aus den gespeicherten Abrechnungspositionen entsteht: `statement-pdf.service.ts:126` nimmt `statement.lineItems`. Die Kette bis zum Erstellen eines Entwurfs habe ich nur über `statement.service.ts:380` verfolgt, nicht über den ganzen Abrechnungslauf.
- Den Inhalt der Unit- und DOM-Tests (`categories.test.ts`, `category-predefined.dom.test.ts`) habe ich nicht im Einzelnen gelesen und keine Tests ausgeführt. Der Fachreview prüft Regeln und Texte, nicht die Testabdeckung.
- Dass der Schritt zum KI-Satz im E2E-Lauf grün ist, setzt die eingeschaltete KI (den Stand-in) im E2E-Stack voraus. Nicht geprüft.
