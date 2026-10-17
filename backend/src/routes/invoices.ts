/**
 * Invoice Routes
 * CRUD endpoints for invoice management with LLM categorization
 */

import { isRealDate } from '../services/real-date';
import { Elysia, t } from 'elysia';
import { CodedError, errorBody, refusal } from '../services/coded-error';
import { authMiddleware } from '../middleware/auth';
import {
	listInvoices,
	getInvoice,
	createInvoice,
	updateInvoice,
	deleteInvoice,
	recategorizeInvoiceById,
	KI_UNAVAILABLE,
	validateInvoice,
	getInvoicesForStatement,
	getBeleg,
	setBeleg,
	extractFromFile,
	suggestion
} from '../services/invoice.service';
import { fileResponse } from './file-response';
import { isLlmAvailable, getCacheStats, categorizeInvoice } from '../services/llm.service';
import { getUtilityCostRules } from '../services/utility-validation.service';
import { checkBuildingInvoices } from '../services/invoice-completeness.service';
import { buildingExists } from '../services/building.service';
import { invoiceStatements } from '../services/statement-invoices.service';

// Validation schemas
const invoiceQuerySchema = t.Object({
	search: t.Optional(t.String()),
	buildingId: t.Optional(t.String()),
	categoryId: t.Optional(t.String()),
	dateFrom: t.Optional(t.String()),
	dateTo: t.Optional(t.String()),
	isValidUtilityCost: t.Optional(t.String()), // 'true' or 'false'
	wasManuallyOverridden: t.Optional(t.String()),
	limit: t.Optional(t.String()),
	offset: t.Optional(t.String())
});

const invoiceBodySchema = t.Object({
	buildingId: t.String({ format: 'uuid' }),
	invoiceNumber: t.Optional(t.Nullable(t.String())),
	billingEntityName: t.String({ minLength: 1, maxLength: 255 }),
	billingEntityAddress: t.Optional(t.Nullable(t.String())),
	description: t.String({ minLength: 1 }),
	categoryId: t.Optional(t.Nullable(t.String())),
	// Category the KI suggested in the form, and how sure it was (0 to 1)
	llmCategoryId: t.Optional(t.Nullable(t.String())),
	llmConfidence: t.Optional(t.Nullable(t.String())),
	// Why the category the KI suggested was overridden
	manualOverrideReason: t.Optional(t.Nullable(t.String())),
	distributionKeyId: t.Optional(t.Nullable(t.String())),
	amount: t.String(), // Decimal as string
	isValidUtilityCost: t.Optional(t.Boolean()),
	invoiceDate: t.String(), // YYYY-MM-DD
	// Leistungszeitraum: both or none, the end not before the start (database constraint)
	servicePeriodStart: t.Optional(t.Nullable(t.String({ format: 'date' }))),
	servicePeriodEnd: t.Optional(t.Nullable(t.String({ format: 'date' }))),
	dueDate: t.Optional(t.Nullable(t.String())),
	paidDate: t.Optional(t.Nullable(t.String())),
	notes: t.Optional(t.Nullable(t.String()))
});

// The uploaded file of an invoice, Base64 encoded
const belegSchema = t.Object({
	fileName: t.String(),
	content: t.String(),
	// what the KI saw on the file in «Rechnungen hochladen» (#233)
	deductedAmount: t.Optional(t.Nullable(t.String({ pattern: '^\\d+(\\.\\d{1,2})?$' }))),
	nonAllocableItems: t.Optional(t.Boolean())
});

const invoiceUpdateSchema = t.Partial(invoiceBodySchema);

const statementPeriodSchema = t.Object({
	periodStart: t.String(),
	periodEnd: t.String()
});

