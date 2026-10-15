-- ============================================================================
-- The days behind a position's Zeitanteil, so the PDF prints it as a fraction the tenant can check (#208): the tenant's
-- days in the days the position's invoices bill in the period, and those days. Empty where the position is shared by
-- the heating profile, its invoices bill different days, or the statement was created before this migration.
-- ============================================================================

ALTER TABLE utility_statement_line_items
	ADD COLUMN position_rental_days INTEGER,
	ADD COLUMN billed_days INTEGER;
