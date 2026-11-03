# Workflow notes: issue #734

| Rule | What happened in this task | Proposed change |
|---|---|---|
| `docs/design/personas/README.md`, «Who saves» («Name records only from `demo-records.md`») | As in `workflow-notes-issue-679.md`: the file is still missing. This time I listed the demo statements per building from `dwello_persona` with SQL to give Helga and Marco a building each. | As there; the point has now come up twice. |
| `CLAUDE.md`, "Design-Regeln", Process (a page a `+server.ts` route answers counts as a screen) | The refusal page moved from the `+server.ts` answers into one app page (`/documents/refused`) that the three existing screen rows reach by redirect. A variant only a global setting reaches (the IBAN refusal with «Zu den Einstellungen») got its own row with the page's address and query instead of the setting (code review 734 C-2). | Say that a screen row may open a page by an address with the query that shows a variant, when reaching it through its cause would change a global record. |
