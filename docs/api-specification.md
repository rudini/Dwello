# Dwello API Specification

Describes the API as implemented. Source of truth: `backend/src/app.ts`, `backend/src/routes/*.ts`, the services in `backend/src/services/`, and the response examples in `tests/contracts/*.json`. When this file and the code disagree, the code wins; fix this file.

Interactive documentation of the backend (generated from the Elysia schemas) is served at **`/swagger`** (OpenAPI JSON at `/swagger/json`) on the backend, without authentication, only outside production: a backend started with `NODE_ENV=production` (the Docker image, `docker-compose.prod.yml`, also a bundle from `bun run build`) answers 404 to both (#720).

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

- **Base path:** `/api/v1`. All endpoints except `GET /health`, `GET /api/v1/invoices/llm-recipient` (provider and country for the public privacy notice), `GET /api/v1/mail-transport` (`{ transport: "smtp" | "resend" | null }`, the configured mail provider for the same notice) and `/swagger` (outside production only) require `Authorization: Bearer <jwt>`; otherwise **401** `{ "message": "Missing or invalid authorization header" }` or `{ "message": "Invalid or expired token" }`.
- **No envelope:** successful responses are the bare resource or a plain object, with **camelCase** field names (e.g. `{ "buildings": [...], "total": 1 }`). The list key differs per router (see each section).
- **Errors:** `{ "error": "<message>", "code"?: "<CODE>", "params"?: { … }, "causes"?: [{ "code", "params" }] }`. `error` is free text (some English, some German). A refusal that can reach the UI also carries a stable `code` and the values in its text as `params` (`backend/src/services/coded-error.ts`); the BFF shows the message `backend_<code in lower case>` from `messages/*.json` in the UI language (`src/lib/backend-error.ts`), otherwise the `error` text. Unexpected errors have no code. Codes:
  - Form checks (H-28, #717; 400 with the first error as `code` and every error in `causes`, each with `params.field`, the form field it is about): building `BUILDING_NAME_REQUIRED`, `BUILDING_ADDRESS_REQUIRED`, `POSTAL_CODE_REQUIRED`, `POSTAL_CODE_DIGITS`, `BUILDING_CITY_REQUIRED`, `BUILDING_CANTON_REQUIRED`, `BUILDING_YEAR_BUILT_INVALID`; its apartments from the Gebäuderegister (`field` `apartments.<index>.<field>`) `APARTMENT_NUMBER_REQUIRED`, `APARTMENT_FLOOR_REQUIRED`, `APARTMENT_AREA_REQUIRED`, `APARTMENT_ROOMS_REQUIRED`, `APARTMENT_AREA_INVALID`, `APARTMENT_ROOMS_INVALID`
  - Form checks of the tenant (H-28, #717, as the building's): `TENANT_FIRST_NAME_REQUIRED`, `TENANT_LAST_NAME_REQUIRED`, `TENANT_EMAIL_INVALID`, `TENANT_EMAIL_REQUIRED` (channel e-mail), `TENANT_ADDRESS_LETTER`, `TENANT_POSTAL_CODE_LETTER`, `TENANT_CITY_LETTER` (channel letter), `POSTAL_CODE_DIGITS`
  - Form checks of the settings (H-28, #717, as the building's; `params.field` is the configuration key): `POSTAL_CODE_DIGITS`, `COMPANY_EMAIL_INVALID`, `IBAN_ENTERED_INVALID`, `MANAGEMENT_FEE_INVALID`, `PAYMENT_DEADLINE_DAYS`, `REMINDER_AFTER_DAYS`; any other invalid value `CONFIG_VALUE_INVALID` without a field
  - Payment: `PAID_DATE_INVALID {date}`, `PAID_DATE_BEFORE_PERIOD_END {date}`, `PAID_DATE_IN_FUTURE {date}`, `STATEMENT_NOT_PAID`, `STATEMENT_PAID_AMOUNT_NOT_OPEN`, `STATEMENT_PAID_AMOUNT_INVALID {amount}`
  - Not found: `APARTMENT_NOT_FOUND`, `BUILDING_NOT_FOUND`, `CATEGORY_NOT_FOUND`, `CONTRACT_NOT_FOUND`, `DISTRIBUTION_KEY_NOT_FOUND`, `HEATING_PROFILE_NOT_FOUND`, `INVOICE_NOT_FOUND`, `STATEMENT_NOT_FOUND`
  - Names and numbers taken (409): `APARTMENT_NUMBER_TAKEN {number}`, `CATEGORY_NAME_TAKEN {name}`, `DISTRIBUTION_KEY_NAME_TAKEN {name}`, `HEATING_PROFILE_NAME_TAKEN {name}`
  - Category change refused (400): `CATEGORY_FUEL_HAS_STOCK`
  - Delete refusals: `CATEGORY_PREDEFINED`, `CATEGORY_HAS_FUEL_STOCK`, `CATEGORY_IN_USE_ONE` / `CATEGORY_IN_USE {count}`, `DISTRIBUTION_KEY_PREDEFINED`, `DISTRIBUTION_KEY_IN_USE_ONE` / `DISTRIBUTION_KEY_IN_USE {count}`, `DISTRIBUTION_KEY_IS_DEFAULT`, `HEATING_PROFILE_PREDEFINED`, `HEATING_PROFILE_IS_DEFAULT`, `STATEMENT_NOT_DRAFT`
  - Distribution keys and formulas: `DISTRIBUTION_KEY_TYPE_FIXED`, `DISTRIBUTION_KEY_FORMULA_FIXED`, `FORMULA_INVALID` (every formula error in `causes`: `[{ code, params }]`, in the order of the text), `FORMULA_REQUIRED`, `FORMULA_UNKNOWN_VARIABLE {variable}`, `FORMULA_NO_VARIABLE`, `FORMULA_INVALID_CHARACTERS {characters}`, `FORMULA_UNOPENED_PARENTHESIS`, `FORMULA_UNCLOSED_PARENTHESIS`, `FORMULA_CONSECUTIVE_OPERATORS`, `FORMULA_DIVISION_BY_ZERO`, `FORMULA_VALUE_MISSING {variable}`, `FORMULA_NOT_A_NUMBER`, `FORMULA_NOT_COMPUTABLE` (the engine's own text only in `error`, for the log), `FORMULA_SAMPLE_FAILED {sample, reason, …}`, `FORMULA_SAMPLE_NEGATIVE {sample}` (`sample`: `FORMULA_SAMPLE_SMALL`, `_MEDIUM`, `_LARGE`), `FORMULA_APARTMENT_FAILED {reason, …}`, `FORMULA_NEGATIVE`, `FORMULA_ALL_ZERO`. The params `cause`, `reason` and `sample` may hold a code, shown as that code's message
  - Heating profiles: `HEATING_PROFILE_SHARES_SUM {sum}`, `HEATING_PROFILE_SHARE_NEGATIVE {month}`, `HEATING_PROFILE_TYPE_FIXED`, `HEATING_PROFILE_SHARES_FIXED`
  - Contracts and statements: `CONTRACT_OVERLAP {contract}`, `CONTRACT_NOTICE_WITHOUT_END`, `CONTRACT_END_BEFORE_START {date}` (`PUT /contracts/:id`: an end before the start, #788), `CONTRACT_END_PAST {date}` (`PUT /contracts/:id`: a new end before today, by the Swiss day, without `confirmPastEnd: true`; a stored end sent again needs none, #788), `CONTRACT_PARTIES_FIXED`, `ADVANCE_DAY_INVALID` (`DELETE /contracts/:id/advance-payments/:validFrom` with a day that does not exist, H-28 #717), `CONTRACT_DRAFT_NOT_AFFECTED` (`PUT /contracts/:id` with `deleteDraft` naming a stored statement the change does not touch; one deleted meanwhile is passed over, H-28 #717), `CONTRACT_STARTED`, `CONTRACT_HAS_STATEMENTS`, `CONTRACT_NOT_IN_PERIOD`, `IBAN_MISSING`, `IBAN_INVALID` (the stored IBAN fails its check when a PDF needs the QR-bill), `CREDITOR_ADDRESS_MISSING` (a PDF or reminder with a payment part while name, postal code or town of the Firmenadresse is missing, #450), `IBAN_COMPANY_ADDRESS_MISSING` (`PUT /config`, `PUT /config/:key`: an IBAN without name, postal code and town of the Firmenadresse, #450), `CALCULATION_FAILED` (preview or generation failed for another reason, logged), `PDF_FAILED` (500: a PDF could not be made for another reason, logged)
  - Invoices: `KI_UNAVAILABLE`, `INVOICE_AMOUNT_NEGATIVE` (400 on POST and PUT `/invoices`: a credit is deducted from its invoice, #451); categories: `KI_PROPOSAL_UNAVAILABLE`, `KI_PROPOSAL_UNSURE`
  - Uploaded documents: `DOCUMENT_TOO_LARGE {megabytes}`, `DOCUMENT_TYPE_NOT_ALLOWED`, `DOCUMENT_TITLE_TOO_LONG {max}`, `TENANT_NOT_FOUND` (404), `DOCUMENT_NOT_DELETABLE`
  - Reminders: `REMINDER_NOT_SENT`, `REMINDER_NOT_OVERDUE`, `REMINDER_REFUND`, `REMINDER_LIMIT`, `REMINDER_TOO_EARLY`, `REMINDER_PREVIOUS_NOT_SENT {reminderLevel}` (the previous reminder is still to send, #449), `REMINDER_STATEMENT_PAID`, `REMINDER_STATEMENT_REPLACED` (`PUT /documents/:id/sent` of a reminder whose statement is paid or replaced since) (`date`: the day from which the next Mahnstufe is possible, `deadline`: the last reminder's Zahlungsfrist, both YYYY-MM-DD); delivery errors as `deliveryErrorCode` of a document: `TENANT_NO_EMAIL`, `MAIL_NOT_CONFIGURED`, `MAIL_DELIVERY_FAILED` (any other failure, also one stored before this code existed; the mail server's text is logged, never stored)
- **Schema validation:** a body, query or path parameter that fails the Elysia `t` schema returns **422** `{ error: 'Invalid request', code: 'VALIDATION_ERROR', params: {} }` (one `onError` in `backend/src/app.ts`); the UI shows `backend_validation_error`.
- **Not found:** a path id that is no UUID (`/buildings/abc`) names no record and returns **404** `{ error: 'Not found', code: 'NOT_FOUND', params: {} }` before its schema or the database sees it; so does an unknown route.
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
| POST | `/` | Body: `name`, `address`, `postalCode`, `city`, `canton` (2 chars); optional `country`, `latitude`, `longitude` (strings), `buildingType`, `yearBuilt` (number), `noTank` (boolean: no tank or decommissioned, #72), `apartments` (array of `{ number, floor, area, rooms }` as entered: `floor` a number or text, `area` and `rooms` with a comma or a point; created vacant with the building in one transaction, #479). The form's checks (H-28, #717): name, address, PLZ, Ort and Kanton not empty, the PLZ 4 digits, `yearBuilt` 1800 to the current year, each apartment's fields not empty, `area` above 0 with at most two decimals (up to 999999.99), `rooms` in half rooms (0.5 to 99.5); a failed check answers **400** with the first error as `code` and every error as `causes: [{ code, params: { field } }]` (`field` as in the form, an apartment's `apartments.<index>.<field>`; see `tests/contracts/building-fields-refused.json`), nothing created. → 201 building. 400 (nothing created); 409 `APARTMENT_NUMBER_TAKEN` when a number occurs twice in `apartments` |
| PUT | `/:id` | Body: any subset of the POST fields; the sent ones are checked as on POST (400 with `causes`). → building. 404 |
| DELETE | `/:id` | 204. 404; 400 if the building still has apartments |
| GET | `/:id/fuel-stocks` | → array of `{ id, buildingId, readingDate, amount, categoryId, createdAt }` by date (Tankbestand, see `tests/contracts/fuel-stocks.json`). 404 building |
| POST | `/:id/fuel-stocks` | Body: `readingDate` (date), `amount` (CHF ≥ 0 with at most two decimals, as typed: «2'650.50», «2650,5», «1'450.-»), `categoryId` (uuid of an allocable category marked `isFuel`, #100). → 201 reading. 400 with the form checks (H-28, #717): `FUEL_STOCK_DATE_REQUIRED` (missing or not a real day), `FUEL_STOCK_AMOUNT_INVALID`; 400 category not allowed; 404 building; 409 `FUEL_STOCK_DATE_TAKEN` (a reading on that day exists) or `FUEL_STOCK_OTHER_CATEGORY` (the building's readings are in another category); 422 invalid body |
| DELETE | `/:id/fuel-stocks/:stockId` | 204. 404; 422 ids not uuids |

## 4. Apartments `/api/v1/apartments`

Apartment `status` is derived from rental contracts: `occupied` (a contract runs today), `relet` (no contract today, but a future one is signed), otherwise the manually set `vacant` or `reserved`. Only `vacant` and `reserved` can be set manually.

| Method | Path | Notes |
|---|---|---|
| GET | `/` | Query: `search` (Wohnungsnummer or building name, ignoring case), `buildingId`, `status` (`occupied`\|`relet`\|`vacant`\|`reserved`), `floor`, `limit` (default 50), `offset`. → `{ apartments, total }`; items include `status`, `nextContractStart`, `currentContractEnd` (last day of the contract running today, A-4), `blocked` (an open-ended contract: no new contract can be recorded, #815), `availableFrom` (the day after the latest Vertragsende while it is still to come, else null; by the Swiss day, #815), `buildingName` |
| GET | `/:id` | → apartment with `building { id, name, address, postalCode, city }`, `currentTenantName`, `currentContractId`, `nextContractId` (the contract the next tenant moves in with, H-28 #717), `nextContractStart`, `currentContractEnd`, `blocked`, `availableFrom` (as in the list). 404 |
| GET | `/:id/history` | → `{ apartment, contracts: [{ id, tenantName, startDate, endDate, baseRent }] }`. 404 |
| POST | `/` | Body: `buildingId` (uuid), `number`, `floor` (number), `area` (string), `rooms` (string), optional `status` (`vacant`\|`reserved`). → 201 apartment. 400 building not found; **409** number already exists in the building |
| PUT | `/:id` | Body: any subset of `number`, `floor`, `area`, `rooms`, `status`. → apartment. 404; 409 duplicate number |
| DELETE | `/:id` | 204. 404; 400 if a current or future contract exists |

## 5. Tenants `/api/v1/tenants`

| Method | Path | Notes |
|---|---|---|
| GET | `/` | Query: `search`, `language`, `status` (`active`\|`inactive`), `limit` (default 50), `offset`. → `{ tenants, total }`; items include `currentApartment`, `currentBuilding`, `isActive` (see `tests/contracts/tenants.json`) |
| GET | `/:id` | → tenant with `currentApartment`, `currentBuilding`, `contractCount`, `isActive`, `isFuture`, `rentalContractId` (the running contract, the latest started; else the next one; H-28 #717), `anonymisedOn` and `anonymisableFrom` (#459: the first day «Mieter anonymisieren» is allowed, 1 January 11 years after the year of the last contract end, sent statement or reminder; null while a contract runs or lies ahead, or once anonymised). 404 |
| POST | `/:id/anonymise` | #459, «Mieter anonymisieren»: Body `firstName`, `lastName` (the replacement name, in the landlord's language). Replaces the name, clears e-mail, phone and Korrespondenzadresse, deletes all documents of the tenant, the statement PDFs and notes, and the contract PDFs and notes; the amounts stay; sets `anonymisedOn`. → `{ success: true }`. 404; 409 `TENANT_NOT_FORMER` (a contract runs or lies ahead), `TENANT_ANONYMISE_TOO_EARLY` (param `date`) |
| GET | `/:id/history` | → `{ tenant, contracts: [{ id, apartmentNumber, buildingName, startDate, endDate, baseRent, isActive }] }`. 404 |
| GET | `/:id/export` | #435, right to data handover (Art. 28 DSG): `{ fileName, dataFile, data, files: [{ path, content }] }`. `data` holds the tenant's name and contact details, contracts (apartment, building, dates, rent, agreed Nebenkosten, notes), statements (positions, totals, Saldo, payments; status `overdue` computed; a draft only here, without a file, statement date and payment deadline), reminders and uploaded documents, without internal ids; `files` (Base64) are the uploads, reminder letters and a stored contract PDF (`contracts[].file`) under `dokumente/` and each statement's PDF as the tenant received it (the e-mailed copy, else the stored PDF, else none) under `abrechnungen/`; folder and file names in the tenant's language. Reads only: no PDF is made. The BFF route `GET /tenants/:id/export` zips it. 404 |
| POST | `/` | Body: `firstName`, `lastName`; optional `email`, `phone`, `language` (`de`\|`fr`\|`it`\|`en`), `address`, `postalCode`, `city` (the Korrespondenzadresse), `country` (ISO 3166 code, default `CH`, #102), `correspondenceChannel` (`email`\|`letter`). The form's checks (H-28, #717): first and last name not empty, `email` in e-mail form, a PLZ in Switzerland or Liechtenstein (`country` `CH` or `LI`; on POST also not sent) 4 digits; with `correspondenceChannel` `email` an e-mail address, with `letter` address, PLZ and Ort (on POST a field not sent counts as empty; a POST without `correspondenceChannel` is stored for letters without this check). A failed check answers **400** with the first error as `code` and every error as `causes: [{ code, params: { field } }]`, one per field (`tests/contracts/tenant-fields-refused.json`), nothing saved. → 201 tenant. 400 |
| PUT | `/:id` | Body: any subset of the POST fields; the sent ones are checked as on POST (400 with `causes`). → tenant. 404 |
| DELETE | `/:id` | 204. 404; 400 if the tenant has an active contract or any contract history |

## 6. Rental contracts `/api/v1/contracts`

| Method | Path | Notes |
|---|---|---|
| GET | `/` | Query: `apartmentId`, `tenantId`, `buildingId`, `status` (`active`\|`ended`\|`future`), `search`, `limit` (default 50), `offset`. → `{ contracts, total }`; items add `status` (`active`\|`ended`\|`future` by the Swiss day, H-28 #717), `tenantName`, `tenantEmail`, `apartmentNumber`, `buildingName`, `buildingAddress`, `oldAddress` (A-5, #114: the tenant moved out and still has the building's street and postal code; also on `GET /:id` and on statements) |
| GET | `/:id` | → contract with the same added fields, `agreedCategoryIds` (#91: the umlagefähige categories the contract agrees) and `advancePayments` (#464: `[{ validFrom, amount }]` by day; `monthlyAdvancePayment` is the one that applies today), `agreedFrom` ({categoryId: date}, #368), `nextSteps` (#788: `{ successor, ended }` while a notice runs, `successor` once a later contract of the apartment is recorded (A-4); after the end `{ successor: false, ended: true }` while the tenant still has the building's address (A-5); else null) and `fixedTermCheck` (#788: an agreed end before today without notice, «Mieter ist ausgezogen» or a later contract of the apartment, A-6) and `proposedAdvanceFrom` (#815: the «Gültig ab» the form proposes for a new Akonto: the next first of a month in a running contract, the Vertragsbeginn of a future one, the last amount's day of an ended one or one ending before that first; #464); by the Swiss day; see `tests/contracts/contract.json`. 404|
| GET | `/:id/agreements` | Query: `periodStart`, `periodEnd` (required). → `[{ categoryId, agreed }]` (#91): the categories with costs for the contract in the period (amounts not summing to 0 over days it rents), `agreed` true, false («nicht vereinbart») or null (not answered; not billed) (see `tests/contracts/contract-agreements.json`). 404 `CONTRACT_NOT_FOUND` |
| PUT | `/:id/agreements` | Body: `categoryId` (uuid), `agreed` (boolean), optional `from` (date, «Vereinbart ab», #368; only with `agreed`): the landlord's answer, stored on the contract; 400 `AGREED_FROM_BEFORE_START` / `AGREED_FROM_AFTER_END` (param `date`). → the body. 404 `CONTRACT_NOT_FOUND`; 422 without `agreed` |
| GET | `/missing-statements` | → `{ [contractId]: [{ start, end }] }` (#211, H-28): per contract the parts of ended Abrechnungsperioden (setting `accounting_period`) since its Vertragsbeginn with Mietstage (after «Abgerechnet bis», #133) and no statement of the contract; a replaced statement covers no days (#120); the latest first (see `tests/contracts/contracts-missing-statements.json`) |
| GET | `/:id/missing-statements` | → `[{ start, end, way: { kind, start, end }, open }]` (A-10, #408 point 2, H-28): as `/missing-statements` for the contract, each with its way into the wizard: `existing` (the period of a statement of the building that holds the days), `whole` (the ended period) or `short` (the days no statement of the building covers); `open` false where a statement of the contract overlaps that period (see `tests/contracts/contract-missing-statements.json`). 404 |
| GET | `/apartment/:apartmentId/active` | Query: `date` (default today). → the contract running on that date. 404 if none |
| GET | `/apartment/:apartmentId/period` | Query: `periodStart`, `periodEnd` (required). → `{ contracts }` overlapping the period (for prorating) |
| POST | `/` | Body: `apartmentId`, `tenantId` (uuid), `startDate`, `baseRent`, `monthlyAdvancePayment` required; optional `endDate`, `terminated` (boolean: `endDate` is the Kündigungstermin of an open-ended contract; default false), `agreedFrom` (#368: {categoryId: date} «Vereinbart ab» of agreed categories; a day before the start or after the end is refused with 400 `AGREED_FROM_BEFORE_START` / `AGREED_FROM_AFTER_END`; given on PUT, it replaces every day), `agreedCategoryIds` (#91: the categories the contract agrees, every other umlagefähige one is stored as not agreed; without it every umlagefähige category is agreed; on PUT the categories it agrees, every other one the contract had answered becomes not agreed, one not answered yet stays so), `additionalRent`, `referenceIndex`, `contractPdf`, `notes`. → 201 contract. 400 apartment/tenant not found or overlap with another contract of the apartment |
| PUT | `/:id` | Body: any subset of the POST fields; `apartmentId`/`tenantId` only with the stored values, another one is refused with 400 code `CONTRACT_PARTIES_FIXED` (a move or a Mieterwechsel is a new contract); `terminated: true` needs an end date (stored or sent), else 400 code `CONTRACT_NOTICE_WITHOUT_END` (also on POST); an end before the start is refused with 400 code `CONTRACT_END_BEFORE_START`, a new end before today (Swiss day) without `confirmPastEnd: true` with 400 code `CONTRACT_END_PAST` (#788; a stored end sent again needs no confirmation); `endDate: null` clears `terminated`, even if `terminated: true` is sent; a new `endDate` without `terminated` keeps the stored flag. `noticeReceivedOn` (date or null, A-3): the day the notice arrived, only with a notice; `endDate: null` or `terminated: false` clears it. `movedOut` (boolean, A-6, #115): «Mieter ist ausgezogen» after an agreed end; any change of `endDate` clears it unless it is sent too. `documentsChecked: true` (#459): a former tenant's documents «Als geprüft markieren», stored as `documentsCheckedOn` (today, Swiss day); any change of `endDate` clears it. `billedUntil` (date or null, #133): «Abgerechnet bis», statements count Mietstage and Akonto from the day after. → contract (list and detail carry `movedOut` and `documentsCheckedOn`). 404; 400 overlap; 409 `{ error, statements: [{ id, statementNumber, status, periodStart, periodEnd, buildingId, covered }] }` (`covered`, #815: the new «Abgerechnet bis» covers the statement's whole period, so its draft is no longer needed) if the new `startDate`/`endDate`/`billedUntil` change the rent days billed by a utility statement of the contract (stored as `rental_start`/`rental_end` on the statement) (see `tests/contracts/contract-end-refused.json`). Body `deleteDraft` (uuid, #141): a draft of the contract that is deleted in the same transaction when it is the only statement the new dates change; any other refusal keeps it `advancePaymentFrom` (#464, with `monthlyAdvancePayment`): the «Gültig ab» of the amount, the first of a month within the contract (400 `ADVANCE_FROM_NOT_MONTH_START`, `ADVANCE_FROM_BEFORE_START`, `ADVANCE_FROM_AFTER_END`); without it, or with the day of the first amount, the first amount changes; 400 `ADVANCE_CHANGES_DRAFT`/`ADVANCE_CHANGES_STATEMENT` (params `from`, `number`, `next`: the first of a month after the last stored statement) when it would change a stored statement's Akonto total and the new total differs from the stored one (`tests/contracts/contract-advance-refused.json`). A new `startDate` moves the first amount there; a start at or after a later amount, or an end before one, is refused with 400 `CONTRACT_START_AFTER_ADVANCE`/`CONTRACT_END_BEFORE_ADVANCE` (param `date`, `tests/contracts/contract-end-advance-refused.json`). |
| DELETE | `/:id` | Query `confirmMistake=true`: the landlord confirmed a contract that has started (`startDate` ≤ today) was entered by mistake (A-7, #116). 204. 404; 409 code `CONTRACT_HAS_STATEMENTS` if a utility statement (any status) bills the contract (see `tests/contracts/contract-delete-refused.json`); 409 code `CONTRACT_STARTED` for a started contract without the confirmation |
| DELETE | `/:id/advance-payments/:validFrom` | #464: deletes a later Akonto; the one before applies again. → `{ success: true }`. 400 `ADVANCE_FIRST_NOT_DELETABLE` for the first, `ADVANCE_DELETE_CHANGES_DRAFT`/`ADVANCE_DELETE_CHANGES_STATEMENT` when a stored statement counts it (`tests/contracts/contract-advance-delete-refused.json`) |

## 7. Categories `/api/v1/categories`

| Method | Path | Notes |
|---|---|---|
| GET | `/` | Query: `search`, `isAllowedUtilityCost` (`true`\|`false`), `limit` (default 100), `offset`. → `{ categories, total }`; items include `invoiceCount` |
| GET | `/allowed` | → array of categories with `isAllowedUtilityCost = true` |
| GET | `/:id` | → category with `invoiceCount`. 404 |
| POST | `/propose` | Body: `name` (1–100) required; optional `description`, `language` (`de`\|`fr`\|`it`\|`en`, the language of `reasoning`, default `de`). The KI's proposal for a new category (#176): → `{ isAllowedUtilityCost, reasoning }` from a confidence of 0.7; **503** without a sure answer: `KI_PROPOSAL_UNAVAILABLE` (no KI, error; trying later can help) or `KI_PROPOSAL_UNSURE` (unusable answer, lower confidence) (#186). The prompt quotes Art. 256 Abs. 1, 256b, 257a, 257b OR and Art. 4 Abs. 3, 5 Abs. 1–2, 6, 6a, 6b, 6c Abs. 3 VMWG verbatim (`LEGAL_BASIS` in `backend/src/config/llm.ts`) |
| POST | `/` | Body: `name` (1–100), `isAllowedUtilityCost` (boolean) required; optional `nameDE`, `nameFR`, `nameIT`, `nameEN`, `description`, `sortOrder`, `isHeatingCost`, `isFuel` (Brennstoff, stored only with `isHeatingCost`, #100). → 201. **409** `name` or `nameDE` already used |
| PUT | `/:id` | Body: any subset. → category. 404; 409. Setting `isAllowedUtilityCost: false` also sets `isValidUtilityCost = false` on its invoices (OR 257a). **400** `CATEGORY_FUEL_HAS_STOCK` when the change would clear `isFuel` (directly or with `isHeatingCost: false`) of a category with fuel stocks |
| DELETE | `/:id` | 204. 404; **409** if invoices use it |

There is no "predefined" flag on categories.

## 8. Invoices `/api/v1/invoices`

| Method | Path | Notes |
|---|---|---|
| GET | `/` | Query: `search`, `buildingId`, `categoryId`, `dateFrom`, `dateTo`, `isValidUtilityCost`, `wasManuallyOverridden` (`true`\|`false`), `periodStart` and `periodEnd` (dates, #454: the invoices that fall into the Abrechnungsperiode by rule 1, allocable and not, the allocable ones first, each with `inPeriod: { start, end, amount }`), `limit` (default 20), `offset`. → `{ invoices, total }` (`llmCategory` is always `null` in the list) |
| GET | `/llm-status` | → `{ llmAvailable: boolean, cache: { size, maxSize } }` |
| GET | `/llm-recipient` | → `{ recipient: { provider, country } \| null, enabled }`; `recipient` is the chosen provider of the KI settings, or of the `LLM_*` variables (#580); `null` when the local KI or none is chosen; `enabled: false` with «Keine KI» or `LLM_ENABLED=false` (#216). Used by the privacy page |
| GET | `/utility-rules` | → `{ maxManagementFeePercent, allowedCategories, notAllowedCategories, notes }` (German texts) |
| POST | `/categorize` | Preview only, stores nothing. Body: `billingEntityName`, `description`, `amount` (string). → `{ category: { id, name, isAllowedUtilityCost } \| null, confidence, isAllowedUtilityCost, reasoning, source: "llm"\|"cache"\|"fallback" }` |
| POST | `/extract` | Preview only, stores nothing (#217). Body: `buildingId` (uuid), `fileName`, `pages` (1–3 images as `data:image/png\|jpeg;base64,…`, rendered by the browser). The LLM reads the pages, then categorizes as `/categorize` does. → `{ invoiceCount, documentType: invoice\|reminder\|credit_note, fields: { billingEntityName, invoiceNumber, invoiceDate, amount, servicePeriodStart, servicePeriodEnd, dueDate, description } (each null when not read), deductedAmount, nonAllocableItems, unsure: [field names read with confidence < 0.7], categorization: { category: { id, name, isAllowedUtilityCost }, confidence, isAllowedUtilityCost, reasoning } \| null, duplicateOf: invoice id with the same Rechnungssteller and Rechnungsnummer in the building \| null }`. 404 `BUILDING_NOT_FOUND`; **502** `EXTRACTION_UNREADABLE` when the LLM answers nothing readable (a second try often works); **503** `EXTRACTION_UNAVAILABLE` when the LLM is disabled or unreachable |
| GET | `/for-statement/:buildingId` | Query: `periodStart`, `periodEnd` (required). → array of the building's invoices with `isValidUtilityCost = true` whose Leistungszeitraum overlaps the period, or without one, dated in it; each with `inPeriod: { start, end, amount }` (its days and amount in the period) |
| GET | `/completeness/:buildingId` | Query: `periodStart`, `periodEnd` (dates, required; end not before start, else 400). Compares the allocable invoices per category with the same dates one year earlier → `{ buildingId, comparedWith: { start, end }, hasComparison, findings: [{ categoryId, categoryName, kind: stock (a Tankbestand reading of the period is missing, its Stichtag not after today) \| tank (heating costs, never a Tankbestand, building not recorded without a tank) \| consumption (a hint on the readings, never a confirmation: negative consumption with `changePercent` null, or the consumption far from the year before's, #73) \| missing \| gap \| new \| deviation, current: { count, total }, previous: { count, total }, missingParts, changePercent, partialCount (the period's invoices whose Leistungszeitraum reaches beyond it) }], lateInvoices, invoicesWithoutServicePeriod, heatingWithoutServicePeriod, oldHeatingRule }`; `heatingWithoutServicePeriod` `[{ id, billingEntityName, description, invoiceDate, amount, categoryId }]`: the period's heating invoices without Leistungszeitraum in a category (not the tank's) whose other invoices have one (#339); `oldHeatingRule` the ids of the sent or paid statements of the period that share their heating costs by the Heizprofil over the whole period while a heating invoice now has a Leistungszeitraum of other days (#335); the first two lists `[{ id, billingEntityName, description, invoiceDate, amount }]` of allocable invoices without Leistungszeitraum, except those in the category of the building's Tankbestand (fuel counts by consumption): `lateInvoices` dated up to 90 days after the period end (#131), `invoicesWithoutServicePeriod` dated in a period shorter than a year, else empty (#134) |
| GET | `/:id` | → invoice with `building`, `category`, `distributionKey`, `llmCategory`, `beleg: { fileName, mimeType, deductedAmount, nonAllocableItems } \| null` (the last two as the KI saw the file on upload, #233; see `tests/contracts/invoice.json`). 404 |
| GET | `/:id/statements` | → `{ billedIn: [{ start, end }], missedIn: [{ start, end }], statements: [{ id, statementNumber, status }] }`: the periods with statements of the invoice's building whose positions bill it (in any state), and those that do not bill it as it is now (an allocable invoice recorded or changed after them); a period can be in both. `statements`: each statement that bills it, with its number and status (overdue computed, #455). Statements created before #96 (no stored invoices) by the time the invoice was recorded. 404 `INVOICE_NOT_FOUND` |
| GET | `/:id/document` | The Beleg (uploaded file) with its `content-type` and file name (`content-disposition: attachment`). 404 `BELEG_NOT_FOUND` without one |
| PUT | `/:id/document` | Adds or replaces the Beleg. Body: `fileName`, `content` (Base64). → invoice. 404 `INVOICE_NOT_FOUND` (checked before the file); 400 `DOCUMENT_TOO_LARGE` (over 10 MB), `DOCUMENT_TYPE_NOT_ALLOWED` (not PDF, JPG or PNG by its first bytes) |
| GET | `/:id/validate` | → `{ isValid, errors, warnings }`; 404 with the same shape if not found |
| POST | `/:id/recategorize` | No body. Asks the LLM again and stores `llmCategoryId`/`llmConfidence`; from confidence 0.85 the suggestion also becomes `categoryId` (as on create; a non-allocable category makes the invoice non-allocable, an exclusion stays; manual override cleared). → `{ success: true, invoice, categorization: { category (name), confidence, isAllowedUtilityCost, reasoning } }`. 404; **503** LLM unreachable or no matching category; 500 other errors |
| POST | `/` | Query: `skipLlm=true` disables categorization. Body below, optionally with `beleg: { fileName, content, deductedAmount?, nonAllocableItems? }` (checked as on `PUT /:id/document` before anything is saved). → 201 invoice. 400 building or category not found, Beleg refused |
| PUT | `/:id` | Body: any subset of the POST fields. → invoice. 404; 400 category not found |
| DELETE | `/:id` | 204. 404 |

**Invoice body:** `buildingId` (uuid), `billingEntityName` (1–255), `description`, `amount` (string), `invoiceDate` required; optional `invoiceNumber`, `billingEntityAddress`, `categoryId`, `llmCategoryId`, `llmConfidence` (string, 0–1), `manualOverrideReason`, `distributionKeyId`, `isValidUtilityCost` (boolean), `servicePeriodStart` and `servicePeriodEnd` (dates or null, Leistungszeitraum: both or none, end not before start, else 400), `dueDate`, `paidDate`, `notes`. Deleting an invoice deletes its Beleg.

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
| `company_phone` | ≤ 50 chars; in the statement's letterhead (#465) | `""` |
| `company_email` | empty or an e-mail address, ≤ 255 chars (#465) | `""` |
| `iban` | CH or LI IBAN, 21 characters, MOD-97 checksum | `""` |
| `payment_deadline_days` | 7–90 | `30` |
| `reminder_after_days` | 7–60 | `14` |
| `default_language` | `de` \| `fr` \| `it` \| `en` | `de` |

| Method | Path | Notes |
|---|---|---|
| GET | `/` | → `{ data: { <key>: value }, keys: [...] }` (defaults filled in) |
| GET | `/:key` | → `{ key, value, type, default }`. 404 unknown key |
| PUT | `/` | Body: any of the keys above, as typed: the fee may have a comma or «%», the IBAN spaces (stored without); an empty value resets its key to the default. → `{ message, data }`. 400 with the form checks (above), or 400 `IBAN_COMPANY_ADDRESS_MISSING` with `params.field` `iban` and `params.missing` (the keys, comma-separated) when the body has an IBAN and name, postal code or town of the Firmenadresse are missing, as sent, emptied or saved (#450); then nothing is saved or reset. Valid values are written in one transaction, so a failing write saves none (500) |
| PUT | `/:key` | Body: `{ value }`. → `{ message, key, value }`. 404 unknown key; 400 invalid value, or `IBAN_COMPANY_ADDRESS_MISSING` for an IBAN without name, postal code or town of the Firmenadresse |
| DELETE | `/:key` | Resets to default. → `{ message, key, value }` (the default). 404 unknown key |

A changed `management_fee_pct` (also a reset to the default; «4.250» equals «4.25») writes a Protokoll entry (#357).

## 11a. Protokoll `/api/v1/audit-log`

Logins and changes that affect statements (#357), each `{ id, occurredAt, action, details }`; `details` is a snapshot of what the entry names (contract `tests/contracts/audit-log.json`):

| `action` | Written by | `details` |
|---|---|---|
| `login` | the BFF after the OAuth callback or a sign-in with password | `provider` (`google` \| `microsoft` \| `local`) |
| `management_fee_changed` | `PUT /config`, `PUT`/`DELETE /config/management_fee_pct` | `from`, `to` |
| `category_allocability_changed` | `PUT /categories/:id` | `categoryId`, `name`, `nameDE`…`nameEN`, `allocable`; when not allocable `invoices` (how many it made not allocable) |
| `invoice_allocability_changed` | `PUT /invoices/:id`, `POST /invoices/:id/recategorize` | `invoiceId`, `description`, `supplier`, `invoiceDate`, `amount`, `building`, `allocable` |
| `payment_reset` | `POST /statements/:id/payment-reset` | `statementId`, `number`, `paidDate` |
| `statement_corrected` | `POST /statements/:id/replace` («Abrechnung berichtigen», #358) | `statementId`, `number` |

| Method | Path | Notes |
|---|---|---|
| GET | `/` | → `{ data: [entry] }`, newest first |
| POST | `/logins` | Body: `{ provider }`. 201; 422 other provider |
| DELETE | `/:id` | 204. 404 |

## 11b. Konto mit Passwort `/api/v1/auth/password`, `/api/v1/local-accounts` (#576)

`/api/v1/auth/password` is public (the BFF calls it before there is a session); the BFF issues the session JWT with `provider: 'local'` and `sub` from the answer. Sessions of a Konto mit Passwort hold only while the account exists and were issued after its password was last set.

| Method | Path | Notes |
|---|---|---|
| GET | `/api/v1/auth/password` | → `{ available }`: whether a Konto mit Passwort exists |
| POST | `/api/v1/auth/password` | Body: `{ email, password }` → `{ sub, email, name }`. 401 `INVALID_CREDENTIALS` (wrong password or unknown address); 423 `ACCOUNT_LOCKED` with `params.until` (ISO time): 5 failed attempts lock for 15 minutes |
| PUT | `/api/v1/local-accounts` | Session required. Body: `{ email, password }`: creates the account or sets a new password (lifts a Sperre, ends older sessions) → `{ email }`; 400 `PASSWORD_TOO_SHORT` (`params.min`) |
| DELETE | `/api/v1/local-accounts/:email` | Session required. 204. 404 |
| GET | `/api/v1/setup` | Public (#577). → `{ needed, kiChoice }`: needed is true while no Konto mit Passwort exists; kiChoice (#620) is false when the operator set the KI (`LLM_*`); the code is never in an answer |
| POST | `/api/v1/setup` | Public (#577). Body: `{ code, email, password, ki? }`: `ki` is `local` (default) or `none` (#620; ignored when the operator set the KI); creates the first Konto mit Passwort with the Einrichtungscode from the server log → 201 `{ sub, email, name }`. 403 `SETUP_CODE_INVALID`; 409 `SETUP_DONE` once an account exists; 423 `SETUP_LOCKED` with `params.until` after 5 wrong codes, for 15 minutes; 400 `PASSWORD_TOO_SHORT` |
| GET | `/api/v1/ki/model` | Session required (#577). → `{ state }`: `ready`, `loading` with `percent`, `failed`, or `unknown` (a KI outside the server, or Ollama does not answer) |
| POST | `/api/v1/ki/model` | Session required (#580). Downloads the local KI's model again → 202 `{ state }` once Ollama answered (at most 5 s); 409 `KI_NOT_LOCAL` while another KI is chosen |
| GET | `/api/v1/ki-settings` | Session required (#580). → `{ mode, baseUrl, model, provider, providerCountry, apiKeyStored, byOperator }`: `local`, `provider` or `none`; never the API key |
| PUT | `/api/v1/ki-settings` | Session required (#580). Body: `{ mode, baseUrl?, apiKey?, model?, provider?, providerCountry?, confirmed? }`; an empty `apiKey` keeps the stored one for the same address. → the settings as GET. 409 `KI_SET_BY_OPERATOR` while an `LLM_*` variable is set; 422 `KI_PROVIDER_INCOMPLETE` with `params.missing` (comma-separated: `baseUrl`, `model`, `provider`, `providerCountry`, `confirmed`); 422 `KI_KEY_FOR_NEW_ADDRESS` (an empty key for a changed address); 422 `KI_ENCRYPTION_KEY_MISSING` (a key without `ENCRYPTION_KEY`). Each save is an audit entry `ki_setting_changed` |
| POST | `/api/v1/ki-settings/check` | Session required (#580). Body as PUT, nothing saved: sends a fixed text and image → `{ result }`: `ok`, `wrong-key` (401/403), `no-images` (400), `unreachable` (no answer, or any other refusal such as 404, 429 or 5xx); 422 `KI_KEY_FOR_NEW_ADDRESS` |

## 12. Utility statements `/api/v1/statements`

### Status

Stored status is `draft`, `sent`, `paid` or `replaced` (#120); `overdue` is never stored. Responses report an **effective status**: a `sent` statement whose `paymentDeadline` is past is returned as `overdue`.

Transitions (`PUT /:id/status`, checked against the effective status): `draft → sent`, `sent → paid`, `overdue → paid`. Anything else is 400 `Invalid status transition from X to Y`. Sending makes and stores the PDF as sent, also when a Saldo of 0 makes the statement `paid` at once. A payment is taken back with `POST /:id/payment-reset` (#92). A replaced statement changes no more: `PUT /:id` refuses it with 400 `STATEMENT_REPLACED`, `PUT /:id/status` as an invalid transition.

Only **drafts** can be deleted or get line items; amounts (`totalCosts`, `totalAdvancePayments`, `managementFeePercent`, `managementFee`, `balance`) of non-drafts cannot change; no route accepts them, `updateStatement` rejects them in the service.

Every statement of `GET /` and `GET /:id` carries `nextReminderFrom`: the day after its last reminder's `paymentDeadline`, from which the next Mahnstufe is possible; `null` without a reminder, after the 3rd, or once paid (#107). It also carries `reminderToSend`: a reminder is still to send, so the next Mahnstufe waits until it is marked sent (#449). Each statement of `GET /` also carries `reminderDue` (#788), by the Swiss day: `null` unless overdue; for an overdue one `true` when a Mahnung is to propose now (after the Mahnfrist `reminder_after_days`, the next after `nextReminderFrom`, none while `reminderToSend`; a Rückerstattung at once, it is never gemahnt), else `false`.

Filter `status` in `GET /` and `/counts`: `draft`, `paid`, `settled` («Erledigt», #448), `sent` (sent, deadline not past or none), `overdue` (sent, deadline past), `open` (all `sent`, overdue included).

### Endpoints

| Method | Path | Notes |
|---|---|---|
| GET | `/` | Query: `search`, `contractId`, `buildingId`, `apartmentId`, `tenantId`, `status`, `periodStart`, `periodEnd`, `limit` (default 20), `offset`. → `{ data, total, limit, offset }`; items include `tenant`, `apartment`, `building`, `lineItems`, `heatingProfileId`, `managementFeePercent`, the billed rent days `rentalStart`/`rentalEnd` (no PDF; see `tests/contracts/statements.json`, `tests/contracts/period-statements.json`) |
| GET | `/counts` | Query: the filters of `GET /` except `status` (`search`, `contractId`, `buildingId`, `periodStart`, `periodEnd`), so the counts match the list. → `{ draft, sent, paid, settled, overdue, total }` |
| GET | `/run` | Query: `buildingId` (uuid), `periodStart`, `periodEnd` (dates, required). The run of a period for a building (H-28): → `{ contracts, withoutFee, overlap, skipped }`: `contracts` with Mietstage in the period (from the day after «Abgerechnet bis», #133), each as in `GET /contracts` plus `billed` (a statement of the contract overlaps the period; one replaced in this very period does not count, #120: the run creates its berichtigte Abrechnung), `movedOut` (its end lies on or before the period's end or today, whichever is later), `fixedTerm` (befristet, not terminated, end not reached, #76) and `shortenedTo` («Abgerechnet bis» where it shortens the Mietstage in the period, else `null`, #453); `withoutFee` `[{ id, tenantName, apartmentNumber }]`: the contracts the run bills without an agreed Verwaltungspauschale (#89); `overlap` `null` or `{ periods, choose, short, vacant, statements }` when the period overlaps a statement period of the building and equals none (#199, #408 point 2: the overlapped periods, those of them in which a contract has Mietstage but no statement, the ended days no statement covers with Mietstage, whether those days have none, how many statements the overlapped periods have); `skipped` `[{ id, tenantName, billedUntil }]`: contracts in the period by their dates whose «Abgerechnet bis» leaves no Mietstage there (#453) (see `tests/contracts/statement-run.json`) |
| GET | `/run-differences` | Query: `buildingId`, `periodStart`, `periodEnd`, `heatingProfileId`, `managementFeePercent`. → `{ statements: [{ id, profile, profileEdited, fee, outdated, fuelStock }] }`: the period's statements that differ from the run's settings (#132, #16), or drafts whose invoices (`outdated`, #454) or Tankbestand (`fuelStock`, #408 point 8) changed since (H-28, #717); see `tests/contracts/statement-run-differences.json` |
| GET | `/run-defaults` | Query: optional `buildingId` (uuid), `periodStart`, `periodEnd` (a link, A-10). → `{ period, buildingId, heatingProfileId, managementFeePercent, preset }`: with a link of real days (start ≤ end) its period, and the Heizprofil and the run's rate of the building's other statements in that period (not replaced; set differently: from the settings, #119; at a tenant change the Heizprofil of the same apartment's statement, #387), `preset { fromStatements, feeFromSettings, differing, profileFromApartment }`; otherwise the last ended period of `accounting_period`, `default_heating_profile_id`, `management_fee_pct`, `buildingId` and `preset` null (see `tests/contracts/statement-run-defaults.json`) |
| POST | `/preview` | Body: calculation input (below). Stores nothing. → `{ preview: true, contractId, apartmentId, tenantId, periodStart, periodEnd, rentalDays, totalPeriodDays, lineItems, subtotal, managementFee, managementFeePercent, totalCosts, totalAdvancePayments, balance, heating, priorPayments, replacesId }` (numbers; positive balance = tenant owes; `heating`: how the heating costs are shared, `{ byDays: true, reason, names }` (#247) or the profile's percent, months, the period's percent and months and names, `null` without a profile or heating costs, #209). 400 with a code; `CALCULATION_FAILED` for any reason without one (logged) |
| POST | `/generate` | Body: calculation input + `buildingId`. Synchronous, one contract: calculates and stores a **draft** with line items and a payment deadline of `payment_deadline_days`. A replaced statement of the contract with the same `periodStart` and `periodEnd` and without a berichtigte Abrechnung is replaced by it (`replacesId`); `priorPayments` is what was paid on it and its own replaced ones, and `balance` subtracts it (#120). → **201** statement. 400 with a code (e.g. `CONTRACT_NOT_IN_PERIOD`; `STATEMENT_PERIOD_OVERLAPS` with `building` and `periods` (every overlapped period, dd.mm.yyyy) when the period overlaps a statement period of the building and equals none; a replaced statement keeps its period for the building until its berichtigte Abrechnung, which has the same, #199); `CALCULATION_FAILED` for any reason without one (logged) |
| GET | `/:id` | → statement with `tenant`, `apartment`, `building`, `lineItems`, `heatingProfile { id, name, nameDE, nameFR, nameIT, nameEN } \| null`, `heatingShare` (as `heating` of the preview, stored at creation, #209; `null` for statements created before), `paymentResets` (payments taken back, #92), `final` (a Schlussabrechnung: the contract ends within the period, #448), `carriedFrom { id, statementNumber, balance } \| null` (the Übertrag, #448), `offsetWith [{ statementNumber, amount }]` (a replaced Saldo a sent next statement counts as its Übertrag: «Bereits verrechnet mit», #448), `priorPayments`, `replacesId`, `replaces { id, statementNumber, statementDate } \| null`, `replacedBy { id, statementNumber } \| null`, `priorPaidOn` (numbers of the replaced statements of the chain paid on, oldest first; #120), what it allows (#788): `editable` (not replaced), `correctable` (sent, paid, settled or overdue, not replaced), `asksPayment` (not replaced; its berichtigte Abrechnung asks), `superseded` (replaced by a berichtigte Abrechnung: the page names it, #120) (see `tests/contracts/statement.json`). 404 |
| GET | `/:id/changed-invoices` | → `{ invoiceIds, fuelStockChanged, correctionDue, correctionDeclinable, correctionLowers }`: the invoices of the statement's period recorded, changed (amount, days in the period, category or distribution key) or deleted or made non-allocable since it was created, from the invoices each line item stores (`lineItems[].invoices`, #96); for a statement created before, the invoices recorded after it. `fuelStockChanged` (#454): the Tankbestand readings it would take now differ from `fuelStock` (category, dates, values). `correctionDue`: a sent (also overdue), paid or settled statement with such a change whose recalculation changes the Saldo or the tenant's share of a position, unless declined for that result; one that cannot be recalculated any more is due by the change alone. `correctionDeclinable`: due and the recalculation does not lower the Saldo as claimed (below CHF 5 counts as 0, but in a Schlussabrechnung); `correctionLowers`: due and it lowers it. 404 `STATEMENT_NOT_FOUND` |
| GET | `/outdated` | → `{ statements }` (#454): the drafts with a changed invoice or Tankbestand and the statements whose correction is due, each `{ id, statementNumber, tenantName, status, buildingId, building, periodStart, periodEnd, invoices, fuelStock, olderThanFiveYears }`; `olderThanFiveYears`: the period ended more than five calendar years before the Swiss day, the 29th of February counting as the 28th (#788) |
| POST | `/:id/decline-correction` | «Nicht berichtigen» (#454): stores `correctionDeclined: { on, result }` → 200 statement. 404 `STATEMENT_NOT_FOUND`; 409 `STATEMENT_CORRECTION_NOT_DUE`, `STATEMENT_CORRECTION_NOT_RECALCULABLE`, `STATEMENT_CORRECTION_LOWERS_BALANCE` |
| PUT | `/:id` | Body: optional `notes`, `paymentDeadline` (date). → statement. 404; 400 date that does not exist, `STATEMENT_REPLACED`; 422 deadline not YYYY-MM-DD. A changed deadline or remark discards the stored PDF (#448: the PDF prints the remark) |
| POST | `/:id/send` | Sends a draft (#86). Tenant with `correspondenceChannel: email`: the PDF, dated today with the Zahlungsfrist from today, is e-mailed in the tenant's language and stored as a document (`type: statement`, `channel: email`, `status: sent`, `recipient`); otherwise, or with body `byLetter: true`, the statement is marked sent as with `PUT /:id/status` and its PDF as sent is stored as a document (`channel: letter`, #449); without its PDF the letter is refused like the e-mail (`IBAN_MISSING`, `IBAN_INVALID`, `CREDITOR_ADDRESS_MISSING`, #491). → `{ statement, document? }`. A failed e-mail leaves it a draft without a document (its PDF re-dated today, as viewing a draft's PDF does): 400 `STATEMENT_TENANT_NO_EMAIL`, `STATEMENT_MAIL_NOT_CONFIGURED`, `STATEMENT_MAIL_FAILED`; 400 `STATEMENT_ALREADY_SENT`, `IBAN_MISSING`; 404 `STATEMENT_NOT_FOUND` |
| PUT | `/:id/status` | Body: `status` required; optional `paidDate`, `paidAmount`, `reminderSentDate`. Paid without `paidAmount` stores the Saldo (#93). `paidDate` is a real day from the end of the Abrechnungsperiode (`periodEnd`) up to today (Swiss day), else 400 `PAID_DATE_INVALID {date}`, `PAID_DATE_BEFORE_PERIOD_END {date}` (the period end), `PAID_DATE_IN_FUTURE {date}` (today) (#138, #448; a day before the Abrechnungsdatum is confirmed in the UI). Sending a statement with a Saldo of 0.00, or below CHF 5 on one that is no Schlussabrechnung, makes it `settled` («Erledigt», #448), which allows no further transition. → statement. 404; 400 invalid transition |
| POST | `/:id/replace` | Replaces a sent, overdue, paid or settled statement (#120, #448): status `replaced`; besides, only `paidAmount` changes: on a settled one (or a refund settled under #94) whose Saldo a sent next statement counts as its Übertrag that Saldo, and a draft that counts it loses the Übertrag. Optional body `paidAmount` (francs, e.g. `"40.00"`, #448): «Bereits bezahlt» on a sent or overdue statement, stored as its `paidAmount` (negative on a refund) and offset by the berichtigte Abrechnung. → statement. 404 `STATEMENT_NOT_FOUND`; 409 `STATEMENT_NOT_REPLACEABLE`, `STATEMENT_PAID_AMOUNT_NOT_OPEN`, `STATEMENT_PAID_AMOUNT_INVALID {amount}` |
| POST | `/:id/correction` | Creates the berichtigte Abrechnung of a replaced statement (#120): a draft of the same contract and period with its heating profile and fee rate, `replaces`, `priorPayments`. → 201 statement. 404 `STATEMENT_NOT_FOUND`; 409 `STATEMENT_NOT_REPLACED`, `STATEMENT_ALREADY_CORRECTED` (`number`), `STATEMENT_NO_RENTAL_DAYS_PAID` / `_REFUNDED` / `_SENT` (`number`, `amount`), `STATEMENT_AGREEMENTS_OPEN` (`categories`: a category with costs whose agreement the contract has not answered, #91) |
| POST | `/:id/recalculation` | Calculates a draft again from the invoices as they are now (#338): same number, statement date, payment deadline, Heizprofil, fee rate and remark; a berichtigte Abrechnung keeps `replaces` and `priorPayments`; the stored PDF is discarded. → 200 statement. 404 `STATEMENT_NOT_FOUND`; 409 `STATEMENT_NOT_RECALCULABLE` (not a draft), `STATEMENT_RECALCULATION_AGREEMENTS_OPEN` (`categories`, #91) |
| POST | `/:id/payment-reset` | Takes back the payment of a paid statement (#92): status `sent` (reported `overdue` after the deadline), `paidDate` and `paidAmount` cleared, a stored PDF made after the payment was recorded (it says «Bezahlt am …») discarded, the reset appended to `paymentResets` (`{ resetOn, paidDate, paidAmount }`). → statement (see `tests/contracts/statement-payment-reset.json`). 404 `STATEMENT_NOT_FOUND`; 400 `STATEMENT_NOT_PAID` |
| DELETE | `/:id` | 204. 404; 400 not a draft |
| POST | `/:id/line-items` | Body: `items: [{ description, totalAmount, tenantShare, categoryId?, distributionKeyId?, sharePercentage?, sortOrder? }]` (amounts as strings). → 201 `{ message, items }`. 400 not found or not a draft |
| POST | `/:id/generate-pdf` | Body: optional `language` (`de`\|`fr`\|`it`\|`en`; default tenant language, then `de`). Renders the PDF with Swiss QR-bill and stores it. → `{ success: true, message, qrReference, pdfSize }`. 404 `STATEMENT_NOT_FOUND`; 400 `IBAN_MISSING`, `IBAN_INVALID`, `CREDITOR_ADDRESS_MISSING`; 500 `PDF_FAILED` |
| GET | `/:id/pdf` | → `application/pdf` attachment `<number>.pdf` (#101), made first when missing, a draft's made afresh each time (the tenant's address and the settings as they are now); sending makes the PDF as sent at that moment and keeps it (made on the first request instead if it fails then); `POST /:id/generate-pdf` makes it again with today's data (the UI does not offer that for a stored PDF; daten-pruefer D-1). 404 `STATEMENT_NOT_FOUND`; 400 `IBAN_MISSING`, `IBAN_INVALID`, `CREDITOR_ADDRESS_MISSING`; 500 `PDF_FAILED` |
| GET | `/:id/pdf/base64` | → `{ pdfBase64, mimeType: "application/pdf" }`. 404 as above |

**Calculation input:** `contractId`, `periodStart`, `periodEnd` required; optional `heatingProfileId`, `managementFeePercent` (number ≥ 0, overrides `management_fee_pct`). The Verwaltungspauschale is that percentage of the tenant's own utility costs.

## 13. Reminders and documents `/api/v1`

| Method | Path | Notes |
|---|---|---|
| POST | `/statements/:id/reminders` | No body. Creates the next reminder letter (levels 1–3) as a PDF document in the tenant's `language` (title, file name, PDF and e-mail; #106) and delivers it via the tenant's `correspondenceChannel`: e-mail is sent right away (status `sent`, or `deliveryError` set if sending fails); `letter`, or `email` without an e-mail address (no e-mail tried, `channel: letter`, #449), stays `to_send` for printing. Sets the statement's `reminderSentDate`. → **201** `{ document, deliveryError? }`. 404 statement; 400 statement not sent/overdue, 3 reminders already sent, or the last reminder's `paymentDeadline` not yet passed; 400 `CREDITOR_ADDRESS_MISSING` (its payment part without name, postal code or town of the Firmenadresse, #450) |
| POST | `/tenants/:id/documents` | Uploads a file to the tenant (Hochgeladenes Dokument). Body: `title` (empty: the file name without its extension), `fileName`, `content` (Base64). The kind is told by the first bytes: PDF, JPEG or PNG, at most 10 × 1024 × 1024 bytes; title at most 255 characters, a longer file name keeps its last 255. → **201** document (`type: upload`, no `channel`, no `status`). 400 `DOCUMENT_TYPE_NOT_ALLOWED`, `DOCUMENT_TOO_LARGE`, `DOCUMENT_TITLE_TOO_LONG`; 404 `TENANT_NOT_FOUND` |
| GET | `/tenants/:id/former-documents` | #178, #788: once every contract of the tenant has ended (by the Swiss day) and the last one was terminated, marked «Mieter ist ausgezogen» or followed by a later contract for the apartment (A-6), the uploads from before its Vertragsende (Swiss upload day). → `{ formerDocuments: { endDate, documentIds, contractId, checkedOn } }` (`contractId`, `checkedOn`: the last contract and its «Als geprüft markieren» day, #459), else `{ formerDocuments: null }`, also for an unknown tenant |
| GET | `/documents` | Query: `tenantId`, `statementId`, `status` (`sent`\|`to_send`). → `{ data: [document] }`, newest first; `status` never lists uploads; each document has `recipient` and `notToSend` (`paid`\|`replaced`\|`null`: a reminder to send whose statement is paid or replaced since, which `status=to_send` leaves out, #449) |
| GET | `/documents/:id/pdf` | → the file as an attachment with its `mimeType` (PDF, JPEG or PNG); `filename*` carries a name outside ASCII. 404 |
| DELETE | `/documents/:id` | Deletes an uploaded document. → `{ success: true }`. 404; 409 `DOCUMENT_NOT_DELETABLE` for a reminder |
| PUT | `/documents/:id/sent` | Marks a printed letter as posted (`status: sent`, `sentAt`). A reminder still `to_send` is remade with today's letter date and `paymentDeadline` (today + 10 days), its `channel` becomes `letter` (also after a failed e-mail) and the statement's `reminderSentDate` today. → document. 404, also for an upload; 400 `CREDITOR_ADDRESS_MISSING` when the remade reminder's payment part lacks name, postal code or town of the Firmenadresse (#450) |

Document fields: `id, tenantId, statementId, type ("reminder" | "statement" | "upload"), reminderLevel, title, fileName, mimeType, channel, status, sentAt, deliveryError, deliveryErrorCode, paymentDeadline, createdAt, tenantName, statementNumber` (the file itself only via `/pdf`; `channel`, `status` and `paymentDeadline` (the Zahlungsfrist a reminder prints) are null for an upload). Deleting a tenant without contracts (`DELETE /tenants/:id`) deletes their uploaded documents too.

## 14. Dashboard `/api/v1/dashboard`

`GET /api/v1/dashboard` →

```
{
  portfolio: { totalBuildings, totalApartments, occupiedApartments, vacantApartments, reletApartments, reservedApartments, occupancyRate },
  financial: { outstandingStatements, totalPending, overdueAmount, paidThisMonth },
  statements: { draft, toSend, sent, paid, settled, overdue },
  recentActivity: [{ id, type: "statement_created"|"invoice_added"|"payment_received", title, description, timestamp }],  // max 5
  buildingOccupancy: [{ buildingId, buildingName, totalApartments, occupiedApartments, occupancyRate }]
}
```

`occupancyRate` is a percentage with one decimal. `totalPending`/`overdueAmount` sum positive balances of open/overdue statements; `paidThisMonth` sums `paidAmount` of statements paid since the 1st of the month. `toSend` counts the drafts to send: the current ones, without those outdated by invoices or a Tankbestand changed since (#454; H-28 #717: the overview takes it, see `tests/contracts/dashboard.json`). `contractTasks` (#788) names the overview's tasks about contracts, by the Swiss day: `noticedContracts` (a notice with no later contract for the apartment, also after the end; A-4), `expiredContracts` (an agreed end before today without notice, «Mieter ist ausgezogen» or a later contract; A-6, as `fixedTermCheck` of `GET /contracts/:id`) and `formerTenants` (`{ tenantId, tenantName, endDate, count }`: uploads from before the last Vertragsende not yet checked; #178, #459, as `GET /tenants/:id/former-documents`), `oldAddresses` (`{ tenantId, tenantName }`, once per tenant: drafts that would go to the apartment a moved-out tenant left; A-5, #114) and `missingStatements` (`{ building, buildingId, periods: [{ start, end }] }`, by building name: the parts of ended Abrechnungsperioden without a statement, each once and the latest first, as `GET /contracts/missing-statements`; #211).

---

## 15. BFF and authentication (SvelteKit, port 3000)

### Login flow

| Method | Path | Notes |
|---|---|---|
| GET | `/auth/login?provider=google\|microsoft[&redirectTo=/path]` | Sets the OAuth state cookie and redirects (302) to the provider. Invalid or missing provider: 400; provider not configured: 303 to `/login?error=unavailable` |
| GET | `/auth/callback?code&state` | Validates `state`, exchanges the code, issues the JWT, sets session and XSRF cookies, 303 to `redirectTo` (default the dashboard). Any failure: 303 to `/login?error=failed` (or `cancelled`) |
| GET | `/auth/me` | → `{ user: { sub, email, name, provider } }`. 401 |
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

HS256 signed with `JWT_SECRET` (≥ 32 chars). Claims: `sub`, `email`, `name`, `provider`, `iat`, `exp`, `iss: "dwello"`, `aud: "dwello-app"`. Lifetime `JWT_EXPIRY` (`<n>s|m|h|d`, default `7d`). The BFF and the backend both verify signature, expiry, issuer and audience; the backend also checks the claim shape.

### XSRF and proxy

- Double-submit: `POST`/`PUT`/`DELETE`/`PATCH` to the BFF must send header `X-XSRF-TOKEN` equal to the `dwello_xsrf` cookie; otherwise 400. `apiCall()` in `src/lib/api.ts` adds it.
- `hooks.server.ts`: without a valid session, pages redirect to `/login?redirectTo=…` and `/api/*` returns 401. Server-side `fetch` to the backend origin gets the JWT added as `Authorization` header.
- `/api/<resource>` routes forward to `/api/v1/<resource>` with the same query/body and return the backend's status and body unchanged. Proxied: `buildings`, `apartments`, `tenants`, `contracts`, `categories`, `invoices` (incl. `categorize`, `:id/recategorize`), `distribution-keys`, `contracts/:id/agreements` (PUT), `statements` (incl. `:id/generate-pdf`; `:id/pdf` answers a refusal as a sentence in the UI language, `text/plain`, like `/statements/:id/pdf`), `config`, `dashboard`; plus `GET /api/addresses?q=` → addresses of the Gebäuderegister (api3.geo.admin.ch, `GEO_ADMIN_URL`) `[{ egid, street, postalCode, city, canton }]` and `GET /api/addresses/:egid` → `{ buildingType, yearBuilt, apartments: [{ number, floor, area, rooms, missing }] }`, both 502 when the register cannot be reached (#479, `src/lib/server/building-register.ts`); `GET /api/apartments/check-number?buildingId&number[&excludeId]` → `{ exists, apartmentId?, number? }` and `GET /api/statements/agreements?buildingIds&periodStart&periodEnd` → per contract of the run `{ contractId, tenantName, apartmentNumber, open, notAgreed }` (#91, wizard step 3). Everything else is called from `+page.server.ts` loads and actions via `src/lib/server/*.ts`.
- Errors raised in the BFF itself (auth, XSRF, backend unreachable) have the shape `{ error: { code, message } }` (e.g. `JWT_ERROR`, `VALIDATION_ERROR`), unlike the backend's `{ error: "<message>" }`.

---

## 16. Not implemented

- Bulk/async statement generation, job status, ZIP download of several PDFs.
- Contract modifications and contract PDF download (`contractPdf` is only a stored field).
- Financial analytics beyond the dashboard, webhooks, rate limiting, sort parameters.
- Swiss eID login (only Google and Microsoft).
