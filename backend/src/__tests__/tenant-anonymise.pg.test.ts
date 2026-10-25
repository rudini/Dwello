/**
 * «Mieter anonymisieren» (#459, #332): a former tenant 10 years after the end of the year of the last contract end,
 * sent statement or reminder (Art. 958f Abs. 1, Art. 127 OR); Dwello removes name, contact data and documents, the
 * amounts stay; the statement PDFs go too (product owner 2026-10-22, Fachreview 459-B R-1)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { documents, rentalContracts, tenants, utilityStatements } from '../db/schema';
import { swissToday } from '../services/today';
import { callApi, sendJson } from './helpers/auth';
import { createRental } from './helpers/rental';

const rentals: Awaited<ReturnType<typeof createRental>>[] = [];
const rental = async (endDate?: string) => {
	const created = await createRental(crypto.randomUUID(), { startDate: '2010-01-01', endDate, monthlyAdvancePayment: '100' });
	rentals.push(created);
	return created;
};
const tenant = async (id: string) => (await (await callApi(`/api/v1/tenants/${id}`)).json()) as Record<string, unknown>;
const anonymise = (id: string) =>
	sendJson('POST', `/api/v1/tenants/${id}/anonymise`, { firstName: 'Anonymisierter', lastName: 'Mieter' });

let number = 0;
async function statement(of: Awaited<ReturnType<typeof rental>>, values: Partial<typeof utilityStatements.$inferInsert>) {
	await db.insert(utilityStatements).values({
		tenantId: of.tenant,
		apartmentId: of.apartment,
		contractId: of.contract,
		statementNumber: `NK-${crypto.randomUUID()}-${++number}`,
		periodStart: '2014-01-01',
		periodEnd: '2014-12-31',
		statementDate: '2015-03-01',
		rentalDays: 365,
		rentalStart: '2014-01-01',
		rentalEnd: '2014-12-31',
		totalCosts: '1200.00',
		totalAdvancePayments: '1000.00',
		balance: '200.00',
		...values
	});
}
const document = (of: Awaited<ReturnType<typeof rental>>, values: Partial<typeof documents.$inferInsert>) =>
	db.insert(documents).values({ tenantId: of.tenant, type: 'upload', title: 'Ausweiskopie', fileName: 'a.pdf', content: 'JVBERi0=', ...values });

afterAll(async () => {
	for (const { tenant: id, remove } of rentals) {
		await db.delete(documents).where(eq(documents.tenantId, id));
		await db.delete(utilityStatements).where(eq(utilityStatements.tenantId, id));
		await remove();
	}
});

describe('Ab wann ein Mieter anonymisiert werden kann', () => {
	it('nennt den 1. Januar nach 10 vollen Jahren seit dem Jahr, in dem der letzte Mietvertrag endete', async () => {
		const ended = await rental('2014-12-31');

		expect(await tenant(ended.tenant)).toMatchObject({ anonymisableFrom: '2025-01-01', anonymisedOn: null });
	});

	it('zählt die letzte versendete Abrechnung und die letzte Mahnung, nicht einen Entwurf', async () => {
		const ended = await rental('2014-12-31');
		await statement(ended, { status: 'sent', statementDate: '2016-03-10' });
		await statement(ended, { status: 'draft', statementDate: '2030-01-10', periodStart: '2015-01-01', periodEnd: '2015-12-31' });
		expect(await tenant(ended.tenant)).toMatchObject({ anonymisableFrom: '2027-01-01' });

		// 31.12.2017 23:30 UTC is 1 January 2018 in Switzerland
		await document(ended, { type: 'reminder', status: 'sent', sentAt: new Date('2017-12-31T23:30:00Z') });
		expect(await tenant(ended.tenant)).toMatchObject({ anonymisableFrom: '2029-01-01' });
	});

	// review p5be2 C-2: every statement that went out counts, also a paid or replaced one, only a draft not
	it('zählt auch eine bezahlte oder ersetzte Abrechnung', async () => {
		const ended = await rental('2014-12-31');
		await statement(ended, { status: 'paid', statementDate: '2016-03-10' });
		await statement(ended, { status: 'replaced', statementDate: '2018-03-10', periodStart: '2015-01-01', periodEnd: '2015-12-31' });

		expect(await tenant(ended.tenant)).toMatchObject({ anonymisableFrom: '2029-01-01' });
	});

	it('nennt keinen Tag, solange ein Mietvertrag läuft', async () => {
		const running = await rental();

		expect(await tenant(running.tenant)).toMatchObject({ anonymisableFrom: null });
	});
});

describe('Mieter anonymisieren', () => {
	it('verweigert es vor dem ersten möglichen Tag und ändert nichts', async () => {
		const recent = await rental('2019-12-31');

		const response = await anonymise(recent.tenant);

		expect(response.status).toBe(409);
		expect(await response.json()).toMatchObject({ code: 'TENANT_ANONYMISE_TOO_EARLY', params: { date: '2030-01-01' } });
		expect(await tenant(recent.tenant)).toMatchObject({ firstName: 'Anna', anonymisedOn: null });
	});

	it('verweigert es bei einem Mieter mit laufendem Mietvertrag', async () => {
		const running = await rental();

		const response = await anonymise(running.tenant);

		expect(response.status).toBe(409);
		expect(await response.json()).toMatchObject({ code: 'TENANT_NOT_FORMER' });
	});

	it('entfernt Name, Kontaktdaten, Dokumente und die PDFs der Abrechnungen; die Beträge bleiben', async () => {
		const ended = await rental('2014-12-31');
		await db
			.update(tenants)
			.set({ email: 'anna@example.ch', phone: '079 000 00 00', address: 'Testweg 1', postalCode: '8400', city: 'Winterthur' })
			.where(eq(tenants.id, ended.tenant));
		await db.update(rentalContracts).set({ notes: 'Anna Keller zog nach Bern', contractPdf: 'JVBERi0=' }).where(eq(rentalContracts.id, ended.contract));
		await statement(ended, { status: 'paid', pdfBlob: 'JVBERi0=', notes: 'Anna Keller zahlte bar' });
		await document(ended, { type: 'upload' });
		await document(ended, { type: 'reminder', status: 'sent', sentAt: new Date('2015-05-01T08:00:00Z') });
		await document(ended, { type: 'statement', status: 'sent', title: 'Abrechnung 2014' });

		expect((await anonymise(ended.tenant)).status).toBe(200);

		expect(await tenant(ended.tenant)).toMatchObject({
			firstName: 'Anonymisierter',
			lastName: 'Mieter',
			email: null,
			phone: null,
			address: null,
			postalCode: null,
			city: null,
			anonymisedOn: swissToday(),
			anonymisableFrom: null
		});
		expect(await db.select().from(documents).where(eq(documents.tenantId, ended.tenant))).toEqual([]);
		const [billed] = await db.select().from(utilityStatements).where(eq(utilityStatements.tenantId, ended.tenant));
		expect(billed).toMatchObject({ balance: '200.00', totalCosts: '1200.00', status: 'paid', pdfBlob: null, notes: null });
		const [contract] = await db.select().from(rentalContracts).where(eq(rentalContracts.id, ended.contract));
		expect(contract).toMatchObject({ notes: null, contractPdf: null, endDate: '2014-12-31' });
	});
});
