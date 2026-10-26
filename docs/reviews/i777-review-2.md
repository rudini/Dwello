# Review #777, Runde 2 (Abschlussrunde, ae848a2c..f7dddaeb)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Blocker | .github/workflows/ci.yml:242–247 | Behoben (nach Lesen; der CI-Lauf ist der Beweis): Bun kommt per npm ins Home, ohne unzip und ohne apt |
| C-2 | Minor | docs/architecture/risks-and-tradeoffs.md:105 | Behoben: Die Zeile nennt die Image-Lösung und den Job «UI screenshots», der weiter selbst installiert (ci.yml:444, `playwright install --with-deps`). Das stimmt mit dem Code überein |

Keine neuen Befunde.

Geprüft:
- npm liegt auf PATH. Das Image installiert `nodejs` samt npm, und `setup-node` legt Node 22 davor.
- `$HOME` wird in der Shell des `run:` aufgelöst, im Container also zu `/github/home`. Das Verzeichnis ist das gemountete `_github_home` des Runners und gehört uid 1001. Darum sind `--prefix "$HOME/.local"` und der npm-Cache in `$HOME/.npm` für uid 1001 beschreibbar.
- `GITHUB_PATH` gilt auch in Container-Jobs für alle folgenden Schritte. Die Schritte `bun install` und `bun run test:e2e` sehen also `bun` und `bunx` aus `$HOME/.local/bin`, und das gilt auch für die Kindprozesse (Backend über `bun run`).
- Alle anderen Jobs behalten `setup-bun@v2` (ci.yml:78, 102, 167, 312, 331, 389, 424). Das Repo legt nirgends eine Bun-Version fest: weder `packageManager` noch `.bun-version`, `.tool-versions` oder `bun-version`. Beide Wege holen also die neueste Version.
- `setup-node` lädt unter Linux `.tar.gz` und entpackt mit tar und gzip, beide sind im Image. unzip braucht es nicht.
- Diff vollständig gelesen; ponytail-review ohne Befund.

## Nicht bestätigt

- Ob der Schritt in CI wirklich läuft: Er ist noch nicht gelaufen, der PR-Lauf entscheidet. Der lokale npm-Install (bun 1.4.4 über `@oven/bun-linux-x64`, `bin/bun` und `bin/bunx`) ist vom Aufrufer gemeldet, nicht nachgeprüft. Er setzt voraus, dass npm das postinstall-Skript des Pakets `bun` ausführt (Standard, kein `--ignore-scripts` gesetzt).
- Ob die neueste Version auf npm und die neueste auf GitHub (setup-bun) gleich sind: npm kann kurz nach einem Release hinterherhinken. Das ist ohne Pin ein kurzes Fenster und trifft nur `--frozen-lockfile` bei einem Wechsel des Lockfile-Formats. Kein Befund.
- Ob `setup-node` auf `.tar.xz` zurückfällt, wenn das Manifest Node 22 nicht führt: Für diesen Fall fehlt `xz` vermutlich. Ungeprüft, für Node 22 aber nicht zu erwarten.
