-- ============================================================================
-- #459 (#332): «Mieter anonymisieren» after the retention: the Swiss day Dwello removed the tenant's name, contact
-- data and documents; the amounts of his statements stay.
-- ============================================================================

ALTER TABLE tenants ADD COLUMN anonymised_on DATE;
