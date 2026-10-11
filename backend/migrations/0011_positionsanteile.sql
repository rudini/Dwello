-- Each position of a statement keeps how it was shared, so the PDF can explain it: the apartment's share of the
-- building's costs (by the distribution key) and the share of the period (days rented, or the heating profile).
-- Statements created before keep NULL; their PDF leaves these columns empty.
ALTER TABLE utility_statement_line_items ADD COLUMN apartment_share DECIMAL(12, 2);
ALTER TABLE utility_statement_line_items ADD COLUMN period_share DECIMAL(8, 4);

-- The Tankbestand readings a statement was created with, so its PDF shows how the heating costs came about even if a
-- reading changes later: {"categoryId", "openingDate", "opening", "closingDate", "closing"}; NULL without a tank
ALTER TABLE utility_statements ADD COLUMN fuel_stock JSONB;

-- The apartment's and the building's area, apartments and rooms the statement was created with, so its PDF prints the
-- key's fraction that gave the amounts even if an apartment changes later: {"area": [own, total], "units": …, "rooms": …}
ALTER TABLE utility_statements ADD COLUMN key_values JSONB;
