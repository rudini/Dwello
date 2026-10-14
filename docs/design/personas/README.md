# Personas

The users Dwello is built for (`CLAUDE.md`, "Design-Regeln"): private landlords with little experience who use Dwello a few times a year. The five personas below stand for them in usability reviews. They were defined in the redesign brief (`docs/archive/redesign/REDESIGN_BRIEF.md`) and are run by the subagent `persona` (`.claude/agents/persona.md`); how a run works: `docs/design/arbeitsregeln.md`, "Persona runs: how".

Personas are AI agents that operate the running app with the demo data, not real test users. Their reports are in this folder as `<persona>-<round>.md`.

| Persona | Who | Default task | Viewport and input |
|---|---|---|---|
| Helga, 68 | Inherited an apartment; little computer experience, needs large text, unsure about domain terms. | Create the first tenant and a rental contract. | Desktop 1440 × 900 at 150 % zoom (also 200 %), mouse. |
| Marco, 38 | Employed, mostly on his smartphone, little time. | Create the Nebenkostenabrechnung for the previous year. | Mobile 390 × 844, touch. |
| Dr. Weber, 52 | Legally cautious, reads everything, questions plausibility and recalculates. | Check the statements, understand the warnings, assess the PDF. | Desktop 1440 × 900, mouse. |
| Sven, 45 | Blind; screen reader and keyboard only. | Go through the rental contract wizard by keyboard; check focus, labels and error messages. | Desktop 1440 × 900, keyboard only, judged by the accessibility tree. |
| Anna, 29 | First-time landlord, returns after months without remembering anything. | Find out what to do next. | Desktop 1440 × 900, some screens on mobile 390 × 844. |

The caller of a run gives each persona a task on the change under review instead of its default task; the profile stays the same.

## Which personas

A persona is affected by a change (`CLAUDE.md`, Workflow 5) when one of these holds; when unsure, run all five:

- **Screen:** the persona's default task uses the changed screen.
- **Device:** every changed view is also checked on a phone: Marco.
- **Kind of change:** new claims, texts or anything with legal weight: Dr. Weber; keyboard, focus or what a screen reader announces: Sven; finding the way in, first use or a return after months: Anna; forms and terms for beginners: Helga.

Unknown terms are fixed with better help texts, never by renaming the glossary term.

## Demo records for a task

`persona-stack.sh` loads the demo data (`backend/demo/demo-data.sql`, statements from `backend/src/db/demo-data.ts`) with fixed IDs. Before naming a record in a persona's task, look it up here, so the task names the tenant who really holds that contract. Personas that save at the same time each get their own building (`CLAUDE.md`, Workflow 5); with three buildings, at most three personas save at once, the others only look.

| Building (ID) | Apartment | Tenant | Contract ID | State |
|---|---|---|---|---|
| Musterhaus Zentrum (`11111111-1111-1111-1111-111111111111`) | 1.01 | Hans Müller | `b0000001-0001-0001-0001-000000000001` | open-ended since 01.03.2021; statement 2025 sent |
| | 1.01 | Kevin Fischer | `b0000001-0001-0001-0001-000000000099` | terminated, ended 28.02.2021 |
| | 1.02 | Anna Schmidt | `b0000001-0001-0001-0001-000000000002` | open-ended since 01.06.2022; statement 2025 draft |
| | 2.01 | Pierre Dubois (fr) | `b0000001-0001-0001-0001-000000000003` | open-ended since 01.01.2023; statement 2025 draft |
| | 3.01 | Maria Rossi (it) | `b0000001-0001-0001-0001-000000000005` | open-ended since 01.09.2020; statement 2025 draft |
| | 2.02, 3.02 | – | – | vacant |
| Seepark Residenz (`22222222-2222-2222-2222-222222222222`) | A1 | Thomas Weber | `b0000002-0002-0002-0002-000000000001` | open-ended since 01.04.2022; statement 2025 draft |
| | A2 | Sarah Meier | `b0000002-0002-0002-0002-000000000002` | terminated, ended 30.06.2025; statement 2025 draft |
| | A2 | Nina Brunner | `b0000002-0002-0002-0002-000000000003` | open-ended since 01.07.2025; statement 2025 draft |
| | B2 | Marco Bernasconi (it) | `b0000002-0002-0002-0002-000000000004` | open-ended since 01.07.2023; statement 2025 draft |
| | B1 | – | – | vacant |
| Alpenblick (`33333333-3333-3333-3333-333333333333`) | EG | Laura Keller | `b0000003-0003-0003-0003-000000000001` | open-ended since 01.11.2022; no statement 2025 (invoices missing on purpose) |
| | OG1 | Kevin Fischer | `b0000003-0003-0003-0003-000000000002` | open-ended since 01.05.2021; no statement 2025 |
| | OG2 | – | – | vacant |

Every contract that ran in 2024 has a paid statement 2024. There is no fixed-term contract and none that starts in the future: a task that needs one has the persona create it in its own building.
