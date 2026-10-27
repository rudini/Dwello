# Code-Review #729, Runde 1 (7162fb67..8b53d521)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: Der Stand-in `flock` (exit 0) liegt in `dir`, das in `update()` vorne auf PATH steht, neben dem `docker`-Stand-in (`tools/release/demo-update.test.ts:30-32`); `update.sh:9` (`flock -n 9 || exit 0`) läuft damit auf macOS weiter, statt still ohne Build zu enden. Der Stand-in verdeckt nichts, was der Test vorher prüfte: Keiner der beiden Tests übt einen belegten Lock aus, mit echtem `flock` war der Lock dort ebenfalls immer frei; `exec 9>.git/demo.lock` läuft weiterhin echt. Der Lock selbst (auch `reset-demo.sh:10`) war und bleibt ungetestet; das ist kein Teil von #729. Kommentar und JSDoc stimmen mit dem Code; der Diff berührt nur die Test-Datei, kein Szenario nötig (reine Teständerung). Red-Run: ohne die Änderung endet `update.sh` bei fehlendem `flock` (exit 127) mit `exit 0` ohne Build, beide Tests erwarten aber Builds, schlagen also fehl; plausibel nach Lesen des Skripts.

## Nicht bestätigt

- `bunx vitest run tools/release/demo-update.test.ts` (2 grün), der Red-Run mit einem `flock`, der mit 127 endet, `bun run lint` und der Prettier-Diff: vom Aufrufer gemeldet; nicht wiederholt (Zugriff auf `node_modules` im Worktree durch Berechtigungsregel gesperrt).
- Lauf auf echtem macOS: nicht möglich, nur nach Lesen von PATH-Aufbau und Skript beurteilt.
