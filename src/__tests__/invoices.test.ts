import { describe, it, expect } from 'vitest';
import { load as listLoad } from '../routes/invoices/+page.server';
import { load as detailLoad } from '../routes/invoices/[id]/+page.server';
import { load as editLoad } from '../routes/invoices/[id]/edit/+page.server';
import { load as newLoad } from '../routes/invoices/new/+page.server';
import { localPath, suggestionProvenance, validateInvoice } from '../lib/invoice';
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

	it('zeigt die Rechnungen eines Jahres und bietet die letzten Jahre zur Auswahl an', async () => {
		const { urls, fetch } = backend({});

		const data = (await listLoad({
			url: new URL('http://localhost/invoices?year=2024'),
			fetch
		} as never)) as { years: string[] };

		expect(urls).toContainEqual(
			expect.stringMatching(/\/invoices\?.*dateFrom=2024-01-01.*dateTo=2024-12-31/)
		);
		const thisYear = new Date().getFullYear();
		expect(data.years[0]).toBe(String(thisYear));
		expect(data.years).toContain(String(thisYear - 5));
	});

	// Wie in den anderen Listen: ?building= kommt z. B. vom Mietvertrag
	it('filtert nach dem Gebäude aus der Adresse', async () => {
		const { urls, fetch } = backend({});

		await listLoad({ url: new URL('http://localhost/invoices?building=b1'), fetch } as never);

		expect(urls).toContainEqual(expect.stringMatching(/\/invoices\?.*buildingId=b1/));
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

	// Wer eine schon abgerechnete Rechnung ändert oder löscht, verschiebt Kosten zwischen den Perioden
	describe('Perioden mit Abrechnungen, die diese Rechnung enthalten', () => {
		// the invoice (contract sample) was recorded on 1.4.2026 and dates from 31.3.2026 (Leistungszeitraum Q1 2026)
		const statements = [
			{ periodStart: '2026-01-01', periodEnd: '2026-12-31', createdAt: '2026-05-01T08:00:00.000Z' },
			{ periodStart: '2026-01-01', periodEnd: '2026-12-31', createdAt: '2026-05-01T08:00:00.000Z' }, // second tenant
			{ periodStart: '2026-01-01', periodEnd: '2026-06-30', createdAt: '2026-07-01T08:00:00.000Z' }, // same start
			{ periodStart: '2025-07-01', periodEnd: '2026-06-30', createdAt: '2026-03-01T08:00:00.000Z' }, // before the invoice
			{ periodStart: '2025-01-01', periodEnd: '2025-12-31', createdAt: '2026-05-01T08:00:00.000Z' } // other period
		];
		const billed = async (load: typeof editLoad | typeof detailLoad, values = {}) => {
			const { fetch, urls } = backend({ ...answers, '/invoices/i1': invoice(values), '/statements': { data: statements } });
			const data = (await load({ params: { id: 'i1' }, fetch } as never)) as { billedIn: unknown };
			return { billedIn: data.billedIn, urls };
		};

		it('nennt die Perioden, deren Abrechnungen nach dem Erfassen der Rechnung erstellt wurden', async () => {
			for (const load of [editLoad, detailLoad]) {
				const { billedIn, urls } = await billed(load);
				expect(billedIn).toEqual([
					{ start: '2026-01-01', end: '2026-12-31' },
					{ start: '2026-01-01', end: '2026-06-30' }
				]);
				expect(urls).toContain(`${API}/statements?buildingId=b1&limit=1000`);
			}
		});

		it('nennt keine Periode für eine Rechnung, die nicht umlagefähig ist', async () => {
			expect((await billed(editLoad, { isValidUtilityCost: false })).billedIn).toEqual([]);
		});
	});

	it('bietet Kategorien und Verteilschlüssel deutsch zur Auswahl an', async () => {
		for (const load of [newLoad, editLoad]) {
			const data = (await load({
				params: { id: 'i1' },
				url: new URL('http://localhost/invoices/new'),
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

	it('wählt das Gebäude aus der Adresse vor und kehrt zum Assistenten zurück', async () => {
		const { fetch } = backend({
			...answers,
			'/buildings': { buildings: [{ id: 'b1', name: 'Seepark' }] }
		});
		const url = new URL(
			'http://localhost/invoices/new?building=b1&returnTo=/statements/generate&periodStart=2025-01-01&periodEnd=2025-12-31'
		);

		const data = (await newLoad({ url, fetch } as never)) as {
			buildingId: string;
			returnTo: string;
		};

		expect(data).toMatchObject({
			buildingId: 'b1',
			returnTo: '/statements/generate',
			period: { start: '2025-01-01', end: '2025-12-31' }
		});
	});

	it('übergeht ein unbekanntes Gebäude und eine fremde Rücksprung-Adresse', async () => {
		const url = new URL('http://localhost/invoices/new?building=b9&returnTo=https://example.com');

		const data = (await newLoad({ url, fetch: backend(answers).fetch } as never)) as {
			buildingId: string;
			returnTo: string | null;
		};

		expect(data).toMatchObject({ buildingId: '', returnTo: null, period: null });
	});

	// Die Kategorien kamen bei einer Persona erst beim zweiten Besuch: sie hängen nicht an der KI
	it('lädt die Kategorien auch, wenn der Status der KI nicht abrufbar ist', async () => {
		const { fetch: answer } = backend(answers);
		const fetch = (async (url: string) => {
			if (url.includes('llm-status') || url.includes('/config/')) throw new Error('timeout');
			return answer(url);
		}) as typeof globalThis.fetch;
		const url = new URL('http://localhost/invoices/new');

		const data = (await newLoad({ url, fetch } as never)) as {
			categories: unknown[];
			distributionKeys: unknown[];
			llmAvailable: boolean;
		};

		expect(data.categories).toHaveLength(2);
		expect(data.distributionKeys).toHaveLength(1);
		expect(data.llmAvailable).toBe(false);
	});

	it('bietet alle Gebäude an, nicht nur die ersten 20', async () => {
		for (const load of [newLoad, editLoad]) {
			const { urls, fetch } = backend(answers);

			await load({
				params: { id: 'i1' },
				url: new URL('http://localhost/invoices/new'),
				fetch
			} as never);

			expect(urls).toContain(`${API}/buildings?limit=100`);
		}
	});
});

describe('Rechnung prüfen', () => {
	const filled = {
		buildingId: 'b1',
		invoiceDate: '2025-06-30',
		billingEntity: 'Hauswart Huber',
		description: 'Reinigung',
		amount: "1'200.50"
	};

	it('verlangt Gebäude, Datum, Rechnungssteller, Beschreibung und einen Betrag über null', () => {
		expect(
			Object.keys(
				validateInvoice({
					buildingId: '',
					invoiceDate: '',
					billingEntity: ' ',
					description: '',
					amount: '0'
				})
			)
		).toEqual(['buildingId', 'invoiceDate', 'billingEntity', 'description', 'amount']);
	});

	it('nimmt Beträge so, wie man sie in der Schweiz schreibt', () => {
		expect(validateInvoice(filled)).toEqual({});
	});

	// Leistungszeitraum: freiwillig, aber vollständig und in der richtigen Reihenfolge
	it('verlangt zum Beginn des Leistungszeitraums das Ende, und nicht davor', () => {
		const period = (servicePeriodStart: string, servicePeriodEnd: string) =>
			validateInvoice({ ...filled, servicePeriodStart, servicePeriodEnd });

		expect(period('', '')).toEqual({});
		expect(period('2025-01-01', '2025-03-31')).toEqual({});
		expect(period('2025-01-01', '')).toEqual({ servicePeriodEnd: 'Bitte geben Sie auch das Ende des Leistungszeitraums ein.' });
		expect(period('', '2025-03-31')).toEqual({ servicePeriodStart: 'Bitte geben Sie auch den Beginn des Leistungszeitraums ein.' });
		expect(period('2025-03-31', '2025-01-01')).toEqual({ servicePeriodEnd: 'Das Ende darf nicht vor dem Beginn liegen.' });
	});
});

describe('Rücksprung nach dem Erfassen', () => {
	it('kehrt nur zu einer Seite von Dwello zurück', () => {
		expect(localPath('/statements/generate')).toBe('/statements/generate');
		expect(localPath('https://example.com')).toBeNull();
		expect(localPath('//example.com')).toBeNull();
		expect(localPath('/\\example.com')).toBeNull();
		expect(localPath(null)).toBeNull();
	});
});
