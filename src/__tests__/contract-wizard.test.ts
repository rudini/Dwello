import { describe, it, expect } from 'vitest';
import {
	advancePaymentNotice,
	apartmentChoices,
	normalizeAmounts,
	startDateNotice,
	contractSteps,
	contractSummary,
	firstStepWithError,
	startValues,
	stepErrors
} from '../lib/contract-wizard';
import type { ContractFormValues } from '../lib/contract-form';

const empty: ContractFormValues = {
	tenantId: '',
	apartmentId: '',
	startDate: '',
	endDate: '',
	isUnlimited: true,
	baseRent: '',
	additionalRent: '',
	advancePayment: '',
	managementFee: '',
	managementFeeRate: ''
};
const filled: ContractFormValues = {
	...empty,
	tenantId: 't1',
	apartmentId: 'a1',
	startDate: '2025-01-01',
	baseRent: '950',
	advancePayment: '180',
	managementFee: 'run'
};
const tenants = [{ id: 't1', name: 'Anna Keller' }];
const apartments = [{ id: 'a1', unit: '2.01', building: 'Ahornhof' }];

describe('Mietvertrag Schritt für Schritt', () => {
	it('führt in fünf Schritten vom Mieter bis zur Prüfung', () => {
		expect(contractSteps.map((step) => step.label)).toEqual([
			'Mieter',
			'Wohnung',
			'Vertragsdauer',
			'Miete',
			'Prüfen'
		]);
	});

	it('prüft bei "Weiter" nur die Angaben des aktuellen Schritts', () => {
		expect(stepErrors(empty, 1)).toEqual({ tenantId: 'Bitte wählen Sie einen Mieter aus' });
		expect(stepErrors({ ...empty, tenantId: 't1' }, 1)).toEqual({});
		expect(stepErrors(empty, 3)).toEqual({ startDate: 'Vertragsbeginn ist erforderlich' });
		expect(stepErrors({ ...filled, isUnlimited: false }, 3)).toEqual({
			endDate: 'Vertragsende ist erforderlich bei befristetem Vertrag'
		});
		expect(stepErrors({ ...filled, baseRent: '' }, 4)).toEqual({
			baseRent: 'Nettomiete ist erforderlich'
		});
	});

	it('findet den ersten Schritt mit einem Fehler', () => {
		expect(firstStepWithError({ baseRent: 'x', startDate: 'y' })).toBe(3);
		expect(firstStepWithError({})).toBeNull();
	});

	it('erklärt, was ein Mietvertrag ohne Akonto bedeutet', () => {
		expect(advancePaymentNotice({ ...filled, advancePayment: '' })).toBe(
			'Ohne Akonto bezahlt der Mieter alle Nebenkosten erst mit der Nebenkostenabrechnung.'
		);
		expect(advancePaymentNotice({ ...filled, advancePayment: '0' })).not.toBeNull();
		expect(advancePaymentNotice(filled)).toBeNull();
	});

	it('fasst den Mietvertrag vor dem Speichern in Worten zusammen', () => {
		expect(contractSummary(filled, tenants, apartments)).toEqual([
			{ label: 'Mieter', value: 'Anna Keller', step: 1, field: 'tenant' },
			{ label: 'Wohnung', value: 'Wohnung 2.01 - Ahornhof', step: 2, field: 'apartment' },
			{ label: 'Vertragsbeginn', value: 'Mittwoch, 1. Januar 2025', step: 3, field: 'startDate' },
			{ label: 'Vertragsende', value: 'Unbefristet', step: 3, field: 'duration' },
			{ label: 'Nettomiete', value: 'CHF\u00a0950.00', step: 4, field: 'baseRent' },
			{ label: 'Akonto', value: 'CHF\u00a0180.00', step: 4, field: 'advancePayment' },
			{ label: 'Zusatzmiete', value: 'CHF\u00a00.00', step: 4, field: 'additionalRent' },
			{
				label: 'Verwaltungspauschale',
				value: 'Vereinbart, Satz des Abrechnungslaufs',
				step: 4,
				field: 'managementFee'
			},
			{ label: 'Monatlich total', value: 'CHF\u00a01’130.00', step: null, field: '' } // a sum, changed through its parts
		]);
		const limited = { ...filled, isUnlimited: false, endDate: '2026-12-31' };
		expect(contractSummary(limited, tenants, apartments)[3].value).toBe(
			'Donnerstag, 31. Dezember 2026'
		);
	});
});

