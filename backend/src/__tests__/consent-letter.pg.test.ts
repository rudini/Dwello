/**
 * #521: the letter with which the tenants of a contract agree to a new Abrechnungsperiode (`GET
 * /contracts/:id/consent-letter`), and the contracts step 2 of the wizard offers it for (Fachreview 521-1 V-1, V-2).
 * The wording is tested on `consentLetter` (consent-letter.test.ts), the period on `consentPeriod`.
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { utilityStatements } from '../db/schema';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { createContract, deleteContract } from '../services/contract.service';
import { generateStatement } from '../services/statement.service';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { callApi, sendJson } from './helpers/auth';
import { readPdf } from './helpers/pdf-text';
import type { Language } from '../db/schema';

const token = crypto.randomUUID();
const buildings: string[] = [];
const rentals: { apartment: string; tenant: string; contract: string }[] = [];

async function newBuilding() {
	const { id } = await createBuilding({ name: `Ahornhof ${token} ${buildings.length}`, address: 'Seeweg 1', postalCode: '8400', city: 'Winterthur', canton: 'ZH' });
	buildings.push(id);
	return id;
}

async function rent(buildingId: string, number: string, lastName: string, startDate: string, endDate?: string, language?: Language) {
	const apartment = await createApartment({ buildingId, number, floor: 1, area: '60', rooms: '3' });
	const tenant = await createTenant({ firstName: 'Anna', lastName: `${lastName} ${token}`, language });
	const contract = await createContract({ apartmentId: apartment.id, tenantId: tenant.id, startDate, endDate, baseRent: '900', monthlyAdvancePayment: '100' });
	rentals.push({ apartment: apartment.id, tenant: tenant.id, contract: contract.id });
	return contract.id;
}

const bill = (contractId: string, buildingId: string, periodStart: string, periodEnd: string) =>
	generateStatement({ contractId, buildingId, periodStart, periodEnd, managementFeePercent: 0 });

afterAll(async () => {
	await db.delete(utilityStatements).where(inArray(utilityStatements.contractId, rentals.map((r) => r.contract)));
	for (const r of rentals) {
		await deleteContract(r.contract, true);
		await deleteTenant(r.tenant);
		await deleteApartment(r.apartment);
	}
	for (const id of buildings) await deleteBuilding(id);
});

describe('Brief zur Zustimmung zu einer neuen Abrechnungsperiode', () => {
	it('liefert den Brief an den Mieter mit Mietvertrag, kurzer Abrechnungsperiode und Unterschriftszeilen als PDF', async () => {
		const building = await newBuilding();
		const contract = await rent(building, '2.01', 'Keller', '2024-04-01');
		await bill(contract, building, '2024-07-01', '2025-06-30');

		const response = await callApi(`/api/v1/contracts/${contract}/consent-letter`);
		const text = readPdf(Buffer.from(await response.arrayBuffer())).flowing;

		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toBe('application/pdf');
		expect(response.headers.get('content-disposition')).toBe(
			`attachment; filename="Zustimmung zu einer neuen Abrechnungsperiode 2.01 Keller ${token}.pdf"; filename*=UTF-8''${encodeURIComponent(`Zustimmung zu einer neuen Abrechnungsperiode 2.01 Keller ${token}.pdf`)}`
		);
		expect(text).toContain(`Anna Keller ${token}`);
		expect(text).toContain('Mietvertrag für die Wohnung 2.01, Seeweg 1, 8400 Winterthur');
		expect(text).toContain('vom 1. Juli bis 30. Juni abgerechnet');
		expect(text).toContain('kurze Abrechnungsperiode 01.07.2025 – 31.12.2025');
		expect(text).toContain('Ort, Datum');
		expect(text).toContain(`Unterschrift Anna Keller ${token}`);
		expect(text).toContain('Unterschrift weiterer Mieter');
	});

	// C-5 (Fachreview 521-2 V-9): two tenants of one apartment in the short period get two names, in the letter's language
	it('benennt die Datei nach dem Titel in der Sprache des Mieters, der Wohnung und dem Nachnamen', async () => {
		const building = await newBuilding();
		const contract = await rent(building, '2.01', 'Favre', '2024-04-01', undefined, 'fr');
		await bill(contract, building, '2024-07-01', '2025-06-30');

		const response = await callApi(`/api/v1/contracts/${contract}/consent-letter`);

		expect(response.headers.get('content-disposition')).toBe(
			`attachment; filename="Accord sur une nouvelle p_riode de d_compte 2.01 Favre ${token}.pdf"; filename*=UTF-8''${encodeURIComponent(`Accord sur une nouvelle période de décompte 2.01 Favre ${token}.pdf`)}`
		);
	});

	// the contract page shows the link at the short period the letter is for
	it('nennt bei den fehlenden Abrechnungen die kurze Abrechnungsperiode des Briefs', async () => {
		const building = await newBuilding();
		const contract = await rent(building, '2.01', 'Frei', '2024-04-01');
		await bill(contract, building, '2024-07-01', '2025-06-30');

		const missing = (await (await callApi(`/api/v1/contracts/${contract}/missing-statements`)).json()) as { start: string; consent: boolean }[];

		expect(missing.map(({ start, consent }) => [start, consent])).toEqual([
			['2025-07-01', true],
			['2023-07-01', false]
		]);
	});

	// Fachreview 521-1 V-1: a statement over part of a period tells no earlier Abrechnungsperiode
	it('lehnt den Brief ohne frühere Abrechnungsperiode mit Code ab', async () => {
		const building = await newBuilding();
		const contract = await rent(building, '2.01', 'Meier', '2024-04-01');
		await bill(contract, building, '2024-04-01', '2024-09-30');

		const response = await callApi(`/api/v1/contracts/${contract}/consent-letter`);

		expect(response.status).toBe(409);
		expect(((await response.json()) as { code: string }).code).toBe('CONSENT_LETTER_NONE');
	});

	it('meldet einen unbekannten Mietvertrag als nicht gefunden', async () => {
		expect((await callApi(`/api/v1/contracts/${crypto.randomUUID()}/consent-letter`)).status).toBe(404);
	});
});

// Fachreview 521-1 V-2: step 2 offers the letter for each contract with Mietstage in the short period
describe('Brief zur Zustimmung in der Wahl der Gebäude', () => {
	it('nennt die Mietverträge mit Mietstagen in der kurzen Abrechnungsperiode, nicht einen ausgezogenen', async () => {
		const building = await newBuilding();
		const staying = await rent(building, '3.01', 'Huber', '2024-05-01');
		const gone = await rent(building, '3.02', 'Frei', '2024-01-01', '2025-06-30');
		await bill(staying, building, '2024-07-01', '2025-06-30');
		await bill(gone, building, '2024-07-01', '2025-06-30');

		const response = await sendJson('GET', `/api/v1/statements/run?buildingId=${building}&periodStart=2025-01-01&periodEnd=2025-12-31`);
		const plan = (await response.json()) as { overlap: { consent: unknown[] } };

		expect(plan.overlap.consent).toEqual([{ id: staying, tenantName: `Anna Huber ${token}`, apartmentNumber: '3.01' }]);
	});
});
