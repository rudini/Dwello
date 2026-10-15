# Workflow rules review: issue #202

Task: the KI check of a new Kategorie proposed «nicht umlagefähig» for «Treppenhausreinigung»; fix: the allocability prompt lists the predefined Kategorien.

## Findings

1. **Scenario rule for KI quality bugs costs effort without much proof.**
   - Rule: `CLAUDE.md`, Workflow step 1 (every bug fix a user can see starts with a scenario).
   - What happened: the E2E run replaces the KI with `backend/scripts/llm-stub.ts`. To make the scenario fail for the right reason, the stub had to reproduce the bug: it answers wrongly unless the prompt holds the predefined block. So the scenario proves the wiring (the prompt reaches the KI with the Kategorien), not that a model judges better. The real evidence came from `bun run llm:eval`, which no rule names.
   - Proposed change: for a change to a KI prompt, require a `bun run llm:eval` run before and after (model named, in the plan and PR). Allow `No scenario: KI answer quality` when a lower-layer test shows that the prompt carries the change.

2. **`llm:eval` needs things the docs do not name.**
   - Rule: `backend/CLAUDE.md`, "Commands" (does not list `llm:eval`); `backend/scripts/llm-eval.ts` header.
   - What happened: the default model (`qwen2.5:3b`, Ollama) cannot be pulled in a cloud session (ollama.com and Hugging Face answer 403), so the measurement ran against MiniMax (the only allowed provider). After #202 the eval also needs a migrated `DATABASE_URL`: the first run after the change scored 0/38 because every proposal failed on the unmigrated dev database. I added the note to the script header.
   - Proposed change: list `bun run llm:eval` in `backend/CLAUDE.md` with its needs (`LLM_*` variables, migrated database). Name the fallback for cloud sessions (an allowed OpenAI-compatible provider) and that the result is then not the default model's.

3. **Persona rule for a backend change in what a screen shows is unclear when the screen's data comes from a stand-in.**
   - Rule: `CLAUDE.md`, Workflow step 5 ("what a screen shows changed (also through a backend change)").
   - What happened: the KI proposal shown on «Neue Kategorie» changes with a real model. The persona stack uses the same KI stand-in, so a persona would only see the stub's text. No persona was run; the reason is recorded in the plan.
   - Proposed change: say that a change visible only through an external system the persona stack replaces (KI, mail) needs no persona unless the stand-in's screens or texts change.

4. **The product owner's decision in my own option text closed a later finding cleanly.**
   - Rule: `CLAUDE.md`, Workflow step 6 (reject a finding with a reason).
   - What happened: code-review C-1 (an edited predefined Kategorie still counts) was already part of the option the product owner chose. Rejected with that reason. No change needed. Noted as a good practice: name the consequence in the option text of a decision question.
