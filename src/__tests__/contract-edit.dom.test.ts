import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('$app/navigation', () => ({ goto: vi.fn() }));
vi.mock('$app/stores', () => ({
	page: {
		subscribe: (run: (value: unknown) => void) => (
			run({ url: new URL('http://localhost/contracts/c1/edit') }),
			() => {}
		)
	}
}));

import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import EditPage from '../routes/contracts/[id]/edit/+page.svelte';
import { toasts } from '$lib/stores';
import { localToday } from '$lib/contract-status';
import { formatDate } from '$lib/utils/format';
import { byTestId, click, fakeBff, fireEvent, settle, show, submit } from './helpers/dom';
import refused from '../../tests/contracts/contract-end-refused.json';
import billedRefused from '../../tests/contracts/contract-billed-until-refused.json';
import billedByStatement from '../../tests/contracts/contract-billed-until-billed.json';
import billedFromStart from '../../tests/contracts/contract-billed-until-billed-start.json';
import tenantRefused from '../../tests/contracts/contract-tenant-refused.json';
import advanceRefused from '../../tests/contracts/contract-advance-refused.json';

const contract = (endDate: string | null = null, terminated = false) => ({
	id: 'c1',
	tenantId: 't1',
	apartmentId: 'a1',
	startDate: '2024-04-01',
	endDate,
	terminated,
	baseRent: '950.00',
	additionalRent: null,
	monthlyAdvancePayment: '150.00',
	advancePayments: [{ validFrom: '2024-04-01', amount: '150.00' }]
});
const data = (endDate: string | null = null, terminated = false) => ({
	contract: contract(endDate, terminated),
	tenant: 'Anna Keller',
	apartment: 'Wohnung 2.01 · Ahornhof',
	categories: [] // the boxes of the agreed Nebenkosten (#91)
});

let calls: ReturnType<typeof fakeBff>;

beforeEach(() => {
	vi.mocked(goto).mockClear();
	toasts.set([]);
	calls = fakeBff(({ method }) =>
		method === 'PUT'
			? [200, {}]
			: [200, { contracts: [{ id: 'c1', startDate: '2024-04-01', endDate: null }] }]
	);
});

async function open(endDate: string | null = null, terminated = false) {
	show(EditPage, { data: data(endDate, terminated) } as never);
	await settle();
}

const type = (testid: string, value: string) =>
	fireEvent(byTestId<HTMLInputElement>(testid)!, 'input', value);
const save = async () => {
	submit('submit-button');
	await settle();
};
const puts = () => calls.filter((c) => c.method === 'PUT');

