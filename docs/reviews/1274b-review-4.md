# Review 1274b, Runde 4 (Delta faf01dd4..2b248522)

Keine neuen Befunde.

Geschlossen: C-3

Geprüft: `.sort().slice(0, 300)` begrenzt `pdfPages` vor der Kürzungsschleife, also ist die Schleife auch für die PDF-Seiten aus dem Fork-Artefakt begrenzt. `timeout-minutes: 10` reicht für den normalen Ablauf: Checkout mit `fetch-depth: 0`, `bun install --frozen-lockfile`, Gate-Check, Fetch von `ui-screenshots`, Push und zwei `github-script`-Kommentare dauern zusammen typischerweise wenige Minuten. Bricht der Timeout vor dem Gate-Check ab, fehlt der Status «Gate check (main)», und das schliesst sicher (der Merge bleibt gesperrt). Bricht er danach ab, ist der Status schon gesetzt. Die beiden neuen Prüfungen in `tools/ci/pr-comments.test.ts:75-76` sind auf faf01dd4 rot, denn dort fehlen beide Zeilen. Der YAML-Regex trifft eindeutig, weil die Datei nur einen Job hat.

## Nicht bestätigt

- `bunx vitest run tools/ci` (71 bestanden) und dass das YAML geparst wird: vom Aufrufer gemeldet.
- Die tatsächliche Laufzeit des Jobs: Ich habe keine Laufzeiten von Actions-Läufen eingesehen. Die Schätzung oben stützt sich nur auf die Schritte in `.github/workflows/pr-comments.yml:34-160`. Ein Risiko für später: Der Zweig `ui-screenshots` wächst mit jedem Pull Request, und sein Fetch dauert dadurch länger. Das ist nicht Teil dieses Deltas.
