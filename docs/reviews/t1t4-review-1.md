# Review T1/T4 (600f25e5..5faa7692), Runde 1

Geprüft: alle fünf geänderten Dateien (`CLAUDE.md`, `.claude/skills/pull-request/SKILL.md`, `.claude/skills/slice-review/SKILL.md`, `implementation_plan.md`, `docs/reviews/workflow-rules-review-2026-10-17-2.md` Abschnitte T1 und T4), dazu Workflow 4 bis 7, "Done means", `slice-review` "Triage", `.claude/agents/*`, `workflow-review`.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | .claude/skills/pull-request/SKILL.md:20 | Der Ausschluss `':!docs/design/personas'` nimmt auch `docs/design/personas/README.md` aus dem Bereich der Schlussrunde, ein verbindliches Regeldokument (`workflow-review` Z. 8, `persona.md` Z. 8). T4 meint die Persona-Berichte; enger wäre z. B. `':!docs/design/personas/*-*.md'` oder ein Zusatz «README.md bleibt im Bereich». |
| C-2 | Minor | .claude/skills/slice-review/SKILL.md:41 | T1 hängt jetzt an der Schwere, der Vorschlag in T1 (Review-Dokument Z. 46) an «fügt Verhalten hinzu». Eine Minor-Korrektur mit neuem Verhalten (z. B. neuer Hilfetext mit Test) ist laut Workflow 4 eine «coherent group of behaviors» und damit ein Slice; die zwei Regeln lesen sich dort gegensätzlich. Prüfen wird sie trotzdem die Schlussrunde, es geht also nichts verloren. Die Formulierung entspricht aber der Anforderung des Aufrufers. |
| C-3 | Nit | .claude/skills/pull-request/SKILL.md:20 | «needs none» für die vier Pfade wiederholt nur, was der Auslöser «when code (`src/`, …) changed» schon sagt (keiner der vier Pfade steht in der Code-Liste). Neu wirkt allein der Bereichsausschluss. Harmlos, aber zweimal gesagt. |
| C-4 | Nit | CLAUDE.md:71 | «reports and the plan alone need none» nennt zwei der vier Pfade (Archiv fehlt; mit «reports» sind die Persona-Berichte mitgemeint). Der Verweis auf `pull-request` deckt das ab. |

Keine Blocker/Major.

## Bestätigt

- T1: `slice-review` "Rounds" sagt, dass Korrekturen von Feature-Review-Blockern/-Majors ein neuer Slice sind und Minor/Nit-Korrekturen keine eigene Runde bekommen, sondern von der Schlussrunde geprüft werden. Workflow 7 ergänzt «Minor/Nit fixes included». Kein Widerspruch zu Workflow 6, zu "Done means" («a Minor/Nit is fixed when trivial») oder zur Rundenbegrenzung. Das Prüfen nur von Blocker/Major-Korrekturen (Workflow 7) bleibt unverändert.
- T4: `pull-request` "Before each push" Schritt 2 sagt, dass ein Delta nur in den vier Pfaden keine Runde braucht und dass der Bereich einer Runde diese Pfade auslässt. Workflow 7 verweist darauf.
- Pathspec: korrekte Git-Syntax (`--` und `.` vor den `:!`-Ausschlüssen, Ausschlüsse in einfachen Anführungszeichen, also keine History-Expansion). Ich habe `git diff --stat 600f25e5 5faa7692 -- . ':!docs/reviews' ':!docs/design/personas' ':!implementation_plan.md' ':!docs/archive'` im Worktree selbst ausgeführt: Es zeigt genau `CLAUDE.md` und die zwei Skills, Review-Dokument und Plan fehlen wie gewollt.
- Plan: Die Session hat nach Workflow 8 Punkte für T1/T4, die Review-Runde und die Archivierung.
- Kein Szenario nötig (nur Regeln, kein App-Verhalten). Nichts im Diff hat mit der Anforderung nichts zu tun.

## Nicht bestätigt

- Die Tests `open-work.test.ts`, `e2e-screenplay-lint.test.ts`, `tools/deepcheck/test/readme.test.ts`, `commit-msg-gate.test.ts` und `check-issues.test.ts` (94 Tests) sind vom Aufrufer gemeldet, nicht neu ausgeführt.
- Ob der Product Owner T1 nach Schwere (wie umgesetzt) oder nach Verhalten (wie im Vorschlag) gemeint hat: Ich habe nur die Anforderung des Aufrufers und das Review-Dokument gesehen, siehe C-2.
