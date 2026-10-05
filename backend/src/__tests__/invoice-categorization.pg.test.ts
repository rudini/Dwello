/**
 * Categorizing invoices: without a running KI, and overriding its suggestion with a reason (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, invoices } from '../db/schema';
import { llmConfig } from '../config/llm';
import { callApi, sendJson } from './helpers/auth';
import { expectRejection, invoicedBuilding } from './helpers/records';

type Invoice = {
	id: string;
	categoryId: string;
	llmCategoryId: string | null;
	manualOverrideReason: string | null;
};

const token = crypto.randomUUID();
const ollamaUrl = llmConfig.baseUrl;
let removeBuilding = async () => {};
let invoice: Invoice;

beforeAll(async () => {
	// Nothing listens on port 9: the KI does not run, as in the test environment
	llmConfig.baseUrl = 'http://127.0.0.1:9';
	removeBuilding = await invoicedBuilding(`Kategorienhaus ${token}`, {
		description: `Hauswart ${token}`
	});
	const response = await callApi(`/api/v1/invoices?search=${token}`);
	[invoice] = ((await response.json()) as { invoices: Invoice[] }).invoices;
});

afterAll(async () => {
	llmConfig.baseUrl = ollamaUrl;
	await removeBuilding();
});

describe('Neu kategorisieren', () => {
	it('meldet, dass die KI nicht kategorisieren konnte, und lässt die Rechnung unverändert', async () => {
		const response = await callApi(`/api/v1/invoices/${invoice.id}/recategorize`, {
			method: 'POST'
		});

		await expectRejection(
			response,
			503,
			'Die KI ist nicht erreichbar oder hat keine passende Kategorie geliefert.'
		);
		const [stored] = await db.select().from(invoices).where(eq(invoices.id, invoice.id));
		expect(stored.llmCategoryId).toBeNull();
		expect(stored.categoryId).toBe(invoice.categoryId);
	});
});

describe('Kategorie der KI überschreiben', () => {
	it('speichert den Grund und gibt ihn mit der Rechnung zurück', async () => {
		const [repairs] = await db.select().from(categories).where(eq(categories.name, 'Repairs'));
		await db
			.update(invoices)
			.set({ llmCategoryId: invoice.categoryId })
			.where(eq(invoices.id, invoice.id));

		const response = await sendJson('PUT', `/api/v1/invoices/${invoice.id}`, {
			categoryId: repairs.id,
			manualOverrideReason: 'Reparatur, keine Wartung'
		});

		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({
			wasManuallyOverridden: true,
			manualOverrideReason: 'Reparatur, keine Wartung'
		});
		const detail = (await (await callApi(`/api/v1/invoices/${invoice.id}`)).json()) as Invoice;
		expect(detail.manualOverrideReason).toBe('Reparatur, keine Wartung');
	});
});
