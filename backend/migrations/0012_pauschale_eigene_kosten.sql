-- The Verwaltungspauschale is always a percentage of the tenant's own utility costs (product decision, source: tenants'
-- association leaflet on Nebenkosten 2026): the statement no longer stores a distribution key for it
-- A statement created with a key keeps its amount; its rate becomes the share of its own costs that amount is, so the
-- PDF's «x % der Zwischensumme» still adds up
UPDATE utility_statements
SET management_fee_percent = ROUND(management_fee / NULLIF(total_costs - management_fee, 0) * 100, 2)
WHERE management_fee_distribution_key_id IS NOT NULL;

ALTER TABLE utility_statements DROP COLUMN management_fee_distribution_key_id;
