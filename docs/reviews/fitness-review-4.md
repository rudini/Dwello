# Code-Review Runde 4 (Delta f510c841..dc5da13b): Phase 2a Fitness Functions

## Status der offenen IDs aus Runde 3

| ID | Status | Beleg |
|----|--------|-------|
| C-6 | erledigt | `tools/fitness/fitness.ts:225-234`: `newFields(spread, baseSchema)` und `addedTechnical(working, base)` sind exportiert und rein. Die CLI ruft sie auf (`fitness.ts:262-263`). Zum Austausch-Test `fitness.test.ts:208-215`: Die Basis hat `[x, y]`, der Arbeitsstand `[x, z]`. Die alte Längendifferenz ergäbe 0, erwartet ist 1. Der Test wäre ohne den Fix also rot. `fitness.test.ts:217-226` prüft den Abgleich über den Schlüssel `table.field` gegen den Schema-Text der Basis. Das ist ein reiner Umbau mit gleichem Verhalten, darum ist kein roter Lauf nötig. |
| C-7 | erledigt | `tools/fitness/fitness.ts:77-80`: `NEW_FIELD_MAX` steht mit seinem Kommentar über dem JSDoc von `advise`. Dieser steht jetzt direkt über der Funktion. |

## Neue Befunde im Delta

Keine.

Geprüft: Die neue Zeile in `docs/architecture/fitness-functions.md:73` stimmt mit dem Filter in `tools/arch-baseline/05-knowledge.ts:24, 160` überein. Der Filter lässt nur Felder durch, die nicht in `GENERIC` stehen, zu genau einer Tabelle gehören und mindestens 5 Zeichen haben. `bunx vitest run tools/fitness` habe ich selbst ausgeführt: 15/15 grün. Prettier `--check` auf `fitness.ts`, `fitness.test.ts` und `fitness-functions.md` habe ich ebenfalls selbst ausgeführt: sauber.

## Nicht bestätigt

- `eslint tools/fitness`, `bun run check` und `bun run fitness -- --base origin/main` meldet der Aufrufer als grün. Ich habe sie nicht erneut ausgeführt.
