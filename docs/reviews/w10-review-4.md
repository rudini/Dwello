# Code-Review w10, Runde 4 (abschliessend vor Push), #156/#155

Geprüfter Stand: Worktree `review-w10-code4`, HEAD `4a279fc` („fix(i18n): protect spaces in French guillemets“), Delta `git diff 2c15a3a 4a279fc`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

## Geprüft

- Das Delta enthält genau einen Commit und eine Datei, `messages/fr.json`, mit 3 geänderten Zeilen (`contracts_parties_fixed_by_law`, `contracts_end_death`, `contracts_open_contract_text`).
- In allen drei Zeilen ist innerhalb von « » das normale Leerzeichen durch U+00A0 ersetzt (`cat -A`: `M-BM-` = C2 A0): « Adresse », « E-mail », « Terminer ».
- Sonst ist nichts geändert: Ich habe in beiden Ständen alle U+00A0 durch Leerzeichen ersetzt und die Dateien verglichen. Sie sind identisch, die Texte also bis auf die geschützten Leerzeichen gleich.
- `bunx vitest run src/__tests__/i18n.test.ts` habe ich selbst laufen lassen: 13/13 grün, darunter «Französisch setzt Guillemets mit geschütztem Leerzeichen innen» (Regex `«(?! )|(?<! )»`). Die übrigen drei Sprachdateien und der Code sind nicht betroffen.
- Ponytail-Review: kürzestmöglicher Diff, nichts Fremdes darin.

## Nicht bestätigt

- `bun run test:coverage` (vollständig), Lint, `check`, backend type-check und E2E: nicht erneut ausgeführt. Der Fehlschlag in `test:coverage` und dass er jetzt behoben ist, sind «vom Aufrufer gemeldet». Den betroffenen Test (`i18n.test.ts`) habe ich selbst bestätigt.
- Ausserhalb des Auftrags beobachtet, kein Befund: Vor `:` und `;` steht in `fr.json` schon auf dem Basis-Commit uneinheitlich mal ein geschütztes, mal ein normales Leerzeichen (95 zu 11 bei `:`, 15 zu 31 bei `;`). Kein Test verlangt dafür eine Regel, und das Delta ändert daran nichts.
