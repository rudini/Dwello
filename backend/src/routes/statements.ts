/**
 * Statement Routes
 * API endpoints for utility statement management
 */

import { Elysia, t } from 'elysia';
import { swissToday } from '../services/today';
import { CodedError, codedBody, errorBody, refusal } from '../services/coded-error';
import { deleteResponse } from './delete-response';
import {
	listStatements,
	getStatement,
	updateStatement,
	deleteStatement,
	addLineItems,
	getStatementCountsByStatus,
	calculateStatement,
	generateStatement,
	resetPayment,
	settleCarryOver,
	replaceStatement,
	correctStatement,
	recalculateStatement
} from '../services/statement.service';
import { changeStatementStatus, generateStatementPdf, getStatementPdf } from '../services/statement-pdf.service';
import { declineCorrection, outdatedStatements, statementChanges } from '../services/statement-invoices.service';
import { keepNewPdf, redeliverByLetter, sendStatement } from '../services/statement-send.service';
import { runDefaultsOf, runDifferencesOf, runHeatingHintsOf, runPlan } from '../services/statement-run.service';

// A PDF that could not be made: a coded refusal (an invalid IBAN) as such, anything else logged and named
function pdfFailure(error: unknown, set: { status?: number | string }) {
	set.status = error instanceof CodedError ? 400 : 500;
	return codedBody(error, 'PDF_FAILED', 'PDF generation failed');
}

// A refused replacement or correction: the statement is missing, or its state does not allow it
const correctionStatus = (error: unknown) =>
	!(error instanceof CodedError) ? 500 : error.code === 'STATEMENT_NOT_FOUND' ? 404 : 409;

// Calculation parameters shared by preview and generate; the management fee overrides the configured default
const calculationBody = t.Object({
	contractId: t.String(),
	periodStart: t.String(),
	periodEnd: t.String(),
	heatingProfileId: t.Optional(t.String()),
	managementFeePercent: t.Optional(t.Number({ minimum: 0, maximum: 10 })) // #124: also catches a typo such as 30 for 3
});

// A run of a building's period with a Heizprofil, as the run's routes take it (H-28)
const runQuery = {
	buildingId: t.String({ format: 'uuid' }),
	periodStart: t.String({ format: 'date' }),
	periodEnd: t.String({ format: 'date' }),
	heatingProfileId: t.Optional(t.String())
};
const runOf = (query: { periodStart: string; periodEnd: string; heatingProfileId?: string }) => ({
	period: { start: query.periodStart, end: query.periodEnd },
	heatingProfileId: query.heatingProfileId ?? null
});

