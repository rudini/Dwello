/**
 * Check for missing invoices per category through the API (real PostgreSQL)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { and, eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { apartments, categories, fuelStocks, invoices, rentalContracts, utilityStatementLineItems, utilityStatements } from '../db/schema';
import { setAgreedCategories } from '../services/agreed-category.service';
import { createContract, deleteContract } from '../services/contract.service';
import { getHeatingProfileByName } from '../services/heating-profile.service';
import { generateStatement } from '../services/statement.service';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { callApi } from './helpers/auth';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2020-01-01', monthlyAdvancePayment: '200' });
	const categoryId = async (name: string) => (await db.select().from(categories).where(eq(categories.name, name)))[0].id;
	const water = await categoryId('Cold Water');
	const chimney = await categoryId('Chimney Sweep');
	const mortgage = await categoryId('Mortgage Interest');
	// 2024: water every half-year, the chimney sweep once; 2025 only the first half-year of water
	await insertInvoice(rental.building, { categoryId: water, amount: '460.00', invoiceDate: '2024-06-30' });
	await insertInvoice(rental.building, { categoryId: water, amount: '475.00', invoiceDate: '2024-12-31' });
	await insertInvoice(rental.building, { categoryId: chimney, amount: '290.00', invoiceDate: '2024-10-15' });
	await insertInvoice(rental.building, { categoryId: water, amount: '470.00', invoiceDate: '2025-06-30' });
	// Not allocable: never expected in a statement
	await insertInvoice(rental.building, { categoryId: mortgage, amount: '5000.00', invoiceDate: '2024-03-31', isValidUtilityCost: false });
});

afterAll(async () => {
	await rental.remove();
});

const check = async (query: string) => {
	const response = await callApi(`/api/v1/invoices/completeness/${rental.building}?${query}`);
	return { status: response.status, body: (await response.json()) as { findings: unknown[] } };
};

describe('Prüfung auf fehlende Rechnungen pro Kategorie', () => {
	it('vergleicht die umlagefähigen Rechnungen mit dem gleichen Zeitraum im Vorjahr', async () => {
		const { status, body } = await check('periodStart=2025-01-01&periodEnd=2025-12-31');

		expect(status).toBe(200);
		expect(body).toMatchObject({
			buildingId: rental.building,
			comparedWith: { start: '2024-01-01', end: '2024-12-31' },
			hasComparison: true,
			findings: [
				{ categoryName: 'Kaminfeger', kind: 'missing', previous: { count: 1, total: 290 } },
				{ categoryName: 'Kaltwasser', kind: 'gap', missingParts: [{ start: '2025-07-01', end: '2025-12-31' }], current: { count: 1, total: 470 } }
			]
		});
		expect(body.findings).toHaveLength(2);
	});

	it('meldet für das erste Jahr mit Rechnungen keinen Vergleich', async () => {
		const { body } = await check('periodStart=2024-01-01&periodEnd=2024-12-31');

		// only the question about a tank remains, it does not compare
		const result = body as { hasComparison: boolean; findings: { kind: string }[] };
		expect(result.hasComparison).toBe(false);
		expect(result.findings.map((f) => f.kind)).toEqual(['tank']);
	});

	it('verlangt eine gültige Abrechnungsperiode', async () => {
		expect((await check('periodStart=2025-01-01')).status).toBe(422);
		expect((await check('periodStart=2025-12-31&periodEnd=2025-01-01')).status).toBe(400);
		expect((await check('periodStart=2025-02-30&periodEnd=2025-12-31')).status).toBe(400);
	});

	// Die Rechnung für das 2. Halbjahr kommt im Januar: mit Leistungszeitraum fehlt sie dem Jahr nicht
	it('ordnet eine Rechnung nach ihrem Leistungszeitraum zu', async () => {
		const [water] = await db.select().from(categories).where(eq(categories.name, 'Cold Water'));
		await insertInvoice(rental.building, {
			categoryId: water.id,
			amount: '480.00',
			invoiceDate: '2026-01-20',
			servicePeriodStart: '2025-07-01',
			servicePeriodEnd: '2025-12-31'
		});
		const { body } = await check('periodStart=2025-01-01&periodEnd=2025-12-31');

		expect(body.findings).toMatchObject([{ categoryName: 'Kaminfeger', kind: 'missing' }]);
	});
});

// Invoices without Leistungszeitraum count by their Rechnungsdatum; the preview names those that may belong elsewhere
describe('Rechnungen ohne Leistungszeitraum', () => {
	let other: Awaited<ReturnType<typeof createRental>>;
	const listed = async (start: string, end: string) => {
		const response = await callApi(`/api/v1/invoices/completeness/${other.building}?periodStart=${start}&periodEnd=${end}`);
		const body = (await response.json()) as Record<'lateInvoices' | 'invoicesWithoutServicePeriod', { billingEntityName: string; invoiceDate: string; amount: string }[]>;
		return { late: body.lateInvoices.map((i) => i.billingEntityName), whole: body.invoicesWithoutServicePeriod.map((i) => i.billingEntityName) };
	};

	beforeAll(async () => {
		other = await createRental(crypto.randomUUID(), { startDate: '2020-01-01', monthlyAdvancePayment: '200' });
		const servicePeriod = { servicePeriodStart: '2024-07-01', servicePeriodEnd: '2024-12-31' };
		await insertInvoice(other.building, { billingEntityName: 'Kaminfeger Keller', amount: '290.00', invoiceDate: '2025-01-20' });
		await insertInvoice(other.building, { billingEntityName: 'Werke mit Zeitraum', invoiceDate: '2025-01-20', ...servicePeriod });
		await insertInvoice(other.building, { billingEntityName: 'Nach dem Fenster', invoiceDate: '2025-04-01' });
		await insertInvoice(other.building, { billingEntityName: 'Nicht umlagefähig', invoiceDate: '2025-01-20', isValidUtilityCost: false });
		await insertInvoice(other.building, { billingEntityName: 'Lift Jahresabo', amount: '1200.00', invoiceDate: '2024-02-15' });
		await insertInvoice(other.building, { billingEntityName: 'Wasser Q1', invoiceDate: '2024-03-31', servicePeriodStart: '2024-01-01', servicePeriodEnd: '2024-03-31' });
	});

	afterAll(async () => {
		await other.remove();
	});

	it('nennt umlagefähige Rechnungen ohne Leistungszeitraum bis 90 Tage nach dem Ende der Abrechnungsperiode', async () => {
		const response = await callApi(`/api/v1/invoices/completeness/${other.building}?periodStart=2024-01-01&periodEnd=2024-12-31`);
		const body = (await response.json()) as { lateInvoices: unknown[] };

		expect(body.lateInvoices).toEqual([
			{ id: expect.any(String), billingEntityName: 'Kaminfeger Keller', description: 'Hauswart 2025', invoiceDate: '2025-01-20', amount: '290.00' }
		]);
	});

	// the period ends on 1 January: 1 April is its 90th day after, the window's last
	it('nennt eine Rechnung am letzten Tag des Fensters', async () => {
		expect((await listed('2024-01-01', '2025-01-01')).late).toEqual(['Kaminfeger Keller', 'Nach dem Fenster']);
	});

	it('nennt in einer Abrechnungsperiode unter einem Jahr die Rechnungen ohne Leistungszeitraum, die ganz zählen', async () => {
		expect((await listed('2024-01-01', '2024-06-30')).whole).toEqual(['Lift Jahresabo']);
	});

	it('nennt in einer Abrechnungsperiode von einem Jahr keine Rechnungen ohne Leistungszeitraum', async () => {
		expect((await listed('2024-01-01', '2024-12-31')).whole).toEqual([]);
	});

	// Rechnungen vom selben Tag in der Reihenfolge ihrer Erfassung, nicht in der, in der die Datenbank sie gespeichert hat (#770)
	it('nennt Rechnungen vom selben Tag in der Reihenfolge ihrer Erfassung', async () => {
		const sameDay = await createRental(crypto.randomUUID(), {
			startDate: '2020-01-01',
			monthlyAdvancePayment: '0'
		});
		await insertInvoice(sameDay.building, {
			billingEntityName: 'Später erfasst',
			invoiceDate: '2025-02-10'
		});
		await insertInvoice(sameDay.building, {
			billingEntityName: 'Früher erfasst',
			invoiceDate: '2025-02-10'
		});
		// the update writes the row anew behind the other one
		await db
			.update(invoices)
			.set({ createdAt: new Date('2025-02-10T08:00:00Z') })
			.where(eq(invoices.billingEntityName, 'Früher erfasst'));
		try {
			const response = await callApi(
				`/api/v1/invoices/completeness/${sameDay.building}?periodStart=2024-01-01&periodEnd=2024-12-31`
			);
			const { lateInvoices } = (await response.json()) as {
				lateInvoices: { billingEntityName: string }[];
			};
			expect(lateInvoices.map((i) => i.billingEntityName)).toEqual([
				'Früher erfasst',
				'Später erfasst'
			]);
		} finally {
			await sameDay.remove();
		}
	});
});

describe('Hinweise mit eigenem Gebäude', () => {
	// Der Leistungszeitraum reicht ins nächste Jahr: nur ein Teil zählt, die Abweichung sagt warum (#130)
	it('zählt die Rechnungen, deren Leistungszeitraum über die Abrechnungsperiode hinausreicht', async () => {
		const own = await createRental(crypto.randomUUID(), { startDate: '2020-01-01', monthlyAdvancePayment: '200' });
		const [water] = await db.select().from(categories).where(eq(categories.name, 'Cold Water'));
		await insertInvoice(own.building, { categoryId: water.id, amount: '1000.00', invoiceDate: '2024-01-31' });
		const servicePeriod = { servicePeriodStart: '2025-07-01', servicePeriodEnd: '2026-06-30' };
		await insertInvoice(own.building, { categoryId: water.id, amount: '1200.00', invoiceDate: '2026-06-30', ...servicePeriod });

		const response = await callApi(`/api/v1/invoices/completeness/${own.building}?periodStart=2025-01-01&periodEnd=2025-12-31`);
		const { findings } = (await response.json()) as { findings: { categoryName: string }[] };
		await own.remove();

		expect(findings.find((f) => f.categoryName === 'Kaltwasser')).toMatchObject({ kind: 'deviation', partialCount: 1 });
	});

	// Heizöl zählt über den Tankbestand, nie über einen Leistungszeitraum: die Hinweise nennen seine Lieferungen nicht
	it('nennt Lieferungen der Kategorie des Tankbestands nicht', async () => {
		const own = await createRental(crypto.randomUUID(), { startDate: '2020-01-01', monthlyAdvancePayment: '200' });
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await db.insert(fuelStocks).values({ buildingId: own.building, readingDate: '2024-12-31', amount: '800.00', categoryId: heating.id });
		await insertInvoice(own.building, { billingEntityName: 'Heizöl AG', categoryId: heating.id, invoiceDate: '2025-01-20' });
		await insertInvoice(own.building, { billingEntityName: 'Kaminfeger Keller', invoiceDate: '2025-01-20' });

		const response = await callApi(`/api/v1/invoices/completeness/${own.building}?periodStart=2024-01-01&periodEnd=2024-12-31`);
		const { lateInvoices } = (await response.json()) as { lateInvoices: { billingEntityName: string }[] };
		await own.remove();

		expect(lateInvoices.map((i) => i.billingEntityName)).toEqual(['Kaminfeger Keller']);
	});

	// #339 (#451, Punkt 6): bei Heizkosten nach Heizprofil zählt eine Rechnung mit Leistungszeitraum nur seine Monate, eine
	// ohne die ganze Periode; die Prüfung nennt die ohne, wenn andere derselben Kategorie einen haben, nicht aber eine
	// andere Heizkategorie ganz ohne Leistungszeitraum, Nebenkosten ohne Heizkosten und Lieferungen in den Tank
	// a tank decommissioned before the period (closing stock 0, Code-Review C-4) shares its category by #71 again
	it.each([
		['ohne Tank', [], ['Fernwärme Q1']],
		['mit Tank in der Kategorie', [['2023-12-31', '800.00']], []],
		['mit einem vor der Periode stillgelegten Tank', [['2022-12-31', '700.00'], ['2023-12-31', '0.00']], ['Fernwärme Q1']]
	] as const)('nennt Heizrechnungen ohne Leistungszeitraum neben solchen mit, %s', async (_, readings, expected) => {
		const own = await createRental(crypto.randomUUID(), { startDate: '2020-01-01', monthlyAdvancePayment: '200' });
		const categoryId = async (name: string) => (await db.select().from(categories).where(eq(categories.name, name)))[0].id;
		const heating = await categoryId('Heating');
		for (const [readingDate, amount] of readings) await db.insert(fuelStocks).values({ buildingId: own.building, readingDate, amount, categoryId: heating });
		await insertInvoice(own.building, { billingEntityName: 'Fernwärme Q1', categoryId: heating, amount: '1520.00', invoiceDate: '2024-03-31' });
		await insertInvoice(own.building, { billingEntityName: 'Fernwärme Q4', categoryId: heating, amount: '1410.00', invoiceDate: '2025-01-05', servicePeriodStart: '2024-10-01', servicePeriodEnd: '2024-12-31' });
		await insertInvoice(own.building, { billingEntityName: 'Kaminfeger Keller', categoryId: await categoryId('Chimney Sweep'), amount: '290.00', invoiceDate: '2024-10-15' });
		await insertInvoice(own.building, { billingEntityName: 'Hauswart Huber', invoiceDate: '2024-12-31' });
		await insertInvoice(own.building, { billingEntityName: 'Hauswart Q4', invoiceDate: '2025-01-05', servicePeriodStart: '2024-10-01', servicePeriodEnd: '2024-12-31' });

		const response = await callApi(`/api/v1/invoices/completeness/${own.building}?periodStart=2024-01-01&periodEnd=2024-12-31`);
		const { heatingWithoutServicePeriod } = (await response.json()) as { heatingWithoutServicePeriod: { billingEntityName: string }[] };
		await db.delete(fuelStocks).where(eq(fuelStocks.buildingId, own.building));
		await own.remove();

		expect(heatingWithoutServicePeriod.map((i) => i.billingEntityName)).toEqual([...expected]);
	});
});

// #335 (#451, Punkt 5): eine versendete Abrechnung, die die Heizkosten nach dem Heizprofil über die ganze Periode
// rechnet, obwohl eine Heizrechnung der Periode jetzt einen Leistungszeitraum hat: eine neue Abrechnung derselben
// Wohnung rechnet die Monate darin, beide zusammen tragen dann nicht genau die Heizkosten
describe('Versendete Abrechnungen nach der alten Regel für Heizkosten', () => {
	const oldRuleOf = async (building: string) => {
		const response = await callApi(`/api/v1/invoices/completeness/${building}?periodStart=2025-01-01&periodEnd=2025-12-31`);
		return ((await response.json()) as { oldHeatingRule: string[] }).oldHeatingRule;
	};
	const sentStatement = async (rental: Awaited<ReturnType<typeof createRental>>, status: 'sent' | 'draft') => {
		const heatingProfileId = (await getHeatingProfileByName('Heating Mittelland'))!.id;
		const statement = await generateStatement({ contractId: rental.contract, buildingId: rental.building, periodStart: '2025-01-01', periodEnd: '2025-12-31', heatingProfileId, managementFeePercent: 0 });
		await db.update(utilityStatements).set({ status }).where(eq(utilityStatements.id, statement.id));
		return statement.id;
	};

	// a Leistungszeitraum over the whole period shares as before (Code-Review C-5)
	it.each([
		['versendet, der Leistungszeitraum kam danach', 'sent', false, true, ['2025-01-01', '2025-03-31']],
		['ein Entwurf', 'draft', false, false, ['2025-01-01', '2025-03-31']],
		['versendet, mit dem Leistungszeitraum schon beim Erstellen', 'sent', true, false, ['2025-01-01', '2025-03-31']],
		['versendet, mit einem Leistungszeitraum über die ganze Periode', 'sent', false, false, ['2025-01-01', '2025-12-31']]
	] as const)('nennt eine Abrechnung nur, wenn sie %s', async (_, status, before, named, [servicePeriodStart, servicePeriodEnd]) => {
		const may = await createRental(crypto.randomUUID(), { startDate: '2025-05-01', monthlyAdvancePayment: '0' });
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await insertInvoice(may.building, { categoryId: heating.id, amount: '1000.00', invoiceDate: '2025-06-30' });
		const quarter = { categoryId: heating.id, amount: '1000.00', invoiceDate: '2025-04-10', servicePeriodStart, servicePeriodEnd };
		if (before) await insertInvoice(may.building, quarter);
		const id = await sentStatement(may, status);
		if (!before) await insertInvoice(may.building, quarter);

		const listed = await oldRuleOf(may.building);
		await db.delete(utilityStatements).where(eq(utilityStatements.id, id)); // sent: deleteStatement refuses it
		await db.delete(invoices).where(eq(invoices.buildingId, may.building));
		await may.remove();

		expect(listed).toEqual(named ? [id] : []);
	});

	// H-28: which of these hints concern a run is decided here, by the contracts it bills (statement-run.service.ts)
	it('nennt für einen Lauf, der den Vormieter derselben Wohnung abrechnet, die Abrechnung und die Heizrechnung ohne Leistungszeitraum', async () => {
		const may = await createRental(crypto.randomUUID(), { startDate: '2025-05-01', monthlyAdvancePayment: '0' });
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await insertInvoice(may.building, { billingEntityName: 'Fernwärme AG', categoryId: heating.id, amount: '1000.00', invoiceDate: '2025-06-30' });
		const id = await sentStatement(may, 'sent');
		await insertInvoice(may.building, { categoryId: heating.id, amount: '1000.00', invoiceDate: '2025-04-10', servicePeriodStart: '2025-01-01', servicePeriodEnd: '2025-03-31' });
		const tenant = await createTenant({ firstName: 'Ruth', lastName: `Vormieterin ${crypto.randomUUID()}` });
		const before = await createContract({ apartmentId: may.apartment, tenantId: tenant.id, startDate: '2025-01-01', endDate: '2025-04-30', baseRent: '900', monthlyAdvancePayment: '0' });
		const heatingProfileId = (await getHeatingProfileByName('Heating Mittelland'))!.id;
		const hintsFor = async (profile: string) =>
			(await callApi(`/api/v1/statements/run-heating?buildingId=${may.building}&periodStart=2025-01-01&periodEnd=2025-12-31${profile}`)).json() as Promise<{
				heatingWithoutServicePeriod: { billingEntityName: string }[];
				oldHeatingRule: string[];
			}>;

		const withProfile = await hintsFor(`&heatingProfileId=${heatingProfileId}`);
		const withoutProfile = await hintsFor('');
		await db.delete(utilityStatements).where(eq(utilityStatements.id, id));
		await db.delete(invoices).where(eq(invoices.buildingId, may.building));
		await deleteContract(before.id, true);
		await deleteTenant(tenant.id);
		await may.remove();

		expect(withProfile.heatingWithoutServicePeriod.map((i) => i.billingEntityName)).toEqual(['Fernwärme AG']);
		expect(withProfile.oldHeatingRule).toEqual([id]);
		expect(withoutProfile.heatingWithoutServicePeriod).toEqual([]);
	});

	// #508: Marc from May, his statement sent under the old rule; Eva, before him to 31.03., is billed by the run
	type Sum = { statementId: string; costs: string; tenants: string; landlord: string; billed: string; difference: string; result: string; landlordFor: string | null };
	const heatingSumsAt = async (eva: (contract: string, sumsNow: () => Promise<Sum[]>) => Promise<void> = async () => {}) => {
		const may = await createRental(crypto.randomUUID(), { startDate: '2025-05-01', monthlyAdvancePayment: '0' });
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await insertInvoice(may.building, { categoryId: heating.id, amount: '1000.00', invoiceDate: '2025-06-30' });
		await insertInvoice(may.building, { categoryId: heating.id, amount: '1000.00', invoiceDate: '2025-04-10', description: 'Heizung Q1' });
		const id = await sentStatement(may, 'sent');
		await db.update(invoices).set({ servicePeriodStart: '2025-01-01', servicePeriodEnd: '2025-03-31' }).where(and(eq(invoices.buildingId, may.building), eq(invoices.description, 'Heizung Q1')));
		const tenant = await createTenant({ firstName: 'Eva', lastName: `Vormieterin ${crypto.randomUUID()}` });
		const before = await createContract({ apartmentId: may.apartment, tenantId: tenant.id, startDate: '2025-01-01', endDate: '2025-03-31', baseRent: '900', monthlyAdvancePayment: '0' });
		const heatingProfileId = (await getHeatingProfileByName('Heating Mittelland'))!.id;
		const sumsNow = async () =>
			((await (await callApi(`/api/v1/statements/run-heating?buildingId=${may.building}&periodStart=2025-01-01&periodEnd=2025-12-31&heatingProfileId=${heatingProfileId}`)).json()) as { heatingSums: Sum[] }).heatingSums;
		try {
			await eva(before.id, sumsNow);
			return { id, heatingSums: await sumsNow() };
		} finally {
			await db.delete(utilityStatements).where(eq(utilityStatements.apartmentId, may.apartment));
			await db.delete(invoices).where(eq(invoices.buildingId, may.building));
			await deleteContract(before.id, true);
			await deleteTenant(tenant.id);
			await may.remove();
		}
	};

	// #508 (Fachreview 508-1 M-1, V-4): per apartment the heating costs, the part of the vacancy the landlord bears, what
	// the apartment's statements bill for them (the sent one as stored, the new one as the run would) and the difference
	it('nennt die Heizkosten der Wohnung, den Leerstand und wie viel die Abrechnungen mehr verrechnen', async () => {
		const { id, heatingSums } = await heatingSumsAt();

		const [sum] = heatingSums;
		expect(heatingSums).toHaveLength(1);
		expect(sum).toMatchObject({ statementId: id, costs: '2000.00', result: 'more', landlordFor: 'vacancy' });
		expect(Number(sum.tenants) + Number(sum.landlord)).toBeCloseTo(2000, 2);
		expect(Number(sum.landlord)).toBeGreaterThan(0);
		expect(Number(sum.billed) - Number(sum.tenants)).toBeCloseTo(Number(sum.difference), 2);
		expect(Number(sum.difference)).toBeGreaterThan(0);
	});

	// Fachreview 508-1 V-3, code review 508-1 C-2, C-3: a lease without agreed heating costs bills none, its part is the landlord's
	it('nennt den Anteil eines Mietvertrags ohne vereinbarte Heizkosten beim Vermieter', async () => {
		const { heatingSums } = await heatingSumsAt((contract) => setAgreedCategories(contract, []));

		const [sum] = heatingSums;
		expect(sum).toMatchObject({ costs: '2000.00', landlordFor: 'leases' });
		expect(Number(sum.tenants) + Number(sum.landlord)).toBeCloseTo(2000, 2);
	});

	// code review 508-1 C-2: a replaced statement counts no more, the run bills its berichtigte Abrechnung (#647)
	it('zählt eine ersetzte Abrechnung nicht, sondern die berichtigte, die der Lauf erstellt', async () => {
		let without: Sum[] = [];
		const { heatingSums } = await heatingSumsAt(async (contract, sumsNow) => {
			without = await sumsNow();
			const heatingProfileId = (await getHeatingProfileByName('Heating Mittelland'))!.id;
			const [{ buildingId }] = await db.select({ buildingId: apartments.buildingId }).from(apartments).innerJoin(rentalContracts, eq(rentalContracts.apartmentId, apartments.id)).where(eq(rentalContracts.id, contract));
			const replaced = await generateStatement({ contractId: contract, buildingId, periodStart: '2025-01-01', periodEnd: '2025-12-31', heatingProfileId, managementFeePercent: 0 });
			await db.update(utilityStatements).set({ status: 'replaced' }).where(eq(utilityStatements.id, replaced.id));
			await db.update(utilityStatementLineItems).set({ tenantShare: '0.00' }).where(eq(utilityStatementLineItems.statementId, replaced.id));
		});

		expect(heatingSums).toEqual(without);
	});
});
