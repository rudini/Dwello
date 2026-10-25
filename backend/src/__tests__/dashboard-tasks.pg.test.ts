/**
 * The overview's tasks about contracts (#788): a notice without a next tenant (A-4), an agreed end the tenant may have
 * stayed past (A-6), a former tenant's uploads to check (#178); decided in the backend by the Swiss day
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { documents, rentalContracts, tenants } from '../db/schema';
import { createDocument } from '../services/document.service';
import { createContract } from '../services/contract.service';
import { createTenant } from '../services/tenant.service';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

const rentals: Awaited<ReturnType<typeof createRental>>[] = [];

async function contractWith(endDate: string, flags = { terminated: true, movedOut: false }) {
	const rental = await createRental(crypto.randomUUID(), { startDate: '2020-04-01', endDate, monthlyAdvancePayment: '100' });
	await db.update(rentalContracts).set(flags).where(eq(rentalContracts.id, rental.contract));
	rentals.push(rental);
	return rental;
}
type Task = { id?: string; tenantId?: string };
const tasks = async () =>
	((await (await callApi('/api/v1/dashboard')).json()) as { contractTasks: Record<string, Task[]> }).contractTasks;
const ids = (list: Task[]) => list.map((t) => t.id ?? t.tenantId);

afterAll(async () => {
	for (const rental of rentals) {
		await db.delete(documents).where(eq(documents.tenantId, rental.tenant));
		await rental.remove();
	}
});

describe('Aufgaben der Übersicht zu Mietverträgen', () => {
	// A-4.1, review K-6: a next tenant is still to find, also after the end
	it('nennt eine Kündigung ohne späteren Mietvertrag der Wohnung', async () => {
		const { contract } = await contractWith('2099-03-31');
		const agreed = await contractWith('2099-03-31', { terminated: false, movedOut: false });

		const { noticedContracts } = await tasks();
		expect(noticedContracts).toContainEqual(expect.objectContaining({ id: contract, endDate: '2099-03-31' }));
		expect(ids(noticedContracts)).not.toContain(agreed.contract);
	});

	it('nennt keine Kündigung, nach der ein Nachmieter erfasst ist', async () => {
		const { contract, apartment } = await contractWith('2099-03-31');
		const next = await createTenant({ firstName: 'Nach', lastName: crypto.randomUUID() });
		const successor = await createContract({ apartmentId: apartment, tenantId: next.id, baseRent: '950', monthlyAdvancePayment: '100', startDate: '2099-04-01' });
		try {
			expect(ids((await tasks()).noticedContracts)).not.toContain(contract);
		} finally {
			await db.delete(rentalContracts).where(eq(rentalContracts.id, successor.id));
			await db.delete(tenants).where(eq(tenants.id, next.id));
		}
	});

	// A-6: an agreed end passed, the tenant may have stayed; as the contract page asks it
	it('nennt einen abgelaufenen befristeten Mietvertrag ohne Auszug', async () => {
		const expired = await contractWith('2025-12-31', { terminated: false, movedOut: false });
		const movedOut = await contractWith('2025-12-31', { terminated: false, movedOut: true });

		const { expiredContracts } = await tasks();
		expect(expiredContracts).toContainEqual(expect.objectContaining({ id: expired.contract, endDate: '2025-12-31' }));
		expect(ids(expiredContracts)).not.toContain(movedOut.contract);
	});

	// #178: a former tenant's uploads from before the last Vertragsende, until «Als geprüft markieren» (#459)
	it('nennt ehemalige Mieter mit Dokumenten von vor dem Vertragsende, bis sie geprüft sind', async () => {
		const unchecked = await contractWith('2025-03-31');
		const checked = await contractWith('2025-03-31');
		await db.update(rentalContracts).set({ documentsCheckedOn: '2025-05-01' }).where(eq(rentalContracts.id, checked.contract));
		for (const { tenant } of [unchecked, checked])
			await createDocument({ tenantId: tenant, type: 'upload', title: 'Ausweis', fileName: 'a.pdf', content: 'JVBERi0=', createdAt: new Date('2024-06-10T09:00:00.000Z') });

		const { formerTenants } = await tasks();
		expect(formerTenants).toContainEqual(expect.objectContaining({ tenantId: unchecked.tenant, endDate: '2025-03-31', count: 1 }));
		expect(ids(formerTenants)).not.toContain(checked.tenant);
	});
});
