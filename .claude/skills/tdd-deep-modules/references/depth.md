# Depth check: details

Run these checks in every refactor phase, after the tests are green and before `tdd-step refactor`. `scripts/depth_report <path>` gives numbers for the first three; use them as prompts, not as verdicts.

## Interface much simpler than implementation

Count what a caller must know: exported names, parameters, required call order, error types. Compare with the lines behind them. A module whose interface is about as large as its body is shallow: it adds a name to learn without hiding anything. Merge it into its caller or its callee.

## No classitis

Many tiny classes or files, each with one or two methods that call the next, spread one decision over many places. Merge them until one module owns the decision.

## No pass-through wrappers

A function that only forwards its arguments to another function with the same shape adds an interface and hides nothing. Delete it and call the target directly, or give it a real job (defaults, validation, translation of the hidden decision).

## Pull complexity downward

When either the module or each of its callers must handle a case (defaults, retries, normalisation, error recovery), handle it inside the module once. A slightly more complex implementation beats every caller repeating the work.

## Do not split by size alone

A long function that does one thing is fine. Split only when the parts hide separate decisions; splitting a single decision into pieces creates shallow modules that must be read together.

## Cumbersome tests signal a wrong interface

If a test needs many mocks, long setup, knowledge of internals or private methods, the interface is wrong, not the test. Change the interface (in a refactor, with all tests green) until the test reads like a usage example. Never test private methods to work around it.
