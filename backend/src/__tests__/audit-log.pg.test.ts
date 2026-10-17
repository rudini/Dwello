/**
 * Protokoll (#357, decided in #111): changes and logins, each with its date, kept until the landlord deletes them
 * (real PostgreSQL database)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories as categoriesTable, invoices, utilityStatements } from '../db/schema';
import { recordStatementCorrection } from '../services/audit-log.service';
import { deleteConfig, getConfig, setConfig } from '../services/config.service';
import { callApi, sendJson } from './helpers/auth';
import { apiRecords, idOf, insertInvoice, invoicedBuilding } from './helpers/records';
import { openAiCompatible } from './helpers/llm';
import { createRental } from './helpers/rental';

type Entry = { id: string; occurredAt: string; action: string; details: Record<string, unknown> };

const token = crypto.randomUUID();
const feeRate = await getConfig('management_fee_pct');
const categories = apiRecords('categories');
const cleanUps: (() => Promise<unknown>)[] = [];

const today = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });

async function entries(): Promise<Entry[]> {
	return ((await (await callApi('/api/v1/audit-log')).json()) as { data: Entry[] }).data;
}
/** The entries of one action that name this test's records, newest first */
const entriesOf = async (action: string, detail: (details: Record<string, unknown>) => boolean = () => true) =>
	(await entries()).filter((entry) => entry.action === action && detail(entry.details));

afterAll(async () => {
	if (feeRate === '3') await deleteConfig('management_fee_pct');
	else if (feeRate) await setConfig('management_fee_pct', feeRate);
	for (const cleanUp of cleanUps) await cleanUp();
	await categories.removeAll();
	for (const entry of await entries()) {
		if (JSON.stringify(entry.details).includes(token)) await callApi(`/api/v1/audit-log/${entry.id}`, { method: 'DELETE' });
	}
});

