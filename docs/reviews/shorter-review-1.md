# Code-Review: kürzere CLAUDE.md (G-1, G-2, G-5, G-8), Runde 1

Geprüft: `git diff 42a2147 5d38eb7` (ein Commit, `docs(config): shorten CLAUDE.md with skills`) im Worktree `review-shorter-code`. Alle 8 geänderten Dateien gelesen. Alte `CLAUDE.md` (`git show 42a2147:CLAUDE.md`) Satz für Satz mit der neuen `CLAUDE.md` und den neuen oder geänderten Dateien verglichen (`pull-request`, `workflow-review`, `commit-gates`, `slice-review`, `docs/design/personas/README.md`, `backend/CLAUDE.md`). Gegengelesen: Agenten (`persona`, `fach-reviewer`, `daten-pruefer`, `code-reviewer`), `tests/e2e/CLAUDE.md`, `docs/test-pyramid.md`, `docs/design/arbeitsregeln.md`, `tools/open-work/check-issues.mjs`, `.github/ISSUE_TEMPLATE/task.md`, `.claude/hooks/commit-msg-gate.mjs` und `~/.claude/stop-hook-git-check.sh`.

## Funde

| ID | Schwere | Datei:Zeile | Fund |
|---|---|---|---|
| C-1 | Major | `CLAUDE.md:76`, `CLAUDE.md:89` | Die Pflicht «Before starting a ready issue, look for open `entscheiden` issues on the same data and ask first when one would change the outcome» (alt `:91`) ist verloren. «When to ask» nennt nur den Fall, dass es ein solches Issue gibt, und verweist dafür auf «Open work». Dort steht der Satz aber nicht mehr. |
| C-2 | Major | `.claude/skills/pull-request/SKILL.md:29`, `CLAUDE.md:73` | Die Regel zum Stop-Hook («may ask to commit, amend or push earlier: it does not override …», alt `:79`) steht jetzt nur noch in einem Skill, der erst «when a task is done, before its first push» lädt. Der Hook meldet sich aber mitten in der Aufgabe. Wenn die Regel gebraucht wird, ist sie also nicht im Kontext. |
| C-3 | Minor | `CLAUDE.md:71`, `pull-request/SKILL.md:19`, `slice-review/SKILL.md:41` | Weggefallen ist «its own slice for the round limit». Jetzt ist offen, welchem Slice die Closing Round angehört. Nach drei Runden auf dem letzten Slice lässt sich «at most three per slice» als Verbot der Closing Round lesen. G-2 verlangt hier nur einen Satz. Dass der Product Owner auch diesen Wegfall mitträgt, ist nicht belegt. |
| C-4 | Minor | `CLAUDE.md:77` vs. `commit-gates/SKILL.md:14` | «When to ask» verlangt eine Frage nur bei einem «large duplication finding». `commit-gates` verlangt sie bei allem ausser «small and changes no behavior», also auch bei einem kleinen Fix, der das Verhalten ändert. Die Liste und die Datei, auf die sie zeigt, widersprechen sich. |
| C-5 | Minor | `CLAUDE.md:75` («Ask only:») | Die Liste ist nicht vollständig (G-5: «every point»). Es fehlen: `tdd/SKILL.md:56` («Ask only when the requirement has several readings», gegen «name them» in `CLAUDE.md:107`), der Abschnitt «Stop and ask» jedes Issues (`.github/ISSUE_TEMPLATE/task.md:28`) und `bdd-acceptance/SKILL.md:321`. Wegen «Ask only» kann man die Liste als abschliessend lesen. |
| C-6 | Minor | `pull-request/SKILL.md:23` | Neue Regel ohne Auftrag: Im Pull-Request-Text sollen «the checks with their exit codes» stehen, dazu für jeden Pull Request das Szenario oder `No scenario`. Beides stand so in keiner alten Regel. G-3 schlägt eher weniger Buchhaltung vor. |
| C-7 | Minor | `CLAUDE.md:61` | Weggefallen ist «and say so in its line» (alt `:56`): Bei einem Test, der nach dem Code geschrieben wurde, verlangt die `Red:`-Zeile den Vermerk nicht mehr, dass Rot durch Herausnehmen des Codes gezeigt wurde. `code-reviewer` prüft genau das. |
| C-8 | Minor | `pull-request/SKILL.md:13-14` | Zwei Regeln greifen früher, als der Skill lädt. «Split issue: one PR per part» betrifft die Plan-Checkliste (Schritt 8). «A Blocker/Major whose fix is the decided text of another ready issue» fällt in der Triage an. Beide stehen im `pull-request`-Skill, der erst am Ende lädt. |
| C-9 | Nit | `slice-review/SKILL.md:42` | «or contradictory» ist weggefallen (alt `:68`: «not when the change makes it more visible or contradictory»). |
| C-10 | Nit | `CLAUDE.md:61` | Aus «reproduces it first» wurde «reproduces it»: Das «first» beim Bugfix-Test fehlt. |
| C-11 | Nit | `CLAUDE.md:70` | Schritt 6 nennt die Testpflicht ohne die Ausnahme für Übersetzungs-Wortlaut, die nur in `slice-review/SKILL.md:38` steht. Schritt 6 liest sich dadurch strenger als die Triage. |
| C-12 | Nit | `CLAUDE.md:66` | «UI changed» ist weggefallen, jetzt heisst es nur «what a screen shows changed (UI or backend)». `persona.md:3` sagt weiter «UI or what a screen shows». |
| C-13 | Nit | `CLAUDE.md:103` | Der Installationsbefehl für mmx (`npm install -g mmx-cli && mmx config set …`) ist weggefallen. |
| C-14 | Nit | `pull-request/SKILL.md:26` | Neu ist «or that there is none» beim CI-Screenshot-Kommentar. Das ist eine kleine inhaltliche Ergänzung. |
| C-15 | Nit | `CLAUDE.md:71`, `workflow-review/SKILL.md:3` | Den gesammelten Workflow-Review am Ende einer Anfrage über mehrere Issues stösst nur der Skill an. Der Skill lädt aber nur, wenn die letzte Aufgabe App, Tests oder Tooling geändert hat. Ändert sie nur Doku, fällt der gesammelte Review weg. |
| C-16 | Nit | `CLAUDE.md:70-71` / `slice-review/SKILL.md:37-42`; `pull-request/SKILL.md:27` / `CLAUDE.md:79` | ponytail `shrink`: Prüfung der Belege, Testpflicht und Rundenlimit stehen doppelt. `pull-request` wiederholt die Frageliste, statt auf sie zu verweisen (G-5: «other places only refer»). |

