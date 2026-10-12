# Response to step 11 (helper swarm in depth_report), round 3

Round 4 granted by the user after three failed rounds.

- [major] Svelte and Vue callers invisible: red/green "svelte callers" (30fc807 and its green): the "other production code" check reads every production code file (`protocol.is_production`, so `.svelte` and `.vue` too). DESIGN.md names the file kinds.
- [minor] rare return-type forms (type predicate, function type returning an object type, conditional type with object branches): in DESIGN.md Known limits.
- [nit] pin commit 47f4038 also carried DESIGN.md wording: acknowledged; later docs are in docs commits.
- [nit] TESTLIST "over 10 lines": annotated "(20 since review round 1)".
