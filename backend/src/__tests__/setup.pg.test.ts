/**
 * The setup on the first visit (#577): while no Konto mit Passwort exists, the Einrichtungscode from the server log
 * creates the first one; after that the setup is closed (real PostgreSQL database)
 */

import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { app } from '../app';
import { newSetupCode, resetSetupAttempts } from '../services/setup.service';
import { db } from '../db/connection';
import { localAccounts } from '../db/schema';

const CODE = 'TEST-CODE';

const setUp = (body: object) =>
	app.handle(
		new Request('http://localhost/api/v1/setup', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body)
		})
	);
const codeOf = async (response: Response) => ((await response.json()) as { code: string }).code;
const account = { email: 'verwalterin@dwello.test', password: 'ein-langes-Passwort' };

// test files run one after another and each removes its accounts: here the database starts without one
beforeEach(async () => {
	process.env.SETUP_CODE = CODE;
	resetSetupAttempts();
	await db.delete(localAccounts);
});
afterEach(async () => {
	delete process.env.SETUP_CODE;
	await db.delete(localAccounts);
});

describe('Einrichtung', () => {
	it('sagt, dass Dwello noch einzurichten ist, solange es kein Konto mit Passwort gibt', async () => {
		const response = await app.handle(new Request('http://localhost/api/v1/setup'));

		expect(await response.json()).toEqual({ needed: true });
	});

	it('legt mit dem Einrichtungscode das erste Konto mit Passwort an und nennt es', async () => {
		const response = await setUp({ code: CODE, ...account });

		expect(response.status).toBe(201);
		expect(await response.json()).toEqual({ sub: expect.stringMatching(/^local:/), email: account.email, name: account.email });
		expect((await db.select().from(localAccounts)).map((row) => row.email)).toEqual([account.email]);
	});

	it('nimmt den Einrichtungscode unabhängig von Gross- und Kleinschreibung und Leerzeichen an', async () => {
		expect((await setUp({ code: ` ${CODE.toLowerCase()} `, ...account })).status).toBe(201);
	});

	it('lehnt einen falschen Einrichtungscode ab und legt kein Konto an', async () => {
		const response = await setUp({ code: 'FALS-CHER', ...account });

		expect(response.status).toBe(403);
		expect(await codeOf(response)).toBe('SETUP_CODE_INVALID');
		expect(await db.select().from(localAccounts)).toEqual([]);
	});

	it('verlangt auch hier ein Passwort mit mindestens 8 Zeichen', async () => {
		const response = await setUp({ code: CODE, email: account.email, password: 'kurz' });

		expect(response.status).toBe(400);
		expect(await codeOf(response)).toBe('PASSWORD_TOO_SHORT');
	});

	it('ist nach der Einrichtung geschlossen, auch mit dem richtigen Code', async () => {
		await setUp({ code: CODE, ...account });

		const again = await setUp({ code: CODE, email: 'fremd@dwello.test', password: 'ein-anderes-Passwort' });

		expect(again.status).toBe(409);
		expect(await codeOf(again)).toBe('SETUP_DONE');
		expect(await (await app.handle(new Request('http://localhost/api/v1/setup'))).json()).toEqual({ needed: false });
		expect((await db.select().from(localAccounts)).map((row) => row.email)).toEqual([account.email]);
	});

	// fach review 577 R-5 (Art. 8 DSG): the code is long enough, and guessing it is stopped
	it('erzeugt einen Einrichtungscode aus 8 gut lesbaren Zeichen', () => {
		const codes = Array.from({ length: 20 }, newSetupCode);

		for (const code of codes) expect(code).toMatch(/^[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/);
		expect(new Set(codes).size).toBe(20);
	});

	it('sperrt die Einrichtung nach 5 falschen Einrichtungscodes für 15 Minuten, auch für den richtigen', async () => {
		for (let attempt = 0; attempt < 5; attempt++) await setUp({ code: 'FALS-CHER', ...account });

		const locked = await setUp({ code: CODE, ...account });

		expect(locked.status).toBe(423);
		const body = (await locked.json()) as { code: string; params: { until: string } };
		expect(body.code).toBe('SETUP_LOCKED');
		expect(new Date(body.params.until).getTime()).toBeGreaterThan(Date.now() + 14 * 60_000);
		expect(await db.select().from(localAccounts)).toEqual([]);
	});

	it('gibt den Einrichtungscode nie heraus', async () => {
		const answer = JSON.stringify(await (await app.handle(new Request('http://localhost/api/v1/setup'))).json());

		expect(answer).not.toContain(CODE);
	});

	it('legt bei gleichzeitigen Einrichtungen nur ein Konto an', async () => {
		const answers = await Promise.all(
			['a', 'b', 'c'].map((name) => setUp({ code: CODE, email: `${name}@dwello.test`, password: 'ein-langes-Passwort' }))
		);

		expect(answers.filter((answer) => answer.status === 201)).toHaveLength(1);
		expect(await db.select().from(localAccounts)).toHaveLength(1);
	});
});
