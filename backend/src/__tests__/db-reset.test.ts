/**
 * bun run db:reset drops and recreates the development database; it never touches a database on another machine
 */

import { describe, expect, it } from 'bun:test';
import { join } from 'path';

const script = join(import.meta.dir, '..', '..', 'scripts', 'db-reset.ts');

describe('Datenbank neu aufsetzen', () => {
	it('lehnt eine Datenbank auf einem anderen Rechner ab, bevor es sie anspricht', () => {
		const run = Bun.spawnSync(['bun', script], {
			env: { ...process.env, DATABASE_URL: 'postgresql://dwello:secret@db.example.com:5432/dwello' }
		});

		expect(run.exitCode).toBe(1);
		expect(run.stderr.toString()).toContain('db.example.com ist nicht dieser Rechner');
	});
});
