# Fachreview #452, Runde 2 (nach der Umsetzung)

Gegenstand: `git diff 281cdd16 2caa6692` im Worktree `review-452-fach2` (Commit 2caa6692): Szenarien, `messages/{de,fr,it,en}.json`, `docs/nebenkostenabrechnung-anforderungen.md` und der Code dazu. Vorbericht: `452-fachreview-1.md` (V-1 bis V-17, M-1). Gesetzestext wie in Runde 1 (Art. 257a Abs. 2 OR: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»). Bestätigte Regeln aus Runde 1 liste ich nicht noch einmal auf.

## Status der IDs aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| V-1 | erledigt | `categories_not_allocable_confirm_one` / `_many` in vier Sprachen (de.json:1450–1451); die Einzahl lautet durchgehend Einzahl, ohne «einzeln»; Szenario categories.feature:171; DOM-Test «nennt eine einzelne Rechnung in der Einzahl» |
| V-2 | erledigt | zwei Schlüssel `backend_statement_uncategorized_invoices` (berichtigte Abrechnung) und `backend_statement_recalculation_uncategorized_invoices` (Neu berechnen), Schluss wie vorgeschlagen; `statement.service.ts:462, 719` |
| V-3 | erledigt | `getUncategorizedInvoices` filtert das Ergebnis von `getInvoicesForStatement` (invoice.service.ts:604–608), also dieselbe Periodenregel und nur `isValidUtilityCost = true` |
| V-4 | erledigt (Formular) | `latestKeys` mit `isNotNull(distributionKeyId)` (invoice.service.ts:244–254). Rest beim Tankbestand: V-22 |
| V-5 | teilweise | Hinweis am Feld da (`[id]/edit/+page.svelte:54–57`), Wortlaut stimmt aber nicht in jedem Fall: V-21 |
| V-6 | erledigt | `keyNamesOf` setzt «Per Unit» für jede Position ohne Schlüssel (statement-pdf.service.ts:234–243), also auch für «Veränderung Tankbestand»; Test nur für eine Rechnung, siehe V-22 |
| V-7 | erledigt | `statements_key_per_unit` «Pro Einheit / Par unité / Per unità / Per Unit» in `src/lib/server/statement.ts:159`, gleich wie die Namen in `0002_stammdaten.sql:47` |
| V-8 | erledigt | `HeatingChoice.svelte`: `fixed ? categories_heating_fixed : categories_heating_help` |
| V-9 | erledigt | `categories_predefined_not_allocable` zweiter Satz wie (4); it-Nit V-23 |
| V-10 | erledigt | (a) «fragt nicht ohne umlagefähige Rechnungen»; (b) `_many` in DOM-Test «fragt mit der Zahl …»; (c) statement-recalculation.pg.test.ts (nicht umlagefähige Rechnung ohne Kategorie wird nicht genannt); (d) «Verteilschlüssel beim Hochladen» (2 Tests); (e) «lässt «Heizkosten» bei einer eigenen Kategorie ändern»; Szenarien sagen «umlagefähige Rechnung» |
| V-11 | erledigt | Regel 3 und 12 in `docs/nebenkostenabrechnung-anforderungen.md:144, 153` nachgeführt |
| V-12 | erledigt | fr «a préréglé cette case» |
| V-13 | erledigt | en «only utility costs agreed in the rental contract» (Wortstellung «bills only utility costs agreed …») |
| V-14 | erledigt | categories.feature:158 |
| V-15 | erledigt | invoice-edit.feature:62–63 «Hauswart Meier … Umgebungsarbeiten» |
| V-16 | erledigt | en «Dwello has preset», fr «met à la charge du bailleur» |
| V-17 | erledigt | `statements_uncategorized_error` «Einige umlagefähige Rechnungen haben keine Kategorie. Ordnen Sie …» in vier Sprachen |
| M-1 | erledigt | statement-detail.feature:795 «Pro Einheit 1 / 1 Wohnungen 400.00 400.00»; pg-Test ebenso |

