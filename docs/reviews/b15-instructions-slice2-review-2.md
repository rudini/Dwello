# Review B-15 Instruktionen, Slice 2 (Runde 2)

Geprüft: `git diff 2f60bc1..955bc2c` (Fix-Commit «docs(config): B-15 slice 2 review findings») im Worktree `review-slice2-code-reviewer`, gegen die offenen Befunde C-1 bis C-10 aus `docs/reviews/b15-instructions-slice2-review-1.md`. Gelesen habe ich alle geänderten Dateien: `CLAUDE.md`, `.claude/agents/code-reviewer.md`, `docs/design/personas/README.md`, `docs/design/personas/demo-records.md`, `docs/test-pyramid.md`, `implementation_plan.md` und den Bericht aus Runde 1. Zusätzlich habe ich `.claude/agents/{persona,fach-reviewer,daten-pruefer}.md`, `tests/contracts/README.md` und die Persona-Stellen in `docs/design/arbeitsregeln.md` gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | – | `CLAUDE.md:54` | Behoben: Das `@wip`-Szenario wird committet, und `fach-reviewer` bekommt einen Worktree dieses Commits (Schritt 4). |
| C-2 | – | `docs/test-pyramid.md:33`, `:41` | Behoben: Beide Stellen verlangen einen Vertrag und sagen, dass ein fehlender angelegt wird. Das passt zu `CLAUDE.md` (Gotchas). |
| C-3 | – | `CLAUDE.md:54` | Behoben: «at most the first lower-layer test». |
| C-4 | – | `CLAUDE.md:93` | Behoben: «review subagents read their own worktree». |
| C-5 | – | `CLAUDE.md:58` | Behoben: Der Bericht geht in den Scratchpad, der Aufrufer kopiert ihn. Dazu C-12. |
| C-6 | – | `CLAUDE.md:65` | Behoben: Der Status ändert sich in der Zeile der Runde, die den Befund gemeldet hat. |
| C-7 | – | `docs/design/personas/demo-records.md` | Behoben: Die Tabelle steht jetzt in einer eigenen Datei, die Personas nicht lesen. `persona.md:7` nennt nur `README.md` und einen Abschnitt in `arbeitsregeln.md`. |
| C-8 | – | `CLAUDE.md:93` | Behoben: Vor dem Force-Push wird gefragt. Dazu C-11. |
| C-9 | – | `CLAUDE.md:56`, `code-reviewer.md:16` | Behoben: `Skills: tdd, ponytail, ponytail-review`, an beiden Stellen gleich. |
| C-10 | – | `CLAUDE.md:58` | Behoben: `review-<slice>-<reviewer>`. |
| C-11 | Minor | `CLAUDE.md:93` | «the force-push this needs» stimmt nicht. Pull Requests werden mit einem Merge-Commit gemergt (`CLAUDE.md:69`), also liegt die alte Branchspitze in `origin/main`. Ein Branch, der neu von `origin/main` beginnt, ist für den Remote-Branch ein Fast-Forward. Wurde der Branch nach dem Merge gelöscht, entsteht er neu. In beiden Fällen braucht es keinen Force-Push. Der Satz führt nur zu einer unnötigen Rückfrage. Er sollte lauten: «ask before a force-push, if one is needed». Oder er fällt weg. |
| C-12 | Nit | `CLAUDE.md:65` gegen `:58` | In Schritt 6 steht weiterhin, der Reviewer schreibe «to the path you name: `docs/reviews/…`». In Schritt 4 nennt man dagegen einen Pfad im Scratchpad und kopiert den Bericht dann an diesen Ort. Man kann beides zusammen lesen, eindeutiger wäre aber «… and you copy it to: `docs/reviews/…`». |
| C-13 | Nit | `implementation_plan.md:26`, `:28` | Die angehakten Punkte 2 und 5 nennen noch den alten Stand: die Tabelle in `README.md` und «only lower-layer tests». Die Notizen und die Triage-Zeile nennen den neuen Stand. |
| C-14 | Nit | `docs/design/personas/demo-records.md:3` | «it reads only `README.md`»: Die Persona liest zusätzlich «Persona runs: how» in `arbeitsregeln.md` (`persona.md:7`). Die Aussage ist ungenau, die Wirkung bleibt aber dieselbe. |

