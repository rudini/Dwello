import { describe, it, expect, vi } from 'vitest';

// enhance as SvelteKit wires it: the test plays the server's answer to an action of the page
const actions = vi.hoisted(() => new Map<string, (input: { formData: FormData }) => unknown>());
vi.mock('$app/forms', () => ({
	enhance: (form: HTMLFormElement, submit: (input: { formData: FormData }) => unknown) => {
		actions.set(form.getAttribute('action')!, submit);
		return { destroy() {} };
	}
}));
async function redirectAfter(action: string) {
	const after = actions.get(action)!({ formData: new FormData() }) as (
		input: unknown
	) => Promise<void>;
	await after({ update: async () => {}, result: { type: 'redirect' } });
}

import ContractPage from '../routes/contracts/[id]/+page.svelte';
import { get } from 'svelte/store';
import { toasts } from '$lib/stores';
import { byTestId, click, fireEvent, settle, show } from './helpers/dom';
import refused from '../../tests/contracts/contract-end-refused.json';

const contract = (startDate: string, endDate: string | null, terminated = false) => ({
	id: 'c1',
	apartmentId: 'a1',
	tenantId: 't1',
	startDate,
	endDate,
	terminated,
	baseRent: '950.00',
	additionalRent: '50.00',
	monthlyAdvancePayment: '180.00',
	tenant: {
		id: 't1',
		firstName: 'Anna',
		lastName: 'Keller',
		email: null,
		phone: '+41 52 123 45 67',
		language: 'de'
	},
	apartment: { id: 'a1', buildingId: 'b1', number: '2.01', floor: 2, area: '70', rooms: '3.5' },
	building: {
		id: 'b1',
		name: 'Ahornhof',
		address: 'Ahornweg 1',
		postalCode: '8400',
		city: 'Winterthur'
	}
});

function open(
	startDate = '2024-04-01',
	endDate: string | null = null,
	form: unknown = null,
	today = '2026-10-10',
	terminated = false,
	missingStatements: { start: string; end: string; href: string }[] = [],
	billedBy: { id?: string; statementNumber: string; status: string }[] | null = []
) {
	show(ContractPage, {
		data: {
			today,
			missingStatements,
			billedBy,
			nextSteps: terminated ? { successor: false } : null, // the loader decides (review K-1)
			contract: contract(startDate, endDate, terminated),
			rentBreakdown: { baseRent: 950, additionalRent: 50, advancePayment: 180, total: 1180 }
		},
		form
	} as never);
}

const text = (testid: string) => byTestId(testid)!.textContent!.replace(/\s+/g, ' ').trim();
const amountOf = (label: string) =>
	[...document.querySelectorAll('dt')]
		.find((dt) => dt.textContent!.trim() === label)!
		.nextElementSibling!.textContent!.replace(/\s+/g, ' ')
		.trim();

