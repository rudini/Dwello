# Design it twice: details

A module is deep when a small interface hides a lot of behaviour. You only find the deep interface by comparing it with another one. Do this before the first test, because the tests freeze the interface.

## 1. Name the hidden decision

Ask: "What will callers never have to know?" Pick the one decision the module exists to hide: a file format, a protocol, a retry policy, how money is rounded, which runner executes the tests. Write it down in one sentence. If you cannot name it, the module may not need to exist; fold the behaviour into its caller or its callee.

## 2. Sketch two interfaces

Write two genuinely different interfaces (signatures and one call site each), not two spellings of the same one. Useful contrasts:

- one general call versus several special-purpose calls;
- the caller passes data versus the module fetches it;
- returns a value versus raises or returns a result object;
- stateful object versus pure function.

## 3. Compare by depth

For each sketch, answer:

| Question | Prefer |
|---|---|
| How many things must a caller know (names, parameters, call order, error types)? | fewer |
| Does the hidden decision leak into any signature? | no |
| How much behaviour sits behind the interface? | more |
| What does the common call site look like? | one line |
| Would a test of the first behaviour be short and talk only about outcomes? | yes |

## 4. Choose with one sentence

Record: "Chosen: <design>, because <one reason about depth>." Example: "Chosen: `run(root) -> Run`, because callers never learn which runner ran or how its report is parsed." Put the hidden decision, both sketches and this sentence into the design note (section 6 of SKILL.md).
