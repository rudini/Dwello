# Review #356 ZIP eines Abrechnungslaufs, Runde 2 (Delta ee2fa53..1533b17, Schlussrunde 611c1a1..1533b17)

Worktree: `/tmp/claude-0/-home-user-Dwello/94414f17-b1bd-53cb-a045-3212fe00129f/scratchpad/review-zip-code2` (1533b17). Gelesen: alle 13 Dateien des Deltas (auch beide Persona-Berichte und `docs/reviews/zip-review-1.md`), dazu `tests/e2e/fixtures/screens.ts` (`seedFor` ganz), `tests/e2e/fixtures/backend.ts` (`building`), `tests/e2e/tasks/accessibility.ts` (`lookAt`, `checkAccessibilityOf`, `checkLanguagesOf`, Zustände `preview-all-billed`, `buildings-billed`), `tests/e2e/steps/language.steps.ts`, `tests/e2e/tasks/statement-generate.ts` (`goToGeneration`), `BuildingChoice.svelte`, `backend/src/routes/statements.ts` (`/generate`), `backend/src/__tests__/api-contracts.pg.test.ts`, `playwright.config.ts`.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | erledigt bis auf C-11 | `tests/a11y/screens.json`, beide Features | Zustand `generation-result` mit `stateMeanings` in allen drei Dateien. |
| C-2 | erledigt | `tests/a11y/screens.json:483-489`, beide Features | `statement-zip-refused` aufgenommen, Pfad mit unbekannter UUID ergibt die Ablehnungsseite. |
| C-3 | erledigt | `src/__tests__/statement-generation.test.ts:56` | Antwort jetzt aus `tests/contracts/statement.json` (Vertrag von `GET /statements/:id`, nicht von `POST /generate`); `api-contracts.pg.test.ts:70-76` liest aber `id` aus der echten `POST /generate`-Antwort, das gelesene Feld ist damit gedeckt. |
| C-5 | erledigt | `src/routes/statements/zip/+server.ts:13-15`, `statement-endpoints.test.ts:238-246` | `encodeURIComponent(id)`; der Test wäre ohne die Änderung rot (`…/statements/../config?/pdf` statt `…/..%2Fconfig%3F/pdf`). |
| C-6 | erledigt | `src/__tests__/statement-endpoints.test.ts:217-219` | Eigene Zeilen Prettier-sauber; die übrigen Prettier-Abweichungen der Datei (Z. 45, 251, 280) stammen nicht aus dieser Änderung. |
| C-9 | erledigt | `docs/PRD-Dwello.md:1262` | «Vision, nicht geplant» wie im Rest. |
| C-4, C-8, C-10, C-7 | abgelehnt, einverstanden | – | Begründungen tragen: #120 kennt keine Storno-Variante; leere `ids` nur über selbst gebaute Adresse; Hilfsfunktion spart kaum etwas; `catch` gleich wie Einzel-PDF. |
| C-11 | Major | `tests/e2e/tasks/accessibility.ts:101,349` | Modulweiter Zähler `resultRuns` mit `2016 + n % 9` erreicht beim 9. Blick in einem Worker das Jahr 2024; in den Testdaten ist 2024 für Seeblick ganz abgerechnet (`screens.ts:68`) und hat eine Heizrechnung (`screens.ts:67`): der Ergebnisschritt ist dort nicht erreichbar, der Zustand scheitert. |
| C-12 | Nit | `implementation_plan.md:12` | Zeile «Not in `tests/a11y/screens.json`: the result step was never an axe state …» widerspricht jetzt dem erledigten Punkt «axe and language states … `generation-result`»; streichen. |

## Blocker/Major

### C-11 Zustand `generation-result` scheitert, sobald ein Worker beide Szenarien ausführt

`resultRuns` ist eine Modulvariable in `tests/e2e/tasks/accessibility.ts:101`; Playwright lädt das Modul einmal pro Worker, der Zähler läuft also über alle Szenarien eines Workers weiter, während die Testdaten (`seedFor`, eigenes Gebäude pro Szenario über `unique(title)`) pro Szenario neu sind. Das axe-Szenario macht 6 Blicke (3 Viewports × hell/dunkel), das Sprachen-Szenario 3 (fr/it/en): zusammen genau 9, und der 9. Blick (`resultRuns % 9 == 8`) nimmt das Jahr 2024 – egal in welcher Reihenfolge die beiden Szenarien laufen.

