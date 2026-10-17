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

// Schweizer Tabelle «Anteilmässige Belastung in Prozenten» / «Mieterwechsel: So werden die Heizkosten verteilt»
describe('Monatsanteile der vordefinierten Heizprofile', () => {
	const months = `ARRAY[january_pct, february_pct, march_pct, april_pct, may_pct, june_pct, july_pct, august_pct,
		september_pct, october_pct, november_pct, december_pct]::float[] AS shares`;

	it('folgen der Schweizer Tabelle für Mittelland, Bergregion und Tessin', async () => {
		const result = await db.execute(sql.raw(`SELECT name, ${months} FROM heating_profiles WHERE type = 'predefined' ORDER BY name`));
		const shares = Object.fromEntries(result.rows.map((row) => [row.name, row.shares]));

		expect(shares['Heating Mittelland']).toEqual([17.5, 14.5, 13.5, 9.5, 3.5, 0, 0, 0, 1, 10, 13.5, 17]);
		expect(shares['Heating + Hot Water']).toEqual([13.6, 12.1, 11.5, 9.3, 5.6, 3.7, 3.7, 3.6, 3.7, 9.5, 10.7, 13]);
		// Bergregion incl. the July dip to 1.0 %: Mieterverband, «Merkblatt Nebenkostenabrechnung beim Umzug während der
		// Abrechnungsperiode» (PDF dated 2023-09-09), page 2, table «Verteilungsschlüssel in Bergebieten und im Tessin»
		// (spelled so; presumably the table the migration names, not seen), row «Berggebiete»,
		// https://www.mieterverband.ch/site/assets/files/2884/merkblatt_nebenkostenabrechnung_waehrend_periode.pdf (#80)
		expect(shares['Heating Mountain']).toEqual([14, 11.5, 11.5, 9, 7, 4.5, 1, 4, 5.5, 8.5, 10.5, 13]);
		expect(shares['Heating Tessin']).toEqual([21.5, 17, 15.5, 5, 0, 0, 0, 0, 0, 6, 15, 20]);
	});

	// Warmwasser wird nach Tagen verteilt; ein Profil «Nur Warmwasser» verteilte als Heizprofil die Heizkosten falsch
	it('bieten kein Profil «Nur Warmwasser» an', async () => {
		const result = await db.execute(sql`SELECT name FROM heating_profiles WHERE type = 'predefined' ORDER BY name`);

		expect(result.rows.map((row) => row.name)).toEqual(['Heating + Hot Water', 'Heating Mittelland', 'Heating Mountain', 'Heating Tessin']);
	});
});

describe('Vordefinierter Heizschlüssel 70/30', () => {
	it('rechnet mit den Summen des Gebäudes, damit Fläche und Einheit wirklich 70 % und 30 % tragen', async () => {
		const result = await db.execute(sql`SELECT formula FROM distribution_keys WHERE name = 'Heating (Area 70% / Unit 30%)'`);

		expect(result.rows).toEqual([{ formula: '0.7 * {area} / {area_total} + 0.3 * {units} / {units_total}' }]);
	});
});

describe('Beschreibungen der Stammdaten', () => {
	it('sind für vordefinierte Kategorien und Verteilschlüssel deutsch', async () => {
		const result = await db.execute(sql`
			SELECT (SELECT description FROM categories WHERE name = 'Heating') AS category,
				(SELECT description FROM distribution_keys WHERE name = 'Per Unit') AS key`);

		expect(result.rows).toEqual([{ category: 'Kosten für das Heizen des Gebäudes', key: 'Gleichmässig pro Wohnung' }]);
	});
});
