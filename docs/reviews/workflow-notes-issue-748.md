# Workflow notes: issue #748 (Stream files in the tenant export)

| Rule | What happened | Proposed change |
|---|---|---|
| Issue texts of #746 and #748 («Done means: … once the length is felt», «… if exports grow large») | Both «Done means» are conditional; neither says how to tell that the condition holds, and the request named them as work to do now, so both were implemented without measuring. | The issue template `nfr.md` asks for a «Done means» without a condition, or for the measure that starts the work (e.g. «more than N entries in the demo»). |
| `CLAUDE.md`, "Before marking anything complete" (`bun run fitness -- --base origin/main`) and CI «Lint and types» (`--structure`, #1272) | The local run passed; CI ran fitness with `--structure` and refused four files whose fallow maintainability dropped by 0.3 to 5.4 points. It measures the commit, not the working tree, so each try needed a commit; the new code had to move into new files. | Name `--structure` in "Before marking anything complete" (it needs a commit), or let `bun run fitness` run it when `--base` is given. |
