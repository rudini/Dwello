import { execFile, execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
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
async function check(open: object[], listStatus = 200, pull?: { number: number; body: string; cwd: string }) {
	const server = createServer((request, response) => {
		const url = new URL(request.url ?? '/', 'http://localhost');
		const page = Number(url.searchParams.get('page') ?? 1);
		const list = url.pathname.endsWith('/issues');
		const body = url.pathname.endsWith(`/pulls/${pull?.number}`)
			? { body: pull?.body }
			: list
				? page === 1
					? open
					: []
				: { state: 'open' };
		response.statusCode = list ? listStatus : 200;
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
		PR_NUMBER: pull ? String(pull.number) : '',
		BASE_REF: ''
	};
	return promisify(execFile)('node', [SCRIPT], { env, cwd: pull?.cwd }).then(
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
			{ number: 10, body: null, labels: [] },
			{ number: 11, body: 'Siehe Proposed (confirm before starting) in #7', labels: [] }
		]);
		expect(result).toMatchObject({ code: 0 });
	});

	it('scheitert, wenn die offenen Issues nicht lesbar sind', async () => {
		const result = await check([], 500);
		expect(result.code).toBe(1);
		expect(result.out).toContain('Cannot list open issues (HTTP 500)');
	});
});

// workflow review 2026-10-23, L6: the event carries the text from when the run started; an edited text counts at once
describe('Der Text des Pull Requests', () => {
	it('kommt aus der API, nicht aus dem Ereignis', async () => {
		const cwd = mkdtempSync(`${tmpdir()}/check-issues-`);
		mkdirSync(`${cwd}/src`);
		writeFileSync(`${cwd}/src/a.ts`, '// TODO(fachlich prüfen, #3): term\n');
		execFileSync('git', ['init', '-q', cwd]);
		execFileSync('git', ['-C', cwd, 'add', '-A']);
		const result = await check([], 200, { number: 5, body: 'Fixes #3', cwd });
		expect(result.code).toBe(1);
		expect(result.out).toContain('This pull request closes #3, but markers still name it');
	});
});
