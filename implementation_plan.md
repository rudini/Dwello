# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: moves within the house and contracts that continue by law (#156, #155)

Request: «Setze #156 #155 um».

- [ ] #156 «Nächste Schritte» get «Neuen Mietvertrag für {name} erfassen» to `/contracts/new?tenant=…` (scenario in `contract-detail.feature`, DOM test `NextSteps.svelte`)
- [ ] #156 «Neuer Mietvertrag» hints when the chosen tenant still has an open-ended Mietvertrag for another apartment (not blocking)
- [ ] #156 «Neuen Mietvertrag erfassen» on «Mietvertrag bearbeiten» fills in the tenant and the earliest start (`?start=`)
- [ ] #155 help text (four languages) and `docs/anforderungen-vertragsende.md`: death keeps the Mietvertrag (heirs' address as Korrespondenzadresse); transfer or court assignment is Vertragsende plus new Mietvertrag
- [ ] fach-reviewer on the `@wip` scenarios before implementing
- [ ] Slice review (code-reviewer), feature review (persona, fach-reviewer)
- [ ] Checks before push; workflow review; archive session; pull request merged
