/**
 * Company configuration through the API (real PostgreSQL database)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { deleteConfig, getConfig, setConfig } from '../services/config.service';
import { sendJson } from './helpers/auth';

const iban = await getConfig('iban');

afterAll(async () => {
	if (iban) await setConfig('iban', iban);
	else await deleteConfig('iban');
});

describe('Einstellungen speichern', () => {
	// Mit falscher Prüfziffer entstünde der Einzahlungsschein nicht, das PDF käme ohne Zahlteil
	it('lehnt eine IBAN mit falscher Prüfziffer ab', async () => {
		const response = await sendJson('PUT', '/api/v1/config', {
			iban: 'CH93 0076 2011 6238 5295 8'
		});

		expect(response.status).toBe(400);
		expect(await getConfig('iban')).toBe(iban);
	});

	it('speichert eine gültige IBAN', async () => {
		const response = await sendJson('PUT', '/api/v1/config', {
			iban: 'CH93 0076 2011 6238 5295 7'
		});

		expect(response.status).toBe(200);
		expect(await getConfig('iban')).toBe('CH93 0076 2011 6238 5295 7');
	});
});
