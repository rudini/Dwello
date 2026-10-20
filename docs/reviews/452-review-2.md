# Code-Review #452, Runde 2

Gegenstand: `git diff 2caa6692 922147fb` (Fixes) und der Merge 2578a5d3 von origin/main, im Worktree `review-452-code2` (2578a5d3, detached). Vorbericht: `452-review-1.md` (C-1 bis C-11). Fachreview: `452-fachreview-2.md` (V-18 bis V-25) mit den Entscheiden des Coordinators.

## Status der offenen IDs

| ID | Status | Beleg |
|---|---|---|
| C-1 | erledigt | `InvoiceUploadDialog.svelte:52–59`: ein `$effect` im Dialog setzt `proposedKey(...)` für jede Zeile, auch eine zugeklappte. `valuesOf` schreibt die KI-Kategorie in `row.values.categoryId`, der Effekt sieht sie also. DOM-Test «… vorschlagen, auch zugeklappt» prüft den gesendeten `distributionKeyId` (`k2`) ohne Aufklappen. Ohne den Effekt würde `k1` gesendet: rot |
| C-2 | erledigt | `UploadRow.keyChosen` (`invoice-upload.ts:67`), `bind:keyChosen={row.keyChosen}` (`UploadRowFields.svelte:107`), `keyChosen = $bindable()` statt der lokalen Kopie in `InvoiceCategoryFields.svelte`. Der Dialog-Effekt beachtet `row.keyChosen` auch. DOM-Test «behält einen selbst gewählten Verteilschlüssel nach dem Zu- und Aufklappen»: ohne die Änderung setzt das neue Mounten `k2`, also rot. Neu/Bearbeiten unverändert (`edit/+page.svelte:165` reicht `keyChosen` ohne `bind` weiter) |
| C-3 | abgelehnt (Coordinator, #405/#461) | siehe aber C-12 |
| C-4 | erledigt | `grep -rn "@wip" tests/e2e/features` → nichts. Ob die Szenarien grün laufen: unter «Nicht bestätigt» |
| C-5 | zurückgestellt (PO-Entscheid, späterer Commit) | nicht in diesem Delta |
| C-6 | erledigt | `screens.json` hat den Bildschirm `invoice-edit-keyless` mit `default` (Bedeutung in `stateMeanings` vorhanden), dazu eine Zeile in `accessibility.feature:126` und `sprachen-bildschirme.feature:127`. Die Daten kommen aus `screens.ts:80–81`: `invoiceOn('Seeblick','Hauswart','200.00','2014-03-31')`, dann `invoiceWithoutKey('Hauswart 2014-03-31')`, und der Schlüssel `Rechnung Hauswart 2014-03-31` passt zu `backend.ts:423/525`. `category-edit-used default` kam als Zeile in allen drei Dateien dazu |
| C-7 | erledigt | `StatementWizard.svelte:180–183`: eine leere Vorschau wird jetzt vor `uncategorized` geprüft. Neuer DOM-Test. Den Text `statements_nothing` gibt es nur über `errors.preview` (`PreviewEmpty`), also rot ohne die Änderung |
| C-8 | erledigt | `config_help_distribution_key` ist vierfach nach V-19 geändert. Der DOM-Test `distribution-keys-pages` und das Szenario `distribution-keys.feature:60` prüfen den neuen Satz |
| C-9 | erledigt | Szenario `statement-detail.feature:666` «Kein Neuberechnen, solange …», nur mit bestehenden Steps (`agreed-costs.steps.ts:150`, `statement-detail.steps.ts:410`). Der erwartete Teiltext steht in `backend_statement_recalculation_uncategorized_invoices` (de.json:472) |
| C-10 | erledigt | `types.ts:253` `LatestKey[]` |
| C-11 | erledigt | `invoice.service.ts:607` gibt nur noch `billingEntityName`, `invoiceDate` und `amount` zurück; einziger Aufrufer ist `statement.service.ts:701` |

Fachreview-Fixes im Delta: V-19 (C-8), V-20 (`settings_key_suggested` vierfach, `config-pages.test.ts`), V-21 (`invoices_key_missing_note` vierfach, DOM-Test), V-22 (`fuel-stock.service.ts:58` `isNotNull`, pg-Test; ohne die Änderung nimmt der Test die Rechnung ohne Schlüssel und fällt auf `default_distribution_key_id` zurück, Standard `null`, also rot), V-23 (it), V-24 (`invoices_no_key` vierfach, DOM-Test), V-25 (en-Komma). Der Merge löst den Konflikt in `statement-detail.feature` richtig (beide Szenarien vollständig, keine Marker). Die Migration heisst jetzt 0027 und ist die einzige mit dieser Nummer. Der Kommentar in `migrations.pg.test.ts` stimmt (0027 läuft nach 0021, Sortierung nach Dateiname, `migrate.ts:19`).

## Neue Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-12 | Minor | `messages/fr.json:855` (`invoices_not_allocable`), `fr.json:1444` (`categories_predefined_allocable`) | fr: das Delta stellt nur die Hälfte der Wahl um. `invoices_not_allocable` heisst jetzt «Non répercutable», das Gegenstück `glossary_allocable_term` (fr.json:105) bleibt «Imputable». In derselben Radiogruppe (`CategoryForm.svelte:55–58`), in den Filtern (`categories/+page.svelte:26–27`, `InvoiceSearch.svelte:80–81`) und in den Zeilen stehen damit «Imputable» und «Non répercutable» nebeneinander. `categories_predefined_allocable` schickt jetzt zu « Répercutable », in der fr-Oberfläche heisst die Wahl aber «Imputable», und im selben Satz steht noch «non imputable». Das löst sich erst, wenn #461 vor diesem PR gemergt wird. Sonst: `glossary_allocable_term` im selben Zug umstellen oder diese zwei Zeilen #461 überlassen (V-18: «Texte selbst nicht ändern»). Kein Test prüft den fr-Wortlaut |

Keine Blocker oder Majors im Delta.

## Bestätigt (Delta)

- ponytail: nichts zu kürzen. Der Dialog-Effekt nutzt `proposedKey` und kopiert es nicht. Der Effekt in `InvoiceCategoryFields` bleibt für Neu/Bearbeiten nötig. `keyChosen` ersetzt die lokale Kopie `chosen`, es bleibt nichts ungenutzt zurück.
- Konventionen: alle geänderten Texte sind in allen vier `messages/*.json` geändert, und es gibt keine neuen Schlüssel. Zum Delta gehören nur noch die zwei Berichte unter `docs/reviews/`, keine fremden Änderungen.
- Screenplay: das neue Szenario ruft nur Steps auf, und die Steps rufen nur Tasks auf (`recalculateDraft`). Die Fixture-Daten laufen über `seed`.
- Selbst ausgeführt auf 2578a5d3: `bunx vitest run` für `invoice-upload-dialog.dom`, `statement-wizard.dom`, `distribution-keys-pages.dom`, `config-pages`, `invoice-pages.dom`: 227/227 grün. `bun test fuel-stock.pg.test.ts migrations.pg.test.ts` (dwello_test_r452): 46/46 grün.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, volle Backend-Suite (1035 pass, Coverage 93.8 %), `bunx vitest run` komplett (auf 922147fb), fallow audit.
- E2E: ob die 13 Szenarien ohne `@wip`, das neue Szenario `statement-detail.feature:666`, das geänderte `distribution-keys.feature:60` und die neuen a11y- und Sprachzeilen (`invoice-edit-keyless`, `category-edit-used default`) grün laufen, steht aus. Nicht ausgeführt, wie vorgegeben. Gelesen habe ich nur `screens.ts` und die Steps.
- Ob die zusätzliche Rechnung «Hauswart 2014-03-31» in Seeblick einen anderen a11y- oder Sprachbildschirm verändert (Rechnungsliste, Jahresfilter 2014): nur gelesen. Es gibt dasselbe Muster schon mit `billedInvoice`, darum ist kein Fehler zu erwarten.
- Rot ohne Änderung: nur durch Lesen beurteilt, keine Änderung zurückgenommen (Worktree nur lesen).
