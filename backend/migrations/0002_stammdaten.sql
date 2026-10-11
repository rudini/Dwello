-- ============================================================================
-- Master data every database needs: cost categories (whether costs may be passed on),
-- distribution keys and predefined heating profiles. Configuration needs no rows:
-- its defaults are in backend/src/services/config.service.ts. Demo data: backend/demo/.
-- ============================================================================

-- ============================================================================
-- Categories (Swiss Utility Cost Categories)
-- Based on Swiss rental law (Mietrecht)
-- ============================================================================

-- Allowed utility costs (Nebenkosten - zulässig); heating costs (Art. 5 VMWG: heating, chimney sweep) follow the heating
-- profile at a tenant change, a separate Warmwasser invoice is shared by days
INSERT INTO categories (name, name_de, name_fr, name_it, name_en, is_allowed_utility_cost, is_heating_cost, description, sort_order) VALUES
('Heating', 'Heizung', 'Chauffage', 'Riscaldamento', 'Heating', true, true, 'Kosten für das Heizen des Gebäudes', 1),
('Hot Water', 'Warmwasser', 'Eau chaude', 'Acqua calda', 'Hot Water', true, false, 'Kosten für die Aufbereitung von Warmwasser', 2),
('Cold Water', 'Kaltwasser', 'Eau froide', 'Acqua fredda', 'Cold Water', true, false, 'Kosten für die Versorgung mit Kaltwasser', 3),
('Wastewater', 'Abwasser', 'Eaux usées', 'Acque reflue', 'Wastewater', true, false, 'Abwasser und Kanalisation', 4),
('Electricity Common Areas', 'Allgemeinstrom', 'Électricité parties communes', 'Elettricità parti comuni', 'Common Area Electricity', true, false, 'Strom für Treppenhaus, Keller, Garage und Aussenbeleuchtung', 5),
('Elevator', 'Lift', 'Ascenseur', 'Ascensore', 'Elevator', true, false, 'Betrieb und Wartung des Lifts', 6),
('Caretaker', 'Hauswart', 'Concierge', 'Portiere', 'Caretaker', true, false, 'Lohn und Leistungen des Hauswarts', 7),
('Garden Maintenance', 'Gartenpflege', 'Entretien jardin', 'Manutenzione giardino', 'Garden Maintenance', true, false, 'Pflege von Garten und Umgebung', 8),
('Snow Removal', 'Schneeräumung', 'Déneigement', 'Sgombero neve', 'Snow Removal', true, false, 'Schneeräumung und Glatteisbekämpfung', 9),
('Waste Disposal', 'Kehricht', 'Ordures', 'Rifiuti', 'Waste Disposal', true, false, 'Kehrichtabfuhr und Entsorgung', 10),
('TV/Cable', 'TV/Kabelanschluss', 'TV/Câble', 'TV/Cavo', 'TV/Cable', true, false, 'Gebühren für den Kabelanschluss', 11),
('Pest Control', 'Schädlingsbekämpfung', 'Lutte antiparasitaire', 'Controllo dei parassiti', 'Pest Control', true, false, 'Schädlingsbekämpfung', 12),
('Fire Extinguisher Maintenance', 'Feuerlöscher-Wartung', 'Entretien extincteurs', 'Manutenzione estintori', 'Fire Extinguisher', true, false, 'Wartung der Feuerlöscher und Brandschutzeinrichtungen', 13),
('Chimney Sweep', 'Kaminfeger', 'Ramoneur', 'Spazzacamino', 'Chimney Sweep', true, true, 'Reinigung und Kontrolle von Kamin und Heizanlage', 14);

-- Not allowed as utility costs (Nebenkosten - nicht zulässig)
INSERT INTO categories (name, name_de, name_fr, name_it, name_en, is_allowed_utility_cost, is_heating_cost, description, sort_order) VALUES
('Repairs', 'Reparaturen', 'Réparations', 'Riparazioni', 'Repairs', false, false, 'Reparaturen und Unterhalt (trägt der Vermieter)', 100),
('Building Insurance', 'Gebäudeversicherung', 'Assurance bâtiment', 'Assicurazione edificio', 'Building Insurance', false, false, 'Prämien der Gebäudeversicherung', 101),
('Property Tax', 'Liegenschaftssteuer', 'Impôt foncier', 'Imposta immobiliare', 'Property Tax', false, false, 'Liegenschaftssteuer', 102),
('Mortgage Interest', 'Hypothekarzinsen', 'Intérêts hypothécaires', 'Interessi ipotecari', 'Mortgage Interest', false, false, 'Hypothekar- und Finanzierungskosten', 103),
('Administration', 'Verwaltung', 'Administration', 'Amministrazione', 'Administration', false, false, 'Allgemeine Verwaltungskosten (ohne Verwaltungspauschale)', 104),
('Renovation', 'Renovation', 'Rénovation', 'Ristrutturazione', 'Renovation', false, false, 'Grössere Renovationen', 105),
('Capital Improvements', 'Wertvermehrende Investitionen', 'Investissements valorisants', 'Investimenti di valorizzazione', 'Capital Improvements', false, false, 'Wertvermehrende Investitionen', 106);

