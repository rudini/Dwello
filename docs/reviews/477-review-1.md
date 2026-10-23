# Code-Review #477, Runde 1

Bereich: `git diff 50dce024 0e283c61 -- . ':!docs/reviews' ':!implementation_plan.md'` (Worktree `review-477-code`, detached auf 0e283c61).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine Befunde. |

Geprüft: Die Zeile «Akonto» (`UBIQUITOUS_LANGUAGE.md:52`) und die neue Zeile «Gültig ab (Akonto)» (`:53`) stimmen wörtlich mit den Texten aus F-11 überein, die im Issue unter «Decided (product owner)» am 2026-10-19 entschieden wurden. Die Zeile «Akontobeiträge» (`:179`) war schon auf dem Basis-Commit nachgeführt. `glossary_advance_text` in de/fr/it/en (`messages/*.json:92`) übernimmt pro Sprache Zeichen für Zeichen die zwei Sätze aus `contracts_advance_help` (`:840`) und aus dem Entscheid vom 2026-10-23. Die Zeile in `i18n-begriffe.md:45` passt zu `contracts_advance_from_label` in allen vier Sprachen. Der Marker in `AdvanceFrom.svelte` ist entfernt; unter `src`, `backend` und `tests` bleibt kein `TODO(fachlich prüfen, #477)`. Das Szenario «Akonto» in `help.feature:55-58` ohne `@wip` prüft mit `toContain` über die Screenplay-Frage `glossaryExplanationText` (`tests/e2e/steps/app-frame.steps.ts:298-301`). Mit dem Text des Basis-Commits schlägt es fehl, weil dort beide Sätze fehlen. Es gibt keinen neuen Bildschirm und keinen neuen Zustand und damit keinen Eintrag für a11y oder `sprachen-bildschirme`. Der Diff enthält nichts, was mit #477 nichts zu tun hat. Ponytail: keine Befunde.

## Nicht bestätigt

- Diese Checks hat der Aufrufer gemeldet, ich habe sie nicht erneut ausgeführt: `bun run lint` OK, `bun run check` 0 Fehler, `bunx vitest run --changed origin/main` 577 bestanden, E2E `help.feature accessibility.feature sprachen-bildschirme.feature -g "Hilfe|help "` auf chromium 24 bestanden.
- Den roten Lauf des Szenarios als `@wip` meldet der Aufrufer. Ich habe ihn nur durch Lesen bestätigt (der alte Text von `glossary_advance_text` enthält den erwarteten Satz nicht).
