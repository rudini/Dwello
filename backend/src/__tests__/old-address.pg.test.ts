/**
 * A-5 (#114): a moved-out tenant whose Korrespondenzadresse is still the building's; the statement would go to the
 * apartment he left
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { rentalContracts, utilityStatements } from '../db/schema';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createContract, deleteContract } from '../services/contract.service';
import { callApi, sendJson } from './helpers/auth';
import { idOf } from './helpers/records';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;
let statement: string;

const address = (fields: object) => sendJson('PUT', `/api/v1/tenants/${rental.tenant}`, fields);
const oldAddress = async () => {
	const contract = (await (await callApi(`/api/v1/contracts/${rental.contract}`)).json()) as { oldAddress: boolean };
	const listed = (await (await callApi(`/api/v1/contracts?tenantId=${rental.tenant}`)).json()) as {
		contracts: { oldAddress: boolean }[];
	};
	const billed = (await (await callApi(`/api/v1/statements/${statement}`)).json()) as { oldAddress: boolean };
	expect(listed.contracts[0].oldAddress).toBe(contract.oldAddress);
	expect(billed.oldAddress).toBe(contract.oldAddress);
	return contract.oldAddress;
};

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2024-01-01', endDate: '2024-03-31', monthlyAdvancePayment: '0' });
	await db.update(rentalContracts).set({ terminated: true }).where(eq(rentalContracts.id, rental.contract)); // given notice
	statement = await idOf(
		await sendJson('POST', '/api/v1/statements/generate', {
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31'
		})
	);
});

afterAll(async () => {
	await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
	await rental.remove();
});

describe('Ausgezogener Mieter mit der Adresse der Wohnung', () => {
	// Strasse und PLZ wie beim Gebäude, nur anders geschrieben
	it('erkennt die Adresse des Gebäudes ohne Rücksicht auf Gross- und Kleinschreibung und Leerzeichen', async () => {
		await address({ address: '  TESTWEG   1 ', postalCode: '8400 ', city: 'Winterthur' });

		expect(await oldAddress()).toBe(true);
	});

	it('warnt nicht bei einer anderen Adresse oder einer anderen PLZ', async () => {
		await address({ address: 'Ahornweg 3', postalCode: '8400' });
		expect(await oldAddress()).toBe(false);

		await address({ address: 'Testweg 1', postalCode: '8401' });
		expect(await oldAddress()).toBe(false);
	});

	it('warnt nicht ohne Adresse des Mieters', async () => {
		await address({ address: null, postalCode: null, city: null });

		expect(await oldAddress()).toBe(false);
	});

	// Ein Umzug im Haus: der Mieter wohnt noch dort, die Adresse stimmt
	it('warnt nicht, solange der Mieter einen laufenden Mietvertrag in einer anderen Wohnung hat', async () => {
		await address({ address: 'Testweg 1', postalCode: '8400', city: 'Winterthur' });
		const apartment = await createApartment({ buildingId: rental.building, number: '2.02', floor: 2, area: '70', rooms: '3.5' });
		const running = await createContract({ apartmentId: apartment.id, tenantId: rental.tenant, baseRent: '950', monthlyAdvancePayment: '0', startDate: '2024-04-01' });

		expect(await oldAddress()).toBe(false);

		await deleteContract(running.id, true);
		await deleteApartment(apartment.id);
		expect(await oldAddress()).toBe(true);
	});

	// A-6 (#115, merge review C-1): after an agreed end without «Mieter ist ausgezogen» the tenant may have stayed
	it('warnt nach einem abgelaufenen befristeten Mietvertrag erst, wenn der Auszug bestätigt ist', async () => {
		const contract = (fields: { terminated?: boolean; movedOut?: boolean }) =>
			db.update(rentalContracts).set(fields).where(eq(rentalContracts.id, rental.contract));
		await address({ address: 'Testweg 1', postalCode: '8400', city: 'Winterthur' }); // the building's
		await contract({ terminated: false });

		expect(await oldAddress()).toBe(false);
		await contract({ movedOut: true });
		expect(await oldAddress()).toBe(true);
		await contract({ terminated: true, movedOut: false });
	});

	// directly: the draft of 2024 refuses a later Vertragsende through the API
	it('warnt nicht, solange der Mietvertrag läuft', async () => {
		const endOn = (endDate: string) =>
			db.update(rentalContracts).set({ endDate }).where(eq(rentalContracts.id, rental.contract));
		await address({ address: 'Testweg 1', postalCode: '8400', city: 'Winterthur' }); // the building's
		expect(await oldAddress()).toBe(true);
		await endOn('2099-12-31');

		expect(await oldAddress()).toBe(false);
		await endOn('2024-03-31');
	});
});
