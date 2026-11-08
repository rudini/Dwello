-- ============================================================================
-- Fläche und Zimmeranzahl ab einem Tag (#1301): an apartment's earlier values, each with the last day it had them,
-- oldest first. `area` and `rooms` hold the values from the day after the last of them; empty: always the same.
-- ============================================================================

ALTER TABLE apartments ADD COLUMN earlier_sizes JSONB NOT NULL DEFAULT '[]';
