## Session: 2026-11-09 #651, the page behind the open menu is inert (Refs)

Product owner, 09.11.2026 («Decided» in #651): one pull request for the inert part (Refs #651); the manual NVDA and VoiceOver check stays open for the product owner. Parallel session (worker of a coordinator): `implementation_plan.md` untouched.

- [x] Found: the inert behaviour is already on `main` (`src/lib/ui/MobileNav.svelte`, `src/lib/inert.ts`, jsdom test in `src/__tests__/shell.dom.test.ts` on a synthetic page)
- [x] Scenario «Hinter dem offenen Menü ist die Seite nicht erreichbar» (`navigation.feature`) pins it in the real layout; new web question `ReachableAround`; kept behaviour, still seen red with `makeInert` taken out
- [x] code-reviewer `docs/reviews/651-inert-review-1.md`: no Blocker/Major; C-1 Minor (step placed under the #657 comment) fixed, a Minor fix only in test files (no round of its own)
- [x] No persona, fach-reviewer or daten-pruefer: no UI, text, domain rule or amount changed
- [x] Archive the session; PR pushed after this archive
