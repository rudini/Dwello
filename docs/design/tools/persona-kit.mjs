// Opens the running Dwello (http://localhost:3300, demo data) in a signed-in Chromium, as a real user would see it.
// Usage (from any directory): import { open, shot } from '<this file>';
//   const { page, close } = await open({ viewport: 'mobile' | 'desktop', zoom: 1.5 });
//   await page.goto('/dashboard'); await shot(page, '/tmp/persona-x/01-start.png'); await close();
/* global TextEncoder, URL, crypto -- Node 20 globals */
import { createRequire } from 'module';
// Resolved from this file, so it works wherever the repo is checked out; import it in place, do not copy it.
const require = createRequire(new URL('../../../package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const { SignJWT } = require('jose');

const BASE = 'http://localhost:3300';
const SECRET = 'persona-secret-key-at-least-32-characters-long';
const sizes = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };

export async function open({ viewport = 'desktop', zoom = 1, keyboardOnly = false } = {}) {
	const token = await new SignJWT({ email: 'verwalter@example.com', name: 'Vera Verwalter', provider: 'google' })
		.setProtectedHeader({ alg: 'HS256' })
		.setSubject('persona')
		.setIssuer('dwello')
		.setAudience('dwello-app')
		.setIssuedAt()
		.setExpirationTime('8h')
		.sign(new TextEncoder().encode(SECRET));
	const browser = await chromium.launch();
	const context = await browser.newContext({
		baseURL: BASE,
		// Browser zoom (e.g. 1.5 = 150 %): the page gets a smaller CSS width, drawn larger
		viewport: { width: Math.round(sizes[viewport].width / zoom), height: Math.round(sizes[viewport].height / zoom) },
		deviceScaleFactor: zoom,
		locale: 'de-CH',
		isMobile: viewport === 'mobile',
		hasTouch: viewport === 'mobile'
	});
	await context.addCookies([
		{ name: 'dwello_session', value: token, url: BASE },
		{ name: 'dwello_xsrf', value: crypto.randomUUID(), url: BASE }
	]);
	const page = await context.newPage();
	return { page, keyboardOnly, close: () => browser.close() };
}

// Full-page screenshot; returns the path so it can be listed in the report
export async function shot(page, path) {
	await page.screenshot({ path, fullPage: true });
	return path;
}

// What a screen reader would announce: the accessibility tree as text
export async function readOut(page) {
	return page.locator('body').ariaSnapshot();
}
