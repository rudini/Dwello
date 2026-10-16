# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session: contract wizard keeps the apartment and takes over the rent (#144)

Request: «Setze #144 um» (coordinator W10). #144's "Done means" still asks for an implementation issue; the decided Option A is the requirement, the pull request says `Fixes #144`.

- [ ] The preselected apartment survives the detour to «Neuen Mieter erfassen» (scenario in `contract-new.feature`)
- [ ] Nettomiete, Zusatzmiete and Akonto are preset from the apartment's last Mietvertrag, editable, marked as taken over (scenario in `contract-new.feature`)
- [ ] fach-reviewer on the `@wip` scenarios before implementing (amounts)
- [ ] Slice review (code-reviewer), feature review (persona Helga)
- [ ] Checks before push; workflow review; archive session; pull request merged
