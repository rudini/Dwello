-- ============================================================================
-- #459 (#331): «Als geprüft markieren» of a former tenant's uploaded documents: the Swiss day the landlord checked
-- them, stored on the last contract; cleared when its end changes, so the overview task returns for the new end.
-- ============================================================================

ALTER TABLE rental_contracts ADD COLUMN documents_checked_on DATE;
