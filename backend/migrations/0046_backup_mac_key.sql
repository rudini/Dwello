-- ============================================================================
-- #1373: the key that signs each Sicherung, derived from the Wiederherstellungscode and kept from its confirmation on;
-- salt and public key stand in clear in every Sicherung, so without it anyone could make one the code opens. A code
-- confirmed before has none: its Sicherungen stay unsigned until the landlord sets a new one.
-- ============================================================================

ALTER TABLE backup_codes ADD COLUMN mac_key TEXT;
