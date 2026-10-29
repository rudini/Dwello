/**
 * Zugangsschlüssel für KI-Programme and the MCP server (#817): an AI program reads the landlord's data with a key
 * through the backend API alone, read only, without files (real PostgreSQL database)
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { eq, inArray } from 'drizzle-orm';
import { app } from '../app';
import { db } from '../db/connection';
import { accessKeys, documents, rentalContracts, utilityStatements } from '../db/schema';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { callApi, sendJson, signToken } from './helpers/auth';
import { idOf } from './helpers/records';
import { createRental } from './helpers/rental';

type Entry = { id: string; occurredAt: string; action: string; details: Record<string, unknown> };
type Key = { id: string; name: string; key?: string; createdAt: string; lastUsedAt: string | null; expiresOn: string; expired: boolean };

const token = crypto.randomUUID().slice(0, 8);
const buildingIds: string[] = [];
const rentals: Awaited<ReturnType<typeof createRental>>[] = [];
const today = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });
const zurichDay = (iso: string) => new Date(iso).toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });
/** The calendar day `days` after a day, as YYYY-MM-DD */
const dayAfter = (day: string, days: number) => new Date(Date.parse(`${day}T12:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);
/** Lets a key run out: its last valid day was yesterday */
const expire = (id: string) => db.update(accessKeys).set({ expiresOn: dayAfter(today(), -1) }).where(eq(accessKeys.id, id));

async function createKey(name: string): Promise<Key & { key: string }> {
	return (await sendJson('POST', '/api/v1/access-keys', { name: `${name} ${token}` })).json() as Promise<Key & { key: string }>;
}
const listKeys = async (): Promise<Key[]> => ((await (await callApi('/api/v1/access-keys')).json()) as { data: Key[] }).data;
const auditEntries = async (action: string): Promise<Entry[]> =>
	((await (await callApi('/api/v1/audit-log')).json()) as { data: Entry[] }).data.filter(
		(entry) => entry.action === action && JSON.stringify(entry.details).includes(token)
	);

/** One JSON-RPC call at /mcp with the key (or another Authorization header) */
async function mcp(key: string, method: string, params: object = {}, authorization = `Bearer ${key}`) {
	const response = await app.handle(
		new Request('http://localhost/mcp', {
			method: 'POST',
			headers: { authorization, 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
			body: JSON.stringify({ jsonrpc: '2.0', id: 7, method, params })
		})
	);
	const text = await response.text();
	return { status: response.status, body: text ? JSON.parse(text) : null };
}
const callTool = async (key: string, name: string, args: object = {}) => (await mcp(key, 'tools/call', { name, arguments: args })).body.result;
const dataOf = (result: { content: { text: string }[] }) => JSON.parse(result.content[0].text);

afterAll(async () => {
	for (const key of await listKeys()) if (key.name.includes(token)) await callApi(`/api/v1/access-keys/${key.id}`, { method: 'DELETE' });
	for (const id of buildingIds) await deleteBuilding(id);
	for (const rental of rentals) {
		const ids = db.select({ id: utilityStatements.id }).from(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
		await db.delete(documents).where(inArray(documents.statementId, ids));
		await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
		await rental.remove();
	}
	for (const entry of ((await (await callApi('/api/v1/audit-log')).json()) as { data: Entry[] }).data)
		if (JSON.stringify(entry.details).includes(token)) await callApi(`/api/v1/audit-log/${entry.id}`, { method: 'DELETE' });
});

describe('Zugangsschlüssel erstellen', () => {
	it('zeigt den Schlüssel nur beim Erstellen und speichert nur seine Prüfsumme', async () => {
		const created = await createKey('Claude Desktop Büro');
		expect(created.key).toMatch(/^dwello_[A-Za-z0-9_-]{40,}$/);

		const [row] = await db.select().from(accessKeys).where(eq(accessKeys.id, created.id));
		expect(JSON.stringify(row)).not.toContain(created.key);
		expect(JSON.stringify(row)).not.toContain(created.key.slice('dwello_'.length));
		const listed = (await listKeys()).find((key) => key.id === created.id)!;
		expect(listed).not.toHaveProperty('key');
		expect(JSON.stringify(listed)).not.toContain(row.keyHash);
	});

	// Fachprüfung 817-1 V-5: 90 Kalendertage in der Schweiz, nicht 90 × 24 Stunden
	it('listet Name, Erstellt, zuletzt benutzt und gilt bis zum Kalendertag 90 Tage nach dem Erstellen', async () => {
		const created = await createKey('Liste');
		const listed = (await listKeys()).find((key) => key.id === created.id)!;
		expect(listed.name).toBe(`Liste ${token}`);
		expect(zurichDay(listed.createdAt)).toBe(today());
		expect(listed.lastUsedAt).toBeNull();
		expect(listed.expired).toBe(false);
		expect(listed.expiresOn).toBe(dayAfter(today(), 90));
	});

	it('lässt den Schlüssel an seinem letzten Tag noch zu', async () => {
		const created = await createKey('Letzter Tag');
		await db.update(accessKeys).set({ expiresOn: today() }).where(eq(accessKeys.id, created.id));
		expect((await mcp(created.key, 'tools/list')).status).toBe(200);
	});

	it('lehnt einen leeren Namen mit einem Code ab', async () => {
		const response = await sendJson('POST', '/api/v1/access-keys', { name: '  ' });
		expect(response.status).toBe(422);
		expect(((await response.json()) as { code: string }).code).toBe('ACCESS_KEY_NAME_MISSING');
	});

	// code review 817-1 C-8: the field's limit, said as such
	it('lehnt einen Namen über 100 Zeichen mit einem eigenen Code ab', async () => {
		const response = await sendJson('POST', '/api/v1/access-keys', { name: 'x'.repeat(101) });
		expect(response.status).toBe(422);
		expect(((await response.json()) as { code: string }).code).toBe('ACCESS_KEY_NAME_TOO_LONG');
	});

	it('hält das Erstellen im Protokoll fest', async () => {
		await createKey('Protokoll');
		expect((await auditEntries('access_key_created')).map((entry) => entry.details)).toContainEqual({ name: `Protokoll ${token}` });
	});
});

describe('Zugangsschlüssel prüfen', () => {
	it('lässt den Schlüssel nur an /mcp zu, nicht an die übrige API', async () => {
		const { key } = await createKey('Nur MCP');
		const response = await app.handle(new Request('http://localhost/api/v1/buildings', { headers: { authorization: `Bearer ${key}` } }));
		expect(response.status).toBe(401);
		expect((await mcp(key, 'tools/list')).status).toBe(200);
	});

	it('lehnt an /mcp eine Sitzung, einen fehlenden und einen unbekannten Schlüssel mit einem Code ab', async () => {
		for (const authorization of [`Bearer ${await signToken()}`, '', 'Bearer dwello_unbekannt']) {
			const answer = await mcp('', 'tools/list', {}, authorization);
			expect(answer.status).toBe(401);
			expect(answer.body.code).toBe('ACCESS_KEY_INVALID');
		}
	});

	it('lehnt einen widerrufenen Schlüssel ab und hält das Widerrufen fest', async () => {
		const created = await createKey('Widerrufen');
		expect((await callApi(`/api/v1/access-keys/${created.id}`, { method: 'DELETE' })).status).toBe(200);

		expect((await listKeys()).map((key) => key.id)).not.toContain(created.id);
		const answer = await mcp(created.key, 'tools/list');
		expect(answer.status).toBe(401);
		expect(answer.body.code).toBe('ACCESS_KEY_INVALID');
		expect((await auditEntries('access_key_revoked')).map((entry) => entry.details)).toContainEqual({ name: `Widerrufen ${token}` });
	});

	it('lehnt einen abgelaufenen Schlüssel ab und hält den Ablauf einmal fest', async () => {
		const created = await createKey('Abgelaufen');
		await expire(created.id);

		const answer = await mcp(created.key, 'tools/list');
		expect(answer.status).toBe(401);
		expect(answer.body.code).toBe('ACCESS_KEY_EXPIRED');
		await mcp(created.key, 'tools/list');
		await listKeys();
		expect((await auditEntries('access_key_expired')).map((entry) => entry.details)).toEqual([{ name: `Abgelaufen ${token}` }]);
		expect((await listKeys()).find((key) => key.id === created.id)!.expired).toBe(true);
	});

	it('hält den Ablauf fest, wenn die Liste ihn zuerst sieht', async () => {
		const created = await createKey('Abgelaufen in der Liste');
		await expire(created.id);

		await listKeys();
		expect((await auditEntries('access_key_expired')).map((entry) => entry.details)).toContainEqual({
			name: `Abgelaufen in der Liste ${token}`
		});
	});

	// Fachprüfung 817-1 V-1: auch ein Schlüssel, der nie mehr benutzt wird, mit dem Zeitpunkt seines Ablaufs
	it('hält den Ablauf ohne Abruf im Protokoll fest, mit dem Beginn des Tages nach dem letzten gültigen', async () => {
		const created = await createKey('Nie mehr benutzt');
		await expire(created.id);

		const [entry] = (await auditEntries('access_key_expired')).filter((e) => e.details.name === `Nie mehr benutzt ${token}`);
		expect(zurichDay(entry.occurredAt)).toBe(today());
		expect(new Date(entry.occurredAt).toLocaleTimeString('de-CH', { timeZone: 'Europe/Zurich' })).toBe('00:00:00');
	});
});

describe('MCP-Server', () => {
	it('meldet sich als MCP-Server mit Werkzeugen', async () => {
		const { key } = await createKey('Initialisieren');
		const answer = await mcp(key, 'initialize', {
			protocolVersion: '2025-06-18',
			capabilities: {},
			clientInfo: { name: 'test', version: '1' }
		});
		expect(answer.body).toMatchObject({ jsonrpc: '2.0', id: 7, result: { protocolVersion: '2025-06-18', capabilities: { tools: {} } } });
		expect(answer.body.result.serverInfo.name).toBe('dwello');
	});

	it('nimmt die Meldung «initialized» ohne Antwort an', async () => {
		const { key } = await createKey('Initialisiert');
		const response = await app.handle(
			new Request('http://localhost/mcp', {
				method: 'POST',
				headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
				body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })
			})
		);
		expect(response.status).toBe(202);
	});

	it('bietet nur lesende Werkzeuge, jedes mit einer Beschreibung', async () => {
		const { key } = await createKey('Werkzeuge');
		const tools = (await mcp(key, 'tools/list')).body.result.tools as { name: string; description: string; inputSchema: object }[];
		expect(tools.map((tool) => tool.name).sort()).toEqual(
			['apartments', 'buildings', 'contracts', 'invoices', 'overview', 'statements', 'tenants'].sort()
		);
		for (const tool of tools) {
			expect(tool.description.length).toBeGreaterThan(20);
			expect(tool.inputSchema).toMatchObject({ type: 'object' });
		}
	});

	it('liest die Gebäude wie die API und verweist auf die Seite in Dwello', async () => {
		const { key } = await createKey('Gebäude');
		const building = await createBuilding({ name: `Lindenhof ${token}`, address: 'Weg 1', city: 'Bern', postalCode: '3000', canton: 'BE' });
		buildingIds.push(building.id);

		const list = dataOf(await callTool(key, 'buildings'));
		expect(JSON.stringify(list)).toContain(`Lindenhof ${token}`);
		const detail = dataOf(await callTool(key, 'buildings', { id: building.id }));
		const api = await (await callApi(`/api/v1/buildings/${building.id}`)).json();
		expect(detail.data).toEqual(api);
		expect(detail.link).toEndWith(`/buildings/${building.id}`);
	});

	it('hält jeden Abruf mit Werkzeug und Name des Schlüssels fest, ohne Inhalte, und merkt sich «zuletzt benutzt»', async () => {
		const created = await createKey('Abruf');
		await callTool(created.key, 'overview');

		expect((await auditEntries('mcp_call')).map((entry) => entry.details)).toContainEqual({ tool: 'overview', name: `Abruf ${token}` });
		const listed = (await listKeys()).find((key) => key.id === created.id)!;
		expect(zurichDay(listed.lastUsedAt!)).toBe(today());
	});

	it('gibt dieselbe Ablehnung wie die API für dieselbe ungültige Eingabe', async () => {
		const { key } = await createKey('Ablehnung');
		const missing = await callTool(key, 'buildings', { id: 'kein-gebaeude' });
		const api = (await (await callApi('/api/v1/buildings/kein-gebaeude')).json()) as { code: string };
		expect(missing.isError).toBe(true);
		expect(dataOf(missing).code).toBe(api.code);

		const invalid = await callTool(key, 'invoices', { periodStart: '31.12.2026', periodEnd: '2026-12-31' });
		const apiInvalid = (await (await callApi('/api/v1/invoices?periodStart=31.12.2026&periodEnd=2026-12-31')).json()) as { code: string };
		expect(invalid.isError).toBe(true);
		expect(dataOf(invalid).code).toBe(apiInvalid.code);
	});

	// code review 817-1 C-1, Fachprüfung 817-2 V-6: a list comes in pages, and the AI program turns them
	it('blättert in einer Liste mit «limit» und «offset» weiter', async () => {
		const { key } = await createKey('Blättern');
		for (const name of ['A', 'B', 'C']) buildingIds.push((await createBuilding({ name: `Blatt ${name} ${token}`, address: 'Weg 1', city: 'Bern', postalCode: '3000', canton: 'BE' })).id);

		const names = async (args: object) =>
			(dataOf(await callTool(key, 'buildings', { search: `Blatt`, ...args })).data.buildings as { name: string }[])
				.map((building) => building.name)
				.filter((name) => name.includes(token));
		const first = await names({ limit: '2' });
		const rest = await names({ limit: '2', offset: '2' });
		expect(first).toHaveLength(2);
		expect([...first, ...rest].sort()).toEqual(['A', 'B', 'C'].map((name) => `Blatt ${name} ${token}`));
		expect(dataOf(await callTool(key, 'buildings', { search: 'Blatt', limit: '2' })).data.total).toBeGreaterThanOrEqual(3);
	});

	// Fachprüfung 817-2 R-11, code review 817-1 C-7: no file goes out, also not a contract PDF the API holds
	it('gibt bei Mietverträgen kein Vertrags-PDF und keine Notizen weiter', async () => {
		const { key } = await createKey('Vertrag');
		const rental = await createRental(token, { startDate: '2025-01-01', monthlyAdvancePayment: '100' });
		rentals.push(rental);
		await db.update(rentalContracts).set({ contractPdf: 'JVBERi0xLjQK', notes: 'Notiz' }).where(eq(rentalContracts.id, rental.contract));

		const detail = dataOf(await callTool(key, 'contracts', { id: rental.contract }));
		const list = dataOf(await callTool(key, 'contracts', { tenantId: rental.tenant }));
		expect(detail.data.id).toBe(rental.contract);
		expect(JSON.stringify([detail, list])).not.toContain('JVBERi0xLjQK');
		expect(JSON.stringify([detail, list])).not.toContain('Notiz');
	});

	// code review 817-1 C-5, Fachprüfung 817-2 V-9: the statement with its documents, the sending and the reminders
	it('liest eine Abrechnung mit ihren Dokumenten wie die API', async () => {
		const { key } = await createKey('Abrechnung');
		const rental = await createRental(`${token}-a`, { startDate: '2024-01-01', monthlyAdvancePayment: '0', managementFeeAgreed: false });
		rentals.push(rental);
		const id = await idOf(
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: rental.contract,
				buildingId: rental.building,
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31'
			})
		);

		const { data, link } = dataOf(await callTool(key, 'statements', { id }));
		expect(data.statement).toEqual(await (await callApi(`/api/v1/statements/${id}`)).json());
		expect(data.documents).toEqual(await (await callApi(`/api/v1/documents?statementId=${id}`)).json());
		expect(link).toEndWith(`/statements/${id}`);
	});

	it('kennt kein Werkzeug zum Ändern oder Löschen', async () => {
		const { key } = await createKey('Kein Löschen');
		const answer = await mcp(key, 'tools/call', { name: 'delete_building', arguments: { id: crypto.randomUUID() } });
		expect(answer.body.error.code).toBe(-32602);
	});
});
