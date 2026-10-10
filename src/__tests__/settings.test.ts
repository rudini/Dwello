import { describe, it, expect } from 'vitest';
import { actions, load } from '../routes/config/+page.server';
import { load as loadWizard } from '../routes/statements/generate/+page.server';
import { lastCompletedPeriod } from '../lib/accounting-period';
import { runAction } from './helpers/action';

const API = 'http://localhost:3001/api/v1';

const stored = {
	accounting_period: 'july-june',
	management_fee_pct: '2.5',
	default_heating_profile_id: 'hp1',
	default_distribution_key_id: null,
	company_name: 'Muster Immobilien AG',
	company_address: 'Bahnhofstrasse 1',
	company_postal_code: '8001',
	company_city: 'Zürich',
	iban: 'CH9300762011623852957'
};

const valid = {
	companyName: 'Muster Immobilien AG',
	companyAddress: 'Bahnhofstrasse 1',
	companyPostalCode: '8001',
	companyCity: 'Zürich',
	iban: 'CH93 0076 2011 6238 5295 7',
	accountingPeriod: 'calendar',
	managementFeePercent: '3',
	defaultHeatingProfileId: 'hp1',
	defaultDistributionKeyId: ''
};

describe('Einstellungen laden', () => {
	it('zeigt die gespeicherten Einstellungen', async () => {
		const fetch = (async (url: string) =>
			Response.json(
				url.startsWith(`${API}/config`) ? { data: stored } : { data: [] }
			)) as typeof globalThis.fetch;

		const data = (await load({ fetch } as never)) as { settings: Record<string, string> };

		expect(data.settings).toEqual({
			companyName: 'Muster Immobilien AG',
			companyAddress: 'Bahnhofstrasse 1',
			companyPostalCode: '8001',
			companyCity: 'Zürich',
			iban: 'CH93 0076 2011 6238 5295 7',
			accountingPeriod: 'july-june',
			managementFeePercent: '2.5',
			defaultHeatingProfileId: 'hp1',
			defaultDistributionKeyId: ''
		});
	});

	it('bietet die Verteilschlüssel unter ihrem deutschen Namen an', async () => {
		const keys = [
			{ id: 'dk1', name: 'Per Area (m²)', nameDE: 'Pro Fläche (m²)' },
			{ id: 'dk2', name: 'Eigener' }
		];
		const fetch = (async (url: string) =>
			Response.json(
				url.startsWith(`${API}/config`)
					? { data: stored }
					: { data: url.includes('distribution-keys') ? keys : [] }
			)) as typeof globalThis.fetch;

		const data = (await load({ fetch } as never)) as { distributionKeys: unknown };

		expect(data.distributionKeys).toEqual([
			{ id: 'dk1', name: 'Pro Fläche (m²)' },
			{ id: 'dk2', name: 'Eigener' }
		]);
	});
});

describe('Einstellungen speichern', () => {
	it('speichert ausgefüllte Werte und setzt geleerte zurück', async () => {
		const { calls, result } = runAction(actions.default, '', 200, valid);

		expect(await result).toEqual({ saved: true });
		expect(calls).toEqual([
			{
				method: 'PUT',
				url: `${API}/config`,
				body: {
					company_name: 'Muster Immobilien AG',
					company_address: 'Bahnhofstrasse 1',
					company_postal_code: '8001',
					company_city: 'Zürich',
					iban: 'CH9300762011623852957',
					accounting_period: 'calendar',
					management_fee_pct: '3',
					default_heating_profile_id: 'hp1'
				}
			},
			{ method: 'DELETE', url: `${API}/config/default_distribution_key_id`, body: undefined }
		]);
	});

	it('prüft PLZ, IBAN und Verwaltungspauschale', async () => {
		const { calls, result } = runAction(actions.default, '', 200, {
			...valid,
			companyPostalCode: '80',
			iban: 'DE89 3704 0044 0532 0130 00',
			managementFeePercent: '-1'
		});

		expect(await result).toMatchObject({
			status: 400,
			data: {
				errors: {
					companyPostalCode: 'PLZ muss 4 Ziffern haben',
					iban: 'Bitte geben Sie eine gültige Schweizer IBAN ein',
					managementFeePercent: 'Die Verwaltungspauschale darf nicht negativ sein'
				}
			}
		});
		expect(calls).toEqual([]);
	});

	// Ein Tippfehler in der IBAN zeigt sich an der Prüfziffer; ohne sie entstünde kein Einzahlungsschein
	it('meldet eine IBAN mit falscher Prüfziffer am Feld und speichert nichts', async () => {
		const { calls, result } = runAction(actions.default, '', 200, {
			...valid,
			iban: 'CH93 0076 2011 6238 5295 8'
		});

		expect(await result).toMatchObject({
			status: 400,
			data: { errors: { iban: 'Bitte geben Sie eine gültige Schweizer IBAN ein' } }
		});
		expect(calls).toEqual([]);
	});

	it('meldet, wenn das Backend die Einstellungen ablehnt, und setzt dann auch nichts zurück', async () => {
		const { calls, result } = runAction(actions.default, '', 400, valid);

		expect(await result).toMatchObject({
			status: 400,
			data: { errors: { form: 'Die Einstellungen konnten nicht gespeichert werden.' } }
		});
		expect(calls.map((call) => call.method)).toEqual(['PUT']);
	});
});

describe('Standardwerte im Abrechnungs-Assistenten', () => {
	it.each([
		['calendar', '2026-10-02', { start: '2025-01-01', end: '2025-12-31' }],
		['july-june', '2026-10-02', { start: '2025-07-01', end: '2026-06-30' }],
		['july-june', '2026-03-15', { start: '2024-07-01', end: '2025-06-30' }],
		['november-october', '2026-11-05', { start: '2025-11-01', end: '2026-10-31' }],
		['november-october', '2026-10-02', { start: '2024-11-01', end: '2025-10-31' }]
	] as const)(
		'schlägt bei %s am %s die letzte abgeschlossene Periode vor',
		(type, today, period) => {
			expect(lastCompletedPeriod(type, new Date(`${today}T12:00:00`))).toEqual(period);
		}
	);

	it('wählt Periode und Heizprofil aus den Einstellungen vor', async () => {
		const fetch = (async (url: string) =>
			Response.json(
				url === `${API}/config`
					? {
							data: { ...stored, accounting_period: 'july-june', default_heating_profile_id: 'hp1' }
						}
					: { data: [], buildings: [] }
			)) as typeof globalThis.fetch;

		const data = await loadWizard({ fetch } as never);

		expect(data.defaultPeriod).toEqual(lastCompletedPeriod('july-june'));
		expect(data.defaultHeatingProfileId).toBe('hp1');
		expect(data.defaultManagementFeePercent).toBe(2.5);
	});
});

describe('Standard-Verteilschlüssel bei neuen Rechnungen', () => {
	it('schlägt den Verteilschlüssel aus den Einstellungen vor', async () => {
		const { load: loadInvoiceForm } = await import('../routes/invoices/new/+page.server');
		const fetch = async (url: string) =>
			Response.json(
				url === `${API}/config/default_distribution_key_id` ? { value: 'dk1' } : { data: [] }
			);

		const data = (await loadInvoiceForm({ fetch } as never)) as Record<string, unknown>;

		expect(data.defaultDistributionKeyId).toBe('dk1');
	});
});
