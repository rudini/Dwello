import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readable } from 'svelte/store';
import { flushSync } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

let url = new URL('http://localhost/statements');
vi.mock('$app/environment', () => ({ browser: true }));
vi.mock('$app/navigation', () => ({ goto: vi.fn(), invalidateAll: vi.fn() }));
// enhance as SvelteKit wires it: the test plays the server's answer to an action of the page
const actions = vi.hoisted(() => new Map<string, (input?: unknown) => unknown>());
vi.mock('$app/forms', () => ({
	enhance: (form: HTMLFormElement, submit?: () => unknown) => {
		if (submit) actions.set(form.getAttribute('action')!, submit);
		return { destroy() {} };
	}
}));
vi.mock('$app/stores', () => ({
	page: { subscribe: (run: (value: unknown) => void) => readable({ url }).subscribe(run) }
}));

import { invalidateAll } from '$app/navigation';
import { get } from 'svelte/store';
import { toasts } from '$lib/stores';
import StatementsPage from '../routes/statements/+page.svelte';
import StatementPage from '../routes/statements/[id]/+page.svelte';
import EditStatementPage from '../routes/statements/[id]/edit/+page.svelte';
import { allByTestId, byTestId, click, fakeBff, fireEvent, settle, show } from './helpers/dom';
import { statement } from './helpers/statement';
import { localToday } from '$lib/contract-status';
import pdfFailed from '../../tests/contracts/statement-pdf-failed.json';

const text = () => document.body.textContent ?? '';
const counts = { draft: 3, sent: 2, paid: 5, overdue: 1 };

beforeEach(() => {
	url = new URL('http://localhost/statements');
	vi.mocked(invalidateAll).mockClear();
});