describe('Protokoll der Verwaltungspauschale', () => {
	it('hält den alten und den neuen Satz fest, mit Datum', async () => {
		await sendJson('PUT', '/api/v1/config', { management_fee_pct: '3.5' });
		await sendJson('PUT', '/api/v1/config', { management_fee_pct: '4.25' });

		const [entry] = await entriesOf('management_fee_changed');
		expect(entry.details).toEqual({ from: '3.5', to: '4.25' });
		expect(new Date(entry.occurredAt).toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' })).toBe(today());
	});

	// Fachprüfung V-5: «4.250» ist derselbe Satz wie «4.25»
	it('hält nichts fest, wenn der Satz gleich bleibt', async () => {
		await sendJson('PUT', '/api/v1/config', { management_fee_pct: '4.25' });
		const before = (await entriesOf('management_fee_changed')).length;

		await sendJson('PUT', '/api/v1/config', { management_fee_pct: '4.250', company_city: 'Winterthur' });

		expect((await entriesOf('management_fee_changed')).length).toBe(before);
	});

	// Fachprüfung V-5: ohne gespeicherten Satz schlägt der Abrechnungslauf die Vorgabe von 3 % vor
	it('nennt die Vorgabe als alten Satz, wenn noch keiner gespeichert war', async () => {
		await deleteConfig('management_fee_pct');
		await sendJson('PUT', '/api/v1/config', { management_fee_pct: '0' });

		const [entry] = await entriesOf('management_fee_changed');
		expect(entry.details).toEqual({ from: '3', to: '0' });
	});

	it('hält das Zurücksetzen auf die Vorgabe fest', async () => {
		await sendJson('PUT', '/api/v1/config', { management_fee_pct: '4.25' });
		await callApi('/api/v1/config/management_fee_pct', { method: 'DELETE' });

		const [entry] = await entriesOf('management_fee_changed');
		expect(entry.details).toEqual({ from: '4.25', to: '3' });
	});
});

describe('Protokoll der Umlagefähigkeit einer Kategorie', () => {
	it('hält fest, dass eine Kategorie nicht mehr umlagefähig ist und wieder umlagefähig', async () => {
		const name = `Gartenpflege ${token}`;
		const id = await idOf(await categories.create({ name, nameDE: name, isAllowedUtilityCost: true }));

		await categories.send('PUT', `/${id}`, { isAllowedUtilityCost: false });
		await categories.send('PUT', `/${id}`, { description: 'Rasen mähen' });
		await categories.send('PUT', `/${id}`, { isAllowedUtilityCost: true });

		const names = { name, nameDE: name, nameFR: null, nameIT: null, nameEN: null };
		const ofCategory = await entriesOf('category_allocability_changed', (details) => details.categoryId === id);
		expect(ofCategory.map((entry) => entry.details)).toEqual([
			{ categoryId: id, ...names, allocable: true },
			{ categoryId: id, ...names, allocable: false, invoices: 0 }
		]);
	});

	// Fachprüfung V-1: die Rechnungen der Kategorie fliessen damit nicht mehr in die Abrechnung
	it('nennt, wie viele Rechnungen damit nicht mehr umlagefähig sind', async () => {
		const name = `Schneeräumung ${token}`;
		const id = await idOf(await categories.create({ name, nameDE: name, isAllowedUtilityCost: true }));
		cleanUps.push(await invoicedBuilding(`Ulmenhof ${token}`, { categoryId: id }));
		await insertInvoice((await db.select().from(invoices).where(eq(invoices.categoryId, id)))[0].buildingId, { categoryId: id });

		await categories.send('PUT', `/${id}`, { isAllowedUtilityCost: false });

		const [entry] = await entriesOf('category_allocability_changed', (details) => details.categoryId === id);
		expect(entry.details).toMatchObject({ allocable: false, invoices: 2 });
	});
});

describe('Protokoll der umlagefähigen Rechnungen', () => {
	it('hält fest, dass eine Rechnung als nicht umlagefähig markiert und wieder umlagefähig ist', async () => {
		const supplier = `Hauswart Meier ${token}`;
		cleanUps.push(await invoicedBuilding(`Lindenhof ${token}`, { billingEntityName: supplier, description: 'Treppenhausreinigung', amount: '450.00' }));
		const [invoice] = await db.select().from(invoices).where(eq(invoices.billingEntityName, supplier));

		await sendJson('PUT', `/api/v1/invoices/${invoice.id}`, { isValidUtilityCost: false });
		await sendJson('PUT', `/api/v1/invoices/${invoice.id}`, { description: 'Treppenhausreinigung' });
		await sendJson('PUT', `/api/v1/invoices/${invoice.id}`, { isValidUtilityCost: true });

		const ofInvoice = await entriesOf('invoice_allocability_changed', (details) => details.invoiceId === invoice.id);
		// Fachprüfung V-6: Rechnungsdatum und Gebäude machen den Eintrag eindeutig
		const details = {
			invoiceId: invoice.id,
			description: 'Treppenhausreinigung',
			supplier,
			invoiceDate: '2025-03-31',
			amount: '450.00',
			building: `Lindenhof ${token}`
		};
		expect(ofInvoice.map((entry) => entry.details)).toEqual([
			{ ...details, allocable: true },
			{ ...details, allocable: false }
		]);
	});

	// Fachprüfung V-1: in eine nicht umlagefähige Kategorie verschoben, fliesst die Rechnung nicht mehr in die Abrechnung
	it('hält fest, dass eine Rechnung mit ihrer neuen Kategorie nicht mehr umlagefähig ist', async () => {
		const supplier = `Dachdecker Huber ${token}`;
		cleanUps.push(await invoicedBuilding(`Birkenhof ${token}`, { billingEntityName: supplier }));
		const [invoice] = await db.select().from(invoices).where(eq(invoices.billingEntityName, supplier));
		const [repairs] = await db.select().from(categoriesTable).where(eq(categoriesTable.name, 'Repairs'));

		await sendJson('PUT', `/api/v1/invoices/${invoice.id}`, { categoryId: repairs.id, isValidUtilityCost: true });

		const [entry] = await entriesOf('invoice_allocability_changed', (details) => details.invoiceId === invoice.id);
		expect(entry.details).toMatchObject({ supplier, allocable: false });
	});
	// Fachprüfung V-1: die KI ordnet die Rechnung einer nicht umlagefähigen Kategorie zu
	it('hält fest, dass eine Rechnung nach der KI nicht mehr umlagefähig ist', async () => {
		const supplier = `Sanitär Keller ${token}`;
		cleanUps.push(await invoicedBuilding(`Eschenhof ${token}`, { billingEntityName: supplier }));
		const [invoice] = await db.select().from(invoices).where(eq(invoices.billingEntityName, supplier));
		const llm = openAiCompatible({ category: 'Repairs', confidence: 0.95, isAllowedUtilityCost: false });
		try {
			await callApi(`/api/v1/invoices/${invoice.id}/recategorize`, { method: 'POST' });
		} finally {
			llm.stop();
		}

		const [entry] = await entriesOf('invoice_allocability_changed', (details) => details.invoiceId === invoice.id);
		expect(entry.details).toMatchObject({ supplier, allocable: false });
	});
});

describe('Protokoll einer zurückgesetzten Zahlung', () => {
	it('hält die Abrechnung mit dem Zahlungsdatum fest', async () => {
		const rental = await createRental(token, { startDate: '2023-01-01', monthlyAdvancePayment: '100' });
		cleanUps.push(() => rental.remove());
		const id = await idOf(
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: rental.contract,
				buildingId: rental.building,
				periodStart: '2023-01-01',
				periodEnd: '2023-12-31'
			})
		);
		cleanUps.unshift(() => callApi(`/api/v1/statements/${id}`, { method: 'DELETE' }));
		await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'sent' });
		await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'paid', paidDate: today() });

		await callApi(`/api/v1/statements/${id}/payment-reset`, { method: 'POST' });

		const statement = (await (await callApi(`/api/v1/statements/${id}`)).json()) as { statementNumber: string };
		const [entry] = await entriesOf('payment_reset', (details) => details.statementId === id);
		expect(entry.details).toEqual({ statementId: id, number: statement.statementNumber, paidDate: today() });
	});
});

