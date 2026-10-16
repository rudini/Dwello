# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: Korrespondenzadresse, country and IBAN (#68, #102, #191, #114)

Branch `claude/w3c-korrespondenzadresse-68-102-191-114`. The issues' "Decided (product owner)" sections are the requirement (#68, #102, #191); #114 has its own "Done means".

- [x] #191: scenarios in `settings.feature` (Liechtenstein IBAN saved; error names CH and LI), `@wip`
- [x] #68: scenario in `tenant-new.feature` (field «Korrespondenzadresse» with its help), `@wip`
- [x] #102: scenarios for a Korrespondenzadresse abroad (tenant detail; statement PDF address block and payment part), `@wip`
- [x] #114: scenario «Abrechnung an einen ausgezogenen Mieter mit alter Adresse» in `statement-detail.feature`, `@wip`
- [x] fach-reviewer on the `@wip` scenarios before implementing: `docs/reviews/w3c-fachreview-1.md`
- [x] #191: settings form accepts CH and LI with MOD-97; `settings_error_iban` in four languages; PRD one rule
- [ ] #68: legend «Korrespondenzadresse» and help at the field (four languages); tenant detail label
- [ ] #102: migration `tenants.country` (default CH); form select; BFF and backend validation; QR-bill debtor country; PDF address block of statement and reminder
- [ ] #114: next-steps text, `nextStepsDue` keeps the address step; warning in wizard preview and send dialog; overview task; `docs/anforderungen-vertragsende.md` A-5 implemented
- [ ] slice reviews (code-reviewer) per slice
- [ ] feature review: persona(s), fach-reviewer, daten-pruefer (QR-bill, PDF)
- [ ] a11y and language screens if a new state appears
- [ ] Blocked on me: glossary changes #68 asks for (`UBIQUITOUS_LANGUAGE.md`, Mieter: «Korrespondenzadresse», country)
