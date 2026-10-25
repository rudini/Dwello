/**
 * Whether a contract ends today, by the Swiss day (#815): the contract page then says «endet heute» after the end is
 * recorded, instead of comparing the day with today itself
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { daysAfter, swissToday } from '../services/today';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

const rentals: Awaited<ReturnType<typeof createRental>>[] = [];
const endsToday = async (endDate?: string) => {
	const created = await createRental(crypto.randomUUID(), { startDate: '2020-04-01', endDate, monthlyAdvancePayment: '100' });
	rentals.push(created);
	return ((await (await callApi(`/api/v1/contracts/${created.contract}`)).json()) as { endsToday: boolean }).endsToday;
};

afterAll(async () => {
	for (const created of rentals) await created.remove();
});

describe('Vertragsende heute', () => {
	it('nennt einen Mietvertrag, der heute endet, und keinen anderen', async () => {
		expect(await endsToday(swissToday())).toBe(true);
		expect(await endsToday(daysAfter(swissToday(), 1))).toBe(false);
		expect(await endsToday(daysAfter(swissToday(), -1))).toBe(false);
		expect(await endsToday()).toBe(false);
	});
});
