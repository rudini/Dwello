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
const companyPostalCode = await getConfig('company_postal_code');

afterAll(async () => {
	if (iban) await setConfig('iban', iban);
	else await deleteConfig('iban');
	if (companyName) await setConfig('company_name', companyName);
	else await deleteConfig('company_name');
	if (companyCity) await setConfig('company_city', companyCity);
	else await deleteConfig('company_city');
	if (companyPostalCode) await setConfig('company_postal_code', companyPostalCode);
	else await deleteConfig('company_postal_code');
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

	// #465 (#103, DMR-09): Telefon und E-Mail der Verwaltung für den Kopf des PDF, beide freiwillig
	it('speichert Telefon und E-Mail der Verwaltung und lehnt eine ungültige E-Mail ab', async () => {
		const [phone, email] = [await getConfig('company_phone'), await getConfig('company_email')];
		const saved = await sendJson('PUT', '/api/v1/config', { company_phone: '044 123 45 67', company_email: 'info@muster.ch' });
		const refused = await sendJson('PUT', '/api/v1/config', { company_email: 'info@muster' });
		const stored = [await getConfig('company_phone'), await getConfig('company_email')];
		const cleared = await sendJson('PUT', '/api/v1/config', { company_phone: '', company_email: '' });
		await (phone ? setConfig('company_phone', phone) : deleteConfig('company_phone'));
		await (email ? setConfig('company_email', email) : deleteConfig('company_email'));

		expect(saved.status).toBe(200);
		expect(refused.status).toBe(400);
		expect(stored).toEqual(['044 123 45 67', 'info@muster.ch']);
		expect(cleared.status).toBe(200);
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
		expect(await getConfig('iban')).toBe('CH9300762011623852957');
	});

	// #450 (Entscheid in #404, Punkt 8): der Zahlteil nennt den Liegenschaftsverwalter als Zahlungsempfänger
	it('speichert eine IBAN nur mit Name, PLZ und Ort der Firmenadresse', async () => {
		const [name, city] = [await getConfig('company_name'), await getConfig('company_city')];
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
			expect(await getConfig('company_city')).toBe(city);
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
			// the form sends the IBAN it shows with every save
			const response = await sendJson('PUT', '/api/v1/config', { payment_deadline_days: '30', iban: 'CH9300762011623852957' });
			// the way out without a Firmenadresse, in the form's order: the others without the emptied IBAN, then its
			// reset (Fachreview V-5, code review C-1)
			const withoutIban = await sendJson('PUT', '/api/v1/config', { payment_deadline_days: '30' });
			const reset = await callApi('/api/v1/config/iban', { method: 'DELETE' });

			expect(response.status).toBe(400);
			expect(await response.json()).toMatchObject({ code: 'IBAN_COMPANY_ADDRESS_MISSING' });
			expect([withoutIban.status, reset.status]).toEqual([200, 200]);
		} finally {
			if (name) await setConfig('company_name', name);
		}
	});
});

