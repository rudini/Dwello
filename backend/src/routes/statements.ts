/**
 * Statement Routes
 * API endpoints for utility statement management
 */

import { Elysia, t } from 'elysia';
import { deleteResponse } from './delete-response';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { utilityStatements } from '../db/schema';
import {
	listStatements,
	getStatement,
	createStatement,
	updateStatement,
	updateStatementStatus,
	deleteStatement,
	addLineItems,
	getStatementCountsByStatus,
	markOverdueStatements
} from '../services/statement.service';
import { calculateStatementForContract, generateStatementNumber } from '../services/calculation.service';
import { getTypedConfig } from '../services/config.service';
import { generateStatementPDFBase64, type StatementPDFData, type Language } from '../services/pdf.service';
import { generateQRReference, type QRBillConfig } from '../services/qr-bill.service';

// Calculation parameters shared by preview and generate; the management fee overrides the configured default
const calculationBody = t.Object({
	contractId: t.String(),
	periodStart: t.String(),
	periodEnd: t.String(),
	heatingProfileId: t.Optional(t.String()),
	managementFeePercent: t.Optional(t.Number({ minimum: 0 }))
});

const calculate = (body: typeof calculationBody.static) =>
	calculateStatementForContract(
		body.contractId,
		new Date(body.periodStart),
		new Date(body.periodEnd),
		body.heatingProfileId,
		body.managementFeePercent
	);

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

	// Mark overdue statements
	.post('/mark-overdue', async () => {
		const marked = await markOverdueStatements();
		return {
			message: 'Overdue statements marked',
			count: marked
		};
	})

	// Preview statement calculation for a contract
	.post(
		'/preview',
		async ({ body, set }) => {
			try {
				const calculation = await calculate(body);

				return {
					preview: true,
					...calculation
				};
			} catch (error) {
				set.status = 400;
				return { error: error instanceof Error ? error.message : 'Calculation failed' };
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
				// Calculate the statement
				const calculation = await calculate(body);

				// Generate statement number
				const statementNumber = await generateStatementNumber(
					body.buildingId,
					new Date(body.periodEnd)
				);

				// Calculate payment deadline
				const paymentDeadlineDays = await getTypedConfig('payment_deadline_days');
				const statementDate = new Date();
				const paymentDeadline = new Date(statementDate);
				paymentDeadline.setDate(paymentDeadline.getDate() + paymentDeadlineDays);

				// Create the statement
				const statement = await createStatement(
					{
						tenantId: calculation.tenantId,
						apartmentId: calculation.apartmentId,
						contractId: body.contractId,
						statementNumber,
						periodStart: body.periodStart,
						periodEnd: body.periodEnd,
						statementDate: statementDate.toISOString().split('T')[0],
						rentalDays: calculation.rentalDays,
						totalCosts: String(calculation.totalCosts),
						totalAdvancePayments: String(calculation.totalAdvancePayments),
						managementFee: String(calculation.managementFee),
						balance: String(calculation.balance),
						status: 'draft',
						paymentDeadline: paymentDeadline.toISOString().split('T')[0]
					},
					calculation.lineItems.map((item, index) => ({
						categoryId: item.categoryId,
						distributionKeyId: item.distributionKeyId,
						description: item.description,
						totalAmount: String(item.totalBuildingAmount),
						tenantShare: String(item.tenantShare),
						sharePercentage: String(item.sharePercentage * 100),
						sortOrder: index
					}))
				);

				set.status = 201;
				return statement;
			} catch (error) {
				set.status = 400;
				return { error: error instanceof Error ? error.message : 'Statement generation failed' };
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
				// Get the statement with all details
				const statement = await getStatement(params.id);
				if (!statement) {
					set.status = 404;
					return { error: 'Statement not found' };
				}

				// Get company config for QR-bill
				const companyName = await getTypedConfig('company_name');
				const companyAddress = await getTypedConfig('company_address');
				const companyPostalCode = await getTypedConfig('company_postal_code');
				const companyCity = await getTypedConfig('company_city');
				const iban = await getTypedConfig('iban');

				if (!iban) {
					set.status = 400;
					return { error: 'IBAN not configured. Please set up company configuration first.' };
				}

				const qrConfig: QRBillConfig = {
					iban,
					companyName: companyName || 'Dwello Property Management',
					address: companyAddress || '',
					postalCode: companyPostalCode || '8000',
					city: companyCity || 'Zürich'
				};

				// Build PDF data from statement
				const pdfData: StatementPDFData = {
					id: statement.id,
					statementNumber: statement.statementNumber,
					statementDate: statement.statementDate,
					periodStart: statement.periodStart,
					periodEnd: statement.periodEnd,
					rentalDays: statement.rentalDays,
					tenant: {
						firstName: statement.tenant?.firstName || 'Unknown',
						lastName: statement.tenant?.lastName || 'Tenant',
						email: statement.tenant?.email || undefined,
						address: undefined, // Would need to get from tenant record
						postalCode: undefined,
						city: undefined
					},
					apartment: {
						number: statement.apartment?.number || 'N/A',
						floor: statement.apartment?.floor || 0,
						area: statement.apartment?.area || '0'
					},
					building: {
						name: statement.building?.name || 'Building',
						address: statement.building?.address || ''
					},
					lineItems: statement.lineItems.map((item) => ({
						category: item.description,
						totalAmount: parseFloat(item.totalAmount),
						tenantShare: parseFloat(item.tenantShare),
						sharePercentage: item.sharePercentage ? parseFloat(item.sharePercentage) / 100 : 0
					})),
					subtotal:
						parseFloat(statement.totalCosts) - parseFloat(statement.managementFee || '0'),
					managementFee: parseFloat(statement.managementFee || '0'),
					managementFeePercent: parseFloat(statement.managementFee || '0') > 0
						? (parseFloat(statement.managementFee || '0') / (parseFloat(statement.totalCosts) - parseFloat(statement.managementFee || '0'))) * 100
						: 0,
					totalCosts: parseFloat(statement.totalCosts),
					totalAdvancePayments: parseFloat(statement.totalAdvancePayments),
					balance: parseFloat(statement.balance),
					paymentDeadline: statement.paymentDeadline || undefined
				};

				// Determine language from tenant preference or use default
				const language: Language = (body.language as Language) || 'de';

				// Generate PDF
				const pdfBase64 = await generateStatementPDFBase64(pdfData, qrConfig, language);

				// Generate QR reference
				const qrReference = generateQRReference(statement.id.replace(/-/g, '').slice(0, 20));

				// Store PDF in database
				await db
					.update(utilityStatements)
					.set({
						pdfBlob: pdfBase64,
						qrBillReference: qrReference,
						updatedAt: new Date()
					})
					.where(eq(utilityStatements.id, params.id));

				return {
					success: true,
					message: 'PDF generated and stored successfully',
					qrReference,
					pdfSize: pdfBase64.length
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
				// Get the statement
				const [result] = await db
					.select({
						pdfBlob: utilityStatements.pdfBlob,
						statementNumber: utilityStatements.statementNumber
					})
					.from(utilityStatements)
					.where(eq(utilityStatements.id, params.id))
					.limit(1);

				if (!result) {
					set.status = 404;
					return { error: 'Statement not found' };
				}

				if (!result.pdfBlob) {
					set.status = 404;
					return { error: 'PDF not generated yet. Call POST /:id/generate-pdf first.' };
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
				const [result] = await db
					.select({
						pdfBlob: utilityStatements.pdfBlob
					})
					.from(utilityStatements)
					.where(eq(utilityStatements.id, params.id))
					.limit(1);

				if (!result) {
					set.status = 404;
					return { error: 'Statement not found' };
				}

				if (!result.pdfBlob) {
					set.status = 404;
					return { error: 'PDF not generated yet. Call POST /:id/generate-pdf first.' };
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
