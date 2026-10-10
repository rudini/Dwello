# Stage 3 – review 1 (design and code)

Reviewer: independent general-purpose agent, read-only, fresh context. Input: brief (Visual: icons, illustrations, forbidden patterns), plan D7/D8/section 8, glossary, diff `4d38797..9886b28`, test/axe/CI results, ui-screenshots of 9886b28 (sampled dashboard, apartments, buildings_id, statements_id, invoices_new, gallery: icons in the right places, no truncation/overlap/broken layout).

Verdict: 0 Blockers, 2 Majors, 8 Minors. One Lucide set, stroke 1.75, Material Symbols font gone; illustrations in one line style, token colours only, decorative by default; no forbidden patterns. `lucide` data package judged the better choice; `hydrate.ts` change sound.

| # | Severity | Finding | Resolution |
|---|---|---|---|
| M1 | Major | `meeting_room` (room count) mapped to the open door that also means "Leer" (vacant). | Maps to `rooms` (grid). A table test now pins the meaning of the high-traffic names. |
| M2 | Major | `Receipt` draws a dollar sign – wrong for a CHF app. | `invoice` now draws `ReceiptText` (no currency); test checks the dollar path is gone. |
| 1 | Minor | Silent `info` fallback; source scan missed names like `submitIcon: 'add'`. | Scan widened to `…Icon: '…'`; fallback kept (typed prop would break ~70 legacy callers that pass strings), the scan is the guard. |
| 2 | Minor | Dead `aria-hidden` prop in the adapter. | Removed. |
| 3 | Minor | "Leer" drawn as House on the building page, DoorOpen on the dashboard. | Stage 7 icon pass (screens are rebuilt with the new icon names). |
| 4 | Minor | `add_business` loses the "add" cue. | Accepted: the text label carries it; stage 7 icon pass. |
| 5 | Minor | Gallery illustrations announced twice (title + caption). | Gallery illustrations decorative; one titled example kept for axe. |
| 6 | Minor | Envelope stamp crossed by the flap line. | Stamp moved to the lower right. |
| 7 | Minor | Accent details weak at 160×120. | Accent strokes 3 px. |
| 8 | Minor | `$props.id()` needs Svelte ≥ 5.20, floor was `^5.2.11`. | Floor raised to `^5.57.1` (installed version). |

Open by plan, not by this stage: illustrations are only in the gallery so far; screens adopt them in stages 4–7 (plan section 8). Legacy icon sizes (14/18/22/40 px) are aligned to 16/20/24 when the screens are migrated.

Checks after the fixes: unit 803, lint/check/fallow clean, axe 79/79 with 0 violations.
