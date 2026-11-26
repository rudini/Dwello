import { describe, it, expect, vi } from 'vitest';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import { flushSync } from 'svelte';
import { get } from 'svelte/store';
import type { SubmitFunction } from '@sveltejs/kit';

let submit: SubmitFunction;
vi.mock('$app/forms', () => ({
	enhance: (_form: HTMLFormElement, run: SubmitFunction) => {
		submit = run;
		return { destroy() {} };
	}
}));

import { toasts } from '$lib/stores';
import BuildingForm from '../routes/buildings/BuildingForm.svelte';
import { byTestId, click, fakeBff, fireEvent, settle, show } from './helpers/dom';

// What the form does once the server has saved the building and opens it
async function saved() {
	const after = submit({} as never) as (opts: unknown) => Promise<void>;
	await after({ result: { type: 'redirect', location: '/buildings/b1' }, update: vi.fn() });
}

describe('Gebäude speichern', () => {
	it('bestätigt das Erfassen mit dem Namen des Gebäudes', async () => {
		show(BuildingForm, { mode: 'create' as const, errors: {}, cancelHref: '/buildings' });
		fireEvent(byTestId<HTMLInputElement>('building-name-input')!, 'input', 'Rosengarten');
		await saved();
		expect(get(toasts).map((toast) => toast.message)).toContain('Gebäude «Rosengarten» gespeichert');
	});

	it('zeigt beim Speichern, dass gearbeitet wird', () => {
		show(BuildingForm, {
			mode: 'edit' as const,
			initial: { name: 'Eichenhof' },
			errors: {},
			cancelHref: '/buildings/b1'
		});
		submit({} as never);
		flushSync();
		const button = byTestId('building-form-submit')!;
		expect(button.textContent).toContain('Wird gespeichert');
	});
});

// #1480 (Fachreview 1480-1 V-4, Code-Review 1480-1 C-2): the help at «Kein Tank oder Tank stillgelegt» says what counts
// after a switch to pellets or wood, in every language
describe('Gebäude ohne Tank', () => {
	it.each([
		['de', 'Für Gebäude mit Fernwärme, Erdgas aus der Leitung oder Wärmepumpe, oder wenn der Tank oder das Lager für Heizmaterial stillgelegt ist. Beim Erstellen der Abrechnungen fragt Dwello dann nicht mehr nach dem Tankbestand. Im Jahr der Stilllegung erfassen Sie zuerst auf der Seite des Gebäudes den Endbestand am letzten Tag der Abrechnungsperiode, auch wenn er 0 ist, und setzen dann das Häkchen. Bezieht das Gebäude danach Heizmaterial, zum Beispiel Pellets oder Holz aus einem Lager, zählt jede Lieferung über die ganze Abrechnungsperiode ihres Liefertags; abgerechnet wird der Einkauf.'],
		['fr', 'Pour les immeubles chauffés à distance, au gaz naturel du réseau ou par pompe à chaleur, ou si la citerne ou le dépôt de combustible est désaffecté. Lors de l’établissement des décomptes, Dwello ne demande alors plus le stock de combustible. L’année de la désaffectation, saisissez d’abord sur la page de l’immeuble le stock final au dernier jour de la période de décompte, même s’il est de 0, puis cochez la case. Si l’immeuble reçoit ensuite du combustible, par exemple des pellets ou du bois d’un dépôt, chaque livraison compte pour toute la période de décompte de son jour de livraison ; ce sont les achats qui sont décomptés.'],
		['it', 'Per immobili con teleriscaldamento, gas naturale di rete o pompa di calore, o se il serbatoio o il deposito di combustibile è dismesso. Quando allestisce i conteggi, Dwello non chiede quindi più la scorta di combustibile. Nell’anno della dismissione registri prima nella pagina dell’immobile la scorta finale all’ultimo giorno del periodo di conteggio, anche se è 0, e poi metta la spunta. Se in seguito l’immobile riceve combustibile, per esempio pellet o legna da un deposito, ogni fornitura conta per l’intero periodo di conteggio del suo giorno di fornitura; si conteggiano gli acquisti.'],
		['en', 'For buildings with district heating, mains gas or a heat pump, or when the tank or fuel store is decommissioned. When you create statements, Dwello then no longer asks for the fuel stock. In the year of decommissioning, first add the closing stock on the last day of the billing period on the building’s page, even if it is 0, and then tick the box. If the building then receives fuel, for example pellets or wood from a store, each delivery counts for the whole billing period of its delivery day; the purchase is billed.']
	] as const)('erklärt auf %s, wann das Gebäude ohne Tank ist und was danach für eine Lieferung gilt', (locale, help) => {
		overwriteGetLocale(() => locale);
		try {
			show(BuildingForm, { mode: 'create' as const, errors: {}, cancelHref: '/buildings' });
			expect(document.body.textContent).toContain(help);
		} finally {
			overwriteGetLocale(() => baseLocale);
		}
	});
});

