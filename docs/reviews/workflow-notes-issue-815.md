# Workflow notes: issue #815

| Rule | What happened | Proposed change |
| --- | --- | --- |
| `CLAUDE.md`, Workflow 2 («the commit that adds it says so») and skill `slice-review`, "2. The prompt" («do not amend or rebase the reviewed commits») | Review i815b3 C-4 found a pinning backend test whose commit message did not say it pins kept behaviour. The commit was under review, so it could not be amended; the note went into the pull request text instead. | Allow the pull request text to carry that statement for a commit already under review, or say that the note goes into the next commit's message. |
| `tools/fitness/fitness.ts` (`decides`), the check behind Ä4 «Fachregeln entscheidet nur das Backend» | The contract page picks its success toast by `endDate === data.today`; `DATE_CMP` catches only `<`/`>`, so the line is neither an error nor an exception and the measured count misses it. | Let `DATE_CMP` also match `===`/`!==` against a today value, and list such lines as display or exceptions. |
