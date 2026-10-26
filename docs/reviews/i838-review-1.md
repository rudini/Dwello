# Review i838, Runde 1 (origin/main..b8e5dcc0)

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: `ci.yml:55–65` selbst ausgeführt (push): 12 E2E-Einträge mit shard 1..12/12, 1–6 `--grep-invert '@a11y|sprachen-bildschirme' --shard=n/6`, 7–12 `--grep sprachen-bildschirme --shard=n/6`, axe 1..3/3; die `'\''`-Folgen ergeben im JSON gültige einfache Anführungszeichen. Quoting im Schritt `ci.yml:262`: Die Shell entfernt die einfachen Anführungszeichen, `bun run` (lokal 1.4.4) hängt die Argumente nur an den letzten Befehl des Skripts `test:e2e` (`package.json:13`) und setzt sie dort in doppelte Anführungszeichen; nachgestellt mit einem Ersatzskript kommen `["--grep-invert","@a11y|sprachen-bildschirme","--shard=1/6"]` an, `|` wird also nicht als Pipe gelesen. Kein Wrapper in `tools/e2e` dazwischen. Das Feld `filter` hat keinen Nutzer mehr; Artefaktnamen `e2e-reports-1..12` und `a11y-reports-1..3` eindeutig; `SKIP`/`PROJECTS` (`ci.yml:220–222`) hängen nur an `reports` und dem Event, unverändert richtig; `e2e-results` liest `shards` (`{"E2E tests": 12}`) unverändert. Docs (`test-pyramid.md:102`, `utility-tree.md:139`) beschreiben die neue Aufteilung zutreffend. Ponytail: nichts Unbenutztes, keine Kopie eines Helpers.

## Nicht bestätigt

- PR-Pfad (5 Shards, `--grep-invert @a11y`, Chromium + API über `PROJECTS`): vom Aufrufer gemeldet; nur per Lesen von `ci.yml:61–63` und `:222` nachvollzogen.
- Zählungen von `bunx playwright test --list` (813 in einer Datei, keiner davon `@a11y`; 6× 486/487; 3731 gesamt): vom Aufrufer gemeldet, nicht erneut ausgeführt.
- `bunx vitest run tools/deepcheck/test/workflows.test.ts src/__tests__/open-work.test.ts`: vom Aufrufer gemeldet, nicht erneut ausgeführt.
- Messwerte in `utility-tree.md:139` (Run 40293821912: 19,6 min, Testschritt 3,5–18 min): nicht gegen die CI-Logs geprüft.
- Bun-Version im CI wird per `npm install --global bun` ungepinnt installiert (`ci.yml:251–253`, vorbestehend); das Quoting-Verhalten ist nur mit Bun 1.4.4 lokal bestätigt.
- Laufzeit und Wall Clock des nächsten Push-Laufs auf `main`: erst nach dem Merge prüfbar.
