import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readable } from 'svelte/store';

vi.mock('$app/environment', () => ({ browser: true }));
vi.mock('$app/navigation', () => ({ goto: vi.fn(), invalidateAll: vi.fn() }));
let url = new URL('http://localhost/invoices?search=Hauswart');
vi.mock('$app/stores', () => ({
	page: { subscribe: (run: (value: unknown) => void) => readable({ url }).subscribe(run) }
}));

import { goto, invalidateAll } from '$app/navigation';
import { get } from 'svelte/store';
import { toasts } from '$lib/stores';
import InvoicesPage from '../routes/invoices/+page.svelte';
import InvoicePage from '../routes/invoices/[id]/+page.svelte';
import NewInvoicePage from '../routes/invoices/new/+page.svelte';
import EditInvoicePage from '../routes/invoices/[id]/edit/+page.svelte';
import {
	allByTestId,
	byTestId,
	click,
	fakeBff,
	fireEvent,
	settle,
	show,
	submit
} from './helpers/dom';

const buildings = [{ id: 'b1', name: 'Seeblick', address: 'Seeweg 1, 8400 Winterthur' }];
const categories = [
	{ id: 'c1', name: 'Hauswartung', isAllowedUtilityCost: true },
	{ id: 'c2', name: 'Reparaturen', isAllowedUtilityCost: false }
];
const distributionKeys = [
	{ id: 'k1', name: 'Nach Fläche', type: 'predefined', formula: '{area}', usageCount: 0 }
];
const invoice = (overrides = {}) => ({
	id: 'i1',
	buildingId: 'b1',
	buildingName: 'Seeblick',
	buildingAddress: 'Seeweg 1',
	invoiceDate: '2024-03-15',
	billingEntity: 'Hauswart Meier',
	description: 'Hauswartung März',
	amount: 450,
	categoryId: 'c1',
	category: categories[0],
	distributionKeyId: 'k1',
	distributionKey: { id: 'k1', name: 'Nach Fläche' },
	isValidUtilityCost: true,
	categorizationStatus: 'manual' as const,
	createdAt: '2024-03-16T10:00:00Z',
	updatedAt: '2024-03-16T10:00:00Z',
	...overrides
});
const text = () => document.body.textContent ?? '';
const button = (label: string) =>
	[...document.querySelectorAll('button')].find((b) => b.textContent?.includes(label))!;

beforeEach(() => {
	url = new URL('http://localhost/invoices?search=Hauswart');
	vi.mocked(goto).mockClear();
	vi.mocked(invalidateAll).mockClear();
});

