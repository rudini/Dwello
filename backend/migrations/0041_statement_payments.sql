-- ============================================================================
-- #959 (A): the payments recorded on a statement, a part payment too: { date, amount } each, the amount with the sign
-- of the Saldo; paid_amount is their sum. A statement paid before keeps an empty list and its paid_amount.
-- ============================================================================

ALTER TABLE utility_statements ADD COLUMN payments JSONB NOT NULL DEFAULT '[]';
