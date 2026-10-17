import { describe, it, expect, vi, beforeEach } from 'vitest';

const location = vi.hoisted(() => ({ url: new URL('http://localhost/contracts/new') }));
vi.mock('$app/environment', () => ({ browser: true }));
vi.mock('$app/navigation', () => ({ goto: vi.fn() }));
vi.mock('$app/stores', () => ({
	page: { subscribe: (run: (value: unknown) => void) => (run({ url: location.url }), () => {}) }
}));

import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import NewContractPage from '../routes/contracts/new/+page.svelte';
import { toasts } from '$lib/stores';
import { writeDraft } from '$lib/wizard-draft';
import { byTestId, click, fakeBff, fireEvent, settle, show, submit } from './helpers/dom';
import listed from '../../tests/contracts/contracts.json';

const data = {
	tenants: [
		{ id: 't1', name: 'Anna Keller' },
		{ id: 't2', name: 'Bruno Meier', place: 'Winterthur' }
	],
	apartments: [
		{ id: 'a1', unit: '2.01', building: 'Ahornhof' },
		{ id: 'a2', unit: '2.02', building: 'Ahornhof' },
		{ id: 'a3', unit: '2.03', building: 'Ahornhof' }
	]
};
// As the contract list answers: a2 is rented without end, a1's last contract ended long ago
const contractsOf: Record<string, unknown[]> = {
	a1: [{ id: 'c8', startDate: '2015-01-01', endDate: '2019-12-31', tenantName: 'Ueli Graf' }],
	a2: [{ id: 'c9', startDate: '2024-04-01', endDate: null, tenantName: 'Eva Frei' }],
	a3: [{ id: 'c7', startDate: '2015-01-01', endDate: '2098-12-31', tenantName: 'Ida Roth' }] // free from 2099
};

function backend() {
	return fakeBff(({ method, path }) => {
		if (method === 'POST') return [201, { id: 'c1' }];
		return [200, { contracts: contractsOf[path.split('=')[1]] ?? [] }];
	});
}

// The step heading, without the position that only screen readers hear ("Schritt 2 von 5:")
const heading = () => document.querySelector('h2 [data-step-label]')!.textContent!.trim();
const select = (testid: string, value: string) =>
	fireEvent(byTestId<HTMLSelectElement>(testid)!, 'change', value);
const type = (testid: string, value: string) =>
	fireEvent(byTestId<HTMLInputElement>(testid)!, 'input', value);
const next = () => submit('wizard-next');
// «Verwaltungspauschale vereinbart» has no default (#89)
const chooseFee = (choice: string) =>
	byTestId<HTMLInputElement>(`contract-fee-choice-${choice}`)!.click();

const UNKNOWN =
	'Dwello konnte die Mietverträge dieser Wohnung nicht laden. Wählen Sie «Erneut versuchen»; Ihre Eingaben bleiben erhalten.';
// the earliest start, as the calendar of the start field takes it
const minOfStart = () =>
	byTestId('start-date-input')!.parentElement!.querySelector<HTMLInputElement>(
		'input[type="date"]'
	)!.min;

async function open() {
	show(NewContractPage, { data } as never);
	await settle();
}

async function untilReview() {
	await open();
	select('contract-tenant-select', 't1');
	next();
	select('apartment-select', 'a1');
	next();
	type('start-date-input', '01.01.2027');
	next();
	type('contract-base-rent-input', '950');
	type('contract-advance-payment-input', '180');
	chooseFee('run');
	next();
}

beforeEach(() => {
	localStorage.clear();
	location.url = new URL('http://localhost/contracts/new');
	vi.mocked(goto).mockClear();
	toasts.set([]);
	backend();
});

