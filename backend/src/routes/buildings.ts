/**
 * Building Routes
 * CRUD endpoints for building management
 */

import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth';
import {
	listBuildings,
	getBuilding,
	getBuildingWithApartments,
	createBuilding,
	updateBuilding,
	deleteBuilding
} from '../services/building.service';

// Validation schemas
const buildingQuerySchema = t.Object({
	search: t.Optional(t.String()),
	city: t.Optional(t.String()),
	canton: t.Optional(t.String()),
	limit: t.Optional(t.String()),
	offset: t.Optional(t.String())
});

const buildingBodySchema = t.Object({
	name: t.String({ minLength: 1 }),
	address: t.String({ minLength: 1 }),
	postalCode: t.String({ minLength: 4, maxLength: 10 }),
	city: t.String({ minLength: 1 }),
	canton: t.String({ minLength: 2, maxLength: 2 }),
	country: t.Optional(t.String()),
	latitude: t.Optional(t.Nullable(t.String())),
	longitude: t.Optional(t.Nullable(t.String())),
	buildingType: t.Optional(t.Nullable(t.String())),
	yearBuilt: t.Optional(t.Nullable(t.Number()))
});

const buildingUpdateSchema = t.Partial(buildingBodySchema);

export const buildingRoutes = new Elysia({ prefix: '/api/v1/buildings' })
	.use(authMiddleware)
	// List buildings with pagination and filters
	.get(
		'/',
		async ({ query }) => {
			const filters = {
				search: query.search,
				city: query.city,
				canton: query.canton,
				limit: query.limit ? parseInt(query.limit, 10) : undefined,
				offset: query.offset ? parseInt(query.offset, 10) : undefined
			};
			return await listBuildings(filters);
		},
		{
			query: buildingQuerySchema
		}
	)
	// Get single building
	.get('/:id', async ({ params, set }) => {
		const building = await getBuilding(params.id);
		if (!building) {
			set.status = 404;
			return { error: 'Building not found' };
		}
		return building;
	})
	// Get building with apartments
	.get('/:id/apartments', async ({ params, set }) => {
		const result = await getBuildingWithApartments(params.id);
		if (!result) {
			set.status = 404;
			return { error: 'Building not found' };
		}
		return result;
	})
	// Create building
	.post(
		'/',
		async ({ body, set }) => {
			try {
				const building = await createBuilding(body);
				set.status = 201;
				return building;
			} catch (error) {
				set.status = 400;
				return { error: error instanceof Error ? error.message : 'Failed to create building' };
			}
		},
		{
			body: buildingBodySchema
		}
	)
	// Update building
	.put(
		'/:id',
		async ({ params, body, set }) => {
			const building = await updateBuilding(params.id, body);
			if (!building) {
				set.status = 404;
				return { error: 'Building not found' };
			}
			return building;
		},
		{
			body: buildingUpdateSchema
		}
	)
	// Delete building
	.delete('/:id', async ({ params, set }) => {
		const result = await deleteBuilding(params.id);
		if (!result.success) {
			set.status = result.error === 'Building not found' ? 404 : 400;
			return { error: result.error };
		}
		set.status = 204;
		return null;
	});