describe('Rechnungsliste', () => {
	const list = (invoices: ReturnType<typeof invoice>[]) =>
		show(InvoicesPage, {
			data: { invoices, total: invoices.length, page: 1, pageSize: 20, buildings, categories }
		} as never);

	// After a search the focus moves here, so the number of results is read out
	it('nennt die Treffer in einer Überschrift, die den Fokus nach der Suche nimmt', () => {
		list([invoice()]);
		const results = document.querySelector<HTMLElement>('[data-results]')!;
		expect(results.textContent!.replace(/\s+/g, ' ').trim()).toBe('1 Rechnung');
		expect(results.tabIndex).toBe(-1);
	});

	it('zeigt Rechnungen mit Kategorie, Betrag und Status', () => {
		list([
			invoice(),
			invoice({
				id: 'i2',
				category: undefined,
				categorizationStatus: 'pending',
				isValidUtilityCost: false
			})
		]);

		expect(byTestId('invoice-row-i1')!.textContent).toContain('Hauswartung');
		expect(byTestId('invoice-row-i1')!.textContent).toContain('Manuell');
		expect(byTestId('invoice-row-i2')!.textContent).toContain('Kategorie fehlt');
		expect(byTestId('invoice-row-i2')!.textContent).toContain('Nicht umlagefähig');
	});

	it('übernimmt die Suche aus der Adresse und beginnt eine neue Suche auf Seite 1', () => {
		list([invoice()]);
		expect(byTestId<HTMLInputElement>('invoice-search-input')!.value).toBe('Hauswart');

		submit('invoice-search-submit');
		expect(goto).toHaveBeenCalledWith('/invoices?search=Hauswart&page=1');
	});

	it('öffnet eine Rechnung über eine ganze Zeile, die den Rechnungssteller nennt', () => {
		list([invoice()]);

		const row = byTestId('invoice-row-i1')!;
		const link = row.querySelector('[data-testid="invoice-view-button"]')!;
		expect(link.getAttribute('href')).toBe('/invoices/i1');
		expect(link.textContent).toContain('Hauswart Meier');
		expect(
			row.querySelector('[data-testid="invoice-edit-button"]')!.getAttribute('aria-label')
		).toContain('Hauswart Meier');
		expect(row.querySelector('[data-testid="invoice-category"]')!.textContent!.trim()).toBe(
			'Hauswartung'
		);
		expect(row.querySelector('[data-testid="invoice-status"]')!.textContent!.trim()).toBe(
			'Manuell'
		);
		expect(row.querySelector('[role="status"], [aria-live]')).toBeNull();
	});

	it('hält „Bearbeiten“ innerhalb der Zeile, statt die Seite zu verbreitern', () => {
		list([invoice()]);
		const row = byTestId('invoice-row-i1')!;
		const action = row.querySelector('[data-testid="invoice-edit-button"]')!.parentElement!;

		expect(row.className).not.toMatch(/col-span|grid-cols/);
		expect(action.className).toMatch(/(^| )xl:shrink-0( |$)/);
	});

	it('zählt die Rechnungen in Einzahl und Mehrzahl richtig', () => {
		list([invoice()]);
		expect(text()).toContain('1 Rechnung');
		expect(text()).not.toContain('1 Rechnungen');
	});

	it('filtert nach dem Gebäude aus der Adresse und behält es in der Suche', () => {
		url = new URL('http://localhost/invoices?building=b1');
		list([invoice()]);
		expect(byTestId<HTMLSelectElement>('invoice-building-filter')!.value).toBe('b1');

		submit('invoice-search-submit');
		expect(goto).toHaveBeenCalledWith('/invoices?building=b1&page=1');
	});

	it('meldet eine leere Suche anders als eine leere Liste', () => {
		list([]);
		expect(text()).toContain('Versuchen Sie es mit anderen Filtern.');
	});
});

