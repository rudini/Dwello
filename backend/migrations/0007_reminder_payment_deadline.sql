-- ============================================================================
-- The payment deadline each Mahnung prints (#107): the next Mahnstufe is possible from the day after it. Existing
-- reminders printed their Swiss creation day + 10 days.
-- ============================================================================

ALTER TABLE documents ADD COLUMN payment_deadline DATE;

UPDATE documents
SET payment_deadline = (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Zurich')::date + 10
WHERE type = 'reminder';
