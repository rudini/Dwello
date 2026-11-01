# Review Strukturbericht-Verlauf, Runde 1 (356a3bdb8)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | tools/arch-baseline/structure-history.sh:4, :24; .github/workflows/structure-report.yml:38-39; tools/arch-baseline/structure.ts:245 | Der Snapshot-Cache ist nur nach Commit geschlüsselt. Nach jeder Änderung an Werkzeugen, `LIMITS`, `layers.json`, `.fallowrc.json` oder der fallow-Version bleiben die alten Snapshots stehen, während HEAD neu gemessen wird. Damit gilt die Kernzusage «gleiche Definitionen» nicht mehr, und der Bericht behauptet sie trotzdem. |
| C-2 | Minor | tools/arch-baseline/structure.ts:332 (wirkt in :228, :194) | Der Verlauf wird nur nach `%cs` sortiert, also nach dem Tag. Bei mehreren Snapshots am selben Tag entscheidet die `readdir`-Reihenfolge (die SHA), welcher zuletzt steht. HEAD ist dann nicht sicher der letzte Punkt: Die Spalte «D now» in `moved()`, «newest first» im Markdown und die Reihenfolge der Linienpunkte können falsch sein. |

## C-1 (Major): Gecachte Snapshots messen mit veralteten Definitionen

**Warum falsch:** Die Anforderung (Punkt «snapshots measure old trees with today's tools and today's .fallowrc.json») und die Begründung im Skript (Zeilen 2-3, «so every point uses the same definitions») setzen voraus, dass jeder Punkt mit denselben Definitionen gemessen wird. Ein Snapshot speichert aber Werte, die schon ausgewertet sind: `lights` ist nach den `LIMITS` des Messzeitpunkts gezählt, `functions` folgt fallows Schwellen, `kpis.health` der fallow-Version und `.fallowrc.json`, und die Module mit D folgen `layers.json`.

- Lokal überspringt `[ -s "$OUT/history/$c.json" ] && continue` (Zeile 24) jeden vorhandenen Snapshot. Er wird nie neu gemessen, solange der Commit im Fenster bleibt, also bis zu 60 Tage lang.
- In CI holt `restore-keys: structure-history-` den Cache des letzten Laufs zurück, egal was sich an den Werkzeugen geändert hat.

Der Kommentar «A commit's snapshot never changes» (Zeile 4) stimmt nur, solange die Werkzeuge gleich bleiben. Im Bericht steht trotzdem «measured with today's tools and thresholds» (structure.ts:245), und docs/architecture/fitness-functions.md sagt «mit den heutigen Werkzeugen».

**So zeigt sich der Fehler:**
1. `bun run structure:report` laufen lassen.
2. In `structure.ts` `LIMITS.distance` ändern oder in `layers.json` ein Modul umschneiden, committen, den Bericht erneut erzeugen.
3. Nur der Snapshot von HEAD (lokal: des neuen Commits; in CI: jedes Pushs) ist neu gemessen. Alle älteren Punkte tragen noch die alten Ampel- und Modulzahlen. Im Diagramm «Modules per traffic light» und in «D at first snapshot» zeigt sich ein Sprung, den nur die Werkzeugänderung verursacht hat, nicht der Code.

**Behebung:** Einen Fingerabdruck der Definitionen in den Cache-Schlüssel und in den Pfad der Snapshots aufnehmen. Er umfasst z. B. `git hash-object` bzw. `hashFiles()` über `tools/arch-baseline/*.ts`, `layers.json`, `.fallowrc.json` und `bun.lock`. Lokal geht das über ein Unterverzeichnis `history/<hash>/`, in CI über `structure-history-<hash>-<sha>` mit `restore-keys: structure-history-<hash>-`.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bunx vitest run tools/arch-baseline src/__tests__/open-work.test.ts` (34 bestanden, neue Verhaltensweisen zuerst rot gesehen).
- Vom Aufrufer gemeldet: `bunx vitest run tools/deepcheck/test/workflows.test.ts tools/testcheck/test/wiring.test.ts` (6 bestanden).
- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, testcheck:audit, deepcheck:audit, Prettier.
- Vom Aufrufer gemeldet: `bun run structure:report` lief durch (29 Snapshots, Lauf mit Cache), der Bericht in Hell und Dunkel, die Job-Zusammenfassung über `GITHUB_STEP_SUMMARY`.
- Der Workflow `.github/workflows/structure-report.yml` ist auf GitHub noch nie gelaufen. Unbestätigt sind: `actions/cache@v5` (in keinem anderen Workflow des Repos verwendet), ob `origin/main` nach dem Checkout mit `fetch-depth: 0` bei einem Push vorhanden ist, und ob `backend/node_modules` nach `bun install --frozen-lockfile` im Wurzelverzeichnis existiert (package.json hat keine `workspaces`; ohne sie entfällt der Symlink in Zeile 30).
- Ob `fallow health -c "$ROOT_DIR/.fallowrc.json"` mit cwd `$wt` die Muster `entry`/`ignore` relativ zum Worktree auflöst und nicht relativ zum Verzeichnis der Konfiguration, also zum heutigen Baum: Die fallow-Dokumentation ist im Worktree nicht vorhanden (kein `node_modules`). Wenn die Muster relativ zur Konfiguration gelten, messen alle Snapshots für health und functions den heutigen Stand. Die vom Aufrufer gemeldeten Diagramme müssten dann flach sein.
- `structure-history.sh` (Stichproben, Entfernen alter Snapshots, `trap`-Aufräumen, Duplikate) hat keinen Test. Gelesen: Das `trap` mit einfachen Anführungszeichen wertet `$wt`/`$snap` erst beim Exit aus und räumt bei `set -e` richtig auf. Ein abgebrochener Lauf hinterlässt eine leere `<commit>.json`, die `-s` beim nächsten Lauf neu misst.
- `date -d` (Zeile 12) ist GNU-only; ob `structure:report` auch unter macOS laufen soll, ist nirgends festgelegt.

Geprüft: Englische Texte vollständig; der Test für fehlende `hotspots` und die Tests für `snapshot`/`markdown`/Verlauf schlagen ohne die Änderung fehl (TypeError bzw. fehlende Exporte); `ARCH_ROOT` liest heutiges `layers.json` über `HERE`; Workflow nur `contents: read`, keine Secrets; Entfernen der Snapshots ausserhalb des Fensters ist korrekt; ponytail-review: nichts zu kürzen.
