import { chromium, type Page, type BrowserContext } from 'playwright';
import * as jose from 'jose';

interface TestResult {
	page: string;
	action: string;
	status: 'success' | 'error' | 'warning';
	message: string;
	screenshot?: string;
}

const results: TestResult[] = [];
let screenshotCounter = 0;

// JWT Configuration (matches the app's config)
const JWT_SECRET = 'dev-jwt-secret-key-for-local-development-only-change-in-production';
const JWT_ISSUER = 'dwello';
const JWT_AUDIENCE = 'dwello-app';

async function generateMockJwt(): Promise<string> {
	const secret = new TextEncoder().encode(JWT_SECRET);

	const jwt = await new jose.SignJWT({
		sub: 'test-user-001',
		email: 'test@example.com',
		name: 'Test User',
		provider: 'google',
		picture: undefined
	})
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setIssuer(JWT_ISSUER)
		.setAudience(JWT_AUDIENCE)
		.setExpirationTime('1h')
		.sign(secret);

	return jwt;
}

async function takeScreenshot(page: Page, name: string): Promise<string> {
	const filename = `screenshot-${++screenshotCounter}-${name}.png`;
	await page.screenshot({ path: `tests/screenshots/${filename}`, fullPage: true });
	return filename;
}

async function logResult(result: TestResult) {
	results.push(result);
	const icon = result.status === 'success' ? '✅' : result.status === 'error' ? '❌' : '⚠️';
	console.log(`${icon} [${result.page}] ${result.action}: ${result.message}`);
}

async function checkForErrors(page: Page, context: string): Promise<boolean> {
	// Check for visible error messages on page
	const pageContent = await page.content();

	if (pageContent.includes('404') && pageContent.includes('Not found')) {
		await logResult({
			page: context,
			action: 'Page Load',
			status: 'error',
			message: '404 Not Found error',
			screenshot: await takeScreenshot(page, 'error-404')
		});
		return true;
	}

	if (pageContent.includes('500') && pageContent.includes('Internal')) {
		await logResult({
			page: context,
			action: 'Page Load',
			status: 'error',
			message: '500 Internal Server Error',
			screenshot: await takeScreenshot(page, 'error-500')
		});
		return true;
	}

	// Check for Svelte error boundaries
	if (pageContent.includes('Error:') || pageContent.includes('SvelteKitError')) {
		await logResult({
			page: context,
			action: 'Page Load',
			status: 'error',
			message: 'Application error detected',
			screenshot: await takeScreenshot(page, `error-${context.replace(/\s+/g, '-').toLowerCase()}`)
		});
		return true;
	}

	return false;
}

async function testPage(page: Page, url: string, pageName: string) {
	console.log(`\n📄 Testing: ${pageName} (${url})`);

	try {
		await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
		await page.waitForTimeout(500); // Allow animations to settle

		const hasError = await checkForErrors(page, pageName);
		if (hasError) return;

		// Check if we're still on login page (auth failed)
		const currentUrl = page.url();
		if (currentUrl.includes('/login') && !url.includes('/login')) {
			await logResult({
				page: pageName,
				action: 'Page Load',
				status: 'error',
				message: 'Redirected to login - authentication may have failed',
				screenshot: await takeScreenshot(page, `auth-failed-${pageName.replace(/\s+/g, '-').toLowerCase()}`)
			});
			return;
		}

		await logResult({
			page: pageName,
			action: 'Page Load',
			status: 'success',
			message: 'Page loaded successfully',
			screenshot: await takeScreenshot(page, pageName.replace(/\s+/g, '-').toLowerCase())
		});

		// Find and test all interactive elements
		await testLinks(page, pageName);
		await testButtons(page, pageName);
		await testForms(page, pageName);
		await testSelectOptions(page, pageName);

	} catch (error) {
		await logResult({
			page: pageName,
			action: 'Page Load',
			status: 'error',
			message: `Failed to load: ${error}`,
			screenshot: await takeScreenshot(page, `error-${pageName.replace(/\s+/g, '-').toLowerCase()}`)
		});
	}
}

