import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(fileURLToPath(new URL(`../../../${path}`, import.meta.url)), 'utf8');

/** The text of one job in a workflow (from `  <name>:` to the next top-level job). */
function job(workflow: string, name: string): string {
	const start = workflow.indexOf(`\n  ${name}:\n`);
	expect(start, `job ${name}`).toBeGreaterThan(-1);
	const rest = workflow.slice(start + 1);
	const next = rest.slice(1).search(/\n {2}[a-z][\w-]*:\n/);
	return next === -1 ? rest : rest.slice(0, next + 1);
}

describe('GitHub Actions wiring', () => {
	it('adds one blocking deepcheck job to the PR workflow, set up like the Fallow job', () => {
		const deepcheck = job(read('.github/workflows/ci.yml'), 'deepcheck');
		expect(deepcheck).toContain('name: Deep modules');
		expect(deepcheck).toContain("if: github.event_name == 'pull_request'");
		expect(deepcheck).toContain('runs-on: ubuntu-latest');
		expect(deepcheck).toContain('fetch-depth: 0');
		expect(deepcheck).toContain('node-version: ${{ env.NODE_VERSION }}');
		expect(deepcheck).toContain('bun install --frozen-lockfile');
		expect(deepcheck).toContain('bunx svelte-kit sync');
		expect(deepcheck).toContain('bun run deepcheck:ci -- "origin/${{ github.base_ref }}"');
		expect(deepcheck).not.toContain('continue-on-error');
	});

	it('leaves the existing jobs as they were', () => {
		const ci = read('.github/workflows/ci.yml');
		for (const name of ['changes', 'build', 'static-checks', 'unit-tests', 'e2e-tests', 'fallow', 'ui-screenshots']) job(ci, name);
		expect(job(ci, 'fallow')).toContain('run: bunx fallow audit --base');
	});

	it('ships a manual, never-blocking scan workflow with a report summary and artifacts', () => {
		const path = '.github/workflows/deepcheck-scan.yml';
		expect(existsSync(fileURLToPath(new URL(`../../../${path}`, import.meta.url)))).toBe(true);
		const scan = read(path);
		expect(scan).toMatch(/^on:\n {2}workflow_dispatch:\n {4}inputs:\n/m);
		for (const input of ['path:', 'top:', 'min_score:']) expect(scan).toContain(`      ${input}`);
		expect(scan).toMatch(/^ {2}# schedule:\n {2}# {3}- cron: /m);
		expect(scan).toContain('bun run deepcheck:scan --');
		expect(scan).toContain('--format markdown');
		expect(scan).toContain('--format json');
		expect(scan).toContain('$GITHUB_STEP_SUMMARY');
		expect(scan).toContain('uses: actions/upload-artifact@v4');
		expect(scan).not.toContain('--fail-on-score');
		// the path input goes after `--`, so a value like --output=... cannot become an option
		expect(scan).toContain('-- "$SCAN_PATH"');
		expect(scan).not.toContain('args+=("$SCAN_PATH")');
	});
});
