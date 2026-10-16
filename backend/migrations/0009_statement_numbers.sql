-- ============================================================================
-- The last statement number given per building and year (#97): a number is never given twice, also after its draft
-- was deleted, because the PDF of a draft may already have been handed out. Keyed by the number's prefix
-- NK-{first 8 characters of the building id}-{year}-. A prefix without a row starts after the highest existing number.
-- ============================================================================

CREATE TABLE statement_numbers (
	prefix VARCHAR(50) PRIMARY KEY,
	last_number INTEGER NOT NULL
);
