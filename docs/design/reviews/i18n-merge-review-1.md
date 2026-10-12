# i18n merge of main (commit 603e30b), review 1

Scope: merge of `origin/main` (contract end on a chosen day, past-end confirmation, billed-days refusal, missing payment deadline, dynamic date example) into the i18n branch of PR #48.

Checked without findings: all nine conflicts keep main's behaviour and the branch's i18n; the 28 new or changed German messages match main's texts character for character, sentence joins included; the four message files have the same 1238 keys; nothing from main lost; no message at module level in server code; tests and docs consistent.

| # | Severity | Finding | Verified | Handling |
|---|----------|---------|----------|----------|
| a | minor | it `contracts_end_confirm_help` «risulta non affittato» while the term table gives «locato». | Yes. | Fixed: «risulta non locato». |
| b | minor | fr/it `contracts_end_before_start_on` read awkwardly («… le début du contrat le {date}»). | Yes. | Fixed with a comma: «…, le {date}» / «…, il {date}». |
| c | minor | In `offene-punkte.md` the i18n section stood before main's Session 12 section, and the merge note under it. | Yes. | Fixed: the i18n section is last, with the merge note. |

No blocker or major open.
