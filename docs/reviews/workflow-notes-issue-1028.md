# Workflow notes: issue #1028

| Rule | What happened | Proposed change |
|---|---|---|
| `CLAUDE.md`, "Open work" (an issue split from another one), and the cleanup of persona reports (b87f03a47, 24.10.2026) | #1028 (opened 01.11.2026, split from #683) cites `docs/design/personas/{helga,weber,marco}-186.md` as its source. These reports had been deleted a week before, because no issue named them then. In the shallow clone they were only found by `git fetch --unshallow` and `git show 393d126ff:…`. | When an issue cites a report, the report must exist in the tree: a split issue cites only reports that are still in the tree, or names the commit where they can be read. |
| Skill `issue-work` ("Working on an issue") | Two of the four «Done means» items (paragraphs, description help) were already done on `main` by #678 and #672, and #678 noted it only as `Refs #1028` in its own issue. Checking every item on `main` first found this. | A pull request that does part of another issue writes it into that issue's thread as well (a comment that names the items done), not only `Refs #n` in its own text. |
