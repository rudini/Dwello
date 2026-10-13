# Review b13-workflow (PR #154) gegen «Getting the most out of Opus 5.5» – Runde 1

Geprüft: `git diff origin/main...claude/b13-workflow-improvements` (23 Dateien, Stand `04d44587`), dazu die ganzen Dateien `CLAUDE.md`, `.claude/agents/*.md`, `tests/e2e/CLAUDE.md`, `.claude/settings.json` (Berechtigungen), Begründung in `docs/reviews/b13-instruktionen-pruefung.md` (Punkte 1–19) und `docs/archive/implementation-plan-verlauf.md`, Session 24.

Quelle: https://claude.dev/blog/getting-the-most-out-of-opus-5-5/ (Addy Osmani, 22.09.2026). WebFetch lieferte nur eine Zusammenfassung; der volle Text wurde deshalb mit `curl` geladen und als Text extrahiert. Alle Zitate unten stammen aus diesem Text.

## Anwendbare Empfehlungen des Artikels

| # | Abschnitt | Wörtliches Zitat |
|---|---|---|
| A1 | 1. How to ask – «Say what "done" looks like, then let it run» | «Name the finish line, like "the tests pass" or "every endpoint is migrated."» – «With a clear finish line, it knows when it's done.» |
| A2 | 1. How to ask – «Stop telling it to "think hard"» | «Remove "think carefully," "think step by step," and similar lines from your prompts and your saved instructions.» |
| A3 | 1. How to ask – «For design work, name the styles you don't want» | «A general instruction like "avoid a generic look" mostly swaps one default for another. A list of specific patterns works much better.» |
| A4 | 2. Steering a long run – «Tell it which stops you want» | «Put a short rule in your CLAUDE.md file about when to stop and ask, and when to keep going.» – «It follows instructions that name these stops. Name the stops you want, too.» – Beispielregel: «When a step doesn't need my input, keep going. Put status notes in the same message as your next action. Stop and ask only when you can't continue without me, or before anything destructive: deleting data, force-pushing, or changing anything outside this repository.» |
| A5 | ebenda | «A rule to keep going means fewer stops, so keep your own check before anything risky or hard to undo. […] Keep permission prompts on for destructive commands too.» |
| A6 | 2. – «Ask it to split big work across subagents» | «When a subagent reports back, check its evidence before you accept it.» |
| A7 | 2. – «Keep the task list in a file» | «Keep a checklist in TASKS.md. Tick each item when it's done, and add anything new you find.» |
| A8 | 3. Checking the result – «Read what it needs from you first» | «look first for anything Claude is waiting on you for, like a decision it left open or a change it wants you to approve» – «End every run with three headings: Blocked on me, Changed, Found.» |
| A9 | 3. – «Ask it to review the code» | «List only problems you'd block the merge for. For each one, give the file and line, why it's wrong, and how to show it fails.» |
| A10 | 3. – «Ask it to mark what it couldn't confirm» | «"I couldn't find this" is worth reading, and asking for it makes it easy to find.» – «Mark anything you couldn't confirm, and say where you looked» |
| A11 | 5. When a message is flagged – «Don't ask it to show its reasoning in the reply» | «Remove requests to reproduce its internal reasoning in the reply from your prompts and instructions.» |

Nicht anwendbar: Bilder anhängen, fertige Dateien verlangen, «settled answers» in Projekten, Modellwechsel bei Flags, Fast Mode (4., 5., 6. ausser A11).

Wichtig für die Einordnung: Der Artikel sagt **nichts** über Länge von CLAUDE.md, Betonung (MUST/NEVER), Begründungen zu Regeln, Beispiele oder Hooks als deterministische Durchsetzung. Diese Fragen aus dem Auftrag lassen sich am Artikel nicht messen (siehe «Nicht bestätigt»); Befunde unten stützen sich nur auf A1–A11.

## Befunde

