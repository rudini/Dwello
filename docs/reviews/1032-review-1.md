# Code-Review #1032, Runde 1 (347c8bf9..138693a4)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde |

Geprüft: `tools/arch-baseline/run.sh:21` (`--no-cache` auf `fallow health`, Kommentar sachlich richtig), `tools/arch-baseline/run.test.ts` (ohne die Änderung rot, da die einzige `fallow health`-Zeile von run.sh kein `--no-cache` trug; liegt in `tools/**/*.test.ts` von `vitest.config.ts`), Fallow-Quelltext (`crates/engine/src/churn.rs`, `analyze_churn_cached_with_history`): Mit `no_cache` wird `try_reuse_churn_cache` übersprungen; ohne das Flag würde nach `git fetch --unshallow` (HEAD unverändert, `last_indexed_sha == head_sha`) der Cache aus dem flachen Klon unverändert wiederverwendet, also war der Fehler echt und das Flag behebt ihn. `--no-cache` ist in `package.json:38` (`structure:report`) schon in Gebrauch. Laut Code-Suche im Fallow-Repo rufen nur `health/hotspots.rs`, `api` und `coverage upload_inventory` den Churn-Cache auf, `dupes` und `dead-code` nicht; run.sh:22-23 brauchen das Flag also nicht. Commit-Betreff hält die Konvention ein, Diff ohne fremde Änderungen, nichts für ponytail-review.

## Nicht bestätigt

- Das Verhalten von `--no-cache` habe ich im Fallow-Quelltext von `main` (Version 3.41.0, `raw.githubusercontent.com/fallow-rs/fallow/main/crates/engine/src/churn.rs`) gelesen, nicht in der installierten Version 3.38.0 (im Bun-Cache nur als Binary; `strings` zeigt dort `churn.bin` und `git_churn_cache_hit`, also denselben Cache-Mechanismus).
- Dass `dupes`/`dead-code` keinen Churn lesen: per GitHub-Code-Suche nach `analyze_churn_cached` (7 Treffer, keiner in den Pfaden von dupes oder dead-code), also nicht vollständig nachgelesen. Weder im Diff noch in der Commit-Message steht eine Antwort auf diese Frage des Issues; die gehört in den Text des Pull Requests.
- Keinen Baseline-Lauf nach einem Unshallow beobachtet (keine Läufe erlaubt).
- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness -- --base origin/main`, Backend-Type-Check, `bunx vitest run tools/arch-baseline src/__tests__/open-work.test.ts` (47 Tests), Prettier auf neuen Dateien, Rot-Lauf des neuen Tests vor der Änderung an run.sh.
