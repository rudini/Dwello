-- ============================================================================
-- Master data every database needs: cost categories (whether costs may be passed on),
-- distribution keys and predefined heating profiles. Configuration needs no rows:
-- its defaults are in backend/src/services/config.service.ts. Demo data: backend/demo/.
-- ============================================================================

-- ============================================================================
-- Categories (Swiss Utility Cost Categories)
-- Based on Swiss rental law (Mietrecht)
-- ============================================================================

-- Allowed utility costs (Nebenkosten - zulässig)
INSERT INTO categories (name, name_de, name_fr, name_it, name_en, is_allowed_utility_cost, description, sort_order) VALUES
('Heating', 'Heizung', 'Chauffage', 'Riscaldamento', 'Heating', true, 'Costs for heating the building', 1),
('Hot Water', 'Warmwasser', 'Eau chaude', 'Acqua calda', 'Hot Water', true, 'Costs for hot water production', 2),
('Cold Water', 'Kaltwasser', 'Eau froide', 'Acqua fredda', 'Cold Water', true, 'Costs for cold water supply', 3),
('Wastewater', 'Abwasser', 'Eaux usées', 'Acque reflue', 'Wastewater', true, 'Sewage and wastewater disposal', 4),
('Electricity Common Areas', 'Allgemeinstrom', 'Électricité parties communes', 'Elettricità parti comuni', 'Common Area Electricity', true, 'Electricity for common areas (stairwell, garage, etc.)', 5),
('Elevator', 'Lift', 'Ascenseur', 'Ascensore', 'Elevator', true, 'Elevator maintenance and operation', 6),
('Caretaker', 'Hauswart', 'Concierge', 'Portiere', 'Caretaker', true, 'Caretaker wages and services', 7),
('Garden Maintenance', 'Gartenpflege', 'Entretien jardin', 'Manutenzione giardino', 'Garden Maintenance', true, 'Garden and landscaping maintenance', 8),
('Snow Removal', 'Schneeräumung', 'Déneigement', 'Sgombero neve', 'Snow Removal', true, 'Snow and ice removal', 9),
('Waste Disposal', 'Kehricht', 'Ordures', 'Rifiuti', 'Waste Disposal', true, 'Garbage collection and disposal', 10),
('TV/Cable', 'TV/Kabelanschluss', 'TV/Câble', 'TV/Cavo', 'TV/Cable', true, 'Cable TV connection fees', 11),
('Pest Control', 'Schädlingsbekämpfung', 'Lutte antiparasitaire', 'Controllo dei parassiti', 'Pest Control', true, 'Pest control services', 12),
('Fire Extinguisher Maintenance', 'Feuerlöscher-Wartung', 'Entretien extincteurs', 'Manutenzione estintori', 'Fire Extinguisher', true, 'Fire safety equipment maintenance', 13),
('Chimney Sweep', 'Kaminfeger', 'Ramoneur', 'Spazzacamino', 'Chimney Sweep', true, 'Chimney cleaning services', 14);

-- Not allowed as utility costs (Nebenkosten - nicht zulässig)
INSERT INTO categories (name, name_de, name_fr, name_it, name_en, is_allowed_utility_cost, description, sort_order) VALUES
('Repairs', 'Reparaturen', 'Réparations', 'Riparazioni', 'Repairs', false, 'Repairs and maintenance (owner responsibility)', 100),
('Building Insurance', 'Gebäudeversicherung', 'Assurance bâtiment', 'Assicurazione edificio', 'Building Insurance', false, 'Building insurance premiums', 101),
('Property Tax', 'Liegenschaftssteuer', 'Impôt foncier', 'Imposta immobiliare', 'Property Tax', false, 'Property taxes', 102),
('Mortgage Interest', 'Hypothekarzinsen', 'Intérêts hypothécaires', 'Interessi ipotecari', 'Mortgage Interest', false, 'Mortgage and financing costs', 103),
('Administration', 'Verwaltung', 'Administration', 'Amministrazione', 'Administration', false, 'General administration costs (except management fee)', 104),
('Renovation', 'Renovation', 'Rénovation', 'Ristrutturazione', 'Renovation', false, 'Major renovation projects', 105),
('Capital Improvements', 'Wertvermehrende Investitionen', 'Investissements valorisants', 'Investimenti di valorizzazione', 'Capital Improvements', false, 'Value-adding improvements', 106);

