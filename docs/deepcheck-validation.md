# deepcheck validation (Phase 4)

How meaningful are deepcheck's results on this codebase, and can it gate changed code? Brief: `docs/DEEP-MODULE_BRIEF.md` (X4.1–X4.7). Tool docs: `tools/deepcheck/README.md`. Date: 2026-10-10; repo state before calibration 8d05b55, after e7ca4fb.

## Verdict: ready to gate on changed code (narrow, conservative gate)

**What the gate flags.** It uses `failThreshold` 65 and `tolerance` 5. A module is flagged only when all three hold:
- it is eligible;
- it scores at least 65;
- it shows a **structural** sign of shallowness: a pass-through or classitis.

**Why the structural condition.** Depth and complexity alone saturate at 60 for flat-by-design modules (constants, types, copy). The two final reviews each found a new flat module that reached 65:
- five label constants without callers, which crossed through coupling;
- German UI copy typed with an internal type, which crossed through a leaky export.

Both were reproducible false positives and are fixed with regression tests. Leaky exports no longer count as structural.

**What the evidence shows.**
- No module of this repo is flagged (0 of 71 eligible, highest 60), and none of the 24 eligible modules of three open-source projects reaches 65 (highest 60).
- The textbook shallow designs are flagged at 71–75: pass-through classes, a facade of forwarding functions, Java-style stream wrappers. So is the deliberately shallow facade from X2.2.
- Labelled deep modules stay at 39 or below.

**Adversarial check with realistic new modules** (`tools/deepcheck/test/realistic.test.ts`). The probes below are shaped like code agents add here; I wrote them after the reviewers' probes. Only the forwarding facade is flagged:

| New module | Score | Flagged |
|---|---:|---|
| `src/lib/server/meter-facade.ts`: two functions forwarding to `meter.ts` | 80 | yes (true positive) |
| `src/lib/copy/meter-copy.ts`: UI copy constants with an internal type | 65 | no |
| `src/lib/meter-types.ts`: types and two helpers | 53 | no |
| `backend/src/services/meter.service.ts`: one-line Drizzle queries | 40 | no |
| `src/lib/meter-store.ts`: Svelte stores and a reset | 39 | no |
| `src/lib/server/meter.ts`: fetch and form handling | 26 | no |

The second reviewer probed these and found none of them flagged:
- a types-plus-helpers module (60 with exported types, 58 with internal types);
- a CRUD fetch wrapper (57);
- an Elysia service with Drizzle one-liners (46, also with an internal filter type);
- a Svelte store module (37).

**Limits of that evidence.**
- **Zero real positives.** Gate precision rests on author-written fixtures and probes; there is no real positive in this repo or the OSS projects.
- **No recall for moderately shallow modules.** None of the 14 modules labelled shallow here is flagged. The gate blocks a narrow, clear class: new pass-through layers, thin facades and classitis, which agents easily write. It is not a general shallowness detector.
- `scan` is the ranked review aid: 12 of its top 25 are truly shallow.
- Treat a gate failure as "look at this design", with `// deepcheck-ignore-file -- reason` as the visible way out.

**Why not "usable as scan only".** Both final review rounds called it that until their findings were fixed:
- round 1: the false positive at 65, live destructured code dropped, the dead-code check fooled by shadowing;
- round 2: facades exported through `export { … }` or shorthand objects slipped through after the round-1 fix, and the leaky-only false positive.

All of these are now fixed, each with a regression test seen failing first. The round-2 reviewer judged "ready to gate (narrow)" defensible once they were fixed. No third review round was allowed (the brief caps at two). The fixes were therefore verified by the tests above and by the adversarial check, not by a further independent review.

**Third independent check (after the two final review rounds).** The last fixes had not been independently reviewed, so a fresh reviewer probed about 30 realistic modules.
- **Confirmed:**
  - The round-2 fixes hold: export-list, shorthand and default-object facades are flagged at 67–73, and the copy module is not flagged.
  - Decorators, adapters with defaults, caches, form-action factories, formatter collections, and Drizzle or zod definitions per file score 30–57, not flagged.
  - A class with an injected repository and four forwarding methods is flagged at 69–74 (a true positive).
