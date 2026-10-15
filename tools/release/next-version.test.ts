import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SCRIPT = fileURLToPath(new URL('./next-version.mjs', import.meta.url));

/** The version the script names after `last` for these commit messages (as `git log --format=%B%x00` writes them) */
const next = (last: string, ...messages: string[]) =>
	execFileSync('node', [SCRIPT, last], { input: messages.join('\0'), encoding: 'utf8' }).trim();

describe('next-version', () => {
	it('erhöht bei einer Korrektur die Patch-Version', () => {
		expect(next('v0.4.2', 'fix(invoices): keep the date\n\nBody', 'Merge pull request #9 from a/b')).toBe('0.4.3');
	});

	it('erhöht bei einer neuen Funktion die Minor-Version', () => {
		expect(next('v0.4.2', 'fix(invoices): keep the date', 'feat(tenants): add a phone number')).toBe('0.5.0');
	});

	it('zählt einen Breaking Change vor 1.0 als neue Funktion', () => {
		expect(next('v0.4.2', 'fix(api)!: drop the old route')).toBe('0.5.0');
		expect(next('v0.4.2', 'chore(db): rename a column\n\nBREAKING CHANGE: the column is renamed')).toBe('0.5.0');
	});

	it('erhöht ab 1.0 bei einem Breaking Change die Major-Version', () => {
		expect(next('v1.2.3', 'feat(api)!: drop the old route')).toBe('2.0.0');
		expect(next('v1.2.3', 'fix(db): rename a column\n\nBREAKING CHANGE: the column is renamed')).toBe('2.0.0');
	});
});
