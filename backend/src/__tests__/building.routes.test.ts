/**
 * Route tests for building endpoints
 * Request validation with a mocked building service
 */

import { describe, it, expect, mock } from 'bun:test';
import * as jose from 'jose';

const updateBuilding = mock(async (id: string, data: Record<string, unknown>) => ({ id, ...data }));

mock.module('../services/building.service', () => ({
	listBuildings: mock(),
	getBuilding: mock(),
	getBuildingWithApartments: mock(),
	createBuilding: mock(),
	updateBuilding,
	deleteBuilding: mock()
}));

const { buildingRoutes } = await import('../routes/buildings');

async function put(body: unknown) {
	const secret = new TextEncoder().encode(
		process.env.JWT_SECRET || 'development-secret-key-change-in-production'
	);
	const token = await new jose.SignJWT({ email: 'test@example.com', name: 'Test', provider: 'google' })
		.setProtectedHeader({ alg: 'HS256' })
		.setSubject('test-user')
		.setIssuedAt()
		.setExpirationTime('5m')
		.sign(secret);

	return buildingRoutes.handle(
		new Request('http://localhost/api/v1/buildings/b1', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
			body: JSON.stringify(body)
		})
	);
}

describe('PUT /api/v1/buildings/:id', () => {
	it('accepts null to clear the building type', async () => {
		const response = await put({ buildingType: null });

		expect(response.status).toBe(200);
		expect(updateBuilding).toHaveBeenCalledWith('b1', { buildingType: null });
	});

	it('rejects a building type that is not a string', async () => {
		const response = await put({ buildingType: 5 });

		expect(response.status).toBe(422);
	});
});
