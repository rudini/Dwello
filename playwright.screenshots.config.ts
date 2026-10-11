import { defineConfig, type PlaywrightTestConfig } from '@playwright/test';
import e2e from './playwright.config';

type WebServer = Extract<PlaywrightTestConfig['webServer'], unknown[]>[number];
const servers = e2e.webServer as WebServer[];
const frontend = servers.find((server) => server.port === 3100)!;

// Screenshots of the pages a pull request changes (CI job ui-screenshots), on the same stack as the E2E tests.
// With UI_BASE_DIR (a checkout of the base branch) its frontend runs on 3200 against the same backend, so changes can be marked.
export default defineConfig({
	...e2e,
	testDir: 'tests/ui-screenshots',
	reporter: 'list',
	webServer: process.env.UI_BASE_DIR
		? [
				...servers,
				{
					...frontend,
					command: `cd "${process.env.UI_BASE_DIR}" && bun run dev -- --port 3200 --strictPort`,
					port: 3200
				}
			]
		: servers,
	use: { ...e2e.use, viewport: { width: 1440, height: 900 } },
	projects: [{ name: 'chromium', use: { browserName: 'chromium' } }]
});
