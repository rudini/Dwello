-- The predefined profile «Nur Warmwasser» is removed: a separate Warmwasser category is shared by days since 0009, and
-- chosen as the heating profile of a run it would spread the heating costs evenly over the year (wrong for heating).
-- Statements that used it keep their amounts; their reference becomes NULL (ON DELETE SET NULL).
DELETE FROM configuration
WHERE key = 'default_heating_profile_id'
  AND value = (SELECT id::text FROM heating_profiles WHERE name = 'Hot Water Only' AND type = 'predefined');
DELETE FROM heating_profiles WHERE name = 'Hot Water Only' AND type = 'predefined';
