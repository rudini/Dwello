# Dwello Data Model & Database Schema

Describes the PostgreSQL schema as created by `backend/migrations/0001_schema.sql` and seeded by `backend/migrations/0002_stammdaten.sql`. The Drizzle mapping is `backend/src/db/schema.ts`; it is kept in
sync with the migrations by hand. Domain terms follow `UBIQUITOUS_LANGUAGE.md`.

---

## Overview

- **PostgreSQL:** >= 15 (Docker Compose and CI use `postgres:16-alpine`).
- **Extension:** `uuid-ossp`. Primary keys are `UUID DEFAULT uuid_generate_v4()`, except `documents`
  (`gen_random_uuid()`).
- **Timestamps:** `TIMESTAMP` without time zone, `NOT NULL DEFAULT NOW()`. A trigger
  (`update_updated_at_column()`) sets `updated_at` on every update for all tables that have the column.
- **Money:** `DECIMAL(10,2)` (contract rents) or `DECIMAL(12,2)` (invoices, statements), always CHF; no
  currency column and no `_chf` suffix.
- **Enums:** plain `VARCHAR` columns; some have a `CHECK` constraint (listed per table), others are checked
  only in the application.
- **Files:** PDFs are stored in `TEXT` columns (Base64).

## Relationships

```
buildings 1─n apartments 1─n rental_contracts n─1 tenants
rental_contracts 1─n contract_categories n─1 categories
buildings 1─n invoices ──> categories (category_id, llm_category_id), distribution_keys
buildings 1─n fuel_stocks

utility_statements ──> tenants, apartments, rental_contracts (contract_id)
utility_statements 1─n utility_statement_line_items ──> categories, distribution_keys
documents ──> tenants, utility_statements (optional)

heating_profiles, configuration, audit_log, ki_settings, access_keys: no foreign keys
```

| Foreign key | On delete |
|---|---|
| `apartments.building_id` → `buildings` | CASCADE |
| `rental_contracts.apartment_id` → `apartments` | CASCADE |
| `rental_contracts.tenant_id` → `tenants` | RESTRICT |
| `invoices.building_id` → `buildings` | CASCADE |
| `invoices.category_id`, `invoices.llm_category_id` → `categories` | SET NULL |
| `invoices.distribution_key_id` → `distribution_keys` | SET NULL |
| `contract_categories.contract_id` → `rental_contracts`, `.category_id` → `categories` | CASCADE |
| `contract_advance_payments.contract_id` → `rental_contracts` | CASCADE |
| `fuel_stocks.building_id` → `buildings` | CASCADE |
| `fuel_stocks.category_id` → `categories` | RESTRICT (deleting such a category answers 409) |
| `utility_statements.tenant_id` / `apartment_id` / `contract_id` | RESTRICT |
| `utility_statement_line_items.statement_id` → `utility_statements` | CASCADE |
| `utility_statement_line_items.category_id` / `distribution_key_id` | SET NULL |
| `documents.tenant_id` → `tenants`, `documents.statement_id` → `utility_statements` | RESTRICT |

Because statements reference their apartment and contract with RESTRICT, a building, apartment or contract
that has statements cannot be deleted (the cascade from `buildings`/`apartments` stops there).

---

## Tables

Every table below also has `id`, `created_at` and (unless noted) `updated_at`; they are omitted from the
listings.

### buildings (Gebäude)

```sql
name          VARCHAR(255) NOT NULL
address       VARCHAR(500) NOT NULL
postal_code   VARCHAR(10)  NOT NULL
city          VARCHAR(100) NOT NULL
canton        VARCHAR(2)   NOT NULL
country       VARCHAR(2)   NOT NULL DEFAULT 'CH'
latitude      DECIMAL(10,7)
longitude     DECIMAL(10,7)
building_type VARCHAR(50)            -- Gebäudetyp
year_built    INTEGER                -- Baujahr
no_tank       BOOLEAN      NOT NULL DEFAULT false -- kein Tank oder Tank stillgelegt: no Tankbestand asked for periods without readings (#72)
```

Index: `buildings_city_idx (city)`.

### apartments (Wohnung)

```sql
building_id UUID NOT NULL REFERENCES buildings ON DELETE CASCADE
number      VARCHAR(20)  NOT NULL          -- Wohnungsnummer
floor       INTEGER      NOT NULL DEFAULT 0 -- Stockwerk: -1 = UG, 0 = EG
area        DECIMAL(8,2) NOT NULL           -- Fläche in m²
rooms       DECIMAL(3,1) NOT NULL           -- Zimmeranzahl, e.g. 3.5
status      VARCHAR(20)  NOT NULL DEFAULT 'vacant'
CHECK (status IN ('vacant', 'reserved'))
```

Indexes: `apartments_building_id_idx (building_id)`, unique `apartments_building_number_idx (building_id, number)`.

Only the manually set Mietstatus is stored (`vacant` = Leer, `reserved` = Gesperrt). `occupied` and `relet`
are derived from the rental contracts and never stored.

### tenants (Mieter)

