import { describe, it, expect } from 'vitest';
import BuildingField from '../routes/apartments/new/BuildingField.svelte';
import StatusField from '../routes/apartments/[id]/edit/StatusField.svelte';
import DefaultsSection from '../routes/config/DefaultsSection.svelte';
import PeriodStep from '../routes/statements/generate/PeriodStep.svelte';
import { byTestId } from './helpers/dom';
import { hydrateAs, serverRender } from './helpers/hydrate';

const select = (testid: string) => byTestId<HTMLSelectElement>(testid)!;
const months = (share: number) =>
	Object.fromEntries(
		[
			'january',
			'february',
			'march',
			'april',
			'may',
			'june',
			'july',
			'august',
			'september',
			'october',
			'november',
			'december'
		].map((month) => [month, share])
	);
const profile = (id: string, name: string, share: number) => ({
	id,
	name,
	type: 'custom',
	isActive: true,
	monthlyPercentages: months(share)
});
const heatingProfiles = [
	profile('h1', 'Standard', 100 / 12),
	profile('h2', 'Altbau', 100 / 12),
	profile('h3', 'Entwurf', 5)
];

// Each form is server-rendered, the user chooses before the JavaScript has loaded, then the page hydrates
describe('Auswahl vor der Hydration in Erfassungsformularen', () => {
	it('Neue Wohnung: übernimmt das gewählte Gebäude', async () => {
		const buildings = [
			{ id: 'b1', name: 'Ahornhof', address: 'Ahornweg 1' },
			{ id: 'b2', name: 'Birkenhof', address: 'Birkenweg 2' }
		];
		await serverRender('routes/apartments/new/BuildingField.svelte', {
			buildings,
			onselect: () => {}
		});
		select('apartment-building-select').value = 'b2';

		let chosen = '';
		hydrateAs(BuildingField, { buildings, onselect: (id: string) => (chosen = id) });

		expect(chosen).toBe('b2');
	});

	it('Wohnung bearbeiten: behält den gewählten Status', async () => {
		const props = { apartment: { status: 'vacant' as const, nextContractStart: null } };
		await serverRender('routes/apartments/[id]/edit/StatusField.svelte', props);
		select('apartment-status-select').value = 'reserved';

		hydrateAs(StatusField, props);

		expect(select('apartment-status-select').value).toBe('reserved');
	});

	it('Einstellungen: behalten die gewählten Standardwerte', async () => {
		const props = {
			settings: {
				accountingPeriod: 'calendar',
				defaultHeatingProfileId: '',
				defaultDistributionKeyId: ''
			},
			heatingProfiles,
			distributionKeys: [{ id: 'd1', name: 'Nach Fläche' }]
		} as never;
		await serverRender('routes/config/DefaultsSection.svelte', props);
		select('setting-accountingPeriod').value = 'july-june';
		select('setting-defaultHeatingProfileId').value = 'h2';
		select('setting-defaultDistributionKeyId').value = 'd1';

		hydrateAs(DefaultsSection, props);

		expect(select('setting-accountingPeriod').value).toBe('july-june');
		expect(select('setting-defaultHeatingProfileId').value).toBe('h2');
		expect(select('setting-defaultDistributionKeyId').value).toBe('d1');
	});

	it('Abrechnungen erstellen: behält das gewählte Heizprofil', async () => {
		const props = {
			heatingProfiles,
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31',
			heatingProfileId: ''
		};
		await serverRender('routes/statements/generate/PeriodStep.svelte', props as never);
		select('heating-profile-select').value = 'h2';

		let heatingProfileId = '';
		hydrateAs(PeriodStep, {
			...props,
			heatingProfiles: heatingProfiles as never,
			get heatingProfileId() {
				return heatingProfileId;
			},
			set heatingProfileId(id: string) {
				heatingProfileId = id;
			}
		});

		expect(select('heating-profile-select').value).toBe('h2');
		expect(heatingProfileId).toBe('h2');
	});
});
