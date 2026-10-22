-- ============================================================================
-- #465 (#103, DMR-10): the source of a Heizprofil's monthly shares, printed under its line in the statement PDF, per
-- language. The predefined profiles follow the Mieterverband's fact sheet value for value (Fachreview 465-1 V-1); only
-- the seeded rows get it, so an installation's own profile stays without (the PDF names it the landlord's own).
-- ============================================================================

ALTER TABLE heating_profiles ADD COLUMN source_de TEXT, ADD COLUMN source_fr TEXT, ADD COLUMN source_it TEXT, ADD COLUMN source_en TEXT;

UPDATE heating_profiles SET source_de = 'Merkblatt «Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode» des Mieterinnen- und Mieterverbands (mieterverband.ch), Tabelle «Heizungsanlage ohne Warmwasseraufbereitung»',
    source_fr = 'Fiche « Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode » du Mieterinnen- und Mieterverband (mieterverband.ch, en allemand), tableau « Heizungsanlage ohne Warmwasseraufbereitung » (chauffage sans production d’eau chaude)',
    source_it = 'Scheda «Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode» del Mieterinnen- und Mieterverband (mieterverband.ch, in tedesco), tabella «Heizungsanlage ohne Warmwasseraufbereitung» (riscaldamento senza produzione di acqua calda)',
    source_en = 'Fact sheet ‘Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode’ of the Mieterinnen- und Mieterverband (Swiss tenants’ association, mieterverband.ch, in German), table ‘Heizungsanlage ohne Warmwasseraufbereitung’ (heating without hot water)'
  WHERE name = 'Heating Mittelland' AND type = 'predefined';

UPDATE heating_profiles SET source_de = 'Merkblatt «Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode» des Mieterinnen- und Mieterverbands (mieterverband.ch), Tabelle «Heizungsanlage mit Warmwasseraufbereitung»',
    source_fr = 'Fiche « Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode » du Mieterinnen- und Mieterverband (mieterverband.ch, en allemand), tableau « Heizungsanlage mit Warmwasseraufbereitung » (chauffage avec production d’eau chaude)',
    source_it = 'Scheda «Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode» del Mieterinnen- und Mieterverband (mieterverband.ch, in tedesco), tabella «Heizungsanlage mit Warmwasseraufbereitung» (riscaldamento con produzione di acqua calda)',
    source_en = 'Fact sheet ‘Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode’ of the Mieterinnen- und Mieterverband (Swiss tenants’ association, mieterverband.ch, in German), table ‘Heizungsanlage mit Warmwasseraufbereitung’ (heating with hot water)'
  WHERE name = 'Heating + Hot Water' AND type = 'predefined';

UPDATE heating_profiles SET source_de = 'Merkblatt «Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode» des Mieterinnen- und Mieterverbands (mieterverband.ch), Tabelle «Verteilungsschlüssel in Bergebieten und im Tessin», Zeile «Berggebiete»',
    source_fr = 'Fiche « Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode » du Mieterinnen- und Mieterverband (mieterverband.ch, en allemand), tableau « Verteilungsschlüssel in Bergebieten und im Tessin », ligne « Berggebiete » (régions de montagne)',
    source_it = 'Scheda «Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode» del Mieterinnen- und Mieterverband (mieterverband.ch, in tedesco), tabella «Verteilungsschlüssel in Bergebieten und im Tessin», riga «Berggebiete» (regioni di montagna)',
    source_en = 'Fact sheet ‘Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode’ of the Mieterinnen- und Mieterverband (Swiss tenants’ association, mieterverband.ch, in German), table ‘Verteilungsschlüssel in Bergebieten und im Tessin’, row ‘Berggebiete’ (mountain regions)'
  WHERE name = 'Heating Mountain' AND type = 'predefined';

UPDATE heating_profiles SET source_de = 'Merkblatt «Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode» des Mieterinnen- und Mieterverbands (mieterverband.ch), Tabelle «Verteilungsschlüssel in Bergebieten und im Tessin», Zeile «Tessin»',
    source_fr = 'Fiche « Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode » du Mieterinnen- und Mieterverband (mieterverband.ch, en allemand), tableau « Verteilungsschlüssel in Bergebieten und im Tessin », ligne « Tessin » (Tessin)',
    source_it = 'Scheda «Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode» del Mieterinnen- und Mieterverband (mieterverband.ch, in tedesco), tabella «Verteilungsschlüssel in Bergebieten und im Tessin», riga «Tessin» (Ticino)',
    source_en = 'Fact sheet ‘Nebenkostenabrechnung beim Umzug während der Abrechnungsperiode’ of the Mieterinnen- und Mieterverband (Swiss tenants’ association, mieterverband.ch, in German), table ‘Verteilungsschlüssel in Bergebieten und im Tessin’, row ‘Tessin’ (Ticino)'
  WHERE name = 'Heating Tessin' AND type = 'predefined';
