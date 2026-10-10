import { describe, it, expect, vi } from 'vitest';
import { render } from 'svelte/server';

vi.mock('$app/forms', () => ({ enhance: () => ({}) }));

import ContractPage from '../routes/contracts/[id]/+page.svelte';
import RentFields from '../routes/contracts/RentFields.svelte';

// Akonto is monthly_advance_payment, Zusatzmiete is additional_rent (UBIQUITOUS_LANGUAGE.md)
const labelOf = (body: string, id: string) =>
	body.match(new RegExp(`<label[^>]*for="${id}"[^>]*>([\\s\\S]*?)<\\/label>`))![1];

describe('Miete im Mietvertrag', () => {
	it('nennt im Bearbeitungsformular Akonto und Zusatzmiete beim richtigen Feld', () => {
		const props = { baseRent: '950', additionalRent: '', advancePayment: '', errors: {} };
		const body = render(RentFields, { props }).body;
		expect(labelOf(body, 'advancePayment')).toContain('Akonto');
		expect(labelOf(body, 'additionalRent')).toContain('Zusatzmiete');
	});

	it('zeigt auf der Detailseite das Akonto als Akonto', () => {
		const data = {
			contract: {
				id: 'c1',
				startDate: '2024-04-01',
				endDate: null,
				tenant: { id: 't1', firstName: 'Anna', lastName: 'Keller', email: null, phone: null },
				apartment: { id: 'a1', number: '2.01', floor: 2, area: 70, rooms: 3.5 },
				building: {
					id: 'b1',
					name: 'Ahornhof',
					address: 'Ahornweg 1',
					postalCode: '8400',
					city: 'Winterthur'
				}
			},
			rentBreakdown: { baseRent: 950, additionalRent: 50, advancePayment: 180, total: 1180 }
		};
		const body = render(ContractPage, { props: { data, form: null } as never }).body.replace(
			/\s+/g,
			' '
		);
		expect(body).toMatch(/>Akonto<\/span> <span[^>]*>\s*CHF\s180\.00/);
		expect(body).toMatch(/>Zusatzmiete<\/span> <span[^>]*>\s*CHF\s50\.00/);
	});
});
