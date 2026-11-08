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
	accountHolderName: 'account_holder_name',
	accountHolderAddress: 'account_holder_address',
	accountHolderPostalCode: 'account_holder_postal_code',
	accountHolderCity: 'account_holder_city',
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

/**
 * #686 O-6: the days sending gives a draft's Zahlungsfrist, said at its date (detail and edit page); none when the
 * settings do not load
 */
export async function paymentDeadlineDays(fetch: typeof globalThis.fetch) {
	const response = await fetch(API).catch(() => null);
	if (!response?.ok) return undefined;
	const days = Number(toSettings((await response.json()).data ?? {}).paymentDeadlineDays);
	return days > 0 ? days : undefined;
}

const FIELDS: Record<string, string> = Object.fromEntries(Object.entries(KEYS).map(([field, key]) => [key, field]));

/** Saves every field as typed; the backend checks them (H-28, #717) and resets the emptied ones to their default */
export async function saveSettings(fetch: typeof globalThis.fetch, request: Request) {
	const formData = await request.formData();
	// #1166: while «Kontoinhaber ist der Absender» is ticked, a stored Kontoinhaber is deleted
	const holderIsSender = formData.has('accountHolderIsSender');
	const typed = Object.fromEntries(
		Object.entries(KEYS).map(([field, key]) => [
			key,
			holderIsSender && key.startsWith('account_holder_')
				? ''
				: String(formData.get(field) ?? '').trim()
		])
	);
	typed.account_holder_separate = holderIsSender ? '' : 'true';
	const saved = await fetch(API, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(typed)
	});
	if (saved.ok) return { saved: true };

	const refused = (await saved.json().catch(() => ({}))) as BackendError;
	if (!refused.causes) return fail(400, { errors: { form: m.settings_save_failed() } as Record<string, string> });
	return fail(400, atFields(refused.causes));
}

/** Each refusal at the field of its key; the Firmenadresse and the Kontoinhaber an IBAN needs (#450, #1166) marked
 * where empty: of a refused save, or of the stored IBAN on opening (#690) */
export function atFields(refusals: NonNullable<BackendError['causes']>) {
	const causes = refusals.map((cause) => ({
		...cause,
		params: { ...cause.params, field: FIELDS[String(cause.params?.field)] ?? 'form' }
	}));
	const missing = refusals.flatMap((cause) =>
		String(cause.params?.missing ?? '')
			.split(',')
			.filter(Boolean)
			.map((key) => FIELDS[key])
	);
	return { errors: refusedFields({ causes }), missing };
}
