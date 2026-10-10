-- The period an invoice bills (Leistungszeitraum): a statement takes the share of its days that falls into the
-- Abrechnungsperiode (Art. 257b OR, actual costs of the period). Without one, the Rechnungsdatum decides as before.
ALTER TABLE invoices
    ADD COLUMN service_period_start DATE,
    ADD COLUMN service_period_end DATE,
    ADD CONSTRAINT invoices_service_period_check CHECK (
        (service_period_start IS NULL) = (service_period_end IS NULL)
        AND (service_period_end IS NULL OR service_period_end >= service_period_start)
    );
