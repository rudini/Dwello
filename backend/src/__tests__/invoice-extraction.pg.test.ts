/**
 * Reading uploaded files with the KI: proposals for a new invoice, its Kategorie, a possible duplicate, a KI that
 * does not answer (real PostgreSQL database, a local stand-in for the KI)
 */

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'bun:test';
import { sql } from 'drizzle-orm';
import { llmConfig } from '../config/llm';
import { db } from '../db/connection';
import { clearCategorizationCache } from '../services/llm.service';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { callApi, sendJson } from './helpers/auth';
import { openAiCompatible } from './helpers/llm';
import { perAreaKey } from './helpers/records';

const configured = { ...llmConfig };
const page = 'data:image/png;base64,iVBORw0KGgo=';
let buildingId: string;
let stop = () => {};

const read = {
	invoiceCount: 1,
	documentType: 'invoice',
	billingEntityName: 'Elektro Blitz AG',
	invoiceNumber: 'R-1001',
	invoiceDate: '2026-03-31',
	totalAmount: 1250,
	deductedAmount: null,
	servicePeriodStart: '2026-01-01',
	servicePeriodEnd: '2026-03-31',
	dueDate: null,
	description: 'Allgemeinstrom Q1',
	nonAllocableItems: false,
	confidence: { billingEntityName: 0.95, invoiceNumber: 0.9, invoiceDate: 0.4, totalAmount: 0.9, servicePeriodStart: 0.9, description: 0.8 }
};
const categorized = { category: 'Electricity Common Areas', confidence: 0.9, isAllowedUtilityCost: true, reasoning: 'Strom' };
// The stand-in answers the reading of a file and the categorization each with its own answer
const ki = () => {
	const server = openAiCompatible((prompt) => (prompt.includes('Die Bilder sind die Seiten') ? read : categorized));
	stop = server.stop;
	return server;
};
const extract = (fileName = 'elektro-blitz.pdf') =>
	sendJson('POST', '/api/v1/invoices/extract', { buildingId, fileName, pages: [page] });

beforeAll(async () => {
	buildingId = (
		await createBuilding({ name: `Auslesen ${crypto.randomUUID()}`, address: 'Testweg 1', postalCode: '8400', city: 'Winterthur', canton: 'ZH' })
	).id;
});

afterEach(() => {
	stop();
	clearCategorizationCache();
	Object.assign(llmConfig, configured);
});

afterAll(async () => {
	const { invoices } = (await (await callApi(`/api/v1/invoices?buildingId=${buildingId}&limit=100`)).json()) as {
		invoices: { id: string }[];
	};
	for (const invoice of invoices) await callApi(`/api/v1/invoices/${invoice.id}`, { method: 'DELETE' });
	await deleteBuilding(buildingId);
});

describe('Datei auslesen', () => {
	it('schickt die Seiten der Datei an die KI und schlägt Angaben und Kategorie vor', async () => {
		const server = ki();
		const response = await extract();
		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({
			invoiceCount: 1,
			fields: { billingEntityName: 'Elektro Blitz AG', invoiceNumber: 'R-1001', amount: '1250.00' },
			unsure: ['invoiceDate'],
			categorization: { category: { name: 'Electricity Common Areas' }, confidence: 0.9 },
			duplicateOf: null
		});
		expect(server.images[0]).toEqual([page]);
		expect(server.prompts[0]).toContain('«elektro-blitz.pdf»');
	});

	it('meldet eine KI, die nicht läuft, damit der Liegenschaftsverwalter die Felder selbst ausfüllt', async () => {
		llmConfig.baseUrl = 'http://127.0.0.1:9'; // nothing listens there
		const response = await extract();
		expect(response.status).toBe(503);
		expect(await response.json()).toMatchObject({ code: 'EXTRACTION_UNAVAILABLE' });
	});

	it('meldet eine Antwort der KI ohne lesbare Angaben, damit der Liegenschaftsverwalter es erneut versucht (Fachreview V-14)', async () => {
		const server = openAiCompatible('Ich kann diese Datei nicht lesen.' as never);
		try {
			const response = await extract();
			expect(response.status).toBe(502);
			expect(await response.json()).toMatchObject({ code: 'EXTRACTION_UNREADABLE' });
		} finally {
			server.stop();
		}
	});

	it('fragt eine abgeschaltete KI nicht', async () => {
		const server = ki();
		llmConfig.enabled = false;
		const response = await extract();
		expect(response.status).toBe(503);
		expect(await response.json()).toMatchObject({ code: 'EXTRACTION_UNAVAILABLE' });
		expect(server.prompts).toEqual([]);
	});

	// #580 (Codereview 580 C-10): «Keine KI» aus den Einstellungen gilt ab der nächsten Datei, ohne Neustart
	it('fragt keine KI, wenn in den Einstellungen «Keine KI» gewählt ist', async () => {
		const server = ki();
		await sendJson('PUT', '/api/v1/ki-settings', { mode: 'none' });
		try {
			const response = await extract();
			const categorizing = await sendJson('POST', '/api/v1/invoices/categorize', {
				billingEntityName: 'Elektro Blitz AG',
				description: 'Allgemeinstrom',
				amount: '120.00'
			});

			expect(response.status).toBe(503);
			expect(((await categorizing.json()) as { category: unknown }).category).toBeNull();
			expect(server.prompts).toEqual([]);
		} finally {
			await db.execute(sql`DELETE FROM ki_settings`);
			await db.execute(sql`DELETE FROM audit_log WHERE action = 'ki_setting_changed'`);
		}
	});

	it('kennt kein unbekanntes Gebäude', async () => {
		ki();
		const response = await sendJson('POST', '/api/v1/invoices/extract', {
			buildingId: crypto.randomUUID(),
			fileName: 'r.pdf',
			pages: [page]
		});
		expect(response.status).toBe(404);
		expect(await response.json()).toMatchObject({ code: 'BUILDING_NOT_FOUND' });
	});

	it('nennt eine schon erfasste Rechnung mit gleichem Rechnungssteller und gleicher Rechnungsnummer im Gebäude', async () => {
		const created = await sendJson('POST', '/api/v1/invoices?skipLlm=true', {
			buildingId,
			billingEntityName: 'elektro blitz ag ',
			invoiceNumber: 'r-1001',
			description: 'Allgemeinstrom Q1',
			amount: '1250.00',
			invoiceDate: '2026-03-31',
			distributionKeyId: await perAreaKey()
		});
		const { id } = (await created.json()) as { id: string };
		ki();
		expect(await (await extract()).json()).toMatchObject({ duplicateOf: id });
	});
});