export const invoiceRoutes = new Elysia({ prefix: '/api/v1/invoices' })
	.use(authMiddleware)
	// List invoices with pagination and filters
	.get(
		'/',
		async ({ query }) => {
			const filters = {
				search: query.search,
				buildingId: query.buildingId,
				categoryId: query.categoryId,
				dateFrom: query.dateFrom,
				dateTo: query.dateTo,
				isValidUtilityCost:
					query.isValidUtilityCost !== undefined
						? query.isValidUtilityCost === 'true'
						: undefined,
				wasManuallyOverridden:
					query.wasManuallyOverridden !== undefined
						? query.wasManuallyOverridden === 'true'
						: undefined,
				limit: query.limit ? parseInt(query.limit, 10) : undefined,
				offset: query.offset ? parseInt(query.offset, 10) : undefined
			};
			return await listInvoices(filters);
		},
		{
			query: invoiceQuerySchema
		}
	)
	// Get LLM/categorization status
	.get('/llm-status', async () => {
		const available = await isLlmAvailable();
		const cacheStats = getCacheStats();
		return {
			llmAvailable: available,
			cache: cacheStats
		};
	})
	// Get Swiss utility cost rules
	.get('/utility-rules', async () => {
		return getUtilityCostRules();
	})
	// Categorize invoice data using LLM (preview without creating)
	.post(
		'/categorize',
		async ({ body }) => {
			const result = await categorizeInvoice({
				billingEntityName: body.billingEntityName,
				description: body.description,
				amount: body.amount
			});

			return { ...suggestion(result), source: result.source };
		},
		{
			body: t.Object({
				billingEntityName: t.String({ minLength: 1 }),
				description: t.String({ minLength: 1 }),
				amount: t.String()
			})
		}
	)
	// What the KI reads from an uploaded file (its pages as images): proposals, nothing is saved
	.post(
		'/extract',
		async ({ body, set }) => {
			if (!(await buildingExists(body.buildingId))) {
				set.status = 404;
				return refusal('BUILDING_NOT_FOUND', 'Building not found');
			}
			const proposal = await extractFromFile(body.buildingId, body.fileName, body.pages);
			if (proposal === 'unreadable') {
				set.status = 502;
				return refusal('EXTRACTION_UNREADABLE', 'The KI answered nothing readable');
			}
			if (proposal) return proposal;
			set.status = 503;
			return refusal('EXTRACTION_UNAVAILABLE', 'The KI is disabled or unreachable');
		},
		{
			body: t.Object({
				buildingId: t.String({ format: 'uuid' }),
				fileName: t.String({ maxLength: 255 }),
				// at most a few pages, each an image as a data URL
				pages: t.Array(t.String({ pattern: '^data:image/(png|jpeg);base64,' }), { minItems: 1, maxItems: 3 })
			})
		}
	)
	// Get invoices for statement generation (by building and period)
	.get(
		'/for-statement/:buildingId',
		async ({ params, query, set }) => {
			if (!query.periodStart || !query.periodEnd) {
				set.status = 400;
				return { error: 'periodStart and periodEnd are required' };
			}
			return await getInvoicesForStatement(params.buildingId, query.periodStart, query.periodEnd);
		},
		{
			query: statementPeriodSchema
		}
	)
	// Check for missing invoices per category against the same dates one year earlier
	.get(
		'/completeness/:buildingId',
		async ({ params, query, set }) => {
			if (!isRealDate(query.periodStart) || !isRealDate(query.periodEnd) || query.periodEnd < query.periodStart) {
				set.status = 400;
				return { error: 'periodStart and periodEnd must be existing dates, the end not before the start' };
			}
			return await checkBuildingInvoices(params.buildingId, { start: query.periodStart, end: query.periodEnd });
		},
		{
			params: t.Object({ buildingId: t.String({ format: 'uuid' }) }),
			query: t.Object({ periodStart: t.String({ format: 'date' }), periodEnd: t.String({ format: 'date' }) })
		}
	)
	// Get single invoice
	.get('/:id', async ({ params, set }) => {
		const invoice = await getInvoice(params.id);
		if (!invoice) {
			set.status = 404;
			return refusal('INVOICE_NOT_FOUND', 'Invoice not found');
		}
		return invoice;
	})
	// The periods with statements that bill this invoice, and that lack it as it is now (#96)
	.get('/:id/statements', async ({ params, set }) => {
		const periods = await invoiceStatements(params.id);
		if (!periods) {
			set.status = 404;
			return refusal('INVOICE_NOT_FOUND', 'Invoice not found');
		}
		return periods;
	})
	// The Beleg of an invoice: its uploaded file
	.get('/:id/document', async ({ params, set }) => {
		const beleg = await getBeleg(params.id);
		if (!beleg) {
			set.status = 404;
			return refusal('BELEG_NOT_FOUND', 'Beleg not found');
		}
		return fileResponse(set, beleg);
	})
	// Adds or replaces the Beleg of an invoice
	.put(
		'/:id/document',
		async ({ params, body, set }) => {
			try {
				const invoice = await setBeleg(params.id, body);
				if (invoice) return invoice;
				set.status = 404;
				return refusal('INVOICE_NOT_FOUND', 'Invoice not found');
			} catch (error) {
				if (!(error instanceof CodedError)) throw error;
				set.status = 400;
				return errorBody(error, '');
			}
		},
		{ body: belegSchema }
	)
	// Validate invoice for utility statement
	.get('/:id/validate', async ({ params, set }) => {
		const result = await validateInvoice(params.id);
		if (result.errors.includes('Invoice not found')) {
			set.status = 404;
		}
		return result;
	})
	// Re-categorize invoice with LLM
	.post('/:id/recategorize', async ({ params, set }) => {
		const result = await recategorizeInvoiceById(params.id);
		if (!result.success) {
			set.status = result.error === 'Invoice not found' ? 404 : result.error === KI_UNAVAILABLE ? 503 : 500;
			return { error: result.error, code: result.code, params: result.params };
		}
		return result;
	})
	// Create invoice
	.post(
		'/',
		async ({ body, query, set }) => {
			try {
				const skipLlm = query.skipLlm === 'true';
				const invoice = await createInvoice(body, { skipLlmCategorization: skipLlm });
				set.status = 201;
				return invoice;
			} catch (error) {
				set.status = 400;
				return errorBody(error, 'Failed to create invoice');
			}
		},
		{
			body: t.Composite([invoiceBodySchema, t.Object({ beleg: t.Optional(belegSchema) })]),
			query: t.Object({
				skipLlm: t.Optional(t.String())
			})
		}
	)
	// Update invoice
	.put(
		'/:id',
		async ({ params, body, set }) => {
			try {
				const invoice = await updateInvoice(params.id, body, { logOverride: true });
				if (!invoice) {
					set.status = 404;
					return refusal('INVOICE_NOT_FOUND', 'Invoice not found');
				}
				return invoice;
			} catch (error) {
				set.status = 400;
				return errorBody(error, 'Failed to update invoice');
			}
		},
		{
			body: invoiceUpdateSchema
		}
	)
	// Delete invoice
	.delete('/:id', async ({ params, set }) => {
		const result = await deleteInvoice(params.id);
		if (!result.success) {
			set.status = result.error === 'Invoice not found' ? 404 : 400;
			return { error: result.error };
		}
		set.status = 204;
		return null;
	});
