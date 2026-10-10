# Stage 4 – review 1 (shell, navigation, overview) and personas

Reviewer: independent general-purpose agent, read-only, fresh context. Input: brief (shell, navigation, dashboard with next tasks and deadlines), plan, glossary, diff of 955733a, test/axe/CI results, ui-screenshots of 955733a. Personas: Anna and Helga on the persona stack (demo data, 10.10.2026), reports in `docs/design/personas/anna-4.md` and `helga-4.md`.

Verdict of the code review: 0 Blockers, 3 Majors, 9 Minors. Anna found 1 Blocker for this stage; her other findings and all of Helga's concern later stages (see "Persona backlog" in `progress.md`).

| # | Severity | Finding | Resolution |
|---|---|---|---|
| A1 | Blocker (Anna) | The overview says "keine Fristen" although the last Abrechnungsperiode ended without any Nebenkostenabrechnung. | New task "Nebenkostenabrechnungen erstellen" (`overview.ts`, loader reads the setting `accounting_period` and the statements of the last ended period). Shown only when apartments are rented. TODO(fachlich prüfen) in `offene-punkte.md`. |
| M1 | Major | The error page told users to check the address on a server error as well. | Hint depends on the status (404 vs. others); `error-page.test.ts`. |
| M2 | Major | User-menu button was 40 px wide on phones and named only by the user's name. | `min-w-12`, `sr-only` "Benutzermenü"; DOM test. |
| M3 | Major | "Davon überfällig" read as a share of the tile above, but it is a sum of amounts. | Renamed to "Überfällige Beträge"; scenario example updated. |
| 1 | Minor | "Überfällige Abrechnungen mahnen" asks for a Mahnung before checking the payment. | Title "Überfällige Abrechnungen prüfen", text names both steps; TODO(fachlich prüfen) on the Mahnfrist. |
| 2 | Minor | Mix of UTC and local dates. | Checked: "today" is the local date (`sv-SE`); `lastCompletedPeriod` reads the local month and only formats with UTC. No change. |
| 3 | Minor | A list that fails at network level broke the whole overview. | `list()` and the period lookup catch network errors; loader test. |
| 4 | Minor | Sidebar 64 px taller than the viewport on short screens. | `max-h-below-header` from the new token `--size-header`. |
| 5 | Minor | User menu stayed open when the focus left it with Tab. | Closes on `focusout`; DOM test. |
| 6 | Minor | Login text named Microsoft even when only Google is set up. | Generic "mit Ihrem bestehenden Konto". |
| 7 | Minor | Building link in the occupancy list and footer links below 48 px high. | `inline-flex min-h-12`. |
| 8 | Minor | Unused E2E helpers for the removed header action. | Deleted (step, task, interaction). |
| 9 | Minor | Quick-action cards of uneven height; panel "Wohnungen" also shows the number of buildings. | `h-full`; panel title "Gebäude und Wohnungen". |

Deliberately not changed in this stage: the persona findings on forms, the rental contract and statement screens (date format, save confirmations, Akonto explanation, clickable rows, English category names, help-page names, typos). They belong to stages 5–7 and are listed in `progress.md`.

Personas: Helga completed her task (yes), Anna partly; the Blocker that kept Anna from "yes" is fixed above. Anna's run is repeated with the stage 5 personas, where all five personas run.
