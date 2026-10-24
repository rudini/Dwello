# Review #788 Teil 0, Runde 2 (Delta cc6a5538..2009413d)

## Status der offenen IDs aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| C-1 | erledigt | `tools/fitness/fitness.ts:197`: Die zweite Alternative `^\s*localToday\(\)\s*[,)]` erkennt ein umgebrochenes `localToday(),` oder `localToday())`. Test in `tools/fitness/fitness.test.ts:249`; mit dem alten Muster wäre er rot, weil vor dem Ausdruck kein `(`/`,` steht. Das umgebrochene `today,` bleibt bewusst offen und ist in `docs/architecture/fitness-functions.md:74` beschrieben, samt der bekannten Stelle `dashboard/+page.server.ts:142`. Neue Fehlalarme gibt es keine: Ein grep nach `^\s*localToday\(\)\s*[,)]` über `src` findet keine BFF-Zeile. |
| C-2 | erledigt | `docs/architecture/fitness-functions.md:74` nennt die Lücken: anderer Name, `new Date()`/`Date.now()`, `localToday().slice(…)` als Argument und umgebrochenes `today,`. |
| C-3 | erledigt | `tools/fitness/fitness.ts:137`: Eine Liste, die auf der Basis steht und im Arbeitsstand fehlt, wird gemeldet. Test in `fitness.test.ts:142`; ohne die Änderung wäre er rot (`(undefined ?? 0) > 0` ist falsch). Den anderen Listen schadet das nicht: `exceptionSizes` liefert für sie immer eine Zahl. |
| C-4 | erledigt | `docs/architecture/fitness-functions.md:15` sagt «8 technisch, 0 Altlast aus #717, 9 Datums-Ableitungen». Das stimmt mit `ratchet.json` überein: 8 Einträge in `technical` (der achte ist das Akonto-Datum `validFrom` in `contracts/[id]/+page.server.ts`), `bffDecisions` ist leer, `bffDates` hat 9 Einträge. |

## Neue Befunde im Delta

Keine. Keine Blocker, keine Major, keine Minor.

Vorbestehend und ausserhalb des Deltas: `docs/architecture/fitness-functions.md:34` sagt noch, das `validFrom`-Muster stehe «als Altlast unter #717». Seit der Basis bf591675 steht es unter `technical`, und Zeile 15 sagt jetzt richtig «0 Altlast». Die Zeile ist nicht Teil des Diffs, deshalb gibt es dafür keine ID.

Geprüft: alle 3 geänderten Dateien des Deltas (Code, Tests, Doku); dass die beiden neuen Tests ohne die Änderung rot wären (durch Lesen); ponytail-review (nichts ungenutzt, keine Kopie, nichts ohne Bezug zur Anforderung).

## Nicht bestätigt

- `bunx vitest run` (3644 Tests, die zwei neuen zuerst rot gesehen), `bun run lint` und `bun run fitness -- --base origin/main` (grün, weiterhin 17 Fundstellen): vom Aufrufer gemeldet, nicht selbst ausgeführt. Ob die Tests rot waren, habe ich nur durch Lesen beurteilt.
- Dass #788 Punkt 3 die Übergabe `today,` in `dashboard/+page.server.ts:142` entfernt (Doku-Zeile 74): den Text des Issues habe ich nicht gelesen. Die `reason`-Einträge in `ratchet.json` ordnen die Übersicht Punkt 1 und die Dokumente früherer Mieter Punkt 3 zu.
