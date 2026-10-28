/**
 * MCP server for AI programs (#817, ADR 0007): JSON-RPC over Streamable HTTP at /mcp, with a Zugangsschlüssel.
 * Read only: each tool calls GET routes of this API in-process, so it gets the same checks and refusals as the UI;
 * no route that returns a file. A document and every irreversible action stay in Dwello, behind the tool's link.
 */

import { Elysia } from 'elysia';
import { accessKeyToken } from '../middleware/auth';
import { keyOf } from '../services/access-key.service';
import { recordAudit } from '../services/audit-log.service';
import { refusal } from '../services/coded-error';

type Args = Record<string, string | undefined>;
type Tool = {
	description: string;
	properties: Record<string, string>;
	/** The GET paths of the API, the answers of several together under their keys */
	paths: (args: Args) => Record<string, string> | string;
	page: (args: Args) => string;
};

const APP = process.env.CORS_ORIGIN || 'http://localhost:3000'; // the web app, where the landlord opens and confirms
const VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];
const IRREVERSIBLE = 'Versenden, Anonymisieren und Löschen gehen nur in Dwello, über den Link.';

const query = (args: Args, names: string[]) => {
	const set = names.filter((name) => args[name]).map((name): [string, string] => [name, args[name]!]);
	return set.length ? `?${new URLSearchParams(set)}` : '';
};
const one = (path: string, args: Args, names: string[] = []) =>
	args.id ? `/api/v1/${path}/${encodeURIComponent(args.id)}` : `/api/v1/${path}${query(args, names)}`;
const pageOf = (path: string) => (args: Args) => `/${path}${args.id ? `/${encodeURIComponent(args.id)}` : ''}`;

// In the landlord's words (#817); the glossary terms of UBIQUITOUS_LANGUAGE.md
const TOOLS: Record<string, Tool> = {
	overview: {
		description: 'Übersicht: Zahlen, Aufgaben und Fristen, wie auf der Startseite von Dwello.',
		properties: {},
		paths: () => '/api/v1/dashboard',
		page: () => '/dashboard'
	},
	buildings: {
		description: `Gebäude: die Liste aller Gebäude, oder mit «id» ein Gebäude mit seinen Angaben. ${IRREVERSIBLE}`,
		properties: { id: 'ID eines Gebäudes', search: 'Suchbegriff im Namen oder in der Adresse' },
		paths: (args) => one('buildings', args, ['search']),
		page: pageOf('buildings')
	},
	apartments: {
		description: `Wohnungen: alle Wohnungen oder die eines Gebäudes («buildingId»), oder mit «id» eine Wohnung. ${IRREVERSIBLE}`,
		properties: { id: 'ID einer Wohnung', buildingId: 'ID des Gebäudes' },
		paths: (args) => one('apartments', args, ['buildingId']),
		page: pageOf('apartments')
	},
	tenants: {
		description: `Mieter: die Liste der Mieter, oder mit «id» ein Mieter mit Kontaktdaten. Dokumente öffnen Sie in Dwello über den Link. ${IRREVERSIBLE}`,
		properties: { id: 'ID eines Mieters', search: 'Suchbegriff im Namen' },
		paths: (args) => one('tenants', args, ['search']),
		page: pageOf('tenants')
	},
	contracts: {
		description: `Mietverträge: die Liste der Mietverträge, oder mit «id» ein Mietvertrag mit Miete, Akonto und Pauschale. ${IRREVERSIBLE}`,
		properties: { id: 'ID eines Mietvertrags', buildingId: 'ID des Gebäudes', tenantId: 'ID des Mieters' },
		paths: (args) => one('contracts', args, ['buildingId', 'tenantId']),
		page: pageOf('contracts')
	},
	invoices: {
		description: `Rechnungen nach Gebäude und Abrechnungsperiode, mit Kategorie und Umlagefähigkeit, oder mit «id» eine Rechnung. Belege öffnen Sie in Dwello über den Link. ${IRREVERSIBLE}`,
		properties: {
			id: 'ID einer Rechnung',
			buildingId: 'ID des Gebäudes',
			periodStart: 'Beginn der Abrechnungsperiode, JJJJ-MM-TT',
			periodEnd: 'Ende der Abrechnungsperiode, JJJJ-MM-TT'
		},
		paths: (args) => one('invoices', args, ['buildingId', 'periodStart', 'periodEnd']),
		page: pageOf('invoices')
	},
	statements: {
		description: `Nebenkostenabrechnungen mit Saldo, Status und Zahlungsfrist, oder mit «id» eine Abrechnung mit ihren Mahnungen und deren Mahnstufe. PDFs öffnen und Abrechnungen versenden Sie in Dwello über den Link. ${IRREVERSIBLE}`,
		properties: {
			id: 'ID einer Abrechnung',
			buildingId: 'ID des Gebäudes',
			status: 'Status: draft, sent, paid oder overdue'
		},
		paths: (args) =>
			args.id
				? { statement: one('statements', args), reminders: `/api/v1/documents${query({ statementId: args.id }, ['statementId'])}` }
				: one('statements', args, ['buildingId', 'status']),
		page: pageOf('statements')
	}
};

