import { describe, it, expect, vi } from 'vitest';

vi.mock('$app/forms', () => ({ enhance: () => ({ destroy() {} }) }));
vi.mock('$app/navigation', () => ({ goto: vi.fn() }));

import { goto } from '$app/navigation';

import DocumentsPage from '../routes/documents/+page.svelte';
import { allByTestId, byTestId, click, fireEvent, show } from './helpers/dom';
import documentList from '../../tests/contracts/documents.json';

const letter = (overrides = {}) => ({
	id: 'd1',
	tenantId: 't1',
	statementId: 's1',
	type: 'reminder',
	reminderLevel: 1,
	title: 'Zahlungserinnerung',
	fileName: 'zahlungserinnerung.pdf',
	channel: 'letter',
	status: 'to_send',
	sentAt: null,
	deliveryError: null,
	createdAt: '2025-03-01T00:00:00Z',
	tenantName: 'Anna Keller',
	statementNumber: 'NK-2024-0001',
	...overrides
});
const documents = (
	list: ReturnType<typeof letter>[],
	status: string | null = null,
	form: object | null = null,
	tenantId: string | null = null
) =>
	show(DocumentsPage, {
		data: {
			documents: list,
			status,
			tenantId,
			tenants: [
				{ id: 't1', name: 'Anna Keller' },
				{ id: 't2', name: 'Beat Huber' }
			]
		},
		form
	} as never);
const upload = (overrides = {}) =>
	letter({
		type: 'upload',
		title: 'Ausweiskopie',
		fileName: 'ausweis.jpg',
		channel: null,
		status: null,
		statementId: null,
		statementNumber: null,
		reminderLevel: null,
		createdAt: '2025-03-01T09:05:00Z',
		...overrides
	});

// #449 (V-2 A, N-1 A): a reminder of a statement paid or replaced since; no new Versandstatus, a derived row
describe('Mahnung, die nicht mehr hinausgeht', () => {
	it('nennt den Grund, bietet kein Markieren an und nennt keine Zahlungsfrist', () => {
		documents([
			letter({ notToSend: 'paid', paymentDeadline: '2025-03-11' }),
			letter({ id: 'd2', notToSend: 'replaced', paymentDeadline: '2025-03-11' })
		]);

		const [paid, replaced] = allByTestId('document-row');
		expect(paid.querySelector('[data-testid="document-status"]')!.textContent!.trim()).toBe(
			'Nicht mehr versenden: Abrechnung bezahlt'
		);
		expect(replaced.querySelector('[data-testid="document-status"]')!.textContent!.trim()).toBe(
			'Nicht mehr versenden: Abrechnung ersetzt'
		);
		expect(paid.textContent).not.toContain('Zahlungsfrist');
		expect(paid.textContent).not.toContain('Als versendet markieren');
	});
});

// #545 (persona weber-545 P-1): the Zahlungsfrist of a letter starts on the day it is marked sent, when Dwello remakes it
describe('Mahnung, die noch zu versenden ist', () => {
	it('nennt noch keine Zahlungsfrist, erst die versendete Mahnung nennt sie', () => {
		documents([
			letter({ paymentDeadline: '2025-03-11' }),
			letter({ id: 'd2', status: 'sent', sentAt: '2025-03-01T09:00:00Z', paymentDeadline: '2025-03-11' })
		]);

		const [waiting, sent] = allByTestId('document-row');
		expect(waiting.textContent).not.toContain('Zahlungsfrist');
		expect(sent.textContent).toContain('Zahlungsfrist der Mahnung: 11.03.2025');
	});
});

