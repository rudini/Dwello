# Code-Review 1130, Runde 2 (Abschlussrunde vor dem Push)

Bereich: `git diff e31f71c 5e3c291`

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Der Diff entfernt in `src/routes/contracts/new/ContractsUnknown.svelte:51` und `src/routes/statements/generate/SettingsStep.svelte:81` nur die Marker. Beide Kommentare bleiben vollständige Sätze, die weiterhin stimmen (#666 und #659). In `src`, `backend`, `tests` und `tools` passt keine Zeile mehr auf das Muster `TODO(fachlich prüfen, #…)` aus `tools/open-work/check-issues.mjs:17,27`, das #1130 oder #1142 nennt. Zwei Stellen nennen #1142 noch: `tests/e2e/features/contract-new.feature:87` und `tests/e2e/steps/contract-form.steps.ts:317`. Beide verweisen auf die Glossarzeile und beschreiben keine offene Arbeit, und der Check erkennt sie nicht als Marker. Treffer in `docs/reviews/*.md` sind ältere Berichte, die so bleiben, und liegen ausserhalb des Suchbereichs des Checks. Der Diff enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- Laut Aufrufer liefen `bun run lint`, `open-work.test.ts` und die Commit-Hooks durch; selbst ausgeführt habe ich sie nicht.
- `tools/open-work/check-issues.mjs` mit `GITHUB_TOKEN` (Issue-Status und «PR schliesst kein Issue, das ein Marker nennt») läuft nur in CI. Ich habe nur das Muster gelesen und gegen den Baum geprüft.
