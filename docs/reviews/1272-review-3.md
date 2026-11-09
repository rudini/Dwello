# Review 3 (Abschlussrunde) – #1272, Delta f85d4a30..a905e227

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-4 | Major | tools/fitness/fitness.ts:569 | `base` ist in der Closure `string \| undefined` (Zeile 558: `opt('--base') && …`); im Array an `git(args: string[])` (tools/arch-baseline/lib.ts:48) ergibt das unter `strict` einen Typfehler, `bun run check` (tsconfig `include` hat `tools/**/*.ts`) wird rot |

C-3: geschlossen (Logik). Ein Eintrag für eine Datei, die der Pull Request nicht hinzufügt (auf der Merge-Base vorhanden oder nirgends vorhanden), ist jetzt rot: `filter((e) => !added(e.path))`, fitness.ts:322. Der geänderte Test (fitness.test.ts:529–538) deckt beide Fälle ab und schlägt mit dem alten `onBase`-Filter fehl.

## C-4 (Major)

Vor dem Fix stand `base` nur in einem Template-Literal (`${base}:${path}`), da ist `undefined` erlaubt. Jetzt steht es als Element in `['diff', '--name-only', '--diff-filter=A', base, 'HEAD', '--', path]`. Die Bedingung `baseRatchet ? … : []` schränkt den Typ von `base` nicht ein (`baseRatchet` wird zwar nur im Zweig `if (base)` gesetzt, aber TypeScript leitet das nicht ab). Das Array hat damit den Typ `(string | undefined)[]` und passt nicht auf `string[]`. Zeile 572 ist nicht betroffen, weil sie in `if (base && …)` steht.
Nachweis: `bun run check` (svelte-check prüft `tools/fitness/fitness.ts`) auf a905e227 meldet in Zeile 569 «Type 'string | undefined' is not assignable to type 'string'». Der Aufrufer hat `bun run check` nicht gemeldet; Lint und vitest prüfen keine Typen. Fix: `base!` oder die Bedingung `base && baseRatchet ? …`.

## Nicht bestätigt

- Den Typfehler habe ich durch Lesen bestätigt, nicht durch einen Lauf (der Worktree hat keine `node_modules`, Läufe sind ausgeschlossen).
- Vom Aufrufer gemeldet: `bunx vitest run tools/fitness/fitness.test.ts` (50 bestanden, geänderter Test vor dem Fix rot), `eslint tools/fitness`, `bun run fitness -- --base origin/main` (0 Fehler), manueller Aufruf von `git diff --diff-filter=A` (liefert `tools/arch-baseline/measure.sh`, nichts für `tools/fitness/fitness.ts`).

Geprüft: Doku-Zeile in docs/architecture/fitness-functions.md:71 stimmt mit Meldungstext und Verhalten überein; keine Reste von `onBase` oder der alten Meldung ausserhalb von docs/reviews und docs/archive; `spawnSync` wird weiter gebraucht (Zeilen 410, 534); ponytail-review: kein ungenutzter Code, keine Kopie eines Helpers (nutzt das bestehende `git`).
