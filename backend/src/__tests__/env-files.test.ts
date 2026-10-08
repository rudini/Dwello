/**
 * The backend reads the shared configuration in the project root (.env, .env.local) like the frontend,
 * so both use the same JWT_SECRET; backend/.env and backend/.env.local can override it
 */

import { afterAll, describe, expect, it } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import packageJson from '../../package.json';

const project = mkdtempSync(join(tmpdir(), 'dwello-env-'));
const backend = join(project, 'backend');
mkdirSync(backend);
writeFileSync(join(project, '.env'), 'JWT_SECRET=root-secret\nDATABASE_URL=root-db\n');
writeFileSync(join(backend, '.env'), 'DATABASE_URL=backend-db\n');

afterAll(() => rmSync(project, { recursive: true, force: true }));

// What a bun command of the script sees, started in backend/ without these variables in the shell
function environmentOf(command: string) {
	const flags = command.match(/--env-file=\S+/g) ?? [];
	const env = { ...process.env, JWT_SECRET: undefined, DATABASE_URL: undefined };
	const read = 'console.log(JSON.stringify([process.env.JWT_SECRET, process.env.DATABASE_URL]))';
	const result = Bun.spawnSync(['bun', ...flags, '-e', read], { cwd: backend, env });
	return JSON.parse(result.stdout.toString());
}

describe('Konfiguration des Backends', () => {
	for (const script of ['dev', 'db:migrate', 'db:reset', 'db:demo'] as const) {
		it(`"bun run ${script}" liest die gemeinsame .env des Projekts`, () => {
			for (const command of packageJson.scripts[script].split('&&')) {
				expect(environmentOf(command)).toEqual(['root-secret', 'backend-db']);
			}
		});
	}
});
