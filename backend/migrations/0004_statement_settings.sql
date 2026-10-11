-- A statement keeps the heating profile and the distribution key of the management fee of its generation run,
-- so its PDF can name them (the tenant checks how the heating costs and the fee were split)
ALTER TABLE utility_statements
    ADD COLUMN heating_profile_id UUID REFERENCES heating_profiles(id) ON DELETE SET NULL,
    ADD COLUMN management_fee_distribution_key_id UUID REFERENCES distribution_keys(id) ON DELETE SET NULL;
