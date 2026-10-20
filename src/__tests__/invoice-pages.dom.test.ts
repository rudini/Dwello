import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readable } from 'svelte/store';
import { flushSync } from 'svelte';

vi.mock('$app/environment', () => ({ browser: true }));
vi.mock('$app/navigation', () => ({ goto: vi.fn(), invalidateAll: vi.fn() }));
let url = new URL('http://localhost/invoices?search=Hauswart');
vi.mock('$app/stores', () => ({
	page: { subscribe: (run: (value: unknown) => void) => readable({ url }).subscribe(run) }
}));

import { goto, invalidateAll } from '$app/navigation';
import { get } from 'svelte/store';
import { toasts } from '$lib/stores';
import { m } from '$lib/paraglide/messages';
import { toInvoice } from '$lib/server/invoice';
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
import invoiceContract from '../../tests/contracts/invoice.json';
import invoiceStatements from '../../tests/contracts/invoice-statements.json';

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
	beleg: null as { fileName: string; mimeType: string } | null,
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
				years: ['2026', '2025', '2024'],
				distributionKeys: [],
				defaultDistributionKeyId: ''
			}
		} as never);

	// the Übersicht's «Rechnungen hochladen» leads here (persona Anna)
	it('öffnet «Rechnungen hochladen» gleich, wenn die Adresse es verlangt', () => {
		url = new URL('http://localhost/invoices?upload');
		list([]);
		expect(byTestId('invoice-upload-building-select')).not.toBeNull();
	});

	// #455 (#268): a click before the page's scripts run opens the dialog through the address, as above
	it('öffnet «Rechnungen hochladen» auch über die Adresse, bevor die Skripte der Seite laufen', () => {
		list([]);
		expect(byTestId('invoice-upload-button')!.getAttribute('href')).toBe('?upload');
		click('invoice-upload-button');
		expect(byTestId('invoice-upload-building-select')).not.toBeNull();
	});

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

	it('öffnet «Rechnungen hochladen» als Dialog auf der Liste', () => {
		list([invoice()]);
		expect(document.querySelector('[role=dialog]')).toBeNull();
		click('invoice-upload-button');
		expect(document.querySelector('[role=dialog]')!.textContent).toContain('Rechnungen hochladen');
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
	// Titel nach der Folge statt nach dem Gesetz (Fachreview H-23), fr-Zitierweise (Code-Review M-7)
	// OR ausgeschrieben: die Rechnung zeigt den Hinweis allein (#292, Fachreview V-10)
	it.each([
		['fr', 'assurance bâtiment, impôt foncier', 'Pas dans le décompte des charges', '(art. 256, al. 1, 256b et 257a du Code des obligations, CO)'],
		['it', 'assicurazione edificio, imposta immobiliare', 'Non nel conteggio spese accessorie', '(art. 256 cpv. 1, 256b e 257a del Codice delle obbligazioni, CO)'],
		['en', 'building insurance, property tax', 'Not in the utility cost statement', '(Art. 256 para. 1, 256b and 257a Code of Obligations, CO)']
	] as const)('nennt auf %s die Gebäudeversicherung mit dem Namen ihrer Kategorie', (locale, example, title, citation) => {
		overwriteGetLocale(() => locale);
		try {
			show(InvoicePage, { data: { invoice: invoice({ isValidUtilityCost: false }) } });

			const note = byTestId('invoice-legal-note')!.textContent;
			expect(note).toContain(example);
			expect(note).toContain(title);
			expect(note).toContain(citation);
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
			'Diese Rechnung fliesst nicht in die Nebenkostenabrechnung ein. Typische nicht umlagefähige Kosten: Reparaturen, Gebäudeversicherung, Liegenschaftssteuer, Hypothekarzinsen (Art. 256 Absatz 1, 256b und 257a Obligationenrecht, OR).'
		);
	});

	// Der Grund der eigenen Kategorie statt der allgemeinen Liste, nicht als Warnung (#292, Entscheid #221 B)
	describe('Grund der vordefinierten Kategorie', () => {
		const repairs = {
			...invoiceContract,
			isValidUtilityCost: false,
			category: { ...invoiceContract.category, name: 'Repairs', nameDE: 'Reparaturen', isAllowedUtilityCost: false }
		};
		const reason = () => byTestId('category-reason')?.textContent?.trim();

		it('nennt bei einer umlagefähigen Rechnung den Grund ihrer Kategorie', () => {
			show(InvoicePage, { data: { invoice: toInvoice(invoiceContract) } });

			expect(reason()).toBe(m.categories_reason_caretaker());
		});

		it('nennt bei einer nicht umlagefähigen Rechnung den Grund statt der Warnung', () => {
			show(InvoicePage, { data: { invoice: toInvoice(repairs) } });

			expect(reason()).toBe(m.categories_reason_repairs());
			expect(byTestId('invoice-legal-note')).toBeNull();
		});

		// «Keiner – … pro Wohnung verteilt» neben «also nicht umlagefähig» widerspräche dem Grund (Personas Helga P-1, Weber P-5)
		it('sagt bei einer nicht umlagefähigen Rechnung ohne Verteilschlüssel nicht, wie sie verteilt würde', () => {
			show(InvoicePage, { data: { invoice: toInvoice({ ...repairs, distributionKey: null, distributionKeyId: null }) } });

			expect(text()).not.toContain(m.invoices_no_key());
			expect(text()).not.toContain(m.glossary_key_term());
		});

		it('nennt keinen Grund, wenn der Liegenschaftsverwalter die Rechnung ausgeschlossen hat', () => {
			show(InvoicePage, { data: { invoice: toInvoice({ ...invoiceContract, isValidUtilityCost: false }) } });

			expect(reason()).toBeUndefined();
			expect(byTestId('invoice-legal-note')!.textContent).toContain(m.invoices_legal_text());
		});

		it('nennt keinen Grund, wenn die vordefinierte Kategorie umgestellt ist', () => {
			const changed = { ...repairs, isValidUtilityCost: true };
			show(InvoicePage, {
				data: { invoice: toInvoice({ ...changed, category: { ...changed.category, isAllowedUtilityCost: true } }) }
			});

			expect(reason()).toBeUndefined();
		});
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

	// Nachzügler oder danach geändert: die Abrechnungen der Periode rechnen sie nicht so ab, wie sie jetzt ist (#96)
	// #378, Personas Anna und Marco: die Warnung führt zu den Abrechnungen, die zu berichtigen sind
	it('verlinkt die Abrechnungen des Gebäudes in der Periode, die diese Rechnung vermissen', () => {
		show(InvoicePage, {
			data: { invoice: invoice(), missedIn: [{ start: '2024-01-01', end: '2024-12-31' }] }
		});

		const link = byTestId('invoice-missed-warning')!.querySelector('a')!;
		expect(link.textContent).toBe('Abrechnungen von Seeblick ansehen');
		expect(link.getAttribute('href')).toBe('/statements?building=b1&periodStart=2024-01-01&periodEnd=2024-12-31');
		// several periods give links of the same name: each is described by its period's sentence (C-8)
		expect(document.getElementById(link.getAttribute('aria-describedby')!)!.textContent).toContain(
			'Abrechnungsperiode 01.01.2024 – 31.12.2024'
		);
	});

	it('weist darauf hin, wenn Abrechnungen der Periode diese Rechnung nicht oder mit einem früheren Stand abrechnen', () => {
		show(InvoicePage, {
			data: { invoice: invoice(), missedIn: [{ start: '2024-01-01', end: '2024-12-31' }] }
		});

		const warning = byTestId('invoice-missed-warning')!;
		const hint = warning.textContent!.replace(/\s+/g, ' ');
		expect(hint).toContain('Abrechnungen nicht aktuell');
		expect(hint).toContain(
			'Für die Abrechnungsperiode 01.01.2024 – 31.12.2024 gibt es schon Abrechnungen ohne diese Rechnung oder mit einem früheren Stand davon.'
		);
		expect(hint).toContain(
			'Berechnen Sie die Entwürfe dieser Periode mit «Neu berechnen» auf ihrer Seite neu, dann rechnen sie die Rechnung so ab, wie sie jetzt ist.'
		);
		expect(hint).toContain(
			'Versendete Abrechnungen berichtigen Sie mit «Abrechnung berichtigen» auf der Abrechnung. Die berichtigte Abrechnung rechnet an, was schon bezahlt ist. Forderungen aus der Nebenkostenabrechnung verjähren in der Regel nach fünf Jahren (Art. 128 Ziff. 1 OR); ab wann die Frist läuft, ist nicht einheitlich geklärt. Lassen Sie sich im Zweifel beraten.'
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
			'Löschen Sie nur falsch erfasste Rechnungen oder Akontorechnungen, an deren Stelle eine Schlussrechnung tritt. Ersetzt eine Schlussrechnung diese Akontorechnung, erfassen Sie zuerst die Schlussrechnung. Die Entwürfe enthalten diese Rechnung weiter: Berechnen Sie danach die Entwürfe mit «Neu berechnen» auf ihrer Seite neu. Versendete oder bezahlte Abrechnungen berichtigen Sie mit «Abrechnung berichtigen» auf der Abrechnung; die berichtigte Abrechnung rechnet an, was schon bezahlt ist. Bewahren Sie die Originalrechnung auf: Der Mieter kann Einsicht verlangen.'
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

		expect(text()).toContain('Bitte wählen Sie ein Gebäude.');
		expect(text()).toContain('Bitte geben Sie einen Rechnungssteller ein.');
		expect(text()).toContain('Bitte geben Sie einen gültigen Betrag ein.');
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

		expect(calls.at(-2)).toMatchObject({
			method: 'POST',
			path: '/invoices',
			body: { servicePeriodStart: '2024-10-01', servicePeriodEnd: '2024-12-31' }
		});
	});

	// Hilfe und Feldbeispiele nennen dasselbe Jahr, auch im nächsten Jahr (#250, Persona Dr. Weber)
	it('nennt im Leistungszeitraum dasselbe Jahr wie die Beispiele der Datumsfelder', () => {
		vi.useFakeTimers({ toFake: ['Date'] });
		vi.setSystemTime(new Date('2027-03-01T10:00:00Z'));
		try {
			show(NewInvoicePage, { data: data(false) } as never);
			const end = byTestId<HTMLInputElement>('invoice-service-end-input')!;
			fireEvent(end, 'input', 'Ende März');
			end.dispatchEvent(new Event('blur'));
			flushSync();

			expect(text()).toContain('zum Beispiel 31.12.2027.');
			const help = byTestId('invoice-service-period-help')!.textContent!;
			expect(help).toContain('Für das 4. Quartal also 01.10.2027 bis 31.12.2027');
			// welcher Boiler gemeint ist und wann der Zeitraum endet (Personas Dr. Weber P-2, Helga P-5)
			expect(help).toContain(
				'endet am Tag, bevor die Arbeit das nächste Mal gemacht wird. Ein Beispiel: Der Boiler der zentralen Warmwasseranlage wird am 01.04.2027 entkalkt'
			);
			expect(help).toContain('Geben Sie dann 01.04.2027 bis 31.03.2032 ein.');
			expect(help.match(/\d{4}/g)).toEqual(['2027', '2027', '2027', '2027', '2032']);
		} finally {
			vi.useRealTimers();
		}
	});

	// Kosten über mehrere Jahre: das Entkalken eines Boilers in der Wohnung nur, wenn der Mietvertrag es nennt (#254)
	it('erklärt beim Leistungszeitraum Kosten über mehrere Jahre und den Boiler in der Wohnung', () => {
		show(NewInvoicePage, { data: data(false) } as never);
		const help = byTestId('invoice-service-period-help')!.textContent!;

		expect(help).toContain(
			'Kosten, die nur alle paar Jahre anfallen, verteilen Sie mit dem Leistungszeitraum über diese Jahre.'
		);
		// #455 (#276): the Leistungszeitraum of the last invoice stays when the work comes earlier or later
		expect(help).toContain(
			'Kommt die Arbeit früher wieder, ändern Sie den Leistungszeitraum der letzten Rechnung nicht: Sonst ändern sich die Teile, die schon abgerechnet sind. Bis zu seinem Ende zählen dann beide Rechnungen. Kommt sie später, zählt in den Monaten dazwischen keine.'
		);
		expect(help).toContain(
			'Bei einem Boiler in der Wohnung ist das umstritten: Verrechnen Sie es nur, wenn der Mietvertrag das Entkalken des Boilers ausdrücklich als Nebenkosten nennt. Im Zweifel ist es nicht umlagefähig.'
		);
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

		expect(calls.at(-2)).toMatchObject({
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

	it('sagt bei „Umlagefähig“, was das Kästchen gerade bewirkt (Persona Marco)', async () => {
		show(NewInvoicePage, { data: data(false) } as never);
		const help = () => byTestId('invoice-utility-cost-checkbox-help')!.textContent;
		expect(help()).toBe('Die Rechnung fliesst in die Nebenkostenabrechnung ein.');
		fireEvent(byTestId<HTMLSelectElement>('invoice-category-select')!, 'change', 'c2');
		await settle();
		expect(help()).toBe('Die Rechnung fliesst nicht in die Nebenkostenabrechnung ein.');
	});

	it('sagt, dass ohne Leistungszeitraum das Rechnungsdatum die Abrechnungsperiode bestimmt', () => {
		show(NewInvoicePage, { data: data(false) } as never);
		expect(document.querySelector('#invoiceDate-help')!.textContent).toContain(
			'Ohne Leistungszeitraum bestimmt es, in welche Abrechnungsperiode die Rechnung fällt'
		);
	});

	// Der Assistent erstellt die Abrechnungen gerade: er bleibt der Weg, auch wenn Abrechnungen die Rechnung nicht enthalten
	it('wählt das Gebäude vor und kehrt nach dem Speichern zum Assistenten zurück', async () => {
		fakeBff((call) =>
			call.path === '/invoices/i9/statements'
				? [200, { ...invoiceStatements, missedIn: invoiceStatements.billedIn }]
				: [201, { ...invoiceContract, id: 'i9' }]
		);
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

	// #378: auf der Rechnungsliste stünde nur «gespeichert»; die Seite der Rechnung warnt vor den Abrechnungen ohne sie
	it('öffnet nach dem Speichern die Rechnung, wenn Abrechnungen ihrer Periode sie nicht enthalten', async () => {
		const calls = fakeBff((call) =>
			call.path === '/invoices/i9/statements'
				? [200, { ...invoiceStatements, missedIn: invoiceStatements.billedIn }]
				: [201, { ...invoiceContract, id: 'i9' }]
		);
		show(NewInvoicePage, { data: data(false) } as never);
		fill();
		submit('submit-button');
		await settle();

		expect(calls.at(-1)).toMatchObject({ method: 'GET', path: '/invoices/i9/statements' });
		expect(goto).toHaveBeenCalledWith('/invoices/i9');
	});

	// Ohne Antwort weiss Dwello nicht, ob Abrechnungen die Rechnung vermissen: die Seite der Rechnung prüft es selbst
	it('öffnet nach dem Speichern die Rechnung, wenn sich ihre Abrechnungen nicht prüfen lassen', async () => {
		fakeBff((call) => (call.method === 'GET' ? [500] : [201, { ...invoiceContract, id: 'i9' }]));
		show(NewInvoicePage, { data: data(false) } as never);
		fill();
		submit('submit-button');
		await settle();

		expect(goto).toHaveBeenCalledWith('/invoices/i9');
	});

	it('lässt die Rechnung nicht zweimal speichern, während Dwello ihre Abrechnungen prüft', async () => {
		globalThis.fetch = (async (_url: string, init?: RequestInit) =>
			init?.method === 'POST'
				? Response.json({ ...invoiceContract, id: 'i9' }, { status: 201 })
				: new Promise(() => {})) as typeof fetch;
		show(NewInvoicePage, { data: data(false) } as never);
		fill();
		submit('submit-button');
		await settle();

		expect(byTestId<HTMLButtonElement>('submit-button')!.disabled).toBe(true);
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
			'Geben Sie den Leistungszeitraum bei Rechnungen für einen Zeitraum an, zum Beispiel ein Quartal oder ein Jahr.'
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

	// #455 (#268): wer den Betrag ändert, sieht dort, dass Akontorechnungen abgezogen sind
	it('zeigt beim Betrag den Hinweis auf abgezogene Akontorechnungen', () => {
		edit({ beleg: { fileName: 'werke.pdf', mimeType: 'application/pdf', deductedAmount: '1000.00', nonAllocableItems: false } });
		expect(byTestId('invoice-deducted-hint')!.textContent).toContain('Auf dem Beleg sind Akontorechnungen von CHF\u00a01’000.00 abgezogen. Der Betrag ist das Total vor dem Abzug.');
		expect(byTestId('invoice-deducted-rule')!.textContent).toBe(
			'Prüfen Sie, dass die Akontorechnungen nicht zusätzlich erfasst sind. Ist eine noch erfasst, löschen Sie sie auf ihrer Seite mit «Rechnung löschen», auch wenn sie schon abgerechnet ist, und führen Sie danach die Abrechnungen mit ihr nach: Entwürfe mit «Neu berechnen», versendete oder bezahlte mit «Abrechnung berichtigen». Der Leistungszeitraum ist der auf dem Beleg.'
		);
	});

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
			'Ändern Sie diese Rechnung, stimmen diese Abrechnungen nicht mehr. Berechnen Sie danach die Entwürfe mit «Neu berechnen» auf ihrer Seite neu. Versendete oder bezahlte Abrechnungen berichtigen Sie mit «Abrechnung berichtigen» auf der Abrechnung; die berichtigte Abrechnung rechnet an, was schon bezahlt ist.'
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

	it('lässt die Rechnungsnummer korrigieren (Persona Helga)', async () => {
		const calls = fakeBff(() => [200, {}]);
		edit({ invoiceNumber: 'R-1001' });
		expect(byTestId<HTMLInputElement>('invoice-number-input')!.value).toBe('R-1001');
		fireEvent(byTestId<HTMLInputElement>('invoice-number-input')!, 'input', ' R-1002 ');
		submit('submit-button');
		await settle();
		expect(calls[0].body).toMatchObject({ invoiceNumber: 'R-1002' });
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
		expect(text()).toContain('Bitte geben Sie einen Grund für die Änderung an.');
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

describe('Beleg einer Rechnung', () => {
	const detail = (overrides = {}, billedIn: { start: string; end: string }[] = []) =>
		show(InvoicePage, { data: { invoice: invoice(overrides), billedIn } } as never);

	it('zeigt den gespeicherten Beleg in einem neuen Tab und bietet an, ihn zu ersetzen', () => {
		detail({ beleg: { fileName: 'huber-q1.pdf', mimeType: 'application/pdf' } });
		expect(byTestId('invoice-document-link')!.getAttribute('href')).toBe('/invoices/i1/document');
		expect(byTestId('invoice-document-link')!.getAttribute('target')).toBe('_blank');
		expect(byTestId('invoice-document-upload-button')!.textContent).toContain('Beleg ersetzen');
		expect(byTestId('invoice-keep-original')!.textContent).toContain('Bewahren Sie die Originalrechnung auf');
	});

	// #455 (#268): the browser's own file button speaks the browser's language, not the interface's
	it('bietet die Datei des Belegs mit einem eigenen Knopf an und nennt die gewählte Datei', () => {
		detail();
		const input = byTestId<HTMLInputElement>('invoice-document-file-input')!;
		const choose = byTestId('invoice-document-file-choose')!;
		expect(choose.textContent!.trim()).toBe('Datei auswählen');
		expect(choose.closest('label')!.htmlFor).toBe(input.id);
		expect(input.classList).toContain('sr-only');
		expect(byTestId('invoice-document-file-chosen')!.textContent!.trim()).toBe('Keine Datei ausgewählt');
		Object.defineProperty(input, 'files', { value: [new File(['%PDF-'], 'huber-q2.pdf')], configurable: true });
		input.dispatchEvent(new Event('change', { bubbles: true }));
		flushSync();
		expect(byTestId('invoice-document-file-chosen')!.textContent!.trim()).toBe('huber-q2.pdf');
	});

	it('sagt, dass kein Beleg gespeichert ist, und bietet an, einen hinzuzufügen', () => {
		detail();
		expect(byTestId('invoice-document-link')).toBeNull();
		expect(text()).toContain('Zu dieser Rechnung ist kein Beleg gespeichert.');
		expect(byTestId('invoice-document-upload-button')!.textContent).toContain('Beleg hinzufügen');
	});

	it('warnt bei einer abgerechneten Rechnung, dass Mieter den Beleg verlangen können', () => {
		detail({ beleg: { fileName: 'huber-q1.pdf', mimeType: 'application/pdf' } }, [{ start: '2024-01-01', end: '2024-12-31' }]);
		expect(byTestId('invoice-document-billed')!.textContent).toContain(
			'Die Rechnung ist abgerechnet; Mieter können den Beleg verlangen.'
		);
	});

	it('sagt beim Löschen, dass der Beleg mitgelöscht wird', () => {
		detail({ beleg: { fileName: 'huber-q1.pdf', mimeType: 'application/pdf' } });
		click('invoice-delete-button');
		expect(byTestId('invoice-delete-document-note')!.textContent).toBe('Der Beleg wird ebenfalls gelöscht.');
	});

	it('zeigt, was die KI beim Hochladen auf dem Beleg gesehen hat (Persona Anna; Fachreview V-3, V-4)', () => {
		const beleg = { fileName: 'werke.pdf', mimeType: 'application/pdf', deductedAmount: '1000.00', nonAllocableItems: true };
		detail({ beleg });
		// the Akonto hint sits at the Betrag (#455)
		expect(byTestId('invoice-document-hints')!.textContent).not.toContain('Akontorechnungen');
		expect(byTestId('invoice-document-hints')!.textContent).toContain(
			'Der Beleg enthält auch Kosten, die nicht umlagefähig sind (z.B. Reparaturen). Prüfen Sie, dass der Betrag nur den umlagefähigen Teil enthält und der Rest als eigene Rechnung in einer nicht umlagefähigen Kategorie erfasst ist.'
		);
		// an invoice that is not allocable keeps all its costs out already
		document.body.innerHTML = '';
		detail({ beleg: { ...beleg, deductedAmount: null }, isValidUtilityCost: false });
		expect(byTestId('invoice-document-hints')).toBeNull();
	});

	// #455 (#268): eine kurze Zeile beim Betrag, die Regel als Hilfetext darunter
	it('zeigt abgezogene Akontorechnungen beim Betrag, mit der Regel darunter', () => {
		detail({ beleg: { fileName: 'werke.pdf', mimeType: 'application/pdf', deductedAmount: '1000.00', nonAllocableItems: false } });
		const hint = byTestId('invoice-deducted-hint')!;
		expect(hint.textContent).toContain('Auf dem Beleg sind Akontorechnungen von CHF\u00a01’000.00 abgezogen. Der Betrag ist das Total vor dem Abzug.');
		expect(byTestId('invoice-deducted-rule')!.textContent).toBe(
			'Prüfen Sie, dass die Akontorechnungen nicht zusätzlich erfasst sind. Ist eine noch erfasst, löschen Sie sie auf ihrer Seite mit «Rechnung löschen», auch wenn sie schon abgerechnet ist, und führen Sie danach die Abrechnungen mit ihr nach: Entwürfe mit «Neu berechnen», versendete oder bezahlte mit «Abrechnung berichtigen». Der Leistungszeitraum ist der auf dem Beleg.'
		);
		// next to the Betrag, in the facts of the invoice
		expect(byTestId('invoice-amount')!.closest('div')!.contains(hint)).toBe(true);
	});

	// #455 (#263): immer, mit Nummer und Status jeder Abrechnung, verlinkt
	it('nennt die Abrechnungen, in denen die Rechnung enthalten ist, mit Nummer und Status', () => {
		show(InvoicePage, {
			data: {
				invoice: invoice(),
				billedIn: [{ start: '2024-01-01', end: '2024-12-31' }],
				statements: [
					{ id: 's1', statementNumber: 'NK-2024-0001', status: 'draft' },
					{ id: 's2', statementNumber: 'NK-2024-0002', status: 'replaced' }
				]
			}
		} as never);
		const links = allByTestId('invoice-billed-in-link');
		expect(links.map((link) => link.textContent!.trim())).toEqual(['NK-2024-0001, Entwurf', 'NK-2024-0002, Ersetzt']);
		expect(links.map((link) => link.getAttribute('href'))).toEqual(['/statements/s1', '/statements/s2']);
		expect(text()).toContain('In Abrechnungen enthalten');
	});

	it('sagt bei einer Rechnung in keiner Abrechnung «Keine»', () => {
		detail();
		expect(byTestId('invoice-billed-in')!.textContent!.trim()).toBe('Keine');
	});

	it('warnt nur bei einer abgerechneten Rechnung mit Beleg', () => {
		detail({}, [{ start: '2024-01-01', end: '2024-12-31' }]);
		expect(text()).toContain('Zu dieser Rechnung ist kein Beleg gespeichert.');
		expect(byTestId('invoice-document-billed')).toBeNull();
	});

	it('lehnt eine zu grosse Datei ab, bevor sie gesendet wird, und setzt den Fokus auf die Dateiauswahl', async () => {
		const calls = fakeBff(() => [200, {}]);
		detail();
		const input = byTestId<HTMLInputElement>('invoice-document-file-input')!;
		const big = new File([new Uint8Array(11 * 1024 * 1024)], 'scan.pdf');
		Object.defineProperty(input, 'files', { value: [big], configurable: true });
		click('invoice-document-upload-button');
		await settle();
		expect(text()).toContain('Die Datei ist grösser als 10 MB.');
		expect(calls).toEqual([]);
		expect(document.activeElement).toBe(input);
	});

	it('setzt den Fokus auf die Dateiauswahl, wenn keine Datei gewählt ist', async () => {
		detail();
		click('invoice-document-upload-button');
		await settle();
		expect(text()).toContain('Wählen Sie eine Datei.');
		expect(document.activeElement).toBe(byTestId('invoice-document-file-input'));
	});

	it('rät beim Löschen einer abgerechneten Rechnung, den Beleg vorher herunterzuladen (Fachreview M-6)', () => {
		detail({ beleg: { fileName: 'huber-q1.pdf', mimeType: 'application/pdf' } }, [{ start: '2024-01-01', end: '2024-12-31' }]);
		click('invoice-delete-button');
		expect(byTestId('invoice-delete-billed-document-note')!.textContent).toBe(
			'Laden Sie den Beleg vorher herunter, wenn Sie ihn für die Belegeinsicht brauchen.'
		);
		expect(byTestId('invoice-billed-warning')!.textContent).not.toContain('Mieter können den Beleg verlangen.');
	});

	it('sagt beim Beleg, dass erst die Datei gewählt und dann der Knopf gewählt wird (Persona Helga)', () => {
		detail({ beleg: { fileName: 'huber-q1.pdf', mimeType: 'application/pdf' } });
		expect(byTestId('invoice-document-file-help')!.textContent).toContain('Wählen Sie die neue Datei und dann «Beleg ersetzen».');
		document.body.innerHTML = '';
		detail();
		expect(byTestId('invoice-document-file-help')!.textContent).toContain('Wählen Sie die Datei und dann «Beleg hinzufügen».');
	});

	it('zeigt sichtbar, dass der Beleg in einem neuen Tab aufgeht (Persona Helga)', () => {
		detail({ beleg: { fileName: 'huber-q1.pdf', mimeType: 'application/pdf' } });
		const link = byTestId('invoice-document-link')!;
		expect(link.querySelector('.sr-only')).toBeNull();
		// text right beside the label, so both wrap as one, not two columns side by side on a phone (personas Marco, Anna)
		const text = [...link.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent);
		expect(text.join('').replace(/\s+/g, ' ').trim()).toBe('Beleg anzeigen (öffnet in neuem Tab)');
	});

	it('zeigt die Rechnungsnummer', () => {
		detail({ invoiceNumber: 'R-1001' });
		expect(byTestId('invoice-number')!.textContent).toContain('R-1001');
	});

	it('zeigt eine Absage des Backends beim Beleg mit ihrem Text', async () => {
		fakeBff(() => [400, { error: 'x', code: 'DOCUMENT_TYPE_NOT_ALLOWED', params: {} }]);
		detail();
		const input = byTestId<HTMLInputElement>('invoice-document-file-input')!;
		const pdf = new File([new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d])], 'r.pdf');
		Object.defineProperty(input, 'files', { value: [pdf], configurable: true });
		click('invoice-document-upload-button');
		await settle();
		expect(text()).toContain('Dwello nimmt nur PDF-, JPG- und PNG-Dateien an.');
	});
});

