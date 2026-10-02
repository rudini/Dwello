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
			// Mail catcher: real SMTP server that keeps reminders sent by e-mail for the tests to read
			command: 'cd backend && bun run mail-catcher',
			port: 2526,
			reuseExistingServer: true,
			timeout: 30000
		},
		{
			// Backend server (ElysiaJS), sending e-mail to the mail catcher
			command: 'cd backend && bun run src/index.ts',
			port: 3001,
			reuseExistingServer: true,
			timeout: 30000,
			env: {
				MAIL_TRANSPORT: 'smtp',
				MAIL_FROM: 'verwaltung@dwello.test',
				SMTP_HOST: '127.0.0.1',
				SMTP_PORT: '2525'
			}
		},
		{
			// Frontend dev server (SvelteKit) with E2E test mode enabled
			command: 'E2E_TEST_MODE=true npm run dev',
			port: 3000,
			reuseExistingServer: !process.env.CI,
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
