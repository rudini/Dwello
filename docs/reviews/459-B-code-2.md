# Code-Review #459 Slice B («Mieter anonymisieren»), Runde 2 (Abschlussrunde vor dem Push)

Gegenstand: `git diff 7840d938 6301e417 -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/design/personas'` (d22c72c5, 6301e417), Worktree `review-459-B-2`.

## Status aus Runde 1 (docs/reviews/459-B-code-1.md)

- C-1 (Toast nennt den Ersatznamen): behoben. `anonymised` hält den Namen beim Öffnen des Dialogs fest; die Closure von `onsuccess` liest ihn auch, nachdem `update()` die Karte ausgehängt hat. Das Szenario prüft den Toast jetzt mit dem Wert («Mieter «…» anonymisiert»). Ein DOM-Test, der den Fehler zeigt, fehlt weiterhin (D-2).
- C-3 (Begründung «No scenario»): behoben, Wortlaut wie in Runde 1 vorgeschlagen.

## Befunde

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| D-1 | Major | `.claude/settings.json:76-81` | Die sechs `psql`-Regeln geben mehr frei als «psql auf den Testdatenbanken». Der Präfix bindet nur die Verbindung, nicht was ausgeführt wird: `psql -h localhost -U dwello -d dwello_test -c 'DROP DATABASE dwello'` oder `… -d dwello_test -c '\c dwello' -c 'TRUNCATE …'` passen auf die Regel und löschen ohne Rückfrage die Entwicklungsdatenbank. Auch `-d dwello_test -d dwello` passt (der letzte `-d` gewinnt). Keine `ask`-Regel fängt `psql` ab, die Regeln sind also wirksam. |
| D-2 | Minor | `src/__tests__/tenant-detail-page.dom.test.ts:333-343` | Der Fix von C-1 hat keinen Test auf der untersten Schicht, die ihn zeigen kann. «meldet das Anonymisieren mit dem bisherigen Namen» übergibt weiter `update: async () => {}`, zeichnet die Seite nicht mit dem Ersatznamen neu und ist auch mit dem alten Code grün; der Titel verspricht, was der Test nicht prüft. Rot gesehen wurde der Fehler nur im E2E-Szenario. |
| D-3 | Minor | `.claude/settings.json:69-73` | Die Regeln `rm -rf /tmp/claude-0/*`, `rm -r /tmp/claude-0/*`, `rm -rf test-results*`, `rm -rf playwright-report*` und `git worktree remove --force /tmp/*` sind heute wirkungslos, weil `ask` vor `allow` gilt und `rm -r*`, `rm -f*` und `git worktree remove *--force*` sie abfangen. Werden diese `ask`-Regeln später entfernt, sind die Regeln zu weit: `*` umfasst Leerzeichen und `..`. Damit passen `rm -rf test-results /home/user/Dwello`, `rm -rf /tmp/claude-0/../../home/user` und jedes Worktree unter `/tmp` auch anderer Sitzungen. `/tmp/claude-0/*` umfasst ausserdem die Scratchpads und Review-Worktrees aller Projekte und Sitzungen, nicht nur «das Scratchpad». |
| D-4 | Minor | `.claude/settings.json`, Commit d22c72c5 | Die Änderung der Berechtigungen gehört nicht zu #459 und steckt im Commit `fix(tenants): …`. Ein eigener Commit `chore(config): …` würde sie trennen. Das Einverständnis des Product Owners ist nur vom Aufrufer gemeldet. |

### D-1 (Major): psql-Regeln öffnen die Entwicklungsdatenbank

Warum falsch: Nach `CLAUDE.md` («When to ask») ist nur das Neuanlegen von `dwello_persona`, `dwello_test` und `dwello_e2e` nicht destruktiv. Das Löschen anderer Daten verlangt eine Rückfrage. Die Regel bindet aber nur das Ziel der Verbindung. Der Benutzer `dwello` darf von jeder Verbindung aus Datenbanken löschen, die ihm gehören, und mit `\c` wechselt `psql -c` die Datenbank. So lässt sich `dwello` ohne Rückfrage ändern oder löschen.

So zeigt es sich: Prüft man `PGPASSWORD=dwello psql -h localhost -U dwello -d dwello_e2e -c 'DROP DATABASE dwello'` gegen die Regeln, passt `Bash(PGPASSWORD=dwello psql -h localhost -U dwello -d dwello_e2e*)` und keine `ask`- oder `deny`-Regel. Der Befehl läuft also ohne Rückfrage.

Möglicher Fix: Keine allgemeine `psql`-Freigabe, sondern nur die tatsächlich gebrauchten Befehle als feste Zeichenkette (z. B. das Neuanlegen über das vorhandene Skript). Alternativ `ask`-Regeln für `*DROP DATABASE dwello*`, `*\c dwello*` und `*-d dwello *` ergänzen. Diese bleiben aber lückenhaft (Gross- und Kleinschreibung, `-f datei.sql`). Ob die Freigabe so gemeint war, entscheidet der Product Owner.

Geprüft: Der Fix C-1 ist richtig (`dialogSubmit` ruft `update()` vor `answered`, die Closure hält den Wert). Die Question liefert den Text des Toasts. Der Step ruft nur eine Question. Feature-Text ohne UI-Wörter. Der Toast-Text steht in allen vier `messages/*.json`, unverändert. Mit dem alten Code schlägt der neue Step nach Lesen fehl («Anonymisierter Mieter»). Keine neuen Bildschirme. ponytail-review: kurz, nichts Ungenutztes im App-Code.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bunx vitest run src/__tests__/tenant-detail-page.dom.test.ts` (35 grün), E2E «Ehemaligen Mieter nach Ablauf der Aufbewahrung anonymisieren» in Chromium (grün, vorher rot mit dem alten Code). Nicht selbst ausgeführt. `bun run check` und Firefox/WebKit sind nicht gemeldet.
- Einverständnis des Product Owners zu den Berechtigungen (D-4): nur vom Aufrufer gemeldet, im Repository nicht belegt.
- D-1 und D-3 beruhen auf der dokumentierten Reihenfolge deny > ask > allow und der Präfix-Wildcard von Claude Code. Ausprobiert habe ich sie nicht (das hätte Daten verändert).
