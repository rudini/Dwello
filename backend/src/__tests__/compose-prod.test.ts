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
const postgresService = compose.slice(compose.indexOf('\n  postgres:'), compose.indexOf('\n  ollama:'));
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
	// #577: a fresh installation starts without a .env to fill in; the keys come from the volume init-secrets.sh fills
	it('erzeugt die Schlüssel vor dem Start, statt sie in der .env zu verlangen', () => {
		const secretsService = compose.slice(compose.indexOf('\n  secrets:'), compose.indexOf('\n  frontend:'));
		expect(secretsService).toContain('docker/init-secrets.sh');
		for (const service of [frontendService, backendService, postgresService])
			expect(service).toContain('condition: service_completed_successfully');
		expect(compose).not.toMatch(/JWT_SECRET=\$\{JWT_SECRET\}/);
		expect(postgresService).toContain('POSTGRES_PASSWORD_FILE: /run/dwello/db_password');
		expect(frontendService).toContain('cat /run/dwello/jwt_secret');
		expect(backendService).toContain('cat /run/dwello/db_password');
		expect(backendService).toContain('cat /run/dwello/encryption_key');
	});

	it('verlangt in .env.example keinen Wert mehr', () => {
		expect(envExample).not.toMatch(/^(JWT_SECRET|POSTGRES_PASSWORD|ALLOWED_EMAILS)=/m);
	});

	it('nennt dem Frontend die Adresse, unter der Dwello geöffnet wird', () => {
		expect(frontendService).toContain('- ORIGIN=${PUBLIC_APP_URL:-http://localhost:3000}');
	});
});

// #580: ohne LLM_* in der .env wählt der Liegenschaftsverwalter die KI im Browser; ein Standardwert in der Compose-Datei
// würde sie für jede Installation als «vom Betreiber festgelegt» sperren
describe('KI einer Installation mit docker-compose.prod.yml', () => {
	const llmLines = backendService.split('\n').filter((line) => /- LLM_(?!LOCAL_URL)/.test(line));

	it('setzt keine LLM_*-Variable, die der Betreiber nicht in die .env schreibt', () => {
		expect(llmLines.length).toBeGreaterThan(0);
		expect(llmLines.filter((line) => !/=\$\{(LLM_[A-Z_]+):-\}$/.test(line.trim()))).toEqual([]);
	});

	it('findet die lokale KI im Container ollama', () => {
		expect(backendService).toContain('- LLM_LOCAL_URL=http://ollama:11434/v1');
	});
});

// The demo (deploy/demo) adds to docker-compose.prod.yml; since #577 Postgres reads its password from the key volume
describe('Demo mit deploy/demo/docker-compose.yml', () => {
	const demo = readFileSync(join(root, 'deploy/demo/docker-compose.yml'), 'utf8');
	const service = (name: string) => demo.slice(demo.indexOf(`\n  ${name}:`) + 1).split(/\n {2}\w/)[0];

	it('gibt Postgres kein POSTGRES_PASSWORD neben der Passwort-Datei, sonst startet die Datenbank nicht', () => {
		expect(service('postgres')).not.toContain('POSTGRES_PASSWORD');
		expect(service('secrets')).toContain('POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?');
	});

	// the backend's own command sets DATABASE_URL from the key volume; «compose run … sh -c» replaces that command
	it('gibt dem nächtlichen Reset die Datenbank aus der Passwort-Datei', () => {
		const reset = readFileSync(join(root, 'deploy/demo/reset-demo.sh'), 'utf8');
		expect(reset).toContain('export DATABASE_URL=postgresql://dwello:$(cat /run/dwello/db_password)@postgres:5432/dwello');
	});
});