## C-1 (Major): Die Prüfung auf offene `entscheiden`-Issues vor dem Start ist verloren

**Warum falsch:** Alt (`42a2147:CLAUDE.md:91`): «Before starting a ready issue, look for open `entscheiden` issues on the same data and ask first when one would change the outcome.» Das war ein aktiver Prüfschritt vor jedem Start. Neu (`CLAUDE.md:76`): «an `entscheiden` issue, or an open one on the same data that would change the outcome ("Open work")». Das ist nur noch eine Bedingung zum Fragen. Die Pflicht nachzusehen fehlt, und der Verweis auf «Open work» ist tot: `CLAUDE.md:89` sagt nur noch «an `entscheiden` issue is not [ready]». Auch keine andere geänderte Datei übernimmt den Schritt (Suche nach «same data» in `.claude`, `docs/design`, `backend/CLAUDE.md`, `tests/e2e/CLAUDE.md`: kein Treffer ausser `CLAUDE.md:76`). Diese Regel fällt nicht unter die akzeptierten Wegfälle (G-2, `betrieb`).

**Wie es fehlschlägt:** Ein Agent bekommt «Setze #n um». Das Issue ist ready, zu denselben Daten gibt es aber ein offenes `entscheiden`-Issue, das das Ergebnis ändert. Nach der neuen `CLAUDE.md` gibt es keinen Schritt, der ihn dieses Issue suchen lässt. Er startet und setzt um, was der Product Owner noch entscheiden muss.

