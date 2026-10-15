import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { git, writeProject, writeRepo } from '../deepcheck/test/helpers.ts';

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
		['cd /tmp && git commit -m "fix: guard retries"', 'type(scope)'],
		['(cd /tmp && git commit -m a) && git commit -m "fix: guard retries"', 'type(scope)'],
		['git commit -m "fix(contracts): guard retries" && git commit --amend -m "fix: guard"', 'type(scope)']
	])('blocks %j: %s', (command, problem) => {
		const result = hook(command);
		expect(result.status).toBe(2);
		expect(result.stderr).toContain(problem);
	});

	it('says that nothing in the blocked command ran, edits and git add included', () => {
		expect(hook('git add -A && git commit -m "fix: x"').stderr).toContain('nothing in this command ran');
	});

	it('lets a commit through in another repository (a scratch repository), by cwd or git -C', () => {
		const scratch = mkdtempSync(`${tmpdir()}/scratch-`);
		spawnSync('git', ['init', '-q', scratch]);
		expect(hook('git commit -m a', scratch)).toMatchObject({ status: 0, stderr: '' });
		expect(hook(`git -C ${scratch} commit -m a`)).toMatchObject({ status: 0, stderr: '' });
	});

	it('checks a commit whose directory is no repository (the safe side)', () => {
		expect(hook('git commit -m "bad."', writeProject({})).status).toBe(2);
	});

	it('checks a worktree of the project outside its folder', () => {
		const project = writeRepo({
			'.claude/hooks/commit-msg-gate.mjs': readFileSync(HOOK, 'utf8'),
			'CLAUDE.md': readFileSync(`${ROOT}/CLAUDE.md`, 'utf8')
		});
		const worktree = `${writeProject({})}/w`;
		git(project, 'worktree', 'add', '-q', '--detach', worktree);
		const result = spawnSync('node', [`${project}/.claude/hooks/commit-msg-gate.mjs`], {
			input: JSON.stringify({ tool_input: { command: 'git commit -m "bad."' }, cwd: worktree }),
			encoding: 'utf8'
		});
		expect(result.status).toBe(2);
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
