/**
 * #1284 «Aufgehobene Wohnung», against the real PostgreSQL database: an apartment that no longer exists from a day
 * counts in the Verteilschlüssel until the day before, by days; statements from that day calculate without it.
 *
 * Building: 1.01 (70 m²), 1.02 (50 m²), 1.03 (30 m², vacant, aufgehoben ab 01.07.2025). Hauswart CHF 3'000 per area
 * over 2025 (365 days): until 30.06. (181 days) CHF 1'487.67 over 150 m², from 01.07. (184 days) CHF 1'512.33 over 120 m².
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, heatingProfiles, invoices, utilityStatements } from '../db/schema';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { createContract, deleteContract } from '../services/contract.service';
import { generateStatement } from '../services/statement-generation.service';
import { callApi, sendJson } from './helpers/auth';
import { insertInvoice } from './helpers/records';

type Line = { categoryName: string; tenantShare: number; apartmentShare: number };

const token = crypto.randomUUID();
const created = { building: '', apartments: [] as string[], tenants: [] as string[], contracts: [] as string[], profile: '' };
const ids = { a: '', b: '', c: '' };
let tenantA: string;
let tenantB: string;

async function rent(firstName: string, apartmentId: string, startDate: string, endDate?: string) {
	const tenant = await createTenant({ firstName, lastName: token });
	const contract = await createContract({ apartmentId, tenantId: tenant.id, startDate, endDate, baseRent: '950', monthlyAdvancePayment: '100' });
	created.tenants.push(tenant.id);
	created.contracts.push(contract.id);
	return contract.id;
}

async function line(contractId: string, year: number, category: string, heatingProfileId?: string): Promise<Line> {
	const response = await callApi('/api/v1/statements/preview', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ contractId, periodStart: `${year}-01-01`, periodEnd: `${year}-12-31`, heatingProfileId })
	});
	const { lineItems } = (await response.json()) as { lineItems: Line[] };
	return lineItems.find((item) => item.categoryName === category)!;
}

const discontinue = (apartmentId: string, discontinuedFrom: string | null) =>
	sendJson('PUT', `/api/v1/apartments/${apartmentId}`, { discontinuedFrom });

beforeAll(async () => {
	const building = await createBuilding({ name: `Umbauhof ${token}`, address: 'Testweg 1', postalCode: '8400', city: 'Winterthur', canton: 'ZH' });
	created.building = building.id;
	for (const [key, number, area] of [['a', '1.01', '70'], ['b', '1.02', '50'], ['c', '1.03', '30']] as const) {
		const apartment = await createApartment({ buildingId: building.id, number, floor: 1, area, rooms: '3.5' });
		ids[key] = apartment.id;
		created.apartments.push(apartment.id);
	}
	for (const year of [2024, 2025, 2026]) await insertInvoice(building.id, { description: `Hauswart ${year}`, amount: '3000.00', invoiceDate: `${year}-12-31` });
	const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
	await insertInvoice(building.id, { categoryId: heating.id, description: 'Heizöl 2025', amount: '1000.00', invoiceDate: '2025-12-31' });
	const [profile] = await db
		.insert(heatingProfiles)
		.values({
			name: `Umbau ${token}`,
			type: 'custom',
			januaryPct: '18',
			februaryPct: '14',
			marchPct: '11',
			aprilPct: '5',
			mayPct: '2',
			junePct: '0',
			julyPct: '0',
			augustPct: '0',
			septemberPct: '2',
			octoberPct: '8',
			novemberPct: '14',
			decemberPct: '26'
		})
		.returning();
	created.profile = profile.id;
	tenantA = await rent('Mieterin A', ids.a, '2024-01-01');
	tenantB = await rent('Mieter B', ids.b, '2025-08-01');
	expect((await discontinue(ids.c, '2025-07-01')).status).toBe(200);
});

afterAll(async () => {
	await db.delete(utilityStatements).where(inArray(utilityStatements.contractId, created.contracts));
	for (const id of created.contracts) await deleteContract(id, true);
	for (const id of created.tenants) await deleteTenant(id);
	await db.delete(invoices).where(eq(invoices.buildingId, created.building));
	for (const id of created.apartments) await deleteApartment(id);
	await deleteBuilding(created.building);
	await db.delete(heatingProfiles).where(eq(heatingProfiles.id, created.profile));
});

describe('Aufgehobene Wohnung im Verteilschlüssel (#1284)', () => {
	it('speichert «aufgehoben ab» und gibt es mit der Wohnung zurück', async () => {
		const response = await callApi(`/api/v1/apartments/${ids.c}`);
		expect(((await response.json()) as { discontinuedFrom: string | null }).discontinuedFrom).toBe('2025-07-01');
	});

	// 694.25 (70/150 von 1'487.67) + 882.19 (70/120 von 1'512.33)
	it('zählt die aufgehobene Wohnung bis zum Tag davor nach Tagen', async () => {
		expect((await line(tenantA, 2025, 'Caretaker')).tenantShare).toBe(1576.44);
	});

	// nur ab 01.08.: 3'000 × 153/365 = 1'257.53, davon 50/120
	it('rechnet ohne sie, wenn die Tage des Mieters nach dem Tag beginnen', async () => {
		expect((await line(tenantB, 2025, 'Caretaker')).tenantShare).toBe(523.97);
	});

	it('rechnet Abrechnungen ab dem Tag ohne sie', async () => {
		expect((await line(tenantA, 2026, 'Caretaker')).tenantShare).toBe(1750);
	});

	it('rechnet Abrechnungen vor dem Tag mit ihr', async () => {
		expect((await line(tenantA, 2024, 'Caretaker')).tenantShare).toBe(1400);
	});

	// Fachreview 1284-1 V-6: jeder Zeitraum für sich, auch eine Gutschrift nur ab dem Tag: 300 × 70/150 = 140.00 und
	// −300 × 70/120 = −175.00
	it('rechnet eine Gutschrift im Zeitraum ab dem Tag mit dessen Bruch', async () => {
		const [chimney] = await db.select().from(categories).where(eq(categories.name, 'Chimney Sweep'));
		const service = (start: string, end: string) => ({ categoryId: chimney.id, invoiceDate: end, servicePeriodStart: start, servicePeriodEnd: end });
		await insertInvoice(created.building, { ...service('2025-01-01', '2025-06-30'), description: 'Kaminfeger', amount: '300.00' });
		await insertInvoice(created.building, { ...service('2025-07-01', '2025-12-31'), description: 'Gutschrift Kaminfeger', amount: '-300.00' });
		expect((await line(tenantA, 2025, 'Chimney Sweep')).tenantShare).toBe(-35);
	});

	// Januar bis Juni 50 % des Heizprofils, davon 70/150 = 233.33; Juli bis Dezember 50 %, davon 70/120 = 291.67
	it('teilt Heizkosten mit Heizprofil nach dessen Monatsanteilen auf die Zeit vor und ab dem Tag', async () => {
		expect((await line(tenantA, 2025, 'Heating', created.profile)).tenantShare).toBe(525);
	});
});

describe('Die Abrechnung behält die Rechnung je Zeitraum (#1284, Fachreview 1284-1 V-2)', () => {
	const statementOf = (year: number) =>
		generateStatement({ contractId: tenantA, buildingId: created.building, periodStart: `${year}-01-01`, periodEnd: `${year}-12-31`, managementFeePercent: 0 });

	it('speichert die Zeiträume mit ihrem Bruch, ihren Kosten und Anteilen', async () => {
		const { lineItems } = await statementOf(2025);
		const [before, from] = lineItems.find((item) => item.description === 'Caretaker')!.segments!;
		expect(before).toEqual({ start: '2025-01-01', end: '2025-06-30', count: 3, keyValues: { area: [70, 150], units: [1, 3], rooms: [3.5, 10.5] }, costs: 1487.67, apartment: 694.25, periodShare: 1, days: 181, total: 181, share: 694.25 });
		expect(from).toMatchObject({ start: '2025-07-01', count: 2, costs: 1512.33, apartment: 882.19, share: 882.19, discontinued: [{ number: '1.03', date: '2025-07-01' }] });
	});

	it('zählt im Bruch einer späteren Abrechnung nur die Wohnungen, die es noch gibt', async () => {
		expect((await statementOf(2026)).keyValues?.area).toEqual([70, 120]);
	});
});

describe('Aufheben und Mietverträge (#1284)', () => {
	it('lehnt «aufgehoben ab» ab, solange ein Mietvertrag an diesem Tag läuft', async () => {
		const response = await discontinue(ids.a, '2026-07-01');
		expect(response.status).toBe(409);
		expect(((await response.json()) as { code: string }).code).toBe('APARTMENT_CONTRACT_RUNS');
	});

	it('lehnt einen Mietvertrag ab, der am Tag der Aufhebung noch läuft', async () => {
		const tenant = await createTenant({ firstName: 'Zu spät', lastName: token });
		created.tenants.push(tenant.id);
		const contract = { apartmentId: ids.c, tenantId: tenant.id, startDate: '2025-05-01', baseRent: '900', monthlyAdvancePayment: '100' };
		const response = await sendJson('POST', '/api/v1/contracts', contract);
		expect(response.status).toBe(400);
		expect(((await response.json()) as { code: string }).code).toBe('CONTRACT_APARTMENT_DISCONTINUED');
	});

	// C-1 (Code-Review 1284-1): ein Mietvertrag endet spätestens am Tag davor
	it('nimmt beim Ändern ein Vertragsende am Tag davor an und lehnt eines am Tag selbst ab', async () => {
		const tenant = await createTenant({ firstName: 'Bis Juni', lastName: token });
		created.tenants.push(tenant.id);
		const contract = await createContract({ apartmentId: ids.c, tenantId: tenant.id, startDate: '2025-02-01', endDate: '2025-03-31', baseRent: '900', monthlyAdvancePayment: '100' });
		created.contracts.push(contract.id);
		const end = async (endDate: string) => (await sendJson('PUT', `/api/v1/contracts/${contract.id}`, { endDate, confirmPastEnd: true })).json() as Promise<{ code?: string; endDate?: string }>;
		expect((await end('2025-06-30')).endDate).toBe('2025-06-30');
		expect((await end('2025-07-01')).code).toBe('CONTRACT_APARTMENT_DISCONTINUED');
	});

	it('nimmt «aufgehoben ab» mit leerem Datum zurück', async () => {
		const other = await createApartment({ buildingId: created.building, number: '1.04', floor: 1, area: '20', rooms: '1' });
		created.apartments.push(other.id);
		expect((await discontinue(other.id, '2025-01-01')).status).toBe(200);
		const response = await discontinue(other.id, null);
		expect(((await response.json()) as { discontinuedFrom: string | null }).discontinuedFrom).toBeNull();
	});
});
