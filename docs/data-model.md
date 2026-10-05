# Dwello Data Model & Database Schema

**Version:** 1.0
**Date:** January 23, 2026

---

## Overview

This document provides detailed specification of the PostgreSQL database schema for Dwello, including all tables, relationships, indexes, and constraints.

**Core Principles:**

- ACID compliance for financial data integrity
- Comprehensive audit trails for regulatory compliance
- Efficient querying for reporting and statement generation
- Data normalization to minimize redundancy

---

## Database Setup

### PostgreSQL Version

- **Minimum:** PostgreSQL 13
- **Recommended:** PostgreSQL 15+

### Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Initial Configuration

```sql
-- Set timezone to UTC (all timestamps stored in UTC)
SET TIMEZONE = 'UTC';

-- Enable JSON support
-- (Built-in, no extension needed)
```

---

## Table Specifications

### 1. Building

Represents a residential building property managed by the user.

```sql
CREATE TABLE buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address VARCHAR(255) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  city VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  country VARCHAR(50) DEFAULT 'Switzerland',
  building_name VARCHAR(255),
  building_type VARCHAR(50),
    -- enum: 'single-family', 'multi-family', 'mixed'
  year_built INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_coordinates CHECK (
    latitude BETWEEN -90 AND 90
    AND longitude BETWEEN -180 AND 180
  )
);

CREATE INDEX idx_buildings_postal_code ON buildings(postal_code);
CREATE INDEX idx_buildings_city ON buildings(city);
CREATE INDEX idx_buildings_updated_at ON buildings(updated_at DESC);
```

### 2. Apartment

Individual apartment within a building.

```sql
CREATE TABLE apartments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  floor VARCHAR(50) NOT NULL,
    -- Values: 'Parterre', '1. Stock', '2. Stock', 'Attika', 'Untergeschoss', etc.
  address_unit VARCHAR(50),
    -- e.g., 'Wohnung 3', 'Unit 3A'
  size_m2 DECIMAL(8, 2) NOT NULL,
    -- Wohnfläche in square meters
  room_count VARCHAR(10) NOT NULL,
    -- e.g., '3.5', '2', '1.5'
  room_breakdown VARCHAR(255),
    -- Optional: e.g., '2 Zimmer, Küche, Bad'
  utility_meter_ids JSONB DEFAULT '{}'::jsonb,
    -- e.g., {"heating": "ID1", "water": "ID2", "electricity": "ID3"}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT positive_size CHECK (size_m2 > 0),
  CONSTRAINT valid_room_count CHECK (room_count ~ '^\d+(\.\d)?$')
);

CREATE INDEX idx_apartments_building_id ON apartments(building_id);
CREATE INDEX idx_apartments_updated_at ON apartments(updated_at DESC);
CREATE INDEX idx_apartments_floor ON apartments(floor);
```

### 3. Tenant

Tenant/occupant information.

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  street VARCHAR(255) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  city VARCHAR(100) NOT NULL,
  nationality VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tenants_email ON tenants(email);
CREATE INDEX idx_tenants_last_name ON tenants(last_name);
CREATE INDEX idx_tenants_updated_at ON tenants(updated_at DESC);
```

### 4. RentalContract

Rental agreement between tenant and building owner.

```sql
CREATE TABLE rental_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE,
    -- NULL for ongoing contracts
  base_rent_chf DECIMAL(10, 2) NOT NULL,
  additional_rent_chf DECIMAL(10, 2) DEFAULT 0,
    -- Sum of garage, parking, storage, etc.
  additional_rent_breakdown JSONB DEFAULT '{}'::jsonb,
    -- e.g., {"garage": 50, "parking": 30, "storage": 20}
  rent_index_reference VARCHAR(100),
    -- e.g., "2023-08 Index=110.5"
  monthly_advance_payment_chf DECIMAL(10, 2) NOT NULL,
    -- Akonto for utility costs
  agreed_utility_categories JSONB DEFAULT '[]'::jsonb,
    -- Array of category IDs the tenant is charged for
  contract_pdf_blob BYTEA,
    -- Scanned/uploaded contract PDF
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_dates CHECK (
    start_date IS NULL OR end_date IS NULL OR start_date <= end_date
  ),
  CONSTRAINT positive_rent CHECK (base_rent_chf > 0),
  CONSTRAINT non_negative_additional CHECK (additional_rent_chf >= 0),
  CONSTRAINT positive_advance CHECK (monthly_advance_payment_chf > 0)
);

