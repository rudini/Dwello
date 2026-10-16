import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeEach, describe, expect, it } from 'vitest';

const SCRIPT = fileURLToPath(new URL('./build-if-changed.mjs', import.meta.url));
// Stands in for `bun run build`: empties build/ like `vite build` and counts the builds
const BUILD = `const fs = require('fs'); fs.rmSync('build', { recursive: true, force: true }); fs.mkdirSync('build'); fs.appendFileSync('builds', 'x')`;

let root: string;

/** Runs the script in `root` and answers how many builds have run there so far */
function run(env: NodeJS.ProcessEnv = {}) {
	execFileSync('node', [SCRIPT, 'node', '-e', BUILD], { cwd: root, env: { ...process.env, CI: '', ...env } });
	return readFileSync(join(root, 'builds'), 'utf8').length;
}

beforeEach(() => {
	root = mkdtempSync(join(tmpdir(), 'build-if-changed-'));
	mkdirSync(join(root, 'src/routes'), { recursive: true });
	writeFileSync(join(root, 'src/routes/+page.svelte'), '<h1>Gebäude</h1>');
});

describe('build-if-changed', () => {
	it('baut beim ersten Lauf', () => {
		expect(run()).toBe(1);
	});

	it('baut nicht neu, wenn sich nichts geändert hat', () => {
		run();
		expect(run()).toBe(1);
	});

	it('baut neu, wenn eine Datei geändert wurde', () => {
		run();
		writeFileSync(join(root, 'src/routes/+page.svelte'), '<h1>Gebäude und Wohnungen</h1>');
		expect(run()).toBe(2);
	});

	it('baut neu, wenn eine Datei gelöscht wurde', () => {
		writeFileSync(join(root, 'src/routes/+layout.svelte'), '<slot />');
		run();
		rmSync(join(root, 'src/routes/+layout.svelte'));
		expect(run()).toBe(2);
	});

	it('baut neu, wenn sich ein Text oder die Konfiguration geändert hat', () => {
		mkdirSync(join(root, 'messages'));
		run();
		writeFileSync(join(root, 'messages/de.json'), '{}');
		expect(run()).toBe(2);
		writeFileSync(join(root, 'svelte.config.js'), 'export default {};');
		expect(run()).toBe(3);
	});

	it('baut nicht neu, wenn nur ein Unit-Test dazukam', () => {
		mkdirSync(join(root, 'src/__tests__'));
		run();
		writeFileSync(join(root, 'src/__tests__/buildings.test.ts'), '');
		expect(run()).toBe(1);
	});

	it('baut auf CI immer', () => {
		run();
		expect(run({ CI: 'true' })).toBe(2);
	});
});
