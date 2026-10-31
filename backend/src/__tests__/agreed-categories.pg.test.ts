/**
 * #91: a statement bills a Mietvertrag only the Nebenkosten its contract agrees (Art. 257a Abs. 2 OR); a new contract
 * starts with every umlagefähige category, a category created later is not agreed until the landlord says so
 * (real PostgreSQL database)
 *
 * Apartment 2.01 (70 m²) alone in the building, caretaker invoice CHF 1000 and lift invoice CHF 400 by area, 2024.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, fuelStocks, heatingProfiles, invoices, utilityStatements } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';
import { insertInvoice } from './helpers/records';
import { readPdf } from './helpers/pdf-text';
import { deleteConfig, getConfig, setConfig } from '../services/config.service';
import { generateStatementPdf, getStatementPdf } from '../services/statement-pdf.service';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { deleteContract } from '../services/contract.service';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
const ids: Record<string, string> = {};
const own: string[] = [];

const period = { periodStart: '2024-01-01', periodEnd: '2024-12-31' };
const preview = async (contractId: string) =>
	(await (await sendJson('POST', '/api/v1/statements/preview', { contractId, ...period, managementFeePercent: 0 })).json()) as {
		totalCosts: number;
		lineItems: { categoryId: string }[];
	};
const contract = async (contractId: string) =>
	(await (await callApi(`/api/v1/contracts/${contractId}`)).json()) as { agreedCategoryIds: string[] };
const answers = async (contractId: string) =>
	(await (
		await callApi(`/api/v1/contracts/${contractId}/agreements?periodStart=2024-01-01&periodEnd=2024-12-31`)
	).json()) as { categoryId: string; agreed: boolean | null }[];

async function ownCategory(name: string) {
	const [category] = await db.insert(categories).values({ name: `${name} ${token}`, isAllowedUtilityCost: true, type: 'custom' }).returning();
	own.push(category.id);
	return category.id;
}

beforeAll(async () => {
	const named = await db.select().from(categories).where(inArray(categories.name, ['Caretaker', 'Elevator', 'Administration']));
	for (const category of named) ids[category.name] = category.id;
	rental = await createRental(token, { startDate: '2020-01-01', monthlyAdvancePayment: '0' });
	await insertInvoice(rental.building, { amount: '1000.00', invoiceDate: '2024-06-30' });
	await insertInvoice(rental.building, { categoryId: ids.Elevator, description: 'Lift 2024', amount: '400.00', invoiceDate: '2024-06-30' });
});

afterAll(async () => {
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
	if (own.length) await db.delete(categories).where(inArray(categories.id, own));
});

describe('Vereinbarte Nebenkosten des Mietvertrags', () => {
	it('vereinbart bei einem neuen Mietvertrag alle umlagefähigen Kategorien', async () => {
		const { agreedCategoryIds } = await contract(rental.contract);

		expect(agreedCategoryIds).toContain(ids.Caretaker);
		expect(agreedCategoryIds).toContain(ids.Elevator);
		expect(agreedCategoryIds).not.toContain(ids.Administration);
	});

	it('rechnet eine nicht vereinbarte Kategorie nicht ab', async () => {
		expect((await preview(rental.contract)).totalCosts).toBe(1400);

		const answered = await sendJson('PUT', `/api/v1/contracts/${rental.contract}/agreements`, { categoryId: ids.Elevator, agreed: false });
		const { totalCosts, lineItems } = await preview(rental.contract);

		expect(answered.status).toBe(200);
		expect(totalCosts).toBe(1000);
		expect(lineItems.map((item) => item.categoryId)).not.toContain(ids.Elevator);
		expect(await answers(rental.contract)).toContainEqual({ categoryId: ids.Elevator, agreed: false });
	});

	it('speichert die vereinbarten Nebenkosten mit dem Mietvertrag', async () => {
		const saved = await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { agreedCategoryIds: [ids.Caretaker] });
		const { agreedCategoryIds } = await contract(rental.contract);

		expect(saved.status).toBe(200);
		expect(agreedCategoryIds).toEqual([ids.Caretaker]);
		expect(await answers(rental.contract)).toContainEqual({ categoryId: ids.Elevator, agreed: false });
	});

	// A category created after the contract was recorded is not agreed until the landlord says so
	it('rechnet eine neue Kategorie erst ab, wenn sie als vereinbart angegeben ist', async () => {
		const roof = await ownCategory('Dachreinigung');
		await insertInvoice(rental.building, { categoryId: roof, description: 'Dach 2024', amount: '200.00', invoiceDate: '2024-05-31' });

		expect(await answers(rental.contract)).toContainEqual({ categoryId: roof, agreed: null });
		expect((await preview(rental.contract)).totalCosts).toBe(1000);

		// code review W10c S3 C-1: saving the form (it sends the list it shows) leaves an unanswered category unanswered
		await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { agreedCategoryIds: [ids.Caretaker] });
		expect(await answers(rental.contract)).toContainEqual({ categoryId: roof, agreed: null });

		await sendJson('PUT', `/api/v1/contracts/${rental.contract}/agreements`, { categoryId: roof, agreed: true });

		expect(await answers(rental.contract)).toContainEqual({ categoryId: roof, agreed: true });
		expect((await preview(rental.contract)).totalCosts).toBe(1200);
	});

	it('nennt nur Kategorien mit Kosten in der Abrechnungsperiode', async () => {
		const unused = await ownCategory('Ohne Kosten');

		expect((await answers(rental.contract)).map((answer) => answer.categoryId)).not.toContain(unused);
	});

	// Domain review V-15, code review C-3: nothing to ask without an amount or without Mietstage in the days billed
	it('nennt keine Kategorie, deren Rechnungen sich aufheben oder vor dem Mietvertrag liegen', async () => {
		const cancelled = await ownCategory('Gutschrift');
		const before = await ownCategory('Vorher');
		await insertInvoice(rental.building, { amount: '300.00', invoiceDate: '2020-03-31' });
		await insertInvoice(rental.building, { categoryId: cancelled, amount: '80.00', invoiceDate: '2020-02-29' });
		await insertInvoice(rental.building, { categoryId: cancelled, amount: '-80.00', invoiceDate: '2020-04-30' });
		await insertInvoice(rental.building, {
			categoryId: before,
			amount: '90.00',
			invoiceDate: '2019-12-31',
			servicePeriodStart: '2019-07-01',
			servicePeriodEnd: '2019-12-31'
		});
		const listed = (
			(await (
				await callApi(`/api/v1/contracts/${rental.contract}/agreements?periodStart=2019-07-01&periodEnd=2020-06-30`)
			).json()) as { categoryId: string }[]
		).map((answer) => answer.categoryId);

		expect(listed).toContain(ids.Caretaker);
		expect(listed).not.toContain(cancelled);
		expect(listed).not.toContain(before);
	});

		it('lehnt eine Antwort ohne Ja oder Nein ab', async () => {
		const response = await sendJson('PUT', `/api/v1/contracts/${rental.contract}/agreements`, { categoryId: ids.Elevator });

		expect(response.status).toBe(422);
	});
});

// Domain review W10c V-2, V-3: a statement without the categories its contract does not agree keeps nothing of them
describe('Abrechnung ohne nicht vereinbarte Nebenkosten', () => {
	const other = crypto.randomUUID();
	let heated: Awaited<ReturnType<typeof createRental>>;
	let statementId: string;

	beforeAll(async () => {
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		const [profile] = await db.select().from(heatingProfiles).limit(1);
		heated = await createRental(other, { startDate: '2020-01-01', monthlyAdvancePayment: '0' });
		await insertInvoice(heated.building, { amount: '1000.00', invoiceDate: '2024-06-30' });
		await insertInvoice(heated.building, { categoryId: ids.Elevator, description: 'Lift 2024', amount: '400.00', invoiceDate: '2024-06-30' });
		await insertInvoice(heated.building, { categoryId: heating.id, description: 'Heizöl 2024', amount: '900.00', invoiceDate: '2024-03-31' });
		for (const [readingDate, amount] of [['2023-12-31', '3000.00'], ['2024-12-31', '2000.00']])
			await sendJson('POST', `/api/v1/buildings/${heated.building}/fuel-stocks`, { readingDate, amount, categoryId: heating.id });
		for (const categoryId of [heating.id, ids.Elevator])
			await sendJson('PUT', `/api/v1/contracts/${heated.contract}/agreements`, { categoryId, agreed: false });
		const response = await sendJson('POST', '/api/v1/statements/generate', {
			contractId: heated.contract,
			buildingId: heated.building,
			...period,
			heatingProfileId: profile.id,
			managementFeePercent: 0
		});
		statementId = ((await response.json()) as { id: string }).id;
	});

	afterAll(async () => {
		await db.delete(utilityStatements).where(eq(utilityStatements.contractId, heated.contract));
		await db.delete(fuelStocks).where(eq(fuelStocks.buildingId, heated.building));
		await db.delete(invoices).where(eq(invoices.buildingId, heated.building));
		await heated.remove();
	});

	it('nennt weder Heizprofil noch Tankbestand, wenn die Heizkosten nicht vereinbart sind', async () => {
		const [statement] = await db.select().from(utilityStatements).where(eq(utilityStatements.id, statementId));

		expect(Number(statement.totalCosts)).toBe(1000);
		expect(statement.heatingShare).toBeNull();
		expect(statement.fuelStock).toBeNull();
	});

	it('meldet die Rechnungen nicht vereinbarter Nebenkosten nicht als geändert', async () => {
		const { invoiceIds } = (await (await callApi(`/api/v1/statements/${statementId}/changed-invoices`)).json()) as { invoiceIds: string[] };

		expect(invoiceIds).toEqual([]);
	});

	it('nennt die Abrechnung nicht als eine, der die Rechnung einer nicht vereinbarten Kategorie fehlt', async () => {
		const [lift] = await db.select({ id: invoices.id }).from(invoices).where(and(eq(invoices.buildingId, heated.building), eq(invoices.categoryId, ids.Elevator)));
		const periods = (await (await callApi(`/api/v1/invoices/${lift.id}/statements`)).json()) as { missedIn: unknown[] };

		expect(periods.missedIn).toEqual([]);
	});

	// Domain review M-2: the PDF names the agreed categories it bills; one created before #91 billed every category
	it('nennt im PDF die vereinbarten Nebenkosten, die es abrechnet', async () => {
		const iban = await getConfig('iban');
		await setConfig('iban', 'CH4431999123000889012');
		const text = async () => {
			await generateStatementPdf(statementId, 'de');
			return readPdf(Buffer.from((await getStatementPdf(statementId)).pdfBlob!, 'base64')).flowing;
		};
		expect(await text()).toContain('Abgerechnet sind nur die im Mietvertrag vereinbarten Nebenkosten: Hauswart.');

		await db.update(utilityStatements).set({ agreedCategoryIds: null }).where(eq(utilityStatements.id, statementId));

		const before = await text();
		await (iban ? setConfig('iban', iban) : deleteConfig('iban'));

		expect(before).not.toContain('vereinbarten Nebenkosten');
	});

	// #511 (Persona Dr. Weber 461 P-2, Fachreview 511-1 V-1): the PDF names the Verwaltungspauschale as agreed when it
	// bills one, with its legal basis; not without a fee
	it('nennt im PDF die Verwaltungspauschale als vereinbart, wenn die Abrechnung eine verrechnet', async () => {
		const iban = await getConfig('iban');
		await setConfig('iban', 'CH4431999123000889012');
		const text = async (managementFee: string) => {
			await db.update(utilityStatements).set({ managementFee }).where(eq(utilityStatements.id, statementId));
			await generateStatementPdf(statementId, 'de');
			return readPdf(Buffer.from((await getStatementPdf(statementId)).pdfBlob!, 'base64')).flowing;
		};
		const [{ fee }] = await db.select({ fee: utilityStatements.managementFee }).from(utilityStatements).where(eq(utilityStatements.id, statementId));
		const [withFee, without] = [await text('12.90'), await text('0.00')];
		await db.update(utilityStatements).set({ managementFee: fee }).where(eq(utilityStatements.id, statementId));
		await (iban ? setConfig('iban', iban) : deleteConfig('iban'));

		expect(withFee).toContain('Die Verwaltungspauschale ist im Mietvertrag vereinbart. Sie gilt den Aufwand für das Erstellen dieser Abrechnung ab (Art. 4 Abs. 3 VMWG).');
		expect(without).not.toContain('Verwaltungspauschale ist im Mietvertrag');
	});

		// Code review C-1: a billed invoice stays billed, also in a category the contract does not agree
	it('nennt die Abrechnung weiter, wenn eine abgerechnete Rechnung in eine nicht vereinbarte Kategorie wechselt', async () => {
		const [caretaker] = await db
			.select({ id: invoices.id })
			.from(invoices)
			.where(and(eq(invoices.buildingId, heated.building), eq(invoices.categoryId, ids.Caretaker)));
		const moved = await sendJson('PUT', `/api/v1/invoices/${caretaker.id}`, { categoryId: ids.Elevator });
		expect(moved.status).toBe(200);
		const periods = (await (await callApi(`/api/v1/invoices/${caretaker.id}/statements`)).json()) as { billedIn: unknown[] };

		expect(periods.billedIn).toEqual([{ start: '2024-01-01', end: '2024-12-31' }]);
	});
});

// Code review C-5: what a new contract agrees, with and without a list from the form
describe('Neuer Mietvertrag', () => {
	const other = crypto.randomUUID();
	let fresh: Awaited<ReturnType<typeof createRental>>;
	let listed: { apartment: string; tenant: string; contract: string };
	let ownId: string;

	beforeAll(async () => {
		ownId = await ownCategory('Treppenhausreinigung');
		fresh = await createRental(other, { startDate: '2020-01-01', monthlyAdvancePayment: '0' });
		const apartment = await createApartment({ buildingId: fresh.building, number: '1.02', floor: 1, area: '50', rooms: '2' });
		const tenant = await createTenant({ firstName: 'Beat', lastName: `Huber ${other}` });
		const response = await sendJson('POST', '/api/v1/contracts', {
			apartmentId: apartment.id,
			tenantId: tenant.id,
			startDate: '2024-01-01',
			baseRent: '900',
			monthlyAdvancePayment: '0',
			agreedCategoryIds: [ids.Caretaker]
		});
		listed = { apartment: apartment.id, tenant: tenant.id, contract: ((await response.json()) as { id: string }).id };
	});

	afterAll(async () => {
		await deleteContract(listed.contract, true);
		await deleteTenant(listed.tenant);
		await deleteApartment(listed.apartment);
		await fresh.remove();
	});

	it('vereinbart auch eine eigene umlagefähige Kategorie', async () => {
		expect((await contract(fresh.contract)).agreedCategoryIds).toContain(ownId);
	});

	// Code review C-11: a category no longer umlagefähig is no longer named by the contract
	it('nennt keine Kategorie mehr, die nicht mehr umlagefähig ist', async () => {
		await db.update(categories).set({ isAllowedUtilityCost: false }).where(eq(categories.id, ownId));

		expect((await contract(fresh.contract)).agreedCategoryIds).not.toContain(ownId);
		expect((await contract(fresh.contract)).agreedCategoryIds).toContain(ids.Caretaker);
	});

		// E2E run: a category deleted meanwhile, or an unknown id, is left out instead of refusing the contract
	it('übergeht eine unbekannte Kategorie und speichert eine leere Liste', async () => {
		const unknown = await sendJson('PUT', `/api/v1/contracts/${fresh.contract}`, { agreedCategoryIds: [crypto.randomUUID()] });
		const empty = await sendJson('PUT', `/api/v1/contracts/${fresh.contract}`, { agreedCategoryIds: [] });

		expect([unknown.status, empty.status]).toEqual([200, 200]);
		expect((await contract(fresh.contract)).agreedCategoryIds).toEqual([]);
	});

	// code review W10c close C-5: the form shows only umlagefähige categories; one agreed while it is not umlagefähig
	// keeps its answer when the form is saved
	it('lässt eine vereinbarte, nicht mehr umlagefähige Kategorie beim Speichern vereinbart', async () => {
		const umlagefaehig = (allowed: boolean) =>
			db.update(categories).set({ isAllowedUtilityCost: allowed }).where(eq(categories.id, ownId));
		try {
			await umlagefaehig(true);
			const answered = await sendJson('PUT', `/api/v1/contracts/${fresh.contract}/agreements`, { categoryId: ownId, agreed: true });
			await umlagefaehig(false);
			const saved = await sendJson('PUT', `/api/v1/contracts/${fresh.contract}`, { agreedCategoryIds: [ids.Caretaker] });
			await umlagefaehig(true);

			expect([answered.status, saved.status]).toEqual([200, 200]);
			expect((await contract(fresh.contract)).agreedCategoryIds).toContain(ownId);
		} finally {
			await umlagefaehig(false);
		}
	});

	it('vereinbart nur, was das Formular angekreuzt hat', async () => {
		expect((await contract(listed.contract)).agreedCategoryIds).toEqual([ids.Caretaker]);
	});
});

// Merge review W10c-2 C-1: the berichtigte Abrechnung (#120) is created without the wizard; a category with costs and no
// answer would drop out of it unasked, so the direct correction refuses until the question is answered
describe('Berichtigte Abrechnung mit offener Frage', () => {
	const other = crypto.randomUUID();
	let corrected: Awaited<ReturnType<typeof createRental>>;
	let statementId: string;

	beforeAll(async () => {
		corrected = await createRental(other, { startDate: '2020-01-01', monthlyAdvancePayment: '0' });
		await insertInvoice(corrected.building, { amount: '1000.00', invoiceDate: '2024-06-30' });
		const generated = await sendJson('POST', '/api/v1/statements/generate', { contractId: corrected.contract, buildingId: corrected.building, ...period, managementFeePercent: 0 });
		statementId = ((await generated.json()) as { id: string }).id;
		await sendJson('PUT', `/api/v1/statements/${statementId}/status`, { status: 'sent' });
		await sendJson('POST', `/api/v1/statements/${statementId}/replace`, {});
	});

	afterAll(async () => {
		await db.delete(utilityStatements).where(eq(utilityStatements.contractId, corrected.contract));
		await db.delete(invoices).where(eq(invoices.buildingId, corrected.building));
		await corrected.remove();
	});

	it('lehnt sie ab, solange eine Kategorie mit Kosten nicht beantwortet ist, und rechnet sie danach ab', async () => {
		const stairs = await ownCategory('Treppenhausreinigung');
		await insertInvoice(corrected.building, { categoryId: stairs, description: 'Treppenhaus 2024', amount: '300.00', invoiceDate: '2024-09-30' });

		const refused = await sendJson('POST', `/api/v1/statements/${statementId}/correction`, {});
		const body = (await refused.json()) as { code: string; params: { categories: string } };

		expect(refused.status).toBe(409);
		expect(body.code).toBe('STATEMENT_AGREEMENTS_OPEN');
		expect(body.params.categories).toContain('Treppenhausreinigung');

		await sendJson('PUT', `/api/v1/contracts/${corrected.contract}/agreements`, { categoryId: stairs, agreed: true });
		const created = await sendJson('POST', `/api/v1/statements/${statementId}/correction`, {});

		expect(created.status).toBe(201);
		expect(((await created.json()) as { totalCosts: string }).totalCosts).toBe('1300.00');
	});
});
