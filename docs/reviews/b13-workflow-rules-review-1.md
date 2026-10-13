# Review Slice 3 (Instruktionen), Runde 1

Bereich: `git diff 72a901d..7fba747` (ein Commit `7fba747 docs(config): sharpen review and plan rules`), gelesen im Worktree `review-s3` (detached HEAD bei 7fba747). Anforderung: Punkte 3, 5, 6, 7, 8, 9, 11, 13, 15, 17 und 19 aus `docs/reviews/b13-instruktionen-pruefung.md`, «Verbesserungen an Instruktionen, Skills, Hooks»; Punkt 13 ohne Änderung an `~/.claude/stop-hook-git-check.sh`.

Gelesen: alle fünf geänderten Dateien (`CLAUDE.md`, `.claude/agents/code-reviewer.md`, `.github/ISSUE_TEMPLATE/task.md`, `docs/design/personas/README.md`, `implementation_plan.md`), dazu als Umfeld `.claude/agents/persona.md`, `docs/design/arbeitsregeln.md` («Persona runs: how»), `docs/test-pyramid.md`, `tests/e2e/CLAUDE.md` (keine Überschneidung gefunden), `src/__tests__/open-work.test.ts:43-46`, `tests/a11y/screens.json` (Aufbau der Zustände), `vitest.config.ts`, `.claude/skills/` (Skills `tdd` und `ponytail-review` existieren) und `~/.claude/stop-hook-git-check.sh` (nur gelesen).

Jeder Punkt ist umgesetzt, und die Änderung bleibt beim Thema. Ich habe keinen Blocker und keinen Major gefunden. Die Funde betreffen Regeln, die sich mit einer anderen Regel überschneiden oder auf zwei Arten lesen lassen.

| ID | Schwere | Datei:Zeile | Fund |
|---|---|---|---|
| C-1 | Minor | CLAUDE.md:66 | «one that existed before the change becomes an issue under "Found"» widerspricht «Open work» (CLAUDE.md:78: Nicht-funktionales wird eine Zeile in `offene-punkte.md`, kein Issue) und der Schlussüberschrift «Blocked on me (… new issues …)» (CLAUDE.md:71). Ausserdem fehlt ein prüfbarer Nachweis für «existed before» (z. B.: auf dem Basis-Commit reproduziert). |
| C-2 | Minor | docs/design/personas/README.md:23 | «new statements … : Dr. Weber»: In Dwello heisst *statement* Nebenkostenabrechnung (Scope `statements`, CLAUDE.md:95). Gemeint war «Aussagen» (Punkt 15). So wird Dr. Weber nur bei Abrechnungen gewählt. Besser «new claims or notices the app makes». |
| C-3 | Minor | CLAUDE.md:56 / code-reviewer.md:27 / implementation_plan.md (Slice 3) | Workflow 3 verlangt `ponytail-review` und die Notiz `Skills: tdd, ponytail-review` für jeden Slice, der code-reviewer prüft sie aber nur bei Slices mit Codeänderung. Der Plan von Slice 3 hat keine Skills-Zeile. Eine der beiden Regeln sollte die Bedingung ausdrücklich nennen. |
| C-4 | Minor | CLAUDE.md:69 | Die Stop-Hook-Regel klärt nur den Push. Der Hook verlangt auch `git commit --amend --reset-author` bzw. `git rebase --exec …` (`stop-hook-git-check.sh:107-109`); das widerspricht CLAUDE.md:58 («no amend, no rebase» während eines Reviews). «commit» auf Zuruf des Hooks umgeht zudem Workflow 4 (Commit pro Slice, erst wenn lint, Tests und deepcheck sauber sind). |
| C-5 | Minor | .claude/agents/code-reviewer.md:7 | «`bunx vitest run` (it writes no files)» stimmt nicht: Das Paraglide-Plugin in `vitest.config.ts:9-11` schreibt `src/lib/paraglide/`, und in einem frischen Worktree (wie `review-s3`) fehlt dieser Ordner. Der nächste Satz verbietet «anything else that writes files». Besser «writes only ignored, generated files». |
| C-6 | Minor | CLAUDE.md:55 | Neben «A test must fail before the code changes» liest sich «A test written after the code shows red by taking the code out again» wie eine gleichwertige Alternative zu Test-first. Die Regel sollte sie als Ausnahme kennzeichnen (z. B. ein Test, der nach einem Review-Fund zu bestehendem Code dazukommt). |
| C-7 | Minor | .github/ISSUE_TEMPLATE/task.md:20 | «A prescribed text: what happens when the landlord follows it» ist keine Bedingung für «Done means», sondern eine Frage an die Autorin. Unklar ist, was ins Issue gehört. Vorschlag: «A prescribed text: what following it leads to (e.g. the input of the form is kept)». |
| C-8 | Nit | CLAUDE.md:58, CLAUDE.md:93 | «give it a worktree of the commit» ergibt einen detached HEAD. Die Gotcha «Branches» sagt «never on a detached HEAD» und «review subagents only read your tree». Ein Zusatz «(detached, read only)» würde das klären. |
| C-9 | Nit | CLAUDE.md:67 | In «first move a finished earlier session …, then add its items» bezieht sich «its» jetzt auf die verschobene Session. Besser «the new task's items». |
| C-10 | Nit | CLAUDE.md:49 | Der Einschub «one entry per place …» steht zwischen der Dateiliste und deren Klammer «(axe, light and dark …)». Zwei Klammern folgen direkt aufeinander. Besser umstellen. |
| C-11 | Nit | CLAUDE.md:49, CLAUDE.md:56, docs/design/arbeitsregeln.md:37 | Die Design-Regeln und `arbeitsregeln.md` nennen weiter `/ponytail`, Workflow 3 und der code-reviewer dagegen den Skill `ponytail-review`. |
| C-12 | Nit | CLAUDE.md:58 | Laut CLAUDE.md:58 gibt man dem Reviewer «lint, check, coverage, which scenarios are green» mit. Die Vorbedingung im selben Schritt verlangt aber lint, betroffene Tests und `deepcheck:audit`. Die Beispielliste sollte dieser Vorbedingung entsprechen. |

