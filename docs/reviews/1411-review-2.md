# Code-Review Slice 1411, Runde 2

Bereich: `git diff 2ad4449f 95196221 -- . ':!docs/reviews'`, Worktree `review-1411-cr2` auf 95196221. Vorbericht: `docs/reviews/1411-review-1.md`.

Geschlossen: C-1, C-2, C-3, C-4

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-5 | Minor | tools/open-work/check-issues.mjs:150 | `removed.length > 0` ist der Fix für «ein leerer Diff zählt als Änderung» (Modusänderung, Binärdatei), aber kein Test deckt ihn. Ohne die Bedingung bleiben alle Gate-Tests grün: Eine gelöschte Datei hat entfernte Zeilen, eine neue hat ungleich lange Listen. Bei einem `chmod +x` in `tools/` gingen `[]` und `[]` dann ohne Freigabe durch. |
| C-6 | Minor | tools/open-work/check-issues.mjs:149 | Der Filter für die Kopfzeilen (`!line.startsWith('--- ')` bzw. `'+++ '`) wirft auch Inhaltszeilen weg, deren Text mit `-- ` oder `++ ` beginnt (z. B. `-- x;` in TS, ein SQL- oder Markdown-Kommentar). Wer neben einem reinen Pfadwechsel eine solche Zeile ändert, braucht keine Freigabe. Heute hat keine Datei in `tools/` eine solche Zeile (`grep -rn '^[-+]\{2\} ' tools`). Das ist also nur ein Randfall. Lösung: nur die Zeilen nach dem ersten `@@` auswerten. |
| C-7 | Minor | tools/fitness/fitness.ts:613 | Der C-2-Fix (`--no-renames`, damit der alte Pfad einer umbenannten Datei als geändert zählt) hat keinen Test. Kehrt man zu `changedFiles(base, 'HEAD')` (`-M`) zurück, bleibt `fitness.test.ts` grün. |

## Nicht bestätigt

- Vom Aufrufer gemeldet, auf 95196221: `bun run lint`, `bun run check`, `bunx vitest run tools/fitness/fitness.test.ts tools/open-work/ src/__tests__/open-work.test.ts tools/claude-hooks/commit-msg-gate.test.ts tools/deepcheck/test/readme.test.ts tests/unit/a11y-screens.test.ts tests/unit/i18n-screens.test.ts` (174 Tests), Prettier auf den geänderten Zeilen, die Commit-Hooks. Auf c3a5c5e8: die E2E-Zeilen von audit-log für axe und Sprachen (8 passed). Rot-Läufe des Bindungs-Tests und des `--update`-ohne-`--base`-Tests: Durch Lesen bestätigt, beide schlagen auf 2ad4449f fehl. Der alte Regex liess `import { b as x }` durch, und `--update` lief dort ohne Abbruch.
- Wie im Vorbericht: Ob der Pull-Request-Text `Gate change approved: #1411` und `Spec change approved: #1411` trägt, lässt sich im Diff nicht prüfen. Ebenso wenig, ob die Freigabe in #1411 die Ausnahme in `check-issues.mjs` deckt.

Geprüft: `withoutPath` lässt nur eine Importanweisung pro Zeile zu (`[^;'"]*` vor `from`, `;?\s*$` danach) und ersetzt genau den Pfad. Mehrzeilige Imports, `export … from`, eine neue Datei und eine gelöschte Datei verlangen eine Freigabe. Die `--base`-Sperre greift vor dem Lesen von `ratchet.json`, auch bei `--base` ohne Wert. Die CI-Aufrufe (`ci.yml:258`) nutzen kein `--update`. `changedFiles` wird in `fitness.ts:505` weiter gebraucht. Die CLAUDE.md-Sätze passen zu `screens.json` (`paged`, audit-log) und zum engeren Gate.
