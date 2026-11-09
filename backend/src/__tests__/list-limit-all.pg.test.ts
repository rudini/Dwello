/**
 * `limit=all` lists every record, more than the route's default page (#1337; real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { and, eq, like, ne } from 'drizzle-orm';
import { db } from '../db/connection';
import { apartments, buildings, categories, distributionKeys, heatingProfiles, tenants, utilityStatements } from '../db/schema';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
const many = (count: number) => Array.from({ length: count }, (_, i) => i);

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2020-01-01', monthlyAdvancePayment: '100' });
	await db.insert(utilityStatements).values(
		many(21).map((i) => ({
			tenantId: rental.tenant,
			apartmentId: rental.apartment,
			contractId: rental.contract,
			statementNumber: `NK-${token}-${i}`,
			periodStart: `${2000 + i}-01-01`,
			periodEnd: `${2000 + i}-12-31`,
			statementDate: '2021-03-01',
			rentalDays: 365,
			rentalStart: `${2000 + i}-01-01`,
			rentalEnd: `${2000 + i}-12-31`,
			totalCosts: '1200.00',
			totalAdvancePayments: '1000.00',
			balance: '200.00'
		}))
	);
	await db.insert(categories).values(many(101).map((i) => ({ name: `Kategorie ${token} ${i}`, type: 'custom' })));
	await db.insert(distributionKeys).values(many(101).map((i) => ({ name: `Schlüssel ${token} ${i}`, type: 'custom' })));
	await db.insert(buildings).values(many(20).map((i) => ({ name: `Haus ${token} ${i}`, address: 'Testweg 1', postalCode: '8400', city: 'Winterthur', canton: 'ZH' })));
	await db.insert(apartments).values(many(50).map((i) => ({ buildingId: rental.building, number: `9.${i}`, area: '50', rooms: '2.5' })));
	await db.insert(tenants).values(many(50).map((i) => ({ firstName: 'Mia', lastName: `Keller ${token} ${i}` })));
	const [{ id: _id, createdAt: _created, updatedAt: _updated, ...profile }] = await db.select().from(heatingProfiles).limit(1);
	await db.insert(heatingProfiles).values(many(101).map((i) => ({ ...profile, name: `Heizprofil ${token} ${i}`, type: 'custom' })));
});

afterAll(async () => {
	await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
	await db.delete(categories).where(like(categories.name, `%${token}%`));
	await db.delete(distributionKeys).where(like(distributionKeys.name, `%${token}%`));
	await db.delete(buildings).where(like(buildings.name, `Haus ${token}%`));
	await db.delete(apartments).where(and(eq(apartments.buildingId, rental.building), ne(apartments.id, rental.apartment)));
	await db.delete(tenants).where(like(tenants.lastName, `Keller ${token} %`));
	await db.delete(heatingProfiles).where(like(heatingProfiles.name, `%${token}%`));
	await rental.remove();
});

const listed = async (path: string) => {
	const body = (await (await callApi(`/api/v1/${path}`)).json()) as Record<string, unknown[]>;
	return (body.data ?? body.categories ?? body.buildings ?? body.apartments ?? body.tenants ?? []).length;
};

describe('Liste mit limit=all', () => {
	it('nennt alle 21 Abrechnungen des Mietvertrags, mehr als die 20 der Standardseite', async () => {
		expect(await listed(`statements?contractId=${rental.contract}&limit=all`)).toBe(21);
	});

	it('nennt alle 101 Kategorien, mehr als die 100 der Standardseite', async () => {
		expect(await listed(`categories?search=${token}&limit=all`)).toBe(101);
	});

	it('nennt alle 101 Verteilschlüssel, mehr als die 100 der Standardseite', async () => {
		expect(await listed(`distribution-keys?search=${token}&limit=all`)).toBe(101);
	});

	it('nennt alle 21 Liegenschaften, mehr als die 20 der Standardseite', async () => {
		expect(await listed(`buildings?search=${token}&limit=all`)).toBe(21);
	});

	it('nennt alle 51 Wohnungen der Liegenschaft, mehr als die 50 der Standardseite', async () => {
		expect(await listed(`apartments?buildingId=${rental.building}&limit=all`)).toBe(51);
	});

	it('nennt alle 51 Mieter, mehr als die 50 der Standardseite', async () => {
		expect(await listed(`tenants?search=${token}&limit=all`)).toBe(51);
	});

	it('nennt alle 101 Heizprofile, mehr als die 100 der Standardseite', async () => {
		expect(await listed(`heating-profiles?search=${token}&limit=all`)).toBe(101);
	});
});
