import { describe, it, expect } from 'vitest';
import { runAction } from './helpers/action';
import { actions } from '../routes/statements/[id]/+page.server';

const API = 'http://localhost:3001/api/v1/statements/s1';
const today = new Date().toISOString().split('T')[0];

describe('Abrechnung versenden', () => {
	it('setzt den Status im Backend auf versendet', async () => {
		const { calls, result } = runAction(actions.send, 's1');
		await result;

		expect(calls).toEqual([{ method: 'PUT', url: `${API}/status`, body: { status: 'sent' } }]);
	});

	it('meldet einen Fehler, wenn das Backend den Statuswechsel ablehnt', async () => {
		const { result } = runAction(actions.send, 's1', 400);

		expect(await result).toMatchObject({
			status: 400,
			data: { actionError: 'Abrechnung konnte nicht versendet werden.' }
		});
	});
});

describe('Abrechnung als bezahlt markieren', () => {
	it('setzt den Status auf bezahlt mit heutigem Zahlungsdatum', async () => {
		const { calls, result } = runAction(actions.markPaid, 's1');
		await result;

		expect(calls).toEqual([
			{ method: 'PUT', url: `${API}/status`, body: { status: 'paid', paidDate: today } }
		]);
	});
});

describe('Abrechnung löschen', () => {
	it('löscht die Abrechnung und kehrt zur Abrechnungsliste zurück', async () => {
		const { calls, result } = runAction(actions.delete, 's1', 204);

		await expect(result).rejects.toMatchObject({ status: 303, location: '/statements' });
		expect(calls).toEqual([{ method: 'DELETE', url: API, body: undefined }]);
	});

	it('meldet einen Fehler, wenn das Backend das Löschen ablehnt', async () => {
		const { result } = runAction(actions.delete, 's1', 400);

		expect(await result).toMatchObject({
			status: 400,
			data: { actionError: 'Abrechnung konnte nicht gelöscht werden.' }
		});
	});
});

describe('Mahnung senden', () => {
	it('lässt das Backend die nächste Mahnung erstellen und versenden', async () => {
		const { calls, result } = runAction(actions.remind, 's1', 201);
		await result;

		expect(calls).toEqual([{ method: 'POST', url: `${API}/reminders`, body: undefined }]);
	});

	it('zeigt die Begründung des Backends, wenn keine Mahnung möglich ist', async () => {
		const { result } = runAction(actions.remind, 's1', 400);

		expect(await result).toMatchObject({
			status: 400,
			data: { actionError: 'Mahnung konnte nicht erstellt werden.' }
		});
	});
});

describe('Abrechnung laden', () => {
	// The statement carries no tenant address; the send confirmation needs it for a letter
	it('ergänzt die Postadresse des Mieters aus den Mieterdaten', async () => {
		const { load } = await import('../routes/statements/[id]/+page.server');
		const statementJson = (await import('../../tests/contracts/statement.json')).default;
		const tenantJson = (await import('../../tests/contracts/tenant.json')).default;
		const fetch = (async (url: string) => {
			if (url.endsWith('/statements/s1'))
				return Response.json({ ...statementJson, tenantId: 't1' });
			if (url.endsWith('/tenants/t1')) return Response.json(tenantJson);
			if (url.includes('/invoices/for-statement/')) return Response.json([]);
			return Response.json({ data: [] });
		}) as typeof globalThis.fetch;

		const data = (await load({ params: { id: 's1' }, fetch } as never)) as {
			statement: { tenantAddress: string };
		};
		expect(data.statement.tenantAddress).toBe('Seestrasse 12, 8002 Zürich');
	});

	// Nachzügler: ein Entwurf ohne die Rechnungen, die nach seinem Erstellen erfasst wurden
	it('zählt beim Entwurf die Rechnungen der Periode, die nach dem Erstellen erfasst wurden', async () => {
		const { load } = await import('../routes/statements/[id]/+page.server');
		const statementJson = (await import('../../tests/contracts/statement.json')).default;
		const later = (status: string) => {
			const urls: string[] = [];
			const fetch = (async (url: string) => {
				urls.push(url);
				if (url.endsWith('/statements/s1')) return Response.json({ ...statementJson, status });
				if (url.includes('/invoices/for-statement/b1'))
					return Response.json([
						{ createdAt: '2025-01-10T08:00:00.000Z' }, // before the draft (2025-01-15)
						{ createdAt: '2025-02-01T08:00:00.000Z' }
					]);
				return Response.json({ data: [] });
			}) as typeof globalThis.fetch;
			return {
				urls,
				data: load({ params: { id: 's1' }, fetch } as never) as Promise<{ laterInvoices: number }>
			};
		};

		const draft = later('draft');
		expect((await draft.data).laterInvoices).toBe(1);
		expect(draft.urls).toContain(
			'http://localhost:3001/api/v1/invoices/for-statement/b1?periodStart=2024-01-01&periodEnd=2024-12-31'
		);
		expect((await later('sent').data).laterInvoices).toBe(0);
	});
});
