import { describe, it, expect } from 'vitest';
import {
	apartmentOption,
	availableFrom,
	agreedNames,
	contractBody,
	initialContractValues,
	overlapWarning,
	suggestedStartDate,
	validateContract,
	type ContractFormValues
} from '../lib/contract-form';
import type { AvailabilityInfo } from '../lib/utils/contract-availability';
import { localToday } from '../lib/contract-status';

const filled: ContractFormValues = {
	tenantId: 't1',
	apartmentId: 'a1',
	startDate: '2025-01-01',
	endDate: '',
	isUnlimited: true,
	baseRent: '950',
	additionalRent: '',
	advancePayment: '',
	managementFee: 'run',
	managementFeeRate: ''
};

const freeFrom = (date: string): AvailabilityInfo => ({
	isAvailable: true,
	availableFrom: date,
	hasOngoingContract: false,
	message: `Verfügbar ab ${date}`,
	statusType: 'available-from'
});

const AMOUNT_HINT = "Bitte geben Sie einen gültigen Betrag ein, zum Beispiel 1450.00 oder 1'450.";

describe('initialContractValues', () => {
	it('starts a new unlimited contract for the tenant and apartment in the URL', () => {
		expect(initialContractValues(undefined, new URLSearchParams('tenant=t1&apartment=a1'))).toEqual(
			{
				...filled,
				startDate: '',
				billedUntil: '',
				baseRent: '',
				flatRateUtilityCharge: '',
				// #89: no default, the landlord chooses
				managementFee: ''
			}
		);
	});

	it('takes over no start from the URL the date check would refuse (#296)', () => {
		const start = (date: string) =>
			initialContractValues(undefined, new URLSearchParams({ start: date })).startDate;
		expect(start('2100-01-01')).toBe('');
		expect(start('2026-04-01')).toBe('2026-04-01');
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
			monthlyAdvancePayment: '120.00',
			managementFeeAgreed: true,
			managementFeePercent: '4.00'
		};
		expect(initialContractValues(contract, new URLSearchParams('tenant=t2'))).toEqual({
			tenantId: 't1',
			apartmentId: 'a1',
			startDate: '2024-04-01',
			endDate: '2026-03-31',
			isUnlimited: false,
			terminated: false,
			billedUntil: '',
			baseRent: '950.00',
			additionalRent: '',
			advancePayment: '120.00',
			savedAdvance: '120.00',
			flatRateUtilityCharge: '',
			managementFee: 'own',
			managementFeeRate: '4.00'
		});
		// #89: an existing contract without agreement, or agreed at the run's rate
		const values = (agreed: boolean) =>
			initialContractValues(
				{ ...contract, managementFeeAgreed: agreed, managementFeePercent: null },
				new URLSearchParams()
			);
		expect(values(false)).toMatchObject({ managementFee: 'none', managementFeeRate: '' });
		expect(values(true)).toMatchObject({ managementFee: 'run', managementFeeRate: '' });
	});
});

