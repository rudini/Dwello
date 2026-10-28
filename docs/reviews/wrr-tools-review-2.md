# Review wrr-tools, Abschlussrunde 1 (Delta dccabc00..d336e266)

Geschlossen: C-1

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-2 | Minor | tools/arch-baseline/lib.ts:132 | Der neue Lookbehind `(?:Pick\|Omit)<[^';]*,[^<>;]*` lässt im ersten Teil `<`, `>` und Kommas zu. Er überspringt deshalb jetzt auch eine echte Werteliste, die in derselben Anweisung nach einem `Pick`/`Omit` mit Schlüsseln ohne Literal steht. Beispiele, mit `node -e` geprüft (liefern `[]`; die alte Regex fand beide Unions): `function f(row: Pick<Row, Keys>, s: 'a' \| 'b') {}` und `type T = Pick<A, K> \| Record<string, 'x' \| 'y'>;`. Kein Test deckt diesen Fall ab. Laut Aufrufer trifft das im heutigen Code nicht zu (05-knowledge liefert dieselben Mengen). Eine Abhilfe wäre, das erste Typargument nur bis zum ersten `>` laufen zu lassen, das die Klammer von `Pick<` schliesst, oder einen Test mit einem dieser Beispiele zu ergänzen. |

## Nicht bestätigt

- `bunx vitest run tools/` (344 Tests), eslint und Prettier auf den zwei geänderten Dateien, `bun run fitness` unverändert, gleiche Literal-Mengen von 05-knowledge: vom Aufrufer gemeldet.
- Rot des neuen Tests: Ich habe ihn nicht ausgeführt. Nach dem Lesen ist er ohne die Änderung rot: Die alte Regex `[^<>,]+` scheitert am `<` von `Json<`, also wird `'a' | 'b'` gefunden.

Geprüft: Beide geänderten Dateien sind gelesen. Die Testfälle der Anforderung (generisches erstes Typargument bei Pick und Omit, einfache Union, `Base | 'a' | 'b'`) sind durch den Code und die Tests in tools/arch-baseline/lib.test.ts:43-58 belegt. Der Diff enthält nichts, was nicht zur Anforderung gehört.