describe('Mietvertragsdetail', () => {
	// #89: whether a Verwaltungspauschale is agreed, and at which rate
	it.each([
		[false, null, 'Nicht vereinbart'],
		[true, null, 'Vereinbart, Satz des Abrechnungslaufs'],
		[true, '4.00', 'Vereinbart, 4 %']
	])('nennt die Verwaltungspauschale des Mietvertrags (%s, %s)', (agreed, percent, shown) => {
		show(ContractPage, {
			data: {
				today: '2026-10-10',
				missingStatements: [],
				billedBy: [],
				nextSteps: null,
				contract: {
					...contract('2024-04-01', null),
					managementFeeAgreed: agreed,
					managementFeePercent: percent
				},
				rentBreakdown: { baseRent: 950, additionalRent: 50, advancePayment: 180, total: 1180 }
			},
			form: null
		} as never);
		expect(text('contract-management-fee')).toBe(shown);
	});

	// #133: nur wenn eingetragen
	it.each([
		['2024-12-31', '31.12.2024'],
		[null, undefined]
	])('nennt «Abgerechnet bis», wenn es eingetragen ist (%s)', (billedUntil, shown) => {
		show(ContractPage, {
			data: {
				today: '2026-10-10',
				missingStatements: [],
				billedBy: [],
				nextSteps: null,
				contract: { ...contract('2024-04-01', null), billedUntil },
				rentBreakdown: { baseRent: 950, additionalRent: 50, advancePayment: 180, total: 1180 }
			},
			form: null
		} as never);
		expect(byTestId('contract-billed-until')?.textContent?.trim()).toBe(shown);
	});

	// A-4: nach der Kündigung den Nachmieter erfassen und die neue Adresse eintragen
	it('nennt nach einer Kündigung die nächsten Schritte', () => {
		open('2024-04-01', '2099-03-31', null, '2026-10-10', true);
		const steps = byTestId('contract-next-steps')!;
		const links = [...steps.querySelectorAll('a')].map((a) => [
			a.textContent!.trim(),
			a.getAttribute('href')
		]);
		expect(links).toEqual([
			['Nachmieter erfassen', '/contracts/new?apartment=a1'],
			// B-16 (#156): wer innerhalb des Hauses umzieht, braucht einen neuen Mietvertrag
			['Neuen Mietvertrag für Anna Keller erfassen', '/contracts/new?tenant=t1'],
			['Neue Adresse eintragen', '/tenants/t1/edit']
		]);
	});

	// A-10: die Ablehnung führt zur Abrechnung; der einzige Entwurf lässt sich löschen, mit seiner Folge
	it('verlinkt die abgelehnte Abrechnung und bietet an, den Entwurf zu löschen', async () => {
		open('2024-04-01', null, {
			endError: 'abgelehnt',
			refused: refused.statements,
			refusedDay: '2025-03-31'
		});
		click('contract-end-button');
		fireEvent(byTestId<HTMLInputElement>('contract-end-date-input')!, 'input', '31.03.2025');
		await settle();
		const link = byTestId('refused-statement-link')!;
		expect(link.getAttribute('href')).toBe('/statements/s1');
		expect(link.textContent).toContain('NK-2025-0003');
		expect(text('refused-statements')).toContain(
			'Der Entwurf NK-2025-0003 wird gelöscht. Erstellen Sie die Nebenkostenabrechnung danach neu.'
		);
		const form = document.querySelector<HTMLFormElement>('form[action="?/endDeletingDraft"]')!;
		const value = (name: string) => form.querySelector<HTMLInputElement>(`[name="${name}"]`)!.value;
		expect([value('statementId'), value('endDate')]).toEqual(['s1', '2025-03-31']);
		expect(form.contains(byTestId('delete-draft-and-end'))).toBe(true);
		// Review K-3: erst die Meldung, dann der Ausweg; der Knopf nennt seine Folge
		const order = byTestId('form-error')!.compareDocumentPosition(byTestId('refused-statements')!);
		expect(order & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
		const described = byTestId('delete-draft-and-end')!.getAttribute('aria-describedby')!;
		expect(document.getElementById(described)!.textContent).toContain('wird gelöscht');
	});

	// Personas K1: der Assistent öffnet danach; die Meldung sagt, was vorher geschah
	it('bestätigt das Löschen und das Vertragsende vor dem Assistenten', async () => {
		open('2024-04-01', null, {
			endError: 'abgelehnt',
			refused: refused.statements,
			refusedDay: '2025-03-31'
		});
		click('contract-end-button');
		fireEvent(byTestId<HTMLInputElement>('contract-end-date-input')!, 'input', '31.03.2025');
		await settle();
		await redirectAfter('?/endDeletingDraft');
		expect(get(toasts).map((t) => t.message)).toContain(
			'Entwurf NK-2025-0003 gelöscht. Der Mietvertrag von Anna Keller endet am 31.03.2025. Erstellen Sie jetzt die Nebenkostenabrechnung neu.'
		);
	});

	// Haiku-Review R4: lehnt die Aktion ab, nimmt die Meldung den Fokus
	it('setzt den Fokus auf die Meldung, wenn das Löschen abgelehnt wird', async () => {
		open('2024-04-01', null, {
			endError: 'abgelehnt',
			refused: refused.statements,
			refusedDay: '2025-03-31'
		});
		click('contract-end-button');
		fireEvent(byTestId<HTMLInputElement>('contract-end-date-input')!, 'input', '31.03.2025');
		await settle();
		const after = actions.get('?/endDeletingDraft')!({ formData: new FormData() }) as (
			input: unknown
		) => Promise<void>;
		await after({ update: async () => {}, result: { type: 'failure', status: 409, data: {} } });
		await settle();
		expect(document.activeElement).toBe(byTestId('form-error'));
	});

	// Review K-2: ein anderer Tag ist nicht abgelehnt; das Angebot gehört zum abgelehnten Tag
	it('nimmt das Angebot zurück, sobald ein anderer Tag eingegeben ist', async () => {
		open('2024-04-01', null, {
			endError: 'abgelehnt',
			refused: refused.statements,
			refusedDay: '2025-03-31'
		});
		click('contract-end-button');
		fireEvent(byTestId<HTMLInputElement>('contract-end-date-input')!, 'input', '31.03.2099');
		await settle();
		expect(byTestId('delete-draft-and-end')).toBeNull();
		// Haiku-Review P2: die Meldung verweist auf den Knopf unten, sie geht mit ihm
		expect(byTestId('form-error')).toBeNull();
	});

	// F-23 (#155), Fachreview W10 M-1: beim Tod des Mieters endet der Mietvertrag nicht
	it('sagt im Dialog «Beenden», dass der Mietvertrag beim Tod des Mieters auf die Erben übergeht', () => {
		open();
		click('contract-end-button');
		// Fachreview W10-2 M-1: die Kündigung der Erben wird hier erfasst (Art. 266i OR)
		expect(text('contract-end-death')).toContain(
			'Ist der Mieter gestorben, endet der Mietvertrag nicht von selbst: Er geht auf die Erben über. Erfassen Sie das Vertragsende erst, wenn die Erben oder Sie gekündigt haben.'
		);
		expect(text('contract-end-death')).toContain('unter «Adresse»'); // Persona Weber P-1
	});

	it('bietet bei einer versendeten Abrechnung kein Löschen an', async () => {
		const sent = refused.statements.map((s) => ({ ...s, status: 'sent' }));
		open('2024-04-01', null, { endError: 'abgelehnt', refused: sent, refusedDay: '2025-03-31' });
		click('contract-end-button');
		fireEvent(byTestId<HTMLInputElement>('contract-end-date-input')!, 'input', '31.03.2025');
		await settle();
		expect(byTestId('refused-statement-link')).not.toBeNull();
		expect(byTestId('delete-draft-and-end')).toBeNull();
	});

	// A-10: Mietstage in der letzten Abrechnungsperiode ohne Abrechnung
	it('meldet die fehlende Abrechnung und führt zum Assistenten', () => {
		const href = '/statements/generate?building=b1&start=2025-01-01&end=2025-12-31';
		open('2024-04-01', null, null, '2026-10-10', false, [
			{ start: '2025-01-01', end: '2025-12-31', href }
		]);
		expect(text('contract-missing-statement')).toContain('Abrechnung 2025 fehlt');
		// the wizard bills the whole building, the invoices come first (code review C-10)
		expect(text('contract-missing-statement')).toContain(
			'Der Assistent erstellt die Abrechnungen für alle Mietverträge des Gebäudes. Erfassen Sie zuerst die Rechnungen der Periode.'
		);
		expect(byTestId('contract-missing-statement-link-2025-01-01')!.getAttribute('href')).toBe(href);
		// #133: the way to «Abgerechnet bis» (fach review V-7)
		expect(text('contract-missing-statement')).toContain(
			'Haben Sie diese Periode ausserhalb von Dwello abgerechnet? Tragen Sie beim Bearbeiten des Mietvertrags «Abgerechnet bis» ein.'
		);
	});

	// #142: every ended period without a statement, the newest first, each with its own way to the wizard
	it('nennt mehrere fehlende Abrechnungen, die neueste zuerst, je mit ihrem Weg zum Assistenten', () => {
		const missing = [2025, 2023].map((y) => ({
			start: `${y}-01-01`,
			end: `${y}-12-31`,
			href: `/statements/generate?building=b1&start=${y}-01-01&end=${y}-12-31`
		}));
		open('2022-04-01', null, null, '2026-10-10', false, missing);
		expect(text('contract-missing-statement')).toContain('2 Abrechnungen fehlen');
		// the wizard bills the whole building, the invoices come first, any order (personas Helga, Anna, Marco #142)
		expect(text('contract-missing-statement')).toContain(
			'Jede Schaltfläche öffnet den Assistenten für alle Mietverträge des Gebäudes in dieser Periode. Erfassen Sie zuerst die Rechnungen der Periode; mit welcher Periode Sie beginnen, spielt keine Rolle.'
		);
		// short labels side by side, each with its verb (personas Marco P-4, Helga P-6, code review C-8)
		const links = [...byTestId('contract-missing-statement')!.querySelectorAll('a')];
		expect(links.map((a) => a.textContent!.trim())).toEqual(['2025 abrechnen', '2023 abrechnen']);
		expect(links.map((a) => a.getAttribute('href'))).toEqual(missing.map((m) => m.href));
		expect(text('contract-missing-statement')).toContain(
			'Haben Sie eine dieser Perioden ausserhalb von Dwello abgerechnet? Tragen Sie beim Bearbeiten des Mietvertrags «Abgerechnet bis» ein.'
		);
	});

	it('nennt eine Periode über den Jahreswechsel mit beiden Tagen', () => {
		const missing = [{ start: '2024-07-01', end: '2025-06-30', href: '/statements/generate' }];
		open('2024-04-01', null, null, '2026-10-10', false, missing);
		expect(text('contract-missing-statement')).toContain(
			'Abrechnung 01.07.2024 – 30.06.2025 fehlt'
		);
	});

	it('bietet mit erfasstem Nachmieter keinen Nachmieter mehr an', () => {
		show(ContractPage, {
			data: {
				today: '2026-10-10',
				missingStatements: [],
				billedBy: [],
				nextSteps: { successor: true },
				contract: contract('2024-04-01', '2099-03-31', true),
				rentBreakdown: { baseRent: 950, additionalRent: 50, advancePayment: 180, total: 1180 }
			},
			form: null
		} as never);
		const links = [...byTestId('contract-next-steps')!.querySelectorAll('a')].map((a) =>
			a.textContent!.trim()
		);
		expect(links).toEqual(['Neuen Mietvertrag für Anna Keller erfassen', 'Neue Adresse eintragen']);
	});

	it('nennt ohne Kündigung keine nächsten Schritte', () => {
		open('2024-04-01', '2099-03-31');
		expect(byTestId('contract-next-steps')).toBeNull();
	});

	it('zeigt einen künftigen Mietvertrag als künftig, mit seinem Vertragsbeginn', () => {
		open('2099-11-01');
		expect(text('contract-status')).toBe('Künftig');
		expect(document.body.textContent).toContain('1.11.2099');
		expect(document.body.textContent).not.toMatch(/AKTIV|heute/);
	});

	it('bestimmt den Vertragsstatus mit dem Tag des Servers', () => {
		open('2099-11-01', null, null, '2099-11-01');
		expect(text('contract-status')).toBe('Laufend');
	});

	it('zeigt einen laufenden Mietvertrag ohne Ende als laufend und unbefristet', () => {
		open();
		expect(text('contract-status')).toBe('Laufend');
		expect(text('contract-end-date')).toBe('Unbefristet');
	});

	it('nennt Nettomiete, Akonto, Zusatzmiete und das monatliche Total', () => {
		open();
		expect(amountOf('Nettomiete')).toBe('CHF 950.00');
		expect(amountOf('Akonto')).toBe('CHF 180.00');
		expect(amountOf('Zusatzmiete')).toBe('CHF 50.00');
		expect(amountOf('Monatlich total')).toBe('CHF 1’180.00');
		expect(text('contract-total-rent')).toBe('CHF 1’180.00');
	});

	it('führt über die Namen zum Mieter und zur Wohnung', () => {
		open();
		expect(byTestId('contract-tenant-link')!.getAttribute('href')).toBe('/tenants/t1');
		expect(text('contract-tenant-link')).toBe('Anna Keller');
		expect(byTestId('contract-apartment-link')!.getAttribute('href')).toBe('/apartments/a1');
		expect(text('contract-apartment-link')).toBe('Wohnung 2.01');
		expect(byTestId('tenant-phone-link')!.getAttribute('href')).toBe('tel:+41 52 123 45 67');
	});

	// kein Vorschlag: ein schnelles Bestätigen soll den Mietvertrag nicht aus Versehen heute beenden
	it('fragt beim Beenden nach dem Vertragsende, ohne einen Tag vorzuschlagen', async () => {
		open();
		click('contract-end-button');
		const dialog = document.querySelector('[role=dialog]')!;
		// Persona Sven J1: der Titel nennt, welchen Mietvertrag er beendet
		expect(
			dialog.getAttribute('aria-labelledby') &&
				document.getElementById(dialog.getAttribute('aria-labelledby')!)!.textContent
		).toBe('Mietvertrag von Anna Keller, Wohnung 2.01, beenden?');
		expect(byTestId<HTMLInputElement>('contract-end-date-input')!.value).toBe('');
		const submitted = vi.fn();
		document.querySelector('form[action="?/end"]')!.addEventListener('submit', submitted);
		click('contract-end-confirm');
		await settle();
		expect(submitted).not.toHaveBeenCalled();
		expect(dialog.textContent).toContain(
			'Bitte geben Sie das Vertragsende ein, zum Beispiel 31.12.2026.'
		);
		const words = dialog.textContent!.replace(/\s+/g, ' ');
		expect(words).toContain('Der letzte Tag des Mietverhältnisses, also der Kündigungstermin.');
		expect(words).toContain('auch wenn der Mieter früher auszieht.');
		expect(words).toContain(
			'Ist die Kündigung zu spät, gilt sie erst auf den nächsten Kündigungstermin.'
		);
		expect(words).toContain('Ein neuer Mietvertrag kann am Tag danach beginnen.');
		expect(byTestId('contract-end-confirm')!.textContent).toContain('Mietvertrag beenden');
	});

	// ein nachträglich erfasster Kündigungstermin: die Folge wird bestätigt, sonst geht nichts weg
	it('verlangt bei einem Vertragsende vor heute die Bestätigung der Folge und sendet ohne sie nichts', async () => {
		open();
		click('contract-end-button');
		const submitted = vi.fn();
		document.querySelector('form[action="?/end"]')!.addEventListener('submit', submitted);
		fireEvent(byTestId<HTMLInputElement>('contract-end-date-input')!, 'input', '31.03.2025');
		await settle();
		const dialog = document.querySelector('[role=dialog]')!;
		expect(dialog.textContent).toContain('Der Mietvertrag endete am 31.03.2025.');
		click('contract-end-confirm');
		await settle();
		expect(dialog.textContent).toContain(
			'Bitte bestätigen Sie, dass der Mietvertrag am 31.03.2025 endete, oder korrigieren Sie das Vertragsende.'
		);
		expect(submitted).not.toHaveBeenCalled();
	});

	// die Folge für den Vermieter steht am Kästchen; ein Tag über ein Jahr zurück ist oft ein Tippfehler im Jahr
	it('nennt am Kästchen die Folge und warnt bei einem Tag über ein Jahr zurück', async () => {
		open();
		click('contract-end-button');
		fireEvent(byTestId<HTMLInputElement>('contract-end-date-input')!, 'input', '30.09.2026');
		await settle();
		const dialog = () => document.querySelector('[role=dialog]')!.textContent!.replace(/\s+/g, ' ');
		expect(dialog()).toContain(
			'Seit dem 01.10.2026 gilt die Wohnung als nicht vermietet, wenn kein neuer Mietvertrag begonnen hat. Die Nebenkosten dieser Zeit trägt der Vermieter, das Akonto des Mieters zählt nur bis zum Vertragsende.'
		);
		expect(dialog()).not.toContain('Prüfen Sie das Jahr.');
		fireEvent(byTestId<HTMLInputElement>('contract-end-date-input')!, 'input', '30.09.2025');
		await settle();
		expect(text('contract-end-past-notice')).toBe(
			'Das Vertragsende liegt in der Vergangenheit, über ein Jahr zurück. Prüfen Sie das Jahr. Bestätigen Sie das Vertragsende mit dem Kästchen.'
		);
	});

	// ein Screenreader hört einen kurzen Satz mit Aufforderung, den Fehler am Kästchen nur einmal
	it('sagt mit einem kurzen Satz an, dass eine Bestätigung nötig ist', async () => {
		open();
		click('contract-end-button');
		const notice = byTestId('contract-end-past-notice')!;
		expect(notice.getAttribute('aria-live')).toBe('polite');
		expect(notice.textContent!.trim()).toBe('');
		// empty it takes no space in the form, but stays for screen readers
		expect(notice.classList.contains('sr-only')).toBe(true);
		fireEvent(byTestId<HTMLInputElement>('contract-end-date-input')!, 'input', '30.09.2026');
		await settle();
		expect(text('contract-end-past-notice')).toBe(
			'Das Vertragsende liegt in der Vergangenheit. Bestätigen Sie das Vertragsende mit dem Kästchen.'
		);
		expect(notice.contains(byTestId('contract-end-past-confirm'))).toBe(false);
		expect(notice.classList.contains('sr-only')).toBe(false);
	});

	// wird ein angekreuztes Kästchen durch ein neues Datum zurückgesetzt, hört ein Screenreader das
	it('sagt an, dass ein neues Datum erneut bestätigt werden muss', async () => {
		open();
		click('contract-end-button');
		const input = byTestId<HTMLInputElement>('contract-end-date-input')!;
		fireEvent(input, 'input', '31.08.2026');
		await settle();
		click('contract-end-past-confirm');
		await settle();
		fireEvent(input, 'input', '30.08.2026');
		await settle();
		expect(text('contract-end-past-notice')).toBe(
			'Das Vertragsende hat sich geändert. Bestätigen Sie es erneut mit dem Kästchen.'
		);
	});

	// ein behobener Fehler am Feld bleibt nicht in der Ansage stehen
	it('nimmt den Fehler am Feld zurück, wenn das Datum ändert', async () => {
		open();
		click('contract-end-button');
		const input = byTestId<HTMLInputElement>('contract-end-date-input')!;
		fireEvent(input, 'input', '31.03.2024');
		await settle();
		click('contract-end-confirm');
		await settle();
		expect(document.querySelector('[role=dialog]')!.textContent).toContain(
			'vor dem Vertragsbeginn'
		);
		fireEvent(input, 'input', '31.08.2026');
		await settle();
		expect(document.querySelector('[role=dialog]')!.textContent).not.toContain(
			'vor dem Vertragsbeginn'
		);
	});

	// ein Tag vor dem Vertragsbeginn ist ein Fehler am Feld, keine Bestätigung
	it('fragt bei einem Tag vor dem Vertragsbeginn nicht nach einer Bestätigung', async () => {
		open();
		click('contract-end-button');
		fireEvent(byTestId<HTMLInputElement>('contract-end-date-input')!, 'input', '31.03.2024');
		await settle();
		expect(document.querySelector('[role=dialog]')!.textContent).toContain(
			'Sonntag, 31. März 2024'
		);
		expect(byTestId('contract-end-past-confirm')).toBeNull();
	});

	// nach der Korrektur des Datums nennt keine Meldung mehr den alten Tag
	it('nimmt die Meldung am Kästchen zurück, wenn das Datum ändert', async () => {
		open();
		click('contract-end-button');
		const input = byTestId<HTMLInputElement>('contract-end-date-input')!;
		fireEvent(input, 'input', '30.09.2025');
		await settle();
		click('contract-end-confirm');
		await settle();
		expect(document.querySelector('[role=dialog]')!.textContent).toContain('am 30.09.2025 endete');
		fireEvent(input, 'input', '30.09.2026');
		await settle();
		expect(document.querySelector('[role=dialog]')!.textContent).not.toContain(
			'Bitte bestätigen Sie'
		);
	});

	// die Bestätigung gilt nur für den Tag, der dabei angezeigt war
	it('nimmt die Bestätigung zurück, wenn das Vertragsende danach ändert', async () => {
		open();
		click('contract-end-button');
		const input = byTestId<HTMLInputElement>('contract-end-date-input')!;
		fireEvent(input, 'input', '31.03.2025');
		await settle();
		click('contract-end-past-confirm');
		await settle();
		fireEvent(input, 'input', '30.04.2025');
		await settle();
		expect(byTestId<HTMLInputElement>('contract-end-past-confirm')!.checked).toBe(false);
	});

	// angekreuzt ist der Fehler behoben: er verschwindet am Kästchen
	it('nimmt den Fehler am Kästchen zurück, sobald es angekreuzt ist', async () => {
		open();
		click('contract-end-button');
		fireEvent(byTestId<HTMLInputElement>('contract-end-date-input')!, 'input', '31.03.2025');
		await settle();
		click('contract-end-confirm');
		await settle();
		click('contract-end-past-confirm');
		await settle();
		expect(byTestId('contract-end-past-confirm')!.getAttribute('aria-invalid')).toBeNull();
		expect(document.querySelector('[role=dialog]')!.textContent).not.toContain(
			'Bitte bestätigen Sie'
		);
	});

	it('fragt bei heute und späteren Tagen nicht nach einer Bestätigung', async () => {
		open();
		click('contract-end-button');
		fireEvent(byTestId<HTMLInputElement>('contract-end-date-input')!, 'input', '31.03.2027');
		await settle();
		expect(document.querySelector('[role=dialog]')!.textContent).toContain(
			'Mittwoch, 31. März 2027'
		);
		expect(byTestId('contract-end-past-confirm')).toBeNull();
	});

	it('sendet die Bestätigung mit und meldet, wann der Mietvertrag endete', async () => {
		toasts.set([]);
		open();
		click('contract-end-button');
		fireEvent(byTestId<HTMLInputElement>('contract-end-date-input')!, 'input', '31.03.2025');
		await settle();
		click('contract-end-past-confirm');
		await settle();
		const formData = new FormData();
		const after = actions.get('?/end')!({ formData }) as (input: unknown) => Promise<void>;
		expect(formData.get('endDate')).toBe('2025-03-31');
		expect(formData.get('pastConfirmed')).toBe('on');
		await after({ update: async () => {}, result: { type: 'success' } });
		expect(get(toasts).map((toast) => toast.message)).toEqual([
			'Der Mietvertrag von Anna Keller endete am 31.03.2025'
		]);
	});

	// der Tag geht mit dem Formular an die Aktion; die Meldung nennt ihn
	it('sendet das Vertragsende und meldet den Tag, an dem der Mietvertrag endet', async () => {
		toasts.set([]);
		// after the end the page reloads with the next steps: the message points to them
		open('2024-04-01', null, null, '2026-10-10', true);
		click('contract-end-button');
		fireEvent(byTestId<HTMLInputElement>('contract-end-date-input')!, 'input', '31.03.2027');
		await settle();
		const formData = new FormData();
		const after = actions.get('?/end')!({ formData }) as (input: unknown) => Promise<void>;
		expect(formData.get('endDate')).toBe('2027-03-31');
		await after({ update: async () => {}, result: { type: 'success' } });
		// Haiku-Review R7 (Helga K1 M2): die Meldung sagt, wo es weitergeht
		expect(get(toasts).map((toast) => toast.message)).toEqual([
			'Der Mietvertrag von Anna Keller endet am 31.03.2027. Die nächsten Schritte sehen Sie oben auf der Seite.'
		]);
	});

	// Haiku-Review N1: ohne Abschnitt «Nächste Schritte» verweist die Meldung nicht darauf
	it('verweist nicht auf nächste Schritte, die die Seite nicht zeigt', async () => {
		toasts.set([]);
		open(); // nextSteps: null
		click('contract-end-button');
		fireEvent(byTestId<HTMLInputElement>('contract-end-date-input')!, 'input', '31.03.2027');
		await settle();
		const after = actions.get('?/end')!({ formData: new FormData() }) as (
			input: unknown
		) => Promise<void>;
		await after({ update: async () => {}, result: { type: 'success' } });
		expect(get(toasts).map((toast) => toast.message)).toEqual([
			'Der Mietvertrag von Anna Keller endet am 31.03.2027'
		]);
	});

	// ein getippter Tag bleibt nicht stehen, wenn der Dialog abgebrochen und neu geöffnet wird
	it('beginnt beim erneuten Öffnen mit einem leeren Vertragsende', async () => {
		open();
		click('contract-end-button');
		fireEvent(byTestId<HTMLInputElement>('contract-end-date-input')!, 'input', '31.03.2027');
		await settle();
		click('contract-end-button');
		await settle();
		expect(byTestId<HTMLInputElement>('contract-end-date-input')!.value).toBe('');
	});

	// noch nicht begonnen, z.B. irrtümlich erfasst: er hat keine Mietstage
	it('lässt einen künftigen Mietvertrag löschen', () => {
		open('2099-11-01');
		click('contract-delete-button');
		expect(byTestId<HTMLButtonElement>('contract-delete-confirm')!.disabled).toBe(false);
		expect(document.querySelector('[role=dialog]')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Der Mietvertrag von Anna Keller hat noch nicht begonnen und wird endgültig gelöscht.'
		);
	});

	// laufend oder beendet: nur als Irrtum bestätigt (A-7, #116)
	it.each([null, '2027-03-31', '2024-12-31'])(
		'löscht einen Mietvertrag, der begonnen hat, nicht ohne Bestätigung des Irrtums (Ende %s)',
		async (end) => {
			open('2024-01-01', end);
			click('contract-delete-button');
			click('contract-delete-confirm');
			await settle();
			expect(text('form-error')).toBe(
				'Bitte bestätigen Sie, dass dieser Mietvertrag irrtümlich erfasst wurde, oder brechen Sie ab.'
			);
			expect(document.activeElement).toBe(byTestId('contract-delete-mistake-confirm'));
		}
	);

	it('bestätigt das Löschen mit dem Namen des Mieters', async () => {
		toasts.set([]);
		open('2099-11-01');
		click('contract-delete-button');
		await redirectAfter('?/delete');
		expect(get(toasts).map((toast) => toast.message)).toEqual([
			'Mietvertrag von Anna Keller gelöscht'
		]);
	});

	it('zeigt im Löschdialog, warum das Backend das Löschen ablehnt', () => {
		open('2099-11-01', null, {
			deleteError: 'Mietvertrag konnte nicht gelöscht werden.'
		});
		expect(document.querySelector('[role=dialog]')!.textContent).toContain(
			'Mietvertrag konnte nicht gelöscht werden.'
		);
		expect(byTestId<HTMLButtonElement>('contract-delete-confirm')!.disabled).toBe(false);
	});
});

// A-7 (#116): ein begonnener Mietvertrag nur als Irrtum, einer mit Abrechnung gar nicht
describe('Mietvertrag löschen', () => {
	const missing = [{ start: '2025-01-01', end: '2025-12-31', href: '/statements/generate' }];

	it('nennt bei einem begonnenen Mietvertrag den Weg für eine echte Miete und die fehlende Abrechnung', () => {
		open('2024-04-01', null, null, '2026-10-10', false, missing);
		click('contract-delete-button');

		const dialog = document.querySelector('[role="dialog"]')!.textContent!;
		expect(dialog).toContain('Der Mietvertrag von Anna Keller hat am 01.04.2024 begonnen.');
		expect(dialog).toContain(
			'Hat Anna Keller die Wohnung wirklich gemietet, löschen Sie den Mietvertrag nicht: Zieht der Mieter aus, wählen Sie «Beenden».'
		);
		expect(dialog).toContain('Nach dem Löschen erinnert Dwello nicht mehr daran.');
		expect(byTestId('contract-delete-mistake-confirm-help')!.textContent).toContain('Leerstand');
	});

	// Fachreview V-3: der Status sagt, welche sich löschen lässt
	it('nennt die Abrechnungen mit Status, die das Löschen sperren, und lässt es nicht bestätigen', () => {
		const billed = [
			{ id: 's1', statementNumber: 'NK-2024-0001', status: 'paid' },
			{ id: 's2', statementNumber: 'NK-2025-0002', status: 'draft' }
		];
		open('2024-04-01', null, null, '2026-10-10', false, [], billed);
		click('contract-delete-button');

		const dialog = document.querySelector('[role="dialog"]')!.textContent!;
		expect(dialog).toContain('Seine Mietstage sind abgerechnet in:');
		// A-8 (#117): jede Abrechnung als Link, mit ihrem Status
		expect(text('contract-delete-statement-s1')).toBe('NK-2024-0001 (bezahlt)');
		expect(byTestId('contract-delete-statement-s2')!.getAttribute('href')).toBe('/statements/s2');
		expect(dialog).toContain('Klären Sie eine Korrektur direkt mit dem Mieter.');
		expect(byTestId('contract-delete-mistake-confirm')).toBeNull();
		expect((byTestId('contract-delete-confirm') as HTMLButtonElement).disabled).toBe(true);
	});

	it('führt bei Entwürfen allein zum Löschen der Entwürfe', () => {
		open(
			'2024-04-01',
			null,
			null,
			'2026-10-10',
			false,
			[],
			[{ statementNumber: 'NK-2025-0002', status: 'draft' }]
		);
		click('contract-delete-button');

		expect(document.querySelector('[role="dialog"]')!.textContent).toContain(
			'Löschen Sie zuerst die Entwürfe, danach lässt sich der Mietvertrag löschen.'
		);
	});

	// Fachreview V-11: mit Vertragsende gibt es kein «Beenden»
	it('nennt bei einem Mietvertrag mit Vertragsende das Ende statt «Beenden»', () => {
		open('2018-01-01', '2021-12-31');
		click('contract-delete-button');

		const dialog = document.querySelector('[role="dialog"]')!.textContent!;
		expect(dialog).toContain(
			'Hat Anna Keller die Wohnung wirklich gemietet, löschen Sie den Mietvertrag nicht: Sein Vertragsende ist der 31.12.2021, danach bleibt er als Historie der Wohnung erhalten.'
		);
		expect(dialog).not.toContain('«Beenden»');
	});

	// Review C-1: konnten die Abrechnungen nicht geladen werden, behauptet der Dialog keine
	it('sagt nicht, es gebe keine Abrechnung, wenn sie nicht geladen werden konnten', () => {
		open('2018-01-01', '2021-12-31', null, '2026-10-10', false, [], null);
		click('contract-delete-button');

		expect(document.querySelector('[role="dialog"]')!.textContent).not.toContain(
			'keine Nebenkostenabrechnung'
		);
	});

	// A-8 (#117): der Dialog sagt, ob es Abrechnungen gibt
	it('sagt bei einem beendeten Mietvertrag ohne Abrechnung, dass es keine gibt', () => {
		open('2018-01-01', '2021-12-31');
		click('contract-delete-button');

		expect(document.querySelector('[role="dialog"]')!.textContent).toContain(
			'Zu diesem Mietvertrag gibt es in Dwello keine Nebenkostenabrechnung.'
		);
	});
});

// A-6 (#115): nach einem abgelaufenen befristeten Mietvertrag fragt die Seite, ob der Mieter noch in der Wohnung wohnt
describe('Abgelaufener befristeter Mietvertrag', () => {
	function expired(form: unknown = null, fixedTermCheck = true) {
		show(ContractPage, {
			data: {
				today: '2026-10-10',
				missingStatements: [],
				billedBy: [],
				nextSteps: null,
				fixedTermCheck, // the loader decides
				contract: contract('2024-01-01', '2025-12-31'),
				rentBreakdown: { baseRent: 950, additionalRent: 50, advancePayment: 180, total: 1180 }
			},
			form
		} as never);
	}
	async function answer(action: string, type: string) {
		const after = actions.get(action)!({ formData: new FormData() }) as (
			input: unknown
		) => Promise<void>;
		await after({ update: async () => {}, result: { type } });
	}

	it('fragt, ob der Mieter noch in der Wohnung wohnt, mit beiden Antworten', () => {
		expired();
		const check = byTestId('contract-fixed-term-check')!;
		expect(text('contract-fixed-term-check')).toContain(
			'Der befristete Mietvertrag von Anna Keller ist am 31.12.2025 abgelaufen. Wohnt Anna Keller noch in der Wohnung und sind Sie damit einverstanden, zum Beispiel weil Sie den Mietzins weiter annehmen? Dann läuft der Mietvertrag unbefristet weiter.'
		);
		// Fachreview A-6 M-1: beide Parteien setzen den Mietvertrag fort; wer nicht einverstanden ist, widerspricht sofort
		expect(text('contract-fixed-term-check')).toContain(
			'Sind Sie nicht einverstanden, verlangen Sie die Rückgabe der Wohnung sofort schriftlich und lassen Sie sich beraten.'
		);
		const button = (testid: string) => [
			byTestId(testid)!.textContent!.trim(),
			byTestId(testid)!.closest('form')!.getAttribute('action')
		];
		expect(button('contract-continue-open-ended')).toEqual([
			'Unbefristet weiterführen',
			'?/continueOpenEnded'
		]);
		expect(byTestId('contract-moved-out')!.textContent!.trim()).toBe('Mieter ist ausgezogen');
		expect(check.contains(byTestId('contract-moved-out'))).toBe(true);
		// Personas a6 P-2: was jede Antwort für die Nebenkosten heisst
		expect(text('contract-fixed-term-check')).toContain(
			'Läuft der Mietvertrag weiter, rechnet Dwello die Nebenkosten nach dem 31.12.2025 mit Anna Keller ab. Ist Anna Keller ausgezogen, gilt die Wohnung seither als leer, und die Nebenkosten dieser Zeit tragen Sie.'
		);
	});

	// Personas a6 P-1: der Auszug wird erst mit seiner Folge bestätigt, nicht mit einem Klick gespeichert
	it('bestätigt den Auszug in einem Dialog mit seiner Folge', async () => {
		expired();
		click('contract-moved-out');
		await settle();
		const dialog = document.querySelector('[role="dialog"]')!;
		expect(dialog.textContent).toContain('Auszug von Anna Keller bestätigen');
		expect(dialog.textContent!.replace(/\s+/g, ' ')).toContain(
			'Der Mietvertrag endete am 31.12.2025. Seither gilt die Wohnung als leer, und die Nebenkosten dieser Zeit tragen Sie. Dwello fragt danach nicht mehr, ob der Mietvertrag weiterläuft.'
		);
		const confirm = byTestId('contract-moved-out-confirm')!;
		expect(confirm.textContent!.trim()).toBe('Auszug bestätigen');
		expect(document.querySelector('form[action="?/movedOut"]')).not.toBeNull(); // the dialog's confirm submits it
	});

	it('zeigt eine Ablehnung des Auszugs im Dialog, nicht im Kasten', async () => {
		expired({ movedOutError: 'nicht gespeichert' });
		expect(byTestId('contract-fixed-term-check')!.textContent).not.toContain('nicht gespeichert');
		click('contract-moved-out');
		await settle();
		expect(document.querySelector('[role="dialog"]')!.textContent).toContain('nicht gespeichert');
	});

	it('fragt nicht, wenn der Loader es nicht verlangt', () => {
		expired(null, false);
		expect(byTestId('contract-fixed-term-check')).toBeNull();
	});

	it('meldet, was gespeichert ist', async () => {
		expired();
		await answer('?/continueOpenEnded', 'success');
		await answer('?/movedOut', 'success');
		expect(get(toasts).map((t) => t.message)).toEqual(
			expect.arrayContaining([
				// Fachreview A-6 V-15: die Folge des Weiterführens
				'Der Mietvertrag von Anna Keller läuft unbefristet weiter. Er endet erst mit einer Kündigung.',
				'Gespeichert: Anna Keller ist ausgezogen'
			])
		);
	});

	// A-10: die Abrechnung rechnet die Zeit nach dem Vertragsende als Leerstand ab; der Entwurf lässt sich löschen
	it('nennt die sperrende Abrechnung und bietet an, den Entwurf zu löschen', async () => {
		expired({ fixedTermError: 'gesperrt', fixedTermRefused: refused.statements });
		const check = byTestId('contract-fixed-term-check')!;
		expect(check.querySelector('[data-testid="form-error"]')!.textContent).toContain('gesperrt');
		expect(byTestId('refused-statement-link')!.getAttribute('href')).toBe('/statements/s1');
		const form = document.querySelector<HTMLFormElement>('form[action="?/continueDeletingDraft"]')!;
		expect(form.querySelector<HTMLInputElement>('[name="statementId"]')!.value).toBe('s1');
		expect(byTestId('delete-draft-and-continue')!.textContent).toContain(
			'Entwurf löschen und unbefristet weiterführen'
		);
		await answer('?/continueDeletingDraft', 'redirect');
		expect(get(toasts).map((t) => t.message)).toContain(
			'Entwurf NK-2025-0003 gelöscht. Der Mietvertrag von Anna Keller läuft unbefristet weiter. Erstellen Sie jetzt die Nebenkostenabrechnung neu.'
		);
	});
});
