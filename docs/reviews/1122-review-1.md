# Code-Review #1122, Runde 1 (ff2bc0a65..978d796a9)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `persona-kit.mjs:26` übergibt `env: { ...process.env, LC_ALL: 'C.UTF-8' }`. Playwright ersetzt mit `env` die ganze Umgebung, deshalb muss `process.env` mitkommen, und das tut es. `LC_ALL` ist strenger als das «e.g. LANG» der Anforderung und verfehlt deren Ziel nicht: `LC_ALL` geht vor `LANG` und vor jedem `LC_*`, also hilft es auch bei `LC_ALL=C` in der Shell, wo ein reines `LANG` nicht reicht. Die Abweichung ist damit begründet. `process` in `/* global */` ist nötig, weil die Datei jetzt `process` verwendet. `persona-kit.mjs:26` ist der einzige Start von Chromium in `docs/design/tools`. `persona-stack.sh` startet kein Chromium. Den Export dort hat erst 7e4e3ff55 (#1120) eingeführt, nur für diesen Zweck, also ist das Entfernen sauber. Ausserhalb von `docs/reviews` verweist kein Dokument mehr auf diesen Export. Der Kommentar nennt #496 und #1122 richtig. Ponytail: nichts zu streichen. Ohne App-Änderung gilt «No scenario». Die Commit-Nachricht nennt den Red-Lauf.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint` sauber; Prettier auf `persona-kit.mjs` sauber; `bash -n persona-stack.sh` ok; das Scratch-Skript (Download «Abrechnung_Müller.pdf»): vor dem Fix «download» bei fehlendem LANG und bei LC_ALL=C, nach dem Fix der volle Name bei fehlendem LANG, bei LANG=C, LC_ALL=C und LC_ALL=C LC_CTYPE=POSIX. Das Skript liegt nicht im Worktree, ich habe es weder gesehen noch ausgeführt.
- Ob es die Locale `C.UTF-8` auf jedem Host einer Persona gibt (glibc ab 2.35, Debian/Ubuntu ja; macOS kennt sie nicht, dort hängt Chromium den Dateinamen aber nicht an die Locale): nicht geprüft. Für den Container dieses Repos meldet der Aufrufer, dass der Lauf funktioniert.
- Einen festen Test gibt es nicht, weil persona-kit keine Testumgebung hat. Die Anforderung ist darum nur durch den Code und den gemeldeten Lauf belegt.
