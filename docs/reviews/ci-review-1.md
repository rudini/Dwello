# Code-Review CI-Slice: veraltete Zählung grüner Shards (b28a7b3, Basis 6a3caba)

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

## Antworten auf die Prüffragen

- **`bash -e`:** Der Standard-Shell von `run` ist `bash --noprofile --norc -eo pipefail {0}`. In `passed=$(gh …) && [ "$passed" = N ] && break` löst ein Fehlschlag eines Glieds vor dem letzten `&&` kein errexit aus. Das letzte Glied ist `break`, und das gelingt immer. Weder ein fehlschlagender `gh`-Aufruf noch eine zu tiefe Zählung bricht den Schritt ab; die Schleife läuft weiter bis `sleep 15` (.github/workflows/ci.yml:274-279).
- **Ein wirklich roter Shard bleibt rot:** Die Zählung bleibt unter `matrix.shards`, nach drei Versuchen greift Zeile 280 mit `exit 1`. Der Schritt dauert dabei 45 s länger, nicht 30 s, denn `sleep 15` läuft auch nach dem dritten Versuch. Das gab es schon vorher bei `gh`-Fehlern; jetzt trifft es jede rote Prüfung. Die Wirkung bleibt richtig, deshalb ist das kein Befund.
- **E2E (5) und axe (3):** `matrix.shards` kommt aus der Matrix von `e2e-results` (Zeilen 264-265) und passt zu `e2e-tests` (Zeilen 189-190). Der `startswith("<name> (")`-Filter trifft nur die Shard-Jobs `<name> (k/N)` (Zeile 171), nicht den Summary-Job `<name>` selbst. Der Workflow hat deutlich weniger als 100 Jobs, `per_page=100` schneidet also nichts ab. Wird axe übersprungen (`SKIP`), endet der Shard trotzdem mit `success` und zählt mit.
- **`if: !cancelled()` und `needs`:** `e2e-results` startet erst, wenn `changes` und alle `e2e-tests`-Jobs fertig sind. Ist `changes` nicht erfolgreich, endet der Job früh (Zeile 270). Ohne App-Änderung wird `e2e-tests` übersprungen, und der Job endet mit `exit 0` (Zeile 271). Fehlen danach grüne Shards, gibt es nur zwei Gründe: Ein Shard hat ein anderes Ergebnis als `success` (failure, timed_out, cancelled; bei `fail-fast: false` nur durch Timeout oder Abbruch von Hand, und ein Abbruch des ganzen Laufs überspringt den Summary-Job), oder die API antwortet veraltet. Im ersten Fall muss die Prüfung rot sein, und sie bleibt es. Der zweite Fall ist der, den die Änderung abfängt. Bei «Re-run failed jobs» liefert `runs/{id}/jobs` standardmässig `filter=latest`, also den neuesten Versuch jedes Jobs; auch das ergibt keine falsch tiefe Zählung.

Geprüft: Diff (nur .github/workflows/ci.yml) gegen die Anforderung (3 Versuche, 15 s Abstand, Abbruch erst bei Gleichstand); Kommentar und Commit-Betreff (Conventional Commits, ≤ 50 Zeichen); nichts Fremdes im Diff; kein Szenario nötig (nur CI).

## Nicht bestätigt

- Die Ursache «veraltete Antwort der Jobs-API» (PR #592, 1 von 3 grün, 4 s nach dem letzten Shard) habe ich nicht an den Lauf-Daten nachgeprüft: Laut Auftrag sollte ich nichts ausführen, also kein `gh api` auf den Lauf. Gelesen habe ich nur den Workflow (Zeilen 170-280). Ob 30 s Fenster genügen, zeigt erst ein weiterer CI-Lauf.
- YAML-Parse, tools/deepcheck/test/workflows.test.ts und die lokale Schleifenprobe unter `bash -e` mit Ersatz für gh: vom Aufrufer gemeldet, nicht selbst ausgeführt.