describe('Startwerte des Mietvertrags', () => {
	const known = { tenantIds: ['t1', 't2'], apartmentIds: ['a1'] };

	it('beginnt leer und unbefristet, Mieter und Wohnung aus der Adresse', () => {
		const params = new URLSearchParams('tenant=t2&apartment=a1');
		expect(startValues(params, null, known)).toEqual({
			values: { ...empty, tenantId: 't2', apartmentId: 'a1' },
			restored: false,
			dropped: false
		});
	});

	it('setzt einen Entwurf fort; ein Mieter aus der Adresse gilt vor dem Entwurf', () => {
		const start = startValues(new URLSearchParams('tenant=t2'), filled, known);
		expect(start).toEqual({
			values: { ...filled, tenantId: 't2' },
			restored: true,
			dropped: false
		});
	});

	// B-16 (#156): «Neuen Mietvertrag erfassen» unter «Bearbeiten» gibt den frühesten Vertragsbeginn mit
	it('beginnt am Tag aus der Adresse, auch vor dem Entwurf', () => {
		const params = new URLSearchParams('tenant=t1&start=2099-04-01');
		expect(startValues(params, null, known).values.startDate).toBe('2099-04-01');
		expect(startValues(params, filled, known).values.startDate).toBe('2099-04-01');
	});

	it('lässt Mieter und Wohnungen weg, die es nicht mehr gibt, und sagt es', () => {
		const start = startValues(
			new URLSearchParams(),
			{ ...filled, tenantId: 'gone', apartmentId: 'gone' },
			known
		);
		expect(start.values.tenantId).toBe('');
		expect(start.values.apartmentId).toBe('');
		expect(start.values.baseRent).toBe('950');
		expect(start.dropped).toBe(true);
	});
});

describe('Wohnungen zur Auswahl', () => {
	it('nennt Zimmer und Fläche, damit der Mietzins eingeschätzt werden kann', () => {
		const [choice] = apartmentChoices(
			[{ id: 'a1', unit: '2.02', building: 'Musterhaus', size: '2.5 Zimmer, 65 m²' }],
			new Map()
		);
		expect(choice.label).toBe('Wohnung 2.02 - Musterhaus, 2.5 Zimmer, 65 m²');
	});

	it('nennt freie Wohnungen zuerst und sperrt vermietete', () => {
		const choices = apartmentChoices(
			[
				{ id: 'a1', unit: '1.01', building: 'Ahornhof' },
				{ id: 'a2', unit: '1.02', building: 'Ahornhof' },
				{ id: 'a3', unit: '1.03', building: 'Ahornhof' }
			],
			new Map([
				[
					'a1',
					{ hasOngoingContract: true, availableFrom: null, statusType: 'unavailable', message: '' }
				],
				[
					'a2',
					{
						hasOngoingContract: false,
						availableFrom: '2026-12-01',
						statusType: 'available-from',
						message: ''
					}
				]
			]) as never
		);
		expect(choices).toEqual([
			{ value: 'a2', label: 'Wohnung 1.02 - Ahornhof (verfügbar ab 01.12.2026)', disabled: false },
			{ value: 'a3', label: 'Wohnung 1.03 - Ahornhof', disabled: false },
			{ value: 'a1', label: 'Wohnung 1.01 - Ahornhof (nicht verfügbar)', disabled: true }
		]);
	});
});

describe('Beträge und Daten wie in der Schweiz geschrieben', () => {
	it('versteht Tausendertrennzeichen und Komma in Beträgen', () => {
		const values = normalizeAmounts({
			...filled,
			baseRent: "1'450",
			advancePayment: '180,50',
			additionalRent: '1’000 '
		});
		expect([values.baseRent, values.advancePayment, values.additionalRent]).toEqual([
			'1450',
			'180.50',
			'1000'
		]);
	});

	// «1'450.-» ist in der Schweiz ein ganzer Frankenbetrag; das Total rechnete ihn mit, «Weiter» lehnte ihn ab
	it('versteht einen ganzen Frankenbetrag mit Strich', () => {
		const values = normalizeAmounts({
			...filled,
			baseRent: "1'450.-",
			advancePayment: '180.–',
			additionalRent: ''
		});
		expect([values.baseRent, values.advancePayment]).toEqual(['1450', '180']);
	});

	it('weist auf einen Vertragsbeginn in der Vergangenheit hin', () => {
		expect(startDateNotice('2026-01-11', '2026-10-10')).toBe(
			'Der Vertragsbeginn Sonntag, 11. Januar 2026 liegt in der Vergangenheit. Stimmt das Datum?'
		);
		expect(startDateNotice('2026-11-01', '2026-10-10')).toBeNull();
		expect(startDateNotice('', '2026-10-10')).toBeNull();
		// an impossible year gets its own error, not a misleading "in the past"
		expect(startDateNotice('12025-01-01', '2026-10-10')).toBeNull();
	});
});
