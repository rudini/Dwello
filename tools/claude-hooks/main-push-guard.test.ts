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
		['every branch at once', () => onFeature, 'git push --all origin'],
		['a mirror', () => onFeature, 'git push --mirror origin'],
		['main named as the source', () => onFeature, 'git push origin main'],
		['the deletion of main', () => onFeature, 'git push origin :main'],
		// review 713-1
		['a cd into a checkout of main', () => onFeature, 'cd "%MAIN%" && git push'],
		['a redirection with a space', () => onMain, 'git push origin > /tmp/push.log 2> /dev/null'],
		['a continued line', () => onFeature, 'git push origin \\\nHEAD:main'],
		['a cd the hook cannot resolve', () => onFeature, 'cd "$CHECKOUT" && git push'],
		['a relative cd after one the hook cannot resolve', () => onFeature, 'cd "$CHECKOUT" && cd sub && git push'],
		['a pushd into a checkout of main', () => onFeature, 'pushd "%MAIN%" && git push'],
		['env and variables before git', () => onMain, 'env GIT_TRACE=0 X=1 git push'],
		['command and timeout before git', () => onMain, 'timeout 60 command git push'],
		['git --git-dir of a checkout of main', () => onFeature, 'git --git-dir "%MAIN%/.git" push'],
		['the matching refspec', () => onFeature, 'git push origin :'],
		['a wildcard refspec', () => onFeature, 'git push origin "refs/heads/*:refs/heads/*"'],
		['@ for HEAD with main checked out', () => onMain, 'git push origin @'],
		['an abbreviated heads/main', () => onFeature, 'git push origin feature:heads/main'],
		['a bare push with push.default matching', () => onFeature, 'git -c push.default=matching push'],
		// Copilot review on #1011
		['a push in a double-quoted substitution', () => onMain, 'out="$(git push 2>&1)"'],
		['a push after a cd in a heredoc body', () => onMain, "cat > d.sh <<'EOF'\ncd %FEATURE%\nEOF\ngit push"],
		['GIT_DIR of a checkout of main', () => onFeature, 'env GIT_DIR="%MAIN%/.git" git push'],
		['git -C into a directory the hook cannot resolve', () => onFeature, 'git -C "$CHECKOUT" push'],
		['a configured push refspec to main', () => onFeature, 'git -c remote.origin.push=refs/heads/main:refs/heads/main push'],
		['a push after a cd in a subshell', () => onMain, '(cd "%FEATURE%" && true); git push']
	])('asks before %s', (_, cwd, command) => {
		expect(decision(cwd(), command.replaceAll('%MAIN%', onMain).replaceAll('%FEATURE%', onFeature))).toBe('ask');
	});

	it.each([
		['a bare push of a feature branch', () => onFeature, 'git push'],
		['the session branch with -u', () => onFeature, 'git push -q -u origin feature 2>&1 | tail -1'],
		['a branch whose name starts with main', () => onFeature, 'git push origin feature:main-fix'],
		['a command that only mentions a push', () => onMain, 'echo "git push origin main" > notes.txt'],
		['a push named in backticks in a heredoc', () => onFeature, "cat > d.md <<'EOF'\nRun `git push origin main` first\nEOF"],
		['no push at all', () => onMain, 'git status && git log --oneline -1'],
		['a push line in a heredoc body', () => onFeature, "cat > d.md <<'EOF'\ngit push origin main\nEOF"]
	])('lets %s through', (_, cwd, command) => {
		expect(decision(cwd(), command)).toBeUndefined();
	});

	it('is registered as a PreToolUse Bash hook', () => {
		const settings = JSON.parse(readFileSync(new URL('../../.claude/settings.json', import.meta.url), 'utf8'));
		const bash = settings.hooks.PreToolUse.find((h: { matcher: string }) => h.matcher === 'Bash');
		expect(bash.hooks).toContainEqual({ type: 'command', command: 'node "$CLAUDE_PROJECT_DIR"/.claude/hooks/main-push-guard.mjs' });
	});
});
