-- ============================================================================
-- Building without a tank (#72): the landlord records that the building has no tank or that its tank is
-- decommissioned. The statement wizard then stops asking about a Tankbestand, and a building with earlier readings
-- needs none for a period without fuel to bill (no reading after the day before it, opening stock 0 or none); the year
-- of decommissioning still needs its closing reading.
-- ============================================================================

ALTER TABLE buildings ADD COLUMN no_tank BOOLEAN NOT NULL DEFAULT false;
