import { describe, it, expect } from 'vitest';
import AgreedCategories from '../routes/contracts/AgreedCategories.svelte';
import { byTestId, click, show } from './helpers/dom';

// #91: the boxes of the agreed Nebenkosten in «Neuer Mietvertrag» and «Mietvertrag bearbeiten»
const categories = [
	{ id: 'c1', name: 'Heizung' },
	{ id: 'c2', name: 'Lift' }
];

function boxes(agreed?: string[], flatRate = false) {
	const bound = { agreed };
	show(AgreedCategories, {
		categories,
		help: 'Hilfe',
		flatRate,
		get agreed() {
			return bound.agreed;
		},
		set agreed(list: string[] | undefined) {
			bound.agreed = list;
		}
	});
	return bound;
}

describe('Vereinbarte Nebenkosten im Mietvertrag', () => {
	it('kreuzt bei einem neuen Mietvertrag alle an und merkt sich, was abgewählt ist', () => {
		const bound = boxes();
		expect(byTestId<HTMLInputElement>('contract-category-c2')!.checked).toBe(true);

		click('contract-category-c2');

		expect(bound.agreed).toEqual(['c1']);
	});

	// Persona Marco W10c P-1: ohne Häkchen rechnet Dwello keine Nebenkosten ab, das soll nicht unbemerkt geschehen
	it('weist darauf hin, wenn keine Nebenkosten vereinbart sind', () => {
		boxes(['c1']);
		expect(byTestId('contract-agreed-costs-none')).toBeNull();
		document.body.innerHTML = '';

		boxes([]);

		expect(byTestId('contract-agreed-costs-none')!.textContent).toContain(
			'Ohne Häkchen rechnet Dwello diesem Mieter keine Nebenkosten ab.'
		);
		// persona Helga 66b P-2: a Nebenkostenpauschale leaves every box empty (#66)
		expect(byTestId('contract-agreed-costs-none')!.textContent).toContain(
			'Bezahlt der Mieter alle Nebenkosten mit einer Nebenkostenpauschale, lassen Sie die Häkchen leer.'
		);
		expect(byTestId('contract-agreed-costs-none')!.className).toContain('bg-caution-soft');
	});

	// persona Helga 429 P-1: with a Nebenkostenpauschale no box is the right choice, so the note does not warn
	it('warnt mit Nebenkostenpauschale nicht, wenn keine Nebenkosten vereinbart sind', () => {
		boxes([], true);

		expect(byTestId('contract-agreed-costs-none')!.className).not.toContain('bg-caution-soft');
	});
});
