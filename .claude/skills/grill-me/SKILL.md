---
name: grill-me
description: Interview the product owner about one Dwello issue until every decision it needs is settled, then write the answers into the issue's "Decided (product owner)" section. Use when the user says "grill me", "/grill-me", "interview me about #n" or asks to settle the open questions of an issue before it is implemented.
---

# Grill me

The product owner wants the open questions of one issue settled before work starts (`CLAUDE.md`, "Open work": an issue is ready when its decisions are in its text).

1. Read the issue with the GitHub MCP tools, and the code and docs it names. List each decision the implementation needs and the issue does not settle: values, texts the landlord sees, what happens at the edges (empty, failing, legal limits), what is out of scope.
2. Ask in rounds of at most four questions (`AskUserQuestion`), most consequential first. Each question names the consequence of each option for the landlord and its source (code fact, Fedlex wording, `UBIQUITOUS_LANGUAGE.md`), with your recommendation first. A new question an answer raises goes into the next round.
3. Stop when every decision is answered or the product owner says to stop. Do not ask what the code or the docs already decide.
4. Before writing, check each decided text against every case the code produces for it (each branch of the value it names or labels: empty, missing, outside the period, …). A case the text does not fit is a question of one more round.
5. Write the answers into the issue: "Decided (product owner)" (one bullet per decision, in the product owner's terms), and move anything still open to "Proposed (confirm before starting)", which keeps or adds the label `entscheiden`. Remove the label when nothing is open. Change nothing else in the issue.

Done when the issue is updated and you have named, in one line each, the decisions written and any left open.