async function testLinks(page: Page, pageName: string) {
	const links = await page.locator('a[href]').all();
	const testedUrls = new Set<string>();

	for (const link of links) {
		try {
			const href = await link.getAttribute('href');
			const text = await link.textContent();
			const isVisible = await link.isVisible();

			if (!href || testedUrls.has(href) || !isVisible) continue;
			if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;

			testedUrls.add(href);

			await logResult({
				page: pageName,
				action: `Link Found`,
				status: 'success',
				message: `${text?.trim().substring(0, 40) || 'No text'} → ${href}`
			});

		} catch {
			// Link might have been removed from DOM
		}
	}
}

async function testButtons(page: Page, pageName: string) {
	const buttons = await page.locator('button').all();

	for (const button of buttons) {
		try {
			const text = await button.textContent();
			const isVisible = await button.isVisible();
			const isDisabled = await button.isDisabled();
			const type = await button.getAttribute('type');

			if (!isVisible) continue;

			if (isDisabled) {
				await logResult({
					page: pageName,
					action: `Button: ${text?.trim().substring(0, 30) || 'No text'}`,
					status: 'warning',
					message: `Button is disabled`
				});
				continue;
			}

			await logResult({
				page: pageName,
				action: `Button Found`,
				status: 'success',
				message: `${text?.trim().substring(0, 30) || 'No text'} (type: ${type || 'button'})`
			});

		} catch {
			// Button might have been removed from DOM
		}
	}
}

async function testForms(page: Page, pageName: string) {
	const forms = await page.locator('form').all();

	for (let i = 0; i < forms.length; i++) {
		const form = forms[i];
		try {
			const inputs = await form.locator('input, select, textarea').all();

			await logResult({
				page: pageName,
				action: `Form ${i + 1}`,
				status: 'success',
				message: `Found form with ${inputs.length} input(s)`
			});

		} catch {
			// Form might have been removed
		}
	}
}

async function testSelectOptions(page: Page, pageName: string) {
	const selects = await page.locator('select').all();

	for (const select of selects) {
		try {
			const isVisible = await select.isVisible();
			if (!isVisible) continue;

			const id = await select.getAttribute('id');
			const name = await select.getAttribute('name');
			const options = await select.locator('option').all();

			let disabledCount = 0;
			for (const option of options) {
				const disabled = await option.getAttribute('disabled');
				if (disabled !== null) disabledCount++;
			}

			await logResult({
				page: pageName,
				action: `Select: ${id || name || 'unnamed'}`,
				status: 'success',
				message: `${options.length} options (${disabledCount} disabled)`
			});

		} catch {
			// Select might have been removed
		}
	}
}

