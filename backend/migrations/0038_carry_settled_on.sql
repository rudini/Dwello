-- ============================================================================
-- #506 (Fachreview 506-1): the day the landlord settled an open Übertrag by hand («Als ausgeglichen markieren»): no
-- statement counts it any more, a berichtigte Abrechnung counts it as paid. NULL: not settled by hand.
-- ============================================================================

ALTER TABLE utility_statements ADD COLUMN carry_settled_on DATE;
