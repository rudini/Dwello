import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ci = readFileSync(fileURLToPath(new URL('../../.github/workflows/ci.yml', import.meta.url)), 'utf8');

/** The pattern the job `changes` matches the changed files against for the output `docker` (#1241) */
function dockerPattern(): string {
	const line = ci.split('\n').find((l) => l.includes('echo "docker=$(grep -qE'));
	expect(line, 'the docker output of the job changes').toBeDefined();
	return line!.match(/grep -qE '([^']+)'/)![1];
}

/** Whether a pull request that changes these files builds the images, as the step decides it with grep */
const buildsImages = (...files: string[]) =>
	spawnSync('grep', ['-qE', dockerPattern()], { input: files.join('\n') + '\n' }).status === 0;

describe('Docker images on pull requests (#1241)', () => {
	it('skips the images when only app code, tests or texts changed', () => {
		expect(
			buildsImages(
				'src/routes/buildings/+page.svelte',
				'backend/src/routes/invoices.ts',
				'backend/src/services/statement.service.ts',
				'tests/e2e/features/buildings.feature',
				'messages/de.json',
				'tools/fitness/fitness.ts'
			)
		).toBe(false);
	});

	it.each([
		'Dockerfile',
		'.dockerignore',
		'backend/Dockerfile',
		'backend/.dockerignore',
		'compose.yaml',
		'docker-compose.prod.yml',
		'docker/init-secrets.sh',
		'vite.config.ts',
		'svelte.config.js',
		'paraglide.config.ts',
		'tsconfig.json',
		'project.inlang/settings.json',
		'src/lib/version.ts',
		'package.json',
		'bun.lock',
		'backend/package.json',
		'backend/bun.lock',
		'backend/migrations/0042_new_table.sql',
		'backend/scripts/migrate.ts',
		'backend/src/db/migrate.ts',
		'backend/src/services/backup.service.ts',
		'tools/fitness/compose-update-check.sh',
		'tools/fitness/data-totals.sh',
		'.github/workflows/ci.yml'
	])('builds the images when %s changed', (file) => {
		expect(buildsImages('src/routes/+page.svelte', file)).toBe(true);
	});

	it('builds them on every push to main, nightly and by hand, and gates the job on the output', () => {
		expect(ci).toMatch(/if \[ "\$\{\{ github\.event_name \}\}" != pull_request \]; then\n\s+echo "backend=true".*echo "docker=true" >> "\$GITHUB_OUTPUT" && exit 0/);
		const docker = ci.slice(ci.indexOf('\n  docker:\n'), ci.indexOf('\n  static-checks:\n'));
		expect(docker).toContain("if: needs.changes.outputs.docker == 'true'");
	});
});
