/**
 * #1328 (PO A'): a draft is not current when, since it was created, an apartment of its building or a Verteilschlüssel
 * changed and «Neu berechnen» would therefore split it otherwise (real PostgreSQL database). Building with 2.01
 * (rented 1.1. to 31.3.2024) and 2.02, 70 m² and 3.5 Zimmer each; one Hauswart invoice of 2024, by Fläche unless a
 * test says otherwise
 */

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { apartments, categories, distributionKeys, invoices } from '../db/schema';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createDistributionKey, deleteDistributionKey } from '../services/distribution-key.service';
import { createHeatingProfile, deleteHeatingProfile, updateHeatingProfile } from '../services/heating-profile.service';
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

	// Fachreview 1328-1 V-1: an edit of the draft since does not make it current
	it('meldet die korrigierte Fläche auch, nachdem die Bemerkung des Entwurfs bearbeitet wurde', async () => {
		const id = await draft();
		await otherApartment({ area: '140', rooms: '3.5' });
		expect((await sendJson('PUT', `/api/v1/statements/${id}`, { notes: 'Danke' })).status).toBe(200);

		expect((await changes(id)).valuesChanged).toBe(true);
	});

	// #1328 (PO): deleting an apartment counts as a change of its building
	it('meldet eine danach gelöschte leere Wohnung des Gebäudes', async () => {
		const gone = (await createApartment({ buildingId: rental.building, number: '2.03', floor: 2, area: '70', rooms: '3.5' })).id;
		const id = await draft();
		expect((await callApi(`/api/v1/apartments/${gone}`, { method: 'DELETE' })).ok).toBe(true);

		expect((await changes(id)).valuesChanged).toBe(true);
	});

	// #1309 comment in #1328: a draft that split equally while its key could not be calculated; fixing the formula
	// makes it outdated, and as long as it cannot be recalculated this rule names nothing (Fachreview 1328-1 V-8)
	it('meldet einen Entwurf, dessen nicht berechenbarer Verteilschlüssel danach korrigiert wurde', async () => {
		await otherApartment({ area: '70', rooms: '5.5' });
		const key = await createDistributionKey({ name: `Kaputt ${token}`, nameDE: `Kaputt ${token}`, type: 'custom', formula: '{units}' });
		keys.push(key.id);
		const id = await draft(key.id); // split equally, as a key that could not be calculated did before #1221
		await db.update(distributionKeys).set({ formula: '1 / ({rooms} - 3.5)', updatedAt: new Date() }).where(eq(distributionKeys.id, key.id));
		expect((await changes(id)).valuesChanged).toBe(false);

		expect((await sendJson('PUT', `/api/v1/distribution-keys/${key.id}`, { formula: '{rooms}' })).status).toBe(200);
		expect((await changes(id)).valuesChanged).toBe(true);
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

// #1328 (Code-Review 1328-1 C-2): another key saved since says nothing about the draft
describe('Entwurf mit danach bearbeitetem Heizprofil', () => {
	const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
	const sharesOf = (pct: number[]) => Object.fromEntries(months.map((month, i) => [`${month}Pct`, String(pct[i])]));

	it('meldet keine geänderte Wohnung, wenn danach nur ein Verteilschlüssel gespeichert wurde, den der Entwurf nicht verwendet', async () => {
		const profile = await createHeatingProfile({ name: `Winter ${token}`, type: 'custom', ...sharesOf([18, 14, 11, 5, 2, 0, 0, 0, 2, 8, 14, 26]) } as Parameters<typeof createHeatingProfile>[0]);
		const unused = await createDistributionKey({ name: `Andere ${token}`, nameDE: `Andere ${token}`, type: 'custom', formula: '{units}' });
		keys.push(unused.id);
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await db.insert(invoices).values({
			buildingId: rental.building,
			categoryId: heating.id,
			distributionKeyId: await perAreaKey(),
			billingEntityName: 'Energie AG',
			description: `Heizöl ${token}`,
			amount: '1000.00',
			invoiceDate: '2024-12-31',
			servicePeriodStart: '2024-01-01',
			servicePeriodEnd: '2024-12-31',
			isValidUtilityCost: true
		});
		const created = await generateStatement({
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31',
			managementFeePercent: 0,
			heatingProfileId: profile.id
		});
		statements.push(created.id);
		await updateHeatingProfile(profile.id, sharesOf([8, 14, 11, 5, 2, 0, 0, 0, 2, 8, 14, 36]));
		expect((await sendJson('PUT', `/api/v1/distribution-keys/${unused.id}`, { formula: '{rooms}' })).status).toBe(200);

		const valuesChanged = (await changes(created.id)).valuesChanged;
		await clear();
		await deleteHeatingProfile(profile.id);
		expect(valuesChanged).toBe(false);
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
