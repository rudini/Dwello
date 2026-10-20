-- ============================================================================
-- Descriptions of Lift and Kehricht (#452, decided in #407 points 5 and 6): the Lift names the servicing share of a
-- Vollservicevertrag (#399), Kehricht excludes base fees that depend on the property's value (#220, Art. 257b Abs. 1
-- OR). Every KI prompt lists the descriptions. A description the landlord changed stays as it is.
-- ============================================================================

UPDATE categories SET description = 'Strom, Notruftelefon und Wartung des Lifts, bei einem Vollservicevertrag nur der Anteil der Wartung; ohne Reparaturen und Ersatzteile'
WHERE name = 'Elevator' AND description = 'Strom, Notruftelefon und reine Wartung des Lifts; ohne Reparaturen, Ersatzteile und Serviceabos mit Reparaturen';

UPDATE categories SET description = 'Kehrichtgebühren nach Gebrauch und Grünabfuhr; ohne Grümpelräumungen, die der Vermieter bestellt, und Grundgebühren, die vom Wert der Liegenschaft abhängen'
WHERE name = 'Waste Disposal' AND description = 'Kehrichtgebühren und Grünabfuhr; ohne Räumungen, die der Vermieter bestellt';
