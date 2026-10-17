-- ============================================================================
-- «Brennstoff» (#100): only a category whose invoices are deliveries of Heizmaterial holds a Tankbestand. Set for the
-- predefined «Heating» and for every heating cost category that already has one, so its next Endbestand can still be
-- recorded; Brennstoff goes only with heating costs, else no change of such a category could be saved.
-- ============================================================================

ALTER TABLE categories ADD COLUMN is_fuel BOOLEAN NOT NULL DEFAULT false;

UPDATE categories SET is_fuel = true
WHERE (name = 'Heating' AND type = 'predefined') OR (is_heating_cost AND id IN (SELECT category_id FROM fuel_stocks));
