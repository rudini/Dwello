/**
 * #1201: each form's text longer than its database column is refused at its field (real PostgreSQL database); before,
 * the database refused it and the form showed only its general save error
 */
import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { apiRecords, idOf } from './helpers/records';
import { createRental } from './helpers/rental';

const long = (length: number) => 'A'.repeat(length);
const tooLong = (field: string, max: number) => ({ code: 'TEXT_TOO_LONG', params: { field, max } });

async function expectTooLong(response: Response, ...causes: ReturnType<typeof tooLong>[]) {
	expect(response.status).toBe(400);
	expect(((await response.json()) as { causes?: unknown }).causes).toEqual(causes);
}

let rental: Awaited<ReturnType<typeof createRental>>;
const buildings = apiRecords('buildings');
const tenants = apiRecords('tenants');
const categories = apiRecords('categories');
const keys = apiRecords('distribution-keys');
const profiles = apiRecords('heating-profiles');

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2024-01-01', monthlyAdvancePayment: '0' });
});

afterAll(async () => {
	for (const records of [buildings, tenants, categories, keys, profiles]) await records.removeAll();
	await rental.remove();
});

const building = { name: 'Lindenhof', address: 'Lindenweg 1', postalCode: '8400', city: 'Winterthur', canton: 'ZH' };
const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const shares = Object.fromEntries(months.map((month, i) => [`${month}Pct`, i < 4 ? 25 : 0]));

describe('Zu lange Texte', () => {
	it('meldet beim Gebäude jeden zu langen Text bei seinem Feld, auch bei den Wohnungen aus dem Gebäuderegister', async () => {
		const apartment = { number: long(21), floor: 0, area: '50', rooms: '2' };
		await expectTooLong(
			await buildings.create({ ...building, name: long(256), city: long(101), apartments: [apartment] }),
			tooLong('name', 255),
			tooLong('city', 100),
			tooLong('apartments.0.number', 20)
		);
		await expectTooLong(await buildings.send('PUT', `/${rental.building}`, { address: long(501) }), tooLong('address', 500));
	});

	it('meldet beim Mieter jeden zu langen Text bei seinem Feld', async () => {
		const tenant = { firstName: 'Anna', lastName: 'Keller', correspondenceChannel: 'letter', address: 'Ahornweg 3', postalCode: '8400', city: 'Winterthur' };
		await expectTooLong(await tenants.create({ ...tenant, lastName: long(101), phone: long(31) }), tooLong('lastName', 100), tooLong('phone', 30));
		const id = await idOf(await tenants.create(tenant));
		await expectTooLong(await tenants.send('PUT', `/${id}`, { email: `${long(251)}@a.ch` }), tooLong('email', 255));
	});

	it('meldet bei der Wohnung eine zu lange Wohnungsnummer bei ihrem Feld', async () => {
		const apartments = apiRecords('apartments');
		await expectTooLong(
			await apartments.create({ buildingId: rental.building, number: long(21), floor: 0, area: '50', rooms: '2' }),
			tooLong('number', 20)
		);
		await expectTooLong(await apartments.send('PUT', `/${rental.apartment}`, { number: long(21) }), tooLong('number', 20));
	});

	it('meldet bei Kategorie, Verteilschlüssel und Heizprofil einen zu langen Namen bei seinem Feld, auch übersetzt', async () => {
		await expectTooLong(await categories.create({ name: long(101), isAllowedUtilityCost: true }), tooLong('name', 100));
		const category = await idOf(await categories.create({ name: `Kategorie ${crypto.randomUUID()}`, isAllowedUtilityCost: true }));
		await expectTooLong(await categories.send('PUT', `/${category}`, { nameFR: long(101) }), tooLong('nameFR', 100));

		await expectTooLong(await keys.create({ name: long(101), formula: '{area}' }), tooLong('name', 100));
		const key = await idOf(await keys.create({ name: `Schlüssel ${crypto.randomUUID()}`, formula: '{area}' }));
		await expectTooLong(await keys.send('PUT', `/${key}`, { nameIT: long(101) }), tooLong('nameIT', 100));

		await expectTooLong(await profiles.create({ name: long(101), ...shares }), tooLong('name', 100));
		const profile = await idOf(await profiles.create({ name: `Profil ${crypto.randomUUID()}`, ...shares }));
		await expectTooLong(await profiles.send('PUT', `/${profile}`, { nameEN: long(101) }), tooLong('nameEN', 100));
	});
});
