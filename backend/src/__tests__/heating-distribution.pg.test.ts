/**
 * Heating cost distribution with a tenant change and vacancy, against the real PostgreSQL database
 *
 * Building: apartment 2.01 (70 m²) and 2.02 (30 m²), heating invoice CHF 1000 distributed by area.
 * Apartment 2.01: tenant 1 until 31.3., vacant in April, tenant 2 from 1.5. Heating profile summing to 100%:
 * Jan–Mar 43%, Apr 5%, May–Dec 52%.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, heatingProfiles, invoices } from '../db/schema';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { createContract, deleteContract } from '../services/contract.service';
import { callApi } from './helpers/auth';
import { insertInvoice } from './helpers/records';

type LineItem = { categoryName: string; isHeatingCost: boolean; apartmentShare: number; tenantShare: number; periodShare: number };

const token = crypto.randomUUID();
const created: { building: string; apartments: string[]; tenants: string[]; contracts: string[] } = {
	building: '',
	apartments: [],
	tenants: [],
	contracts: []
};
let heatingProfileId: string;

async function rent(firstName: string, apartmentId: string, startDate: string, endDate?: string) {
	const tenant = await createTenant({ firstName, lastName: token });
	const contract = await createContract({
		apartmentId,
		tenantId: tenant.id,
		startDate,
		endDate,
		baseRent: '950',
		monthlyAdvancePayment: '100'
	});
	created.tenants.push(tenant.id);
	created.contracts.push(contract.id);
	return contract.id;
}

async function lines(contractId: string): Promise<LineItem[]> {
	const response = await callApi('/api/v1/statements/preview', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ contractId, periodStart: '2024-01-01', periodEnd: '2024-12-31', heatingProfileId })
	});
	return ((await response.json()) as { lineItems: LineItem[] }).lineItems;
}

async function heatingLine(contractId: string): Promise<LineItem> {
	const response = await callApi('/api/v1/statements/preview', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ contractId, periodStart: '2024-01-01', periodEnd: '2024-12-31', heatingProfileId })
	});
	const preview = (await response.json()) as { lineItems: LineItem[] };
	return preview.lineItems.find((item) => item.isHeatingCost)!;
}

let tenant1: string;
let tenant2: string;

beforeAll(async () => {
	const building = await createBuilding({
		name: `Heizhaus ${token}`,
		address: 'Testweg 1',
		postalCode: '8400',
		city: 'Winterthur',
		canton: 'ZH'
	});
	created.building = building.id;
	const large = await createApartment({ buildingId: building.id, number: '2.01', floor: 2, area: '70', rooms: '3.5' });
	const small = await createApartment({ buildingId: building.id, number: '2.02', floor: 2, area: '30', rooms: '1.5' });
	created.apartments.push(large.id, small.id);

	const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
	await insertInvoice(building.id, { categoryId: heating.id, description: 'Heizöl 2024', amount: '1000.00', invoiceDate: '2024-06-30' });
	const [chimney] = await db.select().from(categories).where(eq(categories.name, 'Chimney Sweep'));
	await insertInvoice(building.id, { categoryId: chimney.id, description: 'Kaminfeger 2024', amount: '200.00', invoiceDate: '2024-10-15' });
	const [hotWater] = await db.select().from(categories).where(eq(categories.name, 'Hot Water'));
	await insertInvoice(building.id, { categoryId: hotWater.id, description: 'Warmwasser 2024', amount: '300.00', invoiceDate: '2024-11-30' });
	const [profile] = await db
		.insert(heatingProfiles)
		.values({
			name: `Test ${token}`,
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
	heatingProfileId = profile.id;

	tenant1 = await rent('Mieter Eins', large.id, '2024-01-01', '2024-03-31');
	tenant2 = await rent('Mieter Zwei', large.id, '2024-05-01');
});

afterAll(async () => {
	for (const id of created.contracts) await deleteContract(id);
	for (const id of created.tenants) await deleteTenant(id);
	await db.delete(invoices).where(eq(invoices.buildingId, created.building));
	for (const id of created.apartments) await deleteApartment(id);
	await deleteBuilding(created.building);
	await db.delete(heatingProfiles).where(eq(heatingProfiles.id, heatingProfileId));
});

describe('Heizkostenverteilung bei Mieterwechsel und Leerstand', () => {
	it('verteilt die Heizkosten des Gebäudes nach Fläche auf die Wohnung', async () => {
		expect((await heatingLine(tenant1)).apartmentShare).toBe(700);
	});

	it('belastet den ersten Mieter mit Januar bis März gemäss Heizprofil', async () => {
		const line = await heatingLine(tenant1);

		expect(line.periodShare).toBe(0.43);
		expect(line.tenantShare).toBe(301);
	});

	it('belastet den zweiten Mieter mit Mai bis Dezember gemäss Heizprofil', async () => {
		const line = await heatingLine(tenant2);

		expect(line.periodShare).toBe(0.52);
		expect(line.tenantShare).toBe(364);
	});

	it('lässt den Leerstand im April beim Vermieter', async () => {
		const shares = (await heatingLine(tenant1)).tenantShare + (await heatingLine(tenant2)).tenantShare;

		expect(700 - shares).toBe(35);
	});

	// Der Kaminfeger hängt an der Heizung: beim Mieterwechsel nach Heizprofil, nicht nach Tagen
	it('verteilt den Kaminfeger als Heiz- und Warmwasserkosten nach dem Heizprofil', async () => {
		const chimney = (await lines(tenant1)).find((line) => line.categoryName === 'Chimney Sweep')!;

		expect(chimney).toMatchObject({ isHeatingCost: true, apartmentShare: 140, periodShare: 0.43, tenantShare: 60.2 });
	});

	// Teilperiode (z.B. bei Verkauf): wer die ganze Periode mietet, trägt die ganzen Heizkosten der Periode
	it('belastet in einer Periode unter einem Jahr den Mieter der ganzen Periode mit dem ganzen Wohnungsanteil', async () => {
		const response = await callApi('/api/v1/statements/preview', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ contractId: tenant2, periodStart: '2024-05-01', periodEnd: '2024-12-31', heatingProfileId })
		});
		const heating = ((await response.json()) as { lineItems: LineItem[] }).lineItems.find((line) => line.categoryName === 'Heating')!;

		expect(heating).toMatchObject({ periodShare: 1, tenantShare: heating.apartmentShare });
	});

	// Sommerperiode: das Profil hat in diesen Monaten 0 %, die Heizkosten der Periode trägt trotzdem jemand
	it('verteilt die Heizkosten einer Periode ohne Profilanteil nach Tagen', async () => {
		const response = await callApi('/api/v1/statements/preview', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ contractId: tenant2, periodStart: '2024-06-01', periodEnd: '2024-08-31', heatingProfileId })
		});
		const heating = ((await response.json()) as { lineItems: LineItem[] }).lineItems.find((line) => line.categoryName === 'Heating')!;

		expect(heating).toMatchObject({ periodShare: 1, tenantShare: heating.apartmentShare });
	});

	// Einzug mitten in der Sommerperiode: 62 von 92 Tagen, Wohnungsanteil 30 % von CHF 1000
	it('verteilt die Heizkosten einer Periode ohne Profilanteil bei einem Einzug nach Tagen', async () => {
		const contractId = await rent('Mieter Drei', created.apartments[1], '2024-07-01');
		const response = await callApi('/api/v1/statements/preview', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ contractId, periodStart: '2024-06-01', periodEnd: '2024-08-31', heatingProfileId })
		});
		const heating = ((await response.json()) as { lineItems: LineItem[] }).lineItems.find((line) => line.categoryName === 'Heating')!;

		expect(heating).toMatchObject({ apartmentShare: 300, periodShare: 0.6739, tenantShare: 202.17 });
	});

	// Warmwasser wird das ganze Jahr etwa gleich verbraucht: nach Tagen, nicht nach dem Heizprofil
	it('verteilt separat abgerechnetes Warmwasser nach Tagen', async () => {
		const hotWater = (await lines(tenant1)).find((line) => line.categoryName === 'Hot Water')!;

		expect(hotWater).toMatchObject({ isHeatingCost: false, apartmentShare: 210, tenantShare: 52.21 });
	});

	// Der Mieter rechnet das Total aus den Positionen nach: die Zwischensumme ist die Summe der gerundeten Positionen
	it('rechnet die Zwischensumme aus den gerundeten Positionen, auch bei einer Periode bis mitten im Monat', async () => {
		const response = await callApi('/api/v1/statements/preview', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ contractId: tenant2, periodStart: '2024-01-01', periodEnd: '2024-10-19', heatingProfileId })
		});
		const preview = (await response.json()) as { subtotal: number; lineItems: LineItem[] };
		const sum = preview.lineItems.reduce((total, line) => total + line.tenantShare, 0);

		expect(preview.subtotal).toBe(Math.round(sum * 100) / 100);
	});
});
