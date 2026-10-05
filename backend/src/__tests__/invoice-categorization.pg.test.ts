/**
 * Categorizing invoices: without a running KI, and overriding its suggestion with a reason (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
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
		const detail = (await (await callApi(`/api/v1/invoices/${invoice.id}`)).json()) as Invoice;
		expect(detail).toMatchObject({ categoryId: invoice.categoryId, llmCategoryId: null });
	});
});

describe('Kategorie der KI überschreiben', () => {
	it('speichert den Grund und gibt ihn mit der Rechnung zurück', async () => {
		const { categories } = (await (await callApi('/api/v1/categories?search=Repairs')).json()) as {
			categories: { id: string }[];
		};
		await sendJson('PUT', `/api/v1/invoices/${invoice.id}`, {
			llmCategoryId: invoice.categoryId,
			llmConfidence: '0.9'
		});

		const response = await sendJson('PUT', `/api/v1/invoices/${invoice.id}`, {
			categoryId: categories[0].id,
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
