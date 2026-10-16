-- ============================================================================
-- Building without a tank (#72): the landlord records that the building has no tank or that its tank is
-- decommissioned. The statement wizard then stops asking about a Tankbestand, and a building with earlier readings
-- needs none for a period no reading covers; a period with an opening or closing reading still needs both.
-- ============================================================================

ALTER TABLE buildings ADD COLUMN no_tank BOOLEAN NOT NULL DEFAULT false;
