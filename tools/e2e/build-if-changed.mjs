// Builds the frontend for the E2E run (playwright.config.ts): `node tools/e2e/build-if-changed.mjs bun run build` runs
// the build on CI always, locally only when an input is newer than the last build this script ran (build/.e2e-built,
// dated to the build's start, so a file saved during the build counts as changed). `vite build` empties build/, so a
// build by the persona stack or by hand, possibly with another APP_VERSION, leaves no stamp and the next run builds.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const STAMP = 'build/.e2e-built';
// What `vite build` reads; the installed packages through package.json and bun.lock
const INPUTS = [
	'src',
	'messages',
	'static',
	'project.inlang',
	'svelte.config.js',
	'vite.config.ts',
	'tailwind.config.js',
	'postcss.config.js',
	'tsconfig.json',
	'package.json',
	'bun.lock'
];

// Unit tests are not part of the build
const files = INPUTS.filter((input) => existsSync(input))
	.flatMap((input) =>
		statSync(input).isDirectory() ? readdirSync(input, { recursive: true }).map((path) => join(input, path)) : [input]
	)
	.filter((path) => !path.split('/').includes('__tests__'));
const built = existsSync(STAMP) ? statSync(STAMP).mtimeMs : 0;

if (process.env.CI || files.some((file) => statSync(file).mtimeMs > built)) {
	const started = new Date();
	const [command, ...args] = process.argv.slice(2);
	execFileSync(command, args, { stdio: 'inherit' });
	writeFileSync(STAMP, '');
	utimesSync(STAMP, started, started);
} else {
	console.log('Frontend unverändert seit dem letzten E2E-Build: kein neuer Build');
}
