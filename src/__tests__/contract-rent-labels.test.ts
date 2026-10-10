import { describe, it, expect, vi } from 'vitest';
import { render } from 'svelte/server';

vi.mock('$app/forms', () => ({ enhance: () => ({}) }));

import ContractPage from '../routes/contracts/[id]/+page.svelte';
import MonthlyCostsCard from '$lib/components/MonthlyCostsCard.svelte';

// Akonto is monthly_advance_payment, Zusatzmiete is additional_rent (UBIQUITOUS_LANGUAGE.md); the edit form: contract-edit.dom.test.ts

describe('Miete im Mietvertrag', () => {
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
		expect(body).toMatch(/>Akonto<\/dt> <dd[^>]*>\s*CHF\s180\.00/);
		expect(body).toMatch(/>Zusatzmiete<\/dt> <dd[^>]*>\s*CHF\s50\.00/);
	});

	it('nennt das Akonto auf der Wohnungsseite wie im Glossar', () => {
		const costs = { baseRent: 950, advancePayment: 180, additionalRent: 0, total: 1130 };
		const body = render(MonthlyCostsCard, { props: { costs } as never }).body;
		expect(body).toContain('>Akonto<');
		expect(body).not.toContain('Aconto');
	});
});
