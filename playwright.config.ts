import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';
import { SETUP_CODE } from './tests/e2e/fixtures/fresh-installation';
import { E2E_JWT_SECRET } from './tests/e2e/fixtures/session';
import type { Driver } from './tests/e2e/fixtures/test';

const E2E_BACKEND_URL = 'http://localhost:3101';
const E2E_DATABASE_URL =
	process.env.E2E_DATABASE_URL || 'postgresql://dwello:dwello@localhost:5432/dwello_e2e';
// A second, empty instance (no buildings, no tenants) for the axe check of the 'empty' and 'first-use' states,
// which the shared database never shows while scenarios run in parallel
const E2E_EMPTY_DATABASE_URL = (() => {
	const url = new URL(E2E_DATABASE_URL);
	url.pathname = `${url.pathname}_empty`;
	return url.href;
})();
// The empty instance (3102, 3103) and the demo (3104) start only when this run's generated tests use them: the screen
// checks of accessibility.feature and sprachen-bildschirme.feature (tests/e2e/tasks/accessibility.ts) and demo.feature.
// bddgen writes only the features its tags select (a @wip run often none of these); without generated tests all start.
const generated = (feature: string) => `.features-gen/tests/e2e/features/${feature}.feature.spec.js`;
const usesExtraInstances =
	!existsSync('.features-gen') ||
	['accessibility', 'sprachen-bildschirme', 'demo', 'einrichtung'].some((feature) => existsSync(generated(feature)));
// The fresh installation (#577: no account, no provider, the KI model still downloading) for einrichtung.feature and
// the overview's state 'ki-model-loading'
const usesFreshInstallation =
	!existsSync('.features-gen') ||
	['einrichtung', 'accessibility', 'sprachen-bildschirme'].some((feature) => existsSync(generated(feature)));
const freshDatabaseUrl = (() => {
	const url = new URL(E2E_DATABASE_URL);
	url.pathname = `${url.pathname}_fresh`;
	return url.href;
})();