describe('Mietvertrag erfassen', () => {
	it('beginnt beim Mieter und geht ohne Mieter nicht weiter', async () => {
		await open();
		expect(heading()).toBe('Mieter');
		expect(document.querySelector('h2')!.textContent).toMatch(/Schritt 1 von 5:\s*Mieter/);
		next();
		await settle();
		expect(byTestId('form-error')!.textContent).toContain('Bitte wählen Sie einen Mieter aus.');
		expect(heading()).toBe('Mieter');
		// the field with the error gets the focus, so its error is read out
		expect(document.activeElement).toBe(byTestId('contract-tenant-select'));
		select('contract-tenant-select', 't1');
		expect(byTestId('form-error')).toBeNull();
	});

	it('führt Schritt für Schritt weiter und setzt den Fokus auf den neuen Schritt', async () => {
		await open();
		select('contract-tenant-select', 't1');
		next();
		await settle();
		expect(heading()).toBe('Wohnung');
		expect(document.activeElement).toBe(document.querySelector('h2'));
	});

	it('verliert beim Zurückgehen keine Angaben', async () => {
		await open();
		select('contract-tenant-select', 't2');
		next();
		click('wizard-back');
		expect(byTestId<HTMLSelectElement>('contract-tenant-select')!.value).toBe('t2');
	});

	it('bietet vermietete Wohnungen nicht an, wohl aber solche mit beendetem Vertrag', async () => {
		await open();
		select('contract-tenant-select', 't1');
		next();
		await settle();
		const options = [...byTestId<HTMLSelectElement>('apartment-select')!.options].slice(1);
		expect(options.map((o) => [o.value, o.disabled])).toEqual([
			['a1', false],
			['a3', false],
			['a2', true]
		]);
	});

	it('wiederholt das gewählte Datum in Worten', async () => {
		await open();
		select('contract-tenant-select', 't1');
		next();
		select('apartment-select', 'a1');
		next();
		type('start-date-input', '01.11.2026');
		expect(document.body.textContent).toContain('Sonntag, 1. November 2026');
	});

	it('erklärt die Miete, rechnet das Total und weist auf fehlendes Akonto hin', async () => {
		await open();
		select('contract-tenant-select', 't1');
		next();
		select('apartment-select', 'a1');
		next();
		type('start-date-input', '01.01.2027');
		next();
		expect(document.body.textContent).toContain(
			'Monatlicher Vorschuss des Mieters für die im Mietvertrag vereinbarten Nebenkosten'
		);
		type('contract-base-rent-input', '950');
		expect(byTestId('advance-payment-notice')).not.toBeNull();
		type('contract-advance-payment-input', '180');
		expect(byTestId('advance-payment-notice')).toBeNull();
		expect(byTestId('contract-monthly-total')!.textContent).toContain('1’130.00');
	});

	// #89, persona Helga P-1: the error at the choice goes once an answer is chosen
	it('nimmt die Meldung zur Verwaltungspauschale zurück, sobald eine Antwort gewählt ist', async () => {
		await open();
		select('contract-tenant-select', 't1');
		next();
		select('apartment-select', 'a1');
		next();
		type('start-date-input', '01.01.2027');
		next();
		type('contract-base-rent-input', '950');
		next();
		await settle();
		const group = byTestId('contract-fee-choice')!;
		expect(group.textContent).toContain(
			'Bitte wählen Sie, ob im Mietvertrag eine Verwaltungspauschale vereinbart ist.'
		);
		chooseFee('none');
		await settle();
		expect(group.textContent).not.toContain('Bitte wählen Sie');
		expect(group.getAttribute('aria-invalid')).toBeNull();
	});

	// #89, fach-review M-2: the guideline of 3 % holds for a rate agreed in the contract too
	it('weist bei einem eigenen Satz über 3 % auf den üblichen Richtwert hin', async () => {
		await open();
		select('contract-tenant-select', 't1');
		next();
		select('apartment-select', 'a1');
		next();
		type('start-date-input', '01.01.2027');
		next();
		expect(byTestId('contract-fee-rate-input')).toBeNull();
		// a new fee: form, reasons, ten days before the notice period, next possible Kündigungstermin (Art. 269d Abs. 1 OR, #77)
		expect(document.body.textContent).toContain(
			'mit dem amtlichen Formular mitteilen und begründen, mindestens zehn Tage vor Beginn der Kündigungsfrist. Sie gilt frühestens ab dem nächstmöglichen Kündigungstermin (Art. 269d OR).'
		);
		chooseFee('own');
		await settle();
		type('contract-fee-rate-input', '3');
		await settle();
		expect(byTestId('contract-fee-rate-hint')).toBeNull();
		type('contract-fee-rate-input', '4,5');
		await settle();
		expect(byTestId('contract-fee-rate-hint')!.textContent).toContain(
			'Die Verwaltungspauschale ist höher als der übliche Richtwert von 3 %.'
		);
		// closing review C-4: above 10 % the field refuses the rate; no hint on a rate it does not take
		type('contract-fee-rate-input', '12');
		await settle();
		expect(byTestId('contract-fee-rate-hint')).toBeNull();
	});

	it('zeigt vor dem Speichern alles in Worten und speichert Akonto als Akonto', async () => {
		await untilReview();
		expect(heading()).toBe('Prüfen');
		const items = [...document.querySelectorAll('[data-testid="contract-review-item"]')];
		expect(items.map((item) => item.textContent!.replace(/\s+/g, ' ').trim())).toContain(
			'Akonto CHF 180.00 Ändern'
		);
		const calls = backend();
		submit('submit-button');
		await settle();
		expect(calls.at(-1)).toMatchObject({
			method: 'POST',
			path: '/contracts',
			body: { tenantId: 't1', apartmentId: 'a1', monthlyAdvancePayment: '180', additionalRent: '0' }
		});
		expect(get(toasts)[0].message).toBe('Mietvertrag von Anna Keller gespeichert');
		expect(goto).toHaveBeenCalledWith('/contracts');
		expect(localStorage.length).toBe(0); // the draft is gone once saved
	});

	it('führt aus der Prüfung zum Schritt zurück, der etwas ändert', async () => {
		await untilReview();
		const rent = [...document.querySelectorAll('[data-testid="contract-review-item"]')].find(
			(item) => item.textContent!.includes('Nettomiete')
		)!;
		click(rent.querySelector('button')!);
		expect(heading()).toBe('Miete');
	});

	it('setzt beim Ändern aus der Prüfung den Fokus auf das Feld, das geändert wird', async () => {
		await untilReview();
		const advance = [...document.querySelectorAll('[data-testid="contract-review-item"]')].find(
			(item) => item.textContent!.includes('Akonto')
		)!;
		click(advance.querySelector('button')!);
		await settle();
		expect(document.activeElement!.id).toBe('advancePayment');
	});

	it('meldet einen Fehler beim Speichern und bleibt bei der Prüfung', async () => {
		await untilReview();
		// as the backend answers an overlap: English, with the other contract's id
		fakeBff(() => [
			400,
			{ error: 'Contract overlaps with existing contract 3f2a0000-0000-4000-8000-000000000000' }
		]);
		submit('submit-button');
		await settle();
		const error = byTestId('form-error')!.textContent!;
		expect(error).toContain('überschneidet sich mit einem anderen Mietvertrag');
		expect(error).not.toContain('Contract');
		expect(goto).not.toHaveBeenCalled();
	});
});

