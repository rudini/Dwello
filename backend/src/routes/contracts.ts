/**
 * Contract Routes
 * CRUD endpoints for rental contract management
 */

import { Elysia, t } from 'elysia';
import { errorBody, refusal } from '../services/coded-error';
import { advancesOf, deleteAdvance } from '../services/advance-payment.service';
import { agreedCategoryIds, agreedFromDays, agreementsInPeriod, answerAgreement, checkAgreedFrom } from '../services/agreed-category.service';
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
import { apartmentExists, getApartment } from '../services/apartment.service';
import { tenantExists } from '../services/tenant.service';
import { swissToday } from '../services/today';

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

// «Verwaltungspauschale vereinbart» (#89): without it a contract has none; an own rate greater than 0 up to 10 %
// (#124; 0 % means «Nein», #447)
const managementFee = {
	managementFeeAgreed: t.Optional(t.Boolean()),
	managementFeePercent: t.Optional(
		t.Nullable(t.String({ pattern: '^(10(\\.0{1,2})?|[1-9](\\.\\d{1,2})?|0\\.(0[1-9]|[1-9]\\d?))$' }))
	)
};

// #91: the categories the contract agrees; every other umlagefähige one is not agreed
const agreedList = t.Optional(t.Array(t.String({ format: 'uuid' })));
// #368: «Vereinbart ab» per agreed category; one without a day is agreed from the start of the contract
const agreedFrom = t.Optional(t.Record(t.String({ format: 'uuid' }), t.String({ format: 'date' })));

const contractBodySchema = t.Object({
	apartmentId: t.String({ format: 'uuid' }),
	tenantId: t.String({ format: 'uuid' }),
	startDate: t.String({ format: 'date' }),
	endDate: t.Optional(t.Nullable(t.String({ format: 'date' }))),
	terminated: t.Optional(t.Boolean()),
	billedUntil: t.Optional(t.Nullable(t.String({ format: 'date' }))), // «Abgerechnet bis» in the wizard (#453)
	baseRent: t.String(),
	additionalRent: t.Optional(t.Nullable(t.String())),
	monthlyAdvancePayment: t.String(),
	flatRateUtilityCharge: t.Optional(t.String()), // «Nebenkostenpauschale» (#429)
	...managementFee,
	agreedCategoryIds: agreedList,
	agreedFrom,
	referenceIndex: t.Optional(t.Nullable(t.String())),
	contractPdf: t.Optional(t.Nullable(t.String())),
	notes: t.Optional(t.Nullable(t.String()))
});

const contractUpdateSchema = t.Partial(
	t.Object({
		apartmentId: t.String({ format: 'uuid' }), // only the stored one: a move is a new contract (#152)
		tenantId: t.String({ format: 'uuid' }),
		startDate: t.String({ format: 'date' }),
		endDate: t.Optional(t.Nullable(t.String({ format: 'date' }))),
		terminated: t.Boolean(),
		noticeReceivedOn: t.Nullable(t.String({ format: 'date' })), // the day the notice arrived (A-3)
		billedUntil: t.Nullable(t.String({ format: 'date' })), // «Abgerechnet bis» (#133)
		movedOut: t.Boolean(), // «Mieter ist ausgezogen» after an agreed end (A-6, #115)
		documentsChecked: t.Literal(true), // «Als geprüft markieren»: a former tenant's documents, today (#459)
		baseRent: t.String(),
		additionalRent: t.Optional(t.Nullable(t.String())),
		monthlyAdvancePayment: t.String(),
		advancePaymentFrom: t.String({ format: 'date' }), // #464: the «Gültig ab» of a new Akonto; none: the first amount
		flatRateUtilityCharge: t.String(),
		...managementFee,
		agreedCategoryIds: agreedList,
		agreedFrom,
		referenceIndex: t.Optional(t.Nullable(t.String())),
		contractPdf: t.Optional(t.Nullable(t.String())),
		notes: t.Optional(t.Nullable(t.String())),
		// a draft of the contract to delete when it is the only statement the new dates change (#141)
		deleteDraft: t.String({ format: 'uuid' })
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
		return {
			...contract,
			agreedCategoryIds: await agreedCategoryIds(params.id),
			agreedFrom: await agreedFromDays(params.id), // «Vereinbart ab» (#368)
			advancePayments: await advancesOf(params.id)
		};
	})
	// The categories with costs for the contract in the period and whether it agrees each (#91)
	.get(
		'/:id/agreements',
		async ({ params, query, set }) => {
			const contract = await getContract(params.id);
			if (!contract) {
				set.status = 404;
				return refusal('CONTRACT_NOT_FOUND', 'Contract not found');
			}
			const { buildingId } = (await getApartment(contract.apartmentId))!;
			return agreementsInPeriod({ ...contract, buildingId }, query.periodStart, query.periodEnd);
		},
		{ query: periodQuerySchema }
	)
	// The landlord's answer whether the contract agrees a category (#91)
	.put(
		'/:id/agreements',
		async ({ params, body, set }) => {
			const contract = await getContract(params.id);
			if (!contract) {
				set.status = 404;
				return refusal('CONTRACT_NOT_FOUND', 'Contract not found');
			}
			try {
				checkAgreedFrom(contract, [body.agreed ? body.from : undefined]);
			} catch (error) {
				set.status = 400;
				return errorBody(error, 'Failed to save the answer');
			}
			await answerAgreement(params.id, body.categoryId, body.agreed, body.from);
			return body;
		},
		// «Vereinbart ab» a day (#368)
		{ body: t.Object({ categoryId: t.String({ format: 'uuid' }), agreed: t.Boolean(), from: t.Optional(t.String({ format: 'date' })) }) }
	)
	// Get active contract for apartment at date
	.get(
		'/apartment/:apartmentId/active',
		async ({ params, query, set }) => {
			const date = (query as { date?: string }).date || swissToday();
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
				return errorBody(error, 'Failed to create contract');
			}
		},
		{
			body: contractBodySchema
		}
	)
	// Update contract
	.put(
		'/:id',
		async ({ params, body: { deleteDraft, ...body }, set }) => {
			try {
				const contract = await updateContract(params.id, body, deleteDraft);
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
				return errorBody(error, 'Failed to update contract');
			}
		},
		{
			body: contractUpdateSchema
		}
	)
	// #464: delete a later Akonto amount
	.delete('/:id/advance-payments/:validFrom', async ({ params, set }) => {
		try {
			await deleteAdvance(params.id, params.validFrom);
			return { success: true };
		} catch (error) {
			set.status = 400;
			return errorBody(error, 'Failed to delete the Akonto');
		}
	})
	// Delete contract; `confirmMistake`: the landlord confirmed a started contract was entered by mistake (#116)
	.delete(
		'/:id',
		async ({ params, query, set }) => {
			const { success, ...refused } = await deleteContract(params.id, query.confirmMistake === 'true');
			if (!success) {
				set.status = refused.code ? 409 : 404;
				return refused;
			}
			set.status = 204;
			return null;
		},
		{ query: t.Object({ confirmMistake: t.Optional(t.String()) }) }
	);
