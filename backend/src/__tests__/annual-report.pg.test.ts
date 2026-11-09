/**
 * #1409: the Jahresbericht of a building and a calendar year (real PostgreSQL database): the Mietertrag the contracts
 * agree, broken months by days, and the costs the landlord bears: the non-allocable invoices by Rechnungsdatum, without
 * Hypothekarzinsen, and «davon tragen Sie» of the Kostenabstimmung of the Abrechnungsperiode that ends in the year
 * (PO 09.11.2026, V-12 B, V-13 option 2).
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { buildings, categories, invoices, rentalContracts, utilityStatements } from '../db/schema';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createContract, deleteContract } from '../services/contract.service';
import { generateStatement } from '../services/statement-generation.service';
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
const statements: string[] = [];
const category = async (name: string) =>
	(await db.select().from(categories).where(eq(categories.name, name)))[0].id;

type Row = { categoryId: string | null; amount: number };
type Report = {
	year: number;
	firstYear: number;
	income: { netRent: number; additionalRent: number; flatRateUtilityCharge: number; total: number };
	costs: {
		utility: {
			period: { start: string; end: string };
			billed: boolean;
			notes: boolean;
			outside: boolean;
			categories: Row[];
			total: number;
		};
		maintenance: { categories: Row[]; total: number };
		totalWithoutCapital: number;
		capital: { categories: Row[]; total: number };
	};
};
const reportOf = async (year: number, buildingId = rental.building) =>
	callApi(`/api/v1/reports/annual?buildingId=${buildingId}&year=${year}`);
const report = async (year = 2025) => (await (await reportOf(year)).json()) as Report;

// Anna Keller in 2.01 (70 m²) from 1.1.2024 to 30.6.2025: 950 Nettomiete. Ben Keller in 2.02 (60 m²) from 16.3.2025:
// 1'240 Nettomiete, 100 Zusatzmiete, 50 Nebenkostenpauschale
beforeAll(async () => {
	rental = await createRental(token, {
		startDate: '2024-01-01',
		endDate: '2025-06-30',
		monthlyAdvancePayment: '150'
	});
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
			flatRateUtilityCharge: '50',
			managementFeeAgreed: true
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
	await invoice('Repairs', {
		amount: '800.00',
		isValidUtilityCost: false,
		invoiceDate: '2025-08-20'
	});
	await invoice('Repairs', {
		amount: '450.00',
		isValidUtilityCost: false,
		invoiceDate: '2026-01-10',
		servicePeriodStart: '2025-12-01',
		servicePeriodEnd: '2025-12-15'
	});
	await invoice('Mortgage Interest', { amount: '4200.00', isValidUtilityCost: false });
	await invoice('Capital Improvements', {
		amount: '15000.00',
		isValidUtilityCost: false,
		invoiceDate: '2025-09-10'
	});
});

afterAll(async () => {
	for (const id of statements)
		await db.delete(utilityStatements).where(eq(utilityStatements.id, id));
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await deleteContract(extra.contract, true);
	await deleteTenant(extra.tenant);
	await deleteApartment(extra.apartment);
	await rental.remove();
});

describe('Mietertrag des Jahresberichts', () => {
	it('zählt Nettomiete, Zusatzmiete und Nebenkostenpauschale, einen Vertrag ab März ab seinem Tag, ohne Akonto', async () => {
		// 6 × 950 = 5'700 and 16/31 × 1'240 = 640 + 9 × 1'240; 16/31 × 100 = 51.61 + 9 × 100; 16/31 × 50 = 25.81 + 9 × 50
		expect((await report()).income).toEqual({
			netRent: 17500,
			additionalRent: 951.61,
			flatRateUtilityCharge: 475.81,
			total: 18927.42
		});
	});
});

// the tests build on each other: first without statements, then with the statements of 2025
describe('Kosten, die der Vermieter trägt', () => {
	it('zählt nicht umlagefähige Rechnungen ganz im Jahr ihres Rechnungsdatums, ohne Hypothekarzinsen, wertvermehrende getrennt', async () => {
		const { costs } = await report();
		expect(costs.maintenance).toEqual({
			categories: [
				{ categoryId: await category('Caretaker'), amount: 300 },
				{ categoryId: await category('Repairs'), amount: 800 }
			],
			total: 1100
		});
		expect(costs.capital).toEqual({
			categories: [{ categoryId: await category('Capital Improvements'), amount: 15000 }],
			total: 15000
		});
	});

	it('zählt die Reparatur vom Januar für den Dezember im Jahr ihres Rechnungsdatums', async () => {
		expect((await report(2026)).costs.maintenance).toEqual({
			categories: [{ categoryId: await category('Repairs'), amount: 450 }],
			total: 450
		});
	});

	it('zählt ohne Abrechnungen der Periode keinen Anteil an den Nebenkosten und sagt es', async () => {
		const { costs } = await report();
		expect(costs.utility).toEqual({
			period: { start: '2025-01-01', end: '2025-12-31' },
			billed: false,
			notes: false,
			outside: false,
			categories: [],
			total: 0
		});
		expect(costs.totalWithoutCapital).toBe(1100);
	});

	it('nimmt bei «Juli – Juni» die Abrechnungsperiode, die im Jahr endet', async () => {
		await db
			.update(buildings)
			.set({ accountingPeriod: 'july-june' })
			.where(eq(buildings.id, rental.building));
		try {
			expect((await report()).costs.utility.period).toEqual({
				start: '2024-07-01',
				end: '2025-06-30'
			});
		} finally {
			await db
				.update(buildings)
				.set({ accountingPeriod: 'calendar' })
				.where(eq(buildings.id, rental.building));
		}
	});

	it('übernimmt mit Abrechnungen «davon tragen Sie» der Kostenabstimmung je Kategorie, ohne Zeilen von 0.00', async () => {
		for (const contractId of [rental.contract, extra.contract])
			statements.push(
				(
					await generateStatement({
						contractId,
						buildingId: rental.building,
						periodStart: '2025-01-01',
						periodEnd: '2025-12-31',
						managementFeePercent: 3
					})
				).id
			);
		const reconciliation = (await (
			await callApi(
				`/api/v1/reports/reconciliation?buildingId=${rental.building}&periodStart=2025-01-01&periodEnd=2025-12-31`
			)
		).json()) as {
			positions: { categoryId: string; landlord: number }[];
			total: { landlord: number };
		};
		const { costs } = await report();
		const [heating, caretaker] = [await category('Heating'), await category('Caretaker')];
		const shares = reconciliation.positions
			.filter(({ landlord }) => landlord !== 0)
			.map(({ categoryId, landlord }) => ({ categoryId, amount: landlord }));
		// in the order of the categories, as the other groups (Heizung before Hauswart), not of the statement
		expect(costs.utility.categories).toEqual([
			shares.find(({ categoryId }) => categoryId === heating)!,
			shares.find(({ categoryId }) => categoryId === caretaker)!
		]);
		expect(shares).toHaveLength(2);
		expect(costs.utility.total).toBe(reconciliation.total.landlord);
		expect(costs.utility.billed).toBe(true);
		expect(costs.totalWithoutCapital).toBe(
			Math.round((1100 + reconciliation.total.landlord) * 100) / 100
		);
	});

	it('nennt die Hinweise der Kostenabstimmung, hier die Entwürfe', async () => {
		expect((await report()).costs.utility.notes).toBe(true);
	});

	it('sagt, wenn ein Mietvertrag in der Periode ausserhalb von Dwello abgerechnet ist', async () => {
		await db
			.update(rentalContracts)
			.set({ billedUntil: '2025-05-31' })
			.where(eq(rentalContracts.id, extra.contract));
		try {
			expect((await report()).costs.utility.outside).toBe(true);
		} finally {
			await db
				.update(rentalContracts)
				.set({ billedUntil: null })
				.where(eq(rentalContracts.id, extra.contract));
		}
	});
});

describe('Jahre des Jahresberichts', () => {
	it('beginnt mit dem Jahr des ersten Mietvertrags oder der ersten Rechnung des Gebäudes', async () => {
		const { year, firstYear } = await report();
		expect([year, firstYear]).toEqual([2025, 2024]);
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
