# Review: Instruktionen und Skills nach dem Lauf #53 (B-1, Wohnungssuche)

Lauf: Session 2026-10-14, Auftrag «alle Bugs aus den GitHub-Issues abarbeiten, nach jedem Merge den nächsten». Slice #53, PR #161 (Commits a740ed6, a2663f7, 22201f0).
Geprüft: was im Lauf an `CLAUDE.md`, `backend/CLAUDE.md`, `tests/e2e/CLAUDE.md`, `.claude/agents/*.md`, den Skills `tdd`, `ponytail`, `ponytail-review` und an den Hooks gehakt hat oder unklar war. Nur Befunde, keine Umsetzung.

## Major

- **W-1 (Major) `CLAUDE.md:72` mit `:66` – Merge mit «erlaubten» Majors hält einen Serienauftrag an.** Schritt 7 lässt eine Aufgabe mit zwei Arten offener Majors fertig werden (Produktentscheid, schon vorher vorhanden), Schritt 9 verlangt vor genau diesem Merge trotzdem eine Rückfrage. Personas finden bei fast jeder sichtbaren Änderung solche Majors (hier #159 vorbestehend in allen vier Listen, #160 Suchumfang). Bei «arbeite alle Bugs nacheinander ab» steht der Lauf darum nach jedem Bug, obwohl die Regel das Ergebnis schon vorgibt. Vorschlag: Merge ohne Rückfrage, wenn alle offenen Majors zu diesen zwei Arten gehören, je ein Issue haben und im PR-Text stehen; Rückfrage nur für andere Majors.
- **W-2 (Major) `CLAUDE.md:60` – «UI changed» ist mehrdeutig.** Der Fix änderte keine Zeile UI-Code (nur Backend und Tests), aber das sichtbare Verhalten des Bildschirms. Ob die Personas laufen müssen, sagt die Regel nicht; ich habe sie laufen lassen (zwei Personas, rund 5 Minuten, plus Persona-Stack-Build). Vorschlag: «UI changed or what a screen shows changed (also by a backend change)» oder ausdrücklich das Gegenteil.

## Minor

- **W-3 (Minor) `CLAUDE.md:65` – Re-Review nach reinen Minor-Fixes.** «Re-review only the delta and the open findings» lässt offen, ob nach Fixes von nur Minors/Nits (hier C-1 Doku, C-2 Test) eine weitere `code-reviewer`-Runde nötig ist. Schritt 4 verlangt sie nur, solange ein Blocker/Major offen ist. Ich habe keine zweite Runde gestartet. Vorschlag: «A re-review round is needed only when a Blocker/Major was fixed or the fix changes production code».
- **W-4 (Minor) `CLAUDE.md:67` – Plan-Session bei Aufträgen mit mehreren PRs.** Schritt 8 kennt eine Session pro Aufgabe und das Archivieren «before the final commit». Ein Serienauftrag (ein PR pro Bug) mergt Zwischenstände mit einer halb abgehakten Session nach `main`. Unklar, ob pro Issue eine Session (und Archiv vor jedem PR) oder eine Session für den ganzen Auftrag gilt. Vorschlag: «one session per pull request» festhalten.
- **W-5 (Minor) `.claude/agents/persona.md` – Personas melden vorbestehende Fehler als Befund des Slices.** Beide Personas meldeten P-1 (Filter folgen der URL nicht) als Major dieses Slices; erst der Abgleich mit dem Code zeigte, dass es auf `main` und in drei anderen Listen genauso ist. Schritt 7 braucht diese Unterscheidung, die Persona kann sie nicht treffen. Vorschlag: im Persona-Auftrag die geänderten Teile nennen und den Aufrufer in Schritt 6 ausdrücklich den Basis-Commit prüfen lassen («existed before» mit Reproduktion auf dem Basis-Commit belegen).
- **W-6 (Minor) `backend/CLAUDE.md:30–31` – rote Phase bei Listenfiltern.** Zwei von drei neuen pg-Tests waren vor dem Fix grün, weil in `dwello_test` sonst keine Wohnungen lagen: ein Filter ohne Nicht-Treffer in den Daten prüft nichts. Erst ein zweites Gebäude machte sie rot. Vorschlag (Teststil): «A test of a filter or search also creates a record that must not match».
- **W-7 (Minor) Stop-Hook `~/.claude/stop-hook-git-check.sh` vs. `CLAUDE.md:73`.** Der Hook verlangte zweimal Commit und Push vor Ende der Persona-Reviews. `CLAUDE.md:73` regelt das, der Hook kostet trotzdem pro Turn eine Runde. Vorschlag: im Repo nichts ändern; wenn möglich den Hook so einstellen, dass er lokale Commits auf einem Branch ohne PR akzeptiert. Ausserhalb des Repos, also nur als Hinweis.

## Nit

- **W-8 (Nit) `CLAUDE.md:58` – `git worktree remove` ohne `--force`.** Ich habe den Review-Worktree mit `--force` entfernt und damit die `ask`-Regel in `.claude/settings.json` ausgelöst. Nachgeprüft: ohne `--force` geht es auch mit den `node_modules`-Links (in `.gitignore`). Die Regel ist richtig; ein Halbsatz «(no `--force` needed: the links are ignored)» verhindert den Fehlgriff.
- **W-9 (Nit) `tests/e2e/steps/buildings.steps.ts:32` – allgemein klingender Schritt an eine Seite gebunden.** «sieht der Liegenschaftsverwalter den Hinweis {string}» prüft nur `buildings-empty`. Für die Wohnungsliste brauchte es einen zweiten Schritt mit Ort im Namen. `tests/e2e/CLAUDE.md` könnte sagen: ein Schritt, der eine Stelle einer bestimmten Seite prüft, nennt die Seite.
- **W-10 (Nit) `CLAUDE.md` «Open work» – Persona-Minors über mehrere Ziele verteilt.** Pro Persona-Bericht landeten die Minors/Nits teils im neuen Entscheidungs-Issue (#160), teils in `offene-punkte.md` (U-22), weil der Suchumfang funktional ist und der Rest Usability. Regelkonform, aber für den Leser zerstreut. Kein Änderungsvorschlag, nur Beobachtung.

## Hat getragen (keine Änderung nötig)

- Die Grenze `entscheiden` = nicht starten (`CLAUDE.md`, «Open work») war eindeutig: 7 der 21 Bugs übersprungen und unter «Blocked on me» gemeldet.
- Ohne Domänenregeln kein `fach-reviewer` (Schritt 1): eindeutig.
- `tests/e2e/CLAUDE.md` (Isolation, `names.get`, `seed.idOf`) reichte, um die Nummernsuche innerhalb eines Gebäudes isoliert zu machen.
- Die Gates (fallow, deepcheck, commit-msg) haben nichts blockiert und kosteten keine Zeit.

## Nicht bestätigt

- Ob W-1 der Absicht des Produktverantwortlichen entspricht: Schritt 9 kann die Rückfrage bewusst verlangen.
- Der Stop-Hook (W-7) liegt ausserhalb des Repos; sein Inhalt nicht gelesen.