- **Found and fixed (regression tests first):**
  - A directory of five or more one-constant files (one translation table per language, one icon per file) was flagged at 70 through classitis. Only files whose single export is a function or class now count as tiny pieces.
  - `export type P = typeof deadFn` kept dead padding alive. Uses in type positions no longer count.
- **Known evasions, documented, not fixed:**
  - a forwarder with one constant extra argument (65, not flagged);
  - a parameter fixed through a closure, a destructured parameter object, or a factory returning forwarders (53–57);
  - plain aliases (`export const load = getTenant`), which are not eligible.

  The gate's narrow class is therefore narrower than "all thin facades".
- **The reviewer's call:** "usable as scan only" until the classitis false positive was fixed, then "ready to gate (narrow) is defensible". It is fixed.
- A typed EventEmitter wrapper is flagged at 73, which the reviewer called debatable. Typed emit/on/off forwarders are thin wrappers whose value is the type, so `// deepcheck-ignore-file -- reason` is the intended way out.

**The after-step hook is a commit/push gate.** The brief asks to run the audit "through the same mechanism Fallow uses". Here that is the Claude Code `PreToolUse` hook on `git commit`/`git push`, not a hook after every edit. At 4.7–5.3 s with Fallow (3.7 s without) it fits that gate.

## Method

**Sample (X4.1).** These are the eligible modules of this repo (interfaceSize >= 5, or with a pass-through or classitis), ranked by the pre-calibration scoring:
- the top 25;
- 15 drawn at random from the middle (Mulberry32, seed **20261010**);
- the 15 lowest-scoring.

Three modules that entered the top 30 after calibration were labelled later: `wizard-draft.ts`, `invoice.ts` and `api-proxy.ts`. In total 58 modules: 14 shallow, 31 deep, 13 flat by design.

**Labels are blind.**
- Three independent reviewer agents labelled the modules in a shuffled order. Each got Ousterhout's definitions (ch. 4) and the three labels.
- They were told not to run the tool or read its docs or the baseline, and saw no scores.
- Each label has a confidence and a one- or two-sentence reason.
- The labels are judgements: 9 of 58 are low confidence. `tools/deepcheck` modules are part of the sample and were labelled the same way; four of them are among the labelled shallow or flat modules.
- The OSS judgements below are mine and **not blind**: I had seen the scores.
- The labels are not fully consistent between sources. The blind labellers called the repo's `error-handler.ts` (Error subclasses differing only in code and status) shallow; I called ky's Error subclasses flat by design.

**Measures.**
- Precision@25: the share of the 25 highest-scoring eligible modules labelled *shallow*. Flat-by-design counts as a false positive.
- AUC: the probability that a labelled shallow module outscores a labelled non-shallow one (ties count half), over the labelled eligible modules.

## Results

| | Before (8d05b55) | After (e7ca4fb) |
|---|---:|---:|
| Precision@25 | 10/25 (40 %) | 12/25 (48 %) |
| AUC | 0.794 on the 55 originally labelled; 0.783 on all 58 | 0.827 (58 labels) |
| Ranks of the 14 shallow modules | 1, 4, 7, 8, 9, 12, 16, 18, 19, 20, 26, 30, 31, 43 | 2, 5, 6, 9, 10, 12, 13, 15, 17, 19, 20, 22, 29, 30 |
| Modules >= failThreshold | 0 (at 70) | 0 (at 65) |
| Baseline entries | 0 | 0 (`.deepcheck-baseline.json`, 0 of 124 analyzed) |

**False positives in the top 25 before calibration (15), by cause:**

| Cause | Modules | Fix (regression test written first) | Effect |
|---|---|---|---|
| Dense expression code counts as few statements | `save-form.ts`, `login-flow.ts`, `score.ts`, `api.ts`, `category.ts`, `apartment.service.ts`, `mail/index.ts` (deep) | New metric `operations` (calls, `new`, binary and conditional expressions, template strings) added to the depth component; `calibration.test.ts` "counts operations" | precision 10 to 12; `save-form.ts` and `api.ts` fall to 35 and 28 |
| Type-heavy contract files | `mail/types.ts`, `tools/deepcheck/src/config.ts` (flat) | Down-weighting exported types was tried and lowered AUC (0.834 to 0.795), so types still count. Files whose exports are >= 80 % types with <= 5 runtime statements are now type-only (from immer, see below) | `mail/types.ts` (67 % types) remains the top false positive at 60 |
| Declarative data and lookup tables | `db/schema.ts`, `apartment.ts`, `contract-status.ts` (flat) | Counting exported data constants as 0 was tried: +0.015 AUC, no precision gain, against the brief's definition of interfaceSize, so not adopted | documented as a known false positive |
| Cohesive utility collections | `utils/format.ts`, `list-url.ts`, `contract-wizard.ts` (flat) | Not separable from shallow wrappers by these metrics | documented as a known false positive |

