import { fail } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';
import { refusedFields, type BackendError } from '$lib/backend-error';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/config`;

// Form field → backend configuration key
const KEYS = {
	companyName: 'company_name',
	companyAddress: 'company_address',
	companyPostalCode: 'company_postal_code',
	companyCity: 'company_city',
	companyPhone: 'company_phone',
	companyEmail: 'company_email',
	iban: 'iban',
	accountingPeriod: 'accounting_period',
	managementFeePercent: 'management_fee_pct',
	defaultHeatingProfileId: 'default_heating_profile_id',
	defaultDistributionKeyId: 'default_distribution_key_id',
	paymentDeadlineDays: 'payment_deadline_days',
	reminderAfterDays: 'reminder_after_days'
} as const;

export type Settings = Record<keyof typeof KEYS, string>;

/** "CH93 0076 2011 6238 5295 7" */
const groupIban = (iban: string) =>
	iban
		.replace(/\s/g, '')
		.toUpperCase()
		.replace(/(.{4})(?=.)/g, '$1 ');

export function toSettings(stored: Record<string, string | null>): Settings {
	const settings = Object.fromEntries(
		Object.entries(KEYS).map(([field, key]) => [field, stored[key] ?? ''])
	) as Settings;
	return { ...settings, iban: groupIban(settings.iban) };
}

const FIELDS: Record<string, string> = Object.fromEntries(Object.entries(KEYS).map(([field, key]) => [key, field]));

/** Saves every field as typed; the backend checks them (H-28, #717) and resets the emptied ones to their default */
export async function saveSettings(fetch: typeof globalThis.fetch, request: Request) {
	const formData = await request.formData();
	const typed = Object.fromEntries(
		Object.entries(KEYS).map(([field, key]) => [key, String(formData.get(field) ?? '').trim()])
	);
	const saved = await fetch(API, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(typed)
	});
	if (saved.ok) return { saved: true };

	const refused = (await saved.json().catch(() => ({}))) as BackendError;
	if (!refused.causes) return fail(400, { errors: { form: m.settings_save_failed() } as Record<string, string> });
	// each at the field of its key; the Firmenadresse an IBAN needs (#450) marked where it is empty
	const causes = refused.causes.map((cause) => ({
		...cause,
		params: { ...cause.params, field: FIELDS[String(cause.params?.field)] ?? 'form' }
	}));
	const missing = refused.causes.flatMap((cause) =>
		String(cause.params?.missing ?? '')
			.split(',')
			.filter(Boolean)
			.map((key) => FIELDS[key])
	);
	return fail(400, { errors: refusedFields({ causes }), missing });
}
