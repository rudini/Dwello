# Review #1274 (dc3b286e..779e96e6), Runde 2 (Abschlussrunde)

Geschlossen: C-1, C-2, C-3

Keine neuen Befunde.

- C-1: `pr-comments.yml:56-57` holt `"$SHA"` und checkt genau diesen Commit aus. Der Status in Z. 61 geht auf denselben Commit. `pr-comments.test.ts` hält Fetch und Worktree auf `$SHA` fest.
- C-2: Z. 120 und 159-160 nehmen `process.env.SHA`, also denselben Wert wie der Veröffentlichungspfad. Der Test schliesst `pr.head.sha` aus.
- C-3: Das Skript läuft mit cwd `trusted/` (Z. 60). Damit verweisen `import.meta.url` und der Fallback `process.cwd()` (`check-issues.mjs:330`) beide auf `node_modules` von main. Git arbeitet über `GIT_DIR`/`GIT_WORK_TREE` auf dem Baum des PR. Das Skript liest nur über `git` (Z. 21, 91, 95), nicht über `fs`. Der Kommentar in Z. 48-49 stimmt jetzt.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bunx vitest run tools/ci tools/review-report` (84 grün; neue Pins vorher rot gesehen, Link-Test vor der Renderer-Änderung rot), Prettier, ESLint. Ebenfalls vom Aufrufer gemeldet: der manuelle Lauf von `check-issues.mjs` mit `GIT_DIR`/`GIT_WORK_TREE` bei cwd ausserhalb des Arbeitsbaums. Selbst nichts ausgeführt. Dass `git grep` (Z. 21) bei cwd ausserhalb von `GIT_WORK_TREE` den Baum des PR durchsucht, stützt sich nur auf diesen Lauf.
- `git fetch origin "$SHA"` für einen Fork-Commit, der nach einem weiteren Push nicht mehr Kopf von `pull/N/head` ist: Ob GitHub ihn noch ausliefert, habe ich nicht geprüft. Scheitert der Fetch, bricht der Step vor Z. 61 ab, und es fehlt ein Status. Ein falscher Status entsteht so nicht. Ausserdem findet Z. 36 den PR in diesem Fall meist gar nicht mehr, weil `head.sha` nicht mehr passt.
- Dependabot (offen aus Runde 1): Ich habe nicht geklärt, ob ein `workflow_run`, den ein Dependabot-Lauf auslöst, ein Nur-Lese-Token bekommt. Wenn ja, scheitert Z. 61, und «Gate check (main)» fehlt bei Dependabot-PRs. Gesucht habe ich nur im Repo, nicht in der GitHub-Doku.
- 0817c446 (`report.ts:208-211`): Der Override `link` nutzt die Signatur `(href, title, text)` aus marked 12, passend zur eingebundenen Version 12.0.2. Bilder mit `javascript:`-URL laufen nicht über `link`, werden aber von Browsern nicht ausgeführt. Rohes `<a>` maskiert der Override `html`. Im Browser habe ich das nicht geprüft. Der Test vergleicht nur den Text der Ausgabe.

Geprüft: das ganze Delta (`pr-comments.yml`, `pr-comments.test.ts`, `report.ts`, `report.test.ts`). Ponytail: nichts überflüssig.