export const statementRoutes = new Elysia({ prefix: '/api/v1/statements' })
	// The drafts with a change since and the statements due for correcting, for the Übersicht (#454)
	.get('/outdated', async () => ({ statements: await outdatedStatements() }))
	// whether the period is still running, by the Swiss day: the run says costs may still come (#815)
	.get('/check-period', ({ query }) => ({ running: query.periodEnd >= swissToday() }), {
		query: t.Object({ periodEnd: t.String({ format: 'date' }) })
	})
	// What the wizard starts with, from a link to a building and period or from the settings (A-10, H-28)
	.get('/run-defaults', ({ query }) => runDefaultsOf(query), {
		query: t.Object({
			buildingId: t.Optional(t.String({ format: 'uuid' })),
			periodStart: t.Optional(t.String()),
			periodEnd: t.Optional(t.String())
		})
	})
	// The run of a period for a building: its contracts to bill and why it is refused (H-28)
	.get('/run', ({ query }) => runPlan(query.buildingId, { start: query.periodStart, end: query.periodEnd }), {
		query: t.Object({
			buildingId: t.String({ format: 'uuid' }),
			periodStart: t.String({ format: 'date' }),
			periodEnd: t.String({ format: 'date' })
		})
	})
	// The statements of the run's period a new run keeps although they differ from its settings (#132, H-28)
	.get('/run-differences', ({ query }) => runDifferencesOf(query.buildingId, { ...runOf(query), managementFeePercent: query.managementFeePercent }), {
		query: t.Object({ ...runQuery, managementFeePercent: t.Numeric({ minimum: 0, maximum: 10 }) })
	})
	// The heating hints of the period's check that concern the run (#335, #339, H-28)
	.get('/run-heating', ({ query }) => runHeatingHintsOf(query.buildingId, runOf(query)), { query: t.Object(runQuery) })
	// List all statements
	.get(
		'/',
		async ({ query }) => {
			const { statements, total } = await listStatements({
				search: query.search,
				contractId: query.contractId,
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
				contractId: t.Optional(t.String()),
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
			return getStatementCountsByStatus(query);
		},
		{
			query: t.Object({
				search: t.Optional(t.String()),
				contractId: t.Optional(t.String()),
				buildingId: t.Optional(t.String()),
				periodStart: t.Optional(t.String()),
				periodEnd: t.Optional(t.String())
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
				return codedBody(error, 'CALCULATION_FAILED', 'Calculation failed');
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
				return codedBody(error, 'CALCULATION_FAILED', 'Statement generation failed');
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
				return refusal('STATEMENT_NOT_FOUND', 'Statement not found');
			}

			return statement;
		},
		{
			params: t.Object({
				id: t.String()
			})
		}
	)

	// The invoices of its period recorded, changed or deleted since the statement was created (#96), its Tankbestand,
	// and whether a correction is due (#454)
	.get('/:id/changed-invoices', async ({ params, set }) => {
		const changes = await statementChanges(params.id);
		if (!changes) {
			set.status = 404;
			return refusal('STATEMENT_NOT_FOUND', 'Statement not found');
		}
		const { result: _result, ...shown } = changes;
		return shown;
	})

	// «Nicht berichtigen» (#454)
	.post(
		'/:id/decline-correction',
		async ({ params, set }) => {
			try {
				return await declineCorrection(params.id);
			} catch (error) {
				set.status = correctionStatus(error);
				return codedBody(error, 'CALCULATION_FAILED', 'Declining the correction failed');
			}
		},
		{ params: t.Object({ id: t.String() }) }
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
					return refusal('STATEMENT_NOT_FOUND', 'Statement not found');
				}
				// the new PDF of a sent statement waits under «Dokumente» to be sent (#968)
				// the change is saved: a failure here is only logged (Code-Review 534-1 C-6)
				if (statement.pdfChange) await keepNewPdf(params.id).catch((error) => console.error('New PDF not kept:', error));

				return statement;
			} catch (error) {
				set.status = 400;
				return errorBody(error, 'Failed to update statement'); // a replaced statement with its code (#120)
			}
		},
		{
			params: t.Object({
				id: t.String()
			}),
			body: t.Object({
				notes: t.Optional(t.String()),
				paymentDeadline: t.Optional(t.String({ format: 'date' }))
			})
		}
	)

	// Replace a sent or paid statement, and create its berichtigte Abrechnung (#120)
	.post(
		'/:id/replace',
		async ({ params, body, set }) => {
			try {
				return await replaceStatement(params.id, body?.paidAmount);
			} catch (error) {
				set.status = correctionStatus(error);
				return errorBody(error, 'Failed to replace the statement');
			}
		},
		// what was already paid on a sent or overdue statement (#448)
		{ params: t.Object({ id: t.String() }), body: t.Optional(t.Object({ paidAmount: t.Optional(t.String()) })) }
	)
	.post(
		'/:id/correction',
		async ({ params, set }) => {
			try {
				const statement = await correctStatement(params.id);
				set.status = 201;
				return statement;
			} catch (error) {
				set.status = correctionStatus(error);
				return codedBody(error, 'CALCULATION_FAILED', 'Statement generation failed');
			}
		},
		{ params: t.Object({ id: t.String() }) }
	)

	// Calculate a draft again from the invoices as they are now (#338)
	.post(
		'/:id/recalculation',
		async ({ params, set }) => {
			try {
				return await recalculateStatement(params.id);
			} catch (error) {
				set.status = correctionStatus(error);
				return codedBody(error, 'CALCULATION_FAILED', 'Statement recalculation failed');
			}
		},
		{ params: t.Object({ id: t.String() }) }
	)

	// Take back a recorded payment (#92)
	.post(
		'/:id/payment-reset',
		async ({ params, set }) => {
			try {
				return await resetPayment(params.id);
			} catch (error) {
				set.status = !(error instanceof CodedError) ? 500 : error.code === 'STATEMENT_NOT_FOUND' ? 404 : 400;
				return errorBody(error, 'Failed to reset the payment');
			}
		},
		{ params: t.Object({ id: t.String() }) }
	)

	// #506: an open Übertrag settled by hand
	.post(
		'/:id/carry-settled',
		async ({ params, set }) => {
			try {
				return await settleCarryOver(params.id);
			} catch (error) {
				set.status = !(error instanceof CodedError) ? 500 : error.code === 'STATEMENT_NOT_FOUND' ? 404 : 400;
				return errorBody(error, 'Failed to settle the Übertrag');
			}
		},
		{ params: t.Object({ id: t.String() }) }
	)

	// Send a draft: by e-mail to a tenant who wants e-mail, else (or byLetter) only recorded as sent (#86)
	.post(
		'/:id/send',
		async ({ params, body, set }) => {
			try {
				return await sendStatement(params.id, body.byLetter);
			} catch (error) {
				set.status = !(error instanceof CodedError) ? 500 : error.code === 'STATEMENT_NOT_FOUND' ? 404 : 400;
				return errorBody(error, 'Failed to send the statement');
			}
		},
		{ params: t.Object({ id: t.String() }), body: t.Object({ byLetter: t.Optional(t.Boolean()) }) }
	)

	// #534: a sent statement delivered again by letter, dated today
	.post(
		'/:id/redeliver',
		async ({ params, set }) => {
			try {
				return await redeliverByLetter(params.id);
			} catch (error) {
				const code = error instanceof CodedError ? error.code : null;
				set.status = code === 'STATEMENT_NOT_FOUND' ? 404 : code === 'STATEMENT_NOT_REDELIVERABLE' ? 409 : code ? 400 : 500;
				return errorBody(error, 'Failed to deliver the statement again');
			}
		},
		{ params: t.Object({ id: t.String() }) }
	)

	// Update statement status
	.put(
		'/:id/status',
		async ({ params, body, set }) => {
			try {
				const statement = await changeStatementStatus(
					params.id,
					body.status as 'draft' | 'sent' | 'paid', // the service refuses any other
					{
						paidDate: body.paidDate,
						paidAmount: body.paidAmount
					}
				);

				if (!statement) {
					set.status = 404;
					return refusal('STATEMENT_NOT_FOUND', 'Statement not found');
				}
				// #1016: a part payment leaves it open; a new PDF still to send names the amount before it, so it is made anew
				if (body.status === 'paid' && statement.newPdfToSend) {
					await keepNewPdf(params.id).catch((error) => console.error('New PDF not kept:', error));
					return (await getStatement(params.id)) ?? statement;
				}

				return statement;
			} catch (error) {
				set.status = 400;
				return errorBody(error, 'Failed to update status'); // a refused payment date with its code (#138)
			}
		},
		{
			params: t.Object({
				id: t.String()
			}),
			body: t.Object({
				status: t.String(),
				paidDate: t.Optional(t.String()),
				paidAmount: t.Optional(t.String())
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
					return refusal('STATEMENT_NOT_FOUND', 'Statement not found');
				}
				if (result === 'no-iban') {
					set.status = 400;
					return refusal('IBAN_MISSING', 'IBAN not configured. Please set up company configuration first.');
				}

				return {
					success: true,
					message: 'PDF generated and stored successfully',
					qrReference: result.qrReference,
					pdfSize: result.pdfSize
				};
			} catch (error) {
				return pdfFailure(error, set);
			}
		},
		{
			params: t.Object({
				id: t.String()
			}),
			body: t.Object({
				language: t.Optional(t.String()) // de, fr, it, en
			})
		}
	)

	// Download PDF for a statement
	.get(
		'/:id/pdf',
		async ({ params, set }) => {
			try {
				const result = await getStatementPdf(params.id);
				if ('refusal' in result) {
					set.status = result.status;
					return result.refusal;
				}

				// Convert Base64 to Buffer
				const pdfBuffer = Buffer.from(result.pdfBlob, 'base64');

				// Set response headers
				set.headers['content-type'] = 'application/pdf';
				set.headers['content-disposition'] = `attachment; filename="${result.statementNumber}.pdf"`;

				return pdfBuffer;
			} catch (error) {
				return pdfFailure(error, set);
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
				if ('refusal' in result) {
					set.status = result.status;
					return result.refusal;
				}

				return {
					pdfBase64: result.pdfBlob,
					mimeType: 'application/pdf'
				};
			} catch (error) {
				return pdfFailure(error, set);
			}
		},
		{
			params: t.Object({
				id: t.String()
			})
		}
	);
