/**
 * Statement list route against the real PostgreSQL database (docker compose postgres on 5432)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { deleteConfig, getConfig, setConfig } from '../services/config.service';
import { deleteStatement } from '../services/statement.service';
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

	it('behält das PDF, wenn nur die Bemerkung ändert', () =>
		withIban(async () => {
			await generatePdf();

			await call(`/${statementId}`, json('PUT', { notes: 'Ratenzahlung vereinbart' }));
			expect(await pdfGeneratedAt()).not.toBeNull();
		}));
});