describe('validateContract', () => {
	it('accepts a complete contract', () => {
		expect(validateContract(filled)).toEqual({});
	});

	it('requires tenant, apartment, start and base rent', () => {
		expect(
			validateContract({ ...filled, tenantId: '', apartmentId: '', startDate: '', baseRent: '' })
		).toEqual({
			tenantId: 'Bitte wählen Sie einen Mieter aus.',
			apartmentId: 'Bitte wählen Sie eine Wohnung aus.',
			startDate: 'Vertragsbeginn ist erforderlich.',
			baseRent: 'Nettomiete ist erforderlich.'
		});
	});

	it('requires an end after the start for a limited contract', () => {
		expect(validateContract({ ...filled, isUnlimited: false }).endDate).toBe(
			'Bei einem befristeten Mietvertrag ist das Vertragsende erforderlich.'
		);
		expect(validateContract({ ...filled, isUnlimited: false, endDate: '2024-12-31' }).endDate).toBe(
			'Vertragsende muss nach Vertragsbeginn liegen.'
		);
	});

	it('rejects a base rent of zero and negative optional amounts', () => {
		expect(
			validateContract({ ...filled, baseRent: '0', additionalRent: '-1', advancePayment: 'x' })
		).toEqual({
			baseRent: 'Bitte geben Sie eine gültige Miete ein.',
			additionalRent: AMOUNT_HINT,
			advancePayment: AMOUNT_HINT
		});
	});

	// #89: «Verwaltungspauschale vereinbart» has no default; an own rate is greater than 0 up to 10 (#124, #447)
	it('verlangt eine Angabe zur Verwaltungspauschale und einen eigenen Satz grösser als 0 bis 10', () => {
		expect(validateContract({ ...filled, managementFee: '' })).toEqual({
			managementFee: 'Bitte wählen Sie, ob im Mietvertrag eine Verwaltungspauschale vereinbart ist.'
		});
		for (const rate of ['', '10.01', '-1', '2,555', 'x']) {
			expect(
				validateContract({ ...filled, managementFee: 'own', managementFeeRate: rate })
					.managementFeeRate,
				rate
			).toBe(
				'Bitte geben Sie einen Prozentsatz von 0,01 bis 10 mit höchstens zwei Stellen nach dem Komma ein, zum Beispiel 3 oder 2,5.'
			);
		}
		for (const rate of ['0.01', '2,5', '10']) {
			expect(
				validateContract({ ...filled, managementFee: 'own', managementFeeRate: rate }),
				rate
			).toEqual({});
		}
	});

	// #447 (decided in #402, point 2): an own rate of 0 % means «Nein»
	it('lehnt einen eigenen Satz von 0 % mit dem Hinweis auf «Nein» ab', () => {
		for (const rate of ['0', '0,00', '0.0']) {
			expect(
				validateContract({ ...filled, managementFee: 'own', managementFeeRate: rate })
					.managementFeeRate,
				rate
			).toBe(
				'Ein eigener Satz von 0 % heisst: keine Verwaltungspauschale. Wählen Sie dann «Nein».'
			);
		}
	});

	// "1.450" or "1,450.00" must not silently become CHF 1.45
	it('nimmt nur Beträge in Franken und Rappen an', () => {
		for (const amount of ['1.450', '1,450.00', '1.450,50', '12.345', '1e3']) {
			expect(validateContract({ ...filled, baseRent: amount }).baseRent, amount).toBe(AMOUNT_HINT);
		}
		for (const amount of ['1450', '1450.5', '1450.50']) {
			expect(validateContract({ ...filled, baseRent: amount }).baseRent, amount).toBeUndefined();
		}
	});
});

