# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session W9c: privacy statement (#82) and documents of former tenants (#178)

Branch `claude/w9c-privacy-82-178`. Both issues' "Decided" sections are the requirement (no separate implementation issues exist).

- [ ] #82 `@wip` scenarios (privacy.feature, authentication.feature, sprachen.feature, demo.feature), committed and reviewed by `fach-reviewer` before implementing
- [ ] #82 controller from `OPERATOR_*`, «Betreiber» explained, right of access (DSG)
- [ ] #82 retention: kept until the landlord deletes, 10 years (Art. 958f OR), no automatic deletion
- [ ] #82 third parties per configured provider (sign-in, mail transport, OpenPLZ, Google Maps): country, disclosure abroad, link; what the sign-in provider learns
- [ ] #82 Google sign-in without `access_type=offline`/`prompt=consent`, no profile picture taken over
- [ ] #82 server log: purpose, reader, retention set by the operator
- [ ] #82 cookie lifetime from `JWT_EXPIRY`; cookies can be refused (Art. 45c lit. b FMG, if fach-reviewer agrees)
- [ ] #82 sign-in page links the privacy statement
- [ ] #82 terms: demo paragraph; «die Verwaltung» wording; FR «rappels»; draft notice reviewed, `TODO(fachlich prüfen, #82)` removed
- [ ] #178 tenant page and overview name uploaded documents older than the end of the tenant's last Mietvertrag and offer to delete them (No scenario: needs a document uploaded before a past date; unit and DOM tests)
- [ ] slice reviews, feature review (persona, fach-reviewer), plan archived, PR merged
