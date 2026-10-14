/**
 * Documents the property manager uploads to a tenant: stored with their file, listed without a Versandstatus,
 * refused when too large or of another kind (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { callApi, sendJson } from './helpers/auth';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { documents } from '../db/schema';
import { createDocument } from '../services/document.service';
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

	it('heisst ohne Titel wie die Datei ohne Endung', async () => {
		const id = await idOf(await upload('  ', 'Übergabe protokoll.2026.pdf', pdf));
		expect(await documentsOf()).toContainEqual(expect.objectContaining({ id, title: 'Übergabe protokoll.2026' }));
	});

	it('nimmt Fotos als JPG und PNG an und liefert sie mit ihrer Art zurück', async () => {
		const jpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]);
		const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2]);
		for (const [file, content, type] of [['ausweis.jpg', jpg, 'image/jpeg'], ['plan.png', png, 'image/png']] as const) {
			const id = await idOf(await upload('Foto', file, content));
			expect((await callApi(`/api/v1/documents/${id}/pdf`)).headers.get('content-type')).toBe(type);
		}
	});

	it('lehnt eine Datei ab, die weder PDF noch JPG noch PNG ist, auch mit der Endung .pdf', async () => {
		const word = Buffer.concat([Buffer.from('PK\x03\x04'), Buffer.alloc(16)]);
		const before = (await documentsOf()).length;
		for (const fileName of ['notizen.docx', 'notizen.pdf']) {
			const response = await upload('Notizen', fileName, word);
			expect(response.status).toBe(400);
			expect(await response.json()).toMatchObject({ code: 'DOCUMENT_TYPE_NOT_ALLOWED' });
		}
		expect(await documentsOf()).toHaveLength(before);
	});

	it('nimmt eine Datei bis 10 MB an (10 × 1024 × 1024 Bytes) und lehnt jede grössere ab', async () => {
		const ofSize = (bytes: number) => Buffer.concat([Buffer.from('%PDF-'), Buffer.alloc(bytes - 5)]);
		expect((await upload('Grenze', 'scan.pdf', ofSize(10 * 1024 * 1024))).status).toBe(201);
		const response = await upload('Zu gross', 'scan.pdf', ofSize(10 * 1024 * 1024 + 1));
		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({ code: 'DOCUMENT_TOO_LARGE', params: { megabytes: 10 } });
	});

	it('lässt sich löschen, eine Mahnung nicht', async () => {
		const id = await idOf(await upload('Ausweiskopie', 'ausweis.pdf', pdf));
		const reminder = await createDocument({
			tenantId,
			type: 'reminder',
			reminderLevel: 1,
			title: 'Zahlungserinnerung',
			fileName: 'zahlungserinnerung.pdf',
			content: pdf.toString('base64'),
			channel: 'letter',
			status: 'to_send'
		});

		expect((await callApi(`/api/v1/documents/${id}`, { method: 'DELETE' })).status).toBe(200);
		const refused = await callApi(`/api/v1/documents/${reminder.id}`, { method: 'DELETE' });
		expect(refused.status).toBe(409);
		expect(await refused.json()).toMatchObject({ code: 'DOCUMENT_NOT_DELETABLE' });
		const left = (await documentsOf()).map((document) => document.id);
		expect(left).not.toContain(id);
		expect(left).toContain(reminder.id);
		await db.delete(documents).where(eq(documents.id, reminder.id));
	});

	it('geht mit dem Mieter, der keine Mietverträge hat', async () => {
		const other = await idOf(await sendJson('POST', '/api/v1/tenants', { firstName: 'Ohne Vertrag', lastName: token }));
		await upload('Ausweiskopie', 'ausweis.pdf', pdf, other);

		expect((await callApi(`/api/v1/tenants/${other}`, { method: 'DELETE' })).status).toBe(204);
		expect(await documentsOf(other)).toEqual([]);
		expect(await documentsOf()).not.toHaveLength(0); // the other tenant's documents stay
	});

	it('lädt eine Datei herunter, deren Name Zeichen ausserhalb von Latin-1 hat', async () => {
		const id = await idOf(await upload('Protokoll', 'Übergabe – 1.10.pdf', pdf));
		const file = await callApi(`/api/v1/documents/${id}/pdf`);
		expect(file.status).toBe(200);
		expect(file.headers.get('content-disposition')).toContain(`filename*=UTF-8''${encodeURIComponent('Übergabe – 1.10.pdf')}`);
	});

	it('hat keinen Versandstatus, den man setzen könnte', async () => {
		const id = await idOf(await upload('Ausweiskopie', 'ausweis.pdf', pdf));
		expect((await callApi(`/api/v1/documents/${id}/sent`, { method: 'PUT' })).status).toBe(404);
		expect(await documentsOf()).toContainEqual(expect.objectContaining({ id, status: null }));
	});

	it('lehnt einen Titel über 255 Zeichen mit Code ab und kürzt einen langen Dateinamen vorne', async () => {
		const tooLong = await upload('T'.repeat(256), 'scan.pdf', pdf);
		expect(tooLong.status).toBe(400);
		expect(await tooLong.json()).toMatchObject({ code: 'DOCUMENT_TITLE_TOO_LONG', params: { max: 255 } });

		const id = await idOf(await upload('Scan', `${'n'.repeat(300)}.pdf`, pdf));
		const file = await callApi(`/api/v1/documents/${id}/pdf`);
		expect(file.headers.get('content-disposition')).toContain(`filename="${'n'.repeat(251)}.pdf"`);
	});

	it('lehnt ein Dokument zu einem unbekannten Mieter mit Code ab', async () => {
		const response = await upload('Scan', 'scan.pdf', pdf, crypto.randomUUID());
		expect(response.status).toBe(404);
		expect(await response.json()).toMatchObject({ code: 'TENANT_NOT_FOUND' });
	});

	it('kodiert den Dateinamen im Download nach RFC 5987 und RFC 6266', async () => {
		const id = await idOf(await upload('Protokoll', `Übergabe (Kopie) 'a'*\\b.pdf`, pdf));
		const header = (await callApi(`/api/v1/documents/${id}/pdf`)).headers.get('content-disposition');
		expect(header).toContain(`filename*=UTF-8''%C3%9Cbergabe%20%28Kopie%29%20%27a%27%2A%5Cb.pdf`);
		expect(header).toContain('filename="_bergabe (Kopie) \'a\'*_b.pdf"');
	});
});
