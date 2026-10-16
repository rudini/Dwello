# Code-Review guardrails, Runde 2 (Delta `git diff ef3c937 d609462`)

Worktree `review-guardrails-code-2`, HEAD `d609462`. Gelesen habe ich alle fünf Dateien im Delta: `CLAUDE.md` (Workflow 6, 7, 9, «Open work»), `.claude/agents/code-reviewer.md`, `docs/test-pyramid.md`, `docs/reviews/guardrails-review-1.md` (neu, Kopie des Berichts aus Runde 1), `implementation_plan.md`. Dazu `.claude/skills/slice-review/SKILL.md` (Namen der Berichte), die Liste `docs/reviews/workflow-*` und die Commit-Nachricht von `d609462`.

## Status der Befunde aus Runde 1

| ID | Schwere | Status | Beleg |
|----|---------|--------|-------|
| C-1 | Major | behoben | CLAUDE.md:76: «Minor/Nit fixes from the closing round get no further round (fix them or record them as open work), only a Blocker/Major fix does, counted on the same slice». Die Schleife aus Runde 1 (A → Minor-Fix → B → …) endet damit nach der ersten abschliessenden Runde, die nur Minors/Nits meldet. |
| C-2 | Minor | behoben | docs/test-pyramid.md:38 «recorded in the commit message (`Red:`, `CLAUDE.md` Workflow 2)»; Workflow 2 (CLAUDE.md:56) nennt `Red:` in der Commit-Nachricht. Keine Regeldatei ausserhalb von `docs/archive` und `docs/reviews` nennt noch `Test red`/`Scenario red`/`Skills:` (nur die Checkliste in `implementation_plan.md:10`, die den alten Stand beschreibt). |
| C-3 | Minor | behoben, siehe C-8 | CLAUDE.md:71 liest jetzt `workflow-rules-review-*.md` ausser den datierten; `workflow-rules-review-migrations-frozen.md` ist erfasst. |
| C-4 | Minor | behoben | CLAUDE.md:71: «A proposal may also remove or shorten a rule; it names the cost the notes show and what the rule caught in the reports.» Keine Bedingung mehr, nur eine Begründungspflicht. Das passt zum Antrag. |
| C-5 | Nit | behoben | CLAUDE.md:89 «findings of the workflow notes and reviews in step 7 stay in their files». |
| C-6 | Nit | behoben | CLAUDE.md:71 «(`-2` for a second one that day)». |
| C-7 | Nit | behoben | .claude/agents/code-reviewer.md:17–18: eigene Zeile «Plan (Minor)», getrennt von «Red notes». |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-8 | Minor | CLAUDE.md:71 | `workflow-rules-review-*.md` erfasst auch Code-Review-Berichte eines Slices mit dem Namen «workflow-rules» (Benennung `<slice>-review-<n>.md` aus `slice-review/SKILL.md`:24). Beispiele: `docs/reviews/workflow-rules-review-1.md` und `-9.md` sind Code-Review-Runden, `-5.md` dagegen ist eine Workflow-Review pro Aufgabe. Die erste gesammelte Review müsste diese Berichte von Hand aussortieren. Vorschlag: die Dateien mit Nummer und Rundenberichte ausdrücklich ausnehmen, oder für die gesammelte Review bestimmte Dateien nennen. |
| C-9 | Nit | CLAUDE.md:76 | «from the closing round» lässt offen, ob damit auch Runde 2 und 3 auf dem abschliessenden Slice gemeint sind, also die Runden nach einem Blocker/Major-Fix. Liest man es nur als erste Runde, löst ein Minor-Fix aus Runde 2 wieder «code changed since the last reviewed commit» aus, und es folgt eine neue abschliessende Runde als «its own slice». Endlos wird das nicht, denn jede neue Schleife braucht zuerst einen Blocker/Major. Klarer wäre «from a round on the closing slice». |
| C-10 | Nit | CLAUDE.md:67 | Workflow 6: «the closing `code-reviewer` round before the push reviews them together». Minor/Nit-Fixes aus der abschliessenden Runde selbst bleiben aber ungeprüft, so wie Workflow 9 es jetzt will. Der Satz in Workflow 6 klingt absoluter als die Regel. Ein Verweis würde genügen, etwa «(except fixes from that round, step 9)». |

Keine Blocker und keine Majors.

## Endet die abschliessende Runde jetzt? Passt «counted on the same slice» zu Schritt 7?

- **Ende:** ja. Workflow 9 zählt die abschliessende Runde als eigenen Slice (Runde 1). Fixes von Minors/Nits aus dieser Runde lösen keine weitere Runde aus. Nur ein Fix für einen Blocker/Major führt zu Runde 2 auf demselben Slice. Bei einem späteren Push nach einem CI-Fix gilt «before each push» wieder. Dann läuft eine neue abschliessende Runde als eigener Slice, über die Regel «a fourth round of CI fixes» bleibt das begrenzt.
- **Rundengrenze:** «counted on the same slice» passt zu Schritt 7 («A round is one run of one reviewer on one slice»). Für den abschliessenden Slice gelten damit die Grenze von 3 Runden, die Ausnahme mit Test oder Delta-Review in Runde 3 und das Ende bei wiederholten Minors/Nits. Offen ist nur die Lesart in C-9.
- **Antrag 1 bis 3:** Mit dem Delta bleibt die Bestätigung aus Runde 1 gültig. Erneut geprüft wird nur nach einem Blocker/Major-Fix, die abschliessende Runde läuft genau einmal. `Red:` steht in der Commit-Nachricht, ein fehlender Nachweis ist nur Minor. Notizen gibt es nur, wenn etwas auffiel, und Vorschläge zum Entfernen oder Kürzen von Regeln sind ohne Bedingung erlaubt.
- **Plan:** Die Zeile für Runde 1 hat das Format aus `slice-review` und nennt den Status aller sieben Befunde. Der Bericht aus Runde 1 liegt unter `docs/reviews/`. Die Session ist die einzige im Plan.
- **Nichts Fremdes im Delta:** Jede Änderung beantwortet einen der Befunde C-1 bis C-7.

## Nicht bestätigt

- `bun run lint` (exit 0) und `bunx vitest run src/__tests__/open-work.test.ts tools/claude-hooks/commit-msg-gate.test.ts` (28 passed) auf `d609462`: vom Aufrufer gemeldet, nicht selbst ausgeführt. Das Delta ändert nur Markdown, bei Plan und Berichten prüft das `open-work.test.ts`. Dort sehe ich keinen Grund für einen Zweifel.
- Die vollständigen Suiten auf `ef3c937`: vom Aufrufer gemeldet.
