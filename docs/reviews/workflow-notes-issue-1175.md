# Workflow notes: issue #1175

| Rule | What happened | Proposed change |
|---|---|---|
| `slice-review`, "Triage": «A persona runs again only when a fix adds a text or screen state it has not seen» | The fix of Marco P-2 put «(optional)», a text Marco had already seen at the Kontoinhaber's street, on the Absender's street too. It was unclear whether a known text in a new place counts as «not seen». No re-run; a scenario pins the label. | Say that a text already seen counts as seen in another field of the same screen, so it needs no re-run. |
