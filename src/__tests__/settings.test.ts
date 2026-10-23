import { describe, it, expect } from 'vitest';
import { actions, load } from '../routes/config/+page.server';
import { runAction } from './helpers/action';
import config from '../../tests/contracts/config.json';
import fieldsRefused from '../../tests/contracts/config-fields-refused.json';
import ibanAddressMissing from '../../tests/contracts/config-iban-address-missing.json';

const API = 'http://localhost:3001/api/v1';

// as the backend answers; the distribution key emptied (null)
const stored = { ...config.data, default_distribution_key_id: null };

const valid = {
	companyName: 'Muster Immobilien AG',
	companyAddress: 'Bahnhofstrasse 1',
	companyPostalCode: '8001',
	companyCity: 'Zürich',
	companyPhone: '044 123 45 67',
	companyEmail: 'info@muster.ch',
	iban: 'CH93 0076 2011 6238 5295 7',
	accountingPeriod: 'calendar',
	managementFeePercent: '3',
	defaultHeatingProfileId: 'hp1',
	defaultDistributionKeyId: '',
	paymentDeadlineDays: '30',
	reminderAfterDays: '14'
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
			companyPhone: '044 123 45 67',
			companyEmail: 'info@muster.ch',
			iban: 'CH93 0076 2011 6238 5295 7',
			accountingPeriod: 'july-june',
			managementFeePercent: '2.5',
			defaultHeatingProfileId: 'hp1',
			defaultDistributionKeyId: '',
			paymentDeadlineDays: '45',
			reminderAfterDays: '10'
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
	// H-28 (#717): every field as typed in one save; the backend checks them and resets the emptied ones
	it('sendet jedes Feld, wie es getippt wurde, und setzt geleerte mit demselben Speichern zurück', async () => {
		const { calls, result } = runAction(actions.default, '', 200, { ...valid, managementFeePercent: '2,5' });

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
					company_phone: '044 123 45 67',
					company_email: 'info@muster.ch',
					iban: 'CH93 0076 2011 6238 5295 7',
					accounting_period: 'calendar',
					management_fee_pct: '2,5',
					default_heating_profile_id: 'hp1',
					default_distribution_key_id: '',
					payment_deadline_days: '30',
					reminder_after_days: '14'
				}
			}
		]);
	});

	it('zeigt jede Ablehnung des Backends an ihrem Feld', async () => {
		const { result } = runAction(actions.default, '', 200, valid, {}, { status: 400, answer: fieldsRefused });

		expect(await result).toMatchObject({
			status: 400,
			data: {
				errors: {
					companyPostalCode: 'PLZ muss 4 Ziffern haben.',
					iban: 'Bitte geben Sie eine gültige IBAN aus der Schweiz oder aus Liechtenstein ein.',
					managementFeePercent:
						'Bitte geben Sie einen Prozentsatz von 0 bis 10 mit höchstens zwei Stellen nach dem Komma ein, zum Beispiel 3 oder 2,5.'
				},
				missing: []
			}
		});
	});

	// #450: the empty fields of the Firmenadresse the message names, marked on the page (persona Helga P-2)
	it('markiert die Felder der Firmenadresse, die zur IBAN fehlen', async () => {
		const { result } = runAction(actions.default, '', 200, valid, {}, { status: 400, answer: ibanAddressMissing });

		expect(await result).toMatchObject({
			status: 400,
			data: {
				errors: { iban: 'Mit einer IBAN braucht es die Firmenadresse. Erfassen Sie Name, PLZ und Ort.' },
				missing: ['companyName', 'companyCity']
			}
		});
	});

	it('meldet, wenn das Backend die Einstellungen nicht speichern kann', async () => {
		const { calls, result } = runAction(actions.default, '', 500, valid);

		expect(await result).toMatchObject({
			status: 400,
			data: { errors: { form: 'Die Einstellungen konnten nicht gespeichert werden.' } }
		});
		expect(calls.map((call) => call.method)).toEqual(['PUT']);
	});
});

describe('Standard-Verteilschlüssel bei neuen Rechnungen', () => {
	it('schlägt den Verteilschlüssel aus den Einstellungen vor', async () => {
		const { load: loadInvoiceForm } = await import('../routes/invoices/new/+page.server');
		const fetch = async (url: string) =>
			Response.json(
				url === `${API}/config/default_distribution_key_id` ? { value: 'dk1' } : { data: [] }
			);

		const data = (await loadInvoiceForm({
			fetch,
			url: new URL('http://localhost/invoices/new')
		} as never)) as Record<string, unknown>;

		expect(data.defaultDistributionKeyId).toBe('dk1');
	});
});