async function testNavigation(page: Page, context: BrowserContext, baseUrl: string) {
	console.log('\n' + '='.repeat(60));
	console.log('🔗 Testing Navigation Flows\n');

	// Test clicking through buildings list
	await page.goto(`${baseUrl}/buildings`);
	await page.waitForLoadState('networkidle');

	const buildingLinks = await page.locator('a[href^="/buildings/building-"]').all();
	console.log(`Found ${buildingLinks.length} building links to test`);

	for (let i = 0; i < Math.min(buildingLinks.length, 3); i++) {
		try {
			await page.goto(`${baseUrl}/buildings`);
			await page.waitForLoadState('networkidle');

			const link = page.locator('a[href^="/buildings/building-"]').nth(i);
			const href = await link.getAttribute('href');
			const text = await link.textContent();

			await link.click();
			await page.waitForLoadState('networkidle');

			const currentUrl = page.url();
			if (currentUrl.includes('/login')) {
				await logResult({
					page: 'Navigation',
					action: `Building Link ${i + 1}`,
					status: 'error',
					message: `Redirected to login instead of ${href}`
				});
			} else {
				await logResult({
					page: 'Navigation',
					action: `Building Link ${i + 1}`,
					status: 'success',
					message: `${text?.trim().substring(0, 30)} → ${currentUrl}`
				});
				await takeScreenshot(page, `nav-building-${i + 1}`);
			}
		} catch (error) {
			await logResult({
				page: 'Navigation',
				action: `Building Link ${i + 1}`,
				status: 'error',
				message: `Failed: ${error}`
			});
		}
	}

	// Test clicking through heating profiles
	await page.goto(`${baseUrl}/config/heating-profiles`);
	await page.waitForLoadState('networkidle');

	const profileLinks = await page.locator('a[href^="/config/heating-profiles/hp-"]').all();
	console.log(`Found ${profileLinks.length} heating profile links to test`);

	for (let i = 0; i < Math.min(profileLinks.length, 3); i++) {
		try {
			await page.goto(`${baseUrl}/config/heating-profiles`);
			await page.waitForLoadState('networkidle');

			const link = page.locator('a[href^="/config/heating-profiles/hp-"]').nth(i);

			await link.click();
			await page.waitForLoadState('networkidle');

			const currentUrl = page.url();
			await logResult({
				page: 'Navigation',
				action: `Heating Profile Link ${i + 1}`,
				status: 'success',
				message: `Navigated to ${currentUrl}`
			});
			await takeScreenshot(page, `nav-heating-profile-${i + 1}`);
		} catch (error) {
			await logResult({
				page: 'Navigation',
				action: `Heating Profile Link ${i + 1}`,
				status: 'error',
				message: `Failed: ${error}`
			});
		}
	}
}

async function testHeatingProfileEdit(page: Page, baseUrl: string) {
	console.log('\n🔥 Testing Heating Profile Edit\n');

	await page.goto(`${baseUrl}/config/heating-profiles/hp-custom-1/edit`);
	await page.waitForLoadState('networkidle');
	await page.waitForTimeout(500);

	// Check if page loaded correctly
	const pageContent = await page.content();
	if (pageContent.includes('/login') || !pageContent.includes('Heizprofil bearbeiten')) {
		await logResult({
			page: 'Heating Profile Edit',
			action: 'Page Access',
			status: 'error',
			message: 'Could not access edit page'
		});
		return;
	}

	// Test changing a value
	try {
		const januaryInput = page.locator('input[name="january"]');
		await januaryInput.waitFor({ timeout: 5000 });

		const currentValue = await januaryInput.inputValue();
		console.log(`   Current January value: ${currentValue}`);

		// Change the value
		await januaryInput.fill('20');
		await page.waitForTimeout(300);

		// Check if sum updated
		const sumElement = page.locator('text=/Summe:.*\\d+%/').first();
		const sumText = await sumElement.textContent();

		await logResult({
			page: 'Heating Profile Edit',
			action: 'Change January Value',
			status: 'success',
			message: `Changed from ${currentValue} to 20, ${sumText}`
		});

		// Check sum color (should be red if not 100%)
		const sumSpan = page.locator('.font-semibold').filter({ hasText: '%' }).first();
		const sumClasses = await sumSpan.getAttribute('class');

		const isRed = sumClasses?.includes('text-critical');
		const isGreen = sumClasses?.includes('text-positive');

		await logResult({
			page: 'Heating Profile Edit',
			action: 'Sum Color Check',
			status: isRed || isGreen ? 'success' : 'warning',
			message: `Sum color: ${isRed ? 'red' : isGreen ? 'green' : 'unknown'} (classes: ${sumClasses?.substring(0, 50)})`
		});

		await takeScreenshot(page, 'heating-edit-changed');

		// Test using spinner buttons
		await januaryInput.fill(currentValue);
		await page.waitForTimeout(200);

		// Click the up arrow on the input
		await januaryInput.click();
		await page.keyboard.press('ArrowUp');
		await page.waitForTimeout(200);

		const newValue = await januaryInput.inputValue();
		await logResult({
			page: 'Heating Profile Edit',
			action: 'Spinner Button Test',
			status: parseInt(newValue) === parseInt(currentValue) + 1 ? 'success' : 'warning',
			message: `After ArrowUp: ${currentValue} → ${newValue}`
		});

	} catch (error) {
		await logResult({
			page: 'Heating Profile Edit',
			action: 'Input Test',
			status: 'error',
			message: `Failed: ${error}`
		});
		await takeScreenshot(page, 'heating-edit-error');
	}
}

