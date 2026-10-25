/**
 * Whether an Abrechnungsperiode is still running, as the statement run asks it (#815): its steps «Abrechnungsperiode»
 * and «Vorschau» then say that costs may still come; by the Swiss day
 */

import { describe, expect, it } from 'bun:test';
import { daysAfter, swissToday } from '../services/today';
import { callApi } from './helpers/auth';

const check = async (periodEnd: string) => {
	const response = await callApi(`/api/v1/statements/check-period?periodEnd=${periodEnd}`);
	return { status: response.status, body: await response.json() };
};

describe('Laufende Abrechnungsperiode', () => {
	it('nennt eine Periode bis heute und später laufend, eine bis gestern nicht', async () => {
		expect(await check(swissToday())).toEqual({ status: 200, body: { running: true } });
		expect(await check('2099-12-31')).toEqual({ status: 200, body: { running: true } });
		expect(await check(daysAfter(swissToday(), -1))).toEqual({ status: 200, body: { running: false } });
	});

	it('lehnt einen Tag ab, der kein Datum ist', async () => {
		expect((await check('31.12.2025')).status).toBe(422);
	});
});
