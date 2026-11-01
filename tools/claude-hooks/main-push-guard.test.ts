import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { git, writeRepo } from '../deepcheck/test/helpers.ts';

const HOOK = fileURLToPath(new URL('../../.claude/hooks/main-push-guard.mjs', import.meta.url));

/** Runs the hook the way Claude Code does: PreToolUse JSON on stdin; the decision it asks for, or none */
const decision = (cwd: string, command: string) => {
	const run = spawnSync('node', [HOOK], {
		input: JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Bash', cwd, tool_input: { command } }),
		encoding: 'utf8'
	});
	expect(run.status).toBe(0);
	return run.stdout ? JSON.parse(run.stdout).hookSpecificOutput.permissionDecision : undefined;
};

// a clone whose main and feature branch track origin, as a session's checkout does
let onMain: string;
let onFeature: string;
beforeAll(() => {
	const origin = writeRepo({ 'a.txt': 'a' });
	git(origin, 'branch', 'main-fix');
	for (const branch of ['main', 'feature']) {
		const clone = writeRepo({});
		git(clone, 'remote', 'add', 'origin', origin);
		git(clone, 'fetch', '-q', 'origin');
		git(clone, 'checkout', '-q', '-B', branch, 'origin/main');
		git(clone, 'config', `branch.${branch}.remote`, 'origin');
		git(clone, 'config', `branch.${branch}.merge`, `refs/heads/${branch}`);
		if (branch === 'main') onMain = clone;
		else onFeature = clone;
	}
});

describe('push to main by its resolved target (#713)', () => {
	it.each([
		['a bare push with main checked out', () => onMain, 'git push'],
		['a push of HEAD with main checked out', () => onMain, 'git push -u origin HEAD'],
		['HEAD:main from another branch', () => onFeature, 'git push origin HEAD:main'],
		['a forced refspec to refs/heads/main', () => onFeature, 'git push origin +feature:refs/heads/main'],
		['git -C into a checkout of main', () => onFeature, `git -C ${'"'}%MAIN%${'"'} push`],
		['every branch at once', () => onFeature, 'git push --all origin']
	])('asks before %s', (_, cwd, command) => {
		expect(decision(cwd(), command.replace('%MAIN%', onMain))).toBe('ask');
	});

	it.each([
		['a bare push of a feature branch', () => onFeature, 'git push'],
		['the session branch with -u', () => onFeature, 'git push -q -u origin feature 2>&1 | tail -1'],
		['a branch whose name starts with main', () => onFeature, 'git push origin feature:main-fix'],
		['a command that only mentions a push', () => onMain, 'echo "git push origin main" > notes.txt'],
		['no push at all', () => onMain, 'git status && git log --oneline -1']
	])('lets %s through', (_, cwd, command) => {
		expect(decision(cwd(), command)).toBeUndefined();
	});

	it('is registered as a PreToolUse Bash hook', () => {
		const settings = JSON.parse(readFileSync(new URL('../../.claude/settings.json', import.meta.url), 'utf8'));
		const bash = settings.hooks.PreToolUse.find((h: { matcher: string }) => h.matcher === 'Bash');
		expect(bash.hooks).toContainEqual({ type: 'command', command: 'node "$CLAUDE_PROJECT_DIR"/.claude/hooks/main-push-guard.mjs' });
	});
});
