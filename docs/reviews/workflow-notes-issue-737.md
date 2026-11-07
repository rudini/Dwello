# Workflow notes: issue #737

| Rule location | What happened in this task | Proposed change |
|---|---|---|
| `CLAUDE.md`, Conventions, "Commits" (scopes) | No scope fits the distribution key form (`src/routes/config/distribution-keys`): one commit took `statements`, the next `config`. | Name the scope for master data screens (Verteilschlüssel, Heizprofile, Kategorien), e.g. «`config` for everything under Einstellungen». |
| `.claude/hooks` commit-msg-gate | `git commit --amend -m "$(git log -1 --format=%B \| sed …)"` was refused because the gate reads the literal `$(…)` as the subject. The wrong scope stayed. | Say in skill `commit-gates` that the subject has to be written out, or that `git commit --amend -F <file>` works. |
| `CLAUDE.md`, "Done means" with skill `pull-request`, "Never without the product owner" | Persona Helga's P-1 (Major) asks to name the apartment, but #737 decided not to. "Done means" lets the task finish with it under "Blocked on me", while `pull-request` makes the merge wait for the product owner anyway. So every persona Major that needs a decision stops the merge. | Say in one place whether a Major that "needs a product decision" blocks the merge, or only sits under "Blocked on me" once its issue exists. |
