import { execFile, execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { afterEach, describe, expect, it } from 'vitest';

const SCRIPT = fileURLToPath(new URL('./check-issues.mjs', import.meta.url));
const proposed = '## Decided\n\nNothing yet\n\n## Proposed (confirm before starting)\n\n- a';
const SECTIONS = '\n\n## Type\n\nnfr:maintainability\n\n## Decisions\n\n- A, not B: shorter\n\n## Risks\n\nNone\n';
let close = () => {};
afterEach(() => close());

/** Runs the script against a stand-in GitHub API that lists `open` and answers every single issue as open */
async function check(
	open: object[],
	listStatus = 200,
	pull?: {
		number: number;
		body: string;
		cwd: string;
		status?: number;
		base?: string;
		issue?: object;
		script?: string;
		sections?: string;
		user?: string;
		fork?: boolean;
		issueStatus?: number;
	}
) {
	// the answer per path: the pull request (its text with the required sections unless a test sets them), the list of
	// open issues (one page), else an open issue
	const answer = (path: string, page: number): [number, unknown] => {
		if (pull && path.endsWith(`/pulls/${pull.number}`)) {
			const repo = (name: string) => ({ repo: { full_name: name } });
			return [
				pull.status ?? 200,
				{
					body: `${pull.body}${pull.sections ?? SECTIONS}`,
					user: { login: pull.user ?? 'rudini' },
					head: repo(pull.fork ? 'someone/Dwello' : 'rudini/Dwello'),
					base: repo('rudini/Dwello')
				}
			];
		}
		if (path.endsWith('/issues')) return [listStatus, page === 1 ? open : []];
		return [pull?.issueStatus ?? 200, pull?.issue ?? { state: 'open' }];
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
	return promisify(execFile)('node', [pull?.script ?? SCRIPT], { env, cwd: pull?.cwd }).then(
		({ stdout }) => ({ code: 0, out: stdout }),
		(error) => ({ code: error.code as number, out: `${error.stdout}${error.stderr}` })
	);
}

describe('Issues mit Vorschlag brauchen das Label needs-decision (CLAUDE.md, Open work)', () => {
	it('meldet ein offenes Issue mit Vorschlag ohne needs-decision', async () => {
		const result = await check([{ number: 7, body: proposed, labels: [{ name: 'bug' }] }]);
		expect(result.code).toBe(1);
		expect(result.out).toContain('#7 has "Proposed (confirm before starting)" but not the label needs-decision');
	});

	it('lässt Issues mit needs-decision, ohne Vorschlag und Pull Requests durch', async () => {
		const result = await check([
			{ number: 7, body: proposed, labels: [{ name: 'needs-decision' }] },
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

  Grundlage:
    Angenommen eine Liegenschaft «Seeblick»

  Szenario: Liste zeigt Liegenschaften
    Dann sieht der Liegenschaftsverwalter «Seeblick»

  @wip
  Szenario: Neue Anforderung
    Dann sieht der Liegenschaftsverwalter nichts

  Szenariogrundriss: Suche findet <name>
    Wenn der Liegenschaftsverwalter nach "<name>" sucht
    Dann sieht der Liegenschaftsverwalter "<name>"

    Beispiele:
      | name     |
      | Seeblick |
`;

/** A git repository whose `origin/main` holds `base` and whose HEAD holds `head` in its place */
function specRepo(head: string, base = feature) {
	const cwd = mkdtempSync(`${tmpdir()}/check-specs-`);
	const git = (...args: string[]) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd });
	const write = (text: string) => writeFileSync(join(cwd, 'tests/e2e/features/buildings.feature'), text);
	git('init', '-q');
	mkdirSync(join(cwd, 'tests/e2e/features'), { recursive: true });
	write(base);
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
			'tests/e2e/features/buildings.feature:7 «Liste zeigt Liegenschaften» changes the specification'
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
		expect(deleted.out).toContain('buildings.feature:7 «Liste zeigt Liegenschaften» changes the specification');
		const tagged = await changeSpec(feature.replace('  Szenario: Liste', '  @wip\n  Szenario: Liste'));
		expect(tagged.out).toContain('buildings.feature:7 «Liste zeigt Liegenschaften» changes the specification');
	});

	it('lässt eine Änderung mit Freigabe durch', async () => {
		const result = await changeSpec(feature.replace('«Seeblick»\n', '«Seeblick» und «Lindenhof»\n'), 'Spec change approved: #643');
		expect(result).toMatchObject({ code: 0 });
	});

	it('meldet eine Freigabe durch ein Issue, das noch entschieden werden muss', async () => {
		const changed = feature.replace('«Seeblick»\n', '«Seeblick» und «Lindenhof»\n');
		const deciding = { state: 'open', labels: [{ name: 'needs-decision' }] };
		const result = await changeSpec(changed, 'Spec change approved: #643', deciding);
		expect(result.code).toBe(1);
		expect(result.out).toContain('#643 does not approve a specification change: it is still labelled needs-decision');
		const declined = { state: 'closed', state_reason: 'not_planned', labels: [] };
		expect((await changeSpec(changed, 'Spec change approved: #643', declined)).out).toContain(
			'#643 does not approve a specification change: it is closed as not planned'
		);
	});

	// review spec643-review-1 C-1: an inserted step changes the scenario or the Background it lands in
	it('meldet einen eingefügten Schritt in der Grundlage und in einem Szenario ohne @wip', async () => {
		const background = await changeSpec(feature.replace('«Seeblick»\n', '«Seeblick»\n    Und eine Liegenschaft «Lindenhof»\n'));
		expect(background.out).toContain('buildings.feature:1 «Funktionalität und Grundlage» changes the specification');
		const outline = await changeSpec(feature.replace('"<name>"\n', '"<name>"\n    Und sieht keine Fehlermeldung\n'));
		expect(outline.out).toContain('buildings.feature:14 «Suche findet <name>» changes the specification');
		const table = await changeSpec(feature.replace('sucht\n', 'sucht\n      | Ort |\n'));
		expect(table.out).toContain('buildings.feature:14 «Suche findet <name>» changes the specification');
	});

	it('lässt neue Zeilen und Blöcke unter Beispiele durch', async () => {
		expect(await changeSpec(`${feature}      | Lindenhof |\n`)).toMatchObject({ code: 0 });
		const block = `${feature}\n    # #643: ein zweiter Block\n    Beispiele:\n      | name      |\n      | Lindenhof |\n`;
		expect(await changeSpec(block)).toMatchObject({ code: 0 });
		// review spec643-review-2 C-3: a tagged block stays free, also before a scenario without @wip
		const outlineFirst = `Funktionalität: Suche\n\n${feature.slice(feature.indexOf('  Szenariogrundriss'))}\n  Szenario: Danach\n    Dann sieht er alles\n`;
		const tagged = outlineFirst.replace('| Seeblick |\n', '| Seeblick |\n\n    @wip\n    Beispiele:\n      | name |\n      | Hof  |\n');
		const cwd = specRepo(tagged, outlineFirst);
		expect(await check([], 200, { number: 5, body: '', cwd, base: 'main' })).toMatchObject({ code: 0 });
		// review spec643-review-3 C-4: a tag after the new block still belongs to the scenario below
		const retagged = specRepo(tagged.replace('| Hof  |\n', '| Hof  |\n\n  @api'), outlineFirst);
		expect((await check([], 200, { number: 5, body: '', cwd: retagged, base: 'main' })).out).toContain('«Danach» changes');
	});
});

/** A git repository whose `origin/main` holds the files `base` and whose HEAD holds `head` on top (null removes one) */
function gateRepo(head: Record<string, string | null>, base: Record<string, string> = { 'README.md': 'base\n' }) {
	const cwd = mkdtempSync(`${tmpdir()}/check-gates-`);
	const git = (...args: string[]) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd });
	const write = (files: Record<string, string | null>) => {
		for (const [file, text] of Object.entries(files)) {
			if (text === null) git('rm', '-q', file);
			else {
				mkdirSync(join(cwd, file, '..'), { recursive: true });
				writeFileSync(join(cwd, file), text);
			}
		}
		git('add', '-A');
	};
	git('init', '-q');
	write(base);
	git('commit', '-qm', 'base');
	git('update-ref', 'refs/remotes/origin/main', 'HEAD');
	write(head);
	git('commit', '-qm', 'head');
	return cwd;
}

const changeGate = (head: Record<string, string | null>, body = '', base?: Record<string, string>, issue?: object) =>
	check([], 200, { number: 5, body, cwd: gateRepo(head, base), base: 'main', issue });

describe('Änderungen an Prüfungen brauchen eine Freigabe (#1269)', () => {
	it.each([
		'.github/workflows/ci.yml',
		'tools/fitness/fitness.ts',
		'.claude/hooks/commit-msg-gate.mjs',
		'.claude/skills/tdd/SKILL.md',
		'CLAUDE.md',
		'backend/CLAUDE.md',
		'.fallowrc.json',
		'deepcheck.config.json',
		'.deepcheck-baseline.json',
		'.testcheck-baseline.json',
		'vitest.config.ts',
		'backend/scripts/coverage-check.ts'
	])('meldet eine Änderung an %s ohne Freigabe', async (file) => {
		const result = await changeGate({ [file]: 'changed\n' });
		expect(result.code).toBe(1);
		expect(result.out).toContain(`${file} changes a check; ask the product owner and say "Gate change approved: #<issue>"`);
	});

	it('lässt eine Änderung mit Freigabe und Änderungen an anderen Dateien durch', async () => {
		expect(await changeGate({ 'tools/fitness/fitness.ts': 'changed\n' }, 'Gate change approved: #1269')).toMatchObject({ code: 0 });
		expect(await changeGate({ 'src/lib/a.ts': 'a\n', 'docs/CLAUDE-notes.md': 'b\n' })).toMatchObject({ code: 0 });
	});

	it('meldet eine gelöschte und eine umbenannte Prüfdatei', async () => {
		const base = { 'tools/a.ts': 'one\ntwo\nthree\n', '.fallowrc.json': '{}\n' };
		const result = await changeGate({ 'tools/a.ts': null, 'lib/a.ts': 'one\ntwo\nthree\n', '.fallowrc.json': null }, '', base);
		expect(result.out).toContain('tools/a.ts changes a check');
		expect(result.out).toContain('.fallowrc.json changes a check');
	});

	it('meldet eine Freigabe durch ein Issue, das noch entschieden werden muss', async () => {
		const deciding = { state: 'open', labels: [{ name: 'needs-decision' }] };
		const result = await changeGate({ 'CLAUDE.md': 'changed\n' }, 'Gate change approved: #1269', undefined, deciding);
		expect(result.code).toBe(1);
		expect(result.out).toContain('#1269 does not approve a gate change: it is still labelled needs-decision');
	});
});

describe('Skripte der Pakete und die Backend-Testkonfiguration sind Prüfdateien (#1269)', () => {
	const manifest = (scripts: object, devDependencies: object = { vitest: '4.0.0' }) =>
		`${JSON.stringify({ name: 'dwello', scripts, devDependencies }, null, '\t')}\n`;
	const scripts = { 'testcheck:ci': 'bun tools/testcheck/src/cli.ts --ci', test: 'bun test --coverage && bun scripts/coverage-check.ts' };

	it.each(['package.json', 'backend/package.json'])('meldet geänderte Skripte in %s', async (file) => {
		const head = { [file]: manifest({ ...scripts, 'testcheck:ci': 'true' }) };
		const result = await changeGate(head, '', { [file]: manifest(scripts) });
		expect(result.code).toBe(1);
		expect(result.out).toContain(`${file} changes a check`);
	});

	it('lässt geänderte Abhängigkeiten ohne Freigabe durch', async () => {
		const head = { 'package.json': manifest(scripts, { vitest: '4.1.0', playwright: '1.60.0' }) };
		expect(await changeGate(head, '', { 'package.json': manifest(scripts) })).toMatchObject({ code: 0 });
	});

	// review 1269b-review-1 C-1: a manifest the check cannot read, or one deleted with its scripts, counts too
	it('meldet ein unlesbares und ein gelöschtes Paket', async () => {
		const unreadable = await changeGate({ 'package.json': '{ "scripts": ' }, '', { 'package.json': manifest(scripts) });
		expect(unreadable.out).toContain('package.json changes a check');
		const deleted = await changeGate({ 'backend/package.json': null }, '', { 'backend/package.json': manifest(scripts) });
		expect(deleted.out).toContain('backend/package.json changes a check');
	});

	it('meldet jede Änderung an backend/bunfig.toml', async () => {
		const result = await changeGate({ 'backend/bunfig.toml': '[test]\ncoverageSkipTestFiles = false\n' });
		expect(result.out).toContain('backend/bunfig.toml changes a check');
	});
});

describe('Coverage-Untergrenzen sinken nie (#1269)', () => {
	const floors = {
		'vitest.config.ts': 'coverage: { thresholds: { statements: 71, branches: 60, functions: 76, lines: 66 } }\n',
		'backend/scripts/coverage-check.ts': 'const MINIMUM = { lines: 82, functions: 85 };\n'
	};
	const approved = 'Gate change approved: #1269';

	it('meldet eine gesenkte Untergrenze im Frontend und im Backend auch mit Freigabe', async () => {
		const head = {
			'vitest.config.ts': floors['vitest.config.ts'].replace('branches: 60', 'branches: 59.5'),
			'backend/scripts/coverage-check.ts': 'const MINIMUM = { lines: 82 };\n'
		};
		const result = await changeGate(head, approved, floors);
		expect(result.code).toBe(1);
		expect(result.out).toContain('vitest.config.ts lowers the coverage floor branches from 60 to 59.5');
		expect(result.out).toContain('backend/scripts/coverage-check.ts lowers the coverage floor functions from 85 to none');
	});

	// fallback review of #1357: a floor written as an expression must not read as its leading digits
	it.each(['60e-1', '60 - 1', '60 * 0.9'])('meldet eine Untergrenze, die als %s geschrieben ist', async (value) => {
		const head = { 'vitest.config.ts': floors['vitest.config.ts'].replace('branches: 60', `branches: ${value}`) };
		expect((await changeGate(head, approved, floors)).out).toContain('lowers the coverage floor branches from 60 to');
	});

	it('lässt eine gehobene Untergrenze mit Freigabe durch', async () => {
		const head = { 'vitest.config.ts': floors['vitest.config.ts'].replace('lines: 66', 'lines: 70') };
		expect(await changeGate(head, approved, floors)).toMatchObject({ code: 0 });
	});
});

describe('Geänderte Schrittdefinitionen sind eine Änderung der Spezifikation (#1270)', () => {
	const steps = `import { createBdd } from 'playwright-bdd';
const { Given, When, Then } = createBdd(test);

Given('eine Liegenschaft {string}', async ({ verwalter }, name: string) => {
	await verwalter.creates(name);
});

Then(
	/^sieht der Liegenschaftsverwalter "([^"]+)"$/,
	async ({ verwalter }, name: string) => {
		await verwalter.sees(name);
	}
);

Then('sieht der Liegenschaftsverwalter nichts', async ({ verwalter }) => {
	await verwalter.seesNothing();
});
`;
	const usage = `Funktionalität: Liegenschaften

  Szenario: Liste zeigt Liegenschaften
    Angenommen eine Liegenschaft "Seeblick"
    Dann sieht der Liegenschaftsverwalter "Seeblick"

  @wip
  Szenario: Neue Anforderung
    Dann sieht der Liegenschaftsverwalter nichts
`;
	const base = { 'tests/e2e/steps/buildings.steps.ts': steps, 'tests/e2e/features/buildings.feature': usage };
	const changeSteps = (text: string, body = '') =>
		changeGate({ 'tests/e2e/steps/buildings.steps.ts': text }, body, base);

	it('meldet einen geänderten Schritt, den ein Szenario ohne @wip braucht, mit Schritt und Szenario', async () => {
		const result = await changeSteps(steps.replace('verwalter.sees(name)', 'verwalter.seesSomething()'));
		expect(result.code).toBe(1);
		expect(result.out).toContain('tests/e2e/steps/buildings.steps.ts:8 step «/^sieht der Liegenschaftsverwalter "([^"]+)"$/»');
		expect(result.out).toContain('used by tests/e2e/features/buildings.feature:3 «Liste zeigt Liegenschaften»');
		expect(result.out).toContain('changes the specification');
	});

	it('lässt denselben Schritt mit Freigabe durch', async () => {
		const changed = steps.replace('verwalter.sees(name)', 'verwalter.seesSomething()');
		expect(await changeSteps(changed, 'Spec change approved: #1270')).toMatchObject({ code: 0 });
	});

	it('lässt einen Schritt durch, den nur Szenarien mit @wip brauchen', async () => {
		expect(await changeSteps(steps.replace('seesNothing()', 'seesAnything()'))).toMatchObject({ code: 0 });
	});

	it('lässt einen neuen Schritt und Änderungen ausserhalb der Schritte durch', async () => {
		const added = `${steps}\nWhen('der Liegenschaftsverwalter sucht', async ({ verwalter }) => {\n\tawait verwalter.searches();\n});\n`;
		expect(await changeSteps(added.replace("from 'playwright-bdd';", "from 'playwright-bdd';\n// a note"))).toMatchObject({
			code: 0
		});
	});

	it('meldet einen gelöschten Schritt und einen eingefügten Befehl, auch in der Grundlage', async () => {
		const removed = await changeSteps(steps.replace(/Given\('eine Liegenschaft[^]*?\n\}\);\n/, ''));
		expect(removed.out).toContain('buildings.steps.ts:4 step «eine Liegenschaft {string}», used by');
		const background = usage.replace('  Szenario: Liste', '  Grundlage:\n    Angenommen eine Liegenschaft "Lindenhof"\n\n  Szenario: Liste');
		const cwd = gateRepo(
			{ 'tests/e2e/steps/buildings.steps.ts': steps.replace('\tawait verwalter.creates(name);\n', '\tawait verwalter.creates(name);\n\treturn;\n') },
			{ ...base, 'tests/e2e/features/buildings.feature': background }
		);
		const inserted = await check([], 200, { number: 5, body: '', cwd, base: 'main' });
		expect(inserted.out).toContain('buildings.steps.ts:4 step «eine Liegenschaft {string}», used by');
		expect(inserted.out).toContain('buildings.feature:1 «Funktionalität und Grundlage»');
	});

	it('meldet einen Schritt, den ein Szenariogrundriss mit Platzhaltern braucht', async () => {
		const period = "Given(/^das Gebäude rechnet (\\d{4}) ab$/, async ({ verwalter }, year: string) => {\n\tawait verwalter.bills(year);\n});\n";
		const outline = `${usage}\n  Szenariogrundriss: Abrechnung <Periode>\n    Angenommen das Gebäude rechnet <Periode> ab\n\n    Beispiele:\n      | Periode |\n      | 2025    |\n`;
		const cwd = gateRepo(
			{ 'tests/e2e/steps/buildings.steps.ts': `${steps}\n${period.replace('bills(year)', 'bills(2024)')}` },
			{ 'tests/e2e/steps/buildings.steps.ts': `${steps}\n${period}`, 'tests/e2e/features/buildings.feature': outline }
		);
		const result = await check([], 200, { number: 5, body: '', cwd, base: 'main' });
		expect(result.out).toContain('used by tests/e2e/features/buildings.feature:11 «Abrechnung <Periode>»');
	});

	// review 1270-review-1 C-1: a step defined in a loop over its patterns
	it('meldet einen Schritt aus einer Schleife, den ein Szenario ohne @wip braucht', async () => {
		const loop = "for (const step of ['sieht der Liegenschaftsverwalter nichts', 'sieht der Liegenschaftsverwalter {string}'])\n\tThen(step, async ({ verwalter }) => {\n\t\tawait verwalter.seesNothing();\n\t});\n";
		const before = `${steps}\n${loop}\nThen('danach', async () => {});\n`;
		const cwd = gateRepo({ 'tests/e2e/steps/buildings.steps.ts': before.replace('\t\tawait verwalter.seesNothing();\n\t', '\t') }, { ...base, 'tests/e2e/steps/buildings.steps.ts': before });
		const result = await check([], 200, { number: 5, body: '', cwd, base: 'main' });
		expect(result.out).toContain('buildings.steps.ts:19 step «sieht der Liegenschaftsverwalter nichts | sieht der Liegenschaftsverwalter {string}», used by');
		expect(result.out).toContain('buildings.feature:3 «Liste zeigt Liegenschaften»');
	});

	// review 1270-review-1 C-2: a step added right after a used one leaves that one unchanged
	it('lässt einen neuen Schritt direkt nach einem gebrauchten durch', async () => {
		const added = steps.replace("\tawait verwalter.creates(name);\n});\n", "\tawait verwalter.creates(name);\n});\nWhen('neu', async () => {});\n");
		expect(await changeSteps(added)).toMatchObject({ code: 0 });
	});

	// review 1270-review-1 C-3: CI runs a copy from outside the repository, which finds the package from the repository
	it('liest Cucumber-Ausdrücke auch aus einer Kopie ausserhalb des Repositorys', async () => {
		const cwd = gateRepo({ 'tests/e2e/steps/buildings.steps.ts': steps.replace('creates(name)', 'creates()') }, base);
		symlinkSync(join(process.cwd(), 'node_modules'), join(cwd, 'node_modules'));
		const script = join(mkdtempSync(`${tmpdir()}/check-copy-`), 'check-issues.mjs');
		copyFileSync(SCRIPT, script);
		const result = await check([], 200, { number: 5, body: '', cwd, base: 'main', script });
		expect(result.out).toContain('buildings.steps.ts:4 step «eine Liegenschaft {string}», used by');
	});

	// review 1270-review-2 C-1: a loop whose list spans several lines
	it('meldet einen gelöschten Schritt aus der mehrzeiligen Liste einer Schleife', async () => {
		const loop = "for (const [step, question] of [\n\t['sieht der Liegenschaftsverwalter {string}', listed],\n\t['sieht der Liegenschaftsverwalter nichts', empty]\n] as const)\n\tThen(step, async ({ verwalter }) => {\n\t\tawait verwalter.sees(question);\n\t});\n";
		const before = `${steps}\n${loop}`;
		const cwd = gateRepo(
			{ 'tests/e2e/steps/buildings.steps.ts': before.replace("\t['sieht der Liegenschaftsverwalter {string}', listed],\n", '') },
			{ ...base, 'tests/e2e/steps/buildings.steps.ts': before }
		);
		const result = await check([], 200, { number: 5, body: '', cwd, base: 'main' });
		expect(result.code).toBe(1);
		expect(result.out).toContain('buildings.steps.ts:19 step «sieht der Liegenschaftsverwalter {string} | sieht der Liegenschaftsverwalter nichts», used by');
		expect(result.out).toContain('buildings.feature:3 «Liste zeigt Liegenschaften»');
	});

	// fallback review of #1365: a parameter type the check does not know matches every step instead of stopping the check
	it('meldet einen Schritt mit unbekanntem Parametertyp mit Schritt und Szenario', async () => {
		const custom = steps.replace("Given('eine Liegenschaft {string}'", "Given('eine Liegenschaft {liegenschaft}'");
		const cwd = gateRepo({ 'tests/e2e/steps/buildings.steps.ts': custom.replace('creates(name)', 'creates()') }, { ...base, 'tests/e2e/steps/buildings.steps.ts': custom });
		const result = await check([], 200, { number: 5, body: '', cwd, base: 'main' });
		expect(result.code).toBe(1);
		expect(result.out).toContain('buildings.steps.ts:4 step «eine Liegenschaft {liegenschaft}», used by tests/e2e/features/buildings.feature:3');
	});
});

describe('Der Text des Pull Requests nennt Typ, Entscheide und Risiken (#1271)', () => {
	const own = (sections: string, extra: object = {}) =>
		check([], 200, { number: 5, body: 'Refs #1271', cwd: process.cwd(), sections, ...extra });
	const sections = (type: string, decisions = '- A, not B: shorter', risks = 'None') =>
		`\n\n## Type\n\n${type}\n\n## Decisions\n\n${decisions}\n\n## Risks\n\n${risks}\n`;

	it('lässt einen eigenen Pull Request mit allen Abschnitten durch', async () => {
		expect(await own(sections('bug'))).toMatchObject({ code: 0 });
	});

	it('meldet einen fehlenden Abschnitt', async () => {
		const result = await own(sections('bug').replace(/## Risks[^]*/, ''));
		expect(result.code).toBe(1);
		expect(result.out).toContain('The pull request text lacks the section «Risks»');
	});

	it('meldet einen leeren Abschnitt, auch wenn nur der Hinweis der Vorlage drin steht', async () => {
		const result = await own(sections('bug', '<!-- decision, rejected alternative, reason -->'));
		expect(result.code).toBe(1);
		expect(result.out).toContain('The section «Decisions» of the pull request text is empty');
	});

	it('meldet einen Typ, der keine Kategorie nennt', async () => {
		const result = await own(sections('a refactoring'));
		expect(result.out).toContain('«Type» names none of domain, product, bug or an nfr: category');
	});

	// review 1271-review-1 C-1: one category, so the order of words cannot decide whether a fork's Type matches
	it('meldet einen Typ mit mehr als einer Kategorie', async () => {
		const result = await own(sections('bug, nfr:security'));
		expect(result.code).toBe(1);
		expect(result.out).toContain('«Type» names more than one category: bug, nfr:security');
		// review 1271-review-2 C-4: a fork with such a Type gets that message only, not one claiming Type names nothing
		const forked = await check([], 200, { number: 5, body: 'Closes #7', cwd: process.cwd(), sections: sections('bug, nfr:security'), fork: true, issue: { state: 'open', labels: [{ name: 'bug' }] } });
		expect(forked.out).toContain('«Type» names more than one category');
		expect(forked.out).not.toContain('says nothing');
	});

	it('lässt Pull Requests von Dependabot ohne Abschnitte durch', async () => {
		expect(await own('', { user: 'dependabot[bot]' })).toMatchObject({ code: 0 });
	});

	const fork = (body: string, issue: object, type = 'bug') =>
		check([], 200, { number: 5, body, cwd: process.cwd(), sections: sections(type), fork: true, issue });
	const ready = { state: 'open', labels: [{ name: 'bug' }] };

	it('meldet einen Fork, der kein Issue schliesst, und einen, dessen Issue nicht bereit ist', async () => {
		expect((await fork('Refs #7', ready)).out).toContain('A pull request from a fork closes an issue (Closes #<n>)');
		const deciding = { state: 'open', labels: [{ name: 'bug' }, { name: 'needs-decision' }] };
		expect((await fork('Closes #7', deciding)).out).toContain('#7 is not ready: it is labelled needs-decision');
		const closed = { state: 'closed', labels: [{ name: 'bug' }] };
		expect((await fork('Closes #7', closed)).out).toContain('#7 is not ready: it is closed');
		const two = { state: 'open', labels: [{ name: 'bug' }, { name: 'nfr:security' }] };
		expect((await fork('Closes #7', two)).out).toContain('#7 is not ready: it has 2 type labels, not one');
		// review 1271-review-1 C-2, C-3: a pull request is no issue, and a missing issue is named
		const pr = { state: 'open', labels: [{ name: 'bug' }], pull_request: {} };
		expect((await fork('Closes #7', pr)).out).toContain('#7 is not ready: it is a pull request');
		const missing = await check([], 200, { number: 5, body: 'Closes #7', cwd: process.cwd(), sections: sections('bug'), fork: true, issueStatus: 404, issue: {} });
		expect(missing.out).toContain('#7 is not ready: it is missing (HTTP 404)');
	});

	it('meldet einen Fork, dessen Typ nicht zum Label des Issues passt, und lässt den passenden durch', async () => {
		const result = await fork('Closes #7', ready, 'nfr:usability');
		expect(result.code).toBe(1);
		expect(result.out).toContain('«Type» says nfr:usability, but #7 is labelled bug');
		expect(await fork('Closes #7', ready)).toMatchObject({ code: 0 });
	});
});

// the template's sections are the ones the check asks for: a text left as the template is red for being empty
it('meldet die leeren Abschnitte der Vorlage', async () => {
	const template = readFileSync(fileURLToPath(new URL('../../.github/pull_request_template.md', import.meta.url)), 'utf8');
	const result = await check([], 200, { number: 5, body: template, cwd: process.cwd(), sections: '' });
	for (const name of ['Type', 'Decisions', 'Risks'])
		expect(result.out).toContain(`The section «${name}» of the pull request text is empty`);
});