| ID | Schwere | Datei:Zeile | Befund | Artikelstelle |
|---|---|---|---|---|
| O-1 | Major | `.claude/agents/code-reviewer.md:7` | «Checks the caller lists as run count as run» macht Angaben des geprüften Agenten über seine eigenen Checks zu bestätigten Tatsachen. Bisher landeten E2E, check und Coverage unter «Nicht bestätigt» (Punkt 11 der Prüfung); jetzt verschwinden sie dort, ohne dass jemand sie geprüft hat. Steht zudem quer zum Satz davor «do not rely on anything else the caller says about the change». | A10, A6 |
| O-2 | Minor | `CLAUDE.md:66` | Ziellinie widersprüchlich: Satz 2 «A feature is done when … no Blocker/Major … is open», Satz 4 «Two kinds of Blocker/Major do not hold the task … the rest of the slice counts as done». Ein Leser von Satz 2 allein stoppt; die Ausnahme sollte im Done-Satz selbst stehen. Ausserdem doppelt: «becomes an `entscheiden` issue under "Blocked on me"» und gleich danach «both go under "Blocked on me"». | A1 |
| O-3 | Minor | `.claude/agents/code-reviewer.md:27`, `CLAUDE.md:56` | Eine fehlende Plan-Zeile `Skills: tdd, ponytail-review` gilt als Major und hält damit die Arbeit an (Workflow 4). Die Zeile ist eine Selbstauskunft, die der Reviewer nicht prüfen kann (Session 24 zeigt selbst «Skills: tdd not loaded for slice 1»); ein Major darüber ist kein Problem, für das man den Merge blockiert. `Test red: … – <message>` ist dagegen prüfbar und passt. | A9 |
| O-4 | Minor | `CLAUDE.md:69`, `:66`, `:79`, `:99` | Halte-/Weiter-Regeln liegen nun an fünf Stellen (Absatz nach Workflow, Workflow 7 mit zwei neuen Ausnahmen und Runden-Limit, Open work «ask, do not start», Coding guidelines «ask before starting if …», neu der Stop-Hook-Satz). Der Artikel empfiehlt *eine kurze* Regel. Die neuen Sätze sind inhaltlich richtig, verstreuen sie aber weiter. Vorschlag: in Z. 69 eine Liste «Stop and ask only when: …» mit Verweisen, Workflow 7 nur noch «does not hold the task (see Stops)». | A4 |
| O-5 | Minor | `CLAUDE.md:49`, `:56` | Begriffe für dieselbe Pflicht driften: Design-Regeln sagen «`/tdd` … and `/ponytail`», Workflow 3 heisst «`/ponytail`», verlangt aber den Skill `ponytail-review`, und die Plan-Zeile nennt nur `tdd, ponytail-review`. Unklar, ob der Skill `ponytail` beim Schreiben noch geladen werden muss; als Ziellinie nicht eindeutig prüfbar. | A1 |
| O-6 | Nit | `CLAUDE.md:66` | Ein vorbestehender Major, der schon als offene Arbeit (Issue) erfasst ist, soll unter «Blocked on me» stehen. Er wartet nicht auf den Benutzer; das verdünnt den Abschnitt, den der Benutzer zuerst liest. Besser unter «Found» mit Issue-Nummer, «Blocked on me» nur für den Produktentscheid. (Z. 71 definiert «Blocked on me» bereits mit «new issues», daher nur Nit.) | A8 |

### O-1 (Major): Begründung und Vorschlag

Warum: Der Artikel sagt zu Subagenten «check its evidence before you accept it» und zu Analysen «Mark anything you couldn't confirm». Der code-reviewer ist genau diese unabhängige Prüfinstanz; sein «Nicht bestätigt» ist das Signal, das der Artikel ausdrücklich lesenswert nennt. Mit «count as run» übernimmt er ungeprüft die Aussage des Agenten, dessen Arbeit er prüft. Ein falsch gemeldeter grüner E2E-Lauf (vgl. Punkt 16: 626 grüne Tests aus veralteten `.features-gen`) würde nirgends mehr sichtbar.

So zeigt es sich: Aufrufer meldet «Szenarien X grün», Szenario ist in Wahrheit nicht gelaufen → Reviewer führt X weder als Befund noch unter «Nicht bestätigt»; der Report liest sich vollständig bestätigt.

Vorschlag (ersetzt den Satz in Z. 7):

> Checks the caller reports as run: list them in "Nicht bestätigt" as "vom Aufrufer gemeldet", unless you reran them; rerun one you doubt with `bunx vitest run <files>` (it writes only the generated, uncommitted `src/lib/paraglide/`). Never start E2E, a build or anything else that writes files.

So bleibt der Zweck von Punkt 11 (der Aufrufer liefert Ergebnisse, der Reviewer muss nicht raten) erhalten, und «Nicht bestätigt» trennt Gemeldetes von Geprüftem.

## Was gut passt

