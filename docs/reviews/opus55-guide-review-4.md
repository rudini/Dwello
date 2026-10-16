# Vierter Review der Dwello-Agentenregeln gegen «Getting the most out of Opus 5.5»

Quelle: https://claude.dev/blog/getting-the-most-out-of-opus-5-5/ (Addy Osmani, 22.09.2026). Ich habe die Seite mit `curl -sL` geholt und den Text aus dem HTML gezogen (2'550 Wörter einschliesslich Navigation). Geprüft habe ich Commit `cc1cbcb` («docs(config): archive the session of G-9») und mit `40ba767` (vor allen Änderungen) und `ab74c6c` (Stand des dritten Reviews) verglichen. Zeilennummern beziehen sich auf `cc1cbcb` (`git show cc1cbcb:<path>`). Im Repository habe ich keine Datei geändert. G-7 (Modell und Effort der Subagenten) lasse ich auf Wunsch des Product Owners aus.

## Empfehlungen des Leitfadens (wörtlich)

Zum Instruieren:
- «Hand over the whole task. Say what "done" looks like and when you want it to stop and ask. Then let it work.»
- «Give the whole task in one message. Name the finish line, like "the tests pass" or "every endpoint is migrated." Then let it cook.» / «With a clear finish line, it knows when it's done.»
- «Remove "think carefully," "think step by step," and similar lines from your prompts and your saved instructions.» / «For a quick answer to a simple question, say so: "Answer directly." To change how much it thinks in Claude Code, change effort.»
- «If you remember something mid-run, you can type a follow-up while it works.»
- «When you ask for a page, an app, or an artifact, list the design habits you want left out.» / «A general instruction like "avoid a generic look" mostly swaps one default for another. A list of specific patterns works much better.»
- «Remove requests to reproduce its internal reasoning in the reply from your prompts and instructions.» / «Explain why you chose this approach in three sentences.»

Zu agentischen Abläufen:
- «Put a short rule in your CLAUDE.md file about when to stop and ask, and when to keep going.» / «It follows instructions that name these stops. Name the stops you want, too.»
- FIG B: «When a step doesn't need my input, keep going. Put status notes in the same message as your next action. Stop and ask only when you can't continue without me, or before anything destructive: deleting data, force-pushing, or changing anything outside this repository.»
- «A rule to keep going means fewer stops, so keep your own check before anything risky or hard to undo.» / «Keep permission prompts on for destructive commands too.»
- «For pair programming, you may want the opposite: a one-line plan before it starts and a short recap at the end.»
- «ask Opus 5.5 to split the work across subagents and check each result.» / «Give each service to its own subagent. When a subagent reports back, check its evidence before you accept it. Finish with one table …»
- «Keep a checklist in TASKS.md. Tick each item when it's done, and add anything new you find.» / «A long run fills the context window, and Claude Code then summarizes older turns. A list in a file survives that, and it shows you at a glance what's done and what's left.»
- «When a long run ends, look first for anything Claude is waiting on you for» / «End every run with three headings: Blocked on me, Changed, Found.»
- «Review the diff on this branch against main. List only problems you'd block the merge for. For each one, give the file and line, why it's wrong, and how to show it fails.»
- «Mark anything you couldn't confirm, and say where you looked.»
- Checkliste: «The task says what "done" looks like», «No "think hard" lines in prompts or saved instructions», «CLAUDE.md says when to stop and when to keep going, and to stop before anything destructive», «Permission prompts are still on for destructive commands», «Large audits and migrations are split across subagents», «The task list is kept in a file», «A review pass runs before a person reviews», «Research answers mark what couldn't be confirmed».

## Zusammenfassung

