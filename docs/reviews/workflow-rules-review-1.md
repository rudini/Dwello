# Review: Workflow-Regeln E1 (a), E2, E8, E10–E13 (Runde 1)

Bereich: `git diff 2e5eb07..bd84256` (Commit bd84256, Branch claude/workflow-improvements).
Gelesen: alle sechs geänderten Dateien (`CLAUDE.md`, `docs/test-pyramid.md`, `tests/e2e/CLAUDE.md`, `.claude/skills/bdd-acceptance/SKILL.md`, `implementation_plan.md`, `docs/archive/implementation-plan-verlauf.md`), dazu `eslint.config.js`, `.claude/agents/*.md`, `backend/CLAUDE.md`, `.claude/skills/*/SKILL.md` (per Suche), `.github/ISSUE_TEMPLATE/*` (per Suche), `tools/open-work/check-issues.mjs`.

## Blocker/Major

Keine.

Geprüft und bestätigt:
- E1 (a): `CLAUDE.md:53`, `docs/test-pyramid.md:30`, `tests/e2e/CLAUDE.md:30`, `.claude/skills/bdd-acceptance/SKILL.md:21` sagen dasselbe: Fehlerzustand bekommt ein Szenario, genau eine Anfrage wird an der Browsergrenze mit Fehlerstatus beantwortet, nie mit erfundenen Daten. Der frühere Widerspruch «no API mocks» ohne Ausnahme ist aufgelöst. Lint: `route`/`unroute` stehen in `playwrightActions` (`eslint.config.js:11`) und sind damit in `steps/` (`:156`), `tasks/`/`questions/` (`:181`), `fixtures/` (`:200`) und `targets/` (`:235`) verboten; nur `screenplay/` ist frei. Die Vorgabe «über eine Interaction in `tests/e2e/screenplay/`» ist also durchsetzbar. Die Persona-Anweisung (`.claude/agents/persona.md:12`, `route.fulfill({ status: 500 })`, ohne Body) passt dazu.
- E2: `CLAUDE.md:96` (Before coding) ergänzt die bestehende Konfliktregel um «ask before starting» bei verlorenem Ziellinien-Punkt.
- E8: `CLAUDE.md:65`: der neue Satz gilt nur, wenn «only Minors/Nits» kommen; der Blocker/Major-Satz davor bleibt unverändert. Keine Abschwächung.
- E10/E11: `CLAUDE.md:90` (Gotchas).
- E12: `CLAUDE.md:68`: widerspricht «push … only when the user says so» nicht, sondern definiert den Endzustand, solange die Freigabe fehlt.
- E13: `CLAUDE.md:97`.
- Archiv: der entfernte Block aus `implementation_plan.md` ist zeilengleich in `docs/archive/implementation-plan-verlauf.md:5044–5125` angekommen; einziger Unterschied ist die Überschrift (Session 19 -> Session 20, «(PR #149)»). Session 19 im Archiv (`:5031`) existiert bereits, die Umnummerierung ist korrekt; keine anderen Verweise auf «Session 19/20» im Repo.
- `bunx vitest run src/__tests__/open-work.test.ts src/__tests__/design-guard.test.ts`: 2 Dateien, 367 Tests grün.
- Sprache: Anweisungen englisch; keine «ß» in den geänderten Zeilen.

## Minor/Nit

- Minor `CLAUDE.md:90`: «a session or subagent you start gets its own branch» trifft auch Review-Subagents (code-reviewer, persona), die nach Schritt 4 im selben Arbeitsbaum ohne eigenen Branch laufen; Vorschlag des Berichts (E11) sprach nur von Kind-Sessions. Einschränken auf «a session or subagent that commits».
- Minor `CLAUDE.md:68`: «Ask only when blocked, or before anything destructive» ist abschliessend formuliert und nennt die neuen Frage-Fälle aus E2 (`:96`) und E13 (`:97`) nicht; ein Verweis («or where Coding guidelines say so») beseitigt den Widerspruch.
- Minor `docs/test-pyramid.md:30` vs. `CLAUDE.md:53`, `tests/e2e/CLAUDE.md:30`, `SKILL.md:21`: Pyramide legt «status 500» fest, die anderen drei sagen nur «an error (status)»; Anforderung ist 500, Wortlaut angleichen.
- Minor `docs/test-pyramid.md:30`: «never with invented data» ist in `screenplay/` nicht per Lint geprüft (dort ist `route.fulfill` mit Body erlaubt), und `.claude/agents/code-reviewer.md` (Block «Acceptance tests») nennt diese Prüfung nicht; damit hängt die Regel an keinem Prüfer.
- Minor `CLAUDE.md:53`: offen, was gilt, wenn der Fehlerzustand nur über eine serverseitige Anfrage entsteht (SSR-`load` beim direkten Aufruf, BFF -> Backend), die `page.route` nicht abfangen kann; ebenso, dass ein solches Szenario nicht `@api` getaggt werden kann.
- Minor `implementation_plan.md:7`: verweist auf den Bericht `bericht-instruktionen-seit-lauf2.md`, der nicht im Repo liegt (nur im Scratchpad); Verweis ins Leere.
- Minor Commit bd84256: Betreffzeile «docs(config): add workflow rules from screenplay run» hat 52 Zeichen, Limit laut `CLAUDE.md` (Commits) 50.
- Nit `implementation_plan.md:9–16`: die Archiv-Verschiebung (Session 20) ist kein eigener Checklistenpunkt der Session 21.
- Nit `CLAUDE.md:68`: «say so once and stop» sagt nicht wo; naheliegend unter **Blocked on me** (`:70`).

## Nicht bestätigt

- `tools/open-work/check-issues.mjs` nicht ausgeführt (braucht GitHub-PR-Kontext); gelesen: prüft Marker und Szenario-Änderung, nicht den Wortlaut der Instruktionsdateien, daher kein Konflikt erkennbar.
- `bun run lint` nicht ausgeführt; die Durchsetzbarkeit von E1 (a) ist aus `eslint.config.js` abgeleitet, nicht durch einen Testlauf mit einem `page.route` ausserhalb von `screenplay/` belegt (`src/__tests__/e2e-screenplay-lint.test.ts` nicht auf einen `route`-Fall geprüft).
- Ob eine Interaction für die Fehlerantwort in `tests/e2e/screenplay/interactions.ts` existiert: nein, nur die bestehende Skript-Verzögerung (`interactions.ts:30`, `route.continue()`); die Regel beschreibt einen künftigen Fall, kein Szenario im Diff nutzt sie.
- `.github/ISSUE_TEMPLATE/*` und die übrigen Skills nur per Suche (round, branch, push, scope, mock, route) geprüft, nicht vollständig gelesen; keine Treffer, die den neuen Regeln widersprechen.
