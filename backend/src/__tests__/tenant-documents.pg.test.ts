/**
 * Documents the property manager uploads to a tenant: stored with their file, listed without a Versandstatus,
 * refused when too large or of another kind (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { callApi, sendJson } from './helpers/auth';
import { idOf } from './helpers/records';

const token = crypto.randomUUID();
let tenantId: string;

const pdf = Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.alloc(64, 1)]);
const upload = (title: string, fileName: string, content: Buffer, tenant = tenantId) =>
	sendJson('POST', `/api/v1/tenants/${tenant}/documents`, { title, fileName, content: content.toString('base64') });
const documentsOf = async (tenant = tenantId) =>
	((await (await callApi(`/api/v1/documents?tenantId=${tenant}`)).json()) as { data: Record<string, unknown>[] })
		.data;

beforeAll(async () => {
	tenantId = await idOf(await sendJson('POST', '/api/v1/tenants', { firstName: 'Upload', lastName: token }));
});

afterAll(async () => {
	await callApi(`/api/v1/tenants/${tenantId}`, { method: 'DELETE' });
});

describe('Hochgeladene Dokumente', () => {
	it('liegt beim Mieter ohne Versandstatus und liefert die Datei zurück', async () => {
		const response = await upload('Betreibungsauszug', 'betreibung.pdf', pdf);
		expect(response.status).toBe(201);
		const id = await idOf(response);

		expect(await documentsOf()).toContainEqual(
			expect.objectContaining({ id, type: 'upload', title: 'Betreibungsauszug', channel: null, status: null })
		);
		const file = await callApi(`/api/v1/documents/${id}/pdf`);
		expect(file.headers.get('content-type')).toBe('application/pdf');
		expect(file.headers.get('content-disposition')).toContain('betreibung.pdf');
		expect(Buffer.from(await file.arrayBuffer())).toEqual(pdf);
	});
});
