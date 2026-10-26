import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { HINT_RULES, RULES } from '../src/gate.ts';

const read = (path: string) => readFileSync(fileURLToPath(new URL(`../../../${path}`, import.meta.url)), 'utf8');

describe('testcheck wiring', () => {
	it('runs as a blocking pull request job on the changes since the base branch', () => {
		const ci = read('.github/workflows/ci.yml');
		const job = ci.slice(ci.indexOf('\n  testcheck:\n'), ci.indexOf('\n  ui-screenshots:\n'));
		expect(job).toContain("if: github.event_name == 'pull_request'");
		expect(job).toContain('fetch-depth: 0');
		expect(job).toContain('bun run testcheck:ci -- "origin/${{ github.base_ref }}"');
		expect(JSON.parse(read('package.json')).scripts['testcheck:ci']).toBe('node tools/testcheck/src/cli.ts check --format github --changed-since');
	});

	it('documents every rule in the README and its precision in the validation report', () => {
		const readme = read('tools/testcheck/README.md');
		const validation = read('tools/testcheck/testcheck-validation.md');
		for (const rule of RULES) expect(readme).toContain(`\`${rule}\``);
		for (const rule of RULES) expect(validation).toContain(`\`${rule}\``);
		for (const rule of HINT_RULES) expect(readme).toMatch(new RegExp(`Hint rule[^\\n]*\`${rule}\``));
	});

	it('gates every commit and push of Claude Code through the hook', () => {
		const settings = JSON.parse(read('.claude/settings.json'));
		const commands = settings.hooks.PreToolUse.flatMap((h: { hooks: { command: string }[] }) => h.hooks.map((x) => x.command));
		expect(commands).toContain('"$CLAUDE_PROJECT_DIR"/.claude/hooks/testcheck-gate.sh');
		expect(settings.permissions.allow).toContain('Bash(bun run testcheck:audit*)');
	});
});
