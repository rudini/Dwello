import { afterEach, describe, expect, it } from 'vitest';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import { floorLabel, occupancyParts, statusLabels, statusText } from '$lib/apartment';
import { contractPeriod, statusBadges } from '$lib/contract-status';
import { localName } from '$lib/names';
import { overviewDeadlines, overviewTasks } from '$lib/overview';
import { parseBuildingForm } from '$lib/server/building-form';
import { buildingTypeLabel } from '$lib/building-type';
import {
	load as detailLoad,
	type BuildingDetailsData
} from '../routes/buildings/[id]/+page.server';
import backendBuilding from '../../tests/contracts/building.json';

afterEach(() => overwriteGetLocale(() => baseLocale));

const french = () => overwriteGetLocale(() => 'fr');

describe('Gebäude und Wohnungen in der gewählten Sprache', () => {
	it('nennt das Stockwerk wie die Abrechnung', () => {
		french();
		// #597: the first floor below ground has no number, from the second on it is counted
		expect([-1, -2, 0, 1, 3].map(floorLabel)).toEqual([
			'sous-sol',
			'2e sous-sol',
			'rez-de-chaussée',
			'1er étage',
			'3e étage'
		]);
		overwriteGetLocale(() => 'it');
		expect([-1, -2].map(floorLabel)).toEqual(['piano interrato', '2° piano interrato']);
		// British English counts «1st floor», «2nd floor» above the ground floor (461-native-en, EN-32)
		overwriteGetLocale(() => 'en');
		expect([1, 2, 3, 4, 11, 22].map(floorLabel)).toEqual([
			'1st floor',
			'2nd floor',
			'3rd floor',
			'4th floor',
			'11th floor',
			'22nd floor'
		]);
		// #449 (Entscheid in #404, Punkt 5.3): below ground as ordinals too
		expect([0, -1, -2, -3].map(floorLabel)).toEqual(['ground floor', 'basement', '2nd basement', '3rd basement']);
	});

	it('nennt Mietstatus und Belegung auf Französisch', () => {
		french();
		expect(statusLabels.vacant).toBe('Vacant');
		expect(statusText({ status: 'relet', nextContractStart: '2026-11-01' })).toBe(
			'Loué dès le 01.11.2026'
		);
		expect(occupancyParts({ occupiedCount: 1, vacantCount: 2 })).toEqual(['1 loué', '2 vacants']);
	});

	it('nennt Vertragsstatus und Vertragsdauer auf Italienisch', () => {
		overwriteGetLocale(() => 'it');
		expect(statusBadges.future.label).toBe('Futuro');
		expect(contractPeriod('2024-04-01', null, 'active')).toBe(
			'dal 01.04.2024, a tempo indeterminato'
		);
	});

	it('zeigt den Gebäudetyp übersetzt und speichert ihn deutsch', () => {
		overwriteGetLocale(() => 'en');
		expect(buildingTypeLabel('Mischnutzung')).toBe('Mixed use');
		expect(buildingTypeLabel('Eigener Typ')).toBe('Eigener Typ');
	});

	it('liest aus dem Gebäudeformular, ob das Gebäude ohne Tank ist', () => {
		const form = new FormData();
		expect(parseBuildingForm(form).building.noTank).toBe(false);
		form.set('noTank', 'on');
		expect(parseBuildingForm(form).building.noTank).toBe(true);
	});

	it('meldet fehlende Angaben im Gebäudeformular auf Französisch', () => {
		french();
		const { errors } = parseBuildingForm(new FormData());
		expect(errors.postalCode).toBe('Le NPA est obligatoire.');
	});

	it('nennt Stammdaten mit ihrem Namen in der gewählten Sprache', () => {
		const category = { name: 'Heating', nameDE: 'Heizung', nameFR: 'Chauffage', nameEN: null };
		expect(localName(category)).toBe('Heizung');
		french();
		expect(localName(category)).toBe('Chauffage');
		overwriteGetLocale(() => 'en');
		expect(localName(category)).toBe('Heizung');
	});

	it('nennt die Kategorie der Tankbestände in der gewählten Sprache', async () => {
		french();
		const fetch = (async (url: string) =>
			Response.json(
				url.endsWith('/fuel-stocks')
					? [{ id: 'f1', readingDate: '2024-12-31', amount: '10', categoryId: 'c1' }]
					: url.includes('/categories')
						? {
								categories: [
									{
										id: 'c1',
										name: 'Heating',
										nameDE: 'Heizung',
										nameFR: 'Chauffage',
										isHeatingCost: true,
										isFuel: true,
										isAllowedUtilityCost: true
									}
								]
							}
						: url.includes('/apartments')
							? { apartments: [] }
							: backendBuilding
			)) as typeof globalThis.fetch;
		const data = (await detailLoad({
			params: { id: 'b1' },
			fetch
		} as never)) as BuildingDetailsData;
		expect(data.fuelStocks![0].categoryName).toBe('Chauffage');
		expect(data.building.noTank).toBe(true);
		expect(data.heatingCategories).toEqual([{ id: 'c1', name: 'Chauffage' }]);
	});
});

