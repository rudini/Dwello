import { afterAll, afterEach, describe, expect, it, setSystemTime } from 'bun:test';
import { callApi } from './helpers/auth';
import { insertInvoice, invoicedBuilding } from './helpers/records';
import { sendJson } from './helpers/auth';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { buildings, categories, invoices } from '../db/schema';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { generateStatement } from '../services/statement-generation.service';
import { deleteStatement } from '../services/statement.service';
import { createRental } from './helpers/rental';

// #1410: the invoice names until when it must be kept, for the confirmation to delete it
describe('Aufbewahrungsfrist einer Rechnung', () => {
	const removals: (() => Promise<void>)[] = [];
	afterAll(async () => {
		for (const remove of removals) await remove();
	});
	const keepUntilOf = async (invoiceDate: string, categoryId?: string) => {
		const name = `Aufbewahrung ${crypto.randomUUID()}`;
		removals.push(await invoicedBuilding(name, { invoiceDate, ...(categoryId && { categoryId }) }));
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

	// code review 1410-2 C-1: die Abrechnungsperiode des Gebäudes zählt
	it('GET /invoices/:id zählt bei Juli bis Juni ab dem Ende der Abrechnungsperiode des Gebäudes', async () => {
		const name = `Aufbewahrung ${crypto.randomUUID()}`;
		removals.push(await invoicedBuilding(name, { invoiceDate: '2024-07-15' }));
		await db
			.update(buildings)
			.set({ accountingPeriod: 'july-june' })
			.where(eq(buildings.name, name));
		const { invoices: listed } = (await (
			await callApi(`/api/v1/invoices?search=${encodeURIComponent('Muster AG')}&limit=1000`)
		).json()) as {
			invoices: { id: string; building: { name: string } }[];
		};
		const id = listed.find((i) => i.building.name === name)!.id;
		expect(
			((await (await callApi(`/api/v1/invoices/${id}`)).json()) as { keepUntil: string }).keepUntil
		).toBe('2035-12-31');
	});

	// Fachreview 1410-1 V-2 (Entscheid PO): sie belegen die Anlagekosten bei der Grundstückgewinnsteuer
	it('GET /invoices/:id nennt bei wertvermehrenden Investitionen den Verkauf des Gebäudes', async () => {
		expect(await keepUntilOf('2015-06-30', await investments())).toBe('sale');
	});
});

const investments = async () =>
	(await db.select().from(categories).where(eq(categories.name, 'Capital Improvements')))[0].id;

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
		(
			(await (await callApi('/api/v1/invoices/retention')).json()) as { periods: Expired[] }
		).periods.filter((p) => p.buildingId === buildingId);
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

	it('zählt Rechnungen für wertvermehrende Investitionen nicht', async () => {
		const { id } = await building();
		await insertInvoice(id, {
			invoiceDate: '2014-03-31',
			categoryId: await investments(),
			isValidUtilityCost: false
		});
		await insertInvoice(id, { invoiceDate: '2013-03-31' });
		expect((await expired(id)).map((p) => [p.start, p.count])).toEqual([['2013-01-01', 1]]);
	});

	// Fachreview 1410-2 V-6: die Aufgabe nennt eine Rechnung in der Abrechnungsperiode, in der ihre Liste sie zeigt
	describe('an einem anderen Tag', () => {
		afterEach(() => setSystemTime());

		it('nennt eine nach dem Leistungszeitraum gestellte Rechnung bei der Periode ihres Leistungszeitraums', async () => {
			setSystemTime(new Date('2027-01-15T12:00:00Z'));
			const { id } = await building();
			await insertInvoice(id, {
				invoiceDate: '2016-02-15',
				servicePeriodStart: '2015-01-01',
				servicePeriodEnd: '2015-12-31'
			});
			expect((await expired(id)).map((p) => [p.start, p.keepUntil, p.count])).toEqual([
				['2015-01-01', '2026-12-31', 1]
			]);
		});

		it('nennt eine Rechnung erst, wenn ihre eigene Aufbewahrungsfrist vorbei ist', async () => {
			setSystemTime(new Date('2026-06-15T12:00:00Z'));
			const { id } = await building();
			await insertInvoice(id, { invoiceDate: '2015-06-30' });
			await insertInvoice(id, {
				invoiceDate: '2016-02-15',
				servicePeriodStart: '2015-01-01',
				servicePeriodEnd: '2015-12-31'
			});
			expect((await expired(id)).map((p) => [p.start, p.keepUntil, p.count])).toEqual([
				['2015-01-01', '2025-12-31', 1]
			]);
		});

		// code review 1410-3 C-1
		it('antwortet auch am 29. Februar', async () => {
			setSystemTime(new Date('2028-02-29T12:00:00Z'));
			expect((await callApi('/api/v1/invoices/retention')).status).toBe(200);
		});
	});

	// code review 1410-3 C-3
	it('behält die Rechnungen eines Gebäudes, das es nicht gibt, nicht', async () => {
		const kept = await sendJson('POST', '/api/v1/invoices/retention/kept', {
			buildingId: crypto.randomUUID(),
			periodStart: '2014-01-01'
		});
		expect(kept.status).toBe(404);
		expect(((await kept.json()) as { code: string }).code).toBe('BUILDING_NOT_FOUND');
	});
});

// Fachreview 1410-1 V-3 (Entscheid PO): wer nach der Aufbewahrungsfrist löscht, macht alte Abrechnungen nicht «nicht aktuell»
describe('Gelöschte Rechnung nach Ablauf der Aufbewahrungsfrist', () => {
	let rental: Awaited<ReturnType<typeof createRental>>;
	const statements: string[] = [];
	afterAll(async () => {
		for (const id of statements) await deleteStatement(id);
		await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
		await rental.remove();
	});
	const changed = async (id: string) =>
		(
			(await (await callApi(`/api/v1/statements/${id}/changed-invoices`)).json()) as {
				invoiceIds: string[];
			}
		).invoiceIds;
	const billedAndDeleted = async (year: number) => {
		await insertInvoice(rental.building, { invoiceDate: `${year}-12-31` });
		const { id } = await generateStatement({
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: `${year}-01-01`,
			periodEnd: `${year}-12-31`,
			managementFeePercent: 0
		});
		statements.push(id);
		await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
		return id;
	};

	it('macht die Abrechnung, die sie abrechnete, nicht «nicht aktuell»', async () => {
		rental = await createRental(crypto.randomUUID(), {
			startDate: '2014-01-01',
			endDate: '2024-12-31',
			monthlyAdvancePayment: '0'
		});
		expect(await changed(await billedAndDeleted(2014))).toEqual([]);
	});

	// code review 1410-3 C-2, Fachreview 1410-2 V-3b: nur gelöschte Rechnungen
	it('meldet eine danach nicht mehr umlagefähige Rechnung nach der Aufbewahrungsfrist weiter', async () => {
		await insertInvoice(rental.building, { invoiceDate: '2015-12-31' });
		const { id } = await generateStatement({
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: '2015-01-01',
			periodEnd: '2015-12-31',
			managementFeePercent: 0
		});
		statements.push(id);
		await db
			.update(invoices)
			.set({ isValidUtilityCost: false })
			.where(eq(invoices.buildingId, rental.building));
		expect(await changed(id)).toHaveLength(1);
		await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	});

	it('macht eine Abrechnung innerhalb der Aufbewahrungsfrist weiter «nicht aktuell»', async () => {
		expect(await changed(await billedAndDeleted(2024))).toHaveLength(1);
	});
});