describe('Prüfungen im Mietvertrag', () => {
	it('versteht Beträge mit Tausendertrennzeichen', async () => {
		await open();
		select('contract-tenant-select', 't1');
		next();
		select('apartment-select', 'a1');
		next();
		type('start-date-input', '01.01.2027');
		next();
		type('contract-base-rent-input', "1'450");
		expect(byTestId('contract-monthly-total')!.textContent).toContain('1’450.00');
		chooseFee('run');
		next();
		const rent = [...document.querySelectorAll('[data-testid="contract-review-item"]')].find((i) =>
			i.textContent!.includes('Nettomiete')
		)!;
		expect(rent.textContent).toContain('1’450.00');
	});

	async function toPeriod(apartment = 'a1') {
		await open();
		select('contract-tenant-select', 't1');
		next();
		await settle();
		select('apartment-select', apartment);
		next();
		await settle();
	}

	// Fehler behoben (#143): ohne ihre Mietverträge galt die Wohnung als frei, der Vertragsbeginn ohne Untergrenze
	it('zeigt eine Wohnung, deren Mietverträge nicht geladen werden konnten, nicht als frei', async () => {
		fakeBff(({ path }) =>
			path.endsWith('=a3') ? [500, {}] : [200, { contracts: contractsOf[path.split('=')[1]] ?? [] }]
		);
		await toPeriod('a3'); // a3 is free only from 2099
		expect(byTestId('start-contracts-unknown')!.textContent).toContain(UNKNOWN);
		expect(byTestId<HTMLInputElement>('start-date-input')!.value).toBe(''); // no start suggested
		expect(minOfStart()).toBe('');
		click('wizard-back');
		expect(byTestId('apartment-contracts-unknown')!.textContent).toContain(UNKNOWN);
		// Dr. Weber #151 W-01: in the choice too (review R2-1)
		expect(document.querySelector('option[value="a3"]')!.textContent).toContain('(nicht geprüft)');
		expect(byTestId('availability-info')).toBeNull();
		// Review M3: the hint is read out when it appears
		expect(byTestId('apartment-contracts-unknown')!.closest('[role="status"]')).not.toBeNull();
	});

	// #151: «Erneut versuchen» loads the contracts again; the start already typed stays
	it('lädt die Mietverträge der Wohnung erneut und behält die Eingabe', async () => {
		let failing = true;
		fakeBff(({ path }) =>
			failing && path.endsWith('=a3')
				? [500, {}]
				: [200, { contracts: contractsOf[path.split('=')[1]] ?? [] }]
		);
		await toPeriod('a3');
		type('start-date-input', '01.01.2101');
		failing = false;
		click('contracts-retry');
		await settle();
		expect(byTestId('start-contracts-unknown')).toBeNull();
		expect(byTestId<HTMLInputElement>('start-date-input')!.value).toBe('01.01.2101');
		expect(minOfStart()).toBe('2099-01-01'); // a3 is free from 2099
		// Sven #151: said, and the focus goes to the step, not to the page
		expect(get(toasts).map((t) => t.message)).toContain(
			'Die Mietverträge der Wohnung sind geladen.'
		);
		expect(document.activeElement).toBe(document.querySelector('h2'));
	});

	// review #151 R2-6: a retry that fails again says so; the hint stays
	it('sagt, wenn die Mietverträge wieder nicht geladen werden konnten', async () => {
		fakeBff(({ path }) =>
			path.endsWith('=a3') ? [500, {}] : [200, { contracts: contractsOf[path.split('=')[1]] ?? [] }]
		);
		await toPeriod('a3');
		click('contracts-retry');
		await settle();
		expect(get(toasts).map((t) => t.type)).toEqual(['error']);
		expect(byTestId('start-contracts-unknown')).not.toBeNull();
	});

	// review #151 R2-4: only the latest attempt counts, an older answer arriving late does not overwrite it
	it('nimmt nur die Antwort des letzten Versuchs', async () => {
		let call = 0;
		let releaseFirst = () => {};
		fakeBff(({ path }) => [200, { contracts: contractsOf[path.split('=')[1]] ?? [] }]);
		const answer = globalThis.fetch;
		globalThis.fetch = (async (url: string, init?: RequestInit) => {
			if (!String(url).endsWith('=a3')) return answer(url, init);
			call++;
			if (call === 1) return new Response('{}', { status: 500 }); // on opening
			if (call === 2) {
				await new Promise<void>((resolve) => (releaseFirst = resolve)); // first retry, slow
				return new Response('{}', { status: 500 });
			}
			return answer(url, init); // second retry
		}) as typeof fetch;
		await toPeriod('a3');
		click('contracts-retry');
		click('contracts-retry');
		await settle();
		expect(byTestId('start-contracts-unknown')).toBeNull();
		releaseFirst();
		await settle();
		expect(byTestId('start-contracts-unknown')).toBeNull();
	});

	// Persona Helga B-13 H1: the review before saving still says that the apartment could not be checked
	it('sagt auch in der Prüfung, dass die Mietverträge der Wohnung nicht geladen werden konnten', async () => {
		fakeBff(({ path }) =>
			path.endsWith('=a3') ? [500, {}] : [200, { contracts: contractsOf[path.split('=')[1]] ?? [] }]
		);
		await toPeriod('a3');
		type('start-date-input', '01.01.2027');
		next();
		await settle();
		type('contract-base-rent-input', '950');
		chooseFee('run');
		next();
		await settle();
		expect(heading()).toBe('Prüfen');
		expect(byTestId('review-contracts-unknown')!.textContent).toContain(UNKNOWN);
	});

	it('fragt nach, wenn der Vertragsbeginn in der Vergangenheit liegt, und geht erst beim zweiten Mal weiter', async () => {
		await toPeriod();
		type('start-date-input', '11.01.2020');
		expect(byTestId('start-date-notice')!.getAttribute('role')).toBe('status'); // read out while typing
		next();
		await settle();
		expect(heading()).toBe('Vertragsdauer');
		expect(byTestId('form-error')!.textContent).toContain('nochmals auf «Weiter»');
		expect(document.activeElement).toBe(byTestId('start-date-input'));
		next();
		await settle();
		expect(heading()).toBe('Miete');
	});

	it('lehnt ein unmögliches Datum ab', async () => {
		await toPeriod();
		type('start-date-input', '31.02.2026');
		next();
		await settle();
		expect(byTestId('form-error')!.textContent).toContain('Dieses Datum gibt es nicht.');
	});

	// Fehler behoben: kam der Vorschlag an, während man schon tippte, stand «01.01.210001.01.2020» im Feld
	it('überschreibt einen schon getippten Vertragsbeginn nicht mit dem Vorschlag', async () => {
		// the contracts of the apartments arrive only after the start date is being typed
		let release = () => {};
		const loaded = new Promise<void>((resolve) => (release = resolve));
		globalThis.fetch = (async (url: string) => {
			await loaded;
			return Response.json({ contracts: contractsOf[String(url).split('=')[1]] ?? [] });
		}) as typeof fetch;
		location.url = new URL('http://localhost/contracts/new?tenant=t1&apartment=a3'); // from the apartment's page
		await open();
		next();
		next();
		type('start-date-input', '01');
		release();
		await settle(); // a3 is free from 1.1.2099
		expect(byTestId<HTMLInputElement>('start-date-input')!.value).toBe('01.');
	});

	it('füllt einen geleerten Vertragsbeginn nicht wieder aus', async () => {
		await toPeriod('a3');
		expect(byTestId<HTMLInputElement>('start-date-input')!.value).toBe('01.01.2099'); // suggested
		type('start-date-input', '');
		next();
		await settle();
		expect(byTestId<HTMLInputElement>('start-date-input')!.value).toBe('');
		expect(byTestId('form-error')!.textContent).toContain('Vertragsbeginn ist erforderlich.');
	});

	it('geht bei einer Überschneidung nicht weiter', async () => {
		await open();
		select('contract-tenant-select', 't1');
		next();
		await settle();
		select('apartment-select', 'a1'); // its last contract ran 2015–2019
		next();
		await settle();
		type('start-date-input', '01.01.2016');
		next();
		expect(byTestId('overlap-warning')).not.toBeNull();
		expect(heading()).toBe('Vertragsdauer');
		// fixed by a limited contract that ends before the old one began: the error goes
		click(byTestId('contract-duration')!.querySelectorAll('input')[1]);
		type('end-date-input', '31.12.2014');
		type('start-date-input', '01.01.2014');
		await settle();
		expect(byTestId('overlap-warning')).toBeNull();
		expect(byTestId('form-error')).toBeNull();
	});
});

