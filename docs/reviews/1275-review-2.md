# Review #1275, Runde 2 (Delta d3e0bdcc..31aa5eae)

Geschlossen: C-1

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-2 | Minor | .github/workflows/fallback-review.yml:147-156, 201-202 | Ohne passenden Bericht wartet die Schleife 5 Minuten statt der genannten 4. Auch nach dem fünften erfolglosen Abruf läuft `sleep 60`, bevor `seq 5` endet. Der Kommentar «up to 4 minutes» und der Budget-Kommentar «4 for the reviewer report» stimmen deshalb nicht. Das Budget hält trotzdem: 10 + 5 + 2 × 8 = 31 von 35 Minuten. |

## Nicht bestätigt

- `bunx vitest run tools/ci/fallback-review.test.ts` (8 bestanden), eslint und prettier auf der Testdatei sowie der Rotlauf der beiden neuen Tests: vom Aufrufer gemeldet. Ich habe keine Tests ausgeführt.
- Rotlauf, nach dem Lesen beurteilt: Beide neuen Tests würden auf d3e0bdcc fehlschlagen.
  - «wartet auf den Prüfbericht…»: Die Basis fragt nur einmal ab. Der Mock antwortet beim ersten Aufruf `[]`, und das `--jq` der Basis wird vom Mock nicht angewendet. In report.md steht dann `[]` statt des Berichts.
  - «…keinen Prüfbericht eines früheren CI-Laufs…»: Die Basis filtert nicht nach `updated_at`.
- `workflow_run.updated_at` als Ende von CI, mit dem `updated_at` des Kommentars auf derselben Serveruhr verglichen: nach GitHub-Doku plausibel, auf GitHub nicht ausprobiert. Laut pr-comments.yml:81-83 aktualisiert «Pull request comments» den Sticky-Kommentar bei jedem Lauf mit `updateComment`, auch wenn sein Text gleich bleibt. Damit rückt `updated_at` bei jedem Lauf vor.
- Ein CI-Lauf, der mit `workflow_dispatch` gestartet wurde: Für ihn schreibt «Pull request comments» keinen Bericht (pr-comments.yml:19). Der Fallback wartet dann die volle Frist und gibt «(no reviewer report)» weiter. Das passt zur Anforderung, die nur den Bericht dieses CI-Laufs verlangt, kostet aber die Wartezeit. Ein Defekt ist das nicht.
- `Gate change approved: #1275` im PR-Text: Den PR-Text habe ich nicht gesehen.

Geprüft: jq-Filter (`--paginate` mit `-s` und `.[][]`, letzter passender Bot-Kommentar, ISO-Vergleich als String, `// empty`), Abbruch bei leerem `CI_DONE` (ready_for_review, dispatch), Fehlerverhalten unter `-eo pipefail` wie auf der Basis, Mock und `sleep`-Stub im Test, Timeout 35, ponytail-review ohne Befund.
