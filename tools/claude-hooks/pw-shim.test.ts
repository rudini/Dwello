import { spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, realpathSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SHIM = fileURLToPath(new URL('../../.claude/hooks/pw-shim.sh', import.meta.url));

/** An image folder with build 1243 whose executables lie at the given paths */
function image(files: string[]): string {
	const installed = mkdtempSync(join(tmpdir(), 'pw-image-'));
	for (const file of files) {
		mkdirSync(dirname(join(installed, file)), { recursive: true });
		writeFileSync(join(installed, file), '#!/bin/sh\n');
		chmodSync(join(installed, file), 0o755);
	}
	return installed;
}

const run = (installed: string) => {
	const shim = join(mkdtempSync(join(tmpdir(), 'pw-shim-')), 'shim');
	const result = spawnSync('bash', [SHIM, installed, '1248', shim], { encoding: 'utf8' });
	const target = (path: string) => (existsSync(join(shim, path)) ? realpathSync(join(shim, path)) : undefined);
	return {
		...result,
		shim,
		headless: target('chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell'),
		chrome: target('chromium-1248/chrome-linux64/chrome')
	};
};

// #792: the session hook maps the revision Playwright expects to the Chromium the image has
describe('Chromium shim of the session hook', () => {
	it('links the executables of the current layout (…-linux64)', () => {
		const installed = image([
			'chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell',
			'chromium-1243/chrome-linux64/chrome'
		]);
		const { status, headless, chrome } = run(installed);
		expect(status).toBe(0);
		expect(headless).toBe(realpathSync(`${installed}/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`));
		expect(chrome).toBe(realpathSync(`${installed}/chromium-1243/chrome-linux64/chrome`));
	});

	it('links the executables of the older layout (chrome-linux/)', () => {
		const installed = image(['chromium_headless_shell-1243/chrome-linux/headless_shell', 'chromium-1243/chrome-linux/chrome']);
		const { status, headless, chrome } = run(installed);
		expect(status).toBe(0);
		expect(headless).toBe(realpathSync(`${installed}/chromium_headless_shell-1243/chrome-linux/headless_shell`));
		expect(chrome).toBe(realpathSync(`${installed}/chromium-1243/chrome-linux/chrome`));
	});

	it('warns with the folder it searched and links nothing when no executable is there', () => {
		const installed = image(['chromium_headless_shell-1243/README', 'chromium-1243/README']);
		const { status, stdout, shim } = run(installed);
		expect(status).not.toBe(0);
		expect(stdout).toContain(`no Chromium found in ${installed}`);
		expect(existsSync(shim)).toBe(false);
	});
});
