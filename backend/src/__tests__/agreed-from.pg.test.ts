/**
 * #368 (#407 point 3): «Vereinbart ab», a category agreed in a Mietvertrag only from a day, e.g. introduced with the
 * official form (Art. 269d Abs. 3 OR); the statement bills it only for the contract's days from then, by the same rule
 * as the Mietstage (real PostgreSQL database)
 *
 * Apartment 2.01 alone in the building, caretaker invoice CHF 1000 and lift invoice CHF 366 by area, 2024 (366 days).
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, heatingProfiles, invoices, utilityStatements } from '../db/schema';
import { deleteConfig, getConfig, setConfig } from '../services/config.service';
import { generateStatementPdf, getStatementPdf } from '../services/statement-pdf.service';
import { readPdf } from './helpers/pdf-text';
import { callApi, sendJson } from './helpers/auth';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
const ids: Record<string, string> = {};

const period = { periodStart: '2024-01-01', periodEnd: '2024-12-31' };
const preview = async () =>
	(await (await sendJson('POST', '/api/v1/statements/preview', { contractId: rental.contract, ...period, managementFeePercent: 0 })).json()) as {
		totalCosts: number;
		lineItems: { categoryId: string; tenantShare: number }[];
	};
const contract = async () =>
	(await (await callApi(`/api/v1/contracts/${rental.contract}`)).json()) as { agreedCategoryIds: string[]; agreedFrom: Record<string, string> };
const answer = (body: Record<string, unknown>) => sendJson('PUT', `/api/v1/contracts/${rental.contract}/agreements`, body);

beforeAll(async () => {
	const named = await db.select().from(categories).where(inArray(categories.name, ['Caretaker', 'Elevator']));
	for (const category of named) ids[category.name] = category.id;
	rental = await createRental(token, { startDate: '2020-01-01', monthlyAdvancePayment: '0' });
	await insertInvoice(rental.building, { amount: '1000.00', invoiceDate: '2024-06-30' });
	await insertInvoice(rental.building, { categoryId: ids.Elevator, description: 'Lift 2024', amount: '366.00', invoiceDate: '2024-06-30' });
});

afterAll(async () => {
	await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
});

describe('Vereinbart ab', () => {
	it('rechnet eine ab einem Tag vereinbarte Kategorie nur für die Tage ab dann ab', async () => {
		expect((await answer({ categoryId: ids.Elevator, agreed: true, from: '2024-10-01' })).status).toBe(200);

		expect((await contract()).agreedFrom).toEqual({ [ids.Elevator]: '2024-10-01' });
		const { totalCosts, lineItems } = await preview();
		expect(lineItems.find((item) => item.categoryId === ids.Elevator)?.tenantShare).toBe(92); // 366 × 92 / 366
		expect(totalCosts).toBe(1092);
	});

	it('rechnet sie nicht ab, wenn der Tag nach dem Ende der Periode liegt', async () => {
		await answer({ categoryId: ids.Elevator, agreed: true, from: '2025-04-01' });

		const { totalCosts, lineItems } = await preview();
		expect(totalCosts).toBe(1000);
		expect(lineItems.map((item) => item.categoryId)).not.toContain(ids.Elevator);
	});

	it('speichert den Tag mit dem Mietvertrag und vergisst ihn bei «Nicht vereinbart»', async () => {
		const saved = await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, {
			agreedCategoryIds: [ids.Caretaker, ids.Elevator],
			agreedFrom: { [ids.Elevator]: '2024-07-01' }
		});

		expect(saved.status).toBe(200);
		expect((await contract()).agreedFrom).toEqual({ [ids.Elevator]: '2024-07-01' });
		expect((await preview()).totalCosts).toBe(1184); // 366 × 184 / 366

		await answer({ categoryId: ids.Elevator, agreed: false });
		expect((await contract()).agreedFrom).toEqual({});
	});

	it('hält die Tage mit der erstellten Abrechnung fest', async () => {
		await answer({ categoryId: ids.Elevator, agreed: true, from: '2024-10-01' });
		const created = await sendJson('POST', '/api/v1/statements/generate', {
			contractId: rental.contract,
			buildingId: rental.building,
			...period,
			managementFeePercent: 0
		});
		const { id } = (await created.json()) as { id: string };

		const [statement] = await db.select().from(utilityStatements).where(eq(utilityStatements.id, id));
		expect(statement.agreedFrom).toEqual({ [ids.Elevator]: '2024-10-01' });
		expect(Number(statement.totalCosts)).toBe(1092);

		// Fachreview 368-B M-1: the PDF names the day and says the days count from it, not as the Mietstage
		const iban = await getConfig('iban');
		await setConfig('iban', 'CH4431999123000889012');
		await generateStatementPdf(id, 'de');
		const text = readPdf(Buffer.from((await getStatementPdf(id)).pdfBlob!, 'base64')).flowing;
		await (iban ? setConfig('iban', iban) : deleteConfig('iban'));
		expect(text).toContain('Abgerechnet sind nur die im Mietvertrag vereinbarten Nebenkosten: Hauswart, Lift (ab 01.10.2024).');
		expect(text).toContain('Ist eine Kategorie erst ab einem Tag vereinbart (unten bei den vereinbarten Nebenkosten mit «ab» genannt), zählen nur Ihre Mietstage ab diesem Tag; bei Heizkosten die Monate des Heizprofils ab diesem Tag.');
	});

	it('lehnt einen Tag vor dem Vertragsbeginn ab', async () => {
		const refused = await answer({ categoryId: ids.Elevator, agreed: true, from: '2019-12-31' });

		expect(refused.status).toBe(400);
		expect(await refused.json()).toMatchObject({ code: 'AGREED_FROM_BEFORE_START' });
		// the day of the Vertragsbeginn itself means the same as no day
		expect((await answer({ categoryId: ids.Elevator, agreed: true, from: '2020-01-01' })).status).toBe(200);
	});
});

// Fachreview 368-B M-2, V-5: a day after the Vertragsende; Heizkosten by the Heizprofil and a credit from a day
describe('Vereinbart ab: Heizprofil, Gutschrift und Vertragsende', () => {
	let heated: Awaited<ReturnType<typeof createRental>>;
	let heatingId: string;
	let profile: typeof heatingProfiles.$inferSelect;
	const months = ['october', 'november', 'december'] as const;

	beforeAll(async () => {
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		heatingId = heating.id;
		[profile] = await db.select().from(heatingProfiles).limit(1);
		heated = await createRental(crypto.randomUUID(), { startDate: '2020-01-01', endDate: '2025-06-30', monthlyAdvancePayment: '0' });
		await insertInvoice(heated.building, { categoryId: heatingId, description: 'Heizöl 2024', amount: '1000.00', invoiceDate: '2024-03-31' });
		await insertInvoice(heated.building, { categoryId: ids.Elevator, description: 'Lift 2024', amount: '366.00', invoiceDate: '2024-06-30' });
		await insertInvoice(heated.building, { categoryId: ids.Elevator, description: 'Gutschrift Lift', amount: '-183.00', invoiceDate: '2024-08-31' });
	});

	afterAll(async () => {
		await db.delete(invoices).where(eq(invoices.buildingId, heated.building));
		await heated.remove();
	});

	const items = async () =>
		(
			(await (
				await sendJson('POST', '/api/v1/statements/preview', {
					contractId: heated.contract,
					...period,
					heatingProfileId: profile.id,
					managementFeePercent: 0
				})
			).json()) as { lineItems: { categoryId: string; tenantShare: number }[] }
		).lineItems;
	const put = (body: Record<string, unknown>) => sendJson('PUT', `/api/v1/contracts/${heated.contract}/agreements`, body);

	it('rechnet Heizkosten ab einem Tag nach den Monaten des Heizprofils ab diesem Tag', async () => {
		await put({ categoryId: heatingId, agreed: true, from: '2024-10-01' });

		const share = months.reduce((sum, month) => sum + Number(profile[`${month}Pct`]), 0);
		expect((await items()).find((item) => item.categoryId === heatingId)?.tenantShare).toBe(Math.round(1000 * share) / 100);
	});

	// code review 368-B C-1: the profile's share kept with the statement, as the PDF prints it, counts from the day too
	it('hält den Heizanteil ab diesem Tag mit der erstellten Abrechnung fest', async () => {
		await put({ categoryId: heatingId, agreed: true, from: '2024-10-01' });
		const created = await sendJson('POST', '/api/v1/statements/generate', {
			contractId: heated.contract,
			buildingId: heated.building,
			...period,
			heatingProfileId: profile.id,
			managementFeePercent: 0
		});
		const { id } = (await created.json()) as { id: string };

		const [statement] = await db.select().from(utilityStatements).where(eq(utilityStatements.id, id));
		await db.delete(utilityStatements).where(eq(utilityStatements.id, id));
		const share = months.reduce((sum, month) => sum + Number(profile[`${month}Pct`]), 0);
		expect(statement.heatingShare).toMatchObject({ byDays: false, percent: Math.round(share * 100) / 100 });
	});

	it('rechnet auch eine Gutschrift nur ab diesem Tag ab', async () => {
		await put({ categoryId: ids.Elevator, agreed: true, from: '2024-10-01' });

		expect((await items()).find((item) => item.categoryId === ids.Elevator)?.tenantShare).toBe(46); // 183 × 92 / 366
	});

	it('lehnt einen Tag nach dem Vertragsende ab', async () => {
		const refused = await put({ categoryId: ids.Elevator, agreed: true, from: '2025-07-01' });

		expect(refused.status).toBe(400);
		expect(await refused.json()).toMatchObject({ code: 'AGREED_FROM_AFTER_END' });
	});
});
