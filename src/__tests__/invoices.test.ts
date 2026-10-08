import { describe, it, expect } from 'vitest';
import { load as listLoad } from '../routes/invoices/+page.server';
import { load as detailLoad } from '../routes/invoices/[id]/+page.server';
import { load as editLoad } from '../routes/invoices/[id]/edit/+page.server';
import { load as newLoad } from '../routes/invoices/new/+page.server';
import { suggestionProvenance } from '../lib/invoice';
import backendInvoice from '../../tests/contracts/invoice.json';

const API = 'http://localhost:3001/api/v1';

const caretaker = { id: 'c1', name: 'Caretaker', nameDE: 'Hauswart', isAllowedUtilityCost: true };
const repairs = { id: 'c2', name: 'Repairs', nameDE: 'Reparaturen', isAllowedUtilityCost: false };
const perArea = {
	id: 'k1',
	name: 'Per Area (m²)',
	nameDE: 'Pro Fläche (m²)',
	type: 'predefined',
	formula: '{area}'
};

// Backend invoice from the API contract (tests/contracts/invoice.json)
const invoice = (values: Record<string, unknown> = {}) => ({ ...backendInvoice, ...values });

// Fake backend: answers each path (without query) with its JSON, and records the requested URLs
function backend(answers: Record<string, unknown>) {
	const urls: string[] = [];
	const fetch = (async (url: string) => {
		urls.push(url);
		const path = url.replace(API, '').split('?')[0];
		return Response.json(answers[path] ?? {});
	}) as typeof globalThis.fetch;
	return { urls, fetch };
}

const listed = async (values: Record<string, unknown>) => {
	const { fetch } = backend({ '/invoices': { invoices: [invoice(values)], total: 1 } });
	const data = await listLoad({ url: new URL('http://localhost/invoices'), fetch } as never);
	return (data as { invoices: { categorizationStatus: string }[] }).invoices[0];
};

describe('Rechnungsliste', () => {
	it('filtert nach Umlagefähigkeit', async () => {
		const { urls, fetch } = backend({});

		await listLoad({ url: new URL('http://localhost/invoices?validity=invalid'), fetch } as never);

		expect(urls).toContainEqual(expect.stringMatching(/\/invoices\?.*isValidUtilityCost=false/));
	});

	it('zeigt Kategorien deutsch, in der Rechnung und im Filter', async () => {
		const { fetch } = backend({
			'/invoices': { invoices: [invoice()], total: 1 },
			'/categories': { categories: [caretaker] }
		});

		const data = (await listLoad({
			url: new URL('http://localhost/invoices'),
			fetch
		} as never)) as {
			invoices: { category: { name: string } }[];
			categories: { name: string }[];
		};

		expect(data.invoices[0].category.name).toBe('Hauswart');
		expect(data.categories.map((c) => c.name)).toEqual(['Hauswart']);
	});

	it('nennt eine selbst gewählte Kategorie manuell', async () => {
		expect((await listed({ llmCategoryId: null })).categorizationStatus).toBe('manual');
	});

	it('nennt eine von der KI übernommene Kategorie automatisch', async () => {
		expect((await listed({ llmCategoryId: 'c1' })).categorizationStatus).toBe('auto-categorized');
	});

	it('nennt eine Rechnung ohne Kategorie ausstehend', async () => {
		expect((await listed({ categoryId: null, category: null })).categorizationStatus).toBe(
			'pending'
		);
	});
});

describe('Rechnungsdetail', () => {
	it('zeigt Kategorie und Verteilschlüssel deutsch', async () => {
		const { fetch } = backend({ '/invoices/i1': invoice() });

		const { invoice: shown } = (await detailLoad({ params: { id: 'i1' }, fetch } as never)) as {
			invoice: { category?: { name: string }; distributionKey?: { name: string } };
		};

		expect(shown.category?.name).toBe('Hauswart');
		expect(shown.distributionKey?.name).toBe('Pro Fläche (m²)');
	});
});

describe('Ursprüngliche KI-Kategorisierung', () => {
	it('zeigt die Kategorie der KI deutsch, auch wenn die Rechnung inzwischen anders eingeordnet ist', async () => {
		const values = {
			categoryId: 'c2',
			category: repairs,
			llmCategoryId: 'c1',
			llmCategory: caretaker,
			wasManuallyOverridden: true
		};
		const { fetch } = backend({ '/invoices/i1': invoice(values) });

		const { invoice: shown } = (await detailLoad({ params: { id: 'i1' }, fetch } as never)) as {
			invoice: { llmCategory?: { name: string }; categorizationStatus: string };
		};

		expect(shown.llmCategory?.name).toBe('Hauswart');
		expect(shown.categorizationStatus).toBe('manual');
	});

	it('hält beim Erfassen fest, welche Kategorie die KI vorgeschlagen hat', () => {
		const suggestion = {
			category: { id: 'c1', name: 'Hauswart', isAllowedUtilityCost: true },
			confidence: 0.92,
			isAllowedUtilityCost: true
		};

		expect(suggestionProvenance(suggestion)).toEqual({
			llmCategoryId: 'c1',
			llmConfidence: '0.92'
		});
		expect(suggestionProvenance({ ...suggestion, category: null })).toEqual({});
		expect(suggestionProvenance(null)).toEqual({});
	});
});

describe('Rechnung erfassen und bearbeiten', () => {
	const answers = {
		'/invoices/i1': invoice(),
		'/buildings': { buildings: [] },
		'/categories': { categories: [caretaker, repairs] },
		'/distribution-keys': { data: [perArea] },
		'/invoices/llm-status': { llmAvailable: false },
		'/config/default_distribution_key_id': { value: 'k1' }
	};

	it('bietet Kategorien und Verteilschlüssel deutsch zur Auswahl an', async () => {
		for (const load of [newLoad, editLoad]) {
			const data = (await load({
				params: { id: 'i1' },
				fetch: backend(answers).fetch
			} as never)) as {
				categories: { name: string; isAllowedUtilityCost: boolean }[];
				distributionKeys: { name: string }[];
			};

			expect(data.categories.map((c) => [c.name, c.isAllowedUtilityCost])).toEqual([
				['Hauswart', true],
				['Reparaturen', false]
			]);
			expect(data.distributionKeys.map((k) => k.name)).toEqual(['Pro Fläche (m²)']);
		}
	});

	it('bietet alle Gebäude an, nicht nur die ersten 20', async () => {
		for (const load of [newLoad, editLoad]) {
			const { urls, fetch } = backend(answers);

			await load({ params: { id: 'i1' }, fetch } as never);

			expect(urls).toContain(`${API}/buildings?limit=100`);
		}
	});
});
