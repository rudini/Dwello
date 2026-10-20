# Code-Review 452, Runde 4 (Abschlussrunde)

Geprüft im Worktree `review-452-code4`, detached auf fb0dbcb5 (vom Aufrufer angelegt). Geprüft wurden die Merges 18bcabd5, 2153eca2 und 1a32a81c (`--remerge-diff`), `git diff 2153eca2 b4406ebd` und `git diff 1a32a81c fb0dbcb5`, jeweils ohne docs/reviews, docs/design/personas, implementation_plan.md und docs/archive. Die offenen IDs aus 452-review-3 waren nicht Teil dieses Auftrags.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-15 | Major | tests/e2e/features (kein Szenario); src/routes/invoices/[id]/edit/+page.svelte:58, src/routes/statements/generate/InvoiceHint.svelte:23, src/routes/config/categories/AllocabilityQuestion.svelte:53, src/routes/invoices/InvoiceCategoryFields.svelte:52 | Die Persona-Fixes P-1, P-2 und P-3 ändern sichtbares Verhalten, aber kein Szenario ist dazugekommen oder angepasst. Sie haben nur DOM- und Unit-Tests, und keiner der Commits sagt `No scenario: <reason>`. |
| C-16 | Major | src/routes/config/categories/CategoryForm.svelte:47-49 | 61da069d formatiert die Zeile `const chosen = $derived(…)` von main um. Prettier lief über die ganze Datei; das widerspricht der Gotcha «Formatting». Im Diff des Pull Requests gegen main bleibt damit eine Änderung an unberührtem Code, die mit der Anforderung nichts zu tun hat. |
| C-17 | Minor | src/routes/invoices/InvoiceUploadDialog.svelte:56 | 34c6930b streicht `proposal &&` auch im Effekt des Upload-Dialogs. Kein Test schlägt fehl, wenn man diese Änderung zurücknimmt: Der neue DOM-Test deckt nur das Formular «Rechnung erfassen» ab. |
| C-18 | Minor | src/routes/invoices/[id]/edit/+page.server.ts:29 (Ursache in src/lib/invoice.ts:68, `localPath`) | `localPath` lässt `/\t/evil.example` durch. Der Browser entfernt den Tab, und «Abbrechen» führt dann auf `https://evil.example/`. Der Fehler steckt schon auf main (Seite «Rechnung erfassen»); f21d5101 macht ihn auch auf der Bearbeiten-Seite erreichbar. |

## C-15 (Major): Persona-Fixes ohne Szenario

**Warum das falsch ist.** `CLAUDE.md`, Workflow 1, verlangt für jede sichtbare Verhaltensänderung ein Szenario, auch für einen Bugfix. Ausgenommen ist nur ein Commit mit `No scenario: <reason>`. Betroffen sind:
- **P-2 (f21d5101):** Nach Speichern oder Abbrechen auf der Bearbeiten-Seite geht es jetzt zurück zum Assistenten (`?schritt=3`), statt zur Detailseite der Rechnung. Das ist reine Navigation über zwei Seiten hinweg. Der DOM-Test zeigt nur `goto(returnTo)` und das `href`, nicht dass der Assistent mit seinen Angaben wieder in der Vorschau steht. Die Szenarien «Rechnung ohne Kategorie aus der Vorschau öffnen» (statement-agreed-costs.feature:164), «Von einer Rechnung nach der Abrechnungsperiode zur Rechnung» und «Von einer Rechnung ohne Leistungszeitraum zur Rechnung» (statement-generate.feature:394, 408) enden weiterhin bei «ist auf der Seite "Rechnung bearbeiten"».
- **P-3 (61da069d):** «Abbrechen» in der Rückfrage stellt jetzt die gespeicherte Wahl im Formular wieder her. Die Szenarien categories.feature:173 und :184 brechen danach die ganze Bearbeitung ab und prüfen nur den gespeicherten Wert. Sie sind also schon ohne den Fix grün.
- **P-1 (34c6930b):** Wechselt der Liegenschaftsverwalter zu einer Kategorie ohne eigenen Schlüssel, geht der Vorschlag zurück. invoice-new.feature hat dafür kein Szenario.