describe('Abrechnungsliste', () => {
	const list = (
		statements: ReturnType<typeof statement>[],
		total = statements.length,
		page = 1,
		scope: string | null = null
	) =>
		show(StatementsPage, {
			data: {
				statements,
				total,
				page,
				pageSize: 10,
				buildings: [{ id: 'b1', name: 'Ahornhof' }],
				scope,
				statusCounts: counts
			}
		} as never);

	const contractScope =
		'Sie sehen die Abrechnungen des Mietvertrags von Anna Keller, Wohnung 2.01 (Ahornhof), Vertragsbeginn 01.04.2024.';

	// #248: eingezogen während der Abrechnungsperiode: die Liste nennt die Mietstage, nicht die ganze Periode
	it('nennt die Tage des Mietvertrags in der Abrechnungsperiode', () => {
		list([statement({ rentalStart: '2024-07-01', rentalEnd: '2024-12-31', rentalDays: 184 })]);

		// with the Mietstage, so the dates do not read as the Abrechnungsperiode (persona review of #248)
		expect(byTestId('statement-row-s1')?.textContent).toContain('01.07.2024 – 31.12.2024, 184 Mietstage');
		expect(byTestId('statement-row-s1')?.textContent).not.toContain('01.01.2024');
	});

	// #253: ein neuer Entwurf hat noch kein PDF; die Liste sagt es und führt zur Abrechnung
	it('sagt bei einer Abrechnung ohne PDF, dass es noch nicht erstellt ist, und führt zu ihr', () => {
		list([statement({ pdfGeneratedAt: undefined })]);

		const missing = byTestId('statement-pdf-missing');
		expect(missing?.textContent?.trim()).toBe('PDF noch nicht erstellt');
		expect(missing?.getAttribute('href')).toBe('/statements/s1');
		expect(missing?.getAttribute('aria-label')).toBe(
			'PDF noch nicht erstellt: Abrechnung NK-2024-0001 von Anna Keller öffnen'
		);
		expect(byTestId('statement-pdf-link')).toBeNull();
	});

	it('sagt bei einer Abrechnung mit PDF nichts über ein fehlendes PDF', () => {
		list([statement({ pdfGeneratedAt: '2025-01-16T08:00:00Z' })]);

		expect(byTestId('statement-pdf-link')).not.toBeNull();
		expect(byTestId('statement-pdf-missing')).toBeNull();
	});

	it('sagt über der Liste, wessen Abrechnungen sie zeigt, mit einem Link zu allen', () => {
		url = new URL('http://localhost/statements?contract=c1');
		list([statement()], 1, 1, contractScope);

		expect(byTestId('statements-scope')?.textContent).toContain(contractScope);
		const all = byTestId('statements-scope')?.querySelector('a');
		expect(all?.textContent?.trim()).toBe('Alle Abrechnungen anzeigen');
		expect(all?.getAttribute('href')).toBe('/statements');
	});

	// on a phone the sentence must be on the first screen, before the tabs and the search
	it('sagt vor den Statusfiltern, wessen Abrechnungen die Liste zeigt', () => {
		url = new URL('http://localhost/statements?contract=c1');
		list([statement()], 1, 1, contractScope);

		const scope = byTestId('statements-scope')!;
		const firstTab = document.querySelector('[data-testid^="filter-"]')!;
		expect(scope.compareDocumentPosition(firstTab) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});

	it('behält den Mietvertrag in den Statuslinks und in der Suche', () => {
		url = new URL('http://localhost/statements?contract=c1');
		list([statement()], 1, 1, contractScope);

		const statusLinks = [
			...document.querySelectorAll<HTMLAnchorElement>('a[href^="/statements?"]')
		];
		expect(statusLinks.length).toBeGreaterThan(0);
		expect(statusLinks.every((a) => a.getAttribute('href')!.includes('contract=c1'))).toBe(true);
		expect(document.querySelector<HTMLInputElement>('form input[name="contract"]')?.value).toBe(
			'c1'
		);
	});

	it('behält die Abrechnungsperiode in der Suche und zählt sie als Filter', () => {
		url = new URL('http://localhost/statements?periodStart=2024-01-01&periodEnd=2024-12-31');
		list([], 0, 1, 'Sie sehen die Abrechnungen der Abrechnungsperiode 01.01.2024 – 31.12.2024.');

		expect(document.querySelector<HTMLInputElement>('form input[name="periodStart"]')?.value).toBe(
			'2024-01-01'
		);
		expect(document.querySelector<HTMLInputElement>('form input[name="periodEnd"]')?.value).toBe(
			'2024-12-31'
		);
		expect(text()).toContain('Keine Abrechnungen gefunden');
	});

	it('zählt auch ein Periodenende allein als Filter', () => {
		url = new URL('http://localhost/statements?periodEnd=2024-12-31');
		list([], 0, 1);

		expect(text()).toContain('Keine Abrechnungen gefunden');
	});

	it('bietet bei einem Mietvertrag ohne Abrechnungen «Filter zurücksetzen» an', () => {
		url = new URL('http://localhost/statements?contract=c1');
		list([], 0, 1, contractScope);

		const reset = [...document.querySelectorAll('a')].filter(
			(a) => a.textContent?.trim() === 'Filter zurücksetzen'
		);
		expect(reset.length).toBeGreaterThan(0);
		expect(reset.every((a) => a.getAttribute('href') === '/statements')).toBe(true);
	});

	// After a search the focus moves here, so the number of results is read out
	it('nennt die Treffer in einer Überschrift, die den Fokus nach der Suche nimmt', () => {
		list([statement()]);
		const results = document.querySelector<HTMLElement>('[data-results]')!;
		expect(results.textContent!.replace(/\s+/g, ' ').trim()).toBe('1 Abrechnung');
		expect(results.tabIndex).toBe(-1);
	});

	it('setzt den Fokus nach einer Suche ohne Treffer auf die Meldung', () => {
		list([]);
		expect(document.querySelector<HTMLElement>('[data-results]')!.tabIndex).toBe(-1);
	});

	it('zeigt Status, Saldo und die passenden Aktionen pro Abrechnung', () => {
		list([
			statement(),
			statement({
				id: 's2',
				status: 'overdue',
				lastReminderDate: '2025-03-10',
				pdfGeneratedAt: '2025-01-16T08:00:00Z',
				balance: -40
			})
		]);

		expect(byTestId('statement-row-s1')!.textContent).toContain('Entwurf');
		expect(
			byTestId('statement-row-s1')!.querySelector('[data-testid="statement-row-mark-paid"]')
		).toBeNull();
		const overdue = byTestId('statement-row-s2')!;
		expect(overdue.textContent).toContain('Überfällig');
		expect(overdue.textContent).toContain('Rückerstattung');
		expect(overdue.querySelector('[data-testid="statement-pdf-link"]')!.getAttribute('href')).toBe(
			'/api/statements/s2/pdf'
		);
	});

	it('nennt in jeder Zeile die Abrechnung im Link, ohne Statusmeldungen vorzulesen', () => {
		list([statement()]);

		const row = byTestId('statement-row-s1')!;
		const link = row.querySelector('[data-testid="statement-view-link"]')!;
		expect(link.getAttribute('href')).toBe('/statements/s1');
		expect(link.textContent).toMatch(/Anna Keller.*NK-2024-0001/);
		expect(row.querySelector('[role="status"], [aria-live]')).toBeNull();
		expect(row.textContent).toContain('31.12.2024');
	});

	it('zählt die Abrechnungen in Einzahl und Mehrzahl richtig', () => {
		list([statement()]);
		expect(text()).toContain('1 Abrechnung');
		expect(text()).not.toContain('1 Abrechnungen');
	});

	it('behält Gebäude und Status aus der Adresse in der Suche', () => {
		url = new URL('http://localhost/statements?building=b1&status=sent');
		list([statement()]);

		expect(byTestId<HTMLSelectElement>('statement-building-filter')!.value).toBe('b1');
		expect(document.querySelector<HTMLInputElement>('input[name="status"]')!.value).toBe('sent');
	});

	it('hält den Zahlungseingang nach einer Bestätigung direkt aus der Liste fest', async () => {
		const calls = fakeBff();
		list([statement({ status: 'sent' })]);

		click('statement-row-mark-paid');
		expect(calls).toEqual([]);
		click('statement-list-mark-paid-confirm');
		await settle();

		const today = localToday();
		expect(calls).toEqual([
			{ method: 'POST', path: '/statements/s1/mark-paid', body: { paidDate: today } }
		]);
		expect(invalidateAll).toHaveBeenCalled();
	});

	it('nennt die Zahlungsaktion so, dass sie nicht wie ein Status aussieht', () => {
		list([statement({ status: 'sent' })]);
		expect(byTestId('statement-row-mark-paid')!.textContent).toContain('Als bezahlt markieren');
	});

	it('bestätigt den Zahlungseingang mit einer Meldung', async () => {
		toasts.set([]);
		fakeBff();
		list([statement({ status: 'sent' })]);

		click('statement-row-mark-paid');
		click('statement-list-mark-paid-confirm');
		await settle();

		expect(get(toasts).map((toast) => toast.message)).toContain(
			'Abrechnung NK-2024-0001 als bezahlt markiert'
		);
		expect(document.querySelector('[role="dialog"]')).toBeNull();
	});

	// Der Knopf der Zeile verschwindet nach dem Speichern: der Fokus geht auf den Titel, nicht auf die Seite
	it('setzt nach dem Zahlungseingang aus der Liste den Fokus auf den Titel', async () => {
		fakeBff();
		list([statement({ status: 'sent' })]);
		click('statement-row-mark-paid');
		click('statement-list-mark-paid-confirm');
		await settle();

		expect(document.activeElement).toBe(document.querySelector('h1'));
	});

	it('meldet im Dialog, wenn der Zahlungseingang nicht gespeichert wird', async () => {
		fakeBff(() => [400, { error: 'Invalid status transition' }]);
		list([statement({ status: 'sent' })]);

		click('statement-row-mark-paid');
		click('statement-list-mark-paid-confirm');
		await settle();

		const dialog = document.querySelector('[role="dialog"]')!;
		expect(dialog.textContent).toContain('Abrechnung konnte nicht als bezahlt markiert werden.');
		expect(byTestId<HTMLButtonElement>('statement-list-mark-paid-confirm')!.disabled).toBe(false);
	});

	// Ein Datum in der Zukunft: die Meldung sagt, was zu tun ist
	it('zeigt die Meldung zum Zahlungsdatum aus der Prüfung', async () => {
		fakeBff(() => [
			400,
			{
				message:
					'Das Zahlungsdatum liegt in der Zukunft. Geben Sie den Tag ein, an dem das Geld eingegangen ist.'
			}
		]);
		list([statement({ status: 'sent' })]);

		click('statement-row-mark-paid');
		click('statement-list-mark-paid-confirm');
		await settle();

		expect(document.querySelector('[role="dialog"]')!.textContent).toContain(
			'Das Zahlungsdatum liegt in der Zukunft.'
		);
	});

	it('schlägt beim nächsten Öffnen wieder heute vor', () => {
		list([statement({ status: 'sent' })]);
		click('statement-row-mark-paid');
		fireEvent(byTestId<HTMLInputElement>('paid-date-input')!, 'input', '01.01.2020');
		click('dialog-cancel');
		click('statement-row-mark-paid');

		expect(byTestId<HTMLInputElement>('paid-date-input')!.value).toBe(
			localToday().split('-').reverse().join('.')
		);
	});

	// Bei einer Rückerstattung zahlt der Vermieter: keine Mahnung, und der Tag der eigenen Überweisung
	it('spricht bei einer Rückerstattung von der Überweisung, nicht von einer Mahnung', () => {
		list([statement({ status: 'sent', balance: -45 })]);
		click('statement-row-mark-paid');
		const dialog = document.querySelector('[role="dialog"]')!.textContent!;

		expect(dialog).not.toContain('Mahnung');
		expect(dialog).toContain('Der Tag, an dem Sie den Betrag überwiesen haben.');
	});

	// Zweimal ein Datum in der Zukunft: die Meldung erscheint auch beim zweiten Versuch
	it('meldet ein falsches Zahlungsdatum auch beim zweiten Versuch', () => {
		list([statement({ status: 'sent' })]);
		click('statement-row-mark-paid');
		const field = byTestId<HTMLInputElement>('paid-date-input')!;
		for (const date of ['01.01.2099', '01.01.2098']) {
			fireEvent(field, 'input', date);
			click('statement-list-mark-paid-confirm');
			flushSync();
			expect(field.getAttribute('aria-invalid'), date).toBe('true');
		}
	});

	// Chrome sendet nach Enter ein change-Ereignis: es darf den eben gesetzten Fehler nicht wieder ausblenden
	it('zeigt den Fehler nach Enter, auch wenn der Browser danach «change» meldet', () => {
		list([statement({ status: 'sent' })]);
		click('statement-row-mark-paid');
		const field = byTestId<HTMLInputElement>('paid-date-input')!;
		fireEvent(field, 'input', '01.01.2099');
		field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		field.dispatchEvent(new Event('change', { bubbles: true }));
		flushSync();

		expect(field.getAttribute('aria-invalid')).toBe('true');
	});

	// Erst ein unmögliches Datum, dann ein Tag aus dem Kalender: kein Fehler mehr zu einem gültigen Datum
	it('nimmt den Fehler weg, wenn ein Tag im Kalender gewählt wird', () => {
		list([statement({ status: 'sent' })]);
		click('statement-row-mark-paid');
		const field = byTestId<HTMLInputElement>('paid-date-input')!;
		fireEvent(field, 'input', '31.02.2026');
		field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		flushSync();
		expect(field.getAttribute('aria-invalid')).toBe('true');

		const calendar = document.querySelector<HTMLInputElement>(
			'[role="dialog"] input[type="date"]'
		)!;
		calendar.value = '2026-10-01';
		calendar.dispatchEvent(new Event('input', { bubbles: true })); // the picker sends input, then change
		calendar.dispatchEvent(new Event('change', { bubbles: true }));
		flushSync();

		expect(field.value).toBe('01.10.2026');
		expect(field.getAttribute('aria-invalid')).toBeNull();
	});

	// «01.01.25» mit Enter gesendet: wie beim Verlassen des Felds als 2025 gelesen, nicht abgelehnt
	it('liest ein zweistelliges Jahr auch, wenn mit Enter bestätigt wird', async () => {
		const calls = fakeBff();
		list([statement({ status: 'sent' })]);
		click('statement-row-mark-paid');
		const field = byTestId<HTMLInputElement>('paid-date-input')!;
		fireEvent(field, 'input', '01.01.25');
		field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		await settle();

		expect(calls).toEqual([
			{ method: 'POST', path: '/statements/s1/mark-paid', body: { paidDate: '2025-01-01' } }
		]);
	});

	// Enter im Feld bestätigt, wie in jedem Formular; der versteckte Kalender ist kein Tabstopp
	it('bestätigt mit Enter im Datumsfeld und überspringt den versteckten Kalender', async () => {
		const calls = fakeBff();
		list([statement({ status: 'sent' })]);
		click('statement-row-mark-paid');
		byTestId('paid-date-input-calendar')!.focus();
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
		expect(document.activeElement).toBe(byTestId('dialog-cancel'));

		byTestId('paid-date-input')!.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
		);
		await settle();
		expect(calls.map((call) => call.path)).toEqual(['/statements/s1/mark-paid']);
	});

	it('bleibt nicht beschäftigt, wenn die Verbindung abbricht', async () => {
		globalThis.fetch = (() => Promise.reject(new TypeError('offline'))) as typeof fetch;
		list([statement({ status: 'sent' })]);

		click('statement-row-mark-paid');
		click('statement-list-mark-paid-confirm');
		await settle();

		expect(document.querySelector('[role="dialog"]')!.textContent).toContain(
			'Abrechnung konnte nicht als bezahlt markiert werden.'
		);
		expect(byTestId<HTMLButtonElement>('statement-list-mark-paid-confirm')!.disabled).toBe(false);
	});

	it('hält die Aktionen innerhalb der Zeile, statt die Seite zu verbreitern', () => {
		list([statement({ status: 'sent', pdfGeneratedAt: '2025-01-16T08:00:00Z' })]);
		const row = byTestId('statement-row-s1')!;
		const actions = row.querySelector('[data-testid="statement-row-mark-paid"]')!.parentElement!;

		expect(row.className).not.toMatch(/col-span|grid-cols/);
		expect(actions.className).toMatch(/(^| )xl:shrink-0( |$)/);
		// the same width in every row, with or without "PDF", so amount and status line up
		expect(actions.className).toMatch(/(^| )xl:w-64( |$)/);
	});

	it('schaltet einen Statusfilter ein und wieder aus, und behält die übrigen Filter', () => {
		url = new URL('http://localhost/statements?search=Keller&status=draft&page=2');
		list([statement()]);

		expect(byTestId('filter-draft')!.getAttribute('href')).toBe('/statements?search=Keller');
		expect(byTestId('filter-sent')!.getAttribute('href')).toBe(
			'/statements?search=Keller&status=sent'
		);
	});

	it('blättert und behält dabei die Filter', () => {
		url = new URL('http://localhost/statements?status=sent&page=2');
		list([statement()], 25, 2);

		expect(byTestId('pagination-next')!.getAttribute('href')).toBe(
			'/statements?status=sent&page=3'
		);
		expect(text()).toContain('Seite 2 von 3');
	});

	it('lädt ohne Abrechnungen zum Erstellen ein', () => {
		list([]);
		expect(text()).toContain('Erstellen Sie Ihre erste Nebenkostenabrechnung.');
	});

	it('rät bei einer leeren Suche, die Filter anzupassen', () => {
		url = new URL('http://localhost/statements?search=Niemand');
		list([]);
		expect(text()).toContain('Versuchen Sie, Ihre Filter anzupassen.');
		expect(text()).not.toContain('Erstellen Sie Ihre erste Nebenkostenabrechnung.');
	});
});