describe('Rechnungsdetail', () => {
	it('zeigt die Einschätzung der KI und eine manuelle Korrektur', () => {
		show(InvoicePage, {
			data: {
				invoice: invoice({
					categorizationStatus: 'auto-categorized',
					llmConfidence: 0.86,
					manualOverrideReason: 'Vertrag geprüft'
				})
			}
		});

		expect(text()).toContain('Automatisch kategorisiert');
		expect(text()).toContain('86 %');
		expect(text()).toContain('Vertrag geprüft');
	});

	it('löscht die Rechnung nach Bestätigung und kehrt zur Liste zurück', async () => {
		const calls = fakeBff(() => [204]);
		show(InvoicePage, { data: { invoice: invoice() } });

		click('invoice-delete-button');
		click('invoice-delete-confirm');
		await settle();

		expect(calls).toEqual([{ method: 'DELETE', path: '/invoices/i1', body: undefined }]);
		expect(goto).toHaveBeenCalledWith('/invoices');
		expect(get(toasts).at(-1)!.message).toBe('Rechnung von Hauswart Meier gelöscht');
	});

	it('meldet einen Fehler beim Neu-Kategorisieren', async () => {
		fakeBff(() => [503, { error: { code: 'LLM', message: 'KI nicht erreichbar' } }]);
		show(InvoicePage, {
			data: {
				invoice: invoice({
					category: undefined,
					distributionKey: undefined,
					categorizationStatus: 'pending'
				})
			}
		});

		click(button('Neu kategorisieren'));
		await settle();

		expect(text()).toContain('Kategorisierung fehlgeschlagen');
		expect(text()).toContain('Nicht kategorisiert');
		expect(invalidateAll).not.toHaveBeenCalled();
	});

	// The KI runs while saving: an invoice without category is not waiting for anything
	it('sagt bei einer Rechnung ohne Kategorie nicht, dass noch etwas läuft', () => {
		show(InvoicePage, {
			data: { invoice: invoice({ category: undefined, categorizationStatus: 'pending' }) }
		});

		expect(text()).toContain('Nicht kategorisiert – bitte Kategorie wählen');
		expect(text()).not.toMatch(/ausstehend/i);
	});

	it('nennt den Grund, wenn die KI nicht kategorisieren konnte', async () => {
		fakeBff(() => [
			503,
			{ error: 'Die KI ist nicht erreichbar oder hat keine passende Kategorie geliefert.' }
		]);
		show(InvoicePage, { data: { invoice: invoice() } });

		click(button('Neu kategorisieren'));
		await settle();

		expect(byTestId('invoice-recategorize-error')!.textContent).toContain(
			'Die KI ist nicht erreichbar oder hat keine passende Kategorie geliefert.'
		);
	});

	it('zeigt den gespeicherten Grund, warum die Kategorie der KI überschrieben wurde', () => {
		show(InvoicePage, {
			data: { invoice: invoice({ manualOverrideReason: 'Reparatur, keine Wartung' }) }
		});

		expect(byTestId('invoice-override-reason')!.textContent).toContain('Reparatur, keine Wartung');
	});

	it('lädt die Rechnung nach dem Neu-Kategorisieren neu', async () => {
		fakeBff(() => [200, { category: categories[0] }]);
		show(InvoicePage, { data: { invoice: invoice() } });

		click(button('Neu kategorisieren'));
		await settle();

		expect(invalidateAll).toHaveBeenCalled();
	});
});

