# Code-Review Runde 2: Workflow-Review 2026-10-23 anwenden (9ec63cad)

Delta: `git diff 9ec63cad^ 9ec63cad -- . ':!docs/reviews' ':!implementation_plan.md'`, Worktree `review-rules2` (detached auf 9ec63cad). Vorheriger Bericht: `rules-2026-10-23-review-1.md`.

## Status der offenen IDs

| ID | Schwere | Status | Beleg |
|---|---|---|---|
| C-1 | Blocker | behoben | `.github/workflows/ci.yml:87` `pull-requests: read` im Job `static-checks` |
| C-2 | Major | behoben | `CLAUDE.md:90` nennt jetzt die Ausnahme «a Minor that two or more personas meet in the same place (skill `slice-review`)»; `.claude/skills/slice-review/SKILL.md:41` verweist nicht mehr auf den widersprechenden Abschnitt |
| C-3 | Minor | behoben | `tools/open-work/check-issues.mjs:41-48` (`textOf`) bricht bei jeder nicht OK-Antwort mit Exit 1 ab; Test `check-issues.test.ts:88-93` wäre ohne die Änderung rot (404 mit `{ body: '' }` ergab vorher leeren Text und Exit 0) |
| C-4 | Minor | behoben | `tests/e2e/CLAUDE.md:76` steht jetzt als eigener Satz ausserhalb der Liste «gets a lower-layer test» |
| C-5 | Minor | behoben | `tests/e2e/CLAUDE.md:80` nennt `withSettingsLock` und `withLock('installation')` (`fixtures/settings-lock.ts:26,36`; `tasks/accessibility.ts:721`, `fixtures/test.ts:65`) |

## Neue Befunde im Delta

Keine.

## Nicht bestätigt

- Ob GitHub mit `pull-requests: read` den Text tatsächlich liefert: Das zeigt erst ein CI-Lauf auf einem Pull Request.
- Vom Aufrufer gemeldet: `bun run lint` OK, `bunx vitest run tools/open-work src/__tests__/open-work.test.ts tools/claude-hooks` 38 bestanden, roter Lauf des C-3-Tests vor dem Fix, Fallow-Gate beim Commit bestanden.
- Selbst erneut ausgeführt: `bunx vitest run tools/open-work/check-issues.test.ts`, 5 bestanden.

Geprüft: Umbau des Stand-in-Servers (`answer`) liefert für Liste, Einzel-Issue und Pull Request dieselben Antworten wie vorher; nichts Fremdes im Delta.
