# Code-Review Runde 3 (Abschluss, Delta 9ee0057c2): Demo deployt den neuesten Versions-Tag auf main (#1184)

Keine Befunde.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine |

Geprüft: `git reset -q --keep "$version"` (deploy/demo/update.sh:22). Ein Klon, der von Hand über den Tag hinaus gezogen wurde, geht auf den Tag zurück; `--keep` bricht ab, wenn eine lokale Änderung an einer versionierten Datei verloren ginge, und dank `set -eu` wird dann weder gebaut noch `.git/demo-deployed` geschrieben, also Fehler im Log und ein neuer Versuch beim nächsten Lauf. Nicht versionierte Dateien (`deploy/demo/.env`, `.git/demo-*`) bleiben erhalten. Eine nicht versionierte Datei an einem Pfad, den der Tag versioniert, lässt den Lauf mit Fehler abbrechen, statt sie zu überschreiben. Nächster Lauf: Danach liegt der lokale `main` hinter `origin/main`. `describe` auf `origin/main` liefert denselben Tag, und `.git/demo-deployed` passt, also `exit 0` ohne Build. Ein neuerer Tag ist wieder ein Nachfahre, und der Reset geht vorwärts. Ein späteres `git pull` von Hand spult vor, und erst beim nächsten Tag geht es zurück. Der Test (tools/release/demo-update.test.ts:84-95) deckt mit dem zweiten `update()` und der neuen HEAD-Prüfung beides ab. Ohne die Änderung wäre die neue Assertion rot, denn `merge --ff-only` auf einen Vorfahren bleibt beim neueren Commit. Der README-Satz in Abschnitt 7 stimmt mit dem Code überein.

## Nicht bestätigt

- Vom Aufrufer gemeldet: neue Assertion vor der Änderung rot gesehen; vitest auf tools/release/demo-update.test.ts 4/4 grün; `sh -n` ok; ESLint/Prettier sauber; Commit-Hooks bestanden. Ich habe nichts ausgeführt.
- Lokale Commits auf `main` der VM (nicht nur Änderungen im Arbeitsverzeichnis) nimmt `reset --keep` ohne Meldung aus dem Branch; sie bleiben nur im Reflog. Früher blieben sie bei `merge --ff-only` stehen. Das README verlangt einen sauberen Klon auf `main`, und auf der VM entstehen keine Commits. Deshalb ist das kein Befund. Ob es auf der echten VM solche Commits gibt, habe ich nicht geprüft.
- Den Fall «nicht versionierte Datei an einem Pfad, den der Tag versioniert» deckt kein Test ab. Ich habe ihn nur aus dem dokumentierten Verhalten von git abgeleitet.
