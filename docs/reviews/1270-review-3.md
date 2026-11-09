# Review #1270, Runde 3 (Delta e0412e2c..de46b89b)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine offenen oder neuen Befunde. |

Geschlossen: C-1

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bunx vitest run tools/open-work/check-issues.test.ts` (42 bestanden), Prettier auf den geänderten Zeilen, Commit-Hooks, lint/check/fitness unverändert seit Runde 2, Rot des neuen Tests vor der Korrektur.
- Beim Lesen fällt der neue Test ohne die Korrektur rot aus. Die alte Regel beginnt die Definition bei `] as const)` (Zeile 22), der Hunk `@@ -20` trifft dann keine Definition, und die erwartete Meldung fehlt. Die Zeilennummer `:19` stimmt mit dem Fixture überein (wie im Schleifentest aus Runde 2). Der Test prüft nur «used by», nicht den Szenarionamen `buildings.feature:3` und auch nicht den Exit-Code. Den Szenarionamen deckt der einzeilige Schleifentest ab.
- Die Wirkung bei einem eingerückten Aufruf ausserhalb einer Schleife habe ich nur durchdacht, nicht ausgeführt. Folgt er auf eine Zeile in Spalte 0 ohne `;` (z. B. das `}` einer Funktion), reicht die Definition weiter nach oben. Das bleibt fail-closed. Auf der Basis gibt es keinen solchen Aufruf: Alle 4 eingerückten Aufrufe in tests/e2e/steps liegen in Schleifen.

Geprüft: Mit der neuen Regel nachgebaut (/tmp/claude-0/-home-user-Dwello/df0d7af4-8938-5d06-a623-2029cb45ee99/scratchpad/r3-sim.mjs). Alle vier echten Schleifen beginnen jetzt am `for` und liefern beide Muster: invoice-detail.steps.ts:202 (Aufruf 206, Ende 208), invoice-detail.steps.ts:210, invoice-upload.steps.ts:283 und statement-detail.steps.ts:399. Ausserdem geprüft: der Kommentar in check-issues.mjs:214 und dass der Diff nichts ausserhalb der Anforderung enthält.
