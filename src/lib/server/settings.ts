import { fail } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';
import { parsePercent } from '$lib/utils/format';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/config`;

// Form field → backend configuration key
const KEYS = {
	companyName: 'company_name',
	companyAddress: 'company_address',
	companyPostalCode: 'company_postal_code',
	companyCity: 'company_city',
	iban: 'iban',
	accountingPeriod: 'accounting_period',
	managementFeePercent: 'management_fee_pct',
	defaultHeatingProfileId: 'default_heating_profile_id',
	defaultDistributionKeyId: 'default_distribution_key_id'
} as const;

export type Settings = Record<keyof typeof KEYS, string>;

const compact = (iban: string) => iban.replace(/\s/g, '').toUpperCase();
/** ISO 13616: country (CH = 1217) and check digits moved to the end, the number mod 97 must be 1 */
const ibanChecksumValid = (iban: string) =>
	BigInt(iban.slice(4) + '1217' + iban.slice(2, 4)) % 97n === 1n;
/** "CH93 0076 2011 6238 5295 7" */
const groupIban = (iban: string) => compact(iban).replace(/(.{4})(?=.)/g, '$1 ');

export function toSettings(stored: Record<string, string | null>): Settings {
	const settings = Object.fromEntries(
		Object.entries(KEYS).map(([field, key]) => [field, stored[key] ?? ''])
	) as Settings;
	return { ...settings, iban: groupIban(settings.iban) };
}

function settingsErrors(s: Settings) {
	const errors: Record<string, string> = {};
	if (s.companyPostalCode && !/^\d{4}$/.test(s.companyPostalCode)) {
		errors.companyPostalCode = m.buildings_error_postal_code_digits();
	}
	const iban = compact(s.iban);
	if (iban && !(/^CH\d{19}$/.test(iban) && ibanChecksumValid(iban))) {
		errors.iban = m.settings_error_iban();
	}
	if (s.managementFeePercent && Number.isNaN(parsePercent(s.managementFeePercent))) {
		errors.managementFeePercent = m.statements_error_fee();
	}
	return errors;
}

/** Saves filled values and resets emptied ones to their default */
export async function saveSettings(fetch: typeof globalThis.fetch, request: Request) {
	const formData = await request.formData();
	const settings = Object.fromEntries(
		Object.keys(KEYS).map((field) => [field, String(formData.get(field) ?? '').trim()])
	) as Settings;
	const errors = settingsErrors(settings);
	if (Object.keys(errors).length > 0) return fail(400, { errors });

	const fee = settings.managementFeePercent && String(parsePercent(settings.managementFeePercent));
	const entries = Object.entries({
		...settings,
		iban: compact(settings.iban),
		managementFeePercent: fee
	}).map(([field, value]) => [KEYS[field as keyof Settings], value] as const);
	const filled = Object.fromEntries(entries.filter(([, value]) => value));
	const saved = await fetch(API, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(filled)
	});
	// Emptied fields are reset only once the others are saved, so a rejected form changes nothing
	const resets = saved.ok
		? await Promise.all(
				entries
					.filter(([, value]) => !value)
					.map(([key]) => fetch(`${API}/${key}`, { method: 'DELETE' }))
			)
		: [];
	if (![saved, ...resets].every((response) => response.ok)) {
		return fail(400, {
			errors: { form: m.settings_save_failed() } as Record<string, string>
		});
	}
	return { saved: true };
}
