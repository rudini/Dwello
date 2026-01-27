/**
 * Invoice Routes
 * CRUD endpoints for invoice management with LLM categorization
 */

import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth';
import {
	listInvoices,
	getInvoice,
	createInvoice,
	updateInvoice,
	deleteInvoice,
	recategorizeInvoiceById,
	validateInvoice,
	getInvoicesForStatement
} from '../services/invoice.service';
import { isOllamaAvailable, getCacheStats } from '../services/llm.service';
import { getUtilityCostRules } from '../services/utility-validation.service';

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
	distributionKeyId: t.Optional(t.Nullable(t.String())),
	amount: t.String(), // Decimal as string
	isValidUtilityCost: t.Optional(t.Boolean()),
	invoiceDate: t.String(), // YYYY-MM-DD
	dueDate: t.Optional(t.Nullable(t.String())),
	paidDate: t.Optional(t.Nullable(t.String())),
	invoicePdf: t.Optional(t.Nullable(t.String())),
	notes: t.Optional(t.Nullable(t.String()))
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
		const available = await isOllamaAvailable();
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
	// Get single invoice
	.get('/:id', async ({ params, set }) => {
		const invoice = await getInvoice(params.id);
		if (!invoice) {
			set.status = 404;
			return { error: 'Invoice not found' };
		}
		return invoice;
	})
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
			set.status = result.error === 'Invoice not found' ? 404 : 500;
			return { error: result.error };
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
				return { error: error instanceof Error ? error.message : 'Failed to create invoice' };
			}
		},
		{
			body: invoiceBodySchema,
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
					return { error: 'Invoice not found' };
				}
				return invoice;
			} catch (error) {
				set.status = 400;
				return { error: error instanceof Error ? error.message : 'Failed to update invoice' };
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
