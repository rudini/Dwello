# Code-Review Slice 1173, Runde 1

Bereich: `git diff origin/main HEAD` (3228567), Worktree `review-1173-code`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: alle 8 geänderten Dateien gelesen. Layout (`src/routes/+layout.svelte:56-72,109-111`): der Pfad-Vergleich deckt Entscheid 1 ab (Formularaktion, Aktion auf dieselbe Seite, Suche/Filter: gleicher Pfad, keine Ansage; anderer Pfad, auch per Redirect: Ansage); `from` ist beim ersten Laden null, wie bei SvelteKit; die Region liegt ausserhalb von `{#if showAuthenticatedLayout}` und bleibt über alle Seiten bestehen; der Hinweis «Bitte warten …» und die Toasts bleiben unberührt (Entscheid 2). Neben PR #1199 passt es: die Titelzeile steht vor dessen early returns, `tick` wird dort ebenfalls importiert, der Konflikt ist nur textuell. DOM-Tests (`src/__tests__/layout-hydrated.dom.test.ts:63-104`): jeder schlägt ohne die Änderung fehl (keine Region / `aria-live` bleibt `assertive` / ohne Pfad-Guard steht der Titel in der Region); `show()` räumt nach jedem Test auf, die Tests sind also isoliert. Szenarien (`tenant-documents.feature:137-152`): die Negativprüfung «Dwello» hat zwei positive Anker davor (Dokument in der Liste, Toast gehört), und `Announcements` ist nach einem vollen Neuladen leer, der Toast-Anker fängt diesen Fall ab. Das Seitenwechsel-Szenario hält bewahrtes Verhalten fest (steht so in der Commit-Nachricht; die Basis sagt den Titel über `#svelte-announcer` an). Screenplay-Schichten: Steps rufen nur Task und Questions auf, Questions geben Werte zurück (Liste der Ansagen), die Interaction liegt in `screenplay/`. Kein neuer Text, kein neuer Bildschirmzustand (die leere sr-only-Region ist kein Zustand), kein API-Vertrag betroffen, Tokens: nur `sr-only`. Bei ponytail-review nichts gefunden, das als Mangel zählt; einen bestehenden Listener für Live-Regionen in `tests/e2e` gibt es nicht.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, Backend type-check, `bunx vitest run --changed origin/main` (38 Tests), Tests e2e-screenplay-lint/design-guard/open-work, testcheck audit, E2E chromium für `tenant-documents.feature`, `tenants.feature`, `documents.feature` (36) und `-g "Screenreader"` (3), die Rot-Läufe des Upload-Szenarios und der DOM-Tests.
- Dass `#svelte-announcer` beim `setTimeout` aus `onMount` schon im DOM steht und SvelteKit `aria-live` danach nicht neu setzt: `.svelte-kit/generated/root.svelte` liegt im Worktree nicht vor (keine `node_modules`, kein Build). Nach dem Aufbau von SvelteKit 2 (`{#if mounted}`, gesetzt im `onMount` der Root) plausibel; belegt nur durch den gemeldeten Chromium-Lauf.
- Firefox und WebKit (Reihenfolge `afterNavigate`/`<title>`-Update, MutationObserver-Mitschnitt): laut Aufrufer lokal nicht gelaufen, kommen erst über workflow_dispatch.
- Ob ein echter Screenreader (NVDA/VoiceOver) das Abschalten per `aria-live="off"` respektiert: mit den Mitteln des Reviews nicht prüfbar (siehe auch `docs/design/personas/sven-677.md:23`).
