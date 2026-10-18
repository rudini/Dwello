# Code-Review #429 «Nebenkostenpauschale pro Monat», Runde 2 (Abschlussrunde)

Gegenstand: `git diff fa9cc056 d23b7054 -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive' ':!docs/design/personas'` im Worktree `review-429-close` (detached bei d23b7054). Commits: 9ee92347 (nur Plan), d23b7054. Alle 10 geänderten Dateien gelesen, dazu `Alert.svelte`, `tone.ts`, `contract-wizard.ts` (`flatRateNotice`, `normalizeAmounts`), `contract-history.ts`, `ContractForm.svelte`/`ContractWizard.svelte` (beide nutzen `RentStep`), `tests/e2e/features/contract-new.feature`, `tasks/accessibility.ts`, `screens.json` und die Kommentare zu #429. Vorbericht: `docs/reviews/429-review-1.md`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-14 | Major | src/routes/contracts/AgreedCategories.svelte:53, RentStep.svelte:145 | Die Persona-Korrektur P-1 ändert, was der Liegenschaftsverwalter sieht: Mit Pauschale ist «Keine Nebenkosten vereinbart» keine Warnung mehr, sondern ein Hinweis (anderes Icon, andere Farbe). Dafür gibt es kein Szenario und auch kein `No scenario: <reason>`. |
| C-15 | Minor | tests/a11y/screens.json:46, accessibility.feature:79/96, sprachen-bildschirme.feature:80/97 | Der Zustand «keine Häkchen mit Pauschale» (Alert im Ton `info`) hat keine eigene a11y- und Sprachzeile. Text und Tokens sind die gleichen wie beim geprüften `rent-taken-over` auf demselben Schritt, darum nur Minor. |
| C-16 | Nit | src/routes/contracts/new/RentStep.svelte:145 | ponytail `reuse`: `parseFloat(normalizeAmounts(values).flatRateUtilityCharge ?? '') > 0` normalisiert alle vier Beträge, um einen zu lesen, und wiederholt die Bedingung `amount(values.flatRateUtilityCharge ?? '') > 0` aus `flatRateNotice` (contract-wizard.ts:92). Ein `$derived` in RentStep oder ein exportierter Helfer würde beides abdecken. |
| C-17 | Nit | src/routes/contracts/AgreedCategories.svelte:17 | Der Kommentar `// a Nebenkostenpauschale: no box is the expected choice` trifft nicht genau zu. Bei einer Teilpauschale sind Häkchen richtig. Gemeint ist: Mit Pauschale kann «kein Häkchen» richtig sein. |

ponytail-review: `net: -1 line possible` (C-16). Kein Befund verdeckt einen Fehler.

## C-14 (Major): Sichtbare Verhaltensänderung ohne Szenario

**Warum falsch.** `CLAUDE.md` (Workflow, Schritt 1) verlangt für jede Verhaltensänderung, die der Benutzer sieht, ein Szenario. Das gilt auch für eine Korrektur aus einem Review. Ohne Szenario muss die Änderung `No scenario: <reason>` nennen, und das ist nur zulässig, wenn der E2E-Stack den Zustand nicht erzeugen kann. Hier kann er es: Das Szenario «Mit Nebenkostenpauschale warnt das Formular vor angekreuzten Nebenkosten» (`contract-new.feature:197`) kommt mit Pauschale bis zum Schritt «Miete», und `untickAllCategories` gibt es schon (`tasks/accessibility.ts:281`). Der Commit d23b7054 nennt keinen Grund. Der DOM-Test in `agreed-categories.dom.test.ts` deckt die Komponente ab. Dass `RentStep` die Prop aus dem echten Formularwert richtig berechnet (C-16, normalisierte Eingabe wie `1'200`), prüft aber kein Test: Wird `flatRate={…}` in RentStep.svelte:145 entfernt, bleiben alle Tests grün.

**Wie zeigen.** RentStep.svelte:145 entfernen und `bunx vitest run` sowie die E2E-Szenarien ausführen: Alles bleibt grün. Abhilfe: das Szenario in `contract-new.feature` erweitern, etwa «Wenn der Liegenschaftsverwalter alle Häkchen entfernt, Dann weist das Formular ohne Warnung darauf hin, dass keine Nebenkosten vereinbart sind». Die Question muss dazu die Art des Hinweises zurückgeben («Warnung»/«Hinweis», ein echter Zustand). Alternativ ein DOM-Test von `RentStep` mit Pauschale und leeren Häkchen. In beiden Fällen braucht die Änderung zusätzlich ein Szenario oder, falls der Mensch das entscheidet, `No scenario: <reason>` im Pull Request.

