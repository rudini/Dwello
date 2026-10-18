-- ============================================================================
-- «Nebenkostenpauschale» (#429): a fixed monthly amount the tenant pays for Nebenkosten agreed in the Mietvertrag.
-- It counts in «Monatlich total» and is never billed in a Nebenkostenabrechnung. 0 when none is agreed.
-- ============================================================================

ALTER TABLE rental_contracts ADD COLUMN flat_rate_utility_charge DECIMAL(10,2) NOT NULL DEFAULT 0;