// B-16 (#156): wer «Beenden» beim alten Mietvertrag vergessen hat, erfährt es vor der Prüfung
describe('Mieter mit einem anderen Mietvertrag', () => {
	const own = (apartmentId: string, endDate: string | null) => [
		{ ...listed.contracts[0], id: `c-${apartmentId}`, apartmentId, endDate }
	]; // contracts of Anna Keller (t1)

	it('nennt bei der Wohnung einen Mietvertrag des Mieters ohne Vertragsende und hält nicht auf', async () => {
		fakeBff(({ path }) => [200, { contracts: path.endsWith('=a2') ? own('a2', null) : [] }]);
		await open();
		select('contract-tenant-select', 't1');
		next();
		await settle();
		const hint = byTestId('tenant-running-contract')!;
		expect(hint.textContent).toContain('Anna Keller hat einen Mietvertrag ohne Vertragsende');
		expect(hint.textContent).toContain('für die Wohnung 2.02 (Ahornhof)');
		expect(hint.querySelector('a')!.getAttribute('href')).toBe('/contracts/c-a2');
		select('apartment-select', 'a1');
		next();
		expect(heading()).toBe('Vertragsdauer');
	});

	it('schweigt bei einem Mietvertrag mit Vertragsende', async () => {
		fakeBff(({ path }) => [
			200,
			{ contracts: path.endsWith('=a2') ? own('a2', '2099-03-31') : [] }
		]);
		await open();
		select('contract-tenant-select', 't1');
		next();
		await settle();
		expect(byTestId('apartment-select')).not.toBeNull(); // on the step «Wohnung»
		expect(byTestId('tenant-running-contract')).toBeNull();
	});

	// Code-Review W10 C-2: erscheint der Hinweis erst nach dem Laden, liest ein Screenreader ihn trotzdem vor
	it('nennt den Mietvertrag in einem Bereich, den Screenreader ansagen', async () => {
		fakeBff(({ path }) => [200, { contracts: path.endsWith('=a2') ? own('a2', null) : [] }]);
		await open();
		select('contract-tenant-select', 't1');
		next();
		await settle();
		expect(byTestId('tenant-running-contract')!.closest('[role="status"]')).not.toBeNull();
	});

	it('schweigt bei einem unbefristeten Mietvertrag eines anderen Mieters', async () => {
		fakeBff(({ path }) => [200, { contracts: path.endsWith('=a2') ? own('a2', null) : [] }]);
		await open();
		select('contract-tenant-select', 't2');
		next();
		await settle();
		expect(byTestId('apartment-select')).not.toBeNull(); // on the step «Wohnung»
		expect(byTestId('tenant-running-contract')).toBeNull();
	});
});