```sql
first_name             VARCHAR(100) NOT NULL
last_name              VARCHAR(100) NOT NULL
email                  VARCHAR(255)
phone                  VARCHAR(30)
language               VARCHAR(5)   NOT NULL DEFAULT 'de'
address                VARCHAR(500)  -- Korrespondenzadresse: street with house number
postal_code            VARCHAR(10)
city                   VARCHAR(100)
country                VARCHAR(2)   NOT NULL DEFAULT 'CH'      -- ISO 3166 code of the Korrespondenzadresse (#102)
correspondence_channel VARCHAR(10)  NOT NULL DEFAULT 'letter'  -- Korrespondenzkanal: email | letter
anonymised_on        DATE                                -- «Mieter anonymisieren» (#459): name replaced, contact data and documents removed
CHECK (language IN ('de', 'fr', 'it', 'en'))  -- rm removed in 0012 (#63)
```

No indexes besides the primary key; `email` is not unique. `correspondence_channel` has no CHECK.

### rental_contracts (Mietvertrag)

```sql
apartment_id            UUID NOT NULL REFERENCES apartments ON DELETE CASCADE
tenant_id               UUID NOT NULL REFERENCES tenants ON DELETE RESTRICT
start_date              DATE NOT NULL           -- Vertragsbeginn
end_date                DATE                    -- Vertragsende, NULL = unbefristet
terminated              BOOLEAN NOT NULL DEFAULT FALSE -- end_date is the Kündigungstermin of an open-ended contract, not an agreed end
notice_received_on      DATE              -- the day the notice arrived (A-3, #112), optional; only with terminated
billed_until            DATE              -- «Abgerechnet bis» (#133), optional: billed outside Dwello up to this day; Mietstage and Akonto count from the day after
moved_out               BOOLEAN NOT NULL DEFAULT FALSE -- «Mieter ist ausgezogen» after an agreed end (A-6, #115); cleared when end_date changes
base_rent               DECIMAL(10,2) NOT NULL  -- Nettomiete
additional_rent         DECIMAL(10,2) DEFAULT 0 -- Zusatzmiete (garage, parking)
monthly_advance_payment DECIMAL(10,2) NOT NULL  -- Akonto before #464; the amounts are in contract_advance_payments (read: the one that applies today)
flat_rate_utility_charge DECIMAL(10,2) NOT NULL DEFAULT 0  -- Nebenkostenpauschale (#429): in «Monatlich total», never billed
management_fee_agreed   BOOLEAN NOT NULL DEFAULT FALSE -- Verwaltungspauschale vereinbart (#89)
management_fee_percent  DECIMAL(5,2)            -- own rate 0–10 %, before the run's; NULL: the run's rate
reference_index         DECIMAL(6,4)            -- Referenzindex
contract_pdf            TEXT
notes                   TEXT
CONSTRAINT contracts_dates_check CHECK (end_date IS NULL OR end_date >= start_date)
CONSTRAINT contracts_terminated_check CHECK (NOT terminated OR end_date IS NOT NULL)
CONSTRAINT contracts_notice_received_check CHECK (notice_received_on IS NULL OR terminated)
```

Indexes: `contracts_apartment_id_idx`, `contracts_tenant_id_idx`, `contracts_end_date_idx (end_date)`,
`contracts_dates_idx (start_date, end_date)`.

That contracts of one apartment must not overlap is enforced in the application, not in the database.

### contract_categories (Vereinbarte Nebenkosten, #91)

```sql
contract_id  UUID    NOT NULL  -- rental_contracts (CASCADE)
category_id  UUID    NOT NULL  -- categories (CASCADE)
agreed       BOOLEAN NOT NULL  -- true: the contract agrees the category; false: answered «nicht vereinbart»
agreed_from  DATE              -- «Vereinbart ab» (#368): agreed only from this day; NULL: from the start of the contract
PRIMARY KEY (contract_id, category_id)
```

A statement bills a contract only the categories with `agreed` (Art. 257a Abs. 2 OR); an invoice without a category
is billed as before. A category without a row is not answered yet: not billed, and the statement wizard asks when it
has costs in the period. A new contract gets a row for every umlagefähige category (agreed unless the form unticks
it); a category created or made umlagefähig later has no row. Migration `0020` gave a contract with statements the
categories its statements billed and those of the building's umlagefähige invoices over its tenancy up to its last
statement, and a contract without statements every umlagefähige category.

### contract_advance_payments (Akonto mit «Gültig ab», #464)

```sql
contract_id  UUID          NOT NULL  -- rental_contracts (CASCADE)
valid_from   DATE          NOT NULL  -- «Gültig ab»: the first of a month within the contract; the first row from the Vertragsbeginn
amount       DECIMAL(10,2) NOT NULL  -- Akonto per month from this day until the day before the next row
PRIMARY KEY (contract_id, valid_from)
```

The first amount applies from the Vertragsbeginn, whatever its day; the contract answers as `monthlyAdvancePayment`
the amount that applies today (at the Vertragsbeginn for a future contract, at the Vertragsende for an ended one). A
row with the same day replaces the amount; any row but the first can be deleted. A change that would alter the
Akonto of a stored statement that is not replaced is refused (`ADVANCE_CHANGES_DRAFT`, `ADVANCE_CHANGES_STATEMENT`).
Migration `0026` gave every contract one row from its Vertragsbeginn with its amount.

### categories (Kategorie)

