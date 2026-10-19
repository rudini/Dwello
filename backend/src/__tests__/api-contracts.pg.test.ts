/**
 * The backend answers with every field the frontend reads (tests/contracts, real PostgreSQL database):
 * the frontend unit tests use these samples as backend answers, so they cannot drift from the real API.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { join } from 'path';
import { llmConfig } from '../config/llm';
import { db } from '../db/connection';
import { buildings, categories, configuration, documents, heatingProfiles, invoiceDocuments, invoices, tenants, utilityStatements, contractAdvancePayments } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';
import { openAiCompatible } from './helpers/llm';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

const contracts = join(import.meta.dir, '..', '..', '..', 'tests', 'contracts');
const sample = (name: string) => Bun.file(join(contracts, `${name}.json`)).json();

const kind = (value: unknown) => (value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value);

/** Paths of the sample's fields that the real answer lacks or delivers with another JSON type (null allowed) */
function drift(expected: unknown, actual: unknown, path = ''): string[] {
	if (expected === null || actual === null) return [];
	if (kind(expected) !== kind(actual)) return [`${path || '.'}: ${kind(expected)} erwartet, ${kind(actual)} geliefert`];
	if (Array.isArray(expected)) {
		if (expected.length === 0) return [];
		if ((actual as unknown[]).length === 0) return [`${path}[]: leer geliefert`];
		return drift(expected[0], (actual as unknown[])[0], `${path}[0]`);
	}
	if (kind(expected) !== 'object') return [];
	return Object.entries(expected as Record<string, unknown>).flatMap(([key, value]) =>
		key in (actual as object)
			? drift(value, (actual as Record<string, unknown>)[key], `${path}.${key}`)
			: [`${path}.${key}: fehlt`]
	);
}

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
let statementId: string;
const period = { periodStart: '2024-01-01', periodEnd: '2024-12-31' };

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2024-01-01', monthlyAdvancePayment: '150' });
	await insertInvoice(rental.building, { amount: '1000.00', invoiceDate: '2024-03-31' });
	// A year later 50 % more: the check for missing invoices reports a deviation with its percentage
	await insertInvoice(rental.building, { amount: '1500.00', invoiceDate: '2025-06-30' });
	// Without a Leistungszeitraum, dated shortly after 2025: the check names it as a late invoice
	await insertInvoice(rental.building, { billingEntityName: 'Kaminfeger Keller', amount: '290.00', invoiceDate: '2026-01-20' });
	// Optional fields filled, so the contract checks their JSON type too (null is not checked)
	await db
		.update(buildings)
		.set({ latitude: '47.3769', longitude: '8.5417', yearBuilt: 1965, buildingType: 'residential' })
		.where(eq(buildings.id, rental.building));
	await db
		.update(tenants)
		.set({ email: 'anna.keller@example.ch', phone: '+41 44 123 45 67', address: 'Seestrasse 12', postalCode: '8002', city: 'Zürich' })
		.where(eq(tenants.id, rental.tenant));
	for (const { id } of await db.select({ id: invoices.id }).from(invoices).where(eq(invoices.buildingId, rental.building)))
		await db
			.insert(invoiceDocuments)
			.values({ invoiceId: id, fileName: 'beleg.pdf', mimeType: 'application/pdf', content: 'JVBERi0=', deductedAmount: '1000.00', nonAllocableItems: true });
	await db
		.update(invoices)
		.set({ llmCategoryId: sql`${invoices.categoryId}`, llmConfidence: '0.86', manualOverrideReason: 'Vertrag geprüft' })
		.where(eq(invoices.buildingId, rental.building));
	// a heating profile of the master data: the statement names it (A-10)
	const [profile] = await db.select({ id: heatingProfiles.id }).from(heatingProfiles).limit(1);
	const response = await sendJson('POST', '/api/v1/statements/generate', {
		...period,
		contractId: rental.contract,
		buildingId: rental.building,
		managementFeePercent: 3,
		heatingProfileId: profile.id
	});
	statementId = ((await response.json()) as { id: string }).id;
});

afterAll(async () => {
	// sent and paid at the end of the file: no longer a draft the API deletes
	await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
});

