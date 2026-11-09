import { afterAll, describe, expect, it } from 'bun:test';
import { callApi } from './helpers/auth';
import { invoicedBuilding } from './helpers/records';

// #1410: the invoice names until when it must be kept, for the confirmation to delete it
describe('Aufbewahrungsfrist einer Rechnung', () => {
	const removals: (() => Promise<void>)[] = [];
	afterAll(async () => {
		for (const remove of removals) await remove();
	});
	const keepUntilOf = async (invoiceDate: string) => {
		const name = `Aufbewahrung ${crypto.randomUUID()}`;
		removals.push(await invoicedBuilding(name, { invoiceDate }));
		const { invoices } = (await (
			await callApi(`/api/v1/invoices?search=${encodeURIComponent('Muster AG')}&limit=1000`)
		).json()) as {
			invoices: { id: string; building: { name: string } }[];
		};
		const id = invoices.find((i) => i.building.name === name)!.id;
		const invoice = (await (await callApi(`/api/v1/invoices/${id}`)).json()) as {
			keepUntil: string | null;
		};
		return invoice.keepUntil;
	};

	it('GET /invoices/:id nennt das Ende der Aufbewahrungsfrist', async () => {
		expect(await keepUntilOf('2024-03-31')).toBe('2034-12-31');
	});

	it('GET /invoices/:id nennt nach Ablauf der Aufbewahrungsfrist kein Ende mehr', async () => {
		expect(await keepUntilOf('2015-06-30')).toBeNull();
	});
});
