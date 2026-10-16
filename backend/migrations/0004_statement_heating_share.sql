-- ============================================================================
-- The share of the heating costs by the heating profile as the statement was calculated (#209): the percent, the months
-- and the profile's names, or that the heating costs were shared by days. The PDF prints it even after the landlord
-- changed, renamed or deleted an own profile. Empty for statements created before this migration and without a profile.
-- ============================================================================

ALTER TABLE utility_statements ADD COLUMN heating_share JSONB;
