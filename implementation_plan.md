# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.


## Session W14: #80 July share of «Heizung Bergregion»

- [x] Compare the Bergregion row with the source table: Mieterverband merkblatt_nebenkostenabrechnung_waehrend_periode.pdf (2023), page 2, «Verteilungsschlüssel in Bergebieten und im Tessin», row «Berggebiete»: 14.0, 11.5, 11.5, 9.0, 7.0, 4.5, 1.0, 4.0, 5.5, 8.5, 10.5, 13.0, the same as the migration (no misprint); mietrecht.ch and HEV not reachable from the cloud session
- [x] Name the source in the test comment (`backend/src/__tests__/heating-profiles.pg.test.ts`); No scenario: only a test comment changes, no behaviour
- [ ] Note the source in issue #80
- [ ] Slice review (`code-reviewer`)
- [ ] Archive the session and open the pull request
