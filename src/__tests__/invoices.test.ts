import { describe, it, expect } from 'vitest';
import { load as listLoad } from '../routes/invoices/+page.server';
import { load as detailLoad } from '../routes/invoices/[id]/+page.server';
import { load as editLoad } from '../routes/invoices/[id]/edit/+page.server';
import { load as newLoad } from '../routes/invoices/new/+page.server';
import { localPath, suggestionProvenance, validateInvoice } from '../lib/invoice';
import { toInvoice } from '../lib/server/invoice';
import backendInvoice from '../../tests/contracts/invoice.json';
import invoiceStatements from '../../tests/contracts/invoice-statements.json';
import periodList from '../../tests/contracts/invoice-list-period.json';
import fuelStocks from '../../tests/contracts/fuel-stocks.json';
import categoryList from '../../tests/contracts/categories.json';
import kiSettings from '../../tests/contracts/ki-settings.json';

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

	// #454 (#408 point 1): the period goes to the backend as such, independent of the years offered (older than five
	// years and across the turn of the year)
	it('filtert nach der Abrechnungsperiode aus der Adresse', async () => {
		const { urls, fetch } = backend({});

		await listLoad({
			url: new URL('http://localhost/invoices?building=b1&periodStart=2019-07-01&periodEnd=2020-06-30'),
			fetch
		} as never);

		expect(urls).toContainEqual(
			expect.stringMatching(/\/invoices\?.*buildingId=b1.*periodStart=2019-07-01.*periodEnd=2020-06-30/)
		);
	});

	// Datenprüfung 454-1 D-1: the period takes invoices by Leistungszeitraum, a year by Rechnungsdatum would drop some
	it('schneidet die Abrechnungsperiode nicht zusätzlich nach dem Jahr des Rechnungsdatums', async () => {
		const { urls, fetch } = backend({});

		await listLoad({
			url: new URL('http://localhost/invoices?building=b1&periodStart=2025-01-01&periodEnd=2025-12-31&year=2025'),
			fetch
		} as never);

		const listed = urls.find((one) => one.includes('periodStart='))!;
		expect(listed).not.toContain('dateFrom');
		expect(listed).not.toContain('dateTo');
	});

	// Fachreview 454-1 V-11: the part of each invoice in the period, as the backend names it
	it('übernimmt den Teil jeder Rechnung in der Abrechnungsperiode', () => {
		expect(toInvoice(periodList.invoices[0]).inPeriodAmount).toBe(413.33);
		expect(toInvoice(backendInvoice).inPeriodAmount).toBeUndefined();
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

describe('Rechnungsliste mit «Rechnungen hochladen»', () => {
	it('lädt Kategorien einmal, die Verteilschlüssel und den voreingestellten Schlüssel für den Dialog', async () => {
		const { urls, fetch } = backend({
			'/invoices': { invoices: [], total: 0 },
			'/categories': { categories: [caretaker] },
			'/distribution-keys': { data: [perArea] },
			'/config/default_distribution_key_id': { value: 'k1' }
		});
		const data = (await listLoad({ url: new URL('http://localhost/invoices'), fetch } as never)) as {
			distributionKeys: { id: string }[];
			defaultDistributionKeyId: string;
		};
		expect(data.distributionKeys.map((key) => key.id)).toEqual(['k1']);
		expect(data.defaultDistributionKeyId).toBe('k1');
		expect(urls.filter((url) => url.includes('/categories'))).toHaveLength(1);
	});
	// #626: with «Keine KI» the dialog says that nobody reads the files
	it('sagt dem Dialog, ob «Keine KI» gewählt ist', async () => {
		const load = async (mode: string) =>
			(
				(await listLoad({
					url: new URL('http://localhost/invoices'),
					fetch: backend({ '/ki-settings': { ...kiSettings, mode } }).fetch
				} as never)) as { kiOff: boolean }
			).kiOff;

		expect(await load('none')).toBe(true);
		expect(await load('local')).toBe(false);
	});

	// code review 626 C-2: without an answer about the KI the list still loads, with the usual text
	it('zeigt die Liste, auch wenn die KI-Einstellung nicht antwortet', async () => {
		const { fetch: answers } = backend({ '/invoices': { invoices: [invoice()], total: 1 } });
		const fetch = (async (url: string) =>
			url.includes('/ki-settings') ? Promise.reject(new Error('down')) : answers(url)) as typeof globalThis.fetch;

		const data = (await listLoad({ url: new URL('http://localhost/invoices'), fetch } as never)) as {
			invoices: unknown[];
			kiOff: boolean;
		};

		expect(data.invoices).toHaveLength(1);
		expect(data.kiOff).toBe(false);
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

	it('zeigt die Rechnungsnummer des Backends', async () => {
		const { fetch } = backend({ '/invoices/i1': invoice() });
		const { invoice: shown } = (await detailLoad({ params: { id: 'i1' }, fetch } as never)) as {
			invoice: { invoiceNumber?: string };
		};
		expect(shown.invoiceNumber).toBe('R-1001');
	});

	it('nennt den Beleg mit Dateiname, Art und den Hinweisen aus dem Hochladen, oder keinen', async () => {
		for (const [beleg, expected] of [
			[backendInvoice.beleg, { fileName: 'huber-q1.pdf', mimeType: 'application/pdf', deductedAmount: '1000.00', nonAllocableItems: true }],
			[null, null]
		] as const) {
			const { fetch } = backend({ '/invoices/i1': invoice({ beleg }) });
			const { invoice: shown } = (await detailLoad({ params: { id: 'i1' }, fetch } as never)) as {
				invoice: { beleg: unknown };
			};
			expect(shown.beleg).toEqual(expected);
		}
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

	// #583: the backend sends at most as many categories as asked for, counting the non-umlagefähige ones too
	it('bietet jede Kategorie an, auch mit mehr als 100 Kategorien', async () => {
		const many = Array.from({ length: 150 }, (_, i) => ({
			...categoryList.categories[0],
			id: `c${i}`,
			nameDE: `Kategorie ${i}`
		}));
		const fetch = (async (url: string) => {
			const { pathname, searchParams } = new URL(url);
			if (!pathname.endsWith('/categories')) return Response.json({});
			return Response.json({ categories: many.slice(0, Number(searchParams.get('limit') ?? 100)) });
		}) as typeof globalThis.fetch;
		const url = new URL('http://localhost/invoices/new');
		const data = (await newLoad({ url, fetch } as never)) as { categories: unknown[] };
		expect(data.categories).toHaveLength(150);
	});

	// Wer eine schon abgerechnete Rechnung ändert oder löscht, verschiebt Kosten zwischen den Perioden; welche
	// Abrechnungen sie abrechnen, wissen die Abrechnungen selbst (#96)
	describe('Perioden mit Abrechnungen, die diese Rechnung enthalten', () => {
		const periods = async (load: typeof editLoad | typeof detailLoad, answer: unknown) => {
			const { fetch, urls } = backend({ ...answers, '/invoices/i1/statements': answer });
			const url = new URL('http://localhost/invoices/i1');
			const data = (await load({ params: { id: 'i1' }, url, fetch } as never)) as {
				billedIn: unknown;
				missedIn: unknown;
				statements: unknown;
			};
			return { billedIn: data.billedIn, missedIn: data.missedIn, statements: data.statements, urls };
		};

		it('nennt die Perioden, die das Backend als abgerechnet und als ohne diese Rechnung nennt', async () => {
			const sample = { ...invoiceStatements, missedIn: [{ start: '2025-07-01', end: '2026-06-30' }] };
			for (const load of [editLoad, detailLoad]) {
				const { billedIn, missedIn, urls } = await periods(load, sample);
				expect(billedIn).toEqual([{ start: '2026-01-01', end: '2026-12-31' }]);
				expect(missedIn).toEqual([{ start: '2025-07-01', end: '2026-06-30' }]);
				expect(urls).toContain(`${API}/invoices/i1/statements`);
			}
		});

		// #455: the statements the invoice is in, with number and status, for «In Abrechnungen enthalten»
		it('gibt die Abrechnungen mit Nummer und Status weiter, und keine, wenn das Backend keine nennt', async () => {
			expect((await periods(detailLoad, invoiceStatements)).statements).toEqual(invoiceStatements.statements);
			expect((await periods(detailLoad, null)).statements).toEqual([]);
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

	// #451, M-1 (persona Helga P-4): the form explains a delivery only in the category of the building's tank
	it('nennt je Gebäude die Kategorie seines Tanks, keine ohne Tankbestand', async () => {
		const { fetch } = backend({
			...answers,
			'/buildings': { buildings: [{ id: 'b1', name: 'Seepark' }, { id: 'b2', name: 'Lindenhof' }] },
			'/buildings/b1/fuel-stocks': fuelStocks,
			'/buildings/b2/fuel-stocks': []
		});

		const data = (await newLoad({ url: new URL('http://localhost/invoices/new'), fetch } as never)) as { tanks: Record<string, string> };

		expect(data.tanks).toEqual({ b1: fuelStocks[0].categoryId });
	});

	// the list (for «Rechnungen hochladen») and «Rechnung bearbeiten» name the tanks too (Code-Review C-16)
	it('nennt die Tanks auch in der Liste und beim Bearbeiten', async () => {
		const { fetch } = backend({
			...answers,
			'/invoices': { invoices: [invoice({})], total: 1 },
			'/invoices/i1': backendInvoice,
			'/buildings': { buildings: [{ id: 'b1', name: 'Seepark' }] },
			'/buildings/b1/fuel-stocks': fuelStocks
		});
		const tanks = { b1: fuelStocks[0].categoryId };

		const list = (await listLoad({ url: new URL('http://localhost/invoices'), fetch } as never)) as { buildings: { tank?: string }[] };
		expect(list.buildings[0].tank).toBe(tanks.b1);
		expect(((await editLoad({ params: { id: 'i1' }, url: new URL('http://localhost/invoices/i1/edit'), fetch } as never)) as { tanks: object }).tanks).toEqual(tanks);
	});

	it('übergeht ein unbekanntes Gebäude und eine fremde Rücksprung-Adresse', async () => {
		const url = new URL('http://localhost/invoices/new?building=b9&returnTo=https://example.com');

		const data = (await newLoad({ url, fetch: backend(answers).fetch } as never)) as {
			buildingId: string;
			returnTo: string | null;
		};

		expect(data).toMatchObject({ buildingId: '', returnTo: null, period: null });
	});

	// Persona Dr. Weber P-2 (#452): aus der Vorschau zurück in den Assistenten, nie auf eine fremde Seite
	it('kehrt nach dem Bearbeiten zum Assistenten zurück, nie zu einer fremden Adresse', async () => {
		const returnTo = async (to: string) => {
			const url = new URL(`http://localhost/invoices/i1/edit?returnTo=${encodeURIComponent(to)}`);
			const data = await editLoad({
				params: { id: 'i1' },
				url,
				fetch: backend(answers).fetch
			} as never);
			return (data as { returnTo: string | null }).returnTo;
		};

		expect(await returnTo('/statements/generate?schritt=3')).toBe('/statements/generate?schritt=3');
		expect(await returnTo('https://example.com')).toBeNull();
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
});

describe('Rechnung prüfen', () => {
	const filled = {
		buildingId: 'b1',
		invoiceDate: '2025-06-30',
		billingEntity: 'Hauswart Huber',
		description: 'Reinigung',
		amount: "1'200.50",
		distributionKeyId: 'k1'
	};

	it('verlangt Gebäude, Datum, Rechnungssteller, Beschreibung, einen Betrag über null und einen Verteilschlüssel', () => {
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
		).toEqual(['buildingId', 'invoiceDate', 'billingEntity', 'description', 'amount', 'distributionKeyId']);
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
		expect(period('2025-01-01', '')).toEqual({
			servicePeriodEnd: 'Bitte geben Sie auch das Ende des Leistungszeitraums ein.'
		});
		expect(period('', '2025-03-31')).toEqual({
			servicePeriodStart: 'Bitte geben Sie auch den Beginn des Leistungszeitraums ein.'
		});
		expect(period('2025-03-31', '2025-01-01')).toEqual({
			servicePeriodEnd: 'Das Ende darf nicht vor dem Beginn liegen.'
		});
	});
});

describe('Rücksprung nach dem Erfassen', () => {
	it('kehrt nur zu einer Seite von Dwello zurück', () => {
		expect(localPath('/statements/generate')).toBe('/statements/generate');
		expect(localPath('https://example.com')).toBeNull();
		expect(localPath('//example.com')).toBeNull();
		expect(localPath('/\\example.com')).toBeNull();
		// the browser drops tabs and line breaks from an address: «/\t/x» is «//x» (code review 452-4 C-18)
		expect(localPath('/\t/evil.example')).toBeNull();
		expect(localPath('/\n/evil.example')).toBeNull();
		expect(localPath(null)).toBeNull();
	});
});
