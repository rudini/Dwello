/**
 * Company configuration through the API (real PostgreSQL database)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { sql } from 'drizzle-orm';
import { db } from '../db/connection';
import { deleteConfig, getConfig, setConfig } from '../services/config.service';
import { sendJson } from './helpers/auth';

const iban = await getConfig('iban');
const companyName = await getConfig('company_name');
const companyCity = await getConfig('company_city');

afterAll(async () => {
	if (iban) await setConfig('iban', iban);
	else await deleteConfig('iban');
	if (companyName) await setConfig('company_name', companyName);
	else await deleteConfig('company_name');
	if (companyCity) await setConfig('company_city', companyCity);
	else await deleteConfig('company_city');
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

	// Die Seite meldet einen Fehler; gespeichert sein darf dann auch nichts anderes
	it('speichert nichts, wenn ein Wert ungültig ist', async () => {
		const response = await sendJson('PUT', '/api/v1/config', {
			company_name: `Verwaltung ${crypto.randomUUID()}`,
			iban: 'CH93 0076 2011 6238 5295 8'
		});

		expect(response.status).toBe(400);
		expect(await getConfig('company_name')).toBe(companyName);
	});

	// Gültige Werte, aber die Datenbank bricht beim zweiten ab: der erste darf dann nicht gespeichert bleiben
	it('speichert nichts, wenn das Schreiben mittendrin scheitert', async () => {
		try {
			await db.execute(sql`
				CREATE FUNCTION reject_test_city() RETURNS trigger AS $$
				BEGIN
					IF NEW.key = 'company_city' AND NEW.value = 'Abbruchhausen' THEN RAISE EXCEPTION 'Testabbruch'; END IF;
					RETURN NEW;
				END $$ LANGUAGE plpgsql`);
			await db.execute(sql`
				CREATE TRIGGER reject_test_city BEFORE INSERT OR UPDATE ON configuration
				FOR EACH ROW EXECUTE FUNCTION reject_test_city()`);

			const response = await sendJson('PUT', '/api/v1/config', {
				company_name: `Verwaltung ${crypto.randomUUID()}`,
				company_city: 'Abbruchhausen'
			});

			expect(response.status).toBe(500);
			expect(await getConfig('company_name')).toBe(companyName);
		} finally {
			await db.execute(sql`DROP TRIGGER IF EXISTS reject_test_city ON configuration`);
			await db.execute(sql`DROP FUNCTION IF EXISTS reject_test_city()`);
		}
	});

	it('speichert eine gültige IBAN', async () => {
		const response = await sendJson('PUT', '/api/v1/config', {
			iban: 'CH93 0076 2011 6238 5295 7'
		});

		expect(response.status).toBe(200);
		expect(await getConfig('iban')).toBe('CH93 0076 2011 6238 5295 7');
	});
});
