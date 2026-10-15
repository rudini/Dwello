# Workflow rules review: issue #147

Task: the new-contract page showed empty tenant and apartment choices when their load failed; it now shows the error page with «Die Mieter und Wohnungen konnten nicht geladen werden.».

## Findings

1. **An issue can name a gap that an earlier change already removed.**
   - Rule: `CLAUDE.md`, "Coding guidelines" (follow the code, not the wording, when the issue's text is wrong in a detail) and "Open work" (an issue's "Done means" is the finish line).
   - What happened: #147 asks for a load error on the edit page and a test in `contract-edit-load.test.ts` with failing tenants and apartments. Since #152 that page loads neither, so there is nothing to fail and no such test can be written; the gap lives only on the new-contract page, which the issue names as "check whether". Whether a "Done means" bullet that has become void is "a detail that does not change the task" was a judgement call.
   - Proposed change: when a change makes an open issue's text obsolete (#152 here), the change updates or comments on that issue in the same task, as it already does for code markers (`grep -rn "#n"`). Alternatively, say in "Coding guidelines" that a "Done means" bullet a merged change made void is followed by the code and named in the pull request.

2. **Repository agents are not available as subagent types when the repository is attached mid-session.**
   - Rule: `CLAUDE.md`, Workflow 4 (run subagent `code-reviewer`) and the skill `slice-review`.
   - What happened: the session started without the repository; after `add_repo` the agents in `.claude/agents` were not offered as subagent types, so `code-reviewer` ran as a general-purpose agent told to follow `.claude/agents/code-reviewer.md`. It worked, but nothing in the rules says this fallback is acceptable.
   - Proposed change: add to `slice-review` one line: when the agent type is missing, start a general-purpose agent whose prompt first reads the agent's file and follows it.