describe('Abrechnungsdetail', () => {
	const detail = (overrides = {}, form: object | null = null, reminders: unknown[] = []) =>
		show(StatementPage, { data: { statement: statement(overrides), reminders }, form } as never);

	it('zeigt die Kostenpositionen mit ihrem Verteilschlüssel und den Saldo in Worten', () => {
		detail();

		expect(allByTestId('statement-line-item').map((row) => row.textContent)).toEqual([
			expect.stringMatching(/Heizung.*Nach Fläche/),
			expect.stringMatching(/Hauswartung.*Pro Wohnung/)
		]);
		expect(byTestId('statement-balance')!.textContent).toMatch(/Nachzahlung.*CHF\s363.00/);
		expect(text()).toContain('366 Mietstage');
	});

	// Nachzügler: der Entwurf würde ohne die später erfassten Rechnungen versendet
	const later = (laterInvoices: number, status: 'draft' | 'sent' = 'draft') =>
		show(StatementPage, {
			data: { statement: statement({ status }), reminders: [], laterInvoices },
			form: null
		} as never);

	it('weist beim Entwurf auf Rechnungen hin, die nach seinem Erstellen erfasst wurden', () => {
		later(2);
		expect(byTestId('statement-later-invoices')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Seit dem Erstellen dieses Entwurfs wurden 2 Rechnungen der Abrechnungsperiode erfasst, geändert oder gelöscht. Löschen Sie ihn und erstellen Sie die Abrechnung erneut.'
		);
	});

	it('spricht bei einer später erfassten Rechnung in der Einzahl', () => {
		later(1);
		expect(byTestId('statement-later-invoices')!.textContent).toContain('Rechnungen seit der Abrechnung geändert');
		expect(byTestId('statement-later-invoices')!.textContent).toContain(
			'wurde 1 Rechnung der Abrechnungsperiode erfasst, geändert oder gelöscht'
		);
	});

	// Versendet: der Mieter hat die Abrechnung ohne die Rechnung erhalten
	it('weist bei einer versendeten Abrechnung auf später erfasste Rechnungen hin und sagt, wie man berichtigt', () => {
		later(1, 'sent');
		expect(byTestId('statement-later-invoices')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Seit dem Erstellen dieser Abrechnung wurde 1 Rechnung der Abrechnungsperiode erfasst, geändert oder gelöscht. ' +
				'Versendete Abrechnungen berichtigen Sie ausserhalb von Dwello: Schicken Sie dem Mieter eine berichtigte Abrechnung mit dem Beleg. ' +
				'Verlangt die Abrechnung zu viel, schulden Sie dem Mieter die Differenz: Ziehen Sie sie von der Nachzahlung ab oder erstatten Sie sie. ' +
				'Ob Sie zusätzliche Kosten noch nachverlangen können, ist nicht in jedem Fall sicher: Lassen Sie sich im Zweifel beraten.'
		);
	});

	// Versenden oder Bezahlen verwirft ein älteres PDF: die Seite zeigt danach den Stand des Servers
	it('zeigt nach dem Versand den Stand des PDF, wie ihn der Server liefert', () => {
		const box = new SvelteMap<string, unknown>([
			['data', { statement: statement({ pdfGeneratedAt: '2026-10-05T08:00:00Z' }), reminders: [] }]
		]);
		show(StatementPage, {
			get data() {
				return box.get('data');
			},
			form: null
		} as never);
		expect(byTestId('statement-pdf-download')).not.toBeNull();

		box.set('data', {
			statement: statement({ status: 'sent', pdfGeneratedAt: undefined }),
			reminders: []
		});
		flushSync();

		expect(byTestId('statement-pdf-download')).toBeNull();
	});

	it('zeigt keinen Hinweis ohne später erfasste Rechnungen', () => {
		detail();
		expect(byTestId('statement-status')).not.toBeNull();
		expect(byTestId('statement-later-invoices')).toBeNull();
	});

	// #104: dieselben Angaben wie das PDF
	it('nennt das Mietverhältnis in der Periode', () => {
		detail({ rentalStart: '2024-01-01', rentalEnd: '2024-03-31', rentalDays: 91 });
		expect(byTestId('statement-tenancy')!.textContent!.trim()).toBe(
			'Ihr Mietverhältnis in dieser Periode: 01.01.2024 – 31.03.2024'
		);
	});

	const line = (overrides = {}) => ({
		id: 'l1',
		categoryId: 'c1',
		categoryName: 'Hauswartung',
		distributionKeyName: 'Nach Fläche',
		totalAmount: 1800,
		apartmentShare: 900,
		periodShare: 0.1703,
		shareDays: null,
		tenantShare: 306.52,
		percentage: 17.03,
		invoices: [],
		...overrides
	});
	const rowText = () => byTestId('statement-line-item')!.textContent!.replace(/\s+/g, ' ');
	const invoicesText = () => allByTestId('statement-line-invoices')[0].textContent!.replace(/\s+/g, ' ');

	it('nennt je Position den Wohnungsanteil und den Zeitanteil in Tagen, wie das PDF', () => {
		detail({ lineItems: [line({ shareDays: { days: 91, total: 366 } })] });
		expect(rowText()).toMatch(/CHF 900.00.*91\/366 Tage.*17.03 %.*CHF 306.52/);
	});

	it('nennt den Zeitanteil in Prozent, wo er nicht in Tagen aufgeht', () => {
		detail({ lineItems: [line()] });
		const timeShare = byTestId('statement-line-item')!.querySelectorAll('td')[4];
		expect(timeShare.textContent!.trim()).toBe('17.03 %');
	});

	// Persona Marco P-1: der Zeitanteil der Heizkosten kommt aus dem Heizprofil, nicht aus den Tagen
	it('nennt beim Zeitanteil nach Heizprofil das Heizprofil', () => {
		detail({ lineItems: [line({ periodShare: 0.558, byProfile: true })] });
		const timeShare = byTestId('statement-line-item')!.querySelectorAll('td')[4];
		expect(timeShare.textContent!.trim()).toBe('55.80 % nach Heizprofil');
	});

	// V-16: wer die ganze Periode mietet, trägt jeden Tag: «366/366 Tage», wie das PDF
	it('nennt den Zeitanteil in Tagen, wo er die Mietstage der Periode sind', () => {
		detail({ lineItems: [line({ periodShare: 1 })] });
		const timeShare = byTestId('statement-line-item')!.querySelectorAll('td')[4];
		expect(timeShare.textContent!.trim()).toBe('366/366 Tage');
	});

	// V-12, C-6: eine Rechnung ohne Leistungszeitraum und eine, deren Leistungszeitraum über die Periode reicht, wie im PDF
	it('nennt Rechnungen ohne Leistungszeitraum und über die Periode hinaus wie das PDF', () => {
		const whole = { start: '2024-07-01', end: '2025-06-30', amount: 1200 };
		const invoices = [
			{ id: 'i1', description: 'Hauswart', amount: 600, start: '2025-01-01', end: '2025-12-31', part: { days: 47, total: 365, noPeriod: true } },
			{ id: 'i2', description: 'Lift-Abo', amount: 595.07, start: '2025-01-01', end: '2025-06-30', part: { days: 0, total: 181, whole } }
		];
		detail({ lineItems: [line({ invoices })] });
		expect(invoicesText()).toContain('Ohne Leistungszeitraum: CHF 600.00, Ihre Mietstage 47 von 365 Tagen der Abrechnungsperiode');
		expect(invoicesText()).toContain(
			'Leistungszeitraum 01.07.2024 – 30.06.2025 (Rechnung CHF 1’200.00), davon 01.01.2025 – 30.06.2025: CHF 595.07, Ihre Mietstage 0 von 181 Tagen'
		);
	});

	// V-14: ein Betrag unter null (sinkender Tankbestand, Gutschrift) steht wie im PDF mit Minus vor der Zahl
	it('rechnet einen Betrag unter null in der Berechnung mit Minus vor der Zahl', () => {
		const invoices = [
			{ id: 'i1', description: 'Hauswart Q2', amount: 600, start: '2025-04-01', end: '2025-06-30', part: { days: 91, total: 91 } },
			{ id: 'i2', description: 'Gutschrift Q3', amount: -100, start: '2025-07-01', end: '2025-09-30', part: { days: 92, total: 92 } }
		];
		detail({ lineItems: [line({ invoices, totalAmount: 500, apartmentShare: 250, tenantShare: 250 })] });
		expect(invoicesText()).toContain('Ihr Anteil: 250.00 × (600.00 × 91/91 + -100.00 × 92/92) / 500.00 = 250.00');
	});

	it('nennt die Summe der Kosten «Ihre Nebenkosten», wie das PDF', () => {
		detail();
		expect(byTestId('statement-total-costs-label')!.textContent!.trim()).toBe('Ihre Nebenkosten');
	});

	it('führt von jeder Position zu ihren Rechnungen', () => {
		const invoice = { id: 'i1', description: 'Hauswart Q1', amount: 1800, start: '2024-01-01', end: '2024-12-31', part: null };
		detail({ lineItems: [line({ invoices: [invoice] })] });
		const link = allByTestId('statement-line-invoice-link')[0] as HTMLAnchorElement;
		expect(link.getAttribute('href')).toBe('/invoices/i1');
		expect(link.textContent!.trim()).toBe('Hauswart Q1');
		expect(invoicesText()).toContain('CHF 1’800.00');
	});

	// #240: Rechnungen über verschiedene Tage: jede mit ihren Tagen und die Berechnung, wie im PDF (#226)
	it('nennt bei Rechnungen über verschiedene Tage jede mit ihren Tagen und die Berechnung', () => {
		const invoices = [
			{ id: 'i1', description: 'Hauswart Q2', amount: 600, start: '2025-04-01', end: '2025-06-30', part: { days: 0, total: 91 } },
			{ id: 'i2', description: 'Hauswart Q3', amount: 1200, start: '2025-07-01', end: '2025-09-30', part: { days: 47, total: 92 } },
			{ id: 'fuel-stock-2025-12-31', description: 'Veränderung Tankbestand', amount: 500, start: '2025-01-01', end: '2025-12-31', fuelStock: true, part: { days: 139, total: 365 } }
		];
		detail({ lineItems: [line({ invoices, totalAmount: 2300, tenantShare: 314.4 })] });
		expect(invoicesText()).toContain('Leistungszeitraum 01.04.2025 – 30.06.2025: CHF 600.00, Ihre Mietstage 0 von 91 Tagen');
		expect(invoicesText()).toContain('Leistungszeitraum 01.07.2025 – 30.09.2025: CHF 1’200.00, Ihre Mietstage 47 von 92 Tagen');
		expect(invoicesText()).toContain('Veränderung Tankbestand 01.01.2025 – 31.12.2025: CHF 500.00, Ihre Mietstage 139 von 365 Tagen');
		expect(invoicesText()).toContain(
			'Ihr Anteil: 900.00 × (600.00 × 0/91 + 1’200.00 × 47/92 + 500.00 × 139/365) / 2’300.00 = 314.40'
		);
		// the change of the Tankbestand is no invoice: nothing to open
		expect(allByTestId('statement-line-invoice-link').map((link) => link.getAttribute('href'))).not.toContain(
			'/invoices/fuel-stock-2025-12-31'
		);
	});

	it('sagt, wenn eine Abrechnung keine Positionen hat, statt eine leere Tabelle zu zeigen', () => {
		detail({ lineItems: [] });
		expect(text()).toContain(
			'Keine Abrechnungspositionen: Für diese Abrechnungsperiode waren keine Rechnungen erfasst.'
		);
		expect(document.querySelector('table')).toBeNull();
	});

	it('gibt der Kostenaufstellung die ganze Breite, damit alle Beträge ohne Scrollen sichtbar sind', () => {
		detail();
		const table = document.querySelector('table')!;

		expect(table.closest('.lg\\:col-span-2')).toBeNull();
		expect(table.closest('.min-w-0')).not.toBeNull(); // too wide anyway: scrolls inside, not the page
	});

	it('zeigt die Kostenpositionen auf dem Handy untereinander, mit allen Beträgen ohne Wischen', () => {
		detail();
		const cards = allByTestId('statement-line-card');

		expect(cards.map((card) => card.textContent)).toEqual([
			expect.stringMatching(
				/Heizung.*Verteilschlüssel.*Nach Fläche.*Kosten des Gebäudes.*CHF\s6.000.00.*Anteil.*25 %.*Betrag.*CHF\s1.500.00/
			),
			expect.stringMatching(/Hauswartung.*Pro Wohnung/)
		]);
		// one copy per screen size: the list below md, the table from md
		expect(cards[0].closest('.md\\:hidden')).not.toBeNull();
		expect(document.querySelector('[role="region"]')!.closest('.hidden.md\\:block')).not.toBeNull();
	});

	it('bricht weder Prozente noch ein Minus von seinem Betrag um', () => {
		detail();
		const nowrap = (element: Element) =>
			element.className.split(/\s+/).includes('whitespace-nowrap');

		const percent = [...document.querySelectorAll('td, dd')].filter((cell) =>
			cell.textContent!.trim().endsWith('%')
		);
		expect(percent.length).toBeGreaterThan(0);
		expect(percent.every(nowrap)).toBe(true);
		const advance = [...document.querySelectorAll('dd')].find((dd) =>
			dd.textContent!.startsWith('−')
		)!;
		expect(nowrap(advance)).toBe(true);
	});

	it('bricht eine lange E-Mail-Adresse des Mieters um, statt die Spalte zu verbreitern', () => {
		detail({ tenantEmail: 'hausverwaltung.sehr.lange.adresse@beispiel-liegenschaften.ch' });
		const email = [...document.querySelectorAll('p')].find((p) =>
			p.textContent!.includes('beispiel-liegenschaften.ch')
		)!;

		expect(email.className.split(/\s+/)).toEqual(expect.arrayContaining(['min-w-0', 'break-all']));
	});

	// Wie im PDF: ein Anteil der eigenen Kosten
	it('nennt die Verwaltungspauschale mit ihrer Grundlage wie im PDF', () => {
		detail();
		const fee = () => byTestId('statement-management-fee')!.textContent!.replace(/\s+/g, ' ');
		expect(fee()).toContain('3 % der Zwischensumme');
		expect(text()).not.toMatch(/Verwaltungsgebühr|Verwaltungskosten/);
	});

	// Der Saldo ist auf 5 Rappen gerundet; wie im PDF lässt die Zeile «Rundung» die Rechnung aufgehen
	it('nennt die Rundung des Saldos auf 5 Rappen', () => {
		const rounding = () => allByTestId('statement-rounding').map((row) => row.textContent).join(' ').replace(/\s+/g, ' ');
		detail({ totalCosts: 784.13, totalAdvancePayments: 600, balance: 184.15 });
		expect(rounding()).toContain(
			'Nachzahlung vor Rundung CHF 184.13 Rundung auf 5 Rappen + CHF 0.02'
		);
		document.body.innerHTML = '';

		// eine Rückerstattung wird von 93.87 auf 93.85 kleiner: aus ihrer Sicht − 0.02
		detail({ totalCosts: 784.13, totalAdvancePayments: 878, balance: -93.85 });
		expect(rounding()).toContain(
			'Rückerstattung vor Rundung CHF 93.87 Rundung auf 5 Rappen − CHF 0.02'
		);
		document.body.innerHTML = '';

		detail({ totalCosts: 784.13, totalAdvancePayments: 600.03, balance: 184.1 });
		expect(byTestId('statement-rounding')).toBeNull();
	});

	// axe (definition-list, dlitem): eine Beschreibungsliste enthält nur Gruppen aus <dt> und <dd>, auch mit der Rundung
	it('gliedert die Summen mit Rundung als gültige Beschreibungsliste', () => {
		detail({ totalCosts: 784.13, totalAdvancePayments: 600, balance: 184.15 });
		for (const list of document.querySelectorAll('dl'))
			for (const child of list.children) {
				expect(['DT', 'DD', 'DIV']).toContain(child.tagName);
				if (child.tagName === 'DIV')
					expect([...child.children].every((item) => ['DT', 'DD'].includes(item.tagName))).toBe(true);
			}
	});

	it('nennt eine Rückerstattung ohne Minuszeichen und ohne Zahlungsfrist für den Mieter', () => {
		detail({ balance: -83.45 });

		expect(byTestId('statement-balance')!.textContent).toMatch(/Rückerstattung.*CHF\s83.45/);
		expect(text()).not.toContain('CHF-83.45');
		expect(text()).not.toContain('Zahlungsfrist');
		expect(byTestId('statement-payment-deadline')!.textContent).toBe('28.02.2025');
	});

	it('bietet einen Entwurf zum Versenden, Bearbeiten und Löschen an', () => {
		detail();

		expect(byTestId('statement-send-button')).not.toBeNull();
		expect(byTestId('statement-mark-paid-button')).toBeNull();
		click('statement-delete-button');
		expect(byTestId('statement-delete-confirm')).not.toBeNull();
	});

	it('bestätigt das Löschen mit der Nummer der Abrechnung', async () => {
		toasts.set([]);
		detail();
		click('statement-delete-button');
		const after = actions.get('?/delete')!({ formData: new FormData() }) as (
			input: unknown
		) => Promise<void>;
		await after({ update: async () => {}, result: { type: 'redirect' } });
		expect(get(toasts).map((toast) => toast.message)).toEqual(['Abrechnung NK-2024-0001 gelöscht']);
	});

	it('fragt vor dem Versenden nach und nennt Empfänger, Korrespondenzweg und PDF', () => {
		detail();
		click('statement-send-button');
		const dialog = document.querySelector('[role="dialog"]')!;
		expect(dialog.textContent).toContain('Dwello verschickt die Abrechnung nicht selbst');
		const recipient = byTestId('send-recipient')!.textContent!.replace(/\s+/g, ' ');
		expect(recipient).toContain('Anna Keller');
		expect(recipient).toContain('Korrespondenzkanal');
		expect(recipient).toContain('Per E-Mail');
		expect(recipient).toContain('anna@example.ch');
		const pdf = byTestId('send-pdf-view')!;
		expect(pdf.getAttribute('href')).toBe('/statements/s1/pdf?ansehen');
		expect(pdf.getAttribute('target')).toBe('_blank');
		expect(byTestId('statement-send-confirm')!.textContent).toContain('Als versendet markieren');
	});

	// Datum und Zahlungsfrist gelten ab dem Tag des Versands: ein früher erstelltes PDF trüge eine abgelaufene Frist
	it('sagt vor dem Versand, ab wann die Zahlungsfrist läuft', () => {
		detail();
		click('statement-send-button');

		expect(document.querySelector('[role="dialog"]')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Dwello datiert die Abrechnung auf den Tag, an dem Sie sie als versendet markieren. Stellen Sie das PDF deshalb am selben Tag zu.'
		);
	});

	it('sagt genau, welche Adresse für den Versand fehlt', () => {
		detail({ tenantCorrespondenceChannel: 'email', tenantEmail: '' });
		click('statement-send-button');
		expect(byTestId('send-recipient')!.textContent).toContain('keine E-Mail-Adresse erfasst');
	});

	it('nennt beim Versand per Brief die Postadresse', () => {
		detail({ tenantCorrespondenceChannel: 'letter', tenantAddress: 'Ahornweg 3, 8400 Winterthur' });
		click('statement-send-button');
		const recipient = byTestId('send-recipient')!.textContent!.replace(/\s+/g, ' ');
		expect(recipient).toContain('Per Brief');
		expect(recipient).toContain('Ahornweg 3, 8400 Winterthur');
	});

	it('bietet eine versendete Abrechnung zum Mahnen und Bezahlen an, aber nicht zum Löschen', () => {
		detail({ status: 'sent' });

		expect(byTestId('statement-send-button')).toBeNull();
		expect(byTestId('statement-delete-button')).toBeNull();
		click('statement-mark-paid-button');
		expect(byTestId('statement-mark-paid-confirm')).not.toBeNull();
	});

	it('erstellt das PDF und bietet es danach zum Herunterladen an', async () => {
		const calls = fakeBff(() => [200, { success: true }]);
		detail();

		click('statement-generate-pdf-button');
		await settle();

		expect(calls).toEqual([
			{ method: 'POST', path: '/statements/s1/generate-pdf', body: undefined }
		]);
		expect(byTestId('statement-pdf-download')!.getAttribute('href')).toBe('/statements/s1/pdf');
	});

	it('bleibt beim Erstellen-Button, wenn das PDF nicht erstellt werden kann', async () => {
		fakeBff(() => [400, { error: 'IBAN not configured' }]);
		detail();

		click('statement-generate-pdf-button');
		await settle();

		expect(byTestId('statement-pdf-download')).toBeNull();
		expect(byTestId<HTMLButtonElement>('statement-generate-pdf-button')!.disabled).toBe(false);
	});

	// code review C-2 (#125): «PDF konnte nicht erstellt werden: Das PDF konnte nicht erstellt werden …»
	it('nennt den Grund ohne Wiederholung, wenn das PDF aus einem unerwarteten Grund nicht entsteht', async () => {
		fakeBff(() => [500, pdfFailed]);
		toasts.set([]);
		detail();

		click('statement-generate-pdf-button');
		await settle();

		expect(get(toasts).map((toast) => toast.message)).toEqual([
			'Das PDF konnte nicht erstellt werden. Versuchen Sie es später erneut.'
		]);
	});

	// Das Datumsfeld liegt im Dialog, ausserhalb des Formulars: der gewählte Tag muss mitgesendet werden
	it('sendet das im Dialog gewählte Zahlungsdatum mit', () => {
		detail({ status: 'sent' });
		click('statement-mark-paid-button');
		fireEvent(byTestId<HTMLInputElement>('paid-date-input')!, 'input', '05.01.2026');
		const formData = new FormData();
		actions.get('?/markPaid')!({ formData });

		expect(formData.get('paidDate')).toBe('2026-01-05');
	});

	// Sven: ein unmögliches Datum wurde angesagt und trotzdem mit leerem Datum gespeichert
	it('prüft das Zahlungsdatum im Dialog, bevor es gesendet wird', () => {
		detail({ status: 'sent' });
		click('statement-mark-paid-button');
		const field = byTestId<HTMLInputElement>('paid-date-input')!;
		fireEvent(field, 'input', '01.01.2099');
		const submitted = vi.fn();
		document.querySelector('form[action="?/markPaid"]')!.addEventListener('submit', submitted);
		click('statement-mark-paid-confirm');
		flushSync();

		expect(submitted).not.toHaveBeenCalled();
		expect(document.querySelector('[role="dialog"]')).not.toBeNull();
		expect(field.getAttribute('aria-invalid')).toBe('true');
		expect(
			document.getElementById(
				field
					.getAttribute('aria-describedby')!
					.split(' ')
					.find((id) => id.endsWith('-error'))!
			)!.textContent
		).toContain('Das Zahlungsdatum liegt in der Zukunft.');
	});

	it('meldet im Detaildialog ein falsches Zahlungsdatum auch beim zweiten Versuch', () => {
		detail({ status: 'sent' });
		click('statement-mark-paid-button');
		const field = byTestId<HTMLInputElement>('paid-date-input')!;
		for (const date of ['01.01.2099', '01.01.2098']) {
			fireEvent(field, 'input', date);
			click('statement-mark-paid-confirm');
			flushSync();
			expect(field.getAttribute('aria-invalid'), date).toBe('true');
		}
	});

	// Nach dem Speichern: eine Bestätigung, und der Fokus auf dem Titel statt auf der Seite
	it('bestätigt den Zahlungseingang und setzt den Fokus auf den Titel', async () => {
		toasts.set([]);
		detail({ status: 'sent' });
		click('statement-mark-paid-button');
		const after = actions.get('?/markPaid')!({ formData: new FormData() }) as (
			input: unknown
		) => Promise<void>;
		await after({ update: async () => {}, result: { type: 'success' } });
		await settle();

		expect(get(toasts).map((toast) => toast.message)).toEqual(['Abrechnung als bezahlt markiert']);
		expect(document.activeElement).toBe(document.querySelector('h1'));
	});

	it('fragt beim Markieren als bezahlt nach dem Zahlungsdatum, heute vorgeschlagen', () => {
		detail({ status: 'sent' });
		click('statement-mark-paid-button');

		expect(byTestId<HTMLInputElement>('paid-date-input')!.value).toBe(
			localToday().split('-').reverse().join('.')
		);
	});

	// Gemahnt wird erst nach Ablauf der Frist, und nie bei einer Rückerstattung: dann schuldet der Vermieter
	it('bietet eine Mahnung nur bei einer überfälligen Nachzahlung an', () => {
		detail({ status: 'sent' });
		expect(byTestId('statement-reminder-button')).toBeNull();
		document.body.innerHTML = '';
		detail({ status: 'overdue', balance: -45 });
		expect(byTestId('statement-reminder-button')).toBeNull();
		expect(byTestId('statement-mark-paid-button')).not.toBeNull();
	});

	// Der Knopf sagt, was er tut: Dwello verschickt nichts selbst
	it('nennt den Knopf «Als versendet markieren»', () => {
		detail();
		expect(byTestId('statement-send-button')!.textContent!.trim()).toBe('Als versendet markieren');
	});

	// Ab dem Versand läuft die Frist: der Verlauf zeigt, wann versendet und wann bezahlt wurde
	it('führt im Verlauf Versand und Zahlung', () => {
		detail({ status: 'paid', statementDate: '2026-09-28', paidDate: '2026-10-05' });
		const history = text().replace(/\s+/g, ' ');

		expect(history).toContain('Versendet 28.09.2026');
		expect(history).toContain('Bezahlt 05.10.2026');
	});

	it('kündigt die nächste Mahnung mit ihrem Versandweg an', () => {
		detail({ status: 'overdue' });
		click('statement-reminder-button');
		expect(document.querySelector('[role="dialog"]')!.textContent).toContain('Mahnung senden');
		expect(byTestId('reminder-delivery-info')!.textContent).toContain('Zahlungserinnerung');
		expect(byTestId('reminder-delivery-info')!.textContent).toContain(
			'per E-Mail an anna@example.ch'
		);
	});

	it('lässt nach drei Mahnungen keine weitere zu', () => {
		const reminder = (level: number) => ({
			id: `d${level}`,
			tenantId: 't1',
			statementId: 's1',
			type: 'reminder',
			reminderLevel: level,
			title: `${level}. Mahnung`,
			fileName: `mahnung-${level}.pdf`,
			channel: 'letter',
			status: 'sent',
			sentAt: '2025-03-01T00:00:00Z',
			deliveryError: null,
			createdAt: '2025-03-01T00:00:00Z',
			tenantName: 'Anna Keller',
			statementNumber: 'NK-2024-0001'
		});
		detail({ status: 'overdue', tenantCorrespondenceChannel: 'letter' }, null, [
			reminder(1),
			reminder(2),
			reminder(3)
		]);

		click('statement-reminder-button');
		expect(text()).toContain('Es wurden bereits 3 Mahnungen versendet.');
		click('statement-reminder-confirm');
		expect(document.querySelector('[role="dialog"]')).toBeNull();
	});

	it('meldet, wenn eine Mahnung nicht per E-Mail zugestellt werden konnte', () => {
		const document = {
			title: 'Zahlungserinnerung',
			channel: 'email',
			deliveryErrorCode: 'MAIL_DELIVERY_FAILED'
		};
		detail(
			{ status: 'overdue' },
			{ reminder: { document, deliveryError: 'Die E-Mail konnte nicht zugestellt werden.' } }
		);

		expect(byTestId('reminder-feedback')!.textContent).toContain(
			'Das Dokument «Zahlungserinnerung» liegt unter «Dokumente» zum Versand bereit. Die E-Mail wurde nicht zugestellt. Markieren Sie die Mahnung unter «Dokumente» am Tag, an dem Sie sie zur Post bringen, als versendet: Erst dann trägt sie das Datum dieses Tages und eine neue Zahlungsfrist. Drucken Sie sie danach aus und schicken Sie sie per Post. Prüfen Sie für die nächste Mahnung die E-Mail-Adresse des Mieters.'
		);
	});

	it('bestätigt eine versendete Mahnung je nach Versandweg', () => {
		detail(
			{ status: 'overdue' },
			{ reminder: { document: { title: '2. Mahnung', channel: 'letter' } } }
		);
		expect(byTestId('reminder-feedback')!.textContent).toContain(
			'2. Mahnung liegt als Brief zum Ausdrucken in den Dokumenten bereit.'
		);
	});
});

