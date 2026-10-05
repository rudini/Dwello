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

	it('lehnt unbekannte Kanäle ab', async () => {
		const response = await send('POST', '', { firstName: 'Carla', lastName: 'Test', correspondenceChannel: 'fax' });

		expect(response.status).toBe(422);
	});
});
