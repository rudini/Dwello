import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const HOOK = fileURLToPath(new URL('../../.claude/hooks/fitness-gate.sh', import.meta.url));

/** Runs the hook the way Claude Code does: PreToolUse JSON on stdin, project dir in the environment */
const hook = (root: string, command: string) =>
	spawnSync('bash', [HOOK], {
		input: JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command } }),
		env: { ...process.env, CLAUDE_PROJECT_DIR: root },
		encoding: 'utf8',
		timeout: 60_000
	});

/** A repository whose tools/fitness/fitness.ts stands in for the real one: it writes its arguments to `ran` and prints `output` */
function repo(output: string, exit: number, changed: string): string {
	const root = mkdtempSync(join(tmpdir(), 'fitness-hook-'));
	const run = (...args: string[]) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd: root });
	mkdirSync(join(root, 'tools/fitness'), { recursive: true });
	writeFileSync(
		join(root, 'tools/fitness/fitness.ts'),
		`require('node:fs').writeFileSync(${JSON.stringify(join(root, 'ran'))}, process.argv.slice(2).join(' '));\nconsole.log(${JSON.stringify(output)});\nprocess.exit(${exit});\n`
	);
	mkdirSync(join(root, 'src'));
	mkdirSync(join(root, 'docs'));
	writeFileSync(join(root, 'src/a.ts'), 'export const a = 1;\n');
	writeFileSync(join(root, 'docs/a.md'), 'a\n');
	run('init', '-q', '-b', 'main');
	run('add', '-A');
	run('commit', '-q', '-m', 'x');
	writeFileSync(join(root, changed), 'changed\n');
	return root;
}

const FAILED = 'error [fat-file] src/a.ts has 501 lines, allowed 500\nFitness: 1 errors, 0 warnings';

describe('fitness gate', () => {
	it('blocks a commit that changes src/ when fitness reports an error, and shows the error', () => {
		const result = hook(repo(FAILED, 1, 'src/a.ts'), 'git commit -am "feat: x"');
		expect(result.status).toBe(2);
		expect(result.stderr).toContain('fitness-gate: blocked');
		expect(result.stderr).toContain('error [fat-file] src/a.ts has 501 lines, allowed 500');
	});

	it('runs fitness against origin/main when the clone has it, as CI does', () => {
		const root = repo('Fitness: 0 errors, 0 warnings', 0, 'src/a.ts');
		execFileSync('git', ['update-ref', 'refs/remotes/origin/main', 'HEAD'], { cwd: root });
		expect(hook(root, 'git commit -am "feat: x"')).toMatchObject({ status: 0, stderr: '' });
		expect(readFileSync(join(root, 'ran'), 'utf8')).toBe('--base origin/main');
	});

	it('does not run fitness for a commit that changes no file under src/, backend/src/ or tools/fitness/', () => {
		const root = repo(FAILED, 1, 'docs/a.md');
		expect(hook(root, 'git commit -am "docs: x"')).toMatchObject({ status: 0, stderr: '' });
		expect(existsSync(join(root, 'ran'))).toBe(false);
	});

	it('lets the commit pass with a notice when fitness ends without its summary line', () => {
		const result = hook(repo('TypeError: x is undefined', 1, 'src/a.ts'), 'git commit -am "feat: x"');
		expect(result.status).toBe(0);
		expect(result.stderr).toContain('fitness-gate: fitness did not finish (TypeError: x is undefined), skipping.');
	});

	it('does not gate a push or a command that only names a commit', () => {
		const root = repo(FAILED, 1, 'src/a.ts');
		expect(hook(root, 'git push -u origin x').status).toBe(0);
		expect(hook(root, 'echo "git commit later"').status).toBe(0);
		expect(existsSync(join(root, 'ran'))).toBe(false);
	});
});

describe('fitness gate wiring', () => {
	it('is registered as a PreToolUse Bash hook with a timeout that covers a fitness run', () => {
		const settings = JSON.parse(readFileSync(new URL('../../.claude/settings.json', import.meta.url), 'utf8'));
		const bash = settings.hooks.PreToolUse.find((h: { matcher: string }) => h.matcher === 'Bash');
		expect(bash.hooks).toContainEqual({ type: 'command', command: '"$CLAUDE_PROJECT_DIR"/.claude/hooks/fitness-gate.sh', timeout: 120 });
	});
});
