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
import SplitKeysHint from '../routes/statements/SplitKeysHint.svelte';
import { allByTestId, byTestId, click, fakeBff, fireEvent, settle, show } from './helpers/dom';
import { statement } from './helpers/statement';
import type { StatementWithDetails } from '$lib/types';

// the backend's answer for a Saldo that asks no payment (#815, `paymentOf`): its tests are statement-payment.test.ts
const noPayment = { unpaid: true, claimed: false, noPayment: true };
import { localToday } from '$lib/contract-status';
import pdfFailed from '../../tests/contracts/statement-pdf-failed.json';

const text = () => document.body.textContent ?? '';
const counts = { draft: 3, sent: 2, paid: 5, settled: 4, overdue: 1 };

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

	// #448 (2): versendet ohne Zahlung, mit eigenem Filter
	it('nennt eine erledigte Abrechnung «Erledigt» und filtert nach ihr', () => {
		list([statement({ status: 'settled', balance: 3 })]);

		expect(byTestId('statement-row-s1')!.textContent).toContain('Erledigt');
		expect(byTestId('statement-row-s1')!.querySelector('[data-testid="statement-row-mark-paid"]')).toBeNull();
		const filter = byTestId('filter-settled')!;
		expect(filter.textContent!.replace(/\s+/g, ' ').trim()).toBe('4 Erledigt');
		expect(filter.getAttribute('href')).toBe('/statements?status=settled');
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
			{
				method: 'POST',
				path: '/statements/s1/mark-paid',
				body: { paidDate: today, periodEnd: '2024-12-31' }
			}
		]);
		expect(invalidateAll).toHaveBeenCalled();
	});

	// #448 (4), Code-Review 448-1 C-6: ein Tag vor dem Abrechnungsdatum wird nach der Frage gespeichert
	it('speichert aus der Liste einen Tag vor dem Abrechnungsdatum erst nach der Bestätigung', async () => {
		const calls = fakeBff();
		list([statement({ status: 'sent', statementDate: '2025-01-15' })]);

		click('statement-row-mark-paid');
		fireEvent(byTestId<HTMLInputElement>('paid-date-input')!, 'input', '10.01.2025');
		click('statement-list-mark-paid-confirm');
		await settle();
		expect(calls).toEqual([]);
		expect(byTestId('paid-date-early-warning')!.textContent!.trim()).toBe(
			'Das Zahlungsdatum liegt vor dem Abrechnungsdatum vom 15.01.2025. Trotzdem speichern?'
		);
		click('statement-list-mark-paid-early-confirm');
		await settle();

		expect(calls).toEqual([
			{ method: 'POST', path: '/statements/s1/mark-paid', body: { paidDate: '2025-01-10', periodEnd: '2024-12-31' } }
		]);
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
		list([statement({ status: 'sent', balance: -45, claimed: false })]);
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
		fireEvent(field, 'input', '20.01.25');
		field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		await settle();

		expect(calls).toEqual([
			{
				method: 'POST',
				path: '/statements/s1/mark-paid',
				body: { paidDate: '2025-01-20', periodEnd: '2024-12-31' }
			}
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

	// #403: ein Saldo unter CHF 5 wird mit der nächsten Abrechnung verrechnet, auf der Schlussabrechnung eingefordert
	// oder ausbezahlt; ab CHF 5.00 wie bisher. Was der Saldo verlangt, sagt das Backend (#815, statement-payment.test.ts)
	const carried = 'Der Betrag ist kleiner als CHF 5.00. Er wird mit der nächsten Abrechnung verrechnet.';
	it.each([
		[{ balance: 4.95, ...noPayment }, carried],
		[{ balance: -0.05, status: 'settled', ...noPayment, carried: true }, carried],
		[{ balance: 0, status: 'settled', ...noPayment }, 'Es ist nichts zu bezahlen.'],
		[{ balance: 3, final: true }, 'Der Mieter bezahlt die Nachzahlung von CHF 3.00.'],
		[{ balance: -3, final: true, claimed: false }, 'Sie erstatten dem Mieter CHF 3.00 zurück.'],
		// Fachreview 448-2 V-17: erledigt bleibt erledigt, auch mit einem späteren Vertragsende in der Periode
		[{ balance: 3, status: 'settled', final: true, ...noPayment, carried: true }, carried],
		// Fachreview 448-2 V-18: eine nach #94 einbehaltene Rückerstattung wird jetzt übertragen
		[{ balance: -0.05, status: 'paid', paidDate: '2026-02-01', paidAmount: 0, ...noPayment, carried: true }, carried],
		[{ balance: 5 }, 'Der Mieter bezahlt die Nachzahlung von CHF 5.00.'],
		[{ balance: -5, claimed: false }, 'Sie erstatten dem Mieter CHF 5.00 zurück.']
	] as [Partial<StatementWithDetails>, string][])('sagt bei %o, was mit dem Betrag geschieht', (overrides, summary) => {
		detail(overrides);
		expect(byTestId('statement-payment-summary')!.textContent!.replace(/\s+/g, ' ').trim()).toBe(summary);
	});

	// #94 versendet: eine erlassene Nachzahlung bleibt erlassen; eine einbehaltene Rückerstattung wird übertragen (oben)
	it.each([[4.95, 'Der Betrag ist kleiner als CHF 5.00. Sie verzichten darauf.']])(
		'sagt bei einer nach #94 erledigten Nachzahlung mit %s weiter, was damals galt',
		(balance, summary) => {
		detail({ balance, status: 'paid', paidDate: '2026-02-01', paidAmount: 0, ...noPayment, waived: true });
		expect(byTestId('statement-payment-summary')!.textContent!.replace(/\s+/g, ' ').trim()).toBe(summary);
		}
	);

	// Fachprüfung V-4: ohne Zahlung keine Zahlungsfrist und kein «Bezahlt am»
	it('nennt bei einer erledigten Abrechnung weder Zahlungsfrist noch Zahlungsdatum', () => {
		detail({ balance: 4.95, status: 'settled', ...noPayment, carried: true });
		expect(byTestId('statement-payment-summary')).not.toBeNull();
		expect(byTestId('statement-payment-deadline')).toBeNull();
		expect(text()).not.toContain('Bezahlt am');
		document.body.innerHTML = '';
		detail({ balance: 3, status: 'paid', paidDate: '2026-02-01', paidAmount: 3, final: true });
		expect(byTestId('statement-payment-deadline')).not.toBeNull();
		expect(text()).toContain('Bezahlt am');
	});

	// #403 (2, 3): erledigt heisst ohne Zahlung: nichts zu markieren, zurückzusetzen oder zu mahnen
	it('nennt eine erledigte Abrechnung «Erledigt» und bietet weder Zahlung noch Zurücksetzen noch Mahnung an', () => {
		detail({ balance: 3, status: 'settled', paymentDeadline: '2025-01-31' });

		expect(byTestId('statement-status')!.textContent!.trim()).toBe('Erledigt');
		for (const action of ['statement-mark-paid-button', 'statement-reset-payment-button', 'statement-reminder-button'])
			expect(byTestId(action), action).toBeNull();
		expect(byTestId('statement-correct-button')).not.toBeNull();
	});

	// persona anna-448-2 P-1: «Erledigt» trägt ein eigenes Symbol, nicht das «i» eines Hinweises
	it('zeigt «Erledigt» mit einem eigenen Symbol, nicht dem eines Entwurfs', () => {
		detail({ status: 'settled', balance: 3 });
		const settled = byTestId('statement-status')!.querySelector('svg')!.innerHTML;
		document.body.innerHTML = '';
		detail({ status: 'draft' });
		expect(settled).not.toBe(byTestId('statement-status')!.querySelector('svg')!.innerHTML);
	});

	// #403: die Schlussabrechnung fordert auch einen kleinen Betrag ein, gemahnt wird nach Ablauf der Frist
	it('bietet bei einer überfälligen Schlussabrechnung unter CHF 5 eine Mahnung an', () => {
		detail({ status: 'overdue', balance: 4.95, final: true });
		expect(byTestId('statement-reminder-button')).not.toBeNull();
	});

	// #403: der Übertrag aus der letzten Abrechnung desselben Mietvertrags, zwischen Akonto und Saldo
	it.each([
		[-3, 'Übertrag aus Abrechnung NK-2023-0001 − CHF 3.00'],
		[3, 'Übertrag aus Abrechnung NK-2023-0001 + CHF 3.00']
	])('nennt einen Übertrag von %s mit seiner Abrechnung', (balance, row) => {
		detail({ carriedFrom: { id: 's0', statementNumber: 'NK-2023-0001', balance } });
		expect(byTestId('statement-carry-over')!.textContent!.replace(/\s+/g, ' ').trim()).toBe(row);
	});

	// Fachreview 448-1 V-2: der Saldo der ersetzten Abrechnung steht schon als Übertrag in der nächsten
	it('nennt einen schon übertragenen Saldo der ersetzten Abrechnung als verrechnet', () => {
		detail({ priorPayments: 3, priorPaidOn: [], offsetWith: [{ statementNumber: 'NK-2025-0001', amount: 3 }] });
		expect(byTestId('statement-offset')!.textContent!.replace(/\s+/g, ' ').trim()).toBe(
			'Bereits verrechnet mit NK-2025-0001 − CHF 3.00'
		);
		expect(byTestId('statement-prior-payments')).toBeNull();
	});

	it('nennt ohne Übertrag keinen', () => {
		detail();
		expect(byTestId('statement-balance')).not.toBeNull();
		expect(byTestId('statement-carry-over')).toBeNull();
	});

	// Nachzügler: der Entwurf würde ohne die später erfassten Rechnungen versendet
	const later = (
		invoices: number,
		status: 'draft' | 'sent' = 'draft',
		more: { fuelStock?: boolean; correctionDue?: boolean; correctionDeclinable?: boolean; correctionLowers?: boolean } = {},
		overrides: object = {}
	) =>
		show(StatementPage, {
			data: {
				statement: statement({ status, ...overrides }),
				reminders: [],
				later: { invoices, fuelStock: false, correctionDue: false, correctionDeclinable: false, correctionLowers: false, ...more }
			},
			form: null
		} as never);
	const laterText = () => byTestId('statement-later-invoices')!.textContent!.replace(/\s+/g, ' ');

	// #506 C (Fachreview 506-1 V-4): a draft that would count another Übertrag now
	it('rät beim Versand eines Entwurfs, der jetzt einen anderen Übertrag verrechnen würde, zum Neu berechnen', () => {
		later(0, 'draft', { carryOver: true } as never);
		click('statement-send-button');
		const dialog = document.querySelector('[role="dialog"]')!.textContent!.replace(/\s+/g, ' ');
		expect(dialog).toContain('Dieser Entwurf ist nicht aktuell');
		expect(dialog).toContain(
			'Seit dem Erstellen dieses Entwurfs hat sich geändert, welchen Übertrag aus einer früheren Abrechnung er verrechnet. Berechnen Sie den Entwurf neu, bevor Sie ihn zustellen.'
		);
	});

	// #506 B (Fachreview 506-1 V-6): an open Übertrag is not «mit der nächsten Abrechnung verrechnet»
	it('nennt einen offenen Übertrag und bietet den Ausgleich von Hand an', () => {
		detail({ status: 'settled', balance: 3, noPayment: true, openCarry: true });
		expect(byTestId('statement-payment-summary')!.textContent).toBe('Der Übertrag ist noch offen. Keine Abrechnung verrechnet ihn mehr.');
		click('statement-carry-settle');
		flushSync();
		expect(document.querySelector('[role="dialog"]')!.textContent).toContain(
			'Haben Sie die Nachzahlung erhalten, oder verzichten Sie darauf? Der Übertrag gilt dann als ausgeglichen, und keine Abrechnung verrechnet ihn. Das lässt sich nicht rückgängig machen.'
		);
	});

	it('nennt den Tag, an dem ein Übertrag von Hand ausgeglichen wurde, ohne den Ausgleich noch einmal anzubieten', () => {
		detail({ status: 'settled', balance: -3, noPayment: true, carrySettledOn: '2026-10-28' });
		expect(byTestId('statement-payment-summary')!.textContent).toBe('Übertrag von Hand ausgeglichen am 28.10.2026.');
		expect(byTestId('statement-carry-settle')).toBeNull();
	});

	// #547: the send dialog of a draft that is not current says so first and offers «Neu berechnen»; sending stays possible
	it('rät beim Versand eines nicht aktuellen Entwurfs zum Neu berechnen', () => {
		later(1, 'draft');
		click('statement-send-button');
		const dialog = () => document.querySelector('[role="dialog"]')!.textContent!.replace(/\s+/g, ' ');
		expect(dialog()).toContain('Dieser Entwurf ist nicht aktuell');
		expect(dialog()).toContain(
			'Seit dem Erstellen dieses Entwurfs wurde 1 Rechnung der Abrechnungsperiode erfasst, geändert oder gelöscht. Berechnen Sie ihn neu, bevor Sie ihn zustellen.'
		);
		expect(byTestId('statement-send-confirm')).not.toBeNull();
		click('send-recalculate');
		flushSync();
		expect(byTestId('send-recipient')).toBeNull();
		expect(byTestId('statement-recalculate-confirm')).not.toBeNull();
		// code review 547-1: the focus moves into the confirmation, not behind it (persona Sven's rule of the dialogs)
		const recalculate = byTestId('statement-recalculate-confirm')!.closest('[role="dialog"]')!;
		expect(recalculate.contains(document.activeElement)).toBe(true);
		expect(document.activeElement!.getAttribute('data-testid')).toBe('dialog-cancel');
	});

	it('warnt beim Versand eines aktuellen Entwurfs nicht', () => {
		detail();
		click('statement-send-button');
		expect(document.querySelector('[role="dialog"]')!.textContent).not.toContain('nicht aktuell');
		expect(byTestId('send-recalculate')).toBeNull();
	});

	// #454 (#408 point 8): the Tankbestand changed since; titles decided 2026-10-20 (Fachreview 454-1 E-4)
	it('weist auf einen danach geänderten Tankbestand hin', () => {
		later(0, 'draft', { fuelStock: true });
		expect(laterText()).toMatch(/^\s*Tankbestand seit der Abrechnung geändert/);
		expect(laterText()).toContain('Seit dem Erstellen dieses Entwurfs wurde der Tankbestand der Abrechnungsperiode geändert.');
	});

	// Fachreview 454-1 V-8
	it('nennt danach geänderte Rechnungen und Tankbestand in einem Satz', () => {
		later(2, 'sent', { fuelStock: true });
		expect(laterText()).toMatch(/^\s*Rechnungen und Tankbestand seit der Abrechnung geändert/);
		expect(laterText()).toContain(
			'Seit dem Erstellen dieser Abrechnung wurden 2 Rechnungen der Abrechnungsperiode erfasst, geändert oder gelöscht, und der Tankbestand wurde geändert.'
		);
	});

	// PO 2026-10-20 (Fachreview 454-1 E-6): only where the task «Abrechnung berichtigen» shows (E-3)
	// PO 2026-10-20 (Fachreview 454-2 M-3 B): only when the Saldo would rise, so the landlord waives an additional claim
	it('bietet «Nicht berichtigen» an, wenn das Berichtigen den Saldo des Mieters erhöhen würde', () => {
		later(1, 'sent', { correctionDue: true, correctionDeclinable: true });
		click('statement-decline-correction-button');
		// Fachreview 454-2 V-24
		expect(document.querySelector('[role="dialog"]')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Die Abrechnung NK-2024-0001 bleibt, wie sie ist. Die Aufgabe «Abrechnung berichtigen» verschwindet von der Übersicht, und der Verlauf der Abrechnung hält fest, dass Sie nicht berichtigt haben. Sie können die Abrechnung später trotzdem berichtigen. Ändert eine weitere Rechnung oder der Tankbestand den Saldo oder eine Position noch einmal, erscheint die Aufgabe wieder.'
		);
	});

	it('bietet «Nicht berichtigen» nicht an, wenn das Berichtigen den Saldo senken würde', () => {
		later(1, 'sent', { correctionDue: true, correctionLowers: true });
		// Fachreview 454-3 V-32: and says why
		expect(laterText()).toContain(
			'Die Neuberechnung ergibt für Anna Keller eine tiefere Nachzahlung oder eine höhere Rückerstattung. Berichtigen Sie die Abrechnung, sonst verlangen Sie mehr als die tatsächlichen Kosten.'
		);
		expect(laterText()).toContain('Versendete Abrechnungen berichtigen Sie mit «Abrechnung berichtigen»');
		expect(byTestId('statement-decline-correction-button')).toBeNull();
	});

	// PO 2026-10-20 (Fachreview 454-2 V-17 A): the sentence after the change depends on the state
	it('sagt, dass die Abrechnung nicht zu berichtigen ist, wenn das Berichtigen nichts ändert', () => {
		later(1, 'sent');
		expect(laterText()).toContain(
			'wurde 1 Rechnung der Abrechnungsperiode erfasst, geändert oder gelöscht. Für Anna Keller ändert das weder den Saldo noch eine Position. Sie müssen die Abrechnung nicht berichtigen.'
		);
		expect(laterText()).not.toContain('Versendete Abrechnungen berichtigen Sie');
		expect(byTestId('statement-decline-correction-button')).toBeNull();
	});

	// Persona Anna 454 P-1: the hint leads to correcting where it says so, not only to «Nicht berichtigen»
	it('bietet im Hinweis «Abrechnung berichtigen» an, wenn das Berichtigen fällig ist', () => {
		later(1, 'sent', { correctionDue: true, correctionDeclinable: true });
		click('statement-later-correct-button');
		expect(document.querySelector('[role="dialog"]')!.textContent).toContain('berichtigte Abrechnung ersetzt');
	});

	// review p3a C-1: the hint's button follows what the backend allows, as «Weitere Aktionen» does (#788)
	it('bietet im Hinweis kein Berichtigen an, wenn das Backend es nicht erlaubt', () => {
		later(1, 'sent', { correctionDue: true }, { correctable: false });
		expect(byTestId('statement-later-invoices')).not.toBeNull();
		expect(byTestId('statement-later-correct-button')).toBeNull();
	});

	it('bietet im Hinweis kein Berichtigen an, wenn es nichts ändert', () => {
		later(1, 'sent');
		expect(byTestId('statement-later-correct-button')).toBeNull();
	});

	// Persona Anna 454 P-7: nothing left to do is no warning
	it('warnt nicht mehr, wenn nichts zu berichtigen ist', () => {
		later(1, 'sent');
		expect(byTestId('statement-later-invoices')!.dataset.tone).toBe('info');
	});

	it('warnt, solange das Berichtigen fällig ist', () => {
		later(1, 'sent', { correctionDue: true });
		expect(byTestId('statement-later-invoices')!.dataset.tone).toBe('caution');
	});

	it('nennt den Entscheid, die Abrechnung nicht zu berichtigen', () => {
		later(1, 'sent', {}, { correctionDeclined: { on: '2026-10-20' } });
		expect(laterText()).toContain('Am 20.10.2026 haben Sie entschieden, die Abrechnung nicht zu berichtigen.');
		expect(laterText()).not.toContain('Versendete Abrechnungen berichtigen Sie');
	});

	it('nennt im Verlauf, dass die Abrechnung nicht berichtigt wurde', () => {
		detail({ status: 'sent', correctionDeclined: { on: '2026-10-20' } });
		expect(document.body.textContent!.replace(/\s+/g, ' ')).toMatch(/Nicht berichtigt ?20\.10\.2026/);
	});

	it('weist beim Entwurf auf Rechnungen hin, die nach seinem Erstellen erfasst wurden', () => {
		later(2);
		expect(byTestId('statement-later-invoices')!.textContent!.replace(/\s+/g, ' ')).toContain(
			// Fachreview 454-2 V-20: also after a change of the Tankbestand
			'Seit dem Erstellen dieses Entwurfs wurden 2 Rechnungen der Abrechnungsperiode erfasst, geändert oder gelöscht. Wählen Sie «Neu berechnen», dann rechnet er mit den Rechnungen und dem Tankbestand, wie sie jetzt sind.'
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
		later(1, 'sent', { correctionDue: true });
		expect(byTestId('statement-later-invoices')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Seit dem Erstellen dieser Abrechnung wurde 1 Rechnung der Abrechnungsperiode erfasst, geändert oder gelöscht. ' +
				'Versendete Abrechnungen berichtigen Sie mit «Abrechnung berichtigen» auf der Abrechnung. Die berichtigte Abrechnung rechnet an, was schon bezahlt ist. ' +
				'Forderungen aus der Nebenkostenabrechnung verjähren in der Regel nach fünf Jahren (Art. 128 Ziff. 1 OR); ab wann die Frist läuft, ist nicht einheitlich geklärt. ' +
				'Lassen Sie sich im Zweifel beraten.'
		);
	});

	// #120, #358: berichtigte Abrechnung
	const correctDialog = () => document.querySelector('[role="dialog"]')!.textContent!.replace(/\s+/g, ' ');

	it('bietet bei einer versendeten Abrechnung das Berichtigen an und bestätigt die Folge', () => {
		detail({ status: 'sent' });
		click('statement-correct-button');

		expect(correctDialog()).toContain(
			'Die Abrechnung NK-2024-0001 wird durch eine berichtigte Abrechnung ersetzt. Die bisherige bleibt unverändert erhalten, wird nicht mehr gemahnt und lässt sich nicht mehr als bezahlt markieren. Was der Mieter schon überwiesen hat, tragen Sie bei «Bereits bezahlt» ein.'
		);
		// Personas W2e: the dialog confirms with the word of the button that opened it; the consequence before the help
		expect(byTestId('statement-correct-confirm')!.textContent).toContain('Abrechnung berichtigen');
		expect(correctDialog().indexOf('Das lässt sich nicht rückgängig machen.')).toBeLessThan(correctDialog().indexOf('verjähren'));
		expect(correctDialog()).toContain('Danach können Sie Vertragsdaten und Rechnungen korrigieren, falls nötig, und die berichtigte Abrechnung erstellen.');
		expect(correctDialog()).toContain(
			'Forderungen aus der Nebenkostenabrechnung verjähren in der Regel nach fünf Jahren (Art. 128 Ziff. 1 OR); ab wann die Frist läuft, ist nicht einheitlich geklärt.'
		);
		expect(correctDialog()).toContain('Das lässt sich nicht rückgängig machen.');
	});

	// #403 (5): was der Mieter auf die versendete Abrechnung schon überwiesen hat, auch ein Teil
	it.each(['sent', 'overdue'])('fragt beim Berichtigen einer Abrechnung im Status %s nach dem bereits Bezahlten', (status) => {
		detail({ status });
		click('statement-correct-button');

		const field = byTestId<HTMLInputElement>('statement-correct-paid-amount')!;
		expect(field.value).toBe('0.00');
		expect(document.getElementById(field.getAttribute('aria-describedby')!.split(' ')[0])!.textContent!.trim()).toBe(
			'Was der Mieter auf diese Abrechnung schon überwiesen hat, auch ein Teilbetrag.'
		);
		const formData = new FormData();
		actions.get('?/replace')!({ formData });
		expect(formData.get('paidAmount')).toBe('0.00');
	});

	// Fachreview 448-1 V-1: bei einer Rückerstattung hat der Vermieter schon überwiesen
	it('fragt beim Berichtigen einer Rückerstattung nach dem bereits Zurückerstatteten', () => {
		detail({ status: 'sent', balance: -40 });
		click('statement-correct-button');

		const field = byTestId<HTMLInputElement>('statement-correct-paid-amount')!;
		expect(document.querySelector(`label[for="${field.id}"]`)!.textContent).toContain('Bereits zurückerstattet');
		expect(document.getElementById(field.getAttribute('aria-describedby')!.split(' ')[0])!.textContent!.trim()).toBe(
			'Was Sie dem Mieter auf diese Abrechnung schon überwiesen haben, auch ein Teilbetrag.'
		);
	});

	it('meldet beim Berichtigen einen ungültigen Betrag am Feld, ohne zu ersetzen', () => {
		detail({ status: 'sent' });
		click('statement-correct-button');
		const field = byTestId<HTMLInputElement>('statement-correct-paid-amount')!;
		fireEvent(field, 'input', 'zwanzig');
		click('statement-correct-confirm');
		flushSync();

		expect(field.getAttribute('aria-invalid')).toBe('true');
		expect(correctDialog()).toContain('Der Betrag «zwanzig» ist ungültig. Geben Sie einen Betrag in Franken ein, zum Beispiel 40.00.');
	});

	// Code-Review 448-1 C-3: ein übertragener Saldo wird angerechnet
	it('nennt beim Berichtigen einer erledigten Abrechnung, was mit einem übertragenen Saldo geschieht', () => {
		detail({ status: 'settled', balance: 3, ...noPayment, carried: true });
		click('statement-correct-button');
		expect(correctDialog()).toContain(
			'Die Abrechnung NK-2024-0001 wird durch eine berichtigte Abrechnung ersetzt. Die bisherige bleibt unverändert erhalten. Enthält eine versendete nächste Abrechnung ihren Saldo schon als Übertrag, rechnet die berichtigte Abrechnung ihn als «Bereits verrechnet» an: Der Mieter bezahlt oder erhält ihn nicht doppelt. Enthält ein Entwurf ihn als Übertrag, entfernt Dwello den Übertrag sofort aus dem Entwurf; die berichtigte Abrechnung rechnet dann den ganzen Saldo ab. Ist der Saldo der berichtigten Abrechnung wieder kleiner als CHF 5.00, berechnen Sie den Entwurf neu, nachdem Sie die berichtigte Abrechnung versendet haben.'
		);
	});

	// PR #941 review (Fachreview 506-1 V-2): ein von Hand ausgeglichener Übertrag wird als bezahlt angerechnet
	it('nennt beim Berichtigen, dass ein von Hand ausgeglichener Übertrag als bezahlt angerechnet wird', () => {
		detail({ status: 'settled', balance: 3, ...noPayment, carried: true, carrySettledOn: '2026-10-28' });
		click('statement-correct-button');
		expect(correctDialog()).toContain(
			'Die Abrechnung NK-2024-0001 wird durch eine berichtigte Abrechnung ersetzt. Die bisherige bleibt unverändert erhalten. Ihren Übertrag von CHF 3.00 haben Sie am 28.10.2026 von Hand ausgeglichen: Die berichtigte Abrechnung rechnet ihn als bezahlt an, der Mieter bezahlt oder erhält ihn nicht doppelt.'
		);
	});

	// Fachreview 448-3 V-25, Code-Review 448-2 C-13: eine nach #94 einbehaltene Rückerstattung wird auch übertragen
	it('nennt beim Berichtigen einer nach #94 erledigten Rückerstattung, was mit dem übertragenen Saldo geschieht', () => {
		detail({ status: 'paid', balance: -3, paidDate: '2025-02-01', paidAmount: 0, ...noPayment, carried: true });
		click('statement-correct-button');
		expect(correctDialog()).toContain('rechnet die berichtigte Abrechnung ihn als «Bereits verrechnet» an');
	});

	// Fachreview 448-4 V-32: ein Saldo 0.00 wird nie übertragen
	it('nennt beim Berichtigen einer erledigten Abrechnung mit Saldo 0.00 keinen Übertrag', () => {
		detail({ status: 'settled', balance: 0 });
		click('statement-correct-button');
		expect(correctDialog()).not.toContain('Übertrag');
		// 448-review-3 C-18: no «Bereits bezahlt» field on a settled one, so the text does not point to it
		expect(correctDialog()).toContain(
			'Die Abrechnung NK-2024-0001 wird durch eine berichtigte Abrechnung ersetzt. Die bisherige bleibt unverändert erhalten.'
		);
		expect(correctDialog()).not.toContain('Bereits bezahlt');
	});

	it.each(['paid', 'settled'])('fragt beim Berichtigen einer Abrechnung im Status %s nicht nach dem bereits Bezahlten', (status) => {
		detail({ status, paidDate: '2025-02-01', paidAmount: 363 });
		click('statement-correct-button');
		expect(byTestId('statement-correct-paid-amount')).toBeNull();
	});

	it('nennt beim Berichtigen einer bezahlten Abrechnung den Betrag, der angerechnet wird', () => {
		detail({ status: 'paid', paidDate: '2025-02-01', paidAmount: 363 });
		click('statement-correct-button');
		expect(correctDialog()).toContain('Die berichtigte Abrechnung rechnet die CHF 363.00 an, die am 01.02.2025 bezahlt wurden.');
	});

	// Fachreview W2e V-12: angerechnet wird die Zahlung und was die Abrechnung selbst schon angerechnet hat
	it('nennt beim Berichtigen einer berichtigten Abrechnung alles, was angerechnet wird', () => {
		detail({ status: 'paid', paidDate: '2025-02-01', paidAmount: 187.45, priorPayments: 442.9, balance: 187.45 });
		click('statement-correct-button');
		// Code-Review W2e3 C-3: bezahlt wurde auch auf den ersetzten Abrechnungen, nicht nur an diesem Tag
		expect(correctDialog()).toContain(
			'Die berichtigte Abrechnung rechnet die CHF 630.35 an, die auf diese und die ersetzten Abrechnungen insgesamt bezahlt wurden.'
		);
	});

	// #447, Fachreview V-1: in the chain the landlord refunded 100 and the tenant paid 50, so 50 refunded in all
	it('nennt beim Berichtigen einer Kette mit Rückerstattung, was Sie insgesamt zurückerstattet haben', () => {
		detail({ status: 'paid', paidDate: '2025-02-01', paidAmount: 50, priorPayments: -100, balance: 50 });
		click('statement-correct-button');
		expect(correctDialog()).toContain(
			'Die berichtigte Abrechnung rechnet die CHF 50.00 an, die Sie auf diese und die ersetzten Abrechnungen insgesamt zurückerstattet haben.'
		);
	});

	// Code-Review W2e3 C-2: nach dem Ersetzen eine Bestätigung, der Fokus auf dem Titel
	it('bestätigt das Ersetzen und setzt den Fokus auf den Titel', async () => {
		toasts.set([]);
		detail({ status: 'sent' });
		click('statement-correct-button');
		const after = actions.get('?/replace')!({ formData: new FormData() }) as (input: unknown) => Promise<void>;
		await after({ update: async () => {}, result: { type: 'success' } });
		await settle();

		expect(get(toasts).map((toast) => toast.message)).toEqual(['Die Abrechnung ist ersetzt.']);
		expect(document.activeElement).toBe(document.querySelector('h1'));
	});

	it('nennt bei einer bezahlten Abrechnung ohne Zahlung keinen Betrag', () => {
		detail({ status: 'paid', paidDate: '2025-02-01', paidAmount: 0, balance: 0 });
		click('statement-correct-button');
		expect(correctDialog()).toContain('Die bisherige bleibt unverändert erhalten.');
		expect(correctDialog()).not.toContain('rechnet die');
	});

	// Fachreview W2e V-13: bei einer Rückerstattung zahlt der Vermieter
	// Code-Review 448-1 C-3: das schon Überwiesene steht im Feld «Bereits zurückerstattet»
	it('sagt bei einer versendeten Rückerstattung, die überwiesene Rückerstattung im Feld zu erfassen', () => {
		detail({ status: 'sent', balance: -40 });
		click('statement-correct-button');
		expect(correctDialog()).toContain('Was Sie schon überwiesen haben, tragen Sie bei «Bereits zurückerstattet» ein.');
		expect(correctDialog()).not.toContain('gemahnt');
	});

	it('bietet auch bei einer überfälligen Abrechnung das Berichtigen an', () => {
		detail({ status: 'overdue' });
		expect(byTestId('statement-correct-button')).not.toBeNull();
	});

	it('nennt beim Berichtigen einer bezahlten Rückerstattung, was Sie zurückerstattet haben', () => {
		detail({ status: 'paid', paidDate: '2025-02-01', balance: -40, paidAmount: -40 });
		click('statement-correct-button');
		expect(correctDialog()).toContain('Die berichtigte Abrechnung rechnet die CHF 40.00 an, die Sie am 01.02.2025 zurückerstattet haben.');
	});

	// #788: buttons and hints follow what the backend allows, not the status (here against it, to show which counts)
	it('zeigt keine weiteren Aktionen, wenn das Backend nichts mehr erlaubt', () => {
		detail({ status: 'sent', editable: false, correctable: false });
		expect(byTestId('statement-payment-summary')).not.toBeNull();
		expect(text()).not.toContain('Weitere Aktionen');
	});

	it('bietet das Berichtigen nur an, wenn das Backend es erlaubt', () => {
		detail({ status: 'sent', correctable: false });
		expect(byTestId('statement-correct-button')).toBeNull();
		expect(byTestId('statement-recalculate-button')).not.toBeNull();
	});

	it('verlangt keine Zahlung, wenn das Backend keine verlangt', () => {
		detail({ status: 'sent', asksPayment: false });
		expect(text()).toContain('Diese Abrechnung ist ersetzt und gilt nicht mehr.');
		expect(byTestId('statement-payment-deadline')).toBeNull();
	});

	it('weist nur auf später erfasste Rechnungen hin, wenn die Abrechnung noch bearbeitet werden kann', () => {
		show(StatementPage, { data: { statement: statement({ status: 'sent', editable: false }), reminders: [], later: { invoices: 1, fuelStock: true, correctionDue: false } }, form: null } as never);
		expect(byTestId('statement-later-invoices')).toBeNull();
	});

	// #528: a Kategorie the draft's invoices bill by several Verteilschlüssel, on the draft and in the «Neu berechnen» question
	describe('Kategorie mit verschiedenen Verteilschlüsseln', () => {
		const split = { categoryId: 'c1', keyId: null, mainKeyId: 'k1', categoryName: 'Hauswart', keyName: 'Pro Einheit', mainKeyName: 'Pro Fläche (m²)' };
		const later = (invoices: { id: string; description: string }[]) => ({ invoices: 0, fuelStock: false, correctionDue: false, splitKeys: [{ ...split, invoices }] });
		const showWith = (overrides: Partial<StatementWithDetails>, invoices = [{ id: 'i4', description: 'Hauswart Q4' }]) =>
			show(StatementPage, { data: { statement: statement(overrides), reminders: [], later: later(invoices) }, form: null } as never);

		it('nennt auf dem Entwurf die Rechnung mit dem anderen Verteilschlüssel und führt zu ihr', () => {
			showWith({});
			const hint = byTestId('statement-split-keys')!;
			expect(hint.textContent!.replace(/\s+/g, ' ')).toContain(
				'Hauswart steht in mehreren Positionen. Die grösste wird nach «Pro Fläche (m²)» verteilt, diese Rechnung nach «Pro Einheit»:'
			);
			expect(hint.querySelector('[data-testid="split-keys-invoice-link"]')!.getAttribute('href')).toBe('/invoices/i4');
			expect(hint.textContent).toContain('Legt der Mietvertrag einen Verteilschlüssel fest, gilt er für alle Rechnungen der Kategorie.');
		});

		it('spricht bei mehreren Rechnungen von diesen Rechnungen', () => {
			showWith({}, [{ id: 'i3', description: 'Hauswart Q3' }, { id: 'i4', description: 'Hauswart Q4' }]);
			expect(byTestId('statement-split-keys')!.textContent).toContain('diese Rechnungen nach «Pro Einheit»:');
		});

		it('nennt sie auch in der Frage vor dem Neuberechnen', () => {
			showWith({});
			click('statement-recalculate-button');
			expect(byTestId('statement-recalculate-split-keys')!.textContent).toContain('Ist das nicht gewollt, ändern Sie zuerst den Verteilschlüssel der Rechnung.');
		});

		// Code-Review 528-1 C-3: the preview of several buildings names each one; the same Kategorie without a key in both
		it('nennt in der Vorschau mehrerer Gebäude zu jeder Rechnung ihr Gebäude', () => {
			const hint = (buildingId: string, buildingName: string, id: string) => ({ ...split, buildingId, buildingName, invoices: [{ id, description: `Hauswart ${buildingName}` }] });
			show(SplitKeysHint, { splitKeys: [hint('b1', 'Musterhaus Zentrum', 'i1'), hint('b2', 'Seepark Residenz', 'i2')], end: '', testid: 'hint' } as never);
			const lines = allByTestId('split-keys-line').map((line) => line.textContent!.replace(/\s+/g, ' '));
			expect(lines).toHaveLength(2);
			expect(lines[0]).toContain('Musterhaus Zentrum');
			expect(lines[1]).toContain('Seepark Residenz');
		});

		it('nennt sie nicht auf einer versendeten Abrechnung', () => {
			showWith({ status: 'sent', correctable: true });
			expect(byTestId('statement-status')).not.toBeNull();
			expect(byTestId('statement-split-keys')).toBeNull();
		});
	});

	it('bietet beim Entwurf kein Berichtigen an', () => {
		detail();
		expect(byTestId('statement-send-button')).not.toBeNull();
		expect(byTestId('statement-correct-button')).toBeNull();
	});

	it('führt bei einer ersetzten Abrechnung ohne berichtigte zum Erstellen und bietet nichts anderes an', () => {
		detail({ status: 'replaced', replacedBy: null });

		expect(byTestId('statement-status')!.textContent).toContain('Ersetzt');
		expect(byTestId('statement-create-correction-button')).not.toBeNull();
		expect(byTestId('statement-replaced')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Stimmen Vertragsdaten oder Rechnungen nicht, korrigieren Sie sie jetzt. Erstellen Sie danach die berichtigte Abrechnung.'
		);
		for (const offer of ['statement-edit-button', 'statement-correct-button', 'statement-mark-paid-button', 'statement-delete-button'])
			expect(byTestId(offer)).toBeNull();
	});

	// Personas W2e (Sven, Helga, Dr. Weber): die ersetzte Abrechnung verlangt nichts mehr und lässt keine leere Karte stehen
	it('sagt bei einer ersetzten Abrechnung, dass sie nicht mehr gilt, ohne Zahlung und ohne leere Aktionen', () => {
		detail({ status: 'replaced', replacedBy: { id: 's2', statementNumber: 'NK-2024-0007' }, balance: -40, paidDate: '2025-02-01' });

		expect(text()).toContain('Diese Abrechnung ist ersetzt und gilt nicht mehr.');
		expect(text()).not.toContain('Sie erstatten dem Mieter');
		// Code-Review W2e3 C-6: keine Frist mehr
		expect(byTestId('statement-payment-deadline')).toBeNull();
		expect(text()).not.toContain('Weitere Aktionen');
	});

	it('weist bei einer ersetzten Abrechnung nicht mehr auf später erfasste Rechnungen hin', () => {
		show(StatementPage, { data: { statement: statement({ status: 'replaced' }), reminders: [], later: { invoices: 1, fuelStock: true, correctionDue: false } }, form: null } as never);
		expect(byTestId('statement-replaced')).not.toBeNull();
		expect(byTestId('statement-later-invoices')).toBeNull();
	});

	// Persona Helga P-1: die Vertragsdaten korrigiert man im Mietvertrag
	it('führt von der ersetzten Abrechnung zum Mietvertrag', () => {
		detail({ status: 'replaced', replacedBy: null, contractId: 'c1' });
		expect(byTestId('statement-replaced-contract-link')!.getAttribute('href')).toBe('/contracts/c1');
	});

	// Code-Review W2e2 C-4: ein Doppelklick erstellt keine zweite berichtigte Abrechnung
	it('lässt die berichtigte Abrechnung nur einmal erstellen, solange sie entsteht', async () => {
		detail({ status: 'replaced', replacedBy: null });
		actions.get('?/correct')!();
		flushSync();
		expect((byTestId('statement-create-correction-button') as HTMLButtonElement).disabled).toBe(true);
	});

	// #788: whether the statement is replaced, the backend says (`superseded`); the page does not read the status for it
	it('zeigt den Hinweis auf die berichtigte Abrechnung, wenn das Backend die Abrechnung ersetzt nennt', () => {
		detail({
			status: 'sent',
			superseded: true,
			replacedBy: { id: 's2', statementNumber: 'NK-2024-0007' }
		});
		expect(byTestId('statement-replaced-by-link')!.getAttribute('href')).toBe('/statements/s2');
	});

	it('nennt bei einer ersetzten Abrechnung die berichtigte', () => {
		detail({ status: 'replaced', replacedBy: { id: 's2', statementNumber: 'NK-2024-0007' } });

		expect(byTestId('statement-replaced-by-link')!.textContent).toContain('NK-2024-0007');
		expect(byTestId('statement-replaced-by-link')!.getAttribute('href')).toBe('/statements/s2');
		expect(byTestId('statement-create-correction-button')).toBeNull();
	});

	it('nennt bei der berichtigten Abrechnung die ersetzte und zieht das schon Bezahlte ab', () => {
		detail({
			replaces: { id: 's0', statementNumber: 'NK-2024-0001', statementDate: '2025-01-15' },
			priorPayments: 200,
			priorPaidOn: ['NK-2024-0001'],
			balance: 100
		});

		expect(byTestId('statement-replaces-link')!.getAttribute('href')).toBe('/statements/s0');
		expect(byTestId('statement-replaces')!.textContent!.replace(/\s+/g, ' ')).toContain('Ersetzt die Abrechnung NK-2024-0001 vom 15.01.2025');
		expect(byTestId('statement-prior-payments')!.textContent).toMatch(/Bereits bezahlt auf NK-2024-0001\s*−\s*CHF\s200.00/);
		expect(byTestId('statement-rounding')).toBeNull();
	});

	// #464 (Fachreview F-4, Entscheid A): die berichtigte Abrechnung zählt das Akonto des Mietvertrags; weicht es von
	// der ersetzten ab, sagt sie es vor dem Versenden
	it('warnt, wenn die berichtigte Abrechnung ein anderes Akonto abzieht als die ersetzte', () => {
		const replaces = { id: 's0', statementNumber: 'NK-2024-0001', statementDate: '2025-01-15' };
		detail({ replaces: { ...replaces, totalAdvancePayments: '1200.00' }, advanceChanged: true });

		expect(byTestId('statement-advance-differs')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Die Akontobeiträge dieser Abrechnung (CHF 1’800.00) sind anders als in der ersetzten Abrechnung NK-2024-0001 (CHF 1’200.00). Stimmt ein früherer Betrag am Mietvertrag nicht, löschen Sie diesen Entwurf, tragen Sie den Betrag mit seinem «Gültig ab» ein und erstellen Sie die berichtigte Abrechnung erneut.'
		);
		expect(byTestId('statement-advance-paid')!.textContent).toMatch(/CHF\s1’800.00/);
		// #477 (product owner 2026-10-19): the agreed Akonto, not «geleistet» (fach review 477-1 V-4)
		expect(byTestId('statement-advance-paid')!.previousElementSibling!.textContent).toBe('Akontobeiträge');
	});

	it('warnt nicht bei gleichem Akonto', () => {
		const replaces = { id: 's0', statementNumber: 'NK-2024-0001', statementDate: '2025-01-15' };
		detail({ replaces: { ...replaces, totalAdvancePayments: 1800 } });
		expect(byTestId('statement-advance-differs')).toBeNull();
	});

	it('warnt nach dem Versenden nicht mehr', () => {
		const replaces = { id: 's0', statementNumber: 'NK-2024-0001', statementDate: '2025-01-15' };
		detail({ status: 'sent', replaces: { ...replaces, totalAdvancePayments: 1200 } });
		expect(byTestId('statement-advance-differs')).toBeNull();
	});

	// Fachreview W2e V-4, V-11: jede Abrechnung der Kette, auf die bezahlt wurde; eine Rückerstattung zählt dazu
	it('nennt jede Abrechnung, auf die schon bezahlt oder zurückerstattet wurde', () => {
		detail({
			replaces: { id: 's1b', statementNumber: 'NK-B', statementDate: '2025-03-01' },
			priorPayments: -20,
			priorPaidOn: ['NK-A', 'NK-B'],
			balance: 320
		});

		expect(byTestId('statement-prior-payments')!.textContent).toMatch(/Bereits zurückerstattet auf NK-A und NK-B\s*\+\s*CHF\s20.00/);
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
	const rounding = () => allByTestId('statement-rounding').map((row) => row.textContent).join(' ').replace(/\s+/g, ' ');

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
		expect(invoicesText()).toContain('Ihr Anteil: 250.00 × (600.00 × 91/91 – 100.00 × 92/92) / 500.00 = 250.00');
	});

	// #451, Persona Dr. Weber P-1 (bestand seit #71/#354): eine Heizrechnung nach Heizprofil rechnet in der Formel mit dem
	// Anteil nach Heizprofil wie das PDF, nicht mit Tagen: 1'520.00 × 44.20 % + 1'410.00 × 100.00 %
	it('rechnet eine Heizrechnung nach Heizprofil mit dem Anteil nach Heizprofil wie das PDF', () => {
		const profile = (percent: number) => ({ percent, months: [], periodMonths: [] });
		const invoices = [
			{ id: 'i1', description: 'Fernwärme Q1', amount: 1520, start: '2025-01-01', end: '2025-12-31', part: { days: 184, total: 365, noPeriod: true, profile: profile(44.2) } },
			{ id: 'i2', description: 'Fernwärme Q4', amount: 1410, start: '2025-10-01', end: '2025-12-31', part: { days: 92, total: 92, profile: profile(100) } }
		];
		detail({ lineItems: [line({ invoices, totalAmount: 2930, apartmentShare: 750.84, tenantShare: 533.16 })] });
		expect(invoicesText()).toContain('Ihr Anteil: 750.84 × (1’520.00 × 44.20 % + 1’410.00 × 100.00 %) / 2’930.00 = 533.16');
	});

	// #507 (Persona Dr. Weber P-7 von #451): jede Rechnung nach Heizprofil nennt ihren Anteil nach Heizprofil wie das
	// PDF, nicht die Mietstage
	it('nennt bei einer Heizrechnung nach Heizprofil den Anteil nach Heizprofil statt der Mietstage', () => {
		const profile = (percent: number) => ({ percent, months: [], periodMonths: [] });
		const invoices = [
			{ id: 'i1', description: 'Fernwärme Q1', amount: 1520, start: '2025-01-01', end: '2025-12-31', part: { days: 184, total: 365, noPeriod: true, profile: profile(44.2) } },
			{ id: 'i2', description: 'Fernwärme Q4', amount: 1410, start: '2025-10-01', end: '2025-12-31', part: { days: 92, total: 92, profile: profile(100) } }
		];
		detail({ lineItems: [line({ invoices, totalAmount: 2930, apartmentShare: 750.84, tenantShare: 533.16 })] });
		expect(invoicesText()).toContain('Leistungszeitraum 01.10.2025 – 31.12.2025: CHF 1’410.00, Anteil nach Heizprofil: 100.00 %');
		expect(invoicesText()).toContain('Ohne Leistungszeitraum: CHF 1’520.00, Anteil nach Heizprofil: 44.20 %');
		expect(invoicesText()).not.toContain('Mietstage');
	});

	// #507: auch eine Rechnung über die Periode hinaus und die Veränderung des Tankbestands nach Heizprofil
	it('nennt bei Tankbestand und Rechnung über die Periode hinaus den Anteil nach Heizprofil', () => {
		const profile = { percent: 43, months: [], periodMonths: [] };
		const whole = { start: '2024-10-01', end: '2025-03-31', amount: 1820 };
		const invoices = [
			{ id: 'i1', description: 'Heizöl', amount: 905.03, start: '2025-01-01', end: '2025-03-31', part: { days: 90, total: 90, whole, profile } },
			{ id: 'fuel-stock-2025-12-31', description: 'Veränderung Tankbestand', amount: 500, start: '2025-01-01', end: '2025-12-31', fuelStock: true, part: { days: 365, total: 365, profile } }
		];
		detail({ lineItems: [line({ invoices, totalAmount: 1405.03, apartmentShare: 702.52, tenantShare: 302.08 })] });
		expect(invoicesText()).toContain('Leistungszeitraum 01.10.2024 – 31.03.2025 (Rechnung CHF 1’820.00), davon 01.01.2025 – 31.03.2025: CHF 905.03, Anteil nach Heizprofil: 43.00 %');
		expect(invoicesText()).toContain('Veränderung Tankbestand 01.01.2025 – 31.12.2025: CHF 500.00, Anteil nach Heizprofil: 43.00 %');
		expect(invoicesText()).not.toContain('Mietstage');
	});

	// #451, Punkt 1 (Code-Review C-3): Rechnungen, die zusammen null ergeben, haben keinen Zeitanteil; Ihr Anteil ist die
	// Summe ihrer Teile mal der Anteil der Wohnung nach dem Verteilschlüssel, wie im PDF
	it('rechnet Rechnungen, die zusammen null ergeben, je Rechnung wie das PDF', () => {
		const invoices = [
			{ id: 'i1', description: 'Hauswart Q3', amount: 900, start: '2025-07-01', end: '2025-09-30', part: { days: 47, total: 92 } },
			{ id: 'i2', description: 'Gutschrift Q2', amount: -900, start: '2025-04-01', end: '2025-06-30', part: { days: 0, total: 91 } }
		];
		detail({ lineItems: [line({ invoices, totalAmount: 0, apartmentShare: 0, periodShare: 0, tenantShare: 229.89 })] });
		expect(invoicesText()).toContain('Ihr Anteil: (900.00 × 47/92 – 900.00 × 0/91) × Anteil Ihrer Wohnung nach dem Verteilschlüssel = 229.89');
		expect(invoicesText()).not.toContain('/ 0.00');
		expect(byTestId('statement-line-item')!.querySelectorAll('td')[4].textContent!.trim()).toBe('–');
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

	// #89, persona Dr. Weber P-3: without an agreed fee there is none; like the PDF, no line «0 % der Zwischensumme»
	it('zeigt ohne Verwaltungspauschale keine Zeile dafür, wie das PDF', () => {
		detail({ managementFee: '0.00', managementFeePercent: '0.00' });
		expect(text()).toContain('Zwischensumme');
		expect(byTestId('statement-management-fee')).toBeNull();
	});

	// Der Saldo ist auf 5 Rappen gerundet (hier kaufmännisch, wie vor #79); wie im PDF lässt die Zeile «Rundung» die Rechnung aufgehen
	it('nennt die Rundung des Saldos auf 5 Rappen', () => {
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

	// Nur zugunsten des Mieters (#79): die Nachzahlung wird kleiner, die Rückerstattung grösser (+), um bis 4 Rappen
	it('zeigt die Rundung zugunsten des Mieters vom gezeigten Betrag aus', () => {
		detail({ totalCosts: 784.13, totalAdvancePayments: 600, balance: 184.1 });
		expect(rounding()).toContain(
			'Nachzahlung vor Rundung CHF 184.13 Rundung auf 5 Rappen − CHF 0.03'
		);
		document.body.innerHTML = '';

		detail({ totalCosts: 877.99, totalAdvancePayments: 878, balance: -0.05 });
		expect(rounding()).toContain(
			'Rückerstattung vor Rundung CHF 0.01 Rundung auf 5 Rappen + CHF 0.04'
		);
	});

	// axe (definition-list, dlitem): eine Beschreibungsliste enthält nur Gruppen aus <dt> und <dd>, auch mit der Rundung
	it('gliedert die Summen mit Rundung als gültige Beschreibungsliste', () => {
		detail({ totalCosts: 784.13, totalAdvancePayments: 600, balance: 184.15 });
		expect(byTestId('statement-total-costs-label')!.closest('dl')).not.toBeNull();
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
		detail({ tenantCorrespondenceChannel: 'letter', tenantAddress: 'Ahornweg 3, 8400 Winterthur' });
		click('statement-send-button');
		const dialog = document.querySelector('[role="dialog"]')!;
		expect(dialog.textContent).toContain('Dwello verschickt die Abrechnung nicht selbst');
		// #449, Entscheid V-7: der Brief wird ein Dokument
		expect(dialog.textContent).toContain('Dwello legt sie dann unter «Dokumente» ab.'); // N-8
		// persona Helga P-1 (Entscheid): zuerst am Tag der Zustellung markieren, dann unter «Dokumente» ausdrucken
		expect(dialog.textContent).toContain(
			'Dwello verschickt die Abrechnung nicht selbst. Markieren Sie die Abrechnung am Tag, an dem Sie sie zustellen, als versendet. Dwello legt sie dann unter «Dokumente» ab. Drucken Sie sie dort aus.'
		);
		const recipient = byTestId('send-recipient')!.textContent!.replace(/\s+/g, ' ');
		expect(recipient).toContain('Anna Keller');
		expect(recipient).toContain('Korrespondenzkanal');
		const pdf = byTestId('send-pdf-view')!;
		expect(pdf.getAttribute('href')).toBe('/statements/s1/pdf?ansehen');
		expect(pdf.getAttribute('target')).toBe('_blank');
		expect(byTestId('statement-send-confirm')!.textContent).toContain('Als versendet markieren');
	});

	// #86: wünscht der Mieter E-Mail, sendet Dwello das PDF selbst
	it('fragt vor dem Senden per E-Mail nach und nennt die E-Mail-Adresse', () => {
		detail();
		expect(byTestId('statement-send-button')!.textContent!.trim()).toBe('Per E-Mail senden');
		click('statement-send-button');
		const dialog = document.querySelector('[role="dialog"]')!.textContent!.replace(/\s+/g, ' ');
		expect(dialog).toContain('Abrechnung per E-Mail senden');
		expect(dialog).toContain(
			'Dwello sendet die Abrechnung als PDF per E-Mail an den Mieter und legt sie unter «Dokumente» ab. Dwello datiert die Abrechnung auf den Tag des Versands. Die Zahlungsfrist ist so viele Tage danach, wie in den Einstellungen festgelegt; eine spätere Zahlungsfrist, die Sie bei der Abrechnung eingetragen haben, bleibt.'
		);
		expect(dialog).not.toContain('nicht selbst');
		const recipient = byTestId('send-recipient')!.textContent!.replace(/\s+/g, ' ');
		expect(recipient).toContain('Per E-Mail');
		expect(recipient).toContain('anna@example.ch');
		expect(byTestId('statement-send-confirm')!.textContent).toContain('Per E-Mail senden');
	});

	// #449 (Entscheid in #404, Punkt 6): der Brief statt der E-Mail, ohne den Korrespondenzkanal zu ändern
	it('bietet im E-Mail-Dialog den Brief an und sagt, was bei einer unzustellbaren E-Mail zu tun ist', () => {
		detail({ tenantAddress: 'Ahornweg 3, 8400 Winterthur' });
		click('statement-send-button');
		expect(document.querySelector('[role="dialog"]')!.textContent).toContain(
			'Kommt die E-Mail später als unzustellbar zurück, stellen Sie die Abrechnung per Brief zu. Mahnen Sie dann erst, wenn der Mieter die Abrechnung per Brief erhalten hat und die Zahlungsfrist danach abgelaufen ist.'
		);

		click('send-by-letter-instead');
		flushSync();

		expect(byTestId('statement-send-confirm')!.textContent).toContain('Als versendet markieren');
		expect(byTestId('send-recipient')!.textContent).toContain('Ahornweg 3, 8400 Winterthur');
		expect(document.querySelector<HTMLInputElement>('input[name="byLetter"]')?.value).toBe('true');
	});

	it('bietet ohne E-Mail-Adresse nur den Brief an', () => {
		detail({ tenantEmail: null, tenantAddress: 'Ahornweg 3, 8400 Winterthur' });
		// persona Helga P-2: schon der Knopf nennt den Brief, nicht die E-Mail
		expect(byTestId('statement-send-button')!.textContent!.trim()).toBe('Als versendet markieren');
		click('statement-send-button');

		expect(byTestId('statement-send-confirm')!.textContent).toContain('Als versendet markieren');
		expect(byTestId('send-by-letter-instead')).toBeNull();
		// Entscheid V-9: der Dialog sagt, warum nur der Brief bleibt
		expect(document.querySelector('[role="dialog"]')!.textContent).toContain('Für Anna Keller ist keine E-Mail-Adresse erfasst.');
		expect(document.querySelector<HTMLInputElement>('input[name="byLetter"]')?.value).toBe('true');
	});

	it('sagt nach einer gescheiterten E-Mail, was schiefging, und bietet den Brief an', () => {
		detail({ tenantAddress: 'Ahornweg 3, 8400 Winterthur' }, { sendError: 'Die E-Mail wurde nicht zugestellt.' });
		expect(text()).toContain('Abrechnung nicht versendet');
		expect(byTestId('send-feedback')!.textContent).toBe('Die E-Mail wurde nicht zugestellt.');

		expect(byTestId('statement-send-by-letter')!.textContent!.trim()).toBe('Selbst per Brief zustellen');
		click('statement-send-by-letter');
		const dialog = document.querySelector('[role="dialog"]')!;
		expect(dialog.textContent).toContain('Dwello verschickt die Abrechnung nicht selbst');
		// the letter goes to the postal address (code review C-1)
		const recipient = byTestId('send-recipient')!.textContent!.replace(/\s+/g, ' ');
		expect(recipient).toContain('Per Brief, Ahornweg 3, 8400 Winterthur');
		expect(recipient).not.toContain('anna@example.ch');
		expect(dialog.closest('body')!.querySelector<HTMLInputElement>('input[name="byLetter"]')!.value).toBe('true');
		expect(byTestId('statement-send-confirm')!.textContent).toContain('Als versendet markieren');
	});

	// Datum und Zahlungsfrist gelten ab dem Tag des Versands: ein früher erstelltes PDF trüge eine abgelaufene Frist
	it('sagt vor dem Versand, ab wann die Zahlungsfrist läuft', () => {
		detail({ tenantCorrespondenceChannel: 'letter' });
		click('statement-send-button');

		expect(document.querySelector('[role="dialog"]')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Dwello datiert die Abrechnung auf den Tag, an dem Sie sie als versendet markieren. Stellen Sie das PDF deshalb am selben Tag zu.'
		);
	});

	it('sagt genau, welche Adresse für den Versand fehlt', () => {
		detail({ tenantCorrespondenceChannel: 'email', tenantEmail: '' });
		click('statement-send-button');
		// #449: without an e-mail address the dialog offers the letter and says why
		expect(document.querySelector('[role="dialog"]')!.textContent).toContain('keine E-Mail-Adresse erfasst');
	});

	it('nennt beim Versand per Brief die Postadresse', () => {
		detail({ tenantCorrespondenceChannel: 'letter', tenantAddress: 'Ahornweg 3, 8400 Winterthur' });
		click('statement-send-button');
		const recipient = byTestId('send-recipient')!.textContent!.replace(/\s+/g, ' ');
		expect(recipient).toContain('Per Brief');
		expect(recipient).toContain('Ahornweg 3, 8400 Winterthur');
	});

	// A-5 (#114): nach dem Auszug ginge die Abrechnung an die verlassene Wohnung; versenden bleibt möglich
	it('warnt vor dem Versand, wenn der ausgezogene Mieter noch die Adresse der Wohnung hat', () => {
		detail({ tenantName: 'Eva Frei', oldAddress: true });
		click('statement-send-button');
		expect(byTestId('send-old-address')!.textContent).toContain(
			'Eva Frei ist ausgezogen. Die Adresse ist noch die der Wohnung. Tragen Sie die neue Adresse ein.'
		);
		expect(byTestId('statement-send-confirm')).not.toBeNull();
	});

	// Persona W3c Anna P-2: schon auf der Seite des Entwurfs, nicht erst im Dialog; nach dem Versand nicht mehr
	it('warnt auf der Seite eines Entwurfs, wenn der ausgezogene Mieter noch die Adresse der Wohnung hat', () => {
		detail({ tenantName: 'Eva Frei', tenantId: 't1', oldAddress: true, status: 'draft' });
		const warning = byTestId('statement-old-address')!;
		expect(warning.textContent).toContain(
			'Eva Frei ist ausgezogen. Die Adresse ist noch die der Wohnung. Tragen Sie die neue Adresse ein.'
		);
		expect(warning.querySelector('a')!.getAttribute('href')).toBe('/tenants/t1/edit');
	});

	it('warnt auf der Seite einer versendeten Abrechnung nicht mehr', () => {
		detail({ oldAddress: true, status: 'sent' });
		expect(byTestId('statement-old-address')).toBeNull();
	});

	it('warnt nicht, solange die Adresse nicht die der Wohnung ist', () => {
		detail({ oldAddress: false });
		click('statement-send-button');
		expect(byTestId('send-recipient')).not.toBeNull();
		expect(byTestId('send-old-address')).toBeNull();
	});

	// #338: nur ein Entwurf wird neu berechnet, mit derselben Nummer; Helga 338 P-2: die Bestätigung nennt die Folge
	it('bietet einen Entwurf zum Neuberechnen an und nennt vorher, was bleibt und was sich ändert', () => {
		detail({ status: 'draft' });

		expect(byTestId('statement-recalculate-button')!.textContent!.trim()).toBe('Neu berechnen');
		click('statement-recalculate-button');

		expect(byTestId('statement-recalculate-confirm')).not.toBeNull();
		expect(document.querySelector('[role="dialog"]')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Nummer, Heizprofil, Verwaltungspauschale, Abrechnungsdatum, Zahlungsfrist und Bemerkung bleiben. Beträge, Positionen und Saldo ändern sich. Ein schon erstelltes PDF wird verworfen.'
		);
	});

	it('bietet eine versendete Abrechnung zum Mahnen und Bezahlen an, aber nicht zum Löschen', () => {
		detail({ status: 'sent' });
		expect(byTestId('statement-recalculate-button')).toBeNull();

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

	// #105: wer das PDF erstellt, sieht, in welcher Sprache es entsteht
	it('nennt beim Erstellen die Sprache des Mieters für das PDF', () => {
		detail({ tenantLanguage: 'fr' });
		expect(byTestId('statement-pdf-language')!.textContent).toBe('PDF auf Französisch');
	});

	// ein erstelltes PDF behält die Sprache, in der es entstand; welche, speichert Dwello nicht
	it('nennt beim Herunterladen keine Sprache', () => {
		detail({ tenantLanguage: 'fr', pdfGeneratedAt: '2025-01-16T08:00:00.000Z' });
		expect(byTestId('statement-pdf-download')).not.toBeNull();
		expect(byTestId('statement-pdf-language')).toBeNull();
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

	// #523 (Option C, A; Fachreview 448-4 Punkt 5): eine Teilzahlung ist noch keine Zahlung der Abrechnung
	it('sagt im Dialog, dass eine Teilzahlung noch nicht als bezahlt markiert wird, auch bei einer Rückerstattung', () => {
		detail({ status: 'sent', balance: 120 });
		click('statement-mark-paid-button');
		const due = byTestId('paid-partial-hint')!.textContent!.trim();
		document.body.innerHTML = '';
		detail({ status: 'sent', balance: -80 });
		click('statement-mark-paid-button');

		expect([due, byTestId('paid-partial-hint')!.textContent!.trim()]).toEqual([
			'Hat der Mieter erst einen Teil überwiesen, markieren Sie die Abrechnung noch nicht als bezahlt.',
			'Haben Sie erst einen Teil zurückerstattet, markieren Sie die Abrechnung noch nicht als bezahlt.'
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
		detail({ status: 'overdue', balance: -45, claimed: false });
		expect(byTestId('statement-reminder-button')).toBeNull();
		expect(byTestId('statement-mark-paid-button')).not.toBeNull();
	});

	// #94: ein Saldo unter CHF 5, nach #94 erledigt, wird nicht eingefordert, auch überfällig nach dem Zurücksetzen der
	// Zahlung nicht
	it('bietet bei einem Saldo unter CHF 5 keine Mahnung an', () => {
		detail({ status: 'overdue', balance: 4.95, ...noPayment });
		expect(byTestId('statement-mark-paid-button')).not.toBeNull();
		expect(byTestId('statement-reminder-button')).toBeNull();
	});

	// Code-Review C-3: das Bezahlt-Markieren verspricht nicht, dass danach keine Mahnung mehr möglich ist
	it('sagt beim Bezahlt-Markieren eines Saldos unter CHF 5 nichts über Mahnungen', () => {
		detail({ status: 'overdue', balance: 4.95, ...noPayment });
		click('statement-mark-paid-button');
		expect(document.querySelector('[role="dialog"]')!.textContent).not.toContain('Mahnung');
	});

	// Der Knopf sagt, was er tut: Dwello verschickt nichts selbst
	it('nennt den Knopf «Als versendet markieren»', () => {
		detail({ tenantCorrespondenceChannel: 'letter' });
		expect(byTestId('statement-send-button')!.textContent!.trim()).toBe('Als versendet markieren');
	});

	// Ab dem Versand läuft die Frist: der Verlauf zeigt, wann versendet und wann bezahlt wurde
	// #449 (Entscheid in #404, Punkt 7): der Verlauf nennt den Weg des Versands
	it('nennt im Verlauf, wie die Abrechnung versendet wurde', () => {
		const delivered = (delivery: object) =>
			show(StatementPage, {
				data: { statement: statement({ status: 'sent', statementDate: '2026-09-28' }), reminders: [], delivery },
				form: null
			} as never);

		delivered({ channel: 'letter', recipient: null, sentAt: '2026-09-28T08:15:00Z' });
		expect(text().replace(/\s+/g, ' ')).toContain('Versendet per Brief 28.09.2026');
		document.body.innerHTML = '';
		delivered({ channel: 'email', recipient: 'anna@example.ch', sentAt: '2026-09-28T08:15:00Z' });
		expect(text().replace(/\s+/g, ' ')).toContain('Versendet per E-Mail an anna@example.ch 28.09.2026, 10:15');
	});

	// #524 (Fachreview 524-1 V-3, V-4): das versendete PDF zum Herunterladen, ein später erstelltes als neues nach dem Versand
	it('bietet im Verlauf das versendete PDF an und nennt ein später erstelltes als neues PDF', () => {
		show(StatementPage, {
			data: {
				statement: statement({ status: 'sent', statementDate: '2026-09-28', pdfGeneratedAt: '2026-10-05T09:00:00Z' }),
				reminders: [],
				delivery: { id: 'doc-1', channel: 'letter', recipient: null, sentAt: '2026-09-28T08:15:00Z' }
			},
			form: null
		} as never);

		const history = text().replace(/\s+/g, ' ');
		expect(byTestId<HTMLAnchorElement>('statement-history-sent-pdf')!.getAttribute('href')).toBe('/documents/doc-1/pdf');
		expect(history.indexOf('Versendet per Brief')).toBeLessThan(history.indexOf('Neues PDF erstellt 05.10.2026'));
	});

	// #524 (Fachreview 524-1 V-1, M-1): nach dem Speichern, was nur im neuen PDF steht; ohne Dokument (vor #449) kein Satz zum Verlauf
	it('rät nach einer Änderung, das neue PDF zu senden, und nennt das versendete im Verlauf nur, wenn es eines gibt', () => {
		const changed = (pdfChange: string, delivery: object | null) =>
			show(StatementPage, {
				data: { statement: statement({ status: 'sent' }), reminders: [], delivery, pdfChange },
				form: null
			} as never);

		// code review 524-2 C-7: an address with another value shows no hint, also a name every object has
		changed('toString', null);
		const unknown = byTestId('statement-pdf-changed');
		document.body.innerHTML = '';
		changed('refund_by', { id: 'doc-1', channel: 'letter', recipient: null, sentAt: '2026-09-28T08:15:00Z' });
		const withDocument = byTestId('statement-pdf-changed')!.textContent!.replace(/\s+/g, ' ').trim();
		document.body.innerHTML = '';
		changed('notes', null);

		expect(unknown).toBeNull();
		expect([withDocument, byTestId('statement-pdf-changed')!.textContent!.replace(/\s+/g, ' ').trim()]).toEqual([
			'Im versendeten PDF steht das bisherige Datum der Rückerstattung. Damit der Mieter das neue kennt, erstellen Sie das neue PDF und senden Sie es ihm. Das versendete PDF finden Sie im Verlauf.',
			'Die neue Bemerkung steht nur im neuen PDF. Soll der Mieter sie lesen, erstellen Sie das neue PDF und senden Sie es ihm.'
		]);
	});

	// #609 (persona Dr. Weber P-1 of #503): a draft's PDF is made anew on every request, so its Verlauf claims none;
	// a sent statement keeps the PDF as sent and names it
	it('nennt im Verlauf eines Entwurfs kein erstelltes PDF', () => {
		detail({ pdfGeneratedAt: '2026-10-05T08:00:00Z' });
		expect(text().replace(/\s+/g, ' ')).not.toMatch(/PDF erstellt \d/);
		document.body.innerHTML = '';
		detail({ status: 'sent', statementDate: '2026-09-28', pdfGeneratedAt: '2026-09-28T08:00:00Z' });
		expect(text().replace(/\s+/g, ' ')).toMatch(/PDF erstellt 28\.09\.2026/);
	});

	it('führt im Verlauf Versand und Zahlung', () => {
		detail({ status: 'paid', statementDate: '2026-09-28', paidDate: '2026-10-05' });
		const history = text().replace(/\s+/g, ' ');

		expect(history).toContain('Versendet 28.09.2026');
		expect(history).toContain('Bezahlt 05.10.2026');
	});

	// #403 (4): vor dem Ende der Abrechnungsperiode kann das Geld nicht für diese Abrechnung sein
	it('prüft im Dialog, dass das Zahlungsdatum nicht vor dem Ende der Abrechnungsperiode liegt', () => {
		detail({ status: 'sent', statementDate: '2025-01-15' });
		click('statement-mark-paid-button');
		const field = byTestId<HTMLInputElement>('paid-date-input')!;
		fireEvent(field, 'input', '30.12.2024');
		click('statement-mark-paid-confirm');
		flushSync();

		expect(field.getAttribute('aria-invalid')).toBe('true');
		expect(text()).toContain(
			'Das Zahlungsdatum liegt vor dem Ende der Abrechnungsperiode am 31.12.2024. Geben Sie frühestens dieses Datum ein.'
		);
	});

	// #403 (4): ein Mieter darf früher zahlen; ein Tag vor dem Abrechnungsdatum gilt nach einer Bestätigung
	it('fragt bei einem Zahlungsdatum vor dem Abrechnungsdatum nach, bevor es gespeichert wird', () => {
		detail({ status: 'sent', statementDate: '2025-01-15' });
		click('statement-mark-paid-button');
		const field = byTestId<HTMLInputElement>('paid-date-input')!;
		fireEvent(field, 'input', '10.01.2025');
		click('statement-mark-paid-confirm');
		flushSync();

		expect(field.getAttribute('aria-invalid')).not.toBe('true');
		expect(byTestId('paid-date-early-warning')!.textContent!.trim()).toBe(
			'Das Zahlungsdatum liegt vor dem Abrechnungsdatum vom 15.01.2025. Trotzdem speichern?'
		);
		expect(byTestId('statement-mark-paid-early-confirm')!.textContent).toContain('Trotzdem speichern');
		// Code-Review 448-1 C-7: a screen reader reads the question
		expect(byTestId('paid-date-early-warning')!.closest('[aria-live="polite"]')).not.toBeNull();
		// another day asks again
		fireEvent(field, 'input', '16.01.2025');
		flushSync();
		expect(byTestId('paid-date-early-warning')).toBeNull();
		expect(byTestId('statement-mark-paid-confirm')).not.toBeNull();
	});

	// Code-Review 448-1 C-6: nach der Frage wird das frühere Datum gesendet
	it('sendet ein Zahlungsdatum vor dem Abrechnungsdatum nach der Bestätigung', () => {
		detail({ status: 'sent', statementDate: '2025-01-15' });
		click('statement-mark-paid-button');
		fireEvent(byTestId<HTMLInputElement>('paid-date-input')!, 'input', '10.01.2025');
		const submitted = vi.spyOn(HTMLFormElement.prototype, 'requestSubmit').mockImplementation(() => {});
		click('statement-mark-paid-confirm');
		flushSync();
		expect(submitted).not.toHaveBeenCalled();
		click('statement-mark-paid-early-confirm');

		expect(submitted).toHaveBeenCalledTimes(1);
		submitted.mockRestore();
	});

	it('sendet das Ende der Abrechnungsperiode mit, damit der Server dieselbe Grenze prüft', () => {
		detail({ status: 'sent', statementDate: '2025-01-15' });
		click('statement-mark-paid-button');
		const formData = new FormData();
		actions.get('?/markPaid')!({ formData });

		expect(formData.get('periodEnd')).toBe('2024-12-31');
	});

	// #92: eine erfasste Zahlung lässt sich zurücksetzen, nach einer Bestätigung mit der Folge
	it('bietet nur bei einer bezahlten Abrechnung an, die Zahlung zurückzusetzen', () => {
		detail({ status: 'sent' });
		expect(byTestId('statement-reset-payment-button')).toBeNull();
		document.body.innerHTML = '';
		detail({ status: 'paid', paidDate: '2025-02-05' });
		expect(byTestId('statement-reset-payment-button')!.textContent!.trim()).toBe('Zahlung zurücksetzen');
	});

	// die Folge mit dem Status, der dann gilt: vor Ablauf der Zahlungsfrist «Versendet», danach «Überfällig» (Fachprüfung V-4)
	it('nennt vor dem Zurücksetzen die Folge mit dem Status, der dann gilt', () => {
		const dialogText = () => document.querySelector('[role="dialog"]')!.textContent!.replace(/\s+/g, ' ');
		detail({ status: 'paid', paidDate: '2025-02-05', paymentDeadline: '2999-12-31', deadlinePassed: false });
		click('statement-reset-payment-button');

		expect(dialogText()).toContain('Die Abrechnung NK-2024-0001 gilt dann wieder als nicht bezahlt und hat den Status «Versendet».');
		expect(dialogText()).toContain('Das Zahlungsdatum 05.02.2025 wird gelöscht.');

		document.body.innerHTML = '';
		detail({ status: 'paid', paidDate: '2025-02-05', paymentDeadline: '2025-02-14' });
		click('statement-reset-payment-button');
		expect(dialogText()).toContain('hat den Status «Überfällig».');
	});

	it('bestätigt das Zurücksetzen der Zahlung', async () => {
		toasts.set([]);
		detail({ status: 'paid', paidDate: '2025-02-05' });
		click('statement-reset-payment-button');
		const after = actions.get('?/resetPayment')!({ formData: new FormData() }) as (
			input: unknown
		) => Promise<void>;
		await after({ update: async () => {}, result: { type: 'success' } });
		await settle();

		expect(get(toasts).map((toast) => toast.message)).toEqual([
			'Die Zahlung der Abrechnung NK-2024-0001 ist zurückgesetzt.'
		]);
	});

	// zweimal dieselbe Zahlung zurückgesetzt: beide Zeilen stehen im Verlauf (Fachprüfung V-11)
	it('führt im Verlauf jedes Zurücksetzen einer Zahlung', () => {
		const reset = { resetOn: '2025-02-10', paidDate: '2025-02-05' };
		detail({ status: 'sent', statementDate: '2025-01-15', paymentResets: [reset, reset] });

		expect(text().replace(/\s+/g, ' ').split('Zahlung vom 05.02.2025 zurückgesetzt 10.02.2025')).toHaveLength(3);
	});

	// #449 (Entscheid in #404, Punkt 4): der Dialog nennt die Sprache, in der Dwello die Mahnung schreibt
	it('nennt vor der Mahnung die Sprache, in der sie geschrieben ist', () => {
		detail({ status: 'overdue', tenantLanguage: 'fr' });
		click('statement-reminder-button');

		expect(byTestId('reminder-delivery-info')!.textContent).toContain(
			'Dwello erstellt die Zahlungserinnerung auf Französisch als PDF'
		);
	});

	// #449 (Punkt 6, #283): Kanal E-Mail, aber keine Adresse: vorher sagen, dass der Brief unter «Dokumente» liegt
	it('sagt vor der Mahnung, wenn für den Mieter keine E-Mail-Adresse erfasst ist', () => {
		detail({ status: 'overdue', tenantEmail: null });
		click('statement-reminder-button');

		// Entscheid V-3 A: dazu die Sprache und das Markieren am Tag der Post
		expect(byTestId('reminder-delivery-info')!.textContent).toBe(
			'Für Anna Keller ist keine E-Mail-Adresse erfasst. Dwello erstellt die Mahnung als PDF. Sie liegt danach unter «Dokumente» zum Ausdrucken. Die Zahlungserinnerung ist auf Deutsch. Markieren Sie den Brief dort am Tag, an dem Sie ihn zur Post bringen, als versendet.'
		);
		expect(text()).not.toContain('per E-Mail an .');
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
		// #59: what follows is outside Dwello, a termination for arrears needs its own notice
		expect(text()).toContain('Eine Mahnung von Dwello ist eine Zahlungsaufforderung. Sie ist keine Zahlungsfrist mit Kündigungsandrohung nach Art. 257d OR.');
		expect(text()).toContain('Lassen Sie sich beraten.');
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
			'Das Dokument «2. Mahnung» liegt unter «Dokumente» als Brief zum Ausdrucken bereit.'
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

	// review i837c1 C-1: a statement without a Frist (the column allows none) shows the field empty
	it('zeigt eine fehlende Frist als leeres Feld', () => {
		edit({ paymentDeadline: null });

		expect(byTestId<HTMLInputElement>('payment-deadline-input')!.value).toBe('');
	});

	// the page names a missing Frist; the browser's own check stopped the form in WebKit at the hidden calendar field
	it('überlässt die Prüfung der Seite, nicht dem Browser', () => {
		edit();

		expect(document.querySelector('form')!.noValidate).toBe(true);
	});

	it('nennt die Frist einer Rückerstattung nicht Zahlungsfrist', () => {
		edit({ balance: -83.45 });

		expect(document.querySelector('label[for="paymentDeadline"]')!.textContent).toContain(
			'Rückerstattung bis'
		);
	});

	// #94 (Persona Marco P-1): ein Saldo unter CHF 5 wird weder eingefordert noch ausbezahlt, also keine Frist
	it('fragt bei einem Saldo unter CHF 5 nach keiner Frist', () => {
		edit({ balance: -2.5, ...noPayment });

		expect(byTestId('statement-notes-input')).not.toBeNull();
		expect(byTestId('payment-deadline-input')).toBeNull();
	});

	// #403: die Schlussabrechnung fordert auch einen kleinen Betrag ein, bis zur Frist
	it('fragt bei einer Schlussabrechnung unter CHF 5 nach der Frist', () => {
		edit({ balance: 3, final: true });
		expect(byTestId('payment-deadline-input')).not.toBeNull();
	});

	// #403 (6): die Bemerkung steht im PDF; bei der berichtigten Abrechnung der Grund der Berichtigung
	it.each([
		[{}, 'Zum Beispiel eine Absprache mit dem Mieter. Die Bemerkung steht im PDF, das der Mieter erhält.'],
		[
			{ replaces: { id: 's0', statementNumber: 'NK-2024-0000', statementDate: '2025-01-10' } },
			'Schreiben Sie hier, warum Sie die Abrechnung berichtigen. Die Bemerkung steht im PDF, das der Mieter erhält.'
		]
	])('erklärt die Bemerkung bei %o', (overrides, help) => {
		edit(overrides);
		const field = byTestId('statement-notes-input')!;
		expect(document.getElementById(field.getAttribute('aria-describedby')!.split(' ')[0])!.textContent!.trim()).toBe(help);
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