-- ============================================================================
-- Distribution Keys
-- The mixed heating key uses the building sums so both parts add up to 70 % and 30 % (a share is value / sum of all
-- values; with {units} = 1 per apartment, 0.7 * {area} alone would outweigh it)
-- ============================================================================
INSERT INTO distribution_keys (name, name_de, name_fr, name_it, name_en, type, formula, description, sort_order) VALUES
('Per Unit', 'Pro Einheit', 'Par unité', 'Per unità', 'Per Unit', 'predefined', '{units}', 'Gleichmässig pro Wohnung', 1),
('Per Area (m²)', 'Pro Fläche (m²)', 'Par surface (m²)', 'Per superficie (m²)', 'Per Area', 'predefined', '{area}', 'Nach der Fläche der Wohnung', 2),
('Per Rooms', 'Pro Zimmer', 'Par pièces', 'Per locali', 'Per Rooms', 'predefined', '{rooms}', 'Nach der Anzahl Zimmer', 3),
('Heating (Area 70% / Unit 30%)', 'Heizung (Fläche 70% / Einheit 30%)', 'Chauffage (surface 70% / unité 30%)', 'Riscaldamento (superficie 70% / unità 30%)', 'Heating Split', 'predefined', '0.7 * {area} / {area_total} + 0.3 * {units} / {units_total}', '70 % nach Fläche, 30 % zu gleichen Teilen pro Wohnung', 6);

-- ============================================================================
-- Heating Distribution Profiles
-- Monthly shares of the heating costs at a tenant change, from the table «Mieterwechsel: So werden die Heizkosten
-- verteilt» of a Swiss tenancy guide; every profile distributes exactly 100 %. There is no «Nur Warmwasser» profile:
-- a separate Warmwasser category is shared by days
-- ============================================================================

-- Heating + Hot Water (Standard profile for combined systems)
INSERT INTO heating_profiles (name, name_de, name_fr, name_it, name_en, type,
    january_pct, february_pct, march_pct, april_pct, may_pct, june_pct,
    july_pct, august_pct, september_pct, october_pct, november_pct, december_pct,
    description) VALUES
('Heating + Hot Water', 'Heizung + Warmwasser', 'Chauffage + eau chaude', 'Riscaldamento + acqua calda', 'Heating + Hot Water', 'predefined',
    13.60, 12.10, 11.50, 9.30, 5.60, 3.70,
    3.70, 3.60, 3.70, 9.50, 10.70, 13.00,
    'Heizung mit Warmwasser; Monatsanteile nach der Tabelle «Mieterwechsel: So werden die Heizkosten verteilt» (gleich: «Anteilmässige Belastung in Prozenten», Mietvertragsformular mietrecht.ch)');

-- Heating Only - Mittelland (Swiss Plateau)
INSERT INTO heating_profiles (name, name_de, name_fr, name_it, name_en, type,
    january_pct, february_pct, march_pct, april_pct, may_pct, june_pct,
    july_pct, august_pct, september_pct, october_pct, november_pct, december_pct,
    description) VALUES
('Heating Mittelland', 'Heizung Mittelland', 'Chauffage Plateau', 'Riscaldamento Altipiano', 'Heating Plateau', 'predefined',
    17.50, 14.50, 13.50, 9.50, 3.50, 0.00,
    0.00, 0.00, 1.00, 10.00, 13.50, 17.00,
    'Heizung ohne Warmwasser; Monatsanteile nach der Tabelle «Mieterwechsel: So werden die Heizkosten verteilt» (gleich: «Anteilmässige Belastung in Prozenten», Mietvertragsformular mietrecht.ch)');

-- Heating Only - Mountain Region (Alps)
INSERT INTO heating_profiles (name, name_de, name_fr, name_it, name_en, type,
    january_pct, february_pct, march_pct, april_pct, may_pct, june_pct,
    july_pct, august_pct, september_pct, october_pct, november_pct, december_pct,
    description) VALUES
('Heating Mountain', 'Heizung Bergregion', 'Chauffage Montagne', 'Riscaldamento Montagna', 'Heating Mountain', 'predefined',
    14.00, 11.50, 11.50, 9.00, 7.00, 4.50,
    1.00, 4.00, 5.50, 8.50, 10.50, 13.00,
    'Heizung ohne Warmwasser in der Bergregion; Monatsanteile nach der Tabelle «Mieterwechsel: So werden die Heizkosten verteilt»');

-- Heating Only - Tessin (Southern Switzerland)
INSERT INTO heating_profiles (name, name_de, name_fr, name_it, name_en, type,
    january_pct, february_pct, march_pct, april_pct, may_pct, june_pct,
    july_pct, august_pct, september_pct, october_pct, november_pct, december_pct,
    description) VALUES
('Heating Tessin', 'Heizung Tessin', 'Chauffage Tessin', 'Riscaldamento Ticino', 'Heating Ticino', 'predefined',
    21.50, 17.00, 15.50, 5.00, 0.00, 0.00,
    0.00, 0.00, 0.00, 6.00, 15.00, 20.00,
    'Heizung ohne Warmwasser im Tessin; Monatsanteile nach der Tabelle «Mieterwechsel: So werden die Heizkosten verteilt»');
