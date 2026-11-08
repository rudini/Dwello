-- ============================================================================
-- Aufgehobene Wohnung (#1284): the day from which an apartment no longer exists (renovation). Until the day before it
-- counts in the Verteilschlüssel by days; statements from that day calculate without it. A position whose billed
-- days the day splits keeps its calculation per period, for the PDF.
-- ============================================================================

ALTER TABLE apartments ADD COLUMN discontinued_from DATE;
ALTER TABLE utility_statement_line_items ADD COLUMN segments JSONB;
