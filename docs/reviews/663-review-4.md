# Code-Review 663, Runde 4 (CI-Fix 06a3dab)

Delta: `git diff 56e801f 06a3dab` (Stepper.svelte, GenerationStep.svelte, neu RunSummary.svelte, docs/design/personas/sven-663.md).

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde |

Geprüft: Verhalten unverändert. RunSummary filtert die Fakten ohne Wert im Script statt im Template. Die Verwaltungspauschale ist immer ein Fakt, darum gibt es mit `summary` immer mindestens einen Fakt. Ohne `summary` rendert die Komponente wie bisher nichts, und das leere `<dl>` von früher ist nicht mehr erreichbar. Der Typ-Guard `[string, string]` ist korrekt, und `data-testid="run-summary"` sowie die Klassen sind gleich geblieben. Der Typ-Export aus `<script lang="ts" module>` ist Svelte-5-Syntax (svelte ^5.57.3) und folgt dem Muster im Repo (z. B. `src/routes/config/categories/CategoryReason.svelte`). Der Import `RunSummary, { type Summary }` passt dazu. Stepper: Der leere Wert-Span eines erledigten Schritts ohne Wert (Schritt 4 «Vorschau») enthält nur zusammenfallenden Leerraum, und die Zeile in `flex-col` ohne `gap` hat damit keine Höhe. Die Button-Höhe kommt von `min-h-12` und dem Icon, das Layout ändert sich also nicht. Der zugängliche Name wird getrimmt und bleibt «Vorschau (erledigt)». Keine Frage und kein Test verlangt das Fehlen des Spans (`grep wizard-step-value` findet nur `ui-navigation-parts.dom.test.ts:51`, und das prüft den ersten Span, der einen Wert hat). Es gibt keine neuen Texte, Tokens oder Tests. Die Persona-Nachprüfung in sven-663.md ist Doku und passt zum Code (P-1, P-2).

## Nicht bestätigt

- Gelesen, nicht gerendert: dass der leere Span in Chromium wirklich keine Höhe hat und axe dort nichts meldet. Beurteilt nach dem Template in `src/lib/ui/Stepper.svelte:49-58`.
- Vom Aufrufer gemeldet: fallow audit «No issues in 26 changed files», `bun run check`, lint, fitness, `bunx vitest run` (4125 passed), E2E chromium statement-generate.feature und contract-detail.feature (150 passed).