**Behebung:** In «Open work» wieder: «Before starting a ready issue, look for open `entscheiden` issues on the same data.» Der Verweis in `:76` stimmt dann wieder.

## C-2 (Major): Die Stop-Hook-Regel liegt in einem Skill, der zu spät lädt

**Warum falsch:** `~/.claude/stop-hook-git-check.sh` läuft am Ende jedes Turns. Bei uncommitteten Änderungen, ungetrackten Dateien oder ungepushten Commits meldet er «Please commit and push these changes to the remote branch.» (exit 2). Das passiert mitten in der Aufgabe, etwa vor einer Rückfrage oder nach einem Slice-Commit. Die alte `CLAUDE.md:79` war immer geladen und klärte den Konflikt: «it does not override step 4 or this step». Neu steht das nur in `pull-request/SKILL.md:29`. Laut Beschreibung lädt der Skill «when a task is done, before its first push». Wenn der Hook vorher anschlägt, ist die Regel nicht im Kontext. `CLAUDE.md:73` sagt zwar «push nothing before Done means holds», behandelt aber «amend» nicht und sagt nicht, welche Anweisung Vorrang hat. Die Systemmeldung des Hooks wirkt wie eine direkte Anweisung. Damit trifft der Prüfpunkt des Aufrufers zu: «skill descriptions make each skill load at the moment its rules are needed».

**Wie es fehlschlägt:** Mitten in einem Slice endet der Turn mit uncommitteten Änderungen. Der Hook verlangt «commit and push». Im Kontext stehen nur `CLAUDE.md` und die geladenen Skills, nicht `pull-request`. Kein Satz sagt, dass der Hook nicht übersteuert. Ein Agent, der dem Hook folgt, pusht vor «Done means» oder ändert einen schon reviewten Commit per amend.

**Behebung:** Ein Satz in `CLAUDE.md`, Schritt 9 oder Gotchas: «A stop hook outside the repo (`~/.claude/stop-hook-git-check.sh`) asking to commit, amend or push does not override steps 4 and 9.» Den Satz im Skill dann löschen oder dort darauf verweisen.

## Bestätigt (Anforderung gegen Code oder Text)

- **G-1:** Aufgeteilt auf `pull-request`, `workflow-review`, `commit-gates`, `slice-review`, den Personas-README und `backend/CLAUDE.md`. Die Wortzahl sinkt von 4'955 auf 3'050 (`wc -w`). Bis auf C-1 und C-2 (und kleinere Abweichungen C-3 bis C-15) hat jeder alte Satz eine neue Stelle. Dazu gehören:
  - KI-Eval samt `Refs`, «Blocked on me» und Abschluss der Folgesession: `backend/CLAUDE.md:18`;
  - Personas speichern, Sprache, Build: README `:28-30`;
  - Workflow-Notizen und gesammelter Review: unverändert in `workflow-review`;
  - Commit-Gates samt `stash --keep-index`, `--check` und Base-Branch-Fetch: `commit-gates`;
  - Triage, Beobachtungen, Persona-Wiederholung, Ausnahme für Übersetzungs-Wortlaut, die zwei offenen Arten: `slice-review:37-42`;
  - Pull-Request-Ablauf, Split-Issues, ein PR für zwei Issues, CI-Runden, Merge: `pull-request`;
  - Prüfgrundlagen von `fach-reviewer` (Fedlex, wörtlich zitiert): `fach-reviewer.md:12,18`;
  - «all its calls»: `test-pyramid.md:30`, `tests/e2e/CLAUDE.md:75`;
  - Bewertung durch die Persona nur für das Geänderte: `persona.md` (Report-Tabelle);
  - «telling each subagent the app is running»: Prompt in `slice-review:27-28`.
