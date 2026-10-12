# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open work: GitHub issues (functional) and `docs/design/offene-punkte.md` (non-functional), see `CLAUDE.md`, "Open work". History (phases 0–22, sessions 1–16): `docs/archive/implementation-plan-verlauf.md`.

## Session 18 - October 2026: Review agents, one place for open work

### Done ✅
- [x] **Review agents**: `CLAUDE.md` "Workflow" gets a domain check of the scenario before implementing (step 1),
  a code review per slice (step 4), a feature review by personas, domain and data reviewers (step 5), rules for
  findings (step 6), done and the stop after 3 rounds (step 7), and a keep-going rule. Subagents in `.claude/agents/`:
  `fach-reviewer.md` (Verwalter, Mietrecht, Fedlex quoted verbatim), `daten-pruefer.md` (own script against the
  database, to the Rappen, QR codes decoded), `code-reviewer.md`, `persona.md`. `docs/design/arbeitsregeln.md`
  points to them; personas note "expected vs. seen" instead of thinking aloud.
- [x] **Review against the Opus 5.5 guide** (R-1 to R-15, independent reviewer, report in the session only): the
  main agent starts the app once and the agents never restart it or change its data (R-1); `daten-pruefer` renders
  the PDF and installs a QR decoder, else "Nicht bestätigt" (R-2); a round is one reviewer on one slice (R-3);
  scratch databases and scratchpad are not destructive (R-4); done lines for `code-reviewer` and `persona` (R-5);
  the main agent saves the reports (R-6); summary "Blocked on me / Changed / Found" (R-7); checklist from the start
  (R-8); status notes with the next action (R-9); `code-reviewer` details only Blocker/Major, reports in German
  (R-10, R-14); fallback without subagents (R-11); smaller fixes (R-12, R-13, R-15: "Before coding").
- [x] **Glossary** (`UBIQUITOUS_LANGUAGE.md`, approved by the product owner): Verwaltungspauschale of the tenant's own
  costs without key, no "Nur Warmwasser", Rechnungsdatum vs. Leistungszeitraum, Heizung 70/30 formula with sums; new
  terms Befristet/Unbefristet, Kündigungstermin, Kündigung aufheben, Kündigungsfrist, Monatlich total, Leistungszeitraum,
  Heizkosten (Kategorie), Gleichmässig pro Wohnung, Tankbestand, Stichtag, Eigene Nebenkosten, Rundung auf 5 Rappen;
  Zahlungsfrist from sending, also for refunds; UI languages, Romansh PDF in German. Fachreview (V-1 to V-11, M-1 to
  M-5, report in the session only) applied; open domain points in `docs/design/offene-punkte.md` F-1 to F-20.
- [x] **Docs housekeeping**: redesign brief, analysis, plan, migration guide, progress and reviews to
  `docs/archive/redesign/`; deepcheck brief and validation to `tools/deepcheck/`; session-11 report, seed data notes and
  the old open points (`offene-punkte-verlauf.md`) to `docs/archive/`; new short `docs/design/offene-punkte.md` (open
  points only, IDs F/P/B/A/H; comments in code and docs repointed); persona screenshots of earlier rounds removed
  (40 MB to 8 MB), new ones stay out of the repo; README languages, migration numbers in `docs/data-model.md`, MVA
  step 1 status.
- [x] **One list of open points**: `docs/design/offene-punkte.md` is the only list; added the open items of earlier
  sessions (P-14, P-15, U-11, H-10 to H-13), operations and security (O-1 to O-8), accessibility IDs renamed A- to U-
  (they clashed with the requirements in `docs/anforderungen-vertragsende.md`). This plan keeps only the current
  session; phases 0–22 and sessions 1–16 moved to `docs/archive/implementation-plan-verlauf.md`.
  `docs/test-pyramid.md` "Open" and `CLAUDE.md` point to the list.
- [x] **Review of the single list** (R-1 to R-12, independent reviewer, report in the session only): fallow backlog
  (H-14), `ponytail:` markers (H-15), PRD features not built (P-16), rate limiting and monitoring (O-9), the MVA
  structural flaws in O-8, «Abrechnungsperiode» twice in the glossary (F-21); `anforderungen-vertragsende.md`,
  `PRD-Dwello.md` and `migration-mva.md` point to the list; CLAUDE.md steps 6 and 8 say where open findings and done
  sessions go; archive holds sessions 1–16 only; old review IDs in rows prefixed with «review».
- [x] **Persona list**: `docs/design/personas/README.md` lists the five personas with task, viewport and input (from the
  redesign brief and the last runs); `arbeitsregeln.md`, `.claude/agents/persona.md` and `CLAUDE.md` step 5 point to
  it; `docs/PRD-Dwello.md` section 3 replaces the persona Michael Keller (professional manager) with the target users
  and a pointer to the list.
- [x] **Target users aligned**: `CLAUDE.md` intro, `README.md` (Overview, Target Users) and `docs/PRD-Dwello.md`
  (summary, 2.4) name private landlords with little experience, as the design rules and personas do.
- [x] **Functional open work as GitHub issues**: 87 issues in `rudini/Dwello` (#51–#53 probes, #55–#138; titles keep
  the old ID; labels `fachlich`, `produkt`, `bug`, `entscheiden`), each with "Done means"; drafted from
  `offene-punkte.md` and `anforderungen-vertragsende.md`, checked against the code by three reviewers before creation.
  `offene-punkte.md` keeps only non-functional rows (U, H, O; P-15, B-10, B-12 renamed U-12, H-16, H-17).
  `CLAUDE.md` "Open work" (issues, `entscheiden`, "Proposed" → "Decided", `Fixes #n`, `gh` note); issue templates
  `.github/ISSUE_TEMPLATE/{task,decision}.md`. 26 `TODO(fachlich prüfen)` markers settled by the glossary removed, 21
  name their issue. Guard `src/__tests__/open-work.test.ts`; CI step `tools/open-work/check-issues.mjs` (markers name
  open issues; `issues: read`); design guard ignores issue numbers in markers; ESLint covers `tools/**/*.mjs`.
- [x] **Final review of the migration** (R-1 to R-18, independent reviewer, report in the session only): the guard
  sample no longer looks like a real marker to CI; the plan may hold no session; `arbeitsregeln.md`, PRD,
  design decisions and this plan point to issues; #112 (A-3, Art. 266m OR wording) and #116 (A-7) moved their answers
  to «Proposed» with `entscheiden`; #52, #63, #65, #68, #76, #79 corrected; stale marker texts shortened, the
  Leistungszeitraum marker removed; `data-model.md` marker names #71; the CI script reads numbers only inside markers,
  rejects pull requests and fails a PR that closes an issue a marker still names; ESLint block for `tools/**/*.mjs`;
  templates with «Proposed»; former O-1 lives only as #51; issue numbers in `anforderungen-vertragsende.md`.
- [x] **Merge of main (PR #54, A-4 and A-10)**: conflicts in `src/routes/contracts/[id]/+page.svelte` (main's refusal
  block, without the marker the glossary settled), `docs/anforderungen-vertragsende.md` (A-4, A-10 umgesetzt),
  `offene-punkte.md` and this plan (main's session archived as «Session 17 (PR #54)»; this session renamed 18).
  Main's new open points: functional ones as issues #140 (Nachmieter, Vermietet bis), #141 (A-10c), #142 (A-10d),
  #143 (B-13), #144 (P-17), #145 (P-18); usability as U-13, U-14; the two new markers name #140.