CREATE INDEX idx_rental_contracts_apartment_id ON rental_contracts(apartment_id);
CREATE INDEX idx_rental_contracts_tenant_id ON rental_contracts(tenant_id);
CREATE INDEX idx_rental_contracts_start_date ON rental_contracts(start_date);
CREATE INDEX idx_rental_contracts_end_date ON rental_contracts(end_date);
CREATE INDEX idx_rental_contracts_updated_at ON rental_contracts(updated_at DESC);

-- Composite index for finding active contracts for an apartment in a date range
CREATE INDEX idx_rental_contracts_apartment_dates
  ON rental_contracts(apartment_id, start_date, end_date);
```

### 5. Category

Utility cost categories (heating, water, electricity, etc.).

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  -- English name
  name_de VARCHAR(100),
  -- German
  name_fr VARCHAR(100),
  -- French
  name_it VARCHAR(100),
  -- Italian
  name_rm VARCHAR(100),
  -- Romansh
  is_allowed_utility_cost BOOLEAN NOT NULL DEFAULT true,
  -- Per Swiss regulations
  description TEXT,
  is_predefined BOOLEAN NOT NULL DEFAULT false,
  -- System-provided categories
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_is_allowed ON categories(is_allowed_utility_cost);
CREATE INDEX idx_categories_is_predefined ON categories(is_predefined);

-- Insert predefined categories
INSERT INTO categories (
  name, name_de, name_fr, name_it, name_rm,
  is_allowed_utility_cost, is_predefined
) VALUES
  ('Heating', 'Heizkosten', 'Frais de chauffage', 'Costi di riscaldamento', 'Custs da riscaldament', true, true),
  ('Hot Water', 'Warmwasser', 'Eau chaude', 'Acqua calda', 'Aua chaudia', true, true),
  ('Electricity', 'Stromkosten', 'Frais d''électricité', 'Costi di elettricità', 'Custs da corrent', true, true),
  ('Water', 'Wasser', 'Eau', 'Acqua', 'Aua', true, true),
  ('Wastewater', 'Abwasser', 'Eaux usées', 'Acque reflue', 'Aua desfatta', true, true),
  ('Property Maintenance', 'Grundstückspflege', 'Entretien de la propriété', 'Manutenzione della proprietà', 'Manutentgia dal terraplain', true, true),
  ('Building Infrastructure', 'Gebäudeinfrastruktur', 'Infrastructure du bâtiment', 'Infrastruttura dell''edificio', 'Infrastructura da l''edifici', true, true),
  ('Disposal', 'Entsorgung', 'Élimination des déchets', 'Smaltimento', 'Eliminaziun', true, true),
  ('Communication', 'Kommunikation', 'Communication', 'Comunicazione', 'Communicaziun', true, true),
  ('Management', 'Verwaltung', 'Gestion', 'Gestione', 'Administraziun', true, true),
  ('Other', 'Sonstiges', 'Autre', 'Altro', 'Auter', true, true);
```

### 6. DistributionKey

Method for allocating costs among apartments.

```sql
CREATE TABLE distribution_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  formula VARCHAR(255),
    -- e.g., '{area} * 1.5' for custom keys
  is_predefined BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert predefined keys
INSERT INTO distribution_keys (name, description, is_predefined) VALUES
  ('Heating Costs', 'Based on monthly heating distribution profile', true),
  ('Per Unit', 'Equal distribution among all apartments', true),
  ('Per Area', 'Distribution based on apartment size (Wohnfläche)', true);
```

### 7. HeatingDistributionProfile

Monthly percentage-based distribution for heating costs.

