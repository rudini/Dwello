# Code-Review: code-reviewer meldet keine Nits (Runde 1)

Bereich: `git diff 6b8741eb 557a9d87` (Commit 557a9d87). Geänderte Dateien: `.claude/agents/code-reviewer.md`, `implementation_plan.md`. Beide gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | .claude/agents/code-reviewer.md:16, :35 | Die beiden Zeilen widersprechen sich. Zeile 16 macht alle ponytail-Befunde zu Minors, nennt als Beispiel «a duplicate». Zeile 35 schliesst «redundancy that change nothing» aus dem Bericht aus. Die ponytail-Tags `shrink:` (gleiche Logik, weniger Zeilen), `stdlib:` und `native:` sind genau solche Redundanz ohne Defekt. Nach Zeile 16 wären sie Minors, nach Zeile 35 gehören sie nicht in den Bericht. Die Anforderung sagt «only those Minors that are real defects». Vorschlag für Zeile 16: «its findings are Minors when they are a defect of Zeile 35 (unused code, a duplicate of an existing helper), else they stay out». |

## Prüfung der Anforderung

- Bestätigt (geänderter Text, Zeile 35): Die Schweregrade sind Blocker / Major / Minor. «Minor» ist als echter Defekt definiert, Nits sind ausdrücklich ausgeschlossen, mit Begründung.
- Bestätigt: `CLAUDE.md` ist im Diff nicht geändert.
- Andere Regeln, gesucht mit `grep` nach «Nit» in `CLAUDE.md`, `.claude/`, `tools/`, `src/__tests__/`, `tests/e2e/CLAUDE.md`, `backend/CLAUDE.md` und `docs/test-pyramid.md`:
  - `CLAUDE.md:56` («a Minor/Nit is fixed when trivial») und `:72` («Minor/Nit fixes included») gelten für alle Reviewer. Personas, fach-reviewer und daten-pruefer melden weiterhin Nits. Kein Widerspruch.
  - `.claude/skills/slice-review/SKILL.md:37` («Every report gives severity (Blocker / Major / Minor / Nit)») nennt die Menge aller Berichte. Ein code-reviewer-Bericht ohne Nits erfüllt das. `:41` (Minor/Nit-Fixes ohne eigene Runde) gilt allgemein. Kein Widerspruch.
  - `.claude/skills/pull-request/SKILL.md:20` («Minor/Nit fixes») beschreibt den Inhalt eines Deltas aus allen Reviews. Kein Widerspruch.
  - `persona.md:20`, `daten-pruefer.md:17` und `fach-reviewer.md:23-24` behalten Nit, wie die Anforderung es will.
  - Kein Test und kein Tool liest `.claude/agents/code-reviewer.md` oder dessen Schweregrade (gesucht in `src`, `tools`, `tests`, `backend/src`, `.github`).
- Bestätigt (`implementation_plan.md`): Die Basis hat keine `## Session`, die neue ist die einzige, wie `open-work.test.ts` es verlangt. Die Planzeilen entsprechen dem Diff.
- «No scenario: agent instructions only»: angemessen, das Verhalten der App ändert sich nicht. Kein Test rot zu sehen, weil sich nur Anweisungstext ändert.
- Der Diff enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- `bunx vitest run src/__tests__/open-work.test.ts` (5 bestanden): vom Aufrufer gemeldet. Selbst ausführen konnte ich ihn nicht, weil der Zugriff auf `node_modules` durch eine Berechtigungsregel gesperrt ist. Durch Lesen bestätigt: genau eine Session im Plan.
