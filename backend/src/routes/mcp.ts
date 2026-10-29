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
	/** Fields of the answer that do not go out: a file the API holds (no files over the MCP, #817) */
	omit?: string[];
};

const APP = process.env.CORS_ORIGIN || 'http://localhost:3000'; // the web app, where the landlord opens and confirms
const VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];
const IRREVERSIBLE = 'Versenden, Anonymisieren und Löschen gehen nur in Dwello, über den Link.';
// a list comes in pages, as the API gives it; «total» in the answer says how many there are (code review 817-1 C-1)
// Fachprüfung 817-3 V-12: wording of the review, so a sum is taken over every page
const PAGES =
	'Eine Liste kommt seitenweise: ohne «limit» höchstens 20 Einträge (Wohnungen, Mieter, Mietverträge: 50) ab «offset». «total» nennt, wie viele es gibt; ist «total» grösser, holen Sie die nächsten mit «offset», bevor Sie zählen oder summieren.';
const PAGE = { limit: 'Wie viele Einträge diese Seite hat', offset: 'Ab welchem Eintrag, 0 für den ersten' };
const PAGED = ['limit', 'offset'];

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
		description: `Gebäude: die Liste der Gebäude, oder mit «id» ein Gebäude mit seinen Angaben. ${PAGES} ${IRREVERSIBLE}`,
		properties: { id: 'ID eines Gebäudes', search: 'Suchbegriff im Namen oder in der Adresse', ...PAGE },
		paths: (args) => one('buildings', args, ['search', ...PAGED]),
		page: pageOf('buildings')
	},
	apartments: {
		description: `Wohnungen: die Liste der Wohnungen, auch die eines Gebäudes («buildingId»), oder mit «id» eine Wohnung. ${PAGES} ${IRREVERSIBLE}`,
		properties: { id: 'ID einer Wohnung', buildingId: 'ID des Gebäudes', ...PAGE },
		paths: (args) => one('apartments', args, ['buildingId', ...PAGED]),
		page: pageOf('apartments')
	},
	tenants: {
		description: `Mieter: die Liste der Mieter, oder mit «id» ein Mieter mit Kontaktdaten. Dokumente öffnen Sie in Dwello über den Link. ${PAGES} ${IRREVERSIBLE}`,
		properties: { id: 'ID eines Mieters', search: 'Suchbegriff im Namen', ...PAGE },
		paths: (args) => one('tenants', args, ['search', ...PAGED]),
		page: pageOf('tenants')
	},
	contracts: {
		description: `Mietverträge: die Liste der Mietverträge, oder mit «id» ein Mietvertrag mit Nettomiete, Akonto und Nebenkostenpauschale. ${PAGES} ${IRREVERSIBLE}`,
		properties: { id: 'ID eines Mietvertrags', buildingId: 'ID des Gebäudes', tenantId: 'ID des Mieters', ...PAGE },
		paths: (args) => one('contracts', args, ['buildingId', 'tenantId', ...PAGED]),
		page: pageOf('contracts'),
		// the API still holds a contract PDF and notes the UI never writes (Fachprüfung 817-2 R-11)
		omit: ['contractPdf', 'notes']
	},
	invoices: {
		description: `Rechnungen nach Gebäude und Abrechnungsperiode, mit Kategorie und Umlagefähigkeit, oder mit «id» eine Rechnung. Belege öffnen Sie in Dwello über den Link. ${PAGES} ${IRREVERSIBLE}`,
		properties: {
			id: 'ID einer Rechnung',
			buildingId: 'ID des Gebäudes',
			periodStart: 'Beginn der Abrechnungsperiode, JJJJ-MM-TT',
			periodEnd: 'Ende der Abrechnungsperiode, JJJJ-MM-TT',
			...PAGE
		},
		paths: (args) => one('invoices', args, ['buildingId', 'periodStart', 'periodEnd', ...PAGED]),
		page: pageOf('invoices')
	},
	statements: {
		description: `Nebenkostenabrechnungen mit Saldo, Status und Zahlungsfrist, oder mit «id» eine Abrechnung mit ihrem Versand und ihren Mahnungen mit Mahnstufe («documents»). PDFs öffnen und Abrechnungen versenden Sie in Dwello über den Link. ${PAGES} ${IRREVERSIBLE}`,
		properties: {
			id: 'ID einer Abrechnung',
			buildingId: 'ID des Gebäudes',
			status: 'Status: draft (Entwurf), sent (Versendet), paid (Bezahlt), settled (Erledigt), overdue (Überfällig) oder replaced (Ersetzt)',
			...PAGE
		},
		paths: (args) =>
			args.id
				? { statement: one('statements', args), documents: `/api/v1/documents${query({ statementId: args.id }, ['statementId'])}` }
				: one('statements', args, ['buildingId', 'status', ...PAGED]),
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
	const answer = typeof paths === 'string' ? bodies[0] : Object.fromEntries(entries.map(([key], i) => [key, bodies[i]]));
	const data = tool.omit ? JSON.parse(JSON.stringify(answer), (key, value) => (tool.omit!.includes(key) ? undefined : value)) : answer;
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
				'Dieser Zugangsschlüssel ist ungültig, widerrufen oder abgelaufen. Erstellen Sie in Dwello unter «Einstellungen» › «Zugangsschlüssel für KI-Programme» einen neuen.'
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
