-- German descriptions of the predefined categories and distribution keys (0002 had English ones)
UPDATE categories AS c SET description = d.description
FROM (VALUES
    ('Heating', 'Kosten für das Heizen des Gebäudes'),
    ('Hot Water', 'Kosten für die Aufbereitung von Warmwasser'),
    ('Cold Water', 'Kosten für die Versorgung mit Kaltwasser'),
    ('Wastewater', 'Abwasser und Kanalisation'),
    ('Electricity Common Areas', 'Strom für Treppenhaus, Keller, Garage und Aussenbeleuchtung'),
    ('Elevator', 'Betrieb und Wartung des Lifts'),
    ('Caretaker', 'Lohn und Leistungen des Hauswarts'),
    ('Garden Maintenance', 'Pflege von Garten und Umgebung'),
    ('Snow Removal', 'Schneeräumung und Glatteisbekämpfung'),
    ('Waste Disposal', 'Kehrichtabfuhr und Entsorgung'),
    ('TV/Cable', 'Gebühren für den Kabelanschluss'),
    ('Pest Control', 'Schädlingsbekämpfung'),
    ('Fire Extinguisher Maintenance', 'Wartung der Feuerlöscher und Brandschutzeinrichtungen'),
    ('Chimney Sweep', 'Reinigung und Kontrolle von Kamin und Heizanlage'),
    ('Repairs', 'Reparaturen und Unterhalt (trägt der Vermieter)'),
    ('Building Insurance', 'Prämien der Gebäudeversicherung'),
    ('Property Tax', 'Liegenschaftssteuer'),
    ('Mortgage Interest', 'Hypothekar- und Finanzierungskosten'),
    ('Administration', 'Allgemeine Verwaltungskosten (ohne Verwaltungspauschale)'),
    ('Renovation', 'Grössere Renovationen'),
    ('Capital Improvements', 'Wertvermehrende Investitionen')
) AS d(name, description)
WHERE c.name = d.name;

UPDATE distribution_keys AS k SET description = d.description
FROM (VALUES
    ('Per Unit', 'Gleichmässig pro Wohnung'),
    ('Per Area (m²)', 'Nach der Fläche der Wohnung'),
    ('Per Rooms', 'Nach der Anzahl Zimmer')
) AS d(name, description)
WHERE k.name = d.name AND k.type = 'predefined';
