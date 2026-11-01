# Review #713 (d0e794e63..e018565b4), Runde 2 / Abschlussrunde

Geschlossen: C-1, C-2, C-3, C-4, C-5

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-6 | Minor | tools/claude-hooks/main-push-guard.test.ts:51 | Der Fall «a continued line» (`git push \⏎  origin` auf main) ist auch ohne den Fix grün: der alte Tokenizer liefert `[["git","push","\\"],["origin"]]`, ein Positional (`\`), also läuft die Logik für den nackten Push, `@{push}` = main, Rückfrage. Die Ersetzung `\\\n` in main-push-guard.mjs:17 hat damit keinen Test, der ohne sie rot wird. Den Fall aus C-2 bildet erst `git push origin \⏎HEAD:main` aus `onFeature` ab (alt: `[[…,"origin","\\"],["HEAD:main"]]`, keine Rückfrage). Der Commit nennt «10 new cases red first»; neu sind 14, davon pinnen `--mirror`, `origin main`, `:main` Bestehendes, der Fall hier ist keiner davon |
| C-7 | Minor | .claude/hooks/main-push-guard.mjs:27 | Regression durch den Backtick als Trenner: Text in einem Heredoc wird zum Kommando. `cat > d.md <<'EOF'⏎Run \`git push origin main\` first⏎EOF` ergibt neu `["git","push","origin","main"]` (alt `["Run","\`git",…]`), also eine Rückfrage aus dem Feature-Branch für eine Datei, die nur über den Push schreibt. Das ist eine Rückfrage, kein Block, trifft aber gerade Dokumente und Commit-Bodies über diesen Hook (`git commit -F - <<'EOF'`) |
| C-8 | Minor | .claude/hooks/main-push-guard.mjs:96 | `cd` mit Shell-Expansion geht ohne Rückfrage durch: `cd ~/Dwello && git push`, `cd "$REPO" && git push` und `cd -` werden wörtlich mit `resolve` an `input.cwd` gehängt (`<cwd>/~/Dwello`), das Verzeichnis gibt es nicht, `spawnSync` liefert keine Ausgabe, `current` und `target` sind leer, keine Rückfrage, auch wenn das Ziel ein Checkout von main ist. `pushd` wird gar nicht verfolgt. Agents schreiben meist absolute Pfade, darum Minor |

## Nicht bestätigt

- Rotlauf der 10 neuen Fälle, `main-push-guard.test.ts` grün (26 Fälle), `tools/claude-hooks` (61 Tests), `bun run lint`, Prettier: vom Aufrufer gemeldet. Selbst nur den Tokenizer `commands()` alt und neu in-memory ausgeführt (node -e, kein Schreibzugriff); die Aussagen zu `toMain` sind aus dem Code gelesen, nicht gegen echte Repositories ausgeführt (dafür hätte ich Repositories anlegen müssen).
- Weiter offen aus Runde 1: ob `main` per Branch-Schutz direkte Pushes abweist und ob `permissionDecision: "ask"` im Bypass-/Auto-Modus wirklich fragt.

Geprüft: Fixes C-1 bis C-5 im Code (cd-Verfolgung :92-98, Umleitungen :38-39, Präfixe :42-51, Git-Optionen :61-66, Refspecs :76-88) und ihre Testfälle; Regressionen `git push -q -u origin <feature> 2>&1 | grep -v …` (Tokenizer: `2>` fällt weg, `1` eigenes Kommando, Ziel feature), `git fetch`, `git log`, `git status` gehen weiter ohne Rückfrage durch; Kopfkommentar und `commit-gates/SKILL.md:34` stimmen mit dem Code überein; nichts Fremdes im Diff, kein ungenutzter Code.
