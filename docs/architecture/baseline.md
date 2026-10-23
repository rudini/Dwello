# Architektur-Baseline (Phase 0): Change Amplification

Stand: 23.10.2026, Basis `origin/main` d4d508cc2, Fenster ab 23.04.2026. Alle Zahlen stammen aus `tools/arch-baseline/run.sh` (Rohdaten: `tools/arch-baseline/out/*.csv`, alle Tabellen dieses Reports generiert in `out/report-tables.md`). Markierung jeder Aussage: **[gemessen]** (Skriptausgabe), **[abgeleitet]** (Schluss aus Messwerten oder gelesenem Diff), **[Vermutung]** (nicht belegt).

## 1. Zusammenfassung

1. Ein Feature (`feat`, 113 Einheiten) ändert im Median **38 Dateien** (P90 86): **12 Produktiv-, 16 Test-, 12 sonstige** (Docs/Prozess) in **7 Produktivmodulen** und **3 Produktivschichten** (P90 5). Ein Fix (150): Median 9 Dateien, 2 davon Produktivcode. [gemessen]
2. Von allen Dateiänderungen in Features sind nur **36,9 % Produktivcode**; 38,1 % sind Tests, 25,0 % Docs/Prozess. 92,9 % der Features ändern Prozessdateien (Median 9, z. B. `docs/reviews`, `implementation_plan.md`). [gemessen]
3. Die **Top-10 der gekoppelten Dateipaare** gehören alle zu einem Bildschirm-Register, das in 3 Dateien von Hand gepflegt wird (`screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`; Kopplungsgrad bis 0,98). Alle 87 Bildschirme stehen in allen drei. [gemessen]
4. Von 281 Kopplungspaaren über Schwelle sind nur **27 rein produktiv**; 167 sind schichtübergreifend **ohne Import-Beziehung**. [gemessen]
5. FE/BFF importieren **0** Backend-Dateien; `src/lib/types.ts` (398 LOC) spiegelt das DB-Schema von Hand. Ein DB-Feld wird im Median in **6 Produktivdateien** ausserhalb der DB deklariert (P90 19); 13 Status-/Wertelisten stehen identisch in mehreren Schichten. [gemessen]
6. Textuelle Duplikation ist niedrig (0,87 %, keine schichtübergreifende Klon-Gruppe), Import-Zyklen zur Laufzeit 0, Deepcheck 0 flache Module: Die Guardrails wirken. Die Amplifikation entsteht durch **semantisch dupliziertes Wissen**, nicht durch kopierten Code. [gemessen/abgeleitet]
7. Die Hotspots (Änderungen × Komplexität) liegen alle in der Abrechnungs-Kette über 3 Schichten (`pdf.service`, `statement.service`, `statement-pdf.service`, BFF `statement-generation`, FE `statement-wizard`). [gemessen]

## 2. Methode und Ausschlüsse

**Datenbasis.** Der Clone war flach (312 Commits, 3 Tage); die Analyse hat die volle Historie nachgeladen (`git fetch --unshallow`, 2723 Commits ab 23.01.2026). 96 % davon fallen in den Oktober 2026 (Jan 54, Feb 39, Apr 4, Sep 23, Okt 2603 Commits). Das 6-Monats-Fenster umfasst 1937 Nicht-Merge-Commits. [gemessen]

**Feature-Einheit (Schritt 2).** Gewählt: **ein PR, wie er auf `main` landet** = Merge-Commit auf der First-Parent-Linie von `main`; Diff = `first-parent..merge` (Nettoänderung). Titel = PR-Titel aus dem Merge-Body, Typ aus dem Conventional-Commit-Präfix. Direkte Commits auf `main` (148) zählen je als eigene Einheit. Grund: PR-Titel tragen fast immer einen Conventional-Commit-Typ, Issue-Nummern stehen nur in 27 PR-Titeln, Branch-Namen (`ccr-…`) werden über mehrere PRs wiederverwendet. 30 Einheiten ohne (oder mit nicht standardisiertem) Typ habe ich anhand des Titels eingeordnet: Vorschlag in `tools/arch-baseline/unit-types.json`, korrigierbar. Alternative: Issue-Nummer (zu selten) oder `@wip`-Szenario-Namen (nicht maschinell an Commits gebunden). Für M2 gibt es zusätzlich die Commit-Sicht. [gemessen/abgeleitet]

Ergebnis: 408 Einheiten (feat 113, fix 150, docs 80, chore 65). 29 der 113 feat-PRs enthalten ≥ 2 `feat`-Commits (Verteilung: 0: 2, 1: 82, 2–3: 21, ≥ 4: 8); darum zeigt M1 zusätzlich die Gruppe „feat mit höchstens 1 feat-Commit“. [gemessen]

