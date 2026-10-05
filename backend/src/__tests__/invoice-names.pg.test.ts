/**
 * Invoices name their category and distribution key in German as well (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, invoices } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';
import { invoicedBuilding } from './helpers/records';

type Named = { name: string; nameDE: string };
type Invoice = { id: string; buildingId: string; category: Named; distributionKey: Named; llmCategory: Named };

const token = crypto.randomUUID();
let removeBuilding = async () => {};

beforeAll(async () => {
	removeBuilding = await invoicedBuilding(`Rechnungshaus ${token}`, { description: `Hauswart ${token}` });
});

afterAll(async () => {
	await removeBuilding();
});

describe('Rechnungen', () => {
	it('nennen Kategorie und Verteilschlüssel auch deutsch, in der Liste und im Detail', async () => {
		const { invoices } = (await (await callApi(`/api/v1/invoices?search=${token}`)).json()) as { invoices: (Invoice & { id: string })[] };
		const detail = (await (await callApi(`/api/v1/invoices/${invoices[0].id}`)).json()) as Invoice;

		for (const invoice of [invoices[0], detail]) {
			expect(invoice.category).toMatchObject({ name: 'Caretaker', nameDE: 'Hauswart' });
			expect(invoice.distributionKey).toMatchObject({ name: 'Per Area (m²)', nameDE: 'Pro Fläche (m²)' });
		}
	});

	it('nennen die von der KI vorgeschlagene Kategorie auch deutsch', async () => {
		const { invoices: [{ id }] } = (await (await callApi(`/api/v1/invoices?search=${token}`)).json()) as { invoices: Invoice[] };
		const [caretaker] = await db.select().from(categories).where(eq(categories.name, 'Caretaker'));
		await db.update(invoices).set({ llmCategoryId: caretaker.id, llmConfidence: '0.9' }).where(eq(invoices.id, id));

		const detail = (await (await callApi(`/api/v1/invoices/${id}`)).json()) as Invoice;

		expect(detail.llmCategory).toMatchObject({ name: 'Caretaker', nameDE: 'Hauswart' });
	});

	it('behalten beim Erfassen, dass die Kategorie von der KI vorgeschlagen wurde', async () => {
		const { invoices: [existing] } = (await (await callApi(`/api/v1/invoices?search=${token}`)).json()) as { invoices: (Invoice & { categoryId: string })[] };
		const response = await sendJson('POST', '/api/v1/invoices', {
			buildingId: existing.buildingId,
			billingEntityName: `KI ${token}`,
			description: 'Hauswart Q2',
			amount: '300.00',
			invoiceDate: '2025-06-30',
			categoryId: existing.categoryId,
			llmCategoryId: existing.categoryId,
			llmConfidence: '0.92'
		});

		expect(response.status).toBe(201);
		expect(await response.json()).toMatchObject({ llmCategoryId: existing.categoryId, llmConfidence: '0.9200' });
	});
});
