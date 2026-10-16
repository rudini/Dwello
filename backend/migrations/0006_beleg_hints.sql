-- ============================================================================
-- What the KI saw on an uploaded invoice file, kept with its Beleg (#233): amounts already paid that the invoice
-- deducts, and costs that are not allocable besides the others. The invoice page shows them until the Beleg is
-- replaced; a file the KI did not read has none.
-- ============================================================================

ALTER TABLE invoice_documents ADD COLUMN deducted_amount DECIMAL(12, 2);
ALTER TABLE invoice_documents ADD COLUMN non_allocable_items BOOLEAN NOT NULL DEFAULT FALSE;
