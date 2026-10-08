/**
 * Categorizing invoices: without a running KI, and overriding its suggestion with a reason (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { llmConfig } from '../config/llm';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { createInvoice, deleteInvoice } from '../services/invoice.service';
import { callApi, sendJson } from './helpers/auth';
import { expectRejection, invoicedBuilding } from './helpers/records';

type Invoice = {
	id: string;
	categoryId: string;
	llmCategoryId: string | null;
	manualOverrideReason: string | null;
};

const token = crypto.randomUUID();
const configured = { ...llmConfig };

// A provider with an OpenAI-compatible API that only answers with the configured key; like OpenAI's
// reasoning models it rejects max_tokens and a temperature other than the default
function openAiCompatible(answer: object) {
	const server = Bun.serve({
		port: 0,
		fetch: async (request) => {
			if (request.headers.get('authorization') !== 'Bearer test-key') return new Response(null, { status: 401 });
			const path = new URL(request.url).pathname;
			if (path === '/v1/models') return Response.json({ data: [{ id: 'test-model' }] });
			if (path !== '/v1/chat/completions') return new Response(null, { status: 404 });
			const body = (await request.json()) as object;
			if ('max_tokens' in body || 'temperature' in body) return new Response(null, { status: 400 });
			return Response.json({ choices: [{ message: { role: 'assistant', content: JSON.stringify(answer) } }] });
		}
	});
	Object.assign(llmConfig, { baseUrl: `http://127.0.0.1:${server.port}/v1`, apiKey: 'test-key' });
	return {
		stop: () => {
			server.stop();
			Object.assign(llmConfig, { baseUrl: 'http://127.0.0.1:9', apiKey: '' });
		}
	};
}
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
	Object.assign(llmConfig, configured);
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

describe('Kategorie der KI für eine neue Rechnung', () => {
	// Ob Kosten umlagefähig sind, entscheidet die Kategorie (OR 257a), nicht die Einschätzung der KI
	it('legt eine Reparatur nicht auf die Mieter um, auch wenn die KI sie für umlagefähig hält', async () => {
		// OpenAI-kompatibler Anbieter an der Systemgrenze ersetzt: antwortet sicher mit "Repairs", aber umlagefähig
		const llm = openAiCompatible({ category: 'Repairs', confidence: 0.95, isAllowedUtilityCost: true });
		const building = await createBuilding({
			name: `KI-Haus ${token}`,
			address: 'Testweg 1',
			postalCode: '8400',
			city: 'Winterthur',
			canton: 'ZH'
		});
		try {
			const invoice = await createInvoice({
				buildingId: building.id,
				billingEntityName: 'Sanitär Meier',
				description: `Leck Steigleitung ${token}`,
				amount: '800.00',
				invoiceDate: '2025-05-12'
			});
			await deleteInvoice(invoice.id);

			expect(invoice.category?.name).toBe('Repairs');
			expect(invoice.isValidUtilityCost).toBe(false);
		} finally {
			llm.stop();
			await deleteBuilding(building.id);
		}
	});
});

describe('KI-Anbieter', () => {
	it('gilt als erreichbar, wenn der konfigurierte Anbieter mit dem API-Key antwortet', async () => {
		const llm = openAiCompatible({});
		try {
			const status = await (await callApi('/api/v1/invoices/llm-status')).json();

			expect(status).toMatchObject({ llmAvailable: true });
		} finally {
			llm.stop();
		}
	});
});

describe('Kategorie von Hand', () => {
	// Nicht umlagefähige Kosten (OR 257a) bleiben bei den Eigentümern, auch wenn das Formular anderes schickt
	const repairs = async () =>
		((await (await callApi('/api/v1/categories?search=Repairs')).json()) as { categories: { id: string }[] }).categories[0].id;

	it('lässt eine Rechnung beim Ändern in einer nicht umlagefähigen Kategorie nicht umlagefähig werden', async () => {
		const response = await sendJson('PUT', `/api/v1/invoices/${invoice.id}`, {
			categoryId: await repairs(),
			isValidUtilityCost: true
		});

		expect(await response.json()).toMatchObject({ isValidUtilityCost: false });
	});

	it('lässt eine Rechnung einer nicht umlagefähigen Kategorie nicht umlagefähig werden, wenn nur das Häkchen ändert', async () => {
		await sendJson('PUT', `/api/v1/invoices/${invoice.id}`, { categoryId: await repairs() });

		const response = await sendJson('PUT', `/api/v1/invoices/${invoice.id}`, { isValidUtilityCost: true });

		expect(await response.json()).toMatchObject({ isValidUtilityCost: false });
	});

	it('erfasst eine Rechnung einer nicht umlagefähigen Kategorie als nicht umlagefähig', async () => {
		const { buildingId } = (await (await callApi(`/api/v1/invoices/${invoice.id}`)).json()) as { buildingId: string };
		const response = await sendJson('POST', '/api/v1/invoices', {
			buildingId,
			billingEntityName: `Sanitär ${token}`,
			description: 'Leck Steigleitung',
			amount: '800.00',
			invoiceDate: '2025-05-12',
			categoryId: await repairs(),
			isValidUtilityCost: true
		});

		expect(await response.json()).toMatchObject({ isValidUtilityCost: false });
	});
});