-- ============================================================================
-- Distribution Keys
-- ============================================================================
INSERT INTO distribution_keys (name, name_de, name_fr, name_it, name_en, type, formula, description, sort_order) VALUES
('Per Unit', 'Pro Einheit', 'Par unité', 'Per unità', 'Per Unit', 'predefined', '{units}', 'Equal distribution per apartment', 1),
('Per Area (m²)', 'Pro Fläche (m²)', 'Par surface (m²)', 'Per superficie (m²)', 'Per Area', 'predefined', '{area}', 'Distribution based on apartment area', 2),
('Per Rooms', 'Pro Zimmer', 'Par pièces', 'Per locali', 'Per Rooms', 'predefined', '{rooms}', 'Distribution based on number of rooms', 3),
('Heating (Area 70% / Unit 30%)', 'Heizung (Fläche 70% / Einheit 30%)', 'Chauffage (surface 70% / unité 30%)', 'Riscaldamento (superficie 70% / unità 30%)', 'Heating Split', 'predefined', '0.7 * {area} + 0.3 * {units}', 'Swiss standard heating distribution', 6);

-- ============================================================================
-- Heating Distribution Profiles
-- Based on Swiss regional heating patterns; every profile distributes exactly 100 %
-- ============================================================================

-- Heating + Hot Water (Standard profile for combined systems)
INSERT INTO heating_profiles (name, name_de, name_fr, name_it, name_en, type,
    january_pct, february_pct, march_pct, april_pct, may_pct, june_pct,
    july_pct, august_pct, september_pct, october_pct, november_pct, december_pct,
    description) VALUES
('Heating + Hot Water', 'Heizung + Warmwasser', 'Chauffage + eau chaude', 'Riscaldamento + acqua calda', 'Heating + Hot Water', 'predefined',
    14.00, 12.00, 10.00, 6.00, 3.00, 2.00,
    2.00, 2.00, 4.00, 8.00, 12.00, 25.00,
    'Standard profile for combined heating and hot water systems');

-- Heating Only - Mittelland (Swiss Plateau)
INSERT INTO heating_profiles (name, name_de, name_fr, name_it, name_en, type,
    january_pct, february_pct, march_pct, april_pct, may_pct, june_pct,
    july_pct, august_pct, september_pct, october_pct, november_pct, december_pct,
    description) VALUES
('Heating Mittelland', 'Heizung Mittelland', 'Chauffage Plateau', 'Riscaldamento Altipiano', 'Heating Plateau', 'predefined',
    28.00, 14.00, 11.00, 5.00, 0.00, 0.00,
    0.00, 0.00, 2.00, 8.00, 14.00, 18.00,
    'Heating profile for Swiss Plateau region (Bern, Zürich, Basel, etc.)');

-- Heating Only - Mountain Region (Alps)
INSERT INTO heating_profiles (name, name_de, name_fr, name_it, name_en, type,
    january_pct, february_pct, march_pct, april_pct, may_pct, june_pct,
    july_pct, august_pct, september_pct, october_pct, november_pct, december_pct,
    description) VALUES
('Heating Mountain', 'Heizung Bergregion', 'Chauffage Montagne', 'Riscaldamento Montagna', 'Heating Mountain', 'predefined',
    16.00, 14.00, 12.00, 8.00, 4.00, 1.00,
    0.00, 1.00, 4.00, 10.00, 14.00, 16.00,
    'Heating profile for Alpine and pre-Alpine regions');

-- Heating Only - Tessin (Southern Switzerland)
INSERT INTO heating_profiles (name, name_de, name_fr, name_it, name_en, type,
    january_pct, february_pct, march_pct, april_pct, may_pct, june_pct,
    july_pct, august_pct, september_pct, october_pct, november_pct, december_pct,
    description) VALUES
('Heating Tessin', 'Heizung Tessin', 'Chauffage Tessin', 'Riscaldamento Ticino', 'Heating Ticino', 'predefined',
    30.00, 16.00, 12.00, 4.00, 0.00, 0.00,
    0.00, 0.00, 0.00, 6.00, 14.00, 18.00,
    'Heating profile for Ticino and southern regions');

-- Hot Water Only (year-round usage)
INSERT INTO heating_profiles (name, name_de, name_fr, name_it, name_en, type,
    january_pct, february_pct, march_pct, april_pct, may_pct, june_pct,
    july_pct, august_pct, september_pct, october_pct, november_pct, december_pct,
    description) VALUES
('Hot Water Only', 'Nur Warmwasser', 'Eau chaude seulement', 'Solo acqua calda', 'Hot Water Only', 'predefined',
    8.50, 8.50, 8.50, 8.00, 8.50, 8.00,
    8.50, 8.50, 8.00, 8.50, 8.00, 8.50,
    'Even distribution for hot water only systems');
