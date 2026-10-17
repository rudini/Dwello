# Code-Review t3t2t6, Runde 3 (`git diff 27ca9454 277d8acd`)

Vorheriger Bericht: `docs/reviews/t3t2t6-review-2.md`.

## Stand der offenen IDs

| ID | Schwere | Stand | Beleg |
|---|---|---|---|
| C-6 | Major | behoben | `.claude/skills/pull-request/SKILL.md:20` nennt jetzt drei Teile: `git diff <last reviewed> <merge>^1` für die eigenen Commits vor dem Merge (die Minor/Nit-Fixes sind damit drin), `git show --remerge-diff <merge>` für die Konfliktauflösung und `git diff <merge> <commit>` für das, was nach dem Merge kommt. Der hereingeholte `main` fehlt im Bereich. Am Merge 6449fb23 (`Merge remote-tracking branch 'origin/main' into ccr-…`) ist der erste Parent 69fd94b9 die Spitze des Branches. `<merge>^1` ist also das Ende der eigenen Arbeit. `git show --remerge-diff 6449fb23` läuft im Worktree (Git 2.43) und zeigt nur die Auflösung (eine Datei). |
| C-5 | Nit | bleibt wie vereinbart | – |
| C-7 | Nit | bleibt wie vereinbart | – |

## Neue Befunde im Delta

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-8 | Nit | `.claude/skills/pull-request/SKILL.md:20` | Die drei Befehle für den Merge-Fall haben den Pfadausschluss nicht (`-- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'`), obwohl der Satz davor ihn für den Bereich verlangt. Bei 6449fb23 betrifft die Konfliktauflösung zum Beispiel nur `docs/archive/implementation-plan-verlauf.md`. Vorschlag: «each with the same pathspec». |

## Geprüft

- Alle Dateien im Delta habe ich gelesen: `.claude/skills/pull-request/SKILL.md` (Zeilen 15–30 im Zusammenhang), `docs/reviews/t3t2t6-review-2.md` (hier nur abgelegt, unverändert gegenüber dem Bericht aus Runde 2) und `implementation_plan.md`. Im Plan ist Runde 2 abgehakt und beschreibt den Fix richtig. Runde 3 ist offen. Das passt.
- Kein anderer Ort in `CLAUDE.md`, `.claude/` oder `docs/*.md` nennt einen Bereich um einen Merge, der jetzt widersprechen könnte (grep nach «remerge», «first parent», «merge>^1»).
- Grenzfall ohne Commit zwischen dem letzten geprüften Commit und dem Merge: `git diff <last reviewed> <merge>^1` ist leer. Das stimmt.
- Commit-Betreff `docs(config): fix closing range around a merge`: 46 Zeichen, hält die Konvention ein.
- Nichts im Delta ist fremd zur Anforderung.

## Nicht bestätigt

- `bunx vitest run src/__tests__/open-work.test.ts` (5 Tests) ist **vom Aufrufer gemeldet**. Ich habe es nicht erneut ausgeführt, weil der Delta nur Regeltext ändert.
- Die Merge-Semantik habe ich nur an 6449fb23 und 600f25e5 aus der Historie geprüft. 600f25e5 ist ein Merge eines Pull Requests auf `main` und gehört nicht zum Fall des Branches. Einen echten Ablauf mit A, Fix und Merge habe ich nicht nachgestellt, weil ausser dem Bericht nichts geschrieben werden darf.
