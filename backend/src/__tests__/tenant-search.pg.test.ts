/**
 * Tenant search (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { callApi } from './helpers/auth';

const token = crypto.randomUUID();
let tenantId: string;

beforeAll(async () => {
	tenantId = (await createTenant({ firstName: 'Hans', lastName: `Müller ${token}` })).id;
});

afterAll(async () => {
	await deleteTenant(tenantId);
});

describe('GET /api/v1/tenants?search', () => {
	it('findet Mieter über Vor- und Nachnamen', async () => {
		const response = await callApi(`/api/v1/tenants?search=${encodeURIComponent(`Hans Müller ${token}`)}`);
		const result = (await response.json()) as { tenants: { id: string }[] };

		expect(result.tenants.map((t) => t.id)).toEqual([tenantId]);
	});
});

// #1316: % and _ in the search are characters, not wildcards
describe('GET /api/v1/tenants?search mit % und _', () => {
	it('findet mit _ und % den Mieter, dessen Name sie enthält', async () => {
		const id = (await createTenant({ firstName: 'Lea_Graf', lastName: `100% ${token}` })).id;
		try {
			const response = await callApi(`/api/v1/tenants?search=${encodeURIComponent(`Lea_Graf 100% ${token}`)}`);
			expect(((await response.json()) as { tenants: { id: string }[] }).tenants.map((t) => t.id)).toEqual([id]);
		} finally {
			await deleteTenant(id);
		}
	});

	it('findet mit _ oder % keinen Mieter, dessen Name dort ein anderes Zeichen hat', async () => {
		for (const term of [`Hans_Müller ${token}`, `Hans%${token}`]) {
			const response = await callApi(`/api/v1/tenants?search=${encodeURIComponent(term)}`);
			expect(((await response.json()) as { tenants: unknown[] }).tenants).toEqual([]);
		}
	});
});