// P-17 (#144): die vorgewählte Wohnung bleibt auf dem Umweg, die Beträge des letzten Mietvertrags sind vorgeschlagen
describe('Vorgewählte Wohnung', () => {
	it('nimmt die vorgewählte Wohnung auf den Umweg zum neuen Mieter mit', async () => {
		location.url = new URL('http://localhost/contracts/new?apartment=a1');
		await open();
		expect(byTestId('contract-new-tenant')!.getAttribute('href')).toBe(
			'/tenants/new?for=contract&apartment=a1'
		);
	});

	it('schlägt die Beträge des letzten Mietvertrags vor und sagt es, bis einer geändert ist', async () => {
		const last = { ...listed.contracts[0], id: 'c8', apartmentId: 'a1', startDate: '2015-01-01' };
		fakeBff(({ path }) => [
			200,
			{ contracts: path.endsWith('=a1') ? [{ ...last, endDate: '2019-12-31' }] : [] }
		]);
		location.url = new URL('http://localhost/contracts/new?tenant=t1&apartment=a1');
		await open();
		next();
		next();
		type('start-date-input', '01.01.2027');
		next();
		expect(heading()).toBe('Miete');
		expect(byTestId<HTMLInputElement>('contract-base-rent-input')!.value).toBe('950.00');
		expect(byTestId<HTMLInputElement>('contract-advance-payment-input')!.value).toBe('150.00');
		expect(byTestId<HTMLInputElement>('contract-additional-rent-input')!.value).toBe('');
		expect(byTestId('contract-rent-taken-over')!.textContent).toContain(
			'aus dem letzten Mietvertrag dieser Wohnung (01.01.2015 – 31.12.2019, gekündigt)'
		);
		// Persona Helga P17 P-1: ohne Zusatzmiete gibt es keinen Parkplatz zu leeren
		expect(byTestId('contract-rent-taken-over')!.textContent).not.toContain('Parkplatz');
		type('contract-base-rent-input', '980');
		await settle();
		expect(byTestId('contract-rent-taken-over')).toBeNull();
	});

	it('nennt den Parkplatz nur, wenn eine Zusatzmiete übernommen ist', async () => {
		const last = { ...listed.contracts[0], apartmentId: 'a1', startDate: '2015-01-01' };
		fakeBff(({ path }) => [
			200,
			{
				contracts: path.endsWith('=a1')
					? [{ ...last, endDate: '2019-12-31', additionalRent: '120.00' }]
					: []
			}
		]);
		location.url = new URL('http://localhost/contracts/new?tenant=t1&apartment=a1');
		await open();
		next();
		next();
		type('start-date-input', '01.01.2027');
		next();
		expect(byTestId<HTMLInputElement>('contract-additional-rent-input')!.value).toBe('120.00');
		expect(byTestId('contract-rent-taken-over')!.textContent).toContain(
			'Mietet der neue Mieter zum Beispiel den Parkplatz nicht, leeren Sie die Zusatzmiete.'
		);
	});
});

