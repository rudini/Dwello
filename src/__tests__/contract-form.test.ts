import { describe, it, expect } from 'vitest';
import {
	apartmentOption,
	availableFrom,
	contractBody,
	fieldBorder,
	initialContractValues,
	overlapWarning,
	saveErrorMessage,
	suggestedStartDate,
	validateContract,
	type ContractFormValues
} from '../lib/contract-form';
import type { AvailabilityInfo } from '../lib/utils/contract-availability';

const filled: ContractFormValues = {
	tenantId: 't1',
	apartmentId: 'a1',
	startDate: '2025-01-01',
	endDate: '',
	isUnlimited: true,
	baseRent: '950',
	additionalRent: '',
	advancePayment: ''
};

const freeFrom = (date: string): AvailabilityInfo => ({
	isAvailable: true,
	availableFrom: date,
	hasOngoingContract: false,
	message: `Verfügbar ab ${date}`,
	statusType: 'available-from'
});

describe('initialContractValues', () => {
	it('starts a new unlimited contract for the tenant and apartment in the URL', () => {
		expect(initialContractValues(undefined, new URLSearchParams('tenant=t1&apartment=a1'))).toEqual({
			...filled,
			startDate: '',
			baseRent: ''
		});
	});

	it('takes the values of the contract being edited', () => {
		const contract = {
			id: 'c1',
			tenantId: 't1',
			apartmentId: 'a1',
			startDate: '2024-04-01',
			endDate: '2026-03-31',
			baseRent: '950.00',
			additionalRent: null,
			monthlyAdvancePayment: '120.00'
		};
		expect(initialContractValues(contract, new URLSearchParams('tenant=t2'))).toEqual({
			tenantId: 't1',
			apartmentId: 'a1',
			startDate: '2024-04-01',
			endDate: '2026-03-31',
			isUnlimited: false,
			baseRent: '950.00',
			additionalRent: '',
			advancePayment: '120.00'
		});
	});
});

describe('validateContract', () => {
	it('accepts a complete contract', () => {
		expect(validateContract(filled)).toEqual({});
	});

	it('requires tenant, apartment, start and base rent', () => {
		expect(validateContract({ ...filled, tenantId: '', apartmentId: '', startDate: '', baseRent: '' })).toEqual({
			tenantId: 'Bitte wählen Sie einen Mieter aus',
			apartmentId: 'Bitte wählen Sie eine Wohnung aus',
			startDate: 'Vertragsbeginn ist erforderlich',
			baseRent: 'Nettomiete ist erforderlich'
		});
	});

	it('requires an end after the start for a limited contract', () => {
		expect(validateContract({ ...filled, isUnlimited: false }).endDate).toBe(
			'Vertragsende ist erforderlich bei befristetem Vertrag'
		);
		expect(validateContract({ ...filled, isUnlimited: false, endDate: '2024-12-31' }).endDate).toBe(
			'Vertragsende muss nach Vertragsbeginn liegen'
		);
	});

	it('rejects a base rent of zero and negative optional amounts', () => {
		expect(validateContract({ ...filled, baseRent: '0', additionalRent: '-1', advancePayment: 'x' })).toEqual({
			baseRent: 'Bitte geben Sie eine gültige Miete ein',
			additionalRent: 'Bitte geben Sie einen gültigen Betrag ein',
			advancePayment: 'Bitte geben Sie einen gültigen Betrag ein'
		});
	});
});

describe('contractBody', () => {
	it('sends amounts as strings, empty optional amounts as 0 and no end for an unlimited contract', () => {
		expect(contractBody({ ...filled, endDate: '2026-01-01', advancePayment: '120' })).toEqual({
			tenantId: 't1',
			apartmentId: 'a1',
			startDate: '2025-01-01',
			endDate: null,
			baseRent: '950',
			additionalRent: '0',
			monthlyAdvancePayment: '120'
		});
	});
});

describe('overlapWarning', () => {
	const running = [{ id: 'c1', start_date: '2024-01-01', end_date: null }];

	it('warns when the contract overlaps another contract of the apartment', () => {
		expect(overlapWarning(filled, running)).toEqual(expect.any(String));
	});

	it('ignores the contract being edited and apartments without contracts', () => {
		expect(overlapWarning(filled, running, 'c1')).toBeNull();
		expect(overlapWarning(filled, [])).toBeNull();
	});
});

describe('apartmentOption', () => {
	const apartment = { unit: '2.01', building: 'Ahornhof' };
	const rented = { ...freeFrom('2025-01-01'), hasOngoingContract: true };

	it('blocks rented apartments except the one of the contract being edited', () => {
		expect(apartmentOption(apartment, rented, false)).toEqual({ label: 'Wohnung 2.01 - Ahornhof (nicht verfügbar)', disabled: true });
		expect(apartmentOption(apartment, rented, true)).toEqual({ label: 'Wohnung 2.01 - Ahornhof (aktuell)', disabled: false });
	});

	it('names the day an apartment becomes free', () => {
		expect(apartmentOption(apartment, freeFrom('2025-04-01'), false).label).toBe(
			'Wohnung 2.01 - Ahornhof (verfügbar ab 2025-04-01)'
		);
		expect(apartmentOption(apartment, undefined, false).label).toBe('Wohnung 2.01 - Ahornhof');
	});
});

describe('availableFrom', () => {
	it('limits the start to the day the chosen apartment becomes free', () => {
		expect(availableFrom(freeFrom('2025-04-01'), true)).toEqual({ min: '2025-04-01', notice: 'Verfügbar ab 2025-04-01' });
	});

	it('does not limit the edited contract on its own apartment', () => {
		expect(availableFrom(freeFrom('2025-04-01'), false)).toEqual({ min: undefined, notice: null });
	});
});

describe('suggestedStartDate', () => {
	it('suggests the day the apartment becomes free for a new contract without start', () => {
		expect(suggestedStartDate(true, '', freeFrom('2025-04-01'))).toBe('2025-04-01');
		expect(suggestedStartDate(true, '2025-05-01', freeFrom('2025-04-01'))).toBeNull();
		expect(suggestedStartDate(false, '', freeFrom('2025-04-01'))).toBeNull();
	});
});

describe('fieldBorder', () => {
	it('marks fields with an error red', () => {
		expect(fieldBorder('Pflichtfeld')).toBe('border-red-500');
		expect(fieldBorder(undefined)).toBe('border-gray-300');
	});
});

describe('saveErrorMessage', () => {
	it('shows the reason of a failed save, or a general message', () => {
		expect(saveErrorMessage(new Error('Wohnung ist bereits vermietet'))).toBe('Wohnung ist bereits vermietet');
		expect(saveErrorMessage(new Error(''))).toBe('Ein Fehler ist aufgetreten');
		expect(saveErrorMessage('offline')).toBe('Ein Fehler ist aufgetreten');
	});
});
