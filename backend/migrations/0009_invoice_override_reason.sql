-- ============================================================================
-- Why the category the KI suggested for an invoice was overridden
-- The edit form asks for the reason; the invoice detail shows it.
-- ============================================================================

ALTER TABLE invoices ADD COLUMN IF NOT EXISTS manual_override_reason TEXT;
