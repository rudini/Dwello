# Review G-9, Runde 2 (Delta `git diff 6b535fc 6911662`)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | – | `.claude/skills/tdd/SKILL.md:30` | Behoben. Schritt 4 begrenzt das Refactoring auf «the code the change touches». Ein Problem in Code, den die Änderung nicht berührt, wird vorher erfragt oder wird offene Arbeit (verweist auf «When to ask»). Das passt zu `code-reviewer.md:31` («refactoring of untouched code» als Major), zu `CLAUDE.md:78` und zu «Open work». |
| C-2 | – | `.claude/skills/tdd/SKILL.md:8` | Behoben. «with the few allowed mocks: `docs/test-pyramid.md` (never a mocked database; outside systems replaced at the boundary)» stimmt mit `docs/test-pyramid.md:33,39,40,81` überein (`vi.mock` für `$app/*` und für das Modul mit den Build-Zeit-Konstanten). |
| C-3 | Nit | `.claude/skills/tdd/SKILL.md:30` | «remove duplication … in the code the change touches» übernimmt nicht die Bedingung aus `CLAUDE.md:78` und `commit-gates/SKILL.md:14`: Eine Duplikation in Code, den die Änderung nur berührt, wird ohne Rückfrage nur behoben, wenn der Fix klein ist (und im Plan vermerkt wird). Weil ein Refactoring das Verhalten nie ändert, bleibt als Lücke nur «small». Eine Session, die sich nur an tdd hält, könnte eine grosse Duplikation im nur berührten Code ohne Rückfrage zusammenführen. Ein Zusatz wie «(a duplication in code the change only touches: skill `commit-gates`)» würde die Lücke schliessen. |

Neu im Delta, ohne Befund:
- `docs/reviews/g9-review-1.md` ist der Bericht aus Runde 1. Dass er nach `docs/reviews/` kopiert wird, verlangt `slice-review/SKILL.md:35`.
- `implementation_plan.md:11`: Der Plan-Eintrag gibt den Stand richtig wieder. Er bleibt offen, solange Runde 2 läuft.
- Nichts im Delta gehört nicht zur Anforderung.

## Nicht bestätigt

- `bunx vitest run src/__tests__/open-work.test.ts` (0 Fehler vor dem Commit): vom Aufrufer gemeldet, nicht neu ausgeführt. Das Delta ändert nur Markdown. Der Plan behält seine Form: eine Session, Checkliste mit `- [ ]`/`- [x]`.
- `bun run lint`: vom Aufrufer nicht erneut ausgeführt, von mir auch nicht (nur Markdown).
- Gelesen: das ganze Delta, `CLAUDE.md:78`, `code-reviewer.md:31`, `commit-gates/SKILL.md:12-14`, `docs/test-pyramid.md` (Treffer zu mock/boundary), `slice-review/SKILL.md:24,35`.
