# Code-Review W1b, Runde 5 (Merge-Commit 3369e4f, #96/#104, PR #314)

Geprüft: `git show 3369e4f --cc` und `git diff 3369e4f^1 3369e4f` (was main in diesen Branch bringt), im Worktree `review-s5-code` (detached auf 3369e4f).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Nit | backend/migrations/0013_line_item_invoices.sql | Umbenennung von `0012_line_item_invoices.sql`: Eine lokale Datenbank, auf der dieser Branch die alte `0012_line_item_invoices.sql` schon angewendet hat, weist `migrate()` jetzt als «unbekannte Migration» ab (`backend/src/db/migrate.ts:30`). Betrifft nur Entwicklungs- und Persona-Datenbanken dieses Branchs, die sich neu aufsetzen lassen (`bun run db:reset`). Ausgeliefert wurde nichts, also richtig so. |

Es gibt keine Blocker und keine Majors.

## Was bestätigt ist

- **Konflikt bei den Steps** (`tests/e2e/steps/statement-detail.steps.ts:274`, `:315`): `nennt die Abrechnung das Mietverhältnis {string}` und `nennt die Abrechnung {string}` (main, `languageOfPdf`) sind nicht mehrdeutig. In einer Cucumber Expression ist `{string}` ein Text in Anführungszeichen, und der Ausdruck gilt für den ganzen Schritt. Damit passt `… das Mietverhältnis "…"` nicht auf den kurzen Schritt von main, und ebenso wenig `… das Heizprofil "…"` (Zeilen 251/256). Beide Imports sind da (`laterInvoicesHint(s)`, `invoiceOfPosition`, `invoicesOfPosition` neben `languageOfPdf`). Im Feature verwenden Zeile 403 (main, «PDF auf Französisch») und Zeile 471 (Branch, Mietverhältnis) je ihren eigenen Schritt. Die Szenarionamen in `statement-detail.feature` sind eindeutig. Gegenüber dem Branch-Parent ändert der Merge an diesem Feature nur das neue Szenario von main und die Umbenennung. Strenge und Erwartungstext des Mietverhältnis-Szenarios bleiben gleich.
- **Migration**: Die Reihenfolge `0012_tenant_language_without_rm` → `0013_line_item_invoices` ist unabhängig: Die eine ändert `tenants`/`configuration`, die andere `line_items`. Im Repo ausserhalb von `docs/archive`/`docs/reviews` zeigt kein Verweis mehr auf `0012_line_item_invoices` (grep). `docs/data-model.md` und der Verlauf nennen jetzt `0013`. Der Test in `migrations.pg.test.ts` filtert `file < '0012_tenant_language_without_rm.sql'` und schliesst damit 0013 richtig aus.
- **Verlauf** (`docs/archive/implementation-plan-verlauf.md`): Beide Sessions (W6b, W1b) sind ganz enthalten und abgehakt, die Migrationsnummer im W1b-Teil ist angepasst.
- **Statement-Detail aus main, zusammen mit CostTable, PartiesPanel, LineInvoices und dem Hinweis**: `+page.svelte` übergibt `language={statement.tenantLanguage}` nur an `PdfAction` im `action`-Snippet des `PageHeader`. Hinweis (`statement-later-invoices`), `CostTable`, `PartiesPanel` und `LineInvoices` bleiben, wie sie auf dem Branch waren. Den Mapper `toStatement` (`src/lib/server/statement.ts`) haben beide Seiten ergänzt, sie kommen sich nicht in die Quere (`tenantLanguage` neben den Feldern des Branchs). Der Contract `tests/contracts/statement.json` enthält beides: `tenant.language: "fr"` (Z. 25) und `lineItems[].invoices` (Z. 42). `statement-mapping.test.ts` und die DOM-Tests zu `statement-pdf-language` lesen die Antwort aus diesem Contract.
- **Texte**: Alle vier `messages/*.json` haben dieselben 1535 Schlüssel, ohne Differenz (per Skript geprüft). Der Merge bringt nur die Texte von main (`statements_pdf_in_*`, `tenants_language*`, `statements_reminder_*`).
- **a11y**: Main fügt keinen neuen Bildschirm hinzu. `statement-detail` und `statement-parts-detail` stehen weiter in `tests/a11y/screens.json`.
- **Nicht zum Auftrag gehörende Änderungen**: keine. Der Merge-Commit ändert über das hinaus, was main mitbringt, nur die drei beschriebenen Konfliktstellen.

## Nicht bestätigt

- lint, check, vitest (2726), Backend-Type-Check und Backend-Tests (769, Abdeckung 94.4 %) sowie bddgen auf 3369e4f: vom Aufrufer gemeldet, nicht selbst wiederholt. Dass bddgen grün ist, spricht zusätzlich dafür, dass die beiden Steps nicht mehrdeutig sind.
- E2E der Features zu Abrechnungen, Rechnungen und Mietern: lief beim Aufrufer noch, Ergebnis nicht gesehen. Ob die Szenarien «Abrechnung nennt die Sprache ihres PDFs» und «Abrechnung nennt das Mietverhältnis in der Periode» im Browser grün sind, habe ich nur durch Lesen geprüft (Steps, Questions, Targets `pdfLanguage`/`tenancyOfStatement`).
- Den übrigen Inhalt von main (Mahnbriefe pro Sprache, `reminder-letter.ts`, Persona- und Review-Dokumente) habe ich nicht neu geprüft. Er ist auf main bereits geprüft, und der Merge ändert ihn nicht.