**Other calibration changes (each with a test written first):**
- Leaky weight 10 to 5 (ablation).
- `depthTarget` 16 to 8 and `complexityTarget` 8 to 4: scale only, so the components spread over the repo's range of ratios instead of saturating near 1.
- Re-exports no longer count in interfaceSize (from ky, below).
- Unused internal declarations no longer count (gaming, below).

## Labelled sample (X4.1)

"before" is the pre-calibration score that selected the sample; "after" is the final score and rank among the 71 eligible modules.

| Sample | Module | Score before | Score after | Rank after | Label | Conf. | Reason |
|---|---|---:|---:|---:|---|---|---|
| top | `src/lib/server/contract-history.ts` | 58 | 42 | 5 | shallow | low | Three one-expression exports with interface about as large as the implementation; contractStatus only forwards to contractStatusOn with today's date. |
| top | `src/lib/contract-status.ts` | 57 | 43 | 3 | flat-by-design | medium | Small cohesive set of contract-status helpers (status on a date, today, badge labels, period wording); each encodes a domain or wording rule, a constant table plus small functions rather than a pass-through layer. |
| top | `src/lib/server/statement-actions.ts` | 57 | 41 | 9 | shallow | high | Two one-line wrappers that each call fetch on a backend URL; textbook shallow — the interface is nearly as large as the implementation and the only hidden knowledge is the URL and today's date as paidDate. |
| top | `backend/src/mail/types.ts` | 57 | 60 | 1 | flat-by-design | high | Contract file of mail interfaces, a config error class and one tiny env helper; declarative type definitions are expected to be flat. |
| top | `src/lib/utils/format.ts` | 56 | 42 | 7 | flat-by-design | high | Four cohesive formatters each hiding locale knowledge (de-CH apostrophe quirk, UTC for ISO dates, Postgres decimals). |
| top | `src/lib/stores.ts` | 55 | 47 | 2 | shallow | medium | Exposes the raw writable stores (user, toasts) alongside thin helpers, so callers can bypass the helpers and must know the store shapes; clearStores just calls user.set(null) and the only hidden knowledge is the toast id counter and default duration. |
| top | `backend/src/db/schema.ts` | 55 | 20 | 31 | flat-by-design | high | Declarative Drizzle table and relation definitions with inferred row types; a data-definition module where a wide interface is expected. |
| top | `tools/deepcheck/src/baseline.ts` | 54 | 40 | 10 | shallow | low | Seven exports for ~15 statements; read/write are near pass-throughs to fs plus JSON, and the file format and filename are exposed rather than hidden behind a load/save pair. |
| top | `tools/deepcheck/src/config.ts` | 54 | 43 | 4 | flat-by-design | medium | Mostly config type definitions and a defaults constant with a little loading/schema validation/merging; exposes internals like configText, CONFIG_FILE and parseJson and loadConfig is a one-line composition — a contract/config module, not a design defect. |
| top | `src/lib/server/error-handler.ts` | 54 | 42 | 6 | shallow | medium | Classitis: five near-data-only AppError subclasses differing only in code/status, plus a logger and two logging wrappers that just forward a formatted string; broad interface relative to what it hides. |
| top | `src/lib/apartment.ts` | 53 | 41 | 8 | flat-by-design | high | Declarative presentation tables for apartment status (labels, tones, icons, help text, options) plus tiny formatting helpers; a lookup module. |
| top | `backend/src/mail/index.ts` | 53 | 20 | — | deep | high | Single factory createMailTransport(env) plus re-exported MailTransport types; hides provider selection from env, config validation with clear errors and the provider registry — callers never see SMTP/Resend details. |
| top | `src/lib/list-url.ts` | 53 | 35 | 14 | flat-by-design | medium | Three small helpers that build list URLs and detect list navigation; each hides a genuine rule (drop empty filters, reset to page 1, keep filters while paging, what counts as search navigation) — a cohesive utility set that merging would not deepen. |
| top | `backend/src/services/document.service.ts` | 53 | 33 | 17 | shallow | low | Seven exports, most a single Drizzle query each (getDocument, createDocument, countReminders, markDocumentSent, recordDeliveryError); a thin data-access layer whose only hidden knowledge is the shared summary projection and base64 PDF decoding. |
| top | `src/lib/server/save-form.ts` | 53 | 35 | 16 | deep | medium | Three functions reused by many form actions hide POST vs PUT, JSON handling, fail/redirect protocol, 409 conflict mapping and 404 error pages; saveRecord's parameter list with option callbacks is somewhat heavy. |
| top | `src/lib/server/login-flow.ts` | 52 | 39 | 11 | deep | medium | rememberLoginFlow and takeLoginFlow hide cookie name, cookie flags, read-once semantics, safe redirect validation against open redirects and provider validation; LOGIN_ERRORS and loginPage are small extras. |
| top | `backend/src/services/prorating.service.ts` | 52 | 36 | 13 | shallow | medium | Exports nine functions and four types, most of them intermediate steps of one algorithm, yet outside callers use only three; the interface leaks the decomposition instead of hiding it behind calculateApartmentProrating, although the domain logic is real. |
| top | `src/lib/server/auth.ts` | 50 | 35 | 15 | shallow | low | Ten small exports, several near one-liners or cookie.set wrappers, with duplicated constant-time compare; callers must sequence session, XSRF and state cookies themselves instead of calling startSession/endSession; only JWT sign/verify hide meaningful detail. |
| top | `tools/deepcheck/src/discover.ts` | 49 | 33 | 19 | shallow | medium | Five exports, several one-line glob/regex predicates (matchesAny, isSource, isModuleCandidate); the caller must orchestrate walk + excludeByPath + isModuleCandidate itself instead of one discovery function returning candidate modules. |
| top | `tools/deepcheck/src/score.ts` | 49 | 20 | 34 | deep | low | Two pure functions hiding the normalisation formulas (log-scaled shallowness, clamping, ratios, weighted mean); small but encapsulates the scoring math behind a narrow interface; exporting components separately makes it slightly less deep. |
| top | `src/lib/server/tenant.ts` | 49 | 37 | 12 | shallow | medium | One fetch wrapper mapping 404/failure to error pages plus a field-by-field copy mapper; both thin, adding almost no abstraction over the raw backend JSON. |
| top | `src/lib/server/category.ts` | 48 | 24 | 27 | deep | low | Five small fetch/request/id entry points hide the category endpoint, form parsing and validation, German error copy, the 409-conflict field and the predefined-key rule; fetchCategory and deleteCategory are close to pass-throughs to save-form, so only moderately deep. |
| top | `src/lib/api.ts` | 48 | 28 | 21 | deep | medium | apiCall/apiCallPaginated hide URL building, XSRF injection, 401 redirect, error-shape normalisation, network errors and pagination headers; the api convenience object adds pass-throughs and the cookie getter leaks. |
| top | `src/lib/contract-wizard.ts` | 47 | 26 | 24 | flat-by-design | medium | Cohesive set of rules for the rental-contract wizard, each used by a different step component and hiding some UI or domain knowledge; IMPOSSIBLE/impossible leak an internal detail. |
| top | `backend/src/services/apartment.service.ts` | 46 | 24 | 26 | deep | medium | CRUD-shaped interface that hides real knowledge: computed occupancy status in SQL, joins with tenants/buildings, filtering and pagination, and the rule that blocks deletion during an active contract; createApartment, updateApartment and apartmentExists are thin and the apartmentStatus SQL fragment is exported. |
| middle | `src/lib/server/distribution-key.ts` | 46 | 28 | 22 | shallow | medium | Mostly thin adapters forwarding to saveRecord/deleteRecord/fetchRecord with a URL and messages; deleteDistributionKey is a pure pass-through and toDistributionKey a field mapper. |
| middle | `backend/src/services/contract.service.ts` | 44 | 20 | 32 | deep | low | Conventional CRUD service whose create/update hide the overlap rule, joined projection and deletion protection; fairly wide interface with exported internal helpers and unused ones. |
| middle | `backend/src/services/reminder-pdf.ts` | 44 | 23 | 28 | deep | high | One function hides pdfkit streaming and A4 layout with the recipient in the Swiss C5 window position. |
| middle | `src/lib/services/openplz.ts` | 43 | 31 | 20 | shallow | high | Several exported functions are each a thin fetchApi call to one endpoint with try/catch, and six interfaces mirror the external API's DTOs; three functions have no outside callers, so the interface is large and leaky for little hidden logic. |
| middle | `backend/src/db/connection.ts` | 41 | 27 | 23 | flat-by-design | high | Infrastructure glue building the pool and exporting the Drizzle db singleton plus lifecycle helpers; no logic to deepen. |
| middle | `backend/src/config/llm.ts` | 41 | 19 | 35 | flat-by-design | medium | Mostly declarative configuration (env settings, Swiss category tables, prompt template); two small functions hide modest knowledge — legitimately a config module. |
| middle | `src/lib/contract-form.ts` | 40 | 20 | 33 | flat-by-design | low | Eight exports, each a small form-view helper (initial values, validation, request body, overlap warning, option labels, availability dates); validation and availability wording hide real rules, but the broad interface mirrors the form's steps — a cohesive helper collection bordering on shallow. |
| middle | `backend/src/services/utility-validation.service.ts` | 38 | 21 | 30 | shallow | medium | Exports a constant, two interfaces and six functions but production uses only two; wrappers and speculative validators make the interface broad relative to the modest checks it hides. |
| middle | `backend/src/services/tenant.service.ts` | 36 | 14 | 44 | deep | medium | REST-shaped service whose list/get/history/delete hide status SQL, batched occupancy joins and deletion rules; create/update/exists are thin Drizzle wrappers. |
| middle | `src/lib/server/oauth.ts` | 36 | 15 | 41 | deep | medium | Six small exports (URL, code exchange, profile, provider checks) hide provider endpoints, scopes, Microsoft tenant URLs, env credential lookup and normalisation of two different profile formats into JwtPayload; callers never touch provider specifics. |
| middle | `backend/src/services/statement.service.ts` | 35 | 12 | 46 | deep | low | Hides real domain rules (draft-only edit/delete, status transitions, computed overdue/open, transactional create, PDF invalidation), but the interface is wide with pass-throughs and unused exports, which pulls it toward shallow. |
| middle | `backend/src/services/invoice.service.ts` | 35 | 14 | 43 | deep | medium | Create/update/recategorize hide LLM categorisation with confidence threshold, the OR 257a non-allocable rule, manual-override tracking and joined detail queries; some extra small exports. |
| middle | `backend/src/services/qr-bill.service.ts` | 34 | 8 | 53 | deep | medium | generateQRBillForStatement hides the SIX QR-bill layout, MOD-97 and MOD-10 checksums, QR-IBAN detection and image generation; the surface is wider than callers need (large QRBillData interface, extra validators and helpers). |
| middle | `src/lib/server/statement-generation.ts` | 31 | 8 | 54 | deep | medium | Three functions taking one request object hide which contracts overlap the period (tenant change means two statements), per-contract preview/generate calls, invoice and statement queries and backend error translation. |
| middle | `backend/src/services/formula.service.ts` | 30 | 10 | 50 | deep | medium | parseFormula, evaluateFormula and calculateDistribution hide variable extraction, validation, default ceiling height, safe evaluation, share normalisation and German error texts behind string-in/result-out signatures; a few minor exports widen it slightly. |
| bottom | `backend/src/services/config.service.ts` | 25 | 6 | 57 | deep | medium | A get/set/delete API keyed by ConfigKey hides defaults, type coercion, sync and async per-key validators, upsert, and all-or-nothing transactional batch writes; it does leak the whole CONFIG_KEYS table and getConfig/getTypedConfig/getAllConfig overlap somewhat. |
| bottom | `backend/src/services/reminder.service.ts` | 24 | 11 | 47 | deep | high | One function sendReminder(statementId) plus an error class hides eligibility, escalation, deadline, letter and PDF rendering, storage, channel choice and e-mail delivery with error recording. |
| bottom | `tools/deepcheck/src/render.ts` | 23 | 3 | 67 | flat-by-design | medium | Seven pure renderers, one per output format, called from a dispatch table; each hides real format knowledge (GitHub escaping, markdown tables, gate labels) and merging them would not narrow the interface. |
| bottom | `backend/src/middleware/auth.ts` | 23 | 8 | 52 | deep | medium | Routes just .use() a plugin hiding bearer parsing, jose verification, zod payload validation, user mapping and the 401 short-circuit; the optional variant duplicates logic and verifyJwt is extra surface. |
| bottom | `src/lib/overview.ts` | 23 | 2 | 68 | deep | high | Two functions plus their input/output types hide setup-step ordering, task priority, German pluralised copy, deadline windows, day arithmetic and the 'when' wording. |
| bottom | `src/lib/utils/contract-availability.ts` | 23 | 5 | 60 | deep | high | Two pure functions hide availability rules, date parsing/formatting and ready-to-show German messages with a status type. |
| bottom | `src/lib/server/statement.ts` | 20 | 3 | 65 | deep | high | loadStatement(fetch, id) hides three parallel backend calls, error mapping, backend-to-frontend field mapping, legacy fee derivation and German name lookup with defaults. |
| bottom | `src/lib/server/settings.ts` | 18 | 0 | 70 | deep | high | Interface is two functions plus a type (toSettings, saveSettings); hides form-to-config-key mapping, IBAN normalisation and mod-97 checksum, field validation, and the save-then-reset-emptied-fields protocol against the backend. |
| bottom | `src/lib/server/tenant-form.ts` | 17 | 2 | 69 | deep | high | saveTenant(fetch, request, id?) hides form parsing, normalisation, contact and channel validation, the choice between POST and PUT, error mapping and redirect rules including the return to the contract wizard. |
| bottom | `backend/src/services/pdf.service.ts` | 15 | 6 | 58 | deep | high | Effectively one function (data + QR config + language -> PDF) plus a Base64 variant hiding ~750 lines of five-language translations, floor/currency formatting, layout and QR-bill embedding. |
| bottom | `backend/src/services/llm.service.ts` | 14 | 4 | 63 | deep | high | categorizeInvoice and isLlmAvailable hide the OpenAI-compatible HTTP call, timeout/abort handling, response parsing, a TTL cache with eviction, category lookup and fallback results; cache-management exports leak a little. |
| bottom | `backend/src/services/statement-pdf.service.ts` | 13 | 4 | 64 | deep | high | Two id-based functions hide creditor configuration lookup with fallbacks, mapping to PDF data including legacy fee derivation, language choice, the QR-IBAN reference rule and storing the blob. |
| bottom | `tools/deepcheck/src/graph.ts` | 10 | 0 | 71 | deep | high | One function coupling(...) hides import extraction from TS and Svelte, nearest-tsconfig lookup, module resolution and fan-in through barrels; five parameters are many but the hidden work is substantial. |
| bottom | `tools/deepcheck/src/cli.ts` | 5 | 5 | 61 | deep | high | main(argv, io) returning an exit code hides argument parsing, dispatch, output formats, baseline filtering, file and step-summary emission and JSON error reporting. |
| bottom | `tools/deepcheck/src/metrics.ts` | 2 | 3 | 66 | deep | high | Two functions and one result interface hide ~400 lines of AST analysis; callers need know nothing about ts-morph node kinds. |
| added | `src/lib/wizard-draft.ts` | — | 33 | 18 | deep | medium | Five small functions hide the key prefix/version, JSON envelope with timestamp, Date revival and every localStorage failure mode; callers never write try/catch or know keys; passing the Storage handle is a small, test-motivated leak. |
| added | `src/lib/invoice.ts` | — | 25 | 25 | flat-by-design | medium | Cohesive set of small invoice helpers (suggestion type, provenance mapping, Swiss amount normalisation, validation with German messages, safe local path); each hides some domain or security knowledge, merging/splitting would not shrink what callers must know. |
| added | `src/lib/server/api-proxy.ts` | — | 22 | 29 | shallow | medium | forwardRequest hides real logic, but the module exports a toolbox of small steps every route handler must compose in the right order, so proxy knowledge leaks into callers instead of sitting behind one proxy(request, path) call. |

