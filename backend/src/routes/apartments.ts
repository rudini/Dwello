/**
 * Apartment Routes
 * CRUD endpoints for apartment management
 */

import { Elysia, t } from 'elysia';
import { refusal } from '../services/coded-error';
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

// Apartment numbers are unique per building (apartments_building_number_idx)
// Drizzle wraps the PostgreSQL error (DrizzleQueryError.cause)
const numberTaken = (error: unknown) => {
	const { code, cause } = error as { code?: string; cause?: { code?: string } };
	return (code ?? cause?.code) === '23505';
};
export const numberTakenError = (number: string) =>
	refusal('APARTMENT_NUMBER_TAKEN', `Die Wohnungsnummer ${number} existiert bereits in diesem Gebäude.`, { number });

// Validation schemas
// "occupied" follows from the rental contracts, the property manager sets only vacant or reserved
const manualStatus = t.Union([t.Literal('vacant'), t.Literal('reserved')]);
const apartmentQuerySchema = t.Object({
	search: t.Optional(t.String()),
	buildingId: t.Optional(t.String()),
	status: t.Optional(
		t.Union([t.Literal('occupied'), t.Literal('relet'), t.Literal('vacant'), t.Literal('reserved')])
	),
	floor: t.Optional(t.String()),
	limit: t.Optional(t.String()),
	offset: t.Optional(t.String())
});

const apartmentBodySchema = t.Object({
	buildingId: t.String({ format: 'uuid' }),
	number: t.String({ minLength: 1 }),
	floor: t.Number(),
	area: t.String(),
	rooms: t.String(),
	status: t.Optional(manualStatus)
});

const apartmentUpdateSchema = t.Partial(
	t.Object({
		number: t.String({ minLength: 1 }),
		floor: t.Number(),
		area: t.String(),
		rooms: t.String(),
		status: t.Optional(manualStatus)
	})
);

export const apartmentRoutes = new Elysia({ prefix: '/api/v1/apartments' })
	.use(authMiddleware)
	// List apartments with pagination and filters
	.get(
		'/',
		async ({ query }) => {
			const filters = {
				search: query.search,
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
				if (numberTaken(error)) {
					set.status = 409;
					return numberTakenError(body.number);
				}
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
			let apartment;
			try {
				apartment = await updateApartment(params.id, body);
			} catch (error) {
				if (!numberTaken(error)) throw error;
				set.status = 409;
				return numberTakenError(body.number!);
			}
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
