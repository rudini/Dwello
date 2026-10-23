/**
 * Correspondence channel of a tenant (real PostgreSQL database)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { deleteTenant } from '../services/tenant.service';
import { callApi } from './helpers/auth';

const created: string[] = [];

const send = async (method: string, path: string, body: object) =>
	(await callApi(`/api/v1/tenants${path}`, {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	})) as Response;

afterAll(async () => {
	for (const id of created) await deleteTenant(id);
});

describe('Korrespondenzkanal des Mieters', () => {
	it('schreibt neuen Mietern per Brief, solange nichts anderes gewählt ist', async () => {
		const tenant = (await (await send('POST', '', { firstName: 'Anna', lastName: crypto.randomUUID() })).json()) as {
			id: string;
			correspondenceChannel: string;
		};
		created.push(tenant.id);

		expect(tenant.correspondenceChannel).toBe('letter');
	});

	it('speichert den Kanal E-Mail beim Erfassen', async () => {
		const tenant = (await (
			await send('POST', '', {
				firstName: 'Bruno',
				lastName: crypto.randomUUID(),
				email: 'bruno@example.com',
				correspondenceChannel: 'email'
			})
		).json()) as { id: string; correspondenceChannel: string };
		created.push(tenant.id);

		expect(tenant.correspondenceChannel).toBe('email');
	});

	it('wechselt den Kanal beim Bearbeiten auf E-Mail', async () => {
		const tenant = (await (
			await send('POST', '', { firstName: 'Cora', lastName: crypto.randomUUID(), email: 'cora@example.com' })
		).json()) as { id: string };
		created.push(tenant.id);

		const updated = (await (await send('PUT', `/${tenant.id}`, { correspondenceChannel: 'email' })).json()) as {
			correspondenceChannel: string;
		};
		expect(updated.correspondenceChannel).toBe('email');
	});

	it('lehnt unbekannte Sprachen ab', async () => {
		const response = await send('POST', '', { firstName: 'Dora', lastName: 'Test', language: 'xx' });

		expect(response.status).toBe(422);
	});

	it('lehnt unbekannte Kanäle ab', async () => {
		const response = await send('POST', '', { firstName: 'Carla', lastName: 'Test', correspondenceChannel: 'fax' });

		expect(response.status).toBe(422);
	});
});

// H-28 (#717): the checks of the form are the backend's; every failed one with its field, nothing saved
describe('Prüfung des Mieterformulars', () => {
	it('nennt jedes ungültige Feld mit seinem Code und legt nichts an', async () => {
		const lastName = crypto.randomUUID();
		const response = await send('POST', '', { firstName: '', lastName, email: 'anna@', postalCode: '84', correspondenceChannel: 'email' });

		expect(response.status).toBe(400);
		const { causes } = (await response.json()) as { causes: { code: string; params: { field: string } }[] };
		expect(causes.map(({ code, params }) => [params.field, code])).toEqual([
			['firstName', 'TENANT_FIRST_NAME_REQUIRED'],
			['email', 'TENANT_EMAIL_INVALID'],
			['postalCode', 'POSTAL_CODE_DIGITS']
		]);
		const listed = (await (await callApi(`/api/v1/tenants?search=${lastName}`)).json()) as { tenants: unknown[] };
		expect(listed.tenants).toEqual([]);
	});

	it('verlangt beim Ändern auf Briefe die Adresse und ändert nichts', async () => {
		const tenant = (await (await send('POST', '', { firstName: 'Clara', lastName: crypto.randomUUID() })).json()) as { id: string };
		created.push(tenant.id);

		const response = await send('PUT', `/${tenant.id}`, { address: null, postalCode: null, city: null, correspondenceChannel: 'letter' });

		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({ code: 'TENANT_ADDRESS_LETTER', causes: [{ params: { field: 'address' } }, { params: { field: 'postalCode' } }, { params: { field: 'city' } }] });
	});

	// code review K-3: a new tenant without the address its channel needs is refused, also when the field is not sent
	it('verlangt beim Erfassen per E-Mail eine E-Mail-Adresse, auch ohne das Feld', async () => {
		const response = await send('POST', '', { firstName: 'Dora', lastName: crypto.randomUUID(), correspondenceChannel: 'email' });

		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({ code: 'TENANT_EMAIL_REQUIRED' });
	});

	// code review K-2: a change of the PLZ alone keeps the stored country
	it('nimmt beim Ändern die PLZ eines Mieters im Ausland an', async () => {
		const tenant = (await (await send('POST', '', { firstName: 'Emil', lastName: crypto.randomUUID(), country: 'DE' })).json()) as { id: string };
		created.push(tenant.id);

		const response = await send('PUT', `/${tenant.id}`, { postalCode: '78462' });

		expect(response.status).toBe(200);
	});
});
