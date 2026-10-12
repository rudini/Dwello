/**
 * Statement list route against the real PostgreSQL database (docker compose postgres on 5432)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { deleteConfig, getConfig, setConfig } from '../services/config.service';
import { deleteStatement } from '../services/statement.service';
import { updateTenant } from '../services/tenant.service';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
let statementId: string;

const call = async (path: string, init?: RequestInit) => (await callApi(`/api/v1/statements${path}`, init)).json();

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2024-01-01', monthlyAdvancePayment: '150' });
	const statement = (await call('/generate', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31'
		})
	})) as { id: string };
	statementId = statement.id;
});

afterAll(async () => {
	await deleteStatement(statementId);
	await rental.remove();
});

describe('GET /api/v1/statements?search', () => {
	it('findet Abrechnungen über den vollen Namen des Mieters', async () => {
		const result = (await call(`?search=${encodeURIComponent(`Anna Keller ${token}`)}`)) as { data: { id: string }[] };

		expect(result.data.map((s) => s.id)).toEqual([statementId]);
	});
});

// The PDF needs an IBAN for the QR-bill; the previous value is restored afterwards
async function withIban(test: () => Promise<void>) {
	const iban = await getConfig('iban');
	await setConfig('iban', 'CH9300762011623852957');
	try {
		await test();
	} finally {
		if (iban) await setConfig('iban', iban);
		else await deleteConfig('iban');
	}
}

const json = (method: string, body: object) => ({
	method,
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify(body)
});
const generatePdf = () => call(`/${statementId}/generate-pdf`, json('POST', {}));
const pdfGeneratedAt = async () => ((await call(`/${statementId}`)) as { pdfGeneratedAt: string | null }).pdfGeneratedAt;

describe('POST /api/v1/statements/:id/generate-pdf', () => {
	it('hält fest, wann das PDF erstellt wurde, damit Liste und Detail es zum Herunterladen anbieten', () =>
		withIban(async () => {
			const before = Date.now();
			await generatePdf();

			const listed = (await call(`?search=${encodeURIComponent(`Anna Keller ${token}`)}`)) as {
				data: { pdfGeneratedAt: string | null }[];
			};
			const generatedAt = new Date(listed.data[0].pdfGeneratedAt!).getTime();
			expect(generatedAt).toBeGreaterThanOrEqual(before - 1000);
		}));

	it('verwirft das PDF, wenn sich die Zahlungsfrist ändert, damit es neu erstellt werden kann', () =>
		withIban(async () => {
			await generatePdf();

			await call(`/${statementId}`, json('PUT', { paymentDeadline: '2025-03-31' }));
			expect(await pdfGeneratedAt()).toBeNull();

			await generatePdf();
			expect(await pdfGeneratedAt()).not.toBeNull();
		}));

	// Die gewöhnliche IBAN erlaubt keine QR-Referenz; der Einzahlungsschein trägt keine, also auch die Abrechnung nicht
	it('hält ohne QR-IBAN keine QR-Referenz fest', () =>
		withIban(async () => {
			expect(((await generatePdf()) as { qrReference: string | null }).qrReference).toBeNull();
		}));

	it('behält das PDF, wenn nur die Bemerkung ändert', () =>
		withIban(async () => {
			await generatePdf();

			await call(`/${statementId}`, json('PUT', { notes: 'Ratenzahlung vereinbart' }));
			expect(await pdfGeneratedAt()).not.toBeNull();
		}));
});

// Title in the document information of the stored PDF (PDFKit keeps it in an object of its own)
async function pdfTitle() {
	const pdf = Buffer.from(await (await callApi(`/api/v1/statements/${statementId}/pdf`)).arrayBuffer()).toString('latin1');
	const [, ref] = pdf.match(/\/Title (\d+) 0 R/) ?? [];
	const [, raw = ''] = pdf.match(new RegExp(`\\n${ref} 0 obj\\n\\((.*?)\\)\\nendobj`, 's')) ?? [];
	// PDFKit writes non-ASCII text as UTF-16BE behind a byte order mark
	return raw.startsWith('\xfe\xff') ? Buffer.from(raw.slice(2), 'latin1').swap16().toString('utf16le') : raw;
}

describe('PDF in der Sprache des Mieters', () => {
	it('erstellt das PDF in der Sprache, die beim Mieter hinterlegt ist', () =>
		withIban(async () => {
			await updateTenant(rental.tenant, { language: 'fr' });
			try {
				await generatePdf();
				expect(await pdfTitle()).toStartWith('Décompte des charges');
			} finally {
				await updateTenant(rental.tenant, { language: 'de' });
			}
		}));

	it('erstellt das PDF ohne andere Angabe auf Deutsch', () =>
		withIban(async () => {
			await generatePdf();
			expect(await pdfTitle()).toStartWith('Nebenkostenabrechnung');
		}));
});

describe('GET /api/v1/statements ohne PDF-Inhalt', () => {
	it('liefert in Liste und Detail nur den Zeitpunkt, das PDF selbst kommt über /pdf', () =>
		withIban(async () => {
			await generatePdf();

			const listed = (await call(`?search=${encodeURIComponent(`Anna Keller ${token}`)}`)) as {
				data: Record<string, unknown>[];
			};
			const detail = (await call(`/${statementId}`)) as Record<string, unknown>;

			for (const statement of [listed.data[0], detail]) {
				expect(statement.pdfGeneratedAt).not.toBeNull();
				expect(statement).not.toHaveProperty('pdfBlob');
			}
			expect((await callApi(`/api/v1/statements/${statementId}/pdf`)).headers.get('content-type')).toBe(
				'application/pdf'
			);
		}));
});

describe('PDF einer Abrechnung, die es nicht gibt oder die noch kein PDF hat', () => {
	const unknown = crypto.randomUUID();

	it('erstellt ohne IBAN kein PDF, weil der QR-Einzahlungsschein sie braucht', async () => {
		const response = await callApi(
			`/api/v1/statements/${statementId}/generate-pdf`,
			json('POST', {})
		);

		expect(response.status).toBe(400);
		expect(await response.json()).toEqual({
			error: 'IBAN not configured. Please set up company configuration first.',
			code: 'IBAN_MISSING',
			params: {}
		});
	});

	it('meldet eine unbekannte Abrechnung beim Erstellen und Herunterladen', async () => {
		for (const [path, init] of [
			['generate-pdf', json('POST', {})],
			['pdf', undefined],
			['pdf/base64', undefined]
		] as const) {
			const response = await callApi(`/api/v1/statements/${unknown}/${path}`, init);
			expect({ path, status: response.status, body: await response.json() }).toEqual({
				path,
				status: 404,
				body: { error: 'Statement not found' }
			});
		}
	});

	it('meldet ein PDF, das noch nicht erstellt wurde', async () => {
		// A new payment deadline discards the PDF
		await call(`/${statementId}`, json('PUT', { paymentDeadline: '2025-04-30' }));

		for (const path of ['pdf', 'pdf/base64']) {
			const response = await callApi(`/api/v1/statements/${statementId}/${path}`);
			expect({ path, status: response.status, body: await response.json() }).toEqual({
				path,
				status: 404,
				body: { error: 'PDF not generated yet. Call POST /:id/generate-pdf first.' }
			});
		}
	});

	it('liefert ein erstelltes PDF auch als Base64 für die Vorschau', () =>
		withIban(async () => {
			await generatePdf();

			const preview = (await call(`/${statementId}/pdf/base64`)) as {
				pdfBase64: string;
				mimeType: string;
			};
			expect(preview.mimeType).toBe('application/pdf');
			expect(Buffer.from(preview.pdfBase64, 'base64').toString('latin1')).toStartWith('%PDF');
		}));
});
