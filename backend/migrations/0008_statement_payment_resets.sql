-- ============================================================================
-- Payments taken back (#92): each reset of a paid statement with its day (Swiss), the paid date and the amount it
-- cleared, so the Verlauf keeps a payment recorded on the wrong statement or with a wrong date. Empty for a statement
-- whose payment was never reset. payment_recorded_at: when the payment was recorded, so a reset discards only a PDF
-- made after it (that PDF says «Bezahlt am …»); empty for a payment recorded before this migration.
-- ============================================================================

ALTER TABLE utility_statements
	ADD COLUMN payment_resets JSONB NOT NULL DEFAULT '[]'::jsonb,
	ADD COLUMN payment_recorded_at TIMESTAMP;