describe('Mietvertrag bearbeiten', () => {
	it('erklärt die Beträge wie der Assistent', async () => {
		await open();
		const help = document.getElementById('baseRent-help')!.textContent!;
		expect(help).toContain('Monatliche Grundmiete ohne Nebenkosten.');
		expect(document.querySelector('label[for="advancePayment"]')!.textContent).toContain('Akonto');
		expect(document.querySelector('label[for="additionalRent"]')!.textContent).toContain(
			'Zusatzmiete'
		);
		expect(byTestId('contract-monthly-total')!.textContent).toContain('1’100.00');
	});

	it('wiederholt den Vertragsbeginn in Worten und fragt bei unverändertem Beginn nicht nach', async () => {
		await open();
		expect(byTestId('start-date-input-words')!.textContent).toContain('Montag, 1. April 2024');
		expect(byTestId('start-date-notice')!.textContent!.trim()).toBe('');
	});

	it('nimmt Beträge in Schweizer Schreibweise an und nennt den Mieter beim Speichern', async () => {
		await open();
		type('contract-base-rent-input', "1'450");
		await save();

		expect(puts()).toEqual([
			expect.objectContaining({
				path: '/contracts/c1',
				body: expect.objectContaining({ baseRent: '1450' })
			})
		]);
		// fach review 464-2 V-2: an unchanged Akonto is not sent again
		expect(puts()[0].body).not.toHaveProperty('monthlyAdvancePayment');
		expect(get(toasts).map((t) => t.message)).toEqual(['Mietvertrag von Anna Keller gespeichert']);
		expect(goto).toHaveBeenCalledWith('/contracts/c1');
	});

	// #464: ein neues Akonto gilt ab «Gültig ab»; vorgeschlagen ist der Tag des heutigen Betrags
	it('speichert ein neues Akonto mit seinem «Gültig ab»', async () => {
		await open();
		expect(document.querySelector('label[for="advancePaymentFrom"]')!.textContent).toContain('Gültig ab');
		// fach review 464-2 V-4: how to correct an amount entered by mistake
		expect(byTestId('contract-advance-from-input-help')!.textContent).toContain('tragen Sie seinen Tag aus «Akonto nach Zeitraum» ein');
		const [year, month] = localToday().split('-').map(Number);
		const next = new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10);
		expect(byTestId<HTMLInputElement>('contract-advance-from-input')!.value).toBe(formatDate(next));
		type('contract-advance-payment-input', '200');
		type('contract-advance-from-input', '01.07.2025');
		await save();
		expect(puts()[0].body).toMatchObject({ monthlyAdvancePayment: '200', advancePaymentFrom: '2025-07-01' });
	});

	// fach review 464-2 V-5: before the start a change corrects the entry; the rules of an increase do not apply
	it('nennt bei einem künftigen Mietvertrag keine Regel einer Erhöhung des Akontos', async () => {
		show(EditPage, { data: { ...data(), contract: { ...contract(), startDate: '2099-01-01' } } } as never);
		await settle();
		const help = byTestId('contract-advance-payment-input-help')!.textContent!;
		expect(help).toContain('Fehlende Zahlungen regeln Sie ausserhalb von Dwello.');
		expect(help).not.toContain('Formular');
	});

	// #464 (fach review F-3): ein neues Akonto ändert keine erstellte Abrechnung still; die Meldung sagt, was zu tun ist
	it('sagt, warum ein Akonto in einer abgerechneten Zeit nicht gespeichert wird', async () => {
		calls = fakeBff(({ method }) =>
			method === 'PUT' ? [400, advanceRefused] : [200, { contracts: [] }]
		);
		await open();
		type('contract-advance-payment-input', '200');
		type('contract-advance-from-input', '01.07.2024');
		await save();
		expect(byTestId('form-error')!.textContent).toContain(
			'Das Akonto ab 01.07.2024 ändert den Entwurf der Nebenkostenabrechnung NK-2024-0001. Gilt das neue Akonto schon ab 01.07.2024, löschen Sie zuerst diesen Entwurf. Gilt es erst später, wählen Sie ein «Gültig ab» ab 01.01.2025.'
		);
	});

	// persona Helga 464-2 P-1, P-3: the form names the amounts already entered; the example is a first of a month
	it('nennt im Formular die eingetragenen Akonto-Beträge und einen Ersten als Beispiel', async () => {
		show(EditPage, {
			data: {
				...data(),
				contract: {
					...contract(),
					advancePayments: [
						{ validFrom: '2024-04-01', amount: '150.00' },
						{ validFrom: '2099-01-01', amount: '220.00' }
					]
				}
			}
		} as never);
		await settle();
		const rows = [...document.querySelectorAll('[data-testid="contract-advance-period"]')].map((row) =>
			row.textContent!.replace(/\s+/g, ' ').trim()
		);
		expect(rows).toEqual(['CHF 150.00 vom 01.04.2024 bis 31.12.2098', 'CHF 220.00 ab 01.01.2099']);
		expect(byTestId('contract-advance-delete')).toBeNull();
		const help = byTestId('contract-advance-from-input-help')!.textContent!;
		expect(help).toMatch(/01\.01\.\d{4}/);
		expect(help).not.toContain('31.12.');
	});

	// #464 (#90, fach review 464): the agreed Akonto is billed; an increase needs the official form, by contract kind
	it.each([
		['unbefristet', null, 'frühestens auf den nächsten Kündigungstermin', 'erst nach dem Vertragsende'],
		['befristet', '2099-03-31', 'erst nach dem Vertragsende möglich', 'Kündigungstermin']
	])('erklärt beim %s Mietvertrag, wie ein neues Akonto gilt', async (_kind, endDate, rule, otherRule) => {
		await open(endDate);
		const help = byTestId('contract-advance-payment-input-help')!.textContent!;
		expect(help).toContain('Fehlende Zahlungen regeln Sie ausserhalb von Dwello.');
		expect(help).toContain('amtlichen Formular');
		expect(help).toContain(rule);
		expect(help).not.toContain(otherRule);
	});

	// #133: bis zu diesem Tag ausserhalb von Dwello abgerechnet; Hilfe am Feld (fach review V-5)
	it('erklärt «Abgerechnet bis» und speichert es', async () => {
		await open();
		expect(document.querySelector('label[for="billedUntil"]')!.textContent).toContain(
			'Abgerechnet bis'
		);
		expect(byTestId('billed-until-input-help')!.textContent).toContain(
			'Dwello rechnet erst ab dem Tag danach ab'
		);
		// #480: a contract ending by then is passed over too
		expect(byTestId('billed-until-input-help')!.textContent).toContain(
			'Für Abrechnungsperioden, die bis dahin enden oder in denen der Mietvertrag bis dahin endet, erstellt Dwello keine Abrechnung.'
		);
		type('billed-until-input', '31.12.2025');
		await save();
		expect(puts()[0].body).toMatchObject({ billedUntil: '2025-12-31' });
	});

	// fach review V-10: «Abgerechnet bis» covers the draft's whole period: Dwello creates no statement for it again
	it('löscht einen Entwurf, den «Abgerechnet bis» ganz abdeckt, und sagt, dass keiner neu entsteht', async () => {
		calls = fakeBff(({ method, body }) => {
			if (method === 'PUT')
				return (body as { deleteDraft?: string }).deleteDraft ? [200, {}] : [409, refused];
			return [200, { contracts: [] }];
		});
		await open();
		type('billed-until-input', '31.12.2025');
		await save();
		const covered =
			'Für diesen Mietvertrag erstellt Dwello in dieser Abrechnungsperiode keine Abrechnung.';
		expect(byTestId('form-error')!.textContent).toContain(
			'Der Entwurf NK-2025-0003 rechnet Tage ab, die Sie jetzt als ausserhalb von Dwello abgerechnet eintragen.'
		);
		const described = byTestId('delete-draft-and-save')!.getAttribute('aria-describedby')!;
		expect(document.getElementById(described)!.textContent).toContain(covered);
		expect(document.body.textContent).not.toContain('neu erstellen');
		click('delete-draft-and-save');
		await settle();
		expect(goto).toHaveBeenCalledWith('/contracts/c1');
	});

	// #453 (#337): a statement exists only after its period ended; a day before the Vertragsbeginn has no effect
	it.each([
		['31.12.2099', 'Abgerechnet bis kann nicht in der Zukunft liegen. Tragen Sie den letzten Tag der letzten Abrechnung ein, die ausserhalb von Dwello erstellt wurde.'],
		['31.03.2024', 'Abgerechnet bis liegt vor dem Vertragsbeginn 01.04.2024. Lassen Sie das Feld leer, wenn für diesen Mietvertrag noch nichts ausserhalb von Dwello abgerechnet ist.']
	])('lehnt «Abgerechnet bis» %s am Feld ab', async (date, error) => {
		await open();
		type('billed-until-input', date);
		await save();
		expect(puts()).toEqual([]);
		expect(document.body.textContent).toContain(error);
	});

	// a refusal of the backend (its clock may differ from the browser's) in the UI language
	it('nennt die Ablehnung von «Abgerechnet bis» durch das Backend in Worten', async () => {
		calls = fakeBff(({ method }) => (method === 'PUT' ? [400, billedRefused] : [200, { contracts: [] }]));
		await open();
		type('billed-until-input', '01.04.2024');
		await save();
		expect(byTestId('form-error')!.textContent).toContain(
			'Abgerechnet bis liegt vor dem Vertragsbeginn 01.01.2024.'
		);
	});

	// code review 453-1 C-2: an answer without a code is never shown in the backend's English
	it('zeigt eine Ablehnung ohne Code nicht auf Englisch', async () => {
		calls = fakeBff(({ method }) => (method === 'PUT' ? [400, tenantRefused] : [200, { contracts: [] }]));
		await open();
		await save();
		expect(byTestId('form-error')!.textContent).toContain('Beim Speichern ist ein Fehler aufgetreten.');
		expect(byTestId('form-error')!.textContent).not.toContain('Tenant');
	});

	// #499: a sent or paid Dwello statement bills those days; the refusal is at the field and offers no correction
	it('lehnt «Abgerechnet bis» über eine versendete Abrechnung am Feld ab, ohne zum Berichtigen zu raten', async () => {
		calls = fakeBff(({ method }) => (method === 'PUT' ? [400, billedByStatement] : [200, { contracts: [] }]));
		await open();
		type('billed-until-input', '30.06.2025');
		await save();
		const field = byTestId('billed-until-input')!;
		expect(field.getAttribute('aria-invalid')).toBe('true');
		expect(document.body.textContent).toContain(
			'Für 2025 gibt es schon die Abrechnung NK-2025-0003 in Dwello. «Abgerechnet bis» kann nur Tage ohne Dwello-Abrechnung decken. Tragen Sie höchstens den Tag vor dem Beginn dieser Abrechnung ein: 31.12.2024.'
		);
		expect(document.body.textContent).not.toContain('berichtigen');
	});

	// #499, fach review 499-1 V-2: the Vertragsbeginn lies in the statement's period, no day before it is left
	it('rät bei einer Abrechnung ab dem Vertragsbeginn, das Feld leer zu lassen', async () => {
		calls = fakeBff(({ method }) => (method === 'PUT' ? [400, billedFromStart] : [200, { contracts: [] }]));
		await open();
		type('billed-until-input', '30.06.2024');
		await save();
		expect(document.body.textContent).toContain(
			'Für 2024 gibt es schon die Abrechnung NK-2024-0001 in Dwello. «Abgerechnet bis» kann nur Tage ohne Dwello-Abrechnung decken. Dwello rechnet diesen Mietvertrag ab Vertragsbeginn ab: Lassen Sie das Feld leer.'
		);
	});

	// fach review 499-1 V-6c: a period that is no calendar year by its two days
	it('nennt eine Abrechnungsperiode über den Jahreswechsel mit ihren Daten', async () => {
		const july = { ...billedByStatement, params: { ...billedByStatement.params, start: '2024-07-01', end: '2025-06-30' } };
		calls = fakeBff(({ method }) => (method === 'PUT' ? [400, july] : [200, { contracts: [] }]));
		await open();
		type('billed-until-input', '30.09.2024');
		await save();
		expect(document.body.textContent).toContain('Für 01.07.2024 – 30.06.2025 gibt es schon die Abrechnung NK-2025-0003 in Dwello.');
	});

	// code review C-2: a mistyped date must not clear the stored «Abgerechnet bis»
	it('speichert ein falsch getipptes «Abgerechnet bis» nicht als kein Datum', async () => {
		show(EditPage, {
			data: { ...data(), contract: { ...contract(), billedUntil: '2024-12-31' } }
		} as never);
		await settle();
		type('billed-until-input', '31.06.2024');
		await save();
		expect(puts()).toEqual([]);
		expect(document.body.textContent).toContain('Dieses Datum gibt es nicht.');
	});

	it('speichert ohne Nettomiete nicht und nennt den Fehler beim Feld', async () => {
		await open();
		type('contract-base-rent-input', '');
		await save();

		expect(puts()).toEqual([]);
		expect(byTestId('form-error')!.textContent).toContain('Nettomiete ist erforderlich.');
		expect(document.activeElement).toBe(byTestId('contract-base-rent-input'));
	});

	it('weist auf einen laufenden Mietvertrag hin', async () => {
		await open();
		expect(document.body.textContent).toContain('Laufender Mietvertrag');
	});

	// #66: a rent increase follows Art. 269d OR; a befristeter Mietvertrag has no Kündigungstermin before its end (#76)
	const onTermination = 'frühestens auf den nächsten Kündigungstermin';
	const afterEnd = 'erst nach dem Vertragsende möglich';
	// #388: the befristet hint names the form rule too
	const afterEndWithForm = `${afterEnd}, ausser der Mietvertrag sieht sie vor. Teilen Sie eine Erhöhung begründet und mit dem amtlichen Formular mit, sonst ist sie nichtig.`;
	it.each([
		['unbefristet', null, false, onTermination, afterEnd],
		['gekündigt', '2099-03-31', true, onTermination, afterEnd],
		['befristet', '2099-03-31', false, afterEndWithForm, 'Kündigungstermin']
	])(
		'nennt bei einem laufenden %s Mietvertrag die Regel einer Mietzinserhöhung',
		async (_kind, endDate, terminated, rule, otherRule) => {
			await open(endDate, terminated);
			const hint = byTestId('contract-running-hint')!.textContent;
			expect(hint).toContain(rule);
			expect(hint).not.toContain(otherRule);
			// personas Weber and Helga 66 P-1: what Dwello does, and when to enter an increase; #464 (F-14): a new
			// Akonto no longer applies to the time not yet billed
			expect(hint).toContain('Ein neues Akonto gilt ab dem Tag, den Sie dazu eintragen. Andere Änderungen übernimmt Dwello sofort');
			expect(hint).not.toContain('Dwello übernimmt Änderungen sofort');
			expect(hint).toContain('Tragen Sie eine Mietzinserhöhung erst ein, wenn sie gilt.');
		}
	);

	// B-15 (#152): eine Änderung ging still verloren; ein Mieterwechsel oder Umzug ist ein neuer Mietvertrag
	it('nennt Mieter und Wohnung, ohne sie zur Auswahl anzubieten', async () => {
		await open();
		expect(byTestId('contract-form-tenant')!.textContent).toBe('Anna Keller');
		expect(byTestId('contract-form-apartment')!.textContent).toBe('Wohnung 2.01 · Ahornhof');
		expect(byTestId('contract-tenant-select')).toBeNull();
		expect(byTestId('apartment-select')).toBeNull();
		// Personas S-1, H15-1: die Einleitung bietet nicht an, was das Formular nicht kann
		expect(document.body.textContent).toContain(
			'Ändern Sie Vertragsdauer oder Miete dieses Mietvertrags.'
		);
	});

	// Persona H15-2: die Hilfe nennt den Ort, an dem es weitergeht
	it('führt bei einem unbefristeten Mietvertrag zu «Beenden» auf der Seite des Mietvertrags', async () => {
		await open();
		const help = byTestId('contract-parties-help')!.textContent!;
		expect(help).toContain('Mieter und Wohnung lassen sich nicht ändern.');
		expect(help).toContain('mit «Beenden»');
		// Fachreview V-1, V-6: ein Erfassungsfehler ist kein Mieterwechsel; auch ein begonnener wird gelöscht (#116)
		expect(help).toContain(
			'Haben Sie den falschen Mieter oder die falsche Wohnung gewählt, löschen Sie den Mietvertrag auf seiner Seite und erfassen Sie ihn neu. Gibt es dazu schon den Entwurf einer Nebenkostenabrechnung, löschen Sie zuerst den Entwurf.'
		);
		// Persona Sven N-2: der Link nennt den Mietvertrag wie die anderen Links zur selben Seite
		expect(byTestId('contract-parties-link')!.textContent).toBe(
			'Zur Seite des Mietvertrags von Anna Keller'
		);
		expect(byTestId('contract-parties-link')!.getAttribute('href')).toBe('/contracts/c1');
		// Code-Review m-6: zuerst «Beenden», dann der neue Mietvertrag (dazu #156)
		expect(byTestId('contract-parties-new')).toBeNull();
	});

	// F-23 (#155): beim Tod des Mieters geht der Mietvertrag auf die Erben über; ein Eintritt eines Dritten
	// (Art. 263 OR, Art. 121 ZGB) ist Vertragsende und neuer Mietvertrag
	it.each([null, '2099-03-31'])(
		'erklärt, wie Tod, Übertragung und Zuweisung durch ein Gericht erfasst werden (Vertragsende %s)',
		async (endDate) => {
			await open(endDate);
			const help = byTestId('contract-parties-help')!.textContent!;
			expect(help).toContain('Stirbt der Mieter, endet der Mietvertrag nicht von selbst');
			expect(help).toContain('erfassen Sie eines erst, wenn die Erben oder Sie gekündigt haben');
			expect(help).toContain(
				// Persona Weber P-1: der Abschnitt heisst im Mieterformular «Korrespondenzadresse» (#68)
				'unter «Korrespondenzadresse» die Adresse ein, an die die Post für die Erben geht, bei Post per E-Mail auch unter «E-Mail»'
			);
			// Fachreview W10 M-2, M-4: Vertragsende ohne Kündigungsfrist, gleiche Bedingungen, schriftliche Zustimmung
			expect(help).toContain('mit Ihrer schriftlichen Zustimmung');
			expect(help).toContain('bei der Scheidung die Wohnung der Familie'); // Persona Weber P-3
			expect(help).toContain('am Tag vor dem Wechsel, ohne Kündigungsfrist');
		}
	);

	// Fachreview V-2: mit Vertragsende gibt es kein «Beenden» mehr
	it('nennt bei einem Mietvertrag mit Vertragsende den frühesten Tag des neuen Mietvertrags', async () => {
		await open('2099-03-31');
		const help = byTestId('contract-parties-help')!.textContent!;
		// Personas N-1, H15-8; Fachreview V-7, V-8: frühestens, mit Datum, und nicht für eine andere Wohnung
		expect(help).toContain(
			'Bei einem Mieterwechsel erfassen Sie einen neuen Mietvertrag, frühestens ab 01.04.2099.'
		);
		expect(help).toContain(
			'Bei einem Wechsel der Wohnung erfassen Sie einen neuen Mietvertrag für die andere Wohnung.'
		);
		expect(help).toContain('ändern Sie zuerst unten unter «Vertragsdauer» das Vertragsende.');
		expect(help).not.toContain('«Beenden»');
		// Persona H15-7: der neue Mietvertrag ist einen Klick entfernt; B-16 (#156): mit Mieter und frühestem Beginn,
		// den der Link nennt, damit ihn niemand für den Nachmieter nimmt (Fachreview W10 V-1)
		expect(byTestId('contract-parties-new')!.textContent).toBe(
			'Neuen Mietvertrag für Anna Keller erfassen'
		);
		expect(byTestId('contract-parties-new')!.getAttribute('href')).toBe(
			'/contracts/new?tenant=t1&start=2099-04-01&from=c1' // and its agreed Nebenkosten (#368)
		);
	});

	it('kehrt beim Abbrechen zum Mietvertrag zurück', async () => {
		await open();
		expect(byTestId('form-cancel')!.getAttribute('href')).toBe('/contracts/c1');
	});

	// #143, #151: ohne die Mietverträge der Wohnung ist eine Überschneidung nicht geprüft; ein Knopf pro Seite
	it('sagt, dass die Mietverträge der Wohnung nicht geladen werden konnten', async () => {
		fakeBff(() => [500, {}]);
		await open();
		expect(byTestId('apartment-contracts-unknown')!.textContent).toContain(
			'Überschneidung noch nicht geprüft'
		);
		expect(byTestId('apartment-contracts-unknown')!.textContent).toContain(
			'Wählen Sie «Erneut versuchen»; Ihre Eingaben bleiben erhalten.'
		);
		expect(byTestId('start-contracts-unknown')!.textContent).toContain(
			'Die Mietverträge dieser Wohnung fehlen noch, siehe oben bei der Wohnung.'
		);
		expect(document.querySelectorAll('[data-testid="contracts-retry"]')).toHaveLength(1);
		// Review M3: the hint is read out when it appears; once only, not again at the start (Sven B-13 Minor 3)
		expect(byTestId('apartment-contracts-unknown')!.closest('[role="status"]')).not.toBeNull();
		expect(byTestId('start-contracts-unknown')!.closest('[role="status"]')).toBeNull();
	});

	// #151: «Erneut versuchen» loads the contracts again; the input stays (Helga B-13 H2)
	it('lädt die Mietverträge der Wohnung erneut und behält die Eingabe', async () => {
		let failing = true;
		fakeBff(() =>
			failing
				? [500, {}]
				: [200, { contracts: [{ id: 'c1', startDate: '2024-04-01', endDate: null }] }]
		);
		await open();
		type('contract-base-rent-input', '980');
		expect(byTestId('apartment-contracts-unknown')).not.toBeNull();
		failing = false;
		click('contracts-retry');
		await settle();
		expect(byTestId('apartment-contracts-unknown')).toBeNull();
		expect(byTestId<HTMLInputElement>('contract-base-rent-input')!.value).toBe('980');
	});

	// Sven/Helga #151: the result of «Erneut versuchen» is said, and the focus does not fall to the page
	describe('nach «Erneut versuchen»', () => {
		let failing: boolean;
		beforeEach(() => {
			failing = true;
			fakeBff(() =>
				failing
					? [500, {}]
					: [200, { contracts: [{ id: 'c1', startDate: '2024-04-01', endDate: null }] }]
			);
		});
		const said = () => get(toasts).map((t) => [t.type, t.message]);

		// B-15: the apartment is fixed (#152), so the focus goes to the first field, the Vertragsbeginn
		it('bestätigt das Laden und setzt den Fokus auf den Vertragsbeginn', async () => {
			await open();
			failing = false;
			click('contracts-retry');
			await settle();
			expect(said()).toContainEqual(['success', 'Die Mietverträge der Wohnung sind geladen.']);
			expect(document.activeElement).toBe(document.getElementById('startDate'));
		});

		// Review b15-merge M-1: the hint and its button stay while loading, so the focus does not fall to the page
		it('behält den Knopf mit dem Fokus, solange geladen wird und wenn es wieder scheitert', async () => {
			await open();
			byTestId<HTMLButtonElement>('contracts-retry')!.focus();
			click('contracts-retry');
			expect(document.activeElement).toBe(byTestId('contracts-retry'));
			await settle();
			expect(document.activeElement).toBe(byTestId('contracts-retry'));
		});

		// review #151 R2-2, former U-19: a late answer of an older attempt neither speaks nor brings the hint back
		it('nimmt nur die letzte Antwort, wenn zweimal versucht wird', async () => {
			await open();
			const answer = globalThis.fetch;
			let late: (() => void) | undefined;
			let calls = 0;
			globalThis.fetch = ((url: string, init?: RequestInit) =>
				++calls === 1
					? new Promise((resolve) => (late = () => resolve(new Response('{}', { status: 500 }))))
					: answer(url, init)) as typeof fetch;
			click('contracts-retry'); // first attempt: answers late, with an error
			failing = false;
			click('contracts-retry'); // second attempt: loads
			await settle();
			expect(byTestId('apartment-contracts-unknown')).toBeNull();
			late!();
			await settle();
			expect(byTestId('apartment-contracts-unknown')).toBeNull();
			expect(said()).toEqual([['success', 'Die Mietverträge der Wohnung sind geladen.']]);
		});

		it('sagt, wenn es wieder nicht geklappt hat', async () => {
			await open();
			click('contracts-retry');
			await settle();
			expect(said()).toContainEqual([
				'error',
				'Die Mietverträge der Wohnung konnten wieder nicht geladen werden. Versuchen Sie es später erneut; Ihre Eingaben bleiben erhalten.'
			]);
		});
	});

	// wie beim Beenden: ein Tippfehler im Jahr soll den Mietvertrag nicht rückwirkend beenden
	describe('Vertragsende in der Vergangenheit', () => {
		async function endOn(day: string) {
			document.querySelector<HTMLInputElement>('input[value="limited"]')!.click();
			await settle();
			type('end-date-input', day);
			await settle();
		}

		// die Live-Region steht schon vor «Befristet», sonst sagt ein Screenreader das Kästchen nicht an
		it('sagt das Kästchen auch bei einem unbefristeten Mietvertrag an', async () => {
			await open();
			const notice = byTestId('contract-end-past-notice')!;
			expect(notice.getAttribute('aria-live')).toBe('polite');
			await endOn('31.03.2025');
			expect(notice.textContent).toContain('Bestätigen Sie das Vertragsende mit dem Kästchen.');
		});

		it('speichert ohne Bestätigung nicht und sagt am Kästchen, was zu tun ist', async () => {
			await open();
			await endOn('31.03.2025');
			await save();

			expect(puts()).toEqual([]);
			expect(document.body.textContent!.replace(/\s+/g, ' ')).toContain(
				'Bitte bestätigen Sie, dass der Mietvertrag am 31.03.2025 endete, oder korrigieren Sie das Vertragsende.'
			);
			expect(document.activeElement).toBe(byTestId('contract-end-past-confirm'));
		});

		// der Fehler am Kästchen wird vor der Hilfe gelesen
		it('liest den Fehler am Kästchen vor seiner Hilfe', async () => {
			await open();
			await endOn('31.03.2025');
			await save();
			const described = byTestId('contract-end-past-confirm')!.getAttribute('aria-describedby')!;
			expect(described.split(' ')[0]).toBe('pastConfirmed-error');
		});

		it('nimmt die Meldung am Kästchen zurück, wenn das Datum ändert', async () => {
			await open();
			await endOn('31.03.2025');
			await save();
			type('end-date-input', '30.04.2025');
			await settle();
			expect(byTestId('contract-end-past-confirm')).not.toBeNull();
			expect(document.body.textContent).not.toContain('Bitte bestätigen Sie');
		});

		it('speichert ein bestätigtes Vertragsende in der Vergangenheit', async () => {
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();

			expect(puts()[0].body).toMatchObject({ endDate: '2025-03-31' });
		});

		// beim Ändern des Mietzinses eines beendeten Mietvertrags wird das Ende nicht nochmals bestätigt
		it('fragt bei einem unveränderten Vertragsende nicht nach', async () => {
			await open('2024-12-31');
			expect(byTestId('contract-end-past-confirm')).toBeNull();
			type('contract-base-rent-input', '980');
			await save();

			expect(puts()).toHaveLength(1);
		});

		it('sagt bei einem Entwurf, der schon Mietstage nach dem Tag enthält, was zu tun ist', async () => {
			calls = fakeBff(({ method }) =>
				method === 'PUT' ? [409, refused] : [200, { contracts: [] }]
			);
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();

			expect(byTestId('form-error')!.textContent).toContain(
				'Die Nebenkostenabrechnung NK-2025-0003 (Entwurf) wurde mit den bisherigen Vertragsdaten berechnet. Sie können den Entwurf unten löschen und die Nebenkostenabrechnung danach neu erstellen.'
			);
			expect(byTestId('refused-statement-link')!.getAttribute('href')).toBe('/statements/s1');
			// Haiku-Review R1: der Knopf nennt seine Folge auch unter «Bearbeiten»
			const described = byTestId('delete-draft-and-save')!.getAttribute('aria-describedby')!;
			expect(document.getElementById(described)!.textContent).toContain('wird gelöscht');
		});

		// fach review V-15: new contract dates that leave the period out are not «Abgerechnet bis»
		it('nennt bei einem Vertragsende vor der Periode des Entwurfs nicht «Abgerechnet bis» als Grund', async () => {
			calls = fakeBff(({ method }) =>
				method === 'PUT' ? [409, refused] : [200, { contracts: [] }]
			);
			await open();
			await endOn('31.12.2024');
			click('contract-end-past-confirm');
			await settle();
			await save();
			expect(byTestId('form-error')!.textContent).not.toContain('ausserhalb von Dwello');
			// code review C-13: the button still leads to the wizard
			calls = fakeBff(({ method }) => (method === 'PUT' ? [200, {}] : [200, { contracts: [] }]));
			click('delete-draft-and-save');
			await settle();
			expect(goto).toHaveBeenCalledWith(
				'/statements/generate?building=b1&start=2025-01-01&end=2025-12-31'
			);
		});

		// Haiku-Review R5: ohne die Mietverträge der Wohnung ist eine Überschneidung nicht auszuschliessen
		it('löscht keinen Entwurf, wenn die Mietverträge der Wohnung nicht geladen werden konnten', async () => {
			calls = fakeBff(({ method }) => (method === 'PUT' ? [409, refused] : [500, {}]));
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();
			click('delete-draft-and-save');
			await settle();
			expect(calls.filter((c) => c.method === 'DELETE')).toEqual([]);
			// Haiku-Review N2: die Meldung sagt, was fehlt und was zu tun ist
			expect(byTestId('form-error')!.textContent).toContain(
				'Dwello hat den Entwurf nicht gelöscht: Ohne die Mietverträge dieser Wohnung lässt sich eine Überschneidung nicht ausschliessen.'
			);
			// review #151 R-1: the text sends the landlord back to this button after «Erneut versuchen»
			expect(byTestId('delete-draft-and-save')).not.toBeNull();
		});

		// Review K-2: das Angebot gehört zu den abgelehnten Werten
		it('nimmt das Angebot zurück, sobald ein Feld geändert ist', async () => {
			calls = fakeBff(({ method }) =>
				method === 'PUT' ? [409, refused] : [200, { contracts: [] }]
			);
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();
			expect(byTestId('delete-draft-and-save')).not.toBeNull();
			type('contract-base-rent-input', '980');
			await settle();
			expect(byTestId('delete-draft-and-save')).toBeNull();
			// Haiku-Review P1: die Meldung verweist auf den Knopf unten, sie geht mit ihm
			expect(byTestId('form-error')).toBeNull();
		});

		// Review K-2: eine Überschneidung lehnte das Speichern nach dem Löschen ab; der Entwurf bleibt
		it('löscht keinen Entwurf, solange sich der Zeitraum überschneidet', async () => {
			calls = fakeBff(({ method }) => {
				if (method === 'PUT') return [409, refused];
				return [200, { contracts: [{ id: 'c2', startDate: '2025-02-01', endDate: null }] }];
			});
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();
			click('delete-draft-and-save');
			await settle();
			expect(calls.filter((c) => c.method === 'DELETE')).toEqual([]);
			expect(byTestId('form-error')!.textContent).toContain('überschneidet');
		});

		// Haiku-Review: solange die Mietverträge der Wohnung laden, wird nichts gelöscht, und die Meldung sagt es
		it('löscht keinen Entwurf, solange die Mietverträge der Wohnung noch laden', async () => {
			calls = fakeBff(({ method }) =>
				method === 'PUT' ? [409, refused] : [200, { contracts: [] }]
			);
			const answer = globalThis.fetch;
			globalThis.fetch = ((url: string, init?: RequestInit) =>
				String(url).includes('/contracts?apartmentId=a1')
					? new Promise(() => {}) // still loading
					: answer(url, init)) as typeof fetch;
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();
			click('delete-draft-and-save');
			await settle();
			expect(calls.filter((c) => c.method === 'DELETE')).toEqual([]);
			expect(byTestId('form-error')!.textContent).toContain(
				'Die Mietverträge der Wohnung werden noch geladen.'
			);
		});

		// Haiku-Review: eine Antwort ohne Liste gilt als nicht geladen; der Entwurf bleibt
		it('löscht keinen Entwurf, wenn die Mietverträge der Wohnung keine Liste sind', async () => {
			calls = fakeBff(({ method }) =>
				method === 'PUT' ? [409, refused] : [200, { contracts: 'x' }]
			);
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();
			click('delete-draft-and-save');
			await settle();
			expect(calls.filter((c) => c.method === 'DELETE')).toEqual([]);
			expect(byTestId('form-error')!.textContent).toContain(
				'Dwello hat den Entwurf nicht gelöscht'
			);
		});

		// Review K-7, #141: ein inzwischen versendeter Entwurf; das Backend lehnt ab und behält ihn, kein zweites Angebot
		it('nennt den Grund, wenn der Entwurf nicht mehr gelöscht werden kann', async () => {
			const drafted = (body: unknown) => !!(body as { deleteDraft?: string }).deleteDraft;
			const sent = { ...refused, statements: [{ ...refused.statements[0], status: 'sent' }] };
			calls = fakeBff(({ method, body }) => {
				if (method === 'PUT') return [409, drafted(body) ? sent : refused];
				return [200, { contracts: [] }];
			});
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();
			click('delete-draft-and-save');
			await settle();
			expect(calls.filter((c) => c.method === 'DELETE')).toEqual([]);
			expect(byTestId('form-error')!.textContent).toContain(
				'Die Nebenkostenabrechnung NK-2025-0003 (versendet) wurde mit den bisherigen Vertragsdaten berechnet.'
			);
			expect(byTestId('delete-draft-and-save')).toBeNull();
		});

		// A-10: der einzige Entwurf wird mit dem Speichern gelöscht (#141: in einem Schritt), danach geht es in den Assistenten
		it('löscht den Entwurf, speichert und öffnet den Assistenten für Gebäude und Periode', async () => {
			calls = fakeBff(({ method, body }) => {
				if (method === 'PUT')
					return (body as { deleteDraft?: string }).deleteDraft ? [200, {}] : [409, refused];
				return [200, { contracts: [] }];
			});
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();
			click('delete-draft-and-save');
			await settle();

			expect(
				calls
					.filter((c) => c.method !== 'GET')
					.map((c) => [c.method, c.path, (c.body as { deleteDraft?: string }).deleteDraft])
			).toEqual([
				['PUT', '/contracts/c1', undefined],
				['PUT', '/contracts/c1', 's1']
			]);
			expect(goto).toHaveBeenCalledWith(
				'/statements/generate?building=b1&start=2025-01-01&end=2025-12-31'
			);
		});
	});

	// A-1: ein gekündigter Mietvertrag bleibt unbefristet, bis die Kündigung aufgehoben wird
	describe('Gekündigter Mietvertrag', () => {
		const duration = (value: string) =>
			document.querySelector<HTMLInputElement>(`input[name="duration"][value="${value}"]`)!;

		it('zeigt die Kündigung statt einer Befristung', async () => {
			await open('2099-03-31', true);
			expect(duration('terminated').checked).toBe(true);
			expect(byTestId('contract-duration')!.textContent).toContain(
				'Unbefristet, gekündigt auf den 31.03.2099'
			);
		});

		it('bleibt beim Speichern gekündigt', async () => {
			await open('2099-03-31', true);
			type('contract-base-rent-input', '980');
			await save();
			expect(puts()[0].body).toMatchObject({ endDate: '2099-03-31', terminated: true });
		});

		it('hebt die Kündigung auf und nennt die Folge', async () => {
			await open('2099-03-31', true);
			expect(byTestId('contract-duration')!.textContent).toContain(
				'Der Mietvertrag läuft dann ohne Ende weiter.'
			);
			click(duration('unlimited'));
			await settle();
			await save();
			expect(puts()[0].body).toMatchObject({ endDate: null, terminated: false });
			expect(get(toasts).map((t) => t.message)).toEqual([
				'Kündigung von Anna Keller aufgehoben. Der Mietvertrag läuft ohne Ende weiter.'
			]);
		});

		it('wird befristet, wenn der Liegenschaftsverwalter «Befristet» wählt', async () => {
			await open('2099-03-31', true);
			click(duration('limited'));
			await settle();
			await save();
			expect(puts()[0].body).toMatchObject({ endDate: '2099-03-31', terminated: false });
		});

		it('bietet bei einem nicht gekündigten Mietvertrag keine Kündigung an', async () => {
			await open('2099-03-31');
			expect(document.querySelector('input[name="duration"][value="terminated"]')).toBeNull();
			type('contract-base-rent-input', '980');
			await save();
			expect(puts()[0].body).toMatchObject({ terminated: false });
		});
	});

	// Sven K1 M1: wer bei einem unbefristeten Mietvertrag «Befristet» wählt, meint oft eine Kündigung
	describe('Hinweis auf «Beenden»', () => {
		const choose = async (value: string) => {
			click(document.querySelector<HTMLInputElement>(`input[name="duration"][value="${value}"]`)!);
			await settle();
		};

		it('verweist bei «Befristet» auf «Beenden»', async () => {
			await open();
			await choose('limited');
			const hint = byTestId('contract-notice-hint')!;
			expect(hint.textContent).toContain('Hat der Mieter gekündigt?');
			expect(hint.querySelector('a')!.getAttribute('href')).toBe('/contracts/c1');
		});

		// Persona Sven K2 M1: der Hinweis erscheint erst nach der Wahl; er wird angesagt, der Link sagt, wozu er führt
		it('sagt den Hinweis an und nennt im Link, was dort zu tun ist', async () => {
			await open();
			const region = document.querySelector('[data-testid="contract-notice-region"]')!;
			expect(region.getAttribute('aria-live')).toBe('polite');
			expect(region.classList.contains('sr-only')).toBe(true); // empty, it takes no gap in the form
			await choose('limited');
			expect(region.classList.contains('sr-only')).toBe(false);
			expect(region.contains(byTestId('contract-notice-hint'))).toBe(true);
			expect(byTestId('contract-notice-hint')!.querySelector('a')!.textContent).toBe(
				'Kündigung mit «Beenden» eintragen'
			);
		});

		it('verweist nicht darauf bei einem befristeten Mietvertrag', async () => {
			await open('2099-12-31');
			expect(byTestId('contract-notice-hint')).toBeNull();
		});
	});
});