## Neue Befunde

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-19 | Verwalter | Major | `config_help_distribution_key` (Seite «Verteilschlüssel» und Einstellungen) sagt weiterhin «kann einen Verteilschlüssel haben; ohne ihn wird sie gleichmässig pro Wohnung verteilt». Seit #452 falsch: jede Rechnung braucht einen. Vorschlag unten (Punkt 3). **Eindeutig.** |
| V-18 | Verwalter | Minor | fr: Die neuen Texte nennen die Knöpfe «Répercutable» / «Non répercutable» (`backend_statement_*uncategorized*`, `statements_uncategorized_*`, `categories_predefined_not_allocable`, Rückfragen). Im Rechnungsformular heisst der Knopf in 2caa6692 noch «Non imputable» (fr.json:832), und `categories_predefined_allocable` (fr.json:1419) im selben Panel noch «Imputable». Fix: erst nach #461 mergen oder #461 vorher rebasen; dann stimmen die Zitate. Texte selbst nicht ändern. **Eindeutig** (Reihenfolge, nicht Wortlaut) |
| V-20 | Verwalter | Minor | `settings_key_suggested` («wird beim Erfassen neuer Rechnungen vorgeschlagen», de.json:1387, `DefaultsSection.svelte:93`) gilt jetzt nur noch, wenn die Kategorie im Gebäude keine Rechnung mit Verteilschlüssel hat (`proposedKey`, `src/lib/invoice.ts`). Vorschlag unten (Punkt 3). **Eindeutig** in der Sache, Wortlaut ein Vorschlag |
| V-21 | Verwalter | Minor | `invoices_key_missing_note` (de.json:868): (a) «wurde gleichmässig pro Wohnung verteilt» stimmt nur, wenn die Rechnung schon in einer Abrechnung war; der Hinweis erscheint bei jeder Rechnung ohne Schlüssel (`edit/+page.svelte:54`). (b) «der letzten Rechnung dieser Kategorie» stimmt nicht, wenn Dwello auf den Standard-Verteilschlüssel zurückfällt (keine frühere Rechnung, keine Kategorie). (c) Die Folge, um die es in V-5 ging, fehlt: nach dem Speichern verteilen neu berechnete und berichtigte Abrechnungen anders. Vorschlag unten (Punkt 2). **Eindeutig** bei (a) bis (c), Wortlaut ein Vorschlag (neuer Text, `entscheiden`) |
| V-22 | Verwalter | Nit | `fuel-stock.service.ts:46–66` (`keyFor`) überspringt Rechnungen ohne Schlüssel nicht (Gegenstück zu V-4: Fällt die letzte Rechnung ohne Schlüssel weg, nimmt Dwello den Standard-Verteilschlüssel, obwohl eine ältere Rechnung einen hat). Betrifft nur alte Daten. Dazu fehlt ein Test für «Pro Einheit» bei der Position «Veränderung Tankbestand». Fix: `isNotNull(invoices.distributionKeyId)` in `latest`, plus ein pg-Test |
| V-23 | Verwalter | Nit | it «che assegna a questa categoria da adesso» (`categories_predefined_not_allocable`, `categories_allocable_confirm_text`) → idiomatischer «che d’ora in poi assegna a questa categoria» |
| V-24 | Verwalter | Nit | `invoices_no_key` («Keiner – die Kosten werden gleichmässig pro Wohnung verteilt», Rechnungsdetail, `CategorizationPanel.svelte:56`) stimmt, nennt aber nicht «Pro Einheit» wie Abrechnung und PDF. Möglich: «Keiner – die Kosten werden gleichmässig pro Wohnung verteilt, wie «Pro Einheit»» (fr «comme « Par unité »», it «come «Per unità»», en «as «Per Unit»») |
| V-25 | Verwalter | Nit | en `backend_statement_*uncategorized*` / `statements_uncategorized_text`: das Komma in «… in the rental contract, and checks this through the category» streichen |

## Belege zu Blocker/Major

### V-19 Hilfetext zum Verteilschlüssel
- Beleg: `messages/de.json:1349` `config_help_distribution_key`: «… Jede umlagefähige Rechnung kann einen Verteilschlüssel haben; ohne ihn wird sie gleichmässig pro Wohnung verteilt.» (fr/it/en:1349 ebenso). Angezeigt als Zweck der Seite «Verteilschlüssel» (`src/routes/config/distribution-keys/+page.svelte:25`) und als Hilfe beim Standard-Verteilschlüssel (`DefaultsSection.svelte:93`).
- Warum falsch: Seit 2caa6692 lehnen das Formular (`validateInvoice`, `src/lib/invoice.ts`) und das Backend (`requireKey`, invoice.service.ts:236–238, 279, 343) eine Rechnung ohne Schlüssel ab; das gilt auch für nicht umlagefähige Rechnungen. Regel 3 in `docs/nebenkostenabrechnung-anforderungen.md:144` sagt jetzt «Jede Rechnung hat einen Verteilschlüssel». Der Hilfetext widerspricht also der App und den Anforderungen, und ein unerfahrener Vermieter liest daraus, dass er den Schlüssel weglassen darf. Vor dem Change stimmte der Text, der Change macht ihn falsch.
- Fix: Text wie unter Punkt 3, in vier Sprachen, mit einem Test, der ihn auf der Seite prüft (Änderung eines sichtbaren Texts).

