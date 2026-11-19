import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import OverviewPage from '../routes/config/+page.svelte';
import { actions, load } from '../routes/config/+page.server';
import { runAction } from './helpers/action';
import config from '../../tests/contracts/config.json';
import accountHolderMissing from '../../tests/contracts/config-account-holder-missing.json';
import creditorMissing from '../../tests/contracts/config-creditor-missing.json';
import updateChecks from '../../tests/contracts/update-checks.json';

const API = 'http://localhost:3001/api/v1';

// #1456: the overview «Einstellungen»; the form is on «Absender und Konto» (settings.test.ts)
const loadWith = (stored: object, update: object = { checks: false }) =>
	load({
		fetch: (async (url: string) =>
			Response.json(
				url === `${API}/config` ? stored : url === `${API}/update` ? update : {}
			)) as typeof globalThis.fetch
	} as never) as Promise<{ missing: unknown; updateCheck: unknown }>;

describe('Übersicht der Einstellungen laden', () => {
	it('meldet nichts Fehlendes, wenn die gespeicherte IBAN alles hat', async () => {
		expect((await loadWith(config)).missing).toEqual({ company: false, holder: false });
	});

	it('meldet die Firmenadresse, die der gespeicherten IBAN fehlt', async () => {
		expect((await loadWith(creditorMissing)).missing).toEqual({ company: true, holder: false });
	});

	it('meldet den unvollständigen Kontoinhaber der gespeicherten IBAN', async () => {
		const stored = { ...config, creditorMissing: accountHolderMissing.causes };
		expect((await loadWith(stored)).missing).toEqual({ company: false, holder: true });
	});

	it('meldet beides, wenn Firmenadresse und Kontoinhaber unvollständig sind', async () => {
		const stored = {
			...config,
			creditorMissing: [...creditorMissing.creditorMissing, ...accountHolderMissing.causes]
		};
		expect((await loadWith(stored)).missing).toEqual({ company: true, holder: true });
	});

	// #1453: only where this installation may search for new versions
	it('bietet den Schalter für die Suche nach neuen Versionen nur an, wo Dwello suchen darf', async () => {
		expect((await loadWith(config)).updateCheck).toBeNull();
		expect((await loadWith(config, updateChecks)).updateCheck).toBe(true);
		const off = { ...config, data: { ...config.data, update_check: 'off' } };
		expect((await loadWith(off, updateChecks)).updateCheck).toBe(false);
	});
});

describe('Suche nach neuen Versionen umschalten', () => {
	it('speichert nur die ausgeschaltete Suche und sagt, was jetzt gilt', async () => {
		const { calls, result } = runAction(actions.updateCheck, '');
		expect(await result).toEqual({ updateCheck: false });
		expect(calls).toEqual([{ method: 'PUT', url: `${API}/config`, body: { update_check: 'off' } }]);
	});

	it('speichert die eingeschaltete Suche', async () => {
		const { calls, result } = runAction(actions.updateCheck, '', 200, { updateCheck: 'on' });
		expect(await result).toEqual({ updateCheck: true });
		expect(calls[0].body).toEqual({ update_check: 'on' });
	});

	it('meldet, wenn das Backend die Änderung nicht speichert', async () => {
		const { result } = runAction(actions.updateCheck, '', 500, { updateCheck: 'on' });
		expect(await result).toMatchObject({
			status: 502,
			data: { error: 'Die Einstellungen konnten nicht gespeichert werden.' }
		});
	});
});

const overview = (data: object = {}, form: object | null = null) =>
	render(OverviewPage, {
		props: {
			data: {
				missing: { company: false, holder: false },
				backup: 'off',
				updateCheck: null,
				...data
			},
			form
		} as never
	}).body;

describe('Übersicht der Einstellungen', () => {
	it('führt zu den Stammdaten unter den Namen der Hauptnavigation', () => {
		const body = overview();

		for (const [href, label] of [
			['/config/categories', 'Kategorien'],
			['/config/distribution-keys', 'Verteilschlüssel'],
			['/config/heating-profiles', 'Heizprofile']
		]) {
			expect(body).toMatch(new RegExp(`<a href="${href}"[^>]*>${label}</a>`));
		}
	});

	it('ordnet die Gruppen «Ihre Angaben», «Abrechnung», «Daten und Sicherheit» mit dem Export am Schluss', () => {
		const body = overview({ backup: 'ok', updateCheck: true });

		const places = [
			'>Ihre Angaben</h2>',
			'href="/config/sender"',
			'>Abrechnung</h2>',
			'href="/config/categories"',
			'>Daten und Sicherheit</h2>',
			'href="/config/ki"',
			'href="/config/backup"',
			'href="/config/access-keys"',
			'href="/config/audit-log"',
			'name="updateCheck"',
			'action="/config/export"'
		].map((part) => body.indexOf(part));
		expect(places).not.toContain(-1);
		expect(places).toEqual([...places].sort((a, b) => a - b));
	});

	it('zeigt die Sicherung und den Schalter nur, wo es sie gibt, und kein Feld des Formulars', () => {
		const body = overview();

		expect(body).toContain('href="/config/sender"');
		expect(body).not.toContain('href="/config/backup"');
		expect(body).not.toContain('name="updateCheck"');
		expect(body).not.toContain('name="iban"');
	});

	it('sagt beim Link zu «Absender und Konto» beide Sätze, wenn Firmenadresse und Kontoinhaber unvollständig sind', () => {
		const body = overview({ missing: { company: true, holder: true } });

		const company = body.indexOf('Es fehlen Angaben zur Firmenadresse.');
		expect(company).toBeGreaterThan(body.indexOf('href="/config/sender"'));
		expect(body.indexOf('Es fehlen Angaben zum Kontoinhaber.')).toBeGreaterThan(company);
	});

	it('sagt ohne fehlende Angaben nichts beim Link zu «Absender und Konto»', () => {
		expect(overview()).toContain('href="/config/sender"');
		expect(overview()).not.toContain('Es fehlen');
	});

	it('bestätigt die ausgeschaltete und die eingeschaltete Suche nach neuen Versionen', () => {
		expect(overview({ updateCheck: false }, { updateCheck: false })).toContain(
			'Gespeichert. Dwello sucht nicht mehr nach neuen Versionen.'
		);
		expect(overview({ updateCheck: true }, { updateCheck: true })).toContain(
			'Gespeichert. Dwello sucht täglich nach neuen Versionen.'
		);
		expect(overview({ updateCheck: true })).not.toContain('Gespeichert.');
	});
});
