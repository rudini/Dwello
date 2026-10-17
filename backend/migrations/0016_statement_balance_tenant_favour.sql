-- ============================================================================
-- The Saldo is rounded to 5 Rappen only in the tenant's favour (#79): a Nachzahlung down, a Rückerstattung up.
-- Drafts have not reached the tenant: their Saldo follows the new rule, and a PDF made with the old one is made again.
-- Sent and paid statements keep the Saldo the tenant received.
-- ============================================================================

UPDATE utility_statements
SET balance = floor((total_costs - total_advance_payments) * 20) / 20, pdf_blob = NULL, pdf_generated_at = NULL, updated_at = NOW()
WHERE status = 'draft' AND balance <> floor((total_costs - total_advance_payments) * 20) / 20;
