# Code-Review #1184, Runde 2 (Delta 1f299641c..79ff9ab0e)

Keine neuen Befunde im Delta.

Geschlossen: C-1

Geprüft: In update.sh:23 steht jetzt `git rev-parse "$version^{commit}"`. Das ist derselbe Ausdruck wie im Vergleich in Zeile 18, also passt die geschriebene Zeile beim nächsten Lauf. Die Zeile, die der alte Code geschrieben hat (HEAD = Commit des Tags), bleibt verträglich. Der neue Test zieht den Klon von Hand über v0.3.0 hinaus, ruft `update()` zweimal auf und erwartet `['v0.3.0']`. Mit `HEAD` in Zeile 23 liefert er `['v0.3.0','v0.3.0']` (rot ohne die Änderung). `git merge --ff-only` auf einen Vorfahren ist ein No-op mit Exit 0, der erste Lauf baut also. Der Helfer `demoGit` ist `at('demo')` und wird benutzt. Plan und Berichtskopie gehören zum Ablauf. Die Commit-Nachricht stimmt mit der Änderung überein. Die Antwort zu `describe --abbrev=0` trägt: release.yml taggt nur auf `main`.

## Nicht bestätigt

- Rot-Lauf des neuen Tests (`['v0.3.0','v0.3.0']`), `bunx vitest run tools/release/demo-update.test.ts` 4/4, `bun run lint`, `bun run check`, `bun run fitness`, Backend-Type-Check, `src/__tests__/open-work.test.ts`, Prettier auf hinzugefügten Dateien, Commit-Hooks: vom Aufrufer gemeldet, nicht selbst ausgeführt.
- `if: github.ref == 'refs/heads/main'` in release.yml: vom Aufrufer gemeldet, in diesem Delta nicht nachgelesen.
- Nach wie vor gilt: Bei einem Klon, der von Hand vor den Tag gezogen wurde, baut das Skript den Code der Spitze unter der Version des Tags (Teil von C-1, Runde 1). Das passiert nur nach einem Eingriff von Hand. Das Delta ändert daran nichts, es behebt die Neubauten alle 5 Minuten, wie in Runde 1 vorgeschlagen.
