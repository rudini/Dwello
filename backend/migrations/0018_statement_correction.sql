-- ============================================================================
-- A sent or paid statement is corrected by a berichtigte Abrechnung (#120, #358): the old one gets the status
-- 'replaced' and stays as it was; the new one names it and offsets what was already paid on it (and on the statements
-- it replaced itself). Each statement is replaced at most once.
-- ============================================================================

ALTER TABLE utility_statements ADD COLUMN replaces_id UUID REFERENCES utility_statements(id);
ALTER TABLE utility_statements ADD COLUMN prior_payments DECIMAL(12, 2) NOT NULL DEFAULT 0;
CREATE UNIQUE INDEX statements_replaces_idx ON utility_statements(replaces_id);
ALTER TABLE utility_statements DROP CONSTRAINT statements_status_check;
ALTER TABLE utility_statements ADD CONSTRAINT statements_status_check CHECK (status IN ('draft', 'sent', 'paid', 'replaced'));