describe('API-Verträge des Frontends', () => {
	it('GET /statements/:id liefert die Felder von statement.json', async () => {
		const actual = await (await callApi(`/api/v1/statements/${statementId}`)).json();
		expect(drift(await sample('statement'), actual)).toEqual([]);
	});

	// an invoice of the period recorded after the statement: the statement names it as changed since (#96)
	it('GET /statements/:id/changed-invoices liefert die Felder von statement-changed-invoices.json', async () => {
		await insertInvoice(rental.building, { amount: '80.00', invoiceDate: '2024-11-30', description: `Nachzügler ${token}` });
		try {
			const actual = await (await callApi(`/api/v1/statements/${statementId}/changed-invoices`)).json();
			expect(drift(await sample('statement-changed-invoices'), actual)).toEqual([]);
		} finally {
			await db.delete(invoices).where(eq(invoices.description, `Nachzügler ${token}`));
		}
	});

	it('GET /invoices/:id/statements liefert die Felder von invoice-statements.json', async () => {
		const [billed] = await db.select({ id: invoices.id }).from(invoices).where(and(eq(invoices.buildingId, rental.building), eq(invoices.invoiceDate, '2024-03-31')));
		const actual = await (await callApi(`/api/v1/invoices/${billed.id}/statements`)).json();
		expect(drift(await sample('invoice-statements'), actual)).toEqual([]);
	});

	it('GET /contracts?buildingId liefert die Felder von building-contracts.json', async () => {
		const actual = await (await callApi(`/api/v1/contracts?buildingId=${rental.building}&limit=1000`)).json();
		expect(drift(await sample('building-contracts'), actual)).toEqual([]);
	});

	// The caretaker costs of 2025 against 2024: a finding with all its fields
	it('GET /invoices/completeness/:buildingId liefert die Felder von invoice-completeness.json', async () => {
		const actual = await (
			await callApi(`/api/v1/invoices/completeness/${rental.building}?periodStart=2025-01-01&periodEnd=2025-12-31`)
		).json();
		expect(drift(await sample('invoice-completeness'), actual)).toEqual([]);
	});

	it('POST /statements/preview liefert die Felder von statement-preview.json', async () => {
		const actual = await (await sendJson('POST', '/api/v1/statements/preview', { ...period, contractId: rental.contract })).json();
		expect(drift(await sample('statement-preview'), actual)).toEqual([]);
	});

	it('GET /invoices und /invoices/:id liefern die Felder von invoice.json', async () => {
		const listed = (await (await callApi(`/api/v1/invoices?buildingId=${rental.building}`)).json()) as { invoices: { id: string }[] };
		const actual = await (await callApi(`/api/v1/invoices/${listed.invoices[0].id}`)).json();
		expect(drift(await sample('invoice'), listed.invoices[0])).toEqual([]);
		expect(drift(await sample('invoice'), actual)).toEqual([]);
	});

	it('GET /buildings/:id liefert die Felder von building.json', async () => {
		const actual = await (await callApi(`/api/v1/buildings/${rental.building}`)).json();
		expect(drift(await sample('building'), actual)).toEqual([]);
	});

	it('GET /buildings/:id/fuel-stocks liefert die Felder von fuel-stocks.json', async () => {
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await sendJson('POST', `/api/v1/buildings/${rental.building}/fuel-stocks`, { readingDate: '2024-12-31', amount: '2650.00', categoryId: heating.id });
		const actual = await (await callApi(`/api/v1/buildings/${rental.building}/fuel-stocks`)).json();
		expect(drift(await sample('fuel-stocks'), actual)).toEqual([]);
	});

	// #100: die Heizung mit Tankbestand bleibt Brennstoff
	it('PUT /categories/:id ohne Brennstoff bei Tankbestand liefert die Felder von category-fuel-refused.json', async () => {
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await sendJson('POST', `/api/v1/buildings/${rental.building}/fuel-stocks`, { readingDate: '2024-12-31', amount: '2650.00', categoryId: heating.id });
		const response = await sendJson('PUT', `/api/v1/categories/${heating.id}`, { isFuel: false });

		expect(response.status).toBe(400);
		expect(drift(await sample('category-fuel-refused'), await response.json())).toEqual([]);
	});

	it('GET /contracts/:id liefert die Felder von contract.json', async () => {
		const actual = await (await callApi(`/api/v1/contracts/${rental.contract}`)).json();
		expect(drift(await sample('contract'), actual)).toEqual([]);
	});

	it('GET /contracts/:id/agreements liefert die Felder von contract-agreements.json', async () => {
		const actual = (await (
			await callApi(`/api/v1/contracts/${rental.contract}/agreements?periodStart=2020-01-01&periodEnd=2030-12-31`)
		).json()) as unknown[];
		expect(actual.length).toBeGreaterThan(0);
		expect(drift(await sample('contract-agreements'), actual)).toEqual([]);
	});

		it('GET /categories/:id liefert die Felder von category.json', async () => {
		const name = `Internet ${token}`;
		const own = (await (
			await sendJson('POST', '/api/v1/categories', {
				name,
				nameDE: name,
				nameFR: name,
				nameIT: name,
				nameEN: name,
				isAllowedUtilityCost: true,
				description: 'Glasfaseranschluss im Keller',
				sortOrder: 40
			})
		).json()) as { id: string };
		try {
			const actual = await (await callApi(`/api/v1/categories/${own.id}`)).json();
			expect(drift(await sample('category'), actual)).toEqual([]);
		} finally {
			await callApi(`/api/v1/categories/${own.id}`, { method: 'DELETE' });
		}
	});

	it('GET /invoices/llm-recipient eines externen Anbieters liefert die Felder von llm-recipient.json', async () => {
		const configured = { ...llmConfig };
		Object.assign(llmConfig, { baseUrl: 'https://llm.example.com/v1', provider: 'Beispiel AG', providerCountry: 'Schweiz' });
		try {
			const actual = await (await callApi('/api/v1/invoices/llm-recipient')).json();
			expect(drift(await sample('llm-recipient'), actual)).toEqual([]);
		} finally {
			Object.assign(llmConfig, configured);
		}
	});

	it('GET /mail-transport liefert die Felder von mail-transport.json', async () => {
		const configured = process.env.MAIL_TRANSPORT;
		process.env.MAIL_TRANSPORT = 'resend';
		try {
			const actual = await (await callApi('/api/v1/mail-transport')).json();
			expect(drift(await sample('mail-transport'), actual)).toEqual([]);
		} finally {
			process.env.MAIL_TRANSPORT = configured;
		}
	});

	it('POST /categories/propose liefert die Felder von category-proposal.json', async () => {
		const llm = openAiCompatible({ isAllowedUtilityCost: false, confidence: 0.9, reasoning: 'Erneuerung' });
		try {
			const actual = await (await sendJson('POST', '/api/v1/categories/propose', { name: 'Dachsanierung' })).json();
			expect(drift(await sample('category-proposal'), actual)).toEqual([]);
		} finally {
			llm.stop();
		}
	});

	it('POST /invoices/extract liefert die Felder von invoice-extraction.json', async () => {
		const read = { invoiceCount: 1, documentType: 'invoice', billingEntityName: 'Muster AG', invoiceNumber: 'R-1', invoiceDate: '2026-03-31', totalAmount: 1000, deductedAmount: 500, servicePeriodStart: '2026-01-01', servicePeriodEnd: '2026-03-31', dueDate: '2026-04-30', description: 'Hauswart', nonAllocableItems: false, confidence: { invoiceDate: 0.4 } };
		const categorized = { category: 'Caretaker', confidence: 0.9, isAllowedUtilityCost: true, reasoning: 'Betrieb' };
		const llm = openAiCompatible((prompt) => (prompt.includes('Die Bilder sind die Seiten') ? read : categorized));
		try {
			const [{ id }] = await db.select({ id: invoices.id }).from(invoices).where(eq(invoices.buildingId, rental.building)).limit(1);
			await db.update(invoices).set({ billingEntityName: 'Muster AG', invoiceNumber: 'R-1' }).where(eq(invoices.id, id));
			const actual = await (
				await sendJson('POST', '/api/v1/invoices/extract', { buildingId: rental.building, fileName: 'r.pdf', pages: ['data:image/png;base64,iVBO'] })
			).json();
			expect(drift(await sample('invoice-extraction'), actual)).toEqual([]);
		} finally {
			llm.stop();
		}
	});

	it('POST /invoices/extract ohne lesbare Antwort der KI liefert die Felder von invoice-extraction-unreadable.json', async () => {
		const llm = openAiCompatible('Ich kann diese Datei nicht lesen.' as never);
		try {
			const actual = await (
				await sendJson('POST', '/api/v1/invoices/extract', { buildingId: rental.building, fileName: 'r.pdf', pages: ['data:image/png;base64,iVBO'] })
			).json();
			expect(drift(await sample('invoice-extraction-unreadable'), actual)).toEqual([]);
		} finally {
			llm.stop();
		}
	});

	it('POST /categories/propose ohne sichere Antwort liefert die Felder von category-proposal-refused.json', async () => {
		const llm = openAiCompatible({ isAllowedUtilityCost: false, confidence: 0.5, reasoning: 'Vielleicht' });
		try {
			const actual = await (await sendJson('POST', '/api/v1/categories/propose', { name: 'Bewachung' })).json();
			expect(drift(await sample('category-proposal-refused'), actual)).toEqual([]);
		} finally {
			llm.stop();
		}
	});

	it('GET /tenants/:id liefert die Felder von tenant.json', async () => {
		const actual = await (await callApi(`/api/v1/tenants/${rental.tenant}`)).json();
		expect(drift(await sample('tenant'), actual)).toEqual([]);
	});

	it('GET /tenants/:id/export liefert die Felder von tenant-export.json', async () => {
		await sendJson('POST', `/api/v1/tenants/${rental.tenant}/documents`, { title: 'Export', fileName: 'e.pdf', content: 'JVBERi0xLjQK' });
		const actual = await (await callApi(`/api/v1/tenants/${rental.tenant}/export`)).json();
		await db.delete(documents).where(and(eq(documents.tenantId, rental.tenant), eq(documents.title, 'Export')));
		expect(drift(await sample('tenant-export'), actual)).toEqual([]);
	});

	it('POST /tenants/:id/documents liefert die Felder von document-uploaded.json, abgelehnt die von document-refused.json', async () => {
		const upload = (content: Buffer) =>
			sendJson('POST', `/api/v1/tenants/${rental.tenant}/documents`, {
				title: 'Betreibungsauszug',
				fileName: 'betreibung.pdf',
				content: content.toString('base64')
			});
		const uploaded = (await (await upload(Buffer.from('%PDF-1.4'))).json()) as { id: string };
		try {
			expect(drift(await sample('document-uploaded'), uploaded)).toEqual([]);
		} finally {
			await callApi(`/api/v1/documents/${uploaded.id}`, { method: 'DELETE' });
		}
		const refused = await (await upload(Buffer.alloc(10 * 1024 * 1024 + 1))).json();
		expect(drift(await sample('document-refused'), refused)).toEqual([]);
	});

	it('GET /documents liefert die Felder von documents.json, DELETE einer Mahnung die von document-not-deletable.json', async () => {
		const jpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2]).toString('base64');
		const [reminder] = await db
			.insert(documents)
			.values({ tenantId: rental.tenant, type: 'reminder', reminderLevel: 1, title: 'Zahlungserinnerung', fileName: 'z.pdf', content: jpg, channel: 'letter', status: 'to_send' })
			.returning({ id: documents.id });
		// newest first: the upload is the element `drift` checks
		const uploaded = (await (
			await sendJson('POST', `/api/v1/tenants/${rental.tenant}/documents`, { title: 'Ausweiskopie', fileName: 'ausweis.jpg', content: jpg })
		).json()) as { id: string };
		try {
			const actual = await (await callApi(`/api/v1/documents?tenantId=${rental.tenant}`)).json();
			expect(drift(await sample('documents'), actual)).toEqual([]);
			const refused = await (await callApi(`/api/v1/documents/${reminder.id}`, { method: 'DELETE' })).json();
			expect(drift(await sample('document-not-deletable'), refused)).toEqual([]);
		} finally {
			await callApi(`/api/v1/documents/${uploaded.id}`, { method: 'DELETE' });
			await db.delete(documents).where(eq(documents.id, reminder.id));
		}
	});

	it('GET /apartments liefert die Felder von apartments.json', async () => {
		const actual = await (await callApi(`/api/v1/apartments?buildingId=${rental.building}`)).json();
		expect(drift(await sample('apartments'), actual)).toEqual([]);
	});

	it('GET /buildings liefert die Felder von buildings.json', async () => {
		const actual = await (await callApi(`/api/v1/buildings?search=${encodeURIComponent(`Ahornhof ${token}`)}`)).json();
		expect(drift(await sample('buildings'), actual)).toEqual([]);
	});

	it('POST /statements/preview, die scheitert, liefert die Felder von statement-calculation-refused.json', async () => {
		const response = await sendJson('POST', '/api/v1/statements/preview', {
			contractId: 'keine-id',
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31'
		});
		expect(response.status).toBe(400);
		expect(drift(await sample('statement-calculation-refused'), await response.json())).toEqual([]);
	});

	it('POST /statements/:id/generate-pdf, das scheitert, liefert die Felder von statement-pdf-failed.json', async () => {
		const response = await sendJson('POST', '/api/v1/statements/keine-id/generate-pdf', {});
		expect(response.status).toBe(500);
		expect(drift(await sample('statement-pdf-failed'), await response.json())).toEqual([]);
	});

	it('eine Anfrage, die das Schema verletzt, liefert die Felder von validation-refused.json', async () => {
		const response = await sendJson('POST', '/api/v1/statements/preview', { contractId: 42 });
		expect(response.status).toBe(422);
		expect(drift(await sample('validation-refused'), await response.json())).toEqual([]);
	});

	it('GET /statements/:id/pdf einer unbekannten Abrechnung liefert die Felder von statement-pdf-refused.json', async () => {
		const response = await callApi(`/api/v1/statements/${crypto.randomUUID()}/pdf`);
		expect(response.status).toBe(404);
		expect(drift(await sample('statement-pdf-refused'), await response.json())).toEqual([]);
	});

	// #450: a Nachzahlung's payment part without the town of the Firmenadresse (an installation from before)
	it('POST /statements/:id/generate-pdf ohne vollständige Firmenadresse liefert die Felder von statement-pdf-creditor-refused.json', async () => {
		const saved = await db.select().from(configuration).where(inArray(configuration.key, ['iban', 'company_city']));
		const [{ balance }] = await db.select({ balance: utilityStatements.balance }).from(utilityStatements).where(eq(utilityStatements.id, statementId));
		await db.delete(configuration).where(inArray(configuration.key, ['iban', 'company_city']));
		await db.insert(configuration).values({ key: 'iban', value: 'CH9300762011623852957' });
		await db.update(utilityStatements).set({ balance: '120.00' }).where(eq(utilityStatements.id, statementId));
		try {
			const response = await sendJson('POST', `/api/v1/statements/${statementId}/generate-pdf`, {});
			expect(response.status).toBe(400);
			expect(drift(await sample('statement-pdf-creditor-refused'), await response.json())).toEqual([]);
		} finally {
			await db.update(utilityStatements).set({ balance, pdfBlob: null, pdfGeneratedAt: null }).where(eq(utilityStatements.id, statementId));
			await db.delete(configuration).where(inArray(configuration.key, ['iban', 'company_city']));
			if (saved.length) await db.insert(configuration).values(saved.map(({ key, value }) => ({ key, value })));
		}
	});

	// the 2024 statement already bills the days after 31.03.2024
	it('PUT /contracts/:id mit einem Vertragsende vor einer Abrechnung liefert die Felder von contract-end-refused.json', async () => {
		const response = await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { endDate: '2024-03-31' });
		expect(response.status).toBe(409);
		expect(drift(await sample('contract-end-refused'), await response.json())).toEqual([]);
	});

	// #464: the 2024 draft counts the Akonto from the Vertragsbeginn
	it('PUT /contracts/:id mit einem Akonto in einer abgerechneten Zeit liefert die Felder von contract-advance-refused.json', async () => {
		const response = await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, {
			monthlyAdvancePayment: '200',
			advancePaymentFrom: '2024-07-01'
		});
		expect(response.status).toBe(400);
		expect(drift(await sample('contract-advance-refused'), await response.json())).toEqual([]);
	});

	// #464 (review 464-2 C-11): an end before a later Akonto
	it('PUT /contracts/:id mit einem Vertragsende vor einem späteren Akonto liefert die Felder von contract-end-advance-refused.json', async () => {
		await db.insert(contractAdvancePayments).values({ contractId: rental.contract, validFrom: '2099-01-01', amount: '200' });
		try {
			const response = await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { endDate: '2098-12-31', terminated: true });
			expect(response.status).toBe(400);
			expect(drift(await sample('contract-end-advance-refused'), await response.json())).toEqual([]);
		} finally {
			await db.delete(contractAdvancePayments).where(eq(contractAdvancePayments.validFrom, '2099-01-01'));
		}
	});

	// #464: a later Akonto the 2024 draft counts, entered before the draft (as the demo data could)
	it('DELETE /contracts/:id/advance-payments/:validFrom eines gezählten Akontos liefert die Felder von contract-advance-delete-refused.json', async () => {
		await db.insert(contractAdvancePayments).values({ contractId: rental.contract, validFrom: '2024-07-01', amount: '200' });
		const [{ stored }] = await db
			.update(utilityStatements)
			.set({ totalAdvancePayments: '2100.00' }) // 6 × 150 + 6 × 200: the draft counts the later Akonto
			.where(eq(utilityStatements.id, statementId))
			.returning({ stored: utilityStatements.totalAdvancePayments });
		expect(stored).toBe('2100.00');
		try {
			const response = await callApi(`/api/v1/contracts/${rental.contract}/advance-payments/2024-07-01`, { method: 'DELETE' });
			expect(response.status).toBe(400);
			expect(drift(await sample('contract-advance-delete-refused'), await response.json())).toEqual([]);
		} finally {
			await db.delete(contractAdvancePayments).where(eq(contractAdvancePayments.validFrom, '2024-07-01'));
			await db.update(utilityStatements).set({ totalAdvancePayments: '1800.00' }).where(eq(utilityStatements.id, statementId));
		}
	});

	// the 2024 statement bills its rent days: confirmed or not, it stays (#116)
	it('DELETE /contracts/:id eines Mietvertrags mit Abrechnung liefert die Felder von contract-delete-refused.json', async () => {
		const response = await callApi(`/api/v1/contracts/${rental.contract}?confirmMistake=true`, { method: 'DELETE' });
		expect(response.status).toBe(409);
		expect(drift(await sample('contract-delete-refused'), await response.json())).toEqual([]);
	});

	// a contract with an end and a notice: null fields are not checked (J2-3)
	it('GET /contracts liefert die Felder von contracts.json', async () => {
		const noticed = await createRental(crypto.randomUUID(), { startDate: '2024-04-01', monthlyAdvancePayment: '150' });
		try {
			await sendJson('PUT', `/api/v1/contracts/${noticed.contract}`, { endDate: '2099-03-31', terminated: true });
			const actual = await (await callApi(`/api/v1/contracts?buildingId=${noticed.building}&limit=1000`)).json();
			expect(drift(await sample('contracts'), actual)).toEqual([]);
			expect(actual).toMatchObject({ contracts: [{ endDate: '2099-03-31', terminated: true }] });
		} finally {
			await noticed.remove();
		}
	});

	it('GET /statements liefert die Felder von statements.json', async () => {
		const actual = await (await callApi(`/api/v1/statements?contractId=${rental.contract}`)).json();
		expect(drift(await sample('statements'), actual)).toEqual([]);
	});

	it('GET /heating-profiles liefert die Felder von heating-profiles.json', async () => {
		const actual = await (await callApi('/api/v1/heating-profiles?limit=100')).json();
		expect(drift(await sample('heating-profiles'), actual)).toEqual([]);
	});

	it('GET /statements einer Periode liefert die Felder von period-statements.json', async () => {
		const actual = await (await callApi(`/api/v1/statements?periodStart=${period.periodStart}&periodEnd=${period.periodEnd}&limit=1000`)).json();
		expect(drift(await sample('period-statements'), actual)).toEqual([]);
	});

	it('GET /tenants liefert die Felder von tenants.json', async () => {
		const actual = await (await callApi(`/api/v1/tenants?search=${encodeURIComponent(`Keller ${token}`)}`)).json();
		expect(drift(await sample('tenants'), actual)).toEqual([]);
	});

	it('GET /config liefert die Felder von config.json', async () => {
		const actual = await (await callApi('/api/v1/config')).json();
		expect(drift(await sample('config'), actual)).toEqual([]);
	});

	it('GET /audit-log liefert die Felder von audit-log.json', async () => {
		await sendJson('POST', '/api/v1/audit-log/logins', { provider: 'google' });
		const actual = (await (await callApi('/api/v1/audit-log')).json()) as { data: { id: string }[] };
		expect(drift(await sample('audit-log'), actual)).toEqual([]);
		await callApi(`/api/v1/audit-log/${actual.data[0].id}`, { method: 'DELETE' });
	});
});

