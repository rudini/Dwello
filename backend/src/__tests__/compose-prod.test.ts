/**
 * A self-hosted install (docker-compose.prod.yml with the .env from .env.example) passes the mail settings
 * to the backend container; without them every e-mail to a tenant is filed as «zu versenden» (#568)
 */

import { describe, expect, it } from 'bun:test';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const root = join(import.meta.dir, '../../..');
const compose = readFileSync(join(root, 'docker-compose.prod.yml'), 'utf8');
const backendService = compose.slice(compose.indexOf('\n  backend:'), compose.indexOf('\n  postgres:'));
const envExample = readFileSync(join(root, '.env.example'), 'utf8');

// Every variable the mail module reads that .env.example documents (commented-out ones included)
const mailDir = join(import.meta.dir, '../mail');
const mailKeys = [
	...new Set(
		readdirSync(mailDir)
			.flatMap((file) => [...readFileSync(join(mailDir, file), 'utf8').matchAll(/env(?:\.|, ')([A-Z_]+)/g)])
			.map((match) => match[1])
	)
].filter((key) => new RegExp(`^#? ?${key}=`, 'm').test(envExample));

describe('Installation mit docker-compose.prod.yml', () => {
	it('kennt die Mail-Einstellungen aus .env.example', () => {
		expect(mailKeys).toEqual(expect.arrayContaining(['MAIL_TRANSPORT', 'MAIL_FROM', 'SMTP_HOST', 'RESEND_API_KEY']));
	});

	it('gibt dem Backend jede Mail-Einstellung aus der .env weiter', () => {
		const missing = mailKeys.filter((key) => !backendService.includes(`- ${key}=\${${key}`));
		expect(missing).toEqual([]);
	});
});