## Reference check (X4.3)

**Fixtures for well-known designs** (`tools/deepcheck/test/reference.test.ts`, all passing). The designs come from *A Philosophy of Software Design*:

| Design | Score | Flagged |
|---|---:|---|
| Unix-style file I/O: open, read, write, seek, close over blocks, cache and descriptors (deep) | 16 | no |
| Text area behind the document (deep enough) | 36 | no |
| Java-style stream wrappers: FileInputStream, BufferedInputStream, ObjectInputStream (shallow) | 71 | yes |
| TextDocument whose methods forward to TextArea (pass-through, ch. 7) | 74 | yes |
| Tiny single-function files in one directory (classitis) | marked classitis | eligible |
| Facade of four forwarding functions (`tenant-facade.ts`, used in X2.2) | 75 | yes |
| Thin URL wrappers around fetch (3 one-line functions) | 53 | no |

**Open-source spot check.** Each project was shallow-cloned into `/tmp/claude-0/oss`, never into this repo, and scanned with `--fallow off`. I judged the top 10 (or all, if fewer) by reading them; the judgements are not blind.

- **ky** (`sindresorhus/ky` 3541888), 13 eligible, top 10:
  - NetworkError 51, type-guards 50, ResponseSizeError 49, constants 48, HTTPError 41, is 40, timeout 33, NonError 26, ForceRetryError 15, Ky 5.
  - The top modules are Error subclasses, predicate collections and constants: flat by design, not shallow, and all below 65.
  - `Ky.ts` (624 statements behind 7 interface units) is 10th of 13 at score 5, below every module in the list.
  - Before calibration `source/index.ts` ranked first (62). It re-exports about 38 names; that cause is fixed.