describe('Abrechnung bearbeiten', () => {
	const edit = (overrides = {}, form: object | null = null) =>
		show(EditStatementPage, { data: { statement: statement(overrides) }, form } as never);

	it('ändert nur Frist und Bemerkungen, die Kosten bleiben wie berechnet', () => {
		edit({ notes: 'Ratenzahlung' });

		expect(byTestId<HTMLInputElement>('payment-deadline-input')!.value).toBe('28.02.2025');
		expect(text()).toContain('Freitag, 28. Februar 2025');
		expect(byTestId<HTMLTextAreaElement>('statement-notes-input')!.value).toBe('Ratenzahlung');
		expect(allByTestId('statement-line-item')).toHaveLength(2);
		expect(byTestId('statement-recalculate-hint')).not.toBeNull();
	});

	it('nennt die Frist einer Rückerstattung nicht Zahlungsfrist', () => {
		edit({ balance: -83.45 });

		expect(document.querySelector('label[for="paymentDeadline"]')!.textContent).toContain(
			'Rückerstattung bis'
		);
	});

	it('meldet eine fehlende Frist am Feld', () => {
		edit({}, { errors: { paymentDeadline: 'Die Frist fehlt. Bitte geben Sie ein Datum ein.' } });

		expect(byTestId('payment-deadline-input')!.getAttribute('aria-invalid')).toBe('true');
		expect(byTestId('form-error')!.textContent).toContain(
			'Die Frist fehlt. Bitte geben Sie ein Datum ein.'
		);
	});

	it('meldet, wenn das Speichern scheitert', () => {
		edit({}, { errors: { form: 'Abrechnung konnte nicht gespeichert werden.' } });

		expect(byTestId('form-error')!.textContent).toContain(
			'Abrechnung konnte nicht gespeichert werden.'
		);
	});
});
