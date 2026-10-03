-- ============================================================================
-- When the PDF of a statement was generated
-- The statement list and detail offer the PDF for download once this is set.
-- Statements whose PDF exists already take the time of their last change.
-- ============================================================================

ALTER TABLE utility_statements ADD COLUMN IF NOT EXISTS pdf_generated_at TIMESTAMP;

UPDATE utility_statements SET pdf_generated_at = updated_at WHERE pdf_blob IS NOT NULL AND pdf_generated_at IS NULL;
