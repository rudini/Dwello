import { afterAll, describe, expect, it } from 'bun:test';
import { callApi } from './helpers/auth';
import { insertInvoice, invoicedBuilding } from './helpers/records';
import { sendJson } from './helpers/auth';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoices } from '../db/schema';
import { createBuilding, deleteBuilding } from '../services/building.service';

// #1410: the invoice names until when it must be kept, for the confirmation to delete it
describe('Aufbewahrungsfrist einer Rechnung', () => {
	const removals: (() => Promise<void>)[] = [];
	afterAll(async () => {
		for (const remove of removals) await remove();
	});
	const keepUntilOf = async (invoiceDate: string) => {
		const name = `Aufbewahrung ${crypto.randomUUID()}`;
		removals.push(await invoicedBuilding(name, { invoiceDate }));
		const { invoices } = (await (
			await callApi(`/api/v1/invoices?search=${encodeURIComponent('Muster AG')}&limit=1000`)
		).json()) as {
			invoices: { id: string; building: { name: string } }[];
		};
		const id = invoices.find((i) => i.building.name === name)!.id;
		const invoice = (await (await callApi(`/api/v1/invoices/${id}`)).json()) as {
			keepUntil: string | null;
		};
		return invoice.keepUntil;
	};

	it('GET /invoices/:id nennt das Ende der Aufbewahrungsfrist', async () => {
		expect(await keepUntilOf('2024-03-31')).toBe('2034-12-31');
	});

	it('GET /invoices/:id nennt nach Ablauf der Aufbewahrungsfrist kein Ende mehr', async () => {
		expect(await keepUntilOf('2015-06-30')).toBeNull();
	});
});

// #1410 (Entscheid PO): je Gebäude und Abrechnungsperiode eine Aufgabe, sobald die Aufbewahrungsfrist vorbei ist
describe('Rechnungen nach Ablauf der Aufbewahrungsfrist', () => {
	type Expired = {
		buildingId: string;
		building: string;
		start: string;
		end: string;
		keepUntil: string;
		count: number;
	};
	const expired = async (buildingId: string) =>
		((await (await callApi('/api/v1/invoices/retention')).json()) as Expired[]).filter(
			(p) => p.buildingId === buildingId
		);
	const removals: (() => Promise<void>)[] = [];
	afterAll(async () => {
		for (const remove of removals) await remove();
	});
	const building = async () => {
		const created = await createBuilding({
			name: `Aufbewahrung ${crypto.randomUUID()}`,
			address: 'Testweg 1',
			postalCode: '8400',
			city: 'Winterthur',
			canton: 'ZH'
		});
		removals.push(async () => {
			await db.delete(invoices).where(eq(invoices.buildingId, created.id));
			await deleteBuilding(created.id);
		});
		return created;
	};

	it('nennt die Abrechnungsperioden, deren Aufbewahrungsfrist vorbei ist, mit der Zahl ihrer Rechnungen', async () => {
		const { id, name } = await building();
		await insertInvoice(id, { invoiceDate: '2014-03-31' });
		await insertInvoice(id, { invoiceDate: '2014-09-30' });
		await insertInvoice(id, { invoiceDate: '2024-03-31' }); // noch aufzubewahren
		expect(await expired(id)).toEqual([
			{
				buildingId: id,
				building: name,
				start: '2014-01-01',
				end: '2014-12-31',
				keepUntil: '2024-12-31',
				count: 2
			}
		]);
	});

	it('nennt eine behaltene Abrechnungsperiode nicht mehr', async () => {
		const { id } = await building();
		await insertInvoice(id, { invoiceDate: '2014-03-31' });
		await insertInvoice(id, { invoiceDate: '2013-03-31' });
		const kept = await sendJson('POST', '/api/v1/invoices/retention/kept', {
			buildingId: id,
			periodStart: '2014-01-01'
		});
		expect(kept.status).toBe(200);
		expect((await expired(id)).map((p) => p.start)).toEqual(['2013-01-01']);
	});
});
