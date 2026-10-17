-- ============================================================================
-- «Brennstoff» (#100): only a category whose invoices are deliveries of Heizmaterial holds a Tankbestand. Set for the
-- predefined «Heating» and for every category that already has one, so its next Endbestand can still be recorded.
-- ============================================================================

ALTER TABLE categories ADD COLUMN is_fuel BOOLEAN NOT NULL DEFAULT false;

UPDATE categories SET is_fuel = true
WHERE (name = 'Heating' AND type = 'predefined') OR id IN (SELECT category_id FROM fuel_stocks);
