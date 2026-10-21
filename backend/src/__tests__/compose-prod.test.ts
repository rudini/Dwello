/**
 * A self-hosted install (docker-compose.prod.yml with the .env from .env.example) passes the mail settings
 * to the backend container; without them no e-mail reaches a tenant (#568)
 */

import { describe, expect, it } from 'bun:test';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const root = join(import.meta.dir, '../../..');
const compose = readFileSync(join(root, 'docker-compose.prod.yml'), 'utf8');
const backendService = compose.slice(compose.indexOf('\n  backend:'), compose.indexOf('\n  postgres:'));
const frontendService = compose.slice(compose.indexOf('\n  frontend:'), compose.indexOf('\n  backend:'));
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

	it('lässt den SMTP-Port ohne Angabe auf 587, nicht auf 0', () => {
		expect(backendService).toContain('- SMTP_PORT=${SMTP_PORT:-587}');
	});

	// #576: a copied .env signs in with a Konto mit Passwort; Google only when the Betreiber fills in its values, and
	// a placeholder client would show a Google button that cannot work and make ALLOWED_EMAILS required
	it('richtet in .env.example keinen Anbieter mit Platzhaltern ein', () => {
		expect(envExample).not.toMatch(/^OAUTH_(GOOGLE|MICROSOFT)_CLIENT_ID=./m);
	});

	// code review 576 C-3: without ORIGIN, adapter-node takes every request for https, refuses the sign-in form
	// sent over http (SvelteKit's origin check) and never shows the hint on an unencrypted connection
	it('nennt dem Frontend die Adresse, unter der Dwello geöffnet wird', () => {
		expect(frontendService).toContain('- ORIGIN=${PUBLIC_APP_URL:-http://localhost:3000}');
	});
});
