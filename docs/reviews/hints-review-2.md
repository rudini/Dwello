# Code-Review 2: Hinweise der Rechnungsprüfung (#130 Leistungszeitraum, #131, #134), Fixes

Gegenstand: `git diff b638272 e814447` im Worktree `review-hints-code2` (e814447). Alle 22 geänderten Dateien gelesen (Persona-Berichte und `docs/reviews/hints-review-1.md` als Belege). Dazu gelesen: `invoice-completeness.service.ts` (ganz um `categoryInvoices`, `stockFinding`, `withoutServicePeriod`), `backend/src/db/schema.ts` (`invoices.description` ist `notNull`, `fuelStocks.categoryId` ist `notNull`), `backend/src/__tests__/helpers/records.ts` (`insertInvoice`), `api-contracts.pg.test.ts:51,99-104` (`drift` prüft Felder, nicht Werte), `messages/de.json:721` (Hilfetext Leistungszeitraum), `docs/design/i18n-begriffe.md:41`, `tests/e2e/CLAUDE.md` («No scenario», «Rules»), `.claude/skills/ponytail-review/SKILL.md`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-10 | Major | `backend/src/services/invoice-completeness.service.ts:250-253`, `tests/e2e/features/statement-generate.feature` | P-1 ist eine Korrektur, die der Benutzer sieht (Heizöl-Lieferungen verschwinden aus beiden Hinweisen), aber ohne Szenario; nur der pg-Test deckt sie ab, obwohl der E2E-Stack Tankbestand und Lieferung erzeugen kann |
| C-11 | Minor | `docs/api-specification.md:122` | C-4 nur halb nachgeführt: die Listen heissen dort weiter `[{ id, billingEntityName, invoiceDate, amount }]`, ohne das neue `description`, und die Ausnahme «nicht in der Kategorie des Tankbestands» fehlt |
| C-12 | Minor | `invoice-completeness.service.ts:250-253` | P-1 bleibt bei einem Gebäude mit Heizöl ohne erfassten Tankbestand bestehen: der Hinweis nennt die Lieferung und verlangt einen Leistungszeitraum, der Hilfetext (`messages/de.json:721`) sagt ohne Bedingung «Nicht für Lieferungen von Heizöl …». Ob das gewollt ist (dort zählen die Käufe nach Rechnungsdatum), ist eine Produktfrage; im Plan oder in einem Issue festhalten |
| C-13 | Nit | `backend/src/__tests__/invoice-completeness.pg.test.ts:134-161` | Die beiden neuen Tests stehen ausserhalb jedes `describe`, der zu #130 direkt nach «Rechnungen ohne Leistungszeitraum», obwohl er die Befunde pro Kategorie prüft; in den passenden `describe` verschieben |

Ponytail: Lean already. Ship. (Ein Filter mit Unterabfrage statt einer zweiten Abfrage, eine Meldung für beide Hinweise, die Umbenennung nur dort, wo sie gebraucht wird.)

## Stand der Befunde aus Runde 1

- **C-1 (Major) behoben.** Szenario «Hinweis auf eine Rechnung, die nur teilweise zählt» (`statement-generate.feature:149-153`), ohne `@wip`. Gelesen: 2024 zählt von der Rechnung über 1200 nur 2024-07-01 bis 2024-12-31 (184/365 ≈ 604.93), dazu fehlt das erste Halbjahr; ob der Befund `gap` oder `deviation` ist, spielt keine Rolle, beide tragen den Satz (`statement-wizard.ts:149-156`). Der Schritt prüft mit `toContain` (`statement-generate.steps.ts:201-204`), der erwartete Text ist `statements_finding_partial_one` wörtlich. Mit `partial: false` fehlt der Satz: rot ohne die Änderung.
- **C-2 (Major) behoben.** pg-Test «zählt die Rechnungen, deren Leistungszeitraum über die Abrechnungsperiode hinausreicht» (`invoice-completeness.pg.test.ts:134-146`): Vorjahr 1000 (2024-01-31, also im erfassten Anfang), 2025 nur 604.93 von 1200, `partialCount: 1`. Mit `partial: false` wäre `partialCount` 0: rot. Eigenes Gebäude, aufgeräumt vor dem `expect`.
- **C-3 (Minor) behoben.** `statement-wizard.test.ts:159-170`: Mehrzahl mit `{count}` bei `gap`, Satz bei `deviation`, kein Satz bei `new`.
- **C-4 (Minor) teilweise:** siehe C-11.
- **C-5 (Minor) behoben.** `editHintedInvoice` wartet mit `Wait.forUrl` auf `/invoices/…/edit`, wie `recordInvoiceFromWarning`.
- **C-6 (Nit)** zurückgenommen mit Kommentar am Target; Begründung (Datum pro Szenario eindeutig) trägt.
- **C-7 (Nit)** verworfen mit Begründung; trägt (`statement-wizard.ts:252-253` braucht `?? []` für Fixtures ohne die Felder).
- **C-8 (Nit) behoben.** `countOfInvoicesWithoutServicePeriodOn`, beide Verwendungen umbenannt.
- **C-9 (Nit)** offen, wie in Runde 1 zulässig; der Linkname nennt jetzt zusätzlich die Beschreibung.

