# Stage 5 – review 2 (rental contract wizard) and persona re-runs

Reviewer: independent general-purpose agent, fresh context, read-only; verified round 1 live (`bd2ea7c..9d83882`). Re-runs: Helga (`personas/helga-5b.md`) and Sven (`personas/sven-5b.md`).

Round 1 fixes confirmed: H1, H2, M1–M6, S5, m1, m4, m11; no effect loops; edit form unaffected.

| # | Source | Severity | Finding | Resolution |
|---|---|---|---|---|
| 1 | Review | Major | "1.450", "1,450.00", "1.450,50" still became CHF 1.45 without an error. | Amounts must be francs with up to two decimals after normalising ("1'450" stays allowed); otherwise "Bitte geben Sie einen gültigen Betrag ein, zum Beispiel 1450.00 oder 1'450." (wizard and edit form). Unit test. |
| 2 | Review | Minor (regression) | Replacing the values object on "Weiter" re-ran the start-date suggestion and refilled a cleared field. | Amounts normalised in place. DOM test. |
| 3 | Review | Minor | The overlap error stayed on the start date after the overlap was resolved. | Cleared on any period change. DOM test. |
| 4 | Review, Sven | Major (Sven) | The past-start notice was not read out. | Notice in an always-present `role="status"`; pressing "Weiter" with a past start stops once with the hint as field error (focused, read out): "… Wenn es stimmt, klicken Sie nochmals auf «Weiter»." DOM test + scenario "Vertragsbeginn in der Vergangenheit bestätigen". |
| 5 | Helga | Blocker | A date typed over the native field became year 12026; every step let it through; a mistyped past date went through without a stop. | Dates outside 1900–2099 are rejected ("Bitte prüfen Sie das Datum: Das Jahr ist nicht möglich."); a past start needs a second "Weiter" (see 4). The native field's format (month first in an English browser) remains outside the app (`offene-punkte.md`). DOM tests. |
| 6 | Review | Minor | Overlap text named "Vertragsende" also for unbefristet contracts. | "Ändern Sie den Vertragsbeginn oder wählen Sie «Befristet» mit einem früheren Vertragsende." |
| 7 | Helga, Sven | Major | The save confirmation vanished before it was read. | Shown for 10 s. |
| 8 | Review | Minor | Edit form loads 100 tenants, wizard 1000. | Stage 7 (edit form migration). |
| 9 | Helga, Sven | Major | Contract list: future contract "AKTIV … – heute", "Mietzins" column shows the total; list status badges are live regions that drown the confirmation. | Stage 7 (contract list), in the persona backlog. |
| 10 | Sven | Minor | Focus on the page body when the wizard opens; radio descriptions read twice; error read after help. | Body focus on page load is standard browser behaviour (skip link first); the rest in the stage 9 accessibility pass. |

Checks: unit 900, lint/check/fallow clean, E2E 369 passed incl. axe. Verdict of round 2: stage 5 can be closed once 1 and 2 are fixed – both done.
