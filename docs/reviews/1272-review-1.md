# Review #1272, Runde 1 (347c8bf9..3ac7778e)

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Major (braucht Entscheid PO) | tools/fitness/fitness.ts:229, :291, :313; tools/fitness/ratchet.json:613 | Die Ausnahme `exceptions.newFiles` lässt sich nie nutzen: Die Liste kommt leer, jeder Eintrag lässt sie gegenüber der Basis wachsen und macht `ratchet` rot. Dazu behält `tighten` (:364) veraltete Einträge |
| C-2 | Minor | tools/fitness/fitness.ts:520-526 | Ist `fallow-health.json` leer (measure.sh:97 schluckt mit `|| true` jeden Fehler von fallow), bricht `structureAt` mit `TypeError: Cannot read properties of null (reading 'file_scores')` ab statt mit einer Meldung zum Commit. Das Temp-Verzeichnis bleibt liegen, weil `rmSync` erst nach `analyze` läuft |

## C-1 (Major): Ausnahme für neue Dateien nicht erreichbar

Die Anforderung verlangt zwei Dinge: «otherwise red, unless an exception with a reason is in ratchet.json» und «the list only shrinks, as the other exception lists». Der Code setzt beide wörtlich um, aber sie widersprechen sich:

- `ratchet.json` bringt `newFiles: []` mit. Nach dem Merge hat die Basis jedes späteren PR also `exceptionSizes(base).newFiles === 0`.
- Ein PR, der eine neue Datei unter 85 mit einem Eintrag in `newFiles` anmeldet, wird von `structure-new-file` nicht mehr gemeldet (fitness.ts:229-233). Dafür meldet `loosened` (fitness.ts:313): «exceptions.newFiles grew from 0 to 1». Der Lauf bleibt rot.
- Beweis aus dem Diff selbst: Der Test fitness.test.ts:527 («lässt die Ausnahmeliste neuer Dateien nur schrumpfen») zeigt genau dieses Rot. Der Test zu `structureFindings` mit Ausnahme (fitness.test.ts, «… ausser sie steht mit Grund in der Ausnahmeliste») prüft also einen Zweig, den CI nie grün erreicht.
- Bei den anderen Listen geht das auf, weil sie beim Einführen des Checks mit den bestehenden Altlasten gefüllt wurden. Eine «neue Datei» gibt es beim Einführen aber nicht. Eine Datei wird zudem nach ihrem Merge nie wieder neu. Ein Eintrag wäre danach tot, und `tighten` (:364) übernimmt ihn trotzdem unverändert, statt ihn wie bei `unstableDependencies` zu entfernen.

Folge: Die Fix-Meldung (:233) schickt die Verwalterin oder den Verwalter zu einer Ausnahme, die den PR erst recht rot macht. Damit ist die Anforderungszeile «unless an exception … is in ratchet.json» nicht erfüllt.

Vorschlag: Mit dem Product Owner klären, ob ein PR einen Eintrag für eine Datei hinzufügen darf, die er selbst neu anlegt (etwa: `loosened` zählt nur Einträge, deren Pfad auf der Basis existiert, und `tighten` entfernt Einträge für Dateien, die auf der Basis schon da sind). Andernfalls bleibt die Ausnahme gestrichen, samt Zweig, Test und Fix-Text. Der Entscheid gehört in #1272 (Blocked on me).

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bunx vitest run tools/fitness tools/arch-baseline tools/open-work` (128 bestanden, jeder neue Test in fitness.test.ts zuerst rot), `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main` (0 Fehler), Backend type-check, Prettier auf neuen Dateien.
- Vom Aufrufer gemeldet: der Handnachweis in einem Wegwerf-Worktree (`--structure` rot mit structure-maintainability, structure-health, structure-new-file, structure-xs), Laufzeit ~13 s. Ich habe ihn nicht nachgefahren. `structureAt` und `measure.sh` haben keinen Unit-Test. Ihr Verhalten belegt nur dieser Nachweis (fitness-functions.md, Abschnitt 3, neue Zeilen).
- Ob der Health-Score von fallow auch von der Git-Historie abhängt (Churn, Hotspots), sodass Basis und HEAD ohne Codeänderung auseinanderlaufen, habe ich nicht prüfen können. structure.ts:174-185 liest nur `health_score.score`. Die fallow-Doku habe ich nicht eingesehen.
- CI-Lauf mit `--structure` im Job (Checkout `fetch-depth: 0`, ci.yml:171; `GITHUB_STEP_SUMMARY`): nur gelesen, nicht ausgeführt.

Geprüft: Merge-Base statt Ref (fitness.ts:542), `fileChanges` (M/R/A, D ausgelassen), Filter auf Produktivdateien, Tabelle mit Markierung red/hint, Schwelle `LIMITS.maintainability[0]` = 85 (structure.ts:78), Auslagerung nach measure.sh ohne Verhaltensänderung in structure-history.sh, Cache-Schlüssel auf `*.sh`, Doku in fitness-functions.md (Tabelle, Ausnahmeliste, Abschnitt 3). Ponytail: nichts zu kürzen ausser dem toten Ausnahme-Zweig aus C-1.
