-- Correspondence channel per tenant and stored documents (payment reminders).
-- Idempotent: safe to run on databases that already have these changes.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tenants' AND column_name = 'correspondence_channel'
  ) THEN
    ALTER TABLE tenants ADD COLUMN correspondence_channel VARCHAR(10) NOT NULL DEFAULT 'letter';
    -- Existing tenants with an e-mail address are written to by e-mail
    UPDATE tenants SET correspondence_channel = 'email' WHERE email IS NOT NULL AND email <> '';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS documents (
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

CREATE INDEX IF NOT EXISTS documents_tenant_id_idx ON documents(tenant_id);
CREATE INDEX IF NOT EXISTS documents_statement_id_idx ON documents(statement_id);
CREATE INDEX IF NOT EXISTS documents_status_idx ON documents(status);
