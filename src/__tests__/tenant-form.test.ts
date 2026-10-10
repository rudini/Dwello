import { describe, it, expect } from 'vitest';
import { parseTenantForm } from '../lib/server/tenant-form';
import { runAction } from './helpers/action';
import { actions as newActions } from '../routes/tenants/new/+page.server';
import { actions as editActions } from '../routes/tenants/[id]/edit/+page.server';

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
		const { tenant, errors } = parseTenantForm(form(anna));

		expect(errors).toEqual({});
		expect(tenant).toEqual({
			firstName: 'Anna',
			lastName: 'Keller',
			email: 'anna.keller@example.com',
			phone: null,
			address: 'Ahornweg 3',
			postalCode: '8400',
			city: 'Winterthur',
			correspondenceChannel: 'email',
			language: 'fr'
		});
	});

	it('schreibt Deutsch, wenn keine bekannte Sprache gewählt ist', () => {
		expect(parseTenantForm(form({ ...anna, language: 'xx' })).tenant.language).toBe('de');
	});

	it('verlangt eine E-Mail-Adresse, wenn per E-Mail korrespondiert wird', () => {
		const { errors } = parseTenantForm(form({ ...anna, email: '' }));

		expect(errors.email).toBe(
			'Für die Korrespondenz per E-Mail ist eine E-Mail-Adresse erforderlich'
		);
	});

	it('verlangt eine vollständige Adresse, wenn per Brief korrespondiert wird', () => {
		const { errors } = parseTenantForm(
			form({ ...anna, email: '', address: '', city: '', correspondenceChannel: 'letter' })
		);

		expect(errors).toEqual({
			address: 'Für Briefe ist eine Adresse erforderlich',
			city: 'Für Briefe ist ein Ort erforderlich'
		});
	});

	it('prüft Namen, E-Mail-Format und PLZ', () => {
		const { errors } = parseTenantForm(
			form({ ...anna, firstName: ' ', lastName: '', email: 'anna@', postalCode: '84' })
		);

		expect(errors).toEqual({
			firstName: 'Vorname ist erforderlich',
			lastName: 'Nachname ist erforderlich',
			email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
			postalCode: 'PLZ muss 4 Ziffern haben'
		});
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

	it('speichert Änderungen und kehrt zur Detailseite zurück', async () => {
		const { calls, result } = runAction(editActions.default, 't1', 200, anna);

		await expect(result).rejects.toMatchObject({ status: 303, location: '/tenants/t1' });
		expect(calls[0]).toMatchObject({
			method: 'PUT',
			url: 'http://localhost:3001/api/v1/tenants/t1'
		});
	});

	it('speichert nichts, solange das Formular Fehler enthält', async () => {
		const { calls, result } = runAction(editActions.default, 't1', 200, { ...anna, lastName: '' });

		expect(await result).toMatchObject({
			data: { errors: { lastName: 'Nachname ist erforderlich' } }
		});
		expect(calls).toEqual([]);
	});

	it('meldet einen Fehler, wenn das Backend das Speichern ablehnt', async () => {
		const { result } = runAction(editActions.default, 't1', 400, anna);

		expect(await result).toMatchObject({
			data: { errors: { form: 'Mieter konnte nicht gespeichert werden.' } }
		});
	});
});
