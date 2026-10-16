# Product Requirements Document: Dwello
## Swiss Property Management System

**Version:** 1.0
**Date:** January 23, 2026
**Status:** Original product vision (not an implementation status)

---

## 1. Executive Summary

**Product Name:** Dwello

**Vision:** Comprehensive, user-friendly Swiss property management system designed to streamline the management of residential properties, tenant relationships, and utility cost distribution for small property portfolios.

**Target Users:** Private landlords in Switzerland with little experience who manage their own 1-5 buildings with up to 50 apartments (in the app: Liegenschaftsverwalter); see section 3.

**Primary Goal:** Enable property managers to efficiently handle property administration, tenant contracts, invoice management, and annual utility cost statement generation while ensuring compliance with Swiss legal requirements.

**Business Value:**
- Reduces manual administrative work by automating utility cost calculations and statement generation
- Ensures accurate, Swiss-compliant utility cost distribution
- Improves tenant relations through transparent, professional statements
- Provides clear financial insights into property portfolios
- Minimizes legal compliance risks through validated cost categorization

---

## 2. Product Overview

### 2.1 Purpose
Dwello is a digital solution for managing residential properties in Switzerland. It addresses the complex requirements of Swiss property management, particularly around utility cost distribution (Nebenkostenabrechnungen) and tenant contract management.

### 2.2 Problem Statement
Swiss property managers currently face significant challenges:
- **Manual calculation errors** in complex utility cost distributions
- **Time-consuming** contract and invoice management across multiple properties
- **Compliance risk** - ensuring costs comply with Swiss legal requirements
- **Inefficient document management** for contracts and statements
- **Limited visibility** into portfolio financial performance
- **Multi-language requirements** for tenant communications across Swiss regions

### 2.3 Solution
Dwello provides:
- Automated, legally-compliant utility cost statement generation
- Centralized property, tenant, and contract management
- LLM-powered invoice categorization with validation
- Professional PDF statement and QR invoice generation
- German user interface; tenant-facing statement PDFs and reminders in four languages (German, French, Italian, English)
- Secure data storage with automated backups

### 2.4 Target Market
- **Primary:** Private landlords in Switzerland who manage their own property and use Dwello a few times a year
- **Portfolio Size:** 1-5 residential buildings
- **Tenant Base:** Up to 50 apartments
- **User Type:** Single property manager (no multi-user requirement for MVP)

---

## 3. User Personas

Dwello is built for private landlords with little experience who use it a few times a year (`CLAUDE.md`, "Design-Regeln"): guidance, plain words and confirmations come before speed for experts. The personas that stand for them (Helga, Marco, Dr. Weber, Sven, Anna), with their tasks, viewports and input, are in `docs/design/personas/README.md`.

---

## 4. Technical Architecture

### 4.1 Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | SvelteKit | Modern, reactive, excellent DX, fast builds |
| **Backend** | ElysiaJS on Bun | High performance, modern TypeScript framework, Bun's speed |
| **Database** | PostgreSQL | Robust, ACID transactions, JSON support, proven reliability |
| **Authentication** | BFF + OAuth 2.0 / SSO | Backend for Frontend pattern with OAuth 2.0, HTTPOnly cookies, XSRF protection |
| **LLM** | Any OpenAI-compatible API (default: local Ollama with `qwen2.5vl:7b`) | Self-hosted by default, no vendor lock-in; configured through `.env` |
| **Deployment** | Docker / Docker Compose | Containerized, portable, easy to run anywhere |
| **Maps** | OpenStreetMap + Leaflet | Open source, no licensing, complete privacy |
| **Internationalization** | i18n library | German UI; statement PDFs in five languages |
| **PDF Generation** | PDFKit | Professional PDFs |
| **QR Bills** | Own code + `qrcode` (npm) | Standards-compliant Swiss QR-bills |

