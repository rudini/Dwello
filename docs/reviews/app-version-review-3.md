# Code-Review «App-Version und Release-Tags» (#173), Runde 3 (Delta)

Geprüft: Worktree `review-version-code-3`, Delta `7609154..7eec3a8` ohne den Merge von origin/main (aa3eded: nur CLAUDE.md, docs/archive, docs/reviews). Gelesen habe ich alle 8 geänderten Dateien: `.github/workflows/release.yml`, `tools/release/release.sh`, `tools/release/release.test.ts`, `deploy/demo/update.sh`, `tools/release/demo-update.test.ts`, `README.md`, `deploy/demo/README.md` und `implementation_plan.md`. Dazu kommen die Befunde C-8 bis C-10 aus Runde 2.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-11 | Minor | implementation_plan.md:21 | Plannotizen unvollständig. Bei C-9 fehlt die Meldung (`Test red: … – <message>`). Für die übrigen neuen Tests steht keine `Test red`-Zeile da: release.test.ts «gibt einem Merge die nächste Version …», «lässt einen schon getaggten Merge …», «lehnt eine Version von Hand in falscher Form ab» und demo-update.test.ts «baut main erst, wenn es getaggt ist». Sie wurden nach dem Code geschrieben, also wäre Rot durch Herausnehmen des Codes zu zeigen. |
| C-12 | Nit | deploy/demo/update.sh:17,22 | `.git/demo-deployed` hat ein neues Format (`<sha> <version>`). Eine laufende Demo mit der alten Datei (nur der SHA) baut darum nach dem Merge einmal ohne Grund neu. Das ist harmlos, aber in deploy/demo/README.md:96 nicht erwähnt. |
| C-13 | Nit | tools/release/demo-update.test.ts:31 | Der Test braucht `flock` (util-linux), weil update.sh:10 es aufruft. Auf macOS gibt es `flock` nicht, dort schlägt der Test fehl. In CI (ubuntu) und in den Cloud-Sessions ist es vorhanden. |

## Blocker/Major

Keine.

## Status der Befunde aus Runde 2

- **C-8 (Minor): behoben.** update.sh:13 holt die Tags mit `--prune` und dem Refspec `+refs/tags/*:refs/tags/*`. Ein auf GitHub gelöschter Tag verschwindet so auch lokal. Die Version wird einmal ermittelt (Z. 15), mit dem Commit in `.git/demo-deployed` verglichen (Z. 17, 22) und als `APP_VERSION` gebaut (Z. 21). Dadurch löst eine von Hand ersetzte Version auf demselben Commit einen Neubau aus. `origin/main` wird trotz des expliziten Refspecs `main` weiter aktualisiert (opportunistisches Update des Remote-Tracking-Branches). Der Test demo-update.test.ts:56-66 bildet genau den Ablauf aus Runde 2 nach: v0.5.0 bauen, Tag auf der Gegenseite löschen, v1.0.0 pushen, erwartet ist `['v0.5.0','v1.0.0']`. Ein fehlgeschlagener Build schreibt die Markierung weiterhin nicht (Z. 21 vor 22, `set -e`).
- **C-9 (Minor): behoben.** release.sh:8 bricht ab, bevor die Schleife etwas löscht, wenn `refs/tags/v$VERSION` existiert. Der Checkout mit `fetch-depth: 0` hat alle Tags. Der Test release.test.ts:75-79 prüft, dass die Tags auf dem Remote unverändert bleiben. Ohne die Prüfung würde der gh-Stub nach dem Löschen von v0.2.0 an `git tag v0.1.0` scheitern, aber trotzdem mit 0 enden. Der Remote hätte dann nur noch `['v0.1.0']`, der Test wäre also rot. Folge der Prüfung: Ein zweiter Lauf per Hand mit derselben Version wird jetzt abgelehnt statt neu angelegt. Das ist richtig, der Commit bleibt getaggt.
- **C-10 (Minor): behoben.** release.yml:36 ruft `tools/release/release.sh` auf (Modus 100755 im Commit). Der Inhalt entspricht dem früheren Inline-Skript. Neu sind die Prüfung aus C-9, `set -euo pipefail` statt bash `-e` und der Pfad zu `next-version.mjs` über `dirname "$0"`. Die Exit-Logik bleibt gleich: `describe … && exit 0` löst `-e` nicht aus, `last=$(…)` bricht ohne Tag wie bisher ab. release.test.ts testet das Skript gegen ein Bare-Remote mit einem gh-Stub. Die Argumentpositionen (`$3` = Tag, `$5` = SHA) passen zu release.sh:21. Abgedeckt sind die nächste Version, ein erneuter Lauf, das Ersetzen per Hand (C-1), eine falsche Form und eine schon vorhandene Version.

Auch die READMEs passen zum Code: README.md:282 («not one that exists already») und deploy/demo/README.md:96.

## Nicht bestätigt

- **Selbst ausgeführt:** `bunx vitest run tools/release` im Worktree, Ergebnis 3 Dateien und 11 Tests grün. Die Warnungen «push negotiation failed» kommen von der Git-Konfiguration der Umgebung und ändern das Ergebnis nicht.
- **Rot vor dem Fix:** Für C-8 (Received ["v0.5.0"]), C-9 und C-1 hat der Aufrufer Rot gemeldet. Ich habe es nicht wiederholt, weil ich dafür update.sh bzw. release.sh im Worktree hätte ändern müssen.
- **Weitere Prüfungen:** lint, check, deepcheck:audit, fallow audit, open-work-Tests, E2E (navigation, sprachen*, accessibility, 313 passed), Coverage und Backend-Tests sind vom Aufrufer gemeldet und nicht neu ausgeführt. Die E2E-Läufe stammen von vor den Fixes aus Runde 2; diese Fixes berühren keinen App-Code (`src/` ist im Delta nicht geändert).
- **Verhalten auf GitHub:** Ob Tag-Rulesets das Löschen mit `GITHUB_TOKEN` erlauben und wie sich `gh release create`/`delete` wirklich verhält, lässt sich ohne einen Lauf auf GitHub nicht prüfen. Der Test nutzt einen Stub.
- **Andere Git-Versionen:** `git fetch --prune` mit explizitem Refspec habe ich nur über den Test mit Git 2.43 geprüft.
