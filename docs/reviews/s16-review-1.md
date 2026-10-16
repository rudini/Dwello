# Code-Review S-1 bis S-6 (Commit 3c9ce03), Runde 1

Geprüft: `git diff HEAD~1 HEAD` im Worktree `review-s16`, alle 10 geänderten Dateien gelesen. Verglichen habe ich mit `docs/reviews/opus55-guide-review-3.md`, `tests/e2e/CLAUDE.md`, `CLAUDE.md`, `docs/test-pyramid.md`, `docs/design/offene-punkte.md` und den Feature-Dateien.

| ID | Schwere | Datei:Zeile | Fund |
|---|---|---|---|
| C-1 | Major | `.claude/skills/bdd-acceptance/SKILL.md:24-30` | Durch den Schnitt fehlt die Navigationsregel: Jeder Ausgang einer Seite bekommt genau ein Navigationsszenario, das nur den Übergang prüft, und Endseiten bekommen keins. Diese Regel gilt in Dwello und steht nirgends sonst. |
| C-2 | Minor | `.claude/skills/bdd-acceptance/SKILL.md:3,8` | `description` und Einleitung bieten weiter an, was gestrichen ist: «from an existing system (SPA, server-rendered webapp, or API)», «set up BDD for an existing project», «Turn any running system». Das widerspricht «never re-bootstrap it» (`:14`) und der gestrichenen API-Variante. |
| C-3 | Minor | `docs/design/offene-punkte.md:61` (nicht im Diff) | H-13 («`bdd-acceptance` says one feature file per page, `tests/e2e/CLAUDE.md` one per area. Decide and align.») beschreibt einen Stand, den es nicht mehr gibt. Die Regel «one per page» ist mit dem Schnitt weg, und eine Regel «one per area» steht in `tests/e2e/CLAUDE.md` nicht. Der offene Punkt wurde stillschweigend durch Streichen erledigt, ohne dass jemand die Zeile angepasst oder entschieden hat. |
| C-4 | Nit | `docs/design/arbeitsregeln.md:3` | «(subagent `persona`)» hängt jetzt an «the checks before a push in `CLAUDE.md`, …» statt an den Persona-Läufen, und `docs/design/personas/README.md` steht zweimal im Satz. |

## C-1 (Major): Die Navigationsregel für Seitenausgänge fehlt

**Warum falsch:** Die Anforderung (S-2) verlangt, den Dwello-Teil und «die Gherkin-Regeln, die in Dwello gelten» zu behalten. Der alte Skill hatte in Phase 4 diese Regeln, und der Dwello-Override hat keine davon aufgehoben:

- «**Every exit from a page** (links, buttons, guards, error redirects) gets exactly one navigation scenario — assert only that the transition occurred (URL check), not destination content»
- «Terminal pages (confirmation, 404) have no navigation scenarios»

Dwello hält sich durchgängig daran. `tests/e2e/features/building-detail.feature:29-49` hat für jeden Ausgang ein Szenario («Zur Bearbeitung des Gebäudes wechseln», «Wohnung hinzufügen», «Erste Wohnung erstellen», «Wohnung öffnen»), und jedes prüft nur «Dann ist der Liegenschaftsverwalter auf der Seite …». Die Form «Dann ist der Liegenschaftsverwalter auf der …» kommt in 33 Feature-Dateien vor. Der Fund S-2 im Guide-Review hat diese Regel bei den geltenden Regeln nicht aufgeführt, und der Commit ist ihm wörtlich gefolgt. Eine andere Stelle ersetzt sie nicht: `grep -rn -i "navigation scenario\|every exit"` in `CLAUDE.md`, `tests/e2e/CLAUDE.md`, `docs/test-pyramid.md` und `.claude/` findet ausserhalb des alten Skills nichts. `tests/e2e/CLAUDE.md` legt nur fest, wie eine Navigation formuliert wird («a step that checks one place of one page names the page»), nicht, dass es sie gibt.

**Wie es fehlschlägt:** Wer eine neue Seite oder einen neuen Link schreibt und dabei den Skill lädt (sein Auslöser), findet keine Regel mehr, die ein Navigationsszenario pro Ausgang verlangt oder Inhaltsprüfungen der Zielseite in diesen Szenarien verbietet. Neue Features verlieren damit die Strenge der bestehenden, ohne dass die Anforderung das verlangt. Das ist ein Verlust einer geltenden Regel, also genau das, was S-2 ausschliessen wollte.

