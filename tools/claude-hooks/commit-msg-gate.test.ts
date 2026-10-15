import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const HOOK = fileURLToPath(new URL('../../.claude/hooks/commit-msg-gate.mjs', import.meta.url));
const ROOT = fileURLToPath(new URL('../..', import.meta.url)).replace(/\/$/, '');
const SETTINGS = fileURLToPath(new URL('../../.claude/settings.json', import.meta.url));

/** Runs the hook the way Claude Code does: PreToolUse JSON on stdin */
const hook = (command: string, cwd = ROOT) =>
	spawnSync('node', [HOOK], {
		input: JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Bash', cwd, tool_input: { command } }),
		encoding: 'utf8'
	});

const heredoc = (message: string) => `git commit -m "$(cat <<'EOF'\n${message}\nEOF\n)"`;

describe('commit subject gate (CLAUDE.md, Conventions: Commits)', () => {
	it.each([
		['git commit -m "fix(contracts): guard contract retries"'],
		["git add -A && git commit -q -m 'docs(config): update B-13 instruction check'"],
		[heredoc('chore(tests): enable contract retry scenarios\n\nBody line that is long, longer than fifty characters.')],
		['git commit --amend --no-edit'],
		['git commit -F message.txt'],
		['git status && git log -m'],
		['echo "git commit -m nope"'],
		['git commit -am "fix(contracts): guard retries" -m "a body line that is longer than fifty characters"']
	])('lets %j through', (command) => {
		expect(hook(command)).toMatchObject({ status: 0, stderr: '' });
	});

	it.each([
		['git commit -m "fix(contracts): mark unchecked apartments in choice"', '51 characters'],
		['git commit -m "fix: guard retries"', 'type(scope)'],
		['git commit -m "feature(contracts): guard retries"', 'type(scope)'],
		['git commit -m "fix(wizard): guard retries"', 'scope «wizard»'],
		[heredoc('fix(contracts): guard retries.\n\nBody.'), 'period'],
		[`git -C ${ROOT} commit -m "fix: guard retries"`, 'type(scope)'],
		[`cd ${ROOT}/backend && git commit -m "fix: guard retries"`, 'type(scope)'],
		['git commit -m "fix(contracts): guard retries" && git commit --amend -m "fix: guard"', 'type(scope)']
	])('blocks %j: %s', (command, problem) => {
		const result = hook(command);
		expect(result.status).toBe(2);
		expect(result.stderr).toContain(problem);
	});

	it('says that nothing in the blocked command ran, edits and git add included', () => {
		expect(hook('git add -A && git commit -m "fix: x"').stderr).toContain('nothing in this command ran');
	});

	it.each([
		['git commit -m a', '/tmp/scratch-repo'],
		['cd /tmp/scratch-repo && git commit -m a', ROOT],
		['git -C /tmp/scratch-repo commit -m a', ROOT]
	])('lets %j through in a repository outside the project (cwd %s)', (command, cwd) => {
		expect(hook(command, cwd)).toMatchObject({ status: 0, stderr: '' });
	});

	it('takes types and scopes from CLAUDE.md, so the list exists once', () => {
		expect(hook('git commit -m "fix(i18n): x"').status).toBe(0);
		expect(hook('git commit -m "docs(build): x"').status).toBe(0);
	});

	it('is registered as a PreToolUse Bash hook', () => {
		const settings = JSON.parse(readFileSync(SETTINGS, 'utf8'));
		const bash = settings.hooks.PreToolUse.find((h: { matcher: string }) => h.matcher === 'Bash');
		expect(bash.hooks).toContainEqual({ type: 'command', command: 'node "$CLAUDE_PROJECT_DIR"/.claude/hooks/commit-msg-gate.mjs' });
	});
});
