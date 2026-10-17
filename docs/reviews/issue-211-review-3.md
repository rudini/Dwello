# Code-Review #211 / #199 (#408), Runde 3

Worktree: `/tmp/claude-0/-home-user-Dwello/c539e8ea-b211-51a3-8d7c-2c40389c0007/scratchpad/review-211-code3` (Commit 6524f3ad), Delta `40002869..6524f3ad` (1 Commit, 7 Dateien). Ich habe alle Dateien im Delta gelesen.

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-16 | erledigt | `messages/fr.json:1612` | Der Text lautet jetzt `« Établir »`, mit U+00A0 auf beiden Seiten (per Python geprüft). `src/__tests__/i18n.test.ts` ist grün. |
| C-17 | erledigt | `tests/a11y/screens.json:287-291`, `accessibility.feature:87`, `sprachen-bildschirme.feature:88` | `contract-partly-billed-detail` hat jetzt `["default"]`, beide Features haben die Zeile mit `default`. `tests/unit/a11y-screens.test.ts` ist grün. `default` wartet auf nichts (`tasks/accessibility.ts:157`). Das reicht hier, weil `+page.server.ts:175` die Warnung auf dem Server lädt. Damit ist sie beim Laden schon da, wie bei `contract-moved-out-detail`. Was der Bildschirm zeigt, hält der Kommentar beim Seed fest (`tests/e2e/fixtures/screens.ts:127`). |
| C-18 | erledigt | `tests/a11y/screens.json:56`, `tests/e2e/tasks/accessibility.ts:224-225` | Die Bedeutung `partly-billed` und die Activity sind entfernt. `grep "partly-billed"` in `tests` und `src` findet nur noch den Namen des Bildschirms. |

Neue Befunde im Delta: keine. `docs/reviews/issue-211-review-2.md` und die Zeile in `implementation_plan.md` sind Ablage des Workflows und gehören zur Aufgabe. ponytail-review des Deltas: nichts zu kürzen (net −2 Zeilen, wie in Runde 2 vorgeschlagen).

## Nicht bestätigt

- Selbst gelaufen auf 6524f3ad: `bunx vitest run tests/unit/a11y-screens.test.ts src/__tests__/i18n.test.ts tests/unit/i18n-screens.test.ts`, 33 Tests grün.
- Volle Unit-Suite (164 Dateien, 3027 Tests), `bun run lint`, `bun run check`, `cd backend && bun run type-check`: vom Aufrufer gemeldet.
- E2E `-g "contract-partly-billed-detail"` auf chromium (2 grün, axe und Sprachen): vom Aufrufer gemeldet, nicht gesehen.
- C-19 (Nit aus Runde 2, Seed für Lea in jedem Bildschirm) ist ausserhalb dieses Deltas und unverändert. C-2 und C-5 … C-11 sind unverändert, wie in Runde 2.
