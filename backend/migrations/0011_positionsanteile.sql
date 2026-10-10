-- Each position of a statement keeps how it was shared, so the PDF can explain it: the apartment's share of the
-- building's costs (by the distribution key) and the share of the period (days rented, or the heating profile).
-- Statements created before keep NULL; their PDF leaves these columns empty.
ALTER TABLE utility_statement_line_items ADD COLUMN apartment_share DECIMAL(12, 2);
ALTER TABLE utility_statement_line_items ADD COLUMN period_share DECIMAL(8, 4);