**Urteil: Der Stand ist jetzt gut. Eine weitere volle Review-Runde gegen den Leitfaden lohnt sich nicht.** Alle Punkte aus G, R und S sind behoben oder bis auf einen bewusst behaltenen Rest umgesetzt. Was der Leitfaden behalten will, ist da: die Finish-Line («Done means», `CLAUDE.md:53-57`), eine einzige Stopp-Liste nach FIG B (`:75-80`), Verifikation (`:84`), die Checkliste in einer Datei (`:72`), die drei Schlussüberschriften (`:82`), «Nicht bestätigt» in jedem Agenten, die Beweisprüfung von Subagenten (`:70`) und `ask`-Prompts für Destruktives (`.claude/settings.json`). Zum ersten Mal ist auch der Regelkorpus kürzer als vor allen Änderungen: 12'993 statt 14'589 Wörter (−11 %). `CLAUDE.md` hat 3'089 statt 4'964 Wörter (−38 %). Das Ziel von G-1 (< 2'000) ist weiter verfehlt, aber der Rest ist projektspezifisch, und weiteres Kürzen bringt wenig. Neu gefunden habe ich zwei Minors und vier Nits, aber keinen Major. Der wichtigste Fund: Kein Regeltext sagt, wann der Skill `bdd-acceptance` geladen wird. Nach dem Kürzen hält er aber nur noch Dwello-Regeln, darunter die eigens wiederhergestellte Navigationsregel (T-1). Die Funde lassen sich in einem kleinen Commit beheben, ohne neuen Review gegen den Leitfaden.

## Umgesetzte Funde

| ID | Status | Beleg |
|---|---|---|
| G-1 (Länge `CLAUDE.md`) | teilweise | 4'964 → 3'089 Wörter, 31'928 → 20'704 Bytes. Workflow 2'549 → 1'267 Wörter. Ziel < 2'000 verfehlt. Längste Zeilen: `:72` (869 Zeichen, siehe T-2), `:59` (650), `:36` (642), `:89` (638). Der Korpus ist jetzt kleiner als bei `40ba767` (siehe Wortzahlen). |
| G-2 (verschachtelte Ausnahmen) | weitgehend | Rundenlimit und Closing Round sind je ein Satz (`:71`). Sonderfälle stehen in `pull-request:12-15` und `backend/CLAUDE.md:18`. Rest: «its own slice for the round limit» (`pull-request:20`). Mit R-4 wurde der Satz bewusst verschoben statt gestrichen. Er regelt einen echten Fall (die Closing Round nach drei Runden) und ist darum kein Fund mehr. |
| G-3 (Buchhaltung) | behoben | Keine `Red:`-Zeilen. Pro Review-Runde ein Plan-Punkt, der den Report nennt (`slice-review:42`). `code-reviewer.md:17` urteilt «by reading … (the caller keeps no notes of it)». |
| G-4 (Minor/Nit als Pflicht-Open-Work) | behoben | `CLAUDE.md:55`, `:89` («from reviews only the two kinds of Blocker/Major»), `code-reviewer.md:35`. |
| G-5 (Stopps an einer Stelle) | behoben | «When to ask» (`:75-80`) ist die einzige Liste. Der Widerspruch S-1 ist weg (`:76`). |
| G-6 (doppelte Checks) | behoben | `:84`; `pull-request:19` verweist nur noch darauf. |
| G-8 (Finish-Line verteilt) | behoben | «Done means» `:53-57`, `:91`. Kleine Unschärfen: T-3, T-4. |
| G-9 (generische Tugenden) | behoben | «Coding guidelines» (`:106-109`) enthält nur noch Dwello-Regeln. `tdd/SKILL.md` 688 → 352 Wörter, ohne Philosophie und SOLID. `mocking.md`, `tests.md` und `refactoring.md` sind gelöscht, und kein Regeltext verweist mehr darauf (`git grep`). Auch die Grenze «don't refactor adjacent code» ist nicht verloren: `tdd:30` begrenzt das Refactoring auf «the code the change touches» (Fix von `g9-review-1` C-1). |
| G-10 (mehrfache Fassungen) | behoben | Die E2E-Regeln stehen nur in `tests/e2e/CLAUDE.md:73-77`, `test-pyramid.md:41` und `bdd-acceptance:21`, `:32` verweisen darauf. Neue kleine Doppelungen: T-1, T-6. |
| G-11 (Grossschreibung `tdd`) | behoben | Übrig sind nur die Labels `WRONG`/`RIGHT` im Codeblock `tdd:15-22`, und das ist keine Betonung. |
| G-12 (Workflow-Review dicht) | behoben | In `workflow-review/SKILL.md`, in `CLAUDE.md:72` steht noch ein Satz. |
| R-1 (Korpus gewachsen) | behoben | 14'939 (`ab74c6c`) → 12'993 Wörter, unter dem Stand von `40ba767` (14'589). |
| R-2 (Doppelungen `CLAUDE.md`/Skills) | weitgehend | S-6 ist behoben. `slice-review:37-38` wiederholt Workflow 6 weiter, wortgleich und widerspruchsfrei. |
| R-3 (Notiz-Kriterien zu spät) | behoben | `CLAUDE.md:72`. |
| R-4 (G-2-Reste) | weitgehend | Wie G-2. |
| R-5 («a loaded skill says to ask») | behoben | `:76`. |
| R-6 («affected» unklar) | behoben | `:84` nennt die Tests, die Regeldateien lesen. |
| R-7 (Skill-Beschreibungen) | behoben | `slice-review:3` «steps 1, 4 to 7». `workflow-review:3` und `:16` verweisen jetzt richtig auf «Workflow 8». |
| R-8 (Workflow als Finish-Line) | behoben | `:91`. |
| S-1 (Stopp-Widerspruch `bdd-acceptance`) | behoben | Die Klammer ist aus `:76` gestrichen, `bdd-acceptance:23` «Do not stop for confirmations» gilt allein. |
| S-2 (`bdd-acceptance` zu lang) | behoben | 2'073 → 490 Wörter. Die Navigationsregel kam nach `code-reviewer` C-1 zurück (`450789e`, `bdd-acceptance:31`). Wann der Skill lädt: T-1. |
| S-3 (Notiz-Regel unter «Rounds») | behoben, mit Folge | Die Regel steht jetzt in Schritt 8. Dadurch ist Schritt 8 die längste und gemischteste Zeile (T-2). |
| S-4 (Zeigerkette Persona → `arbeitsregeln.md`) | behoben | `persona.md:8`, README `:3`, `:28-29`. Der Abschnitt in `arbeitsregeln.md:76` ist als Historie markiert. |
| S-5 (Zirkelverweis KI-Eval) | behoben | `backend/CLAUDE.md:18`. |
| S-6 (Kurzfassung der Checks) | behoben | `pull-request:19` «"Before marking anything complete" (`CLAUDE.md`) passes». |

## Neue Funde

| ID | Schwere | Empfehlung des Leitfadens (Zitat) | Regelstelle | Fund | Vorgeschlagene Änderung |
|---|---|---|---|---|---|
| T-1 | Minor | «It follows instructions that name these stops. Name the stops you want, too.» und «Hand over the whole task» (abgeleitet: eine Regel, die nicht lädt, erreicht das Modell nicht) | `CLAUDE.md:59` (Schritt 1 nennt keinen Skill; Schritt 2 nennt `tdd`, Schritt 3 `ponytail`). `bdd-acceptance/SKILL.md:3` («Use when the user wants BDD tests, acceptance criteria, Gherkin scenarios …»). Doppelungen in `bdd-acceptance:15-16`, `:22` gegenüber `tests/e2e/CLAUDE.md:20`, `:29` | `git grep bdd-acceptance` findet ausser dem Skill selbst nur `offene-punkte.md:61`. Seit S-1 nennt keine Regeldatei mehr, wann er lädt, und das war in `40ba767` auch schon so. Nach S-2 enthält der Skill aber fast nur noch Dwello-Regeln, die sonst nirgends stehen: die Navigationsregel pro Seitenausgang, die `code-reviewer` als Major zurückholte (`:31`), Actor-Namen und die Regeln zu Background und Scenario Outline (`:27-30`). Bei «Setze #n um» bittet niemand um «BDD tests». Ob der Skill lädt, hängt dann daran, ob das Modell seine Beschreibung auf Schritt 1 bezieht. Dazu kommt, dass die Zeilen `:15-16` und `:22` des Abschnitts «Dwello setup» `tests/e2e/CLAUDE.md` mit Abweichungen wiederholen: Ports nur 3100/3101 statt auch 3102-3104, und «`docker compose … up -d postgres`», wo die Cloud-Session PostgreSQL selbst startet. | In Schritt 1 nach dem ersten Satz ergänzen: «Load the skill `bdd-acceptance` before writing it.» Die `description` entsprechend ändern: «Load before writing or changing a scenario in `tests/e2e/features` (CLAUDE.md, Workflow 1).» In «Dwello setup» `:16` (Run und Stack) und den Teil von `:22`, der `tests/e2e/CLAUDE.md:29` wiederholt, durch einen Verweis auf `tests/e2e/CLAUDE.md` ersetzen. (Alternative: die sechs Gherkin-Punkte als Abschnitt «Features» nach `tests/e2e/CLAUDE.md` verschieben und den Skill streichen. Das beantwortet auch, wo die Regel aus H-13 hingehört.) |
| T-2 | Minor | «Keep a checklist in TASKS.md. Tick each item when it's done, and add anything new you find.» | `CLAUDE.md:72`, Schritt 8 «Plan» (869 Zeichen, längste Zeile der Datei) | Seit S-3 bündelt Schritt 8 sechs Regeln in einem Absatz: altes Archiv verschieben, neue Session anlegen, abhaken/ergänzen/Dateien notieren, Workflow-Notiz mit Abhak-Bedingung, Ladebedingung von `workflow-review` und Archiv am Ende. Der Kern des Leitfadens («tick … add anything new») steht in der Mitte. Die Ladebedingung von `workflow-review` wiederholt die `description` des Skills, und die Abhak-Bedingung der Notiz gehört zum Skill. | Schritt 8 in drei kurze Unterpunkte teilen: **Start** (Archiv, neue Session; mehrere Issues = eine Session), **Während** (abhaken, Neues ergänzen, Dateien notieren; Reibung an einer Regel sofort als «Workflow note: …»), **Ende** («load the skill `workflow-review`», Session archivieren vor dem letzten Commit). Die Klammer «(ticked when … under "Found")» und die Ladebedingung in den Skill verschieben (`workflow-review:14-16` hat sie schon zur Hälfte). |
| T-3 | Nit | «Name the finish line» | `CLAUDE.md:57` («the session is archived (step 8)»), `:72` («move its session to the archive») | «Session» heisst hier ein `## Session`-Abschnitt in `implementation_plan.md`. In Cloud-Sessions gibt es aber auch das Tool `archive_session`, das eine Claude-Code-Session archiviert. Der Finish-Line-Punkt lässt sich deshalb als «Session archivieren» lesen. | `:57`: «the plan's session is moved to the archive (step 8)». |
| T-4 | Nit | «Name the finish line … With a clear finish line, it knows when it's done.» | `CLAUDE.md:57` («the session is archived … and the pull request merged»), `:72` («a request that covers several issues is one session … move its session to the archive before the final commit»), `pull-request:12` («one pull request per issue») | Bei einem Auftrag über mehrere Issues gibt es eine Session, aber mehrere Pull Requests. «Done means» verlangt für jeden PR eine archivierte Session, die beim ersten PR noch die anderen Issues enthält. Die Regeln sagen nicht, vor welchem PR archiviert wird. `workflow-rules-review-2.md` W-4 hat die Frage schon gestellt, beantwortet wurde nur «eine Session». | In `:57` ergänzen: «(with several pull requests: before the last one)». |
| T-5 | Nit | FIG B: «When a step doesn't need my input, keep going.» | `CLAUDE.md:64` («Continue only when no Blocker/Major is open») gegen `slice-review:31` («keep working in your tree while it runs») | Einzeln gelesen sagt `:64`, dass man auf den Reviewer warten soll. Der Skill sagt, man soll weiterarbeiten. Beides lässt sich vereinbaren («Continue» meint den nächsten Schritt nach dem Report), aber erst mit beiden Texten. | `:64`: «Keep working while it runs; the next review or push waits until no Blocker/Major of it is open.» |
| T-6 | Nit | «Put a short rule in your CLAUDE.md file» (abgeleitet: eine Quelle je Regel) | Preload und `bunfig.toml`: `CLAUDE.md:23`, `backend/CLAUDE.md:20`, `test-pyramid.md:105`. `tdd`/`ponytail` laden: `CLAUDE.md:49` («every UI change loads the skills `tdd` and `ponytail`») und Workflow 2-3 (jede Änderung) | Dieselbe Regel steht drei- bzw. zweimal da. Liest man `:49` allein, wirkt es, als gälte die Pflicht nur für UI-Änderungen. | `CLAUDE.md:23` auf die Voraussetzung kürzen («PostgreSQL on localhost:5432, user and password `dwello`; test databases: `backend/CLAUDE.md`»), `test-pyramid.md:105` auf einen Verweis. In `:49` den Satz zu `tdd`/`ponytail` streichen. Das spart etwa 80 Wörter. |

## Zu b) und c): Gegenläufiges und Verlorenes

- **Länge:** `CLAUDE.md` 3'089 Wörter. Der Rest ist projektspezifisch (Commands, Konventionen, Design-Regeln, Gotchas). Mit T-2 und T-6 und ein paar Kürzungen in den Gotchas («Web search» mit der Installationszeile des Setup-Skripts, «Cloud sessions» mit der Beschreibung dessen, was der Hook tut) liessen sich vielleicht 200-300 Wörter sparen. Eine eigene Runde lohnt das nicht.
- **Verschachtelung:** Nur noch «Done means» `:55` (zwei Ausnahme-Arten mit Klammern) und «its own slice for the round limit» (`pull-request:20`). Beides sind echte Regeln, die sich nicht weiter kürzen lassen.
- **Buchhaltung:** Nichts Neues. `tdd:27` (Verhalten in die Plan-Checkliste) ist die Checkliste des Leitfadens.
- **Widersprüche:** Keiner. Nur die Lesart T-5.
- **Spät oder nie geladene Regel:** T-1.
- **Zeigerketten und tote Zeiger:** Ich habe alle Dateiverweise in den 17 Dateien gegen `cc1cbcb` geprüft, und alle existieren. Auch die Abschnittsverweise («Rules», «No scenario», «Running a review», «Which personas», «Triage», «Coding guidelines», «One build») zeigen auf vorhandene Abschnitte. Auf die gelöschten Dateien `tdd/mocking.md`, `tests.md` und `refactoring.md` verweist nichts mehr ausser Reports und Archiv. Jeder Verweis braucht einen Sprung.
- **Verloren:** Nichts Wichtiges. Bei G-9 fielen «Stay in scope» und «Surgical changes» weg, ihr Inhalt steht aber anderswo: Arbeit ausserhalb des Auftrags in `:78`, offene Arbeit in `:89`, Formatierung im Gotcha `:101`, Unbenutztes über Fallow und `code-reviewer.md:16`, fremder Code in `code-reviewer.md:31` (Major) und `tdd:30`. «Several readings» steht in `:76`. Finish-Line, Verifikation, Stopps, Checkliste in der Datei und Schlussformat sind unverändert da. Destruktive Befehle haben `ask` (Force-Push, Push auf `main`, `reset --hard`, `clean`, `restore`, `checkout -f`, `branch -D`, `rm -r/-f`, `dropdb dwello`, `db:reset`, `db:push`, `compose down -v`, `gh pr merge --admin`).

## Zu d): Wortzahlen (`wc -w`, Frontmatter eingeschlossen)

| Datei | 40ba767 | ab74c6c | cc1cbcb |
|---|---|---|---|
| `CLAUDE.md` | 4'964 | 3'177 | 3'089 |
| davon `## Workflow` bis vor `## Open work` | 2'549 | 1'279 | 1'267 |
| `CLAUDE.md` in Bytes | 31'928 | 21'255 | 20'704 |
| `bdd-acceptance/SKILL.md` | 2'093 | 2'073 | 490 |
| `tdd/SKILL.md` | 669 | 688 | 352 |
| 16 Dateien wie im dritten Review (ohne `issue-triage`) | 14'589 | 14'939 | **12'993** |
| alle 17 Dateien aus Auftrag Punkt 3 (mit `issue-triage`, 836 unverändert) | 15'425 | 15'775 | 13'829 |

Die 17 Dateien: `CLAUDE.md`, `tests/e2e/CLAUDE.md`, `backend/CLAUDE.md`, die vier Agenten, die Skills `bdd-acceptance`, `commit-gates`, `grill-me`, `issue-triage`, `pull-request`, `slice-review`, `tdd` und `workflow-review`, `docs/design/personas/README.md` und `docs/test-pyramid.md`. `commit-gates`, `pull-request` und `workflow-review` gab es in `40ba767` noch nicht (0 Wörter).

## Was gut passt

- **Finish-Line:** «Done means» (`:53-57`) eröffnet den Workflow mit vier prüfbaren Punkten und dem Ausweg «or what holds it is under "Blocked on me"». Jeder Agent und Skill endet mit «Done when …», `issue-triage` hat ein eigenes «Done means» (`:14-17`).
- **Stopps:** `:75` ist FIG B fast wörtlich. Die Liste nennt alle Fragepunkte an einer Stelle und auch, was *nicht* destruktiv ist (`:79`). «say so once … and stop, without asking again» verhindert wiederholtes Nachfragen. Der fremde Stop-Hook ist benannt (`:73`). Skills, die ohne Freigabe weiterlaufen sollen, sagen das: `tdd:27` «Do not wait for approval», `bdd-acceptance:23` «Do not stop for confirmations», `issue-triage:8` «never stop to ask or to offer to continue».
- **Subagenten:** eigene Worktrees, parallel, je eine Tabelle. «check a finding's evidence before acting on it» (`:70`, `slice-review:37`) entspricht «check its evidence before you accept it».
- **Review-Format:** `code-reviewer.md:35-36` «only problems you would block the merge for, each … with why it is wrong and how to show it fails». Minor/Nit stehen nur als Zeile.
- **Unbestätigtes:** «Nicht bestätigt» mit «where you looked» in jedem Agenten, «what could not be confirmed» unter «Found» (`:82`).
- **Checkliste in einer Datei:** `:72` «Tick each item when done, add anything new you find» wörtlich. Reibung an Regeln kommt sofort als Plan-Punkt dazu.
- **Design:** eine konkrete Anti-Pattern-Liste (`:48`) und Token-Verbote (`:46`), durch Tests erzwungen.
- **Keine Denk- oder Reasoning-Aufforderungen und keine Betonung in Grossbuchstaben:** Ich habe nach «think», «step by step», «careful», «reasoning», «IMPORTANT», «MUST», «CRITICAL» gesucht. Treffer gab es nur in `persona.md:24` (Berichtsformat) und `test-pyramid.md:6`, `:20` (Beschreibung), und beides sind keine Aufforderungen.
- **Kürzen statt Verschieben:** Diese Runde hat erstmals netto gestrichen (`bdd-acceptance` −1'583, `tdd` −336 Wörter, drei Hilfsdateien gelöscht). Die Reviews der Umsetzung (`g9-review-1` C-1, `450789e` C-1) haben die zwei dabei verlorenen Regeln zurückgeholt.

## Nicht bestätigt

- **Geladene `CLAUDE.md`:** Der Kontext dieser Subagenten-Session enthielt eine `CLAUDE.md` mit «Stay in scope», «Surgical changes» und «Before coding: state assumptions …», also den Stand vor `6b535fc`. Der Working Tree ist laut `git status` gleich `cc1cbcb`. Vermutlich wurde die Datei beim Start der aufrufenden Session geladen, vor dem G-9-Commit. Dann erreichen Regeländerungen erst Sessions, die nach dem Merge starten, und Subagenten derselben Session bekommen die alte Fassung. Geprüft habe ich das nicht.
- **Ladeverhalten von `bdd-acceptance` (T-1):** Ich habe keine Session-Logs gelesen. Ob der Skill in Schritt 1 in der Praxis lädt, weiss ich nicht. Der Fund beruht darauf, dass keine Regel ihn nennt und dass seine `description` auf «the user wants …» lautet.
- **Was abgeleitet ist:** Der Leitfaden sagt nichts zu Gesamtlänge, Doppelungen, Zeigerketten oder dem Ladezeitpunkt von Skills. T-1, T-2 und T-6 und die Längenbewertung von G-1 sind aus «short rule», «summarizes older turns» und «Name the stops» abgeleitet.
- **Nicht gelesen oder nicht bewertet:** die `ponytail`-Skills (Plugin, laut Auftrag ausgenommen), `.github/ISSUE_TEMPLATE/*`, die Hooks selbst und `tools/deepcheck/README.md`. Von `docs/design/arbeitsregeln.md` habe ich nur den geänderten Kopf und die Abschnittsüberschrift gelesen. Von `.claude/settings.json` habe ich nur `permissions` und die Top-Level-Schlüssel gelesen.
- **Abbildungen:** FIG A-D habe ich nur als Bildunterschriften gesehen. Ihr Text steht im Fliesstext.
