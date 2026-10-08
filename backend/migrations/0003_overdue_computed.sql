-- ============================================================================
-- Overdue is not stored: a sent statement is overdue once its payment deadline has passed.
-- Statements stored as overdue go back to sent, so filters and counts find them again.
-- ============================================================================

UPDATE utility_statements SET status = 'sent' WHERE status = 'overdue';

ALTER TABLE utility_statements DROP CONSTRAINT statements_status_check;
ALTER TABLE utility_statements ADD CONSTRAINT statements_status_check CHECK (status IN ('draft', 'sent', 'paid'));
