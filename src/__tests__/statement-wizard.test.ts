import { describe, it, expect } from 'vitest';
import {
	invoiceRows,
	restoredSelection,
	selectionErrors,
	statementSteps
} from '../lib/statement-wizard';

const selection = {
	periodStart: '2024-01-01',
	periodEnd: '2024-12-31',
	heatingProfileId: 'hp1',
	managementFeePercent: 3,
	managementFeeDistributionKeyId: '',
	buildingIds: ['b1']
};
const period = { periodStart: '2024-01-01', periodEnd: '2024-12-31' };
const buildings = [
	{ id: 'b1', name: 'Ahornhof' },
	{ id: 'b2', name: 'Lindenhof' }
];

describe('Abrechnungen Schritt für Schritt', () => {
	it('führt in fünf Schritten von der Periode bis zum Erstellen', () => {
		expect(statementSteps).toEqual([
			'Abrechnungsperiode',
			'Gebäude',
			'Heizprofil und Verwaltungspauschale',
			'Vorschau',
			'Erstellen'
		]);
	});

	it('prüft die Abrechnungsperiode', () => {
		expect(selectionErrors({ ...selection, periodStart: '' }, 1)).toEqual({
			periodStart: 'Bitte wählen Sie den Beginn der Abrechnungsperiode.'
		});
		expect(selectionErrors({ ...selection, periodEnd: '2023-12-31' }, 1)).toEqual({
			periodEnd: 'Das Ende muss nach dem Beginn der Abrechnungsperiode liegen.'
		});
		expect(selectionErrors({ ...selection, periodStart: '12024-01-01' }, 1)).toEqual({
			periodStart: 'Bitte prüfen Sie das Datum: Das Jahr ist nicht möglich.'
		});
		expect(selectionErrors(selection, 1)).toEqual({});
	});

	it('verlangt mindestens ein Gebäude', () => {
		expect(selectionErrors({ ...selection, buildingIds: [] }, 2)).toEqual({
			buildings: 'Bitte wählen Sie mindestens ein Gebäude.'
		});
	});

	it('verlangt ein Heizprofil und eine gültige Verwaltungspauschale', () => {
		expect(
			selectionErrors({ ...selection, heatingProfileId: '', managementFeePercent: -1 }, 3)
		).toEqual({
			heatingProfileId: 'Bitte wählen Sie ein Heizprofil.',
			managementFeePercent: 'Bitte geben Sie einen Prozentsatz ab 0 ein, zum Beispiel 3.'
		});
		expect(selectionErrors({ ...selection, managementFeePercent: NaN }, 3)).toHaveProperty(
			'managementFeePercent'
		);
	});
});

describe('Rechnungen pro Gebäude', () => {
	it('nennt Anzahl und Zeitraum der Rechnungen und markiert Gebäude ohne Rechnungen', () => {
		expect(
			invoiceRows(
				[
					{ buildingId: 'b1', count: 3, first: '2024-01-15', last: '2024-06-30' },
					{ buildingId: 'b2', count: 0, first: null, last: null }
				],
				buildings,
				period
			)
		).toEqual([
			{
				buildingId: 'b1',
				name: 'Ahornhof',
				text: '3 Rechnungen vom 15.1.2024 bis 30.6.2024',
				missing: false,
				partial: true, // nothing after June
				existing: 0
			},
			{
				buildingId: 'b2',
				name: 'Lindenhof',
				text: 'Keine Rechnungen erfasst',
				missing: true,
				partial: false,
				existing: 0
			}
		]);
		expect(
			invoiceRows(
				[{ buildingId: 'b1', count: 1, first: '2024-03-15', last: '2024-03-15' }],
				buildings,
				period
			)[0].text
		).toBe('1 Rechnung vom 15.3.2024');
	});
});

describe('Rechnungen über die ganze Periode', () => {
	// More than three months at the start or end without any invoice: worth a second look, not a stop
	it('weist auf Rechnungen hin, die nur einen Teil der Periode abdecken', () => {
		const rows = (first: string, last: string) =>
			invoiceRows([{ buildingId: 'b1', count: 4, first, last }], buildings, period)[0].partial;
		expect(rows('2024-01-10', '2024-12-20')).toBe(false);
		expect(rows('2024-01-10', '2024-03-31')).toBe(true); // only Q1
		expect(rows('2024-06-01', '2024-12-20')).toBe(true); // nothing in the first five months
	});
});

describe('Entwurf der Abrechnungen', () => {
	it('übernimmt nur Gebäude und Heizprofile, die es noch gibt', () => {
		const known = { buildingIds: ['b1'], heatingProfileIds: ['hp1'] };
		expect(
			restoredSelection(
				{ ...selection, buildingIds: ['b1', 'weg'], heatingProfileId: 'alt' },
				known
			)
		).toEqual({ ...selection, buildingIds: ['b1'], heatingProfileId: '' });
	});
});
