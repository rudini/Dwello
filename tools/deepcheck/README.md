# deepcheck

Finds shallow modules in this TypeScript codebase (internal tool, never published). Brief and status log: `docs/DEEP-MODULE_BRIEF.md`.

- **Deep module:** a small, simple interface hiding a lot of implementation.
- **Shallow module:** an interface that is large relative to the functionality behind it.
- Basis: John Ousterhout, *A Philosophy of Software Design*, ch. 4 ("Modules Should Be Deep"); information hiding per Parnas (1972).

deepcheck is a warning system built on measurable proxies. It is **not a verdict on design quality**. A high score says "look at this module", not "this module is bad". When a finding is right, fix the design; never pad the implementation to game the ratio.

## Usage

Requires Node >= 22.18 (runs the TypeScript sources directly through Node's type stripping).

```bash
npm run deepcheck:scan                         # all flagged (shallow) modules, ranked (never fails)
node tools/deepcheck/src/cli.ts scan src/lib   # limit to a directory
node tools/deepcheck/src/cli.ts scan --min-score 40 --top 20 --group-by directory
node tools/deepcheck/src/cli.ts scan --format json --output deepcheck.json
node tools/deepcheck/src/cli.ts --explain src/lib/api.ts    # every metric and why the score is what it is
node tools/deepcheck/src/cli.ts suppressions                 # all inline suppressions, invalid ones marked
```

The path argument may be relative, `./`-prefixed or absolute; a path that matches no source file is an error (exit 2).

With the calibrated `failThreshold` of 65 no module of this repo is flagged (the highest scores 60); the threshold is set to catch pass-through layers and thin facades, not to rank. Use `--min-score` to see the ranking, e.g. `--min-score 35` for the modules worth a look (`docs/deepcheck-validation.md`).

Options: `--format human|json|markdown|github`, `--output <file>`, `--top <n>` (default 50), `--min-score <n>` (default: list flagged modules, i.e. score >= `failThreshold`), `--group-by directory|package`, `--fail-on-score <n>` (scan exits 1 if an eligible module in the path scores at least n), `--fallow auto|off|<path>`.

Exit codes: 0 ok, 1 gate failed (or `--fail-on-score` reached), 2 tool or config error. With `--format json` an error prints `{ "error": true, "message": "...", "exitCode": 2 }` on stdout.

The JSON report follows `schema/report.schema.json`; the TypeScript types are in `src/types.ts`. The `github` format prints workflow annotations and appends a markdown summary to `$GITHUB_STEP_SUMMARY`.

For SvelteKit, run `svelte-kit sync` first: the root tsconfig extends `.svelte-kit/tsconfig.json`, which defines `$lib`. Without it deepcheck warns and fan-in/fan-out are too low.

## Gate on changed code

```bash
npm run deepcheck:audit                         # changed vs HEAD (working tree, staged, untracked), agent mode
npm run deepcheck:ci -- origin/main             # changed since the merge-base with the PR base, GitHub annotations
npm run deepcheck:baseline                      # (re)write .deepcheck-baseline.json from the current state
node tools/deepcheck/src/cli.ts check --format json
node tools/deepcheck/src/cli.ts --scope changed # same as check; --scope all is the same as scan
node tools/deepcheck/src/cli.ts scan --use-baseline   # hide baselined modules that did not worsen
```

`check` builds the whole-project analysis and import graph, then judges only changed modules (`--changed-since <ref>`: everything changed since `git merge-base <ref> HEAD`, including uncommitted work; without it: working tree and staged changes against HEAD plus untracked files). It compares the working-tree content, through a throwaway copy of the index with everything added, so renames are followed even after a plain `mv` (`git diff -M`). A file staged in one version and edited again in the working tree is judged by its working-tree version. Run from a subdirectory, `check` works on the nearest enclosing project (a directory with `deepcheck.config.json`, `.deepcheck-baseline.json` or `package.json`, else the repository top level). These are the only rules that fail a run:

- **G1 new shallow module:** a changed module that is not in the baseline and is flagged (eligible, score >= `failThreshold`). This also covers an existing module that crosses the threshold for the first time, reported as "now shallow, not in the baseline" (no tolerance applies: it was below the threshold when the baseline was written).
- **G2 regression:** a changed module in the baseline (looked up under its old path after a rename) that is flagged and whose score rose by more than `tolerance`.
- **G3 legacy:** unchanged modules, and baselined modules that did not worsen beyond `tolerance`, never fail `check`; they only show up in `scan`.
- **G4 suppressions:** an invalid inline suppression (no reason, unknown or missing rule) in a changed file fails.
- **G5 errors:** tool, git, config and baseline errors exit 2, never 1 (JSON envelope with `--format json`).
- **G6 Fallow independence:** the gate gives the same result with `--fallow off`; Fallow data only changes score inputs (complexity, unused exports), never adds a failure of its own.

`--agent` (used by `deepcheck:audit`): prints nothing when the changed modules pass; otherwise at most the top 3 failures, highest score first, each with its fix. The `github` format prints `::error` annotations (G4 on the comment's line) and writes a markdown summary to `$GITHUB_STEP_SUMMARY`.

### Baseline

`.deepcheck-baseline.json` is committed. `check` reads it, and `deepcheck.config.json`, as they were at the base (`HEAD`, or the merge-base with `--changed-since`), never from the working tree, so a change cannot regenerate the baseline or add excludes, overrides or weights to get past its own gate; both take effect once merged, and `check` warns when the config differs. Use `// deepcheck-ignore-file -- reason` for a deliberate exception: it is visible in the review. The gate also uses the baseline's `failThreshold`: after changing `failThreshold`, regenerate the baseline in the same change; until it is merged `check` keeps the old threshold and warns. The baseline records whether Fallow data fed its scores (`fallow`); `check` warns when it runs with a different Fallow mode. It holds one entry per flagged module: a stable fingerprint `<path>#shallow-module` (no line numbers), the path, the rule and the score at baseline time (`schema/baseline.schema.json`). `deepcheck baseline` rewrites it from the current state, so deleted modules drop out and renamed ones appear under their new path. A missing baseline means every flagged changed module counts as new; a corrupt one is an error (exit 2). Regenerate the baseline after changing scoring, weights or `failThreshold`.

## Wiring

| Where | What | Blocks? |
|---|---|---|
| Claude Code hook `.claude/hooks/deepcheck-gate.sh`, `PreToolUse` on Bash (`.claude/settings.json`, timeout 60 s) | before every `git commit` / `git push` (same mechanism and fail-open policy as `fallow-gate.sh`): `check --agent`; exit 2 with the findings on stderr when the gate fails, a single notice and exit 0 on a tool error | yes, the Bash call |
| `CLAUDE.md` | agents run `npm run deepcheck:audit` after each implementation step, `npm run deepcheck:scan` only on request | — |
| CI job "Deep modules" (`.github/workflows/ci.yml`, pull requests) | `npx svelte-kit sync`, then `npm run deepcheck:ci -- "origin/<base>"`: error annotations and a step summary | yes |
| `.github/workflows/deepcheck-scan.yml` (`workflow_dispatch`: path, top, min_score; commented weekly `schedule`) | ranked scan to the job summary, JSON and markdown as the `deepcheck-report` artifact | never |

The hook matches commands like fallow-gate.sh does (`git commit`, `git push`, also after `&&` or `;`). `git -C <dir> commit` is not matched, by either gate; a command that merely mentions it (`echo git commit`) is.

- **On commit** it judges the working tree against HEAD, so unstaged and untracked TypeScript files count too, even if they are not part of the commit.
- **On push** it judges everything since the merge-base with the upstream (`@{u}`, else `origin/HEAD`, else `origin/main`), so committed but unpushed modules are covered. Uncommitted files count too. With none of these refs it says so and judges against HEAD only.
- **Baseline and config** are read at that base. Committing a config or baseline change on its own therefore changes what the local hook uses, while CI (merge-base with the PR base) keeps the PR base's versions until they are merged.
- Only a gate verdict blocks. A crash (e.g. dependencies not installed), a tool error, missing `jq` or `node`, or input that is not JSON fail open with a single notice.
- The gate takes about 4.5 s with Fallow (3.5 s without) on this repo, so it runs at commit/push, not after every edit.

Not verified: a real GitHub Actions run of the "Deep modules" job and of `deepcheck-scan.yml` (`act` is not available). Both workflows pass actionlint, and their exact shell commands were run locally.

## What is a module

A module is one source file (`.ts`, `.tsx`, `.mts`, `.cts`); exported classes are also reported on their own (`classes` in the JSON, `--explain`). Svelte components are not measured, but their `<script>` imports count in the import graph.

Excluded by default (each configurable; `--explain` says why a file is excluded):

| Reason | Default |
|---|---|
| `test` | `**/*.test.*`, `**/*.spec.*`, `**/__tests__/**`, `**/__mocks__/**`, `**/test/**`, `tests/**` |
| `declaration` | `*.d.ts` |
| `generated` | `**/generated/**`, `**/*.gen.ts`, `**/*.generated.ts`, `@generated` / `auto-generated` / `do not edit` in the first 5 lines, and the `ignorePatterns` of `.fallowrc.json` |
| `entry` | framework or tool entry modules whose exports are a fixed contract: SvelteKit `**/routes/**/+*.ts`, `**/hooks.ts`, `**/hooks.server.ts`, `**/hooks.client.ts`, and `**/*.config.ts` |
| `type-only` | files that only declare types (DTOs, interfaces), or whose exports are at least 80 % types with at most 5 runtime statements |
| `barrel` | files that only re-export |
| `suppressed` | `// deepcheck-ignore-file -- reason` |

Excluded files still take part in the import graph; tests, declarations and generated files do not count as importers.

## Metrics

| Metric | Definition |
|---|---|
| `interfaceSize` | Per exported symbol 1, plus: parameters of exported functions (declarations, arrow/function constants, default exports), and for an exported factory (`(deps) => ({ … })`, or a function whose final statement returns an object literal) the function members of the object it returns; for exported classes the public members (not `private`, `protected` or `#x`) with their parameters, constructor parameters, one count per overload set; for exported object literals each function member (method, arrow or function property) with its parameters. Data keys of exported objects, members of exported interfaces and types are not counted (an exported type counts 1). `export { a }` counts like the local declaration of `a`; re-exports (`export ... from`) count 0: they are the interface of the module they come from and are measured there. |
| `implementationSize` | Statements in the whole module, including non-exported code: variable, expression, control-flow, return, throw, try, function, class and enum statements, class members (methods, properties, accessors, constructors), and expression-bodied arrow functions. Not counted: blocks, imports, re-exports, type declarations (interfaces, type aliases), ambient (`declare`) code, overload signatures. Comments and blank lines never count. Unused internals are left out: non-exported top-level declarations that nothing else in the file uses (by symbol, also through other unused ones), so padding a module with dead code does not make it look deeper. |
| `operations` | Calls, `new` expressions, binary and conditional expressions and template strings in the module (Phase 4: statements alone undercount dense code such as checksum or mapping expressions). |
| `depthRatio` | `implementationSize / max(1, interfaceSize)` (reported as defined; the score's depth component also counts `operations`) |
| `passThroughs` | Named functions and methods (declarations, methods, functions and arrows assigned to variables, class properties, members of module-level objects or of objects a named factory returns; not inline callbacks) whose whole body is one call (`return f(a, b)`, `f(a, b);`, `=> f(a, b)`, optionally awaited) that receives every parameter unchanged (in any order), destructured names included, plus at most fixed values: literals, constants or closure variables (`=> get(fetch, id, true)`). At least one parameter; recursion is excluded; a call to a non-exported function of the same module that does its own work does not count (an entry point into the module's own hidden helper); a private helper that is itself just one call (`call(fn, ...args)`) does not hide anything and does not exempt its callers. Exported aliases of a local function or of a camelCase import (`export const load = getTenant`) count too; imports are not resolved, so renamed `CONSTANTS` and `Classes` do not. Each location is reported. |
| `leakyExports` | Exported signatures (parameter, return and property types of exported functions, variables, classes' public members, and exported type bodies) that reference a type declared in this module but not exported, resolved by symbol. Conservative: only interfaces, classes, enums and object-literal type aliases count; a local alias of another type (`type Fetch = typeof fetch`) is nameable by callers and is not a leak. |
| `classitis` | (a) Tiny single-export files (1 function or class export, at most 3 statements) that make up at least 80 % of a directory with at least `classitisMinFiles` analyzed modules, or at least 3 of which, in one directory, are imported only by one and the same counted module (a module cut into pieces that its caller assembles; shared utilities from other directories or with other importers are not pieces; no module in this repo, ky, zustand or immer imports more than 2 tiny files at all): those tiny files are marked. (b) Exported classes made only of fields, simple accessors (at most one statement) and a constructor that only assigns `this.x`, without `extends` (`dataOnlyClasses`). |
| `fanIn` / `fanOut` | From the whole-project import graph (TS and Svelte files), resolved with the nearest `tsconfig.json` (paths, baseUrl). `fanOut`: distinct project modules imported. `fanIn`: distinct importers; importing a barrel counts as importing what it re-exports. Deep modules tend to have high fan-in and low fan-out. |
| `complexity` | Fallow's `total_cyclomatic` per file when Fallow data is available, else own count: 1 per function (including arrows and methods) plus 1 per `if`, `?:`, `case`, loop, `catch`, `&&`, `\|\|`, `??` and their assignment forms. |
| `unusedExports` | Fallow's unused exports and unused types of the file; `null` without Fallow. |

## Score

Each component is 0 (deep) to 1 (shallow):

| Component | Formula |
|---|---|
| `depth` | `clamp01(1 - log2(max((implementationSize + operations) / max(1, interfaceSize), 1)) / log2(depthTarget))` |
| `complexity` | `clamp01(1 - log2(max(complexity / max(1, interfaceSize), 1)) / log2(complexityTarget))` |
| `passThrough` | `clamp01(2 * passThroughs / max(1, named functions))` |
| `leaky` | `clamp01(leakyExports / max(1, exported names))` |
| `classitis` | 1 if the module is marked as classitis, 0.5 if it only has a data-only class (a value class alone is a common idiom), else 0 |
| `coupling` | `fanOut / (fanIn + fanOut)`, 0 when both are 0 |
| `unusedExports` | `clamp01(unusedExports / max(1, exported names))`, 0 without Fallow data |

`shallowScore = round(100 * Σ(weight × component) / Σ weight)`, 0 to 100, higher is more suspicious. The sum of weights never depends on Fallow: without Fallow the `unusedExports` component is 0, so the maximum score is then 95.

Default weights:

| Component | Weight |
|---|---:|
| `depth` | 40 |
| `complexity` | 20 |
| `passThrough` | 15 |
| `leaky` | 0 |
| `classitis` | 15 |
| `coupling` | 5 |
| `unusedExports` | 5 |

`leaky` is measured and explained in findings but not scored: alone it cannot rank modules (ablation in `docs/deepcheck-validation.md`), and its weight moved to `classitis` so that tiny classitis pieces reach `failThreshold`.

A module is **eligible** when `interfaceSize >= minInterfaceSize`, or it has a pass-through, or a classitis component; tiny legitimate utilities (e.g. `clamp`) are never flagged. A module is **flagged** when it is eligible, `shallowScore >= failThreshold` (per-path overrides apply) and it has a structural sign of shallowness: a pass-through or tiny-file classitis. A data-only class alone raises the score but does not flag: DTO classes are contracts, judged flat by design on other codebases. Depth and complexity alone reach at most 60 for flat-by-design modules (constants, types), so they rank modules in `scan` but never fail the gate by themselves (Phase 4, `docs/deepcheck-validation.md`).

Each finding names the metrics that are high (component >= 0.5) with a concrete fix in Ousterhout's terms: shrink the exported surface, merge pass-throughs into the callee, hide internal types, combine tiny modules, move behaviour into data-only classes.

## Fallow

Fallow is optional enrichment in one adapter (`src/fallow.ts`): `fallow health --file-scores` (complexity) and `fallow dead-code` (unused exports and types), both `--format json --quiet`. Exit codes 0 and 1 mean success. `--fallow off` uses no Fallow; `auto` (default) uses `node_modules/.bin/fallow` if installed and falls back with a warning if it fails; `<path>` runs that binary and treats a failure as a tool error. deepcheck never fails on what Fallow gates (dead code, duplication, cycles); Fallow data only feeds the score.

## Configuration

`deepcheck.config.json` in the project root, validated against `schema/config.schema.json` (unknown keys, wrong types and out-of-range values are tool errors, exit 2). Every key is optional:

| Key | Default | Meaning |
|---|---|---|
| `include` | `**/*.ts`, `**/*.tsx`, `**/*.mts`, `**/*.cts` | analyzed source files |
| `exclude` | `node_modules`, `dist`, `build`, `coverage` | never walked; **added** to the defaults |
| `tests` | see above | test files (replaces the default) |
| `generated` | see above | generated files (replaces the default) |
| `entries` | see above | framework entry modules (replaces the default) |
| `failThreshold` | 65 | score at which an eligible module is flagged (calibrated in Phase 4, see `docs/deepcheck-validation.md`) |
| `tolerance` | 5 | score points a baselined module may worsen (calibrated in Phase 4) |
| `minInterfaceSize` | 5 | smaller modules are not flagged (unless pass-through or classitis) |
| `depthTarget` | 8 | (statements + operations) per interface unit at which the depth component reaches 0 |
| `complexityTarget` | 4 | complexity per interface unit at which the complexity component reaches 0 |
| `classitisMinFiles` | 5 | minimum modules per directory for classitis |
| `weights` | see above | per component; partial objects are merged |
| `overrides` | `[]` | `[{ "files": ["glob"], "failThreshold": n, "minInterfaceSize": n }]`, later entries win |

Directories starting with `.` are never walked.

## Suppressions

```ts
// deepcheck-ignore-file -- reason why this module is shallow by design
// deepcheck-ignore-next-line pass-through -- reason
```

Rules for `next-line`: `pass-through`, `leaky-export`, `data-only-class`; the comment sits directly above the function, export or class. A suppression without a reason (`-- ...`), with an unknown or missing rule, or written another way is not applied and is itself a finding. Only real `//` comments count, not text in strings.

## Known false positives

- **Utility collections** (formatters, small helpers used everywhere): many small exported functions with little code each. Each function may still hide real knowledge (locale rules, formats) that statement counts do not see.
- **Declarative modules** (Drizzle table definitions, route tables, configuration objects): one statement can hold a large object literal, so `implementationSize` is low.
- **Modules that are mostly types** with one or two helpers: exported types count in `interfaceSize` but carry no statements.
- **Thin adapters on purpose** (HTTP clients per endpoint, facades required by a framework or plugin API): pass-throughs that a framework demands.
- **Framework contracts not covered by `entries`** (other frameworks' file conventions): add them to `entries`.
- **Svelte components** are not measured; logic in `.svelte` files is invisible.
- `fanIn` counts only static and dynamic imports inside the project; use through a framework (routes) or from other repositories is invisible.
- Without `svelte-kit sync`, `$lib` imports do not resolve and coupling is too low (deepcheck warns).
