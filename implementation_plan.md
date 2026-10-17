# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22 and every finished session): `docs/archive/implementation-plan-verlauf.md`.

## Session: #83 #84 (W4d) fr/it/en terms from Fedlex, AI native read of tenant texts

Request (coordinator): «Setze #83 #84 um». #83 Option B: the Fedlex word (OR/ZGB, VMWG in fr/it) where one exists, a native speaker only for the rest, English plain words. #84 Option B: an AI model reads the texts a tenant sees (statement PDF, reminder letters, e-mails) as a native speaker; the landlord UI later. Both "Done means" are worded as decision issues: the decision is the requirement. Fedlex read with single `curl` downloads (WebFetch got 503): SR 220 of 1.10.2026, SR 221.213.11 of 1.10.2025, fr and it.

- [ ] fach-reviewer on the term proposal (Fedlex words for the ❓ terms and «Kündigungsfrist»), before any text changes
- [ ] #83: terms with a Fedlex word in `docs/design/i18n-begriffe.md`, `messages/{fr,it,en}.json`, PDF and letter texts; terms pinned in `src/__tests__/i18n.test.ts` (red first)
- [ ] #83: remaining ❓ terms (no Fedlex word) listed for a native speaker, follow-up issue
- [ ] #84: AI native reads (fr, it, en) of statement PDF, reminder letters and e-mail; fix the findings as pure text changes
- [ ] #84: German findings of `i18n-native-de.md` still open listed in the issue
- [ ] code-reviewer per slice; feature review (persona on the fr/it PDF and letters, fach-reviewer)
- [ ] Workflow review, archive the session, PR `Fixes #83` `Fixes #84`, CI, merge