```sql
name                    VARCHAR(100) NOT NULL   -- internal English name
name_de, name_fr, name_it, name_en VARCHAR(100) -- display names
is_allowed_utility_cost BOOLEAN NOT NULL DEFAULT true  -- umlagefähig (OR 257a)
is_heating_cost         BOOLEAN NOT NULL DEFAULT false -- distributed by the heating profile at a tenant change:
                                                       -- Heating, Chimney Sweep; Hot Water by days
is_fuel                 BOOLEAN NOT NULL DEFAULT false -- Brennstoff (#100): only an allocable heating cost category
                                                       -- with it holds a Tankbestand; seeded for Heating, kept while
                                                       -- the category has fuel_stocks
type                    VARCHAR(20) NOT NULL DEFAULT 'predefined' -- predefined (seeded), custom (recorded)
description             TEXT
sort_order              INTEGER DEFAULT 0
```

A category that is not allocable always makes its invoices non-allocable (enforced in the service).

### distribution_keys (Verteilschlüssel)

```sql
name                               VARCHAR(100) NOT NULL
name_de, name_fr, name_it, name_en VARCHAR(100)
type        VARCHAR(20) NOT NULL DEFAULT 'predefined'
formula     TEXT        -- variables {area}, {rooms}, {units}, {volume} and the building sums {area_total}, {rooms_total}, {units_total}, {volume_total}
description TEXT
sort_order  INTEGER DEFAULT 0
CHECK (type IN ('predefined', 'custom'))
```

### heating_profiles (Heizprofil)

```sql
name                               VARCHAR(100) NOT NULL
name_de, name_fr, name_it, name_en VARCHAR(100)
type         VARCHAR(20)  NOT NULL DEFAULT 'predefined'
january_pct … december_pct  DECIMAL(5,2) NOT NULL   -- 12 columns, one per month
description  TEXT
source_de, source_fr, source_it, source_en  TEXT   -- where the monthly shares come from (#465); predefined profiles only
CHECK (type IN ('predefined', 'custom'))
```

The twelve percentages should sum to 100; this is not a database constraint (the seeded profiles all do).

### invoices (Rechnung)

```sql
building_id             UUID NOT NULL REFERENCES buildings ON DELETE CASCADE
invoice_number          VARCHAR(50)            -- Rechnungsnummer
billing_entity_name     VARCHAR(255) NOT NULL  -- Lieferant / Rechnungssteller
billing_entity_address  VARCHAR(500)
description             TEXT NOT NULL          -- Beschreibung
category_id             UUID REFERENCES categories ON DELETE SET NULL
distribution_key_id     UUID REFERENCES distribution_keys ON DELETE SET NULL
amount                  DECIMAL(12,2) NOT NULL -- Betrag
is_valid_utility_cost   BOOLEAN NOT NULL DEFAULT true  -- umlagefähige Rechnung
invoice_date            DATE NOT NULL          -- Rechnungsdatum, decides the Abrechnungsperiode without a Leistungszeitraum
service_period_start    DATE                   -- Leistungszeitraum: both or none, end >= start (CHECK);
service_period_end      DATE                   --   a statement takes the share of its days that falls into the period
due_date                DATE                   -- Fälligkeitsdatum
paid_date               DATE                   -- Zahlungsdatum
llm_category_id         UUID REFERENCES categories ON DELETE SET NULL  -- KI-Kategorie
llm_confidence          DECIMAL(5,4)           -- Konfidenz 0–1
was_manually_overridden BOOLEAN DEFAULT false  -- Manuell überschrieben
manual_override_reason  TEXT                   -- Grund der Änderung
notes                   TEXT
```

Indexes: `invoices_building_id_idx`, `invoices_invoice_date_idx`, `invoices_category_id_idx`.
No CHECK on `amount`.

### invoice_documents (Beleg)

```sql
invoice_id  UUID PRIMARY KEY REFERENCES invoices ON DELETE CASCADE  -- at most one Beleg per invoice, deleted with it
file_name   VARCHAR(255) NOT NULL
mime_type   VARCHAR(50) NOT NULL    -- application/pdf | image/jpeg | image/png (checked by the first bytes)
content     TEXT NOT NULL           -- Base64 encoded file, at most 10 MB
deducted_amount      DECIMAL(12,2)  -- amounts already paid the file deducts, as the KI read them on upload (#233)
non_allocable_items  BOOLEAN NOT NULL DEFAULT FALSE  -- the KI saw costs that are not allocable besides the others (#233)
created_at  TIMESTAMP NOT NULL DEFAULT NOW()  -- uploaded or last replaced
```