async function testConfigPage(page: Page, baseUrl: string) {
	console.log('\n⚙️ Testing Config Page\n');

	await page.goto(`${baseUrl}/config`);
	await page.waitForLoadState('networkidle');
	await page.waitForTimeout(500);

	try {
		const heatingSelect = page.locator('#heatingProfile');
		await heatingSelect.waitFor({ timeout: 5000 });

		const options = await heatingSelect.locator('option').all();

		console.log('   Heating Profile Options:');
		let validCount = 0;
		let disabledCount = 0;

		for (const option of options) {
			const text = await option.textContent();
			const disabled = await option.getAttribute('disabled');

			if (disabled !== null) {
				disabledCount++;
				console.log(`   ❌ ${text} (disabled)`);
			} else {
				validCount++;
				console.log(`   ✅ ${text}`);
			}
		}

		await logResult({
			page: 'Config',
			action: 'Heating Profile Dropdown',
			status: 'success',
			message: `${options.length} options: ${validCount} valid, ${disabledCount} disabled (not 100%)`
		});

		// Test selecting a valid option
		const validOption = await heatingSelect.locator('option:not([disabled])').nth(1);
		const validValue = await validOption.getAttribute('value');

		if (validValue) {
			await heatingSelect.selectOption(validValue);
			await logResult({
				page: 'Config',
				action: 'Select Valid Profile',
				status: 'success',
				message: `Selected: ${validValue}`
			});
		}

		await takeScreenshot(page, 'config-heating-dropdown');

	} catch (error) {
		await logResult({
			page: 'Config',
			action: 'Heating Profile Dropdown',
			status: 'error',
			message: `Failed: ${error}`
		});
	}
}

