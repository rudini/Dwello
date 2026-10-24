/**
 * Contract dates may not change the rent days a stored statement of the contract bills (rental_start, rental_end)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { utilityStatements } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';
import { idOf } from './helpers/records';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;
let sent: string;
let draft: string;

async function statement(year: number) {
	return idOf(
		await sendJson('POST', '/api/v1/statements/generate', {
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: `${year}-01-01`,
			periodEnd: `${year}-12-31`
		})
	);
}

// an end before today is set as the landlord confirmed it (#788)
const end = (endDate: string | null) => sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { endDate, confirmPastEnd: true });

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2023-01-01', monthlyAdvancePayment: '100' });
	sent = await statement(2023);
	await sendJson('PUT', `/api/v1/statements/${sent}/status`, { status: 'sent' });
	draft = await statement(2024);
});

afterAll(async () => {
	await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
	await rental.remove();
});

describe('Vertragsende und Nebenkostenabrechnungen', () => {
	it('lehnt ein Vertragsende vor dem Ende eines Entwurfs ab und nennt ihn', async () => {
		const response = await end('2024-03-31');

		expect(response.status).toBe(409);
		// A-10: Periode und Gebäude, damit die UI in den Assistenten führen kann
		expect(await response.json()).toMatchObject({
			statements: [
				{ id: draft, status: 'draft', periodStart: '2024-01-01', periodEnd: '2024-12-31', buildingId: rental.building }
			]
		});
	});

	it('nennt auch eine versandte Abrechnung, die schon Mietstage nach dem Tag enthält', async () => {
		const response = await end('2023-06-30');

		expect(response.status).toBe(409);
		const { statements } = (await response.json()) as { statements: { id: string; status: string }[] };
		expect(statements.map((s) => [s.id, s.status]).sort()).toEqual(
			[
				[sent, 'sent'],
				[draft, 'draft']
			].sort()
		);
	});

	it('nimmt den letzten Tag der Abrechnung und das Aufheben des Vertragsendes an', async () => {
		expect((await end('2024-12-31')).status).toBe(200);
		expect((await end(null)).status).toBe(200);
	});
});

// #141: the draft goes in the same transaction as the change, so a refused change keeps it
describe('Entwurf löschen und Mietvertrag beenden', () => {
	let own: Awaited<ReturnType<typeof createRental>>;
	let draft2024: string;
	let draft2025: string;
	const generate = async (year: number) =>
		idOf(
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: own.contract,
				buildingId: own.building,
				periodStart: `${year}-01-01`,
				periodEnd: `${year}-12-31`
			})
		);
	const endDeleting = (statement: string) =>
		sendJson('PUT', `/api/v1/contracts/${own.contract}`, { endDate: '2024-03-31', terminated: true, confirmPastEnd: true, deleteDraft: statement });
	const exists = async (statement: string) => (await callApi(`/api/v1/statements/${statement}`)).status === 200;

	beforeAll(async () => {
		own = await createRental(crypto.randomUUID(), { startDate: '2023-01-01', monthlyAdvancePayment: '100' });
		draft2024 = await generate(2024);
		draft2025 = await generate(2025);
	});

	afterAll(async () => {
		await db.delete(utilityStatements).where(eq(utilityStatements.contractId, own.contract));
		await own.remove();
	});

	it('behält den Entwurf, wenn eine weitere Abrechnung das Vertragsende ablehnt', async () => {
		const response = await endDeleting(draft2024);

		expect(response.status).toBe(409);
		const { statements } = (await response.json()) as { statements: { id: string }[] };
		expect(statements.map((s) => s.id).sort()).toEqual([draft2024, draft2025].sort());
		expect(await exists(draft2024)).toBe(true);
		expect(((await (await callApi(`/api/v1/contracts/${own.contract}`)).json()) as { endDate: string | null }).endDate).toBeNull();
	});

	// H-28 (#717): a draft named from a stale page or another form, which this change does not touch, is refused here
	it('lehnt einen genannten Entwurf ab, den die Änderung nicht betrifft, und ändert nichts', async () => {
		const other = await createRental(crypto.randomUUID(), { startDate: '2023-01-01', monthlyAdvancePayment: '100' });
		try {
			const response = await sendJson('PUT', `/api/v1/contracts/${other.contract}`, { endDate: '2026-12-31', terminated: true, deleteDraft: draft2024 });

			expect(response.status).toBe(400);
			expect(await response.json()).toMatchObject({ code: 'CONTRACT_DRAFT_NOT_AFFECTED' });
			expect(await exists(draft2024)).toBe(true);
			expect(((await (await callApi(`/api/v1/contracts/${other.contract}`)).json()) as { endDate: string | null }).endDate).toBeNull();
		} finally {
			await other.remove();
		}
	});

	// code review h28j C-2: a draft deleted meanwhile (another tab) does not block the change, as before
	it('speichert die Änderung, wenn der genannte Entwurf inzwischen gelöscht ist', async () => {
		const other = await createRental(crypto.randomUUID(), { startDate: '2023-01-01', monthlyAdvancePayment: '100' });
		try {
			const response = await sendJson('PUT', `/api/v1/contracts/${other.contract}`, { endDate: '2026-12-31', terminated: true, deleteDraft: crypto.randomUUID() });

			expect(response.status).toBe(200);
		} finally {
			await other.remove();
		}
	});

	it('löscht den Entwurf und beendet den Mietvertrag, wenn nur er das Vertragsende ablehnt', async () => {
		await callApi(`/api/v1/statements/${draft2025}`, { method: 'DELETE' });

		const response = await endDeleting(draft2024);

		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({ endDate: '2024-03-31', terminated: true });
		expect(await exists(draft2024)).toBe(false);
	});
});

// the billed rent days, not the statement period: a contract that ended mid-year keeps its final statement
describe('Beendeter Mietvertrag mit Schlussabrechnung', () => {
	let ended: Awaited<ReturnType<typeof createRental>>;
	let final: string;
	const put = (body: object) => sendJson('PUT', `/api/v1/contracts/${ended.contract}`, { ...body, confirmPastEnd: true });

	beforeAll(async () => {
		ended = await createRental(crypto.randomUUID(), {
			startDate: '2023-01-01',
			endDate: '2025-06-30',
			monthlyAdvancePayment: '100'
		});
		final = await idOf(
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: ended.contract,
				buildingId: ended.building,
				periodStart: '2025-01-01',
				periodEnd: '2025-12-31'
			})
		);
	});

	afterAll(async () => {
		await db.delete(utilityStatements).where(eq(utilityStatements.contractId, ended.contract));
		await ended.remove();
	});

	it('lässt die Miete ändern, wenn das Vertragsende gleich bleibt', async () => {
		expect((await put({ baseRent: '980', endDate: '2025-06-30' })).status).toBe(200);
	});

	it('speichert bei der Abrechnung die abgerechneten Tage', async () => {
		const statement = await (await callApi(`/api/v1/statements/${final}`)).json();
		expect(statement).toMatchObject({ rentalStart: '2025-01-01', rentalEnd: '2025-06-30' });
	});

	// mehr Tage sind auch eine Änderung: die Abrechnung und ihr PDF zeigten sonst andere Tage als der Vertrag
	it('lehnt auch ein späteres Vertragsende ab', async () => {
		expect((await put({ endDate: '2025-07-31' })).status).toBe(409);
		expect((await put({ endDate: null })).status).toBe(409);
	});

	it('lehnt ein früheres Vertragsende ab', async () => {
		const response = await put({ endDate: '2025-05-31' });
		expect(response.status).toBe(409);
		expect(await response.json()).toMatchObject({ statements: [{ id: final }] });
	});

	// die Abrechnung rechnet ab dem 01.01.2025: ein späterer Vertragsbeginn nähme ihr Mietstage weg
	it('lehnt einen Vertragsbeginn nach dem ersten abgerechneten Tag ab', async () => {
		expect((await put({ startDate: '2025-05-01' })).status).toBe(409);
		expect((await put({ startDate: '2022-01-01' })).status).toBe(200);
	});
});

// der Vertragsbeginn lag in der Periode: auch ein früherer Beginn änderte die abgerechneten Tage
describe('Mietvertrag, der in der Periode begann', () => {
	let rental: Awaited<ReturnType<typeof createRental>>;
	const put = (body: object) => sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { ...body, confirmPastEnd: true });

	beforeAll(async () => {
		rental = await createRental(crypto.randomUUID(), { startDate: '2025-03-01', monthlyAdvancePayment: '100' });
		await sendJson('POST', '/api/v1/statements/generate', {
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: '2025-01-01',
			periodEnd: '2025-12-31'
		});
	});

	afterAll(async () => {
		await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
		await rental.remove();
	});

	it('lehnt einen früheren Vertragsbeginn ab und nimmt den gleichen an', async () => {
		expect((await put({ startDate: '2025-02-01' })).status).toBe(409);
		expect((await put({ startDate: '2025-03-01', baseRent: '990' })).status).toBe(200);
	});

	it('nimmt ein Vertragsende nach der Periode an', async () => {
		expect((await put({ endDate: '2026-03-31' })).status).toBe(200);
		expect((await put({ endDate: '2025-12-15' })).status).toBe(409);
	});
});


// A-1: an end agreed in a fixed-term contract and a notice to an open-ended one are different things
describe('Gekündigter Mietvertrag', () => {
	let rental: Awaited<ReturnType<typeof createRental>>;
	const put = (body: object) => sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { ...body, confirmPastEnd: true });
	const stored = async () => (await callApi(`/api/v1/contracts/${rental.contract}`)).json();

	beforeAll(async () => {
		rental = await createRental(crypto.randomUUID(), {
			startDate: '2024-04-01',
			endDate: '2099-12-31',
			monthlyAdvancePayment: '100'
		});
	});

	afterAll(() => rental.remove());

	it('gilt mit vereinbartem Vertragsende als befristet', async () => {
		expect(await stored()).toMatchObject({ endDate: '2099-12-31', terminated: false });
	});

	it('merkt sich die Kündigung', async () => {
		expect((await put({ endDate: '2099-03-31', terminated: true })).status).toBe(200);
		expect(await stored()).toMatchObject({ endDate: '2099-03-31', terminated: true });
	});

	it('ist nach dem Aufheben der Kündigung wieder unbefristet ohne Kündigung', async () => {
		expect((await put({ endDate: null })).status).toBe(200);
		expect(await stored()).toMatchObject({ endDate: null, terminated: false });
	});

	// J-2: eine Kündigung braucht ihren Kündigungstermin; die Datenbank meldete sonst rohes SQL
	it('lehnt eine Kündigung ohne Vertragsende verständlich ab', async () => {
		const response = await put({ terminated: true });
		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({ code: 'CONTRACT_NOTICE_WITHOUT_END' });
		expect(await stored()).toMatchObject({ endDate: null, terminated: false });
	});

	// J2-1: ohne Vertragsende gibt es keine Kündigung, auch wenn beides zugleich kommt
	it('hebt die Kündigung auf, wenn das Vertragsende entfernt wird', async () => {
		expect((await put({ endDate: '2099-03-31', terminated: true })).status).toBe(200);
		expect((await put({ endDate: null, terminated: true })).status).toBe(200);
		expect(await stored()).toMatchObject({ endDate: null, terminated: false });
	});

	// A-3 (#112): der Tag, an dem das Kündigungsschreiben ankam, gehört zur Kündigung
	it('merkt sich, wann die Kündigung eingegangen ist', async () => {
		expect((await put({ endDate: '2099-03-31', terminated: true, noticeReceivedOn: '2098-12-15' })).status).toBe(200);
		expect(await stored()).toMatchObject({ endDate: '2099-03-31', terminated: true, noticeReceivedOn: '2098-12-15' });
	});

	it('vergisst den Eingang, wenn die Kündigung aufgehoben wird', async () => {
		expect((await put({ endDate: null })).status).toBe(200);
		expect(await stored()).toMatchObject({ endDate: null, noticeReceivedOn: null });
	});

	it('vergisst den Eingang, wenn der Mietvertrag befristet wird', async () => {
		await put({ endDate: '2099-03-31', terminated: true, noticeReceivedOn: '2098-12-15' });
		expect((await put({ endDate: '2099-06-30', terminated: false })).status).toBe(200);
		expect(await stored()).toMatchObject({ endDate: '2099-06-30', terminated: false, noticeReceivedOn: null });
		await put({ endDate: null });
	});

	it('legt keinen neuen Mietvertrag mit Kündigung ohne Vertragsende an', async () => {
		const response = await sendJson('POST', '/api/v1/contracts', {
			apartmentId: rental.apartment,
			tenantId: rental.tenant,
			startDate: '2100-01-01',
			baseRent: '950',
			monthlyAdvancePayment: '100',
			terminated: true
		});
		expect(response.status).toBe(400);
		expect(await response.json()).toMatchObject({ code: 'CONTRACT_NOTICE_WITHOUT_END' });
	});
});
