-- ============================================================================
-- Schema of Dwello (baseline of October 2026, replaces migrations 0001-0011)
-- Master data (categories, distribution keys, heating profiles) follows in 0002.
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Buildings Table
-- ============================================================================
CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    city VARCHAR(100) NOT NULL,
    canton VARCHAR(2) NOT NULL,
    country VARCHAR(2) NOT NULL DEFAULT 'CH',
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    building_type VARCHAR(50),
    year_built INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX buildings_city_idx ON buildings(city);

-- ============================================================================
-- Apartments Table
-- ============================================================================
CREATE TABLE apartments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    number VARCHAR(20) NOT NULL,
    floor INTEGER NOT NULL DEFAULT 0,
    area DECIMAL(8, 2) NOT NULL,
    rooms DECIMAL(3, 1) NOT NULL,
    -- "occupied" is computed from the running rental contracts; the stored status is what the manager sets
    status VARCHAR(20) NOT NULL DEFAULT 'vacant',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT apartments_status_check CHECK (status IN ('vacant', 'reserved'))
);

CREATE INDEX apartments_building_id_idx ON apartments(building_id);
CREATE UNIQUE INDEX apartments_building_number_idx ON apartments(building_id, number);

-- ============================================================================
-- Tenants Table
-- ============================================================================
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(30),
    language VARCHAR(5) NOT NULL DEFAULT 'de',
    address VARCHAR(500),
    postal_code VARCHAR(10),
    city VARCHAR(100),
    correspondence_channel VARCHAR(10) NOT NULL DEFAULT 'letter', -- email | letter
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT tenants_language_check CHECK (language IN ('de', 'fr', 'it', 'rm', 'en'))
);

-- ============================================================================
-- Rental Contracts Table
-- ============================================================================
CREATE TABLE rental_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE,
    base_rent DECIMAL(10, 2) NOT NULL,
    additional_rent DECIMAL(10, 2) DEFAULT 0,
    monthly_advance_payment DECIMAL(10, 2) NOT NULL,
    reference_index DECIMAL(6, 4),
    contract_pdf TEXT,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT contracts_dates_check CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE INDEX contracts_apartment_id_idx ON rental_contracts(apartment_id);
CREATE INDEX contracts_tenant_id_idx ON rental_contracts(tenant_id);
CREATE INDEX contracts_end_date_idx ON rental_contracts(end_date);
CREATE INDEX contracts_dates_idx ON rental_contracts(start_date, end_date);

-- ============================================================================
-- Categories Table (Utility Cost Categories)
-- ============================================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_de VARCHAR(100),
    name_fr VARCHAR(100),
    name_it VARCHAR(100),
    name_en VARCHAR(100),
    is_allowed_utility_cost BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Distribution Keys Table
-- ============================================================================
CREATE TABLE distribution_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_de VARCHAR(100),
    name_fr VARCHAR(100),
    name_it VARCHAR(100),
    name_en VARCHAR(100),
    type VARCHAR(20) NOT NULL DEFAULT 'predefined',
    formula TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT distribution_keys_type_check CHECK (type IN ('predefined', 'custom'))
);

-- ============================================================================
-- Heating Distribution Profiles Table
-- ============================================================================
CREATE TABLE heating_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_de VARCHAR(100),
    name_fr VARCHAR(100),
    name_it VARCHAR(100),
    name_en VARCHAR(100),
    type VARCHAR(20) NOT NULL DEFAULT 'predefined',
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
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT heating_profiles_type_check CHECK (type IN ('predefined', 'custom'))
);

-- ============================================================================
-- Invoices Table
-- ============================================================================
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50),
    billing_entity_name VARCHAR(255) NOT NULL,
    billing_entity_address VARCHAR(500),
    description TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    distribution_key_id UUID REFERENCES distribution_keys(id) ON DELETE SET NULL,
    amount DECIMAL(12, 2) NOT NULL,
    is_valid_utility_cost BOOLEAN NOT NULL DEFAULT true,
    invoice_date DATE NOT NULL,
    due_date DATE,
    paid_date DATE,
    llm_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    llm_confidence DECIMAL(5, 4),
    was_manually_overridden BOOLEAN DEFAULT false,
    manual_override_reason TEXT, -- why the category the KI suggested was overridden
    invoice_pdf TEXT,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX invoices_building_id_idx ON invoices(building_id);
