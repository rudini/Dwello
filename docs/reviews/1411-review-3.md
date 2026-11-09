# Review 1411, Runde 3 (Abschlussrunde, Delta caa77816..dd058c9d)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-7 | Minor | tools/fitness/fitness.ts:613 | Weiter offen: der `--no-renames`-Fall hat keinen CLI-Test. Als Minor im Bericht zu belassen ist vertretbar: die Option steht unverändert in derselben Zeile, die der neue Arbeitsbaum-Test ausführt, und ein Rückfall würde nur eine Grenze nicht senken (die Ratsche lockert nichts). |
| C-8 | Minor | tools/open-work/check-issues.mjs:157 | Der Präfixvergleich `f.startsWith(\`${path}.\`)` bzw. `` `${path}/` `` nimmt jede hinzugefügte Datei mit diesem Präfix als «verschobenes Ziel». Tauscht `tools/a.ts` den Import von `'../src/old'` auf das unveränderte, bestehende `'../src/other'` und fügt die Änderung zugleich `src/other.test.ts` (oder `src/other/x.ts`) hinzu, geht der Tausch ohne Freigabe durch, also genau der Fall des High-Befunds, sobald neben dem Ziel eine Datei neu ist (bei einer Testdatei üblich). Reproduzierbar mit dem bestehenden Test plus `'src/other.test.ts': '…'` im Kopf: `code: 0` statt «changes a check». Abhilfe: nur `path`, `path` + Quell-Endung (`.ts`, `.js`, `.mjs`, `.svelte`) und `path/index.*` zulassen. |

Geschlossen: keine IDs aus Runde 2 außer C-7 offen; die beiden Befunde der externen Prüfung (High: Importtausch auf ein bestehendes Modul; Medium: `--update` sah nur `base HEAD`) sind im Delta behoben und rot-belegt (der Tausch auf `src/other.ts` scheitert am alten Normalisierungscode, der Arbeitsbaum-Test am alten leeren `diff HEAD HEAD`).

Geprüft: Kurzschluss-Reihenfolge in `onlyImports` (`target()` läuft erst nach erfolgreicher Importprüfung, `exec` liefert dort nie `null`); Pfadauflösung `posix.join(dirname(file), …)`; `git diff <base>` vergleicht den Arbeitsbaum inkl. gestagter Änderungen mit der Basis; der neue Fitness-Test räumt seinen Worktree in `finally` ab, prüft die Senkung und dass keine andere `fat`-Grenze sich ändert (`statements.ts` hat in `ratchet.json` eine Grenze, 500).

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bunx vitest run tools/fitness/fitness.test.ts tools/open-work/` (119 Tests), Prettier auf den geänderten Zeilen, Commit-Hooks: vom Aufrufer gemeldet.
- Rotlauf beider neuer Prüfungen: vom Aufrufer gemeldet; nach Lesen des Codes plausibel, selbst nicht ausgeführt.
- CI grün auf caa77816: vom Aufrufer gemeldet.
- Dass der Fitness-Lauf im HEAD-Worktree ohne Fehler endet (sonst schreibt `--update` nicht und der Test fiele rot statt falsch grün): nicht ausgeführt.
