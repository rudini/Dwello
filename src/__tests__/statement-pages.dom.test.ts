import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readable } from 'svelte/store';

let url = new URL('http://localhost/statements');
vi.mock('$app/environment', () => ({ browser: true }));
vi.mock('$app/navigation', () => ({ goto: vi.fn(), invalidateAll: vi.fn() }));
// enhance as SvelteKit wires it: the test plays the server's answer to an action of the page
const actions = vi.hoisted(() => new Map<string, () => unknown>());
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
import { allByTestId, byTestId, click, fakeBff, settle, show } from './helpers/dom';
import { statement } from './helpers/statement';

const text = () => document.body.textContent ?? '';
const counts = { draft: 3, sent: 2, paid: 5, overdue: 1 };

beforeEach(() => {
	url = new URL('http://localhost/statements');
	vi.mocked(invalidateAll).mockClear();
});

describe('Abrechnungsliste', () => {
	const list = (statements: ReturnType<typeof statement>[], total = statements.length, page = 1) =>
		show(StatementsPage, {
			data: {
				statements,
				total,
				page,
				pageSize: 10,
				buildings: [{ id: 'b1', name: 'Ahornhof' }],
				statusCounts: counts
			}
		} as never);

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

		expect(calls).toEqual([{ method: 'POST', path: '/statements/s1/mark-paid', body: undefined }]);
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
			'Seit dem Erstellen dieses Entwurfs wurden 2 Rechnungen für die Abrechnungsperiode erfasst, sie fehlen darin. Löschen Sie ihn und erstellen Sie die Abrechnung erneut.'
		);
	});

	it('spricht bei einer später erfassten Rechnung in der Einzahl', () => {
		later(1);
		expect(byTestId('statement-later-invoices')!.textContent).toContain(
			'wurde 1 Rechnung für die Abrechnungsperiode erfasst, sie fehlt darin'
		);
	});

	// Versendet: der Mieter hat die Abrechnung ohne die Rechnung erhalten
	it('weist bei einer versendeten Abrechnung auf später erfasste Rechnungen hin und sagt, wie man berichtigt', () => {
		later(1, 'sent');
		expect(byTestId('statement-later-invoices')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Seit dem Erstellen dieser Abrechnung wurde 1 Rechnung für die Abrechnungsperiode erfasst, sie fehlt darin. Berichtigen Sie die Abrechnung ausserhalb von Dwello gegenüber dem Mieter.'
		);
	});

	it('zeigt keinen Hinweis ohne später erfasste Rechnungen', () => {
		detail();
		expect(byTestId('statement-status')).not.toBeNull();
		expect(byTestId('statement-later-invoices')).toBeNull();
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

	it('nennt die Verwaltungspauschale mit ihrer Grundlage', () => {
		detail();

		expect(byTestId('statement-management-fee')!.textContent).toContain(
			'3 % der Nebenkosten der Liegenschaft, Anteil dieser Wohnung'
		);
		expect(text()).not.toMatch(/Verwaltungsgebühr|Verwaltungskosten/);
	});

	it('nennt eine Rückerstattung ohne Minuszeichen und ohne Zahlungsfrist für den Mieter', () => {
		detail({ balance: -83.43 });

		expect(byTestId('statement-balance')!.textContent).toMatch(/Rückerstattung.*CHF\s83.43/);
		expect(text()).not.toContain('CHF-83.43');
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
		const after = actions.get('?/delete')!() as (input: unknown) => Promise<void>;
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
		const document = { title: 'Zahlungserinnerung', channel: 'email' };
		detail(
			{ status: 'overdue' },
			{ reminder: { document, deliveryError: 'Mailserver nicht erreichbar.' } }
		);

		expect(byTestId('reminder-feedback')!.textContent).toContain(
			'Zahlungserinnerung: Mailserver nicht erreichbar. Sie liegt in den Dokumenten zum Versand bereit.'
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
		edit({ balance: -83.43 });

		expect(document.querySelector('label[for="paymentDeadline"]')!.textContent).toContain(
			'Rückerstattung bis'
		);
	});

	it('meldet, wenn das Speichern scheitert', () => {
		edit({}, { errors: { form: 'Abrechnung konnte nicht gespeichert werden.' } });

		expect(byTestId('form-error')!.textContent).toContain(
			'Abrechnung konnte nicht gespeichert werden.'
		);
	});
});
