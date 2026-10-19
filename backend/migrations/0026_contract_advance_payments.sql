-- ============================================================================
-- Akonto with a validity date (#464): a Mietvertrag has one Akonto amount per «Gültig ab» (the first of a month; the
-- first amount applies from the Vertragsbeginn). A statement sums each amount over the months it applied and keeps
-- its lines, so its PDF prints them as they were calculated. Existing contracts keep today's amount from their
-- Vertragsbeginn; statements already created keep their stored totals and print only the total.
-- ============================================================================

CREATE TABLE contract_advance_payments (
    contract_id UUID NOT NULL REFERENCES rental_contracts(id) ON DELETE CASCADE,
    valid_from DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (contract_id, valid_from)
);

INSERT INTO contract_advance_payments (contract_id, valid_from, amount)
SELECT id, start_date, monthly_advance_payment FROM rental_contracts;

ALTER TABLE utility_statements ADD COLUMN advance_lines JSONB;