Für Seeblick 2024 gilt in `seedFor`: Anna, Bruno und Carla haben Abrechnungen («2024 all billed», `screens.ts:68`) und es gibt eine Heizrechnung 2024 (`screens.ts:67`). Die Vorschau hat daher 0 Abrechnungen und hält «Weiter» an (Zustand `preview-all-billed` nutzt genau dieses Jahr, `accessibility.ts:345`; Persona Marco beschreibt dasselbe Verhalten); ob `confirm-missing-invoices` erscheint, ist offen, `Wait.until(on.shown('generation-result'))` wird jedenfalls nie erfüllt. Der Kommentar «a year without invoices» stimmt für 2024 nicht.

Nachweis: die beiden Zeilen im selben Worker laufen lassen, z. B. `bun run test:e2e -- --project=chromium --workers=1 -g "generation-result"` – das zweite Szenario scheitert an seinem letzten (bzw. beim umgekehrten Ablauf sechsten) Blick. Der Lauf des Aufrufers (4 passed) lief mit 4 Workern, die Szenarien landeten in verschiedenen Workern, jeder Zähler begann bei 0. In CI (`workers: 2`, `playwright.config.ts:58`) hängt es von der Verteilung ab: ein zufällig roter Prüflauf.

Abhilfe (kurz): einen Jahresbereich ohne Abrechnungen und Rechnungen wählen und den Zähler an den Blick statt an den Worker binden, z. B. `2016 + (resultRuns++ % 7)` (2016–2022: keine Abrechnungen und Rechnungen für Seeblick; 7 ≥ 6 Blicke pro Szenario, alle Jahre im selben Szenario verschieden). 2023 ginge auch (nur Carla abgerechnet), wäre aber ein anderer Inhalt («2 erstellt» statt 3).

## Anforderung gegen Code und Test (Schlussrunde 611c1a1..1533b17)

- ZIP mit den PDFs genau dieses Laufs, benannt nach Abrechnungsnummer; frühere Abrechnungen nicht enthalten; Ablehnung wie beim Einzel-PDF; Texte in vier Sprachen; fflate; PRD für #111: in Runde 1 bestätigt, im Delta unverändert.
- Ergebnisschritt in axe- und Sprachprüfung (#356 «Done means»): Einträge vorhanden, aber nicht verlässlich ausführbar (C-11).
- ZIP-Ablehnungsseite in axe- und Sprachprüfung: bestätigt (Einträge in allen drei Dateien; laut Aufrufer grün).
- Pfad-Injektion über `ids`: geschlossen, Test rot ohne Änderung (nach Lesen).
- Screenplay: der neue Zustand nutzt nur Interaktionen/Tasks innerhalb der Task-Schicht (`accessibility.ts`), wartet nach dem asynchronen Erstellen auf `generation-result`; keine Steps geändert.

## Nicht bestätigt

- `bunx vitest run src/__tests__/statement-endpoints.test.ts src/__tests__/statement-generation.test.ts`: selbst nachgeführt, 32 Tests grün.
- `bun run lint`, `bun run check`, gesamte Vitest-Suite (2792), E2E `--project=chromium -g "generation-result|statement-zip-refused"` (4 passed): vom Aufrufer gemeldet.
- C-11 nicht ausgeführt (kein E2E erlaubt); geschlossen aus `seedFor`, dem Zähler und dem Zustand `preview-all-billed`. Ob in 2024 schon `Check.the(on.generateBuilding(...))` oder erst der Schritt danach hängt, ist offen; das Ergebnis (kein Ergebnisschritt) nicht.
- Dass der axe-Lauf des Ergebnisschritts beim ersten Blick eines frischen Workers den Inhalt «3 erstellt» zeigt: nur aus den Testdaten (Anna, Bruno, Carla ab 2015) geschlossen.
- Persona-Befunde (Helga P-1..P-3, Marco P-1..P-4): nicht Gegenstand dieses Reviews, Triage beim Aufrufer.
