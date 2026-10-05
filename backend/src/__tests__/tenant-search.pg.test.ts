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
		const response = await callApi(
			`/api/v1/tenants?search=${encodeURIComponent(`Hans Müller ${token}`)}`
		);
		const result = (await response.json()) as { tenants: { id: string }[] };

		expect(result.tenants.map((t) => t.id)).toEqual([tenantId]);
	});
});
