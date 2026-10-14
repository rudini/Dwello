# Review PR #158 (B-15 Instruktionen) gegen «Getting the most out of Opus 5.5 in Claude and Claude Code»

Gegenstand: `git diff fab88f6..3f59f04` im Worktree `scratchpad/review-opus55` (detached 3f59f04), CLAUDE.md vollständig gelesen (3640 Wörter, vorher 3017).
Quelle: https://claude.dev/blog/getting-the-most-out-of-opus-5-5/ (Addy Osmani, 22.09.2026). WebFetch lieferte nur eine Zusammenfassung; der Wortlaut wurde per `curl` als HTML geholt und als Text gelesen (alle Abschnitte 1–6 und die Checkliste). Zitate unten stammen aus diesem Text.

## Alle Befunde

| ID | Schwere | Ort | Kurz |
|----|---------|-----|------|
| O-1 | Major | CLAUDE.md:69 | Die Stopp-Regel ist auf 2137 Zeichen gewachsen und mischt Stopp-Regel, PR-Ablauf und Freigabeliste in einem Absatz |
| O-2 | Minor | CLAUDE.md:69 | «changes outside this repo» gilt als destruktiv, gleichzeitig pusht und merged die Session selbst auf GitHub: wörtlich gelesen ein Widerspruch |
| O-3 | Minor | CLAUDE.md:69, .claude/settings.json:53 | Merge nach `main` läuft ohne Rückfrage und ohne eigene Prüfung direkt davor (Entscheid PO, B-15 Punkt 17) |
| O-4 | Minor | CLAUDE.md:93, .claude/hooks/session-start.sh:13 | «start the branch anew from origin/main» ohne Befehl und ohne Prüfung, dass keine lokalen Commits verloren gehen |
| O-5 | Minor | .claude/agents/code-reviewer.md:7, daten-pruefer.md:7, fach-reviewer.md:12 | Kein Stopp benannt, wenn der Aufrufer keinen Worktree nennt |
| O-6 | Minor | CLAUDE.md:69 | «when you must stop» und «checking it before it stops» lassen offen, wann das Warten auf CI endet |
| O-7 | Nit «ohne Beleg» | CLAUDE.md:58 | «link `node_modules` and `backend/node_modules` into it» ohne konkreten Befehl, Schritt 4 jetzt 1000 Zeichen |
| O-8 | Nit «ohne Beleg» | CLAUDE.md:49, 55, 56 | Laden der Skills dreimal verlangt, dazu der Nachdruck «following their rules without loading them is not enough» |

## Details Blocker/Major

### O-1 (Major): Stopp-Regel nicht mehr kurz – CLAUDE.md:69

**Artikel:** «Put a short rule in your CLAUDE.md file about when to stop and ask, and when to keep going.» Und das Beispiel ist zwei Sätze lang: «When a step doesn't need my input, keep going. Put status notes in the same message as your next action.»

**Konflikt:** Vor dem PR war Zeile 69 eine Stopp-Regel von etwa 900 Zeichen, die sich eng an das Beispiel des Artikels hielt. Jetzt hat der Absatz 2137 Zeichen und enthält drei Dinge: (a) die Stopp-Regel, (b) einen ganzen PR-Ablauf (pushen, PR eröffnen, verfolgen, Konflikte mergen, CI reparieren, Checks und Review vor jedem Push, selbst mergen, CI-Screenshot-Kommentar nennen), (c) eine Liste von sechs Fällen, die eine Freigabe brauchen. Die eigentliche Regel, wann die Session weiterläuft und wann sie stoppt, geht in einem Ablauf unter, der nur am Ende eines Tasks gilt. Die Stopps, die der Artikel benannt haben will, stehen jetzt an zwei Stellen: in Satz 3 («Ask only when …») und in der Liste «Still only with my approval: …» zehn Sätze später. Ob ein Fall auf der Liste steht, findet man nur, wenn man den ganzen Absatz liest.

**Rewrite:** Zeile 69 auf die Stopp-Regel zurückführen und den PR-Ablauf als eigenen Workflow-Schritt anlegen:

```markdown
Keep going without asking while no input is needed; put status notes in the same message as your next action. Ask only when blocked, before anything destructive (deleting data, force-push, changes outside this repo; pushing this branch and its pull request under Workflow 9 are not), or where a rule here says to ask. When something waits for my approval or a decision, say so once under "Blocked on me" and stop, without asking again. Not destructive: recreating the databases `dwello_persona`, `dwello_test` and `dwello_e2e`, and files in the scratchpad.

9. **Pull request:** commit locally per slice; push nothing before the task is done (step 7 and "Before marking anything complete"). Then the session that holds my task (not a subagent or a session it started):
   - pushes the branch and opens a pull request (English, `Fixes #n`), subscribes to its activity;
   - on a merge conflict merges `origin/main` (no rebase, no force-push); on red CI fixes the cause; before each push reruns "Before marking anything complete", and runs a `code-reviewer` round when app code changed;
   - merges it (merge commit) once CI is green on the latest commit and it is mergeable, and names its CI screenshot comment in the closing report.
   Ask me first for: a push or pull request where I said to only commit, a push to `main`, a force-push, merging with a red check (also when red on `main`), a fourth round of CI fixes, merging while a Blocker/Major is open.
   A stop hook outside this repo (`~/.claude/stop-hook-git-check.sh`) may ask to commit, amend or push earlier: it does not override step 4 or this step.
