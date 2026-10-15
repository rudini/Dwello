/**
 * Building Routes
 * CRUD endpoints for building management
 */

import { Elysia, t } from 'elysia';
import { refusal } from '../services/coded-error';
import { authMiddleware } from '../middleware/auth';
import {
	listBuildings,
	getBuilding,
	getBuildingWithApartments,
	createBuilding,
	updateBuilding,
	deleteBuilding,
	buildingExists
} from '../services/building.service';
import {
	createFuelStock,
	deleteFuelStock,
	isHeatingCategory,
	listFuelStocks,
	otherTankCategory
} from '../services/fuel-stock.service';
import { isRealDate } from '../services/real-date';

const fuelStockParams = t.Object({ id: t.String({ format: 'uuid' }) });

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
			return refusal('BUILDING_NOT_FOUND', 'Building not found');
		}
		return building;
	})
	// Get building with apartments
	.get('/:id/apartments', async ({ params, set }) => {
		const result = await getBuildingWithApartments(params.id);
		if (!result) {
			set.status = 404;
			return refusal('BUILDING_NOT_FOUND', 'Building not found');
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
				return refusal('BUILDING_NOT_FOUND', 'Building not found');
			}
			return building;
		},
		{
			body: buildingUpdateSchema
		}
	)
	// Heating oil in the tank on reading days (Tankbestand)
	.get(
		'/:id/fuel-stocks',
		async ({ params, set }) => {
			if (!(await buildingExists(params.id))) {
				set.status = 404;
				return refusal('BUILDING_NOT_FOUND', 'Building not found');
			}
			return await listFuelStocks(params.id);
		},
		{ params: fuelStockParams }
	)
	.post(
		'/:id/fuel-stocks',
		async ({ params, body, set }) => {
			if (!(await buildingExists(params.id))) {
				set.status = 404;
				return refusal('BUILDING_NOT_FOUND', 'Building not found');
			}
			if (!isRealDate(body.readingDate) || !(await isHeatingCategory(body.categoryId))) {
				set.status = 400;
				return { error: 'readingDate must exist and categoryId must be an allocable heating cost category' };
			}
			if (await otherTankCategory(params.id, body.categoryId)) {
				set.status = 409;
				return { error: 'The building records its fuel stock in another category' };
			}
			const stock = await createFuelStock(params.id, body);
			if (!stock) {
				set.status = 409;
				return { error: 'Fuel stock for this day already recorded' };
			}
			set.status = 201;
			return stock;
		},
		{
			params: fuelStockParams,
			body: t.Object({
				readingDate: t.String({ format: 'date' }),
				amount: t.String({ pattern: '^\\d+(\\.\\d{1,2})?$' }),
				categoryId: t.String({ format: 'uuid' })
			})
		}
	)
	.delete(
		'/:id/fuel-stocks/:stockId',
		async ({ params, set }) => {
			if (!(await deleteFuelStock(params.id, params.stockId))) {
				set.status = 404;
				return { error: 'Fuel stock not found' };
			}
			set.status = 204;
			return null;
		},
		{ params: t.Object({ id: t.String({ format: 'uuid' }), stockId: t.String({ format: 'uuid' }) }) }
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
