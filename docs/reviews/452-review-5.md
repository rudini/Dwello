# Code-Review 452, Runde 5 (Re-Review)

Geprüft im Worktree `review-452-code5`, detached auf 11b686c3. Den Worktree hat der Aufrufer angelegt, ich habe dort nichts geändert. Geprüft habe ich:
- die Merges 7fccaa89 und 6484c79c mit `--remerge-diff`;
- die Commits e851b4ce, e7097c5e, ca1ead61, 6f93be93, 55f4d74b, 3275ae95 und 11b686c3 einzeln.

Das sind alle Commits der First-Parent-Kette von fb0dbcb5 bis 11b686c3. Bei jedem Diff waren docs/reviews, docs/design/personas, implementation_plan.md und docs/archive ausgenommen.

## Status der offenen IDs aus 452-review-4

| ID | Status | Beleg |
|----|--------|-------|
| C-15 | geschlossen | 55f4d74b, Einzelheiten unten |
| C-16 | geschlossen | ca1ead61: `git diff $(git merge-base origin/main HEAD) HEAD -- src/routes/config/categories/CategoryForm.svelte` hat keinen reinen Whitespace-Hunk mehr. Die Zeile `chosen` steht wieder einzeilig wie auf main. |
| C-17 | geschlossen | 6f93be93: Der Effekt in InvoiceUploadDialog.svelte:53-59 prüft wieder `proposal &&`. Den Grund im Commit halte ich für richtig: Eine zugeklappte Zeile kann ihre Kategorie nicht wechseln, eine aufgeklappte nimmt den Fix über InvoiceCategoryFields. |
| C-18 | geschlossen | e7097c5e, Einzelheiten unten |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

## Geprüft ohne Befund

- **C-15, P-1** (invoice-new.feature:84-90):
  - Ohne Fix wäre das Szenario rot. Auf der Merge-Basis setzt der alte Code mit `proposal &&` nichts, wenn der Vorschlag leer ist, und «Pro Zimmer» bliebe stehen.
  - Der Kommentar stimmt: `default_distribution_key_id` hat die Vorgabe `null` (config.service.ts:45-49), und keine Migration und kein E2E-Seed setzt ihn.
  - «Verteilschlüssel auswählen» ist `invoices_choose_key`, die Question `chosenKey` liest die gewählte Option.
  - Der Vorschlag kommt synchron aus den Seitendaten (`latestKeys`). Zwei Kategoriewahlen nacheinander sind also kein Wettlauf.
- **C-15, P-2** (statement-agreed-costs.feature:170-176):
  - Ohne Fix landet der Verwalter auf der Detailseite der Rechnung, und `currentStep` schlägt fehl.
  - `recategorize` wählt die Kategorie und speichert (tasks/invoice-form.ts:52).
  - Der Schritt «Heizprofil und Verwaltungspauschale» beweist auch, dass die Angaben wiederhergestellt sind. `restoredStep` (statement-wizard.ts:370-382) fällt auf Schritt 1 oder 2 zurück, wenn Periode oder Gebäude fehlen. Damit ist der offene Punkt «Nicht bestätigt» aus Runde 4 erledigt.
  - InvoiceHint.svelte:23 und PreviewChecks.svelte:74 nutzen dasselbe Ziel `schritt=3`.
- **C-15, P-3** (categories.feature:190-194):
  - Ohne Fix bliebe «Umlagefähig» angekreuzt, und `notAllowedChosen` wäre falsch.
  - Der neue Schritt ruft nur Questions auf (Checked, ein echter Zustand).
- **C-18** (src/lib/invoice.ts:68-72):
  - Rot ohne Fix: Der alte Ausdruck lässt `/\t/evil.example` durch.
  - `searchParams.get` dekodiert `%09` und `%0A`, darum greift die Prüfung auch bei kodierten Adressen.
  - Der Grund für «No scenario» steht im Commit.
- **Merge 7fccaa89:**
  - recalculateStatement (statement.service.ts:567-585) hat `refuseUncategorized` und `carryOver`; `carryOver` geht in den Saldo ein.
  - statement-pdf.pg.test: Der Import umfasst `configuration` und `invoices`, beide describe sind sauber geschlossen.
  - config-pages.test: Der Text von #452 ersetzt den alten von main, der Text von #490 bleibt.
  - Regel 11 ist die von main (#448). Regel 12 ist die von #452; das «Offen: … (#382)» von main fällt zu Recht weg, weil #452 diesen Punkt löst.
  - In statement-detail.feature und statement-detail.steps.ts stehen beide Teile.
- **e851b4ce:**
  - backend/migrations endet mit 0028_statement_carry_over und 0029_lift_waste_descriptions.
  - Ausserhalb von migrations.pg.test.ts verweist nichts mehr auf `0028_lift`.
  - origin/main (frisch abgerufen) hat höchstens 0028 und ist Vorfahre von HEAD.
- **Merge 6484c79c:**
  - updateInvoice prüft `refuseCredit` vor `requireKey`, createInvoice ebenso (invoice.service.ts:281/286). `getUncategorizedInvoices` bleibt.
  - statement-generation.ts nutzt `found`, `oldRule`, `overlapping` und `uncategorized`; der Test erwartet `heatingWithoutServicePeriod: []` und `uncategorized: []`.
  - Upload: `tank` und `keyProposal` werden bis zu UploadRowFields durchgereicht (Zeile 79 `deliversToTank`, Zeile 110 `{...keyProposal}`). `keyFor`, die Map `keys` und die Abfrage `/invoices?limit=20` von #455 sind ganz entfernt; ein grep findet in src und tests keinen Rest.
  - Die Bearbeiten-Seite liefert `tanks` und `returnTo`, der Import hat `deliversToTank` und `LatestKey`.
  - `hinted` in PreviewChecks nimmt beide Listen.
  - Die Liste in screens.ts hat `heating-hints` und `uncategorized-invoices`. Beide stehen auch in tests/a11y/screens.json, accessibility.feature und sprachen-bildschirme.feature.
  - In invoice-form.steps sind beide Blöcke geschlossen.
- **3275ae95 und 11b686c3:**
  - Ohne `url` wirft der Edit-Load bei `url.searchParams`.
  - Ohne Schlüssel lehnt createInvoice mit `requireKey` ab, darum hatte der Update-Test keine Rechnung.
  - Die Reihenfolge `refuseCredit` vor `requireKey` hält den Test beim Erfassen auf `INVOICE_AMOUNT_NEGATIVE`.
  - `perAreaKey` gibt es in helpers/records.ts:61.
- **Ponytail:** Im Delta ist nichts ungenutzt, und es gibt keine Kopie eines bestehenden Helpers.
- **Nichts Fremdes im Delta:** Ausser den Merges berührt jeder Commit nur Befunde aus Runde 4 oder Tests, die durch die Merges brachen.

## Nicht bestätigt

- **Checks** (vom Aufrufer gemeldet): lint, check, backend type-check, `bunx vitest run` komplett (2 Last-Timeouts, einzeln grün), Backend komplett und E2E chromium (305 passed). Ich habe nichts davon wiederholt: Der Worktree hat weder `node_modules` noch `backend/node_modules`, und E2E ist mir nicht erlaubt.
- **Rote Läufe der drei Szenarien** ohne ihren Fix: Ich habe nur beim Lesen geprüft, dass sie fehlschlagen würden (siehe oben); gelaufen ist keiner.
- **Hinweis:** Für die Prüfung von e851b4ce habe ich im Worktree `git fetch origin main` ausgeführt. Das hat die gemeinsame Referenz origin/main aktualisiert. Dateien habe ich nicht geändert.