describe('contractBody', () => {
	it('sends amounts as strings, empty optional amounts as 0 and no end for an unlimited contract', () => {
		expect(contractBody({ ...filled, endDate: '2026-01-01', advancePayment: '120' }, [])).toEqual({
			tenantId: 't1',
			apartmentId: 'a1',
			startDate: '2025-01-01',
			endDate: null,
			terminated: false,
			baseRent: '950',
			additionalRent: '0',
			monthlyAdvancePayment: '120',
			flatRateUtilityCharge: '0',
			managementFeeAgreed: true,
			managementFeePercent: null,
			agreedCategoryIds: [],
			agreedFrom: {}
		});
	});

	// #464 (fach review 464-2 V-2): im laufenden Mietvertrag gilt ein neues Akonto frühestens ab dem nächsten Ersten;
	// nur ein geänderter Betrag geht mit seinem «Gültig ab» mit, sonst entstünde bei jedem Speichern ein Eintrag
	const advances = [
		{ validFrom: '2024-04-01', amount: '50.00' },
		{ validFrom: '2024-07-01', amount: '80.00' }
	];
	const edited = (startDate: string, endDate: string | null) =>
		initialContractValues(
			{ ...filled, id: 'c1', startDate, endDate, monthlyAdvancePayment: '80.00', advancePayments: advances } as never,
			new URLSearchParams()
		);
	it('schlägt im laufenden Mietvertrag den nächsten Ersten als «Gültig ab» vor', () => {
		const [year, month] = localToday().split('-').map(Number);
		const next = new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10);

		expect(edited('2024-04-01', null).advancePaymentFrom).toBe(next);
	});

	it('schlägt beim künftigen Mietvertrag den Vertragsbeginn, beim beendeten den Tag des letzten Betrags vor', () => {
		expect(edited('2099-01-01', null).advancePaymentFrom).toBe('2099-01-01');
		expect(edited('2024-04-01', '2025-03-31').advancePaymentFrom).toBe('2024-07-01');
	});

	it('sendet Akonto und «Gültig ab» nur, wenn sich der Betrag geändert hat', () => {
		const values = edited('2024-04-01', null);

		expect(contractBody(values, [])).not.toHaveProperty('monthlyAdvancePayment');
		expect(contractBody({ ...values, advancePaymentFrom: '2030-01-01' }, [])).not.toHaveProperty('advancePaymentFrom');
		expect(contractBody({ ...values, advancePayment: '90' }, [])).toMatchObject({
			monthlyAdvancePayment: '90',
			advancePaymentFrom: values.advancePaymentFrom
		});
		expect(contractBody(filled, [])).not.toHaveProperty('advancePaymentFrom');
	});

	// review 464-1 C-2: ein leeres oder falsch getipptes «Gültig ab» ändert nicht still den ersten Betrag
	it('verlangt ein «Gültig ab», wenn sich das Akonto ändert', () => {
		const values = { ...edited('2024-04-01', null), advancePayment: '90' };

		expect(validateContract({ ...values, advancePaymentFrom: '' }).advancePaymentFrom).toBe(
			'Geben Sie an, ab welchem Tag das neue Akonto gilt, zum Beispiel den Ersten des nächsten Monats.'
		);
		expect(validateContract({ ...values, advancePayment: '80.00', advancePaymentFrom: '' })).not.toHaveProperty('advancePaymentFrom');
	});

	// #429: die Nebenkostenpauschale geht mit, leer als 0, und kommt beim Bearbeiten zurück ins Formular
	it('sendet die Nebenkostenpauschale und liest sie beim Bearbeiten', () => {
		expect(contractBody({ ...filled, flatRateUtilityCharge: '120' }, []).flatRateUtilityCharge).toBe('120');
		const contract = { ...filled, id: 'c1', monthlyAdvancePayment: '0', flatRateUtilityCharge: '120.00' };
		expect(initialContractValues(contract as never, new URLSearchParams()).flatRateUtilityCharge).toBe('120.00');
	});

	// #133: only the edit form has «Abgerechnet bis»; emptied, it is forgotten
	it('sendet «Abgerechnet bis» beim Bearbeiten, leer als kein Datum', () => {
		expect(contractBody({ ...filled, billedUntil: '2024-12-31' }, []).billedUntil).toBe('2024-12-31');
		expect(contractBody({ ...filled, billedUntil: '' }, []).billedUntil).toBeNull();
		expect(contractBody(filled, [])).not.toHaveProperty('billedUntil');
		const contract = { ...filled, id: 'c1', billedUntil: '2024-12-31', monthlyAdvancePayment: '0' };
		expect(initialContractValues(contract as never, new URLSearchParams()).billedUntil).toBe(
			'2024-12-31'
		);
	});

	// #91, #522: what the boxes show is what Dwello bills; without a click every box is ticked, and a category the
	// form does not list is neither agreed nor kept
	it('sendet genau die angezeigten und angekreuzten Nebenkosten', () => {
		const shown = [{ id: 'c1' }, { id: 'c2' }];
		expect(contractBody(filled, shown).agreedCategoryIds).toEqual(['c1', 'c2']);
		expect(
			contractBody({ ...filled, agreedCategoryIds: ['c2', 'hidden'] }, shown).agreedCategoryIds
		).toEqual(['c2']);
		expect(contractBody({ ...filled, agreedCategoryIds: [] }, shown).agreedCategoryIds).toEqual([]);
	});

	// #368: the contract page and the wizard's review name the day (Fachreview 368-B)
	it('nennt bei den vereinbarten Nebenkosten den Tag «Vereinbart ab»', () => {
		const categories = [{ id: 'c1', name: 'Heizung' }, { id: 'c2', name: 'Lift' }];
		expect(agreedNames(['c1', 'c2'], categories, { c2: '2025-10-01' })).toEqual(['Heizung', 'Lift (ab 01.10.2025)']);
	});

	// #368: «Vereinbart ab» only of a ticked category with a day; the form sends every day it shows
	it('sendet «Vereinbart ab» der angekreuzten Nebenkosten mit einem Tag', () => {
		const shown = [{ id: 'c1' }, { id: 'c2' }];
		const values = { ...filled, agreedCategoryIds: ['c1'], agreedFrom: { c1: '2025-10-01', c2: '2025-11-01' } };
		expect(contractBody(values, shown).agreedFrom).toEqual({ c1: '2025-10-01' });
		expect(contractBody({ ...filled, agreedFrom: { c1: '' } }, shown).agreedFrom).toEqual({});
		const contract = { ...filled, id: 'c1', monthlyAdvancePayment: '0', agreedFrom: { c1: '2025-10-01' } };
		expect(initialContractValues(contract as never, new URLSearchParams()).agreedFrom).toEqual({ c1: '2025-10-01' });
	});

		it('sendet die Verwaltungspauschale: vereinbart mit eigenem Satz, zum Satz des Laufs oder nicht', () => {
		const fee = (values: Partial<ContractFormValues>) => {
			const { managementFeeAgreed, managementFeePercent } = contractBody({ ...filled, ...values }, []);
			return { managementFeeAgreed, managementFeePercent };
		};
		expect(fee({ managementFee: 'own', managementFeeRate: '2,5' })).toEqual({
			managementFeeAgreed: true,
			managementFeePercent: '2.5'
		});
		expect(fee({ managementFee: 'none', managementFeeRate: '2,5' })).toEqual({
			managementFeeAgreed: false,
			managementFeePercent: null
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
		expect(apartmentOption(apartment, rented, false)).toEqual({
			label: 'Wohnung 2.01 - Ahornhof (nicht verfügbar)',
			disabled: true
		});
		expect(apartmentOption(apartment, rented, true)).toEqual({
			label: 'Wohnung 2.01 - Ahornhof (aktuell)',
			disabled: false
		});
	});

	it('names the day an apartment becomes free', () => {
		expect(apartmentOption(apartment, freeFrom('2025-04-01'), false).label).toBe(
			'Wohnung 2.01 - Ahornhof (verfügbar ab 01.04.2025)'
		);
		expect(apartmentOption(apartment, undefined, false).label).toBe('Wohnung 2.01 - Ahornhof');
	});

	// Dr. Weber #151 W-01: an apartment whose contracts could not be loaded does not look free in the choice
	it('marks an apartment whose contracts could not be loaded', () => {
		expect(apartmentOption(apartment, null, false)).toEqual({
			label: 'Wohnung 2.01 - Ahornhof (nicht geprüft)',
			disabled: false
		});
	});
});

describe('availableFrom', () => {
	it('limits the start to the day the chosen apartment becomes free', () => {
		expect(availableFrom(freeFrom('2025-04-01'))).toEqual({
			min: '2025-04-01',
			notice: 'Verfügbar ab 2025-04-01'
		});
	});
});

describe('suggestedStartDate', () => {
	it('suggests the day the apartment becomes free for a new contract without start', () => {
		expect(suggestedStartDate('', freeFrom('2025-04-01'))).toBe('2025-04-01');
		expect(suggestedStartDate('2025-05-01', freeFrom('2025-04-01'))).toBeNull();
	});

	it('suggests nothing the date check would refuse (#296)', () => {
		expect(suggestedStartDate('', freeFrom('2100-01-01'))).toBeNull();
	});
});