- **zustand** (`pmndrs/zustand` d7a5583), 4 eligible:
  - traditional 46, react 27, vanilla 20, persist 8.
  - `traditional.ts` is a thin hook wrapper (shallow-ish); `vanilla.ts` and `persist.ts` are the deep cores. The order is plausible.
- **immer** (`immerjs/immer` 8848a5b), 7 eligible:
  - plugins 60, immer 55, common 31, scope 29, immerClass 17, proxy 9, finalize 2.
  - `plugins.ts` (plugin type contracts and registry) and `immer.ts` (public API of bound methods) are flat by design; the deep cores are correctly last.
  - Before the fix, `types-external.ts` and `types-internal.ts` ranked at 60 (91 % types, 1 runtime statement); that cause is fixed.

None of the 24 eligible OSS modules reaches 65.

## Gaming (X4.4)

`tools/deepcheck/test/gaming.test.ts`:

| Attempt | Result | Status |
|---|---|---|
| Pad a shallow module with dead internals (unused functions and constants) | Before: the score fell from 74 to 46 (gamed). Now unused non-exported top-level declarations, including chains that only feed each other, are left out of statements, operations, complexity and function count, and the score stays at 74. Uses are resolved by symbol, so a parameter, local or property with the same name does not keep dead code alive. Destructured declarations are tracked per bound name. Names in `export { … }` lists and shorthand members count as uses (review findings, tests). An unused `const x = sideEffect()` is treated as dead although it runs | mitigated, tests |
| Split a deep module (CSV parser) into tiny files | the highest part scores above the whole, so `scan` shows it. But the tiny parts are not **eligible** (interfaceSize < 5, and fewer than 5 files for classitis), so the gate does not see them: splitting a flagged module into several small files evades the gate | **weakness, documented**: `scan --min-score` still ranks the parts |
| Inline pass-throughs (do the work instead of forwarding) | score goes down | holds, test |
| Wrap pass-throughs in an exported object literal, or export them through `export { … }` | function members count as interface (also shorthand `{ load }`) and pass-throughs are detected (Phase 1 review fix; round 2 found the dead-code check dropping such functions, fixed) | mitigated, tests |
| Pad with *live* but pointless code (statements that are executed but do nothing useful) | lowers the score | **not mitigated**: not detectable statically without judgement; reviewers must catch it, and every finding says "fix the design, do not pad" |
| Hide a module behind `// deepcheck-ignore-file -- reason`, or edit `deepcheck.config.json` in the same change | the suppression needs a reason and shows in review; the config is read at the base, so it only takes effect after merge (Phase 2) | by design |
| Surround real code with many exported types to get "type-only" | only applies with <= 5 runtime statements | mitigated, test |