**So zeigt man den Fehler.** Nimmt man f21d5101 oder 61da069d aus dem Produktionscode zurück, laufen alle Szenarien in tests/e2e/features weiter grün. Nach dem Skill `slice-review` («Triage») schliesst ein Test auf tieferer Ebene den Persona-Befund. Er ersetzt aber nicht das Szenario, das Workflow 1 verlangt.

**Vorschlag.**
- P-2: «Rechnung ohne Kategorie aus der Vorschau öffnen» um einen Schritt erweitern: Kategorie zuordnen, speichern, «Dann ist der Assistent im Schritt "Vorschau"» (der Schritt existiert, statement-agreed-costs.feature:162).
- P-3: in categories.feature:184 vor dem Abbrechen der Bearbeitung die Wahl im Formular prüfen.
- P-1: ein Szenario in invoice-new.feature, oder in den Commit `No scenario: <reason>`.

## C-16 (Major): Umformatierung von unberührtem main-Code

**Warum das falsch ist.** Auf main steht die Zeile 47 in CategoryForm.svelte einzeilig. `git diff 59c9c2ff fb0dbcb5 -- src/routes/config/categories/CategoryForm.svelte` zeigt sie jetzt auf drei Zeilen umgebrochen, ohne inhaltliche Änderung. 61da069d hat nur die Bindung von `AllocabilityQuestion` gebraucht. Der Umbruch von `chosen` und von `HeatingChoice` zeigt, dass Prettier über die ganze Datei lief. Bei `HeatingChoice` und `AllocabilityQuestion` ist das harmlos, denn es sind Zeilen von #452.

**So zeigt man den Fehler.** Der Hunk `@@ -43,7 +44,9 @@` im Diff gegen main ändert nur Whitespace.

**Fix.** Die Zeile 47 wieder einzeilig schreiben, wie auf main.

## Weitere Prüfungen ohne Befund

- **18bcabd5:** Die Konfliktlösung ist sauber. `config_help_distribution_key` kommt von #452 (entschieden), `config_help_management_fee` von main (#520), in allen vier Sprachen.
- **2153eca2:** Die Messages habe ich schlüsselweise gegen Merge-Basis, #452 und main verglichen (Skript im Scratchpad).
  - Von main ging kein Text verloren. Main-Texte weichen nur bei den entschiedenen Schlüsseln `config_help_distribution_key` (fr) und `categories_predefined_not_allocable` (fr) ab. `settings_key_suggested` (it) hat main gar nicht geändert.
  - Die übrigen Abweichungen zu #452 betreffen nur U+00A0.
  - In fr.json steht kein normales Leerzeichen mehr vor `: ; ? ! % »` oder nach `«`.
  - en, it und de haben 34 Treffer « %», alle wie auf main.
  - Die Migration heisst jetzt 0028; migrations.pg.test.ts und die Kommentare folgen.
  - In statement-detail.steps.ts stehen beide Schritte.
- **1a32a81c:**
  - statement.service: Der Import von `getUncategorizedInvoices` bleibt.
  - Die Listen `skipped`, `allSkipped` und `uncategorized` stehen beide in statement-wizard.ts und im Test.
  - `previewErrors` übernimmt die Zeile von main ohne `NOTHING_OPEN`; `NOTHING_OPEN` und `partlyBilled` sind in src nirgends mehr verwendet. Die Prüfung von #452 auf Rechnungen ohne Kategorie bleibt.
  - screens.ts und accessibility.ts enthalten beide Listen. Die Jahre kollidieren nicht: preview-skipped 2014, uncategorized-invoices 2015, invoice-hints 2026.
  - `uncategorized-invoices` und `preview-skipped` stehen in tests/a11y/screens.json, accessibility.feature und sprachen-bildschirme.feature.
  - Den Allowlist-Eintrag `schritt` für InvoiceHint habe ich nachvollzogen.
