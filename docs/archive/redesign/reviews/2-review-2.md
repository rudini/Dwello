# Stage 2 – review 2 (follow-up)

Reviewer: independent general-purpose agent, read-only, fresh context; checked the round-1 fixes (`afcda10..e62b6cf`) against the code.

Verdict: 0 Blockers, 1 Major, 7 Minors. Gallery safety confirmed (404 unless `UI_GALLERY=on`, set only in `playwright.config.ts`, behind login).

| # | Severity | Finding | Resolution |
|---|---|---|---|
| 1 | Major | The layout still rendered the old `ToastContainer` on the same store as the gallery's `ToastRegion`: every toast twice, the old one painted over the new one, so axe could not really check the new toasts. | The layout now renders `ToastRegion`; old `Toast.svelte`/`ToastContainer.svelte` deleted (first part of the old system removed). The gallery shows all four toast types through the layout. |
| 2 | Minor | Toasts above open dialogs (same z-index). | Toast region `z-40`, dialogs `z-50`. |
| 3 | Minor | `profile-sum-invalid` did not prove the invalid total. | Waits for the total in the critical style. |
| 4 | Minor | `mobile-menu-open` skipped wherever the button was hidden. | Skips by viewport, explicitly: mobile only until the shell folds below 1024 px in stage 4. |
| 5 | Minor | Statement wizard: axe ran before step 2 was shown. | Waits for a step-2 element first. |
| 6 | Minor | Dialog: Shift+Tab from the panel or Tab from outside escaped; Escape propagated. | Tab is handled completely inside the dialog (cycles through its controls, from anywhere); Escape stops propagation. Test added. |
| 7 | Minor | RadioGroup name via legend with explicit role is browser-dependent. | `aria-labelledby` to the legend. |
| 8 | Minor | Guard false positives (`on:blur`, "rounded" in prose, `#123` in comments). | `blur` rule fixed and self-tested; prose/comment hits are an accepted risk (none today). |
| – | (round 1, M3) | Gallery lacked some states. | Added: disabled select and checkbox, textarea error, expanded icon button, hidden table column, warning and info toasts. |

Observation for stage 4: on a phone, four stacked toasts cover most of the screen; the axe step opens the gallery's dialogs by keyboard because of that. The real app shows one toast at a time in practice; revisit when the shell is built.

Checks after the fixes: unit 761 passed, lint/check/fallow clean, axe 79/79 with 0 violations.
