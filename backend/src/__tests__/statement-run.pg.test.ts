/**
 * H-28: which contracts a run bills is decided by the backend (`GET /statements/run`), not by the BFF. The rules
 * themselves are tested on `planRun` (statement-run.test.ts); here the route reads the building's real records.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { heatingProfiles, invoices, utilityStatements } from '../db/schema';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { createContract, deleteContract } from '../services/contract.service';
import { generateStatement } from '../services/statement.service';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { sendJson } from './helpers/auth';
import { insertInvoice } from './helpers/records';

const token = crypto.randomUUID();
let buildingId = '';
const rentals: { apartment: string; tenant: string; contract: string }[] = [];

async function rent(number: string, lastName: string, startDate: string, endDate?: string) {
	const apartment = await createApartment({ buildingId, number, floor: 1, area: '60', rooms: '3' });
	const tenant = await createTenant({ firstName: 'Eva', lastName: `${lastName} ${token}` });
	const contract = await createContract({ apartmentId: apartment.id, tenantId: tenant.id, startDate, endDate, baseRent: '900', monthlyAdvancePayment: '100', managementFeeAgreed: true });
	rentals.push({ apartment: apartment.id, tenant: tenant.id, contract: contract.id });
	return contract.id;
}

beforeAll(async () => {
	buildingId = (await createBuilding({ name: `Seeblick ${token}`, address: 'Seeweg 1', postalCode: '8400', city: 'Winterthur', canton: 'ZH' })).id;
});

afterAll(async () => {
	await db.delete(utilityStatements).where(inArray(utilityStatements.contractId, rentals.map((r) => r.contract)));
	for (const r of rentals) {
		await deleteContract(r.contract, true);
		await deleteTenant(r.tenant);
		await deleteApartment(r.apartment);
	}
	await deleteBuilding(buildingId);
});

describe('Lauf einer Abrechnungsperiode', () => {
	it('nennt die Mietverträge mit Mietstagen in der Periode und welche darin schon abgerechnet sind', async () => {
		const billed = await rent('1.01', 'Keller', '2023-01-01');
		const open = await rent('1.02', 'Meier', '2024-05-01');
		await rent('1.03', 'Later', '2025-01-01');
		await generateStatement({ contractId: billed, buildingId, periodStart: '2024-01-01', periodEnd: '2024-12-31', managementFeePercent: 0 });

		const response = await sendJson('GET', `/api/v1/statements/run?buildingId=${buildingId}&periodStart=2024-01-01&periodEnd=2024-12-31`);
		const plan = (await response.json()) as { contracts: { id: string; billed: boolean; tenantName: string }[]; overlap: unknown; skipped: unknown[] };

		expect(response.status).toBe(200);
		// the latest Vertragsbeginn first, as the contract list
		expect(plan.contracts.map(({ id, billed }) => ({ id, billed }))).toEqual([
			{ id: open, billed: false },
			{ id: billed, billed: true }
		]);
		expect(plan.contracts[0].tenantName).toBe(`Eva Meier ${token}`);
		expect(plan.overlap).toBeNull();
		expect(plan.skipped).toEqual([]);
	});
});

// H-28 (#5): the missing statements of a contract and their way into the wizard, decided by the backend
describe('Fehlende Abrechnungen eines Mietvertrags', () => {
	it('nennt die abgelaufenen Perioden mit Mietstagen ohne Abrechnung und ihren Weg in den Assistenten', async () => {
		const contract = await rent('2.01', 'Frei', '2024-04-01', '2025-12-31');
		await generateStatement({ contractId: contract, buildingId, periodStart: '2024-01-01', periodEnd: '2024-12-31', managementFeePercent: 0 });

		const response = await sendJson('GET', `/api/v1/contracts/${contract}/missing-statements`);

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual([
			{ start: '2025-01-01', end: '2025-12-31', way: { kind: 'whole', start: '2025-01-01', end: '2025-12-31' }, open: true }
		]);
	});

	it('antwortet für einen unbekannten Mietvertrag mit 404', async () => {
		const response = await sendJson('GET', `/api/v1/contracts/${crypto.randomUUID()}/missing-statements`);
		expect(response.status).toBe(404);
	});

	// #211: the list and the Übersicht mark each contract with the same rule, without opening it
	it('nennt je Mietvertrag die Tage abgelaufener Perioden ohne Abrechnung', async () => {
		const billed = await rent('2.02', 'Gerber', '2024-01-01', '2024-12-31');
		const missing = await rent('2.03', 'Huber', '2024-07-01', '2024-12-31');
		await generateStatement({ contractId: billed, buildingId, periodStart: '2024-01-01', periodEnd: '2024-12-31', managementFeePercent: 0 });

		const response = await sendJson('GET', '/api/v1/contracts/missing-statements');
		const byContract = (await response.json()) as Record<string, unknown>;

		expect(response.status).toBe(200);
		expect([byContract[billed], byContract[missing]]).toEqual([[], [{ start: '2024-01-01', end: '2024-12-31' }]]);
	});
});

// A-10: the wizard's defaults from a link to a building and period, decided by the backend (H-28)
describe('Vorgaben des Abrechnungs-Assistenten', () => {
	it('übernimmt Heizprofil und Verwaltungspauschale der übrigen Abrechnungen der Periode', async () => {
		const [profile] = await db.select({ id: heatingProfiles.id }).from(heatingProfiles).limit(1);
		const contract = await rent('3.01', 'Iten', '2025-01-01', '2025-12-31');
		await generateStatement({ contractId: contract, buildingId, periodStart: '2025-01-01', periodEnd: '2025-12-31', managementFeePercent: 4.5, heatingProfileId: profile.id });

		const response = await sendJson('GET', `/api/v1/statements/run-defaults?buildingId=${buildingId}&periodStart=2025-01-01&periodEnd=2025-12-31`);

		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({
			period: { start: '2025-01-01', end: '2025-12-31' },
			buildingId,
			heatingProfileId: profile.id,
			managementFeePercent: 4.5,
			preset: { fromStatements: true, feeFromSettings: false, differing: false, profileFromApartment: false }
		});
	});

	// Review K-5: a cut link starts the wizard at the beginning, with the settings
	it.each([
		['2025-02-30', '2025-12-31'],
		['2025-13-01', '2025-12-31'],
		['2025-12-31', '2025-01-01']
	])('übergeht einen Link mit den Tagen %s und %s', async (periodStart, periodEnd) => {
		const response = await sendJson('GET', `/api/v1/statements/run-defaults?buildingId=${buildingId}&periodStart=${periodStart}&periodEnd=${periodEnd}`);
		expect(await response.json()).toMatchObject({ buildingId: null, preset: null });
	});
});


// H-28 (#16): what a kept statement of the period does differently from the run, from the building's real records
describe('Abweichende Einstellungen bestehender Abrechnungen', () => {
	it('nennt die Abrechnung der Periode mit einem anderen Heizprofil und Satz als der Lauf', async () => {
		const [used, other] = await db.select({ id: heatingProfiles.id }).from(heatingProfiles).limit(2);
		const contractId = await rent('9.01', 'Frei', '2023-01-01');
		const { id } = await generateStatement({ contractId, buildingId, periodStart: '2023-01-01', periodEnd: '2023-12-31', heatingProfileId: used.id, managementFeePercent: 3 });
		const differences = async (heatingProfileId: string, fee: number) =>
			(await sendJson('GET', `/api/v1/statements/run-differences?buildingId=${buildingId}&periodStart=2023-01-01&periodEnd=2023-12-31&heatingProfileId=${heatingProfileId}&managementFeePercent=${fee}`)).json();

		const found = (await differences(other.id, 4.5)) as { statements: { id: string; profile: unknown; fee: unknown }[] };
		expect(found.statements.map(({ id, fee }) => ({ id, fee }))).toEqual([{ id, fee: { used: 3, now: 4.5, source: 'run' } }]);
		expect(found.statements[0].profile).not.toBeNull();
		expect(await differences(used.id, 3)).toEqual({ statements: [] });
	});

	// #588: the run's Heizprofil after the 100th by name is named too
	it('nennt auch ein Heizprofil nach dem hundertsten beim Namen', async () => {
		const [{ id: _id, name: _name, createdAt: _created, updatedAt: _updated, ...shares }] = await db.select().from(heatingProfiles).limit(1);
		const many = await db
			.insert(heatingProfiles)
			.values([
				...Array.from({ length: 100 }, (_, i) => ({ ...shares, type: 'custom', name: `AAA ${i} ${token}`, nameDE: null })),
				{ ...shares, type: 'predefined', name: `ZZZ ${token}`, nameDE: `ZZZ ${token}` }
			])
			.returning({ id: heatingProfiles.id });
		try {
			const [used] = await db.select({ id: heatingProfiles.id }).from(heatingProfiles).limit(1);
			const contractId = await rent('9.02', 'Graf', '2022-01-01');
			await generateStatement({ contractId, buildingId, periodStart: '2022-01-01', periodEnd: '2022-12-31', heatingProfileId: used.id, managementFeePercent: 0 });
			const response = await sendJson('GET', `/api/v1/statements/run-differences?buildingId=${buildingId}&periodStart=2022-01-01&periodEnd=2022-12-31&heatingProfileId=${many.at(-1)!.id}&managementFeePercent=0`);
			const { statements } = (await response.json()) as { statements: { profile: { run: { name: string } | null } }[] };

			expect(statements.map((s) => s.profile.run?.name)).toEqual([`ZZZ ${token}`]);
		} finally {
			await db.delete(utilityStatements).where(inArray(utilityStatements.contractId, rentals.map((r) => r.contract)));
			await db.delete(heatingProfiles).where(inArray(heatingProfiles.id, many.map((p) => p.id)));
		}
	});

	// H-28 (#717): only a draft is outdated by invoices recorded since (#454); a sent one is corrected instead
	it('nennt einen Entwurf, zu dem seither Rechnungen erfasst wurden, und keine versendete Abrechnung', async () => {
		const [used] = await db.select({ id: heatingProfiles.id }).from(heatingProfiles).limit(1);
		const run = { buildingId, periodStart: '2021-01-01', periodEnd: '2021-12-31', heatingProfileId: used.id, managementFeePercent: 3 };
		const draft = await generateStatement({ ...run, contractId: await rent('9.03', 'Kurz', '2021-01-01') });
		const sent = await generateStatement({ ...run, contractId: await rent('9.04', 'Lang', '2021-01-01') });
		await db.update(utilityStatements).set({ status: 'sent' }).where(eq(utilityStatements.id, sent.id));
		await insertInvoice(buildingId, { invoiceDate: '2021-06-30' });
		try {
			const response = await sendJson('GET', `/api/v1/statements/run-differences?buildingId=${buildingId}&periodStart=2021-01-01&periodEnd=2021-12-31&heatingProfileId=${used.id}&managementFeePercent=3`);
			const { statements } = (await response.json()) as { statements: { id: string; outdated: boolean; fuelStock: boolean }[] };

			expect(statements.map(({ id, outdated, fuelStock }) => ({ id, outdated, fuelStock }))).toEqual([{ id: draft.id, outdated: true, fuelStock: false }]);
		} finally {
			await db.delete(invoices).where(eq(invoices.buildingId, buildingId));
		}
	});
});

