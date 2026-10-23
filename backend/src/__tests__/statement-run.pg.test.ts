/**
 * H-28: which contracts a run bills is decided by the backend (`GET /statements/run`), not by the BFF. The rules
 * themselves are tested on `planRun` (statement-run.test.ts); here the route reads the building's real records.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { heatingProfiles, utilityStatements } from '../db/schema';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { createContract, deleteContract } from '../services/contract.service';
import { generateStatement } from '../services/statement.service';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { sendJson } from './helpers/auth';

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

