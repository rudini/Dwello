# Review 4 (Abschlussrunde) – #1271, cb845712..de00f918

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `withoutHints` (tools/open-work/check-issues.mjs:233-240) entfernt Kommentare bis zum Fixpunkt; die Schleife endet, weil jeder Durchlauf mit Treffer den Text kürzt. Der neue Test (check-issues.test.ts:509-513) ist ohne die Schleife rot: `<!-<!-- a -->- b -->` ergibt nach einem Durchlauf `<!-- b -->`, der Abschnitt «Decisions» wäre nicht leer. Die Schleife entspricht wörtlich dem «Good»-Beispiel der CodeQL-Hilfe zu `js/incomplete-multi-character-sanitization` (do/while mit Vergleich gegen den vorherigen Wert). Ein übrig bleibendes, nicht geschlossenes `<!--` zählt als Inhalt; das ist nur für einen ungültigen Text möglich und kein Rückschritt gegenüber der Basis. Commit-Betreff konform, keine fremden Änderungen im Delta.

## Nicht bestätigt

- Ob CodeQL den Alarm auf PR #1384 tatsächlich schliesst: nur nach dem nächsten CI-Lauf sichtbar; beurteilt anhand des Musters der CodeQL-Hilfe, nicht ausgeführt.
- `bunx vitest run tools/open-work/check-issues.test.ts` (58 bestanden), Prettier sauber, Commit-Hooks: vom Aufrufer gemeldet.
