# Code-Review #1068, Runde 2 (Abschlussrunde)

Bereich: `git diff b96cb09 96b28a2 -- . ':!docs'` (96b28a2), Worktree `review-1068-code2`.

Geschlossen: C-1, C-2

Keine neuen Befunde (keine Blocker, keine Major, keine Minor).

Geprüft: C-1: Der neue DOM-Test (statement-wizard.dom.test.ts:1955-1968) deckt beide Teile der Bedingung in BuildingStep.svelte:34 ab. Ohne `billed[b.id]?.billed` zeigt b1 (0 abgerechnet) den Hinweis, ohne `!unchoosable(...)` zeigt ihn b2 (`otherPeriod`, `unchoosable` in src/lib/statement-wizard.ts:135). In beiden Fällen wird der Test rot. C-2 / Sven P-2: `id="buildings-recalculate"` (Z. 139) ist eindeutig und steht in `describedBy` der Gruppe (Z. 35-39), aber nur, wenn der Satz angezeigt wird. Die Prüfung steht in Z. 1984-1987. Das Verschieben von `recalculate` vor `describedBy` ändert kein Verhalten. Sven P-1: Der Hinweis steht jetzt als erste ID in der Beschreibung der Checkbox (BuildingChoice.svelte:71-74, Test Z. 1797-1798). Ohne Hinweis bleibt die Reihenfolge «Zählungen, Fehler» wie bisher (Test Z. 2066). Ein Fehler steht jetzt nach dem Hinweis statt davor, und die Gruppe liest ihn zusätzlich vor. Die Beschreibung der Checkbox bleibt ein einziger Satz. Neue Texte und `data-testid` gibt es keine. ponytail-review findet nichts, und nichts liegt ausserhalb der Anforderung.

## Nicht bestätigt

- Diese Checks meldet nur der Aufrufer: lint, svelte-check (0 Fehler), statement-wizard.dom.test.ts (102 bestanden), E2E Chromium statement-generate.feature (94 bestanden), axe- und Sprachzeilen «statement-generate buildings*» (6 bestanden). Ebenso nur gemeldet sind die roten Läufe: die beiden Prüfungen der Reihenfolge vor der Änderung und der C-1-Test ohne `!unchoosable`. Nach dem Lesen des Codes werden sie rot.
- Ob Screenreader `aria-describedby` an einem `fieldset` beim Eintritt in die Gruppe vorlesen, habe ich nicht geprüft. Der Code nutzt dasselbe Muster wie `buildings-counts-failed` (#738, Sven P-1).
- `Spec change approved: #1068` im Text des Pull Requests ist weiterhin offen, wie in Runde 1 (es gibt noch keinen Pull Request).
