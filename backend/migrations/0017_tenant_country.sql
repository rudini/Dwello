-- ============================================================================
-- The country of the tenant's Korrespondenzadresse (#102): ISO 3166 code, Schweiz unless the landlord chooses another;
-- the QR-bill names it for the debtor and the PDF address block for mail abroad. The house number stays in the street.
-- ============================================================================

ALTER TABLE tenants ADD COLUMN country VARCHAR(2) NOT NULL DEFAULT 'CH';
