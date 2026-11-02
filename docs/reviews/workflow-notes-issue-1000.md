# Workflow notes: issue 1000

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, Workflow 1 (a change to PDFs or domain terms: the `@wip` scenario goes to `fach-reviewer` before implementing) against an issue that says «scenario none» and prescribes texts a domain review already wrote | The issue changes the text of a PDF (the Mahnung), so step 1 applies, but there is no scenario to review, and the texts are the domain review's own (959-fachreview-1, M-1, de/fr/it/en). The session ran no step-1 `fach-reviewer` round and pinned the texts word for word in a unit test; the code review compared them with the table. | Step 1: «A change whose texts a `fach-reviewer` report already gives word for word, in all four languages, needs no review of its own before implementing; the test pins them.» |