## Blocker/Major

Keine.

## Abgleich der Anforderung

- 3: CLAUDE.md:67. Archivieren am Start, mit Bezug auf `open-work.test.ts:43-46` (höchstens eine Session); siehe C-9.
- 5: task.md:19-20. Das Ergebnis statt der Platzierung ist umgesetzt, die Folge eines vorgegebenen Texts ebenfalls; siehe C-7.
- 6: CLAUDE.md:55-56, code-reviewer.md:27. Die Skills `tdd` und `ponytail-review` existieren in `.claude/skills/`; siehe C-3, C-11.
- 7 + 19: CLAUDE.md:66, als eine Regel für alle Reviewer, wie im Plan entschieden. Die Bedingung «contradicts what the issue decided» grenzt die Ausnahme gut ein; siehe C-1.
- 8: CLAUDE.md:65. Ein Test schliesst den Fund, die Persona läuft nur bei neuem Text oder Zustand erneut. Das passt zu «Re-review only the delta» und zu Workflow 7.
- 9: CLAUDE.md:49. Das passt zur bestehenden Praxis (`contracts-unknown` und `contracts-unknown-review` als eigene Zustände in `screens.json:28-29`, `accessibility.feature:67-68`, `sprachen-bildschirme.feature:68-69`); siehe C-10.
- 11: code-reviewer.md:7, CLAUDE.md:58; siehe C-5, C-8, C-12.
- 13: CLAUDE.md:69. Der Hook ist nicht geändert, CLAUDE.md hat beim Push Vorrang; siehe C-4.
- 15: personas/README.md:15-23 und CLAUDE.md:60 stimmen überein («when unsure, all», eine Aufgabe zur Änderung statt der Standardaufgabe). `persona.md:7` («with the task the caller gives») widerspricht nicht. Siehe C-2.
- 17: CLAUDE.md:55, code-reviewer.md:27. Das Format `Test red: <test> – <message>` ist dasselbe wie in Slice 1 des Plans; siehe C-6.
- Sprache und Umfang: CLAUDE.md bleibt Englisch. Kein Regeltext ist doppelt; Workflow 8 nennt das Archiv zweimal, aber für zwei verschiedene Zeitpunkte. Keine Änderung hat mit der Anforderung nichts zu tun.

## Nicht bestätigt

- Ob die Regeln in einem echten Lauf befolgt werden (Personenauswahl, Stop-Hook-Verhalten): Das zeigt erst ein Lauf, ich habe nur die Texte gelesen.
- `bunx vitest run tools/deepcheck/test/readme.test.ts src/__tests__/open-work.test.ts` und lint: Ich habe sie nicht selbst ausgeführt, sie zählen als vom Aufrufer gelaufen. In `review-s3` fehlt `src/lib/paraglide/`, ein eigener Lauf hätte Dateien erzeugt.
- Ob `ponytail-review` für einen reinen Dokumentations-Slice gelaufen ist: Der Plan (Session 24, Slice 3) nennt es nicht (C-3).
