-- The Beleg of an invoice: its uploaded file (scan, photo or PDF), at most one per invoice, deleted with it (#217).
-- Stored like a tenant's uploaded documents, Base64 encoded; the unused column invoices.invoice_pdf goes.
CREATE TABLE invoice_documents (
    invoice_id UUID PRIMARY KEY REFERENCES invoices(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(50) NOT NULL,           -- application/pdf | image/jpeg | image/png
    content TEXT NOT NULL,                    -- Base64 encoded file
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE invoices DROP COLUMN invoice_pdf;
