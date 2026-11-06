import { describe, it, expect } from 'vitest';
import {
	apartmentOption,
	availableFrom,
	agreedNames,
	contractBody,
	initialContractValues,
	forAvailability,
	overlapError,
	overlapRefusal,
	suggestedStartDate,
	validateContract,
	type ContractFormValues
} from '../lib/contract-form';
import type { AvailabilityInfo } from '../lib/utils/contract-availability';
import overlap from '../../tests/contracts/contract-overlap.json';

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
			status: 'ended' as const,
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
			{
				...filled,
				id: 'c1',
				startDate,
				endDate,
				monthlyAdvancePayment: '80.00',
				advancePayments: advances,
				proposedAdvanceFrom: '2031-05-01'
			} as never,
			new URLSearchParams()
		);
	// #815: the backend proposes «Gültig ab» by the Swiss day (backend advance-proposal.test.ts); the form takes it
	it('schlägt das «Gültig ab» des Backends vor', () => {
		expect(edited('2024-04-01', null).advancePaymentFrom).toBe('2031-05-01');
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

describe('overlapError', () => {
	const running = [{ id: 'c1', start_date: '2024-01-01', end_date: null }];

	it('warns when the contract overlaps another contract of the apartment', () => {
		expect(overlapError(filled, running, false)).toMatchObject({ field: 'startDate' });
	});

	it('ignores the contract being edited and apartments without contracts', () => {
		expect(overlapError(filled, running, false, 'c1')).toBeNull();
		expect(overlapError(filled, [], false)).toBeNull();
	});
});

// #667 (Dr. Weber W-04, W-07): the refusal names the other contract and advises what fits it (fach review b667)
describe('overlapRefusal', () => {
	const { end: _, ...ended } = overlap.params;
	const openEnded = { ...ended, status: 'active' }; // «seit» or «ab», as the backend says by the Swiss day
	const refused = (params: Record<string, string | number>) => ({ ...overlap, params });
	const start2025 = { ...filled, startDate: '2025-06-01' };
	const fixedTerm = { ...start2025, isUnlimited: false, endDate: '2028-12-31' };
	const later = refused({ ...openEnded, start: '2027-04-01', status: 'future' });
	const textOf = (...args: Parameters<typeof overlapRefusal>) => overlapRefusal(...args)?.text;

	it('rät nach einem früheren, befristeten Mietvertrag, den Vertragsbeginn und dann dessen Vertragsende zu prüfen', () => {
		expect(textOf(overlap, start2025, true)).toBe(
			'Der Zeitraum überschneidet sich mit dem Mietvertrag von Anna Keller (01.01.2024 – 31.12.2024, befristet). Der Vertragsbeginn muss nach dem 31.12.2024 liegen. Prüfen Sie ihn im unterschriebenen Mietvertrag. Stimmt er, prüfen Sie das Vertragsende des anderen Mietvertrags.'
		);
	});

	it('nennt einen gekündigten Mietvertrag gekündigt', () => {
		expect(textOf(refused({ ...overlap.params, terminated: 1 }), start2025, true)).toContain(
			'(01.01.2024 – 31.12.2024, gekündigt)'
		);
	});

	it('rät im Assistenten nach einem früheren Mietvertrag ohne Vertragsende zu dessen Vertragsende oder einer anderen Wohnung', () => {
		expect(textOf(refused(openEnded), start2025, true)).toBe(
			'Der Zeitraum überschneidet sich mit dem Mietvertrag von Anna Keller (seit 01.01.2024, unbefristet). Endet der andere Mietvertrag vor dem 01.06.2025, weil er gekündigt oder ein Vertragsende vereinbart ist, tragen Sie das Vertragsende zuerst auf seiner Seite mit «Enddatum erfassen» ein. Sonst wählen Sie eine andere Wohnung.'
		);
	});

	// fach review b667 M-2: the apartment of a saved contract is fixed
	it('rät beim Bearbeiten statt zu einer anderen Wohnung, den Vertragsbeginn zu prüfen', () => {
		expect(textOf(refused(openEnded), start2025, false)).toMatch(
			/Sonst prüfen Sie den Vertragsbeginn im unterschriebenen Mietvertrag\.$/
		);
	});

	// fach review b667 V-2 (code review b667 C-3)
	it('rät bei einem Mietvertrag ohne Vertragsende, der am selben Tag beginnt, beide Mietverträge zu prüfen', () => {
		expect(textOf(refused({ ...openEnded, start: '2025-06-01' }), start2025, true)).toMatch(
			/\. Der andere Mietvertrag beginnt am selben Tag und hat kein Vertragsende\. Prüfen Sie den Vertragsbeginn im unterschriebenen Mietvertrag\. Stimmt er, prüfen Sie den anderen Mietvertrag und korrigieren Sie ihn, wenn er falsch erfasst ist\.$/
		);
	});

	// fach review b667 M-1: «Befristet» only when the signed lease agrees an end
	it('rät im Assistenten bei «Unbefristet» vor einem späteren Mietvertrag nur bei vereinbartem Vertragsende zu «Befristet»', () => {
		expect(textOf(later, start2025, true)).toBe(
			'Der Zeitraum überschneidet sich mit dem Mietvertrag von Anna Keller (ab 01.04.2027, unbefristet). Ist im unterschriebenen Mietvertrag ein Vertragsende vor dem 01.04.2027 vereinbart, wählen Sie «Befristet» mit diesem Vertragsende. Sonst prüfen Sie den Vertragsbeginn des anderen Mietvertrags.'
		);
	});

	it('rät beim Bearbeiten und bei «Befristet» vor einem späteren Mietvertrag, das Vertragsende zu prüfen', () => {
		const advice =
			/\. Das Vertragsende muss vor dem 01\.04\.2027 liegen\. Prüfen Sie es im unterschriebenen Mietvertrag oder in der Kündigung\. Stimmt es, prüfen Sie den Vertragsbeginn des anderen Mietvertrags\.$/;
		expect(textOf(later, start2025, false)).toMatch(advice);
		expect(textOf(later, fixedTerm, true)).toMatch(advice);
	});

	// fach review b667 V-3 (Dr. Weber b667 P-2): the advice about the Vertragsende stands at «Vertragsende»
	it('nennt das Feld, um das es im Rat geht', () => {
		expect(overlapRefusal(later, fixedTerm, true)?.field).toBe('endDate');
		expect(overlapRefusal(later, start2025, true)?.field).toBe('startDate');
		expect(overlapRefusal(overlap, fixedTerm, true)?.field).toBe('startDate');
	});

	// fach review b667 V-1: the other contract is a link away
	it('nennt den anderen Mietvertrag für den Link', () => {
		expect(overlapRefusal(overlap, start2025, true)?.contract).toEqual({
			id: overlap.params.contract,
			tenant: 'Anna Keller'
		});
	});

	// fach review b667 V-4: the backend names no anonymised tenant
	it('nennt den Mietvertrag eines anonymisierten Mieters ohne Namen', () => {
		const { tenant: __, ...anonymised } = overlap.params;
		expect(textOf(refused(anonymised), start2025, true)).toMatch(
			/^Der Zeitraum überschneidet sich mit dem Mietvertrag eines anonymisierten Mieters \(01\.01\.2024 – 31\.12\.2024, befristet\)\. /
		);
	});

	it('ist keine Ablehnung einer Überschneidung bei einem anderen Code', () => {
		expect(
			overlapRefusal({ code: 'CONTRACT_END_BEFORE_START', params: {} }, start2025, true)
		).toBeNull();
	});
});

// fach review b667 V-1, V-3, V-4: the browser's check in the wizard words it as the refusal does
describe('overlapError in words', () => {
	const listed = (...contracts: Record<string, unknown>[]) =>
		forAvailability({ data: { contracts: contracts as never } })!;
	const ended = {
		id: 'c8',
		startDate: '2015-01-01',
		endDate: '2019-12-31',
		tenantName: 'Ueli Graf',
		tenantAnonymised: false,
		status: 'ended',
		terminated: false
	};

	it('nennt den Mietvertrag, der am frühesten beginnt', () => {
		const later = {
			...ended,
			id: 'c9',
			startDate: '2020-01-01',
			endDate: '2020-12-31',
			tenantName: 'Eva Frei'
		};
		const said = overlapError({ ...filled, startDate: '2019-06-01' }, listed(later, ended), true);
		expect(said?.text).toMatch(
			/^Der Zeitraum überschneidet sich mit dem Mietvertrag von Ueli Graf \(01\.01\.2015 – 31\.12\.2019, befristet\)\. Der Vertragsbeginn muss nach dem 31\.12\.2019 liegen\./
		);
		expect(said?.contract).toEqual({ id: 'c8', tenant: 'Ueli Graf' });
	});

	it('nennt einen anonymisierten Mieter ohne Namen', () => {
		const anonymised = { ...ended, tenantName: 'Anonymisierter Mieter', tenantAnonymised: true };
		const said = overlapError({ ...filled, startDate: '2019-06-01' }, listed(anonymised), true);
		expect(said?.text).toContain(
			'mit dem Mietvertrag eines anonymisierten Mieters (01.01.2015 – 31.12.2019, befristet).'
		);
		expect(said?.contract).toEqual({ id: 'c8', tenant: undefined });
	});

	it('findet ohne Überschneidung nichts', () => {
		expect(overlapError({ ...filled, startDate: '2020-01-01' }, listed(ended), true)).toBeNull();
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
