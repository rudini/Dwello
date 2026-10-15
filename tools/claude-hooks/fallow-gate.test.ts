import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { commitAll, git, writeProject } from '../deepcheck/test/helpers.ts';

const HOOK = fileURLToPath(new URL('../../.claude/hooks/fallow-gate.sh', import.meta.url));
const BIN = fileURLToPath(new URL('../../node_modules/.bin', import.meta.url));

/** Runs the hook the way Claude Code does, with the project's fallow on PATH */
const hook = (root: string, command: string) =>
	spawnSync('bash', [HOOK], {
		cwd: root,
		input: JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command } }),
		env: { ...process.env, PATH: `${BIN}:${process.env.PATH}`, CLAUDE_PROJECT_DIR: root },
		encoding: 'utf8',
		timeout: 60_000
	});

/** A clone of only the branch `feature` (no `main`, no `origin/main`), from a remote that has `main` */
function singleBranchClone(): string {
	const origin = writeProject({
		'package.json': '{ "name": "x", "type": "module", "main": "src/index.ts" }\n',
		'src/index.ts': "import { a } from './a.ts';\nconsole.log(a);\n",
		'src/a.ts': 'export const a = 1;\n'
	});
	git(origin, 'init', '-q', '-b', 'main');
	commitAll(origin, 'initial');
	git(origin, 'branch', 'feature');
	const root = `${writeProject({})}/clone`;
	git(origin, 'clone', '-q', '--single-branch', '--branch', 'feature', origin, root);
	git(root, 'remote', 'set-head', 'origin', '-d');
	git(root, 'switch', '-q', '-c', 'work');
	return root;
}

describe('fallow gate without a base branch', () => {
	it('blocks instead of skipping the audit, and the fetch it names makes the audit run', () => {
		const root = singleBranchClone();
		const blocked = hook(root, 'git commit -m x');
		expect(blocked.stderr).toContain('could not detect base branch');
		expect(blocked.stderr).toContain('nothing in this command ran');
		expect(blocked.status).toBe(2);
		const advice = /run (git fetch [^,]+)/.exec(blocked.stderr)?.[1] ?? '';
		git(root, ...advice.split(' ').slice(1));
		expect(hook(root, 'git commit -m x')).toMatchObject({ status: 0 });
	});
});
