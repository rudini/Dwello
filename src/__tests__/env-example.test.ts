import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// #650: an operator who sets a variable from .env.example expects an effect, so each one it sets must be read
// by the app, its scripts or the compose and Docker files (commented-out ones document future or optional settings)
const readers = [
	'src',
	'backend/src',
	'backend/scripts',
	'scripts',
	'tools/release',
	'docker-compose*.yml',
	'*Dockerfile',
	'*.config.*'
];
const isRead = (name: string) => {
	try {
		// a read, not a mention: env.X, env['X'], ${X} or $X (compose, shell), ARG or ENV X (Dockerfile)
		const read = `(env\\.|env\\[['"]|\\$\\{?|(ARG|ENV) )${name}\\b`;
		execFileSync('git', ['grep', '-qE', read, '--', ...readers, ':!**/__tests__/**']);
		return true;
	} catch {
		return false;
	}
};

describe('.env.example', () => {
	it('setzt nur Variablen, die etwas liest', () => {
		const set = [...readFileSync('.env.example', 'utf8').matchAll(/^([A-Z][A-Z0-9_]*)=/gm)].map(
			([, name]) => name
		);

		expect(set.length).toBeGreaterThan(0);
		expect(set.filter((name) => !isRead(name))).toEqual([]);
	});
});
