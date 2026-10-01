/**
 * Predefined heating profiles in the real PostgreSQL database
 */

import { describe, expect, it } from 'bun:test';
import { sql } from 'drizzle-orm';
import { db } from '../db/connection';

describe('Vordefinierte Heizprofile', () => {
	it('verteilen über das Jahr genau 100 % der Heizkosten', async () => {
		const result = await db.execute(sql`
			SELECT name, january_pct + february_pct + march_pct + april_pct + may_pct + june_pct
				+ july_pct + august_pct + september_pct + october_pct + november_pct + december_pct AS total
			FROM heating_profiles WHERE type = 'predefined' ORDER BY name`);

		const totals = Object.fromEntries(result.rows.map((row) => [row.name, Number(row.total)]));
		expect(Object.values(totals).length).toBeGreaterThan(0);
		expect(totals).toEqual(Object.fromEntries(Object.keys(totals).map((name) => [name, 100])));
	});
});