### 4.2 System Architecture (BFF Pattern)

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                     │
│  SvelteKit - Responsive Web Application                 │
│  - Dashboard, Property Management, Invoice Management   │
│  - Statement Configuration & Generation                 │
│  - German UI                                            │
│  Cookies: dwello_session={jwt}; dwello_xsrf={token}    │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS/TLS
┌──────────────────────▼──────────────────────────────────┐
│     SvelteKit BFF Layer (Backend for Frontend)           │
│  - Auth routes: /auth/login, /auth/callback             │
│  - Auth routes: /auth/refresh, /auth/logout, /auth/me   │
│  - Cookie management (HTTPOnly sessions)                │
│  - XSRF validation (double-submit pattern)              │
│  - OAuth 2.0 flow handling                              │
│  - API proxy routes (/api/*)                            │
│  - Forward requests to ElysiaJS backend                 │
└──────────────────────┬──────────────────────────────────┘
                       │ Internal network
                       │ Authorization: Bearer {jwt}
┌──────────────────────▼──────────────────────────────────┐
│            Backend API (ElysiaJS on Bun)                 │
│  - RESTful endpoints for all operations                  │
│  - JWT validation middleware                            │
│  - Business logic (prorating, calculations)              │
│  - PDF generation service                                │
│  - LLM integration for categorization                    │
│  - No OAuth handling (moved to BFF)                      │
│  - No cookie management (BFF layer)                      │
└──────────────────────┬──────────────────────────────────┘
                       │ Connection Pool
┌──────────────────────▼──────────────────────────────────┐
│              PostgreSQL Database                         │
│  - Building, Apartment, Tenant entities                  │
│  - Contracts, Invoices, Statements                       │
│  - Configuration, Categories, Distribution Keys          │
│  - Blob storage for PDFs and contracts                   │
│  - Audit logs (planned)                                  │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│        External Services (async, non-blocking)           │
│  - OpenPLZ API: Address search (called from frontend)    │
│  - OAuth Provider: Authentication (via BFF)              │
│  - LLM (default local Ollama): Invoice categorization    │
│  - Backup Service: Daily snapshots                       │
└──────────────────────────────────────────────────────────┘
```

### 4.3 Key Design Decisions

1. **BFF Pattern for Authentication:** SvelteKit server routes handle OAuth, session management, and XSRF protection
   - OAuth 2.0 flow executed entirely on server (no client-side OAuth code)
   - JWT stored in HTTPOnly cookies (prevents XSS attacks)
   - Double-submit cookie pattern for XSRF protection
   - All authentication logic centralized and auditable

2. **Local LLM over Cloud:** Self-hosted model ensures data privacy, no API costs, offline capability

3. **Blob Storage in DB:** Simplifies backup strategy, no external file storage needed

4. **Containerized Deployment:** Single Docker command to run full stack anywhere

5. **PostgreSQL:** Strong ACID compliance for financial data integrity

6. **OAuth/SSO:** Secure authentication without managing passwords (via BFF layer)

7. **SvelteKit + Elysia:** Modern, performant stack with excellent tooling

---

## 5. Core Features (Full System)

### 5.1 Building Management

**Overview:** Central management of all properties under the property manager's portfolio.

**Features:**
- Create, edit, delete buildings
- Building attributes:
  - Address (street, number, postal code, city)
  - GPS coordinates (latitude, longitude)
  - Building identifier/name (optional)
  - Year built (optional)
  - Number of apartments (auto-calculated)
  - Building type (single-family, multi-family, mixed)

**Address Integration:**
- Real-time address search using OpenPLZ API
- Auto-populate GPS coordinates
- Address validation
- Manual address entry fallback if API unavailable

**Map Visualization:**
- Display all buildings on interactive map (OpenStreetMap)
- Building markers with address and apartment count
- Click to view building details
- Zoom to building functionality

**Use Cases:**
1. New property acquisition: Add building with address search
2. Property portfolio review: View all properties on map
3. Building information updates: Edit address or coordinates
4. Property decommissioning: Delete building and associated data

---

### 5.2 Apartment Management

**Overview:** Manage individual apartments within each building, tracking physical characteristics and occupancy status.

**Features:**
- Multiple apartments per building
- Apartment attributes:
  - Address (auto-derived from building, with unit/floor specification)
  - Floor level (Parterre, 1. Stock, 2. Stock, Attika, Untergeschoss, etc.)
  - Size in m² (Wohnfläche)
  - Number of rooms (Anzahl Zimmer) - e.g., "3.5 Zimmer"
  - Room breakdown (optional) - bedrooms, living area, kitchen type
  - Apartment identifier (e.g., "3.5 Zimmer Wohnung Parterre")
  - Utility meter IDs (optional) - for tracking metered utilities

**Occupancy Tracking:**
- Current occupancy status (Mietstatus: occupied, relet, vacant, reserved): occupied (a rental contract runs today) and relet (only a future contract is signed) follow from the rental contracts; by hand the property manager sets only vacant or reserved (e.g. during a renovation), and reserved holds only while no contract runs or is signed (scenarios in `apartment-edit.feature`)
- Occupancy duration
- Historical occupancy records

**Use Cases:**
1. Building setup: Create all apartments when adding building
2. Apartment modifications: Edit size or room count if renovated
3. Occupancy management: Track which apartments are occupied
4. Contract linking: View current tenant and contract for each apartment

---

### 5.3 Tenant Management

**Overview:** Maintain complete tenant information for all current and past occupants.

**Features:**
- Tenant personal information:
  - First name, last name
  - Date of birth (optional, for identification)
  - Email address (for notifications, statements)
  - Phone number (optional)
  - Postal address (for statement delivery)
  - Nationality/residence status (optional, for records)

**Historical Tracking:**
- View all apartments tenant has occupied
- Complete rental history per apartment
- Tenure timeline visualization

**Data Privacy:**
- Secure storage of personal data
- GDPR/Swiss law compliance for data retention
- Ability to anonymize data upon tenant request (future feature)

**Use Cases:**
1. New tenant onboarding: Add tenant details when signing contract
2. Tenant communication: Access email/phone for notifications
3. Statement generation: Tenant address for statement delivery
4. Audit trail: Historical record of all past tenants

---

### 5.4 Rental Contract Management

**Overview:** Track all rental agreements, including terms, rent amounts, and contract history.

**Features:**
- Contract attributes:
  - Start date (Vertragsbeginn)
  - End date (Vertragsende) - nullable for ongoing contracts
  - Link to tenant
  - Link to apartment
  - Base rent in CHF (Mietzins)
  - Additional rent in CHF:
    - Garage rent
    - Parking space rent
    - Storage space rent
    - Other additional fees (configurable)
  - Reference index for rent indexation (year and index value)
  - Agreed utility cost categories (checkboxes for which categories apply)
  - Monthly advance payments (Akonto) in CHF
  - Contract notes (free-form text)

**Contract Modifications:**
- Track changes to contracts during tenancy
- Historical record of all modifications with dates
- Support for index adjustments, rent increases, service additions

**Contract Documents:**
- PDF upload for original signed contract
- Storage in database blob storage
- View/download contract PDF from contract details
- Multiple contract versions can be stored (if indexed)

**Contract History:**
- View all past contracts for an apartment
- Timeline visualization of tenancy
- Identify gaps (vacant periods)

**Contract Validation:**
- Warning if end date is in the past (expired contract)
- Prompt to update/renew expired contracts
- Validation that start date is before end date

**Use Cases:**
1. New lease: Create contract when tenant moves in
2. Rent adjustment: Update base rent with indexed value
3. Lease renewal: Create new contract for continuing tenant
4. Service changes: Add/remove additional rent items
5. Dispute resolution: Access signed contract documentation
6. Statement generation: Retrieve contract terms for calculation

---

### 5.5 Invoice Management

**Overview:** Centralize all invoices for utilities, services, and maintenance, with automated categorization and validity checking.

**Features:**

**Invoice Entry:**
- Add invoices manually (web form or bulk import in future)
- Invoice attributes:
  - Invoice date (date invoice was issued; without a service period it decides the accounting period the invoice counts in, see `docs/nebenkostenabrechnung-anforderungen.md`, «Regeln in Dwello»)
  - Billing entity name (company providing service)
  - Billing entity address (for records)
  - Work description / service description
  - Invoice amount in CHF
  - Building (which property this invoice applies to)
  - Category (auto-assigned by LLM, manually overridable)
  - Distribution key (how to allocate this cost)
  - Validity flag (allowed vs. not allowed utility cost)
  - Notes field (optional)

**LLM-Powered Auto-Categorization:**
- Automatically analyzes invoice description and categorizes
- Predefined categories (seeded by `backend/migrations/0002_stammdaten.sql`):
  - Allowed: **Heizung**, **Warmwasser**, **Kaltwasser**, **Abwasser**, **Allgemeinstrom**, **Lift**, **Hauswart**, **Gartenpflege**, **Schneeräumung**, **Kehricht**, **TV/Kabelanschluss**, **Kaminfeger**
  - Not allowed: **Reparaturen**, **Gebäudeversicherung**, **Liegenschaftssteuer**, **Hypothekarzinsen**, **Verwaltung**, **Renovation**, **Wertvermehrende Investitionen**, **Schädlingsbekämpfung**, **Feuerlöscher-Wartung**
- **Verwaltung** (general administration costs) is not allowable; the manager's administrative effort for the utility costs is charged through the separate **Verwaltungspauschale** (see section 5.8), not as an invoice

**Automatic Validity Checking:**
- **Allowed (zulässig):**
  - Heating fuel and maintenance
  - Chimney cleaning services
  - Metering service fees
  - Water consumption and treatment
  - Wastewater fees
  - Stairwell and common area electricity
  - Garden maintenance and snow removal
  - Elevator maintenance and electricity
  - Caretaker wages
  - Garbage collection
  - Basic cable TV or radio fees
  - (The management fee is not an invoice category; it is the separate Verwaltungspauschale, see section 5.8)

- **Not Allowed (nicht zulässig):**
  - Maintenance and repair costs (except service contracts)
  - Acquisition costs
  - Structural repairs
  - Taxes and fees (except VAT)
  - Insurance premiums (general)
  - Connection fees for networks
  - Renovation costs

- **Flag System:** Auto-flag invalid costs with explanation, manual override option

**Category Management:**
- View all categories (seeded ones and own ones are treated alike)
- Add categories (with allowed/not allowed designation)
- Edit any category; delete it while no invoice uses it
- Category usage statistics

**Bulk Operations:**
- Mark multiple invoices as belonging to same batch
- Bulk validity status updates
- Bulk categorization review (future: CSV import)

**Invoice Listing & Filtering:**
- Table view with sortable columns: Date, Entity, Category, Amount, Distribution Key, Valid/Invalid
- Filters:
  - Building
  - Category
  - Time period
  - Validity status
  - Distribution key
- Search by billing entity or description

**Use Cases:**
1. Monthly invoice processing: Add heating oil delivery invoice, LLM categorizes as Heizkosten
2. Validity validation: Add invoice for building repairs, system flags as "Not allowed"
3. Category override: Manually override LLM categorization if incorrect; the form requires a reason for the change (Grund der Änderung), the API accepts the change without one
4. Cost analysis: Review all Heizkosten invoices for a building over a period
5. Statement preparation: Gather all valid invoices for a specific period

---

### 5.6 Distribution Keys (Verteilschlüssel)

**Overview:** Define how costs are allocated among apartments.

**Predefined Distribution Keys:**

Seeded by `backend/migrations/0002_stammdaten.sql`. The divisor is always all apartments of the building, occupied or not: the owner (Vermieter) bears the share of vacant apartments. An invoice without a distribution key is shared equally among all apartments of the building (like Pro Einheit). The Verwaltungspauschale has no distribution key.

1. **Pro Einheit** (Per Unit), formula `{units}`
   - Equal share per apartment
   - Formula: `Total Cost / Number of Apartments in the Building`
   - Useful for caretaker wages

2. **Pro Fläche (m²)** (Per Area), formula `{area}`
   - Distribution by apartment size (Wohnfläche)
   - Formula: `Total Cost × (Apartment Size / Total Building Size)`
   - Used for water, wastewater, electricity, maintenance

3. **Pro Zimmer** (Per Rooms), formula `{rooms}`
   - Distribution by number of rooms

4. **Heizung (Fläche 70% / Einheit 30%)** (Heating Split), formula `0.7 * {area} / {area_total} + 0.3 * {units} / {units_total}`
   - Swiss standard heating distribution
   - The time-based split for tenants who moved mid-period uses the heating profile (see section 5.7)

**Custom Distribution Keys:**

Users can create custom formulas using apartment variables:
- **{area}** - Apartment living area in m²
- **{volume}** - Apartment volume in m³ (estimated as area × ceiling height)
- **{rooms}** - Number of rooms in apartment
- **{units}** - Always 1 (for per-unit calculations)
- **{area_total}**, **{rooms_total}**, **{volume_total}**, **{units_total}** - Sums over all apartments of the building (for keys with fixed parts such as 70/30)

**Custom Formula Examples:**
- `{area} * 1.5` - Area with 1.5x weighting
- `({area} + {rooms} * 10) / 100` - Combination of area and room count
- `{volume} * 0.5` - Based on volume calculation

**Key Management:**
- View all keys (predefined and custom)
- Create new custom keys with formula validation
- Edit custom keys
- Delete custom keys (with warning if in use)
- Test formula with sample apartment data before saving

---

### 5.7 Heating Cost Distribution Configuration

**Overview:** Monthly percentage-based distribution for heating costs (separate from other costs), accommodating regional climate variations.

**Predefined Profiles:**

Four profiles, seeded by `backend/migrations/0002_stammdaten.sql`; each distributes exactly 100%:

1. **Heizung + Warmwasser** (Heating + Hot Water): standard profile for combined heating and hot water systems
2. **Heizung Mittelland** (Heating Only, Swiss Plateau): for Bern, Zürich, Basel, etc.
3. **Heizung Bergregion** (Heating Only, Mountain Region): for Alpine and pre-Alpine regions
4. **Heizung Tessin** (Heating Only, Southern Switzerland): for Ticino and southern regions
5. ~~**Nur Warmwasser** (Hot Water Only)~~: removed; separate hot water costs are shared by days

Predefined profiles cannot be deleted and their monthly shares cannot change; the app does not edit them at all (only the API accepts a new name).

**Manual Configuration:**
- Option to input custom monthly percentages manually
- Visual editor with percentage inputs for each month
- Validation that all percentages sum to 100%
- Ability to save custom profiles for reuse

**Usage:**
- Chosen per statement run (Abrechnungslauf), not per building; without a heating profile, heating costs are shared by days
- Used to prorate heating costs for tenants who moved mid-year
- Example: Tenant occupied Oct 1 - Dec 31, gets (Oct% + Nov% + Dec%) of annual heating cost

**Use Cases:**
1. Statement run: select the heating profile that fits the location of the buildings in the run
2. Multi-building management: buildings in different regions go into separate statement runs, each with its profile
3. Custom adjustments: Manually adjust percentages if building has unique heating characteristics

---

### 5.8 Management Costs Configuration

**Overview:** Configure the property manager's fee (Verwaltungspauschale) as a percentage of the tenant's own utility costs (subtotal). Up to 3% is the customary guideline in Switzerland, not a legal cap; a higher agreed percentage is applied as set.

**Features:**
- Global management cost percentage (0% or more; default suggestion for new statements, adjustable per statement run)
- The rate of a statement run applies to every rental contract in it; Dwello does not check whether the fee is agreed in the rental contract
- No distribution key: the fee is a percentage of each tenant's own costs
- Automatic calculation and inclusion in statements
- Formula: `Tenant's own utility costs (subtotal) × (Management Cost % / 100)`
- The Saldo (costs minus Akonto) is rounded commercially to 5 Rappen; the statement shows the amount before rounding and the rounding
- Optional: Can be disabled (set to 0%)

**Configuration:**
- Simple percentage input field
- Help text naming the customary guideline (up to 3%)
- Audit trail showing when percentage was last changed (planned, not implemented)

**Statement Impact:**
- Automatically calculated per apartment
- Shown as separate line item on statement (Verwaltungspauschale)
- Included in total balance calculation

**Use Cases:**
1. Initial setup: Set management fee to agreed percentage (e.g., 2%)
2. Annual review: Adjust percentage if contract changes
3. Validation: the percentage may not be negative

---

### 5.9 Utility Cost Statement Management

**Overview:** Generate and manage annual utility cost statements (Nebenkostenabrechnungen) for each tenant.

**Configuration Phase:**

**Accounting Period Selection:**
- Option 1: July 1 - June 30 (fiscal year variant)
- Option 2: November 1 - October 31 (winter-focused)
- Option 3: January 1 - December 31 (calendar year)
- Global setting applies to all statements

**Other Configuration:**
- Management cost percentage (see section 5.8)
- Heating distribution profile (see section 5.7)
- Payment deadline: days after the statement is sent (setting, default 30 days)
- Reminder deadline after payment deadline (setting `reminder_after_days`, default 14 days; not applied: a reminder is possible as soon as the payment deadline has passed)
- Currency (CHF - Swiss Francs)

**Statement Generation Workflow:**

**Step 1: Period Selection**
- Choose accounting period (e.g., "July 1, 2024 - June 30, 2025")
- System fetches all invoices and contracts for that period

**Step 2: Building/Apartment Selection**
- Select which buildings to include
- Or select specific apartments
- System shows summary: X apartments, Y invoices, Z total costs

**Step 3: Review & Calculate**
- System calculates prorated amounts based on tenant occupancy
- Show preview of each statement:
  - Tenant name and address
  - Apartment identification (e.g., "3.5 Zimmer Parterre, 82 m²")
  - Accounting period
  - Costs by category
  - Total costs and advance payments
  - Balance (refund or additional payment)
- Ability to adjust individual statement amounts if needed (drafts only)
- Ability to regenerate if invoices/contracts change: delete the draft and run the wizard again; a run creates drafts only for contracts without a statement in the period, and a draft names invoices recorded after it was created

**Step 4: Generate PDFs**
- Generate statement PDF for each rental contract, one per contract and period; at a tenant change each contract gets its own (requirements and sources: `docs/nebenkostenabrechnung-anforderungen.md`):
  A4, sender and «Seite x von y» on every page, property and period in the footer; recipient in the address field;
  the balance first (Nachzahlung with payment deadline or Rückerstattung); per category the distribution key, the
  building's costs, the Wohnungsanteil, the Zeitanteil (days rented or heating profile) and the tenant's share;
  heating costs with the heating profile and, for a tank, opening stock + invoices – closing stock; notes on the
  receipts (Art. 257b Abs. 2 OR) and the detailed heating statement (Art. 8 VMWG)
- Append Swiss QR-bill to each statement with an amount due (SIX layout: receipt 62 mm, payment part, 105 mm high at
  the bottom of the last page)
- Store PDFs in database
- Option to download all as ZIP (planned, not implemented)

**Statement Details:**

**Header Section:**
- Statement number (auto-generated, unique identifier)
- Statement date (date statement was issued)
- Tenant name and address
- Apartment identification (floor, size, room count)
- Apartment address (building address + unit number)
- Accounting period (from - to dates)
- Statement validity (e.g., "Valid from January 15, 2025")

**Cost Breakdown:**
- Grouped by category and distribution key
- Each line item shows:
  - Category name
  - Distribution key used
  - Total costs for category
  - Tenant's share (calculated)
  - Amount owed (CHF)

**Cost Calculation Example:**
```
Heizkosten (Heating)
  Total building costs: CHF 12,000
  Tenant occupancy: Full year
  Distribution: Pro Fläche (apartment 82m², building 800m²)
  Tenant share: 82/800 = 10.25%
  Amount: CHF 1,230 ────────────────────────

Stromkosten (Electricity)
  Total building costs: CHF 3,600
  Distribution: Pro Einheit (10 apartments, tenant 1)
  Tenant share: 1/10 = 10%
  Amount: CHF 360 ────────────────────────

TOTAL COSTS: CHF 1,590
Advance payments paid: CHF 1,560
BALANCE (refund): CHF 30
```

**Proration Logic:**

**Multiple Contracts in Same Period:**
- If tenant changed during accounting period
- Prorate base rent and advance payments to number of days occupied
- Example: Tenant 1 occupied 200 days, Tenant 2 occupied 165 days
  - Tenant 1 owes: Wohnungsanteil × (200/365)
  - Tenant 2 owes: Wohnungsanteil × (165/365)

**Heating Costs with Mid-Year Move:**
- Use monthly distribution profile
- Tenant occupied Oct 1 - Dec 31 in Mittelland profile
- Heating cost allocation: (Oct% + Nov% + Dec%) of total heating costs
- Example: October 8%, November 10%, December 12% = 30% of annual heating cost

**Vacancy Periods:**
- Track periods when apartment was vacant
- Allocate "Leerstandskosten" (vacancy costs) to building/owner
- Occupied apartments don't pay for vacant period costs
- Always, without the exception of Art. 7 Abs. 2 VMWG (no meters, heated only frost-free), which Dwello does not apply

**Statement Status Tracking:**

**Status Workflow:**
1. **Entwurf** (`draft`) - Statement generated, not yet sent; the only status in which it can be edited (amounts, line items) or deleted
2. **Versendet** (`sent`) - Statement delivered to the tenant, awaiting payment
3. **Überfällig** (`overdue`) - Sent and past the payment deadline (computed from the deadline)
4. **Bezahlt** (`paid`) - Settled; final, cannot be reverted
5. **Partial** (future) - If multiple transactions needed

**Status Management:**
- Mark statement as paid when tenant pays
- Record payment date and amount
- Auto-calculate days until payment deadline
- Payment deadline default: 30 days from statement date

**Reminder System:**

**Reminders (manual, levels 1–3):**
- The property manager creates a reminder for an overdue statement: Zahlungserinnerung (level 1), 2. Mahnung, 3. Mahnung; a fourth is not possible
- A reminder is possible as soon as the payment deadline has passed; the setting «Reminder period» (`reminder_after_days`, default 14 days) is not applied; automatic reminders are planned, not implemented
- Each reminder is a PDF in the tenant's documents and goes out by e-mail or letter according to the tenant's Korrespondenzkanal (scenarios in `statement-reminder.feature`)
- Show reminder status on statement detail view
- Log of all reminders sent (for audit trail)

**Reminder Content:**
- Reference statement number
- Reference tenant name
- Outstanding balance
- Deadline for payment
- Building/property manager contact info

**Reminder Actions:**
- Mark statement as "reminder sent"
- Generate multiple reminders if still unpaid
- Clear reminder status when payment received

**Statement List View:**

**Filters:**
- By accounting period
- By building
- By tenant name
- By status (draft, sent, overdue, paid)
- By balance amount

**Columns:**
- Statement number
- Tenant name
- Apartment identifier
- Period
- Total amount due (CHF)
- Status
- Days until payment due
- Actions (view, download, mark paid, send reminder, delete)

**Statement Detail View:**

**Information Display:**
- Full statement content (as generated in PDF)
- PDF preview/viewer
- Payment history (if paid)
- Reminder history
- Associated invoices and contracts

**Actions Available:**
- Download as PDF
- View PDF in browser
- Mark as paid (date picker for payment date)
- Send payment reminder
- View calculation details (breakdown of how costs were prorated)
- Edit statement (draft only)
- Delete statement (draft only, with confirmation)
- Regenerate statement (if invoices/contracts updated)

---

### 5.10 QR Invoice Generation (Swiss QR-bill)

**Overview:** Generate Swiss-standard QR-bills (Zahlteil mit QR-Code) for all utility cost statements.

**Features:**

**QR-Bill Attachment:**
- Automatically appended to end of statement PDF
- One QR-bill per statement
- Standard Swiss QR-bill format (ISO 20022 standard)

**QR-Bill Content:**
- Recipient: Property manager details
- IBAN: Configured in settings
- Reference number: QR reference (QRR) only when the configured IBAN is a QR-IBAN; with a normal IBAN no reference
- Amount: Total balance due (CHF)
- Debtor: Tenant name and address
- Payment description: Statement number and period reference

**IBAN Management:**
- Global IBAN setting (Swiss bank account details)
- Stored securely in configuration
- Multiple IBANs per building (future feature)
- Validation with a valid MOD-97 checksum: the settings form accepts only Swiss IBANs (CH), the QR-bill service also Liechtenstein (LI); which one applies is open (#191)

**QR Code Generation:**
- Encodes all necessary payment information
- Scannable by Swiss bank apps and digital payment systems
- Complies with SIX Swiss standards

**Use Cases:**
1. Tenant payment: Tenant scans QR-code with banking app to pay directly
2. Digital workflow: Automatic payment recognition by bank systems
3. Professional appearance: Meets Swiss business standards

---

### 5.11 Allowed Utility Costs Validation

**Overview:** Ensure only legally-allowed utility costs are charged to tenants, per Swiss regulations.

**Allowed Costs (zulässig):**

| Category | Examples |
|----------|----------|
| **Heating & Hot Water** | Fuel costs, heating maintenance, chimney cleaning services, metering service fees, heat pump operation |
| **Water & Wastewater** | Water consumption charges, wastewater treatment fees, water quality testing |
| **General Electricity** | Stairwell lighting, basement/common area lighting, elevator electricity, laundry room equipment, garden lighting (if shared) |
| **Property Maintenance** | Regular garden maintenance, snow removal, street/entrance cleaning, gutter cleaning, facade maintenance |
| **Building Infrastructure** | Elevator maintenance and electricity, caretaker wages/services, stairwell maintenance, intercom systems |
| **Waste Disposal** | Garbage collection, recycling services, composting services, hazardous waste disposal |
| **Communication** | Basic cable TV fees, radio reception fees, common antenna maintenance |

**Not Allowed Costs (nicht zulässig):**

| Category | Why Not Allowed |
|----------|----------------|
| **Maintenance & Repairs** | Structural repairs, renovation costs (unless categorized as building infrastructure service) |
| **Acquisition Costs** | Purchase of equipment or property improvements |
| **Taxes & Fees** | Property taxes, municipal fees (except VAT on services) |
| **Insurance** | Building insurance, liability insurance (except insurance specifically for utility systems) |
| **Connection Fees** | Cable/internet connection activation fees, network setup fees |
| **Financing Costs** | Interest on loans, mortgage payments |
| **Administration (Verwaltung)** | General administration costs; the manager's effort for the utility costs is charged only through the separate Verwaltungspauschale (section 5.8) |

**Validation System:**

**Automatic Flagging:**
- LLM categorizes invoice
- System checks validity status of category
- Invalid costs automatically flagged with red indicator
- Validation reason shown to user (e.g., "Repair costs - not allowed utility expense")

**Manual Override:**
- An invoice of an allocable category can be excluded from statements; an invoice of a non-allocable category is never allocable, whatever the form or the LLM sends
- Override creates audit log entry (planned, not implemented)

**Reporting:**
- Statistics on % of invalid costs by category
- Ability to filter statements to show cost breakdown
- Report generation for tax/legal compliance review

**Use Cases:**
1. Invoice review: System flags repair invoice as "Not Allowed", prompting user to exclude
2. Cost analysis: User reviews high percentage of invalid costs, indicating possible invoice errors
3. Legal compliance: Generates report for audit showing all costs were properly validated

---

## 6. User Interface Design

### 6.1 Dashboard (Overview)

**Purpose:** Provide property manager with at-a-glance overview of portfolio status and pending actions.

**Layout:**
- Header with user profile and logout
- Responsive grid layout (adapts to tablet/desktop)
- Multiple widget sections:

**Widget 1: Portfolio Summary**
- Total buildings
- Total apartments
- Total tenants (current)
- Average occupancy rate (%)

**Widget 2: Financial Overview**
- Total monthly advance payments collected
- Outstanding balances (unpaid statements)
- Total invoices this month
- Trend indicators (up/down)

**Widget 3: Outstanding Items**
- Count of unpaid statements
- Total amount owed
- Oldest unpaid statement age
- "View all" link to statements list

**Widget 4: Upcoming Deadlines**
- Next accounting period end date
- Payment reminders due
- Upcoming contract renewals
- Upcoming lease expirations

**Widget 5: System Status**
- Last backup timestamp
- Pending invoices (not yet categorized)
- Sync status with external services (OpenPLZ, LLM)

**Widget 6: Quick Actions**
- Button: Add Building
- Button: Add Invoice
- Button: Generate Statements
- Button: View Tenant List

**Analytics Section (Lower):**
- Cost breakdown chart (pie chart by category)
- Occupancy trend (line chart over months)
- Revenue trend (line chart showing advance payments)
- Selectable date range (last 3/6/12 months, custom)

**Design Notes:**
- Clean, minimal design
- Color-coded status indicators (green=good, yellow=caution, red=urgent)
- Mobile-responsive
- German UI; statement PDFs in five languages

---

### 6.2 Property Management Screen

**Purpose:** Central hub for managing buildings and apartments.

**Layout:**

**Top Navigation:**
- "Buildings" tab (active)
- "Map View" tab
- "Add Building" button

**Buildings List View:**
- Table or card grid (user-selectable)
- Columns/Fields:
  - Building address (street, postal code, city)
  - Apartment count
  - Occupancy (X/Y occupied)
  - Total monthly advance payments
  - Status indicators (all green/has issues)

**Building Card (Grid View):**
- Address as title
- Map thumbnail showing location
- Apartment count badge
- Occupancy percentage
- Last updated date
- Quick actions: View Details, Edit, Delete

**Building Detail View (when clicked):**
- Building header with address
- Tab 1: Apartments
  - List of all apartments in building
  - Per apartment: floor, size, room count, current tenant, occupancy status
  - Actions: Add apartment, Edit apartment, View tenant
  - Sub-list: Show contract history for each apartment

- Tab 2: Invoices
  - Filter to show only invoices for this building
  - List of invoices (see section 6.4)

- Tab 3: Statements
  - Show generated statements for this building's apartments
  - Filter by period

- Tab 4: Configuration
  - Notes/metadata

**Map View:**
- Interactive map (OpenStreetMap) centered on Switzerland
- Building markers with icons
- Marker color indicates status (green/yellow/red)
- Hover shows: Address, apartment count, occupancy
- Click building to open detail view
- Zoom to building functionality
- Search/filter by address

---

### 6.3 Apartment & Tenant Management

**Purpose:** Manage individual apartments and tenant information.

**Apartment List View (within Building Details):**
- Table with sortable columns:
  - Floor
  - Size (m²)
  - Rooms
  - Current Tenant
  - Status (Occupied/Relet/Vacant/Reserved)
  - Monthly Rent
  - Actions

**Apartment Detail View:**
- Apartment identification (floor, size, room count)
- Address
- Physical characteristics (heating type, meters, etc.)
- Occupancy history (timeline showing current and past tenants)

**Current Tenant Section:**
- Tenant name and contact info
- Current contract terms (rent, advance payments, start date)
- Months occupied in current period
- View/download contract PDF
- Actions: Edit contract, Add modification, End contract

**Tenant History Section:**
- Timeline of all past tenants
- Each entry: Tenant name, dates occupied, rent amount

**Add/Edit Apartment Form:**
- Floor (dropdown: Parterre, 1. Stock, etc.)
- Size in m²
- Number of rooms
- Room breakdown (optional)
- Meter IDs (optional)
- Submit/Cancel

**Tenant Management (Separate Section):**

**Tenant List View:**
- Table with columns: Name, Email, Phone, Current Apartment, Move-in Date
- Search by name
- Filter by current/former tenants
- Actions: View details, Edit, Delete (with safety warning)

**Tenant Detail View:**
- Personal information (name, email, phone, address)
- Current apartment and contract
- Historical apartments and contracts
- Active/inactive status
- Actions: Edit tenant, View contracts, Export data

**Add/Edit Tenant Form:**
- First name (required)
- Last name (required)
- Date of birth (optional)
- Email (required only when the Korrespondenzkanal is e-mail)
- Phone (optional)
- Korrespondenzkanal: letter (default) or e-mail
- Address (street, postal code, city)
- Notes (optional)
- Submit/Cancel

---

### 6.4 Invoice Management Screen

**Purpose:** Centralized invoice entry, categorization, and review.

**Invoice List View:**
- Table with columns (sortable):
  - Date
  - Billing Entity
  - Description (truncated)
  - Category (color-coded)
  - Amount (CHF)
  - Distribution Key
  - Valid/Invalid (icon indicator)
  - Actions (View, Edit, Delete)

**Filters (Left Sidebar or Top Bar):**
- Building (multi-select)
- Category (multi-select)
- Date range (from/to)
- Validity status (All, Valid, Invalid)
- Distribution key (multi-select)
- Min/Max amount range

**Search:**
- Full-text search on billing entity and description

**Invoice List Actions:**
- "Add Invoice" button
- "Bulk Actions" (mark valid/invalid, categorize)
- "Export" to CSV
- "Import" (future)

**Invoice Detail/Edit Form:**
- Invoice date (date picker)
- Building (dropdown)
- Billing entity name (text field)
- Billing entity address (text field)
- Work description (text area)
- Amount in CHF (number field)
- Category (dropdown, pre-filled by LLM)
- Distribution key (dropdown)
- Valid/Invalid radio buttons (with reason text)
- Notes (text area)
- Submit/Cancel/Delete

**LLM Categorization:**
- When adding invoice, system automatically calls the configured LLM (default: local Ollama)
- Shows suggested category with confidence indicator
- User can accept or manually select different category
- Feedback mechanism to improve model accuracy (future)

**Category Validation:**
- System automatically marks invalid categories with warning
- Shows reason why category is not allowed
- User can change the AI category; the form requires a reason (Grund der Änderung)

**Invalid Cost Handling:**
- Invalid invoices highlighted in list
- When added to statement, system warns user
- Option to exclude from statement distribution
- Audit log shows which invalid costs were excluded (planned, not implemented)

---

### 6.5 Utility Cost Statement Configuration

**Purpose:** Global settings for statement generation and cost allocation rules.

**Tab 1: Accounting Period**
- Radio buttons:
  - "July 1 - June 30" (selected shows as "2024-07-01 bis 2025-06-30")
  - "November 1 - October 31"
  - "January 1 - December 31"
- Selected period shown with next period preview
- Warning if current date is past accounting period

**Tab 2: Management Costs**
- Percentage input (0% or more)
- Label: "Verwaltungspauschale"
- Help text: "Vorschlag beim Erstellen der Abrechnungen, dort für jeden Lauf anpassbar."
- Checkbox: "Include management costs in statements"

**Tab 3: Heating Distribution**
- Section 1: Select predefined profile
  - "Heizung + Warmwasser"
  - "Heizung Mittelland"
  - "Heizung Bergregion"
  - "Heizung Tessin"
- Section 2: Monthly percentages table
  - Months: Jan, Feb, Mar, ..., Dec
  - Percentage inputs (read-only if predefined profile selected)
  - Total validation: shows sum (must equal 100%)
  - Custom profile: checkbox to enable custom percentages

**Tab 4: Payment Settings** (not on the settings page; the payment deadline is the backend setting `payment_deadline_days`, default 30)
- Payment deadline (X days after the statement is sent, default 30)
- Reminder deadline (Y days after payment deadline, default 14; not applied, see section 5.9 «Reminders»)
- Default currency (CHF)

**Tab 5: Distribution Keys Management**
- Section 1: Predefined keys (read-only)
  - Pro Einheit
  - Pro Fläche (m²)
  - Pro Zimmer
  - Heizung (Fläche 70% / Einheit 30%)
  - (show description and formula)

- Section 2: Custom keys
  - Table listing all custom keys
  - Columns: Name, Formula, Usage count, Actions
  - Button: "Add Custom Key"
  - Per key: Edit button, Delete button (disabled if in use)

- Add/Edit Custom Key Form (Modal):
  - Name (text field)
  - Description (text area)
  - Formula (text field with syntax help)
  - Variables reference: {area}, {volume}, {rooms}, {units}
  - Test with sample apartment (preview calculation)
  - Submit/Cancel

**Tab 6: Category Management**
- Table listing all categories
- Columns: Name, Allowed/Not Allowed, Usage count, Actions
- All categories editable; delete only while unused

- Add Category Form (Modal):
  - Name (text field)
  - Description (text area)
  - Allowed/Not Allowed (radio)
  - Reason/Notes (text area, for reference)
  - Submit/Cancel

- Edit Category Form:
  - Name, Description, Allowed/Not Allowed
  - Delete button

**Tab 7: IBAN Setting**
- IBAN input field (for QR-bill generation)
- Format validation (settings form: CH only; QR-bill service: CH or LI, #191; MOD-97 checksum)
- Test QR-bill preview
- Help text: "Konto, auf das Ihre Mieter Nachzahlungen überweisen; es steht auf der QR-Rechnung."
- A QR reference is printed only when the IBAN is a QR-IBAN; with a normal IBAN the QR-bill carries no reference

---

### 6.6 Statement Generation & Management

**Purpose:** Create utility cost statements and track payment status.

**Statement Creation Wizard:**

**Step 1: Select Accounting Period**
- Display current configured period (e.g., "July 1, 2024 - June 30, 2025")
- Option to override period for this statement run (e.g., generate for different period)
- Date range picker if overriding
- Next button

**Step 2: Select Properties**
- Option A: "All buildings"
- Option B: "Select specific building(s)" (checkboxes with building names)
- Option C: "Select specific apartment(s)" (tree view with buildings and apartments)
- Shows summary: X buildings, Y apartments, Z tenants affected
- Show list of all apartments to be included
- Next button / Previous button

**Step 3: Review & Adjust**
- Table preview of each statement to be generated:
  - Tenant name
  - Apartment identifier
  - Period
  - Total costs (CHF)
  - Advance payments paid (CHF)
  - Balance (CHF)
  - Expand row to see detailed breakdown
- Ability to:
  - Adjust individual amounts if errors discovered (drafts only)
  - Remove specific statements from batch
  - Recalculate if invoices changed
- Warning indicators for unusual amounts (very high/low)
- Next button / Previous button

**Step 4: Confirm & Generate**
- Summary: "Generating X statements"
- Show which buildings included
- Date range
- "Generate PDFs" button
- "Save but don't generate" (for review later)
- Progress bar showing generation status
- Result: "Successfully generated X statements"
  - Button: "Download all as ZIP" (planned, not implemented)
  - Button: "View statements list"

**Statement List View:**
- Table with columns (sortable):
  - Statement Number
  - Tenant Name
  - Apartment
  - Period
  - Amount Due (CHF)
  - Status (Entwurf/Versendet/Überfällig/Bezahlt)
  - Days Until Due
  - Actions

**Filters (Sidebar):**
- Period (dropdown of generated periods)
- Building (multi-select)
- Tenant name (search)
- Status (Entwurf, Versendet, Überfällig, Bezahlt, All)
- Date range (generated date)

**Statement Detail View:**
- Tenant information section
- Account period header
- Full statement content (same as PDF)
- Cost breakdown table
- Total costs
- Total advance payments
- Balance

**PDF Section:**
- Embedded PDF viewer (or preview thumbnail)
- Download button
- Print button

**Payment Section:**
- Current status (Entwurf/Versendet/Überfällig/Bezahlt)
- Payment deadline
- Days until due (color-coded: green/yellow/red)
- If unpaid:
  - "Mark as Paid" button (opens date picker)
  - "Send Reminder" button
  - Reminder history (shows if reminders sent, dates)
- If paid:
  - Payment date
  - Payment amount (should match statement balance)
  - No undo: Bezahlt (paid) is final

**Associated Data:**
- List of invoices included in this statement
- List of contracts used in calculation (with dates occupied)
- Calculation breakdown (how prorating was applied)

**Statement Actions:**
- Download as PDF
- Print
- Mark as paid (final, no undo)
- Send payment reminder
- Regenerate (if invoices/contracts changed)
- Edit amounts and line items (draft only)
- Delete (draft only, with confirmation)

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Metric | Target |
|--------|--------|
| Page load time | <2 seconds (95th percentile) |
| API response time | <500ms (95th percentile) |
| PDF generation per statement | <5 seconds |
| Invoice bulk entry | 10 invoices in <30 seconds |
| Statement generation | <10 seconds for 50 apartments (open, see docs/migration-mva.md P1) |
| Dashboard load | <1.5 seconds |
| Search response | <300ms |

**Optimization Strategies:**
- Database query optimization and indexing
- Caching frequently accessed data (buildings, apartments, categories)
- Async PDF generation (background processing)
- Frontend code splitting and lazy loading
- Responsive images and asset optimization
- API rate limiting to prevent abuse (planned, not implemented)

### 7.2 Security

**Authentication:**
- OAuth 2.0 / SSO integration (Google, Microsoft; Swiss eID planned, not implemented)
- No direct password storage
- Secure session tokens with expiration
- HTTPS/TLS 1.2+ for all communication

**Authorization:**
- Role-based access control (future: multi-user support)
- Single user in MVP has full access
- Session: the session JWT expires after `JWT_EXPIRY` (default 7 days); the open app refreshes it periodically (every 50 minutes). No inactivity timeout is implemented
- Login audit logging (planned, not implemented)

**Data Protection:**
- SQL injection prevention (parameterized queries, ORM)
- XSS protection (input sanitization, output encoding)
- CSRF protection (token validation)
- File upload validation (only PDFs accepted)
- Rate limiting on API endpoints (planned, not implemented)

**Data at Rest:**
- No passwords or OAuth tokens are stored
- PostgreSQL SSL, database encryption and field encryption (e.g. IBAN): planned, not implemented; depends on deployment

**Audit Logging (planned, not implemented):**
- Log all sensitive operations (invoice changes, statement generation)
- Log invalid access attempts
- Retention: 1 year of logs
- Admin dashboard for log review (future feature)

---

### 7.3 Data Privacy & Compliance

**Swiss Data Protection:**
- Compliance with Swiss Data Protection Act (SDPA)
- No data transfer outside Switzerland (unless explicitly configured)
- With an external LLM provider, invoice data goes to that provider; the privacy statement then names the provider and its country from `LLM_PROVIDER` and `LLM_PROVIDER_COUNTRY` (Swiss DSG Art. 19), see README section "External LLM provider"
- Personal data minimization (only collect necessary data)

**GDPR Compliance:**
- For EU tenants, ensure GDPR Article 5-7 compliance
- Data processing agreements documented
- Right to be forgotten (data anonymization/deletion)
- Data breach notification procedures

**Financial Data Retention:**
- Swiss law requires 10 years of financial records
- Utility statements retained for 10 years
- Contracts retained for duration + 10 years
- Automatic deletion after retention period (future feature)

**Consent & Privacy:**
- Privacy policy in all Swiss languages
- Explicit consent for data processing
- Transparent communication of data use
- Option to export data in standard format (future)

---

### 7.4 Reliability

**Availability:**
- Uptime target: 99.5% (measured monthly)
- Graceful error handling with user-friendly messages
- Fallback mechanisms (e.g., manual address entry if API down)

**Data Integrity:**
- Database ACID transactions for financial operations
- Foreign key constraints to maintain referential integrity
- Backup before statement generation
- Transaction rollback on error

**Backups:**
- Automated daily backups at fixed time (e.g., 2 AM)
- Backup retention: 30 days (configurable)
- Offsite backup storage (encrypted)
- Restore procedure tested monthly
- Backup verification on completion

**Error Handling:**
- Comprehensive error logging (syslog, file, or service)
- Error monitoring dashboard (future feature)
- User-friendly error messages
- Technical error details in logs only (not shown to user)

**Recovery:**
- Documented disaster recovery procedure
- Recovery Time Objective (RTO): <1 hour
- Recovery Point Objective (RPO): <1 day
- Regular DR testing

---

### 7.5 Usability

**User Interface:**
- Clean, minimal design following modern design principles
- Consistent layout across all screens
- Responsive design: Desktop (1024px+), Tablet (768px+), Mobile (320px+)
- Touch-friendly buttons and controls

**Accessibility:**
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios ≥4.5:1
- Focus indicators visible
- Alt text for all images

**Internationalization:**
- User interface in German
- Tenant-facing statement PDFs and reminders in German, French, Italian, English
- Consistent translations across application
- Date/time formatting per locale
- Currency formatting (CHF with appropriate symbols)

**Help & Documentation:**
- Contextual help text (hover tooltips)
- User guide in-app (accessible from top menu)
- Video tutorials for complex workflows (future)
- FAQ section
- Contact support option

**Navigation:**
- Clear main menu with logical grouping
- Breadcrumb trails on detail pages
- Back buttons and navigation history
- Consistent button placement and labeling

---

### 7.6 Scalability

**Initial Scale:**
- Designed for 1-5 buildings
- Up to 50 apartments
- Up to 200 tenants (current + historical)
- Up to 1000 invoices per year

**Scalability Approach:**
- Stateless backend (horizontal scaling with multiple containers)
- Database connection pooling
- Read replicas for scaling read-heavy operations (future)
- Caching layer (Redis) for frequently accessed data (future)

**Performance Scaling:**
- Database indexing on frequently queried fields (building_id, tenant_id, period dates)
- Efficient PDF generation (async processing)
- Batch operations for bulk statement generation
- Query optimization to minimize N+1 problems

**Cloud Deployment:**
- Docker containerization for easy scaling
- Kubernetes support (future)
- Load balancing across multiple instances
- Auto-scaling based on CPU/memory utilization (future)

---

### 7.7 Maintainability

**Code Quality:**
- TypeScript for type safety
- ESLint and Prettier for code style consistency
- Modular architecture with clear separation of concerns
- Comprehensive comments for complex logic
- No hardcoded values (all configuration externalized)

**Documentation:**
- Code comments for non-obvious logic
- API documentation (auto-generated from TypeScript)
- Database schema documentation
- Architecture decision records (ADRs)
- Deployment and configuration guides
- Troubleshooting guide

**Testing:**
- Unit tests (>80% coverage for critical paths)
- Integration tests for API endpoints
- End-to-end tests for key user workflows
- Database migration tests
- Performance benchmarks

**Deployment:**
- CI/CD pipeline (GitHub Actions or similar)
- Automated testing on every commit
- Staging environment mirrors production
- Blue-green deployments for zero-downtime updates
- Rollback procedures documented

**Configuration:**
- Environment-based configuration (dev, staging, prod)
- .env files for sensitive data (not in git)
- Database migrations versioned and automated
- Feature flags for gradual rollout (future)

**Logging:**
- Structured logging with JSON format
- Log levels: DEBUG, INFO, WARN, ERROR
- Aggregation and analysis (future)
- PII masking in logs

---

## 8. External Dependencies

### 8.1 APIs

**OpenPLZ API**
- **URL:** https://www.openplzapi.org/de/
- **Purpose:** Swiss address search and postal code validation
- **Integration:** Called from the frontend when user enters address in building form
- **Fallback:** Manual address entry if API unavailable
- **Rate limit:** Check API documentation (likely generous)
- **Cost:** Free (open source)

**OAuth Provider**
- **Options:** Google OAuth, Microsoft Azure AD, Swiss eID (future)
- **Purpose:** Secure user authentication (SSO)
- **Integration:** Callback to `/auth/callback` endpoint
- **Tokens:** Access token stored securely, refresh token for session extension
- **Cost:** Free (generally included with service account)

### 8.2 Libraries & Services

**LLM for Invoice Categorization**

**Provider:** any OpenAI-compatible API, configured through `.env`:
- `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`
- Default: local **Ollama** with `qwen2.5vl:7b` (Docker container); invoice data stays on the server
- External provider (e.g. OpenAI): `LLM_PROVIDER` and `LLM_PROVIDER_COUNTRY` are required and named in the privacy statement (Swiss DSG Art. 19); see README section "External LLM provider"
- `LLM_ENABLED=false` turns categorization off

**Integration:**
- Call the configured LLM endpoint when invoice added
- Prompt: Analyze invoice description and categorize
- Response: Suggested category + confidence
- Fallback: Manual categorization if LLM unavailable
- Caching: Cache common categories to reduce LLM calls

**PDF Generation**

**Library Options:**
- **PDFKit** (Node.js)
  - Pure JavaScript PDF generation
  - Swiss QR-bill support available
  - Pros: No external dependencies, fast
  - Cons: Limited layout control

- **Puppeteer + Headless Chrome**
  - High fidelity (HTML → PDF)
  - Pros: Maximum control, supports complex layouts
  - Cons: Slower, more resource intensive

**Chosen:** PDFKit; the QR-bill section is drawn by own code with `qrcode` (see docs/tech-stack.md)

**Swiss QR-bill Generation**

**Libraries:**
- **QRCode.js** or **qrcode** (npm)
  - QR code generation
  - Encodes payment data per Swiss standard
  - Cost: Free

**Integration:**
- Generate QR code with amount, IBAN, statement reference
- Embed in PDF statement
- Validate QR code format before generation

**Map Integration**

**Provider:** OpenStreetMap + Leaflet.js
- **OpenStreetMap:** Free, open-source map data
- **Leaflet:** Lightweight JavaScript library for maps
- **Cost:** Free
- **Privacy:** No tracking, self-hosted tiles available

**Internationalization (i18n)**

**Library:** `svelte-i18n`
- **Purpose:** UI texts (German) and tenant-facing statement PDFs
- **Languages:** UI in German; statement PDFs and reminders in German, French, Italian, English
- **Format:** JSON translation files per language
- **Cost:** Free

**Date/Time Handling**

**Library:** none; built-in `Date` and `Intl`
- **Purpose:** Date calculations, formatting per locale
- **Use:** Contract dates, statement periods, prorating calculations
- **Cost:** Free

---

## 9. Data Model

The authoritative schema is `docs/data-model.md`, written from the SQL migrations in `backend/migrations/` (`0001_schema.sql` for the schema, `0002_stammdaten.sql` for the seeded categories, distribution keys and heating profiles). This section only lists the entities:

- **Building** (`buildings`)
- **Apartment** (`apartments`)
- **Tenant** (`tenants`)
- **Rental contract** (`rental_contracts`)
- **Category** (`categories`)
- **Distribution key** (`distribution_keys`)
- **Heating profile** (`heating_profiles`)
- **Invoice** (`invoices`)
- **Utility statement** (`utility_statements`, status `draft`, `sent`, `paid`; `overdue` is computed) and its **line items** (`utility_statement_line_items`)
- **Document** (`documents`)
- **Configuration** (`configuration`, key/value; keys and defaults in `backend/src/services/config.service.ts`: `accounting_period`, `management_fee_pct`, `default_heating_profile_id`, `default_distribution_key_id`, `company_name`, `company_address`, `company_postal_code`, `company_city`, `iban`, `payment_deadline_days` (default 30), `reminder_after_days` (default 14), `default_language`)

An audit log is planned, not implemented.

---

## 10. Implementation Phases

**Overall Approach:** Single comprehensive implementation with 7 internal phases.

### Phase 1: Foundation (Weeks 1-2)
**Objective:** Set up development environment and infrastructure

**Deliverables:**
- SvelteKit project initialized with TypeScript
- ElysiaJS backend scaffolding
- PostgreSQL database schema (all entities)
- Docker Compose setup (services: app, PostgreSQL, Ollama)
- OAuth/SSO integration framework
- Base UI layout and navigation
- i18n setup (German UI; statement PDFs in five languages)
- Basic authentication flow

**Tests:** Authentication, environment setup, database connectivity

### Phase 2: Core Management (Weeks 3-4)
**Objective:** Building, apartment, and tenant CRUD operations

**Deliverables:**
- Building CRUD endpoints and UI screens
- Apartment CRUD endpoints and UI screens
- Tenant CRUD endpoints and UI screens
- OpenPLZ API integration for address search
- Map visualization with Leaflet
- Building detail views with apartment list
- Apartment occupancy tracking
- Data validation and error handling

**Tests:** CRUD operations, API integration, address validation, map rendering

### Phase 3: Contract Management (Week 5)
**Objective:** Rental contract management with PDF storage

**Deliverables:**
- RentalContract CRUD endpoints and UI
- Contract creation wizard
- PDF upload for contract documents
- Contract history and timeline visualization
- Contract modification tracking
- Contract linking to apartments and tenants
- Contract validation (dates, rent amounts)
- Current vs. historical contract filtering

**Tests:** Contract operations, PDF storage, date validation, history tracking

### Phase 4: Invoice & Categorization (Weeks 6-7)
**Objective:** Invoice management with LLM-powered categorization

**Deliverables:**
- Invoice CRUD endpoints and UI
- Local LLM integration (Ollama)
- Auto-categorization prompt and logic
- Category management (add/edit custom categories)
- Validity checking and flagging
- Distribution key selection
- Invoice list with filtering and search
- Manual categorization override
- Category and distribution key configuration screens

**Tests:** Invoice operations, LLM categorization accuracy, validity logic, category management

### Phase 5: Statement Calculation Engine (Weeks 8-9)
**Objective:** Complex utility cost statement generation and calculations

**Deliverables:**
- Utility statement data model and endpoints
- Statement generation algorithm:
  - Cost allocation by distribution key
  - Prorating for multiple contracts in same period
  - Heating cost monthly distribution
  - Vacancy cost handling
  - Management cost calculation
- Statement configuration UI (accounting period, management %, heating profile)
- Distribution key management (predefined and custom)
- Heating profile selection and custom percentage input
- Statement calculation preview and review
- Statement storage in database
- Statement list view and filtering

**Tests:** Prorating calculations, edge cases (mid-year moves, vacancies), formula evaluation, statement accuracy

### Phase 6: PDF Generation & QR Bills (Week 10)
**Objective:** Professional statement generation with Swiss QR-bills

**Deliverables:**
- PDF generation from statement data
- Swiss QR-bill generation with correct encoding
- IBAN configuration
- PDF embedding in database
- Multi-language PDF templates (German, French, Italian, English)
- Statement number generation
- PDF download and batch download (ZIP; planned, not implemented)
- QR-bill validation and testing
- PDF preview in browser

**Tests:** PDF generation, QR-bill format, multi-language rendering, batch operations

### Phase 7: Payment Tracking & Polish (Weeks 11-12)
**Objective:** Payment status, reminders, and final refinements

**Deliverables:**
- Payment status tracking (draft, sent, overdue, paid)
- Payment deadline and reminder dates
- Mark statement as paid workflow
- Reminder generation and sending (generate documents)
- Statement status dashboard
- Admin dashboard with portfolio overview
- Financial analytics and charts
- Performance optimization
- Comprehensive testing (unit, integration, e2e)
- Documentation and user guide
- Backup automation setup
- Security hardening

**Tests:** Payment workflows, reminders, analytics accuracy, performance benchmarks, security testing, full system e2e tests

---

## 11. Success Metrics

### Functional Metrics
- System successfully manages 1-5 buildings with 50+ apartments
- All utility statements generated accurately without calculation errors
- Prorating calculations validated against manual calculations
- Utility cost distribution matches legal requirements
- LLM categorization accuracy >85% (validated against manual review)

### Performance Metrics
- Page load time <2 seconds (95th percentile)
- API response time <500ms (95th percentile)
- PDF generation <5 seconds per statement
- Statement batch generation (50 statements) <60 seconds (open, see docs/migration-mva.md P1)
- No performance degradation with 200+ tenants

### Reliability Metrics
- Backup success rate 100% (automated daily backups)
- Zero data loss incidents
- Uptime ≥99.5% during operation
- Database transaction integrity maintained
- Graceful error recovery without user intervention

### User Experience Metrics
- User satisfaction score ≥4/5 (if surveyed)
- Average statement generation time <1 hour for all properties
- Zero calculation errors reported by users
- Multi-language support complete and accurate
- Accessibility WCAG 2.1 AA compliance achieved

### Compliance Metrics
- Swiss utility cost regulations fully implemented
- LLM categorization aligned with allowed/disallowed costs
- Data retention policies implemented (10 years for financial records)
- GDPR compliance for EU tenants verified
- Audit logs capturing all sensitive operations

---

## 12. Future Enhancements (Post-MVP)

### Phase 2 Features

**Tenant Portal**
- Tenants log in to view their statements
- Download statement PDFs
- View payment status and history
- Contact property manager
- View contracts and lease terms

**Owner Portal**
- Building owners view portfolio financials
- See distributions to owners
- Track income and expenses
- Generate annual reports

**Advanced Reporting**
- Custom report builder
- Portfolio analytics dashboard
- Trend analysis (costs over time)
- Comparison between buildings
- Expense breakdown by category

**Bulk Operations**
- CSV import for invoices (with OCR parsing)
- Batch tenant import
- Bulk contract uploads
- CSV export of statements

**Payment Integration**
- Integration with Swiss payment gateways
- Automatic payment tracking
- Payment reminders via email
- Tenant self-service payments

**Mobile App**
- Native iOS/Android apps
- View statements on mobile
- Mark payments on the go
- Photo upload for invoice scanning
- Push notifications for reminders

**Advanced AI Features**
- Anomaly detection (unusual costs)
- Predictive analytics (cost forecasting)
- Automated expense categorization improvement
- Natural language processing for invoice summaries
- Intelligent recommendations

**System Enhancements**
- Multi-user support with role-based access
- Team collaboration features
- API for third-party integrations
- Webhook support for external systems
- Advanced permission management

**Document Management**
- Central document repository
- Invoice scanning and OCR
- Contract digitization
- Automatic categorization
- Full-text search

**Maintenance Management**
- Maintenance request system
- Contractor management
- Work order tracking
- Cost allocation for maintenance

**Tenant Communication**
- In-app messaging between tenant and manager
- Email notifications
- SMS reminders (optional)
- Document delivery tracking
- Automated renewal reminders

---

## 13. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-----------|-----------|
| LLM categorization inaccuracy | Medium | Medium | Allow manual override, maintain labeled training data, periodic accuracy audits |
| Swiss legal compliance gaps | High | Low | Legal review with property management expert, reference SV/SVIT guidelines, validation testing |
| Complex prorating calculations | Medium | Medium | Extensive unit tests with edge cases, manual validation against examples, financial auditor review |
| PDF generation performance | Low | Low | Async processing, template caching, batch optimization, consider Puppeteer if needed |
| Data loss from backup failure | High | Low | Test restore monthly, redundant backups, encryption of backups, retention policy |
| User adoption/learning curve | Medium | Medium | Intuitive UI design, comprehensive documentation, video tutorials, in-app help |
| OpenPLZ API downtime | Low | Low | Cache results, manual address entry fallback, retry logic with exponential backoff |
| Ollama/LLM unavailable | Medium | Low | Allow manual categorization, fallback to default categories, health checks, restart policy |
| PostgreSQL performance | Medium | Low | Index optimization, query analysis, connection pooling, monitoring |
| Date/timezone issues | Medium | Low | Always use UTC in database, convert on display, comprehensive date testing |
| Multi-language errors | Medium | Medium | Professional translation review, native speaker testing, consistent terminology |
| Security vulnerabilities | High | Low | Regular security audits, OWASP compliance, penetration testing, dependency scanning |

---

## 14. Glossary & Terms

| Term | Definition |
|------|-----------|
| **Nebenkostenabrechnungen** | Utility cost statements; annual accounting of shared building costs |
| **Mietzins** | Base rent for apartment |
| **Akonto** | Monthly advance payment toward utility costs |
| **Verteilschlüssel** | Distribution key; method for allocating costs among apartments |
| **Wohnfläche** | Living area of apartment in m² |
| **Zimmer** | Room; 3.5 Zimmer = 3 bedrooms + 1 additional room |
| **Heizkosten** | Heating costs |
| **Warmwasser** | Hot water |
| **Leerstandskosten** | Vacancy costs; allocated when apartment is unoccupied |
| **Liegenschaftsverwalter** | Property manager |
| **Liegenschaft** | Property; building or real estate |
| **Vertragsende** | Contract end date |
| **Vertragsbeginn** | Contract start date |
| **Verwaltungspauschale** | Management fee: a percentage of the tenant's own utility costs for the administrative effort, a separate statement line, not an invoice category |
| **zulässig** | Allowed (utility costs) |
| **nicht zulässig** | Not allowed (utility costs) |
| **QR-bill** | Swiss QR invoice standard for payments |
| **IBAN** | International Bank Account Number |
| **SSO** | Single Sign-On; OAuth authentication |

---

## 15. Appendix: Swiss Legal Framework References

This PRD complies with the following Swiss regulations:

- **Swiss Property Lease Act (Mietgesetz)** - Regulations on utility cost distribution
- **SVIT Property Management Guidelines** - Industry standards for property management
- **Swiss QR-bill Standard (ISO 20022)** - Electronic payment format
- **Swiss Data Protection Act (SDPA)** - Data privacy requirements
- **GDPR** - For EU tenants and data processing

Key Legal Requirements Addressed (see the status note below for what is implemented):
- Allowed/disallowed utility cost validation
- Management fee: customary guideline up to 3% of total costs, not a cap
- Detailed statement requirements
- Tenant-facing statement PDFs in five languages
- Data retention (10 years for financial records)
- Annual statement generation requirement

---

**Document Status:** Original product vision (requirements baseline), not an implementation status
**Version:** 1.0
**Last Updated:** January 23, 2026

---

*This PRD is the original product vision for the Dwello MVP. It describes intended features, not what is built: items marked "planned, not implemented" do not exist, and other features may not be implemented either. Open work is listed as GitHub issues (functional) and in `docs/design/offene-punkte.md` (non-functional); the architecture status is in `docs/migration-mva.md`. Future enhancements are documented in Section 12.*
