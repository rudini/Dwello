-- Heating oil in the tank (Tankbestand), valued in CHF at the end of the reading day. Heating costs are the consumption:
-- stock at the start + purchases − stock at the end; a reading on 31.12.2024 closes 2024 and opens 2025.
CREATE TABLE fuel_stocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    reading_date DATE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (building_id, reading_date)
);
