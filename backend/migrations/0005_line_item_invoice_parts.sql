-- ============================================================================
-- The invoices behind a position whose invoices bill different days (#226): each with its days in the period, its
-- amount for them and the tenant's days in them, so the PDF lists them and the tenant can recompute the weighted
-- Zeitanteil. Empty where all invoices bill the same days, the position is shared by the heating profile, the tenant
-- rents the whole period, its invoices sum to zero, or the statement was created before this migration.
-- ============================================================================

ALTER TABLE utility_statement_line_items
	ADD COLUMN invoice_parts JSONB;
