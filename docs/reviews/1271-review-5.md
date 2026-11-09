# Review 1271, Runde 5 (Abschlussrunde, Delta d6ba473f..4d5a86fb)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: alle drei geänderten Dateien gelesen (`.github/pull_request_template.md`, `tools/open-work/check-issues.mjs`, `tools/open-work/check-issues.test.ts`). `withoutHints` läuft jetzt auf dem ganzen Text vor dem Split, verschachtelte Kommentare (`<!-<!-- a -->- b -->`) werden weiterhin entfernt; «Type» wird exakt gegen `typeLabel` geprüft (Backticks entfernt, getrimmt), leer oder fehlend gibt nur die eigene Meldung; der Fork-Vergleich in `readiness` bekommt nur einen gültigen Typ. Rot ohne Änderung durch Lesen bestätigt: «This is not a bug» (Basis: grün als bug), versteckte Überschriften (Basis: Abschnitte mit Inhalt «x»/«y» gefunden), Fork mit ungültigem Typ (ohne Guard: ««Type» says bug, nfr:security, but #7 …»), Backticks (ohne `replace` rot). Keine weiteren Stellen (Skill `pull-request`, Doku) beschreiben die alten Meldungen.

## Nicht bestätigt

- `bunx vitest run tools/open-work src/__tests__/open-work.test.ts` (66 bestanden), Prettier sauber, Commit-Hooks: vom Aufrufer gemeldet, nicht selbst ausgeführt (Worktree ohne `node_modules`).
