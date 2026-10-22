import { describe, it, expect } from 'vitest';
import AgreedCosts from '../routes/statements/generate/AgreedCosts.svelte';
import { byTestId, click, fakeBff, fireEvent, settle, show } from './helpers/dom';
import refused from '../../tests/contracts/contract-agreement-from-refused.json';

// #91, step 3 of «Abrechnungen erstellen»: whether the run's contracts agree the period's Nebenkosten
const period = { start: '2024-01-01', end: '2024-12-31' };
const anna = {
	contractId: 'c1',
	tenantName: 'Anna Keller',
	apartmentNumber: '1.01',
	open: [{ categoryId: 'k1', name: 'Treppenhausreinigung' }],
	notAgreed: []
};

async function agreedCosts(answer: Parameters<typeof fakeBff>[0], error?: string) {
	const calls = fakeBff(answer);
	// the bound «blocking» comes back through the setter, as a parent's bind: would see it
	const bound = { blocking: false };
	show(AgreedCosts, {
		buildingIds: ['b1'],
		period,
		error,
		get blocking() {
			return bound.blocking;
		},
		set blocking(blocking: boolean) {
			bound.blocking = blocking;
		}
	});
	await settle();
	return { calls, props: bound };
}

describe('Vereinbarte Nebenkosten im Assistenten', () => {
	it('hält «Weiter» an, bis die Fragen geladen und beantwortet sind', async () => {
		const { props } = await agreedCosts((call) =>
			call.method === 'PUT' ? [200, {}] : [200, [anna]]
		);

		expect(byTestId('agreement-contract-c1')!.textContent).toContain(
			'Ist «Treppenhausreinigung» im Mietvertrag von Anna Keller (Wohnung 1.01) vereinbart?'
		);
		expect(props.blocking).toBe(true);

		click('agreement-c1-k1-no');
		await settle();

		expect(props.blocking).toBe(false);
		expect(byTestId('agreement-saved-c1-k1')!.textContent).toContain(
			'Beim Mietvertrag gespeichert.'
		);
	});

	it('speichert die Antwort beim Mietvertrag', async () => {
		const { calls } = await agreedCosts((call) =>
			call.method === 'PUT' ? [200, {}] : [200, [anna]]
		);

		click('agreement-c1-k1-yes');
		await settle();

		expect(calls.at(-1)).toMatchObject({
			method: 'PUT',
			path: '/contracts/c1/agreements',
			body: { categoryId: 'k1', agreed: true }
		});
	});

	// #368 (#407 point 3): «Vereinbart ab» a day; without a day it is no answer yet (Fachreview 368-B V-2)
	it('speichert «Vereinbart ab» erst mit dem Tag', async () => {
		const { calls, props } = await agreedCosts((call) =>
			call.method === 'PUT' ? [200, {}] : [200, [anna]]
		);

		expect(byTestId('agreement-c1-k1-from')!.closest('label')!.textContent).toContain('Vereinbart ab');
		click('agreement-c1-k1-from');
		await settle();
		expect(calls.filter((call) => call.method === 'PUT')).toEqual([]);
		expect(props.blocking).toBe(true);

		fireEvent(byTestId<HTMLInputElement>('agreement-c1-k1-from-date')!, 'input', '01.10.2024');
		fireEvent(byTestId<HTMLInputElement>('agreement-c1-k1-from-date')!, 'change', '01.10.2024');
		await settle();

		expect(calls.at(-1)).toMatchObject({
			method: 'PUT',
			path: '/contracts/c1/agreements',
			body: { categoryId: 'k1', agreed: true, from: '2024-10-01' }
		});
		expect(props.blocking).toBe(false);
	});

	it('nennt bei «Vereinbart ab» ohne Tag, was fehlt', async () => {
		await agreedCosts((call) => (call.method === 'PUT' ? [200, {}] : [200, [anna]]), 'Bitte wählen Sie.');

		click('agreement-c1-k1-from');
		await settle();

		expect(byTestId('agreement-c1-k1')!.textContent).toContain(
			'Bitte geben Sie den Tag ein, ab dem diese Nebenkosten vereinbart sind.'
		);
	});

	// #368: the backend refuses a day before the Vertragsbeginn; a failed save still says it was not saved
	it('nennt den Grund, wenn Dwello den Tag «Vereinbart ab» ablehnt', async () => {
		await agreedCosts((call) => (call.method === 'PUT' ? [400, refused] : [200, [anna]]));

		click('agreement-c1-k1-from');
		fireEvent(byTestId<HTMLInputElement>('agreement-c1-k1-from-date')!, 'input', '31.12.2019');
		await settle();

		expect(byTestId('agreement-c1-k1')!.textContent).toContain('Dieser Tag liegt vor dem Vertragsbeginn.');
	});

	it('meldet eine Antwort, die nicht gespeichert wurde, und hält «Weiter» an', async () => {
		const { props } = await agreedCosts((call) =>
			call.method === 'PUT' ? [500, {}] : [200, [anna]]
		);

		click('agreement-c1-k1-yes');
		await settle();

		expect(byTestId('agreement-c1-k1')!.textContent).toContain(
			'Ihre Antwort wurde nicht gespeichert. Bitte versuchen Sie es nochmals.'
		);
		expect(props.blocking).toBe(true);
	});

	// Code-Review W10c C-1: ohne Prüfung entstünden Abrechnungen ohne die neue Kategorie
	it('hält «Weiter» an, wenn die Fragen nicht geladen werden können, und lädt sie erneut', async () => {
		let failing = true;
		const { props } = await agreedCosts(() => (failing ? [500, {}] : [200, []]));

		expect(byTestId('agreements-failed')!.textContent).toContain('Dwello konnte nicht prüfen');
		expect(props.blocking).toBe(true);

		failing = false;
		click(byTestId('agreements-failed')!.querySelector('button')!);
		await settle();

		expect(byTestId('agreements-failed')).toBeNull();
		expect(props.blocking).toBe(false);
	});

	// #439: «Weiter» während der Prüfung bleibt nicht stumm
	it('sagt nach «Weiter» während der Prüfung, worauf der Assistent wartet', async () => {
		globalThis.fetch = (() => new Promise<Response>(() => {})) as typeof fetch;
		show(AgreedCosts, { buildingIds: ['b1'], period, error: 'Weiter ohne Antwort' });
		await settle();

		expect(byTestId('agreements-loading')).not.toBeNull();
		expect(byTestId('agreements-wait')!.textContent).toContain(
			'Dwello geht weiter, sobald die Mietverträge geprüft sind.'
		);
	});
});
