# Code-Review #643, Runde 1 (fa8504a..d58bbf7)

| ID  | Schwere | Datei:Zeile | Befund |
| --- | --- | --- | --- |
| C-1 | Major | tools/open-work/check-issues.mjs:82-83 | Reine Einfügungen in ein geschütztes Szenario oder in die Grundlage werden nicht erkannt: Hunks `-N,0` zählen keine Zeile, also kommt ein neuer Schritt (`Und …`) in einem Szenario ohne `@wip` oder in der `Grundlage:` ohne Freigabe durch |
| C-2 | Minor | tools/open-work/check-issues.test.ts:127-167 | Kein Test für die Zuordnung zu Kopf und Grundlage (`header.wip = owner.every(…)`, Zeile 151) und keiner für `Szenariogrundriss`/neue Beispiele-Zeile. Die Checkliste nennt «new Examples row», einen Test dafür gibt es aber nicht |

## C-1 (Major): eingefügte Schritte ändern die Spezifikation unbemerkt

`git diff -U0` meldet eine reine Einfügung als `@@ -N,0 +M,k @@`. Die Schleife `for (line = start; line < start + count; …)` läuft bei `count = 0` nie. Eingefügte Zeilen ordnet die Prüfung darum keinem Szenario zu. Frei ist laut Entscheid aber nur «a new scenario or a new Examples row», und «the feature header and Background of a file with such scenarios» ist geschützt. Ein neuer Schritt in der Grundlage ändert jedes Szenario der Datei, ein eingefügter `Wenn`/`Und`-Schritt ändert, was ein Szenario prüft. Beides ist weder ein neues Szenario noch eine Beispiele-Zeile.

Nachweis (temporäres Repo im Scratchpad, Skript aus dem Worktree, `BASE_REF=main GITHUB_TOKEN=`). Basis: eine Datei mit `Grundlage:`, einem Szenario ohne `@wip` und einem `Szenariogrundriss` mit Beispielen:
- `Und die Prüfung ist abgeschaltet` als neue Zeile in der Grundlage: exit 0, keine Meldung
- `Und er löscht «Seeblick»` zwischen `Wenn` und `Dann` des Szenarios: exit 0
- neuer Schritt im Szenariogrundriss: exit 0
- neue Beispiele-Zeile: exit 0 (so gewollt)
- `@wip` vor das Szenario bzw. die Datei gesetzt: exit 1 (so gewollt)

Behebung: Eine Einfügung, deren alte Nachbarzeilen N und N+1 zum selben geschützten Szenario (oder zum Kopf) gehören, als Änderung zählen. Ausgenommen sind eingefügte Tabellenzeilen (`|`) unter `Beispiele:` sowie Tag-Zeilen, die die `@wip`-Prüfung schon abdeckt. Den Test dazu zuerst rot sehen: Schritt in der Grundlage und in einem Szenario ohne `@wip` einfügen, Erwartung exit 1.

Falls der Aufrufer «changed or removed line» wörtlich liest, sodass Einfügungen frei wären: Dann widerspricht das dem Schutz der Grundlage, und die Frage gehört in #643 zum Product Owner.

## Nicht bestätigt

- Die vom Aufrufer genannten Checks (vitest der fünf Dateien, 51 bestanden; `bun run lint`; `bun run check`; Backend `type-check`; Prettier; Commit-Hooks; manueller Lauf über origin/main~30): vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Rotläufe: nur gelesen. Der Teil «neues Szenario» im Test `lässt neue Szenarien … durch` kann ohne Code nicht rot werden (eine reine Einfügung meldete die Prüfung nie). Rot zeigt er nur über den `@wip`-Teil, wie die Commit-Nachricht sagt.
- Die Abfrage des Freigabe-Issues (`state_reason`, `labels`) habe ich nur gegen den Mock des Tests gelesen, nicht gegen die echte GitHub-API.
- CI: die Job-Checkout-Tiefe habe ich in `.github/workflows/ci.yml:91` (`fetch-depth: 0`) gelesen, einen CI-Lauf nicht gesehen.

Geprüft: Zeilenzuordnung (Tags zum folgenden Szenario, Kopf/Grundlage, Datei-`@wip`), gelöschte, umbenannte und neue Dateien, Hunk-Zähler ohne Komma, Freigabeprüfung (fehlt, Pull Request, not planned, `entscheiden`), Regeltexte in `CLAUDE.md`, `tests/e2e/CLAUDE.md` und `code-reviewer.md` gegen den Entscheid, CI-Kommentar, Plan; ponytail: nichts zu kürzen.
