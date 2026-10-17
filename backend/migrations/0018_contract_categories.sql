-- ============================================================================
-- #91: each Mietvertrag holds the Nebenkosten it agrees (Art. 257a Abs. 2 OR): a row per category, agreed or answered
-- «nicht vereinbart»; without a row the category is not answered yet and not billed.
-- Existing contracts (domain review W10c, V-4): one with statements agrees what they billed and what it could have
-- been billed until its last statement (umlagefähige invoices of the building over its tenancy); one without
-- statements agrees every umlagefähige category, as a new contract. Stored statements stay as they are.
-- ============================================================================

CREATE TABLE contract_categories (
	contract_id uuid NOT NULL REFERENCES rental_contracts(id) ON DELETE CASCADE,
	category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
	agreed boolean NOT NULL,
	PRIMARY KEY (contract_id, category_id)
);

INSERT INTO contract_categories (contract_id, category_id, agreed)
SELECT DISTINCT s.contract_id, li.category_id, true
FROM utility_statements s
JOIN utility_statement_line_items li ON li.statement_id = s.id
JOIN categories cat ON cat.id = li.category_id AND cat.is_allowed_utility_cost;

INSERT INTO contract_categories (contract_id, category_id, agreed)
SELECT DISTINCT c.id, i.category_id, true
FROM rental_contracts c
JOIN apartments a ON a.id = c.apartment_id
JOIN (SELECT contract_id, max(period_end) AS last_end FROM utility_statements GROUP BY contract_id) s ON s.contract_id = c.id
JOIN invoices i ON i.building_id = a.building_id
JOIN categories cat ON cat.id = i.category_id AND cat.is_allowed_utility_cost
WHERE i.is_valid_utility_cost
	AND coalesce(i.service_period_start, i.invoice_date) <= least(s.last_end, coalesce(c.end_date, s.last_end))
	AND coalesce(i.service_period_end, i.invoice_date) >= c.start_date
ON CONFLICT DO NOTHING;

INSERT INTO contract_categories (contract_id, category_id, agreed)
SELECT c.id, cat.id, true
FROM rental_contracts c
CROSS JOIN categories cat
WHERE cat.is_allowed_utility_cost AND NOT EXISTS (SELECT 1 FROM utility_statements s WHERE s.contract_id = c.id);

-- the categories the contract agreed when the statement was created; null: created before #91, billed every category
ALTER TABLE utility_statements ADD COLUMN agreed_category_ids jsonb;
