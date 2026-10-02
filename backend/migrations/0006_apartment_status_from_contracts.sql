-- Migration: 0006_apartment_status_from_contracts
-- Description: "occupied" is computed from the running rental contracts on every read.
--              The stored status only keeps what the property manager sets: vacant or reserved.

UPDATE apartments SET status = 'vacant' WHERE status = 'occupied';

ALTER TABLE apartments DROP CONSTRAINT IF EXISTS apartments_status_check;
ALTER TABLE apartments ADD CONSTRAINT apartments_status_check CHECK (status IN ('vacant', 'reserved'));
