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
	it('runs the deepcheck gate as a blocking step of the quick-checks job, on pull requests', () => {
		const quick = job(read('.github/workflows/ci.yml'), 'static-checks');
		expect(quick).toContain('runs-on: ubuntu-latest');
		expect(quick).toContain('fetch-depth: 0');
		expect(quick).toContain('node-version: ${{ env.NODE_VERSION }}');
		expect(quick).toContain('bun install --frozen-lockfile');
		expect(quick).toContain('bunx svelte-kit sync');
		expect(quick).toMatch(/- name: Deep modules\n {8}id: deepcheck\n {8}if: \$\{\{ !cancelled\(\) && steps\.deps\.outcome == 'success' && github\.event_name == 'pull_request' \}\}\n {8}run: bun run deepcheck:ci -- "origin\/\$\{\{ github\.base_ref \}\}"\n/);
		expect(quick).not.toContain('continue-on-error');
	});

	it('bundles the quick checks into one job, each in a step that runs after another one failed', () => {
		const ci = read('.github/workflows/ci.yml');
		for (const name of ['changes', 'build', 'static-checks', 'unit-tests', 'e2e-tests', 'ui-screenshots']) job(ci, name);
		for (const name of ['fallow', 'fitness', 'deepcheck', 'testcheck']) expect(ci).not.toContain(`\n  ${name}:\n`);
		const quick = job(ci, 'static-checks');
		for (const run of ['bun run lint', 'bun run check', 'bun run type-check', 'bunx fallow audit --base', 'bun tools/fitness/fitness.ts', 'bun run deepcheck:ci', 'bun run testcheck:ci', 'script=tools/open-work/check-issues.mjs', 'git show "origin/$BASE_REF:$script"'])
			expect(quick).toContain(run);
		const checks = quick.slice(quick.indexOf('id: deps'));
		expect(checks.split('\n      - ').length - 1).toBe(checks.split("if: ${{ !cancelled() && steps.deps.outcome == 'success'").length);
	});

	it('names each failed quick check in the run summary', () => {
		const quick = job(read('.github/workflows/ci.yml'), 'static-checks');
		expect(quick).toMatch(/- name: Failed checks\n {8}if: failure\(\)\n {8}env:\n {10}STEPS: \$\{\{ toJSON\(steps\) \}\}\n/);
		expect(quick).toContain('select(.value.outcome == "failure")');
		expect(quick).toContain('$GITHUB_STEP_SUMMARY');
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
		expect(scan).toMatch(/uses: actions\/upload-artifact@[0-9a-f]{40} # v\d+/); // the version is Dependabot's, pinned by commit (#1378)
		expect(scan).not.toContain('--fail-on-score');
		// the path input goes after `--`, so a value like --output=... cannot become an option
		expect(scan).toContain('-- "$SCAN_PATH"');
		expect(scan).not.toContain('args+=("$SCAN_PATH")');
	});
});
