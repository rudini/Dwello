# Workflow rules review: issue #126 (failed reminder e-mails show the raw SMTP error)

Rules that guided the task, with what happened and a proposed change. Review only: nothing here is applied.

## R-1 An issue's wording can name a place the app does not have

- **Rule:** `CLAUDE.md` "Open work" (an issue's decisions are its text) and "Design-Regeln" (errors say what to do).
- **What happened:** #126 asks the message to say «check … the mail settings». Users have no e-mail settings in Dwello; mail is set up by the operator through environment variables. Following the wording would send a beginner looking for a screen that does not exist. The message leaves it out, and the plan says why; no rule says whether such a deviation needs the product owner first.
- **Proposal:** "Coding guidelines, Before coding" says that a text the issue prescribes and that names a missing place is shortened and the deviation noted in the pull request, without asking first.

## R-2 Persona runs for states only a failing outside service reaches

- **Rule:** `CLAUDE.md` Workflow 5 ("For a state reached only by a failure … name the request to fail; the persona simulates it").
- **What happened:** the state needs the mail server to refuse a recipient; no browser request can fail for it. The persona was told to write the stored error into `dwello_persona` with SQL, which the rule does not cover (it names failing requests at the browser boundary).
- **Proposal:** Workflow 5 adds that a state caused by an outside service is reached by writing its stored result into `dwello_persona`, with the SQL named in the task.

## R-3 A DOM test pinned the bug

- **Rule:** `CLAUDE.md` Workflow 2 (a test fails before the code changes).
- **What happened:** `statement-pages.dom.test.ts` asserted that the reminder feedback shows the raw server text («Mailserver nicht erreichbar.»), so the fix turned it red; it was rewritten to expect the message. The same happened on #125 (`statement-list-load.test.ts` pinned the JSON). Such tests read as "behaviour" but pin a known defect.
- **Proposal:** none for the rules; the issue template's "Where" could list tests that pin the current behaviour, so they are named before the change.
