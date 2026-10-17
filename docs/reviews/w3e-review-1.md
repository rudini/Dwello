# Slice-Review #348, Runde 1 (74f223f..8a5a570)

Worktree: `review-w3e-code` (8a5a570). Alle 59 geänderten Dateien gelesen (messages/*.json vollständig im Diff, Code, Unit-, pg- und E2E-Tests, Plan, Fach-Review). Jede Zeile der Issue-Tabelle mit dem Diff abgeglichen:

| Issue-Befund | Ergebnis |
|---|---|
| `dashboard_task_drafts_text_one` | behoben (de, fr, it, en), kein Test (C-1) |
| `statements_finding_stock_missing_many` | behoben, Test `statement-wizard.test.ts`, E2E `statement-generate.feature:205` |
| `backend_formula_sample_negative` | behoben (de; en ebenfalls «»), Backend-Text angeglichen, Test `formula-codes.test.ts:39` |
| `statements_list_and`, `statements_part_month` | behoben mit `Intl.ListFormat(`${getLocale()}-CH`)`, Schlüssel entfernt, neuer Test «Januar, Februar und März» (rot auf der Basis: «den Januar und den Februar und den März») |
| `statements_finding_gap_*`, `stock_missing_one` | behoben (de, en), Tests und E2E angepasst |
| `contracts_availability_blocked` | behoben nach V-2 in allen vier Sprachen, Test `contract-availability.test.ts:46` |
| `backend_*_name_taken`, `apartments_number_taken_text` | behoben (de, en), Regeltest «keine geraden Anführungszeichen» (rot auf der Basis), Backend-Texte und pg-Tests angepasst |
| `buildings_saved_toast` / `_deleted_toast` | behoben (alle vier, fr mit U+00A0 geprüft), kein Test (C-1) |
| `buildings_canton_fr` | behoben (nur de), kein Test (C-1) |
| `statements_error_fee` | zurückgewiesen (V-1), Begründung in `docs/reviews/w3e-fachreview-1.md` und Plan |
| Feldfehler mit/ohne Punkt | behoben in allen vier Sprachen, Regeltest `i18n.test.ts:40` (rot auf der Basis) |
| `help_tenants_3` | behoben (de, fr, it) |
| `tenants_channel_help` | behoben (de) |
| `statements_compared_text` | behoben (alle vier) |

Die Negativprüfung `missingStockFindings` (`tests/e2e/questions/statement-generate.ts:121`) sucht jetzt «Ohne Anfangs- und Endbestand»; das steht in jedem Befund zum fehlenden Tankbestand (`statement-wizard.ts:141`), mit dem alten Suchtext «Tankbestand am» wäre der Plural «Die Tankbestände am» nicht mehr gefunden worden. Richtig so.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | messages/de.json:252, :279, :373 | Sichtbare Textänderungen ohne Test, der sie festhält: `dashboard_task_drafts_text_one` (im Issue Major), die Gebäude-Toasts mit «», `buildings_canton_fr`, `statements_compared_text`, `tenants_channel_help`, `help_tenants_3`. Kein Test war auf der Basis rot für diese Zeilen (grep in `src/__tests__`, `tests/e2e`: kein Treffer). Das «Done means» des Issues verlangt nur angepasste Pins und einen Regeltest; deshalb Minor. Günstig wäre ein Test für den Einzahl-Text der Übersicht (z. B. in einem `overview`-Test «… dem Mieter zu.») |
| C-2 | Nit | src/__tests__/i18n.test.ts:32 | Regel «keine geraden Anführungszeichen» nur für de und en; fr und it haben schon keine, `languages` würde alle vier schützen |
| C-3 | Nit | src/__tests__/heating-profiles.test.ts:77, categories.test.ts:132, categories-page.dom.test.ts:173, :177, :263 | Hand-Stubs der Backend-Meldung mit dem alten Text `"…"`, während `backend-error.test.ts` angepasst wurde. Sie pinnen keine Formulierung, entsprechen aber nicht mehr dem, was das Backend sendet |
| C-4 | Nit | backend/src/services/formula.service.ts:412 | Warnung «Die Formel ergibt für die ${label} null.» hat denselben Fehler wie `backend_formula_sample_negative` («für die Kleine Wohnung»). Erreicht die Oberfläche nicht (`/validate-formula` hat keinen Aufrufer in `src/`), gepinnt in `backend/src/__tests__/formula.service.test.ts:242` |
| C-5 | Nit | messages/en.json:611 (ebenso fr, it :611) | V-6 nur in de umgesetzt: en «fixed-term contract», fr «contrat de durée déterminée», it «contratto a tempo determinato» ohne «rental»/«de bail»/«di locazione», während `contracts_availability_blocked` sie in allen vier Sprachen jetzt hat |
| C-6 | Nit | src/lib/statement-wizard.ts:106 | ponytail `yagni:` `joined` hat nach dem Umbau nur noch einen Aufrufer (`stockText`); die generische Signatur könnte in `stockText` aufgehen (`missingDays.map(...).reduce((first, second) => m.statements_stock_dates_and({ first, second }))`). net: -2 Zeilen möglich |

Keine Blocker, keine Majors.

Pflichtpunkte geprüft:
- Szenario: keines nötig, «No scenario: wording of existing texts only» steht im Issue und im Plan; geänderte E2E-Features sind nur angepasste Pins, kein `@wip`.
- Neue Bildschirme/Zustände: keine.
- Jeder geänderte Text in allen vier `messages/*.json`; entfernte Schlüssel `statements_part_month`, `statements_list_and` in allen vier entfernt und ohne verbleibende Verwendung (grep).
- E2E-Schichten: Schritte rufen weiter nur Questions/Tasks (`apartment-form.steps.ts:76`, `categories.steps.ts:134`).
- Nichts Fremdes im Diff (Plan, Fach-Review-Bericht gehören zum Workflow).
- ponytail-review: Ersatz der eigenen Aufzählung durch `Intl.ListFormat` kürzt den Code; einzig C-6.

## Nicht bestätigt

- `bunx vitest run` (2814 bestanden), `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `cd backend && bun test` (formula-codes, category-admin.pg, distribution-key-admin.pg, heating-profile-admin.pg): vom Aufrufer gemeldet. Selbst wiederholt: `bunx vitest run src/__tests__/i18n.test.ts src/__tests__/statement-wizard.test.ts src/__tests__/statements-i18n.test.ts src/lib/utils/__tests__/contract-availability.test.ts`: 78 bestanden.
- E2E der betroffenen Features: läuft beim Aufrufer, Ergebnis nicht gesehen. Ob der Schritt «sieht … die Fehlermeldung» exakt oder per Teilstring vergleicht, habe ich nicht nachgelesen; angepasst sind die Pins in jedem Fall.
- Rot der neuen Tests nur durch Lesen beurteilt (Regeltests und Monatsliste schlagen auf 74f223f offensichtlich fehl), nicht auf der Basis ausgeführt.
- Die Zurückweisung von `statements_error_fee` muss laut Issue «in this issue» begründet werden; ein Kommentar in #348 existiert noch nicht (Schritt des Pull Requests).
- Ausgabe von `Intl.ListFormat` für `en-CH`/`fr-CH`/`it-CH` nur aus dem Fach-Review (V-4) übernommen, nicht selbst ausgeführt.
- fr/it-Formulierungen nicht muttersprachlich geprüft (#342).
