# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session 2026-10-16 (16): #241 statement PDF: shorter note and labelled invoice lines

Request (chat): work through the open issues one by one; before each, check its related issues and do them too, one pull request each (CLAUDE.md, Workflow 8). Related to #241: #239 and #236 (the same invoice lines, next), #237 (waits for the product owner since 16.10.: the credit case cannot be entered in the app, comment there), #75 (glossary, product owner). Decision issues #240 and #227: their implementation issues to open.

Plan: the decided texts of #241 (P-1 note in short sentences, P-2 labelled lines, P-3 the step to «Ihr Anteil») in `backend/src/services/pdf.service.ts` (`sharesNote`, `partLines`), in de/fr/it/en.

- [x] Scenario «PDF nennt bei Rechnungen über verschiedene Leistungszeiträume die Tage jeder Rechnung» (`statement-detail.feature`) updated, `@wip`, red
  Scenario red: `steht im PDF "Leistungszeitraum 01.04.2025 – 30.06.2025: CHF 600.00, Ihre Mietstage 0 von 91 Tagen"` – Expected substring not in the PDF text
- [x] Decision issues: #227 → implementation issue #247, closed; #240 → #248 to #253, its detail-page point added to #104 and its recalculation point to #132, closed
- [x] fach-reviewer on the scenario and the fr/it/en wording before implementing
- fach-reviewer round 1 (docs/reviews/241-fachreview-1.md): V-1 (Major), V-2, V-6, V-7, V-8 asked in the chat and decided by the product owner (16.10.2026, recorded in #241): fixed V-1 (lines «Ohne Leistungszeitraum: …» and «Leistungszeitraum … (Rechnung CHF …), davon …», the latter the first point of #236), V-2 (percentage kept, note «Der Prozentwert ist gerundet; …»), V-6, V-7, V-8 (P-1 corrected); fixed V-3 (pinned old texts: scenario line in «PDF erklärt …», pg and render tests), V-4 (rule 5), V-5 (`t.colon` in the lines), V-10 (word order fr/en), V-11 (row «Leistungszeitraum» in `docs/design/i18n-begriffe.md`); rejected V-9: the lines name the divisor («von 92 Tagen»)
- [x] Render tests in four languages first (`statement-pdf-render.test.ts`), pg tests updated, then `pdf.service.ts`
  Test red: «beschriftet jede Rechnung mit ihrem Leistungszeitraum und rechnet bis zu Ihrem Anteil» – Expected to contain "Leistungszeitraum 01.07.2025 – 30.09.2025: CHF 1'200.00, …"
  Test red: «erklärt die Rechnungen unter der Position und den gerundeten Prozentwert in kurzen Sätzen» – old note
  Test red: pg «nennt eine Rechnung ohne Leistungszeitraum …» – Expected "Ohne Leistungszeitraum: CHF 365.00, …"; pg «druckt den Anteil in Prozent, …» – Expected "Leistungszeitraum 01.07.2025 – 30.09.2025 (Rechnung CHF 900.00), davon …"
  Test red (written after the code, shown by taking it out): render «nennt eine Rechnung ohne und eine über die Periode hinaus auf %s als solche» – 4 fail with `partText` always `partLine`
  Files: `backend/src/services/{pdf,invoice,calculation}.service.ts`, `backend/src/db/schema.ts` (`InvoicePart.noPeriod`, `whole`, no migration: jsonb), `backend/src/__tests__/{statement-pdf.pg,statement-pdf-render}.test.ts`, `tests/e2e/features/statement-detail.feature`, `docs/nebenkostenabrechnung-anforderungen.md`, `docs/data-model.md`, `docs/design/i18n-begriffe.md`
  Skills: tdd, ponytail, ponytail-review
- [ ] Checks: test:coverage, lint, check, backend test + type-check, deepcheck:audit, affected E2E
- [ ] code-reviewer round(s)
- code-reviewer round 1 (docs/reviews/241-review-1.md): fixed C-1 (Major: the change of the Tankbestand got the label «Leistungszeitraum»; now «Veränderung Tankbestand …», the decided text of #239, so this pull request also closes #239: Workflow 7 asks to fix a Major the change makes worse, CLAUDE.md's one pull request per issue would leave it open), C-2 (test: no rounding sentence without invoice lines), C-5 (row U-37), C-7 (plan); open C-6 (O-33); rejected C-3: pg and render tests show each label, the scenario shows the path; rejected C-4: the PDF's French spacing is U-26/U-37, the same in every text
  Test red: pg «nennt die Veränderung des Tankbestands unter einer Heizposition nach Tagen als solche» – Expected "Veränderung Tankbestand 01.01.2025 – 31.12.2025: CHF 500.00, …", received «Leistungszeitraum 01.01.2025 – 31.12.2025: CHF 500.00»
  Scenario red (#239, written after the code, shown by taking it out): «PDF nennt die Veränderung des Tankbestands unter den Heizkosten als solche» – Expected substring "Veränderung Tankbestand …" without `partStock`; green with it
  Test red (written after the code, shown by taking it out): render «nennt die Veränderung des Tankbestands auf %s als solche» (4 fail), pg «erklärt den Bruch …» `not.toContain('Der Prozentwert ist gerundet')` (fails with the sentence always shown)
- [ ] Feature review: fach-reviewer, daten-pruefer (the PDF), persona Dr. Weber (the new texts)
- persona Dr. Weber (docs/design/personas/dr-weber-241.md; setup: SQL deleted Nina Brunner's draft 2025 in `dwello_persona`; the persona set the Hauswart Leistungszeiträume Q1, Q2, none, 01.10.2025–31.01.2026): could recompute «Ihr Anteil» CHF 245.45 from the PDF; open P-1 (Minor, the line names no receipt: #236, comment), P-2, P-3 (Minor), P-4, P-5 (Nit): #256 (`entscheiden`); Beobachtungen all before #241: wizard time (#252), «Kosten Liegenschaft» (#249), detail page (#104), help text (#250), drafts not recomputed (#132), invoice filter once lost the year (not reproduced, no row)
- daten-pruefer round 1 (docs/reviews/241-datenpruefung-1.md): no findings; NK-22222222-2025-0005 recomputed to the Rappen (lines, `invoice_parts` with `noPeriod` and `whole`, «Ihr Anteil» line, totals); observation: fr/it/en lines end «sur/su/of {total}» without the word for days (kept: word order of fach-review V-10)
- fach-reviewer round 2 (docs/reviews/241-fachreview-2.md): round-1 findings confirmed fixed; fixed V-2 (render fixture 0.7338 / 512.08), V-3 (= C-2), V-5 (= C-5); open V-1 (Minor, rounding sentence at heating positions: #256, `entscheiden`); rejected V-4 (= C-4)
- [ ] Workflow review `docs/reviews/workflow-rules-review-issue-241.md`
- [ ] Archive session, push, PR `Fixes #241`, CI, merge
