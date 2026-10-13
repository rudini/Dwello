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
- **Kind of change:** new statements, texts or anything with legal weight: Dr. Weber; keyboard, focus or what a screen reader announces: Sven; finding the way in, first use or a return after months: Anna; forms and terms for beginners: Helga.

Unknown terms are fixed with better help texts, never by renaming the glossary term.
