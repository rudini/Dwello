-- ============================================================================
-- The invoices a statement position billed (#96): each with its id, description, amount in the period and the days it
-- bills there, so the statement knows which invoices were recorded, changed or deleted since and links to them (#104).
-- The change of the Tankbestand is kept with fuelStock (it is no invoice). Empty for statements created before.
-- ============================================================================

ALTER TABLE utility_statement_line_items
	ADD COLUMN invoices JSONB;
