import { execFile, execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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
async function check(
	open: object[],
	listStatus = 200,
	pull?: { number: number; body: string; cwd: string; status?: number; base?: string; issue?: object }
) {
	// the answer per path: the pull request's text, the list of open issues (one page), else an open issue
	const answer = (path: string, page: number): [number, unknown] => {
		if (pull && path.endsWith(`/pulls/${pull.number}`)) return [pull.status ?? 200, { body: pull.body }];
		if (path.endsWith('/issues')) return [listStatus, page === 1 ? open : []];
		return [200, pull?.issue ?? { state: 'open' }];
	};
	const server = createServer((request, response) => {
		const url = new URL(request.url ?? '/', 'http://localhost');
		const [status, body] = answer(url.pathname, Number(url.searchParams.get('page') ?? 1));
		response.statusCode = status;
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
		BASE_REF: pull?.base ?? ''
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

	// review rules-2026-10-23 C-3: an unreadable text must not switch the checks of the text off unseen
	it('scheitert, wenn der Text nicht lesbar ist', async () => {
		const result = await check([], 200, { number: 5, body: '', cwd: process.cwd(), status: 404 });
		expect(result.code).toBe(1);
		expect(result.out).toContain('Cannot read pull request #5 (HTTP 404)');
	});
});

const feature = `# language: de
Funktionalität: Liegenschaften

  Szenario: Liste zeigt Liegenschaften
    Angenommen eine Liegenschaft «Seeblick»
    Dann sieht der Liegenschaftsverwalter «Seeblick»

  @wip
  Szenario: Neue Anforderung
    Dann sieht der Liegenschaftsverwalter nichts
`;

/** A git repository whose `origin/main` holds `feature` and whose HEAD holds `head` in its place */
function specRepo(head: string) {
	const cwd = mkdtempSync(`${tmpdir()}/check-specs-`);
	const git = (...args: string[]) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd });
	const write = (text: string) => writeFileSync(join(cwd, 'tests/e2e/features/buildings.feature'), text);
	git('init', '-q');
	mkdirSync(join(cwd, 'tests/e2e/features'), { recursive: true });
	write(feature);
	git('add', '-A');
	git('commit', '-qm', 'base');
	git('update-ref', 'refs/remotes/origin/main', 'HEAD');
	write(head);
	git('commit', '-qam', 'head');
	return cwd;
}

const changeSpec = (head: string, body = '', issue?: object) =>
	check([], 200, { number: 5, body, cwd: specRepo(head), base: 'main', issue });

describe('Szenarien ohne @wip sind die Spezifikation (CLAUDE.md, Workflow 1)', () => {
	it('meldet eine geänderte Zeile eines Szenarios ohne @wip', async () => {
		const result = await changeSpec(feature.replace('sieht der Liegenschaftsverwalter «Seeblick»', 'sieht «Seeblick»'));
		expect(result.code).toBe(1);
		expect(result.out).toContain(
			'tests/e2e/features/buildings.feature:4 «Liste zeigt Liegenschaften» changes the specification'
		);
	});

	it('lässt neue Szenarien und Änderungen an @wip-Szenarien durch', async () => {
		const head = `${feature.replace('nichts', 'eine leere Liste')}
  Szenario: Noch eine Anforderung
    Dann sieht der Liegenschaftsverwalter «Seeblick»
`;
		expect(await changeSpec(head)).toMatchObject({ code: 0 });
	});

	it('meldet ein gelöschtes Szenario und ein nachträglich mit @wip markiertes', async () => {
		const deleted = await changeSpec(feature.replace(/ {2}Szenario: Liste[^@]*/, ''));
		expect(deleted.out).toContain('buildings.feature:4 «Liste zeigt Liegenschaften» changes the specification');
		const tagged = await changeSpec(feature.replace('  Szenario: Liste', '  @wip\n  Szenario: Liste'));
		expect(tagged.out).toContain('buildings.feature:4 «Liste zeigt Liegenschaften» changes the specification');
	});

	it('lässt eine Änderung mit Freigabe durch', async () => {
		const result = await changeSpec(feature.replace('«Seeblick»\n', '«Seeblick» und «Lindenhof»\n'), 'Spec change approved: #643');
		expect(result).toMatchObject({ code: 0 });
	});

	it('meldet eine Freigabe durch ein Issue, das noch entschieden werden muss', async () => {
		const changed = feature.replace('«Seeblick»\n', '«Seeblick» und «Lindenhof»\n');
		const deciding = { state: 'open', labels: [{ name: 'entscheiden' }] };
		const result = await changeSpec(changed, 'Spec change approved: #643', deciding);
		expect(result.code).toBe(1);
		expect(result.out).toContain('#643 does not approve a specification change: it is still labelled entscheiden');
		const declined = { state: 'closed', state_reason: 'not_planned', labels: [] };
		expect((await changeSpec(changed, 'Spec change approved: #643', declined)).out).toContain(
			'#643 does not approve a specification change: it is closed as not planned'
		);
	});
});