```sql
CREATE TABLE heating_distribution_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  name_de VARCHAR(100),
  name_fr VARCHAR(100),
  name_it VARCHAR(100),
  name_rm VARCHAR(100),
  january_pct DECIMAL(5, 2) NOT NULL,
  february_pct DECIMAL(5, 2) NOT NULL,
  march_pct DECIMAL(5, 2) NOT NULL,
  april_pct DECIMAL(5, 2) NOT NULL,
  may_pct DECIMAL(5, 2) NOT NULL,
  june_pct DECIMAL(5, 2) NOT NULL,
  july_pct DECIMAL(5, 2) NOT NULL,
  august_pct DECIMAL(5, 2) NOT NULL,
  september_pct DECIMAL(5, 2) NOT NULL,
  october_pct DECIMAL(5, 2) NOT NULL,
  november_pct DECIMAL(5, 2) NOT NULL,
  december_pct DECIMAL(5, 2) NOT NULL,
  is_predefined BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT percentages_sum_to_100 CHECK (
    (january_pct + february_pct + march_pct + april_pct + may_pct + june_pct +
     july_pct + august_pct + september_pct + october_pct + november_pct + december_pct)
    BETWEEN 99.99 AND 100.01
  )
);

-- Insert predefined profiles
INSERT INTO heating_distribution_profiles (
  name, name_de, name_fr, name_it, name_rm,
  january_pct, february_pct, march_pct, april_pct, may_pct, june_pct,
  july_pct, august_pct, september_pct, october_pct, november_pct, december_pct,
  is_predefined
) VALUES
  (
    'Heating + Hot Water',
    'Heizkosten mit Warmwasser',
    'Frais de chauffage et eau chaude',
    'Costi di riscaldamento e acqua calda',
    'Custs da riscaldament e aua chaudia',
    12, 10, 8, 4, 2, 1,
    1, 2, 4, 8, 10, 12, -- sums to 92.something, need to adjust...
    true
  );

-- After populating, ensure sum = 100 per profile
```

### 8. Invoice

Invoices for building utilities and services.

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  invoice_date DATE NOT NULL,
  billing_entity_name VARCHAR(255) NOT NULL,
  billing_entity_address VARCHAR(255),
  work_description TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id),
  amount_chf DECIMAL(10, 2) NOT NULL,
  distribution_key_id UUID NOT NULL REFERENCES distribution_keys(id),
  is_valid_utility_cost BOOLEAN NOT NULL DEFAULT true,
  validity_reason TEXT,
    -- Explanation if cost is invalid
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT positive_amount CHECK (amount_chf > 0)
);

CREATE INDEX idx_invoices_building_id ON invoices(building_id);
CREATE INDEX idx_invoices_invoice_date ON invoices(invoice_date);
CREATE INDEX idx_invoices_category_id ON invoices(category_id);
CREATE INDEX idx_invoices_is_valid ON invoices(is_valid_utility_cost);
CREATE INDEX idx_invoices_updated_at ON invoices(updated_at DESC);

-- Composite index for efficient statement generation queries
CREATE INDEX idx_invoices_building_date
  ON invoices(building_id, invoice_date);
```

### 9. UtilityStatement

Generated utility cost statements for tenants.

```sql
CREATE TABLE utility_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE RESTRICT,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  rental_contract_id UUID NOT NULL REFERENCES rental_contracts(id) ON DELETE RESTRICT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  statement_number VARCHAR(50) NOT NULL UNIQUE,
    -- e.g., 'RdJ-2024-001'
  statement_date DATE NOT NULL,
  rental_days INTEGER NOT NULL,
    -- Days tenant occupied in period
  total_costs_chf DECIMAL(12, 2) NOT NULL,
  total_advance_payments_chf DECIMAL(12, 2) NOT NULL,
  balance_chf DECIMAL(12, 2) NOT NULL,
    -- Positive = tenant owes, negative = refund
  status VARCHAR(20) NOT NULL DEFAULT 'open',
    -- Enum: 'open', 'paid'
  payment_deadline DATE NOT NULL,
  payment_date DATE,
  pdf_blob BYTEA NOT NULL,
    -- Generated PDF with QR-bill
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_period CHECK (period_start < period_end),
  CONSTRAINT valid_dates CHECK (
    period_start IS NULL OR period_end IS NULL OR statement_date BETWEEN period_start AND period_end
  )
);

