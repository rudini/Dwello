-- ============================================================================
-- Remove predefined distribution keys the formula engine cannot evaluate
-- "Per Person" ({persons}) and "By Consumption" ({consumption}) need occupant
-- counts / meter readings that the data model does not store. Statement
-- calculation fell back to an equal split for them, so affected invoices and
-- line items are reassigned to "Per Unit" (same result) before deletion.
-- ============================================================================

UPDATE invoices
SET distribution_key_id = (SELECT id FROM distribution_keys WHERE name = 'Per Unit' LIMIT 1)
WHERE distribution_key_id IN (
    SELECT id FROM distribution_keys WHERE name IN ('Per Person', 'By Consumption')
);

UPDATE utility_statement_line_items
SET distribution_key_id = (SELECT id FROM distribution_keys WHERE name = 'Per Unit' LIMIT 1)
WHERE distribution_key_id IN (
    SELECT id FROM distribution_keys WHERE name IN ('Per Person', 'By Consumption')
);

DELETE FROM distribution_keys WHERE name IN ('Per Person', 'By Consumption');