describe('Rechnung erfassen', () => {
	const data = (llmAvailable: boolean, opened = {}) => ({
		buildings,
		categories,
		distributionKeys,
		llmAvailable,
		defaultDistributionKeyId: 'k1',
		buildingId: '',
		returnTo: null,
		...opened
	});
	const fill = () => {
		fireEvent(byTestId<HTMLSelectElement>('invoice-building-select')!, 'change', 'b1');
		fireEvent(
			byTestId<HTMLInputElement>('invoice-billing-entity-input')!,
			'input',
			'Hauswart Meier'
		);
		fireEvent(
			byTestId<HTMLInputElement>('invoice-description-input')!,
			'input',
			'Hauswartung März'
		);
		fireEvent(byTestId<HTMLInputElement>('invoice-amount-input')!, 'input', '450');
	};

	it('verlangt Gebäude, Rechnungssteller, Beschreibung und Betrag', () => {
		const calls = fakeBff();
		show(NewInvoicePage, { data: data(false) } as never);

		submit('submit-button');

		expect(text()).toContain('Bitte wählen Sie ein Gebäude');
		expect(text()).toContain('Bitte geben Sie einen Rechnungssteller ein');
		expect(text()).toContain('Bitte geben Sie einen gültigen Betrag ein');
		expect(calls).toEqual([]);
	});

	it('übernimmt einen sicheren KI-Vorschlag und speichert ihn mit der Rechnung', async () => {
		const calls = fakeBff(({ path }) =>
			path === '/invoices/categorize'
				? [
						200,
						{
							category: categories[0],
							confidence: 0.9,
							isAllowedUtilityCost: true,
							reasoning: 'Hauswart',
							source: 'llm'
						}
					]
				: [201, { id: 'i9' }]
		);
		show(NewInvoicePage, { data: data(true) } as never);
		expect(text()).toContain('KI-Kategorisierung ist aktiv');

		fill();
		byTestId('invoice-description-input')!.dispatchEvent(new Event('blur'));
		await settle();
		expect(byTestId<HTMLSelectElement>('invoice-category-select')!.value).toBe('c1');

		submit('submit-button');
		await settle();

		expect(calls.at(-1)).toMatchObject({
			method: 'POST',
			path: '/invoices',
			body: {
				buildingId: 'b1',
				amount: '450',
				categoryId: 'c1',
				distributionKeyId: 'k1',
				llmCategoryId: 'c1',
				llmConfidence: '0.9'
			}
		});
		expect(goto).toHaveBeenCalledWith('/invoices');
	});

	it('lässt einen unsicheren KI-Vorschlag übernehmen', async () => {
		fakeBff(() => [
			200,
			{ category: categories[1], confidence: 0.4, isAllowedUtilityCost: false, source: 'llm' }
		]);
		show(NewInvoicePage, { data: data(true) } as never);

		fill();
		byTestId('invoice-billing-entity-input')!.dispatchEvent(new Event('blur'));
		await settle();
		expect(byTestId<HTMLSelectElement>('invoice-category-select')!.value).toBe('');

		click(button('Übernehmen'));
		expect(byTestId<HTMLSelectElement>('invoice-category-select')!.value).toBe('c2');
		expect(byTestId<HTMLInputElement>('invoice-utility-cost-checkbox')!.checked).toBe(false);
	});

	// Kosten einer nicht umlagefähigen Kategorie bleiben bei den Eigentümern (OR 257a)
	it('sperrt „Umlagefähig“ für eine nicht umlagefähige Kategorie', async () => {
		show(NewInvoicePage, { data: data(false) } as never);
		const category = byTestId<HTMLSelectElement>('invoice-category-select')!;

		category.value = 'c2';
		category.dispatchEvent(new Event('change'));
		await settle();

		expect(byTestId<HTMLInputElement>('invoice-utility-cost-checkbox')!.disabled).toBe(true);
	});

	it('sagt, dass das Rechnungsdatum die Abrechnungsperiode bestimmt', () => {
		show(NewInvoicePage, { data: data(false) } as never);
		expect(document.querySelector('#invoiceDate-help')!.textContent).toContain(
			'bestimmt, in welche Abrechnungsperiode die Rechnung fällt'
		);
	});

	it('wählt das Gebäude vor und kehrt nach dem Speichern zum Assistenten zurück', async () => {
		fakeBff(() => [201, { id: 'i9' }]);
		show(NewInvoicePage, {
			data: data(false, { buildingId: 'b1', returnTo: '/statements/generate' })
		} as never);

		expect(byTestId<HTMLSelectElement>('invoice-building-select')!.value).toBe('b1');
		expect(byTestId('form-cancel')!.getAttribute('href')).toBe('/statements/generate');
		fill();
		submit('submit-button');
		await settle();

		expect(goto).toHaveBeenCalledWith('/statements/generate');
	});

	// TODO(fachlich prüfen): the glossary names the equal split only for the Verwaltungspauschale
	it('sagt, wie eine Rechnung ohne Verteilschlüssel verteilt wird', () => {
		show(NewInvoicePage, { data: data(false) } as never);
		expect(document.querySelector('#distributionKey-help')!.textContent).toContain(
			'Ohne Verteilschlüssel werden die Kosten gleichmässig pro Wohnung verteilt.'
		);
	});

	it('warnt, wenn das Rechnungsdatum nicht in der Abrechnungsperiode des Assistenten liegt', () => {
		show(NewInvoicePage, {
			data: data(false, {
				returnTo: '/statements/generate',
				period: { start: '2025-01-01', end: '2025-12-31' }
			})
		} as never);
		const date = byTestId<HTMLInputElement>('invoice-date-input')!;

		fireEvent(date, 'input', '2026-10-10');
		expect(byTestId('invoice-period-warning')!.textContent).toContain(
			'Das Rechnungsdatum liegt nicht in der Abrechnungsperiode 1.1.2025 – 31.12.2025'
		);

		fireEvent(date, 'input', '2025-11-15');
		expect(byTestId('invoice-period-warning')).toBeNull();
	});

	it('warnt ohne Abrechnungsperiode nicht', () => {
		show(NewInvoicePage, { data: data(false, { period: null }) } as never);
		expect(byTestId('invoice-period-warning')).toBeNull();
	});

	it('bietet die Kategorien nach Umlagefähigkeit gruppiert an', () => {
		show(NewInvoicePage, { data: data(false) } as never);
		const groups = [...byTestId('invoice-category-select')!.querySelectorAll('optgroup')];
		expect(groups.map((group) => [group.label, group.textContent])).toEqual([
			['Umlagefähige Kosten', 'Hauswartung'],
			['Nicht umlagefähige Kosten', 'Reparaturen']
		]);
	});

	it('bleibt bei einem Fehler des Backends auf der Seite', async () => {
		fakeBff(() => [400, { error: { code: 'VALIDATION', message: 'Ungültiger Betrag' } }]);
		show(NewInvoicePage, { data: data(false) } as never);

		fill();
		submit('submit-button');
		await settle();

		expect(goto).not.toHaveBeenCalled();
	});
});