## Persona-Fixes

- **P-1 (Heizöl):** `withoutServicePeriod` schliesst Rechnungen aus, deren Kategorie in den Tankbeständen des Gebäudes vorkommt; `or(isNull(categoryId), notInArray(...))` behandelt Rechnungen ohne Kategorie richtig (sonst fiele `NULL NOT IN` weg), und `fuelStocks.categoryId` ist `notNull`, also kein `NOT IN` mit `NULL` in der Unterabfrage. Gilt für beide Listen (#131 und #134), was zum Hilfetext passt. pg-Test «nennt Lieferungen der Kategorie des Tankbestands nicht» (`:148-161`): mit positivem Anker (Kaminfeger Keller, Standardkategorie Hauswart), ohne den Filter stünde «Heizöl AG» in der Liste: rot. Szenario fehlt: C-10. Restfall ohne Tankbestand: C-12.
- **P-4/P-5 (Beschreibung, «Rechnungsdatum»):** neue Meldung `statements_hinted_invoice` in allen vier `messages/*.json`; Begriffe nach `i18n-begriffe.md:41` (date de facture, data della fattura, invoice date). `description` kommt aus der Abfrage, ist im Schema `notNull` (kein «null» im Text möglich), steht in `HintedInvoice` und im Contract; `drift` prüft nur Felder, der abweichende Beispielwert «Kaminfeger 2025» stört nicht. DOM-Test erwartet den neuen Wortlaut: mit dem alten Rendering rot. Der geänderte Text ist im Zustand `invoice-hints` sichtbar, den `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature` schon führen.

## C-10 (Major): Ausschluss der Heizöl-Lieferungen ohne Szenario

**Warum falsch.** `CLAUDE.md`, Workflow 1: jede Verhaltensänderung, «including a bug fix a user can see», beginnt mit einem Szenario; ohne Szenario nur bei einem Zustand aus der abschliessenden Liste in `tests/e2e/CLAUDE.md`, «No scenario». P-1 haben zwei Personas in der Vorschau gesehen, die Korrektur ändert, welche Rechnungen die Vorschau nennt. Der Stack kann den Zustand erzeugen: `seed.fuelStock` (`statement-detail.steps.ts:213`) bzw. der Schritt «… den Tankbestand vom {string} mit {string} Franken erfasst» (`building-detail.steps.ts:87`, genutzt in `statement-generate.feature:93-94`) und «im Gebäude {string} gibt es eine Rechnung der Kategorie {string} über {string} Franken vom {string}». Weder Plan noch Commit nennen `No scenario: <reason>`.

**Wie zeigen.** `grep -n "Heizöl\|Tankbestand" tests/e2e/features/statement-generate.feature` findet nur das Szenario Zeile 93-94, keines zu den Hinweisen. Den `or(...)`-Block in `invoice-completeness.service.ts:250-253` entfernen: alle Szenarien bleiben grün. Fix: ein Szenario neben «Hinweis auf eine Rechnung ohne Leistungszeitraum kurz nach der Abrechnungsperiode», z. B. Tankbestand vom 2024-12-31, eine Heizöl-Rechnung vom 2025-01-15 und eine Kaminfeger-Rechnung vom 2025-01-20; Dann nennt der Hinweis die Rechnung vom «20.01.2025» (positiver Anker) und keine Rechnung vom «15.01.2025» (neue Question als Anzahl, analog `countOfInvoicesWithoutServicePeriodOn`).

## Nicht bestätigt

- Alle Checks des Aufrufers auf e814447 (lint, check, backend type-check, `bunx vitest run statement-wizard.test.ts statement-wizard.dom.test.ts`, `bun test invoice-completeness.pg.test.ts api-contracts.pg.test.ts`, E2E `statement-generate.feature` 30 passed, axe/Sprachen `invoice-hints`/`category-check` 4 passed): **vom Aufrufer gemeldet**, nicht wiederholt (in Runde 1 war `node_modules` im Worktree gesperrt; keinen Zweifel am Ergebnis aus dem Lesen).
- Rot ohne die Änderung (Szenario #130, pg-Tests #130 und Heizöl, DOM-Test): nur durch Lesen beurteilt (siehe oben), nicht ausgeführt.
- Ob der pg-Test #130 tatsächlich `deviation` und nicht `gap` liefert: das Ergebnis hängt an `findingOf`/`missingParts` (gelesen bis `checkCategories`, nicht nachgerechnet); laut Aufrufer grün.
- Ob die Sätze in fr/it/en im Zustand `invoice-hints` ohne Deutsch erscheinen: laut Aufrufer grün (Sprachzeilen), nicht ausgeführt.
- Helga Runde 2 zum neuen Zeilentext steht laut Plan aus.
