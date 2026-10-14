import { execFile } from 'node:child_process';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { afterEach, describe, expect, it } from 'vitest';

const SCRIPT = fileURLToPath(new URL('./check-issues.mjs', import.meta.url));
const proposed = '## Decided\n\nNothing yet\n\n## Proposed (confirm before starting)\n\n- a';
let close = () => {};
afterEach(() => close());

/** Runs the script against a stand-in GitHub API that lists `open` and answers every single issue as open */
async function check(open: object[]) {
	const server = createServer((request, response) => {
		const url = new URL(request.url ?? '/', 'http://localhost');
		const page = Number(url.searchParams.get('page') ?? 1);
		const body = url.pathname.endsWith('/issues') ? (page === 1 ? open : []) : { state: 'open' };
		response.setHeader('content-type', 'application/json');
		response.end(JSON.stringify(body));
	});
	await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
	close = () => server.close();
	const env = {
		...process.env,
		GITHUB_TOKEN: 'test',
		GITHUB_API_URL: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
		PR_BODY: '',
		BASE_REF: ''
	};
	return promisify(execFile)('node', [SCRIPT], { env }).then(
		({ stdout }) => ({ code: 0, out: stdout }),
		(error) => ({ code: error.code as number, out: `${error.stdout}${error.stderr}` })
	);
}

describe('Issues mit Vorschlag brauchen das Label entscheiden (CLAUDE.md, Open work)', () => {
	it('meldet ein offenes Issue mit Vorschlag ohne entscheiden', async () => {
		const result = await check([{ number: 7, body: proposed, labels: [{ name: 'bug' }] }]);
		expect(result.code).toBe(1);
		expect(result.out).toContain('#7 has "Proposed (confirm before starting)" but not the label entscheiden');
	});

	it('lässt Issues mit entscheiden, ohne Vorschlag und Pull Requests durch', async () => {
		const result = await check([
			{ number: 7, body: proposed, labels: [{ name: 'entscheiden' }] },
			{ number: 8, body: 'Decided (product owner)', labels: [] },
			{ number: 9, body: proposed, labels: [], pull_request: {} },
			{ number: 10, body: null, labels: [] }
		]);
		expect(result).toMatchObject({ code: 0 });
	});
});
