# Code-Review #1200 / PR #1308, Runde 5 (Abschlussrunde, `fdb875b..d599d89`)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: Ich habe die Syntaxprüfung gegen die Rechnung auf main gelesen. Auf main ersetzt die Rechnung `\d+\s*%` durch `(n/100)`. Der Test für zwei Rechenzeichen kennt nur `[+\-*/]{2,}`, alles andere geht an `new Function`. Nach dieser Lesart stimmt die Tabelle für jedes `%`:
- Nach einer Zahl ist `%` ein Prozent (`closed`).
- Nach `)` oder nach einem Prozent ist `%` der Rest einer Division (`remainder`).
- Nach dem Rest gehen ein Wert, `(` und ein Vorzeichen; `* / ) %` und ein Rest am Ende brechen.

Diese Formeln rechnen auf main und bleiben ohne Fehler: `({area}+1) % -2`, `{area}% % 2`, `{area} % -2` (rechnet als Subtraktion), `{area} % * 2`, `{area}%%2`. Diese scheitern auf main mit NOT_COMPUTABLE und erhalten jetzt einen Code mit `part`: `{area}%%`, `(2)%`, `) % * 2`, `) % )`. `- -2` nach einem Rest lehnt main schon mit `[+\-*/]{2,}` ab, der Durchlauf ebenso. Die Umbenennung von `)` in `closed` ändert für `value`, `(`, `sign`, `times` und `)` nichts. Am Ende bleibt `closed` gültig. Beide neuen Tests schlagen auf `fdb875b` fehl (vorher `CONSECUTIVE_OPERATORS` bzw. `MISSING_OPERATOR`, und `[]` bei `{area}%%`). Im Frontend gibt es keine Kopie des Durchlaufs. Das Delta passt zur Anforderung, und die Kommentare stimmen.

## Nicht bestätigt

- Diese Prüfungen hat der Aufrufer auf d599d89 laufen lassen und als bestanden gemeldet. Ich habe sie nicht wiederholt (vom Aufrufer gemeldet):
  - Backend `formula-codes` (die zwei neuen Tests vorher rot gesehen), `formula.service`, `distribution-key-admin.pg`
  - `bun run type-check` im Backend
  - fallow audit
- Dass `evaluateFormula` für `({area} + 1) % -2` und `{area}% % 2` wirklich einen Wert liefert, habe ich nur aus dem Code gelesen (formula.service.ts, `processedExpression`). Kein Test ruft die Rechnung für diese Formeln auf.
