import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { main } from '../src/cli.ts';
import { loadSchema, validate } from '../src/schema.ts';
import { DEEP_MODULE, SHALLOW_MODULE, writeProject } from './helpers.ts';

const STORE = 'export const store = new Map<string, string>();\n';

/** Runs the CLI in-process and captures its output. */
function cli(root: string, ...args: string[]) {
	let stdout = '';
	let stderr = '';
	const code = main(args, { cwd: root, env: {}, stdout: (s) => (stdout += s), stderr: (s) => (stderr += s) });
	return { code, stdout, stderr };
}

const shallowProject = () =>
	writeProject({ 'src/store.ts': STORE, 'src/shallow.ts': SHALLOW_MODULE, 'src/deep.ts': DEEP_MODULE });

describe('deepcheck scan', () => {
	it('exits 0 even when it lists shallow modules', () => {
		const result = cli(shallowProject(), 'scan', '--fallow', 'off');
		expect(result.code).toBe(0);
		expect(result.stdout).toContain('src/shallow.ts');
	});

	it('exits 1 with --fail-on-score when a listed module reaches that score', () => {
		expect(cli(shallowProject(), 'scan', '--fallow', 'off', '--fail-on-score', '50').code).toBe(1);
		expect(cli(shallowProject(), 'scan', '--fallow', 'off', '--fail-on-score', '99').code).toBe(0);
	});
});

const scanJson = (root: string, ...args: string[]) => JSON.parse(cli(root, 'scan', '--fallow', 'off', '--format', 'json', ...args).stdout);

describe('deepcheck scan output', () => {
	it('prints a JSON report of the shallow modules with a summary', () => {
		const out = scanJson(shallowProject());
		expect(out).toMatchObject({ schemaVersion: 1, tool: 'deepcheck', command: 'scan', scope: 'all', failThreshold: 65 });
		expect(out.findings.map((f: { path: string }) => f.path)).toEqual(['src/shallow.ts']);
		expect(out.summary).toEqual({ analyzed: 3, shallow: 1, shown: 1, excluded: 0, invalidSuppressions: 0 });
		expect(out.findings[0].reasons.at(-1)).toBe('Fix the design; do not pad the implementation to game the ratio.');
	});

	it('matches the shipped report schema, also with groups, warnings and invalid suppressions', () => {
		const root = writeProject({
			'tsconfig.json': '{ "extends": "./missing.json" }',
			'src/store.ts': STORE,
			'src/shallow.ts': '// deepcheck-ignore-next-line pass-through\n' + SHALLOW_MODULE
		});
		const out = scanJson(root, '--group-by', 'directory');
		expect(out.groups.length + out.warnings.length + out.suppressionFindings.length).toBe(3);
		expect(validate(out, loadSchema('report.schema.json'))).toEqual([]);
	});

	it('limits the list with --top and --min-score and to a path argument', () => {
		const root = writeProject({
			'src/store.ts': STORE,
			'src/a/shallow.ts': SHALLOW_MODULE.replace('./store', '../store'),
			'src/b/shallow.ts': SHALLOW_MODULE.replace('./store', '../store'),
			'src/clamp.ts': 'export const clamp = (v: number, lo: number, hi: number, s: number) => Math.min(hi, Math.max(lo, v)) * s;\n'
		});
		const paths = (out: { findings: { path: string }[] }) => out.findings.map((f) => f.path);
		expect(paths(scanJson(root))).toEqual(['src/a/shallow.ts', 'src/b/shallow.ts']);
		expect(paths(scanJson(root, '--top', '1'))).toEqual(['src/a/shallow.ts']);
		expect(paths(scanJson(root, 'src/b'))).toEqual(['src/b/shallow.ts']);
		expect(paths(scanJson(root, '--min-score', '0'))).toEqual(['src/a/shallow.ts', 'src/b/shallow.ts', 'src/clamp.ts']);
	});

	it('groups the list by directory', () => {
		const root = writeProject({
			'src/store.ts': STORE,
			'src/a/one.ts': SHALLOW_MODULE.replace('./store', '../store'),
			'src/a/two.ts': SHALLOW_MODULE.replace('./store', '../store'),
			'src/b/one.ts': SHALLOW_MODULE.replace('./store', '../store')
		});
		expect(scanJson(root, '--group-by', 'directory').groups).toEqual([
			{ key: 'src/a', count: 2, maxScore: expect.any(Number) },
			{ key: 'src/b', count: 1, maxScore: expect.any(Number) }
		]);
	});
});

