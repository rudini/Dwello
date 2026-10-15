# Dwello API Specification

Describes the API as implemented. Source of truth: `backend/src/app.ts`, `backend/src/routes/*.ts`, the services in `backend/src/services/`, and the response examples in `tests/contracts/*.json`. When this file and the code disagree, the code wins; fix this file.

Interactive documentation of the backend (generated from the Elysia schemas) is served at **`/swagger`** (OpenAPI JSON at `/swagger/json`) on the backend, without authentication.

---

## 1. Architecture

```
Browser -> SvelteKit BFF (port 3000: /auth/*, /api/*, page loads/actions) -> Elysia backend (port 3001: /api/v1/*) -> PostgreSQL
```

- The **BFF** does the OAuth login, keeps the session JWT in an HTTPOnly cookie, checks the XSRF token on mutations and forwards calls to the backend with `Authorization: Bearer <jwt>`. The browser never sees the JWT.
- The **backend** validates the JWT and holds all business logic. It is not meant to be called from the browser directly.
- Backend port: `PORT` (default 3001). The BFF reaches it via `BACKEND_URL` (default `http://localhost:3001`).

---

## 2. Conventions (backend)

- **Base path:** `/api/v1`. All endpoints except `GET /health`, `GET /api/v1/invoices/llm-recipient` (provider and country for the public privacy notice) and `/swagger` require `Authorization: Bearer <jwt>`; otherwise **401** `{ "message": "Missing or invalid authorization header" }` or `{ "message": "Invalid or expired token" }`.
- **No envelope:** successful responses are the bare resource or a plain object, with **camelCase** field names (e.g. `{ "buildings": [...], "total": 1 }`). The list key differs per router (see each section).
- **Errors:** `{ "error": "<message>", "code"?: "<CODE>", "params"?: { … }, "causes"?: [{ "code", "params" }] }`. `error` is free text (some English, some German). A refusal that can reach the UI also carries a stable `code` and the values in its text as `params` (`backend/src/services/coded-error.ts`); the BFF shows the message `backend_<code in lower case>` from `messages/*.json` in the UI language (`src/lib/backend-error.ts`), otherwise the `error` text. Unexpected errors have no code. Codes:
  - Not found: `APARTMENT_NOT_FOUND`, `BUILDING_NOT_FOUND`, `CATEGORY_NOT_FOUND`, `CONTRACT_NOT_FOUND`, `DISTRIBUTION_KEY_NOT_FOUND`, `HEATING_PROFILE_NOT_FOUND`, `INVOICE_NOT_FOUND`, `STATEMENT_NOT_FOUND`
  - Names and numbers taken (409): `APARTMENT_NUMBER_TAKEN {number}`, `CATEGORY_NAME_TAKEN {name}`, `DISTRIBUTION_KEY_NAME_TAKEN {name}`, `HEATING_PROFILE_NAME_TAKEN {name}`
  - Delete refusals: `CATEGORY_HAS_FUEL_STOCK`, `CATEGORY_IN_USE_ONE` / `CATEGORY_IN_USE {count}`, `DISTRIBUTION_KEY_PREDEFINED`, `DISTRIBUTION_KEY_IN_USE_ONE` / `DISTRIBUTION_KEY_IN_USE {count}`, `DISTRIBUTION_KEY_IS_DEFAULT`, `HEATING_PROFILE_PREDEFINED`, `HEATING_PROFILE_IS_DEFAULT`, `STATEMENT_NOT_DRAFT`
  - Distribution keys and formulas: `DISTRIBUTION_KEY_TYPE_FIXED`, `DISTRIBUTION_KEY_FORMULA_FIXED`, `FORMULA_INVALID` (every formula error in `causes`: `[{ code, params }]`, in the order of the text), `FORMULA_REQUIRED`, `FORMULA_UNKNOWN_VARIABLE {variable}`, `FORMULA_NO_VARIABLE`, `FORMULA_INVALID_CHARACTERS {characters}`, `FORMULA_UNOPENED_PARENTHESIS`, `FORMULA_UNCLOSED_PARENTHESIS`, `FORMULA_CONSECUTIVE_OPERATORS`, `FORMULA_DIVISION_BY_ZERO`, `FORMULA_VALUE_MISSING {variable}`, `FORMULA_NOT_A_NUMBER`, `FORMULA_NOT_COMPUTABLE` (the engine's own text only in `error`, for the log), `FORMULA_SAMPLE_FAILED {sample, reason, …}`, `FORMULA_SAMPLE_NEGATIVE {sample}` (`sample`: `FORMULA_SAMPLE_SMALL`, `_MEDIUM`, `_LARGE`), `FORMULA_APARTMENT_FAILED {reason, …}`, `FORMULA_NEGATIVE`, `FORMULA_ALL_ZERO`. The params `cause`, `reason` and `sample` may hold a code, shown as that code's message
  - Heating profiles: `HEATING_PROFILE_SHARES_SUM {sum}`, `HEATING_PROFILE_SHARE_NEGATIVE {month}`, `HEATING_PROFILE_TYPE_FIXED`, `HEATING_PROFILE_SHARES_FIXED`
  - Contracts and statements: `CONTRACT_OVERLAP {contract}`, `CONTRACT_NOTICE_WITHOUT_END`, `CONTRACT_PARTIES_FIXED`, `CONTRACT_NOT_IN_PERIOD`, `IBAN_MISSING`, `IBAN_INVALID` (the stored IBAN fails its check when a PDF needs the QR-bill), `CALCULATION_FAILED` (preview or generation failed for another reason, logged), `PDF_FAILED` (500: a PDF could not be made for another reason, logged)
  - Invoices: `KI_UNAVAILABLE`; categories: `KI_PROPOSAL_UNAVAILABLE`, `KI_PROPOSAL_UNSURE`
  - Uploaded documents: `DOCUMENT_TOO_LARGE {megabytes}`, `DOCUMENT_TYPE_NOT_ALLOWED`, `DOCUMENT_TITLE_TOO_LONG {max}`, `TENANT_NOT_FOUND` (404), `DOCUMENT_NOT_DELETABLE`
  - Reminders: `REMINDER_NOT_SENT`, `REMINDER_NOT_OVERDUE`, `REMINDER_REFUND`, `REMINDER_LIMIT`; delivery errors as `deliveryErrorCode` of a document: `TENANT_NO_EMAIL`, `MAIL_NOT_CONFIGURED`, `MAIL_DELIVERY_FAILED` (any other failure, also one stored before this code existed; the mail server's text is logged, never stored)
- **Schema validation:** a body, query or path parameter that fails the Elysia `t` schema returns **422** `{ error: 'Invalid request', code: 'VALIDATION_ERROR', params: {} }` (one `onError` in `backend/src/app.ts`); the UI shows `backend_validation_error`.
- **Types:** IDs are UUID strings. Money, area, rooms and percentages stored as `numeric` are **strings** (`"450.00"`). Dates are `YYYY-MM-DD`; timestamps ISO 8601.
- **Pagination:** `limit` and `offset` query parameters (strings parsed as integers). Default `limit` per router is noted below. There is no sorting parameter; each list has a fixed order.
- **Delete:** success is **204** with an empty body.
- **Status codes used:** 200, 201 (create), 204 (delete), 400 (business rule or bad input), 401, 404, 409 (conflict with existing data), 422 (schema), 500, 503 (LLM unavailable on recategorize).

### Health

`GET /health` (public) → `{ status: "ok", timestamp, service: "dwello-backend" }`

---

## 3. Buildings `/api/v1/buildings`

| Method | Path | Notes |
|---|---|---|
| GET | `/` | Query: `search`, `city`, `canton`, `limit` (default 20), `offset`. → `{ buildings, total }`; each building has `apartmentCount`, `occupiedCount`, `vacantCount` |
| GET | `/:id` | → building with counts (see `tests/contracts/building.json`). 404 |
| GET | `/:id/apartments` | → `{ building, apartments }` (apartments as stored rows). 404 |
| POST | `/` | Body: `name`, `address`, `postalCode` (4–10 chars), `city`, `canton` (2 chars) required; optional `country`, `latitude`, `longitude` (strings), `buildingType`, `yearBuilt` (number). → 201 building. 400 |
| PUT | `/:id` | Body: any subset of the POST fields. → building. 404 |
| DELETE | `/:id` | 204. 404; 400 if the building still has apartments |
| GET | `/:id/fuel-stocks` | → array of `{ id, buildingId, readingDate, amount, categoryId, createdAt }` by date (Tankbestand, see `tests/contracts/fuel-stocks.json`). 404 building |
| POST | `/:id/fuel-stocks` | Body: `readingDate` (date), `amount` (string, CHF ≥ 0, two decimals), `categoryId` (uuid of an allocable heating cost category). → 201 reading. 400 date that does not exist or category not allowed; 404 building; 409 a reading on that day exists, or the building's readings are in another category; 422 invalid body |
| DELETE | `/:id/fuel-stocks/:stockId` | 204. 404; 422 ids not uuids |

## 4. Apartments `/api/v1/apartments`

Apartment `status` is derived from rental contracts: `occupied` (a contract runs today), `relet` (no contract today, but a future one is signed), otherwise the manually set `vacant` or `reserved`. Only `vacant` and `reserved` can be set manually.

| Method | Path | Notes |
|---|---|---|
| GET | `/` | Query: `search` (Wohnungsnummer or building name, ignoring case), `buildingId`, `status` (`occupied`\|`relet`\|`vacant`\|`reserved`), `floor`, `limit` (default 50), `offset`. → `{ apartments, total }`; items include `status`, `nextContractStart`, `currentContractEnd` (last day of the contract running today, A-4), `buildingName` |
| GET | `/:id` | → apartment with `building { id, name, address, postalCode, city }`, `currentTenantName`, `currentContractId`, `nextContractStart`, `currentContractEnd` (as in the list). 404 |
| GET | `/:id/history` | → `{ apartment, contracts: [{ id, tenantName, startDate, endDate, baseRent }] }`. 404 |
| POST | `/` | Body: `buildingId` (uuid), `number`, `floor` (number), `area` (string), `rooms` (string), optional `status` (`vacant`\|`reserved`). → 201 apartment. 400 building not found; **409** number already exists in the building |
| PUT | `/:id` | Body: any subset of `number`, `floor`, `area`, `rooms`, `status`. → apartment. 404; 409 duplicate number |
| DELETE | `/:id` | 204. 404; 400 if a current or future contract exists |

## 5. Tenants `/api/v1/tenants`

| Method | Path | Notes |
|---|---|---|
| GET | `/` | Query: `search`, `language`, `status` (`active`\|`inactive`), `limit` (default 50), `offset`. → `{ tenants, total }`; items include `currentApartment`, `currentBuilding`, `isActive` (see `tests/contracts/tenants.json`) |
| GET | `/:id` | → tenant with `currentApartment`, `currentBuilding`, `contractCount`, `isActive`. 404 |
| GET | `/:id/history` | → `{ tenant, contracts: [{ id, apartmentNumber, buildingName, startDate, endDate, baseRent, isActive }] }`. 404 |
| POST | `/` | Body: `firstName`, `lastName` required; optional `email` (email format), `phone`, `language` (`de`\|`fr`\|`it`\|`rm`\|`en`), `address`, `postalCode`, `city`, `correspondenceChannel` (`email`\|`letter`). → 201 tenant. 400 |
| PUT | `/:id` | Body: any subset of the POST fields. → tenant. 404 |
| DELETE | `/:id` | 204. 404; 400 if the tenant has an active contract or any contract history |

## 6. Rental contracts `/api/v1/contracts`

| Method | Path | Notes |
|---|---|---|
| GET | `/` | Query: `apartmentId`, `tenantId`, `buildingId`, `status` (`active`\|`ended`\|`future`), `search`, `limit` (default 50), `offset`. → `{ contracts, total }`; items add `tenantName`, `tenantEmail`, `apartmentNumber`, `buildingName`, `buildingAddress` |
| GET | `/:id` | → contract with the same added fields. 404 |
| GET | `/apartment/:apartmentId/active` | Query: `date` (default today). → the contract running on that date. 404 if none |
| GET | `/apartment/:apartmentId/period` | Query: `periodStart`, `periodEnd` (required). → `{ contracts }` overlapping the period (for prorating) |
| POST | `/` | Body: `apartmentId`, `tenantId` (uuid), `startDate`, `baseRent`, `monthlyAdvancePayment` required; optional `endDate`, `terminated` (boolean: `endDate` is the Kündigungstermin of an open-ended contract; default false), `additionalRent`, `referenceIndex`, `contractPdf`, `notes`. → 201 contract. 400 apartment/tenant not found or overlap with another contract of the apartment |
| PUT | `/:id` | Body: any subset of the POST fields; `apartmentId`/`tenantId` only with the stored values, another one is refused with 400 code `CONTRACT_PARTIES_FIXED` (a move or a Mieterwechsel is a new contract); `terminated: true` needs an end date (stored or sent), else 400 code `CONTRACT_NOTICE_WITHOUT_END` (also on POST); `endDate: null` clears `terminated`, even if `terminated: true` is sent; a new `endDate` without `terminated` keeps the stored flag. → contract. 404; 400 overlap; 409 `{ error, statements: [{ id, statementNumber, status, periodStart, periodEnd, buildingId }] }` if the new `startDate`/`endDate` change the rent days billed by a utility statement of the contract (stored as `rental_start`/`rental_end` on the statement) (see `tests/contracts/contract-end-refused.json`) |
| DELETE | `/:id` | 204. 404; 400 if the contract has utility statements |

## 7. Categories `/api/v1/categories`

| Method | Path | Notes |
|---|---|---|
| GET | `/` | Query: `search`, `isAllowedUtilityCost` (`true`\|`false`), `limit` (default 100), `offset`. → `{ categories, total }`; items include `invoiceCount` |
| GET | `/allowed` | → array of categories with `isAllowedUtilityCost = true` |
| GET | `/:id` | → category with `invoiceCount`. 404 |
| POST | `/propose` | Body: `name` (1–100) required; optional `description`, `language` (`de`\|`fr`\|`it`\|`en`, the language of `reasoning`, default `de`). The KI's proposal for a new category (#176): → `{ isAllowedUtilityCost, reasoning }` from a confidence of 0.7; **503** without a sure answer: `KI_PROPOSAL_UNAVAILABLE` (no KI, error; trying later can help) or `KI_PROPOSAL_UNSURE` (unusable answer, lower confidence) (#186). The prompt quotes Art. 256 Abs. 1, 256b, 257a, 257b OR and Art. 4 Abs. 3, 5 Abs. 1–2, 6, 6a, 6b, 6c Abs. 3 VMWG verbatim (`LEGAL_BASIS` in `backend/src/config/llm.ts`) |
| POST | `/` | Body: `name` (1–100), `isAllowedUtilityCost` (boolean) required; optional `nameDE`, `nameFR`, `nameIT`, `nameEN`, `description`, `sortOrder`. → 201. **409** `name` or `nameDE` already used |
| PUT | `/:id` | Body: any subset. → category. 404; 409. Setting `isAllowedUtilityCost: false` also sets `isValidUtilityCost = false` on its invoices (OR 257a) |
| DELETE | `/:id` | 204. 404; **409** if invoices use it |

There is no "predefined" flag on categories.

## 8. Invoices `/api/v1/invoices`

| Method | Path | Notes |
|---|---|---|
| GET | `/` | Query: `search`, `buildingId`, `categoryId`, `dateFrom`, `dateTo`, `isValidUtilityCost`, `wasManuallyOverridden` (`true`\|`false`), `limit` (default 20), `offset`. → `{ invoices, total }` (`llmCategory` is always `null` in the list) |
| GET | `/llm-status` | → `{ llmAvailable: boolean, cache: { size, maxSize } }` |
| GET | `/llm-recipient` | → `{ recipient: { provider, country } \| null }`; `null` when the LLM runs on the operator's server (or is disabled). Used by the privacy page |
| GET | `/utility-rules` | → `{ maxManagementFeePercent, allowedCategories, notAllowedCategories, notes }` (German texts) |
| POST | `/categorize` | Preview only, stores nothing. Body: `billingEntityName`, `description`, `amount` (string). → `{ category: { id, name, isAllowedUtilityCost } \| null, confidence, isAllowedUtilityCost, reasoning, source: "llm"\|"cache"\|"fallback" }` |
| GET | `/for-statement/:buildingId` | Query: `periodStart`, `periodEnd` (required). → array of the building's invoices with `isValidUtilityCost = true` whose Leistungszeitraum overlaps the period, or without one, dated in it; each with `inPeriod: { start, end, amount }` (its days and amount in the period) |
| GET | `/completeness/:buildingId` | Query: `periodStart`, `periodEnd` (dates, required; end not before start, else 400). Compares the allocable invoices per category with the same dates one year earlier → `{ buildingId, comparedWith: { start, end }, hasComparison, findings: [{ categoryId, categoryName, kind: stock \| tank \| missing \| gap \| new \| deviation, current: { count, total }, previous: { count, total }, missingParts, changePercent }] }` |
| GET | `/:id` | → invoice with `building`, `category`, `distributionKey`, `llmCategory` (see `tests/contracts/invoice.json`). 404 |
| GET | `/:id/validate` | → `{ isValid, errors, warnings }`; 404 with the same shape if not found |
| POST | `/:id/recategorize` | No body. Asks the LLM again and stores `llmCategoryId`/`llmConfidence`; from confidence 0.85 the suggestion also becomes `categoryId` (as on create; a non-allocable category makes the invoice non-allocable, an exclusion stays; manual override cleared). → `{ success: true, invoice, categorization: { category (name), confidence, isAllowedUtilityCost, reasoning } }`. 404; **503** LLM unreachable or no matching category; 500 other errors |
| POST | `/` | Query: `skipLlm=true` disables categorization. Body below. → 201 invoice. 400 building or category not found |
| PUT | `/:id` | Body: any subset of the POST fields. → invoice. 404; 400 category not found |
| DELETE | `/:id` | 204. 404 |

**Invoice body:** `buildingId` (uuid), `billingEntityName` (1–255), `description`, `amount` (string), `invoiceDate` required; optional `invoiceNumber`, `billingEntityAddress`, `categoryId`, `llmCategoryId`, `llmConfidence` (string, 0–1), `manualOverrideReason`, `distributionKeyId`, `isValidUtilityCost` (boolean), `servicePeriodStart` and `servicePeriodEnd` (dates or null, Leistungszeitraum: both or none, end not before start, else 400), `dueDate`, `paidDate`, `invoicePdf`, `notes`.

**Categorization rules** (`invoice.service.ts`):
- The LLM runs on create only when no `categoryId` is sent and `skipLlm` is not `true`. LLM failures are logged and the invoice is created without a suggestion.
- Confidence < 0.7: suggestion dropped. 0.7 to < 0.85: stored as `llmCategoryId`/`llmConfidence` only. ≥ 0.85: additionally assigned as `categoryId`, with `isValidUtilityCost` taken from the category.
- A category with `isAllowedUtilityCost = false` always forces `isValidUtilityCost = false`.
- Manual override: a PUT that changes `categoryId` to something other than `llmCategoryId` sets `wasManuallyOverridden = true`; the reason goes in `manualOverrideReason`.

## 9. Distribution keys `/api/v1/distribution-keys`

`type` is `predefined` or `custom`. Formulas use the variables `{area}`, `{rooms}`, `{volume}`, `{units}` and their building sums `{area_total}`, `{rooms_total}`, `{volume_total}`, `{units_total}`.

| Method | Path | Notes |
|---|---|---|
| GET | `/` | Query: `search`, `type`, `limit`, `offset`. → `{ data, total, limit, offset }` (default limit 100); items include `invoiceCount` |
| POST | `/initialize` | Creates missing predefined keys. → `{ message, created, existing }` |
| POST | `/test-formula` | Body: `formula`. → `{ isValid, results: [{ apartment: { area, rooms }, value, share }], totalValue, errors, errorCodes }` (four sample apartments, CHF 10,000; `errorCodes`: `{ code, params }` per error, same order) |
| POST | `/parse-formula` | Body: `formula`. → `{ isValid, variables, errors, errorCodes, normalizedFormula }` |
| POST | `/validate-formula` | Body: `formula`. → `{ isValid, errors, errorCodes, warnings }` |
| GET | `/:id` | → key with `invoiceCount`. 404 |
| POST | `/` | Body: `name` required; optional `nameDE`, `nameFR`, `nameIT`, `nameEN`, `type` (default `custom`), `formula`, `description`, `sortOrder`. → 201. 400 custom key without formula or invalid formula; 409 name taken |
| PUT | `/:id` | Body: optional `name`, `nameDE`, `nameFR`, `nameIT`, `nameEN`, `formula`, `description`, `sortOrder`. → key. 404; 400 formula of a predefined key changed or invalid; 409 name taken |
| DELETE | `/:id` | 204. 404; 400 predefined; 409 used by invoices or set as default in config |

## 10. Heating profiles `/api/v1/heating-profiles`

`type` is `predefined` or `custom`. Monthly shares `januaryPct` … `decemberPct` (percent) must add up to 100.

| Method | Path | Notes |
|---|---|---|
| GET | `/` | Query: `search`, `type`, `limit`, `offset`. → `{ data, total, limit, offset }` (default limit 100) |
| GET | `/:id` | → profile plus `monthlyPercentages: { january, …, december }` (numbers). 404 |
| POST | `/` | Body: `name` and all twelve `<month>Pct` (numbers 0–100) required; optional `nameDE`, `nameFR`, `nameIT`, `nameEN`, `type` (default `custom`), `description`. → 201. 400 shares do not sum to 100; 409 name taken |
| PUT | `/:id` | Body: any subset of the POST fields except `type`. → profile. 404; 400 shares of a predefined profile changed or sum ≠ 100; 409 name taken |
| DELETE | `/:id` | 204. 404; 400 predefined; 409 set as default in config |

## 11. Configuration `/api/v1/config`

Keys use snake_case (they are stored keys, not JSON fields). All values are sent and returned as strings.

| Key | Validation | Default |
|---|---|---|
| `accounting_period` | `calendar` \| `july-june` \| `november-october` | `calendar` |
| `management_fee_pct` | number ≥ 0 | `3` |
| `default_heating_profile_id` | existing heating profile | `null` |
| `default_distribution_key_id` | existing distribution key | `null` |
| `company_name` | ≤ 255 chars | `""` |
| `company_address` | ≤ 500 chars | `""` |
| `company_postal_code` | 4 digits | `""` |
| `company_city` | ≤ 100 chars | `""` |
| `iban` | CH or LI IBAN, 21 characters, MOD-97 checksum | `""` |
| `payment_deadline_days` | 7–90 | `30` |
| `reminder_after_days` | 7–60 | `14` |
| `default_language` | `de` \| `fr` \| `it` \| `rm` \| `en` | `de` |

| Method | Path | Notes |
|---|---|---|
| GET | `/` | → `{ data: { <key>: value }, keys: [...] }` (defaults filled in) |
| GET | `/:key` | → `{ key, value, type, default }`. 404 unknown key |
| PUT | `/` | Body: any of the keys above. → `{ message, data }`. 400 `{ error, errors: { <key>: message } }`; then nothing is saved. Valid values are written in one transaction, so a failing write saves none (500) |
| PUT | `/:key` | Body: `{ value }`. → `{ message, key, value }`. 404 unknown key; 400 invalid value |
| DELETE | `/:key` | Resets to default. → `{ message, key, value }` (the default). 404 unknown key |

## 12. Utility statements `/api/v1/statements`

### Status

Stored status is `draft`, `sent` or `paid`; `overdue` is never stored. Responses report an **effective status**: a `sent` statement whose `paymentDeadline` is past is returned as `overdue`.

Transitions (`PUT /:id/status`, checked against the effective status): `draft → sent`, `sent → paid`, `overdue → paid`; `paid` is final. Anything else is 400 `Invalid status transition from X to Y`.

Only **drafts** can be deleted or get line items; amounts (`totalCosts`, `totalAdvancePayments`, `managementFeePercent`, `managementFee`, `balance`) of non-drafts cannot change; no route accepts them, `updateStatement` rejects them in the service.

Filter `status` in `GET /` and `/counts`: `draft`, `paid`, `sent` (sent, deadline not past or none), `overdue` (sent, deadline past), `open` (all `sent`, overdue included).

### Endpoints

| Method | Path | Notes |
|---|---|---|
| GET | `/` | Query: `search`, `contractId`, `buildingId`, `apartmentId`, `tenantId`, `status`, `periodStart`, `periodEnd`, `limit` (default 20), `offset`. → `{ data, total, limit, offset }`; items include `tenant`, `apartment`, `building`, `lineItems`, `heatingProfileId`, `managementFeePercent` (no PDF; see `tests/contracts/period-statements.json`) |
| GET | `/counts` | Query: the filters of `GET /` except `status` (`search`, `contractId`, `buildingId`, `periodStart`, `periodEnd`), so the counts match the list. → `{ draft, sent, paid, overdue, total }` |
| POST | `/preview` | Body: calculation input (below). Stores nothing. → `{ preview: true, contractId, apartmentId, tenantId, periodStart, periodEnd, rentalDays, totalPeriodDays, lineItems, subtotal, managementFee, managementFeePercent, totalCosts, totalAdvancePayments, balance }` (numbers; positive balance = tenant owes). 400 with a code; `CALCULATION_FAILED` for any reason without one (logged) |
| POST | `/generate` | Body: calculation input + `buildingId`. Synchronous, one contract: calculates and stores a **draft** with line items and a payment deadline of `payment_deadline_days`. → **201** statement. 400 with a code (e.g. `CONTRACT_NOT_IN_PERIOD`); `CALCULATION_FAILED` for any reason without one (logged) |
| GET | `/:id` | → statement with `tenant`, `apartment`, `building`, `lineItems`, `heatingProfile { id, name, nameDE, nameFR, nameIT, nameEN } \| null` (see `tests/contracts/statement.json`). 404 |
| PUT | `/:id` | Body: optional `notes`, `paymentDeadline` (date). → statement. 404; 400 date that does not exist; 422 deadline not YYYY-MM-DD. A changed deadline discards the stored PDF |
| PUT | `/:id/status` | Body: `status` required; optional `paidDate`, `paidAmount`, `reminderSentDate`. → statement. 404; 400 invalid transition |
| DELETE | `/:id` | 204. 404; 400 not a draft |
| POST | `/:id/line-items` | Body: `items: [{ description, totalAmount, tenantShare, categoryId?, distributionKeyId?, sharePercentage?, sortOrder? }]` (amounts as strings). → 201 `{ message, items }`. 400 not found or not a draft |
| POST | `/:id/generate-pdf` | Body: optional `language` (`de`\|`fr`\|`it`\|`rm`\|`en`; default tenant language, then `de`). Renders the PDF with Swiss QR-bill and stores it. → `{ success: true, message, qrReference, pdfSize }`. 404 `STATEMENT_NOT_FOUND`; 400 `IBAN_MISSING`, `IBAN_INVALID`; 500 `PDF_FAILED` |
| GET | `/:id/pdf` | → `application/pdf` attachment `statement-<number>.pdf`, made first when missing or (a draft) dated another day. 404 `STATEMENT_NOT_FOUND`; 400 `IBAN_MISSING`, `IBAN_INVALID`; 500 `PDF_FAILED` |
| GET | `/:id/pdf/base64` | → `{ pdfBase64, mimeType: "application/pdf" }`. 404 as above |

**Calculation input:** `contractId`, `periodStart`, `periodEnd` required; optional `heatingProfileId`, `managementFeePercent` (number ≥ 0, overrides `management_fee_pct`). The Verwaltungspauschale is that percentage of the tenant's own utility costs.

## 13. Reminders and documents `/api/v1`

| Method | Path | Notes |
|---|---|---|
| POST | `/statements/:id/reminders` | No body. Creates the next reminder letter (levels 1–3) as a PDF document and delivers it via the tenant's `correspondenceChannel`: e-mail is sent right away (status `sent`, or `deliveryError` set if sending fails); `letter` stays `to_send` for printing. Sets the statement's `reminderSentDate`. → **201** `{ document, deliveryError? }`. 404 statement; 400 statement not sent/overdue, or 3 reminders already sent |
| POST | `/tenants/:id/documents` | Uploads a file to the tenant (Hochgeladenes Dokument). Body: `title` (empty: the file name without its extension), `fileName`, `content` (Base64). The kind is told by the first bytes: PDF, JPEG or PNG, at most 10 × 1024 × 1024 bytes; title at most 255 characters, a longer file name keeps its last 255. → **201** document (`type: upload`, no `channel`, no `status`). 400 `DOCUMENT_TYPE_NOT_ALLOWED`, `DOCUMENT_TOO_LARGE`, `DOCUMENT_TITLE_TOO_LONG`; 404 `TENANT_NOT_FOUND` |
| GET | `/documents` | Query: `tenantId`, `statementId`, `status` (`sent`\|`to_send`). → `{ data: [document] }`, newest first; `status` never lists uploads |
| GET | `/documents/:id/pdf` | → the file as an attachment with its `mimeType` (PDF, JPEG or PNG); `filename*` carries a name outside ASCII. 404 |
| DELETE | `/documents/:id` | Deletes an uploaded document. → `{ success: true }`. 404; 409 `DOCUMENT_NOT_DELETABLE` for a reminder |
| PUT | `/documents/:id/sent` | Marks a printed letter as posted (`status: sent`, `sentAt`). → document. 404, also for an upload |

Document fields: `id, tenantId, statementId, type ("reminder" | "upload"), reminderLevel, title, fileName, mimeType, channel, status, sentAt, deliveryError, deliveryErrorCode, createdAt, tenantName, statementNumber` (the file itself only via `/pdf`; `channel` and `status` are null for an upload). Deleting a tenant without contracts (`DELETE /tenants/:id`) deletes their uploaded documents too.

## 14. Dashboard `/api/v1/dashboard`

`GET /api/v1/dashboard` →

```
{
  portfolio: { totalBuildings, totalApartments, occupiedApartments, vacantApartments, reletApartments, reservedApartments, occupancyRate },
  financial: { outstandingStatements, totalPending, overdueAmount, paidThisMonth },
  statements: { draft, sent, paid, overdue },
  recentActivity: [{ id, type: "statement_created"|"invoice_added"|"payment_received", title, description, timestamp }],  // max 5
  buildingOccupancy: [{ buildingId, buildingName, totalApartments, occupiedApartments, occupancyRate }]
}
```

`occupancyRate` is a percentage with one decimal. `totalPending`/`overdueAmount` sum positive balances of open/overdue statements; `paidThisMonth` sums `paidAmount` of statements paid since the 1st of the month.

---

## 15. BFF and authentication (SvelteKit, port 3000)

### Login flow

| Method | Path | Notes |
|---|---|---|
| GET | `/auth/login?provider=google\|microsoft[&redirectTo=/path]` | Sets the OAuth state cookie and redirects (302) to the provider. Invalid or missing provider: 400; provider not configured: 303 to `/login?error=unavailable` |
| GET | `/auth/callback?code&state` | Validates `state`, exchanges the code, issues the JWT, sets session and XSRF cookies, 303 to `redirectTo` (default the dashboard). Any failure: 303 to `/login?error=failed` (or `cancelled`) |
| GET | `/auth/me` | → `{ user: { sub, email, name, provider, picture? } }`. 401 |
| POST | `/auth/refresh` | Requires `X-XSRF-TOKEN`. Issues a new JWT and XSRF token. → `{ success: true, xsrfToken }`. 400 bad XSRF; 401 |
| POST | `/auth/logout` | Clears the auth cookies (also without a valid XSRF token). → `{ success: true }` |

The root layout (`src/routes/+layout.svelte`) calls `/auth/refresh` every 50 minutes while signed in and sends the user to `/login` if it fails.

### Cookies

| Cookie | Content | Flags |
|---|---|---|
| `dwello_session` | JWT | HTTPOnly; `maxAge` = `JWT_EXPIRY` |
| `dwello_xsrf` | XSRF token | readable by JS; `maxAge` = `JWT_EXPIRY` |
| `dwello_oauth_state` | OAuth state | HTTPOnly; 10 min |
| `dwello_login` | provider and `redirectTo` during login | 10 min |

All on path `/`; `Secure` from `COOKIE_SECURE`, `SameSite` from `COOKIE_SAME_SITE` (default `lax`), domain from `COOKIE_DOMAIN`.

### JWT

HS256 signed with `JWT_SECRET` (≥ 32 chars). Claims: `sub`, `email`, `name`, `provider`, `picture?`, `iat`, `exp`, `iss: "dwello"`, `aud: "dwello-app"`. Lifetime `JWT_EXPIRY` (`<n>s|m|h|d`, default `7d`). The BFF and the backend both verify signature, expiry, issuer and audience; the backend also checks the claim shape.

### XSRF and proxy

- Double-submit: `POST`/`PUT`/`DELETE`/`PATCH` to the BFF must send header `X-XSRF-TOKEN` equal to the `dwello_xsrf` cookie; otherwise 400. `apiCall()` in `src/lib/api.ts` adds it.
- `hooks.server.ts`: without a valid session, pages redirect to `/login?redirectTo=…` and `/api/*` returns 401. Server-side `fetch` to the backend origin gets the JWT added as `Authorization` header.
- `/api/<resource>` routes forward to `/api/v1/<resource>` with the same query/body and return the backend's status and body unchanged. Proxied: `buildings`, `apartments`, `tenants`, `contracts`, `categories`, `invoices` (incl. `categorize`, `:id/recategorize`), `distribution-keys`, `statements` (incl. `:id/generate-pdf`; `:id/pdf` answers a refusal as a sentence in the UI language, `text/plain`, like `/statements/:id/pdf`), `config`, `dashboard`; plus `GET /api/apartments/check-number?buildingId&number[&excludeId]` → `{ exists, apartmentId?, number? }`. Everything else is called from `+page.server.ts` loads and actions via `src/lib/server/*.ts`.
- Errors raised in the BFF itself (auth, XSRF, backend unreachable) have the shape `{ error: { code, message } }` (e.g. `JWT_ERROR`, `VALIDATION_ERROR`), unlike the backend's `{ error: "<message>" }`.

---

## 16. Not implemented

- Bulk/async statement generation, job status, ZIP download of several PDFs.
- Contract modifications and contract PDF download (`contractPdf` is only a stored field).
- Financial analytics beyond the dashboard, webhooks, rate limiting, sort parameters.
- Swiss eID login (only Google and Microsoft).
