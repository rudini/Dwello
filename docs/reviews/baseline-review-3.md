# Review Runde 3 (Abschluss): Architektur-Baseline (Phase 0)

Delta `3cc0a3490..77f7d96d6` (ohne `docs/reviews`), Worktree `review-baseline-3`.

## Status der offenen IDs aus Runde 2

| ID | Status | Beleg |
|---|---|---|
| C-10 | geschlossen | tools/arch-baseline/02-imports.ts:25-33 zählt `import { type X }` nur unter `backend/` als Typ-Kante; tsconfig.json:13 (`verbatimModuleSyntax`) gilt für FE/BFF, backend/tsconfig.json setzt es nicht. Der Grenzen-Satz in docs/architecture/baseline.md:319 sagt das jetzt richtig |
| C-11 | geschlossen | baseline.md:325 nennt Worktree auf `d4d508cc2`, die Skripte dieses Branches und dass `ARCH_BASE` nur die Historie fixiert |
| C-12 | geschlossen | 07-tables.ts:33 entfernt `(#<eigene PR-Nummer>)` vor dem Test; out/report-tables.md:22 «32 of 408», baseline.md:22 übernimmt 32 mit Erläuterung. PR#614 und PR#157 (units.csv:16, :232) fallen damit heraus |
| C-13 | geschlossen | baseline.md:15 «Die zehn grössten Hotspots», gedeckt durch M3 und baseline.md:302 («alle Top-10-Hotspots») |

## Neue Befunde im Delta

Keine.

Geprüft: Die geänderten Werte in out/ (m3-hotspots.csv Zeile 311, m4-clone-stats.csv, report-tables.md «functions above threshold 7 → 8») werden in baseline.md nicht zitiert; die Duplikation bleibt gerundet bei 0,87 %.

## Nicht bestätigt

- Lauf der Pipeline auf `d4d508cc2` und Herkunft der kopierten out/-Dateien: nicht wiederholt (Lauf schreibt Dateien); nur die Folgerichtigkeit der Diffs gelesen.
- `bunx eslint tools/arch-baseline --max-warnings 0`, Commit-Gates (fallow, deepcheck, subject), Prettier auf dem Bericht: vom Aufrufer gemeldet.