Es gibt keine Blocker und keine Majors.

## Bestätigt

- **`demo-records.md` stimmt mit den Demodaten überein.** Die Tabelle und der Schlusssatz sind Zeichen für Zeichen gleich wie die Tabelle, die aus der README entfernt wurde. Ich habe das per `diff` geprüft, und die Ausgabe ist leer. `backend/demo/demo-data.sql` und `backend/src/db/demo-data.ts` sind seit dem Commit aus Runde 1 (`aa2758a`) unverändert. Damit gilt der Zeilenabgleich aus Runde 1 weiter.
- **`README.md` hat keinen Verweis mehr auf die Tabelle.** Der Abschnitt ist ganz entfernt. Kein Dokument und kein Agent verweist mehr auf «Demo records for a task» (grep). `CLAUDE.md:63` nennt die neue Datei.
- **Keine veralteten Stellen gefunden (grep):** «where one exists», «where a contract exists», «only read your tree», `review-<slice>` ohne Reviewer und die alte Skills-Zeile kommen ausserhalb der Archive und Berichte nicht mehr vor. Einzige Ausnahme ist die Slice-1-Notiz in `implementation_plan.md:22` («Skills: tdd, ponytail-review»). Sie wurde vor der neuen Regel geschrieben, und Slice 1 ist bereits geprüft.
- **Die Agenten passen zu den Regeln.** `fach-reviewer.md` und `daten-pruefer.md` lesen nur im Worktree und schreiben ihren Bericht an den genannten Pfad. Das passt zu Schritt 1, 4 und 5. `persona.md` verlangt keinen Worktree, und Schritt 4 nennt Personas auch nicht.
- **Kein neuer Widerspruch zu `tests/contracts/README.md`.** Diese Datei enthält keine «where it exists»-Einschränkung.
- **Triage-Zeile in `implementation_plan.md:55`:** Sie hat das Format aus Schritt 6 (mit kurzen Erläuterungen) und gibt den Bericht aus Runde 1 an.
- **Umfang:** Das Delta betrifft nur die Befunde C-1 bis C-10, den Bericht und den Plan. Es enthält keinen App-Code und nichts, was nicht dazugehört.

## Nicht bestätigt

- `bun run lint` clean: vom Aufrufer gemeldet, nicht neu ausgeführt. Das Delta enthält nur Markdown.
- `bunx vitest run src/__tests__/open-work.test.ts tools/`, 208 pass: vom Aufrufer gemeldet. Ich habe den Lauf im Worktree zweimal wiederholt:
  - 1. Lauf: 206 von 208 Tests grün.
  - 2. Lauf: 9 Tests rot.
  - Alle roten Tests sind Timeouts nach 5000 ms in `tools/claude-hooks/fallow-gate.test.ts` und `tools/deepcheck/test/{check,cli,hook}.test.ts`. Diese Tests starten Prozesse oder git-Repos.
  - Die Anzahl der roten Tests schwankt, und das Delta ändert nur Markdown. Ich schliesse daraus auf Last durch parallel laufende Prozesse, nicht auf einen Fehler durch den Diff. Bestätigt habe ich das nicht.
  - Tests, die keine Prozesse starten, waren in beiden Läufen grün, darunter `open-work.test.ts`.
- Ob GitHub im Repository Branches nach dem Merge löscht (relevant für C-11): nicht nachgesehen. Für den Befund spielt es keine Rolle, weil in keinem der beiden Fälle ein Force-Push nötig ist.
