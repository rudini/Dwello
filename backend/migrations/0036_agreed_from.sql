-- ============================================================================
-- #368 (#407 point 3): «Vereinbart ab», the day from which a Mietvertrag agrees a category (Art. 269d Abs. 3 OR);
-- empty: from the start of the contract. A statement keeps the days it was created with, as it keeps the categories.
-- ============================================================================

ALTER TABLE contract_categories ADD COLUMN agreed_from DATE;
ALTER TABLE utility_statements ADD COLUMN agreed_from JSONB;