## Status der offenen IDs aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| C-1 | erledigt (siehe «Nicht bestätigt») | Kommentar vom 2026-10-18 in #429: «Glossary rows confirmed as worded on the branch». Der Wortlaut entspricht UBIQUITOUS_LANGUAGE.md:51–52 in d23b7054. |
| C-2 | offen (Minor) | Die Zeile «Nebenkostenpauschale» in `MonthlyCostsCard` hat weiter keinen Test. Der neue V-5-Test prüft `toContractHistory().monthlyTotal` (tenant-detail.test.ts:169) und nicht diese Zeile. |
| C-3 | offen (Minor) | Unverändert: Das laufende Total im Schritt «Miete» ist mit Pauschale nicht getestet. |
| C-4 | offen (Minor) | Unverändert. |
| C-5 | offen (Minor) | Unverändert, Backend nicht im Delta. |
| C-6 | offen (Minor) | Unverändert. RentStep.svelte:145 fügt ein weiteres `?? ''` hinzu. |
| C-7, C-8, C-13 | offen (Nit) | Unverändert. |
| C-9 | erledigt | screens.json:48 hat wieder `"agreed-costs": "…"`. |
| C-10 | erledigt | en.json:569 «still bills them for all ticked utility costs». |
| C-11 | erledigt | UBIQUITOUS_LANGUAGE.md:51 ohne «rechnet sie aber nie ab» (V-10). |
| C-12 | erledigt | 9ee92347 hakt die Punkte ab. «nullable» steht nicht mehr in `implementation_plan.md`. |

## Bestätigt (Anforderung → Code und Test)

- **P-1:** `AgreedCategories` hat die Prop `flatRate` (Ton `info` statt `caution`), und `RentStep` übergibt sie. Damit gilt die Änderung für Neuerfassung und Bearbeiten, weil beide `RentStep` nutzen. Der neue DOM-Test schlägt ohne die Änderung fehl, weil der Ton dann immer `caution` bzw. `bg-caution-soft` ist. Die neue `bg-caution-soft`-Assertion im bestehenden Test hält das unveränderte Verhalten fest. Den Mischfall mit Akonto und Pauschale lässt #432 laut Kommentar in #429 bewusst offen. Lücke: C-14.
- **V-13/V-14/V-15:** Der letzte Satz von `contracts_no_advance_text` ist in allen vier Sprachen ersetzt, der de-Text entspricht wörtlich dem bestätigten Satz in #429. `contracts_flat_rate_warning_title` ist in allen vier Sprachen geändert, der en-Warntext korrigiert. Die Begriffe entsprechen den bestehenden Schlüsseln (`common_flat_rate_utility_charge`). Ein E2E-Step prüft den Satz («erfährt …, wo er eine Nebenkostenpauschale einträgt»). Laut Aufrufer läuft er grün, das Matching habe ich nicht geprüft.
- **V-10:** Die Glossarzeile ist gekürzt, siehe C-11.
- **V-5:** tenant-detail.test.ts:169 nimmt die Antwort aus `tests/contracts/contract.json` (Konvention API-Verträge). Ohne den Summanden in `contract-history.ts:14` sind beide Totale gleich, der Test schlägt also fehl.
- **C-9:** erledigt.
- **Tokens, Komponenten, Sicherheit:** Der Alert kommt aus `src/lib/ui`, und die Töne sind Tokens. Kein Server- oder BFF-Code im Delta.
- Kein Teil des Diffs ist ohne Bezug zur Anforderung.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bunx vitest run` (3094), E2E chromium der betroffenen Szenarien (34, inkl. Zeilen `flat-rate-warning` und `agreed-costs-none` für axe und Sprachen), Backend 970 auf fa9cc056.
- Selbst erneut ausgeführt: `bunx vitest run src/__tests__/agreed-categories.dom.test.ts src/__tests__/tenant-detail.test.ts`: 22 grün.
- C-1: Der bestätigende Kommentar in #429 trägt die Fusszeile «Generated by Claude Code». Ob er wirklich vom Product Owner stammt, kann ich nicht prüfen.
- Den Merge von `origin/main` nach d23b7054 (Glossarzeilen #403/#404, `DocumentItem.svelte`) habe ich nicht gesehen. Er liegt ausserhalb des Bereichs und gehört in die Prüfung des Merge-Commits.
- Kontrast des `info`-Alerts im Zustand von C-15: nur aus den gleichen Tokens wie bei `rent-taken-over` geschlossen, nicht mit axe geprüft.