describe('deepcheck scan formats', () => {
	it('prints each shallow module with its score, metrics and fixes for a terminal', () => {
		const { stdout } = cli(shallowProject(), 'scan', '--fallow', 'off');
		expect(stdout).toMatch(/^deepcheck: 1 shallow module\(s\) of 3 analyzed \(threshold 65\)/);
		expect(stdout).toMatch(/\n {2}\d+ {2}src\/shallow\.ts\n/);
		expect(stdout).toContain('4 pass-through(s) (getName:4, setName:7, hasName:10, deleteName:13)');
		expect(stdout).toContain('Fix the design; do not pad the implementation to game the ratio.');
	});

	it('says so when nothing is shallow', () => {
		const root = writeProject({ 'src/deep.ts': DEEP_MODULE });
		expect(cli(root, 'scan', '--fallow', 'off').stdout).toBe('deepcheck: no shallow modules among 1 analyzed (threshold 65)\n');
	});

	it('prints a markdown table with the reasons per module', () => {
		const { stdout } = cli(shallowProject(), 'scan', '--fallow', 'off', '--format', 'markdown');
		expect(stdout).toContain('| Score | Module | Interface | Statements | Pass-throughs |');
		expect(stdout).toMatch(/\| \d+ \| `src\/shallow\.ts` \| 10 \| 10 \| 4 \|/);
		expect(stdout).toContain('<details><summary><code>src/shallow.ts</code></summary>');
	});

	it('prints GitHub warning annotations and writes the step summary', () => {
		const summary = `${writeProject({})}/summary.md`;
		let stdout = '';
		main(['scan', '--fallow', 'off', '--format', 'github'], {
			cwd: shallowProject(),
			env: { GITHUB_STEP_SUMMARY: summary },
			stdout: (t) => (stdout += t),
			stderr: () => {}
		});
		expect(stdout).toMatch(/^::warning file=src\/shallow\.ts,line=1,title=Shallow module \(score \d+\)::depthRatio 1\.0/);
		expect(stdout).not.toMatch(/\n(?!$)/);
		expect(readFileSync(summary, 'utf8')).toContain('| Score | Module |');
	});

	it('writes the report to --output instead of stdout', () => {
		const file = `${writeProject({})}/report.json`;
		const result = cli(shallowProject(), 'scan', '--fallow', 'off', '--format', 'json', '--output', file);
		expect(result.stdout).toBe('');
		expect(JSON.parse(readFileSync(file, 'utf8')).summary.shallow).toBe(1);
	});
});

describe('deepcheck warnings', () => {
	it('prints accuracy warnings to stderr and includes them in JSON', () => {
		const root = writeProject({ 'tsconfig.json': '{ "extends": "./.svelte-kit/tsconfig.json" }', 'src/deep.ts': DEEP_MODULE });
		expect(cli(root, 'scan', '--fallow', 'off').stderr).toMatch(/^deepcheck: warning: tsconfig\.json: /);
		expect(scanJson(root).warnings).toEqual([expect.stringContaining('The extended config was not found')]);
	});
});

