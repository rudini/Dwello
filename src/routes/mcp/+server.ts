import type { RequestHandler } from './$types';

// #817, ADR 0007: only the web app has a port outside (#747), so it passes /mcp on to the backend unchanged; the
// backend checks the Zugangsschlüssel. No cookie goes along: an AI program signs in with its key only.
const MCP = `${process.env.BACKEND_URL || 'http://localhost:3001'}/mcp`;
const PASSED = ['authorization', 'content-type', 'accept', 'mcp-protocol-version'];

export const POST: RequestHandler = async ({ request }) => {
	const headers = new Headers(
		PASSED.flatMap((name) =>
			request.headers.has(name) ? [[name, request.headers.get(name)!]] : []
		) as [string, string][]
	);
	const response = await fetch(MCP, { method: 'POST', headers, body: await request.text() });
	return new Response(response.body, {
		status: response.status,
		headers: { 'content-type': response.headers.get('content-type') ?? 'application/json' }
	});
};

// Dwello sends nothing on its own (no event stream): the transport allows answering GET with 405
export const GET: RequestHandler = () =>
	new Response(null, { status: 405, headers: { allow: 'POST' } });
