/**
 * #1301 Fläche und Zimmeranzahl ab einem Tag, against the real PostgreSQL database: up to the day before an apartment
 * counts in the Verteilschlüssel with its earlier values, from the day with the new ones.
 *
 * Building: 1.01, 1.02, 1.03 with 70 m² and 3.5 Zimmer; 1.03 vacant, aufgehoben ab 01.07.2025 and merged into 1.02,
 * which has 140 m² and 5.5 Zimmer from that day. Hauswart CHF 3'000 per area over each year: 2025 until 30.06.
 * (181 days) CHF 1'487.67 over 210 m², from 01.07. (184 days) CHF 1'512.33 over 210 m² (70 + 140).
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoices, utilityStatements } from '../db/schema';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { createContract, deleteContract } from '../services/contract.service';
import { generateStatement } from '../services/statement.service';
import { callApi, sendJson } from './helpers/auth';
import { insertInvoice } from './helpers/records';

type Line = { categoryName: string; tenantShare: number };
type Saved = { area: string; rooms: string; earlierSizes: { until: string; area: string; rooms: string }[]; code?: string; params?: Record<string, string> };

const token = crypto.randomUUID();
const created = { building: '', apartments: [] as string[], tenants: [] as string[], contracts: [] as string[] };
const ids = { a: '', b: '', c: '' };
let tenantA: string;
let tenantB: string;

async function rent(firstName: string, apartmentId: string) {
	const tenant = await createTenant({ firstName, lastName: token });
	const contract = await createContract({ apartmentId, tenantId: tenant.id, startDate: '2024-01-01', baseRent: '950', monthlyAdvancePayment: '100' });
	created.tenants.push(tenant.id);
	created.contracts.push(contract.id);
	return contract.id;
}

async function caretaker(contractId: string, year: number): Promise<number> {
	const response = await callApi('/api/v1/statements/preview', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ contractId, periodStart: `${year}-01-01`, periodEnd: `${year}-12-31` })
	});
	const { lineItems } = (await response.json()) as { lineItems: Line[] };
	return lineItems.find((item) => item.categoryName === 'Caretaker')!.tenantShare;
}

const changeSize = async (apartmentId: string, body: { area: string; rooms: string; sizeFrom?: string }) => {
	const response = await sendJson('PUT', `/api/v1/apartments/${apartmentId}`, body);
	return { status: response.status, saved: (await response.json()) as Saved };
};

const statementOf = (contractId: string, year: number) =>
	generateStatement({ contractId, buildingId: created.building, periodStart: `${year}-01-01`, periodEnd: `${year}-12-31`, managementFeePercent: 0 });

beforeAll(async () => {
	const building = await createBuilding({ name: `Grösserhof ${token}`, address: 'Testweg 1', postalCode: '8400', city: 'Winterthur', canton: 'ZH' });
	created.building = building.id;
	for (const [key, number] of [['a', '1.01'], ['b', '1.02'], ['c', '1.03']] as const) {
		const apartment = await createApartment({ buildingId: building.id, number, floor: 1, area: '70', rooms: '3.5' });
		ids[key] = apartment.id;
		created.apartments.push(apartment.id);
	}
	for (const year of [2024, 2025, 2026]) await insertInvoice(building.id, { description: `Hauswart ${year}`, amount: '3000.00', invoiceDate: `${year}-12-31` });
	tenantA = await rent('Mieterin A', ids.a);
	tenantB = await rent('Mieter B', ids.b);
	expect((await sendJson('PUT', `/api/v1/apartments/${ids.c}`, { discontinuedFrom: '2025-07-01' })).status).toBe(200);
	expect((await changeSize(ids.b, { area: '140', rooms: '5.5', sizeFrom: '2025-07-01' })).status).toBe(200);
});

afterAll(async () => {
	await db.delete(utilityStatements).where(inArray(utilityStatements.contractId, created.contracts));
	for (const id of created.contracts) await deleteContract(id, true);
	for (const id of created.tenants) await deleteTenant(id);
	await db.delete(invoices).where(eq(invoices.buildingId, created.building));
	for (const id of created.apartments) await deleteApartment(id);
	await deleteBuilding(created.building);
});

describe('Fläche und Zimmeranzahl ab einem Tag (#1301)', () => {
	it('gibt die neuen Werte und die früheren mit ihrem letzten Tag zurück', async () => {
		const saved = (await (await callApi(`/api/v1/apartments/${ids.b}`)).json()) as Saved;
		expect([saved.area, saved.rooms]).toEqual(['140.00', '5.5']);
		expect(saved.earlierSizes).toEqual([{ until: '2025-06-30', area: '70.00', rooms: '3.5' }]);
	});

	// 495.89 (70/210 von 1'487.67) + 504.11 (70/210 von 1'512.33)
	it('rechnet bis zum Tag davor mit den früheren Werten und ab dem Tag mit den neuen', async () => {
		expect(await caretaker(tenantA, 2025)).toBe(1000);
	});

	// 495.89 + 1'008.22 (140/210 von 1'512.33)
	it('rechnet die gewachsene Wohnung ab dem Tag mit ihrer neuen Fläche', async () => {
		expect(await caretaker(tenantB, 2025)).toBe(1504.11);
	});

	it('rechnet Abrechnungen vor dem Tag mit den früheren Werten', async () => {
		expect(await caretaker(tenantB, 2024)).toBe(1000);
	});

	it('rechnet Abrechnungen ab dem Tag mit den neuen Werten', async () => {
		expect(await caretaker(tenantB, 2026)).toBe(2000);
	});
});

describe('Die Abrechnung behält die Werte je Zeitraum (#1301)', () => {
	it('speichert je Zeitraum die Werte, die an ihm gelten, und nennt die geänderte Wohnung', async () => {
		const { lineItems } = await statementOf(tenantB, 2025);
		const [before, from] = lineItems.find((item) => item.description === 'Caretaker')!.segments!;
		expect(before).toMatchObject({ end: '2025-06-30', count: 3, keyValues: { area: [70, 210], units: [1, 3], rooms: [3.5, 10.5] }, apartment: 495.89 });
		expect(from).toMatchObject({ start: '2025-07-01', count: 2, keyValues: { area: [140, 210], units: [1, 2], rooms: [5.5, 9] }, apartment: 1008.22 });
		expect(from.changed).toEqual([{ number: '1.02', date: '2025-07-01', area: 140, rooms: 5.5, earlierArea: 70, earlierRooms: 3.5 }]);
	});

	it('nimmt für den Bruch der Abrechnung die Werte am ersten Tag des Mieters', async () => {
		expect((await statementOf(tenantB, 2026)).keyValues?.area).toEqual([140, 210]);
	});
});

describe('Neue Werte ab einem Tag erfassen (#1301)', () => {
	it('lehnt einen Tag ab, der nicht nach dem Tag der letzten Änderung liegt', async () => {
		for (const sizeFrom of ['2025-03-01', '2025-07-01']) {
			const { status, saved } = await changeSize(ids.b, { area: '150', rooms: '6', sizeFrom });
			expect([status, saved.code, saved.params?.date]).toEqual([409, 'APARTMENT_SIZE_FROM_TOO_EARLY', '2025-07-01']);
		}
	});

	it('lehnt einen Tag ohne neue Werte ab', async () => {
		const { status, saved } = await changeSize(ids.a, { area: '70', rooms: '3.5', sizeFrom: '2025-07-01' });
		expect([status, saved.code]).toEqual([409, 'APARTMENT_SIZE_UNCHANGED']);
	});

	it('korrigiert ohne Tag nur die heutigen Werte und behält die früheren', async () => {
		const other = await createApartment({ buildingId: created.building, number: '1.04', floor: 1, area: '20', rooms: '1' });
		created.apartments.push(other.id);
		await changeSize(other.id, { area: '30', rooms: '1.5', sizeFrom: '2025-01-01' });
		await changeSize(other.id, { area: '40', rooms: '2', sizeFrom: '2026-01-01' });
		const { saved } = await changeSize(other.id, { area: '45', rooms: '2' });
		expect([saved.area, saved.earlierSizes]).toEqual([
			'45.00',
			[
				{ until: '2024-12-31', area: '20.00', rooms: '1.0' },
				{ until: '2025-12-31', area: '30.00', rooms: '1.5' }
			]
		]);
		// Fachreview 1301-1 V-1: the last change removed, its earlier values apply again
		const response = await sendJson('DELETE', `/api/v1/apartments/${other.id}/size-change`);
		const removed = (await response.json()) as Saved;
		expect([removed.area, removed.rooms, removed.earlierSizes]).toEqual(['30.00', '1.5', [{ until: '2024-12-31', area: '20.00', rooms: '1.0' }]]);
		await deleteApartment(other.id); // its area must not count in the tests below
	});

	// Code-Review 1301-2 C-3: an apartment that does not exist (deleted in another tab)
	it('meldet beim Entfernen einer Änderung eine Wohnung, die es nicht gibt', async () => {
		expect((await sendJson('DELETE', `/api/v1/apartments/${crypto.randomUUID()}/size-change`)).status).toBe(404);
	});

	// Fachreview 1301-1 V-3
	it('lehnt einen Tag nach heute ab', async () => {
		const { status, saved } = await changeSize(ids.a, { area: '80', rooms: '3.5', sizeFrom: '2099-07-01' });
		expect([status, saved.code]).toEqual([409, 'APARTMENT_SIZE_FROM_FUTURE']);
	});

	// Fachreview 1301-1 V-8
	it('lehnt einen Tag ab «aufgehoben ab» ab', async () => {
		for (const sizeFrom of ['2025-07-01', '2025-08-01']) {
			const { status, saved } = await changeSize(ids.c, { area: '80', rooms: '3.5', sizeFrom });
			expect([status, saved.code, saved.params?.date]).toEqual([409, 'APARTMENT_SIZE_AFTER_DISCONTINUED', '2025-07-01']);
		}
	});
});

// Fachreview 1301-1 V-2: 1.02 corrected to 130 m² without a day; from 01.07. 1'512.33 × 130/200 = 983.01 and × 70/200 = 529.32
describe('Ohne Tag gelten korrigierte Werte ab dem Tag der letzten Änderung (#1301)', () => {
	it('rechnet bis zum Tag davor weiter mit den früheren Werten', async () => {
		expect((await changeSize(ids.b, { area: '130', rooms: '5.5' })).status).toBe(200);
		expect([await caretaker(tenantB, 2025), await caretaker(tenantA, 2025)]).toEqual([1478.9, 1025.21]);
	});
});
