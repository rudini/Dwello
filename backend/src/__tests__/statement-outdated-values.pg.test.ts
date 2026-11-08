/**
 * #1328 (PO A'): a draft is not current when, since it was created, an apartment of its building or a Verteilschlüssel
 * changed and «Neu berechnen» would therefore split it otherwise (real PostgreSQL database). Building with 2.01
 * (rented 1.1. to 31.3.2024) and 2.02, 70 m² and 3.5 Zimmer each; one Hauswart invoice of 2024, by Fläche unless a
 * test says otherwise
 */

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { apartments, categories, invoices } from '../db/schema';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createDistributionKey, deleteDistributionKey } from '../services/distribution-key.service';
import { deleteStatement, generateStatement } from '../services/statement.service';
import { callApi, sendJson } from './helpers/auth';
import { perAreaKey } from './helpers/records';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
let other: string;
const statements: string[] = [];
const keys: string[] = [];

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2024-01-01', endDate: '2024-03-31', monthlyAdvancePayment: '0' });
	other = (await createApartment({ buildingId: rental.building, number: '2.02', floor: 2, area: '70', rooms: '3.5' })).id;
});

// each test starts without invoices and statements, with 2.02 as it was, without earlier values
beforeEach(clear);

afterAll(async () => {
	await clear();
	for (const id of keys) await deleteDistributionKey(id);
	await deleteApartment(other);
	await rental.remove();
});

const otherApartment = (values: object) => sendJson('PUT', `/api/v1/apartments/${other}`, values);

async function clear() {
	for (const id of statements.splice(0)) await deleteStatement(id);
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await db.update(apartments).set({ area: '70', rooms: '3.5', earlierSizes: [], discontinuedFrom: null }).where(eq(apartments.id, other));
}

// the draft of 2024, with the one invoice by that key
async function draft(distributionKeyId?: string) {
	const [caretaker] = await db.select().from(categories).where(eq(categories.name, 'Caretaker'));
	await db.insert(invoices).values({
		buildingId: rental.building,
		categoryId: caretaker.id,
		distributionKeyId: distributionKeyId ?? (await perAreaKey()),
		billingEntityName: 'Muster AG',
		description: `Hauswart ${token}`,
		amount: '732.00',
		invoiceDate: '2024-12-31',
		isValidUtilityCost: true
	});
	const created = await generateStatement({
		contractId: rental.contract,
		buildingId: rental.building,
		periodStart: '2024-01-01',
		periodEnd: '2024-12-31',
		managementFeePercent: 0
	});
	statements.push(created.id);
	return created.id;
}

const changes = async (id: string) =>
	(await (await callApi(`/api/v1/statements/${id}/changed-invoices`)).json()) as { invoiceIds: string[]; valuesChanged: boolean };

describe('Entwurf mit danach geänderten Werten', () => {
	it('meldet eine danach korrigierte Fläche einer anderen Wohnung des Gebäudes', async () => {
		const id = await draft();
		await otherApartment({ area: '140', rooms: '3.5' });

		expect(await changes(id)).toMatchObject({ invoiceIds: [], valuesChanged: true });
	});

	it('meldet nichts, wenn die neue Fläche erst nach der Abrechnungsperiode gilt', async () => {
		const id = await draft();
		await otherApartment({ area: '140', rooms: '3.5', sizeFrom: '2025-07-01' });

		expect((await changes(id)).valuesChanged).toBe(false);
	});

	it('meldet eine danach geänderte Formel des Verteilschlüssels einer Rechnung', async () => {
		await otherApartment({ area: '70', rooms: '5.5' });
		const key = await createDistributionKey({ name: `Eigene ${token}`, nameDE: `Eigene ${token}`, type: 'custom', formula: '{units}' });
		keys.push(key.id);
		const id = await draft(key.id);
		await sendJson('PUT', `/api/v1/distribution-keys/${key.id}`, { formula: '{rooms}' });

		expect((await changes(id)).valuesChanged).toBe(true);
	});
});

describe('Nicht aktuelle Entwürfe mit geänderten Werten', () => {
	it('nennt in der Übersicht einen Entwurf nach einer danach korrigierten Fläche, mit dem Grund', async () => {
		const id = await draft();
		await otherApartment({ area: '140', rooms: '3.5' });

		const { statements: listed } = (await (await callApi('/api/v1/statements/outdated')).json()) as { statements: { id: string }[] };
		expect(listed.find((one) => one.id === id)).toMatchObject({ invoices: 0, fuelStock: false, values: true });
	});

	it('nennt in der Kostenabstimmung einen Entwurf nach einer danach korrigierten Fläche als nicht aktuell', async () => {
		const id = await draft();
		await otherApartment({ area: '140', rooms: '3.5' });

		const query = `buildingId=${rental.building}&periodStart=2024-01-01&periodEnd=2024-12-31`;
		const report = (await (await callApi(`/api/v1/reports/reconciliation?${query}`)).json()) as { notUpToDate: { id: string }[] };
		expect(report.notUpToDate.map((one) => one.id)).toEqual([id]);
	});
});

describe('Entwürfe mit geänderten Werten beim Erstellen und Versenden', () => {
	it('zählt einen Entwurf nach einer danach korrigierten Fläche nicht zu den Entwürfen zum Versenden', async () => {
		await draft();
		const toSend = async () => ((await (await callApi('/api/v1/dashboard')).json()) as { statements: { toSend: number } }).statements.toSend;
		const before = await toSend();
		await otherApartment({ area: '140', rooms: '3.5' });

		expect(await toSend()).toBe(before - 1);
	});

	it('nennt beim Erstellen der Abrechnungen den Entwurf mit dem Grund', async () => {
		const id = await draft();
		await otherApartment({ area: '140', rooms: '3.5' });

		const query = `buildingId=${rental.building}&periodStart=2024-01-01&periodEnd=2024-12-31&managementFeePercent=0`;
		const { statements: differing } = (await (await callApi(`/api/v1/statements/run-differences?${query}`)).json()) as { statements: { id: string }[] };
		expect(differing.find((one) => one.id === id)).toMatchObject({ outdated: false, fuelStock: false, values: true });
	});
});