**Schichten.** `tools/arch-baseline/layers.json` (Regex → Schicht, Art `prod`/`test`/`other`, Modul; erste Regel gewinnt). Zuordnungsentscheide, die du prüfen solltest:
- BFF = `src/routes/{api,auth}/**`, `src/lib/server/**`, `hooks.server.ts`, alle `+page.server.ts`/`+layout.server.ts`/`+server.ts`.
- Shared/Contracts = `src/lib/types.ts` (prod) und `tests/contracts/*.json` (API-Vertrags-Fixtures, Art test).
- `messages/*.json` = FE (Modul `fe:i18n`); `backend/src/db/**` und `backend/migrations/**` = DB.
- Zusätzliche Schichten neben den vorgegebenen: Tests-Unit, Tests-Acceptance (`tests/e2e`, `tests/a11y`), Docs, **Process** (`docs/reviews`, `docs/archive`, `docs/design/personas`, `implementation_plan.md`, `CLAUDE.md`, `.claude/`), Marketing.
- Modul = Route-Bereich (`fe:routes/contracts`, `bff:load/contracts`, `bff:api/…`), sonst Datei (`be:services/contract`, `bff:server/tenant`, `fe:lib/contract-form`) oder Ordner (`e2e:steps`, `fe:ui`).

**Ausschlüsse** [gemessen, `out/excluded*.csv`]:

