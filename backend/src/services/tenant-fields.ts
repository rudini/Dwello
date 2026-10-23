/**
 * H-28 (#717): the checks of the tenant form (product owner 23.10.2026: form validation belongs in the backend). Each
 * failed check is a code with the field it is about, one per field, all of them at once.
 */
import type { ErrorCode } from './coded-error';

type Entered = {
	firstName?: string;
	lastName?: string;
	email?: string | null;
	address?: string | null;
	postalCode?: string | null;
	city?: string | null;
	country?: string;
	correspondenceChannel?: 'email' | 'letter';
};

const blank = (value: unknown) => String(value ?? '').trim() === '';

/** The tenant's fields; a field not sent (a change in part) is not checked */
export function tenantFieldErrors(t: Entered): ErrorCode[] {
	// one error per field; a later check (an invalid value) replaces an earlier one (a missing value)
	const errors = new Map<string, string>();
	const check = (field: keyof Entered, failed: boolean, { code }: { code: string }) => {
		if (field in t && failed) errors.set(field, code);
	};
	// reminders and other documents go out by e-mail or letter, so the chosen channel needs its address
	const channel = t.correspondenceChannel;
	check('email', channel === 'email' && blank(t.email), { code: 'TENANT_EMAIL_REQUIRED' });
	check('address', channel === 'letter' && blank(t.address), { code: 'TENANT_ADDRESS_LETTER' });
	check('postalCode', channel === 'letter' && blank(t.postalCode), { code: 'TENANT_POSTAL_CODE_LETTER' });
	check('city', channel === 'letter' && blank(t.city), { code: 'TENANT_CITY_LETTER' });
	check('firstName', blank(t.firstName), { code: 'TENANT_FIRST_NAME_REQUIRED' });
	check('lastName', blank(t.lastName), { code: 'TENANT_LAST_NAME_REQUIRED' });
	check('email', !blank(t.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.email!.trim()), { code: 'TENANT_EMAIL_INVALID' });
	// Liechtenstein has Swiss postal codes; abroad each country has its own form (#102)
	const swiss = ['CH', 'LI'].includes(t.country ?? 'CH');
	check('postalCode', swiss && !blank(t.postalCode) && !/^\d{4}$/.test(t.postalCode!.trim()), { code: 'POSTAL_CODE_DIGITS' });
	return [...errors].map(([field, code]) => ({ code, params: { field } }));
}
