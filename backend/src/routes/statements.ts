/**
 * Statement Routes
 * API endpoints for utility statement management
 */

import { Elysia, t } from 'elysia';
import { errorBody, refusal } from '../services/coded-error';
import { deleteResponse } from './delete-response';
import {
	listStatements,
	getStatement,
	updateStatement,
	updateStatementStatus,
	deleteStatement,
	addLineItems,
	getStatementCountsByStatus,
	calculateStatement,
	generateStatement
} from '../services/statement.service';
import { generateStatementPdf, getStatementPdf } from '../services/statement-pdf.service';

// Calculation parameters shared by preview and generate; the management fee overrides the configured default
const calculationBody = t.Object({
	contractId: t.String(),
	periodStart: t.String(),
	periodEnd: t.String(),
	heatingProfileId: t.Optional(t.String()),
	managementFeePercent: t.Optional(t.Number({ minimum: 0 }))
});

export const statementRoutes = new Elysia({ prefix: '/api/v1/statements' })
	// List all statements
	.get(
		'/',
		async ({ query }) => {
			const { statements, total } = await listStatements({
				search: query.search,
				buildingId: query.buildingId,
				apartmentId: query.apartmentId,
				tenantId: query.tenantId,
				status: query.status,
				periodStart: query.periodStart,
				periodEnd: query.periodEnd,
				limit: query.limit ? parseInt(query.limit) : undefined,
				offset: query.offset ? parseInt(query.offset) : undefined
			});

			return {
				data: statements,
				total,
				limit: query.limit ? parseInt(query.limit) : 20,
				offset: query.offset ? parseInt(query.offset) : 0
			};
		},
		{
			query: t.Object({
				search: t.Optional(t.String()),
				buildingId: t.Optional(t.String()),
				apartmentId: t.Optional(t.String()),
				tenantId: t.Optional(t.String()),
				status: t.Optional(t.String()),
				periodStart: t.Optional(t.String()),
				periodEnd: t.Optional(t.String()),
				limit: t.Optional(t.String()),
				offset: t.Optional(t.String())
			})
		}
	)

	// Get statement counts by status
	.get(
		'/counts',
		async ({ query }) => {
			const counts = await getStatementCountsByStatus(query.buildingId);
			return counts;
		},
		{
			query: t.Object({
				buildingId: t.Optional(t.String())
			})
		}
	)

	// Preview statement calculation for a contract
	.post(
		'/preview',
		async ({ body, set }) => {
			try {
				const calculation = await calculateStatement(body);

				return {
					preview: true,
					...calculation
				};
			} catch (error) {
				set.status = 400;
				return errorBody(error, 'Calculation failed');
			}
		},
		{
			body: calculationBody
		}
	)

	// Generate statement from calculation
	.post(
		'/generate',
		async ({ body, set }) => {
			try {
				const statement = await generateStatement(body);

				set.status = 201;
				return statement;
			} catch (error) {
				set.status = 400;
				return errorBody(error, 'Statement generation failed');
			}
		},
		{
			body: t.Composite([calculationBody, t.Object({ buildingId: t.String() })])
		}
	)

	// Get a single statement
	.get(
		'/:id',
		async ({ params, set }) => {
			const statement = await getStatement(params.id);

			if (!statement) {
				set.status = 404;
				return { error: 'Statement not found' };
			}

			return statement;
		},
		{
			params: t.Object({
				id: t.String()
			})
		}
	)

	// Update a statement
	.put(
		'/:id',
		async ({ params, body, set }) => {
			try {
				const statement = await updateStatement(params.id, {
					notes: body.notes,
					paymentDeadline: body.paymentDeadline
				});

				if (!statement) {
					set.status = 404;
					return { error: 'Statement not found' };
				}

				return statement;
			} catch (error) {
				set.status = 400;
				return { error: error instanceof Error ? error.message : 'Failed to update statement' };
			}
		},
		{
			params: t.Object({
				id: t.String()
			}),
			body: t.Object({
				notes: t.Optional(t.String()),
				paymentDeadline: t.Optional(t.String())
			})
		}
	)

	// Update statement status
	.put(
		'/:id/status',
		async ({ params, body, set }) => {
			try {
				const statement = await updateStatementStatus(
					params.id,
					body.status as 'draft' | 'sent' | 'paid' | 'overdue',
					{
						paidDate: body.paidDate,
						paidAmount: body.paidAmount,
						reminderSentDate: body.reminderSentDate
					}
				);

				if (!statement) {
					set.status = 404;
					return { error: 'Statement not found' };
				}

				return statement;
			} catch (error) {
				set.status = 400;
				return { error: error instanceof Error ? error.message : 'Failed to update status' };
			}
		},
		{
			params: t.Object({
				id: t.String()
			}),
			body: t.Object({
				status: t.String(),
				paidDate: t.Optional(t.String()),
				paidAmount: t.Optional(t.String()),
				reminderSentDate: t.Optional(t.String())
			})
		}
	)

	// Delete a statement
	.delete(
		'/:id',
		async ({ params, set }) => deleteResponse(set, await deleteStatement(params.id)),
		{
			params: t.Object({
				id: t.String()
			})
		}
	)

	// Add line items to a statement
	.post(
		'/:id/line-items',
		async ({ params, body, set }) => {
			try {
				const lineItems = await addLineItems(params.id, body.items);

				set.status = 201;
				return {
					message: 'Line items added',
					items: lineItems
				};
			} catch (error) {
				set.status = 400;
				return { error: error instanceof Error ? error.message : 'Failed to add line items' };
			}
		},
		{
			params: t.Object({
				id: t.String()
			}),
			body: t.Object({
				items: t.Array(
					t.Object({
						categoryId: t.Optional(t.String()),
						distributionKeyId: t.Optional(t.String()),
						description: t.String(),
						totalAmount: t.String(),
						tenantShare: t.String(),
						sharePercentage: t.Optional(t.String()),
						sortOrder: t.Optional(t.Number())
					})
				)
			})
		}
	)

	// Generate and store PDF for a statement
	.post(
		'/:id/generate-pdf',
		async ({ params, body, set }) => {
			try {
				const result = await generateStatementPdf(params.id, body.language);
				if (result === 'not-found') {
					set.status = 404;
					return { error: 'Statement not found' };
				}
				if (result === 'no-iban') {
					set.status = 400;
					return refusal('IBAN_MISSING', 'IBAN not configured. Please set up company configuration first.');
				}

				return {
					success: true,
					message: 'PDF generated and stored successfully',
					...result
				};
			} catch (error) {
				console.error('PDF generation error:', error);
				set.status = 500;
				return { error: error instanceof Error ? error.message : 'PDF generation failed' };
			}
		},
		{
			params: t.Object({
				id: t.String()
			}),
			body: t.Object({
				language: t.Optional(t.String()) // de, fr, it, rm, en
			})
		}
	)

	// Download PDF for a statement
	.get(
		'/:id/pdf',
		async ({ params, set }) => {
			try {
				const result = await getStatementPdf(params.id);
				if ('error' in result) {
					set.status = 404;
					return result;
				}

				// Convert Base64 to Buffer
				const pdfBuffer = Buffer.from(result.pdfBlob, 'base64');

				// Set response headers
				set.headers['content-type'] = 'application/pdf';
				set.headers['content-disposition'] = `attachment; filename="statement-${result.statementNumber}.pdf"`;

				return pdfBuffer;
			} catch (error) {
				set.status = 500;
				return { error: error instanceof Error ? error.message : 'Failed to retrieve PDF' };
			}
		},
		{
			params: t.Object({
				id: t.String()
			})
		}
	)

	// Get PDF as Base64 (for preview)
	.get(
		'/:id/pdf/base64',
		async ({ params, set }) => {
			try {
				const result = await getStatementPdf(params.id);
				if ('error' in result) {
					set.status = 404;
					return result;
				}

				return {
					pdfBase64: result.pdfBlob,
					mimeType: 'application/pdf'
				};
			} catch (error) {
				set.status = 500;
				return { error: error instanceof Error ? error.message : 'Failed to retrieve PDF' };
			}
		},
		{
			params: t.Object({
				id: t.String()
			})
		}
	);
