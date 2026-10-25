/**
 * Whether a Vertragsbeginn lies in the past, as the contract wizard asks it (#815, decided 25.10.2026): the wizard then
 * asks back and offers «Abgerechnet bis» (#453); by the Swiss day
 */

import { describe, expect, it } from 'bun:test';
import { daysAfter, swissToday } from '../services/today';
import { callApi } from './helpers/auth';

const check = async (startDate: string) => {
	const response = await callApi(`/api/v1/contracts/check-start?startDate=${startDate}`);
	return { status: response.status, body: await response.json() };
};

describe('Vertragsbeginn in der Vergangenheit', () => {
	it('nennt einen Vertragsbeginn vor heute vergangen, heute und später nicht', async () => {
		expect(await check(daysAfter(swissToday(), -1))).toEqual({ status: 200, body: { past: true } });
		expect(await check(swissToday())).toEqual({ status: 200, body: { past: false } });
		expect(await check('2099-01-01')).toEqual({ status: 200, body: { past: false } });
	});

	it('lehnt einen Tag ab, der kein Datum ist', async () => {
		expect((await check('01.01.2020')).status).toBe(422);
	});
});
