# Workflow rules review, 31.10.2026

Collected review at the end of the request «take the next one as soon as one is done» (#860, #718 parts 1 to 3, #936, #934, #935; skill `workflow-review`). It covers the notes written since `workflow-rules-review-2026-10-29.md`; the other issues of this request wrote none.

Covered files: `workflow-notes-issue-718.md`.

## Open proposals

| # | Rule | Came up | What it costs | Proposal |
|---|---|---|---|---|
| 1 | `CLAUDE.md`, «Before marking anything complete» | `issue-718` | A push without `bun run fitness` turned «Architecture fitness» red in CI (a fifth declaration of the language list, Ä1); a second push fixed it. | Add `bun run fitness` to the list, since CI runs it on every pull request. |
| 2 | `tests/e2e/questions/language.ts` (language check) | `issue-718` (as in `workflow-notes-issue-817.md` and `workflow-rules-review-2026-10-29.md`, proposal 2, for the word list) | Two red runs: a random Wiederherstellungscode («6ZUR») and a test e-mail («a11y-konto@…») were taken for German. | Mask what is random by construction (codes, keys, test e-mails), or let a row of `screens.json` name the values it shows that are not UI text. |
| 3 | `docs/design/personas/README.md`, «A fresh installation» | `issue-718` | Five personas that each needed a set-up installation took three restarts of the stack and a script of the session's own that set up the account and confirmed the code. | Give `persona-stack.sh --fresh` an option for an installation with a confirmed Sicherung, and say how to run more than two such personas. |
| 4 | `backend/CLAUDE.md`, «Today» | `issue-718` | A test compared the UTC day of a timestamp with the Swiss day a PDF prints and failed only after midnight in Zurich, once in CI. | Add: a test that compares a date shown to the landlord formats it as the Swiss day (`Europe/Zurich`), never with `toISOString().slice(0, 10)`. |
| 5 | `CLAUDE.md`, Workflow 5 and 7 (personas, rounds) | `issue-718` | One sentence answering a persona's Major needed a further fach-reviewer round and a persona re-run, about an hour, after four fach rounds and nine persona runs. | – (cost noted; a text a persona finds unclear after the fach-reviewer approved it may need both roles in one round). |
| 6 | `~/.claude/stop-hook-git-check.sh` against `CLAUDE.md`, Workflow 9 | `issue-718` (as in `workflow-rules-review-2026-10-28.md`, proposal 1); about fifteen times in #718 | as before | as before; the product owner's setting outside the repository. |
