# Code-Review guardrails, Runde 1 (ef3c937, `git diff origin/main ef3c937`)

Gelesen: `CLAUDE.md`, `.claude/agents/code-reviewer.md`, `implementation_plan.md` (alle Dateien im Diff), dazu `.claude/skills/slice-review/SKILL.md`, `.claude/skills/tdd/SKILL.md`, `tests/e2e/CLAUDE.md`, `backend/CLAUDE.md`, die übrigen Agents, `.claude/hooks/commit-msg-gate.mjs`, `tools/release/next-version.mjs`, `src/__tests__/open-work.test.ts`, `docs/test-pyramid.md`, `.github/ISSUE_TEMPLATE/*`, die Liste `docs/reviews/workflow-rules-review-*`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | CLAUDE.md:76 (Workflow 9), CLAUDE.md:67 (Workflow 6) | Die abschliessende Runde ist nicht begrenzt: Wer Minors/Nits aus der abschliessenden Runde behebt, hat wieder Code seit dem letzten geprüften Commit geändert und braucht deshalb eine weitere abschliessende Runde. Jede dieser Runden ist «its own slice», damit fängt die Rundenzählung von Schritt 7 jedes Mal neu an. |
| C-2 | Minor | docs/test-pyramid.md:38 | «a simulation in a scratch repository, recorded in the plan, is the red and green of a fix»: Hier steht der Rot-Nachweis noch im Plan. Nach Workflow 1/2 gehört er jetzt in die Commit-Nachricht (`Red:`). |
| C-3 | Minor | CLAUDE.md:71 | Die gesammelte Review liest nur `workflow-rules-review-issue-*.md`. Ältere Reviews pro Aufgabe mit Kurznamen fehlen damit, z. B. `docs/reviews/workflow-rules-review-migrations-frozen.md`. Laut alter Regel war ein Kurzname erlaubt, wenn es kein Issue gab. |
| C-4 | Minor | CLAUDE.md:71 | Der Antrag erlaubt ohne Bedingung, das Entfernen oder Kürzen von Regeln vorzuschlagen. Der Text bindet das an zwei Bedingungen: «whose cost the notes show and which caught nothing in the reports since it exists». Das ist enger als vom Product Owner verlangt. |
| C-5 | Nit | CLAUDE.md:89 | «findings of the workflow review in step 7 stay in its report»: Schritt 7 kennt jetzt Notizen und eine gesammelte Review. Besser wäre «in their file» o. ä. |
| C-6 | Nit | CLAUDE.md:71 | `workflow-rules-review-<YYYY-MM-DD>.md`: Zwei gesammelte Reviews am selben Tag hätten denselben Namen. |
| C-7 | Nit | .claude/agents/code-reviewer.md:17 | «`implementation_plan.md` holds only the current session» steht jetzt unter «Red notes», obwohl es mit Rot-Nachweisen nichts zu tun hat. |

## C-1 (Major): abschliessende Runde ohne Ende

Was der Antrag verlangt: Behobene Minors/Nits bekommen keine eigene Runde, sondern «one closing code-reviewer round before the push».

Was der Text sagt:
- Workflow 9: «before each push … when code (as in step 6) changed since the last reviewed commit (Minor/Nit fixes, …), runs one closing `code-reviewer` round on that delta, its own slice for the round limit (step 7)».
- Workflow 6: «Fixes of Minors/Nits get no review round of their own: … the closing `code-reviewer` round before the push reviews them together».

So zeigt sich der Fehler, wenn man den Text wörtlich durchgeht:
1. Die abschliessende Runde A meldet nur den Minor C-x.
2. Der Agent behebt C-x in `src/`.
3. Vor dem Push gilt wieder «code changed since the last reviewed commit». Also folgt die abschliessende Runde B, und sie ist wieder «its own slice».
4. Meldet B einen Nit und wird dieser behoben, folgt Runde C, und so weiter.

