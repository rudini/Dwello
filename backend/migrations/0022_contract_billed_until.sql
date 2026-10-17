-- ============================================================================
-- «Abgerechnet bis» (#133): up to this day the Nebenkosten of the contract are billed outside Dwello; Dwello bills
-- Mietstage and Akonto only from the day after. Optional.
-- ============================================================================

ALTER TABLE rental_contracts ADD COLUMN billed_until DATE;
