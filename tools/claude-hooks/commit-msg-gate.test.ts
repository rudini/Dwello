import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { commitAll, git, writeProject, writeRepo } from '../deepcheck/test/helpers.ts';

const HOOK = fileURLToPath(new URL('../../.claude/hooks/commit-msg-gate.mjs', import.meta.url));
const GIT_CALLS = fileURLToPath(new URL('../../.claude/hooks/git-calls.mjs', import.meta.url));
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
		["git commit -q -F - <<'EOF'\nfix(contracts): guard contract retries\n\nA body line longer than fifty characters, as usual.\nEOF"],
		["git log -1 --format=%B | git commit --amend -F - && cat > notes.txt <<'EOF'\nsome notes here\nEOF"],
		['git status && git log -m'],
		['echo "git commit -m nope"'],
		['git commit -am "fix(contracts): guard retries" -m "a body line that is longer than fifty characters"'],
		// #710: text in a heredoc is no commit
		["cat > notes.md <<'EOF'\ngit commit -m \"fix: guard retries\"\nEOF"],
		// Copilot on #1017: a hyphenated delimiter and two heredocs on one line
		["cat <<'END-NOTES'\ngit commit -m \"fix: guard retries\"\nEND-NOTES"],
		['cat <<A <<B\nfirst\nA\ngit commit -m "fix: guard retries"\nB']
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
		['git commit -m "fix(contracts): guard retries" && git commit --amend -m "fix: guard"', 'type(scope)'],
		// a commit and a push in one command: the push check runs before the commit exists
		["git commit -q -F - <<'EOF'\nfix(contracts): mark unchecked apartments in choice\n\nBody.\nEOF\ngit push", '51 characters'],
		["git commit -F - 2>&1 <<'EOF' && git push\nfix(contracts): mark unchecked apartments in choice\nEOF", '51 characters'],
		// #710: -c key=val, -C without a space and a quoted path with a space before commit
		['git -c user.name=t commit -m "fix: guard retries"', 'type(scope)'],
		['git -C/tmp commit -m "fix: guard retries"', 'type(scope)'],
		['git -C "/tmp/a b" commit -m "fix: guard retries"', 'type(scope)'],
		// review 710-1, C-1: shell keywords and braces before git
		['if git commit -m "fix: guard retries"; then :; fi', 'type(scope)'],
		['{ git commit -m "fix: guard retries"; }', 'type(scope)'],
		['! git commit -m "fix: guard retries"', 'type(scope)'],
		// Copilot on #1017: wrappers with options and operands
		['nice -n 10 git commit -m "fix: guard retries"', 'type(scope)'],
		['timeout -k 5s 60s git commit -m "fix: guard retries"', 'type(scope)']
	])('blocks %j: %s', (command, problem) => {
		const result = hook(command);
		expect(result.status).toBe(2);
		expect(result.stderr).toContain(problem);
	});

	it('says that nothing in the blocked command ran, edits and git add included', () => {
		expect(hook('git add -A && git commit -m "fix: x"').stderr).toContain('nothing in this command ran');
	});

	it('lets a commit through in another repository (a scratch repository), by cwd, git -C or a cd (review 710-1, C-4)', () => {
		const scratch = mkdtempSync(`${tmpdir()}/scratch-`);
		spawnSync('git', ['init', '-q', scratch]);
		expect(hook('git commit -m a', scratch)).toMatchObject({ status: 0, stderr: '' });
		expect(hook(`git -C ${scratch} commit -m a`)).toMatchObject({ status: 0, stderr: '' });
		expect(hook(`cd ${scratch} && git commit -m a`)).toMatchObject({ status: 0, stderr: '' });
		// Copilot on #1017: GIT_DIR of the project, a cd in a pipe or after || leave the commit in the project
		expect(hook(`GIT_DIR=${ROOT}/.git git commit -m a`, scratch).status).toBe(2);
		expect(hook(`cd ${scratch} | cat; git commit -m a`).status).toBe(2);
		expect(hook(`true || cd ${scratch}; git commit -m a`).status).toBe(2);
	});

	it('checks a commit whose directory is no repository (the safe side)', () => {
		expect(hook('git commit -m "bad."', writeProject({})).status).toBe(2);
	});

	it('checks a worktree of the project outside its folder', () => {
		const project = writeRepo({
			'.claude/hooks/commit-msg-gate.mjs': readFileSync(HOOK, 'utf8'),
			'.claude/hooks/git-calls.mjs': readFileSync(GIT_CALLS, 'utf8'),
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

	it('checks a subject with --check before the commit, so a blocked commit loses no edits', () => {
		const check = (subject: string) => spawnSync('node', [HOOK, '--check', subject], { encoding: 'utf8' });
		expect(check('fix(contracts): guard contract retries')).toMatchObject({ status: 0, stderr: '' });
		const blocked = check('fix(contracts): mark unchecked apartments in choice');
		expect(blocked.status).toBe(2);
		expect(blocked.stderr).toContain('51 characters');
		expect(blocked.stderr).not.toContain('nothing in this command ran');
	});

	// a subject given with -F <file> passes the commit unchecked; the push checks the commits themselves,
	// as CI «Commit subjects» does (workflow review 2026-10-23, L1)
	it('blocks a push while a commit since origin/main breaks the rules, whatever gave its subject', () => {
		const project = writeRepo({
			'.claude/hooks/commit-msg-gate.mjs': readFileSync(HOOK, 'utf8'),
			'.claude/hooks/git-calls.mjs': readFileSync(GIT_CALLS, 'utf8'),
			'CLAUDE.md': readFileSync(`${ROOT}/CLAUDE.md`, 'utf8')
		});
		git(project, 'update-ref', 'refs/remotes/origin/main', 'HEAD');
		const push = () =>
			spawnSync('node', [`${project}/.claude/hooks/commit-msg-gate.mjs`], {
				input: JSON.stringify({ tool_input: { command: 'git push -u origin feature' }, cwd: project }),
				encoding: 'utf8'
			});
		commitAll(project, 'fix(contracts): guard contract retries');
		expect(push()).toMatchObject({ status: 0, stderr: '' });

		commitAll(project, 'fix(contracts): mark unchecked apartments in choice');
		const blocked = push();
		expect(blocked.status).toBe(2);
		expect(blocked.stderr).toContain('51 characters');
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
