# Review Slice 935, Runde 1 (8ae908c43..d1c138d95)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | deploy/demo/update.sh:14 | Der Kommentar «the release workflow tags it seconds after the merge» stimmt nach dem Diff nicht mehr: `main` wird nur noch montags getaggt, das Skript meldet die ganze Woche alle 5 min «main not tagged yet». `deploy/demo/README.md:98` wurde angepasst, die Zeile im Skript nicht. |
| C-2 | Minor | docs/installation.md:27 | «A new version comes out at most once a week, on Monday morning» ist falsch: Ein Lauf von Hand (`workflow_dispatch`, `release.sh` ohne `SCHEDULE`) veröffentlicht jederzeit eine weitere Version, so steht es auch in README.md:291. |

Keine Blocker oder Majors.

Ponytail-Review: Schlank, kann so gemergt werden. net: -0 lines possible.

Geprüft: Cron-Filter in `release.sh:9-12` (`${offset:2:1}` bei +0100/+0200 ergibt 5 bzw. 4 UTC; die Umstellung der Sommerzeit fällt auf einen Sonntag, also gibt es am Montag keinen mehrdeutigen Fall; verspätete Läufe bleiben am Cron-String erkennbar). Ein schon getaggter HEAD erzeugt kein Release und keine Ausgabe, der Job `images` wird dann übersprungen (`if: needs.release.outputs.version != ''`). «Re-run failed jobs» übernimmt die Ausgaben des schon erfolgreichen Jobs. `version` ist optional, und ein leerer Wert führt in den berechneten Zweig. Die neuen Tests (`release.test.ts:78-100`) wären ohne die Änderung rot: Auf der Basis schreibt der getaggte Fall `version=0.2.0`, und der Cron 04:00 im Winter löst ein Release aus. Der Fake von `date` im PATH trifft nur `date +%z`. `upgrade-check.sh:12` (`describe … HEAD^`) nimmt den letzten Tag vor HEAD, also das letzte Wochen-Release. Die Fusszeile (`src/lib/version.ts`) zeigt zwischen zwei Releases `x.y.z+n-g…`, der Code bleibt unverändert. U1 «Heute» in `utility-tree.md:115` sowie die Zeilen 23 und 199, SP-U1-5 und `fitness-functions.md` sind angepasst. Die Begründung «No scenario» passt: Die Änderung betrifft nur CI-Werkzeuge. Der Diff enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- `bunx vitest run tools/release`, die Tests, die geänderte Dateien lesen (deepcheck readme, testcheck wiring, ui-screenshot-routes, open-work), `bun run lint`, `bun run fitness`, Prettier und der YAML-Parse von release.yml: vom Aufrufer gemeldet, nicht selbst ausgeführt.
- Das Verhalten von GitHub bei `github.event.schedule` (der Cron-String genau so, wie er in der YAML steht, auch bei einem Re-run) und dass `TZ=Europe/Zurich date +%z` auf `ubuntu-latest` die richtige Zeitzone liefert: aus der Doku-Kenntnis angenommen, nicht in einem echten Lauf geprüft.