```

## Weitere Befunde (Minor/Nit) mit Beleg

**O-2 (Minor), CLAUDE.md:69.** Artikel: «Stop and ask only when you can't continue without me, or before anything destructive: deleting data, force-pushing, or changing anything outside this repository.» Der PR behält «changes outside this repo» als Grund zum Fragen, lässt die Session aber auf GitHub pushen, einen PR eröffnen und mergen. Ob der Remote zu «this repo» gehört, steht nirgends. Ein wörtlich lesendes Modell kann deshalb vor jedem Push fragen oder auch nie. Rewrite: den Klammerzusatz aus O-1 übernehmen («pushing this branch and its pull request under Workflow 9 are not»).

**O-3 (Minor), CLAUDE.md:69 und .claude/settings.json:53.** Artikel: «A rule to keep going means fewer stops, so keep your own check before anything risky or hard to undo.» und «Keep permission prompts on for destructive commands too.» Ein Merge nach `main` lässt sich nur schwer rückgängig machen. `gh pr merge` ohne `--admin` und `mcp__github__merge_pull_request` fragen nicht nach, und auch Push-Regeln für `main` lassen sich umgehen, wie H-23 bereits festhält. Der Selbst-Merge ist ein Entscheid des Product Owners (Verlauf B-15, Punkt 17), deshalb ist der Befund kein Major. Rewrite, das den Entscheid stehen lässt, aber die eigene Prüfung des Artikels nachrüstet: «Right before merging, check on the PR's head commit that `gh pr checks <n>` shows every check passed and that the latest `## Session` lists no open Blocker/Major; name both results in the closing report.» Ein Ask-Eintrag für den Merge wäre nur mit neuem PO-Entscheid möglich und gehört unter «Blocked on me».

**O-4 (Minor), CLAUDE.md:93 und session-start.sh:13.** Artikel: «keep your own check before anything risky or hard to undo». «start the branch anew from `origin/main`» nennt weder einen Befehl noch eine Prüfung. Naheliegend ist `git reset --hard origin/main`, der in `settings.json` nachfragt und damit eine Cloud-Session anhält; ohne Prüfung gehen außerdem lokale, nicht gemergte Commits verloren. Rewrite: «if `git merge-base --is-ancestor HEAD origin/main` succeeds (every commit of the branch is in `main`), run `git switch -C <branch> origin/main`; otherwise merge `origin/main`.» Damit ersetzt die Prüfung auch das unscharfe «if the branch's pull request is merged».

**O-5 (Minor), code-reviewer.md:7, daten-pruefer.md:7, fach-reviewer.md:12.** Artikel: «It follows instructions that name these stops. Name the stops you want, too.» Die neue Regel «only in the worktree the caller names, never in the caller's working tree» lässt offen, was passieren soll, wenn kein Worktree genannt wird. Das ist bei einem älteren Aufruf möglich oder bei `daten-pruefer` aus Schritt 5, wo CLAUDE.md:58 einen Worktree verlangt, Schritt 5 ihn aber nicht wiederholt. Rewrite (jeweils anhängen): «If the caller names no worktree, stop and report that.» Die Persona hat eine solche Regel schon («If it is not reachable, stop and report that.»).

**O-6 (Minor), CLAUDE.md:69.** Artikel: «it sometimes stops to report instead of going on: a summary that names the next step without taking it, an offer to continue, or a list of choices that don't block the work.» und «Name the stops you want, too.» «follows it until it is merged (… otherwise checking it before it stops)» und «If CI still runs when you must stop» sagen nicht, wann die Session stoppen muss. So kann sie entweder endlos pollen oder nach dem ersten Check mit «waits for CI» aufhören. Rewrite: «Wait for CI on the subscription (or `send_later` in 10 minutes where there is none); stop with "waits for CI, not merged" under "Blocked on me" only when the session cannot be woken again.»

