import { defineConfig } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';
import { E2E_JWT_SECRET } from './tests/e2e/fixtures/session';
import type { Driver } from './tests/e2e/fixtures/test';

const E2E_BACKEND_URL = 'http://localhost:3101';
const E2E_DATABASE_URL =
	process.env.E2E_DATABASE_URL || 'postgresql://dwello:dwello@localhost:5432/dwello_e2e';

const testDir = defineBddConfig({
	paths: ['tests/e2e/features/**/*.feature'],
	require: ['tests/e2e/fixtures/test.ts', 'tests/e2e/steps/**/*.ts'],
	tags: 'not @wip'
});

export default defineConfig<{ driver: Driver }>({
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
	// Run against the full stack on its own ports and its own database (dwello_e2e), recreated before every run,
	// so the development servers and the development database are never touched.
	// Expects: PostgreSQL on 5432; starts the mail catcher, the backend on 3101 and the frontend on 3100
	webServer: [
		{
			// Mail catcher: real SMTP server that keeps reminders sent by e-mail for the tests to read
			command: 'cd backend && bun run mail-catcher',
			port: 2526,
			reuseExistingServer: true,
			timeout: 30000
		},
		{
			// Backend server (ElysiaJS) on a fresh E2E database, sending e-mail to the mail catcher
			command: 'cd backend && bun run e2e-db && bun run src/index.ts',
			port: 3101,
			reuseExistingServer: false,
			timeout: 60000,
			env: {
				PORT: '3101',
				DATABASE_URL: E2E_DATABASE_URL,
				JWT_SECRET: E2E_JWT_SECRET,
				MAIL_TRANSPORT: 'smtp',
				MAIL_FROM: 'verwaltung@dwello.test',
				SMTP_HOST: '127.0.0.1',
				SMTP_PORT: '2525',
				// No KI, as in CI, whatever the developer's .env sets: nothing listens on port 9
				LLM_BASE_URL: 'http://127.0.0.1:9/v1'
			}
		},
		{
			// Frontend (SvelteKit) built and started like in production (adapter-node), talking to the E2E backend, so the
			// acceptance tests check what is shipped. Sessions are real JWTs signed with the same secret (fixtures/session.ts);
			// Google sign-in is configured with test credentials and never completes.
			command: 'npm run build && node build',
			port: 3100,
			reuseExistingServer: !process.env.CI,
			timeout: 180000,
			env: {
				PORT: '3100',
				ORIGIN: 'http://localhost:3100',
				BACKEND_URL: E2E_BACKEND_URL,
				JWT_SECRET: E2E_JWT_SECRET,
				OAUTH_GOOGLE_CLIENT_ID: 'e2e-google-client',
				OAUTH_GOOGLE_CLIENT_SECRET: 'e2e-google-secret',
				OAUTH_GOOGLE_REDIRECT_URI: 'http://localhost:3100/auth/callback',
				OAUTH_MICROSOFT_CLIENT_ID: '',
				OAUTH_MICROSOFT_CLIENT_SECRET: '',
				OAUTH_MICROSOFT_REDIRECT_URI: '',
				// The operator that terms.feature expects under „Verfügbarkeit“
				OPERATOR_NAME: 'Muster Hosting AG',
				OPERATOR_ADDRESS: 'Bahnhofstrasse 1, 8001 Zürich',
				OPERATOR_CONTACT: 'betrieb@muster-hosting.ch'
			}
		}
	],
	use: {
		baseURL: 'http://localhost:3100',
		locale: 'de-CH',
		screenshot: 'only-on-failure',
		video: 'off',
		trace: 'on-first-retry'
	},
	projects: [
		{
			// The @api scenarios once more through the backend API instead of the browser (API protocol driver)
			name: 'api',
			grep: /@api/,
			use: { browserName: 'chromium', driver: 'api' }
		},
		{
			name: 'chromium',
			use: {
				browserName: 'chromium'
			}
		},
		{
			name: 'firefox',
			grepInvert: /@a11y/, // the axe check runs in Chromium only
			use: {
				browserName: 'firefox'
			}
		},
		{
			name: 'webkit',
			grepInvert: /@a11y/,
			use: {
				browserName: 'webkit'
			}
		}
	]
});