describe('scan headline with --min-score', () => {
	it('does not call modules shallow that are only above the min score', () => {
		const root = writeProject({ 'src/deep.ts': DEEP_MODULE, 'src/clamp.ts': 'export const clamp = (v: number, lo: number, hi: number, s: number) => Math.min(hi, Math.max(lo, v)) * s;\n' });
		const md = cli(root, 'scan', '--fallow', 'off', '--format', 'markdown', '--min-score', '0').stdout;
		expect(md).toMatch(/^## deepcheck: 1 module\(s\) scoring at least 0 of 2 analyzed/);
		expect(cli(root, 'scan', '--fallow', 'off', '--min-score', '0').stdout).toMatch(/^deepcheck: 1 module\(s\) scoring at least 0 of 2 analyzed/);
	});
});

describe('deepcheck --explain', () => {
	it('shows every metric, the score components and the reasons of one module', () => {
		const { code, stdout } = cli(shallowProject(), '--explain', 'src/deep.ts', '--fallow', 'off');
		expect(code).toBe(0);
		expect(stdout).toMatch(/^src\/deep\.ts: score \d+ \(not flagged, below minimum interface size, threshold 65\)/);
		for (const metric of ['interfaceSize 2', 'implementationSize', 'depthRatio', 'passThroughs 0', 'leakyExports 0', 'fanIn 0', 'complexity', 'components: depth'])
			expect(stdout).toContain(metric);
	});

	it('exits 2 for a file that is not analyzed and says why', () => {
		const root = writeProject({ 'src/index.ts': "export * from './a';\n", 'src/a.ts': DEEP_MODULE });
		const result = cli(root, '--explain', 'src/index.ts', '--fallow', 'off');
		expect(result.code).toBe(2);
		expect(result.stderr).toContain('src/index.ts is not analyzed: excluded as barrel');
	});
});

describe('deepcheck suppressions', () => {
	it('lists every suppression and marks invalid ones', () => {
		const root = writeProject({
			'src/a.ts': '// deepcheck-ignore-file -- generated facade\nexport const a = 1;\n',
			'src/b.ts': '// deepcheck-ignore-next-line pass-through\nexport const b = (x: number) => Math.abs(x);\n'
		});
		const { code, stdout } = cli(root, 'suppressions', '--fallow', 'off');
		expect(code).toBe(0);
		expect(stdout).toBe(
			'src/a.ts:1  ignore-file -- generated facade\nsrc/b.ts:1  ignore-next-line pass-through  INVALID: deepcheck-ignore-next-line needs a reason: add "-- <why this is shallow by design>"\n'
		);
	});
});

describe('review 2 regressions', () => {
	const twoDirs = () =>
		writeProject({
			'src/store.ts': STORE,
			'src/lib/shallow.ts': SHALLOW_MODULE.replace('./store', '../store'),
			'src/library/shallow.ts': SHALLOW_MODULE.replace('./store', '../store')
		});
	const paths = (out: { findings: { path: string }[] }) => out.findings.map((f) => f.path);

	it('normalizes the path argument and matches whole directory names', () => {
		const root = twoDirs();
		expect(paths(scanJson(root, 'src/lib'))).toEqual(['src/lib/shallow.ts']);
		expect(paths(scanJson(root, './src/lib/'))).toEqual(['src/lib/shallow.ts']);
		expect(paths(scanJson(root, `${root}/src/lib`))).toEqual(['src/lib/shallow.ts']);
	});

	it('exits 2 for a path that matches no source file, also with --fail-on-score', () => {
		const result = cli(twoDirs(), 'scan', '--fallow', 'off', '--fail-on-score', '0', 'src/nope');
		expect(result.code).toBe(2);
		expect(result.stderr).toContain('src/nope matches no source file');
	});

	it('exits 2 for extra arguments and a --fail-on-score outside 0..100', () => {
		expect(cli(twoDirs(), 'scan', '--fallow', 'off', 'src/lib', 'src/library').code).toBe(2);
		expect(cli(twoDirs(), 'scan', '--fallow', 'off', '--fail-on-score=500').code).toBe(2);
	});

	it('counts only the invalid suppressions inside the path', () => {
		const root = writeProject({ 'src/a/x.ts': '// deepcheck-ignore-file\nexport const x = 1;\n', 'src/b/y.ts': 'export const y = 1;\n' });
		expect(scanJson(root, 'src/b').summary.invalidSuppressions).toBe(0);
	});

	it('renders groups, the min score and the top-N note in markdown, escaping table and HTML characters', () => {
		const root = writeProject({ 'src/store.ts': STORE, 'src/a|b/<x>.ts': SHALLOW_MODULE.replace('./store', '../store'), 'src/c/y.ts': SHALLOW_MODULE.replace('./store', '../store') });
		const md = cli(root, 'scan', '--fallow', 'off', '--format', 'markdown', '--group-by', 'directory', '--top', '1').stdout;
		expect(md).toContain('| `src/a\\|b/<x>.ts` |');
		expect(md).toContain('<code>src/a|b/&lt;x&gt;.ts</code>');
		expect(md).toContain('showing the top 1');
		expect(md).toMatch(/\| Group \| Modules \| Max score \|\n\|---\|---:\|---:\|\n\| `src\/a\\|b` \| 1 \|/);
		expect(cli(root, 'scan', '--fallow', 'off', '--format', 'markdown', '--min-score', '99').stdout).toContain('No module reaches the min score of 99.');
	});

	it('escapes commas, colons and percent signs in GitHub annotation properties', () => {
		const root = writeProject({ 'src/store.ts': STORE, 'src/a,b:c%.ts': SHALLOW_MODULE });
		expect(cli(root, 'scan', '--fallow', 'off', '--format', 'github').stdout).toMatch(/^::warning file=src\/a%2Cb%3Ac%25\.ts,line=1,/);
	});

	it('resolves a relative --output against the project root', () => {
		const root = shallowProject();
		expect(cli(root, 'scan', '--fallow', 'off', '--output', 'out/report.txt').stdout).toBe('');
		expect(readFileSync(`${root}/out/report.txt`, 'utf8')).toContain('src/shallow.ts');
	});
});

describe('tool errors (G5)', () => {
	it('exits 2 with a message for an unknown option or command', () => {
		const option = cli(shallowProject(), 'scan', '--colour');
		expect(option.code).toBe(2);
		expect(option.stderr).toMatch(/deepcheck: .*--colour/);
		const command = cli(shallowProject(), 'scna');
		expect(command.code).toBe(2);
		expect(command.stderr).toMatch(/deepcheck: unknown command "scna"/);
	});

	it('exits 2 for a config error and prints a JSON error envelope with --format json', () => {
		const root = writeProject({ 'deepcheck.config.json': '{ "failTreshold": 50 }', 'src/store.ts': STORE });
		const result = cli(root, 'scan', '--fallow', 'off', '--format', 'json');
		expect(result.code).toBe(2);
		expect(JSON.parse(result.stdout)).toEqual({
			error: true,
			message: 'deepcheck.config.json: unknown key "failTreshold"',
			exitCode: 2
		});
	});

	it.each([
		['--format', 'xml', /--format must be one of human, json, markdown, github/],
		['--fail-on-score', 'high', /--fail-on-score must be a number/],
		['--top', '0', /--top must be a positive whole number/],
		['--min-score', '-5', /--min-score must be a number from 0 to 100/],
		['--group-by', 'owner', /--group-by must be one of directory, package/]
	])('exits 2 for %s %s', (option, value, message) => {
		const result = cli(shallowProject(), 'scan', '--fallow', 'off', `${option}=${value}`);
		expect(result.code).toBe(2);
		expect(result.stderr).toMatch(message);
	});
});

describe('deepcheck as a process', () => {
	const bin = fileURLToPath(new URL('../src/cli.ts', import.meta.url));
	const exec = (root: string, ...args: string[]) => spawnSync('node', [bin, ...args], { cwd: root, encoding: 'utf8' });

	it('runs from the command line with the exit code of the command', () => {
		const ok = exec(shallowProject(), 'scan', '--fallow', 'off');
		expect([ok.status, ok.stderr]).toEqual([0, '']);
		expect(ok.stdout).toContain('src/shallow.ts');
		expect(exec(shallowProject(), 'scan', '--fallow', 'off', '--fail-on-score', '50').status).toBe(1);
		expect(exec(shallowProject(), 'bogus').status).toBe(2);
	});
});
