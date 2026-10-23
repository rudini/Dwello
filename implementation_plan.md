# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session`.

- Start: move a finished earlier session to `docs/archive/implementation-plan-verlauf.md` (append, do not read the archive), then add the task's items as a checklist under a new `## Session` (a request that covers several issues is one session). A session counts as finished when every item is ticked, or when its pull request is merged: then tick its last item with the pull request number.
- During: tick each item when done, add anything new you find, note the files changed. A «Workflow note: …» item is ticked when its point is in the workflow notes or, without notes, under "Found" (skill `workflow-review`).
- End: archive the session before the final commit, its "PR" item ticked as «pushed after this archive»; CI results after that go into the pull request, not the plan.
- Parallel sessions (workers of one coordinator, or another branch's session open on `main`): leave this file untouched, keep the checklist in the pull request description and append the session to the archive at the end.

Open work: GitHub issues (non-functional ones with an `nfr:` category label), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: landing page warmer, not larger (marketing)

Request: implement the seven points of the landing review (animations back with HTML text, terminals collapsed, hero with the statement, no technical numbers, the example carried through, roadmap and open source after the FAQ, stale upload shot gone), page weight and length at most as today (66 KB HTML, 870 KB total, 13/21 screens).

- [x] `marketing/index.html`: hero (lede, note, statement PDFs instead of the dashboard), facts bar removed
- [x] Vermieterjahr: timeline labels, example (Wasserversorgung, Hans Müller, Maria Rossi), drawing from the app's motifs
- [x] Features: upload animation with HTML fields, statement screenshot restored, split animation; upload and keys shots removed
- [x] Install: commands under «Für die Person, die einrichtet»
- [x] «Einfach zu bedienen» without 48 px / 7 : 1 / 390 px
- [x] Open Source and roadmap after the FAQ, roadmap one line per item
- [x] `marketing/i18n/{fr,it,en}.json` and rebuilt pages; `marketing/README.md`
- [x] Measure: bytes, heights, weight; axe light/dark 1440/768/390 in four languages (commit eaa6240: desktop 10 647 px, mobile 15 922 px, first load 358 KB, HTML 70 KB; axe 0)
- [ ] Reviews: code-reviewer, personas (Helga, Marco, Anna), fach-reviewer (timeline sentence)
- [ ] Archive, PR
