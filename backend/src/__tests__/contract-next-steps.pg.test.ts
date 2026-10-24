/**
 * What the contract page asks of the landlord after an end (#788): the next steps of a notice (A-4, A-5) and whether the
 * tenant stayed after an agreed end (A-6); decided in the backend, by the Swiss day
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { rentalContracts, tenants } from '../db/schema';
import { createContract } from '../services/contract.service';
import { createTenant } from '../services/tenant.service';
import { swissToday } from '../services/today';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

const rentals: Awaited<ReturnType<typeof createRental>>[] = [];

async function contractWith(endDate: string, flags = { terminated: true, movedOut: false }) {
	const rental = await createRental(crypto.randomUUID(), { startDate: '2020-04-01', endDate, monthlyAdvancePayment: '100' });
	await db.update(rentalContracts).set(flags).where(eq(rentalContracts.id, rental.contract));
	rentals.push(rental);
	return rental;
}
const stored = async (contract: string) =>
	(await (await callApi(`/api/v1/contracts/${contract}`)).json()) as Record<string, unknown>;

afterAll(async () => {
	for (const rental of rentals) await rental.remove();
});

// review K-1: next steps only while the notice runs
describe('Nächste Schritte nach einer Kündigung', () => {
	it('nennt sie bei einer laufenden Kündigung ohne Nachmieter', async () => {
		const { contract } = await contractWith('2099-03-31');

		expect((await stored(contract)).nextSteps).toEqual({ successor: false, ended: false });
	});

	// a later contract for the apartment: only the new address is still due (Haiku review R2)
	it('nennt mit erfasstem Nachmieter nur noch die neue Adresse', async () => {
		const { contract, apartment } = await contractWith('2099-03-31');
		const next = await createTenant({ firstName: 'Nach', lastName: crypto.randomUUID() });
		const successor = await createContract({ apartmentId: apartment, tenantId: next.id, baseRent: '950', monthlyAdvancePayment: '100', startDate: '2099-04-01' });
		try {
			expect((await stored(contract)).nextSteps).toEqual({ successor: true, ended: false });
		} finally {
			await db.delete(rentalContracts).where(eq(rentalContracts.id, successor.id));
			await db.delete(tenants).where(eq(tenants.id, next.id));
		}
	});

	it('nennt sie nicht nach dem Auszug und nicht ohne Kündigung', async () => {
		const ended = await contractWith('2021-02-28');
		const agreed = await contractWith('2099-03-31', { terminated: false, movedOut: false });

		expect((await stored(ended.contract)).nextSteps).toBeNull();
		expect((await stored(agreed.contract)).nextSteps).toBeNull();
	});

	// A-5 (#114): after the end the statement would otherwise go to the apartment the tenant left
	it('nennt nach dem Vertragsende nur noch die neue Adresse, solange es die Adresse der Wohnung ist', async () => {
		const { contract, tenant } = await contractWith('2021-02-28');
		await db.update(tenants).set({ address: 'Testweg 1', postalCode: '8400' }).where(eq(tenants.id, tenant));

		expect((await stored(contract)).nextSteps).toEqual({ successor: false, ended: true });
	});
});

// A-6: after an agreed end the tenant may have stayed, and then the contract continues open-ended (Art. 266 Abs. 2 OR)
describe('Abgelaufener befristeter Mietvertrag', () => {
	const expired = { terminated: false, movedOut: false };

	it('fragt nach einem vereinbarten Vertragsende vor heute ohne späteren Mietvertrag', async () => {
		const { contract } = await contractWith('2025-12-31', expired);

		expect((await stored(contract)).fixedTermCheck).toBe(true);
	});

	it('fragt nicht nach einer Kündigung, einem bestätigten Auszug, vor dem Ende, am letzten Tag oder ohne Ende', async () => {
		const asked = async (endDate: string, flags = expired) => (await stored((await contractWith(endDate, flags)).contract)).fixedTermCheck;

		expect(await asked('2025-12-31', { terminated: true, movedOut: false })).toBe(false);
		expect(await asked('2025-12-31', { terminated: false, movedOut: true })).toBe(false);
		expect(await asked('2099-12-31')).toBe(false);
		// Fachreview A-6 V-6: on its last day the contract still runs
		expect(await asked(swissToday())).toBe(false);
		const { contract } = await contractWith('2025-12-31', expired);
		await db.update(rentalContracts).set({ endDate: null }).where(eq(rentalContracts.id, contract));
		expect((await stored(contract)).fixedTermCheck).toBe(false);
	});

	it('fragt nicht, wenn nach dem Vertragsende ein späterer Mietvertrag für die Wohnung erfasst ist', async () => {
		const { contract, apartment } = await contractWith('2025-12-31', expired);
		const next = await createTenant({ firstName: 'Nach', lastName: crypto.randomUUID() });
		const successor = await createContract({ apartmentId: apartment, tenantId: next.id, baseRent: '950', monthlyAdvancePayment: '100', startDate: '2026-01-01' });
		try {
			expect((await stored(contract)).fixedTermCheck).toBe(false);
		} finally {
			await db.delete(rentalContracts).where(eq(rentalContracts.id, successor.id));
			await db.delete(tenants).where(eq(tenants.id, next.id));
		}
	});
});
