/**
 * Building Routes
 * CRUD endpoints for building management
 */

import { Elysia, t } from 'elysia';
import { fieldsRefused, refusal } from '../services/coded-error';
import { apartmentFieldErrors, buildingFieldErrors, decimalOf } from '../services/building-fields';
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
	fuelStockFields,
	deleteFuelStock,
	isFuelCategory,
	listFuelStocks,
	otherTankCategory
} from '../services/fuel-stock.service';
import { numberTakenError } from './apartments';

const fuelStockParams = t.Object({ id: t.String({ format: 'uuid' }) });

// Validation schemas
const buildingQuerySchema = t.Object({
	search: t.Optional(t.String()),
	city: t.Optional(t.String()),
	canton: t.Optional(t.String()),
	limit: t.Optional(t.String()),
	offset: t.Optional(t.String())
});

// H-28 (#717): what the form checks is checked in `building-fields.ts`, so every field shows its own message
const buildingBodySchema = t.Object({
	name: t.String(),
	address: t.String(),
	postalCode: t.String(),
	city: t.String(),
	canton: t.String({ maxLength: 2 }),
	country: t.Optional(t.String()),
	latitude: t.Optional(t.Nullable(t.String())),
	longitude: t.Optional(t.Nullable(t.String())),
	buildingType: t.Optional(t.Nullable(t.String())),
	yearBuilt: t.Optional(t.Nullable(t.Number())),
	noTank: t.Optional(t.Boolean())
});

const buildingUpdateSchema = t.Partial(buildingBodySchema);

// A new building may bring its Wohnungen along (taken from the Gebäuderegister, #479), all created or none
const newApartmentSchema = t.Object({
	number: t.String({ maxLength: 20 }),
	floor: t.Union([t.Number(), t.String()]), // as entered in the form
	area: t.String(),
	rooms: t.String()
});
const buildingCreateSchema = t.Composite([
	buildingBodySchema,
	t.Object({ apartments: t.Optional(t.Array(newApartmentSchema)) })
]);

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
		async ({ body: { apartments = [], ...body }, set }) => {
			const invalid = [...buildingFieldErrors(body), ...apartmentFieldErrors(apartments)];
			if (invalid.length) {
				set.status = 400;
				return fieldsRefused(invalid);
			}
			const twice = apartments.find((a, i) => apartments.findIndex((b) => b.number === a.number) !== i);
			if (twice) {
				set.status = 409;
				return numberTakenError(twice.number);
			}
			try {
				const entered = apartments.map((a) => ({ ...a, floor: Number(a.floor), area: decimalOf(a.area), rooms: decimalOf(a.rooms) }));
				const building = await createBuilding(body, entered);
				set.status = 201;
				return building;
			} catch (error) {
				set.status = 400;
				return { error: error instanceof Error ? error.message : 'Failed to create building' };
			}
		},
		{
			body: buildingCreateSchema
		}
	)
	// Update building
	.put(
		'/:id',
		async ({ params, body, set }) => {
			const invalid = buildingFieldErrors(body);
			if (invalid.length) {
				set.status = 400;
				return fieldsRefused(invalid);
			}
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
			const { errors, amount } = fuelStockFields(body);
			if (errors.length) {
				set.status = 400;
				return fieldsRefused(errors);
			}
			if (!(await isFuelCategory(body.categoryId))) {
				set.status = 400;
				return { error: 'categoryId must be an allocable fuel category' };
			}
			if (await otherTankCategory(params.id, body.categoryId)) {
				set.status = 409;
				return refusal('FUEL_STOCK_OTHER_CATEGORY', 'The building records its fuel stock in another category');
			}
			const stock = await createFuelStock(params.id, { ...body, amount });
			if (!stock) {
				set.status = 409;
				return refusal('FUEL_STOCK_DATE_TAKEN', 'Fuel stock for this day already recorded');
			}
			set.status = 201;
			return stock;
		},
		{
			params: fuelStockParams,
			body: t.Object({
				readingDate: t.String(),
				amount: t.String(),
				categoryId: t.String()
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
