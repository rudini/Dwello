-- ============================================================================
-- Rate of the management fee chosen when the statement was generated
-- The fee is a percentage of the building's utility costs, distributed by a distribution key,
-- so it can no longer be derived from the tenant's own costs. Older statements keep NULL.
-- ============================================================================

ALTER TABLE utility_statements ADD COLUMN IF NOT EXISTS management_fee_percent DECIMAL(5, 2);