Die Regel aus Schritt 7, nach der höchstens 3 Runden pro Slice laufen, greift dabei nie: Jede abschliessende Runde ist ein neuer Slice. Auch der Satz «If after its 3rd round it reports only Minors/Nits of a kind it found before … end the review» greift nicht, denn keine dieser Runden ist die 3. auf demselben Slice. Statt «one closing round» können es also beliebig viele werden, und der Aufwand bleibt bestehen, den Vorschlag 1 abschaffen soll.

Behebung (Vorschlag): Festhalten, dass Minor/Nit-Fixes aus der abschliessenden Runde selbst keine weitere Runde auslösen. Sie werden behoben oder werden zu offener Arbeit. Eine weitere Runde gibt es nur für einen Blocker/Major-Fix, und dann gilt die Rundenzählung desselben Slices. Alternativ zählen alle abschliessenden Runden vor einem Push als ein Slice.

## Bestätigt durch den geänderten Text

- **Vorschlag 1:** Erneut geprüft wird nur nach einem Blocker/Major-Fix (Workflow 6). Fixes von Befunden der Feature-Review: Runde nur bei Blocker/Major, sonst deckt sie die abschliessende Runde ab (Workflow 7). Die abschliessende Runde läuft vor dem Push (Workflow 9). Die Rundenzählung ist mit Schritt 7 stimmig, abgesehen von C-1.
- **Vorschlag 2:** `Red:`-Zeilen gehören in die Commit-Nachricht (Workflow 1, 2). Die Notiz `Skills:` ist entfallen (Workflow 3). In `code-reviewer.md` ist ein fehlender Rot-Nachweis «Minor …, never more», und die Szenario-Pflicht bleibt Major. Keine andere Regeldatei verweist noch auf `Scenario red`/`Test red`/`Skills:`, ausgenommen C-2. `commit-msg-gate.mjs` prüft nur die erste Zeile (Z. 63). Den Message-Körper mit `Red:`-Zeilen lässt er durch, auch mehrzeilige `-m` und Heredoc. `tools/release/next-version.mjs` erkennt `Red:`-Zeilen nicht als Breaking Change (nur `^BREAKING[ -]CHANGE:`).
- **Vorschlag 3:** Notizen pro Aufgabe nur, wenn etwas auffiel. Gesammelte Review auf Wunsch oder am Ende einer Anfrage mit mehreren Issues. Vorschläge zum Entfernen und Kürzen sind erlaubt, siehe aber C-4. Die Regel «only write, I decide» bleibt bestehen.
- **Abschlusspunkte bleiben bestehen:** Szenario (Workflow 1, Major in `code-reviewer.md`), Slice-Review (4), Feature-Review (5), Rundenregel (7), Checks vor dem Abschluss.
- **slice-review-Skill:** Die Plan-Zeile pro Runde und die Angaben für eine erneute Prüfung bleiben gültig, ein Widerspruch entsteht nicht. Eine Anleitung, wie die abschliessende Runde gestartet wird (Bereich seit dem letzten geprüften Commit), fehlt dort. Workflow 9 nennt das aber selbst.
- **`implementation_plan.md`:** eine Session (`open-work.test.ts`, Z. 43–44). Der Hinweis «no scenario and no workflow review» passt zu Workflow 1 und 7, denn die Aufgabe ändert nur Regeln.

## Nicht bestätigt

- `bun run test:coverage`, `bun run lint`, `bun run check`, `cd backend && bun run test` (680 pass), `bun run type-check`: vom Aufrufer gemeldet.
- Selbst erneut ausgeführt: `bunx vitest run src/__tests__/open-work.test.ts tools/claude-hooks/commit-msg-gate.test.ts`, 28 von 28 grün.
- Ob CI (`tools/open-work/check-issues.mjs`) für den PR `No scenario: <reason>` braucht: Die Aufgabe hat kein Issue (`Fixes #n`), daher nicht geprüft.