async function runExploratoryTests() {
	console.log('🚀 Starting Exploratory Tests (with Mock Authentication)\n');
	console.log('='.repeat(60));

	// Create screenshots directory
	const fs = await import('fs');
	if (!fs.existsSync('tests/screenshots')) {
		fs.mkdirSync('tests/screenshots', { recursive: true });
	}

	// Generate mock JWT
	console.log('🔐 Generating mock JWT...');
	const mockJwt = await generateMockJwt();
	console.log('✅ Mock JWT generated\n');

	const browser = await chromium.launch({ headless: true });
	const context = await browser.newContext({
		viewport: { width: 1280, height: 720 }
	});

	// Set the session cookie before any navigation
	await context.addCookies([
		{
			name: 'dwello_session',
			value: mockJwt,
			domain: 'localhost',
			path: '/',
			httpOnly: true,
			secure: false,
			sameSite: 'Lax'
		},
		{
			name: 'dwello_xsrf',
			value: 'test-xsrf-token-12345',
			domain: 'localhost',
			path: '/',
			httpOnly: false,
			secure: false,
			sameSite: 'Lax'
		}
	]);

	const page = await context.newPage();

	// Listen for console errors (but don't spam)
	const consoleErrors: string[] = [];
	page.on('console', msg => {
		if (msg.type() === 'error' && !msg.text().includes('401')) {
			consoleErrors.push(msg.text());
			if (consoleErrors.length <= 5) {
				console.log(`   🔴 Console Error: ${msg.text().substring(0, 100)}`);
			}
		}
	});

	// Listen for page errors
	page.on('pageerror', error => {
		console.log(`   🔴 Page Error: ${error.message}`);
	});

	const baseUrl = 'http://localhost:3000';

	// Test all main pages
	const pagesToTest = [
		{ url: '/', name: 'Dashboard' },
		{ url: '/buildings', name: 'Buildings List' },
		{ url: '/buildings/building-001', name: 'Building Detail' },
		{ url: '/buildings/building-001/edit', name: 'Building Edit' },
		{ url: '/buildings/building-002', name: 'Building Detail 2' },
		{ url: '/buildings/building-003', name: 'Building Detail 3' },
		{ url: '/buildings/building-004', name: 'Building Detail 4' },
		{ url: '/buildings/new', name: 'New Building' },
		{ url: '/apartments', name: 'Apartments List' },
		{ url: '/apartments/apt-001', name: 'Apartment Detail' },
		{ url: '/tenants', name: 'Tenants List' },
		{ url: '/tenants/tenant-001', name: 'Tenant Detail' },
		{ url: '/contracts', name: 'Contracts List' },
		{ url: '/contracts/contract-001', name: 'Contract Detail' },
		{ url: '/invoices', name: 'Invoices List' },
		{ url: '/statements', name: 'Statements List' },
		{ url: '/config', name: 'Config Page' },
		{ url: '/config/categories', name: 'Categories' },
		{ url: '/config/categories/new', name: 'New Category' },
		{ url: '/config/heating-profiles', name: 'Heating Profiles List' },
		{ url: '/config/heating-profiles/hp-standard', name: 'Heating Profile Detail (Standard)' },
		{ url: '/config/heating-profiles/hp-mittelland', name: 'Heating Profile Detail (Mittelland)' },
		{ url: '/config/heating-profiles/hp-mountain', name: 'Heating Profile Detail (Bergregion)' },
		{ url: '/config/heating-profiles/hp-tessin', name: 'Heating Profile Detail (Tessin)' },
		{ url: '/config/heating-profiles/hp-custom-1', name: 'Heating Profile Detail (Custom)' },
		{ url: '/config/heating-profiles/hp-custom-1/edit', name: 'Heating Profile Edit' },
		{ url: '/config/heating-profiles/new', name: 'New Heating Profile' },
		{ url: '/config/distribution-keys', name: 'Distribution Keys' },
		{ url: '/config/distribution-keys/new', name: 'New Distribution Key' },
	];

	for (const pageInfo of pagesToTest) {
		await testPage(page, `${baseUrl}${pageInfo.url}`, pageInfo.name);
	}

	// Test navigation flows
	await testNavigation(page, context, baseUrl);

	// Test heating profile edit interactions
	await testHeatingProfileEdit(page, baseUrl);

	// Test config page
	await testConfigPage(page, baseUrl);

	// Close browser
	await browser.close();

	// Print summary
	console.log('\n' + '='.repeat(60));
	console.log('📊 TEST SUMMARY\n');

	const successCount = results.filter(r => r.status === 'success').length;
	const errorCount = results.filter(r => r.status === 'error').length;
	const warningCount = results.filter(r => r.status === 'warning').length;

	console.log(`✅ Success: ${successCount}`);
	console.log(`❌ Errors: ${errorCount}`);
	console.log(`⚠️ Warnings: ${warningCount}`);

	if (errorCount > 0) {
		console.log('\n❌ ERRORS FOUND:\n');
		results.filter(r => r.status === 'error').forEach(r => {
			console.log(`   [${r.page}] ${r.action}: ${r.message}`);
			if (r.screenshot) console.log(`      Screenshot: tests/screenshots/${r.screenshot}`);
		});
	}

	if (warningCount > 0) {
		console.log('\n⚠️ WARNINGS:\n');
		results.filter(r => r.status === 'warning').forEach(r => {
			console.log(`   [${r.page}] ${r.action}: ${r.message}`);
		});
	}

	if (consoleErrors.length > 5) {
		console.log(`\n🔴 Additional console errors suppressed: ${consoleErrors.length - 5}`);
	}

	console.log('\n📸 Screenshots saved to: tests/screenshots/');
}

runExploratoryTests().catch(console.error);