// #120 (#358): «Abrechnung berichtigen» replaces the sent statement; its berichtigte Abrechnung follows as a draft
describe('Protokoll einer berichtigten Abrechnung', () => {
	it('hält die ersetzte Abrechnung mit ihrer Nummer fest', async () => {
		const rental = await createRental(`${token}-b`, { startDate: '2023-01-01', monthlyAdvancePayment: '100' });
		cleanUps.push(() => rental.remove());
		const id = await idOf(
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: rental.contract,
				buildingId: rental.building,
				periodStart: '2023-01-01',
				periodEnd: '2023-12-31'
			})
		);
		cleanUps.unshift(() => db.delete(utilityStatements).where(eq(utilityStatements.id, id)));
		await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'sent' });

		const response = await callApi(`/api/v1/statements/${id}/replace`, { method: 'POST' });

		expect(response.status).toBe(200);
		const statement = (await (await callApi(`/api/v1/statements/${id}`)).json()) as { statementNumber: string };
		const [entry] = await entriesOf('statement_corrected', (details) => details.statementId === id);
		expect(entry.details).toEqual({ statementId: id, number: statement.statementNumber });
	});
});

describe('Protokoll der Anmeldungen', () => {
	it('hält eine Anmeldung mit dem Anbieter fest, ohne weitere Angaben', async () => {
		const before = (await entriesOf('login')).length;

		const response = await sendJson('POST', '/api/v1/audit-log/logins', { provider: 'microsoft' });

		expect(response.status).toBe(201);
		const logins = await entriesOf('login');
		expect(logins.length).toBe(before + 1);
		expect(logins[0].details).toEqual({ provider: 'microsoft' });
		await callApi(`/api/v1/audit-log/${logins[0].id}`, { method: 'DELETE' });
	});

	it('lehnt einen unbekannten Anbieter ab', async () => {
		const response = await sendJson('POST', '/api/v1/audit-log/logins', { provider: `x-${token}` });

		expect(response.status).toBe(422);
	});
});

describe('Einträge löschen', () => {
	it('löscht nur den gewählten Eintrag; die übrigen bleiben', async () => {
		const statement = (statementNumber: string) => ({ id: crypto.randomUUID(), statementNumber });
		await recordStatementCorrection(statement(`NK-1-${token}`));
		await recordStatementCorrection(statement(`NK-2-${token}`));
		const ours = () => entriesOf('statement_corrected', (details) => [`NK-1-${token}`, `NK-2-${token}`].includes(String(details.number)));
		const [newest, older] = await ours();

		const response = await callApi(`/api/v1/audit-log/${newest.id}`, { method: 'DELETE' });

		expect(response.status).toBe(204);
		expect((await ours()).map((entry) => entry.id)).toEqual([older.id]);
	});

	it('meldet einen Eintrag, den es nicht gibt', async () => {
		const response = await callApi(`/api/v1/audit-log/${crypto.randomUUID()}`, { method: 'DELETE' });

		expect(response.status).toBe(404);
	});
});