// The frontend's environment (sessions, sign-in test credentials, operator, gallery)
const frontendEnv = {
	PORT: '3100',
	ORIGIN: 'http://localhost:3100',
	BODY_SIZE_LIMIT: '11M', // as the Dockerfile: uploaded documents of up to 10 MB
	BACKEND_URL: E2E_BACKEND_URL,
	JWT_SECRET: E2E_JWT_SECRET,
	OAUTH_GOOGLE_CLIENT_ID: 'e2e-google-client',
	OAUTH_GOOGLE_CLIENT_SECRET: 'e2e-google-secret',
	OAUTH_GOOGLE_REDIRECT_URI: 'http://localhost:3100/auth/callback',
	OAUTH_MICROSOFT_CLIENT_ID: '',
	OAUTH_MICROSOFT_CLIENT_SECRET: '',
	OAUTH_MICROSOFT_REDIRECT_URI: '',
	// Only the Liegenschaftsverwalter of fixtures/session.ts may sign in (#51); every instance below spreads this
	ALLOWED_EMAILS: 'verwalter@example.com',
	// The version the build bakes in instead of `git describe` (navigation.feature, «Die Fusszeile zeigt die Version der App»)
	APP_VERSION: 'v1.4.0',
	// The operator that terms.feature expects under „Verfügbarkeit“
	OPERATOR_NAME: 'Muster Hosting AG',
	OPERATOR_ADDRESS: 'Bahnhofstrasse 1, 8001 Zürich',
	OPERATOR_CONTACT: 'betrieb@muster-hosting.ch',
	// The server's and the mail server's country privacy.feature expects (#458)
	// (a country name that reads the same in every language, so the language check finds no German in it)
	OPERATOR_SERVER_COUNTRY: 'Liechtenstein',
	MAIL_PROVIDER_NAME: 'Muster Mail AG',
	MAIL_PROVIDER_COUNTRY: 'Liechtenstein',
	// The component gallery the axe check visits (src/routes/gallery)
	UI_GALLERY: 'on',
	// The Gebäuderegister stand-in instead of api3.geo.admin.ch (backend/scripts/gwr-stub.ts)
	GEO_ADMIN_URL: 'http://127.0.0.1:2529'
};

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
		// On CI the log names each failed test and its error; the HTML reports keep the details
		...(process.env.CI ? [['list'] as const] : []),
		['html', { open: 'never' }],
		cucumberReporter('html', { outputFile: 'cucumber-report/report.html' })
	],
	// Run against the full stack on its own ports and its own database (dwello_e2e), recreated before every run,
	// so the development servers and the development database are never touched.
	// Expects: PostgreSQL on 5432; starts the mail catcher, the KI stand-in, the backend on 3101 and the frontend on 3100
	webServer: [
		{
			// Mail catcher: real SMTP server that keeps reminders sent by e-mail for the tests to read
			command: 'cd backend && bun run mail-catcher',
			port: 2526,
			reuseExistingServer: true,
			timeout: 30000
		},
		{
			// KI stand-in: the allocability check of a new category and the reading of uploaded invoice files (backend/scripts/llm-stub.ts)
			command: 'cd backend && bun run llm-stub',
			port: 2527,
			reuseExistingServer: true,
			timeout: 30000
		},
		{
			// Gebäuderegister stand-in: the address search of «Neues Gebäude» (backend/scripts/gwr-stub.ts)
			command: 'cd backend && bun run gwr-stub',
			port: 2529,
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
				// The KI stand-in, whatever the developer's .env sets: it categorizes only the upload scenarios' invoices
				LLM_BASE_URL: 'http://127.0.0.1:2527/v1'
			}
		},
		{
			// Frontend (SvelteKit) built and started like in production (adapter-node), talking to the E2E backend, so the
			// acceptance tests check what is shipped. Sessions are real JWTs signed with the same secret (fixtures/session.ts);
			// Google sign-in is configured with test credentials and never completes.
			// The build runs locally only when the frontend changed since the last E2E build (tools/e2e/build-if-changed.mjs)
			command: 'node tools/e2e/build-if-changed.mjs bun run build && node build',
			port: 3100,
			reuseExistingServer: !process.env.CI,
			timeout: 180000,
			env: frontendEnv
		},
		...(usesExtraInstances
			? [
				{
					command: 'cd backend && bun run llm-stub',
					port: 2532,
					reuseExistingServer: false,
					timeout: 30000,
					env: { LLM_STUB_PORT: '2532', LLM_STUB_PULL: 'fail' }
				},
				{
					// Empty backend for the axe check of 'empty', 'first-use', 'fresh-installation' and 'setup-error'
					// (tests/e2e/tasks/accessibility.ts)
					command: 'cd backend && bun run e2e-db && bun run src/index.ts',
					port: 3103,
					reuseExistingServer: false,
					timeout: 60000,
					env: {
						PORT: '3103',
						DATABASE_URL: E2E_EMPTY_DATABASE_URL,
						JWT_SECRET: E2E_JWT_SECRET,
						// an Ollama whose model download fails: the overview's state 'ki-model-failed' (#577, code review C-3)
						LLM_BASE_URL: 'http://127.0.0.1:2532/v1'
					}
				},
				{
					// The same build as on 3100 (started after it), talking to the empty backend
					command: 'node build',
					port: 3102,
					reuseExistingServer: !process.env.CI,
					timeout: 60000,
					env: {
						...frontendEnv,
						PORT: '3102',
						ORIGIN: 'http://localhost:3102',
						BACKEND_URL: 'http://localhost:3103',
						// no provider and an account never made: the states 'fresh-installation' and 'setup-error' (#577)
						OAUTH_GOOGLE_CLIENT_ID: '',
						OAUTH_GOOGLE_CLIENT_SECRET: '',
						OAUTH_GOOGLE_REDIRECT_URI: ''
					}
				},
				{
					// The same build as the public demo (DEMO=on), talking to the main backend: tests/e2e/features/demo.feature
					command: 'node build',
					port: 3104,
					reuseExistingServer: !process.env.CI,
					timeout: 60000,
					env: { ...frontendEnv, PORT: '3104', ORIGIN: 'http://localhost:3104', DEMO: 'on' }
				}
				]
			: []),
		...(usesFreshInstallation
			? [
				{
					// An Ollama that is still downloading the model (backend/scripts/llm-stub.ts, LLM_STUB_PULL)
					command: 'cd backend && bun run llm-stub',
					port: 2530,
					reuseExistingServer: false,
					timeout: 30000,
					env: { LLM_STUB_PORT: '2530', LLM_STUB_PULL: 'on' }
				},
				{
					command: 'cd backend && bun run e2e-db && bun run src/index.ts',
					port: 3105,
					reuseExistingServer: false,
					timeout: 60000,
					env: {
						PORT: '3105',
						DATABASE_URL: freshDatabaseUrl,
						JWT_SECRET: E2E_JWT_SECRET,
						SETUP_CODE,
						LLM_BASE_URL: 'http://127.0.0.1:2530/v1'
					}
				},
				{
					// The same build as on 3100 (started after it), without any provider, talking to the fresh backend
					command: 'node build',
					port: 3106,
					reuseExistingServer: !process.env.CI,
					timeout: 60000,
					env: {
						...frontendEnv,
						PORT: '3106',
						ORIGIN: 'http://localhost:3106',
						BACKEND_URL: 'http://localhost:3105',
						OAUTH_GOOGLE_CLIENT_ID: '',
						OAUTH_GOOGLE_CLIENT_SECRET: '',
						OAUTH_GOOGLE_REDIRECT_URI: ''
					}
				}
				]
			: [])
	],
	use: {
		baseURL: 'http://localhost:3100',
		// A click on a missing element fails after 10 s naming the action, not only at the test timeout
		actionTimeout: 10000,
		locale: 'de-CH',
		screenshot: 'only-on-failure',
		video: 'off',
		// kept for every failing test: without retries, «on-first-retry» never recorded one (O-47)
		trace: 'retain-on-failure'
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
