# Workflow rules review: issue #212

Task: the small default KI model (`qwen2.5:3b`) still rejected «Treppenhausreinigung» after #202; fix: explicit rules for small models and a JSON example without answer values.

## Findings

1. **A KI prompt fix cannot be verified with the default model in a cloud session.**
   - Rule: `CLAUDE.md`, Workflow step 7 (done when the scenario passes) and `backend/scripts/llm-eval.ts` (outside CI).
   - What happened: #202 was merged as done with a green scenario and an eval against MiniMax, but the product owner's own model still answered wrongly. The scenario only proves that the prompt carries the change (the KI stand-in decides), and the cloud session cannot pull `qwen2.5:3b`. The gap surfaced only after the merge.
   - Proposed change: for a change to a KI prompt, require an `llm:eval` run with the default model before the task counts as done. When the session cannot run it, list it under "Blocked on me" and keep the issue open until the product owner reports the result.

2. **The pre-implementation domain review paid off for prompt wording.**
   - Rule: `CLAUDE.md`, Workflow step 1 (fach-reviewer before implementing).
   - What happened: my first wording ("part of a predefined Kategorie takes its classification") would have taught the model to treat Liftreparatur or Neubepflanzung as umlagefähig (round 1 M-1, M-2). Round 2 found that «Anschaffung» without an object would have sent purchased fuel to the landlord (V-4). No change needed. Worth noting: the rule should name prompts sent to a KI explicitly as "domain rules", since they are not obviously code, terms or legal texts.

3. **Repeated workflow-review finding: `llm:eval` prerequisites.**
   - Rule: `backend/CLAUDE.md`, "Commands".
   - What happened: same as in `workflow-rules-review-issue-202.md` (finding 2). Not repeated in detail.
