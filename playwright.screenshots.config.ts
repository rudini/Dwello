import { defineConfig } from '@playwright/test';
import e2e from './playwright.config';

// Screenshots of the pages a pull request changes (CI job ui-screenshots), on the same stack as the E2E tests
export default defineConfig({
	...e2e,
	testDir: 'tests/ui-screenshots',
	reporter: 'list',
	use: { ...e2e.use, viewport: { width: 1440, height: 900 } },
	projects: [{ name: 'chromium', use: { browserName: 'chromium' } }]
});
