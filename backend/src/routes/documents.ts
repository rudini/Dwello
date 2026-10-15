/**
 * Document and reminder routes
 */

import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth';
import {
	deleteDocument,
	getDocumentPdf,
	listDocuments,
	markDocumentSent,
	uploadDocument
} from '../services/document.service';
import { CodedError, errorBody } from '../services/coded-error';
import { ReminderError, sendReminder } from '../services/reminder.service';

export const documentRoutes = new Elysia({ prefix: '/api/v1' })
	.use(authMiddleware)
	// Create the next reminder for an unpaid statement and deliver it via the tenant's channel
	.post('/statements/:id/reminders', async ({ params, set }) => {
		try {
			const result = await sendReminder(params.id);
			set.status = 201;
			return result;
		} catch (error) {
			if (!(error instanceof ReminderError)) throw error;
			set.status = error.status;
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
		set.headers['content-type'] = pdf.mimeType;
		// an ASCII name for old clients, the real one (umlauts, dashes) per RFC 6266 and RFC 5987
		const ascii = pdf.fileName.replace(/[^\x20-\x7e]|["\\]/g, '_');
		const utf8 = encodeURIComponent(pdf.fileName).replace(/['()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
		set.headers['content-disposition'] = `attachment; filename="${ascii}"; filename*=UTF-8''${utf8}`;
		return pdf.content;
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
		const sent = await markDocumentSent(params.id);
		if (sent) return sent;
		set.status = 404;
		return { error: 'Document not found' };
	});
