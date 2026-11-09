## Session: 2026-11-09 follow-up of #1274 (fallback review of PR #1386)

Worker of the request «work through the open issues of rudini/Dwello». No scenario: CI tooling, nothing a user sees.

- [x] `pr-comments.yml`: the «look the same» list from a fork's artifact is capped and the shortening loop stops at 0 shots; each shot's name and title is capped at 200 characters; @mentions in both bot comments are neutralised; pins in `tools/ci/pr-comments.test.ts` seen red
- [x] code-reviewer `docs/reviews/1274b-review-1.md`: no Blocker/Major; C-1 Minor (one long title could still fill the comment) fixed
- [x] code-reviewer `docs/reviews/1274b-review-2.md` (closing round on that fix): C-1 closed; C-2 Minor (neutralised @ adds characters after the length check, only a crafted fork title fails its own comment) stays in the report
- [x] Workflow note: with auto-merge on, a pull request merges as soon as the status «Outside review» arrives, which comes with the review itself, so the review is answered only after the merge (PR #1386, merged 10 s after its fallback review); the skill `pull-request` asks to answer it first
- [x] Archive the session; PR pushed after this archive
