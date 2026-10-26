import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { main } from '../src/cli.ts';

const VACUOUS = `import { expect, it } from 'vitest';\nit('adds', () => { expect(add(1, 2)); });\n`;
const GOOD = `import { expect, it } from 'vitest';\nit('adds', () => { expect(add(1, 2)).toBe(3); });\n`;

const write = (root: string, files: Record<string, string>) => {
	for (const [path, content] of Object.entries(files)) {
		mkdirSync(dirname(join(root, path)), { recursive: true });
		writeFileSync(join(root, path), content);
	}
};
const git = (root: string, ...args: string[]) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd: root, encoding: 'utf8' });
const commit = (root: string) => {
	git(root, 'add', '-A');
	git(root, 'commit', '-q', '--allow-empty', '-m', 'x');
};
/** A git repository on main with one commit of `files`. */
function repo(files: Record<string, string>): string {
	const root = mkdtempSync(join(tmpdir(), 'testcheck-'));
	write(root, files);
	git(root, 'init', '-q', '-b', 'main');
	commit(root);
	return root;
}
function run(root: string, ...argv: string[]) {
	let stdout = '';
	const status = main(argv, { cwd: root, stdout: (s) => (stdout += s), stderr: (s) => (stdout += s) });
	return { status, stdout };
}

describe('check', () => {
	it('fails on a changed test file with a finding and names file, line and rule', () => {
		const root = repo({ 'src/a.test.ts': GOOD });
		write(root, { 'src/a.test.ts': VACUOUS });
		const result = run(root, 'check');
		expect(result.status).toBe(1);
		expect(result.stdout).toContain('src/a.test.ts:2 dangling-expect adds');
	});

	it('passes when the test file with a finding is not changed, and for a changed file without one', () => {
		const root = repo({ 'src/old.test.ts': VACUOUS });
		write(root, { 'src/new.test.ts': GOOD });
		expect(run(root, 'check').status).toBe(0);
	});

	it('judges everything changed since the merge-base with --changed-since, committed changes included', () => {
		const root = repo({ 'src/a.test.ts': GOOD });
		git(root, 'switch', '-q', '-c', 'feature');
		write(root, { 'src/a.test.ts': VACUOUS });
		commit(root);
		expect(run(root, 'check').status).toBe(0);
		expect(run(root, 'check', '--changed-since', 'main').status).toBe(1);
	});
});

describe('check: baseline, suppressions, hints and formats', () => {
	it('lets a finding of the committed baseline pass, but not one only in a baseline that is not committed yet', () => {
		const root = repo({ 'src/a.test.ts': GOOD });
		write(root, { 'src/a.test.ts': VACUOUS });
		expect(run(root, 'baseline').status).toBe(0);
		expect(run(root, 'check').status).toBe(1);
		commit(root);
		write(root, { 'src/a.test.ts': VACUOUS + '// changed\n' });
		expect(run(root, 'check').status).toBe(0);
	});

	it('skips a finding suppressed with a reason above the test, and reports a suppression without a reason', () => {
		const root = repo({});
		write(root, {
			'src/a.test.ts': `// testcheck-ignore empty-test -- placeholder kept for the API docs\nit('x', () => {});\n`,
			'src/b.test.ts': `// testcheck-ignore empty-test\nit('x', () => {});\n`
		});
		const result = run(root, 'check');
		expect(result.status).toBe(1);
		expect(result.stdout).not.toContain('src/a.test.ts');
		expect(result.stdout).toContain('src/b.test.ts:1 invalid-suppression');
	});

	it('skips a finding suppressed on the line above it, and reports a suppression of an unknown rule', () => {
		const root = repo({});
		write(root, {
			'src/a.test.ts': `it('adds', () => {\n\t// testcheck-ignore dangling-expect -- documents the old API\n\texpect(add(1, 2));\n});\n`,
			'src/b.test.ts': `// testcheck-ignore no-such-rule -- why\nit('adds', () => { expect(add(1, 2)).toBe(3); });\n`
		});
		const result = run(root, 'check');
		expect(result.stdout).not.toContain('src/a.test.ts');
		expect(result.stdout).toContain('src/b.test.ts:1 invalid-suppression');
	});

	it('names in agent mode what failed, also for a title rule', () => {
		const root = repo({});
		write(root, { 'src/a.test.ts': `it('adds', () => { expect(add(1, 2)).toBe(3); });\nit('adds', () => { expect(add(2, 2)).toBe(4); });\n` });
		const result = run(root, 'check', '--agent');
		expect(result.stdout).toMatch(/^testcheck: 1 finding fails the test gate/);
		expect(result.stdout).toContain('src/a.test.ts:2 duplicate-title adds');
	});

	it('shows hints of the less precise rules without failing', () => {
		const root = repo({});
		write(root, { 'src/a.test.ts': `it('rows', () => { for (const r of rows()) expect(r).toBe(1); });\n` });
		const result = run(root, 'check');
		expect(result.status).toBe(0);
		expect(result.stdout).toContain('hint: src/a.test.ts:1 loop-only-assertion');
	});

	it('prints GitHub annotations with --format github, and nothing for passing changes with --agent', () => {
		const root = repo({ 'src/a.test.ts': GOOD });
		write(root, { 'src/a.test.ts': VACUOUS });
		expect(run(root, 'check', '--format', 'github').stdout).toContain('::error file=src/a.test.ts,line=2,title=testcheck dangling-expect::');
		write(root, { 'src/a.test.ts': GOOD.replace('3', '3 ') });
		expect(run(root, 'check', '--agent')).toEqual({ status: 0, stdout: '' });
	});

	it('exits 2 on an unknown command', () => {
		expect(run(repo({}), 'nonsense').status).toBe(2);
	});
});
