-- ============================================================================
-- Demo data for trying Dwello and showing it: bun run db:demo (never in production, not a migration)
-- Fixed ids, so loading it again adds nothing.
-- ============================================================================

-- ============================================================================
-- Buildings
-- ============================================================================
INSERT INTO buildings (id, name, address, postal_code, city, canton, country, latitude, longitude) VALUES
('11111111-1111-1111-1111-111111111111', 'Musterhaus Zentrum', 'Bahnhofstrasse 42', '8001', 'Zürich', 'ZH', 'CH', 47.3769, 8.5417),
('22222222-2222-2222-2222-222222222222', 'Seepark Residenz', 'Seeweg 15', '6003', 'Luzern', 'LU', 'CH', 47.0502, 8.3093),
('33333333-3333-3333-3333-333333333333', 'Alpenblick', 'Bergstrasse 8', '3800', 'Interlaken', 'BE', 'CH', 46.6863, 7.8632) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Apartments
-- ============================================================================
-- Occupied or vacant follows from the rental contracts; the stored status is vacant
-- Building 1: Musterhaus Zentrum (6 units)
INSERT INTO apartments (id, building_id, number, floor, area, rooms, status) VALUES
('aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '1.01', 1, 75.5, 3.5, 'vacant'),
('aaaa1111-1111-1111-1111-222222222222', '11111111-1111-1111-1111-111111111111', '1.02', 1, 92.0, 4.5, 'vacant'),
('aaaa1111-1111-1111-1111-333333333333', '11111111-1111-1111-1111-111111111111', '2.01', 2, 85.0, 4.0, 'vacant'),
('aaaa1111-1111-1111-1111-444444444444', '11111111-1111-1111-1111-111111111111', '2.02', 2, 65.0, 2.5, 'vacant'),
('aaaa1111-1111-1111-1111-555555555555', '11111111-1111-1111-1111-111111111111', '3.01', 3, 120.0, 5.5, 'vacant'),
('aaaa1111-1111-1111-1111-666666666666', '11111111-1111-1111-1111-111111111111', '3.02', 3, 55.0, 2.0, 'vacant') ON CONFLICT (id) DO NOTHING;

-- Building 2: Seepark Residenz (4 units)
INSERT INTO apartments (id, building_id, number, floor, area, rooms, status) VALUES
('aaaa2222-2222-2222-2222-111111111111', '22222222-2222-2222-2222-222222222222', 'A1', 0, 68.0, 3.0, 'vacant'),
('aaaa2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'A2', 0, 82.0, 3.5, 'vacant'),
('aaaa2222-2222-2222-2222-333333333333', '22222222-2222-2222-2222-222222222222', 'B1', 1, 75.0, 3.5, 'vacant'),
('aaaa2222-2222-2222-2222-444444444444', '22222222-2222-2222-2222-222222222222', 'B2', 1, 95.0, 4.5, 'vacant') ON CONFLICT (id) DO NOTHING;

-- Building 3: Alpenblick (3 units)
INSERT INTO apartments (id, building_id, number, floor, area, rooms, status) VALUES
('aaaa3333-3333-3333-3333-111111111111', '33333333-3333-3333-3333-333333333333', 'EG', 0, 72.0, 3.0, 'vacant'),
('aaaa3333-3333-3333-3333-222222222222', '33333333-3333-3333-3333-333333333333', 'OG1', 1, 98.0, 4.0, 'vacant'),
('aaaa3333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'OG2', 2, 85.0, 3.5, 'vacant') ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Tenants
-- ============================================================================
INSERT INTO tenants (id, first_name, last_name, email, phone, language, address, postal_code, city, correspondence_channel) VALUES
('a0000001-0001-0001-0001-000000000001', 'Hans', 'Müller', 'hans.mueller@example.ch', '+41 79 123 45 67', 'de', NULL, NULL, NULL, 'email'),
('a0000001-0001-0001-0001-000000000002', 'Anna', 'Schmidt', 'anna.schmidt@example.ch', '+41 78 234 56 78', 'de', NULL, NULL, NULL, 'email'),
('a0000001-0001-0001-0001-000000000003', 'Pierre', 'Dubois', 'pierre.dubois@example.ch', '+41 76 345 67 89', 'fr', NULL, NULL, NULL, 'email'),
('a0000001-0001-0001-0001-000000000004', 'Maria', 'Rossi', 'maria.rossi@example.ch', '+41 79 456 78 90', 'it', NULL, NULL, NULL, 'email'),
('a0000001-0001-0001-0001-000000000005', 'Thomas', 'Weber', 'thomas.weber@example.ch', '+41 78 567 89 01', 'de', NULL, NULL, NULL, 'email'),
('a0000001-0001-0001-0001-000000000006', 'Sarah', 'Meier', 'sarah.meier@example.ch', '+41 76 678 90 12', 'de', NULL, NULL, NULL, 'email'),
('a0000001-0001-0001-0001-000000000007', 'Marco', 'Bernasconi', 'marco.bernasconi@example.ch', '+41 79 789 01 23', 'it', NULL, NULL, NULL, 'email'),
('a0000001-0001-0001-0001-000000000008', 'Laura', 'Keller', 'laura.keller@example.ch', '+41 78 890 12 34', 'de', NULL, NULL, NULL, 'email'),
('a0000001-0001-0001-0001-000000000009', 'Kevin', 'Fischer', 'kevin.fischer@example.ch', '+41 76 901 23 45', 'de', NULL, NULL, NULL, 'email') ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Rental Contracts (Active contracts for occupied apartments)
-- ============================================================================

-- Building 1 contracts
INSERT INTO rental_contracts (id, apartment_id, tenant_id, start_date, end_date, base_rent, additional_rent, monthly_advance_payment) VALUES
('b0000001-0001-0001-0001-000000000001', 'aaaa1111-1111-1111-1111-111111111111', 'a0000001-0001-0001-0001-000000000001', '2021-03-01', NULL, 1450.00, 100.00, 200.00),
('b0000001-0001-0001-0001-000000000002', 'aaaa1111-1111-1111-1111-222222222222', 'a0000001-0001-0001-0001-000000000002', '2022-06-01', NULL, 1850.00, 120.00, 250.00),
('b0000001-0001-0001-0001-000000000003', 'aaaa1111-1111-1111-1111-333333333333', 'a0000001-0001-0001-0001-000000000003', '2023-01-01', NULL, 1650.00, 0.00, 220.00),
('b0000001-0001-0001-0001-000000000005', 'aaaa1111-1111-1111-1111-555555555555', 'a0000001-0001-0001-0001-000000000004', '2020-09-01', NULL, 2400.00, 150.00, 350.00) ON CONFLICT (id) DO NOTHING;

-- Building 2 contracts
INSERT INTO rental_contracts (id, apartment_id, tenant_id, start_date, end_date, base_rent, additional_rent, monthly_advance_payment) VALUES
('b0000002-0002-0002-0002-000000000001', 'aaaa2222-2222-2222-2222-111111111111', 'a0000001-0001-0001-0001-000000000005', '2022-04-01', NULL, 1200.00, 0.00, 150.00),
('b0000002-0002-0002-0002-000000000002', 'aaaa2222-2222-2222-2222-222222222222', 'a0000001-0001-0001-0001-000000000006', '2021-08-01', NULL, 1550.00, 80.00, 200.00),
('b0000002-0002-0002-0002-000000000004', 'aaaa2222-2222-2222-2222-444444444444', 'a0000001-0001-0001-0001-000000000007', '2023-07-01', NULL, 1750.00, 100.00, 230.00) ON CONFLICT (id) DO NOTHING;

-- Building 3 contracts
INSERT INTO rental_contracts (id, apartment_id, tenant_id, start_date, end_date, base_rent, additional_rent, monthly_advance_payment) VALUES
('b0000003-0003-0003-0003-000000000001', 'aaaa3333-3333-3333-3333-111111111111', 'a0000001-0001-0001-0001-000000000008', '2022-11-01', NULL, 1350.00, 50.00, 180.00),
('b0000003-0003-0003-0003-000000000002', 'aaaa3333-3333-3333-3333-222222222222', 'a0000001-0001-0001-0001-000000000009', '2021-05-01', NULL, 1800.00, 120.00, 250.00) ON CONFLICT (id) DO NOTHING;

-- Historical contract (ended)
INSERT INTO rental_contracts (id, apartment_id, tenant_id, start_date, end_date, base_rent, additional_rent, monthly_advance_payment, notes) VALUES
('b0000001-0001-0001-0001-000000000099', 'aaaa1111-1111-1111-1111-111111111111', 'a0000001-0001-0001-0001-000000000009', '2018-06-01', '2021-02-28', 1350.00, 100.00, 180.00, 'Previous tenant - moved out') ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Invoices for Building 1 (Musterhaus Zentrum) - Year 2024
-- ============================================================================
INSERT INTO invoices (id, building_id, invoice_number, billing_entity_name, description, category_id, distribution_key_id, amount, is_valid_utility_cost, invoice_date, due_date) VALUES
('c0000001-0001-0001-0001-000000000001', '11111111-1111-1111-1111-111111111111', 'INV-2024-001', 'Stadtwerke Zürich', 'Heizöl Lieferung Januar 2024', (SELECT id FROM categories WHERE name_de = 'Heizung' LIMIT 1), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)' LIMIT 1), 4250.00, true, '2024-01-15', '2024-02-15'),
('c0000001-0001-0001-0001-000000000002', '11111111-1111-1111-1111-111111111111', 'INV-2024-002', 'Wasserwerk Zürich', 'Wasserverbrauch Q1 2024', (SELECT id FROM categories WHERE name_de = 'Kaltwasser' LIMIT 1), (SELECT id FROM distribution_keys WHERE name = 'Per Unit' LIMIT 1), 1850.00, true, '2024-03-31', '2024-04-30'),
('c0000001-0001-0001-0001-000000000003', '11111111-1111-1111-1111-111111111111', 'INV-2024-003', 'Hauswartung Meier GmbH', 'Hauswart März 2024', (SELECT id FROM categories WHERE name_de = 'Hauswart' LIMIT 1), (SELECT id FROM distribution_keys WHERE name = 'Per Unit' LIMIT 1), 1200.00, true, '2024-03-31', '2024-04-30'),
('c0000001-0001-0001-0001-000000000004', '11111111-1111-1111-1111-111111111111', 'INV-2024-004', 'EWZ Zürich', 'Allgemeinstrom Q1 2024', (SELECT id FROM categories WHERE name_de = 'Allgemeinstrom' LIMIT 1), (SELECT id FROM distribution_keys WHERE name = 'Per Unit' LIMIT 1), 680.00, true, '2024-04-05', '2024-05-05'),
('c0000001-0001-0001-0001-000000000005', '11111111-1111-1111-1111-111111111111', 'INV-2024-005', 'Lift AG', 'Liftservice Q1 2024', (SELECT id FROM categories WHERE name_de = 'Lift' LIMIT 1), (SELECT id FROM distribution_keys WHERE name = 'Per Unit' LIMIT 1), 950.00, true, '2024-04-10', '2024-05-10'),
('c0000001-0001-0001-0001-000000000006', '11111111-1111-1111-1111-111111111111', 'INV-2024-006', 'Gartenbau Huber', 'Gartenpflege Frühjahr 2024', (SELECT id FROM categories WHERE name_de = 'Gartenpflege' LIMIT 1), (SELECT id FROM distribution_keys WHERE name = 'Per Unit' LIMIT 1), 750.00, true, '2024-05-15', '2024-06-15'),
('c0000001-0001-0001-0001-000000000007', '11111111-1111-1111-1111-111111111111', 'INV-2024-007', 'ERZ Zürich', 'Kehrichtgebühren H1 2024', (SELECT id FROM categories WHERE name_de = 'Kehricht' LIMIT 1), (SELECT id FROM distribution_keys WHERE name = 'Per Unit' LIMIT 1), 520.00, true, '2024-06-30', '2024-07-30') ON CONFLICT (id) DO NOTHING;

-- Invoices for Building 2 (Seepark Residenz) - Year 2024
INSERT INTO invoices (id, building_id, invoice_number, billing_entity_name, description, category_id, distribution_key_id, amount, is_valid_utility_cost, invoice_date, due_date) VALUES
('c0000002-0002-0002-0002-000000000001', '22222222-2222-2222-2222-222222222222', 'SPR-2024-001', 'EWL Luzern', 'Fernwärme Q1 2024', (SELECT id FROM categories WHERE name_de = 'Heizung' LIMIT 1), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)' LIMIT 1), 3200.00, true, '2024-03-31', '2024-04-30'),
('c0000002-0002-0002-0002-000000000002', '22222222-2222-2222-2222-222222222222', 'SPR-2024-002', 'Wasserversorgung Luzern', 'Wasser Q1 2024', (SELECT id FROM categories WHERE name_de = 'Kaltwasser' LIMIT 1), (SELECT id FROM distribution_keys WHERE name = 'Per Unit' LIMIT 1), 1100.00, true, '2024-04-15', '2024-05-15'),
('c0000002-0002-0002-0002-000000000003', '22222222-2222-2222-2222-222222222222', 'SPR-2024-003', 'Facility Service AG', 'Hauswartung Q1 2024', (SELECT id FROM categories WHERE name_de = 'Hauswart' LIMIT 1), (SELECT id FROM distribution_keys WHERE name = 'Per Unit' LIMIT 1), 2400.00, true, '2024-03-31', '2024-04-30') ON CONFLICT (id) DO NOTHING;

-- Invoices for Building 3 (Alpenblick) - Year 2024
INSERT INTO invoices (id, building_id, invoice_number, billing_entity_name, description, category_id, distribution_key_id, amount, is_valid_utility_cost, invoice_date, due_date) VALUES
('c0000003-0003-0003-0003-000000000001', '33333333-3333-3333-3333-333333333333', 'ALB-2024-001', 'BKW Energie', 'Heizöl Winter 2023/24', (SELECT id FROM categories WHERE name_de = 'Heizung' LIMIT 1), (SELECT id FROM distribution_keys WHERE name = 'Per Area (m²)' LIMIT 1), 5800.00, true, '2024-04-01', '2024-05-01'),
('c0000003-0003-0003-0003-000000000002', '33333333-3333-3333-3333-333333333333', 'ALB-2024-002', 'Gemeinde Interlaken', 'Wasser und Abwasser H1 2024', (SELECT id FROM categories WHERE name_de = 'Kaltwasser' LIMIT 1), (SELECT id FROM distribution_keys WHERE name = 'Per Unit' LIMIT 1), 890.00, true, '2024-06-15', '2024-07-15'),
('c0000003-0003-0003-0003-000000000003', '33333333-3333-3333-3333-333333333333', 'ALB-2024-003', 'Winterdienst Oberland', 'Schneeräumung Winter 2023/24', (SELECT id FROM categories WHERE name_de = 'Schneeräumung' LIMIT 1), (SELECT id FROM distribution_keys WHERE name = 'Per Unit' LIMIT 1), 1450.00, true, '2024-04-30', '2024-05-30') ON CONFLICT (id) DO NOTHING;

-- Non-utility cost invoice (repairs - for testing)
INSERT INTO invoices (id, building_id, invoice_number, billing_entity_name, description, category_id, distribution_key_id, amount, is_valid_utility_cost, invoice_date, due_date) VALUES
('c0000001-0001-0001-0001-000000000099', '11111111-1111-1111-1111-111111111111', 'INV-2024-REP', 'Sanitär Keller AG', 'Reparatur Boiler Wohnung 2.01', (SELECT id FROM categories WHERE name_de = 'Reparaturen' LIMIT 1), NULL, 2350.00, false, '2024-02-20', '2024-03-20') ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Sample Utility Statements (total costs include the 3 % management fee; balance = total costs - advance payments)
-- ============================================================================

-- Statement for Hans Müller (Building 1, Apt 1.01) - Year 2024
INSERT INTO utility_statements (id, tenant_id, apartment_id, contract_id, statement_number, period_start, period_end, statement_date, rental_days, total_costs, total_advance_payments, management_fee, balance, status, payment_deadline) VALUES
('d0000001-0001-0001-0001-000000000001', 'a0000001-0001-0001-0001-000000000001', 'aaaa1111-1111-1111-1111-111111111111', 'b0000001-0001-0001-0001-000000000001', 'NK-2024-001', '2024-01-01', '2024-12-31', '2025-01-15', 366, 2936.02, 2400.00, 85.52, 536.02, 'sent', '2025-02-15') ON CONFLICT (id) DO NOTHING;

-- Statement for Anna Schmidt (Building 1, Apt 1.02) - Year 2024
INSERT INTO utility_statements (id, tenant_id, apartment_id, contract_id, statement_number, period_start, period_end, statement_date, rental_days, total_costs, total_advance_payments, management_fee, balance, status, payment_deadline) VALUES
('d0000001-0001-0001-0001-000000000002', 'a0000001-0001-0001-0001-000000000002', 'aaaa1111-1111-1111-1111-222222222222', 'b0000001-0001-0001-0001-000000000002', 'NK-2024-002', '2024-01-01', '2024-12-31', '2025-01-15', 366, 3348.27, 3000.00, 97.52, 348.27, 'draft', NULL) ON CONFLICT (id) DO NOTHING;

-- Statement for Thomas Weber (Building 2, Apt A1) - Year 2024 (Paid)
INSERT INTO utility_statements (id, tenant_id, apartment_id, contract_id, statement_number, period_start, period_end, statement_date, rental_days, total_costs, total_advance_payments, management_fee, balance, status, payment_deadline, paid_date, paid_amount) VALUES
('d0000002-0002-0002-0002-000000000001', 'a0000001-0001-0001-0001-000000000005', 'aaaa2222-2222-2222-2222-111111111111', 'b0000002-0002-0002-0002-000000000001', 'NK-2024-003', '2024-01-01', '2024-12-31', '2025-01-10', 366, 1699.50, 1800.00, 49.50, -100.50, 'paid', '2025-02-10', '2025-01-25', -100.50) ON CONFLICT (id) DO NOTHING;
