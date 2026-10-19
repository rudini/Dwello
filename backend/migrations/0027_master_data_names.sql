-- ============================================================================
-- fr/it/en names of the predefined categories, distribution keys and heating profiles (#345, decided in #405 point
-- 3a, implemented in #461). Wartung is «maintenance» / «servicing» (docs/design/i18n-begriffe.md), Art. 14 al. 1 OBLF
-- says «investissements créant des plus-values», Italian says «immobile», not «stabile». The tenant reads these names
-- on the statement PDF. `name` and `name_de` of the categories stay: the KI prompt names them. A name the landlord
-- changed stays as it is.
-- ============================================================================

UPDATE categories SET name_fr = 'Conciergerie' WHERE name = 'Caretaker' AND name_fr = 'Concierge';
UPDATE categories SET name_it = 'Custode' WHERE name = 'Caretaker' AND name_it = 'Portiere';
UPDATE categories SET name_fr = 'Téléréseau' WHERE name = 'TV/Cable' AND name_fr = 'TV/Câble';
UPDATE categories SET name_fr = 'Enlèvement des ordures' WHERE name = 'Waste Disposal' AND name_fr = 'Ordures';
UPDATE categories SET name_fr = 'Ramonage' WHERE name = 'Chimney Sweep' AND name_fr = 'Ramoneur';
UPDATE categories SET name_fr = 'Maintenance des extincteurs' WHERE name = 'Fire Extinguisher Maintenance' AND name_fr = 'Entretien extincteurs';
UPDATE categories SET name_en = 'Fire Extinguisher Servicing' WHERE name = 'Fire Extinguisher Maintenance' AND name_en = 'Fire Extinguisher';
UPDATE categories SET name_fr = 'Entretien du jardin' WHERE name = 'Garden Maintenance' AND name_fr = 'Entretien jardin';
UPDATE categories SET name_it = 'Cura del giardino' WHERE name = 'Garden Maintenance' AND name_it = 'Manutenzione giardino';
UPDATE categories SET name_fr = 'Électricité des parties communes' WHERE name = 'Electricity Common Areas' AND name_fr = 'Électricité parties communes';
UPDATE categories SET name_fr = 'Assurance du bâtiment' WHERE name = 'Building Insurance' AND name_fr = 'Assurance bâtiment';
UPDATE categories SET name_it = 'Assicurazione dell’immobile' WHERE name = 'Building Insurance' AND name_it = 'Assicurazione edificio';
UPDATE categories SET name_fr = 'Investissements créant des plus-values' WHERE name = 'Capital Improvements' AND name_fr = 'Investissements valorisants';
UPDATE categories SET name_en = 'Lift' WHERE name = 'Elevator' AND name_en = 'Elevator';
UPDATE categories SET name_en = 'Snow Clearing' WHERE name = 'Snow Removal' AND name_en = 'Snow Removal';

UPDATE distribution_keys SET name_fr = 'Par pièce' WHERE name = 'Per Rooms' AND name_fr = 'Par pièces';
UPDATE distribution_keys SET name_en = 'Per Room' WHERE name = 'Per Rooms' AND name_en = 'Per Rooms';
UPDATE distribution_keys SET name_fr = 'Par logement' WHERE name = 'Per Unit' AND name_fr = 'Par unité';
UPDATE distribution_keys SET name_en = 'Per Area (m²)' WHERE name = 'Per Area (m²)' AND name_en = 'Per Area';
-- U+00A0 before «%», as UBIQUITOUS_LANGUAGE.md writes «70 %» (461-fachreview-1, V-10); English writes «70%»
UPDATE distribution_keys SET name_fr = 'Chauffage (surface 70 % / logement 30 %)' WHERE name = 'Heating (Area 70% / Unit 30%)' AND name_fr = 'Chauffage (surface 70% / unité 30%)';
UPDATE distribution_keys SET name_de = 'Heizung (Fläche 70 % / Einheit 30 %)' WHERE name = 'Heating (Area 70% / Unit 30%)' AND name_de = 'Heizung (Fläche 70% / Einheit 30%)';
UPDATE distribution_keys SET name_it = 'Riscaldamento (superficie 70 % / unità 30 %)' WHERE name = 'Heating (Area 70% / Unit 30%)' AND name_it = 'Riscaldamento (superficie 70% / unità 30%)';
UPDATE distribution_keys SET name_en = 'Heating (Area 70% / Unit 30%)' WHERE name = 'Heating (Area 70% / Unit 30%)' AND name_en = 'Heating Split';

UPDATE heating_profiles SET name_fr = 'Chauffage région de montagne' WHERE name = 'Heating Mountain' AND name_fr = 'Chauffage Montagne';
UPDATE heating_profiles SET name_en = 'Heating Swiss Plateau' WHERE name = 'Heating Mittelland' AND name_en = 'Heating Plateau';