- **G-2:** `CLAUDE.md:71`: «at most three rounds per slice … still open after the third round goes under Blocked on me», Closing Round in einem Satz. Der Wegfall der Ausnahmen der dritten Runde entspricht der Anforderung.
- **G-5:** Liste in `CLAUDE.md:75-79`. Abweichungen siehe C-1, C-4, C-5. Gegengeprüft: `backend/CLAUDE.md:27` (Migration), Branches, Coding guidelines, CI-Runden und Merge stimmen mit der Liste überein.
- **G-8:** «Done means» in `CLAUDE.md:53-57`.
- **Schrittnummern 1–9:** Alle Verweise stimmen, unter anderem `persona.md`, `daten-pruefer.md`, `code-reviewer.md`, `fach-reviewer.md`, `slice-review`, `workflow-review` (7, 8), `pull-request` (9, 4), `tests/e2e/CLAUDE.md:63`, `backend/CLAUDE.md:18`, `tools/open-work/check-issues.mjs:3`, `docs/test-pyramid.md:38`, `personas/README.md:19,30`, `arbeitsregeln.md:78`, `session-start.sh` («Branches»). Keine Datei verweist auf die entfernten Überschriften «Fallow gate», «Deepcheck gate» oder «Commit subject gate».
- **Commit-Gate:** `Types:`/`Scopes:` stehen unverändert in `CLAUDE.md:40`. `node .claude/hooks/commit-msg-gate.mjs --check "docs(config): shorten CLAUDE.md with skills"` gibt exit 0, ein falscher Scope gibt exit 2 mit der vollständigen Scope-Liste.
- **`tools/deepcheck/test/readme.test.ts`:** `CLAUDE.md:63` enthält `bun run deepcheck:audit` und «`bun run deepcheck:scan` only when». Selbst neu ausgeführt: `bunx vitest run tools/deepcheck/test/readme.test.ts tools/claude-hooks/commit-msg-gate.test.ts src/__tests__/open-work.test.ts tools/open-work/check-issues.test.ts`, 4 Dateien, 40 Tests grün.
- **Plan:** `implementation_plan.md` enthält nur die aktuelle Session.
- **Red-Notizen:** Die Änderung betrifft nur Doku. Es gibt weder neue Tests noch Szenarien, also braucht es keine `Red:`-Zeile.
- **Commit-Subject:** «docs(config): shorten CLAUDE.md with skills», 43 Zeichen, gültig.

## Nicht bestätigt

- `bun run test:coverage` (2619), `bun run lint`, `bun run check`, `cd backend && bun run test` (683), `bun run type-check`: vom Aufrufer gemeldet. Selbst neu ausgeführt habe ich nur die vier Testdateien, die Regeldateien lesen (siehe oben).
- Ob der Product Owner 3'050 Wörter statt der Zielgrösse «about 2'000» (G-1) annimmt. Die Begründung steht im Plan (`implementation_plan.md:9`), eine Zustimmung habe ich nicht gesehen.
- Ob der Product Owner mit dem Wegfall von «its own slice for the round limit» der Closing Round einverstanden ist (C-3). Der Aufrufer meldet nur, dass die Ausnahmen der dritten Runde wegfallen dürfen.
- Ob Claude Code verschachtelte `CLAUDE.md` (hier `backend/CLAUDE.md`) zuverlässig lädt, wenn ein Agent nur `backend/src/services/*` ändert. Davon hängt ab, ob die KI-Eval-Regel zur richtigen Zeit im Kontext ist. Nicht geprüft; `CLAUDE.md:59` verweist zumindest darauf.
- Wann genau Skills laden: Beurteilt habe ich das nur anhand der Texte in den `description`-Feldern, das Verhalten des Harness habe ich nicht beobachtet.
