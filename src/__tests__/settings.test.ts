import { describe, it, expect } from 'vitest';
import { actions, load } from '../routes/config/+page.server';
import { runAction } from './helpers/action';
import config from '../../tests/contracts/config.json';

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
					company_phone: '044 123 45 67',
					company_email: 'info@muster.ch',
					iban: 'CH9300762011623852957',
					accounting_period: 'calendar',
					management_fee_pct: '3',
					default_heating_profile_id: 'hp1',
					payment_deadline_days: '30',
					reminder_after_days: '14'
				}
			},
			{ method: 'DELETE', url: `${API}/config/default_distribution_key_id`, body: undefined }
		]);
	});

	// Wie getippt: mit Komma, gespeichert mit Punkt; mehr als zwei Nachkommastellen werden nicht still gerundet
	it('nimmt die Verwaltungspauschale mit Komma an', async () => {
		const { calls, result } = runAction(actions.default, '', 200, {
			...valid,
			managementFeePercent: '2,5'
		});

		expect(await result).toEqual({ saved: true });
		expect(calls[0].body).toMatchObject({ management_fee_pct: '2.5' });
		const rounded = runAction(actions.default, '', 200, {
			...valid,
			managementFeePercent: '2,555'
		});
		expect(await rounded.result).toMatchObject({ status: 400 });
	});

	// #124: höchstens 10 %, am Feld, bevor etwas gespeichert wird
	it('lehnt eine Verwaltungspauschale über 10 % am Feld ab', async () => {
		const { calls, result } = runAction(actions.default, '', 200, {
			...valid,
			managementFeePercent: '10,01'
		});

		expect(await result).toMatchObject({
			status: 400,
			data: {
				errors: {
					managementFeePercent:
						'Bitte geben Sie einen Prozentsatz von 0 bis 10 mit höchstens zwei Stellen nach dem Komma ein, zum Beispiel 3 oder 2,5.'
				}
			}
		});
		expect(calls).toEqual([]);
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
					companyPostalCode: 'PLZ muss 4 Ziffern haben.',
					iban: 'Bitte geben Sie eine gültige IBAN aus der Schweiz oder aus Liechtenstein ein.',
					managementFeePercent:
						'Bitte geben Sie einen Prozentsatz von 0 bis 10 mit höchstens zwei Stellen nach dem Komma ein, zum Beispiel 3 oder 2,5.'
				}
			}
		});
		expect(calls).toEqual([]);
	});

	// #465 (DMR-09): die E-Mail der Verwaltung wie die des Mieters geprüft, am Feld
	it('lehnt eine ungültige E-Mail der Verwaltung am Feld ab', async () => {
		const { calls, result } = runAction(actions.default, '', 200, { ...valid, companyEmail: 'info@muster' });

		expect(await result).toMatchObject({
			status: 400,
			data: { errors: { companyEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' } }
		});
		expect(calls).toEqual([]);
	});

	// #87: dieselben Grenzen wie das Backend, am Feld statt «nicht gespeichert»
	it('lehnt Zahlungsfrist und Mahnfrist ausserhalb der erlaubten Tage am Feld ab', async () => {
		const errors = async (paymentDeadlineDays: string, reminderAfterDays: string) => {
			const { calls, result } = runAction(actions.default, '', 200, {
				...valid,
				paymentDeadlineDays,
				reminderAfterDays
			});
			const answer = (await result) as { data?: { errors: Record<string, string> } };
			return { errors: answer.data?.errors ?? {}, saved: calls.length > 0 };
		};
		const both = {
			paymentDeadlineDays: 'Geben Sie für die Zahlungsfrist 7 bis 90 Tage ein.',
			reminderAfterDays: 'Geben Sie für die Mahnfrist 7 bis 60 Tage ein.'
		};

		expect(await errors('6', '61')).toEqual({ errors: both, saved: false });
		expect(await errors('91', '6')).toEqual({ errors: both, saved: false });
		expect(await errors('30,5', '1e1')).toEqual({ errors: both, saved: false });
		expect(await errors('7', '60')).toEqual({ errors: {}, saved: true });
		expect(await errors('90', '7')).toEqual({ errors: {}, saved: true });
	});

	// Ein Tippfehler in der IBAN zeigt sich an der Prüfziffer; ohne sie entstünde kein Einzahlungsschein
	it('meldet eine IBAN mit falscher Prüfziffer am Feld und speichert nichts', async () => {
		const { calls, result } = runAction(actions.default, '', 200, {
			...valid,
			iban: 'CH93 0076 2011 6238 5295 8'
		});

		expect(await result).toMatchObject({
			status: 400,
			data: {
				errors: {
					iban: 'Bitte geben Sie eine gültige IBAN aus der Schweiz oder aus Liechtenstein ein.'
				}
			}
		});
		expect(calls).toEqual([]);
	});

	// Die QR-Rechnung nimmt Konten in der Schweiz und in Liechtenstein an (#191)
	it('nimmt eine IBAN aus Liechtenstein an', async () => {
		const { calls, result } = runAction(actions.default, '', 200, {
			...valid,
			iban: 'LI21 0881 0000 2324 013A A'
		});

		expect(await result).toEqual({ saved: true });
		expect(calls[0].body).toMatchObject({ iban: 'LI21088100002324013AA' });
	});

	it('lehnt eine IBAN aus Liechtenstein mit falscher Prüfziffer ab', async () => {
		const { calls, result } = runAction(actions.default, '', 200, {
			...valid,
			iban: 'LI22 0881 0000 2324 013A A'
		});

		expect(await result).toMatchObject({
			status: 400,
			data: {
				errors: {
					iban: 'Bitte geben Sie eine gültige IBAN aus der Schweiz oder aus Liechtenstein ein.'
				}
			}
		});
		expect(calls).toEqual([]);
	});

	// #450 (Entscheid in #404, Punkt 8): der Zahlteil nennt den Liegenschaftsverwalter als Zahlungsempfänger
	it('speichert eine IBAN nur mit Name, PLZ und Ort der Firmenadresse', async () => {
		const answer = async (fields: Partial<typeof valid>) => {
			const { calls, result } = runAction(actions.default, '', 200, { ...valid, ...fields });
			const data = ((await result) as { data?: { errors: Record<string, string> } }).data;
			return { iban: data?.errors.iban, saved: calls.length > 0 };
		};
		const refused = {
			iban: 'Mit einer IBAN braucht es die Firmenadresse. Erfassen Sie Name, PLZ und Ort.',
			saved: false
		};

		expect(await answer({ companyName: '' })).toEqual(refused);
		// the empty fields the message names, marked on the page (persona Helga P-2)
		const { result } = runAction(actions.default, '', 200, { ...valid, companyName: '', companyCity: '' });
		expect(await result).toMatchObject({ data: { missing: ['companyName', 'companyCity'] } });
		expect(await answer({ companyPostalCode: ' ' })).toEqual(refused);
		expect(await answer({ companyCity: '' })).toEqual(refused);
		expect(await answer({ companyAddress: '' })).toEqual({ iban: undefined, saved: true });
		expect(await answer({ companyName: '', iban: '' })).toEqual({ iban: undefined, saved: true });
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
