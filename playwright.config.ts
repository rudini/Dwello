import { defineConfig } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

const testDir = defineBddConfig({
	paths: ['tests/e2e/features/**/*.feature'],
	require: ['tests/e2e/fixtures/test.ts', 'tests/e2e/steps/**/*.ts'],
	tags: 'not @wip'
});

export default defineConfig({
	testDir,
	reporter: [
		['html'],
		cucumberReporter('html', { outputFile: 'cucumber-report/report.html' }),
		cucumberReporter('json', { outputFile: 'cucumber-report/report.json' })
	],
	// Run against the full stack (frontend + backend + database)
	// Expects: PostgreSQL on 5432, Backend on 3001, Frontend on 3000
	webServer: [
		{
			// Backend server (ElysiaJS)
			command: 'cd backend && bun run src/index.ts',
			port: 3001,
			reuseExistingServer: true,
			timeout: 30000
		},
		{
			// Frontend dev server (SvelteKit)
			command: 'npm run dev',
			port: 3000,
			reuseExistingServer: true,
			timeout: 30000
		}
	],
	use: {
		baseURL: 'http://localhost:3000',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		trace: 'retain-on-failure'
	},
	projects: [
		{
			name: 'chromium',
			use: {
				browserName: 'chromium'
			}
		},
		{
			name: 'firefox',
			use: {
				browserName: 'firefox'
			}
		},
		{
			name: 'webkit',
			use: {
				browserName: 'webkit'
			}
		}
	]
});
