# Stage 8 – review 1 (old design system removed, dark mode) and remnant search

Reviewer: independent general-purpose agent, read-only, live in light and dark (`05def10..c3b1da6`); remnant search: Explore agent over `src/`, `tests/`, configs, `package.json`, READMEs, CLAUDE files, docs and `.github`.

Review verdict: 0 Blockers, 1 Major (pre-existing), 7 Minors. Tailwind check: the CSS built with the old and the new config differs only in four selectors from the design guard's own test samples; every class used in `src/` still generates CSS. Remnant search: the code is free of the old design system; leftovers in docs, `package.json`, error texts and historical files.

| # | Source | Severity | Finding | Resolution |
|---|---|---|---|---|
| 1 | Review | Major (pre-existing) | Leaflet's panes (z-index 400–600) drew the map pin over the delete dialog and under-scrolled over the sticky header. | Map container `isolate`. DOM test. |
| 2 | Review | Minor | Map light in dark mode (`.leaflet-container{background:#ddd}`, light tiles). | Dark CARTO tiles when the system is dark; `:root .leaflet-container` takes `--color-sunken`. Tests. |
| 3 | Review | Minor | With the colours replaced, a bare `border`/`divide-y` would take the text colour. | `borderColor.DEFAULT` = line token. Test. |
| 4 | Review | Minor | Placeholder colour still Tailwind's gray-400 (2.5:1). | `::placeholder` uses `--color-ink-muted`. Test. |
| 5 | Review, search | Minor | `overrides.svelte-i18n` left in `package.json`; `@types/google.maps` unused. | Both removed, lockfile updated. |
| 6 | Review, search | Minor | README and tech-stack still named svelte-i18n, `src/lib/components`, "Dark mode: not implemented". | Updated. |
| 7 | Review | Minor | Two open points already done. | Marked done in `offene-punkte.md`. |
| 8 | Review | Minor (pre-existing) | Step names break mid-word at `xl` in the test Chromium. | Kept: real browsers hyphenate with `hyphens-auto`; without `break-words` long names would widen the page. `offene-punkte.md`. |
| S1 | Search | Minor | English API fallback texts could reach the UI ("Session expired…", "Request failed"); invoice delete and new showed raw backend messages. | German texts; DOM tests. The invoice edit form keeps showing the backend's reason (existing test), listed in `offene-punkte.md`. |
| S2 | Search | Minor | Unused tokens `--leading-heading`, `--size-control`, a hard-coded `code` font rule, 19 unused icon keys (partly old Material names). | Removed. |
| S3 | Search | Minor | `tests/exploratory-test.ts` checked old classes `text-red`/`text-green`. | Token classes. |
| S4 | Search | Minor | Broken `favicon.png` link, `screens/` mockups and `CLAUDE.md.backup` with the old design, PRD naming svelte-i18n. | Listed in `offene-punkte.md` (historical material, not part of the app). |

Axe harness change (scroll to the top before analysing) judged justified by the reviewer: axe checks the whole DOM regardless of scroll; only the overlap-dependent `target-size` result under the sticky header changes.

Checks after the fixes: unit 1284 (coverage 89 % statements, 76 % branches), lint, check, fallow clean, E2E 389 passed incl. axe light and dark (0 violations).
