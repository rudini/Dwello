-- The Tankbestand belongs to a heating cost category (Heizung, Pellets …), chosen when it is recorded; before, the
-- category was looked up by the English name 'Heating' (review B round 2, CR2-H2).
ALTER TABLE fuel_stocks ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE RESTRICT;
UPDATE fuel_stocks SET category_id = (SELECT id FROM categories WHERE name = 'Heating');
ALTER TABLE fuel_stocks ALTER COLUMN category_id SET NOT NULL;

-- Hot water is used about evenly over the year: a separate Warmwasser invoice is shared by days at a tenant change,
-- not by the heating profile (review B round 2, MR2-M5). Heating and hot water billed together stay in Heizung,
-- with the profile "Heizung + Warmwasser".
UPDATE categories SET is_heating_cost = false WHERE name = 'Hot Water';