// «Nina Brunner» und «Rosa Brunner»: der Ort hilft, den richtigen Mieter zu wählen
it('nennt in der Mieterauswahl den Ort neben dem Namen', async () => {
	await open();
	const options = [...byTestId<HTMLSelectElement>('contract-tenant-select')!.options].map((o) =>
		o.textContent!.trim()
	);

	expect(options).toEqual(['Mieter wählen', 'Anna Keller', 'Bruno Meier, Winterthur']);
});

describe('Entwurf des Mietvertrags', () => {
	it('legt erst einen Entwurf an, wenn der Benutzer etwas eingibt', async () => {
		location.url = new URL('http://localhost/contracts/new?tenant=t2');
		await open();
		await settle();
		expect(localStorage.length).toBe(0);
		select('contract-tenant-select', 't1');
		await settle();
		expect(localStorage.length).toBe(1);
	});

	it('speichert die Angaben im Browser und sagt es', async () => {
		await open();
		select('contract-tenant-select', 't1');
		await settle();
		expect(byTestId('save-status')!.textContent).toContain('Entwurf gespeichert');
	});

	it('setzt einen Entwurf fort und lässt ihn verwerfen', async () => {
		writeDraft(localStorage, 'contract', { tenantId: 't2', baseRent: '900' }, new Date());
		await open();
		expect(byTestId('draft-restored')).not.toBeNull();
		await settle();
		expect(document.activeElement).toBe(byTestId('draft-restored')); // read out right away
		expect(byTestId<HTMLSelectElement>('contract-tenant-select')!.value).toBe('t2');
		click('draft-discard');
		await settle();
		click('draft-discard-confirm'); // asked first (#201)
		await settle();
		expect(byTestId('draft-restored')).toBeNull();
		expect(document.activeElement).toBe(document.querySelector('h2'));
		expect(byTestId<HTMLSelectElement>('contract-tenant-select')!.value).toBe('');
		expect(localStorage.length).toBe(0);
	});

	// Nach «Angaben verwerfen» beginnt der Assistent neu: der Vorschlag für den Vertragsbeginn kommt wieder
	it('schlägt nach dem Verwerfen des Entwurfs den Vertragsbeginn wieder vor', async () => {
		writeDraft(localStorage, 'contract', { tenantId: 't1' }, new Date());
		await open();
		await settle();
		next();
		await settle();
		select('apartment-select', 'a1');
		next();
		await settle();
		type('start-date-input', '01.01.2016');
		click('draft-discard');
		await settle();
		click('draft-discard-confirm');
		await settle();
		select('contract-tenant-select', 't1');
		next();
		await settle();
		select('apartment-select', 'a3');
		next();
		await settle();

		expect(byTestId<HTMLInputElement>('start-date-input')!.value).toBe('01.01.2099');
	});

	it('übernimmt einen eben erfassten Mieter und bestätigt ihn', async () => {
		location.url = new URL('http://localhost/contracts/new?tenant=t2&created=1');
		await open();
		expect(byTestId<HTMLSelectElement>('contract-tenant-select')!.value).toBe('t2');
		expect(byTestId('tenant-created')!.textContent).toContain('Bruno Meier');
		await settle();
		expect(document.activeElement).toBe(byTestId('tenant-created')); // read out right away
		expect(byTestId('contract-new-tenant')!.getAttribute('href')).toBe('/tenants/new?for=contract');
		select('contract-tenant-select', 't1'); // the confirmation is about Bruno, not the new choice
		expect(byTestId('tenant-created')).toBeNull();
	});
});
