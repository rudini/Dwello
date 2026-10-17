# Code-Review W5b, Runde 3 (Abschluss vor dem Push)

Delta `ef3cc3d..081db67`, Worktree `review-w5b-code3` (detached auf 081db67).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-11 | Nit | `src/__tests__/categories.test.ts:101` | `Response.json({})` lässt auch `recipient` weg. Näher am Vertrag wäre `Response.json({ recipient: recipient.recipient })`, also nur `enabled` weglassen. Der Test zeigt das Verhalten auch so. |

Es gibt keine Blocker und keine Majors.

## Bestätigt

- **C-10:** Die neue Assertion ruft `loadNew` mit einer Antwort ohne `enabled` auf und erwartet `{ kiEnabled: true }`. `src/lib/server/category.ts:38` prüft `answer.enabled !== false`. Ersetzt man das durch `answer.enabled`, ergibt sich `undefined`, und `toEqual` schlägt fehl. Der Test ist also rot ohne die Prüfung, wie der Aufrufer sagt. Ich habe ihn erneut ausgeführt: `bunx vitest run src/__tests__/categories.test.ts` meldet 25 bestanden.
- **P-12:** In `messages/en.json:1201` steht jetzt «has preset». Das passt zu DE «hat … voreingestellt», FR «a préréglé» und IT «ha preimpostato». Nur EN war betroffen, die anderen drei Dateien stimmen schon. Ausserhalb der Persona- und Review-Berichte steht der alte Wortlaut nirgends in `src`, `tests` oder `docs`. Eine reine Korrektur des Englischen braucht weder ein Szenario noch einen a11y-Eintrag.
- **Formatierung:** Die geänderten Zeilen sind Prettier-konform. Die übrigen Abweichungen in `categories.test.ts` (Z. 71, 203, 220) liegen ausserhalb des Deltas.
- **Nichts Fremdes:** Neben den zwei Code-Dateien enthält das Delta nur Review-Berichte, Persona-Berichte und eine Workflow-Notiz. Die Workflow-Notiz habe ich gelesen: Sie ändert kein Verhalten und keine Regel, sie schlägt nur Änderungen vor.
- **Ponytail:** Lean already. Ship.

## Nicht bestätigt

- `bun run lint` und `bun run check`: vom Aufrufer gemeldet, nicht erneut ausgeführt. `check` lief vor der EN-Änderung. Seitdem hat sich nur JSON geändert, das ist plausibel.
- Inhalt der Berichte `helga-w5b-2.md`, `weber-w5b-2.md` und `w5b-fachreview-3.md`: Ich habe nur die Zeilen gelesen, die die Code-Änderungen begründen (C-10, P-12). Die Berichte ändern kein Verhalten.
