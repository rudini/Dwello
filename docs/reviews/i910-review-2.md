# Review #910, Runde 2 (Delta ec327571..a46f5cbf, Abschlussrunde)

Keine offenen und keine neuen Befunde.

Geschlossen: C-1, C-2, C-3

## Nicht bestätigt

- `bun run lint`, `bunx vitest run tools/` (337 bestanden) und `bun run fitness` (1 / 6 / 18, keine Findings) meldet der Aufrufer. Die Werte 1 / 6 / 18 in Ratchet und Doku habe ich nicht nachgemessen, weil der Messlauf Dateien schreibt. Neu laufen lassen habe ich nur `bunx vitest run tools/fitness/fitness.test.ts` (30 bestanden).

Geprüft: `handDeclared` (fitness.ts:316) zählt jetzt FE, BFF und Shared. `measure` (Zeile 281) und `newFields` (Zeile 321) verwenden dieselbe Zählung. Shared/Contracts umfasst produktiv nur `src/lib/types.ts` (layers.json:25), `backend/src/api/` liegt in Backend. Der Test erwartet 6 und wäre mit dem alten Code rot (5). Das Ratchet geht von P90 5 auf 6. Das ist keine Lockerung gegenüber main, denn 5 stammte aus der Unterzählung auf diesem Branch. Das Ziel und `NEW_FIELD_MAX` = 4 bleiben unverändert. Die utility-tree-Zeile «Fitness Function» passt zur Meldung in fitness.ts:158. Die Zahlen 1 / 6 / 18 stehen in allen Dokumenten einheitlich, eine alte «1 / 5 / 18» ist nirgends übrig. Der Diff enthält nichts ausserhalb der Anforderung.
