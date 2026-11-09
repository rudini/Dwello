# Review #1269b, Runde 1 (86801635..b0f28851)

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Minor | tools/open-work/check-issues.mjs:208-215 | Zwei Zweige von `scriptsChanged` ohne Test: ein unlesbares Manifest (ungültiges JSON, `catch` -> `true`, «fails closed») und ein gelöschtes Manifest mit Skripten (Vergleich gegen `{}`). Der `catch` lässt sich entfernen und ein `return false` einsetzen, ohne dass ein Test rot wird; `gateRepo` kann beides schon (`null` löscht, beliebiger Text ist ungültiges JSON). |

Keine Blocker, keine Majors.

Geprüft: Regex um `backend/bunfig.toml` ergänzt (verankert, nur diese Datei); `package.json`/`backend/package.json` nur bei geänderten `scripts` (Abhängigkeiten bleiben frei, Test vorhanden; Funktionsdeklaration wird gehoben, `from`/`show` stehen vor Zeile 118); die Meldung «changes a check» und die Freigabe über `Gate change approved` laufen über die bestehende `gateChanges`-Logik; ohne die Änderung bleiben die drei neuen Fälle grün mit Code 0, sind also rot ohne den Code; der Abhängigkeitsfall hält das Verhalten der Basis fest; CLAUDE.md «When to ask» nennt die neuen Gate-Dateien; keine weiteren Listen der Gate-Dateien in Skills oder Docs, die nachzuziehen wären; kein Diff außerhalb der Anforderung; kein Szenario nötig (CI-Werkzeug, «No scenario»).

## Nicht bestätigt

- bun run lint, bun run check, bun run fitness -- --base origin/main, bunx vitest run tools/open-work tools/deepcheck/test src/__tests__/open-work.test.ts tools/claude-hooks src/__tests__/feature-wording.test.ts, Prettier auf den geänderten Zeilen, Commit-Hooks: vom Aufrufer gemeldet.
- Die Rot-Läufe der drei neuen Fälle vor dem Code: vom Aufrufer gemeldet; ich habe nur durch Lesen bestätigt, dass sie ohne den Code scheitern würden (`code` 0 statt 1 bzw. keine Meldung).
- Ob der CI-Job (.github/workflows/ci.yml:224 ff.) die Kopie des Zielzweigs ausführt und damit diese Regel für den eigenen Pull Request erst nach dem Merge greift: nicht geprüft, für den Diff ohne Belang.