// Last: they send and pay the statement the tests above read as a draft
describe('API-Verträge der Zahlung', () => {
	it('POST /statements/:id/send an einen Mieter ohne E-Mail-Adresse liefert die Felder von statement-send-refused.json', async () => {
		await db.update(tenants).set({ correspondenceChannel: 'email', email: null }).where(eq(tenants.id, rental.tenant));
		const response = await sendJson('POST', `/api/v1/statements/${statementId}/send`, {});
		await db.update(tenants).set({ correspondenceChannel: 'letter', email: 'anna.keller@example.ch' }).where(eq(tenants.id, rental.tenant));
		expect(response.status).toBe(400);
		expect(drift(await sample('statement-send-refused'), await response.json())).toEqual([]);
	});

	it('PUT /statements/:id/status mit einem Zahlungsdatum vor dem Abrechnungsdatum liefert die Felder von statement-paid-date-refused.json', async () => {
		await sendJson('PUT', `/api/v1/statements/${statementId}/status`, { status: 'sent' });
		const response = await sendJson('PUT', `/api/v1/statements/${statementId}/status`, { status: 'paid', paidDate: '2020-01-01' });
		expect(response.status).toBe(400);
		expect(drift(await sample('statement-paid-date-refused'), await response.json())).toEqual([]);
	});

	it('POST /statements/:id/payment-reset liefert die Felder von statement-payment-reset.json', async () => {
		const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });
		await sendJson('PUT', `/api/v1/statements/${statementId}/status`, { status: 'paid', paidDate: today });
		const actual = await (await callApi(`/api/v1/statements/${statementId}/payment-reset`, { method: 'POST' })).json();
		expect(drift(await sample('statement-payment-reset'), actual)).toEqual([]);
	});
});

// After the payment: the paid statement is replaced (#120)
describe('API-Verträge der Berichtigung', () => {
	it('POST /statements/:id/correction liefert die Felder von statement.json, ohne Mietstage die von statement-correction-refused.json', async () => {
		await callApi(`/api/v1/statements/${statementId}/replace`, { method: 'POST' });
		const corrected = await callApi(`/api/v1/statements/${statementId}/correction`, { method: 'POST' });
		expect(corrected.status).toBe(201);
		const { id } = (await corrected.json()) as { id: string };
		expect(drift(await sample('statement'), await (await callApi(`/api/v1/statements/${id}`)).json())).toEqual([]);
		await callApi(`/api/v1/statements/${id}`, { method: 'DELETE' });
		await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { startDate: '2025-02-01' });

		const refused = await callApi(`/api/v1/statements/${statementId}/correction`, { method: 'POST' });

		expect(refused.status).toBe(409);
		expect(drift(await sample('statement-correction-refused'), await refused.json())).toEqual([]);
	});
});
