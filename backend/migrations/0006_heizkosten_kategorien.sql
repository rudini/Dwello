-- Heating and hot water costs (Art. 5 VMWG) are a property of the category, no longer guessed from its name: at a
-- tenant change they follow the heating profile. Heating, hot water and the chimney sweep are such costs.
ALTER TABLE categories ADD COLUMN is_heating_cost BOOLEAN NOT NULL DEFAULT false;
UPDATE categories SET is_heating_cost = true WHERE name IN ('Heating', 'Hot Water', 'Chimney Sweep');