describe('Rechnung bearbeiten', () => {
	const edit = (overrides = {}) =>
		show(EditInvoicePage, {
			data: { invoice: invoice(overrides), buildings, categories, distributionKeys }
		} as never);

	it('zeigt den Betrag mit zwei Nachkommastellen', () => {
		edit({ amount: 480 });
		expect(byTestId<HTMLInputElement>('invoice-amount-input')!.value).toBe('480.00');
	});

	it('speichert den Rechnungssteller ohne Leerzeichen am Rand und bestätigt das Speichern', async () => {
		toasts.set([]);
		const calls = fakeBff(() => [200, {}]);
		edit();

		fireEvent(
			byTestId<HTMLInputElement>('invoice-billing-entity-input')!,
			'input',
			'  Hauswart Huber  '
		);
		submit('submit-button');
		await settle();

		expect(calls[0].body).toMatchObject({ billingEntityName: 'Hauswart Huber' });
		expect(get(toasts).map((toast) => toast.message)).toContain(
			'Rechnung von Hauswart Huber gespeichert'
		);
	});

	it('speichert erst nach einer Änderung', async () => {
		const calls = fakeBff(() => [200, {}]);
		edit();
		expect(byTestId<HTMLButtonElement>('submit-button')!.disabled).toBe(true);

		fireEvent(byTestId<HTMLInputElement>('invoice-amount-input')!, 'input', '480');
		expect(text()).toContain('Ungespeicherte Änderungen');
		submit('submit-button');
		await settle();

		expect(calls).toEqual([
			expect.objectContaining({
				method: 'PUT',
				path: '/invoices/i1',
				body: expect.objectContaining({ amount: '480' })
			})
		]);
		expect(goto).toHaveBeenCalledWith('/invoices/i1');
	});

	it('verlangt einen Grund, wenn die Kategorie der KI geändert wird', async () => {
		const calls = fakeBff(() => [200, {}]);
		edit({
			llmConfidence: 0.9,
			llmCategory: categories[0],
			categorizationStatus: 'auto-categorized'
		});

		fireEvent(byTestId<HTMLSelectElement>('invoice-category-select')!, 'change', 'c2');
		submit('submit-button');
		expect(text()).toContain('Bitte geben Sie einen Grund für die Änderung an');
		expect(calls).toEqual([]);

		fireEvent(
			document.querySelector<HTMLTextAreaElement>('#overrideReason')!,
			'input',
			'Reparatur, keine Wartung'
		);
		submit('submit-button');
		await settle();
		expect(calls[0].body).toMatchObject({
			categoryId: 'c2',
			manualOverrideReason: 'Reparatur, keine Wartung'
		});
	});

	it('zeigt einen Fehler beim Speichern', async () => {
		fakeBff(() => [500, { error: { code: 'ERR', message: 'Datenbank nicht erreichbar' } }]);
		edit();

		fireEvent(byTestId<HTMLInputElement>('invoice-amount-input')!, 'input', '480');
		submit('submit-button');
		await settle();

		expect(text()).toContain('Fehler beim Speichern: Datenbank nicht erreichbar');
		expect(allByTestId('submit-button')).toHaveLength(1);
	});
});
