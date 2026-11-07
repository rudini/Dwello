# Workflow notes: issue #1166

| Rule | What happened | Proposed change |
|---|---|---|
| Skill `grill-me`, step 1 («List each decision the implementation needs») | The grill settled the new term «Kontoinhaber» but not the existing glossary rows it contradicts («Zahlungsempfänger», «Firmenadresse», «IBAN») nor the missing «Absender». The step-1 `fach-reviewer` raised them as a Major needing a product decision (Fachreview 1166-1 V-2), which cost one more round with the product owner mid-task. | Add to step 1: for a new or changed term, list the `UBIQUITOUS_LANGUAGE.md` rows that mention the same thing and ask whether they change too. |
| `CLAUDE.md`, Workflow 2 («Every bug fix also gets a test that reproduces it first») | Code review 1166-1 C-1 was a race in an axe look (a test fixture), not in the app. Reproducing it red needs a parallel scenario at the right moment; the fix was checked by reasoning in the closing round instead. | Say whether a fix in `tests/e2e/` itself (a race of a look or fixture) needs a red run, or that the closing round's check replaces it. |
