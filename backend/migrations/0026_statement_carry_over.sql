-- ============================================================================
-- #448 (decided in #403): a Saldo below CHF 5.00 is carried over to the next statement of the same Mietvertrag.
-- `carried_from_id` is the statement whose Saldo this one counts in (the Übertrag); a sent statement without payment
-- (Saldo 0.00 or carried over) has the status «Erledigt» ('settled'). Existing statements stay as they are: those
-- settled under #94 keep the status 'paid' and carry nothing over.
-- ============================================================================

ALTER TABLE utility_statements ADD COLUMN carried_from_id UUID REFERENCES utility_statements(id);
ALTER TABLE utility_statements DROP CONSTRAINT statements_status_check;
ALTER TABLE utility_statements ADD CONSTRAINT statements_status_check CHECK (status IN ('draft', 'sent', 'paid', 'settled', 'replaced'));
