/**
 * Refusals that reach the UI carry a stable code (and its values) next to the unchanged text,
 * so the UI can show them in the chosen language (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { configuration, utilityStatements } from '../db/schema';
import { deleteConfig, getConfig, setConfig } from '../services/config.service';
import { deleteStatement } from '../services/statement.service';
import { callApi, sendJson } from './helpers/auth';
import { expectRejection } from './helpers/records';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
const unknown = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
let statementId: string;

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2024-01-01', monthlyAdvancePayment: '150' });
	const response = await sendJson('POST', '/api/v1/statements/generate', {
		contractId: rental.contract,
		buildingId: rental.building,
		periodStart: '2024-01-01',
		periodEnd: '2024-12-31'
	});
	statementId = ((await response.json()) as { id: string }).id;
});

afterAll(async () => {
	await deleteStatement(statementId);
	await rental.remove();
});

describe('Fehlercodes für die Oberfläche', () => {
	it('nennt beim Testen einer Formel zu jedem Fehler den Code', async () => {
		const response = await sendJson('POST', '/api/v1/distribution-keys/test-formula', { formula: '{persons}' });

		expect(await response.json()).toMatchObject({
			errorCodes: [{ code: 'FORMULA_UNKNOWN_VARIABLE', params: { variable: 'persons' } }]
		});
	});

	it('nennt beim Speichern einer ungültigen Formel jeden Fehler mit Code', async () => {
		const response = await sendJson('POST', '/api/v1/distribution-keys', {
			name: `Zwei Fehler ${token}`,
			type: 'custom',
			formula: '{persons} ++ {area}'
		});

		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({
			code: 'FORMULA_INVALID',
			causes: [
				{ code: 'FORMULA_UNKNOWN_VARIABLE', params: { variable: 'persons' } },
				{ code: 'FORMULA_CONSECUTIVE_OPERATORS' }
			]
		});
	});

	it('verlangt eine Formel für einen eigenen Verteilschlüssel', async () => {
		const response = await sendJson('POST', '/api/v1/distribution-keys', { name: `Ohne Formel ${token}`, type: 'custom' });

		await expectRejection(response, 400, 'Bitte geben Sie eine Formel ein.', 'FORMULA_REQUIRED');
	});

	it('meldet einen Verteilschlüssel, den es nicht gibt, beim Löschen', async () => {
		const response = await sendJson('DELETE', `/api/v1/distribution-keys/${unknown}`);

		await expectRejection(response, 404, 'Distribution key not found', 'DISTRIBUTION_KEY_NOT_FOUND');
	});

	it('meldet eine Kategorie, die es nicht gibt, beim Speichern', async () => {
		const response = await sendJson('PUT', `/api/v1/categories/${unknown}`, { nameDE: `Weg ${token}` });

		await expectRejection(response, 404, 'Category not found', 'CATEGORY_NOT_FOUND');
	});

	it('meldet eine Liegenschaft, die es nicht gibt, beim Speichern', async () => {
		const response = await sendJson('PUT', `/api/v1/buildings/${unknown}`, { name: `Weg ${token}` });

		await expectRejection(response, 404, 'Building not found', 'BUILDING_NOT_FOUND');
	});

	it('meldet eine unbekannte Kategorie beim Erfassen einer Rechnung', async () => {
		const response = await sendJson('POST', '/api/v1/invoices?skipLlm=true', {
			buildingId: rental.building,
			categoryId: unknown,
			invoiceDate: '2024-05-01',
			billingEntityName: 'Muster AG',
			description: 'Hauswart',
			amount: '100.00'
		});

		await expectRejection(response, 400, 'Category not found', 'CATEGORY_NOT_FOUND');
	});

	it('meldet einen Mietvertrag ausserhalb der Abrechnungsperiode', async () => {
		const response = await sendJson('POST', '/api/v1/statements/preview', {
			contractId: rental.contract,
			periodStart: '2020-01-01',
			periodEnd: '2020-12-31'
		});

		await expectRejection(response, 400, 'Contract does not overlap with the specified period', 'CONTRACT_NOT_IN_PERIOD');
	});

	it('meldet eine unbekannte Abrechnung beim Mahnen', async () => {
		const response = await sendJson('POST', `/api/v1/statements/${unknown}/reminders`);

		await expectRejection(response, 404, 'Abrechnung nicht gefunden.', 'STATEMENT_NOT_FOUND');
	});

	it('meldet eine unbekannte Abrechnung beim Erstellen des PDF', async () => {
		const response = await sendJson('POST', `/api/v1/statements/${unknown}/generate-pdf`, {});

		await expectRejection(response, 404, 'Statement not found', 'STATEMENT_NOT_FOUND');
	});

	it('meldet eine unbekannte Abrechnung beim Löschen', async () => {
		const response = await sendJson('DELETE', `/api/v1/statements/${unknown}`);

		await expectRejection(response, 404, 'Statement not found', 'STATEMENT_NOT_FOUND');
	});

	it('meldet eine IBAN mit falscher Prüfziffer beim Erstellen und Herunterladen des PDF', async () => {
		const iban = await getConfig('iban');
		// written past the settings' own check, as by an older version
		await setConfig('iban', 'CH9300762011623852957');
		await db.update(configuration).set({ value: 'CH9300762011623852958' }).where(eq(configuration.key, 'iban'));
		// the tenant owes an amount, so the PDF carries a QR-bill with the IBAN
		await db.update(utilityStatements).set({ balance: '120.00' }).where(eq(utilityStatements.id, statementId));
		try {
			for (const response of [
				await sendJson('POST', `/api/v1/statements/${statementId}/generate-pdf`, {}),
				await callApi(`/api/v1/statements/${statementId}/pdf`)
			])
				await expectRejection(response, 400, 'Invalid IBAN: Invalid IBAN checksum', 'IBAN_INVALID');
		} finally {
			if (iban) await setConfig('iban', iban);
			else await deleteConfig('iban');
		}
	});

	it('meldet ein PDF, das aus einem unerwarteten Grund nicht entsteht, mit Code', async () => {
		for (const response of [
			await sendJson('POST', '/api/v1/statements/keine-id/generate-pdf', {}),
			await callApi('/api/v1/statements/keine-id/pdf'),
			await callApi('/api/v1/statements/keine-id/pdf/base64')
		])
			await expectRejection(response, 500, 'PDF generation failed', 'PDF_FAILED');
	});

	it('meldet eine Berechnung, die aus einem unerwarteten Grund scheitert, mit Code', async () => {
		const input = { contractId: 'keine-id', buildingId: rental.building, periodStart: '2024-01-01', periodEnd: '2024-12-31' };

		await expectRejection(await sendJson('POST', '/api/v1/statements/preview', input), 400, 'Calculation failed', 'CALCULATION_FAILED');
		await expectRejection(
			await sendJson('POST', '/api/v1/statements/generate', input),
			400,
			'Statement generation failed',
			'CALCULATION_FAILED'
		);
	});

	// #127: Elysia's own validation body had no code, the UI showed its English text
	it('meldet eine Anfrage, die das Schema verletzt, mit Code', async () => {
		const response = await sendJson('POST', '/api/v1/statements/preview', { contractId: 42 });

		expect(response.status).toBe(422);
		expect(await response.json()).toMatchObject({ code: 'VALIDATION_ERROR', params: {} });
	});
});
