/**
 * The Beleg of an invoice: its original file, stored with it, replaced, removed with it (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { callApi, sendJson } from './helpers/auth';
import { idOf, perAreaKey } from './helpers/records';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoiceDocuments } from '../db/schema';

const pdf = Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.alloc(64, 1)]);
let buildingId: string;
const key = await perAreaKey();

const newInvoice = (fields: object = {}) =>
	sendJson('POST', '/api/v1/invoices?skipLlm=true', {
		buildingId,
		billingEntityName: 'Elektro Blitz AG',
		description: 'Treppenhauslicht',
		amount: '180.00',
		invoiceDate: '2026-03-31',
		distributionKeyId: key,
		...fields
	});

beforeAll(async () => {
	const building = await createBuilding({
		name: `Beleg ${crypto.randomUUID()}`,
		address: 'Testweg 1',
		postalCode: '8400',
		city: 'Winterthur',
		canton: 'ZH'
	});
	buildingId = building.id;
});

afterAll(async () => {
	const { invoices } = (await (await callApi(`/api/v1/invoices?buildingId=${buildingId}&limit=100`)).json()) as {
		invoices: { id: string }[];
	};
	for (const invoice of invoices) await callApi(`/api/v1/invoices/${invoice.id}`, { method: 'DELETE' });
	await deleteBuilding(buildingId);
});

describe('Beleg einer Rechnung', () => {
	it('wird mit der neuen Rechnung gespeichert und mit Namen und Art zurückgeliefert', async () => {
		const response = await newInvoice({ beleg: { fileName: 'elektro-blitz.pdf', content: pdf.toString('base64') } });
		expect(response.status).toBe(201);
		const invoice = (await response.json()) as { id: string; beleg: unknown };
		expect(invoice.beleg).toEqual({ fileName: 'elektro-blitz.pdf', mimeType: 'application/pdf', deductedAmount: null, nonAllocableItems: false });

		const file = await callApi(`/api/v1/invoices/${invoice.id}/document`);
		expect(file.headers.get('content-type')).toBe('application/pdf');
		expect(file.headers.get('content-disposition')).toContain('elektro-blitz.pdf');
		expect(Buffer.from(await file.arrayBuffer())).toEqual(pdf);
	});

	// what the KI saw on the file stays with it after creating, and goes with it when it is replaced (persona Anna)
	it('behält die Hinweise aus dem Hochladen und verliert sie mit einem neuen Beleg', async () => {
		const beleg = { fileName: 'werke.pdf', content: pdf.toString('base64'), deductedAmount: '1000.00', nonAllocableItems: true };
		const id = await idOf(await newInvoice({ beleg }));
		const read = async () => ((await (await callApi(`/api/v1/invoices/${id}`)).json()) as { beleg: unknown }).beleg;
		expect(await read()).toMatchObject({ deductedAmount: '1000.00', nonAllocableItems: true });

		await sendJson('PUT', `/api/v1/invoices/${id}/document`, { fileName: 'neu.pdf', content: pdf.toString('base64') });
		expect(await read()).toMatchObject({ fileName: 'neu.pdf', deductedAmount: null, nonAllocableItems: false });
	});

	it('wird zu einer Rechnung ohne Beleg hinzugefügt und danach ersetzt', async () => {
		const id = await idOf(await newInvoice());
		const jpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]);
		const put = (fileName: string, content: Buffer) =>
			sendJson('PUT', `/api/v1/invoices/${id}/document`, { fileName, content: content.toString('base64') });

		expect(((await (await callApi(`/api/v1/invoices/${id}`)).json()) as { beleg: unknown }).beleg).toBeNull();
		expect((await put('rechnung.pdf', pdf)).status).toBe(200);
		const replaced = await put('rechnung.jpg', jpg);
		expect(await replaced.json()).toMatchObject({ id, beleg: { fileName: 'rechnung.jpg', mimeType: 'image/jpeg' } });
		expect(Buffer.from(await (await callApi(`/api/v1/invoices/${id}/document`)).arrayBuffer())).toEqual(jpg);
	});

	it('lehnt eine Datei ab, die weder PDF noch Bild ist, und erstellt dann auch die Rechnung nicht', async () => {
		const word = Buffer.concat([Buffer.from('PK\x03\x04'), Buffer.alloc(16)]);
		const response = await newInvoice({
			billingEntityName: 'Word AG',
			beleg: { fileName: 'rechnung.pdf', content: word.toString('base64') }
		});
		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({ code: 'DOCUMENT_TYPE_NOT_ALLOWED' });
		const list = await callApi(`/api/v1/invoices?buildingId=${buildingId}&search=Word`);
		expect(((await list.json()) as { total: number }).total).toBe(0);
	});

	it('wird mit der Rechnung gelöscht', async () => {
		const response = await newInvoice({ beleg: { fileName: 'weg.pdf', content: pdf.toString('base64') } });
		const id = await idOf(response);
		await callApi(`/api/v1/invoices/${id}`, { method: 'DELETE' });
		const [left] = await db.select().from(invoiceDocuments).where(eq(invoiceDocuments.invoiceId, id));
		expect(left).toBeUndefined();
	});

	it('meldet eine unbekannte Rechnung, auch mit einer Datei, die Dwello nicht nimmt', async () => {
		const unknown = crypto.randomUUID();
		const word = Buffer.from('PK\x03\x04').toString('base64');
		const put = await sendJson('PUT', `/api/v1/invoices/${unknown}/document`, { fileName: 'x.docx', content: word });
		expect(put.status).toBe(404);
		expect(await put.json()).toMatchObject({ code: 'INVOICE_NOT_FOUND' });
		const get = await callApi(`/api/v1/invoices/${unknown}/document`);
		expect(get.status).toBe(404);
		expect(await get.json()).toMatchObject({ code: 'BELEG_NOT_FOUND' });
	});
});
