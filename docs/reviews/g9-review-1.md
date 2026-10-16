# Review G-9 (6b535fc, `git diff HEAD~1 HEAD`)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `.claude/skills/tdd/SKILL.md:30` | «fix what the new code reveals about existing code» fordert jetzt, bestehenden Code zu ändern. Vorher stand dort nur «Consider …». Zugleich fällt das Gegengewicht «don't … refactor adjacent code» in `CLAUDE.md` weg. Das widerspricht dem Pflicht-Major von `code-reviewer.md:31` und der Duplikat-Regel in «When to ask» und `commit-gates`. |
| C-2 | Minor | `.claude/skills/tdd/SKILL.md:8` | «no mocks of Dwello's own modules» schreibt `docs/test-pyramid.md` eine Regel zu, die dort so nicht steht. Die Testpyramide erlaubt ausdrücklich `vi.mock` für das eigene Modul mit den Build-Zeit-Konstanten (Tabelle «Unit frontend», Regel «Build-time constants»). Besser auf die dortige Regel verweisen oder die Ausnahme nennen. |

## C-1 (Major)

**Warum falsch:** Der tdd-Skill wird bei jedem Slice geladen (CLAUDE.md, Workflow 2). Schritt 4 sagt nun ohne Einschränkung, man solle beheben, was der neue Code an bestehendem Code zeigt. Die Grenze dafür stand bisher in «Surgical changes» («don't reformat or refactor adjacent code»), und der Diff entfernt sie. Übrig bleiben drei Regeln, die dem neuen Wortlaut widersprechen:
- `code-reviewer.md:31` meldet «refactoring of untouched code» immer als Major.
- `CLAUDE.md` «When to ask» verlangt vorher eine Rückfrage: «before work outside the request … or a fix of a duplication finding in code the change only touches unless it is small and changes no behavior».
- `commit-gates/SKILL.md` sagt dasselbe für Fallow-Duplikate.

Die Anforderung verlangt nur eine Kürzung. Sie verlangt nicht, den Refactor-Schritt auf fremden Code auszuweiten.

**Wie es scheitert:** Eine Session folgt Schritt 4 und räumt eine Funktion auf, die der neue Code als unschön zeigt, die der Slice aber nicht berührt. Der nächste `code-reviewer` meldet dafür nach `code-reviewer.md:31` einen Major. Das kostet eine Runde oder führt zu einer Rückfrage.

**Behebung:** Den alten Sinn wiederherstellen, z.B. «… and note what the new code reveals about existing code (fix it only in code the change touches, else «When to ask»)». Alternativ den Satzteil streichen.

## Geprüft und gedeckt (keine Befunde)

- **«state assumptions», «match the surrounding style»:** allgemein, keine Dwello-Regel.
- **«if a request has several readings, name them»:** gedeckt durch «When to ask», erster Punkt (fragen, wenn die Lesarten das Ergebnis ändern).
- **«push back when a simpler approach exists»:** gedeckt durch den Skill `ponytail` («Complex request? Ship the lazy version and question it») und Workflow 3.
- **«Stay in scope»:** Fragen vor Arbeit ausserhalb der Anfrage steht in «When to ask». Dass ein Punkt zu offener Arbeit wird, steht in «Open work» («A point you find but do not fix becomes an issue …»). Der Verweis in `CLAUDE.md:77` auf «Coding guidelines» zielt weiter auf die behaltene Regel zu entschiedenen Texten.
- **«Surgical changes»:**
  - «don't reformat»: Gotcha «Formatting».
  - «Remove what your change made unused»: Fallow (neue unbenutzte Exporte und Dateien), ESLint und `code-reviewer` («nothing unused left behind»).
  - «leave pre-existing dead code unless asked»: «When to ask» (Arbeit ausserhalb der Anfrage) und `code-reviewer.md:31`.
  - «don't refactor adjacent code»: siehe C-1.
- **tdd-Regeln:**
  - «One test at a time»: Z. 10–24 und Schritt 3.
  - Minimaler Code und nichts für künftige Tests: Schritte 2 und 3.
  - Tests über öffentliche Schnittstellen: Z. 8.
  - «Refactor only while green»: Schritt 4.
  - Ubiquitous Language, Plan-Checkliste und kein Warten auf Freigabe: Schritt 1.
  - Deep Modules und Commit-Hook: Schritt 1. `deepcheck:audit` steht weiter in CLAUDE.md, Workflow 3.
  - «respect ADRs»: Im Repo gibt es keine ADRs, der Satz war tot.
- **`mocking.md`:** Nur an Systemgrenzen mocken, die eigene Datenbank nie: `docs/test-pyramid.md` («No mocked database», «external systems are replaced at the boundary») und `backend/CLAUDE.md:33`. Zeit und Zufall nennt die Testpyramide nicht. Das ist allgemein, und kein Dwello-Text verweist darauf. Die Hinweise zu Dependency Injection und SDK-Schnittstellen sind allgemein.
- **`tests.md`, `refactoring.md`:** allgemeine Beispiele. Der Satz zur Spiegelung von Produktionslogik steht in der Testpyramide («No test copies production logic»).
- **Verweise:** Auf `mocking.md`, `tests.md`, `refactoring.md`, «Stay in scope» und «Surgical changes» verweisen nur noch historische Reports unter `docs/reviews/` und `docs/archive/` und der neue Plan-Eintrag. Kein Regel- oder Testfile verweist darauf (`grep -rn` über das Repo ohne `node_modules`).
- **`implementation_plan.md`:** Die Session ist angelegt und begründet, warum es kein Szenario gibt (nur Regeln). Die offenen Punkte stimmen mit dem Stand überein.
- **Nichts Fremdes im Diff.**

## Nicht bestätigt

- `bun run lint` und `bunx vitest run tools/deepcheck/test/readme.test.ts tools/claude-hooks/commit-msg-gate.test.ts src/__tests__/open-work.test.ts tools/open-work/check-issues.test.ts` (40 passed): vom Aufrufer gemeldet, nicht neu ausgeführt. Der Diff ändert nur Markdown, und kein Test liest die gelöschten Dateien (grep).
- Gelesen habe ich `ponytail`, `ponytail-review`, `commit-gates`, `code-reviewer.md`, `docs/test-pyramid.md` und `backend/CLAUDE.md`, aus `tests/e2e/CLAUDE.md` nur die Treffer zu mock/refactor. Die übrigen `ponytail-*`-Skills und `docs/design/arbeitsregeln.md` habe ich nur per grep auf die gestrichenen Regeln geprüft.
