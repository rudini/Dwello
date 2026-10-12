# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8): add the items when the task starts, tick them as they are done, note the files changed. Open points: `docs/design/offene-punkte.md`. History (phases 0–22, sessions 1–16): `docs/archive/implementation-plan-verlauf.md`.

## Session 17 - October 2026: Review agents in the workflow

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