- **Stopp-Regel (A4, A5):** `CLAUDE.md:69` übernimmt die Beispielregel des Artikels fast wörtlich (keep going, status notes in the same message, stop before deleting data, force-push, changes outside this repo). Neu benennt der Stop-Hook-Satz einen konkreten unerwünschten Halt («may ask to commit, amend or push: it does not override …») – genau «Name the stops you want». Die Berechtigungen in `.claude/settings.json` lassen `ask` für force-push, `reset --hard`, `rm -r/-f`, `dropdb dwello` usw. aktiv (A5, nicht Teil des Diffs).
- **Workflow 7, Ausnahmen (A4, A8):** Ein Blocker/Major, der einen Produktentscheid braucht, beendet den Lauf nicht mehr unklar, sondern wird Entscheidung unter «Blocked on me»; das Kriterium «shows on the base commit too» für Vorbestehendes ist prüfbar.
- **Aufgabenliste in einer Datei (A7):** Workflow 8 archiviert zuerst die fertige Vorgänger-Session; `Test red: … – <message>` (Workflow 2) legt den roten Schritt in die Plan-Datei statt in den Verlauf.
- **Ziellinie in der Issue-Vorlage (A1):** `.github/ISSUE_TEMPLATE/task.md:19-20` verlangt das Ergebnis statt der Platzierung und bei vorgegebenem Text dessen Folge – eine prüfbare «Done means»-Zeile.
- **Review-Format (A9, A10):** `code-reviewer.md:33-39` fordert schon «only problems you would block the merge for … why it is wrong and how to show it fails» und «Nicht bestätigt: … where you looked» – wörtlich nahe am Artikel. Alle vier Agenten haben eine «Done when»-Zeile (A1) und einen Abschnitt «Nicht bestätigt»/«Nicht geprüft» (A10). Workflow 6 behält «Check a finding's evidence before acting on it» (A6); neu ist eine prüfbare Abschlussregel für Persona-Funde (Test rot vor dem Fix).
- **Subagenten-Prompts eigenständig (A6):** `persona.md:10` nennt selbst, wann gespeichert werden darf und wann nicht («Without a building from the caller, do not save»), statt sich auf CLAUDE.md zu verlassen; der Aufrufer muss den Persona-Lauf nicht mehr erklären.
- **Abschlussformat (A8):** `CLAUDE.md:71` nutzt die drei Überschriften des Artikels wörtlich.
- **A2, A3, A11:** Keine «think hard/step by step»-Zeilen und keine Aufforderung, internes Denken wiederzugeben (grep über `CLAUDE.md`, `.claude/`, `tests/e2e/CLAUDE.md`, `docs/design/personas/README.md`). Die Design-Anti-Muster (`CLAUDE.md:48`) sind eine konkrete Liste, wie A3 empfiehlt (nicht Teil des Diffs).
- **Deterministische Prüfung statt Prosa:** `commit-msg-gate.mjs` liest Typen und Scopes aus CLAUDE.md, `fallow-gate.sh` blockiert jetzt statt still zu überspringen; beide mit Tests. Der Artikel behandelt Hooks nicht; das ist daher keine Artikelaussage, widerspricht ihm aber auch nicht.

## Nicht bestätigt

- **Länge, Betonung, Begründungen, Beispiele, Hooks:** Der Artikel enthält dazu keine Empfehlung (gesucht im vollen Text: keine Aussage zu MUST/NEVER, Dateilänge, «explain why», Beispielen oder Hooks). Ich habe deshalb keinen Befund darauf gestützt. Beobachtung ohne Wertung: CLAUDE.md wuchs von 2583 auf 3034 Wörter (+17 %), Workflow 7 ist ein einzelner Absatz von rund 200 Wörtern; «Never/never» kommt in neuen Sätzen vor (z. B. Z. 63, `code-reviewer.md:7`), jeweils mit Grund.
- **Wirkung der Änderungen im Lauf:** Ob Opus 5.5 die neuen Regeln tatsächlich befolgt (z. B. Personas mit eigenem Gebäude, Ausnahme in Workflow 7), ist nur durch einen echten Lauf zu zeigen; nicht ausgeführt (Auftrag: keine E2E, keine Builds).
- **Hook-Tests:** `tools/claude-hooks/*.test.ts` gelesen, nicht ausgeführt.
- **Stop-Hook `~/.claude/stop-hook-git-check.sh`:** liegt ausserhalb des Repos; sein Text wurde nicht gelesen, also nicht geprüft, ob der neue Satz in `CLAUDE.md:69` ihn richtig beschreibt.
- **Skill `bdd-acceptance` und `docs/test-pyramid.md`:** nur die Hunks gelesen (Formulierung «one endpoint, all its calls»); keine Artikelstelle betroffen.
