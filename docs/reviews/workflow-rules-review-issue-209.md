# Workflow rules review: issue #209

Task: the statement PDF recomputed the heating share with the Heizprofil as it is now; the statement now stores the share, the months and the profile's names at creation, and the PDF prints them.

## Findings

1. **A container restart drops running reviewers without a trace in the rules.**
   - Rule: `CLAUDE.md`, Workflow 5 and the skill `slice-review` («When a reviewer stops without a review … start it once more»).
   - What happened: the container restarted while the data check ran; the agent, the persona stack and the database `dwello_persona` were gone, the local commits and the scratchpad survived. I ran `session-start.sh` again, started the stack and the data check again. The skill's rule fits («start it once more»), but it does not say that the app must be started again and that a lost run is not a "second failure".
   - Proposed change: in `slice-review`, "Triage": a reviewer lost to a restart of the session is started again with the app restarted; it does not count as a failed start.

2. **Prettier covers only `src/`, but the rule reads as if it covered every file.**
   - Rule: `CLAUDE.md`, Gotchas, "Formatting" («In a file you change, format only your own lines (`bunx prettier <file> | diff <file> -`)»).
   - What happened: run inside `backend/`, `bunx prettier` ignores the root `.prettierignore` (which limits Prettier to `src/`) and proposes to wrap long lines that match the surrounding backend style; run from the root it changes nothing. In #208 I applied its proposal to two of my lines, in #209 I found out it does not apply.
   - Proposed change: say in "Formatting" that Prettier applies to `src/` only (`.prettierignore`) and that the check is run from the repository root.

3. **A data check cannot reach the case a bug is about when the demo data has no such record.**
   - Rule: `CLAUDE.md`, Workflow 5 (daten-pruefer for statements and PDFs) and the agent's rule not to change data it does not own.
   - What happened: #209 is about an own profile changed after a statement was created; the demo data uses predefined profiles only, and the data check may not change profiles, so it confirmed only the unchanged statements. The case is covered by pg tests alone.
   - Proposed change: let the data check create its own records in a building of the demo data for the case the issue names (as personas may save in their own building), or name in Workflow 5 that such a case rests on the lower-layer tests.
