# Code-Review G-11 (ab74c6c, `git diff HEAD~1 HEAD`)

Geprüft: `.claude/skills/tdd/SKILL.md` (3 Zeilen), `implementation_plan.md` (neue Session). Sonst nichts geändert.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | `.claude/skills/tdd/tests.md:22`, `:44`; `.claude/skills/bdd-acceptance/SKILL.md:179` | «WHAT, not HOW» / «HOW not WHAT» / «Describe WHAT, never HOW»: weitere Grossschreibung zur Betonung in Regeldateien. G-11 nennt sie nicht (es hält die tdd-Stellen fälschlich für die «einzige»), sie bleiben also nach dem Wortlaut der Anforderung. Die Prüffrage des Aufrufers («keine andere Grossschreibung zur Betonung») gilt deshalb nicht. Als offene Arbeit festhalten oder in diesem Slice mitnehmen. |
| C-2 | Nit | `.claude/skills/ponytail/SKILL.md:8`, `:13`, `:90`; `ponytail-help/SKILL.md:11`; `ponytail-gain/SKILL.md:13`, `:41` | «ANY», «Do NOT», «NEVER»: Das ist ein mitgeliefertes Fremd-Plugin (`ponytail/LICENSE`, `.claude/settings.json:11-20`, Repo DietrichGebert/ponytail). Richtig, dass es unverändert bleibt; im PR erwähnen, damit «einzige Grossschreibung» nicht als vollständig gilt. |

Keine Blocker oder Majors.

## Inhalt geprüft

- `:20` «Do not write all tests first and then all implementation.»: Bedeutung gleich. Die Begründung steht wie bisher direkt danach («This produces crap tests …»).
- `:62` «Write one test that confirms one thing»: Bedeutung gleich. Einen eigenen Grund gibt die Zeile nicht, aber der Abschnitt darunter («tracer bullet – proves the path works end-to-end») und die Anti-Pattern-Liste begründen es. Das reicht.
- `:97` «Refactor only while green: with a red test, a failure no longer tells whether the refactoring or the missing code caused it.»: verbietet das Refactoring bei rotem Test weiterhin («only while green»), und der Grund stimmt (ein roter Test kann dann nicht mehr anzeigen, ob das Refactoring etwas kaputt gemacht hat). «Get to GREEN first» fällt weg, ist aber in «only while green» enthalten.
- Beispiel-Labels (RED:/GREEN:, WRONG/RIGHT) unverändert.
- `implementation_plan.md`: nur die Checkliste der Session, passt zu Workflow 8. Formatierung und Code sonst unberührt.

## Nicht bestätigt

- `bun run lint` 0 und `bunx vitest run src/__tests__/open-work.test.ts` 0: vom Aufrufer gemeldet, nicht erneut ausgeführt (die Änderung ist reiner Text in einer Skill-Datei und im Plan).
- Grossschreibung gesucht mit grep nach Wörtern aus 3+ Grossbuchstaben in `CLAUDE.md`, `tests/e2e/CLAUDE.md`, `backend/CLAUDE.md`, `.claude/agents`, `.claude/skills` (`*.md`). Abkürzungen (API, SQL, YAGNI …) und Beispiel-Labels habe ich von Hand aussortiert. Wörter mit zwei Buchstaben (z. B. «NO») habe ich nicht gesucht.
