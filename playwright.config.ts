import { defineConfig } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

const testDir = defineBddConfig({
	paths: ['tests/e2e/features/**/*.feature'],
	require: ['tests/e2e/fixtures/test.ts', 'tests/e2e/steps/**/*.ts']
});

export default defineConfig({
	testDir,
	reporter: [
		['html'],
		cucumberReporter('html', { outputFile: 'cucumber-report/report.html' }),
		cucumberReporter('json', { outputFile: 'cucumber-report/report.json' })
	],
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		reuseExistingServer: !process.env.CI
	},
	use: {
		baseURL: 'http://localhost:4173',
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
