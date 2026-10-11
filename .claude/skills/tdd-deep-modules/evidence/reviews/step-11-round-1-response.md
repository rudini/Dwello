# Response to step 11 (helper swarm in depth_report), round 1

- [major] public functions reported as a swarm: red/green "helpers used elsewhere" (5abe04e, 9cf2619). A helper that any other production file of the repository names is no member; `qr-bill.service.ts` is no longer flagged.
- [major] DESIGN.md known-limit line backwards: rewritten (name matching as words: strings, types, property names; unread export forms).
- [minor] export lists, function expressions, bare arrows: listed under Known limits.
- [minor] recursion: red/green "recursive exports" (ee053bc, 6faa22d): uses inside the helper's own body are no callers.
- [minor] overloads: red/green "overloads" (94dd4e5, 7cbecc0): signatures are neither callers nor extra helpers, names listed once.
- [minor] size cap: red/green "twenty-line helpers" (d105f5c, 6e87014): 20 lines. The older test with an 11-line body had to grow to 21 lines in the same red (its expectation unchanged).
- [minor] CLI decides: refactor b2ea1d1: `Depth.has_classitis`, the CLI prints it.
- [nit] pin repeats an older test: noted in evidence/mutations/step-11-pins.txt.
- [nit] property names: in Known limits.
