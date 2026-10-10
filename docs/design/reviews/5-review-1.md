# Stage 5 – review 1 (rental contract wizard) and personas

Reviewer: independent general-purpose agent, read-only, fresh context. Input: brief, plan D15/D15a/D16/D18/D19, glossary, diff `edf1dc4..bd2ea7c`, test/axe/CI results, wizard screenshots (desktop, mobile), live app with demo data. It confirmed findings 1–4 and 6 live. Personas: all five on the persona stack (`docs/design/personas/*-5.md`).

Code review verdict: 0 Blockers, 6 Majors, 13 Minors. Both bug fixes of the stage (Akonto/Zusatzmiete labels, availability field mapping) judged legitimate UI fixes, not logic changes.

## Findings for this stage and what was done

| # | Source | Severity | Finding | Resolution |
|---|---|---|---|---|
| H1 | Helga | Blocker | "1'450" (Swiss thousands separator) was read as CHF 1.00 without an error. | `normalizeAmounts` turns `'`, `’`, spaces and a decimal comma into the plain form before every step check; "Monatlich total" reads the same way while typing. Unit + DOM test. |
| H2/S2 | Helga, Sven | Major | Mistyped date (month first in the test browser) became a past date without a warning. | Plausibility notice "Der Vertragsbeginn … liegt in der Vergangenheit. Stimmt das Datum?" (non-blocking: recording old contracts is allowed). The date in words stays. The browser's date format itself is outside the app (`offene-punkte.md`). |
| M1 | Review | Major | Backend error shown in English with an id. | Overlap refusal mapped to German text with what to do; other errors to a German generic message. Test uses the real backend message. |
| M1b | Review | Major (part of M1) | The overlap warning in step 3 did not stop the user. | "Weiter" in step 3 is blocked while the period overlaps (the backend refuses it anyway, so D16 allows blocking). DOM test. |
| M2 | Review | Major | A draft was written without any user input (values from the address), and the restore rewrote the date. | A draft starts with the first input or change in the form; restoring does not rewrite it. "begonnen" → "zuletzt … bearbeitet". DOM test; axe state `draft-restored` now makes a real choice. |
| M3 | Review | Major | "Mieter erfasst" named whoever was chosen, not the created tenant. | Name taken from the tenant in the address, shown only while that tenant is chosen. DOM test. |
| M4/S1 | Review, Sven | Major | A failed "Weiter" was silent for screen readers; focus stayed on the button; the error stayed after a valid choice. | Focus moves to the first field with an error (its error is in `aria-describedby`); a field's error goes away when it is changed. DOM test. |
| M5 | Review | Major | Review rows jumped around on phones. | Grid: label above value with "Ändern" beside it on phones, one line from `sm` (named grid columns in the Tailwind theme). |
| M6 | Review | Major | ISO date "(verfügbar ab 2026-12-01)" in the apartment choice. | Swiss date (`1.12.2026`); tests updated. |
| S5 | Sven | Minor | Step position not announced on a step change. | The focused step heading starts with "Schritt n von 5:" for screen readers. |
| m1 | Review | Minor | Blocked browser storage froze the wizard and the logout. | `browserStorage()` resolves the storage inside a try; used by the wizard and the header. Unit test. |
| m2/m3 | Review | Minor | Late response could show a wrong overlap warning; second request per apartment. | Contracts of all apartments are loaded once; availability and overlap both derive from that one table. A failed request still counts as "no contracts" (`offene-punkte.md`). |
| m4 | Review | Minor | Focus lost after "Entwurf verwerfen". | Focus moves to the step heading. DOM test. |
| m6 | Review | Minor | Suggested start date refilled a cleared field. | Suggestion applied only when the apartment or its availability changes. |
| m9 | Review | Minor | Copy ("begonnen", ungrammatical dropped notice). | Fixed. |
| m10 | Review | Minor | Unbefristet/Befristet texts and "Heizung, Wasser usw." without glossary basis; third Akonto spelling "Nebenkosten (Aconto)". | TODO(fachlich prüfen) + `offene-punkte.md`; apartment cost card now says "Akonto" (test). "Entwurf" (wizard draft vs. Abrechnung status) listed in `offene-punkte.md`. |
| m11 | Review | Minor | Tenant list limited to 50, so a newly created tenant could be missing. | Loader asks for up to 1000 tenants and apartments. Loader test. |
| m13 | Review | Minor | The inline-tenant scenario did not prove the draft survives the detour. | Scenario chooses an apartment first and checks it is still chosen afterwards. |

## Deliberately not changed now

- Review m5 (date-in-words live region inside `{#if}`): the words are also in the summary; kept, low impact.
- Review m7 ("Weiter" before hydration reloads without the choice): hydration E2E scenario passes with the early choice; progressive enhancement of a client-side wizard is out of scope.
- Review m8 ("Ändern" from the review needs Weiter through all steps): later stages may add "Zurück zur Prüfung"; listed in `offene-punkte.md`.
- Review m9 "Kein Akonto" notice before the field is touched: kept on purpose, it explains the field.
- Review m12 / Helga: the tenant form of the detour is still in the old design – stage 7.
- Sven: confirmation toast during navigation may not be heard – the toast region is part of the layout and survives the navigation (`role="status"`); recheck with the stage 9 personas.

## Persona results (stage 5)

- Helga (contract incl. tenant from within the wizard): completed, but only after spotting two silent errors (H1, H2) – both fixed above.
- Sven (keyboard, screen reader): completed; focus after every step change works, summary reads well; silent failed "Weiter" (fixed).
- Anna (what to do next): partly – the overview names the missing 2025 statements, but the wizard then creates statements with CHF 0.00 without warning (stage 6).
- Marco (statements on the phone): partly – same CHF 0.00 problem, tables too wide on 390 px (stage 6/7).
- Dr. Weber (check a draft): partly – amounts trace by hand only, empty Verteilschlüssel column, partial-year invoices without warning, English category names, PDF content (stage 6/7, backend items in `offene-punkte.md`).

Their findings for later stages are in the persona backlog in `progress.md`.