describe('Übersicht in der gewählten Sprache', () => {
	const portfolio = {
		totalBuildings: 0,
		totalApartments: 0,
		occupiedApartments: 0,
		reletApartments: 0
	};
	const input = {
		today: '2026-10-10',
		portfolio,
		statementCounts: { draft: 1, sent: 0, paid: 0, settled: 0, overdue: 0 },
		draftIds: ['s2'],
		dueStatements: [{ id: 's1', tenantName: 'Anna Keller', paymentDeadline: '2026-10-05' }],
		lettersToSend: 2,
		endingContracts: [],
		noticedContracts: [],
		paymentDeadlineDays: 30,
		reminderAfterDays: 14,
		expiredContracts: []
	};

	it('nennt Aufgaben auf Französisch', () => {
		french();
		const tasks = overviewTasks(input);
		expect(tasks.map((task) => task.title)).toEqual([
			'Saisir le premier immeuble',
			'Envoyer les lettres',
			'Vérifier et envoyer les décomptes'
		]);
		expect(tasks[1].text).toMatch(/^2 lettres sont prêtes/);
		expect(tasks[2].text).toMatch(/^1 décompte des charges est encore/);
	});

	it('nennt den Abstand einer Frist auf Englisch', () => {
		overwriteGetLocale(() => 'en');
		expect(overviewDeadlines(input)[0].when).toBe('passed 5 days ago');
	});
});

describe('Abrechnungsstatus auf der Übersicht', () => {
	it('heisst auf Englisch wie im Begriffsverzeichnis', async () => {
		const { statusLabels } = await import('$lib/statement');
		overwriteGetLocale(() => 'en');
		expect(statusLabels).toEqual({
			draft: 'Draft',
			sent: 'Sent',
			paid: 'Paid',
			settled: 'Closed',
			overdue: 'Overdue',
			replaced: 'Replaced'
		});
	});
});

describe('Belegung auf der Übersicht', () => {
	it('sagt auf Französisch «loué» für eine und «loués» für mehrere Wohnungen', async () => {
		const { render } = await import('svelte/server');
		const { default: BuildingFigures } = await import('../routes/dashboard/BuildingFigures.svelte');
		french();
		const shown = (occupiedApartments: number) =>
			render(BuildingFigures, {
				props: {
					data: {
						portfolio: {
							totalBuildings: 1,
							totalApartments: 4,
							occupiedApartments,
							reletApartments: 0,
							vacantApartments: 0,
							reservedApartments: 0
						},
						financial: {
							outstandingStatements: 0,
							totalPending: 0,
							overdueAmount: 0,
							paidThisMonth: 0
						},
						statements: { draft: 0, sent: 0, paid: 0, settled: 0, overdue: 0 },
						buildingOccupancy: [
							{
								buildingId: 'b1',
								buildingName: 'Seeblick',
								totalApartments: 4,
								occupiedApartments
							}
						]
					}
				} as never
			}).body.replace(/<[^>]*>/g, '');
		expect(shown(1)).toContain('1/4 loué');
		expect(shown(1)).not.toContain('1/4 loués');
		expect(shown(3)).toContain('3/4 loués');
	});
});