const toolList = Object.entries(TOOLS).map(([name, tool]) => ({
	name,
	description: tool.description,
	inputSchema: {
		type: 'object',
		properties: Object.fromEntries(Object.entries(tool.properties).map(([key, description]) => [key, { type: 'string', description }])),
		additionalProperties: false
	}
}));

// the API in-process, handed over by app.ts, which registers these routes: no import cycle
let api: (request: Request) => Promise<Response>;
export const callApiWith = (handle: typeof api) => {
	api = handle;
};

/** The tool's answer: the API's JSON and the page in Dwello, or the API's refusal as the tool's error */
async function callTool(keyId: string, tool: Tool, args: Args) {
	const paths = tool.paths(args);
	const authorization = `Bearer ${await accessKeyToken(keyId)}`;
	const get = (path: string) => api(new Request(`http://localhost${path}`, { headers: { authorization } }));
	const entries = Object.entries(typeof paths === 'string' ? { data: paths } : paths);
	const answers = await Promise.all(entries.map(([, path]) => get(path)));
	const bodies = await Promise.all(answers.map((answer) => answer.json()));
	const refused = answers.findIndex((answer) => !answer.ok);
	if (refused >= 0) return { content: [{ type: 'text', text: JSON.stringify(bodies[refused]) }], isError: true };
	const data = typeof paths === 'string' ? bodies[0] : Object.fromEntries(entries.map(([key], i) => [key, bodies[i]]));
	const result = { data, link: `${APP}${tool.page(args)}` };
	return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result, isError: false };
}

type Call = { jsonrpc?: string; id?: string | number; method?: string; params?: { name?: string; arguments?: Args; protocolVersion?: string } };

export const mcpRoutes = new Elysia().post('/mcp', async ({ headers, body, set }) => {
		const key = await keyOf(headers.authorization);
		if (typeof key === 'string') {
			set.status = 401;
			// read in the AI program, not in Dwello: it says where to get a new key (Fachprüfung 817-1 V-3)
			return refusal(
				key,
				'Dieser Zugangsschlüssel ist widerrufen oder abgelaufen. Erstellen Sie in Dwello unter «Einstellungen» › «Zugangsschlüssel für KI-Programme» einen neuen.'
			);
		}
		const { id, method, params = {} } = (body ?? {}) as Call;
		if (id === undefined) {
			set.status = 202; // a notification («initialized»): nothing to answer
			return '';
		}
		const answer = (result: object) => ({ jsonrpc: '2.0', id, result });
		const error = (code: number, message: string) => ({ jsonrpc: '2.0', id, error: { code, message } });
		if (method === 'initialize')
			return answer({
				protocolVersion: VERSIONS.includes(params.protocolVersion ?? '') ? params.protocolVersion : VERSIONS[0],
				capabilities: { tools: {} },
				serverInfo: { name: 'dwello', version: process.env.APP_VERSION || 'dev' }
			});
		if (method === 'ping') return answer({});
		if (method === 'tools/list') return answer({ tools: toolList });
		if (method !== 'tools/call') return error(-32601, `Unknown method ${method}`);
		const tool = TOOLS[params.name ?? ''];
		if (!tool) return error(-32602, `Unknown tool ${params.name}: Dwello offers only reading tools`);
		await recordAudit('mcp_call', { tool: params.name, name: key.name });
		return answer(await callTool(key.id, tool, params.arguments ?? {}));
	});