## Antworten auf die Fragen

### (1) Umsetzung V-1 bis V-17, M-1
Alle erledigt, V-5 nur teilweise (V-21); Reste zu V-4/V-6 nur als Nit V-22. **Eindeutig.**

### (2) Neue, in #407 nicht entschiedene Texte

- **`invoices_key_missing_note` (V-5):** ändern (V-21). Vorschlag:
  - de: «Diese Rechnung hat noch keinen Verteilschlüssel. Dwello verteilt sie darum gleichmässig pro Wohnung, wie «Pro Einheit». Prüfen Sie den Verteilschlüssel, den Dwello vorschlägt. Speichern Sie die Rechnung, gilt er für jede Abrechnung, die Dwello danach erstellt oder neu berechnet; schon versendete bleiben, wie sie sind.»
  - fr: «Cette facture n’a pas encore de clé de répartition. Dwello la répartit donc à parts égales par appartement, comme « Par unité ». Vérifiez la clé de répartition que Dwello propose. Si vous enregistrez la facture, elle vaut pour chaque décompte que Dwello établit ou recalcule ensuite ; ceux déjà envoyés restent tels quels.»
  - it: «Questa fattura non ha ancora una chiave di riparto. Dwello la ripartisce quindi in parti uguali per appartamento, come «Per unità». Verifichi la chiave di riparto che Dwello propone. Se salva la fattura, vale per ogni conteggio che Dwello allestisce o ricalcola in seguito; quelli già inviati restano come sono.»
  - en: «This invoice has no distribution key yet. Dwello therefore splits it equally per apartment, as «Per Unit». Check the distribution key Dwello proposes. If you save the invoice, it applies to every statement Dwello creates or recalculates afterwards; statements already sent stay as they are.»
  - Begriffe: versendet / envoyé / inviato / sent (`i18n-begriffe.md:87`), Pro Einheit (`UBIQUITOUS_LANGUAGE.md:131`). Empfehlung in der Sache **eindeutig**, der genaue Wortlaut ist eine Produktentscheidung.
- **`statements_uncategorized_error` (V-17):** übernehmen, alle vier Sprachen gut. **Eindeutig.**
- **`backend_statement_uncategorized_invoices` / `backend_statement_recalculation_uncategorized_invoices` (V-2):** übernehmen. Der Schluss passt zur jeweiligen Aktion, und `{invoices}` nennt Rechnungssteller, Datum und Betrag, genug zum Finden. Nur die en-Nit V-25 und fr unter V-18. **Eindeutig.**
- **`statements_key_per_unit` «Pro Einheit»:** übernehmen. Die App zeigt jetzt den Namen, den das PDF druckt, in allen vier Sprachen gleich den vordefinierten Namen. Nachrechnung: Lindenhof, 1 Wohnung, Hauswart 400 × 1/1 = 400.00 (Szenario); 6 Wohnungen 400 × 1/6 = 66.67; Mieterwechsel 01.05.2024 400 × 245/366 = 267.76; Gutschrift −120 bei 6 Wohnungen −20.00; Betrag 0 → 0.00. Unter beiden Namen gleich. **Eindeutig.**
- **`categories_predefined_not_allocable` (V-9):** übernehmen. de/fr/en gut, it-Nit V-23. Stützt sich weiter auf Art. 256b OR («Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.»). **Eindeutig.**
- **Hinweis «Wählen Sie, wie die Kosten verteilt werden.» in der Zeile des Upload-Dialogs** (`toDoOf`, `src/lib/invoice-upload.ts:156`, Schlüssel `invoices_error_key_required`): übernehmen. Er steht neben «Wählen Sie eine Kategorie.», hat dieselbe Form und greift den ersten Satz der Feldhilfe auf («Wie die Kosten … verteilt werden»). Er erscheint nur, wenn weder eine frühere Rechnung noch die Einstellungen einen Schlüssel liefern. fr «Choisissez comment les coûts sont répartis.», it «Scelga come vengono ripartiti i costi.», en «Choose how the costs are split.» gut. Dasselbe gilt für `backend_invoice_key_required`. **Eindeutig.**

