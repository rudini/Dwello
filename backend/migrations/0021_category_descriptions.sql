-- ============================================================================
-- Descriptions of predefined categories name what they exclude (#204, #220): every KI prompt lists them, so «Pflege
-- von Garten und Umgebung» or «Kehrichtabfuhr und Entsorgung» led it to file a tree felling or a junk clearance as
-- allocable. Wording: docs/reviews/204-fachreview-1.md; TV/Kabelanschluss and Kehricht decided in #220. A
-- description the landlord changed stays as it is.
-- ============================================================================

UPDATE categories SET description = 'Brennstoff, Energie, Wartung und Betrieb der Heizung, auch Versicherung nur der Heizungsanlage und Verwaltungsarbeit für den Heizbetrieb; ohne Reparatur, Erneuerung, Verzinsung und Abschreibung der Anlage'
WHERE name = 'Heating' AND description = 'Kosten für das Heizen des Gebäudes';

UPDATE categories SET description = 'Laufende Pflege von Garten und Umgebung: Rasenmähen, Rückschnitt von Sträuchern, Laub- und Unkrautentfernung; ohne Neubepflanzung, Baumfällung, Rasensanierung und Anschaffung von Geräten'
WHERE name = 'Garden Maintenance' AND description = 'Pflege von Garten und Umgebung';

UPDATE categories SET description = 'Kehrichtgebühren und Grünabfuhr; ohne Räumungen, die der Vermieter bestellt'
WHERE name = 'Waste Disposal' AND description = 'Kehrichtabfuhr und Entsorgung';

UPDATE categories SET description = 'Laufende Grundgebühr des Kabelnetzes; ohne Installation des Anschlusses'
WHERE name = 'TV/Cable' AND description = 'Gebühren für den Kabelanschluss';

UPDATE categories SET description = 'Prämien der Gebäudeversicherung; ohne Prämien, die nur die Heizungsanlage versichern (gehören zur Heizung)'
WHERE name = 'Building Insurance' AND description = 'Prämien der Gebäudeversicherung';

UPDATE categories SET description = 'Allgemeine Verwaltungskosten; ohne Verwaltungsarbeit für den Heizbetrieb, z. B. Brennstoff bestellen (gehört zur Heizung), und ohne Verwaltungspauschale'
WHERE name = 'Administration' AND description = 'Allgemeine Verwaltungskosten (ohne Verwaltungspauschale)';