| Ausschluss | Umfang |
|---|---|
| Binärdateien (Screenshots, Fonts, PDFs) | 145 Dateien |
| Lockfiles (`bun.lock`, `backend/bun.lock`) | 2 |
| Generierte Tool-Baselines/Fixtures (`.deepcheck-baseline.json`, fallow-Testfixtures) | 4 |
| Daten-Dump `backend/demo/demo-data.sql` | 1 |
| Diese Analyse selbst (`tools/arch-baseline/`, dieser Report) | 58 |
| Generiert, nicht eingecheckt: `src/lib/paraglide/`, `.svelte-kit/`, `dist/`, `build/`, Snapshots, Drizzle-`meta/` | Muster (0 Treffer) |
| Whitespace-only-Änderungen (`git diff -w --ignore-blank-lines`) | pro Datei |
| Formatierungs-Commits (Betreff `…: format …`, „with Prettier“) | 1 PR (#19), 5 Commits |
| Sync-Merges auf `main` ohne PR (würden andere Einheiten doppelt zählen) | 2 |

Für M2 zusätzlich: nur Dateien der Art prod/test; die vier `messages/*.json` als **eine** logische Datei (sie ändern sich per Regel immer gemeinsam; unzusammengefasst: `m2-file-pairs-units-raw.csv`); Transaktionen mit > 50 Dateien ausgelassen (23 von 311).

## 3. Metriken

### Repo-Landkarte (Schritt 1) [gemessen]

| Schicht | Art | Dateien | LOC (nicht leer) | Module |
|---|---|---|---|---|
| Process | other | 1551 | 73 713 | 9 |
| Tests-Unit | test | 295 | 48 676 | 12 |
| FE | prod | 297 | 30 175 | 50 |
| Tests-Acceptance | test | 237 | 22 112 | 12 |
| Backend | prod | 69 | 13 077 | 66 |
| BFF | prod | 122 | 6 877 | 64 |
| Docs | other | 30 | 5 507 | 9 |
| Tooling | other | 83 | 5 176 | 15 |
| DB | prod | 41 | 1 574 | 5 |
| Shared/Contracts | test / prod | 76 / 1 | 891 / 398 | 1 / 1 |

Prozessartefakte sind grösser als der gesamte Produktivcode (73 713 vs. 52 101 LOC inkl. i18n-JSON). [gemessen]

**Import-Graph** (1007 Dateien, 3247 Kanten; `imports-file.csv`, `imports-module.csv`, `imports-layer.csv`): Keine Kante FE/BFF → Backend/DB; die Schichtgrenze BFF↔Backend ist HTTP, die zwischen `+page.server.ts` und `+page.svelte` läuft über generierte `./$types` (vom Graphen nicht erfasst). Kanten FE → Shared 85, BFF → Shared 23, BFF → FE 60, FE → BFF 17. [gemessen]

**Zyklen:** 1 Dateizyklus (`pdf.service.ts` ↔ `reminder-letter.ts`), nur über einen `import type`, also kein Laufzeitzyklus; fallow meldet 0. Auf Modulebene 3 Zyklen, davon 2 nur durch Ordner-Granularität (`fe:lib/navigation`↔`fe:ui`, `e2e:questions`↔`e2e:tasks`). [gemessen]

### M1 Änderungsumfang pro Feature [gemessen, `m1-*.csv`]

| Metrik | feat Median | feat P90 | feat Max | feat (1 feat-Commit) Median | P90 | fix Median | fix P90 |
|---|---|---|---|---|---|---|---|
| Dateien gesamt | 38 | 86 | 518 | 34 | 71 | 9 | 27 |
| Produktivdateien | 12 | 31 | 294 | 9,5 | 25 | 2 | 9 |
| Testdateien | 16 | 38 | 161 | 11,5 | 32 | 3 | 13 |
| sonstige (Docs/Prozess/Tooling) | 12 | 24 | 63 | 9 | 16 | 3 | 11 |
| Produktivmodule | 7 | 20 | 88 | 5 | 17 | 2 | 6 |
| Testmodule | 7 | 11 | 12 | 7 | 10 | 2 | 7 |
| Produktivschichten (FE, BFF, Backend, DB, Shared) | 3 | 5 | 5 | 2 | 5 | 1 | 3 |
| geänderte Zeilen prod | 182 | 797 | 20 298 | 106,5 | 485 | 14,5 | 105 |
| geänderte Zeilen test | 265 | 1190 | 8 904 | 203 | 735 | 40,5 | 188 |

Dateien pro Schicht und Einheit:

| Schicht | feat Median | feat P90 | fix Median | fix P90 |
|---|---|---|---|---|
| FE (inkl. 4 i18n-Dateien) | 8 | 19 | 0 | 7 |
| BFF | 1 | 7 | 0 | 2 |
| Backend | 2 | 7 | 0 | 2 |
| DB | 0 | 2 | 0 | 1 |
| Shared/Contracts | 1 | 4 | 0 | 1 |
| Tests-Unit | 5 | 17 | 1 | 4 |
| Tests-Acceptance | 9 | 19 | 1 | 8 |
| Process | 9 | 17 | 3 | 8 |
| Docs | 2 | 6 | 0 | 2 |

Anteile der Einheiten: feat mit ≥ 3 Produktivschichten 54 %, mit i18n 67,3 %, mit Acceptance-Tests 88,5 %, mit Prozessdateien 92,9 % (fix: 11,3 / 22 / 50,7 / 82 %).

Module, die die meisten Features ändern (Auszug `m1-modules-feat.csv`): `e2e:features` 85 %, `fe-test:unit` 84,1 %, `e2e:steps` 82,3 %, `docs/design` und `docs/reviews` je 77,9 %, `fe:i18n` 67,3 %, `e2e:tasks` 67,3 %, `be-test:unit` 64,6 %, `e2e:questions` 64,6 %, `e2e:targets` 58,4 %, `contracts` (Fixtures) 46,9 %, `tests:a11y` 45,1 %; erstes Produktivmodul ausser i18n: `fe:routes/statements` 34,5 %, `shared:types` 32,7 %, `db:schema` 31 %.

**Top 10 Features** (Dateien prod/test/sonst., Prod-Module, Prod-Schichten):

| PR | Datum | Titel | Commits | prod | test | sonst. | Module | Schichten |
|---|---|---|---|---|---|---|---|---|
| #32 | 10.10. | new design system and guided UI (redesign) | 105 | 294 | 161 | 63 | 56 | 3 |
| #48 | 12.10. | UI in German, French, Italian, English | 52 | 251 | 38 | 58 | 88 | 4 |
| #39 | 11.10. | Swiss statement PDF, invoice check, date field | 37 | 101 | 114 | 30 | 55 | 5 |
| #539 | 20.10. | categories and required Verteilschlüssel | 35 | 38 | 64 | 20 | 22 | 5 |
| #361 | 17.10. | Korrespondenzadresse with country, old-address warning, LI IBAN | 25 | 37 | 55 | 27 | 29 | 5 |
| #527 | 20.10. | carry over Saldo below CHF 5.00 | 19 | 33 | 47 | 24 | 20 | 5 |
| #238 | 16.10. | create invoices from uploaded files | 19 | 48 | 32 | 38 | 23 | 5 |
| #392 | 17.10. | agreed Nebenkosten per Mietvertrag | 21 | 38 | 39 | 22 | 22 | 5 |
| #559 | 20.10. | outdated statements, period filter, Tankbestand | 17 | 31 | 44 | 13 | 23 | 5 |
| #54 | 12.10. | upcoming end, statements after an end change | 23 | 34 | 39 | 11 | 21 | 4 |

### M2 Change Coupling [gemessen, `m2-*.csv`]

Kopplungsgrad = gemeinsame Änderungen / Änderungen an A oder B (= n_AB / (n_A + n_B − n_AB)); zusätzlich gerichtete Konfidenz n_AB/n_A in den CSVs. Schwellen wie vorgegeben **≥ 5 gemeinsam und ≥ 30 %**, nicht angepasst: Sie liefern 281 Dateipaare, genug für eine Auswahl ohne Rauschen.

| Sicht | Transaktionen | ausgelassen (> 50 Dateien) | Paare über Schwelle |
|---|---|---|---|
| Datei / PR-Einheit (primär) | 311 | 23 | 281 |
| Datei / Commit | 1223 | 7 | 243 |
| Modul / PR-Einheit | 311 | 3 | 101 |

Primärsicht: gleiche Schicht ohne Import 59, gleiche Schicht mit Import 30, schichtübergreifend ohne Import 167, schichtübergreifend mit Import 25. Nach Art: test–test 132, prod–test 122, **prod–prod 27**.

**Top 20 Dateipaare** (Primärsicht; Beispiel-Commit = kleinster Commit, der beide ändert):

| # | A | B | gem. | Grad | Schicht | Import | Beispiel |
|---|---|---|---|---|---|---|---|
| 1 | e2e/features/accessibility.feature | e2e/features/sprachen-bildschirme.feature | 43 | 0,977 | gleich | nein | 0049589600 |
| 2 | tests/a11y/screens.json | e2e/features/accessibility.feature | 43 | 0,827 | gleich | nein | 0049589600 |
| 3 | tests/a11y/screens.json | e2e/features/sprachen-bildschirme.feature | 42 | 0,808 | gleich | nein | 0049589600 |
| 4 | tests/a11y/screens.json | e2e/tasks/accessibility.ts | 40 | 0,656 | gleich | nein | 4d5e72f205 |
| 5 | e2e/features/sprachen-bildschirme.feature | e2e/tasks/accessibility.ts | 37 | 0,661 | gleich | nein | 4d5e72f205 |
| 6 | e2e/features/accessibility.feature | e2e/tasks/accessibility.ts | 37 | 0,649 | gleich | nein | 4d5e72f205 |
| 7 | messages/{de,fr,it,en}.json | tests/a11y/screens.json | 44 | 0,44 | über | nein | 6524f3ad2c |
| 8 | messages/{de,fr,it,en}.json | e2e/features/sprachen-bildschirme.feature | 40 | 0,417 | über | nein | 6524f3ad2c |
| 9 | messages/{de,fr,it,en}.json | e2e/features/accessibility.feature | 40 | 0,412 | über | nein | 6524f3ad2c |
| 10 | messages/{de,fr,it,en}.json | e2e/tasks/accessibility.ts | 39 | 0,375 | über | nein | 6524f3ad2c |
| 11 | backend/…/api-contracts.pg.test.ts | tests/contracts/README.md | 22 | 0,595 | über | nein | 9945733f9f |
| 12 | src/__tests__/contract-edit.dom.test.ts | routes/contracts/ContractForm.svelte | 16 | 0,727 | über | nein | 0e3db29728 |
| 13 | backend/…/statement-pdf-render.test.ts | backend/services/pdf.service.ts | 19 | 0,594 | über | ja | e214aa7a7e |
| 14 | e2e/questions/contract-form.ts | e2e/steps/contract-form.steps.ts | 16 | 0,696 | gleich | ja | ac890cc09f |
| 15 | e2e/features/statement-detail.feature | e2e/steps/statement-detail.steps.ts | 19 | 0,559 | gleich | nein | c02c420507 |
| 16 | e2e/features/contract-edit.feature | e2e/steps/contract-form.steps.ts | 16 | 0,593 | gleich | nein | 80df615e9f |
| 17 | e2e/features/statement-generate.feature | e2e/steps/statement-generate.steps.ts | 16 | 0,593 | gleich | nein | 0e382240de |
| 18 | e2e/questions/contract-form.ts | e2e/targets/contract-form.ts | 13 | 0,722 | gleich | ja | ac890cc09f |
| 19 | backend/routes/contracts.ts | backend/services/contract.service.ts | 12 | 0,75 | gleich | ja | 64d2b16fa8 |
| 20 | src/__tests__/contract-form.test.ts | src/lib/contract-form.ts | 11 | 0,786 | über | ja | d2de64cc54 |

(Testdateien zählen hier als eigene Schicht, darum ist z. B. Test ↔ Komponente „über“.)

**Rein produktive Paare** (alle 27 in `s4-prod-pairs.csv`, Auszug): `be/routes/contracts` ↔ `contract.service` 12/0,75 (Import ja); `pdf.service` ↔ `statement-pdf.service` 15/0,405 (ja); `db/schema.ts` ↔ `calculation.service` 14/0,35 (ja); **`db/schema.ts` ↔ `src/lib/types.ts` 14/0,311 (Import nein)**; `ContractForm.svelte` ↔ `ContractWizard.svelte` 10/0,435 (nein); `be/routes/contracts` ↔ `routes/contracts/[id]/+page.server.ts` 8/0,471 (nein); `contract.service` ↔ `src/lib/contract-form.ts` 7/0,333 (nein). 11 der 27 Paare sind schichtübergreifend ohne Import, 9 davon im Bereich Mietvertrag.

**Produktive Modulpaare** (Auszug `s4-prod-module-pairs.csv`): `db:migrations`↔`db:schema` 40/0,714; `fe:i18n`↔`shared:types` 36/0,316; `db:schema`↔`shared:types` 26/0,426 (kein Import); `be:routes/contracts`↔`be:services/contract` 15/0,652; `be:services/contract`↔`bff:load/contracts` 16/0,571 (kein Import); `bff:load/contracts`↔`fe:routes/contracts` 20/0,392; `bff:load/statements`↔`fe:routes/statements` 24/0,387.

Die Commit-Sicht bestätigt das Bild: Platz 1–6 sind dieselben Register-Paare (bis 95 gemeinsame Commits).

### M3 Hotspots [gemessen, `m3-hotspots.csv`]

Änderungshäufigkeit = Nicht-Merge-Commits im Fenster; Komplexität aus `fallow health` (Summe zyklomatische Komplexität je Datei, `crap_max` = höchster CRAP-Wert einer Funktion). **Rangfolge nach Commits × zyklomatischer Summe**, weil die CRAP-Werte nur geschätzt sind: fallow rechnet mit `coverage_model: static_estimated`, und 46 Dateien haben exakt `crap_max` 26,5 (Sättigung). Der CRAP-Rang steht daneben.

| Rang | CRAP-Rang | Datei | Schicht | Commits | PRs | zykl. Σ | crap_max | Zeilen | Fan-in |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | backend/src/services/pdf.service.ts | Backend | 82 | 40 | 304 | 26,5 | 1460 | 7 |
| 2 | 3 | backend/src/services/statement.service.ts | Backend | 69 | 36 | 191 | 26,5 | 1031 | 23 |
| 3 | 5 | backend/src/services/statement-pdf.service.ts | Backend | 52 | 30 | 164 | 26,5 | 385 | 9 |
| 4 | 11 | src/lib/server/statement-generation.ts | BFF | 44 | 23 | 152 | 26,5 | 459 | 6 |
| 5 | 10 | src/lib/statement-wizard.ts | FE | 45 | 24 | 128 | 26,5 | 402 | 19 |
| 6 | 19 | backend/src/services/calculation.service.ts | Backend | 43 | 27 | 104 | 17,6 | 512 | 4 |
| 7 | 22 | src/routes/contracts/[id]/+page.server.ts | BFF | 38 | 21 | 115 | 17,6 | 389 | 1 |
| 8 | 16 | backend/src/services/contract.service.ts | Backend | 37 | 23 | 88 | 21,8 | 529 | 17 |
| 9 | 15 | src/lib/server/statement.ts | BFF | 40 | 24 | 81 | 21,8 | 232 | 10 |
| 10 | 6 | src/routes/contracts/ContractForm.svelte | FE | 51 | 26 | 63 | 26,5 | 395 | 1 |
| 11 | 55 | src/lib/contract-form.ts | FE | 27 | 20 | 112 | 12,5 | 292 | 13 |
| 12 | 219 | backend/src/db/schema.ts | DB | 61 | 48 | 45 | 1,2 | 688 | 81 |
| 13 | 46 | backend/src/services/invoice.service.ts | Backend | 24 | 17 | 110 | 17,6 | 634 | 8 |
| 14 | 42 | src/routes/dashboard/+page.server.ts | BFF | 33 | 21 | 75 | 13,8 | 246 | 5 |
| 15 | 38 | backend/src/services/invoice-completeness.service.ts | Backend | 18 | 7 | 130 | 26,5 | 363 | 3 |

(Die Ränge in der Datei zählen Testdateien mit; diese Tabelle zeigt nur Produktivcode.) Die heissesten Testdateien sind heisser als jeder Produktivcode: `tests/e2e/tasks/accessibility.ts` 104 Commits, zykl. Σ 268; `statement-pages.dom.test.ts` 97/251; `statement-wizard.dom.test.ts` 82/206; `tests/e2e/fixtures/backend.ts` 92/154.

Abgeleitet: alle Top-10 gehören zur Abrechnung bzw. zum Mietvertrag und verteilen sich auf Backend, BFF und FE. Zwei BFF-Dateien (`statement-generation.ts` zykl. Σ 152, `contracts/[id]/+page.server.ts` 115) sind komplexer als die meisten Backend-Services, obwohl laut `CLAUDE.md` die Fachlogik im Backend liegen soll. [abgeleitet]

### M4 Streuung von Wissen [gemessen, `m4-*.csv`; Heuristik, siehe Grenzen]

**Kein gemeinsamer Code zwischen FE/BFF und Backend:** 0 Importe; `src/lib/types.ts` beginnt mit „Core Entity Types – Match backend schema (camelCase)“. [gemessen]

**Entitäts-Spiegel:** Dateien ausserhalb der DB-Schicht, die mindestens die Hälfte (min. 3) der spezifischen Felder einer Tabelle als Schlüssel deklarieren (Typ-Property, Objektliteral, Validierungsschema, Mapper, Drizzle-Projektion):

| Tabelle | spez. Felder | Dateien | FE | BFF | Backend | types.ts | Vertrags-Fixtures |
|---|---|---|---|---|---|---|---|
| apartments | 5 | 21 | 2 | 8 | 9 | 1 | 1 |
| distributionKeys | 5 | 21 | 3 | 4 | 7 | 1 | 6 |
| tenants | 9 | 18 | 0 | 4 | 10 | 1 | 3 |
| categories | 7 | 18 | 1 | 3 | 7 | 1 | 6 |
| buildings | 10 | 9 | 1 | 4 | 1 | 1 | 2 |
| rentalContracts | 17 | 9 | 2 | 1 | 3 | 1 | 2 |
| utilityStatements | 35 | 9 | 0 | 1 | 4 | 1 | 3 |
| invoices | 16 | 8 | 3 | 1 | 2 | 1 | 1 |

**Deklarationsorte pro DB-Feld:** 125 Felder (nur einer Tabelle eigen, nicht generisch): Median **6** Produktivdateien ausserhalb der DB, P90 19, Max 59 (`apartments.number`). Beispiel `buildings.noTank`: 6 Dateien (`be/routes/buildings.ts`, `invoice-completeness.service.ts`, `lib/server/building-form.ts`, `lib/server/building.ts`, `lib/types.ts`, `BuildingForm.svelte`).

**Typen pro Entität:** Contract 30 Typdeklarationen (17 Namen, 19 Dateien, in allen 5 Produktivschichten), Statement 29 (20 Namen, 16 Dateien), Invoice 18, Building/Apartment/Tenant je 13. Gleicher Name in mehreren Dateien: `Apartment`, `Tenant` je 4 Dateien in DB, Backend, Shared und BFF (`routes/contracts/new/+page.server.ts`); `Period` 5 Dateien in BFF und Backend; `RefusedStatement` 4 Dateien in FE und BFF.

**Identische Wertelisten in mehreren Dateien** (21 Sets, 13 schichtübergreifend), u. a.:

| Werte | Dateien | Schichten |
|---|---|---|
| de \| en \| fr \| it | 6 | BFF, Backend, Shared |
| custom \| predefined | 6 | Backend, FE, Shared |
| local \| none \| provider (KI) | 4 | BFF, Backend, DB |
| active \| ended \| future (Vertragsstatus) | 4 | BFF, Backend, Shared |
| occupied \| relet \| reserved \| vacant (Wohnungsstatus) | 3 | Backend, Shared |
| email \| letter | 3 | Backend, FE, Shared |
| consumption \| deviation \| gap \| missing \| new \| stock \| tank (Rechnungsprüfung) | 2 | Backend, FE |
| draft \| overdue \| paid \| sent und overdue \| paid \| sent \| settled | je 2 | Backend (zwei Varianten des Abrechnungsstatus) |

**Validierungsregeln:** identische Regex in mehreren Dateien: ISO-Datum `^\d{4}-\d{2}-\d{2}$` in 7 BFF/FE-Dateien; Betrag `^\d+(\.\d{1,2})?$` in Backend, BFF und FE; PLZ `^\d{4}$` in 3 BFF-Dateien; UUID und E-Mail je in BFF und Backend. Validierungs-Schlüsselwörter (`t.String`, `maxLength`, `required` …): Backend 412 in 26 Dateien, FE 23 in 14, BFF 8 in 5.

**Textuelle Klone** (fallow dupes): 22 Gruppen, 585 Zeilen, 0,87 %, keine über Schichten.

## 4. Klassifizierte Kandidaten (Vorschlag für das Review)

Grundlage: gelesene Diffs der Beispiel-Commits (alles **[abgeleitet]**; die Einordnung ist ein Vorschlag, keine Entscheidung).

| Kandidat | Vorschlag | Begründung mit Beispiel |
|---|---|---|
| Paare 1–6: Bildschirm-Register `screens.json` / `accessibility.feature` / `sprachen-bildschirme.feature` / `tasks/accessibility.ts` | **akzidentell** | 0049589600 benennt den Zustand `list-scoped` → `default` mit identischer Änderung in allen 3 Dateien. Dasselbe Wissen („welche Bildschirme und Zustände gibt es“) steht 3- bis 4-mal; alle 87 Bildschirme stehen in allen drei. |
| Paare 7–10: `messages/*` ↔ Register | **gemischt**: Texte essenziell (4 Sprachen sind Anforderung), Kopplung an das Register akzidentell | 6524f3ad2c: französische Guillemets in `fr.json` und zugleich Zustand in den 3 Registerdateien nachgezogen. |
| Paar 11: `api-contracts.pg.test.ts` ↔ `tests/contracts/README.md` | **akzidentell** | 9945733f9f: neuer Vertragstest plus eine README-Zeile, die dieselbe Fixture noch einmal beschreibt (README = handgepflegter Index, eine Tabellenzeile je Fixture). |
| Paar 12: `contract-edit.dom.test` ↔ `ContractForm.svelte` | **überwiegend essenziell** | 0e3db29728 entfernt Bedingung und Test gemeinsam; der Kommentar zeigt aber, dass das FE eine Backend-Invariante kennt („a saved notice always has an end (backend `checkNotice`)“) → akzidenteller Anteil. |
| Paar 13: `statement-pdf-render.test` ↔ `pdf.service` | **essenziell** | e214aa7a7e: Regel „Stockwerk nur einmal drucken“ plus ihr Test. |
| Paare 14, 18: E2E `questions` ↔ `steps`/`targets` | **akzidentell** (Test-Zeremonie) | ac890cc09f: ein neuer Hinweis braucht ein Target (`advance-payment-notice`), eine Question (`noAdvanceNoticeText`) und einen Step, in 3 Dateien. |
| Paare 15–17: `.feature` ↔ `.steps.ts` | **essenziell** (ATDD by design) | c02c420507, 80df615e9f, 0e382240de: Szenario und Glue-Code. |
| Paar 19: `be/routes/contracts` ↔ `contract.service` | **Grenzfall, eher akzidentell** | 64d2b16fa8: der neue Filter `search` wird im Routen-Schema deklariert und 1:1 durchgereicht (`search: query.search`). Validierung an der Grenze ist legitim; die Eingabeform steht aber zweimal. |
| Paar 20: `contract-form.test` ↔ `contract-form.ts` | **essenziell** | d2de64cc54: Verhalten und Unit-Test gemeinsam. |
| Feature PR#32 (Redesign) | **essenziell, einmalig** | Querschnitts-Umbau auf Tokens/Komponenten (269 FE-Dateien). Von 7497 geänderten Testzeilen betreffen nur 805 Selektoren/Texte; der Rest sind umgeschriebene Tests. Nicht repräsentativ. |
| Feature PR#48 (i18n) | **essenziell, einmalig** | Einführung von vier Sprachen, 251 Produktivdateien. Nicht repräsentativ; begründet aber die dauerhaften 4 i18n-Dateien pro Text. |
| Feature PR#39 | **Messartefakt** | Bündelt 6 `feat`-Commits (PDF nach Schweizer Norm, Datumsfeld, Rechnungsprüfung, Heizkosten …); die Grösse kommt aus dem PR-Schnitt, nicht aus einem Feature. |
| Feature PR#539 (Kategorien) | **gemischt** | Essenziell: Migration, UI, Regeln. Akzidentell: das neue Feld `allocableInvoiceCount` wird von Hand im Backend-Typ, im SQL, im BFF-Typ `CategoryWithUsage`, im BFF-Mapper (`Number(c.allocableInvoiceCount) \|\| 0`) und in `tests/contracts/category.json` deklariert. 64 Test- vs. 38 Produktivdateien. |
| Feature PR#361 (Korrespondenzadresse) | **gemischt** | `country` in 6 Orten von Hand: `schema.ts`, Routen-Validierung `t.String({ pattern: '^[A-Z]{2}$' })`, Service-Projektion, BFF-Formular (`countryCodes`), BFF-Mapper, `types.ts`; dazu `oldAddress` in 4 Vertrags-Fixtures, weil jede Antwort, die einen Mieter einbettet, eine eigene Fixture hat. Essenziell: Migration, Formularfeld, PDF-Adresse. |

## 5. Hypothesen

**H1 – Kein gemeinsamer Vertrag zwischen den Schichten: Entitätsformen werden von Hand gespiegelt.**
- Belege: 0 Importe FE/BFF → Backend; `types.ts` „Match backend schema“; `schema.ts` ↔ `types.ts` 14 gemeinsame Änderungen, Grad 0,311, ohne Import; DB-Feld im Median in 6 Produktivdateien deklariert (P90 19); 13 schichtübergreifende identische Wertelisten; 37 von 113 Features ändern `types.ts`, 53 ändern Vertrags-Fixtures (139 Fixture-Änderungen); PR#361 und PR#539 (Abschnitt 4). [gemessen/abgeleitet]
- Widerlegt, wenn: die Deklarationsorte überwiegend eigene Logik oder bewusst abweichende Formen enthalten (BFF als Anti-Corruption-Layer) und ein generierter Vertrag die Dateizahl pro Feld nicht senken würde.
- Frage ans Team: Soll der BFF ein eigenes Modell haben, das bewusst vom Backend abweicht, oder soll er die Backend-Antworten nur durchreichen und aufbereiten?

**H2 – Die Amplifikation stammt zu zwei Dritteln aus Test- und Prozessarchitektur, nicht aus dem Produktivcode.**
- Belege: 36,9 % der Dateiänderungen in Features sind Produktivcode; Median 16 Test- vs. 12 Produktivdateien; Screenplay-Kette `features`/`steps`/`tasks`/`questions`/`targets` in 58–85 % der Features; Prozessdateien in 92,9 % (Median 9); `docs/reviews` + Prozess = 1551 Dateien, mehr LOC als der Produktivcode; heisseste Datei im Repo ist ein Test-Task (`accessibility.ts`, 104 Commits). [gemessen]
- Widerlegt, wenn: das Team die Test- und Prozessdateien bewusst als Nebenprodukt akzeptiert (Kosten tragen Agenten) und nur Produktivdateien als „Änderbarkeit“ zählt; dann bleibt Median 12/P90 31 als eigentliche Baseline.
- Frage: Welche E2E-Ebenen (Target, Question, Task) verhindern nachweislich Fehler oder werden wiederverwendet, und welche sind 1:1-Zeremonie pro UI-Element?

**H3 – Duplizierte Register erzeugen die stärkste Kopplung des Repos.**
- Belege: M2-Paare 1–10; 87/87 Bildschirme in allen drei Registern; 45 von 113 Features ändern ≥ 3 Registerdateien (225 Änderungen); Commit 0049589600 (dieselbe Änderung dreimal). Ähnlich `tests/contracts/README.md` (Paar 11). [gemessen/abgeleitet]
- Widerlegt, wenn: die drei Dateien bewusst verschiedene Listen führen müssen (z. B. Sprach-Check nur für eine Teilmenge) oder bereits aus einer Quelle erzeugt werden.
- Frage: Können die Examples-Tabellen von `accessibility.feature` und `sprachen-bildschirme.feature` aus `screens.json` erzeugt werden, ohne die Gherkin-Lesbarkeit für den Product Owner zu verlieren?

**H4 – Module sind nach technischer Schicht geschnitten; die Entscheidungen einer Fachfrage (Abrechnung, Mietvertrag) liegen verteilt in Backend, BFF und FE.**
- Belege: Top-5-Hotspots alle Abrechnung, verteilt auf 3 Schichten; Modulkette Mietvertrag `be:routes/contracts`↔`be:services/contract` 0,652, ↔`bff:load/contracts` 0,571, `bff:load/contracts`↔`fe:routes/contracts` 0,392; 9 der 11 schichtübergreifenden Prod-Paare ohne Import liegen im Mietvertrag; Contract 30 und Statement 29 Typdeklarationen in 19 bzw. 16 Dateien. [gemessen]
- Widerlegt, wenn: die Diffs dieser Ketten überwiegend „neues Feld muss durch alle Schichten“ zeigen (essenziell) und kaum Regeln, die an zwei Orten entschieden werden.
- Frage: Welche Regeln zu Abrechnung und Mietvertrag entscheidet heute nur das Backend, und welche entscheidet das FE/BFF selbst noch einmal (z. B. für Vorschau oder Hinweise)?

**H5 – Fachlogik und Validierung sickern in den BFF (Logik und Orchestrierung vermischt).**
- Belege: BFF-Dateien unter den Hotspots (`statement-generation.ts` zykl. Σ 152, `contracts/[id]/+page.server.ts` 115, `dashboard/+page.server.ts` 75); Validierungs-Regex in BFF (PLZ 3×, Datum 7× BFF/FE, Betrag, E-Mail, UUID doppelt zu Backend); PR#361 entscheidet die PLZ-Regel für CH/LI im BFF-Formular. [gemessen/abgeleitet]
- Widerlegt, wenn: die BFF-Komplexität beim Lesen überwiegend Darstellungs-Mapping und Fehlerbehandlung ist, nicht fachliche Entscheidungen.
- Frage: Darf der BFF fachliche Entscheidungen treffen (z. B. Vorschau-Prüfungen der Abrechnung), oder soll er dafür einen Backend-Endpunkt fragen?

## 6. Grenzen der Analyse

- **Kurze Historie:** 96 % der Commits liegen in 23 Tagen (Oktober 2026), fast ausschliesslich agentische Entwicklung. Die Werte beschreiben diese Phase; Trends über Monate sind nicht messbar.
- **PR ≠ Feature:** 29 von 113 feat-PRs bündeln mehrere Features; die Gruppe „1 feat-Commit“ zeigt, dass die Mediane dadurch um 4 Dateien (38 → 34) sinken. Der Netto-Diff verbirgt, was innerhalb eines PRs geändert und wieder zurückgenommen wurde.
- **Typ-Zuordnung:** 30 Einheiten ohne Typ habe ich aus dem Titel eingeordnet (`unit-types.json`); 148 direkte Commits auf `main` zählen als eigene Einheiten.
- **Schichtzuordnung** ist mein Vorschlag (`layers.json`), z. B. `types.ts` als Shared, `+page.server.ts` als BFF, Vertrags-Fixtures als Shared/Test.
- **Import-Graph** per Regex: dynamische Pfade, `./$types` (SvelteKit) und HTTP-Aufrufe sind unsichtbar. „Import: nein“ zwischen BFF und Backend oder zwischen `+page.server.ts` und `+page.svelte` heisst „keine statische Abhängigkeit“, nicht „unabhängig“. 14 Test-/Tool-Dateien enthalten Import-Strings als Testdaten (nicht auflösbar, ignoriert).
- **CRAP** ist geschätzt (`static_estimated`), nicht gemessen; echte Werte bräuchten Istanbul-Coverage (FE nutzt v8, Backend lcov). Darum Rangfolge nach zyklomatischer Komplexität.
- **M4 ist heuristisch:** Ein Schlüssel `field:` kann Nutzung statt Definition sein (Drizzle-Projektionen zählen als „kennt die Feldliste“); Felder, die in zwei Tabellen vorkommen (z. B. `country`), sind aus der Feld-Statistik ausgenommen; Validierungsregeln in Svelte-Markup (`maxlength=`) sind nur grob erfasst.
- **Selektor-Anteil** der Test-Churn (PR#32) basiert auf einer Schlüsselwortliste und ist eine Untergrenze.
- fallow und Deepcheck lesen das Arbeitsverzeichnis und haben die neuen Skripte unter `tools/arch-baseline/` mitgezählt (+1 Modul, ohne Historie, ohne Einfluss auf M3).
- Die Basis `origin/main` hat sich während der Analyse um 6 Commits bewegt; alle Zahlen stammen aus dem letzten Lauf auf d4d508cc2.

## 7. Vorschlag: messbare Szenarien für Änderbarkeit

| | Ä1 Neues Feld an bestehender Entität | Ä2 Neuer Bildschirm oder Zustand | Ä3 Fachliche Erweiterung |
|---|---|---|---|
| Auslöser | Product Owner verlangt ein neues Attribut (z. B. Land der Korrespondenzadresse) | Neuer Bildschirm oder neuer Zustand eines Bildschirms | Ein Issue mit einer neuen Fachregel, umgesetzt als ein feat-PR |
| Umgebung | Entwicklung, bestehende Entität mit Liste, Detail, Formular | Entwicklung, E2E- und a11y-Prüfung wie heute | Entwicklung nach ATDD-Workflow |
| Reaktion | Feld ist in DB, API, BFF und UI verfügbar und validiert | Bildschirm wird in a11y- und Sprach-Prüfung erfasst | Regel umgesetzt, Szenario grün, Reviews erledigt |
| Messgrösse | Anzahl Produktivdateien ausserhalb der DB, die das Feld von Hand deklarieren (`m4-field-spread.csv`) | Anzahl Dateien, in die die Bildschirm-ID von Hand eingetragen wird (`m4-screen-registry.csv`) | geänderte Produktiv- und Testdateien pro feat-PR mit 1 feat-Commit (`m1-summary.csv`, Gruppe `feat-single`) |
| Ausgangswert | Median **6**, P90 **19** (125 Felder) | Minimum = Median **3** (87/87 Bildschirme); 45/113 Features ändern ≥ 3 Registerdateien | prod Median **9,5** / P90 **25**; test Median **11,5** / P90 **32**; Schichten Median 2 / P90 5 |
| Zielwert | vom Team festzulegen | vom Team festzulegen | vom Team festzulegen |

Alle drei Werte lassen sich nach jedem Refactoring mit `tools/arch-baseline/run.sh` neu messen.

## Wiederholen

```bash
tools/arch-baseline/run.sh          # holt bei flachem Clone die volle Historie, schreibt tools/arch-baseline/out/
ARCH_SINCE=2026-04-23 ARCH_MIN_SHARED=5 ARCH_MIN_DEGREE=0.3 ARCH_MAX_TX=50 tools/arch-baseline/run.sh
```

Skripte: `01-map` (Landkarte), `02-imports` (Graph, Zyklen), `03-history` (Einheiten, Commits), `04-metrics` (M1–M3), `05-knowledge` (M4, Szenario-Baselines), `06-examples` (Schritt 4), `07-tables` (Tabellen dieses Reports). Konfiguration: `layers.json` (Schichten), `unit-types.json` (Typ-Vorschläge).
