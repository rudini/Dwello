# Code-Review Runde 2, Slice 934 (Delta `32677b307..a1c356e89`)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-4 | Minor | tools/fitness/p1-benchmark.ts:81 | Mit `BUILD_DIR` landet der Build in `.svelte-kit/persona` (`svelte.config.js:16`), demselben Zwischenordner wie der Build von `persona-stack.sh:24`. Wenn beide Builds im selben Worktree gleichzeitig laufen, leert der eine den Ordner `output` des anderen. `/tmp/persona-app` kann dann halb oder gemischt sein, oder ein Build bricht ab. Laufen sie nacheinander, gibt es keine Kollision: Die laufenden Server lesen nur aus `/tmp/persona-app` bzw. `/tmp/p1-app`, nicht aus `.svelte-kit/persona`. Auch zwischen Sitzungen kollidiert nichts, weil jeder Worktree sein eigenes `.svelte-kit` hat. Der Kommentar in Z. 18 («a build of its own, as the persona stack has») stimmt deshalb nur für den Ausgabeordner. |

Geschlossen: C-1, C-2, C-3

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint` grün, Prettier sauber, `bun run fitness:p1` zweimal gelaufen (7,0 s, 7,5 s), danach die Ports 3320/3321 frei. Selbst nichts ausgeführt (kein `node_modules`, keine Datenbank).
- Ob `process.kill(-pid)` die Gruppe des Frontends mitsamt aller Kindprozesse beendet: nur gelesen (`detached: true` macht jeden Server zum Leiter einer eigenen Prozessgruppe). Gestützt wird das durch die Meldung des Aufrufers, die Ports seien danach frei gewesen.
- Fehlt `fuser`, wirft `execFileSync` ENOENT, und die Portprüfung (Z. 71-79) meldet «frei». Wie in Runde 1 hängt das Skript also von `fuser` ab. Im Container ist `fuser` vorhanden (`persona-stack.sh` braucht es ebenso), geprüft habe ich es nicht.

Geprüft: Die Ports 3320/3321 belegt kein anderes Skript (persona 3300/3301 und 3310/3311, E2E 3100–3106). Ist ein Port belegt, bricht der Lauf vor dem Build ab, ohne etwas zu beenden. Am Ende stoppt das Skript nur die beiden selbst gestarteten Prozessgruppen. Der Build schreibt weder nach `build/` noch den E2E-Stempel, und `build-if-changed.mjs` wird nicht mehr aufgerufen. `package.json` und der Link auf `node_modules` sind gesetzt wie in `persona-stack.sh:26`. Die Prüfung `created.length !== APARTMENTS` steht vor der PDF-Messung. Die Doku nennt die neuen Ports und den eigenen Build. In der Spanne von «sieben Läufe 6,4–7,5 s» stecken auch die beiden neuen Läufe.

## Triage

- C-1, C-2, C-3: closed.
- C-4 (Minor): stays. The two builds collide only when the persona stack and the benchmark build at the same moment in the same worktree.
