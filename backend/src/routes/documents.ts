/**
 * Document and reminder routes
 */

import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth';
import {
	deleteDocument,
	formerTenantDocuments,
	getDocumentPdf,
	listDocuments,
	uploadDocument
} from '../services/document.service';
import { CodedError, errorBody } from '../services/coded-error';
import { markDocumentPosted, ReminderError, sendReminder } from '../services/reminder.service';
import { fileResponse } from './file-response';

export const documentRoutes = new Elysia({ prefix: '/api/v1' })
	.use(authMiddleware)
	// Create the next reminder for an unpaid statement and deliver it via the tenant's channel
	.post('/statements/:id/reminders', async ({ params, set }) => {
		try {
			const result = await sendReminder(params.id);
			set.status = 201;
			return result;
		} catch (error) {
			if (!(error instanceof CodedError)) throw error;
			set.status = error instanceof ReminderError ? error.status : 400; // also no Firmenadresse for the payment part (#450)
			return errorBody(error, '');
		}
	})
	// A file the property manager uploads to the tenant, Base64 encoded
	.post(
		'/tenants/:id/documents',
		async ({ params, body, set }) => {
			try {
				const document = await uploadDocument(params.id, body);
				set.status = 201;
				return document;
			} catch (error) {
				if (!(error instanceof CodedError)) throw error;
				set.status = error.code === 'TENANT_NOT_FOUND' ? 404 : 400;
				return errorBody(error, '');
			}
		},
		{ body: t.Object({ title: t.String(), fileName: t.String(), content: t.String() }) }
	)
	// The uploads of a former tenant from before the last Vertragsende, or null (#178, #788)
	.get('/tenants/:id/former-documents', async ({ params }) => ({
		formerDocuments: await formerTenantDocuments(params.id)
	}))
	.get('/documents', async ({ query }) => ({ data: await listDocuments(query) }), {
		query: t.Object({
			tenantId: t.Optional(t.String()),
			statementId: t.Optional(t.String()),
			status: t.Optional(t.Union([t.Literal('sent'), t.Literal('to_send')]))
		})
	})
	.get('/documents/:id/pdf', async ({ params, set }) => {
		const pdf = await getDocumentPdf(params.id);
		if (!pdf) {
			set.status = 404;
			return { error: 'Document not found' };
		}
		return fileResponse(set, pdf);
	})
	.delete('/documents/:id', async ({ params, set }) => {
		try {
			if (await deleteDocument(params.id)) return { success: true };
			set.status = 404;
			return { error: 'Document not found' };
		} catch (error) {
			if (!(error instanceof CodedError)) throw error;
			set.status = 409;
			return errorBody(error, '');
		}
	})
	// The property manager printed and posted the letter
	.put('/documents/:id/sent', async ({ params, set }) => {
		try {
			const sent = await markDocumentPosted(params.id);
			if (sent) return sent;
			set.status = 404;
			return { error: 'Document not found' };
		} catch (error) {
			// a reminder remade without the Firmenadresse its payment part needs (#450)
			if (!(error instanceof CodedError)) throw error;
			set.status = 400;
			return errorBody(error, '');
		}
	});
