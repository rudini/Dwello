import { describe, it, expect } from 'vitest';
import FilterSelect from '$lib/components/FilterSelect.svelte';
import SearchField from '$lib/components/SearchField.svelte';
import { byTestId, show } from './helpers/dom';
import { hydrateAs, serverRender } from './helpers/hydrate';

const buildings = {
	id: 'building',
	label: 'Gebäude',
	allLabel: 'Alle Gebäude',
	options: [
		{ value: 'b1', label: 'Ahornhof' },
		{ value: 'b2', label: 'Birkenhof' }
	],
	value: '',
	testid: 'building-filter'
};

describe('Filter vor der Hydration', () => {
	it('behält ein Gebäude, das vor der Hydration gewählt wurde', async () => {
		await serverRender('lib/components/FilterSelect.svelte', { ...buildings, onchange: () => {} });
		byTestId<HTMLSelectElement>('building-filter')!.value = 'b2';

		let chosen = '';
		hydrateAs(FilterSelect, { ...buildings, onchange: (value: string) => (chosen = value) });

		expect(byTestId<HTMLSelectElement>('building-filter')!.value).toBe('b2');
		expect(chosen).toBe('b2');
	});

	it('behält einen Suchbegriff, der vor der Hydration getippt wurde', async () => {
		const props = { value: '', placeholder: 'Suche', testid: 'search' };
		await serverRender('lib/components/SearchField.svelte', props);
		byTestId<HTMLInputElement>('search')!.value = 'Ahorn';

		let searched = '';
		hydrateAs(SearchField, {
			...props,
			get value() {
				return searched;
			},
			set value(value: string) {
				searched = value;
			}
		});

		expect(byTestId<HTMLInputElement>('search')!.value).toBe('Ahorn');
		expect(searched).toBe('Ahorn');
	});

	it('übernimmt beim Anzeigen ohne Hydration die vorgegebene Auswahl', () => {
		const chosen: string[] = [];
		show(FilterSelect, {
			...buildings,
			value: 'b2',
			onchange: (value: string) => chosen.push(value)
		});

		expect(byTestId<HTMLSelectElement>('building-filter')!.value).toBe('b2');
		expect(chosen.every((value) => value === 'b2')).toBe(true);
	});
});
