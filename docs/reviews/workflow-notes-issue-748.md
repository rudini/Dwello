# Workflow notes: issue #748 (Stream files in the tenant export)

| Rule | What happened | Proposed change |
|---|---|---|
| Issue texts of #746 and #748 («Done means: … once the length is felt», «… if exports grow large») | Both «Done means» are conditional; neither says how to tell that the condition holds, and the request named them as work to do now, so both were implemented without measuring. | The issue template `nfr.md` asks for a «Done means» without a condition, or for the measure that starts the work (e.g. «more than N entries in the demo»). |