Migration `0005_invoice_documents.sql` (#217) also drops the unused column `invoices.invoice_pdf`; `0006_beleg_hints.sql` (#233) adds the two hints, which a replaced Beleg loses.

### fuel_stocks (Tankbestand)

```sql
building_id   UUID NOT NULL REFERENCES buildings ON DELETE CASCADE
reading_date  DATE NOT NULL           -- Stichtag; the stock at the end of that day
amount        DECIMAL(12,2) NOT NULL  -- value of the oil or pellets in the tank in CHF, CHECK >= 0
category_id   UUID NOT NULL REFERENCES categories ON DELETE RESTRICT  -- a heating cost category (checked by the API)
UNIQUE (building_id, reading_date)
```

With a reading on the day before the period and one on its last day, a statement adds opening − closing stock as one
more cost of the period in the category of the closing reading, distributed by the key of that category's latest
allocable invoice in the building (else the configured default key): heating costs are the consumption, not the
purchases (`fuel-stock.service.ts`). All readings of a building are in one allocable heating cost category (the API
answers 409 otherwise); the key is that of the category's latest allocable invoice up to the period end. Without both
readings the statement bills the purchases; the check for missing invoices reports the missing reading day (kind
`stock`) and a negative consumption, compares the consumption with the year before (no purchase rhythm), and asks
about a tank (kind `tank`, no confirmation) for heating costs of a building that never had a reading. A building whose
last reading lies before the period (tank retired) needs none.

Rounding in a statement: each invoice's part in the period (Leistungszeitraum) and each apartment's share of a group
are rounded to the Rappen first, then the tenant's part of the days or of the heating profile; the subtotal is the
sum of the rounded lines. A heating profile share is the profile percentage of the tenant's months divided by that of
the period's months (a period under a year). A heating invoice with its own days in the period (a Leistungszeitraum)
counts only the profile's months in those days, normalised to 100 %, and the group's share is weighted by amount; days
whose months carry 0 % in the profile are shared by days; a category of the building's Tankbestand keeps the profile
over the whole period (#71, review B CR2-N2). `utility_statement_line_items.invoice_parts[].profile` stores each such
invoice's percent with the tenant's months and those days' months, as printed.

### utility_statements (Nebenkostenabrechnung)

```sql
tenant_id              UUID NOT NULL REFERENCES tenants ON DELETE RESTRICT
apartment_id           UUID NOT NULL REFERENCES apartments ON DELETE RESTRICT
contract_id            UUID NOT NULL REFERENCES rental_contracts ON DELETE RESTRICT
statement_number       VARCHAR(50)   NOT NULL
period_start           DATE          NOT NULL  -- Abrechnungsperiode
period_end             DATE          NOT NULL
statement_date         DATE          NOT NULL
rental_days            INTEGER       NOT NULL  -- Mietstage
rental_start           DATE          NOT NULL  -- first billed day: later of period start and Vertragsbeginn
rental_end             DATE          NOT NULL  -- last billed day: earlier of period end and Vertragsende
total_costs            DECIMAL(12,2) NOT NULL
total_advance_payments DECIMAL(12,2) NOT NULL  -- Akontobeiträge (#477, before «Geleistete Akontobeiträge»): the sum of advance_lines
advance_lines          JSONB                   -- #464: per amount its range, months (or days of a split month), amount and total, each rounded to the Rappen; for the PDF
management_fee         DECIMAL(12,2) DEFAULT 0 -- Verwaltungspauschale
management_fee_percent DECIMAL(5,2)            -- rate the statement used: the contract's own, the run's, or 0 without agreement (#89)
heating_profile_id     UUID                    -- Heizprofil of the Abrechnungslauf, printed in the PDF (SET NULL)
fuel_stock             JSONB                   -- Tankbestand readings at creation, for the PDF
key_values             JSONB                   -- area, apartments, rooms: own and building's total at creation
heating_share          JSONB                   -- heating costs as calculated (#209): { byDays: true, reason, names } or percent, months, profile names
agreed_category_ids    JSONB                   -- ids of the categories the contract agreed at creation (#91); NULL: created before, billed every category
agreed_from            JSONB                   -- «Vereinbart ab» per category id at creation (#368); NULL: created before
balance                DECIMAL(12,2) NOT NULL  -- Saldo, to 5 Rappen in the tenant's favour (#79; sent before: commercially): positive = Nachzahlung, negative = Rückerstattung
status                 VARCHAR(20)   NOT NULL DEFAULT 'draft'
payment_deadline       DATE                    -- Zahlungsfrist
paid_date              DATE                    -- from the end of the Abrechnungsperiode up to today (#138, #448; before the Abrechnungsdatum after a confirmation in the UI)
paid_amount            DECIMAL(12,2)           -- the Saldo when marked paid without an amount (#93); 0.00 for a Saldo below CHF 5 settled under #94 (sent before #448); on a replaced sent or overdue statement «Bereits bezahlt», a refund negative (#448)
payment_resets         JSONB   NOT NULL DEFAULT '[]' -- payments taken back: { resetOn, paidDate, paidAmount } (#92)
payments               JSONB   NOT NULL DEFAULT '[]' -- recorded payments, a part payment too: { date, amount }, amount signed as the Saldo; paid_amount their sum (#959)
payment_recorded_at    TIMESTAMP               -- when the payment was recorded; a reset discards only a PDF made after it (#92)
replaces_id            UUID → utility_statements(id) -- a berichtigte Abrechnung: the statement it replaces (#120, unique)
prior_payments         DECIMAL(12,2) NOT NULL DEFAULT 0 -- paid on the replaced statement and its own replaced ones; a refund paid negative (#120)
carried_from_id        UUID → utility_statements(id) -- the Übertrag: the earlier statement of the contract whose Saldo below CHF 5 this one counts in (#448)
carry_settled_on       DATE                     -- #506: the day an open Übertrag of this statement was settled by hand; no statement counts it after
correction_declined    JSONB -- «Nicht berichtigt» (#454): { on, result }, the day and the recalculated Saldo and shares the landlord did not correct to
reminder_sent_date     DATE
pdf_blob               TEXT                    -- Base64 PDF with QR-bill
pdf_generated_at       TIMESTAMP
qr_bill_reference      VARCHAR(27)             -- QR reference (only with a QR-IBAN)
notes                  TEXT
CONSTRAINT statements_status_check CHECK (status IN ('draft', 'sent', 'paid', 'settled', 'replaced'))
CONSTRAINT statements_period_check CHECK (period_end >= period_start)
```

Indexes: `statements_tenant_id_idx`, `statements_apartment_id_idx`, `statements_period_start_idx`,
`statements_status_idx`, `statements_tenant_period_idx (tenant_id, period_start)`, unique
`statements_number_idx (statement_number)`, unique `statements_replaces_idx (replaces_id)`.

`heating_share` (migration `0004`, #209) keeps how the heating costs were shared when the statement was created: `{ "byDays": true }` with the chosen profile's names and why it was not applied (`reason`: `wholePeriod` or `noHeatingMonths`, #247), or the percent of the period's heating costs, the months with their shares (rounded to two places; the percent is their division, #232), for a period whose months do not carry 100 % the period's percent and months (`periodPercent`, `periodMonths`), and the profile's names (`name`, `name_de` … as camelCase keys) and sources (`sources`: `{ de, fr, it, en }` of a predefined profile, `null` an own one; #465), so the PDF and the detail page print them after an own profile was changed, renamed or deleted. Empty without a heating profile, without heating costs and for statements created before; the PDF of one created before names no heating profile (#232, C-5).

**Status (Abrechnungsstatus)** — transitions allowed by `updateStatementStatus` in
`backend/src/services/statement.service.ts`:

| From | To |
|---|---|
| `draft` (Entwurf) | `sent`; `settled` (Erledigt) when its Saldo is 0.00 or below CHF 5 and it is no Schlussabrechnung (#448): no payment, no Zahlungsdatum, never gemahnt, no reset |
| `sent` (Versendet) | `paid` |
| `overdue` (Überfällig, computed) | `paid` |
| `paid` (Bezahlt) | `sent` only by `resetPayment` (#92): paid date and amount cleared, the reset appended to `payment_resets`, a PDF made after the payment was recorded discarded |
| `sent`, `overdue`, `paid`, `settled` | `replaced` (Ersetzt) only by `replaceStatement` (#120): nothing else changes, except `paid_amount`: «Bereits bezahlt» entered on a sent or overdue one (a refund negative), or on a settled one whose Saldo a later statement counts as its Übertrag that Saldo, which the berichtigte Abrechnung offsets as «Bereits verrechnet mit NK-…» (#448); never back |

**Berichtigte Abrechnung (#120, #358):** `correctStatement` (or a statement run of the same contract and the same Abrechnungsperiode) creates a draft from today's data with a new number from the counter, `replaces_id` set to the replaced statement without a replacement, `prior_payments` = its `paid_amount` + its own `prior_payments`, and `balance` = Saldo of costs − Akonto − `prior_payments`, rounded as every Saldo. A replaced statement does not count as the statement of its period (statement run, missing statements) and no longer locks the contract dates.

**Übertrag (#448):** a statement of a contract counts in the Saldo of the latest earlier `settled` statement of the same contract with a Saldo other than 0.00 (`carried_from_id`), unless a statement of another period already counts it; a berichtigte Abrechnung of the same period counts it again. `balance` = Saldo of costs + Übertrag − Akonto − `prior_payments`, rounded as every Saldo. A Schlussabrechnung (the contract's end date within the period) has no Mindestbetrag: every Saldo is claimed or paid out. Statements settled under #94 (`paid` with `paid_amount` 0.00) keep their texts; a refund among them is carried over, a waived Nachzahlung is not (product owner 2026-10-19). **Open Übertrag (#506):** one no sent statement of another period counts, when a later sent statement of the contract counts another one or none, the contract ends on or before the end of its period, or after it the contract pays a Nebenkostenpauschale only (no Akonto above 0, no agreed costs); no statement takes it any more, the Übersicht names it until the landlord settles it by hand (`carry_settled_on`), which a berichtigte Abrechnung counts as paid.

**Lock rule:** only a `draft` can be deleted (`deleteStatement`), get line items (`addLineItems`) or have its
amounts changed (`updateStatement` rejects `total_costs`, `total_advance_payments`, `management_fee_percent`,
`management_fee` and `balance` once the status is not `draft`). Other fields, such as `payment_deadline` or `notes`, stay
editable; a changed `payment_deadline` clears `pdf_blob` and `pdf_generated_at`. A sent Nachzahlung's `payment_deadline`
cannot go before `documents.payment_deadline` of the PDF the tenant got last (#966).

**Overdue:** never stored. Reads, filters and counts treat a `sent` statement whose `payment_deadline` has
passed as `overdue`; the CHECK does not allow it as a stored value.

### statement_numbers (Abrechnungsnummern)

```sql
prefix       VARCHAR(50)   PRIMARY KEY  -- NK-{first 8 characters of the building id}-{year of the period end}-
last_number  INTEGER       NOT NULL     -- the last number given with this prefix
```

Migration `0009` (#97). `generateStatementNumber` (`backend/src/services/calculation.service.ts`) counts `last_number`
up for every new statement, so a number is never given twice: a deleted draft leaves a gap, because its PDF may already
have been handed out. A prefix without a row (its first statement since the migration) starts after the highest
`statement_number` with that prefix; existing numbers stay as they are. A number deleted before the migration that was
the highest of its prefix is given once more: nothing recorded it.

### utility_statement_line_items (Abrechnungsposition)

```sql
statement_id        UUID NOT NULL REFERENCES utility_statements ON DELETE CASCADE
category_id         UUID REFERENCES categories ON DELETE SET NULL
distribution_key_id UUID REFERENCES distribution_keys ON DELETE SET NULL
description         VARCHAR(255)  NOT NULL
total_amount        DECIMAL(12,2) NOT NULL  -- building total
tenant_share        DECIMAL(12,2) NOT NULL  -- tenant's portion
share_percentage    DECIMAL(8,4)
apartment_share     DECIMAL(12,2)           -- the apartment's part of the total by the key
period_share        DECIMAL(8,4)            -- 0-1: days rented, or the heating profile's share
position_rental_days INTEGER                -- the tenant's days in the days billed (null: not a ratio of days)
billed_days         INTEGER                 -- the days the position's invoices bill in the period
invoice_parts       JSONB                   -- invoices over different days: [{start, end, amount, days, total, noPeriod?, whole?, fuelStock?}] (null: none)
invoices            JSONB                   -- the invoices it billed: [{id, description, amount, start, end, fuelStock?}] (null: created before #96)
sort_order          INTEGER DEFAULT 0
```

`apartment_share` and `period_share` are kept when a statement is created so the PDF can explain each position. `position_rental_days` and `billed_days` (migration `0003`, #208) hold `period_share` as a fraction of days when all invoices of the position bill the same days and it is not shared by the heating profile; the PDF prints them as «x/y Tage». Statements created before keep them empty. `invoice_parts` (migration `0006`, #226) holds, for a position whose invoices bill different days, each invoice's days in the period (`start`, `end`, `total`), its amount for them and the tenant's days in them (`days`); the PDF lists them under the position with the weighted share. `noPeriod` marks an invoice without Leistungszeitraum, `whole` holds the whole Leistungszeitraum and the invoice's amount when it reaches beyond the period (#241), `fuelStock` marks the change of the Tankbestand (#239); parts stored before have neither. It stays empty when the tenant rents the whole period or the invoices sum to zero.

`invoices` (migration `0014`, #96) holds every invoice the position billed, in the order of `invoice_parts`: its id, its description, its amount in the period and the days it bills there (`start`, `end`); the change of the Tankbestand is stored with `fuelStock` and the id `fuel-stock-<period end>`, it is no invoice. It is the link from a statement to its invoices: an invoice of the period that no position holds with its current amount, days, category and distribution key, or a held invoice that left the period (deleted, made non-allocable), was recorded or changed after the statement (`GET /statements/:id/changed-invoices`, `GET /invoices/:id/statements`); the statement detail links each position to its invoices. Statements created before keep it empty; for them, as before, an invoice of the period recorded after the statement counts as missing. No foreign key: a deleted invoice stays in the statement that billed it.

No `updated_at`. Index: `line_items_statement_id_idx`.

### documents (Dokument)

Letters and e-mails to a tenant with a PDF (payment reminders, Mahnungen), and files the property manager uploaded
to a tenant (`type = upload`: PDF, JPEG or PNG up to 10 MB = 10 × 1024 × 1024 bytes, without channel and Versandstatus; deletable, and deleted
with a tenant who has no contracts).

```sql
tenant_id      UUID NOT NULL REFERENCES tenants ON DELETE RESTRICT
statement_id   UUID REFERENCES utility_statements ON DELETE RESTRICT
type           VARCHAR(30)  NOT NULL   -- reminder | statement (sent by e-mail #86, by letter #449, again by letter #534) | new_pdf (the PDF after a change of a sent statement, #968) | pdf_before_change (the stored PDF of a statement sent without a Dokument, kept before a change, a payment reset or a redelivery discards it; no channel, no status, #969) | upload
reminder_level INTEGER                 -- Mahnstufe: 1 = Zahlungserinnerung, 2 and 3 = Mahnung
title          VARCHAR(255) NOT NULL
file_name      VARCHAR(255) NOT NULL
content        TEXT         NOT NULL   -- the file, Base64
mime_type      VARCHAR(50)  NOT NULL DEFAULT 'application/pdf'  -- application/pdf | image/jpeg | image/png
channel        VARCHAR(10)             -- email | letter; NULL for an upload; letter once a failed e-mail is posted
status         VARCHAR(20)             -- Versandstatus: sent | to_send; NULL for an upload
payment_deadline DATE                  -- the Zahlungsfrist a reminder prints (letter date + 10 days); the next
                                       -- Mahnstufe is possible from the day after; NULL for an upload
sent_at        TIMESTAMP
delivery_error TEXT                    -- why an e-mail could not be sent
recipient      VARCHAR(255)            -- the e-mail address it went to, as it was then (#449, 0030); NULL for a
                                       -- letter, an upload and an e-mail sent before 0030
```

A reminder `to_send` whose statement is `paid` or `replaced` since no longer goes out (#449): no status of its own, the
lists derive it (`notToSend`), and `status=to_send` leaves it out.

No `updated_at`, no CHECK constraints. Indexes: `documents_tenant_id_idx`, `documents_statement_id_idx`,
`documents_status_idx`.

### configuration

```sql
key         VARCHAR(100) NOT NULL   -- unique index config_key_idx
value       TEXT NOT NULL
description TEXT
```

Key-value store. The migrations insert no rows; a missing key falls back to its default in
`CONFIG_KEYS` (`backend/src/services/config.service.ts`), and only known keys are accepted.

| Key | Default | Validation |
|---|---|---|
| `accounting_period` | `calendar` | `calendar` \| `july-june` \| `november-october` |
| `management_fee_pct` | `3` | number 0–10 (3 % is the guideline, not a cap; #124) |
| `default_heating_profile_id` | none | an existing heating profile |
| `default_distribution_key_id` | none | an existing distribution key |
| `company_name` | `''` | <= 255 characters |
| `company_address` | `''` | <= 500 characters |
| `company_postal_code` | `''` | four digits |
| `company_city` | `''` | <= 100 characters |
| `company_phone` | `''` | <= 50 characters; in the statement's letterhead (#465) |
| `company_email` | `''` | empty or an e-mail address, <= 255 characters (#465) |
| `iban` | `''` | CH or LI IBAN, 21 characters, MOD-97 checksum |
| `payment_deadline_days` | `30` | 7–90 |
| `reminder_after_days` | `14` | 7–60 |
| `default_language` | `de` | `de` \| `fr` \| `it` \| `en` |

One more key is written by the service, not by the settings form (it is not in `CONFIG_KEYS` and `GET /config` leaves it out): `accounting_period_changed`, `YYYY-MM-DD:<type>`, the Swiss day `accounting_period` last changed and the type it had before; a second change on the same day keeps the first's type (#512).

The IBAN is stored in plain text.

### audit_log (Protokoll, #357)

```sql
id          UUID PRIMARY KEY
occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
action      VARCHAR(50) NOT NULL   -- login, management_fee_changed, category_allocability_changed,
                                   -- invoice_allocability_changed, payment_reset, statement_corrected,
                                   -- ki_setting_changed (#580: mode, provider, country),
                                   -- access_key_created, access_key_revoked, access_key_expired, mcp_call (#817)
details     JSONB NOT NULL         -- snapshot of what the entry names (API: docs/api-specification.md, 11a)
```

No foreign keys: an entry stays readable after its record changed or was deleted, and stays until the landlord
deletes it under «Einstellungen» › «Protokoll». A login stores only the provider. Migration `0019_audit_log.sql`.

### access_keys (Zugangsschlüssel für KI-Programme, #817)

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
name            VARCHAR(100) NOT NULL
key_hash        CHAR(64) NOT NULL UNIQUE   -- SHA-256 of the key; the key itself is shown once and never stored
created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
last_used_at    TIMESTAMPTZ                -- «zuletzt benutzt», set by each accepted call at /mcp
expires_on      DATE NOT NULL              -- last valid Swiss day: 90 calendar days after created_at
expiry_recorded BOOLEAN NOT NULL DEFAULT false  -- its expiry is in audit_log
```

Revoking deletes the row; the Protokoll keeps the entries. Migration `0039_access_keys.sql`, ADR 0007.

### local_accounts (Konto mit Passwort, #576)

```sql
id                  UUID PRIMARY KEY
email               VARCHAR(255) NOT NULL UNIQUE   -- trimmed, lower case
password_hash       TEXT NOT NULL                  -- Argon2id (Bun.password), never the password
failed_attempts     INTEGER NOT NULL DEFAULT 0     -- since the last successful sign-in
locked_until        TIMESTAMPTZ                    -- Sperre: set at the 5th failed attempt, for 15 minutes
password_changed_at TIMESTAMPTZ NOT NULL           -- sessions issued before it end (the reset command)
created_at, updated_at TIMESTAMPTZ NOT NULL
```

Set by the setup on the first visit (`POST /api/v1/setup`, #577, only while no account exists), `bun run account` (the Betreiber) or `PUT /api/v1/local-accounts`; a new password also clears the failed
attempts and the Sperre. Migration `0032_local_accounts.sql`.

### ki_settings (KI-Einstellung, #580)

```sql
id                INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1)   -- one row
mode              VARCHAR(10) NOT NULL   -- local, provider, none
base_url, model, provider, provider_country TEXT   -- only for a provider; provider and country named by the privacy statement
api_key_encrypted TEXT                   -- AES-256-GCM with ENCRYPTION_KEY, «iv.ciphertext» in base64; never in clear
updated_at        TIMESTAMPTZ NOT NULL
```

The KI the landlord chooses under «Einstellungen» › «KI». Without a row, or while the operator sets any `LLM_*` variable,
the variables apply (`backend/src/config/llm.ts`). Every change is also an `audit_log` entry `ki_setting_changed`.
Migration `0034_ki_settings.sql`.

### backup_codes, backup_runs (Sicherung, #718)

```sql
-- backup_codes: one row per Wiederherstellungscode, never the code itself
id           UUID PRIMARY KEY
public_key   TEXT NOT NULL      -- X25519 public key derived from the code (base64); a Sicherung is encrypted to it
salt         TEXT NOT NULL      -- salt of the derivation (base64)
confirmed_at TIMESTAMPTZ        -- the landlord typed the code again; Sicherungen use the newest confirmed row
pending_code TEXT               -- the code shown on «Sicherung einrichten», only until the confirmation (0040)
created_at   TIMESTAMPTZ NOT NULL

-- backup_runs: one row per run
id           UUID PRIMARY KEY
started_at   TIMESTAMPTZ NOT NULL
finished_at  TIMESTAMPTZ
file         TEXT               -- the file in BACKUP_DIR, when it succeeded
error        TEXT               -- why it failed
```

`backend/src/services/backup.service.ts` makes the Sicherung (a `pg_dump` and the keys, encrypted) daily, at start when
the last one is older than a day, and before a migration; `/health` names it stale after a day without one. Migrations
`0038_backups.sql`, `0040_backup_pending_code.sql`.

---

## Seed data (`0002_stammdaten.sql`)

`0027_master_data_names.sql` sets the reviewed fr/it/en names of these rows (#345, #461) and writes «70 %» with a non-breaking space; a name the landlord changed stays.

### Categories

Allocable (`is_allowed_utility_cost = true`, sort order 1–14): Heizung, Warmwasser, Kaltwasser, Abwasser,
Allgemeinstrom, Lift, Hauswart, Gartenpflege, Schneeräumung, Kehricht, TV/Kabelanschluss, Kaminfeger.

Not allocable (`false`, sort order 100–108): Reparaturen, Gebäudeversicherung, Liegenschaftssteuer,
Hypothekarzinsen, Verwaltung, Renovation, Wertvermehrende Investitionen, Schädlingsbekämpfung,
Feuerlöscher-Wartung (#176). `allocable-categories.pg.test.ts` pins every seeded category's flag. The management effort is billed
through the Verwaltungspauschale, not through invoices in Verwaltung.

Every KI prompt lists the categories with their descriptions, so a description names what the category excludes
(«ohne …»); `0021_category_descriptions.sql` added these to Heizung, Gartenpflege, Kehricht, TV/Kabelanschluss,
Gebäudeversicherung and Verwaltung where the landlord had not changed the text (#204, #220).

### Distribution keys (all `predefined`)

| name_de | formula | sort_order |
|---|---|---|
| Pro Einheit | `{units}` | 1 |
| Pro Fläche (m²) | `{area}` | 2 |
| Pro Zimmer | `{rooms}` | 3 |
| Heizung (Fläche 70 % / Einheit 30 %) | `0.7 * {area} / {area_total} + 0.3 * {units} / {units_total}` | 6 |

### Heating profiles (all `predefined`, table `heating_profiles`)

| name_de | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Heizung + Warmwasser | 13.6 | 12.1 | 11.5 | 9.3 | 5.6 | 3.7 | 3.7 | 3.6 | 3.7 | 9.5 | 10.7 | 13 |
| Heizung Mittelland | 17.5 | 14.5 | 13.5 | 9.5 | 3.5 | 0 | 0 | 0 | 1 | 10 | 13.5 | 17 |
| Heizung Bergregion | 14 | 11.5 | 11.5 | 9 | 7 | 4.5 | 1 | 4 | 5.5 | 8.5 | 10.5 | 13 |
| Heizung Tessin | 21.5 | 17 | 15.5 | 5 | 0 | 0 | 0 | 0 | 0 | 6 | 15 | 20 |

Values from the Mieterverband's fact sheet «Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode», which
`source_de` … `source_en` name with its table (migration `0037`, #465; the statement PDF prints it). There is no «Nur Warmwasser» profile:
separate Warmwasser is shared by days, and as the heating profile of a run it would spread the heating costs evenly
over the year.

Demo data (`backend/demo/`, `bun run db:demo`) is never part of the migrations.

---

## Migrations

```
backend/migrations/
  0001_schema.sql       -- schema
  0002_stammdaten.sql   -- master data: categories, distribution keys, heating profiles
  0003 … 0020           -- later changes, each named in its table above
```

`src/db/migrate.ts` applies the `.sql` files in file order, each in its own transaction, and records them in
`schema_migrations`. It refuses a database that was set up without this table, or one that has records of
migrations that no longer exist (databases from before the October 2026 baseline); set up a local one anew with
`bun run db:reset`, never an installation (it deletes all records). Dwello is installed: every change to the schema or
the master data is a new numbered file; a migration on `main` is never edited (`backend/CLAUDE.md`, CI "Migrations unchanged").

Commands (in `backend/`):

| Command | Effect |
|---|---|
| `bun run dev` | applies missing migrations, then starts the backend |
| `bun run db:migrate` | applies missing migrations |
| `bun run db:reset` | recreates the local dev database from the migrations (refuses non-local hosts) |
| `bun run db:demo` | loads the demo data; running it twice adds nothing |

The Docker image also applies missing migrations on start, after a Sicherung once a Wiederherstellungscode is confirmed (#718); the test databases `dwello_test` and
`dwello_e2e` are recreated from the migrations before each run.

A schema change goes into a new numbered SQL file written by hand; also update `src/db/schema.ts` and this
document. Do not use `db:generate` (Drizzle Kit has no snapshots and would emit the whole schema again) or
`db:push` (bypasses `schema_migrations`).

---

## Not implemented

- Database views.
- Backups (scenario R1 in `docs/architecture/utility-tree.md`).
- Encryption of individual columns (e.g. the IBAN).
