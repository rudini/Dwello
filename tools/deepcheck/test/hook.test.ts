import { spawnSync } from 'node:child_process';
import { copyFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { SHALLOW_MODULE, commitAll, git, writeFiles, writeProject, writeRepo } from './helpers.ts';

const HOOK = fileURLToPath(new URL('../../../.claude/hooks/deepcheck-gate.sh', import.meta.url));
const SETTINGS = fileURLToPath(new URL('../../../.claude/settings.json', import.meta.url));
const STORE = 'export const store = new Map<string, string>();\n';

/** Runs the hook the way Claude Code does: PreToolUse JSON on stdin, project dir in the environment. */
const hook = (root: string, command: string, script = HOOK, raw?: string) =>
	spawnSync('bash', [script], {
		input: raw ?? JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command } }),
		env: { ...process.env, CLAUDE_PROJECT_DIR: root },
		encoding: 'utf8',
		timeout: 60_000
	});

describe('deepcheck Claude Code hook (commit/push gate, like fallow-gate.sh)', () => {
	it('blocks git commit with exit 2 and the findings on stderr when the changed code fails the gate', () => {
		const root = writeRepo({ 'src/store.ts': STORE });
		writeFiles(root, { 'src/shallow.ts': SHALLOW_MODULE });
		const result = hook(root, 'git add -A && git commit -m "feat: x"');
		expect(result.status).toBe(2);
		expect(result.stderr).toContain('deepcheck-gate: blocked');
		expect(result.stderr).toContain('G1 new shallow module');
		expect(result.stdout).toBe('');
	});

	it('is silent and lets git push through when the changed code passes', () => {
		const root = writeRepo({ 'src/store.ts': STORE });
		expect(hook(root, 'git push -u origin main')).toMatchObject({ status: 0, stdout: '', stderr: '' });
	});

	it('ignores commands that are not git commit or push, without running deepcheck', () => {
		const root = writeRepo({ 'src/store.ts': STORE });
		writeFiles(root, { 'src/shallow.ts': SHALLOW_MODULE });
		expect(hook(root, 'git status && npm test')).toMatchObject({ status: 0, stdout: '', stderr: '' });
	});

	it('fails open with one notice on a tool error, so errors never block like findings', () => {
		const root = writeRepo({ 'src/store.ts': STORE, 'deepcheck.config.json': '{ "nope": 1 }' });
		const result = hook(root, 'git commit -m x');
		expect(result.status).toBe(0);
		expect(result.stderr).toMatch(/^deepcheck-gate: deepcheck error \(.*unknown key "nope".*\), skipping\.\n$/);
	});

	it('is registered as a PreToolUse Bash hook next to the Fallow gate, with a timeout', () => {
		const settings = JSON.parse(readFileSync(SETTINGS, 'utf8'));
		const bash = settings.hooks.PreToolUse.find((h: { matcher: string }) => h.matcher === 'Bash');
		expect(bash.hooks).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ command: '"$CLAUDE_PROJECT_DIR"/.claude/hooks/fallow-gate.sh' }),
				{ type: 'command', command: '"$CLAUDE_PROJECT_DIR"/.claude/hooks/deepcheck-gate.sh', timeout: 60 }
			])
		);
	});

	it('fails open with a notice when deepcheck itself crashes (e.g. before npm ci), never blocking', () => {
		const install = writeProject({ 'tools/deepcheck/src/cli.ts': "throw new Error('Cannot find package ts-morph');\n" });
		writeFiles(install, { '.claude/hooks/.keep': '' });
		copyFileSync(HOOK, `${install}/.claude/hooks/deepcheck-gate.sh`);
		const result = hook(writeRepo({ 'src/store.ts': STORE }), 'git commit -m x', `${install}/.claude/hooks/deepcheck-gate.sh`);
		expect(result.status).toBe(0);
		expect(result.stderr).toMatch(/^deepcheck-gate: deepcheck error \(.*Cannot find package ts-morph.*\), skipping\.\n$/);
	});

	it('on git push checks what is not pushed yet, against the upstream', () => {
		const root = writeRepo({ 'src/store.ts': STORE });
		const remote = writeProject({});
		git(remote, 'init', '-q', '--bare');
		git(root, 'remote', 'add', 'origin', remote);
		git(root, 'push', '-q', '-u', 'origin', 'main');
		writeFiles(root, { 'src/shallow.ts': SHALLOW_MODULE });
		commitAll(root, 'shallow, committed but not pushed');
		const result = hook(root, 'git push');
		expect(result.status).toBe(2);
		expect(result.stderr).toContain('G1 new shallow module');
	});

	it('ignores stdin that is not JSON with a single notice', () => {
		const result = hook(writeRepo({ 'src/store.ts': STORE }), '', HOOK, 'not json');
		expect(result.status).toBe(0);
		expect(result.stderr).toBe('deepcheck-gate: hook input is not JSON, skipping deepcheck.\n');
	});
});
