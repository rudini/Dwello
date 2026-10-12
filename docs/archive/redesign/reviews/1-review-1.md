# Stage 1 – review 1

Reviewer: independent Plan agent, read-only, fresh context. Input: brief, glossary, CLAUDE.md, `00-analyse.md`, `01-plan.md`, `playwright.config.ts`, `ci.yml`, backend services. Contrast ratios recomputed by the reviewer: no pair below 4.5:1 (text) or 3:1 (UI).

Verdict: 0 Blockers, 6 Majors, 7 Minors; no business-logic or data-model change in the plan.

## Majors and resolution

| # | Finding | Resolution |
|---|---|---|
| M1 | The send dialog copy claimed the statement is delivered; the backend only sets the status. | D17 rewritten: consequence texts are verified against the backend services; sending says "als versendet markiert" and asks the user to deliver the PDF. D20 added for document previews. |
| M2 | Overview tasks had no data source and risked invented rules. | D14 lists the existing endpoints per task; time windows and derived rules marked TODO(fachlich prüfen), listed in `offene-punkte.md`. |
| M3 | Global dark tokens would break old screens mid-migration. | D4: dark mode switched on in stage 8 (scoped selector until then); axe runs light only until then (`screens.json` `colorSchemes`). |
| M4 | One axe example with all variants would exceed the 30 s timeout; firefox/webkit rerun on main. | One example per screen × state, variants inside with raised step timeout; `grepInvert: /@a11y/` for firefox/webkit. |
| M5 | `screens.json` claimed an empty-database check the plan says is impossible; `first-use` same. | State meanings rewritten; deviation documented in `offene-punkte.md`. |
| M6 | Remnant search only in `src/`; fallow not planned for. | Guard extended to config/package/static/docs (stage 8 checklist), class-token matching; fallow verified: a test import counts as consumer, so components ship with their DOM test; no ignores. |

## Minors and resolution

1. Settings three levels deep → Kategorien/Verteilschlüssel/Heizprofile become sidebar items (D12); tablet viewport added; defaults/prefilling (D15a); document preview (D20); illustration mapping (section 8); skip link (D12); disabled tokens (section 3). All fixed.
2. `text-sm` restricted in the guard to badges/meta – fixed in plan.
3. Spacing guard incl. arbitrary values and `gap`/`space`/`inset`; stage 8 keeps `transparent`/`current`/`inherit` – fixed in plan.
4. Contrast claim reworded (AAA for body text, ≥ 6.4:1 for accent/semantic, `accent-strong` on `accent-soft`).
5. localStorage conditions (versioned key, clear on save/logout, stale ids, after hydration, DSG note) – added to D15 and `offene-punkte.md`.
6. Help texts aligned with the glossary (Abrechnungsperiode examples, Heizprofil "nach Monaten statt nach Tagen", Verwaltungspauschale "keine Obergrenze", "1'650.00", "CHF").
7. Screen list: `draft-restored`, `action-error` and tablet added; the inline tenant step is part of `every-wizard-step`.

Nothing deliberately left open. One round: changes are documentation only.