## Ablation (X4.5)

Precision@25 and AUC on the final scoring with one component's weight set to 0 ("-x"), or with only that component ("only x"):

| Component | -x | only x | Decision |
|---|---|---|---|
| all | 12/25, 0.827 | | |
| depth | 11/25, 0.833 | 12/25, 0.806 | keep 40: main signal |
| complexity | 12/25, 0.820 | 12/25, 0.806 | keep 20: second signal, partly overlaps depth (both per interface unit) |
| passThrough | 12/25, 0.830 | 2/25, 0.500 | keep 15: rare in this repo but decisive for the textbook cases the gate targets |
| leaky | 12/25, 0.830 | 2/25, 0.491 | **down-weighted 10 to 5**: noisy, its removal improved AUC before calibration (0.794 to 0.810) |
| classitis | 12/25, 0.831 | 2/25, 0.500 | keep 10: no case in this repo, needed for the classitis fixture |
| coupling | 12/25, 0.820 | 6/25, 0.542 | keep 5: weak alone, small help in the mix |
| unusedExports (Fallow) | 12/25, 0.825 | 3/25, 0.454 | keep 5: noise on its own; small weight, and G6 keeps the gate identical without Fallow |

Pass-through, leaky, classitis and unused exports are sparse indicators: alone they cannot rank, but they explain findings. Removing depth slightly raises AUC on these 58 labels, yet it is the only component that reflects the brief's core ratio. That difference is within the noise of the sample, so depth stays.

