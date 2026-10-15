import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
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
import validationRefused from '../../tests/contracts/validation-refused.json';

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
const text = () => document.body.textContent?.replace(/\s+/g, ' ') ?? '';
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
			data: {
				invoices,
				total: invoices.length,
				page: 1,
				pageSize: 20,
				buildings,
				categories,
				years: ['2026', '2025', '2024']
			}
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

	it('zeigt die Rechnungen eines Jahres, damit eine Abrechnungsperiode geprüft werden kann', () => {
		url = new URL('http://localhost/invoices?year=2025');
		list([invoice()]);
		const year = byTestId<HTMLSelectElement>('invoice-year-filter')!;
		expect(year.value).toBe('2025');
		expect([...year.options].map((o) => o.text)).toEqual(['Alle Jahre', '2026', '2025', '2024']);

		submit('invoice-search-submit');
		expect(goto).toHaveBeenCalledWith('/invoices?year=2025&page=1');
	});

	it('sagt bei einem Jahr ohne Rechnungen, dass noch keine erfasst sind, statt einen Filterfehler zu vermuten', () => {
		url = new URL('http://localhost/invoices?year=2025');
		list([]);
		expect(text()).toContain('Für 2025 sind noch keine Rechnungen erfasst');
		expect(text()).not.toContain('Versuchen Sie es mit anderen Filtern.');
		expect(byTestId('invoices-empty')!.querySelector('a[href="/invoices/new"]')).not.toBeNull();
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

	// Auch eine Rechnung, die der Liegenschaftsverwalter selbst ausgeschlossen hat: der Hinweis nennt nicht das Gesetz als
	// Grund, und nur die Gebäudeversicherung, nicht Versicherungen allgemein (#185, Fachreview H-11)
	// Das Beispiel heisst wie die vordefinierte Kategorie (Code-Review K-2)
	it.each([
		['fr', 'assurance bâtiment, impôt foncier'],
		['it', 'assicurazione edificio, imposta immobiliare']
	] as const)('nennt auf %s die Gebäudeversicherung mit dem Namen ihrer Kategorie', (locale, example) => {
		overwriteGetLocale(() => locale);
		try {
			show(InvoicePage, { data: { invoice: invoice({ isValidUtilityCost: false }) } });

			expect(byTestId('invoice-legal-note')!.textContent).toContain(example);
		} finally {
			overwriteGetLocale(() => baseLocale);
		}
	});

	it('erklärt, dass eine nicht umlagefähige Rechnung nicht abgerechnet wird', () => {
		show(InvoicePage, { data: { invoice: invoice({ isValidUtilityCost: false }) } });

		// Der Titel nennt die Folge, nicht das Gesetz als Grund (Fachreview H-23)
		expect(byTestId('invoice-legal-note')!.textContent).toContain('Nicht in der Nebenkostenabrechnung');
		expect(byTestId('invoice-legal-note')!.textContent).not.toContain('Schweizer Mietrecht');
		expect(byTestId('invoice-legal-note')!.textContent).toContain(
			'Diese Rechnung fliesst nicht in die Nebenkostenabrechnung ein. Typische nicht umlagefähige Kosten: Reparaturen, Gebäudeversicherung, Liegenschaftssteuer, Hypothekarzinsen (Art. 256 Absatz 1, 256b und 257a OR).'
		);
	});

	it('zeigt den Leistungszeitraum, der statt des Rechnungsdatums die Periode bestimmt', () => {
		show(InvoicePage, {
			data: {
				invoice: invoice({ servicePeriodStart: '2024-10-01', servicePeriodEnd: '2024-12-31' })
			}
		});

		expect(text()).toContain('Leistungszeitraum 01.10.2024 – 31.12.2024');
		expect(text()).not.toContain('Bestimmt, in welche Abrechnungsperiode');
	});

	// Nachzügler: erfasst, nachdem die Abrechnungen der Periode erstellt wurden
	it('weist darauf hin, wenn die Abrechnungen der Periode ohne diese Rechnung erstellt wurden', () => {
		show(InvoicePage, {
			data: { invoice: invoice(), missedIn: [{ start: '2024-01-01', end: '2024-12-31' }] }
		});

		const hint = byTestId('invoice-missed-warning')!.textContent!.replace(/\s+/g, ' ');
		expect(hint).toContain(
			'Für die Abrechnungsperiode 01.01.2024 – 31.12.2024 gibt es schon Abrechnungen ohne diese Rechnung.'
		);
		expect(hint).toContain(
			'Löschen Sie die Entwürfe dieser Periode und erstellen Sie die Abrechnungen erneut, dann ist sie dabei.'
		);
		expect(hint).toContain(
			'Versendete Abrechnungen berichtigen Sie ausserhalb von Dwello: Schicken Sie dem Mieter eine berichtigte Abrechnung mit dem Beleg. Ob Sie die Kosten noch nachverlangen können, ist nicht in jedem Fall sicher: Lassen Sie sich im Zweifel beraten.'
		);
	});

	// Der Mieter kann Einsicht in die Belege einer versendeten Abrechnung verlangen
	it('warnt vor dem Löschen einer schon abgerechneten Rechnung', () => {
		show(InvoicePage, {
			data: { invoice: invoice(), billedIn: [{ start: '2024-01-01', end: '2024-12-31' }] }
		});

		click('invoice-delete-button');

		const dialog = document.querySelector('[role=dialog]')!.textContent!.replace(/\s+/g, ' ');
		expect(dialog).toContain('Abrechnungsperiode 01.01.2024 – 31.12.2024');
		expect(dialog).toContain(
			'Löschen Sie nur falsch erfasste Rechnungen. Die Entwürfe enthalten sie weiter: Löschen Sie danach die Entwürfe und erstellen Sie die Abrechnungen erneut. Versendete oder bezahlte Abrechnungen berichtigen Sie ausserhalb von Dwello gegenüber dem Mieter und zahlen zu viel Bezahltes zurück. Bewahren Sie den Beleg auf: Der Mieter kann Einsicht verlangen.'
		);
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

	it('meldet ein misslungenes Löschen auf Deutsch, auch wenn der Server Englisch antwortet', async () => {
		fakeBff(() => [404, { error: 'Invoice not found' }]);
		show(InvoicePage, { data: { invoice: invoice() } });

		click('invoice-delete-button');
		click('invoice-delete-confirm');
		await settle();

		expect(text()).toContain('Die Rechnung konnte nicht gelöscht werden.');
		expect(text()).not.toContain('Invoice not found');
	});

	it('meldet eine nicht lesbare Serverantwort auf Deutsch', async () => {
		globalThis.fetch = vi.fn(async () => new Response('<html>Bad Gateway</html>', { status: 502 }));
		show(InvoicePage, { data: { invoice: invoice() } });

		click(button('Neu kategorisieren'));
		await settle();

		expect(byTestId('invoice-recategorize-error')!.textContent).toContain(
			'Ein unerwarteter Fehler ist aufgetreten. Versuchen Sie es erneut.'
		);
	});

	// #127: a refusal without a code the UI knows showed the server's own (English) text
	it('meldet ein misslungenes Neu-Kategorisieren ohne Code in Worten der Oberfläche', async () => {
		fakeBff(() => [500, { error: 'Failed to recategorize invoice' }]);
		show(InvoicePage, { data: { invoice: invoice() } });

		click(button('Neu kategorisieren'));
		await settle();

		expect(byTestId('invoice-recategorize-error')!.textContent).toContain(
			'Ein unerwarteter Fehler ist aufgetreten. Versuchen Sie es erneut.'
		);
		expect(text()).not.toContain('Failed to recategorize invoice');
	});

	it('erklärt eine Rechnung ohne Verteilschlüssel, statt einen Fehler anzudeuten', () => {
		show(InvoicePage, { data: { invoice: invoice({ distributionKey: undefined }) } });

		expect(text()).toContain('Keiner – die Kosten werden gleichmässig pro Wohnung verteilt');
		expect(text()).not.toContain('Nicht zugewiesen');
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
		fakeBff(() => [503, { error: 'KI unavailable', code: 'KI_UNAVAILABLE', params: {} }]);
		show(InvoicePage, { data: { invoice: invoice() } });

		click(button('Neu kategorisieren'));
		await settle();

		expect(byTestId('invoice-recategorize-error')!.textContent).toContain(
			'Die KI ist nicht erreichbar oder hat keine passende Kategorie geliefert.'
		);
	});

	it('zeigt beim Neu-Kategorisieren, dass die KI arbeitet, und den Fehler gleich beim Knopf', async () => {
		fakeBff(() => [503, { error: 'Die KI ist nicht erreichbar.' }]);
		show(InvoicePage, { data: { invoice: invoice() } });

		click(button('Neu kategorisieren'));
		const busyButton = byTestId('invoice-recategorize-button')!;
		expect(busyButton.textContent).toContain('Wird kategorisiert …');
		expect(busyButton.getAttribute('aria-busy')).toBe('true');
		await settle();

		const message = byTestId('invoice-recategorize-error')!.closest(
			'[role="alert"]'
		) as HTMLElement;
		const recategorizeButton = byTestId('invoice-recategorize-button')!;
		expect(message.closest('section')).toBe(recategorizeButton.closest('section'));
		expect(
			recategorizeButton.compareDocumentPosition(message) & Node.DOCUMENT_POSITION_FOLLOWING
		).toBeTruthy();
		// focus moves to the message, which also brings it into view on a phone
		expect(document.activeElement).toBe(message);
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

	// Eine Rechnung für das 4. Quartal kommt im Januar: der Leistungszeitraum ordnet sie dem alten Jahr zu
	it('speichert den Leistungszeitraum der Rechnung', async () => {
		const calls = fakeBff(() => [201, { id: 'i9' }]);
		show(NewInvoicePage, { data: data(false) } as never);
		fill();
		expect(text()).toContain('Leistungszeitraum');
		fireEvent(byTestId<HTMLInputElement>('invoice-service-start-input')!, 'input', '01.10.2024');
		fireEvent(byTestId<HTMLInputElement>('invoice-service-end-input')!, 'input', '31.12.2024');

		submit('submit-button');
		await settle();

		expect(calls.at(-1)).toMatchObject({
			method: 'POST',
			path: '/invoices',
			body: { servicePeriodStart: '2024-10-01', servicePeriodEnd: '2024-12-31' }
		});
	});

	it('verlangt zum Beginn des Leistungszeitraums auch das Ende', () => {
		const calls = fakeBff();
		show(NewInvoicePage, { data: data(false) } as never);
		fill();
		fireEvent(byTestId<HTMLInputElement>('invoice-service-start-input')!, 'input', '01.10.2024');

		submit('submit-button');

		expect(text()).toContain('Bitte geben Sie auch das Ende des Leistungszeitraums ein.');
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
		// Versicherungsprämien der Heizung sind umlagefähig (Art. 5 Abs. 2 Bst. h VMWG), nur die Gebäudeversicherung nicht (#185)
		expect(byTestId('invoice-category-warning')!.textContent).toContain(
			'Kosten dieser Kategorie (z. B. Reparaturen, Gebäudeversicherung) können nicht auf Mieter umgelegt werden.'
		);
	});

	it('sagt, dass ohne Leistungszeitraum das Rechnungsdatum die Abrechnungsperiode bestimmt', () => {
		show(NewInvoicePage, { data: data(false) } as never);
		expect(document.querySelector('#invoiceDate-help')!.textContent).toContain(
			'Ohne Leistungszeitraum bestimmt es, in welche Abrechnungsperiode die Rechnung fällt'
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
		// no "today" from the wizard: an invoice for an earlier period gets its date chosen on purpose
		expect(date.value).toBe('');
		expect(byTestId('invoice-period-warning')).toBeNull();

		fireEvent(date, 'input', '10.10.2026');
		expect(byTestId('invoice-period-warning')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Das Rechnungsdatum liegt nicht in der Abrechnungsperiode 01.01.2025 – 31.12.2025'
		);

		fireEvent(date, 'input', '15.11.2025');
		expect(byTestId('invoice-period-warning')).toBeNull();
	});

	it('nennt den Leistungszeitraum als Grund, wenn er ausserhalb der Abrechnungsperiode liegt', () => {
		show(NewInvoicePage, {
			data: data(false, {
				returnTo: '/statements/generate',
				period: { start: '2025-01-01', end: '2025-12-31' }
			})
		} as never);
		fireEvent(byTestId<HTMLInputElement>('invoice-date-input')!, 'input', '15.01.2025');
		fireEvent(byTestId<HTMLInputElement>('invoice-service-start-input')!, 'input', '01.10.2024');
		fireEvent(byTestId<HTMLInputElement>('invoice-service-end-input')!, 'input', '31.12.2024');

		expect(byTestId('invoice-period-warning')!.textContent).toContain(
			'Der Leistungszeitraum liegt nicht in der Abrechnungsperiode'
		);
	});

	// Eine Öllieferung ist Vorrat: ihr Verbrauch zählt über den Tankbestand, nicht über einen Leistungszeitraum
	it('erklärt, wann ein Leistungszeitraum hingehört und wann nicht', () => {
		show(NewInvoicePage, { data: data(false) } as never);
		const help = text();

		expect(help).toContain(
			'Geben Sie ihn bei Rechnungen für einen Zeitraum an, zum Beispiel ein Quartal oder ein Jahr.'
		);
		expect(help).toContain(
			'Nicht für Lieferungen von Heizöl, Flüssiggas, Pellets oder Holz: Deren Verbrauch zählt über den Tankbestand des Gebäudes.'
		);
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

	it('warnt, wenn die Rechnung schon in Abrechnungen steckt, und nennt die Folge', () => {
		show(EditInvoicePage, {
			data: {
				invoice: invoice(),
				buildings,
				categories,
				distributionKeys,
				// same start, different end: both listed
				billedIn: [
					{ start: '2024-01-01', end: '2024-12-31' },
					{ start: '2024-01-01', end: '2024-06-30' }
				]
			}
		} as never);

		const warning = byTestId('invoice-billed-warning')!.textContent!.replace(/\s+/g, ' ');
		expect(warning).toContain('Abrechnungsperiode 01.01.2024 – 31.12.2024');
		expect(warning).toContain('Abrechnungsperiode 01.01.2024 – 30.06.2024');
		expect(warning).toContain(
			'Ändern Sie diese Rechnung, stimmen diese Abrechnungen nicht mehr. Löschen Sie danach die Entwürfe und erstellen Sie die Abrechnungen erneut. Versendete oder bezahlte Abrechnungen berichtigen Sie ausserhalb von Dwello gegenüber dem Mieter.'
		);
	});

	it('weist beim Bearbeiten auf Abrechnungen ohne diese Rechnung hin', () => {
		show(EditInvoicePage, {
			data: {
				invoice: invoice(),
				buildings,
				categories,
				distributionKeys,
				missedIn: [{ start: '2024-01-01', end: '2024-12-31' }]
			}
		} as never);

		expect(byTestId('invoice-missed-warning')).not.toBeNull();
	});

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

	// #127: a refusal without a code the UI knows showed the server's own text
	it('zeigt einen Fehler beim Speichern in Worten der Oberfläche, nicht den Text des Servers', async () => {
		fakeBff(() => [400, { error: 'Failed to update invoice' }]); // errorBody of a refusal without code
		edit();

		fireEvent(byTestId<HTMLInputElement>('invoice-amount-input')!, 'input', '480');
		submit('submit-button');
		await settle();

		expect(text()).toContain('Die Rechnung konnte nicht gespeichert werden. Versuchen Sie es erneut.');
		expect(text()).not.toContain('Failed to update invoice');
		expect(allByTestId('submit-button')).toHaveLength(1);
	});

	it('nennt beim Speichern den Grund, den das Backend mit Code angibt', async () => {
		fakeBff(() => [422, validationRefused]);
		edit();

		fireEvent(byTestId<HTMLInputElement>('invoice-amount-input')!, 'input', '480');
		submit('submit-button');
		await settle();

		expect(text()).toContain(
			'Fehler beim Speichern: Die Anfrage war ungültig. Laden Sie die Seite neu und versuchen Sie es erneut.'
		);
	});
});
