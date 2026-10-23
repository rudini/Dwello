# Personas

The users Dwello is built for (`CLAUDE.md`, "Design-Regeln"): private landlords with little experience who use Dwello a few times a year. The five personas below stand for them in usability reviews. They were defined in the redesign brief (`docs/archive/redesign/REDESIGN_BRIEF.md`) and are run by the subagent `persona` (`.claude/agents/persona.md`); how a run works: "Running a review" below and the agent itself.

Personas are AI agents that operate the running app with the demo data, not real test users. The demo data is invented, so a report may quote its names. The persona stack answers the KI check of a new category and the reading of uploaded invoice files (by the file name: «… ohne KI» fails, «Sammelscan» holds two invoices, «Werke Schlussrechnung» deducts Akonto payments, «… Reparatur» mixes in costs that are not allocable, «… Gutschrift» is a credit note; suppliers «Elektro Blitz …» and «Gartenbau Grün …» get a Kategorie) with the stand-in of the acceptance tests (`backend/scripts/llm-stub.ts`, fixed answers), not a model; other invoices find no KI. A finding about the quality of a KI answer is about the stand-in. Their reports are in this folder as `<persona>-<round>.md`.

| Persona | Who | Default task | Viewport and input |
|---|---|---|---|
| Helga, 68 | Inherited an apartment; little computer experience, needs large text, unsure about domain terms. | Create the first tenant and a rental contract. | Desktop 1440 × 900 at 150 % zoom (also 200 %), mouse. |
| Marco, 38 | Employed, mostly on his smartphone, little time. | Create the Nebenkostenabrechnung for the previous year. | Mobile 390 × 844, touch. |
| Dr. Weber, 52 | Legally cautious, reads everything, questions plausibility and recalculates. | Check the statements, understand the warnings, assess the PDF. | Desktop 1440 × 900, mouse. |
| Sven, 45 | Blind; screen reader and keyboard only. | Go through the rental contract wizard by keyboard; check focus, labels and error messages. | Desktop 1440 × 900, keyboard only, judged by the accessibility tree. |
| Anna, 29 | First-time landlord, returns after months without remembering anything. | Find out what to do next. | Desktop 1440 × 900, some screens on mobile 390 × 844. |

The caller of a run gives each persona a task on the change under review instead of its default task; the profile stays the same.

## Which personas

A persona is affected by a change (`CLAUDE.md`, Workflow 5) when one of these holds; each gets a task on the change. A change that adds a screen or flow gets every persona named here; any other change at most the two that fit it best (Marco for a phone view counts as one):

- **Screen:** the persona's default task uses the changed screen.
- **Device:** every changed view is also checked on a phone: Marco.
- **Kind of change:** new claims, texts or anything with legal weight: Dr. Weber; keyboard, focus or what a screen reader announces: Sven; finding the way in, first use or a return after months: Anna; forms and terms for beginners: Helga.
- **Browser chrome** (tab icon, title, manifest): headless Chromium draws no tab bar, so the persona judges the asset rendered at its real sizes on light and dark backgrounds instead of browsing.

## Running a review

- **The app:** `docs/design/tools/persona-stack.sh` starts it: a fresh database `dwello_persona` with the demo data, backend on 3301, its own production build in `/tmp/persona-app` on 3300, the KI stand-in on 2528; `--no-build` serves the last persona build again, `--keep-db` restarts the servers on the existing `dwello_persona` (after a container restart, so the records personas saved stay).
- **A fresh installation** (#774): a change to «Dwello einrichten» or to what a landlord meets right after it gets `--fresh`: the same build on an empty database, without OAuth and demo data, with the Einrichtungscode `PERS-FRSH` and a KI stand-in that reports a model download at 40 %. The setup can be done once, so each persona that sets Dwello up gets its own instance: `--fresh --second` starts another on :3310/:3311 (`dwello_persona_2`) beside the first, from the same build. The task names the address, the code and that the persona starts signed out without the persona-kit cookie.
- **Reports:** a persona writes only its report into this folder; its scripts and screenshots stay outside the repository. `screens/` keeps only the screenshots of the last redesign and i18n round; earlier ones are in the git history.
- **Who saves:** personas that run at the same time share one database. Give each persona that needs to save its own building of the demo data, as long as buildings are left, and say in its task that saving in the persona app is part of it (`dwello_persona` is recreated for each run); the others only look. A global setting (one record for the whole app) is saved by one persona only; the others' tasks say that the page may change while they look. Name records only from `demo-records.md`.
- **Language:** the interface language is stored on the account, so a persona in another language than German runs alone.
- **Meanwhile:** personas use their own build, not your tree: keep working while they run, E2E included (`tests/e2e/CLAUDE.md`, "Run"). Stop the persona servers by port (`fuser -k 3300/tcp`), never with `pkill -f`.
- **A state reached only by a failure:** name how to reach it in the task: the request to fail (the persona simulates it), or for an outside service's result (a refused mail) the SQL that writes it into `dwello_persona`, which the caller runs before starting the persona.
- **Demo records in the way:** when demo records block the task (a draft overlapping the period to bill), the caller removes them by SQL in `dwello_persona` before starting the persona and names the SQL in the task.
- **No persona:** a change visible only in a state the persona stack cannot produce (the server's clock, a real KI model instead of the stand-in) needs no persona when a lower-layer test shows it and no persona can reach a new text of it (through a failing request, that SQL or the stand-in's answers); say so in the plan.
- **Outside services:** a change that calls one (an address register, a mail provider) first gets one call through the persona stack (`/api/...` with the persona-kit cookie); only when it answers do the personas start.
- **More visible:** a finding on the base commit that a persona meets in its task on this change counts as made more visible by it (`CLAUDE.md`, "Done means").
- **Build-time values:** a change that depends on one names it in the task and the start (`APP_VERSION=0.4.0 docs/design/tools/persona-stack.sh`).
- **PDFs:** a change to what a PDF prints gets Dr. Weber when its texts change; its amounts are `daten-pruefer`'s, which starts after the persona that creates the statement.

Unknown terms are fixed with better help texts, never by renaming the glossary term.