## Threshold and tolerance (X4.6)

- **failThreshold 65.** Scores after calibration:
  - Labelled shallow: 47, 42, 42, 41, 40, 37, 36, 35, 33, 33, 31, 28, 21 (and api-proxy 22).
  - Flat by design: 60, 43, 43, 42, 41, 35, 27, 26, 20, 20, 19, 3.
  - Deep: at most 39.
  - OSS: at most 60.
  - Textbook pass-through designs: 71 to 75.
  - 65 lies between them, 5 points above the highest legitimate module and 6 below the lowest textbook case. **0 modules of this repo are at or above it** (0 of 124 analyzed in the baseline).
  - A lower threshold (e.g. 45) would add 1 shallow module (`stores.ts`, 47) but also flat modules at 60, 43 and 43. It would block legitimate designs.
- **tolerance 5.** I applied three benign one-step edits to each of the 71 eligible modules: one tiny exported helper, one live internal helper, one exported constant.
  - The score changed by median 1 / -1 / 1, p90 4 / 0 / 3, max 6 / 0 / 4 (min -3 / -7 / -2).
  - 5 lets one small benign edit pass. A baselined module that keeps getting shallower fails G2.
  - Today the baseline is empty, so G2 and the tolerance do not apply yet; they matter once modules are baselined. The current risk is G1: a benign edit pushing an unbaselined module over 65. The structural requirement covers it, since a module needs a pass-through, leaky export or classitis to fail.

