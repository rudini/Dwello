import { afterEach, describe, expect, it } from 'vitest';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import {
	apartmentOption,
	impossibleYear,
	validateContract,
	type ContractFormValues
} from '$lib/contract-form';
import {
	advancePaymentNotice,
	contractSteps,
	contractSummary,
	startDateNotice
} from '$lib/contract-wizard';
import { load as newContractLoad } from '../routes/contracts/new/+page.server';

afterEach(() => overwriteGetLocale(() => baseLocale));

const empty: ContractFormValues = {
	tenantId: '',
	apartmentId: '',
	startDate: '',
	endDate: '',
	isUnlimited: false,
	baseRent: '',
	additionalRent: '',
	advancePayment: '',
	managementFee: '',
	managementFeeRate: ''
};

describe('Mietverträge in der gewählten Sprache', () => {
	it('nennt die Schritte des Mietvertrags auf Französisch wie die Hilfe', () => {
		overwriteGetLocale(() => 'fr');
		expect(contractSteps.map((step) => step.label)).toEqual([
			'Locataire',
			'Appartement',
			'Durée du contrat',
			'Loyer',
			'Vérification'
		]);
	});

	it('meldet fehlende Angaben auf Italienisch', () => {
		overwriteGetLocale(() => 'it');
		const errors = validateContract({ ...empty, baseRent: '1,450' });
		expect(errors.tenantId).toBe('Scelga un inquilino.');
		expect(errors.endDate).toBe(
			'La fine del contratto è obbligatoria per un contratto di locazione a tempo determinato.'
		);
		expect(errors.baseRent).toBe("Inserisca un importo valido, per esempio 1450.00 o 1'450.");
		expect(impossibleYear()).toBe('Verifichi la data: l’anno non è possibile.');
	});

	it('beschreibt Wohnung und Mietvertrag auf Englisch', () => {
		overwriteGetLocale(() => 'en');
		expect(apartmentOption({ unit: '2.02', building: 'Musterhaus' }, undefined, true).label).toBe(
			'Apartment 2.02 - Musterhaus (current)'
		);
		const summary = contractSummary(
			{ ...empty, apartmentId: 'a1', isUnlimited: true, startDate: '2027-01-01' },
			[],
			[{ id: 'a1', unit: '2.02', building: 'Musterhaus' }]
		);
		expect(summary.map((item) => item.label)).toContain('Net rent');
		expect(summary.find((item) => item.field === 'apartment')?.value).toBe(
			'Apartment 2.02 - Musterhaus'
		);
		expect(summary.find((item) => item.field === 'duration')?.value).toBe('Open-ended');
		expect(advancePaymentNotice(empty)).toMatch(/^Without an advance payment/);
		expect(startDateNotice('2020-01-01', '2026-01-01')).toBe(
			'The contract start Wednesday, 1 January 2020 is in the past. Is the date correct?'
		);
	});

	it('nennt Zimmer und Gebäude der Wohnungen im neuen Mietvertrag auf Französisch', async () => {
		overwriteGetLocale(() => 'fr');
		const apartment = { id: 'a1', number: '1', rooms: '1', area: '40', status: 'vacant' };
		const fetch = (async (url: string) =>
			Response.json(
				url.includes('tenants') ? { tenants: [] } : { apartments: [apartment] }
			)) as typeof globalThis.fetch;
		const data = (await newContractLoad({ fetch } as never)) as {
			apartments: { size: string; building: string }[];
		};
		expect(data.apartments[0]).toMatchObject({ size: '1 pièce, 40 m²', building: 'Inconnu' });
	});
});
