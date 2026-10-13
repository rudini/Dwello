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

/** A repository with only the branch `feature`: no `main`, no `origin/main`, no upstream for fallow to compare with */
function featureOnly(): string {
	const root = writeProject({
		'package.json': '{ "name": "x", "type": "module", "main": "src/index.ts" }\n',
		'src/index.ts': "import { a } from './a.ts';\nconsole.log(a);\n",
		'src/a.ts': 'export const a = 1;\n'
	});
	git(root, 'init', '-q', '-b', 'feature');
	commitAll(root, 'initial');
	return root;
}

describe('fallow gate without a base branch', () => {
	it('blocks and says how to get a base when there is none, instead of skipping the audit', () => {
		const result = hook(featureOnly(), 'git commit -m x');
		expect(result.stderr).toContain('git fetch origin main');
		expect(result.status).toBe(2);
	});
});
