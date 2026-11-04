# Workflow notes: issue #1093

| Rule | What happened | Proposed change |
|---|---|---|
| `tests/e2e/CLAUDE.md`, "Run"; `src/lib/ui/Button.svelte:33` (#424) | The Dokument links dropped `download` (it saved the redirected error page as a file). The reason it was kept, WebKit showing an image despite `content-disposition: attachment`, can only be checked in WebKit, which this container lacks; a pull request runs Chromium only, so the check waits for a hand-run of ci.yml on the branch. | Name in `tests/e2e/CLAUDE.md` when a pull request needs the all-browser run before merging (a change whose reason is a browser other than Chromium), and that it is started by `workflow_dispatch` on the branch. |