**O-7 (Nit «ohne Beleg»), CLAUDE.md:58.** Der Artikel sagt nichts zu Befehlsdetails. «link `node_modules` … into it» lässt Pfad und Form offen. Schritt 4 ist mit 1000 Zeichen der zweitlängste Absatz. Vorschlag: den Befehl ausschreiben (`ln -s "$PWD/node_modules" <wt>/node_modules && ln -s "$PWD/backend/node_modules" <wt>/backend/node_modules`) und das Worktree-Rezept als Unterpunkt von Schritt 4 setzen. Geprüft: `.gitignore` Zeile 2 und 3 (`node_modules`, ohne Schrägstrich) erfasst auch Symlinks; `git worktree remove` sollte deshalb ohne `--force` gehen. Nicht ausgeführt.

**O-8 (Nit «ohne Beleg»), CLAUDE.md:49/55/56.** Der Artikel behandelt Nachdruck nur bei «think carefully»-Zeilen, die hier nicht vorkommen. Dass das Laden der Skills dreimal verlangt wird, samt «following their rules without loading them is not enough», ist redundant. Vorschlag: In Zeile 49 nur auf Workflow 2 und 3 verweisen («every UI change follows Workflow 2 and 3»).

## Was gut ist

- **Keine «think»-Zeilen:** Der PR fügt keine hinzu, und es gab auch vorher keine. Der Artikel rät: «Remove "think carefully," "think step by step," and similar lines from your prompts and your saved instructions.»
- **Benannte Stopps:** Der PR schreibt die Stopps aus, statt auf Rückfragen zu setzen. Beispiele sind die fach-reviewer-Wartezeit (CLAUDE.md:54, «write at most the first lower-layer test … no production code»), «a fourth round of CI fixes» und «say so once under "Blocked on me" and stop, without asking again». Das entspricht «It follows instructions that name these stops.»
- **Persona speichert ohne Rückfrage** (persona.md:10, «saving there is part of your task, not a change to shared data»). Das beseitigt einen unnötigen Stopp der Art «a list of choices that don't block the work».
- **Eigener Worktree je Reviewer-Subagent** (CLAUDE.md:58, Agenten-Dateien), mit Begründung («it keeps changing while you work»). Der Hauptlauf arbeitet weiter, und die Beweisprüfung in Schritt 6 bleibt. Das passt zu «When a subagent reports back, check its evidence before you accept it.»
- **Permission-Prompts für Push nach `main`, `--admin`-Merge und MCP-Dateischreiber** (settings.json) sind ergänzt, die bekannten Lücken als H-23 festgehalten. Das passt zu «Keep permission prompts on for destructive commands too.»
- **Aufgabendatei:** Der PR stärkt die Aufgabendatei: eine Zeile pro Reviewer und Runde, Archivieren «before the final commit», Status in der Zeile der Ursprungsrunde. Das passt zu «Keep a checklist in TASKS.md. Tick each item when it's done, and add anything new you find.»
- **Vorhandene Abschlussformel unverändert** (CLAUDE.md:71: Blocked on me / Changed / Found, inklusive «what could not be confirmed»). Sie entspricht dem Artikel wörtlich.
- **session-start.sh** meldet schon zu Sitzungsbeginn, wenn der Branch hinter `main` liegt, und nicht erst beim Push. Ein Fehler beim Fetch hält den Hook nicht an.
- **bunfig-Preload** (backend/CLAUDE.md:17): Statt einer «Never»-Regel macht das Werkzeug den Fehler unmöglich und nennt den Grund dazu (Bun liest `bunfig.toml` nur aus dem Arbeitsverzeichnis).

## Nicht bestätigt

- **WebFetch** gab nur eine Zusammenfassung zurück. Den vollen Text habe ich per `curl` und HTML-zu-Text gelesen. Bilder (FIG A–D) und Copy-Buttons konnte ich nicht sehen; die Prompt-Beispiele stehen aber als Text im HTML.
- **Themen ohne Grundlage im Artikel:** Zu Wörtlichkeit, Großschreibung oder Nachdruck allgemein, Beispielen in Prompts, Gesamtlänge von CLAUDE.md, «stating the why» und Werkzeugbeschreibungen sagt der Artikel nichts. Befunde zu diesen Themen sind deshalb höchstens Nits «ohne Beleg» (O-7, O-8).
- **Nicht ausgeführt:** Hooks, Tests, `git worktree remove` mit Symlinks (O-7) und die Ask-Muster in `settings.json`. Ob `gh pr merge` und `mcp__github__merge_pull_request` wirklich ohne Rückfrage laufen, habe ich nur aus der Ask-Liste abgeleitet; globale Einstellungen außerhalb des Repos habe ich nicht gesehen.
- **Nicht inhaltlich geprüft**, weil es keine Instruktionen für Claude sind und der Artikel sie nicht trifft: `tools/open-work/check-issues.mjs` und sein Test, `docs/reviews/b15-*`, `docs/archive/implementation-plan-verlauf.md` (nur Punkt 17 zum PO-Entscheid gelesen), `demo-records.md`, die zwei `.feature`-Zeilen.
