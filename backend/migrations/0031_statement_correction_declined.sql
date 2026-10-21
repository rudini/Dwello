-- ============================================================================
-- #454 (product owner 2026-10-20, Fachreview 454-1 E-6, 454-2 M-3): «Nicht berichtigen» of a sent, paid or settled
-- statement whose recalculation would raise the Saldo: the day and the result of that recalculation, so the task
-- «Abrechnung berichtigen» returns only when a later change gives another result.
-- ============================================================================

ALTER TABLE utility_statements ADD COLUMN correction_declined JSONB;
