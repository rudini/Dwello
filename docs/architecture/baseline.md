# Architektur-Baseline (Phase 0): Change Amplification

Stand: 23.10.2026, Basis `origin/main` d4d508cc2, Fenster ab 23.04.2026. Alle Zahlen stammen aus `tools/arch-baseline/run.sh` (Rohdaten: `tools/arch-baseline/out/*.csv`, alle Tabellen dieses Reports generiert in `out/report-tables.md`). Markierung jeder Aussage: **[gemessen]** (Skriptausgabe), **[abgeleitet]** (Schluss aus Messwerten oder gelesenem Diff), **[Vermutung]** (nicht belegt).

**Entscheid Product Owner (23.10.2026): Änderbarkeit zählt nur Produktivdateien** (Schichten FE inkl. i18n, BFF, Backend, DB, `src/lib/types.ts`). Test-, Doku- und Prozessdateien bleiben als Kontext im Report, sind aber nicht Teil der Messgrössen, der Kopplungsanalyse (M2 primär) und der Szenarien.

**Entscheid Product Owner (23.10.2026): Der BFF trifft keine fachlichen Entscheidungen, und Formularprüfungen gehören ins Backend.** Jede Fachregel und jede fachliche Eingabeprüfung im BFF ist damit eine Abweichung vom Zielbild (Abschnitt 4, H2, Szenario Ä4); offen als Issue #717 (früher H-28).

## 1. Zusammenfassung

1. Ein Feature (`feat`, 113 Einheiten) ändert im Median **12 Produktivdateien** (P90 31) in **7 Produktivmodulen** (P90 20) und **3 Produktivschichten** (P90 5); 54 % der Features berühren ≥ 3 Schichten. Features mit genau einem feat-Commit: Median 9,5, P90 25. Ein Fix (150): Median 2, P90 9. [gemessen]
2. Nur Produktivcode betrachtet: 68 Dateipaare ändern sich überdurchschnittlich oft gemeinsam (≥ 5-mal, Kopplungsgrad ≥ 30 %), **28 davon schichtübergreifend ohne Import-Beziehung**. Die zwei stärksten Paare hängen an `src/lib/types.ts`: mit den i18n-Texten (36 gemeinsame Änderungen) und mit `schema.ts` (26). [gemessen]
3. FE/BFF importieren **0** Backend-Dateien; `types.ts` spiegelt das DB-Schema von Hand. Ein DB-Feld wird im Median in **6 Produktivdateien** ausserhalb der DB deklariert (P90 19). [gemessen]
4. Der BFF trifft entgegen dem Entscheid fachliche Entscheidungen: **9 Status-Vergleiche in 5 BFF-Dateien** und **10 fachliche Prüfregeln in 4 BFF-Dateien** (PLZ, IBAN, E-Mail, Zimmer in halben Schritten …). Die Regel „eine ersetzte Abrechnung zählt nicht“ steht in Backend und BFF getrennt (e6644bea3, 5d6888eb2). [gemessen/abgeleitet]
5. Die zehn grössten Hotspots (Änderungen × Komplexität) liegen alle in Abrechnung und Mietvertrag, verteilt über Backend, BFF und FE; zwei BFF-Dateien sind komplexer als die meisten Backend-Services. [abgeleitet aus M3]
6. Textuelle Duplikation 0,87 %, keine Laufzeit-Zyklen, 0 flache Module (Deepcheck): Die Guardrails wirken. Die Amplifikation entsteht durch **semantisch dupliziertes Wissen**, nicht durch kopierten Code. [gemessen/abgeleitet]

## 2. Methode und Ausschlüsse

**Datenbasis.** Der Clone war flach (nur die jüngsten Tage); die Analyse hat die volle Historie nachgeladen (`git fetch --unshallow`, 2729 Commits ab 23.01.2026; `run.sh` hält den Stand eines flachen Clones künftig in `out/clone.csv` fest). 96 % davon fallen in den Oktober 2026 (Jan 54, Feb 39, Apr 4, Sep 23, Okt 2609 Commits). Das 6-Monats-Fenster umfasst 1937 Nicht-Merge-Commits. [gemessen]

**Feature-Einheit (Schritt 2).** Gewählt: **ein PR, wie er auf `main` landet** = Merge-Commit auf der First-Parent-Linie von `main`; Diff = `first-parent..merge` (Nettoänderung). Titel = PR-Titel aus dem Merge-Body, Typ aus dem Conventional-Commit-Präfix. Direkte Commits auf `main` (148) zählen je als eigene Einheit. Grund: PR-Titel tragen fast immer einen Conventional-Commit-Typ, Issue-Nummern stehen nur in 32 von 408 Einheiten-Titeln (ohne die PR-Nummer am Ende eines Squash-Titels), Branch-Namen (`ccr-…`) werden über mehrere PRs wiederverwendet. 30 Einheiten ohne (oder mit nicht standardisiertem) Typ habe ich anhand des Titels eingeordnet: Vorschlag in `tools/arch-baseline/unit-types.json`, korrigierbar. Alternative: Issue-Nummer (zu selten) oder `@wip`-Szenario-Namen (nicht maschinell an Commits gebunden). Für M2 gibt es zusätzlich die Commit-Sicht. [gemessen/abgeleitet]

Ergebnis: 408 Einheiten (feat 113, fix 150, docs 80, chore 65). 29 der 113 feat-PRs enthalten ≥ 2 `feat`-Commits (Verteilung: 0: 2, 1: 82, 2–3: 21, ≥ 4: 8); darum zeigt M1 zusätzlich die Gruppe „feat mit höchstens 1 feat-Commit“. [gemessen]

