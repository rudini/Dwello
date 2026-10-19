import { describe, it, expect, vi } from 'vitest';
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
