-- ============================================================================
-- Abrechnungsperiode per building (#1088): each building has its own, fixed from its first statement; the setting
-- «Abrechnungsperiode» and its stored change (#512) go. A building takes the period of its latest whole statement (a
-- statement over a whole calendar year, July – June or November – October), else the setting as it was.
-- ============================================================================

ALTER TABLE buildings ADD COLUMN accounting_period VARCHAR(20) NOT NULL DEFAULT 'calendar';

UPDATE buildings SET accounting_period = COALESCE(
	(
		SELECT CASE EXTRACT(MONTH FROM s.period_start) WHEN 1 THEN 'calendar' WHEN 7 THEN 'july-june' ELSE 'november-october' END
		FROM utility_statements s
		JOIN apartments a ON a.id = s.apartment_id
		WHERE a.building_id = buildings.id
			AND EXTRACT(DAY FROM s.period_start) = 1
			AND EXTRACT(MONTH FROM s.period_start) IN (1, 7, 11)
			AND s.period_end = (s.period_start + INTERVAL '1 year' - INTERVAL '1 day')::date
		ORDER BY s.period_end DESC
		LIMIT 1
	),
	(SELECT value FROM configuration WHERE key = 'accounting_period' AND value IN ('calendar', 'july-june', 'november-october')),
	'calendar'
);

DELETE FROM configuration WHERE key IN ('accounting_period', 'accounting_period_changed');
