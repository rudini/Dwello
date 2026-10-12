/**
 * Refusals that reach the UI carry a stable code (and its values) next to the unchanged text,
 * so the UI can show them in the chosen language (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { deleteStatement } from '../services/statement.service';
import { sendJson } from './helpers/auth';
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
});
