import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import TenantContactCard from '../routes/tenants/[id]/TenantContactCard.svelte';
import ContractDetailPage from '../routes/contracts/[id]/+page.svelte';

const tenant = { id: 't1', firstName: 'Anna', lastName: 'Keller', language: 'de' as const };

const contractPage = (email: string | null) =>
	render(ContractDetailPage, {
		props: {
			data: {
				missingStatements: [],
				contract: {
					id: 'c1',
					apartmentId: 'a1',
					tenantId: 't1',
					startDate: '2024-04-01',
					endDate: null,
					tenant: { ...tenant, email },
					apartment: { id: 'a1', number: '2.01', floor: '2', area: 70, rooms: 3.5 },
					building: {
						id: 'b1',
						name: 'Ahornhof',
						address: 'Testweg 1',
						postalCode: '8400',
						city: 'Winterthur'
					}
				},
				rentBreakdown: { baseRent: 950, additionalRent: 0, advancePayment: 150, total: 1100 }
			},
			form: null
		} as never
	}).body;

describe('E-Mail-Link zum Mieter', () => {
	it('fehlt im Mieterdetail, wenn der Mieter keine E-Mail-Adresse hat', () => {
		const { body } = render(TenantContactCard, { props: { tenant: { ...tenant, email: null } } });

		expect(body).not.toContain('mailto:');
	});

	it('führt im Mieterdetail zur E-Mail-Adresse des Mieters', () => {
		const { body } = render(TenantContactCard, {
			props: { tenant: { ...tenant, email: 'anna@example.ch' } }
		});

		expect(body).toContain('href="mailto:anna@example.ch"');
	});

	it('fehlt im Mietvertrag, wenn der Mieter keine E-Mail-Adresse hat', () => {
		expect(contractPage(null)).not.toContain('mailto:');
	});

	it('führt im Mietvertrag zur E-Mail-Adresse des Mieters', () => {
		expect(contractPage('anna@example.ch')).toContain('href="mailto:anna@example.ch"');
	});
});
