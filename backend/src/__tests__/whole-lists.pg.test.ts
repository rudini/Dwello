/**
 * #1229: a service whose result depends on every record of a list loads all of them, also beyond the 1000 records a
 * fixed limit used to drop. Each test puts the record it looks for behind 1000 newer ones (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq, inArray, sql } from 'drizzle-orm';
import { db } from '../db/connection';
import { apartments, categories, heatingProfiles, invoices, rentalContracts, utilityStatements } from '../db/schema';
import { apartmentsOf, createApartment } from '../services/apartment.service';
import { createBuilding } from '../services/building.service';
import { contractTasks } from '../services/contract-tasks.service';
import { createContract, getContract } from '../services/contract.service';
import { reportPeriods, reportReconciliation } from '../services/cost-reconciliation.service';
import { categorizeInvoice, proposeAllocability } from '../services/llm.service';
import { moveOutOf, moveOutsByApartment } from '../services/move-out';
import { draftsToSend, invoiceStatements, outdatedStatements } from '../services/statement-invoices.service';
import { generateInPeriod, missingOfContract, runDefaultsOf, runDifferencesOf, runHeatingHintsOf, runPlan } from '../services/statement-run.service';
import { generateStatement, keyValuesOf } from '../services/statement.service';
import { createTenant } from '../services/tenant.service';
import { daysAfter, swissToday } from '../services/today';
import { getUtilityCostRules } from '../services/utility-validation.service';
import { callApi } from './helpers/auth';
import { openAiCompatible } from './helpers/llm';
import { insertInvoice } from './helpers/records';
import { llmConfig } from '../config/llm';

const token = crypto.randomUUID();
const year2000 = { start: '2000-01-01', end: '2000-12-31' };
const OLD_LIMIT = 1000;
let building = '';
const apartment: Record<'a1' | 'a2' | 'a3', string> = { a1: '', a2: '', a3: '' };
const tenant: Record<'t1' | 't2' | 't3', string> = { t1: '', t2: '', t3: '' };
// c1: moved in 2000 and out, no statement; c2: the same with its statement s2 of 2000 (Heizprofil `used`, 5 %)
let c1 = '';
let c2 = '';
let s2 = '';
let s3 = ''; // c2's older statement of another period (1999-07-01 to 2000-06-30), sent, its deadline passed
let heated = ''; // a heating invoice of 2000 with a Leistungszeitraum
let crowdContracts: string[] = [];
const profile = { used: '', run: '', runName: `Zuletzt ${token}` };
let numbered = 0;
type StatementRow = typeof utilityStatements.$inferInsert;
let s2Row: StatementRow;

// in chunks: one insert takes at most 65535 values
async function insertStatements(rows: StatementRow[]) {
	const ids: string[] = [];
	for (let i = 0; i < rows.length; i += 1000)
		ids.push(...(await db.insert(utilityStatements).values(rows.slice(i, i + 1000)).returning({ id: utilityStatements.id })).map((r) => r.id));
	return ids;
}
const statementCopies = (n: number, row: (i: number) => Partial<StatementRow>) =>
	insertStatements(Array.from({ length: n }, (_, i) => ({ ...s2Row, statementNumber: `${token.slice(0, 8)}-${numbered++}`, ...row(i) })));
// newer statements of the crowd's contracts: they come before the fixture's in every list
const crowdStatements = (n: number, row: Partial<StatementRow>) =>
	statementCopies(n, (i) => ({ contractId: crowdContracts[i % crowdContracts.length], apartmentId: apartment.a3, tenantId: tenant.t3, heatingProfileId: null, ...row }));

async function removeStatements(ids: string[]) {
	for (let i = 0; i < ids.length; i += 1000) await db.delete(utilityStatements).where(inArray(utilityStatements.id, ids.slice(i, i + 1000)));
	// fresh planner statistics: after the many rows the later tests' queries take seconds
	await db.execute(sql`ANALYZE utility_statements, rental_contracts`);
}

// custom profiles named in order: a list of profiles sorts them by type, then name
async function customProfiles(names: string[]) {
	const [seeded] = await db.select().from(heatingProfiles).limit(1);
	const { id: _id, createdAt: _c, updatedAt: _u, ...row } = seeded;
	return (await db.insert(heatingProfiles).values(names.map((name) => ({ ...row, name, type: 'custom' }))).returning({ id: heatingProfiles.id })).map((p) => p.id);
}

beforeAll(async () => {
	building = (await createBuilding({ name: `Vollhaus ${token}`, address: 'Seeweg 3', postalCode: '8400', city: 'Winterthur', canton: 'ZH' })).id;
	// the fixture's apartments last in a list of the building's apartments: floor 9 after the others' floor 1
	apartment.a1 = (await createApartment({ buildingId: building, number: 'Z1', floor: 9, area: '60', rooms: '3' })).id;
	apartment.a2 = (await createApartment({ buildingId: building, number: 'Z2', floor: 9, area: '60', rooms: '3' })).id;
	apartment.a3 = (await createApartment({ buildingId: building, number: 'A3', floor: 1, area: '60', rooms: '3' })).id;
	tenant.t1 = (await createTenant({ firstName: 'Eva', lastName: `Arnold ${token}` })).id;
	// still at the building's address: a draft to Urs goes to the apartment he left (A-5)
	tenant.t2 = (await createTenant({ firstName: 'Urs', lastName: `Brunner ${token}`, address: 'Seeweg 3', postalCode: '8400', city: 'Winterthur' })).id;
	tenant.t3 = (await createTenant({ firstName: 'Ida', lastName: `Christen ${token}` })).id;
	const rental = { startDate: '2000-03-01', endDate: '2000-12-31', baseRent: '900', monthlyAdvancePayment: '100', managementFeeAgreed: true, terminated: true };
	c1 = (await createContract({ ...rental, apartmentId: apartment.a1, tenantId: tenant.t1 })).id;
	c2 = (await createContract({ ...rental, apartmentId: apartment.a2, tenantId: tenant.t2 })).id;
	const [heating] = await db.select().from(categories).where(eq(categories.isHeatingCost, true)).limit(1);
	await insertInvoice(building, { categoryId: heating.id, description: `Heizung ${token}`, invoiceDate: '2000-06-30', servicePeriodStart: '2000-01-01', servicePeriodEnd: '2000-12-31' });
	await insertInvoice(building, { categoryId: heating.id, description: `Heizöl ${token}`, invoiceDate: '2000-06-30' });
	heated = (await db.select().from(invoices).where(eq(invoices.description, `Heizung ${token}`)))[0].id;
	[profile.used, profile.run] = await customProfiles([`Verwendet ${token}`, profile.runName]);
	s2 = (await generateStatement({ contractId: c2, buildingId: building, periodStart: year2000.start, periodEnd: year2000.end, managementFeePercent: 5, heatingProfileId: profile.used })).id;
	// recorded after s2: s2 is an outdated draft, the statements below are not
	await insertInvoice(building, { description: `Nachtrag ${token}`, invoiceDate: '2000-09-30', amount: '100.00' });
	const { id: _id, createdAt: _c, ...row } = (await db.select().from(utilityStatements).where(eq(utilityStatements.id, s2)))[0];
	s2Row = row;
	[s3] = await statementCopies(1, () => ({ periodStart: '1999-07-01', periodEnd: '2000-06-30', statementDate: '2000-07-15', status: 'sent', paymentDeadline: '2000-08-15' }));
	// a current draft of c2, older than any other
	await statementCopies(1, () => ({ periodStart: '2001-01-01', periodEnd: '2001-12-31', statementDate: '2001-01-15' }));
	// 1000 newer contracts of their own apartment, none with an agreed Verwaltungspauschale, each with a sent statement
	// of 2000: they come first in the building's lists
	const [contract] = await db.select().from(rentalContracts).where(eq(rentalContracts.id, c2));
	const { id: _cid, createdAt: _cc, updatedAt: _cu, ...contractRow } = contract;
	crowdContracts = (
		await db
			.insert(rentalContracts)
			.values(Array.from({ length: OLD_LIMIT }, () => ({ ...contractRow, apartmentId: apartment.a3, tenantId: tenant.t3, startDate: '2002-01-01', endDate: '2002-12-31', managementFeeAgreed: false })))
			.returning({ id: rentalContracts.id })
	).map((c) => c.id);
	await crowdStatements(OLD_LIMIT, { status: 'sent' });
}, 60_000);

afterAll(async () => {
	const own = await db.select({ id: apartments.id }).from(apartments).where(eq(apartments.buildingId, building));
	await db.delete(utilityStatements).where(inArray(utilityStatements.apartmentId, own.map((a) => a.id)));
	await db.delete(rentalContracts).where(inArray(rentalContracts.apartmentId, own.map((a) => a.id)));
	await db.execute(sql`delete from buildings where id = ${building}`);
	await db.execute(sql`delete from tenants where last_name like ${`%${token}`}`);
	await db.delete(heatingProfiles).where(inArray(heatingProfiles.id, [profile.used, profile.run]));
	await db.execute(sql`ANALYZE utility_statements, rental_contracts, apartments`);
}, 60_000);

describe('Abrechnungslauf mit über 1000 Mietverträgen und Abrechnungen', () => {
	it('plant jeden Mietvertrag der Periode und erkennt seine Abrechnung', async () => {
		const plan = await runPlan(building, year2000);

		expect(plan.contracts.map((c) => [c.id, c.billed])).toEqual(expect.arrayContaining([[c1, false], [c2, true]]));
	});

	it('schlägt Heizprofil und Satz der Verwaltungspauschale der vorhandenen Abrechnung vor', async () => {
		const defaults = await runDefaultsOf({ buildingId: building, periodStart: year2000.start, periodEnd: year2000.end });

		expect(defaults).toMatchObject({ heatingProfileId: profile.used, managementFeePercent: 5 });
	});

	it('lehnt eine Periode ab, die eine ältere Abrechnung überschneidet', async () => {
		const generated = generateInPeriod({ contractId: c1, buildingId: building, periodStart: year2000.start, periodEnd: year2000.end, managementFeePercent: 0 });

		await expect(generated).rejects.toMatchObject({ code: 'STATEMENT_PERIOD_OVERLAPS' });
	});

	it('nennt die abweichende Abrechnung mit dem Heizprofil des Laufs', async () => {
		const crowdProfiles = await customProfiles(Array.from({ length: OLD_LIMIT }, (_, i) => `A ${token} ${i}`));
		try {
			const { statements } = await runDifferencesOf(building, { period: year2000, heatingProfileId: profile.run, managementFeePercent: 5 });

			const own = statements.find((s) => s.id === s2) as { profile?: { run?: { name: string } | null } } | undefined;
			expect(own?.profile?.run?.name).toBe(profile.runName);
		} finally {
			await db.delete(heatingProfiles).where(inArray(heatingProfiles.id, crowdProfiles));
		}
	}, 30_000);

	it('nennt Heizrechnungen ohne Leistungszeitraum beim Einzug eines Mietvertrags ohne Abrechnung', async () => {
		const hints = await runHeatingHintsOf(building, { period: year2000, heatingProfileId: profile.run });

		expect(hints.heatingWithoutServicePeriod.map((i) => i.description)).toEqual([`Heizöl ${token}`]);
	}, 30_000);

	it('nennt keine Heizrechnung ohne Leistungszeitraum, wenn jeder Einzug schon abgerechnet ist', async () => {
		await db.update(rentalContracts).set({ billedUntil: year2000.end }).where(eq(rentalContracts.id, c1));
		try {
			const hints = await runHeatingHintsOf(building, { period: year2000, heatingProfileId: profile.run });

			expect(hints.heatingWithoutServicePeriod).toEqual([]);
		} finally {
			await db.update(rentalContracts).set({ billedUntil: null }).where(eq(rentalContracts.id, c1));
		}
	}, 30_000);
});

describe('Fehlende Abrechnungen und Auszug mit über 1000 Mietverträgen und Abrechnungen', () => {
	it('nennt die fehlende Periode, die eine ältere Abrechnung des Gebäudes überschneidet, als ausserhalb von Dwello', async () => {
		expect(await missingOfContract(c1)).toEqual([{ ...year2000, outside: true }]);
	});

	it('nennt keine fehlende Periode, wenn der Mietvertrag über 1000 neuere Abrechnungen hat', async () => {
		const newer = await statementCopies(OLD_LIMIT, () => ({ periodStart: '2002-01-01', periodEnd: '2002-12-31' }));
		try {
			expect(await missingOfContract(c2)).toEqual([]);
		} finally {
			await removeStatements(newer);
		}
	}, 30_000);

	it('nennt den Auszug als ausserhalb von Dwello abzurechnen, wenn eine ältere Abrechnung des Gebäudes die Periode überschneidet', async () => {
		expect(await moveOutOf((await getContract(c1))!)).toMatchObject({ period: year2000, due: true, outside: true });
	});

	it('nennt in der Wohnungsliste den Auszug jeder Wohnung', async () => {
		expect((await moveOutsByApartment(building)).map((m) => m.apartmentId)).toContain(apartment.a1);
	});

	it('nennt in der Übersicht die Kündigung jedes Mietvertrags', async () => {
		expect((await contractTasks()).noticedContracts.map((c) => c.id)).toContain(c1);
	}, 30_000);
});

describe('Berichte und Übersicht mit über 1000 Abrechnungen', () => {
	it('nennt in der Kostenabstimmung jeden Entwurf der Periode', async () => {
		const reconciliation = await reportReconciliation(building, year2000);

		expect(reconciliation.drafts!.map((d) => d.id)).toContain(s2);
	}, 30_000);

	it('nennt in den Berichten jede Periode auch bei über 10000 Abrechnungen', async () => {
		const newer = await crowdStatements(10 * OLD_LIMIT, { status: 'sent', periodStart: '2003-01-01', periodEnd: '2003-12-31' });
		try {
			expect(await reportPeriods()).toContainEqual(expect.objectContaining({ buildingId: building, periodStart: '1999-07-01', periodEnd: '2000-06-30' }));
		} finally {
			await removeStatements(newer);
		}
	}, 120_000);

	it('nennt in der Übersicht jede Abrechnung, die eine Änderung seit ihrer Erstellung nicht enthält', async () => {
		expect((await outdatedStatements()).map((s) => s.id)).toContain(s2);
	}, 30_000);

	it('nennt bei der Rechnung jede Abrechnung, die sie verrechnet', async () => {
		expect((await invoiceStatements(heated))!.statements.map((s) => s.id)).toContain(s2);
	}, 30_000);

	it('zählt in der Übersicht jeden versandbereiten Entwurf', async () => {
		const before = await draftsToSend();
		const newer = await crowdStatements(OLD_LIMIT, { status: 'draft', periodStart: '2003-01-01', periodEnd: '2003-12-31' });
		try {
			expect(await draftsToSend()).toBe(before + OLD_LIMIT);
		} finally {
			await removeStatements(newer);
		}
	}, 30_000);

	it('nennt in der Übersicht jeden Entwurf an eine alte Adresse', async () => {
		const newer = await crowdStatements(OLD_LIMIT, { status: 'draft', periodStart: '2003-01-01', periodEnd: '2003-12-31' });
		try {
			expect((await contractTasks()).oldAddresses.map((a) => a.tenantId)).toContain(tenant.t2);
		} finally {
			await removeStatements(newer);
		}
	}, 30_000);

	it('nennt in der Übersicht die Zahlungsfrist jeder versandten Abrechnung', async () => {
		const { deadlines } = (await (await callApi('/api/v1/dashboard')).json()) as { deadlines: { id: string }[] };

		expect(deadlines.map((d) => d.id)).toContain(s3);
	}, 30_000);

	it('nennt in der Übersicht das Vertragsende jedes laufenden Mietvertrags', async () => {
		const ending = await createApartment({ buildingId: building, number: 'Z4', floor: 9, area: '60', rooms: '3' });
		const contract = await createContract({ apartmentId: ending.id, tenantId: tenant.t1, startDate: '2020-01-01', endDate: daysAfter(swissToday(), 10), baseRent: '900', monthlyAdvancePayment: '100' });
		const [row] = await db.select().from(rentalContracts).where(eq(rentalContracts.id, contract.id));
		const { id: _id, createdAt: _c, updatedAt: _u, ...copy } = row;
		// newer running contracts without an end
		const newer = (
			await db
				.insert(rentalContracts)
				.values(Array.from({ length: OLD_LIMIT }, () => ({ ...copy, apartmentId: apartment.a3, startDate: '2021-01-01', endDate: null })))
				.returning({ id: rentalContracts.id })
		).map((c) => c.id);
		try {
			const { deadlines } = (await (await callApi('/api/v1/dashboard')).json()) as { deadlines: { id: string }[] };

			expect(deadlines.map((d) => d.id)).toContain(contract.id);
		} finally {
			await db.delete(rentalContracts).where(inArray(rentalContracts.id, [...newer, contract.id]));
			await db.delete(apartments).where(eq(apartments.id, ending.id));
			await db.execute(sql`ANALYZE rental_contracts`);
		}
	}, 60_000);
});

describe('Wohnungen und Kategorien über 1000', () => {
	it('zählt im Verteilschlüssel jede Wohnung des Gebäudes', async () => {
		const [row] = await db.select().from(apartments).where(eq(apartments.id, apartment.a3));
		const { id: _id, createdAt: _c, updatedAt: _u, ...copy } = row;
		const newer = await db
			.insert(apartments)
			.values(Array.from({ length: OLD_LIMIT }, (_, i) => ({ ...copy, number: `B${i}` })))
			.returning({ id: apartments.id });
		try {
			expect((await apartmentsOf(building)).map((a) => a.id)).toContain(apartment.a1);
			expect((await keyValuesOf(building, apartment.a1))?.units).toEqual([1, OLD_LIMIT + 3]);
		} finally {
			await db.delete(apartments).where(inArray(apartments.id, newer.map((a) => a.id)));
		}
	}, 30_000);

	describe('mit über 1000 Kategorien', () => {
		const last = `Zuletzt ${token}`;
		const configured = { ...llmConfig };
		let ids: string[] = [];

		beforeAll(async () => {
			const [own] = await db.insert(categories).values({ name: last, nameDE: last, sortOrder: 99999, isAllowedUtilityCost: true }).returning({ id: categories.id });
			const newer = await db
				.insert(categories)
				.values(Array.from({ length: OLD_LIMIT }, (_, i) => ({ name: `A ${token} ${i}`, sortOrder: -1, isAllowedUtilityCost: true })))
				.returning({ id: categories.id });
			ids = [own.id, ...newer.map((c) => c.id)];
		}, 30_000);

		afterAll(async () => {
			Object.assign(llmConfig, configured);
			await db.delete(categories).where(inArray(categories.id, ids));
		});

		it('nennt der KI beim Kategorisieren jede Kategorie', async () => {
			const llm = openAiCompatible({ categoryId: null, confidence: 0, reasoning: '' });
			try {
				await categorizeInvoice({ billingEntityName: 'Muster AG', description: `Rechnung ${token}`, amount: '100.00' });

				expect(llm.prompts[0]).toContain(`- ${last}`);
			} finally {
				llm.stop();
			}
		});

		it('nennt der KI beim Vorschlag der Umlagefähigkeit jede vordefinierte Kategorie', async () => {
			const llm = openAiCompatible({ isAllowedUtilityCost: true, confidence: 0.9, reasoning: '' });
			try {
				await proposeAllocability({ name: `Neu ${token}` });

				expect(llm.prompts[0]).toContain(`- ${last}`);
			} finally {
				llm.stop();
			}
		});

		it('nennt in den Regeln für Nebenkosten jede umlagefähige Kategorie', async () => {
			expect((await getUtilityCostRules()).allowedCategories).toContain(last);
		});
	});
});