describe('Dokumente', () => {
	it('nennt Empfänger, Datum, Weg und Versandstatus jedes Briefs', () => {
		documents([letter(), letter({ id: 'd2', status: 'sent', channel: 'email' })]);

		const [toSend, sent] = allByTestId('document-row');
		expect(toSend.textContent).toContain('An Anna Keller');
		expect(toSend.textContent).toContain('01.03.2025');
		expect(toSend.querySelector('[data-testid="document-status"]')!.textContent!.trim()).toBe(
			'Zu versenden'
		);
		expect(toSend.querySelector('[data-testid="document-mark-sent"]')).not.toBeNull();
		expect(sent.querySelector('[data-testid="document-status"]')!.textContent!.trim()).toBe(
			'Versendet'
		);
		expect(sent.querySelector('[data-testid="document-mark-sent"]')).toBeNull();
	});

	// Persona Dr. Weber 534 P-2, P-4: marking a letter sent asks first and says what follows for which letter
	it('fragt vor dem Markieren als versendet nach und nennt die Folge', () => {
		documents([letter()]);
		click('document-mark-sent');
		expect(document.body.textContent!.replace(/\s+/g, ' ')).toContain(
			'Markieren Sie den Brief erst am Tag, an dem Sie ihn zur Post bringen. Eine Mahnung trägt danach das heutige Datum und eine neue Zahlungsfrist; das neue PDF einer Abrechnung behält deren Datum und Zahlungsfrist.'
		);
		expect(byTestId('document-mark-sent-confirm')).not.toBeNull();
	});

	it('nennt das Dokument im PDF-Link', () => {
		documents([letter()]);
		expect(byTestId('document-pdf-link')!.getAttribute('aria-label')).toContain(
			'Zahlungserinnerung · NK-2024-0001'
		);
	});

	it('zeigt, welcher Filter gewählt ist', () => {
		documents([letter()], 'to_send');
		expect(byTestId('documents-filter-to-send')!.getAttribute('aria-current')).toBe('page');
		expect(byTestId('documents-filter-all')!.getAttribute('aria-current')).toBeNull();
	});

	it('meldet, wenn nichts zu versenden ist', () => {
		documents([], 'to_send');
		expect(byTestId('documents-empty')!.textContent).toContain('Keine Briefe zu versenden');
	});

	it('meldet einen Fehler beim Markieren', () => {
		show(DocumentsPage, {
			data: { documents: [letter()], status: null },
			form: { actionError: 'Dokument konnte nicht aktualisiert werden.' }
		} as never);
		// in the open confirmation, the page behind it is inert (Code-Review 534-2 C-15)
		click('document-mark-sent');
		expect(byTestId('form-error')!.textContent).toContain(
			'Dokument konnte nicht aktualisiert werden.'
		);
	});

	it('nennt bei einem hochgeladenen Dokument Mieter und Datum, ohne Versandstatus und ohne Markieren', () => {
		documents([documentList.data[0] as never]);

		const row = byTestId('document-row')!;
		expect(row.textContent).toContain('Zu Marco Bernasconi, hochgeladen am 14.10.2026');
		expect(byTestId('document-status')).toBeNull();
		expect(byTestId('document-mark-sent')).toBeNull();
		expect(byTestId('document-pdf-link')!.textContent).toContain('Datei herunterladen');
		expect(byTestId('document-pdf-link')!.getAttribute('aria-label')).toBe('Datei herunterladen: Ausweiskopie');
		// #1093: the server answers it (a file, or the error page of a refusal), not the app's router; without
		// `download`, which saved the error page as a file too (the backend sends the file as an attachment)
		expect(byTestId('document-pdf-link')!.hasAttribute('data-sveltekit-reload')).toBe(true);
		expect(byTestId('document-pdf-link')!.hasAttribute('download')).toBe(false);
	});

	// #969 (Fachreview 969-1 V-1): ein PDF vor der Änderung ging nicht nachweislich an den Mieter: ohne Weg und Versandstatus
	it('nennt ein PDF vor der Änderung mit Mieter und Erstellungsdatum, ohne Versandstatus und ohne Markieren', () => {
		documents([
			{ ...documentList.data[0], type: 'pdf_before_change', status: null, channel: null, title: 'Nebenkostenabrechnung, PDF vor der Änderung' } as never
		]);

		expect(byTestId('document-row')!.textContent).toContain('Zu Marco Bernasconi, erstellt am 14.10.2026');
		expect(byTestId('document-status')).toBeNull();
		expect(byTestId('document-mark-sent')).toBeNull();
	});

	it('nennt hochgeladene Dokumente, wenn noch keine Dokumente da sind', () => {
		documents([]);
		expect(byTestId('documents-empty')!.textContent).toContain(
			'Mahnungen und Dokumente, die Sie zu einem Mieter hochladen, erscheinen hier.'
		);
	});

	it('verspricht unter «Zu versenden» nur Briefe', () => {
		documents([], 'to_send');
		expect(byTestId('documents-empty')!.textContent).toContain(
			'Briefe, die Sie ausdrucken und per Post schicken müssen, erscheinen hier.'
		);
	});

	// #677 (decision 5; personas Anna A-1, Helga N-6: first, not after the paragraph about posting letters)
	it('sagt zuerst, dass ein Dokument auf der Seite des Mieters hochgeladen wird', () => {
		documents([]);
		expect(byTestId('page-purpose')!.textContent!.trim()).toMatch(
			/^Ein Dokument laden Sie auf der Seite des Mieters unter «Dokument hochladen» hoch\. Mahnungen/
		);
	});

	// #677 (decision 5, persona Anna P-4): the tenant's name in each row leads to the tenant
	it('führt mit dem Namen des Mieters in jeder Zeile zum Mieter', () => {
		documents([letter(), upload({ id: 'd2' })]);
		for (const row of allByTestId('document-row')) {
			const link = row.querySelector<HTMLAnchorElement>('[data-testid="document-tenant-link"]')!;
			expect(link.textContent!.trim()).toBe('Anna Keller');
			expect(link.getAttribute('href')).toBe('/tenants/t1');
		}
		expect(allByTestId('document-row')[1].textContent).toContain('Zu Anna Keller, hochgeladen am');
	});

	// #677 (decision 3, V-3): two uploads of the same file differ in time; the row names the file
	it('nennt bei einem hochgeladenen Dokument Uhrzeit und Datei', () => {
		documents([upload()]);
		expect(byTestId('document-row')!.textContent).toContain(
			'Zu Anna Keller, hochgeladen am 01.03.2025 um 10:05, Datei «ausweis.jpg»'
		);
	});

	// #1181: two uploads of one tenant with the same title differ by a running number in upload order; another
	// tenant's upload of that title keeps its plain title
	it('nummeriert zwei Dokumente eines Mieters mit demselben Titel', () => {
		documents([
			upload({ id: 'u2', createdAt: '2025-03-01T09:05:30Z' }),
			upload({ id: 'u3', tenantId: 't2', tenantName: 'Beat Huber' }),
			upload()
		]);
		expect(allByTestId('document-row').map((row) => row.querySelector('p')!.textContent)).toEqual([
			'Ausweiskopie (2 von 2)',
			'Ausweiskopie',
			'Ausweiskopie (1 von 2)'
		]);
		expect(allByTestId('document-pdf-link')[0].getAttribute('aria-label')).toBe(
			'Datei herunterladen: Ausweiskopie (2 von 2)'
		);
	});

	// #677 (decision 6): a filter «Mieter» with every tenant, the chosen one selected
	it('bietet alle Mieter zum Filtern an und zeigt den gewählten', () => {
		documents([], null, null, 't2');
		const filter = byTestId<HTMLSelectElement>('documents-tenant-filter')!;
		expect([...filter.options].map((option) => option.text)).toEqual([
			'Alle Mieter',
			'Anna Keller',
			'Beat Huber'
		]);
		expect(filter.value).toBe('t2');
	});

	// #677 (Code-Review C-3): two tenants of the same name are told apart by their town, as in the contract wizard
	it('unterscheidet im Filter zwei Mieter mit gleichem Namen am Ort', () => {
		show(DocumentsPage, {
			data: {
				documents: [],
				status: null,
				tenantId: null,
				tenants: [
					{ id: 't1', name: 'Anna Keller', place: 'Zürich' },
					{ id: 't3', name: 'Anna Keller', place: 'Bern' },
					{ id: 't4', name: 'Beat Huber' }
				]
			},
			form: null
		} as never);
		expect(
			[...byTestId<HTMLSelectElement>('documents-tenant-filter')!.options].map((o) => o.text)
		).toEqual(['Alle Mieter', 'Anna Keller, Zürich', 'Anna Keller, Bern', 'Beat Huber']);
	});

	// #677 (decision 6, V-3): «Alle» and «Zu versenden» keep the chosen tenant
	it('behält bei «Alle» und «Zu versenden» den gewählten Mieter', () => {
		documents([], 'to_send', null, 't1');
		expect(byTestId('documents-filter-all')!.getAttribute('href')).toBe('/documents?tenant=t1');
		expect(byTestId('documents-filter-to-send')!.getAttribute('href')).toBe(
			'/documents?status=to_send&tenant=t1'
		);
	});

	// #677 (decision 6, #662): the filter applies on change, keeps «Zu versenden» and the focus on the filter
	it('filtert beim Ändern des Mieters sofort und behält dabei «Zu versenden»', () => {
		documents([], 'to_send');
		fireEvent(byTestId<HTMLSelectElement>('documents-tenant-filter')!, 'change', 't2');
		expect(goto).toHaveBeenCalledWith('/documents?status=to_send&tenant=t2', {
			keepFocus: true,
			noScroll: true
		});
	});

	// #677 (persona Marco 2): whoever asks whether something is to be posted needs no way to the statements
	it('bietet unter «Zu versenden» ohne Briefe keinen Weg zu den Nebenkostenabrechnungen an', () => {
		documents([], 'to_send');
		expect(byTestId('documents-empty')!.textContent).toContain('Keine Briefe zu versenden');
		expect(byTestId('documents-empty')!.querySelector('a[href="/statements"]')).toBeNull();
	});

	// #193: marked as sent, the letter leaves «Zu versenden»; its remade PDF is offered right there
	it('bietet nach dem Markieren das neue PDF zum Ausdrucken an', () => {
		documents([], 'to_send', {
			sent: { id: 'd1', title: 'Zahlungserinnerung', tenantName: 'Anna Keller' }
		});

		const notice = byTestId('document-marked-sent')!;
		expect(notice.textContent).toContain('«Zahlungserinnerung» an Anna Keller ist als versendet markiert.');
		expect(notice.textContent).toContain('Drucken Sie ihn jetzt aus');
		expect(byTestId('document-marked-sent-pdf')!.getAttribute('href')).toBe('/documents/d1/pdf');
	});

	// Fachreview 534-2 V-1: the new PDF of a statement keeps its date and Zahlungsfrist, the notice says so
	it('sagt nach dem Markieren eines neuen PDF, dass Datum und Zahlungsfrist bleiben', () => {
		documents([], 'to_send', { sent: { id: 'd2', title: 'Nebenkostenabrechnung, neues PDF', tenantName: 'Anna Keller', newPdf: true } });
		const notice = byTestId('document-marked-sent')!.textContent!;
		expect(notice).toContain('Das neue PDF bleibt, wie es ist: Dwello ändert kein Datum darin.');
		expect(notice).not.toContain('heutige Datum');
	});

	// Code-Review 534-2 C-15: a refusal stays readable in the open confirmation
	it('nennt eine Ablehnung im Dialog vor dem Markieren', () => {
		documents([letter()], 'to_send', { actionError: 'Die Abrechnung ist bereits bezahlt. Schicken Sie diese Mahnung nicht mehr ab.' });
		click('document-mark-sent');
		expect(document.querySelector('[role="dialog"]')!.textContent).toContain('Die Abrechnung ist bereits bezahlt.');
	});

	// persona Helga: «Keine Briefe zu versenden» beside it reads as if nothing were left to post
	it('meldet neben dem eben markierten Brief nicht, dass nichts zu versenden ist', () => {
		documents([], 'to_send', {
			sent: { id: 'd1', title: 'Zahlungserinnerung', tenantName: 'Anna Keller' }
		});

		expect(byTestId('documents-empty')).toBeNull();
	});
});

