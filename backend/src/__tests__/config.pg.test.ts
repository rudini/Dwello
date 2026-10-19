/**
 * Company configuration through the API (real PostgreSQL database)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { sql } from 'drizzle-orm';
import { db } from '../db/connection';
import { deleteConfig, getConfig, setConfig } from '../services/config.service';
import { callApi, sendJson } from './helpers/auth';

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
	// O-36: zwei erste Speicherungen derselben Einstellung zur gleichen Zeit (parallele Szenarien) liefen auf den
	// eindeutigen Schlüssel und brachen mit 500 ab
	it('speichert eine Einstellung, die mehrmals gleichzeitig zum ersten Mal gesetzt wird', async () => {
		await deleteConfig('company_city');
		// open the connections first: the pool opens them one by one, which would order the writes
		await Promise.all(Array.from({ length: 10 }, () => db.execute(sql`select pg_sleep(0.05)`)));

		const writes = await Promise.allSettled(Array.from({ length: 10 }, () => setConfig('company_city', 'Winterthur')));

		expect(writes.filter((write) => write.status === 'rejected')).toEqual([]);
		expect(await getConfig('company_city')).toBe('Winterthur');
	});

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

	// #450 (Entscheid in #404, Punkt 8): der Zahlteil nennt den Liegenschaftsverwalter als Zahlungsempfänger
	it('speichert eine IBAN nur mit Name, PLZ und Ort der Firmenadresse', async () => {
		const name = await getConfig('company_name');
		await deleteConfig('company_name');
		try {
			const refused = await sendJson('PUT', '/api/v1/config', { company_city: 'Winterthur', iban: 'CH93 0076 2011 6238 5295 7' });
			const blank = await sendJson('PUT', '/api/v1/config', { company_name: '  ', iban: 'CH93 0076 2011 6238 5295 7' });
			const withName = await sendJson('PUT', '/api/v1/config', {
				company_name: 'Muster Immobilien AG',
				iban: 'CH93 0076 2011 6238 5295 7'
			});

			expect(refused.status).toBe(400);
			expect(await refused.json()).toMatchObject({ code: 'IBAN_COMPANY_ADDRESS_MISSING' });
			expect(await getConfig('company_city')).toBe(companyCity);
			expect(blank.status).toBe(400);
			expect(withName.status).toBe(200);
		} finally {
			if (name) await setConfig('company_name', name);
			else await deleteConfig('company_name');
		}
	});

	// #450: eine Installation von vorher mit IBAN und ohne Firmenadresse: das nächste Speichern verlangt sie
	it('verlangt die Firmenadresse beim nächsten Speichern, wenn schon eine IBAN hinterlegt ist', async () => {
		const name = await getConfig('company_name');
		await setConfig('iban', 'CH93 0076 2011 6238 5295 7');
		await db.execute(sql`DELETE FROM configuration WHERE key = 'company_name'`);
		try {
			const response = await sendJson('PUT', '/api/v1/config', { payment_deadline_days: '30' });
			// the way out without a Firmenadresse: the emptied IBAN is reset (Fachreview V-5)
			const reset = await callApi('/api/v1/config/iban', { method: 'DELETE' });
			const afterReset = await sendJson('PUT', '/api/v1/config', { payment_deadline_days: '30' });

			expect(response.status).toBe(400);
			expect(await response.json()).toMatchObject({ code: 'IBAN_COMPANY_ADDRESS_MISSING' });
			expect([reset.status, afterReset.status]).toEqual([200, 200]);
		} finally {
			if (name) await setConfig('company_name', name);
		}
	});
});
