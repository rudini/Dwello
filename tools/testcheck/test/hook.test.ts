import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const HOOK = fileURLToPath(new URL('../../../.claude/hooks/testcheck-gate.sh', import.meta.url));

/** Runs the hook the way Claude Code does: PreToolUse JSON on stdin, project dir in the environment. */
const hook = (root: string, command: string) =>
	spawnSync('bash', [HOOK], {
		input: JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command } }),
		env: { ...process.env, CLAUDE_PROJECT_DIR: root },
		encoding: 'utf8',
		timeout: 60_000
	});

function repoWith(test: string): string {
	const root = mkdtempSync(join(tmpdir(), 'testcheck-hook-'));
	execFileSync('git', ['init', '-q', '-b', 'main'], { cwd: root });
	execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '--allow-empty', '-m', 'x'], { cwd: root });
	mkdirSync(join(root, 'src'));
	writeFileSync(join(root, 'src/a.test.ts'), test);
	return root;
}

const COMMIT = ['git', 'commit -m "feat: x"'].join(' ');

describe('testcheck Claude Code hook', () => {
	it('blocks a commit with exit 2 and the findings on stderr when a changed test cannot fail', () => {
		const result = hook(repoWith(`it('adds', () => { expect(add(1, 2)); });\n`), `git add -A && ${COMMIT}`);
		expect(result.status).toBe(2);
		expect(result.stderr).toContain('testcheck-gate: blocked');
		expect(result.stderr).toContain('src/a.test.ts:1 dangling-expect adds');
	});

	it('lets other commands and passing tests through', () => {
		expect(hook(repoWith(`it('adds', () => { expect(add(1, 2)).toBe(3); });\n`), COMMIT).status).toBe(0);
		expect(hook(repoWith(`it('a', () => {});\n`), 'ls src').status).toBe(0);
	});
});
