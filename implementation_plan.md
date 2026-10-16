# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session W7b: Kündigungsfrist hint and «Kündigung aufheben» help (#112, #52)

- [ ] #112: `@wip` scenarios «Kündigung mit zu kurzer Frist» and «Kündigung mit genügend Frist» in `contract-detail.feature`, seen red; `fach-reviewer` before implementing
- [ ] #112: rule «less than 3 calendar months between receipt and Vertragsende» (day clamped) with the four unit cases of the issue
- [ ] #112: optional field «Kündigung erhalten am» in «Mietvertrag beenden», help with the form, hint (no block)
- [ ] #112: column `notice_received_on` (migration, schema, API, contract, `docs/data-model.md`), shown on the detail page, cleared when the notice is withdrawn
- [ ] #112: dialog state with the hint in `tests/a11y/screens.json`; `docs/anforderungen-vertragsende.md` A-3 implemented
- [ ] #52: `contracts_withdraw_notice_help` per the glossary in four languages, scenario «Kündigung aufheben» checks it, marker removed
- [ ] Slice and feature reviews, plan archived, pull request merged