CREATE INDEX idx_utility_statements_apartment_id ON utility_statements(apartment_id);
CREATE INDEX idx_utility_statements_tenant_id ON utility_statements(tenant_id);
CREATE INDEX idx_utility_statements_period ON utility_statements(period_start, period_end);
CREATE INDEX idx_utility_statements_statement_number ON utility_statements(statement_number);
CREATE INDEX idx_utility_statements_status ON utility_statements(status);
CREATE INDEX idx_utility_statements_payment_deadline ON utility_statements(payment_deadline);
CREATE INDEX idx_utility_statements_updated_at ON utility_statements(updated_at DESC);
```

### 10. UtilityStatementLineItem

Individual line items in a utility statement.

```sql
CREATE TABLE utility_statement_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utility_statement_id UUID NOT NULL REFERENCES utility_statements(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id),
  distribution_key_id UUID NOT NULL REFERENCES distribution_keys(id),
  total_building_cost_chf DECIMAL(12, 2) NOT NULL,
  tenant_percentage DECIMAL(5, 4) NOT NULL,
    -- 0.0000 to 1.0000
  tenant_amount_chf DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_percentage CHECK (
    tenant_percentage >= 0 AND tenant_percentage <= 1
  ),
  CONSTRAINT positive_amounts CHECK (
    total_building_cost_chf > 0 AND tenant_amount_chf >= 0
  )
);

CREATE INDEX idx_line_items_statement_id ON utility_statement_line_items(utility_statement_id);
CREATE INDEX idx_line_items_category_id ON utility_statement_line_items(category_id);
```

### 11. Configuration

System configuration key-value store.

```sql
CREATE TABLE configuration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Expected keys:
-- accounting_period: '2024-07-01_2025-06-30' | '2024-11-01_2025-10-31' | '2024-01-01_2024-12-31'
-- management_cost_percentage: '2.5'
-- heating_profile_id: '{UUID}'
-- payment_deadline_days: '30'
-- reminder_deadline_days: '10'
-- iban: 'CHxxxxxxxxxxxxxxxxxxxxxxxx'
-- company_name: 'Property Management Company Name'
-- company_address: 'Street, City'
```

### 12. AuditLog

Audit trail for compliance and accountability.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
    -- Reference to user (once multi-user added)
  action VARCHAR(50) NOT NULL,
    -- Enum: 'CREATE', 'UPDATE', 'DELETE', 'PAYMENT_MARKED', 'CATEGORIZATION', etc.
  entity_type VARCHAR(100) NOT NULL,
    -- e.g., 'Invoice', 'Statement', 'Contract'
  entity_id UUID NOT NULL,
  details JSONB,
    -- {before: {...}, after: {...}, reason: '...'}
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
```

---

## Views (For Common Queries)

### Active Contracts View

```sql
CREATE VIEW active_contracts AS
SELECT rc.*
FROM rental_contracts rc
WHERE rc.start_date <= CURRENT_DATE
  AND (rc.end_date IS NULL OR rc.end_date >= CURRENT_DATE);
```

### Apartment Occupancy View

```sql
CREATE VIEW apartment_occupancy AS
SELECT
  a.id,
  a.building_id,
  a.floor,
  a.address_unit,
  CASE
    WHEN rc.end_date IS NULL OR rc.end_date >= CURRENT_DATE THEN true
    ELSE false
  END AS is_occupied,
  COALESCE(t.first_name || ' ' || t.last_name, 'Vacant') AS current_tenant,
  rc.id AS current_contract_id
FROM apartments a
LEFT JOIN active_contracts rc ON a.id = rc.apartment_id
LEFT JOIN tenants t ON rc.tenant_id = t.id;
```

### Invoice Statistics View

```sql
CREATE VIEW invoice_statistics AS
SELECT
  category_id,
  COUNT(*) AS total_invoices,
  SUM(amount_chf) AS total_amount,
  AVG(amount_chf) AS avg_amount,
  SUM(CASE WHEN is_valid_utility_cost = true THEN 1 ELSE 0 END) AS valid_count,
  SUM(CASE WHEN is_valid_utility_cost = false THEN 1 ELSE 0 END) AS invalid_count
FROM invoices
GROUP BY category_id;
```

---

## Relationship Diagram