### (3) Seite «Verteilschlüssel»
Der Text muss geändert werden (V-19, Major). Vorschlag `config_help_distribution_key`:
- de: «Bestimmt, wie die Kosten eines Gebäudes auf die einzelnen Wohnungen aufgeteilt werden, zum Beispiel nach Fläche, nach Zimmern oder zu gleichen Teilen. Jede Rechnung hat einen Verteilschlüssel; Sie wählen ihn beim Erfassen der Rechnung.»
- fr: «Détermine comment les coûts d’un immeuble sont répartis entre les appartements, par exemple selon la surface, selon le nombre de pièces ou à parts égales. Chaque facture a une clé de répartition ; vous la choisissez lors de la saisie de la facture.»
- it: «Determina come i costi di un immobile sono ripartiti tra i singoli appartamenti, per esempio secondo la superficie, secondo i locali o in parti uguali. Ogni fattura ha una chiave di riparto; la sceglie quando registra la fattura.»
- en: «Decides how a building’s costs are shared among the apartments, for example by area, by rooms or in equal parts. Every invoice has a distribution key; you choose it when you add the invoice.»

Der Text steht auch in den Einstellungen vor `settings_key_suggested`. Diesen Satz ebenfalls anpassen (V-20):
- de: «Dwello schlägt den hier gewählten Verteilschlüssel beim Erfassen einer Rechnung vor, wenn im Gebäude noch keine Rechnung derselben Kategorie einen hat.»
- fr: «Dwello propose la clé de répartition choisie ici lors de la saisie d’une facture, si aucune facture de la même catégorie dans l’immeuble n’en a encore.»
- it: «Dwello propone la chiave di riparto scelta qui quando registra una fattura, se nell’immobile nessuna fattura della stessa categoria ne ha ancora una.»
- en: «Dwello suggests the distribution key chosen here when you add an invoice, if no invoice of the same category in the building has one yet.»

Dass der Text geändert werden muss, ist **eindeutig**; der Wortlaut ist ein Vorschlag. Die alten Rechnungen ohne Schlüssel erwähne ich auf dieser Seite absichtlich nicht: Das Rechnungsformular (V-21) und die Abrechnung («Pro Einheit») erklären sie dort, wo sie vorkommen.

## Fehlende Begriffe
Keine neuen. «Pro Einheit» und «Gleichmässig pro Wohnung» stehen im Glossar (`UBIQUITOUS_LANGUAGE.md:131, 134`). Der Vorschlag aus Runde 1 (Zusatz bei «Heizkosten (Kategorie)») bleibt optional.

## Nicht bestätigt
- Die #452-Szenarien tragen in 2caa6692 noch `@wip` (invoice-edit.feature:60/68, invoice-new.feature:60/69/78, categories.feature:154/162/175/187, statement-agreed-costs.feature:155/165/172, statement-detail.feature:786). Ob sie grün laufen, habe ich nicht geprüft; ich habe keine Tests ausgeführt.
- `keyNamesOf` sucht den Schlüssel über `distributionKeys.name = 'Per Unit'` (statement-pdf.service.ts:239). Ob der interne Name eines vordefinierten Schlüssels unveränderlich ist, habe ich nicht geprüft. Wäre er änderbar, druckte das PDF wieder «–» (Thema für `code-reviewer`).
- Ob `default_distribution_key_id` leer sein kann (dann schlägt Dwello nichts vor, und der Satz «den Dwello vorschlägt» in V-21 trifft nicht zu): gesehen habe ich nur den Fallback `defaultDistributionKeyId: ''` in `src/routes/invoices/+page.server.ts:84`, nicht die Konfigurationsregeln.
- Welche fr-Texte #461 genau ändert (V-18): nicht im Worktree, nur nach Angabe des Auftraggebers.
- Andere Wege, die Rechnungen ohne Schlüssel anlegen (KI-Stapel, Import): weiterhin nur `createInvoice`/`updateInvoice` gesehen. Beide verlangen den Schlüssel jetzt.
