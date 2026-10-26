# Dwello implementation plan

Checklist of the current task (`CLAUDE.md`, Workflow step 8); `open-work.test.ts` allows one `## Session: #840 axe check in four shards (T1)

- [x] Issue #840 from run 40303722784 (axe 2/3 about 14 min, the critical path; E2E shards 5.5–9.1 min)
- [x] `ci.yml`: axe in 4 shards (matrix and count); checked: the Changes script for both events, `--list --shard=n/4` 68/68/68/67 = 271
- [x] Docs: `test-pyramid.md`, T1 measurement in `utility-tree.md`
- [ ] Slice review (`code-reviewer`)
- [ ] PR; No scenario: CI configuration only. After the merge: slowest axe shard and the run on main