**Schichten.** `tools/arch-baseline/layers.json` (Regex → Schicht, Art `prod`/`test`/`other`, Modul; erste Regel gewinnt). Zuordnungsentscheide, die du prüfen solltest:
- BFF = `src/routes/{api,auth}/**`, `src/lib/server/**`, `hooks.server.ts`, alle `+page.server.ts`/`+layout.server.ts`/`+server.ts`.
- Shared/Contracts = `src/lib/types.ts` (Art prod) und `tests/contracts/*.json` (API-Vertrags-Fixtures, Art test, also nicht Teil der Messgrösse).
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
| Diese Analyse selbst (`tools/arch-baseline/`, dieser Report) | Muster (beim Lauf auf `d4d508cc2` noch nicht im Repo) |
| Generiert, nicht eingecheckt: `src/lib/paraglide/`, `.svelte-kit/`, `dist/`, `build/`, Snapshots, Drizzle-`meta/` | Muster (0 Treffer) |
| Whitespace-only-Änderungen (`git diff -w --ignore-blank-lines`) | pro Datei |
| Formatierungs-Commits (Betreff `…: format …`, „with Prettier“) | 1 PR (#19), 5 Commits |
| Sync-Merges auf `main` ohne PR (würden andere Einheiten doppelt zählen) | 2 |

Für M2 (primär): nur Produktivdateien; die vier `messages/*.json` als **eine** logische Datei (sie ändern sich per Regel immer gemeinsam); Transaktionen mit > 50 Produktivdateien ausgelassen (3 von 244).

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
| Marketing | other | 30 | 7 118 | 12 |
| Other (`LICENSE`) | other | 1 | 124 | 1 |

Produktivcode: 52 101 LOC in 530 Dateien (inkl. i18n-JSON). [gemessen]

**Import-Graph** (1007 Dateien, 3247 Kanten, davon 260 nur für Typen; `imports-stats.csv`, `imports-file.csv`, `imports-module.csv`, `imports-layer.csv`): Keine Kante FE/BFF → Backend/DB; die Schichtgrenze BFF↔Backend ist HTTP, die zwischen `+page.server.ts` und `+page.svelte` läuft über generierte `./$types` (vom Graphen nicht erfasst). Kanten FE → Shared 85, BFF → Shared 23, BFF → FE 60, FE → BFF 17. [gemessen]

**Zyklen:** 1 Dateizyklus (`pdf.service.ts` ↔ `reminder-letter.ts`), nur über einen `import type`, also kein Laufzeitzyklus; fallow meldet 0. Auf Modulebene 3 Zyklen, davon 2 nur durch Ordner-Granularität (`fe:lib/navigation`↔`fe:ui`, `e2e:questions`↔`e2e:tasks`). [gemessen]

### M1 Änderungsumfang pro Feature [gemessen, `m1-*.csv`]

Messgrösse (Produktivcode):

| Metrik | feat Median | feat P90 | feat Max | feat (1 feat-Commit) Median | P90 | fix Median | fix P90 |
|---|---|---|---|---|---|---|---|
| Produktivdateien | 12 | 31 | 294 | 9,5 | 25 | 2 | 9 |
| Produktivmodule | 7 | 20 | 88 | 5 | 17 | 2 | 6 |
| Produktivschichten (FE, BFF, Backend, DB, Shared) | 3 | 5 | 5 | 2 | 5 | 1 | 3 |
| geänderte Zeilen prod | 182 | 797 | 20 298 | 106,5 | 485 | 14,5 | 105 |

Produktivdateien pro Schicht und Einheit:

| Schicht | feat Median | feat P90 | fix Median | fix P90 |
|---|---|---|---|---|
| FE (inkl. 4 i18n-Dateien) | 8 | 19 | 0 | 7 |
| BFF | 1 | 7 | 0 | 2 |
| Backend | 2 | 7 | 0 | 2 |
| DB | 0 | 2 | 0 | 1 |
| Shared (`types.ts`) | 1 | 4 | 0 | 1 |

Anteile: feat mit ≥ 3 Produktivschichten 54 %, mit i18n 67,3 % (fix: 11,3 % / 22 %). Häufigste Produktivmodule in Features (`m1-modules-feat.csv`): `fe:i18n` 67,3 %, `fe:routes/statements` 34,5 %, `shared:types` 32,7 %, `db:migrations` und `db:schema` je 31 %, `fe:routes/contracts` 27,4 %, `fe:ui` 23 %, `be:services/statement` 21,2 %, `bff:load/statements` 20,4 %, `be:services/pdf` 19,5 %.

Produktivdateien pro Scope (feat+fix, Scopes mit ≥ 5 Einheiten, `m1-scope-prod.csv`): `statements` 55 Einheiten, Median 7 / P90 27; `contracts` 35, 10 / 26; `invoices` 24, 4 / 25; `tenants` 6, 11,5 / 21; `categories` 5, 9 / 38; ohne Scope 25, 18 / 29.

**Top 10 Features nach Produktivdateien:**

| PR | Datum | Titel | Commits | feat-Commits | prod | Prod-Module | Schichten |
|---|---|---|---|---|---|---|---|
| #32 | 10.10. | new design system and guided UI (redesign) | 96 | 29 | 294 | 56 | 3 |
| #48 | 12.10. | UI in German, French, Italian, English | 51 | 9 | 251 | 88 | 4 |
| #39 | 11.10. | Swiss statement PDF, invoice check, date field | 32 | 6 | 101 | 55 | 5 |
| #238 | 16.10. | create invoices from uploaded files | 15 | 4 | 48 | 23 | 5 |
| #539 | 20.10. | categories and required Verteilschlüssel | 27 | 1 | 38 | 22 | 5 |
| #392 | 17.10. | agreed Nebenkosten per Mietvertrag | 16 | 3 | 38 | 22 | 5 |
| #361 | 17.10. | Korrespondenzadresse with country, old-address warning, LI IBAN | 20 | 2 | 37 | 29 | 5 |
| #43 | 11.10. | fee of own costs, Saldo to 5 Rappen | 10 | 2 | 37 | 20 | 5 |
| #54 | 12.10. | upcoming end, statements after an end change | 23 | 2 | 34 | 21 | 4 |
| #527 | 20.10. | carry over Saldo below CHF 5.00 | 13 | 1 | 33 | 20 | 5 |

(Commits = Nicht-Merge-Commits im PR.)

**Kontext, nicht Teil der Messgrösse:** Pro Feature kommen im Median 16 Test- und 12 Doku-/Prozessdateien dazu (Gesamt 38, P90 86); nur 36,9 % aller Dateiänderungen in Features sind Produktivcode. 92,9 % der Features ändern Prozessdateien, 88,5 % Acceptance-Tests. Die Prozessartefakte (73 713 LOC) sind grösser als der Produktivcode.

### M2 Change Coupling [gemessen, `m2-*.csv`]

Kopplungsgrad = gemeinsame Änderungen / Änderungen an A oder B (= n_AB / (n_A + n_B − n_AB)); gerichtete Konfidenz n_AB/n_A zusätzlich in den CSVs. Schwellen wie vorgegeben **≥ 5 gemeinsam und ≥ 30 %**, nicht angepasst: Sie liefern 68 Produktiv-Dateipaare, genug für eine Auswahl ohne Rauschen.

| Sicht | Transaktionen | ausgelassen (> 50 Dateien) | Paare über Schwelle |
|---|---|---|---|
| **Datei / PR-Einheit, nur prod (primär)** | 244 | 3 | 68 |
| Modul / PR-Einheit, nur prod | 244 | 3 | 38 |
| Kontext: Datei / PR-Einheit, prod + test | 311 | 23 | 281 |
| Kontext: Datei / Commit, prod + test | 1223 | 7 | 243 |

Primärsicht: schichtübergreifend ohne Import **28** (11 davon Mietvertrag), gleiche Schicht mit Import 22, schichtübergreifend mit Import 9, gleiche Schicht ohne Import 9.

**Top 20 Produktiv-Dateipaare** (Beispiel-Commit = kleinster Commit, der beide ändert; Ausnahme #9, siehe Abschnitt 4):

| # | A | B | gem. | Grad | Schicht | Import | Beispiel |
|---|---|---|---|---|---|---|---|
| 1 | messages/{de,fr,it,en}.json | src/lib/types.ts | 36 | 0,316 | über | nein | 8d6984e33 |
| 2 | backend/src/db/schema.ts | src/lib/types.ts | 26 | 0,426 | über | nein | acdcc9ab4 |
| 3 | be/services/pdf.service.ts | be/services/statement-pdf.service.ts | 22 | 0,478 | gleich | ja | f0f8a92c9 |
| 4 | be/routes/contracts.ts | be/services/contract.service.ts | 15 | 0,652 | gleich | ja | 64d2b16fa |
| 5 | be/services/contract.service.ts | routes/contracts/[id]/+page.server.ts | 15 | 0,6 | über | nein | e6644bea3 |
| 6 | backend/src/db/schema.ts | be/services/statement.service.ts | 21 | 0,35 | über | ja | a94beff36 |
| 7 | backend/src/db/schema.ts | be/services/calculation.service.ts | 19 | 0,358 | über | ja | 3130fb793 |
| 8 | backend/src/db/schema.ts | be/services/statement-pdf.service.ts | 19 | 0,333 | über | ja | 67053378d |
| 9 | backend/src/db/schema.ts | be/services/pdf.service.ts | 20 | 0,303 | über | ja | 3ae2b1d6a |
| 10 | routes/contracts/[id]/+page.server.ts | routes/contracts/[id]/+page.svelte | 12 | 0,5 | über | nein | ad6c5cc98 |
| 11 | src/lib/contract-form.ts | routes/contracts/ContractForm.svelte | 13 | 0,448 | gleich | ja | 2062c4b98 |
| 12 | be/services/calculation.service.ts | be/services/statement-pdf.service.ts | 15 | 0,385 | gleich | nein | 67053378d |
| 13 | src/lib/overview.ts | routes/dashboard/+page.server.ts | 11 | 0,524 | über | ja | 618786772 |
| 14 | routes/contracts/ContractForm.svelte | routes/contracts/new/ContractWizard.svelte | 12 | 0,444 | gleich | nein | 427f89303 |
| 15 | src/lib/invoice-upload.ts | routes/invoices/InvoiceUploadDialog.svelte | 6 | 0,857 | gleich | ja | 87fee8a8b |
| 16 | src/lib/server/statement-generation.ts | src/lib/statement-wizard.ts | 12 | 0,414 | über | ja | 3edc96311 |
| 17 | be/routes/contracts.ts | routes/contracts/[id]/+page.server.ts | 11 | 0,44 | über | nein | fa6f5df22 |
| 18 | src/lib/server/statement-generation.ts | routes/statements/generate/+page.server.ts | 10 | 0,455 | gleich | ja | 5d6888eb2 |
| 19 | src/lib/server/statement-actions.ts | routes/statements/[id]/+page.server.ts | 7 | 0,636 | gleich | ja | a4fa94603 |
| 20 | be/services/contract.service.ts | routes/contracts/ContractForm.svelte | 12 | 0,364 | über | nein | b39a53d53 |

**Produktive Modulpaare** (Auszug `m2-module-pairs-units-prod.csv`): `db:migrations`↔`db:schema` 40/0,714; `fe:i18n`↔`shared:types` 36/0,316; `db:schema`↔`shared:types` 26/0,426 (kein Import); `be:services/pdf`↔`be:services/statement-pdf` 22/0,478; `be:routes/contracts`↔`be:services/contract` 15/0,652; `be:services/contract`↔`bff:load/contracts` 16/0,571 (kein Import); `bff:load/contracts`↔`fe:routes/contracts` 20/0,392; `bff:load/statements`↔`fe:routes/statements` 24/0,387.

**Kontext, nicht Teil der Messgrösse:** Mit Testdateien gerechnet, belegen die 10 stärksten Paare ein Bildschirm-Register, das in 3 Testdateien von Hand gepflegt wird (`screens.json`, `accessibility.feature`, `sprachen-bildschirme.feature`; Grad bis 0,98; alle 87 Bildschirme stehen in allen dreien). Von den 281 Paaren dieser Sicht sind 132 test–test und 122 prod–test.

### M3 Hotspots [gemessen, `m3-hotspots.csv`]

Änderungshäufigkeit = Nicht-Merge-Commits im Fenster; Komplexität aus `fallow health` (Summe zyklomatische Komplexität je Datei, `crap_max` = höchster CRAP-Wert einer Funktion). **Rangfolge nach Commits × zyklomatischer Summe**, weil die CRAP-Werte nur geschätzt sind: fallow rechnet mit `coverage_model: static_estimated`, und 46 Dateien haben exakt `crap_max` 26,5 (Sättigung). Der Rang nach Commits × `crap_max` steht daneben.

| Rang (prod) | CRAP-Rang (prod) | Datei | Schicht | Commits | PRs | zykl. Σ | crap_max | Zeilen | Fan-in |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | backend/src/services/pdf.service.ts | Backend | 82 | 40 | 304 | 26,5 | 1460 | 7 |
| 2 | 2 | backend/src/services/statement.service.ts | Backend | 69 | 36 | 191 | 26,5 | 1031 | 23 |
| 3 | 3 | backend/src/services/statement-pdf.service.ts | Backend | 52 | 30 | 164 | 26,5 | 385 | 9 |
| 4 | 6 | src/lib/server/statement-generation.ts | BFF | 44 | 23 | 152 | 26,5 | 459 | 6 |
| 5 | 5 | src/lib/statement-wizard.ts | FE | 45 | 24 | 128 | 26,5 | 402 | 19 |
| 6 | 12 | backend/src/services/calculation.service.ts | Backend | 43 | 27 | 104 | 17,6 | 512 | 4 |
| 7 | 14 | src/routes/contracts/[id]/+page.server.ts | BFF | 38 | 21 | 115 | 17,6 | 389 | 1 |
| 8 | 10 | backend/src/services/contract.service.ts | Backend | 37 | 23 | 88 | 21,8 | 529 | 17 |
| 9 | 9 | src/lib/server/statement.ts | BFF | 40 | 24 | 81 | 21,8 | 232 | 10 |
| 10 | 4 | src/routes/contracts/ContractForm.svelte | FE | 51 | 26 | 63 | 26,5 | 395 | 1 |
| 11 | 41 | src/lib/contract-form.ts | FE | 27 | 20 | 112 | 12,5 | 292 | 13 |
| 12 | 151 | backend/src/db/schema.ts | DB | 61 | 48 | 45 | 1,2 | 688 | 81 |
| 13 | 35 | backend/src/services/invoice.service.ts | Backend | 24 | 17 | 110 | 17,6 | 634 | 8 |
| 14 | 31 | src/routes/dashboard/+page.server.ts | BFF | 33 | 21 | 75 | 13,8 | 246 | 5 |
| 15 | 27 | backend/src/services/invoice-completeness.service.ts | Backend | 18 | 7 | 130 | 26,5 | 363 | 3 |

(Beide Ränge zählen nur Produktivdateien; die Ränge in `m3-hotspots.csv` zählen Testdateien mit.)

Abgeleitet: alle Top-10 gehören zur Abrechnung bzw. zum Mietvertrag und verteilen sich auf Backend, BFF und FE. Zwei BFF-Dateien (`statement-generation.ts` zykl. Σ 152, `contracts/[id]/+page.server.ts` 115) sind komplexer als die meisten Backend-Services, obwohl laut `CLAUDE.md` die Fachlogik im Backend liegen soll. [abgeleitet]

### M4 Streuung von Wissen [gemessen, `m4-*.csv`; Heuristik, siehe Grenzen]

**Kein gemeinsamer Code zwischen FE/BFF und Backend:** 0 Importe; `src/lib/types.ts` beginnt mit „Core Entity Types – Match backend schema (camelCase)“. [gemessen]

**Entitäts-Spiegel:** Dateien ausserhalb der DB-Schicht, die mindestens die Hälfte (min. 3) der spezifischen Felder einer Tabelle als Schlüssel deklarieren (Typ-Property, Objektliteral, Validierungsschema, Mapper, Drizzle-Projektion):

| Tabelle | spez. Felder | Dateien | FE | BFF | Backend | types.ts | Vertrags-Fixtures (Kontext) |
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

**Statuswerte:** Produktivdateien, die einen Statuswert als String nennen (Vergleich, Filter, Beschriftung):

| Wert | Dateien | FE | BFF | Backend | DB | types.ts |
|---|---|---|---|---|---|---|
| draft | 29 | 15 | 2 | 9 | 2 | 1 |
| paid | 21 | 8 | 1 | 10 | 1 | 1 |
| sent | 19 | 5 | 0 | 12 | 1 | 1 |
| replaced | 19 | 8 | 2 | 8 | 0 | 1 |
| overdue | 12 | 6 | 0 | 5 | 0 | 1 |
| future | 12 | 4 | 3 | 4 | 0 | 1 |
| settled | 11 | 4 | 0 | 6 | 0 | 1 |
| active | 11 | 4 | 2 | 4 | 0 | 1 |
| ended | 9 | 5 | 1 | 2 | 0 | 1 |

**Identische Wertelisten in mehreren Dateien** (21 Sets, 14 schichtübergreifend), u. a.:

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

**Validierungsregeln:** identische Regex in mehreren Dateien: ISO-Datum `^\d{4}-\d{2}-\d{2}$` in 7 BFF/FE-Dateien; Betrag `^\d+(\.\d{1,2})?$` in Backend, BFF und FE; `^\d{4}$` in 3 BFF-Dateien (zweimal PLZ, einmal ein Jahr als Query-Parameter); UUID und E-Mail je in BFF und Backend. Validierungs-Schlüsselwörter (`t.String`, `maxLength`, `required` …): Backend 412 in 26 Dateien, FE 23 in 14, BFF 8 in 5.

**Textuelle Klone** (fallow dupes): 22 Gruppen, 585 Zeilen, 0,87 %, keine über Schichten.

**Fachliche Entscheidungen ausserhalb des Backends** (`m4-decisions-*.csv`): Vergleiche gegen einen Statuswert (`status !== 'replaced'`) und verankerte Regex-Literale (`/^\d{4}$/`) pro Schicht [gemessen]:

| Schicht | Dateien mit Status-Vergleich | Status-Vergleiche | Dateien mit Regex | Regex | zykl. Σ der Schicht |
|---|---|---|---|---|---|
| FE | 20 | 54 | 9 | 14 | 3128 |
| BFF | 5 | 9 | 11 | 19 | 1832 |
| Backend | 9 | 33 | 6 | 9 | 2605 |

Gelesen [abgeleitet]: Alle **9 Status-Vergleiche im BFF** sind fachliche Entscheidungen: welche Abrechnungen eine Periode belegen (`statement-generation.ts` 3, `statements/generate/+page.server.ts` 1), welcher Mietvertrag aktuell oder künftig ist (`tenants/[id]/+page.server.ts` 3, `lib/server/apartment.ts` 1), welcher Entwurf zum Mietvertrag gehört (`contracts/[id]/+page.server.ts` 1). Von den **19 Regex im BFF** sind **10 fachliche Prüfregeln** in 4 Dateien: `settings.ts` 4 (PLZ, E-Mail, IBAN CH/LI, Tage „within the limits the backend accepts“), `building-form.ts` 3 (PLZ, Fläche und Zimmer nach den DB-Spalten `decimal(8,2)`/`decimal(3,1)`, Zimmer in halben Schritten), `tenant-form.ts` 2 (E-Mail, PLZ), `buildings/[id]/+page.server.ts` 1 (Tankbestand-Betrag). Die übrigen 9 sind technisch (UUID, ISO-Datum und Jahr als Query-Parameter, JWT-Dauer, EGID). Im FE sind die Status-Vergleiche nicht einzeln gelesen; der Entscheid betrifft den BFF.

## 4. Klassifizierte Kandidaten (Vorschlag für das Review)

Grundlage: gelesene Diffs der Beispiel-Commits (alles **[abgeleitet]**; Vorschlag, keine Entscheidung). Für #9 war der kleinste Commit (047d704db) nur eine Kommentaränderung; gelesen habe ich stattdessen 3ae2b1d6a.

| Kandidat | Vorschlag | Begründung mit Beispiel |
|---|---|---|
| #1 `messages/*` ↔ `types.ts` | **akzidentell** (Sammeldatei) | 8d6984e33: neuer UI-Zustand „Keine KI“ = Text in `messages/*` plus Flag `kiOff` in `types.ts`. Kein dupliziertes Wissen im Diff; die Kopplung entsteht, weil `types.ts` (398 LOC) die Typen aller Bereiche sammelt und in 37 von 113 Features geändert wird. |
| #2 `schema.ts` ↔ `types.ts` | **akzidentell** | acdcc9ab4: `isHeatingCost` in `schema.ts` und in `types.ts` von Hand, mit identischem Kommentar „Art. 5 VMWG“. Gleiches Muster in PR#361 (`country`, 6 Orte) und PR#539 (`allocableInvoiceCount`, 5 Orte). |
| #3 `pdf.service` ↔ `statement-pdf.service` | **essenziell** | f0f8a92c9: Hinweis „ersetzt die Abrechnung …“: Text (in `pdf.service`, eigene Übersetzungstabelle für das PDF in 4 Sprachen) und Daten (`statement-pdf.service`). Darstellung und Daten getrennt ist gewollt. Am Rand: das PDF hat eine zweite i18n-Quelle neben `messages/*`. |
| #4 `be/routes/contracts` ↔ `contract.service` | **Grenzfall, eher akzidentell** | 64d2b16fa: neuer Filter `search` wird im Routen-Schema deklariert und 1:1 durchgereicht (`search: query.search`). Validierung an der Grenze ist legitim; die Eingabeform steht aber zweimal. |
| #5 `contract.service` ↔ `contracts/[id]/+page.server.ts` | **akzidentell, widerspricht Entscheid** | e6644bea3: die Regel „eine ersetzte Abrechnung zählt nicht“ wird im Backend (`ne(status, 'replaced')`) und im BFF (`s.status !== 'replaced'`) getrennt eingebaut. |
| #6 `schema.ts` ↔ `statement.service` | **essenziell** | a94beff36: „überfällig“ wird berechnet statt gespeichert: Speicherung und Statusübergänge ändern sich zusammen. |
| #7 `schema.ts` ↔ `calculation.service` | **essenziell** | 3130fb793: neue Spalte `managementFeePercent` und ihre Verwendung in der Berechnung. |
| #8 `schema.ts` ↔ `statement-pdf.service` | **essenziell** | 67053378d: Heizkostenanteil wird gespeichert (`heatingShare`, jsonb) und im PDF so gedruckt. |
| #9 `schema.ts` ↔ `pdf.service` | **essenziell**, mit Anmerkung | 3ae2b1d6a: gespeicherte Form `InvoicePart` (in `schema.ts`) und ihre Darstellung. `schema.ts` trägt die Fachtypen der JSON-Spalten (Fan-in 81). |
| #10 `+page.server.ts` ↔ `+page.svelte` (Mietvertrag) | **essenziell** | ad6c5cc98: neue Formular-Actions „beenden/löschen“ und ihre Knöpfe; SvelteKit-Seitenpaar. |
| #11 `contract-form.ts` ↔ `ContractForm.svelte` | **essenziell** | 2062c4b98: Logik bewusst aus der Komponente ausgelagert; beide ändern sich gemeinsam. |
| #12 `calculation.service` ↔ `statement-pdf.service` | **gemischt** | 67053378d: der Heizkostenanteil wird in der Berechnung bestimmt und gespeichert; `statement-pdf.service` rechnet ihn für ältere Abrechnungen selbst nach („recomputed only for one created before“) → zweiter Ort für dieselbe Regel. |
| #13 `overview.ts` ↔ `dashboard/+page.server.ts` | **akzidentell, widerspricht Entscheid** | 618786772: die Zahl der zu sendenden Entwürfe wird aus zwei Backend-Antworten zusammengesetzt (`Math.max(count − outdated, listed)`). `overview.ts` liegt in `src/lib` (Schicht FE), läuft aber in der BFF-Ladefunktion des Dashboards: eine fachliche Zählung im BFF. |
| #14 `ContractForm.svelte` ↔ `ContractWizard.svelte` | **akzidentell** | 427f89303: „Folgevertrag übernimmt vereinbarte Nebenkosten“ muss in beiden Formularen (Bearbeiten, Neu) eingebaut werden; dazu `ContractFormValues` in 3 Dateien und `/overlap/i` in beiden. |
| #15 `invoice-upload.ts` ↔ `InvoiceUploadDialog.svelte` | **essenziell** | 87fee8a8b: neuer Grund `'off'` und seine Verwendung im Dialog. |
| #16 BFF `statement-generation` ↔ FE `statement-wizard` | **akzidentell, widerspricht Entscheid** | 3edc96311: die Regel, wann ein Heizprofil als „seit der Abrechnung geändert“ gilt (`editedSince`, `byDays`), steht im BFF; das FE zeigt sie. Fachregel im BFF. |
| #17 `be/routes/contracts` ↔ BFF `contracts/[id]/+page.server.ts` | **akzidentell** | fa6f5df22: Umbenennung `StatementsAfterEndError` → `BilledDaysError` im Backend zieht die BFF-Auswertung der 409-Antwort nach; der Fehlervertrag ist nur durch Konvention geteilt. |
| #18 BFF `statement-generation` ↔ `generate/+page.server.ts` | **akzidentell, widerspricht Entscheid** | 5d6888eb2: „eine ersetzte Abrechnung zählt nicht zur Periode“ ein weiteres Mal im BFF (`filter((s) => s.status !== 'replaced')`), dazu `unbilledContracts` im BFF. |
| #19 BFF `statement-actions` ↔ `statements/[id]/+page.server.ts` | **essenziell** | a4fa94603: Modul vertieft (Prüfung und Ablehnung in `statement-actions`), Aufrufer angepasst; ein Refactoring. |
| #20 `contract.service` ↔ `ContractForm.svelte` | **essenziell** | b39a53d53: neue Prüfung im Backend (`checkBilledByDwello`), das FE zeigt den Fehlercode am Feld (`backendMessage`). Regel nur im Backend, so gewollt. |
| Feature PR#32 (Redesign, 294 prod) | **essenziell, einmalig** | Umbau auf Tokens/Komponenten (269 FE-Dateien). Nicht repräsentativ. |
| Feature PR#48 (i18n, 251 prod) | **essenziell, einmalig** | Einführung von vier Sprachen. Nicht repräsentativ; begründet aber die dauerhaften 4 i18n-Dateien pro Text. |
| Feature PR#39 (101 prod) | **Messartefakt** | Bündelt 6 `feat`-Commits (PDF nach Schweizer Norm, Datumsfeld, Rechnungsprüfung, Heizkosten …); die Grösse kommt aus dem PR-Schnitt. |
| Feature PR#238 (48 prod) | **überwiegend essenziell** | Neue durchgehende Fähigkeit: Belege speichern (Migration, `document.service`, `file-response`), KI-Extraktion (`llm.ts` +118, `llm.service`), Upload-Route und -Dialog. Akzidenteller Anteil: Rechnungsform zusätzlich in `types.ts` und BFF `invoice.ts`. |
| Feature PR#539 (38 prod) | **gemischt** | Essenziell: Migration, UI, Regeln. Akzidentell: `allocableInvoiceCount` von Hand im Backend-Typ, im SQL, im BFF-Typ `CategoryWithUsage`, im BFF-Mapper (`Number(c.allocableInvoiceCount) \|\| 0`) und in der Fixture. |

Zählung: von den 20 Paaren 10 essenziell, 9 akzidentell (davon einer Grenzfall, 4 widersprechen dem Entscheid zum BFF), 1 gemischt.

## 5. Hypothesen

**H1 – Kein gemeinsamer Vertrag zwischen den Schichten: Entitätsformen werden von Hand gespiegelt.**
- Belege: 0 Importe FE/BFF → Backend; `types.ts` „Match backend schema“; Paar #2 `schema.ts` ↔ `types.ts` 26 gemeinsame Änderungen ohne Import; DB-Feld im Median in 6 Produktivdateien deklariert (P90 19); 14 schichtübergreifende identische Wertelisten; Paar #17 (Fehlervertrag nur per Konvention); PR#361 (`country` an 6 Orten), PR#539. [gemessen/abgeleitet]
- Widerlegt, wenn: die Deklarationsorte überwiegend eigene Logik oder bewusst abweichende Formen enthalten (BFF als Anti-Corruption-Layer) und ein generierter Vertrag die Dateizahl pro Feld nicht senken würde.
- Frage ans Team: Da der BFF nicht fachlich entscheidet, bleibt ihm Aufbereiten und Durchreichen. Soll er die Antworten für die Seite umbauen (Mapping im BFF), oder soll das Backend seitengerechte Antworten liefern, die der BFF unverändert weitergibt?

**H2 – Fachregeln werden in mehreren Schichten entschieden; der BFF entscheidet entgegen dem Zielbild mit.**
- Belege: 9 fachliche Status-Vergleiche in 5 BFF-Dateien und 10 fachliche Prüfregeln in 4 BFF-Dateien (M4); `'replaced'` in 19 Produktivdateien (FE 8, BFF 2, Backend 8); Paare #5, #18 (dieselbe Regel in Backend und zweimal im BFF), #13 (Zählung im BFF), #16 (Heizprofil-Regel im BFF), #12 (Nachrechnen im PDF); BFF-Dateien unter den Hotspots (zykl. Σ 152 und 115). Der Entscheid vom 23.10.2026 bestätigt, dass das eine Abweichung ist; offen ist nur, wie viel der Kopplung sie erklärt. [gemessen/abgeleitet]
- Widerlegt (als Ursache der Amplifikation), wenn: Änderungen an diesen Regeln selten den BFF mitziehen, d. h. die BFF-Stellen in der Historie kaum gemeinsam mit den Backend-Regeln geändert werden. Messbar über Ä4 und die Paare #5, #16, #18.
- Entschieden (23.10.2026): auch Formularprüfungen gehören ins Backend; der BFF zeigt dessen Fehlercodes am Feld (wie bei #20).
- Entschieden (23.10.2026): zuerst die Abrechnungs-Regeln der Paare #5, #16, #18 (welche Abrechnungen eine Periode belegen, ersetzte Abrechnung zählt nicht, seit der Abrechnung geändertes Heizprofil), dann die übrigen Stellen.
- Frage: Sinkt nach dem Verschieben der Abrechnungs-Regeln die gemeinsame Änderung von `statement-generation.ts` und `+page.server.ts` mit den Backend-Services (Paare #16, #18 und `be:services/statement`↔`bff:load/statements`)? Prüfbar mit einem neuen Lauf von `run.sh` nach einigen Features.

**H3 – Zentrale Sammeldateien koppeln unabhängige Features.**
- Belege: die zwei stärksten Produktivpaare hängen an `types.ts` (#1: 36, #2: 26 gemeinsame Änderungen); `types.ts` in 37 von 113 Features; `schema.ts` 61 Commits in 48 PRs, Fan-in 81, trägt auch die Fachtypen der JSON-Spalten (#9); 5 der Top-10-Paare hängen an `schema.ts`. [gemessen]
- Widerlegt, wenn: die gemeinsamen Änderungen an `types.ts` jeweils dieselbe Entität betreffen wie das Feature (dann wäre es H1, nicht die Datei), oder ein Aufteilen pro Bereich die Kopplung zu `messages/*` nicht senkt.
- Frage: Ist `types.ts` als zentraler Ort gewollt, oder sollen Typen bei ihrem Bereich (Mietvertrag, Abrechnung …) liegen?

**H4 – Module sind nach technischer Schicht geschnitten; die Entscheidungen einer Fachfrage (Abrechnung, Mietvertrag) liegen verteilt in Backend, BFF und FE.**
- Belege: alle Top-10-Hotspots in Abrechnung/Mietvertrag, verteilt auf 3 Schichten; Modulkette Mietvertrag `be:routes/contracts`↔`be:services/contract` 0,652, ↔`bff:load/contracts` 0,571, `bff:load/contracts`↔`fe:routes/contracts` 0,392; 11 der 28 schichtübergreifenden Paare ohne Import betreffen den Mietvertrag; Contract 30 und Statement 29 Typdeklarationen in 19 bzw. 16 Dateien; Scope `contracts` Median 10 Produktivdateien pro Einheit. [gemessen]
- Widerlegt, wenn: die Diffs dieser Ketten überwiegend „neues Feld muss durch alle Schichten“ zeigen (essenziell) und kaum Regeln, die an zwei Orten entschieden werden.
- Frage: Welche Regeln zu Abrechnung und Mietvertrag entscheidet heute nur das Backend, und welche entscheidet das FE/BFF selbst noch einmal (z. B. für Vorschau oder Hinweise)?

**H5 – Parallele UI-Flüsse für denselben Vorgang verdoppeln Änderungen.**
- Belege: Paar #14 `ContractForm` ↔ `ContractWizard` 12 gemeinsame Änderungen ohne Import; `ContractFormValues` und `ContractForAvailability` je in 3 Dateien; `/overlap/i` in beiden; `RefusedStatement` in 4 FE/BFF-Dateien; `ContractForm.svelte` ist Hotspot Nr. 10 (51 Commits). [gemessen]
- Widerlegt, wenn: Bearbeiten und Neuerfassen fachlich verschiedene Regeln haben und die gemeinsamen Änderungen nur Darstellung sind.
- Frage: Sollen „Mietvertrag erfassen“ und „Mietvertrag bearbeiten“ dieselbe Formular-Logik teilen?

**Kontext ausserhalb der Messgrösse** (Entscheid 23.10.2026): Test- und Prozessdateien tragen mehr Dateiänderungen bei als der Produktivcode (63,1 % aller Dateiänderungen in Features), und das von Hand dreifach gepflegte Bildschirm-Register ist die stärkste Kopplung im Repo. Das betrifft den Aufwand pro Feature, nicht die Änderbarkeit des Produkts; es fliesst nicht in H1–H5 ein.

## 6. Grenzen der Analyse

- **Kurze Historie:** 96 % der Commits liegen in 23 Tagen (Oktober 2026), fast ausschliesslich agentische Entwicklung. Die Werte beschreiben diese Phase; Trends über Monate sind nicht messbar.
- **PR ≠ Feature:** 29 von 113 feat-PRs bündeln mehrere Features; ohne sie sinkt der Median von 12 auf 9,5 Produktivdateien. Der Netto-Diff verbirgt, was innerhalb eines PRs geändert und wieder zurückgenommen wurde.
- **Typ-Zuordnung:** 30 Einheiten ohne Typ habe ich aus dem Titel eingeordnet (`unit-types.json`); 148 direkte Commits auf `main` zählen als eigene Einheiten.
- **Schichtzuordnung** ist mein Vorschlag (`layers.json`), z. B. `types.ts` als Shared (prod), `+page.server.ts` als BFF, i18n-JSON als FE-Produktivcode.
- **Import-Graph** per Regex: dynamische Pfade, `./$types` (SvelteKit) und HTTP-Aufrufe sind unsichtbar. „Import: nein“ zwischen BFF und Backend oder zwischen `+page.server.ts` und `+page.svelte` heisst „keine statische Abhängigkeit“, nicht „unabhängig“. 14 Test-/Tool-Dateien enthalten Pfade, die keine Datei des Repos nennen, meist Import-Strings als Testdaten (`imports-unresolved.csv`, ignoriert); `import { type X }` zählt nur im Backend als Typ-Kante (wenn jeder Name `type` trägt); FE und BFF kompilieren mit `verbatimModuleSyntax`, dort bleibt der Import zur Laufzeit stehen.
- **CRAP** ist geschätzt (`static_estimated`), nicht gemessen; echte Werte bräuchten Istanbul-Coverage (FE nutzt v8, Backend lcov). Darum Rangfolge nach zyklomatischer Komplexität.
- **M4 ist heuristisch:** Ein Schlüssel `field:` kann Nutzung statt Definition sein (Drizzle-Projektionen zählen als „kennt die Feldliste“); Felder, die in zwei Tabellen vorkommen (z. B. `country`), sind aus der Feld-Statistik ausgenommen; Statuswerte wie `'draft'` kommen auch in anderer Bedeutung vor (Entwurf eines Formulars); Validierungsregeln in Svelte-Markup (`maxlength=`) sind nur grob erfasst.
- **Fachliche Entscheidungen im BFF** werden über zwei Muster gefunden (Vergleich gegen einen Statuswert, verankerte Regex); Entscheidungen in anderer Form (z. B. Datumsvergleiche, Rundungen, Zählungen wie #13) erfasst das Skript nicht. Die Einordnung fachlich/technisch der 28 Treffer ist gelesen, nicht gemessen.
- **Beispiel-Commits** sind der kleinste Commit mit beiden Dateien; ein einzelner Diff belegt das Muster, nicht seine Häufigkeit.
- fallow und Deepcheck lesen das Arbeitsverzeichnis und zählen die Skripte unter `tools/arch-baseline/` mit (ohne Historie, ohne Einfluss auf M3).
- `origin/main` hat sich während der Analyse bewegt; alle Zahlen stammen aus einem Lauf in einem Worktree auf `d4d508cc2` mit den Skripten dieses Branches und `ARCH_BASE=d4d508cc2`. `ARCH_BASE` fixiert nur die Historie; Landkarte, Import-Graph, M4, fallow und Deepcheck lesen den ausgecheckten Stand. Dieselben Zahlen gibt also nur ein Lauf auf diesem Stand.

## 7. Vorschlag: messbare Szenarien für Änderbarkeit

Alle vier messen nur Produktivdateien (Entscheid 23.10.2026).

| | Ä1 Neues Feld an bestehender Entität | Ä2 Statusregel ändern | Ä3 Fachliche Erweiterung | Ä4 Fachregel nur im Backend |
|---|---|---|---|---|
| Auslöser | Product Owner verlangt ein neues Attribut (z. B. Land der Korrespondenzadresse) | Product Owner ändert, was ein Status bedeutet (z. B. wann eine ersetzte Abrechnung noch zählt) | Ein Issue mit einer neuen Fachregel, umgesetzt als ein feat-PR | Eine Fachregel ändert sich (Status, Prüfregel) |
| Umgebung | Entwicklung, bestehende Entität mit Liste, Detail, Formular | Entwicklung, Status mit Wirkung auf Liste, Übersicht, Erstellung, PDF | Entwicklung nach ATDD-Workflow | Entwicklung, Regel heute in Backend und BFF |
| Reaktion | Feld ist in DB, API, BFF und UI verfügbar und validiert | Alle Stellen, die nach dem Status entscheiden, folgen der neuen Regel | Regel umgesetzt, Szenario grün | Die Änderung erfolgt nur im Backend; der BFF übernimmt Ergebnis oder Fehlercode |
| Messgrösse | Produktivdateien ausserhalb der DB, die das Feld von Hand deklarieren (`m4-field-spread.csv`) | Produktivdateien, die den Statuswert nennen (`m4-status-literals.csv`) | geänderte Produktivdateien pro feat-PR mit 1 feat-Commit (`m1-summary.csv`, Gruppe `feat-single`) | fachliche Status-Vergleiche und Prüfregeln im BFF (`m4-decisions-outside-backend.csv`, gelesen wie in M4) |
| Ausgangswert | Median **6**, P90 **19** (125 Felder) | `replaced` **19** Dateien in 4 Schichten (FE 8, BFF 2, Backend 8, Shared 1); `draft` 29, `paid` 21 | Median **9,5**, P90 **25**; Schichten Median 2 / P90 5 | **9** Status-Vergleiche in 5 Dateien, **10** Prüfregeln in 4 Dateien |
| Zielwert | Median **≤ 4**, P90 **≤ 8** | BFF **0** Dateien; höchstens **2** Schichten (Backend und FE-Anzeige); insgesamt **≤ 6** Dateien | Leitplanke: Median **≤ 9**, P90 **≤ 18**; Schichten P90 **≤ 4** | **0** (aus den Entscheiden vom 23.10.2026; H-28) |

**Zielwerte (Entscheid Product Owner, 23.10.2026).** Begründung je Szenario:

- **Ä1:** Ein Feld braucht zwingend etwa vier Stellen: die Prüfung im Backend, den einen Mapper im BFF («One mapper per response»), das Formular und die Anzeige. Mehr Dateien heissen Abschreiben, etwa Typen, die nicht aus dem Drizzle-Schema abgeleitet sind, oder mehrere Mapper pro Antwort. Der heutige P90 von 19 zeigt Felder, die quer durch die App kopiert sind. [abgeleitet]
- **Ä2:** Das Frontend zeigt einen Status nur an (Label, Badge); was er bedeutet, entscheidet das Backend an einer Stelle. Mit H-28 fällt der BFF-Anteil auf 0; die 8 FE-Dateien mit `replaced` sind der nächste Hebel. [abgeleitet]
- **Ä3:** Der Wert hängt von der Grösse des Features ab. Er ist deshalb eine Leitplanke und kein hartes Ziel: nicht schlechter werden und die Ausreisser halbieren. Jedes Feature mit UI-Text ändert ohnehin die vier Dateien in `messages/`; das ist die Untergrenze. Schichten P90 ≤ 4 heisst: Ein Feature berührt nicht gleichzeitig FE, BFF, Backend, DB und Shared. Das gilt, sobald der BFF nur noch weiterreicht. [abgeleitet]
- **Ä4:** Ist durch die Entscheide vom 23.10.2026 gesetzt (keine Fachregeln im BFF, Formularprüfungen im Backend).

**Messrhythmus.** Die Werte gelten im 6-Monats-Fenster von `run.sh` und bewegen sich darum langsam. Gemessen wird einmal nach Abschluss von H-28 als Zwischenstand und danach vierteljährlich. Ein Ziel gilt als erreicht, wenn es in zwei Messungen hintereinander hält.

Alle vier Werte lassen sich nach jedem Refactoring mit `tools/arch-baseline/run.sh` neu messen.

## Wiederholen

```bash
tools/arch-baseline/run.sh          # holt bei flachem Clone die volle Historie, schreibt tools/arch-baseline/out/
ARCH_SINCE=2026-04-23 ARCH_MIN_SHARED=5 ARCH_MIN_DEGREE=0.3 ARCH_MAX_TX=50 tools/arch-baseline/run.sh
```

Skripte: `01-map` (Landkarte), `02-imports` (Graph, Zyklen), `03-history` (Einheiten, Commits), `04-metrics` (M1–M3; M2 primär nur Produktivdateien), `05-knowledge` (M4, Szenario-Baselines), `06-examples` (Schritt 4), `07-tables` (Tabellen dieses Reports). Konfiguration: `layers.json` (Schichten), `unit-types.json` (Typ-Vorschläge).
