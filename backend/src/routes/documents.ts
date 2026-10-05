/**
 * Document and reminder routes
 */

import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth';
import {
	getDocument,
	getDocumentPdf,
	listDocuments,
	markDocumentSent
} from '../services/document.service';
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
			return { error: error.message };
		}
	})
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
		set.headers['content-type'] = 'application/pdf';
		set.headers['content-disposition'] = `attachment; filename="${pdf.fileName}"`;
		return pdf.content;
	})
	// The property manager printed and posted the letter
	.put('/documents/:id/sent', async ({ params, set }) => {
		if (!(await getDocument(params.id))) {
			set.status = 404;
			return { error: 'Document not found' };
		}
		return markDocumentSent(params.id);
	});
