/**
 * Contract Routes
 * CRUD endpoints for rental contract management
 */

import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth';
import {
	listContracts,
	getContract,
	createContract,
	updateContract,
	deleteContract,
	BilledDaysError,
	getActiveContract,
	getContractsByPeriod
} from '../services/contract.service';
import { apartmentExists } from '../services/apartment.service';
import { tenantExists } from '../services/tenant.service';

// Validation schemas
const contractQuerySchema = t.Object({
	apartmentId: t.Optional(t.String()),
	tenantId: t.Optional(t.String()),
	buildingId: t.Optional(t.String()),
	status: t.Optional(t.Union([t.Literal('active'), t.Literal('ended'), t.Literal('future')])),
	search: t.Optional(t.String()),
	limit: t.Optional(t.String()),
	offset: t.Optional(t.String())
});

const contractBodySchema = t.Object({
	apartmentId: t.String({ format: 'uuid' }),
	tenantId: t.String({ format: 'uuid' }),
	startDate: t.String({ format: 'date' }),
	endDate: t.Optional(t.Nullable(t.String({ format: 'date' }))),
	terminated: t.Optional(t.Boolean()),
	baseRent: t.String(),
	additionalRent: t.Optional(t.Nullable(t.String())),
	monthlyAdvancePayment: t.String(),
	referenceIndex: t.Optional(t.Nullable(t.String())),
	contractPdf: t.Optional(t.Nullable(t.String())),
	notes: t.Optional(t.Nullable(t.String()))
});

const contractUpdateSchema = t.Partial(
	t.Object({
		startDate: t.String({ format: 'date' }),
		endDate: t.Optional(t.Nullable(t.String({ format: 'date' }))),
		terminated: t.Boolean(),
		baseRent: t.String(),
		additionalRent: t.Optional(t.Nullable(t.String())),
		monthlyAdvancePayment: t.String(),
		referenceIndex: t.Optional(t.Nullable(t.String())),
		contractPdf: t.Optional(t.Nullable(t.String())),
		notes: t.Optional(t.Nullable(t.String()))
	})
);

const periodQuerySchema = t.Object({
	periodStart: t.String({ format: 'date' }),
	periodEnd: t.String({ format: 'date' })
});

export const contractRoutes = new Elysia({ prefix: '/api/v1/contracts' })
	.use(authMiddleware)
	// List contracts with pagination and filters
	.get(
		'/',
		async ({ query }) => {
			const filters = {
				apartmentId: query.apartmentId,
				tenantId: query.tenantId,
				buildingId: query.buildingId,
				status: query.status,
				search: query.search,
				limit: query.limit ? parseInt(query.limit, 10) : undefined,
				offset: query.offset ? parseInt(query.offset, 10) : undefined
			};
			return await listContracts(filters);
		},
		{
			query: contractQuerySchema
		}
	)
	// Get single contract
	.get('/:id', async ({ params, set }) => {
		const contract = await getContract(params.id);
		if (!contract) {
			set.status = 404;
			return { error: 'Contract not found' };
		}
		return contract;
	})
	// Get active contract for apartment at date
	.get(
		'/apartment/:apartmentId/active',
		async ({ params, query, set }) => {
			const date = (query as { date?: string }).date || new Date().toISOString().split('T')[0];
			const contract = await getActiveContract(params.apartmentId, date);
			if (!contract) {
				set.status = 404;
				return { error: 'No active contract found for this apartment' };
			}
			return contract;
		},
		{
			query: t.Object({
				date: t.Optional(t.String({ format: 'date' }))
			})
		}
	)
	// Get contracts for apartment in a period (for prorating)
	.get(
		'/apartment/:apartmentId/period',
		async ({ params, query }) => {
			const { periodStart, periodEnd } = query;
			const contracts = await getContractsByPeriod(params.apartmentId, periodStart, periodEnd);
			return { contracts };
		},
		{
			query: periodQuerySchema
		}
	)
	// Create contract
	.post(
		'/',
		async ({ body, set }) => {
			// Verify apartment exists
			const apartmentOk = await apartmentExists(body.apartmentId);
			if (!apartmentOk) {
				set.status = 400;
				return { error: 'Apartment not found' };
			}

			// Verify tenant exists
			const tenantOk = await tenantExists(body.tenantId);
			if (!tenantOk) {
				set.status = 400;
				return { error: 'Tenant not found' };
			}

			try {
				const contract = await createContract(body);
				set.status = 201;
				return contract;
			} catch (error) {
				set.status = 400;
				return { error: error instanceof Error ? error.message : 'Failed to create contract' };
			}
		},
		{
			body: contractBodySchema
		}
	)
	// Update contract
	.put(
		'/:id',
		async ({ params, body, set }) => {
			try {
				const contract = await updateContract(params.id, body);
				if (!contract) {
					set.status = 404;
					return { error: 'Contract not found' };
				}
				return contract;
			} catch (error) {
				if (error instanceof BilledDaysError) {
					set.status = 409;
					return { error: error.message, statements: error.statements };
				}
				set.status = 400;
				return { error: error instanceof Error ? error.message : 'Failed to update contract' };
			}
		},
		{
			body: contractUpdateSchema
		}
	)
	// Delete contract
	.delete('/:id', async ({ params, set }) => {
		const result = await deleteContract(params.id);
		if (!result.success) {
			set.status = result.error === 'Contract not found' ? 404 : 400;
			return { error: result.error };
		}
		set.status = 204;
		return null;
	});
