import { defineConfig } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

const testDir = defineBddConfig({
	paths: ['tests/e2e/features/**/*.feature'],
	require: ['tests/e2e/fixtures/test.ts', 'tests/e2e/steps/**/*.ts'],
	tags: 'not @wip'
});

export default defineConfig({
	testDir,
	// Run tests in parallel for speed
	fullyParallel: true,
	workers: process.env.CI ? 2 : 4,
	// Shorter timeout for faster failure detection
	timeout: 30000,
	expect: {
		timeout: 5000
	},
	reporter: [
		['html', { open: 'never' }],
		cucumberReporter('html', { outputFile: 'cucumber-report/report.html' })
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
		video: 'off',
		trace: 'on-first-retry'
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