// The Gebäuderegister in «Neues Gebäude» (#479); the BFF answers instead of the register
describe('Adresssuche im Gebäuderegister', () => {
	const hit = (street: string, egid: string) => ({
		egid,
		street,
		postalCode: '8400',
		city: 'Winterthur',
		canton: 'ZH'
	});
	const registers: Record<string, unknown> = {
		'/addresses/1': { buildingType: 'Mehrfamilienhaus', yearBuilt: 1965, apartments: [] },
		'/addresses/2': { buildingType: null, yearBuilt: null, apartments: [] }
	};
	const bff = (hits: unknown[]) =>
		fakeBff((call) =>
			call.path.startsWith('/addresses?')
				? [200, hits]
				: call.path.startsWith('/buildings')
					? [200, { buildings: [] }]
					: [200, registers[call.path]]
		);
	const search = async (text: string) => {
		fireEvent(byTestId<HTMLInputElement>('building-address-search-input')!, 'input', text);
		await new Promise((resolve) => setTimeout(resolve, 350)); // the search waits for a pause in typing
		await settle();
	};
	const choose = async () => {
		byTestId('building-address-result-0')!.dispatchEvent(new Event('mousedown', { bubbles: true }));
		await settle();
	};
	const value = (testid: string) => byTestId<HTMLInputElement>(testid)!.value;
	const create = () =>
		show(BuildingForm, { mode: 'create' as const, errors: {}, cancelHref: '/buildings' });

	it('sagt die Hinweise zum Gebäuderegister an, sobald sie erscheinen', async () => {
		bff([]);
		create();
		expect(byTestId('building-register-notice')!.getAttribute('aria-live')).toBe('polite');

		await search('Nirgendweg 3');

		expect(byTestId('building-register-notice')!.textContent).toContain('Keine Adresse gefunden.');
	});

	it('nimmt den Hinweis zurück, wenn die Suche geleert wird', async () => {
		bff([]);
		create();
		await search('Nirgendweg 3');

		click(document.querySelector<HTMLElement>('[aria-label="Suche löschen"]')!);

		expect(byTestId('building-register-notice')!.textContent?.trim()).toBe('');
		expect(document.activeElement).toBe(byTestId('building-address-search-input'));
	});

	it('ersetzt beim Wechsel der Adresse, was die erste vorgeschlagen hat', async () => {
		create();
		bff([hit('Lindenweg 155', '1')]);
		await search('Lindenweg 155');
		await choose();
		bff([hit('Ahornweg 1', '2')]);
		await search('Ahornweg 1');
		await choose();

		expect(value('building-name-input')).toBe('Ahornweg 1');
		expect(value('building-type-select')).toBe('');
		expect(value('building-year-built-input')).toBe('');
	});

	// personas Helga, Marco, Anna, Sven, Dr. Weber on #479
	it('nennt bei der Fläche einer Wohnung aus dem Register die Einheit', async () => {
		create();
		registers['/addresses/3'] = {
			buildingType: null,
			yearBuilt: null,
			apartments: [{ number: '101', floor: 1, area: '72', rooms: '3', missing: [] }]
		};
		bff([hit('Lindenweg 155', '3')]);
		await search('Lindenweg 155');
		await choose();

		expect(document.querySelector('label[for="apartments-0-area"]')!.textContent).toContain(
			'Fläche (m²)'
		);
	});

	it('behält, was der Liegenschaftsverwalter selbst eingetragen hat', async () => {
		create();
		fireEvent(byTestId<HTMLInputElement>('building-name-input')!, 'input', 'Lindenhof');
		bff([hit('Lindenweg 155', '1')]);
		await search('Lindenweg 155');
		await choose();

		expect(value('building-name-input')).toBe('Lindenhof');
		expect(value('building-type-select')).toBe('Mehrfamilienhaus');
	});
});
