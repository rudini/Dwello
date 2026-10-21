# Review Tailwind-4-Migration (Runde 2, Schlussrunde)

Bereich: `git diff 675be71 47f06d2` (47f06d2), Worktree `review-tw4-code2`. Vorbericht: `docs/reviews/tw4-review-1.md`.

## Status der offenen IDs

| ID | Schwere | Status | Beleg |
|----|---------|--------|-------|
| C-1 | Major | geschlossen | src/__tests__/tokens.test.ts:92 prüft jetzt `/\*,[^{]*::before[^{]*\{\s*border-color: var\(--color-line\)/` gegen globals.css:9-15. Ich habe es gelesen: Wird der Block gelöscht oder auf `currentColor` gesetzt, passt der Ausdruck nicht mehr, der Test wird also rot. Mit der Regel ist er grün; ich habe `tokens.test.ts` neu laufen lassen (50 Tests grün). |
| C-2 | Minor | geschlossen | `extend.borderColor` und sein Kommentar sind aus tailwind.config.js entfernt. Weder in der Konfiguration noch in den Design-Dokumenten verweist etwas darauf. |
| C-3 | Minor | geschlossen | Bei D1 in docs/design/design-decisions.md:11 steht jetzt `src/routes/+layout.svelte`. |

## Neue Befunde im Delta

Keine.

## Nicht bestätigt

- Der Aufrufer meldet `bun run lint` auf 47f06d2 sowie `design-guard.test.ts`, die volle vitest-Suite, Build und Check auf 675be71 («vom Aufrufer gemeldet»). Wiederholt habe ich davon nur `tokens.test.ts`. Die axe-Suite läuft laut Aufrufer noch; ich habe sie nicht gestartet.
- Die offenen Punkte unter «Nicht bestätigt» aus Runde 1 bleiben bestehen: die Gleichheit des erzeugten CSS, die Klassenerkennung über `source('..')` und die Auslieferung der Schriftdateien. Das Delta berührt sie nicht.

Geprüft: alle drei geänderten Dateien des Deltas. Der neu eingecheckte Bericht `docs/reviews/tw4-review-1.md` entspricht dem Vorbericht.
