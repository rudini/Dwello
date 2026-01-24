/**
 * Apartment Routes
 * CRUD endpoints for apartment management
 */

import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth';
import {
	listApartments,
	getApartment,
	getApartmentWithHistory,
	createApartment,
	updateApartment,
	deleteApartment
} from '../services/apartment.service';
import { buildingExists } from '../services/building.service';

// Validation schemas
const apartmentQuerySchema = t.Object({
	buildingId: t.Optional(t.String()),
	status: t.Optional(t.Union([t.Literal('occupied'), t.Literal('vacant'), t.Literal('reserved')])),
	floor: t.Optional(t.String()),
	limit: t.Optional(t.String()),
	offset: t.Optional(t.String())
});

const apartmentBodySchema = t.Object({
	buildingId: t.String({ format: 'uuid' }),
	number: t.String({ minLength: 1 }),
	floor: t.Number(),
	area: t.Optional(t.Nullable(t.String())),
	rooms: t.Optional(t.Nullable(t.String())),
	status: t.Optional(t.Union([t.Literal('occupied'), t.Literal('vacant'), t.Literal('reserved')]))
});

const apartmentUpdateSchema = t.Partial(
	t.Object({
		number: t.String({ minLength: 1 }),
		floor: t.Number(),
		area: t.Optional(t.Nullable(t.String())),
		rooms: t.Optional(t.Nullable(t.String())),
		status: t.Optional(
			t.Union([t.Literal('occupied'), t.Literal('vacant'), t.Literal('reserved')])
		)
	})
);

export const apartmentRoutes = new Elysia({ prefix: '/api/v1/apartments' })
	.use(authMiddleware)
	// List apartments with pagination and filters
	.get(
		'/',
		async ({ query }) => {
			const filters = {
				buildingId: query.buildingId,
				status: query.status,
				floor: query.floor ? parseInt(query.floor, 10) : undefined,
				limit: query.limit ? parseInt(query.limit, 10) : undefined,
				offset: query.offset ? parseInt(query.offset, 10) : undefined
			};
			return await listApartments(filters);
		},
		{
			query: apartmentQuerySchema
		}
	)
	// Get single apartment
	.get('/:id', async ({ params, set }) => {
		const apartment = await getApartment(params.id);
		if (!apartment) {
			set.status = 404;
			return { error: 'Apartment not found' };
		}
		return apartment;
	})
	// Get apartment with contract history
	.get('/:id/history', async ({ params, set }) => {
		const result = await getApartmentWithHistory(params.id);
		if (!result) {
			set.status = 404;
			return { error: 'Apartment not found' };
		}
		return result;
	})
	// Create apartment
	.post(
		'/',
		async ({ body, set }) => {
			// Verify building exists
			const exists = await buildingExists(body.buildingId);
			if (!exists) {
				set.status = 400;
				return { error: 'Building not found' };
			}

			try {
				const apartment = await createApartment(body);
				set.status = 201;
				return apartment;
			} catch (error) {
				set.status = 400;
				return { error: error instanceof Error ? error.message : 'Failed to create apartment' };
			}
		},
		{
			body: apartmentBodySchema
		}
	)
	// Update apartment
	.put(
		'/:id',
		async ({ params, body, set }) => {
			const apartment = await updateApartment(params.id, body);
			if (!apartment) {
				set.status = 404;
				return { error: 'Apartment not found' };
			}
			return apartment;
		},
		{
			body: apartmentUpdateSchema
		}
	)
	// Delete apartment
	.delete('/:id', async ({ params, set }) => {
		const result = await deleteApartment(params.id);
		if (!result.success) {
			set.status = result.error === 'Apartment not found' ? 404 : 400;
			return { error: result.error };
		}
		set.status = 204;
		return null;
	});
