/**
 * #1409: the Jahresbericht of a building and a calendar year (real PostgreSQL database): the Mieteinnahmen the
 * contracts agree, broken months by days, and the costs of the invoices of the year in three groups, an invoice whose
 * Leistungszeitraum crosses the year by its days in the year.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, contractAdvancePayments, invoices, rentalContracts } from '../db/schema';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createContract, deleteContract } from '../services/contract.service';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { callApi, sendJson } from './helpers/auth';
import { readPdf } from './helpers/pdf-text';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
const extra: { apartment: string; tenant: string; contract: string } = {
	apartment: '',
	tenant: '',
	contract: ''
};
const category = async (name: string) =>
	(await db.select().from(categories).where(eq(categories.name, name)))[0].id;

type Report = {
	year: number;
	firstYear: number;
	income: {
		netRent: number;
		additionalRent: number;
		advancePayments: number;
		flatRateUtilityCharge: number;
		total: number;
	};
	costs: Record<
		'allocable' | 'maintenance' | 'valueAdding',
		{ categories: { categoryId: string | null; amount: number }[]; total: number }
	> & {
		total: number;
	};
};
const reportOf = async (year: number, buildingId = rental.building) =>
	callApi(`/api/v1/reports/annual?buildingId=${buildingId}&year=${year}`);
const report2025 = async () => (await (await reportOf(2025)).json()) as Report;

// Anna Keller in 2.01 from 1.1.2024 to 30.6.2025: 950 Nettomiete, Akonto 150, from 1.4.2025 180.
// Second apartment 2.02 from 16.3.2025: 1'240 Nettomiete, 100 Zusatzmiete, 50 Nebenkostenpauschale.
beforeAll(async () => {
	rental = await createRental(token, {
		startDate: '2024-01-01',
		endDate: '2025-06-30',
		monthlyAdvancePayment: '150'
	});
	await db
		.insert(contractAdvancePayments)
		.values({ contractId: rental.contract, validFrom: '2025-04-01', amount: '180' });
	extra.apartment = (
		await createApartment({
			buildingId: rental.building,
			number: '2.02',
			floor: 2,
			area: '60',
			rooms: '2.5'
		})
	).id;
	extra.tenant = (await createTenant({ firstName: 'Ben', lastName: `Keller ${token}` })).id;
	extra.contract = (
		await createContract({
			apartmentId: extra.apartment,
			tenantId: extra.tenant,
			startDate: '2025-03-16',
			baseRent: '1240',
			additionalRent: '100',
			monthlyAdvancePayment: '0',
			flatRateUtilityCharge: '50'
		})
	).id;
	const invoice = async (categoryName: string, values: Partial<typeof invoices.$inferInsert>) =>
		db.insert(invoices).values({
			buildingId: rental.building,
			categoryId: await category(categoryName),
			billingEntityName: 'Muster AG',
			description: `Jahresbericht ${token}`,
			amount: '100.00',
			invoiceDate: '2025-06-30',
			isValidUtilityCost: true,
			...values
		});
	await invoice('Caretaker', { amount: '1200.00' });
	await invoice('Heating', {
		amount: '3640.00',
		invoiceDate: '2026-01-15',
		servicePeriodStart: '2025-10-01',
		servicePeriodEnd: '2026-03-31'
	});
	await invoice('Caretaker', { amount: '999.00', invoiceDate: '2024-12-31' });
	await invoice('Caretaker', { amount: '777.00', invoiceDate: '2026-01-05' });
	await invoice('Caretaker', { amount: '300.00', isValidUtilityCost: false });
	await invoice('Repairs', { amount: '800.00', isValidUtilityCost: false });
	await invoice('Capital Improvements', { amount: '15000.00', isValidUtilityCost: false });
});

afterAll(async () => {
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await deleteContract(extra.contract, true);
	await deleteTenant(extra.tenant);
	await deleteApartment(extra.apartment);
	await rental.remove();
});

describe('Mietertrag des Jahresberichts', () => {
	it('zählt einen Mietvertrag, der im März beginnt, ab seinem Tag: der angebrochene Monat tageweise', async () => {
		const { income } = await report2025();
		// 6 × 950 = 5'700 and 16/31 × 1'240 = 640 + 9 × 1'240 = 11'160
		expect(income.netRent).toBe(17500);
		// 16/31 × 100 = 51.61 + 9 × 100
		expect(income.additionalRent).toBe(951.61);
		// 16/31 × 50 = 25.81 + 9 × 50
		expect(income.flatRateUtilityCharge).toBe(475.81);
	});

	it('zählt das Akonto mit jedem Betrag für die Monate, in denen er gilt, und nur bis zum Vertragsende', async () => {
		// 3 × 150 + 3 × 180
		expect((await report2025()).income.advancePayments).toBe(990);
	});

	it('nennt das Total des Mietertrags', async () => {
		// 17'500 + 951.61 + 990 + 475.81
		expect((await report2025()).income.total).toBe(19917.42);
	});
});

describe('Kosten des Jahresberichts', () => {
	it('zählt eine Rechnung, deren Leistungszeitraum über das Jahresende reicht, mit den Tagen im Jahr', async () => {
		const { costs } = await report2025();
		// 3'640 × 92 / 182 days
		expect(costs.allocable.categories).toEqual([
			{ categoryId: await category('Heating'), amount: 1840 },
			{ categoryId: await category('Caretaker'), amount: 1200 }
		]);
		expect(costs.allocable.total).toBe(3040);
	});

	it('zählt nicht umlagefähige Rechnungen als Unterhalt, die Kategorie «Wertvermehrende Investitionen» als wertvermehrend', async () => {
		const { costs } = await report2025();
		expect(costs.maintenance.categories).toEqual([
			{ categoryId: await category('Caretaker'), amount: 300 },
			{ categoryId: await category('Repairs'), amount: 800 }
		]);
		expect(costs.maintenance.total).toBe(1100);
		expect(costs.valueAdding).toEqual({
			categories: [{ categoryId: await category('Capital Improvements'), amount: 15000 }],
			total: 15000
		});
		expect(costs.total).toBe(19140);
	});

	it('zählt im Folgejahr den Rest der Rechnung über das Jahresende und die Rechnungen dieses Jahres', async () => {
		const { costs } = (await (await reportOf(2026)).json()) as Report;
		// 3'640 × 90 / 182 days, and the caretaker invoice of 5.1.2026
		expect(costs.allocable.categories).toEqual([
			{ categoryId: await category('Heating'), amount: 1800 },
			{ categoryId: await category('Caretaker'), amount: 777 }
		]);
	});
});

describe('Jahre des Jahresberichts', () => {
	it('beginnt mit dem Jahr des ersten Mietvertrags oder der ersten Rechnung des Gebäudes', async () => {
		const report = await report2025();
		expect([report.year, report.firstYear]).toEqual([2025, 2024]);
	});

	it('nennt das erste Jahr des Gebäudes auch, wenn es nach dem gefragten Jahr liegt', async () => {
		const report = (await (await reportOf(2023)).json()) as Report;
		expect([report.year, report.firstYear]).toEqual([2023, 2024]);
	});

	it('lehnt ein unbekanntes Gebäude ab', async () => {
		const response = await reportOf(2025, crypto.randomUUID());
		expect(response.status).toBe(404);
		expect(((await response.json()) as { code: string }).code).toBe('BUILDING_NOT_FOUND');
	});
});

// review 1409-1 C-6: a contract from before #464 may have no Akonto row; its monthly_advance_payment applies, as in
// the statement (calculation.service.ts). Last of the amount tests: it changes Ben Keller's contract
describe('Akonto ohne Verlauf', () => {
	it('zählt das Akonto des Mietvertrags, wenn er keinen Betrag mit «Gültig ab» hat', async () => {
		await db
			.delete(contractAdvancePayments)
			.where(eq(contractAdvancePayments.contractId, extra.contract));
		await db
			.update(rentalContracts)
			.set({ monthlyAdvancePayment: '30' })
			.where(eq(rentalContracts.id, extra.contract));
		// 990 and 16/31 × 30 = 15.48 + 9 × 30
		expect((await report2025()).income.advancePayments).toBe(1275.48);
	});
});

describe('PDF des Jahresberichts', () => {
	it('druckt den Titel, die Zeilen darunter und jede Zeile der Tabellen mit ihrem Betrag auf einer Zeile', async () => {
		const response = await sendJson('POST', '/api/v1/reports/pdf', {
			title: 'Jahresbericht 2025',
			lines: ['Seeblick, Seestrasse 12, 8002 Zürich', 'Zeitraum: 01.01.2025 bis 31.12.2025'],
			sections: [
				{
					heading: 'Kosten',
					help: 'Das sind die Rechnungen dieses Jahres.',
					rows: [
						{ label: 'Hauswart', amount: 'CHF 1’200.00' },
						{ label: 'Total Kosten', amount: 'CHF 1’200.00', total: true }
					]
				}
			]
		});
		expect(response.headers.get('content-type')).toBe('application/pdf');
		const { flowing } = readPdf(Buffer.from(await response.arrayBuffer()));
		for (const text of [
			'Jahresbericht 2025',
			'Seeblick, Seestrasse 12, 8002 Zürich',
			'Zeitraum: 01.01.2025 bis 31.12.2025',
			'Kosten',
			'Das sind die Rechnungen dieses Jahres.',
			'Hauswart CHF 1’200.00',
			'Total Kosten CHF 1’200.00'
		])
			expect(flowing).toContain(text);
	});
});
