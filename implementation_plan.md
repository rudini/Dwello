# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-15 (6): bug #137, PDF says «nach Heizprofil» when heating costs were shared by days

Task: open `bug` issues one by one (#122, #123, #125, #126, #127, #128, #135 merged in rudini/Dwello#181, #182, #189, #196, #197, #198, #203); now #137. Skipped while labelled `entscheiden`: #93, #124, #130, #131, #136, #138, #141, #193, #194.

- [x] Scenario `@wip` «Heizkosten einer Sommerperiode stehen im PDF nach Tagen» in `statement-detail.feature`: a move-in on 15.07.2024 in the period 01.06.–31.08.2024 of a profile with 0 % from June to August; the PDF shows the days, no «nach Heizprofil». Scenario red: expected «48/92 Tage», the PDF showed «52.17 %» and «Heizkosten nach Heizprofil «Winter»: 52.17 % … Jul 0.00 %, Aug 0.00 %»
- [x] fach-reviewer on the scenario (PDF, heating costs)
  - fach-reviewer round 1 (`docs/reviews/issue-137-fachreview-1.md`): fixed M-1 (Major; the Art. 8 Abs. 1 VMWG hint now follows the heating line, not the profile; the scenario checks it), M-2 (Major, existed before: a statement with heating costs but no profile and no tank lacked the hint; same fix, render test), V-1 (the general note drops its heating clause; the scenario checks «Heizprofil»), V-2 (rule 5 in `docs/nebenkostenabrechnung-anforderungen.md`), V-3 (scenario title in glossary terms; the missing term is #207), V-4, V-5, V-6 (Nits, no change: the rule, the heating-oil purchase and a 92-day statement are allowed and outside #137)
- [x] The calculation says when it shared heating costs by days (`handleMidYearMoves` returns `byDays`); the PDF follows it: Mietstage on the line, no profile note, no heating clause in the note, the Art. 8 hint for every heating line. Test red: «sagt, dass es nach Tagen geteilt hat …» (`prorating.pg.test.ts`) – `byDays` undefined; «nennt die Heizkosten nach Heizprofil nur, wenn …» (`statement-pdf-data.test.ts`) – `byProfile: true`; «nennt die Mietstage, kein Heizprofil …» (`statement-pdf-render.test.ts`) – the PDF held «Heizprofil»
- [x] Skills: tdd, ponytail, ponytail-review (lean; the note moved into `sharesNote` for the fallow gate)
- [x] Checks: test:coverage (2432), lint, check, backend test (611) + type-check, deepcheck:audit, fallow, E2E chromium + api statement-detail (24 passed)
- [ ] code-reviewer
  - code-reviewer round 1 (`docs/reviews/issue-137-review-1.md`): no Blocker/Major; fixed C-1 (Minor; pg test of a summer statement's PDF in `statement-pdf.pg.test.ts`, red with the `byDays` return in `heatingOf` taken out), C-2 (Nit; the render test block moved); its «not confirmed» point (the PDF recomputes with the current profile, existed before) is #209
- [ ] daten-pruefer (PDF)
  - daten-pruefer round 1 (`docs/reviews/issue-137-datenpruefung-1.md`): S1–S5 confirmed; fixed D-1 (Major; a heating invoice with a Leistungszeitraum in a period without heating months was shared by the days of the whole period; the calculation now takes the day rule of every other invoice once heating is shared by days; test red in `service-period.pg.test.ts`: tenantShare 316.45 instead of 469.56), open D-2, D-3 (Minor, existed before: percentages where days could be shown) in #208
- [x] Personas: none; the change is in the PDF only, which `daten-pruefer` and `fach-reviewer` checked (workflow review W-1)
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-137.md`
- [ ] PR, CI, merge

Files: `backend/src/services/{prorating,statement-pdf,pdf,calculation}.service.ts`, tests (`prorating.pg.test.ts`, `service-period.pg.test.ts`, `statement-pdf.pg.test.ts`, `statement-pdf-data.test.ts`, `statement-pdf-render.test.ts`, `statement-detail.feature` and its steps, seed `statement` with a period), `docs/nebenkostenabrechnung-anforderungen.md` (rule 5)