// H-28 (#717): the settings form's checks are the backend's; each refused field with its code, all at once, as typed
describe('Einstellungen prüfen', () => {
	it('lehnt jedes ungültige Feld mit seinem Code ab und speichert nichts', async () => {
		const response = await sendJson('PUT', '/api/v1/config', {
			company_name: `Verwaltung ${crypto.randomUUID()}`,
			company_postal_code: '80',
			company_email: 'info@muster',
			iban: 'DE89 3704 0044 0532 0130 00',
			management_fee_pct: '10,01',
			payment_deadline_days: '30,5',
			reminder_after_days: '1e1'
		});

		expect(response.status).toBe(400);
		const { causes } = (await response.json()) as { causes: { code: string; params: { field: string } }[] };
		expect(causes.sort((a, b) => a.params.field.localeCompare(b.params.field))).toEqual([
			{ code: 'COMPANY_EMAIL_INVALID', params: { field: 'company_email' } },
			{ code: 'POSTAL_CODE_DIGITS', params: { field: 'company_postal_code' } },
			{ code: 'IBAN_ENTERED_INVALID', params: { field: 'iban' } },
			{ code: 'MANAGEMENT_FEE_INVALID', params: { field: 'management_fee_pct' } },
			{ code: 'PAYMENT_DEADLINE_DAYS', params: { field: 'payment_deadline_days' } },
			{ code: 'REMINDER_AFTER_DAYS', params: { field: 'reminder_after_days' } }
		]);
		expect(await getConfig('company_name')).toBe(companyName);
	});

	// as the landlord types them: «2,5» or «4 %» stored as a number with a point, the IBAN in groups stored without spaces
	it('nimmt Verwaltungspauschale und IBAN an, wie sie getippt werden', async () => {
		const [fee, name] = [await getConfig('management_fee_pct'), await getConfig('company_name')];
		const typed = async (management_fee_pct: string) => (await sendJson('PUT', '/api/v1/config', { management_fee_pct })).status;
		try {
			const statuses = [await typed('2,5'), await typed('4 %'), await typed('2,555')];
			const stored = await getConfig('management_fee_pct');
			await sendJson('PUT', '/api/v1/config', { company_name: 'Muster Immobilien AG', iban: 'ch93 0076 2011 6238 5295 7' });

			expect(statuses).toEqual([200, 200, 400]);
			expect(stored).toBe('4');
			expect(await getConfig('iban')).toBe('CH9300762011623852957');
		} finally {
			await (fee ? setConfig('management_fee_pct', fee) : deleteConfig('management_fee_pct'));
			await (name ? setConfig('company_name', name) : deleteConfig('company_name'));
		}
	});

	// the form sends every field; an emptied one is reset to its default in the same save, and with an IBAN the
	// Firmenadresse it empties is missing (#450), named so the page marks those fields
	it('setzt geleerte Felder beim selben Speichern zurück und verlangt mit der IBAN die Firmenadresse', async () => {
		const [fee, name, city] = [await getConfig('management_fee_pct'), await getConfig('company_name'), await getConfig('company_city')];
		await setConfig('company_name', 'Muster Immobilien AG');
		await setConfig('company_city', 'Winterthur');
		await setConfig('management_fee_pct', '4');
		try {
			const refused = await sendJson('PUT', '/api/v1/config', { company_name: '', company_city: ' ', management_fee_pct: '', iban: 'CH93 0076 2011 6238 5295 7' });
			const refusal = await refused.json();
			const kept = [await getConfig('company_name'), await getConfig('management_fee_pct')];
			const saved = await sendJson('PUT', '/api/v1/config', { company_name: '', management_fee_pct: '', iban: '' });

			expect(refused.status).toBe(400);
			expect(refusal).toMatchObject({
				code: 'IBAN_COMPANY_ADDRESS_MISSING',
				causes: [{ code: 'IBAN_COMPANY_ADDRESS_MISSING', params: { field: 'iban', missing: 'company_name,company_city' } }]
			});
			expect(kept).toEqual(['Muster Immobilien AG', '4']);
			expect(saved.status).toBe(200);
			expect([await getConfig('company_name'), await getConfig('management_fee_pct'), await getConfig('iban')]).toEqual(['', '3', '']);
		} finally {
			await (fee ? setConfig('management_fee_pct', fee) : deleteConfig('management_fee_pct'));
			await (name ? setConfig('company_name', name) : deleteConfig('company_name'));
			await (city ? setConfig('company_city', city) : deleteConfig('company_city'));
		}
	});

	// code review h28g C-1: the Firmenadresse an IBAN needs is named with the form's other errors, as before
	it('nennt die fehlende Firmenadresse zusammen mit den anderen abgelehnten Feldern', async () => {
		const response = await sendJson('PUT', '/api/v1/config', { company_email: 'info@muster', company_name: '', iban: 'CH93 0076 2011 6238 5295 7' });
		const { causes } = (await response.json()) as { causes: { code: string }[] };

		expect(causes.map((cause) => cause.code).sort()).toEqual(['COMPANY_EMAIL_INVALID', 'IBAN_COMPANY_ADDRESS_MISSING']);
	});

	// code review h28g C-2, C-5: the limits of the days, and an IBAN as the QR-bill takes it (#191): CH or LI, the
	// institution's number in digits, the check digits right (pinned as before, now in the backend)
	it.each([
		['payment_deadline_days', '7', 200],
		['payment_deadline_days', '90', 200],
		['payment_deadline_days', '6', 400],
		['payment_deadline_days', '91', 400],
		['reminder_after_days', '7', 200],
		['reminder_after_days', '60', 200],
		['reminder_after_days', '61', 400],
		['iban', 'LI22 0881 0000 2324 013A A', 400],
		['iban', 'CH56 0483 5012 3456 7800 9', 200],
		['iban', 'CH97 A483 5012 3456 7800 9', 400]
	])('nimmt %s «%s» mit Status %i', async (key, value, status) => {
		const before = await getConfig(key as 'iban');
		await setConfig('company_name', 'Muster Immobilien AG');
		await setConfig('company_city', 'Winterthur');
		await setConfig('company_postal_code', '8400');
		const response = await sendJson('PUT', '/api/v1/config', { [key]: value });
		await (before ? setConfig(key as 'iban', before) : deleteConfig(key as 'iban'));

		expect(response.status).toBe(status);
	});
});