## Limits

- **Small sample, one codebase.** 58 labelled modules from one SvelteKit and Elysia repo. Precision@25 moves by 4 percentage points per module. The threshold's margin to the highest legitimate module is 5 points.
- **Judgement labels.** They come from three reviewer agents, not humans, and 9 of 58 are low confidence. "Flat by design" versus "shallow" is the most disputable boundary (utility collections, CRUD services).
- **Calibration on the same labels it is measured on.** The changes were few and generic (operations, re-exports, mostly-types, dead code, two targets, one weight), and several came from the OSS projects rather than the labels. Even so, precision and AUC "after" are optimistic.
- **Low recall at the gate.** It catches pass-through layers and thin facades, not moderately shallow modules (0 of 14 labelled shallow modules here reach 65). Gate precision rests on author-written fixtures and one scratch module, not on real positives.
- **Splitting evades the gate.** A shallow module split into small files has parts that are not eligible.
- **Runtime.** After the symbol-based dead-code check, `npm run deepcheck:audit` takes 4.7–5.3 s with Fallow and about 3.7 s without (the type checker's first symbol resolution). That fits a commit/push gate, not an after-every-edit hook.
- **Blind spots of the metrics.**
  - Svelte components are not measured.
  - Utility collections and declarative modules look shallow.
  - Live padding cannot be detected.
  - The interface is counted, not weighed: a complex parameter object counts 1.
- **OSS spot check.** Three small libraries, judged by me; ky and zustand have few eligible modules.