// #736: an undelivered e-mail names the address it went to and leads to the tenant; on this page no way to it
describe('E-Mail, die nicht zugestellt wurde', () => {
	const refused = {
		channel: 'email',
		deliveryError: 'MAIL_DELIVERY_FAILED',
		deliveryErrorCode: 'MAIL_DELIVERY_FAILED',
		recipient: 'anna@example.com'
	};

	it('nennt die Adresse und führt zum Mieter, ohne auf «Dokumente» zu verweisen', () => {
		documents([letter(refused)]);

		const row = byTestId('document-row')!;
		expect(row.textContent).toContain('E-Mail an anna@example.com');
		const tenant = byTestId<HTMLAnchorElement>('delivery-tenant-link')!;
		expect(tenant.getAttribute('href')).toBe('/tenants/t1');
		expect(tenant.textContent).toBe('E-Mail-Adresse von Anna Keller prüfen');
		expect(byTestId('delivery-documents-link')).toBeNull();
		expect(row.textContent).not.toContain('Dokumente');
	});

	it('nennt keine Adresse, wenn eine ältere Mahnung keine festhält', () => {
		documents([letter({ ...refused, recipient: null })]);

		expect(byTestId('document-row')!.textContent).not.toContain('E-Mail an');
		expect(byTestId('delivery-tenant-link')).not.toBeNull();
	});
});

// #736 (code review 736-1 C-3): without a mail setup the address is not the tenant's to check
describe('E-Mail ohne eingerichteten Versand', () => {
	it('führt nicht zum Mieter', () => {
		documents([
			letter({
				channel: 'email',
				deliveryError: 'MAIL_NOT_CONFIGURED',
				deliveryErrorCode: 'MAIL_NOT_CONFIGURED'
			})
		]);

		expect(byTestId('document-row')!.textContent).toContain(
			'Der E-Mail-Versand ist nicht eingerichtet.'
		);
		expect(byTestId('delivery-tenant-link')).toBeNull();
	});
});
