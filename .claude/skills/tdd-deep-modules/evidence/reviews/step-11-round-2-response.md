# Response to step 11 (helper swarm in depth_report), round 2

- [major] object return type taken as the body: red/green "object return types" (ad1c605, 801fea3). `_skip_return_type` skips a `: Type` annotation (object types, generics, arrays, unions) before the body brace; long object-returning helpers are no longer small, recursive object-returning helpers no longer count their own call.
- [minor] comments in other files: red/green "comments elsewhere" (a91f061, 7a4a3df); other production files are read without comments.
- [minor] exports without any production caller: kept out on purpose (a new module's public functions look the same); in Known limits.
- [minor] unrelated same-name function elsewhere: in Known limits.
- [minor] wrong hashes in the round-1 response: corrected (d105f5c, b2ea1d1).
- [minor] TESTLIST step 11 intro: now names the "no other production file" condition.
- [nit] twenty-line test: pinned with a 20-line body (47f4038; cap 19 fails it).
- [nit] bracketed `const` expression read as an arrow helper: in Known limits.
