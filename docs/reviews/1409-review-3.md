# Code-Review #1409 Jahresbericht, Runde 3 (9e19979b..1f7b4467, dazu Merge cacc5ba4 und 7f6ce481 nur gelesen; Vorbericht `docs/reviews/1409-review-2.md`)

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-12 | Blocker | src/lib/ui/navigation.ts:90-96; src/__tests__/help-page.dom.test.ts:12-21 | Mit dem neuen Navigationspunkt «Auswertungen» fällt `help-page.dom.test.ts` («nennt die Bereiche mit den Namen der Hauptnavigation»): Der Test verlangt jeden Namen der Hauptnavigation als `«…»` im Text der Hilfe, und kein `help_*`-Text nennt «Auswertungen». |
| C-13 | Major | src/routes/analytics/+page.svelte:12-18, :75; src/lib/server/annual-report.ts:38-45 | Zwei Verhaltensänderungen, die der Liegenschaftsverwalter sieht, haben weder ein Szenario noch ein `No scenario: <Grund>`: Die Downloads verschwinden, solange ein anderes Gebäude oder Jahr gewählt ist, und die Gebäude stehen nach Namen sortiert. |
| C-11 | Minor | src/lib/server/annual-report.ts:85 | Nur zur Hälfte geschlossen: Der pg-Test deckt jetzt die Rechnung ohne Kategorie im Backend ab. Für die BFF-Zeile `m.invoices_no_category()` gibt es weiter keinen Test, weder in `annual-report.test.ts` noch im Vertrag `report-annual.json` (kein `categoryId: null`). Fällt der Rückgriff weg, steht im Bericht eine leere Positionsbezeichnung, und kein Test fällt. |

Geschlossen: C-8, C-10.

## C-12 (Blocker): Die Hilfe nennt den neuen Bereich nicht, der Unit-Test fällt

`help-page.dom.test.ts:16-19` sammelt alle `navGroups[].items[].label` ausser «Hilfe» und prüft `expect(text).toContain(`«${name}»`)` gegen die gerenderte Hilfeseite. `grep -n "Auswertungen" messages/de.json` findet nur `analytics_title` (Zeile 1953). Kein Hilfetext, den `src/routes/help/+page.svelte` zeigt, enthält «Auswertungen». Der Test liest `navigation.ts`, den diese Änderung ändert. In der Liste der gelaufenen Tests fehlt er, und `bunx vitest run --changed origin/main` hätte ihn mitgenommen. CI wird damit rot.

Nachweis: `bunx vitest run src/__tests__/help-page.dom.test.ts` auf 1f7b4467 oder 7f6ce481.

Fachlich ist das kein reiner Testfehler: Die Hilfe soll jeden Bereich der Hauptnavigation erklären (Kommentar `help/+page.svelte:13`). Nötig ist also ein Hilfeabsatz zum Jahresbericht in allen vier Sprachen. Weil das ein Fachtext ist, braucht er die Runde des `fach-reviewer` (CLAUDE.md, Workflow 1); der Test wird nicht abgeschwächt.

## C-13 (Major): Kein Szenario für die verborgenen Downloads und die Sortierung

CLAUDE.md, Workflow 1, und «Always check» verlangen für jede Verhaltensänderung, die ein Benutzer sieht, ein Szenario ohne `@wip` oder ein `No scenario: <Grund>`. Der Commit 1f7b4467 führt zwei sichtbare Verhaltensweisen ein:
- Nach der Wahl eines anderen Gebäudes oder Jahres verschwinden «CSV herunterladen» und «PDF herunterladen», bis der Bericht angezeigt ist (Personas Helga P-1, Sven P-3, Marco P-5).
- Die Gebäude stehen im Auswahlfeld nach Namen, und vorgewählt ist das erste davon (Marco P-5).

`tests/e2e/features/analytics.feature` hat für keine der beiden ein Szenario. Die Commit-Nachricht nennt auch kein `No scenario`. Beides kann der E2E-Stack erzeugen: Die Grundlage hat ein Gebäude, ein zweites mit einem früheren Namen anzulegen kostet einen Schritt, und mit `Select.option` ohne `Click.on(showAnnualReport)` ist die gewählte, noch nicht angezeigte Auswahl erreichbar. Die Abdeckung liegt heute nur in `analytics-page.dom.test.ts:54-64` und `annual-report.test.ts:58-73`.

Hinzu kommt: Der gemeldete E2E-Lauf (68 bestanden) lief auf 45d2aaf1, also vor 1f7b4467. Die beiden Download-Szenarien sind auf dem Commit, der die Download-Schaltflächen bedingt rendert, nicht gelaufen (siehe «Nicht bestätigt»).

Nachweis: `grep -n "herunterlädt\|Gebäude.*wählt" tests/e2e/features/analytics.feature` findet nur die beiden Download-Szenarien, die zuerst «Anzeigen» wählen (`tests/e2e/tasks/annual-report.ts:7-22`). Keins prüft, dass die Downloads fehlen, solange eine andere Wahl offen ist, oder in welcher Reihenfolge die Gebäude stehen.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, vitest `annual-report`, `analytics-page.dom`, `app-frame.dom`, `i18n`, `open-work` (bestanden), `bun test annual-report.pg.test.ts` (bestanden), E2E `analytics.feature` + `navigation.feature` auf 45d2aaf1 (68 bestanden), Rot-Läufe der neuen Tests und die Mutation für C-11.
- E2E `analytics.feature` (Download-Szenarien) auf 1f7b4467/7f6ce481 ist nicht gelaufen. Ob `Wait.forUrl` in `tests/e2e/tasks/annual-report.ts:16` erst greift, wenn die neuen `data` die Downloads wieder zeigen, habe ich nur gelesen: SvelteKit setzt die URL nach dem Laden, also plausibel.
- a11y- und Sprachzeilen nach der neuen Navigation (ein zusätzlicher Punkt auf jeder Seite und im Menü bei 390 px): kein Lauf gemeldet. Gelesen habe ich nur, dass `analytics_title` in allen vier Sprachen steht.
- Ob die verborgenen Downloads ohne Hinweis («Anzeigen» wählen) für die Zielnutzer verständlich sind: Das entscheidet der Persona-Durchgang, nicht dieses Review.
- 7f6ce481 (Marketingseite, Archiv, Workflow-Notizen) und der Merge cacc5ba4 wie vereinbart nur zur Kenntnis genommen.

Geprüft: P-2-Totalzeile (Seite, CSV, PDF aus denselben `sectionsOf`; Szenariotabelle vollständig, Szenario nicht auf `main`, also frei), PDF-Titel über `analytics_report_heading` in vier Sprachen, entfernte Schlüssel ohne Verwendung, schreibbares `$derived` mit `bind:value` (`Select.value` ist `$bindable`, svelte ^5.57), Sortierung mit Test, der ohne Änderung rot wäre, pg-Tests C-10/C-11 (NULL-Kategorie zuletzt durch `ORDER BY … ASC`), Glossar- und i18n-Zeilen nach #1409, TODO #1415 entfernt (Issue in #1409 überführt, laut Workflow-Notiz), Beispielzeilen in `navigation.feature` (neue Zeilen, frei).
