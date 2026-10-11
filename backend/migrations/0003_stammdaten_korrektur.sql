-- ============================================================================
-- Corrections of the master data from 0002_stammdaten.sql (reasons: docs/seed-daten-aenderungen.md)
-- ============================================================================

-- The mixed heating key did not split 70/30: with {units} = 1 per apartment, 0.7 * {area} outweighed it
-- (the share is value / sum of all values). The building sums make both parts add up to 70 % and 30 %.
UPDATE distribution_keys
SET formula = '0.7 * {area} / {area_total} + 0.3 * {units} / {units_total}',
    description = '70 % nach Fläche, 30 % zu gleichen Teilen pro Wohnung'
WHERE name = 'Heating (Area 70% / Unit 30%)' AND type = 'predefined';

-- Monthly shares of the heating costs at a tenant change ("Anteilmässige Belastung in Prozenten"),
-- as printed in the lease forms of mietrecht.ch / Mieterverband: heating without and with hot water
UPDATE heating_profiles SET
    january_pct = 17.50, february_pct = 14.50, march_pct = 13.50, april_pct = 9.50, may_pct = 3.50, june_pct = 0.00,
    july_pct = 0.00, august_pct = 0.00, september_pct = 1.00, october_pct = 10.00, november_pct = 13.50, december_pct = 17.00,
    description = 'Heizung ohne Warmwasser; Monatsanteile nach der Tabelle «Mieterwechsel: So werden die Heizkosten verteilt» (gleich: «Anteilmässige Belastung in Prozenten», Mietvertragsformular mietrecht.ch)'
WHERE name = 'Heating Mittelland' AND type = 'predefined';

UPDATE heating_profiles SET
    january_pct = 13.60, february_pct = 12.10, march_pct = 11.50, april_pct = 9.30, may_pct = 5.60, june_pct = 3.70,
    july_pct = 3.70, august_pct = 3.60, september_pct = 3.70, october_pct = 9.50, november_pct = 10.70, december_pct = 13.00,
    description = 'Heizung mit Warmwasser; Monatsanteile nach der Tabelle «Mieterwechsel: So werden die Heizkosten verteilt» (gleich: «Anteilmässige Belastung in Prozenten», Mietvertragsformular mietrecht.ch)'
WHERE name = 'Heating + Hot Water' AND type = 'predefined';

-- Mountain region and Ticino: the same table of a Swiss tenancy guide («Mieterwechsel: So werden die Heizkosten
-- verteilt», heating without hot water), provided by the product owner
UPDATE heating_profiles SET
    january_pct = 14.00, february_pct = 11.50, march_pct = 11.50, april_pct = 9.00, may_pct = 7.00, june_pct = 4.50,
    july_pct = 1.00, august_pct = 4.00, september_pct = 5.50, october_pct = 8.50, november_pct = 10.50, december_pct = 13.00,
    description = 'Heizung ohne Warmwasser in der Bergregion; Monatsanteile nach der Tabelle «Mieterwechsel: So werden die Heizkosten verteilt»'
WHERE name = 'Heating Mountain' AND type = 'predefined';

UPDATE heating_profiles SET
    january_pct = 21.50, february_pct = 17.00, march_pct = 15.50, april_pct = 5.00, may_pct = 0.00, june_pct = 0.00,
    july_pct = 0.00, august_pct = 0.00, september_pct = 0.00, october_pct = 6.00, november_pct = 15.00, december_pct = 20.00,
    description = 'Heizung ohne Warmwasser im Tessin; Monatsanteile nach der Tabelle «Mieterwechsel: So werden die Heizkosten verteilt»'
WHERE name = 'Heating Tessin' AND type = 'predefined';

-- Hot water is used all year: shares by calendar days (31, 28, 30 days of 365); January and July get 8.50
-- instead of 8.49 so the rounded shares add up to exactly 100
UPDATE heating_profiles SET
    january_pct = 8.50, february_pct = 7.67, march_pct = 8.49, april_pct = 8.22, may_pct = 8.49, june_pct = 8.22,
    july_pct = 8.50, august_pct = 8.49, september_pct = 8.22, october_pct = 8.49, november_pct = 8.22, december_pct = 8.49,
    description = 'Nur Warmwasser; Monatsanteile nach Kalendertagen'
WHERE name = 'Hot Water Only' AND type = 'predefined';