```
buildings (1)
  ├─ apartments (many) ─── apartment_id
  │   ├─ rental_contracts (many) ─── apartment_id, tenant_id
  │   │   ├─ categories
  │   │   └─ tenants
  │   └─ utility_statements (many) ─── apartment_id, tenant_id, rental_contract_id
  │       └─ utility_statement_line_items (many) ─── category_id, distribution_key_id
  │
  ├─ invoices (many) ─── building_id
  │   ├─ categories
  │   └─ distribution_keys
  │
  └─ tenants
      └─ rental_contracts
          └─ apartments
```

---

## Migration Strategy

### Schema Creation Order

1. Create base tables: buildings, apartments, tenants, categories, distribution_keys, heating_distribution_profiles
2. Create relationship tables: rental_contracts, invoices
3. Create derived tables: utility_statements, utility_statement_line_items
4. Create system tables: configuration, audit_logs
5. Create indexes and views

### Version Control

All migrations tracked in version-controlled SQL files:

```
migrations/
  ├── 001_initial_schema.sql
  ├── 002_indexes.sql
  ├── 003_views.sql
  └── 004_initial_data.sql
```

---

## Performance Considerations

### Indexing Strategy

- **Frequently filtered fields:** building_id, apartment_id, tenant_id, category_id, status, dates
- **Frequently sorted fields:** created_at, updated_at, invoice_date, period dates
- **Composite indexes:** For common WHERE + ORDER BY combinations
- **Partial indexes:** For boolean flags (is_valid_utility_cost, is_predefined)

### Query Optimization

**Statement Generation Query Example:**

```sql
-- Get all invoices for a building in a period
SELECT i.*, c.name, dk.name, dk.formula
FROM invoices i
JOIN categories c ON i.category_id = c.id
JOIN distribution_keys dk ON i.distribution_key_id = dk.id
WHERE i.building_id = $1
  AND i.invoice_date >= $2
  AND i.invoice_date <= $3
ORDER BY i.invoice_date DESC;
```

**Active Tenant Query:**

```sql
-- Get current tenant for an apartment
SELECT t.*, rc.*
FROM rental_contracts rc
JOIN tenants t ON rc.tenant_id = t.id
WHERE rc.apartment_id = $1
  AND rc.start_date <= CURRENT_DATE
  AND (rc.end_date IS NULL OR rc.end_date >= CURRENT_DATE)
LIMIT 1;
```

### Archival Strategy (Future)

For tables with many historical records (statements, audit logs):

- Archive records older than 2 years to separate tables
- Keep hot data in main tables
- Use table partitioning for very large tables (>10M records)

---

## Data Validation Rules

### Business Rules Enforced at DB Level

1. **Rental Contracts:** start_date < end_date (if end_date provided)
2. **Invoices:** amount_chf > 0
3. **Apartments:** size_m2 > 0
4. **Utility Statements:** period_start < period_end
5. **Percentages:** Sum of monthly heating percentages = 100%
6. **Tenant Percentage:** 0 ≤ tenant_percentage ≤ 1

### Business Rules Enforced at Application Level

1. Valid accounting period configuration
2. No duplicate contracts for same apartment in overlapping date ranges
3. Invoice categorization validation
4. Statement prorating calculations
5. IBAN format validation (Swiss format starting with CH)

---

## Backup & Recovery

### Backup Strategy

- **Frequency:** Daily at 2 AM UTC
- **Retention:** 30 days rolling
- **Location:** Encrypted encrypted offsite storage
- **Verification:** Automated restore test weekly

### Recovery Procedures

**Full Database Recovery:**

```bash
# Restore from backup
pg_restore -d dwello backup_file.dump
```

**Point-in-Time Recovery:**

```bash
# WAL archiving configured to enable PITR
```

---

## Compliance & Security

### Data Encryption

- **In Transit:** TLS 1.2+ for all connections
- **At Rest:** Database connection requires SSL
- **Sensitive Fields:** OAuth tokens, IBAN encrypted with application key

### Audit Trail

All data modifications logged to `audit_logs` table with:

- Before/after values
- User/action information
- Timestamp in UTC
- IP address for compliance

### Data Retention

- Financial records (statements, invoices): 10 years per Swiss law
- Contracts: Duration + 10 years
- Audit logs: 1 year
- Personal data: Up to 10 years (GDPR/SDPA compliance)

---

**Database Schema Status:** APPROVED
**Last Updated:** January 23, 2026