- **Verhalten von #455 im Upload:**
  - `latestKeys` (invoice.service.ts:244) sortiert wie `GET /invoices` (invoiceDate desc, createdAt desc), filtert mit `isNotNull(distributionKeyId)` und ist nicht auf 20 Rechnungen begrenzt. V-15 bleibt damit gedeckt, auch ohne den gestrichenen DOM-Test.
  - Der KI-Vorschlag gilt auch in einer zugeklappten Zeile (Effekt im Dialog, DOM-Test «auch zugeklappt»).
  - Einen selbst gewählten Schlüssel überschreibt Dwello nicht (`keyChosen`). Getestet ist das in invoice-pages.dom und im Upload-Test «nach dem Zu- und Aufklappen».
  - Eine neue Kategorie bringt ihren eigenen Vorschlag: Die aufgeklappte Zeile nutzt InvoiceCategoryFields über `{...keyProposal}`.
  - Verloren ging nur die Frische: #455 fragte beim Hochladen nach, #452 liest mit der Seite, und nach dem Erstellen lädt `invalidateAll` neu. Eine Rechnung, die in einem anderen Tab erfasst wurde, sieht der Dialog erst nach dem Neuladen. Bei einem Einzelnutzer werte ich das nicht als Fehler. Daher braucht das Szenario von #455 den Schritt «ist auf der Rechnungsliste» nach dem Anlegen.
- **fb0dbcb5:**
  - `chooseKey` folgt dem Muster von `chooseCategory`; die Schritte rufen nur Tasks auf.
  - Die Szenarien werden nicht schwächer: Jeder hinzugefügte Schritt wählt einen Schlüssel, den der Default nicht liefert, und alle Prüfungen bleiben.
- **ae58cff2:** «Par logement» passt zu 0027_master_data_names, gallery_per_unit und tests/ui-screenshots.
- **b4406ebd:** de entspricht wörtlich dem Entscheid vom 2026-10-20; fr, it und en sagen dasselbe. Der DOM-Test folgt, und von den alten Texten ist nirgends etwas übrig (grep).
- **356b1cd2:** `categories_heating_fixed` (fr) sagt jetzt «le ramonage», wie `categories_heating_help` von main.
- **61da069d:** `Dialog.onclose` läuft nur bei Abbrechen und Escape (Dialog.svelte:46-51), nicht nach `onconfirm`. Die bestätigte Wahl bleibt damit erhalten.
- **Rote Tests (beim Lesen geprüft):**
  - P-1: Ohne den Fix bleibt k2 stehen.
  - P-2: Ohne den Fix bleiben `href` und `goto` auf `/invoices/i1`, und `returnTo` ist `undefined`, was `toBeNull` nicht besteht.
  - P-3: Ohne den Fix bleibt die Wahl auf «true».
- **Ponytail:** Ausser C-17 nichts zu streichen. `chooseKey` ist ein bewusst paralleler Task, keine Kopie eines bestehenden Helpers.

## Nicht bestätigt

- bun run lint, bun run check, backend type-check, `bunx vitest run` (komplett 3361 grün, die zwei Last-Timeouts einzeln grün), Backend komplett 1092 grün, die E2E-Läufe (chromium, 247 + 31) und die Axe- und Sprachzeilen (62): alles vom Aufrufer gemeldet. Ich habe nichts davon wiederholt, weil der Worktree keine node_modules hat und E2E nicht erlaubt ist.
- Ob der Assistent nach der Rückkehr von der Bearbeiten-Seite (`?schritt=3`) seine Angaben wiederherstellt: Ich habe nur gelesen, dass «Rechnung erfassen» (PreviewChecks.svelte:72) dasselbe Ziel nutzt. Gelaufen ist kein Test, siehe C-15.
- Ob 0028 auf origin/main frei ist: Die lokale Referenz origin/main ist kein Vorfahre von fb0dbcb5 mehr und hat höchstens 0027 (`git ls-tree`). Neuere Commits auf main habe ich nicht abgerufen.
