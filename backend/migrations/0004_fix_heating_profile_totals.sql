-- Predefined heating profiles must distribute exactly 100% of the heating costs.
-- The original seed summed to 90% (99.5% for hot water); the difference goes to one month
-- until the curves are reviewed manually. Only rows that still have the wrong total change.

UPDATE heating_profiles SET december_pct = december_pct + 10
WHERE name = 'Heating + Hot Water' AND type = 'predefined'
  AND january_pct + february_pct + march_pct + april_pct + may_pct + june_pct
    + july_pct + august_pct + september_pct + october_pct + november_pct + december_pct = 90;

UPDATE heating_profiles SET january_pct = january_pct + 10
WHERE name = 'Heating Mittelland' AND type = 'predefined'
  AND january_pct + february_pct + march_pct + april_pct + may_pct + june_pct
    + july_pct + august_pct + september_pct + october_pct + november_pct + december_pct = 90;

UPDATE heating_profiles SET january_pct = january_pct + 10
WHERE name = 'Heating Tessin' AND type = 'predefined'
  AND january_pct + february_pct + march_pct + april_pct + may_pct + june_pct
    + july_pct + august_pct + september_pct + october_pct + november_pct + december_pct = 90;

UPDATE heating_profiles SET february_pct = february_pct + 0.5
WHERE name = 'Hot Water Only' AND type = 'predefined'
  AND january_pct + february_pct + march_pct + april_pct + may_pct + june_pct
    + july_pct + august_pct + september_pct + october_pct + november_pct + december_pct = 99.5;