**Behebung:** Die zwei Sätze zu Navigation und Endseiten unter «## Gherkin» wieder aufnehmen. Ob «one `.feature` per page» bleibt, hängt an H-13 (C-3) und gehört nicht zu diesem Fund.

## Geprüft und in Ordnung

- **Weitere gestrichene Regeln:** Sie sind anderswo abgedeckt oder gelten in Dwello nicht.
  - UUID-Isolation: `tests/e2e/CLAUDE.md:73`.
  - Vorbedingungen über die API statt einen zweiten Browser: `tests/e2e/CLAUDE.md:34` (`fixtures/backend.ts`).
  - Questions ohne Snapshot-Werte bzw. Locators: `:40`.
  - Steps rufen nur Tasks und Questions: `:29` und Lint.
  - Szenariobezogener Zustand statt Modulvariablen: `remember`/`recall`, `:36`.
  - `createBdd(test)`: in jeder Step-Datei vorgemacht, z. B. `tests/e2e/steps/common.steps.ts:1-7`.
  - `addInitScript`, Rollentags, storageState, globales Truncate und Tracer-Run: werden in Dwello nicht verwendet oder hat der Override schon aufgehoben.
- **Auslöser des Skills:** Für Szenarien und Steps in Dwello reicht der Skill weiter aus (Setup, Auth, Akteur, `data-testid`, keine Mocks, Duplikat-Steps, Gherkin-Regeln, Verweis auf «Rules»), abgesehen von C-1.
- **S-1:** Die Klammer ist aus «When to ask» gestrichen (`CLAUDE.md:76`). Der Skill sagt weiterhin «Do not stop for confirmations». Ein Widerspruch bleibt nicht.
- **S-3:** Die Regel zur Workflow-Notiz steht jetzt in `CLAUDE.md:72` (Schritt 8). `workflow-review/SKILL.md:3,16` verweist auf Workflow 8, und dort steht die Regel. `slice-review/SKILL.md:41` verweist für die Runden zu Recht weiter auf Workflow 7. Andere Verweise auf «Workflow 7» für Notizen gibt es nicht.
- **S-4:** Beim Agenten `persona` geht nichts verloren. Die Ports und `--no-build` sowie die Aufbewahrung der Screenshots stehen jetzt in README «Running a review». Kit, Import an Ort, Scratchpad, «nur wie ein Nutzer» und Berichtsformat stehen in `persona.md:12-28`. Der Hinweis auf Workflow 4-7 und `slice-review` richtet sich an den Aufrufer, nicht an die Persona. `demo-records.md:3` ist passend nachgezogen. Kein anderer Verweis auf «Persona runs: how» bleibt übrig.
- **S-5:** Der Zirkelverweis ist gestrichen (`backend/CLAUDE.md:18`). Der restliche Satz trägt die Regel vollständig.
- **S-6:** `pull-request/SKILL.md:19` verweist jetzt auf «Before marking anything complete», und das steht in `CLAUDE.md:84`, einschliesslich der Tests für Regeldateien.
- **Fremde Änderungen:** Keine. Alle Dateien gehören zu S-1 bis S-6 oder zum Plan.

## Nicht bestätigt

- Die Checks des Aufrufers auf 3c9ce03 habe ich nicht erneut ausgeführt. Alle drei sind vom Aufrufer gemeldet:
  - `bun run lint` 0
  - `bun run check` 0
  - `bunx vitest run tools/deepcheck/test/readme.test.ts tools/claude-hooks/commit-msg-gate.test.ts src/__tests__/open-work.test.ts tools/open-work/check-issues.test.ts src/__tests__/e2e-screenplay-lint.test.ts` 0 (94 passed)
- Die Wortzahlen im Plan (2'073 → 465, 14'939 → 13'380) habe ich nicht nachgezählt.
- Ob ausser dem Agenten `persona` noch andere Abläufe (z. B. Sessions, die `arbeitsregeln.md` als «resume file» lesen) den Abschnitt «Persona runs: how» brauchten, habe ich nur per `grep` in `.md`, `.ts`, `.mjs` und `.sh` geprüft, ohne `docs/archive` und `docs/reviews`.
