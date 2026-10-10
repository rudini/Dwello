-- ============================================================================
-- Demo data for trying Dwello and showing it: bun run db:demo (never in production, not a migration)
-- Fixed ids, so loading it again adds nothing. Two complete billing years (2024, 2025) with the invoices a
-- Swiss property manager receives; what changed and why: docs/seed-daten-aenderungen.md
-- ============================================================================

-- ============================================================================
-- Buildings
-- ============================================================================
INSERT INTO buildings (id, name, address, postal_code, city, canton, country, latitude, longitude, building_type, year_built) VALUES
('11111111-1111-1111-1111-111111111111', 'Musterhaus Zentrum', 'Bahnhofstrasse 42', '8001', 'Zürich', 'ZH', 'CH', 47.3769, 8.5417, 'Mehrfamilienhaus', 1968),
('22222222-2222-2222-2222-222222222222', 'Seepark Residenz', 'Seeweg 15', '6003', 'Luzern', 'LU', 'CH', 47.0502, 8.3093, 'Mehrfamilienhaus', 2009),
('33333333-3333-3333-3333-333333333333', 'Alpenblick', 'Bergstrasse 8', '3800', 'Interlaken', 'BE', 'CH', 46.6863, 7.8632, 'Mehrfamilienhaus', 1987) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Apartments
-- ============================================================================
-- Occupied or vacant follows from the rental contracts; the stored status is vacant
-- Building 1: Musterhaus Zentrum (6 units, 492.5 m²)
INSERT INTO apartments (id, building_id, number, floor, area, rooms, status) VALUES
('aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '1.01', 1, 75.5, 3.5, 'vacant'),
('aaaa1111-1111-1111-1111-222222222222', '11111111-1111-1111-1111-111111111111', '1.02', 1, 92.0, 4.5, 'vacant'),
('aaaa1111-1111-1111-1111-333333333333', '11111111-1111-1111-1111-111111111111', '2.01', 2, 85.0, 4.0, 'vacant'),
('aaaa1111-1111-1111-1111-444444444444', '11111111-1111-1111-1111-111111111111', '2.02', 2, 65.0, 2.5, 'vacant'),
('aaaa1111-1111-1111-1111-555555555555', '11111111-1111-1111-1111-111111111111', '3.01', 3, 120.0, 5.5, 'vacant'),
('aaaa1111-1111-1111-1111-666666666666', '11111111-1111-1111-1111-111111111111', '3.02', 3, 55.0, 2.0, 'vacant') ON CONFLICT (id) DO NOTHING;

-- Building 2: Seepark Residenz (4 units, 320 m²)
INSERT INTO apartments (id, building_id, number, floor, area, rooms, status) VALUES
('aaaa2222-2222-2222-2222-111111111111', '22222222-2222-2222-2222-222222222222', 'A1', 0, 68.0, 3.0, 'vacant'),
('aaaa2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'A2', 0, 82.0, 3.5, 'vacant'),
('aaaa2222-2222-2222-2222-333333333333', '22222222-2222-2222-2222-222222222222', 'B1', 1, 75.0, 3.5, 'vacant'),
('aaaa2222-2222-2222-2222-444444444444', '22222222-2222-2222-2222-222222222222', 'B2', 1, 95.0, 4.5, 'vacant') ON CONFLICT (id) DO NOTHING;

-- Building 3: Alpenblick (3 units, 255 m²)
INSERT INTO apartments (id, building_id, number, floor, area, rooms, status) VALUES
('aaaa3333-3333-3333-3333-111111111111', '33333333-3333-3333-3333-333333333333', 'EG', 0, 72.0, 3.0, 'vacant'),
('aaaa3333-3333-3333-3333-222222222222', '33333333-3333-3333-3333-333333333333', 'OG1', 1, 98.0, 4.0, 'vacant'),
('aaaa3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'OG2', 2, 85.0, 3.5, 'vacant') ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Tenants: the postal address is the rented apartment's (Sarah Meier moved out in 2025, Kevin Fischer
-- left Musterhaus Zentrum in 2021 and rents in Alpenblick since)
-- ============================================================================
INSERT INTO tenants (id, first_name, last_name, email, phone, language, address, postal_code, city, correspondence_channel) VALUES
('a0000001-0001-0001-0001-000000000001', 'Hans', 'Müller', 'hans.mueller@example.ch', '+41 79 123 45 67', 'de', 'Bahnhofstrasse 42', '8001', 'Zürich', 'letter'),
('a0000001-0001-0001-0001-000000000002', 'Anna', 'Schmidt', 'anna.schmidt@example.ch', '+41 78 234 56 78', 'de', 'Bahnhofstrasse 42', '8001', 'Zürich', 'email'),
('a0000001-0001-0001-0001-000000000003', 'Pierre', 'Dubois', 'pierre.dubois@example.ch', '+41 76 345 67 89', 'fr', 'Bahnhofstrasse 42', '8001', 'Zürich', 'email'),
('a0000001-0001-0001-0001-000000000004', 'Maria', 'Rossi', 'maria.rossi@example.ch', '+41 79 456 78 90', 'it', 'Bahnhofstrasse 42', '8001', 'Zürich', 'letter'),
('a0000001-0001-0001-0001-000000000005', 'Thomas', 'Weber', 'thomas.weber@example.ch', '+41 78 567 89 01', 'de', 'Seeweg 15', '6003', 'Luzern', 'email'),
('a0000001-0001-0001-0001-000000000006', 'Sarah', 'Meier', 'sarah.meier@example.ch', '+41 76 678 90 12', 'de', 'Hirschmattstrasse 21', '6003', 'Luzern', 'email'),
('a0000001-0001-0001-0001-000000000007', 'Marco', 'Bernasconi', 'marco.bernasconi@example.ch', '+41 79 789 01 23', 'it', 'Seeweg 15', '6003', 'Luzern', 'email'),
('a0000001-0001-0001-0001-000000000008', 'Laura', 'Keller', 'laura.keller@example.ch', '+41 78 890 12 34', 'de', 'Bergstrasse 8', '3800', 'Interlaken', 'email'),
('a0000001-0001-0001-0001-000000000009', 'Kevin', 'Fischer', 'kevin.fischer@example.ch', '+41 76 901 23 45', 'de', 'Bergstrasse 8', '3800', 'Interlaken', 'letter'),
('a0000001-0001-0001-0001-000000000010', 'Nina', 'Brunner', 'nina.brunner@example.ch', '+41 79 012 34 56', 'de', 'Seeweg 15', '6003', 'Luzern', 'email') ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Rental contracts; the Akonto covers the expected utility costs of the apartment (about CHF 3 per m² and month)
-- ============================================================================

-- Building 1 contracts (2.02 and 3.02 are vacant)
INSERT INTO rental_contracts (id, apartment_id, tenant_id, start_date, end_date, base_rent, additional_rent, monthly_advance_payment) VALUES
('b0000001-0001-0001-0001-000000000001', 'aaaa1111-1111-1111-1111-111111111111', 'a0000001-0001-0001-0001-000000000001', '2021-03-01', NULL, 1450.00, 100.00, 240.00),
('b0000001-0001-0001-0001-000000000002', 'aaaa1111-1111-1111-1111-222222222222', 'a0000001-0001-0001-0001-000000000002', '2022-06-01', NULL, 1850.00, 120.00, 300.00),
('b0000001-0001-0001-0001-000000000003', 'aaaa1111-1111-1111-1111-333333333333', 'a0000001-0001-0001-0001-000000000003', '2023-01-01', NULL, 1650.00, 0.00, 270.00),
('b0000001-0001-0001-0001-000000000005', 'aaaa1111-1111-1111-1111-555555555555', 'a0000001-0001-0001-0001-000000000004', '2020-09-01', NULL, 2400.00, 150.00, 350.00) ON CONFLICT (id) DO NOTHING;

-- Building 2 contracts (B1 is vacant); in A2 Sarah Meier moved out on 30.06.2025 and Nina Brunner moved in on 01.07.2025
INSERT INTO rental_contracts (id, apartment_id, tenant_id, start_date, end_date, base_rent, additional_rent, monthly_advance_payment) VALUES
('b0000002-0002-0002-0002-000000000001', 'aaaa2222-2222-2222-2222-111111111111', 'a0000001-0001-0001-0001-000000000005', '2022-04-01', NULL, 1200.00, 0.00, 200.00),
('b0000002-0002-0002-0002-000000000002', 'aaaa2222-2222-2222-2222-222222222222', 'a0000001-0001-0001-0001-000000000006', '2021-08-01', '2025-06-30', 1550.00, 80.00, 220.00),
('b0000002-0002-0002-0002-000000000003', 'aaaa2222-2222-2222-2222-222222222222', 'a0000001-0001-0001-0001-000000000010', '2025-07-01', NULL, 1620.00, 80.00, 240.00),
('b0000002-0002-0002-0002-000000000004', 'aaaa2222-2222-2222-2222-444444444444', 'a0000001-0001-0001-0001-000000000007', '2023-07-01', NULL, 1750.00, 100.00, 260.00) ON CONFLICT (id) DO NOTHING;

-- Building 3 contracts (OG2 is vacant)
INSERT INTO rental_contracts (id, apartment_id, tenant_id, start_date, end_date, base_rent, additional_rent, monthly_advance_payment) VALUES
('b0000003-0003-0003-0003-000000000001', 'aaaa3333-3333-3333-3333-111111111111', 'a0000001-0001-0001-0001-000000000008', '2022-11-01', NULL, 1350.00, 50.00, 190.00),
('b0000003-0003-0003-0003-000000000002', 'aaaa3333-3333-3333-3333-222222222222', 'a0000001-0001-0001-0001-000000000009', '2021-05-01', NULL, 1800.00, 120.00, 250.00) ON CONFLICT (id) DO NOTHING;

-- Historical contract (ended)
INSERT INTO rental_contracts (id, apartment_id, tenant_id, start_date, end_date, base_rent, additional_rent, monthly_advance_payment, notes) VALUES
('b0000001-0001-0001-0001-000000000099', 'aaaa1111-1111-1111-1111-111111111111', 'a0000001-0001-0001-0001-000000000009', '2018-06-01', '2021-02-28', 1350.00, 100.00, 180.00, 'Vormieter, ausgezogen per 28.02.2021') ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Invoices, dated at the end of the period they cover (the Rechnungsdatum decides the Abrechnungsperiode).
-- Alpenblick lacks, on purpose, the chimney sweep and the water of the second half of 2025, so the check for
-- missing invoices has something to show.
-- ============================================================================
-- Musterhaus Zentrum: 2024 und 2025
INSERT INTO invoices (id, building_id, invoice_number, billing_entity_name, description, category_id, distribution_key_id, amount, is_valid_utility_cost, invoice_date, due_date) VALUES
('c0000001-2024-4000-8000-000000000001', '11111111-1111-1111-1111-111111111111', 'MZ-2024-001', 'Lift AG', 'Serviceabonnement Lift 2024', (SELECT id FROM categories WHERE name_de = 'Lift'), (SELECT id FROM distribution_keys WHERE name = 'Per Unit'), 1650.00, true, '2024-02-12', '2024-03-13'),
('c0000001-2024-4000-8000-000000000002', '11111111-1111-1111-1111-111111111111', 'MZ-2024-002', 'Hauswartung Meier GmbH', 'Hauswartung Q1 2024', (SELECT id FROM categories WHERE name_de = 'Hauswart'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 900.00, true, '2024-03-31', '2024-04-30'),
('c0000001-2024-4000-8000-000000000003', '11111111-1111-1111-1111-111111111111', 'MZ-2024-003', 'Wasserversorgung Zürich', 'Wasser und Abwasser Q1 2024', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 910.00, true, '2024-03-31', '2024-04-30'),
('c0000001-2024-4000-8000-000000000004', '11111111-1111-1111-1111-111111111111', 'MZ-2024-004', 'ewz', 'Allgemeinstrom Q1 2024', (SELECT id FROM categories WHERE name_de = 'Allgemeinstrom'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 205.40, true, '2024-03-31', '2024-04-30'),
('c0000001-2024-4000-8000-000000000005', '11111111-1111-1111-1111-111111111111', 'MZ-2024-005', 'Gartenbau Huber', 'Gartenpflege Frühjahr 2024', (SELECT id FROM categories WHERE name_de = 'Gartenpflege'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 520.00, true, '2024-05-15', '2024-06-14'),
('c0000001-2024-4000-8000-000000000006', '11111111-1111-1111-1111-111111111111', 'MZ-2024-006', 'ERZ Entsorgung + Recycling Zürich', 'Kehrichtgrundgebühr H1 2024', (SELECT id FROM categories WHERE name_de = 'Kehricht'), (SELECT id FROM distribution_keys WHERE name = 'Per Unit'), 480.00, true, '2024-06-30', '2024-07-30'),
('c0000001-2024-4000-8000-000000000007', '11111111-1111-1111-1111-111111111111', 'MZ-2024-007', 'Hauswartung Meier GmbH', 'Hauswartung Q2 2024', (SELECT id FROM categories WHERE name_de = 'Hauswart'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 900.00, true, '2024-06-30', '2024-07-30'),
('c0000001-2024-4000-8000-000000000008', '11111111-1111-1111-1111-111111111111', 'MZ-2024-008', 'Wasserversorgung Zürich', 'Wasser und Abwasser Q2 2024', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 945.00, true, '2024-06-30', '2024-07-30'),
('c0000001-2024-4000-8000-000000000009', '11111111-1111-1111-1111-111111111111', 'MZ-2024-009', 'ewz', 'Allgemeinstrom Q2 2024', (SELECT id FROM categories WHERE name_de = 'Allgemeinstrom'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 168.90, true, '2024-06-30', '2024-07-30'),
('c0000001-2024-4000-8000-000000000010', '11111111-1111-1111-1111-111111111111', 'MZ-2024-010', 'Heizöl Brunner AG', 'Heizöl EL, 6''500 Liter', (SELECT id FROM categories WHERE name_de = 'Heizung'), (SELECT id FROM distribution_keys WHERE name = 'Heating (Area 70% / Unit 30%)'), 6890.00, true, '2024-09-18', '2024-10-18'),
('c0000001-2024-4000-8000-000000000011', '11111111-1111-1111-1111-111111111111', 'MZ-2024-011', 'Hauswartung Meier GmbH', 'Hauswartung Q3 2024', (SELECT id FROM categories WHERE name_de = 'Hauswart'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 900.00, true, '2024-09-30', '2024-10-30'),
('c0000001-2024-4000-8000-000000000012', '11111111-1111-1111-1111-111111111111', 'MZ-2024-012', 'Wasserversorgung Zürich', 'Wasser und Abwasser Q3 2024', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 980.00, true, '2024-09-30', '2024-10-30'),
('c0000001-2024-4000-8000-000000000013', '11111111-1111-1111-1111-111111111111', 'MZ-2024-013', 'ewz', 'Allgemeinstrom Q3 2024', (SELECT id FROM categories WHERE name_de = 'Allgemeinstrom'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 159.30, true, '2024-09-30', '2024-10-30'),
('c0000001-2024-4000-8000-000000000014', '11111111-1111-1111-1111-111111111111', 'MZ-2024-014', 'Gartenbau Huber', 'Gartenpflege Herbst 2024', (SELECT id FROM categories WHERE name_de = 'Gartenpflege'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 380.00, true, '2024-10-28', '2024-11-27'),
('c0000001-2024-4000-8000-000000000015', '11111111-1111-1111-1111-111111111111', 'MZ-2024-015', 'Kaminfeger Wyss', 'Kaminfegerarbeiten Heizanlage 2024', (SELECT id FROM categories WHERE name_de = 'Kaminfeger'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 320.00, true, '2024-11-12', '2024-12-12'),
('c0000001-2024-4000-8000-000000000016', '11111111-1111-1111-1111-111111111111', 'MZ-2024-016', 'ERZ Entsorgung + Recycling Zürich', 'Kehrichtgrundgebühr H2 2024', (SELECT id FROM categories WHERE name_de = 'Kehricht'), (SELECT id FROM distribution_keys WHERE name = 'Per Unit'), 480.00, true, '2024-12-31', '2025-01-30'),
('c0000001-2024-4000-8000-000000000017', '11111111-1111-1111-1111-111111111111', 'MZ-2024-017', 'Hauswartung Meier GmbH', 'Hauswartung Q4 2024', (SELECT id FROM categories WHERE name_de = 'Hauswart'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 900.00, true, '2024-12-31', '2025-01-30'),
('c0000001-2024-4000-8000-000000000018', '11111111-1111-1111-1111-111111111111', 'MZ-2024-018', 'Wasserversorgung Zürich', 'Wasser und Abwasser Q4 2024', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 925.00, true, '2024-12-31', '2025-01-30'),
('c0000001-2024-4000-8000-000000000019', '11111111-1111-1111-1111-111111111111', 'MZ-2024-019', 'ewz', 'Allgemeinstrom Q4 2024', (SELECT id FROM categories WHERE name_de = 'Allgemeinstrom'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 221.60, true, '2024-12-31', '2025-01-30'),
('c0000001-2025-4000-8000-000000000020', '11111111-1111-1111-1111-111111111111', 'MZ-2025-001', 'Lift AG', 'Serviceabonnement Lift 2025', (SELECT id FROM categories WHERE name_de = 'Lift'), (SELECT id FROM distribution_keys WHERE name = 'Per Unit'), 1690.00, true, '2025-02-10', '2025-03-12'),
('c0000001-2025-4000-8000-000000000021', '11111111-1111-1111-1111-111111111111', 'MZ-2025-002', 'Hauswartung Meier GmbH', 'Hauswartung Q1 2025', (SELECT id FROM categories WHERE name_de = 'Hauswart'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 920.00, true, '2025-03-31', '2025-04-30'),
('c0000001-2025-4000-8000-000000000022', '11111111-1111-1111-1111-111111111111', 'MZ-2025-003', 'Wasserversorgung Zürich', 'Wasser und Abwasser Q1 2025', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 930.00, true, '2025-03-31', '2025-04-30'),
('c0000001-2025-4000-8000-000000000023', '11111111-1111-1111-1111-111111111111', 'MZ-2025-004', 'ewz', 'Allgemeinstrom Q1 2025', (SELECT id FROM categories WHERE name_de = 'Allgemeinstrom'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 198.70, true, '2025-03-31', '2025-04-30'),
('c0000001-2025-4000-8000-000000000024', '11111111-1111-1111-1111-111111111111', 'MZ-2025-005', 'Gartenbau Huber', 'Gartenpflege Frühjahr 2025', (SELECT id FROM categories WHERE name_de = 'Gartenpflege'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 540.00, true, '2025-05-14', '2025-06-13'),
('c0000001-2025-4000-8000-000000000025', '11111111-1111-1111-1111-111111111111', 'MZ-2025-006', 'ERZ Entsorgung + Recycling Zürich', 'Kehrichtgrundgebühr H1 2025', (SELECT id FROM categories WHERE name_de = 'Kehricht'), (SELECT id FROM distribution_keys WHERE name = 'Per Unit'), 495.00, true, '2025-06-30', '2025-07-30'),
('c0000001-2025-4000-8000-000000000026', '11111111-1111-1111-1111-111111111111', 'MZ-2025-007', 'Hauswartung Meier GmbH', 'Hauswartung Q2 2025', (SELECT id FROM categories WHERE name_de = 'Hauswart'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 920.00, true, '2025-06-30', '2025-07-30'),
('c0000001-2025-4000-8000-000000000027', '11111111-1111-1111-1111-111111111111', 'MZ-2025-008', 'Wasserversorgung Zürich', 'Wasser und Abwasser Q2 2025', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 960.00, true, '2025-06-30', '2025-07-30'),
('c0000001-2025-4000-8000-000000000028', '11111111-1111-1111-1111-111111111111', 'MZ-2025-009', 'ewz', 'Allgemeinstrom Q2 2025', (SELECT id FROM categories WHERE name_de = 'Allgemeinstrom'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 171.20, true, '2025-06-30', '2025-07-30'),
('c0000001-2025-4000-8000-000000000029', '11111111-1111-1111-1111-111111111111', 'MZ-2025-010', 'Heizöl Brunner AG', 'Heizöl EL, 6''400 Liter', (SELECT id FROM categories WHERE name_de = 'Heizung'), (SELECT id FROM distribution_keys WHERE name = 'Heating (Area 70% / Unit 30%)'), 6565.00, true, '2025-09-22', '2025-10-22'),
('c0000001-2025-4000-8000-000000000030', '11111111-1111-1111-1111-111111111111', 'MZ-2025-011', 'Hauswartung Meier GmbH', 'Hauswartung Q3 2025', (SELECT id FROM categories WHERE name_de = 'Hauswart'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 920.00, true, '2025-09-30', '2025-10-30'),
('c0000001-2025-4000-8000-000000000031', '11111111-1111-1111-1111-111111111111', 'MZ-2025-012', 'Wasserversorgung Zürich', 'Wasser und Abwasser Q3 2025', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 1010.00, true, '2025-09-30', '2025-10-30'),
('c0000001-2025-4000-8000-000000000032', '11111111-1111-1111-1111-111111111111', 'MZ-2025-013', 'ewz', 'Allgemeinstrom Q3 2025', (SELECT id FROM categories WHERE name_de = 'Allgemeinstrom'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 162.80, true, '2025-09-30', '2025-10-30'),
('c0000001-2025-4000-8000-000000000033', '11111111-1111-1111-1111-111111111111', 'MZ-2025-014', 'Gartenbau Huber', 'Gartenpflege Herbst 2025', (SELECT id FROM categories WHERE name_de = 'Gartenpflege'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 395.00, true, '2025-10-27', '2025-11-26'),
('c0000001-2025-4000-8000-000000000034', '11111111-1111-1111-1111-111111111111', 'MZ-2025-015', 'Kaminfeger Wyss', 'Kaminfegerarbeiten Heizanlage 2025', (SELECT id FROM categories WHERE name_de = 'Kaminfeger'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 335.00, true, '2025-11-10', '2025-12-10'),
('c0000001-2025-4000-8000-000000000035', '11111111-1111-1111-1111-111111111111', 'MZ-2025-016', 'ERZ Entsorgung + Recycling Zürich', 'Kehrichtgrundgebühr H2 2025', (SELECT id FROM categories WHERE name_de = 'Kehricht'), (SELECT id FROM distribution_keys WHERE name = 'Per Unit'), 495.00, true, '2025-12-31', '2026-01-30'),
('c0000001-2025-4000-8000-000000000036', '11111111-1111-1111-1111-111111111111', 'MZ-2025-017', 'Hauswartung Meier GmbH', 'Hauswartung Q4 2025', (SELECT id FROM categories WHERE name_de = 'Hauswart'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 920.00, true, '2025-12-31', '2026-01-30'),
('c0000001-2025-4000-8000-000000000037', '11111111-1111-1111-1111-111111111111', 'MZ-2025-018', 'Wasserversorgung Zürich', 'Wasser und Abwasser Q4 2025', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 940.00, true, '2025-12-31', '2026-01-30'),
('c0000001-2025-4000-8000-000000000038', '11111111-1111-1111-1111-111111111111', 'MZ-2025-019', 'ewz', 'Allgemeinstrom Q4 2025', (SELECT id FROM categories WHERE name_de = 'Allgemeinstrom'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 230.10, true, '2025-12-31', '2026-01-30') ON CONFLICT (id) DO NOTHING;

-- Seepark Residenz: 2024 und 2025
INSERT INTO invoices (id, building_id, invoice_number, billing_entity_name, description, category_id, distribution_key_id, amount, is_valid_utility_cost, invoice_date, due_date) VALUES
('c0000002-2024-4000-8000-000000000001', '22222222-2222-2222-2222-222222222222', 'SR-2024-001', 'Kabelnetz Luzern AG', 'Kabelanschluss 2024 (4 Wohnungen)', (SELECT id FROM categories WHERE name_de = 'TV/Kabelanschluss'), (SELECT id FROM distribution_keys WHERE name = 'Per Unit'), 912.00, true, '2024-01-31', '2024-03-01'),
('c0000002-2024-4000-8000-000000000002', '22222222-2222-2222-2222-222222222222', 'SR-2024-002', 'Facility Service AG', 'Hauswartung Q1 2024', (SELECT id FROM categories WHERE name_de = 'Hauswart'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 750.00, true, '2024-03-31', '2024-04-30'),
('c0000002-2024-4000-8000-000000000003', '22222222-2222-2222-2222-222222222222', 'SR-2024-003', 'ewl Energie Wasser Luzern', 'Fernwärme Q1 2024', (SELECT id FROM categories WHERE name_de = 'Heizung'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 1480.00, true, '2024-03-31', '2024-04-30'),
('c0000002-2024-4000-8000-000000000004', '22222222-2222-2222-2222-222222222222', 'SR-2024-004', 'ewl Energie Wasser Luzern', 'Wasser und Abwasser Q1 2024', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 480.00, true, '2024-03-31', '2024-04-30'),
('c0000002-2024-4000-8000-000000000005', '22222222-2222-2222-2222-222222222222', 'SR-2024-005', 'Facility Service AG', 'Hauswartung Q2 2024', (SELECT id FROM categories WHERE name_de = 'Hauswart'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 750.00, true, '2024-06-30', '2024-07-30'),
('c0000002-2024-4000-8000-000000000006', '22222222-2222-2222-2222-222222222222', 'SR-2024-006', 'ewl Energie Wasser Luzern', 'Allgemeinstrom H1 2024', (SELECT id FROM categories WHERE name_de = 'Allgemeinstrom'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 240.50, true, '2024-06-30', '2024-07-30'),
('c0000002-2024-4000-8000-000000000007', '22222222-2222-2222-2222-222222222222', 'SR-2024-007', 'ewl Energie Wasser Luzern', 'Fernwärme Q2 2024', (SELECT id FROM categories WHERE name_de = 'Heizung'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 820.00, true, '2024-06-30', '2024-07-30'),
('c0000002-2024-4000-8000-000000000008', '22222222-2222-2222-2222-222222222222', 'SR-2024-008', 'ewl Energie Wasser Luzern', 'Wasser und Abwasser Q2 2024', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 510.00, true, '2024-06-30', '2024-07-30'),
('c0000002-2024-4000-8000-000000000009', '22222222-2222-2222-2222-222222222222', 'SR-2024-009', 'Facility Service AG', 'Hauswartung Q3 2024', (SELECT id FROM categories WHERE name_de = 'Hauswart'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 750.00, true, '2024-09-30', '2024-10-30'),
('c0000002-2024-4000-8000-000000000010', '22222222-2222-2222-2222-222222222222', 'SR-2024-010', 'ewl Energie Wasser Luzern', 'Fernwärme Q3 2024', (SELECT id FROM categories WHERE name_de = 'Heizung'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 410.00, true, '2024-09-30', '2024-10-30'),
('c0000002-2024-4000-8000-000000000011', '22222222-2222-2222-2222-222222222222', 'SR-2024-011', 'ewl Energie Wasser Luzern', 'Wasser und Abwasser Q3 2024', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 530.00, true, '2024-09-30', '2024-10-30'),
('c0000002-2024-4000-8000-000000000012', '22222222-2222-2222-2222-222222222222', 'SR-2024-012', 'Facility Service AG', 'Hauswartung Q4 2024', (SELECT id FROM categories WHERE name_de = 'Hauswart'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 750.00, true, '2024-12-31', '2025-01-30'),
('c0000002-2024-4000-8000-000000000013', '22222222-2222-2222-2222-222222222222', 'SR-2024-013', 'ewl Energie Wasser Luzern', 'Allgemeinstrom H2 2024', (SELECT id FROM categories WHERE name_de = 'Allgemeinstrom'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 255.80, true, '2024-12-31', '2025-01-30'),
('c0000002-2024-4000-8000-000000000014', '22222222-2222-2222-2222-222222222222', 'SR-2024-014', 'ewl Energie Wasser Luzern', 'Fernwärme Q4 2024', (SELECT id FROM categories WHERE name_de = 'Heizung'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 1350.00, true, '2024-12-31', '2025-01-30'),
('c0000002-2024-4000-8000-000000000015', '22222222-2222-2222-2222-222222222222', 'SR-2024-015', 'ewl Energie Wasser Luzern', 'Wasser und Abwasser Q4 2024', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 495.00, true, '2024-12-31', '2025-01-30'),
('c0000002-2025-4000-8000-000000000016', '22222222-2222-2222-2222-222222222222', 'SR-2025-001', 'Kabelnetz Luzern AG', 'Kabelanschluss 2025 (4 Wohnungen)', (SELECT id FROM categories WHERE name_de = 'TV/Kabelanschluss'), (SELECT id FROM distribution_keys WHERE name = 'Per Unit'), 912.00, true, '2025-01-31', '2025-03-02'),
('c0000002-2025-4000-8000-000000000017', '22222222-2222-2222-2222-222222222222', 'SR-2025-002', 'Facility Service AG', 'Hauswartung Q1 2025', (SELECT id FROM categories WHERE name_de = 'Hauswart'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 765.00, true, '2025-03-31', '2025-04-30'),
('c0000002-2025-4000-8000-000000000018', '22222222-2222-2222-2222-222222222222', 'SR-2025-003', 'ewl Energie Wasser Luzern', 'Fernwärme Q1 2025', (SELECT id FROM categories WHERE name_de = 'Heizung'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 1520.00, true, '2025-03-31', '2025-04-30'),
('c0000002-2025-4000-8000-000000000019', '22222222-2222-2222-2222-222222222222', 'SR-2025-004', 'ewl Energie Wasser Luzern', 'Wasser und Abwasser Q1 2025', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 490.00, true, '2025-03-31', '2025-04-30'),
('c0000002-2025-4000-8000-000000000020', '22222222-2222-2222-2222-222222222222', 'SR-2025-005', 'Facility Service AG', 'Hauswartung Q2 2025', (SELECT id FROM categories WHERE name_de = 'Hauswart'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 765.00, true, '2025-06-30', '2025-07-30'),
('c0000002-2025-4000-8000-000000000021', '22222222-2222-2222-2222-222222222222', 'SR-2025-006', 'ewl Energie Wasser Luzern', 'Allgemeinstrom H1 2025', (SELECT id FROM categories WHERE name_de = 'Allgemeinstrom'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 236.90, true, '2025-06-30', '2025-07-30'),
('c0000002-2025-4000-8000-000000000022', '22222222-2222-2222-2222-222222222222', 'SR-2025-007', 'ewl Energie Wasser Luzern', 'Fernwärme Q2 2025', (SELECT id FROM categories WHERE name_de = 'Heizung'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 790.00, true, '2025-06-30', '2025-07-30'),
('c0000002-2025-4000-8000-000000000023', '22222222-2222-2222-2222-222222222222', 'SR-2025-008', 'ewl Energie Wasser Luzern', 'Wasser und Abwasser Q2 2025', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 520.00, true, '2025-06-30', '2025-07-30'),
('c0000002-2025-4000-8000-000000000024', '22222222-2222-2222-2222-222222222222', 'SR-2025-009', 'Facility Service AG', 'Hauswartung Q3 2025', (SELECT id FROM categories WHERE name_de = 'Hauswart'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 765.00, true, '2025-09-30', '2025-10-30'),
('c0000002-2025-4000-8000-000000000025', '22222222-2222-2222-2222-222222222222', 'SR-2025-010', 'ewl Energie Wasser Luzern', 'Fernwärme Q3 2025', (SELECT id FROM categories WHERE name_de = 'Heizung'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 395.00, true, '2025-09-30', '2025-10-30'),
('c0000002-2025-4000-8000-000000000026', '22222222-2222-2222-2222-222222222222', 'SR-2025-011', 'ewl Energie Wasser Luzern', 'Wasser und Abwasser Q3 2025', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 545.00, true, '2025-09-30', '2025-10-30'),
('c0000002-2025-4000-8000-000000000027', '22222222-2222-2222-2222-222222222222', 'SR-2025-012', 'Facility Service AG', 'Hauswartung Q4 2025', (SELECT id FROM categories WHERE name_de = 'Hauswart'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 765.00, true, '2025-12-31', '2026-01-30'),
('c0000002-2025-4000-8000-000000000028', '22222222-2222-2222-2222-222222222222', 'SR-2025-013', 'ewl Energie Wasser Luzern', 'Allgemeinstrom H2 2025', (SELECT id FROM categories WHERE name_de = 'Allgemeinstrom'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 262.40, true, '2025-12-31', '2026-01-30'),
('c0000002-2025-4000-8000-000000000029', '22222222-2222-2222-2222-222222222222', 'SR-2025-014', 'ewl Energie Wasser Luzern', 'Fernwärme Q4 2025', (SELECT id FROM categories WHERE name_de = 'Heizung'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 1410.00, true, '2025-12-31', '2026-01-30'),
('c0000002-2025-4000-8000-000000000030', '22222222-2222-2222-2222-222222222222', 'SR-2025-015', 'ewl Energie Wasser Luzern', 'Wasser und Abwasser Q4 2025', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 505.00, true, '2025-12-31', '2026-01-30') ON CONFLICT (id) DO NOTHING;

-- Alpenblick: 2024 und 2025
INSERT INTO invoices (id, building_id, invoice_number, billing_entity_name, description, category_id, distribution_key_id, amount, is_valid_utility_cost, invoice_date, due_date) VALUES
('c0000003-2024-4000-8000-000000000001', '33333333-3333-3333-3333-333333333333', 'AB-2024-001', 'Winterdienst Oberland', 'Schneeräumung Januar bis März 2024', (SELECT id FROM categories WHERE name_de = 'Schneeräumung'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 860.00, true, '2024-03-31', '2024-04-30'),
('c0000003-2024-4000-8000-000000000002', '33333333-3333-3333-3333-333333333333', 'AB-2024-002', 'BKW Energie AG', 'Allgemeinstrom H1 2024', (SELECT id FROM categories WHERE name_de = 'Allgemeinstrom'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 178.40, true, '2024-06-30', '2024-07-30'),
('c0000003-2024-4000-8000-000000000003', '33333333-3333-3333-3333-333333333333', 'AB-2024-003', 'Gemeinde Interlaken', 'Wasser und Abwasser H1 2024', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 460.00, true, '2024-06-30', '2024-07-30'),
('c0000003-2024-4000-8000-000000000004', '33333333-3333-3333-3333-333333333333', 'AB-2024-004', 'Heizöl Oberland AG', 'Heizöl EL, 5''000 Liter', (SELECT id FROM categories WHERE name_de = 'Heizung'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 5120.00, true, '2024-08-20', '2024-09-19'),
('c0000003-2024-4000-8000-000000000005', '33333333-3333-3333-3333-333333333333', 'AB-2024-005', 'Kaminfeger Zurbuchen', 'Kaminfegerarbeiten Heizanlage 2024', (SELECT id FROM categories WHERE name_de = 'Kaminfeger'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 290.00, true, '2024-10-15', '2024-11-14'),
('c0000003-2024-4000-8000-000000000006', '33333333-3333-3333-3333-333333333333', 'AB-2024-006', 'BKW Energie AG', 'Allgemeinstrom H2 2024', (SELECT id FROM categories WHERE name_de = 'Allgemeinstrom'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 191.20, true, '2024-12-31', '2025-01-30'),
('c0000003-2024-4000-8000-000000000007', '33333333-3333-3333-3333-333333333333', 'AB-2024-007', 'Gemeinde Interlaken', 'Wasser und Abwasser H2 2024', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 475.00, true, '2024-12-31', '2025-01-30'),
('c0000003-2024-4000-8000-000000000008', '33333333-3333-3333-3333-333333333333', 'AB-2024-008', 'Winterdienst Oberland', 'Schneeräumung Dezember 2024', (SELECT id FROM categories WHERE name_de = 'Schneeräumung'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 410.00, true, '2024-12-31', '2025-01-30'),
('c0000003-2025-4000-8000-000000000009', '33333333-3333-3333-3333-333333333333', 'AB-2025-001', 'Winterdienst Oberland', 'Schneeräumung Januar bis März 2025', (SELECT id FROM categories WHERE name_de = 'Schneeräumung'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 920.00, true, '2025-03-31', '2025-04-30'),
('c0000003-2025-4000-8000-000000000010', '33333333-3333-3333-3333-333333333333', 'AB-2025-002', 'BKW Energie AG', 'Allgemeinstrom H1 2025', (SELECT id FROM categories WHERE name_de = 'Allgemeinstrom'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 182.60, true, '2025-06-30', '2025-07-30'),
('c0000003-2025-4000-8000-000000000011', '33333333-3333-3333-3333-333333333333', 'AB-2025-003', 'Gemeinde Interlaken', 'Wasser und Abwasser H1 2025', (SELECT id FROM categories WHERE name_de = 'Kaltwasser'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 470.00, true, '2025-06-30', '2025-07-30'),
('c0000003-2025-4000-8000-000000000012', '33333333-3333-3333-3333-333333333333', 'AB-2025-004', 'Heizöl Oberland AG', 'Heizöl EL, 4''900 Liter', (SELECT id FROM categories WHERE name_de = 'Heizung'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 4880.00, true, '2025-08-25', '2025-09-24'),
('c0000003-2025-4000-8000-000000000013', '33333333-3333-3333-3333-333333333333', 'AB-2025-005', 'BKW Energie AG', 'Allgemeinstrom H2 2025', (SELECT id FROM categories WHERE name_de = 'Allgemeinstrom'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 196.30, true, '2025-12-31', '2026-01-30'),
('c0000003-2025-4000-8000-000000000014', '33333333-3333-3333-3333-333333333333', 'AB-2025-006', 'Winterdienst Oberland', 'Schneeräumung Dezember 2025', (SELECT id FROM categories WHERE name_de = 'Schneeräumung'), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)'), 380.00, true, '2025-12-31', '2026-01-30') ON CONFLICT (id) DO NOTHING;

-- Not allocable: a repair is the landlord's (Art. 257b OR)
INSERT INTO invoices (id, building_id, invoice_number, billing_entity_name, description, category_id, distribution_key_id, amount, is_valid_utility_cost, invoice_date, due_date) VALUES
('c0000001-0001-0001-0001-000000000099', '11111111-1111-1111-1111-111111111111', 'SK-2024-118', 'Sanitär Keller AG', 'Reparatur Boiler Wohnung 2.01', (SELECT id FROM categories WHERE name_de = 'Reparaturen' LIMIT 1), NULL, 2350.00, false, '2024-02-20', '2024-03-21') ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Company for the statements and their QR-bill (QR-IBAN from the SIX examples)
-- The statements themselves are generated by the app (backend/src/db/demo-data.ts)
-- ============================================================================
INSERT INTO configuration (key, value) VALUES
('company_name', 'Muster Immobilien AG'),
('company_address', 'Bahnhofstrasse 1'),
('company_postal_code', '8001'),
('company_city', 'Zürich'),
('iban', 'CH4431999123000889012') ON CONFLICT (key) DO NOTHING;
