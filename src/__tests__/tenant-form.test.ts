import { describe, it, expect } from 'vitest';
import { parseTenantForm } from '../lib/server/tenant-form';
import { runAction } from './helpers/action';
import { actions as newActions } from '../routes/tenants/new/+page.server';
import { actions as editActions } from '../routes/tenants/[id]/edit/+page.server';
import fieldsRefused from '../../tests/contracts/tenant-fields-refused.json';

const form = (fields: Record<string, string>) => {
	const data = new FormData();
	for (const [name, value] of Object.entries(fields)) data.append(name, value);
	return data;
};

const anna = {
	firstName: 'Anna',
	lastName: 'Keller',
	email: 'anna.keller@example.com',
	phone: '',
	address: 'Ahornweg 3',
	postalCode: '8400',
	city: 'Winterthur',
	correspondenceChannel: 'email',
	language: 'fr'
};

describe('Mieterformular', () => {
	it('übernimmt Kontaktdaten, Korrespondenzkanal und Sprache', () => {
		const { tenant } = parseTenantForm(form(anna));

		expect(tenant).toEqual({
			firstName: 'Anna',
			lastName: 'Keller',
			email: 'anna.keller@example.com',
			phone: null,
			address: 'Ahornweg 3',
			postalCode: '8400',
			city: 'Winterthur',
			country: 'CH',
			correspondenceChannel: 'email',
			language: 'fr'
		});
	});

	// Ohne Angabe liegt die Korrespondenzadresse in der Schweiz (#102)
	it('übernimmt das Land der Korrespondenzadresse, sonst die Schweiz', () => {
		expect(parseTenantForm(form({ ...anna, country: 'DE' })).tenant.country).toBe('DE');
		expect(parseTenantForm(form({ ...anna, country: 'XX' })).tenant.country).toBe('CH');
	});

	it('schreibt Deutsch, wenn keine bekannte Sprache gewählt ist', () => {
		expect(parseTenantForm(form({ ...anna, language: 'xx' })).tenant.language).toBe('de');
	});

	// H-28 (#717): the checks are the backend's (backend/src/__tests__/tenant-fields.test.ts); the form sends the fields
	it('sendet auch leere Felder, damit das Backend jedes nennt', async () => {
		const { calls, result } = runAction(newActions.default, '', 400, { ...anna, firstName: '', email: '' }, fieldsRefused);
		await result;

		expect(calls[0].body).toMatchObject({ firstName: '', email: null });
	});
});

describe('Mieter speichern', () => {
	it('erstellt den Mieter und öffnet seine Detailseite', async () => {
		const { calls, result } = runAction(newActions.default, '', 201, anna);

		await expect(result).rejects.toMatchObject({ status: 303 });
		expect(calls[0]).toMatchObject({ method: 'POST', url: 'http://localhost:3001/api/v1/tenants' });
		expect(calls[0].body).toMatchObject({ lastName: 'Keller', correspondenceChannel: 'email' });
	});

	it('kehrt zum angefangenen Mietvertrag zurück, wenn der Mieter dort erfasst wurde', async () => {
		const { calls, result } = runAction(
			newActions.default,
			'',
			201,
			{ ...anna, for: 'contract' },
			{ id: 't9' }
		);

		await expect(result).rejects.toMatchObject({
			status: 303,
			location: '/contracts/new?tenant=t9&created=1'
		});
		expect(calls[0].body).not.toHaveProperty('for');
	});

	// P-17 (#144): die im Mietvertrag vorgewählte Wohnung geht auf dem Umweg nicht verloren
	it('gibt dem Mietvertrag die vorgewählte Wohnung zurück', async () => {
		const { calls, result } = runAction(
			newActions.default,
			'',
			201,
			{ ...anna, for: 'contract', apartment: 'a1' },
			{ id: 't9' }
		);

		await expect(result).rejects.toMatchObject({
			status: 303,
			location: '/contracts/new?tenant=t9&created=1&apartment=a1'
		});
		expect(calls[0].body).not.toHaveProperty('apartment');
	});

	it('speichert Änderungen und kehrt zur Detailseite zurück', async () => {
		const { calls, result } = runAction(editActions.default, 't1', 200, anna);

		await expect(result).rejects.toMatchObject({ status: 303, location: '/tenants/t1' });
		expect(calls[0]).toMatchObject({
			method: 'PUT',
			url: 'http://localhost:3001/api/v1/tenants/t1'
		});
	});

	it('zeigt jede Ablehnung des Backends an ihrem Feld', async () => {
		const { result } = runAction(editActions.default, 't1', 400, anna, fieldsRefused);

		expect(await result).toMatchObject({
			status: 400,
			data: {
				errors: {
					firstName: 'Vorname ist erforderlich.',
					email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
					postalCode: 'PLZ muss 4 Ziffern haben.'
				}
			}
		});
	});

	it('meldet einen Fehler, wenn das Backend das Speichern ablehnt', async () => {
		const { result } = runAction(editActions.default, 't1', 400, anna);

		expect(await result).toMatchObject({
			data: { errors: { form: 'Mieter konnte nicht gespeichert werden.' } }
		});
	});
});
