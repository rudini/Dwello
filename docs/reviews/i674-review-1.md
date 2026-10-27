# Review #674, Runde 1 (5af1845b..5cc18bed)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | backend/src/__tests__/pdf-translations.test.ts:30 | Der Kommentar endet mit «the block writes U+00A0 as » gefolgt von einem echten U+00A0 (Bytes `C2 A0`), nicht mit der Escape-Folge ` `. Er sagt damit etwas Falsches: Der fr-Block schreibt U+00A0 als ` ` (pdf.service.ts:219–283). Gemeint war wohl `` ` ` ``. |

## Nicht bestätigt

- `cd backend && bun run type-check` und Prettier auf der Testdatei: vom Aufrufer gemeldet.

Geprüft: Die Regex entspricht der in src/__tests__/i18n.test.ts:58 (mit wörtlichem U+00A0 statt ` `, gleichwertig). Die Extraktion des fr-Blocks entspricht `keysOf`. Neu ausgeführt: `bun test src/__tests__/pdf-translations.test.ts` (4 pass). Das Rot habe ich ohne Dateiänderung per Skript auf einer veränderten Kopie des Quelltexts gezeigt: `« {profile}`, `{category} »` und `«dès` ergeben je eine falsche Zeile. Die übrigen « im Quelltext (de/it/en, Kommentare) liegen ausserhalb des fr-Blocks, also zu Recht ausserhalb der Regel. Wörtliches U+00A0 (Z. 280) wird ebenfalls erkannt. Der Commit nennt in seiner Nachricht beibehaltenes Verhalten; auf der Basis ist der Test grün. Er ist kein Bugfix, daher braucht er kein Szenario.
