import { fail } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';
import { isFeeRate, parsePercent } from '$lib/utils/format';

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
	defaultDistributionKeyId: 'default_distribution_key_id',
	paymentDeadlineDays: 'payment_deadline_days',
	reminderAfterDays: 'reminder_after_days'
} as const;

export type Settings = Record<keyof typeof KEYS, string>;

// whole days within the limits the backend accepts (config.service.ts)
const days = (value: string, min: number, max: number) =>
	/^\d+$/.test(value) && Number(value) >= min && Number(value) <= max;

const compact = (iban: string) => iban.replace(/\s/g, '').toUpperCase();
/** ISO 13616: country and check digits moved to the end, letters as numbers (A = 10), the number mod 97 must be 1 */
const ibanChecksumValid = (iban: string) => {
	const moved = iban.slice(4) + iban.slice(0, 4);
	return BigInt(moved.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55))) % 97n === 1n;
};
/** "CH93 0076 2011 6238 5295 7" */
const groupIban = (iban: string) => compact(iban).replace(/(.{4})(?=.)/g, '$1 ');

export function toSettings(stored: Record<string, string | null>): Settings {
	const settings = Object.fromEntries(
		Object.entries(KEYS).map(([field, key]) => [field, stored[key] ?? ''])
	) as Settings;
	return { ...settings, iban: groupIban(settings.iban) };
}

// A filled field that breaks its rule gets its message; an empty one is reset to its default
const RULES: [keyof Settings, (value: string) => boolean, () => string][] = [
	['companyPostalCode', (v) => /^\d{4}$/.test(v), m.buildings_error_postal_code_digits],
	[
		'iban',
		// Switzerland or Liechtenstein, as the QR-bill takes them (#191)
		(v) => /^(CH|LI)\d{7}[A-Z0-9]{12}$/.test(compact(v)) && ibanChecksumValid(compact(v)),
		m.settings_error_iban
	],
	['managementFeePercent', (v) => isFeeRate(parsePercent(v)), m.statements_error_fee],
	['paymentDeadlineDays', (v) => days(v, 7, 90), m.settings_error_payment_days],
	['reminderAfterDays', (v) => days(v, 7, 60), m.settings_error_reminder_days]
];

const settingsErrors = (s: Settings): Record<string, string> =>
	Object.fromEntries(
		RULES.filter(([field, valid]) => s[field] && !valid(s[field])).map(([field, , message]) => [
			field,
			message()
		])
	);

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