CREATE INDEX invoices_invoice_date_idx ON invoices(invoice_date);
CREATE INDEX invoices_category_id_idx ON invoices(category_id);

-- ============================================================================
-- Utility Statements Table
-- ============================================================================
CREATE TABLE utility_statements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    apartment_id UUID NOT NULL REFERENCES apartments(id) ON DELETE RESTRICT,
    contract_id UUID NOT NULL REFERENCES rental_contracts(id) ON DELETE RESTRICT,
    statement_number VARCHAR(50) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    statement_date DATE NOT NULL,
    rental_days INTEGER NOT NULL,
    total_costs DECIMAL(12, 2) NOT NULL,
    total_advance_payments DECIMAL(12, 2) NOT NULL,
    management_fee DECIMAL(12, 2) DEFAULT 0,
    management_fee_percent DECIMAL(5, 2), -- rate chosen when the statement was generated
    balance DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    payment_deadline DATE,
    paid_date DATE,
    paid_amount DECIMAL(12, 2),
    reminder_sent_date DATE,
    pdf_blob TEXT,
    pdf_generated_at TIMESTAMP,
    qr_bill_reference VARCHAR(27),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    -- overdue is not stored: a sent statement is overdue once its payment deadline has passed
    CONSTRAINT statements_status_check CHECK (status IN ('draft', 'sent', 'paid')),
    CONSTRAINT statements_period_check CHECK (period_end >= period_start)
);

CREATE INDEX statements_tenant_id_idx ON utility_statements(tenant_id);
CREATE INDEX statements_apartment_id_idx ON utility_statements(apartment_id);
CREATE INDEX statements_period_start_idx ON utility_statements(period_start);
CREATE INDEX statements_status_idx ON utility_statements(status);
CREATE INDEX statements_tenant_period_idx ON utility_statements(tenant_id, period_start);
CREATE UNIQUE INDEX statements_number_idx ON utility_statements(statement_number);

-- ============================================================================
-- Utility Statement Line Items Table
-- ============================================================================
CREATE TABLE utility_statement_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    statement_id UUID NOT NULL REFERENCES utility_statements(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    distribution_key_id UUID REFERENCES distribution_keys(id) ON DELETE SET NULL,
    description VARCHAR(255) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    tenant_share DECIMAL(12, 2) NOT NULL,
    share_percentage DECIMAL(8, 4),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX line_items_statement_id_idx ON utility_statement_line_items(statement_id);

-- ============================================================================
-- Documents Table (payment reminders sent or to send)
-- ============================================================================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    statement_id UUID REFERENCES utility_statements(id) ON DELETE RESTRICT,
    type VARCHAR(30) NOT NULL,                -- reminder
    reminder_level INTEGER,                   -- 1 = Zahlungserinnerung, 2 and 3 = Mahnung
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    pdf TEXT NOT NULL,                        -- Base64 encoded PDF
    channel VARCHAR(10) NOT NULL,             -- email | letter
    status VARCHAR(20) NOT NULL,              -- sent | to_send
    sent_at TIMESTAMP,
    delivery_error TEXT,                      -- why an e-mail could not be sent
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX documents_tenant_id_idx ON documents(tenant_id);
CREATE INDEX documents_statement_id_idx ON documents(statement_id);
CREATE INDEX documents_status_idx ON documents(status);

-- ============================================================================
-- Configuration Table (Key-Value Store, defaults in backend/src/services/config.service.ts)
-- ============================================================================
CREATE TABLE configuration (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX config_key_idx ON configuration(key);

-- ============================================================================
-- Trigger Function for updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with updated_at column
CREATE TRIGGER buildings_updated_at BEFORE UPDATE ON buildings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER apartments_updated_at BEFORE UPDATE ON apartments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER rental_contracts_updated_at BEFORE UPDATE ON rental_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER distribution_keys_updated_at BEFORE UPDATE ON distribution_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER heating_profiles_updated_at BEFORE UPDATE ON heating_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER utility_statements_updated_at BEFORE UPDATE ON utility_statements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER configuration_updated_at BEFORE UPDATE ON configuration FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
