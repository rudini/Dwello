import { chmodSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { main } from '../src/cli.ts';
import { loadSchema, validate } from '../src/schema.ts';
import { DEEP_MODULE, SHALLOW_MODULE, commitAll, git, removeFile, writeFiles, writeProject, writeRepo } from './helpers.ts';

const STORE = 'export const store = new Map<string, string>();\n';

function cli(root: string, ...args: string[]) {
	let stdout = '';
	let stderr = '';
	const code = main(args, { cwd: root, env: {}, stdout: (s) => (stdout += s), stderr: (s) => (stderr += s) });
	return { code, stdout, stderr };
}

describe('deepcheck check (changed scope)', () => {
	it('G1: fails with exit 1 and an actionable message when a new shallow module is added', () => {
		const root = writeRepo({ 'src/store.ts': STORE, 'src/deep.ts': DEEP_MODULE });
		writeFiles(root, { 'src/shallow.ts': SHALLOW_MODULE });
		const result = cli(root, 'check', '--fallow', 'off');
		expect(result.code).toBe(1);
		expect(result.stdout).toMatch(/^deepcheck: 1 changed module\(s\) fail the deep-module gate/);
		expect(result.stdout).toContain('G1 new shallow module');
		expect(result.stdout).toContain('src/shallow.ts');
		expect(result.stdout).toContain('pass-through');
		expect(result.stdout).toContain('Fix the design; do not pad the implementation to game the ratio.');
	});

	it('agent mode is silent when the changed modules pass', () => {
		const root = writeRepo({ 'src/store.ts': STORE });
		writeFiles(root, { 'src/deep.ts': DEEP_MODULE });
		expect(cli(root, 'check', '--fallow', 'off', '--agent')).toEqual({ code: 0, stdout: '', stderr: '' });
	});

	it('agent mode shows the top failures first, capped at 3', () => {
		const root = writeRepo({ 'src/store.ts': STORE });
		writeFiles(root, Object.fromEntries([1, 2, 3, 4, 5].map((i) => [`src/s${i}.ts`, SHALLOW_MODULE])));
		const { code, stdout } = cli(root, 'check', '--fallow', 'off', '--agent');
		expect(code).toBe(1);
		expect(stdout.match(/G1 new shallow module/g)).toHaveLength(3);
		expect(stdout).toContain('... and 2 more: run deepcheck check for all');
	});
});

describe('gates end to end', () => {
	const LOW_THRESHOLD = JSON.stringify({ failThreshold: 50, tolerance: 5 });

	it('G2: a baselined module that got shallower by more than the tolerance fails', () => {
		const root = writeRepo({ 'deepcheck.config.json': LOW_THRESHOLD, 'src/store.ts': STORE, 'src/shallow.ts': SHALLOW_MODULE + DEEP_MODULE });
		cli(root, 'baseline', '--fallow', 'off');
		commitAll(root, 'baseline');
		writeFiles(root, { 'src/shallow.ts': SHALLOW_MODULE });
		const result = cli(root, 'check', '--fallow', 'off');
		expect(result.code).toBe(1);
		expect(result.stdout).toMatch(/G2 worsened from 55 to \d+ \(more than the tolerance of 5\)/);
	});

	it('G3: a baselined module that did not worsen and an untouched legacy module pass, and scan still lists them', () => {
		const root = writeRepo({ 'deepcheck.config.json': LOW_THRESHOLD, 'src/store.ts': STORE, 'src/shallow.ts': SHALLOW_MODULE, 'src/legacy.ts': SHALLOW_MODULE });
		cli(root, 'baseline', '--fallow', 'off');
		const baseline = JSON.parse(readFileSync(`${root}/.deepcheck-baseline.json`, 'utf8'));
		baseline.entries = baseline.entries.filter((e: { path: string }) => e.path === 'src/shallow.ts');
		writeFiles(root, { '.deepcheck-baseline.json': JSON.stringify(baseline) });
		commitAll(root, 'baseline without the legacy module');
		writeFiles(root, { 'src/shallow.ts': `${SHALLOW_MODULE}// touched\n` });
		expect(cli(root, 'check', '--fallow', 'off').code).toBe(0);
		expect(cli(root, 'scan', '--fallow', 'off').stdout).toContain('src/legacy.ts');
	});

	it('a renamed baselined module keeps its baseline entry', () => {
		const root = writeRepo({ 'src/store.ts': STORE, 'src/shallow.ts': SHALLOW_MODULE });
		cli(root, 'baseline', '--fallow', 'off');
		commitAll(root, 'baseline');
		git(root, 'mv', 'src/shallow.ts', 'src/names.ts');
		expect(cli(root, 'check', '--fallow', 'off').code).toBe(0);
	});
});

describe('CI mode', () => {
	const featureBranch = () => {
		const root = writeRepo({ 'src/store.ts': STORE, 'src/deep.ts': DEEP_MODULE });
		git(root, 'checkout', '-q', '-b', 'feature');
		writeFiles(root, { 'src/shallow.ts': SHALLOW_MODULE, 'src/x.ts': '// deepcheck-ignore-file\nexport const x = 1;\n' });
		commitAll(root, 'feature');
		return root;
	};

	it('fails against the base branch with error annotations and a step summary', () => {
		const root = featureBranch();
		const summary = `${root}/summary.md`;
		let stdout = '';
		const code = main(['check', '--fallow', 'off', '--format', 'github', '--changed-since', 'main'], {
			cwd: root,
			env: { GITHUB_STEP_SUMMARY: summary },
			stdout: (t) => (stdout += t),
			stderr: () => {}
		});
		expect(code).toBe(1);
		expect(stdout).toMatch(/^::error file=src\/shallow\.ts,line=1,title=deepcheck G1 new shallow module \(score \d+\)::/m);
		expect(stdout).toMatch(/^::error file=src\/x\.ts,line=1,title=deepcheck G4 invalid suppression::/m);
		expect(readFileSync(summary, 'utf8')).toContain('## deepcheck: 2 changed module(s) fail the deep-module gate');
	});

	it('passes once the shallow module and the bad suppression are gone', () => {
		const root = featureBranch();
		removeFile(root, 'src/shallow.ts');
		removeFile(root, 'src/x.ts');
		commitAll(root, 'remove');
		expect(cli(root, 'check', '--fallow', 'off', '--format', 'github', '--changed-since', 'main')).toEqual({ code: 0, stdout: '', stderr: '' });
	});
});

describe('check JSON and tool errors', () => {
	it('prints a JSON gate result that matches the shipped report schema', () => {
		const root = writeRepo({ 'src/store.ts': STORE });
		writeFiles(root, { 'src/shallow.ts': SHALLOW_MODULE, 'src/x.ts': '// deepcheck-ignore-file\nexport const x = 1;\n' });
		const result = cli(root, 'check', '--fallow', 'off', '--format', 'json');
		const out = JSON.parse(result.stdout);
		expect(result.code).toBe(1);
		expect(out).toMatchObject({ command: 'check', scope: 'changed', base: 'HEAD', passed: false, summary: { failed: 1, invalidSuppressions: 1 } });
		expect(out.findings[0]).toMatchObject({ path: 'src/shallow.ts', gate: 'G1', baselineScore: null });
		expect(validate(out, loadSchema('report.schema.json'))).toEqual([]);
	});

	it.each([
		['outside a git repository', () => writeProject({ 'src/a.ts': STORE }), [] as string[]],
		['an unknown base ref', () => writeRepo({ 'src/a.ts': STORE }), ['--changed-since', 'origin/nope']],
		['a corrupt baseline', () => writeRepo({ 'src/a.ts': STORE, '.deepcheck-baseline.json': '{' }), []]
	])('G5: exits 2, never 1, %s, with a JSON error envelope', (_name, setup, args) => {
		const result = cli(setup(), 'check', '--fallow', 'off', '--format', 'json', ...args);
		expect(result.code).toBe(2);
		expect(JSON.parse(result.stdout)).toMatchObject({ error: true, exitCode: 2 });
	});
});

describe('G6 Fallow independence', () => {
	/** A stand-in Fallow that reports every export of the changed modules as unused and its own complexity numbers. */
	function fallowFor(root: string): string {
		const health = { file_scores: [{ path: 'src/shallow.ts', total_cyclomatic: 6 }, { path: 'src/deep.ts', total_cyclomatic: 15 }] };
		const dead = { unused_exports: ['getName', 'setName', 'hasName', 'deleteName', 'size', 'parseCsv'].map((e) => ({ path: e === 'parseCsv' ? 'src/deep.ts' : 'src/shallow.ts', export_name: e })) };
		writeFiles(root, { '.bin/health.json': JSON.stringify(health), '.bin/dead.json': JSON.stringify(dead) });
		writeFiles(root, { '.bin/fallow': `#!/bin/sh\ncase "$1" in\n  health) cat '${root}/.bin/health.json' ;;\n  dead-code) cat '${root}/.bin/dead.json' ;;\nesac\nexit 1\n` });
		chmodSync(`${root}/.bin/fallow`, 0o755);
		return `${root}/.bin/fallow`;
	}

	it('gives the same gate result with --fallow off as with Fallow data, and never fails on Fallow findings alone', () => {
		const root = writeRepo({ 'src/store.ts': STORE });
		writeFiles(root, { 'src/shallow.ts': SHALLOW_MODULE, 'src/deep.ts': DEEP_MODULE });
		const verdict = (fallow: string) => {
			const out = JSON.parse(cli(root, 'check', '--fallow', fallow, '--format', 'json').stdout);
			return { passed: out.passed, failing: out.findings.map((f: { path: string; gate: string }) => `${f.gate} ${f.path}`) };
		};
		const withFallow = verdict(fallowFor(root));
		expect(withFallow).toEqual(verdict('off'));
		expect(withFallow.failing).toEqual(['G1 src/shallow.ts']);
	});
});

describe('scopes and baseline in scan', () => {
	it('--scope changed runs the gate and --scope all the scan', () => {
		const root = writeRepo({ 'src/store.ts': STORE });
		writeFiles(root, { 'src/shallow.ts': SHALLOW_MODULE });
		expect(cli(root, '--scope', 'changed', '--fallow', 'off').code).toBe(1);
		expect(cli(root, '--scope', 'all', '--fallow', 'off')).toMatchObject({ code: 0, stdout: expect.stringContaining('src/shallow.ts') });
		expect(cli(root, '--scope', 'some', '--fallow', 'off').code).toBe(2);
	});

	it('scan --use-baseline hides baselined modules that did not worsen', () => {
		const root = writeRepo({ 'src/store.ts': STORE, 'src/old.ts': SHALLOW_MODULE });
		cli(root, 'baseline', '--fallow', 'off');
		writeFiles(root, { 'src/new.ts': SHALLOW_MODULE });
		const listed = (...args: string[]) =>
			JSON.parse(cli(root, 'scan', '--fallow', 'off', '--format', 'json', ...args).stdout).findings.map((f: { path: string }) => f.path);
		expect(listed()).toEqual(['src/new.ts', 'src/old.ts']);
		expect(listed('--use-baseline')).toEqual(['src/new.ts']);
	});
});

describe('deepcheck baseline', () => {
	it('writes the flagged modules to .deepcheck-baseline.json and reports how many', () => {
		const root = writeRepo({ 'src/store.ts': STORE, 'src/shallow.ts': SHALLOW_MODULE, 'src/deep.ts': DEEP_MODULE });
		const result = cli(root, 'baseline', '--fallow', 'off');
		expect(result).toMatchObject({ code: 0, stdout: 'deepcheck: baseline .deepcheck-baseline.json written: 1 module(s) at or above 70 of 3 analyzed\n' });
		const baseline = JSON.parse(readFileSync(`${root}/.deepcheck-baseline.json`, 'utf8'));
		expect(baseline.entries.map((e: { path: string }) => e.path)).toEqual(['src/shallow.ts']);
	});

	it('regenerates without crashing after modules were deleted or renamed', () => {
		const root = writeRepo({ 'src/store.ts': STORE, 'src/a.ts': SHALLOW_MODULE, 'src/b.ts': SHALLOW_MODULE });
		cli(root, 'baseline', '--fallow', 'off');
		removeFile(root, 'src/a.ts');
		git(root, 'mv', 'src/b.ts', 'src/c.ts');
		expect(cli(root, 'baseline', '--fallow', 'off').code).toBe(0);
		const baseline = JSON.parse(readFileSync(`${root}/.deepcheck-baseline.json`, 'utf8'));
		expect(baseline.entries.map((e: { path: string }) => e.path)).toEqual(['src/c.ts']);
	});
});
