/**
 * H-28 (#717): the checks of the tenant form are the backend's (product owner 23.10.2026: form validation belongs in
 * the backend); each failed check names its field, so the form shows it there
 */
import { describe, expect, it } from 'bun:test';
import { tenantFieldErrors } from '../services/tenant-fields';

const anna = {
	firstName: 'Anna',
	lastName: 'Keller',
	email: 'anna.keller@example.com',
	address: 'Ahornweg 3',
	postalCode: '8400',
	city: 'Winterthur',
	country: 'CH',
	correspondenceChannel: 'email' as const
};
const fields = (t: Parameters<typeof tenantFieldErrors>[0]) => tenantFieldErrors(t).map(({ code, params }) => [params.field, code]);

describe('Prüfung des Mieterformulars', () => {
	it('lässt einen vollständigen Mieter durch', () => {
		expect(fields(anna)).toEqual([]);
	});

	it('prüft Namen, E-Mail-Format und PLZ', () => {
		expect(fields({ ...anna, firstName: ' ', lastName: '', email: 'anna@', postalCode: '84' })).toEqual([
			['firstName', 'TENANT_FIRST_NAME_REQUIRED'],
			['lastName', 'TENANT_LAST_NAME_REQUIRED'],
			['email', 'TENANT_EMAIL_INVALID'],
			['postalCode', 'POSTAL_CODE_DIGITS']
		]);
	});

	// a postal code abroad has its own form; Liechtenstein has Swiss postal codes (#102)
	it('prüft die vier Ziffern der PLZ nur in der Schweiz und in Liechtenstein', () => {
		expect(fields({ ...anna, country: 'DE', postalCode: '78462' })).toEqual([]);
		expect(fields({ ...anna, country: 'LI', postalCode: '949' })).toEqual([['postalCode', 'POSTAL_CODE_DIGITS']]);
	});

	// reminders and other documents go out by e-mail or letter, so the chosen channel needs its address
	it('verlangt eine E-Mail-Adresse, wenn per E-Mail korrespondiert wird', () => {
		expect(fields({ ...anna, email: null })).toEqual([['email', 'TENANT_EMAIL_REQUIRED']]);
	});

	// without a PLZ a letter hardly arrives, and the QR-bill names the tenant only with PLZ and Ort
	it('verlangt eine vollständige Adresse, wenn per Brief korrespondiert wird', () => {
		expect(fields({ ...anna, email: null, address: null, postalCode: null, city: '', correspondenceChannel: 'letter' })).toEqual([
			['address', 'TENANT_ADDRESS_LETTER'],
			['postalCode', 'TENANT_POSTAL_CODE_LETTER'],
			['city', 'TENANT_CITY_LETTER']
		]);
	});

	// an invalid address weighs more than a missing one: one message per field, as in the form
	it('nennt bei einer ungültigen E-Mail-Adresse nur die Ungültigkeit', () => {
		expect(fields({ ...anna, email: 'anna@' })).toEqual([['email', 'TENANT_EMAIL_INVALID']]);
	});

	// a change in part checks only what it sends; without the country the PLZ's form is unknown (code review K-2)
	it('prüft beim Ändern nur die gesendeten Felder', () => {
		expect(fields({ postalCode: '78462' })).toEqual([]);
		expect(fields({ postalCode: '84', country: 'CH' })).toEqual([['postalCode', 'POSTAL_CODE_DIGITS']]);
		expect(fields({ language: 'fr' } as never)).toEqual([]);
	});
});
